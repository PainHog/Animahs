/**
 * The GM client reacts to documents (the Heisty Spideys design, §1): a player's roll or
 * shift posts a chat card with structured flags; the active GM's client sees it and
 * applies its outcome to the mission state (progress, Scent, Edges, the Clash) and to the
 * actors (Hurt, Netted, Taken, Down and Netted at scene end), each automation switchable.
 * With an automation off, the outcome is kept as a suggestion: one click applies it.
 *
 * Pending rolls (a Fail or Partial that could still be Pushed) are applied when they
 * become final: Accept, a reaction, the next roll anyone makes, End Round, the next obstacle.
 */
import { SYSTEM_ID, FLAG, CARD, SETTINGS } from "../contracts.mjs";
import { THREATS, HURT_AFTER_DOWN, GROWTH_MAX } from "../config.mjs";
import * as M from "../logic/mission.mjs";
import { makeThreat } from "../logic/clash.mjs";
import { getState, mutate, isWriter, queued } from "./store.mjs";
import { autoSettings } from "../settings.mjs";
import { partyRoster, applyHurt, prepareUpdate, postNotice } from "../actors/actor-ops.mjs";

const L = (k, d) => (d ? game.i18n.format(k, d) : game.i18n.localize(k));
const cardOf = m => m?.flags?.[FLAG]?.card ?? null;

/* ------------------------------------------------------------------ hooks */

export function registerAutomation() {
  Hooks.on("createChatMessage", message => onMessage(message, "create"));
  Hooks.on("updateChatMessage", message => onMessage(message, "update"));
  Hooks.on("updateActor", (actor, diff, options) => onActor(actor, diff, options));
}

function onMessage(message, how) {
  if (!isWriter()) return;
  const card = cardOf(message);
  if (!card) return;
  if (card.kind === CARD.roll) return mutate(S => processRoll(S, message.id, how));
  if (card.kind === CARD.shift && how === "create") return mutate(S => processShift(S, message));
  return null;
}

function onActor(actor, diff, options) {
  if (!isWriter() || actor.type !== "bonded") return;
  const S = getState();
  if (!M.isRunning(S) || !S.party.some(p => p.id === actor.id)) return;
  if (!diff?.system) return;
  mutate(state => settleAll(state));
}

/* ------------------------------------------------------------------ rolls */

/** The reducer's view of a roll card. */
export function reducerCard(card, messageId) {
  return {
    messageId, actorId: card.actorId, result: card.result, context: card.context, missionId: card.missionId,
    obstacleUid: card.obstacleUid, clashId: card.clashId, action: card.action, threatId: card.threatId,
    huntUp: !!card.huntUp, coiled: !!card.coiled, distracted: !!card.distracted, sweep: !!card.sweep,
    form: card.form, animal: card.animal,
  };
}

async function processRoll(S, messageId, how) {
  const message = game.messages.get(messageId);
  const card = cardOf(message);
  if (!card || card.missionId !== S.id || !M.isRunning(S)) return S;
  if (how === "create") S = await finalizePending(S, { except: messageId });
  if (!card.final) return S;
  return applyCard(S, message);
}

/** Apply one final roll card (idempotent: the reducer remembers what it applied). */
async function applyCard(S, message, force = []) {
  const card = cardOf(message);
  const auto = autoSettings();
  const clashBefore = S.clash;
  const r = M.applyRoll(S, reducerCard(card, message.id), { auto: { progress: auto.progress, scent: auto.scent }, force });
  S = r.state;
  if (S.rolls[message.id]) S.rolls[message.id].skipped = r.skipped.filter(p => !(S.rolls[message.id].parts ?? []).includes(p));
  S = await runEffects(S, r.effects, auto);
  if (clashBefore) {
    // threats still standing when a Clash ends pull back
    await syncThreatTokens(S.clash ?? { threats: clashBefore.threats.map(t => ({ ...t, out: true })) });
  }
  return S;
}

/**
 * Make every pending roll card of this mission final (the next roll was made, or the round
 * or scene is ending) and apply them, oldest first.
 */
async function finalizePending(S, { except = null } = {}) {
  const pending = game.messages.filter(m => {
    const c = cardOf(m);
    return c?.kind === CARD.roll && !c.final && c.missionId === S.id && m.id !== except;
  });
  for (const m of pending) {
    await m.update({ [`flags.${FLAG}.card.final`]: true });
    S = await applyCard(S, game.messages.get(m.id) ?? m);
  }
  return S;
}

/* ------------------------------------------------------------------ shifts */

async function processShift(S, message) {
  const card = cardOf(message);
  if (!M.isRunning(S) || card.missionId !== S.id) return S;
  const r = M.recordShift(S, { actorId: card.actorId, eventId: message.id, toForm: card.to }, { auto: { scent: autoSettings().scent } });
  return runEffects(r.state, r.effects, autoSettings());
}

/* ------------------------------------------------------------------ effects */

const allowed = (e, auto) => {
  if (e.part === "always") return true;
  if (e.part === "growth") return auto.growth !== false;
  return auto[e.part] !== false;
};
const sameEffect = (a, b) => a.type === b.type && a.actorId === b.actorId && a.source === b.source;

/** Apply the reducer's effects (or keep them as suggestions), then settle the mission. */
export async function runEffects(S, effects, auto = autoSettings()) {
  for (const e of effects ?? []) {
    if (!allowed(e, auto)) { suggest(S, e); continue; }
    S = await applyEffect(S, e);
  }
  return settleAll(S, auto);
}

function suggest(S, e) {
  if (!S.suggested.some(s => s.kind === "effect" && sameEffect(s.effect, e))) S.suggested.push({ kind: "effect", effect: e });
}

/** Bring the mission in line with the actors (repeat until nothing more happens). */
export async function settleAll(S, auto = autoSettings()) {
  for (let i = 0; i < 8; i++) {
    const r = M.settle(S, partyRoster(S), { auto: { scent: auto.scent } });
    S = r.state;
    const todo = r.effects.filter(e => allowed(e, auto));
    for (const e of r.effects) if (!allowed(e, auto)) suggest(S, e);
    if (!todo.length) break;
    for (const e of todo) S = await applyEffect(S, e);
  }
  return S;
}

/** One effect on one actor (or a Clash to start). Returns the state. */
async function applyEffect(S, e) {
  if (e.type === "clash") return startClashFromGuards(S, e);
  const actor = game.actors.get(e.actorId);
  if (!actor || actor.type !== "bonded") return S;
  const st = actor.system.status;
  switch (e.type) {
    case "prepare": await actor.update(prepareUpdate(actor)); break;
    case "hurt": await applyHurt(actor, e.amount, { cause: e.cause }); break;
    case "net":
      if (!st.netted && !st.taken) { await actor.update({ "system.status.netted": true }); await postNotice("MG.Notice.netted", { name: actor.name }, { actor }); }
      break;
    case "take":
      if (!st.taken) {
        await actor.update({ "system.status.taken": true, "system.status.exposed": true, "system.status.down": false, "system.status.netted": false });
        await postNotice("MG.Notice.taken", { name: actor.name }, { actor });
      }
      break;
    case "recover":
      if (st.down) { await actor.update({ "system.status.down": false, "system.hurt.value": HURT_AFTER_DOWN }); await postNotice("MG.Notice.backUp", { name: actor.name }, { actor }); }
      break;
    case "free":
      if (st.netted) { await actor.update({ "system.status.netted": false }); await postNotice("MG.Notice.freedSceneEnd", { name: actor.name }, { actor }); }
      break;
    case "expose": if (!st.exposed) await actor.update({ "system.status.exposed": true }); break;
    case "growth": await actor.update({ "system.growth.value": Math.min(GROWTH_MAX, actor.system.growth.value + 1) }); break;
    case "unstick": if (st.stuck) await actor.update({ "system.status.stuck": false }); break;
  }
  return S;
}

/* ------------------------------------------------------------------ Clashes */

/**
 * The threats for a list of guard keys: numbers from a world threat actor of that kind
 * if there is one (imported from the compendium if not), tokens on the scene when there is
 * a scene to put them on, otherwise tracker entries only.
 */
export async function buildThreats(keys, where = null) {
  const out = [];
  const waiting = waitingGuards(where);
  for (const [i, key] of keys.entries()) {
    // a guard already standing on the mission's scene (the Starter adventure places them hidden)
    const j = waiting.findIndex(t => t.actor?.system?.kind === key);
    const pre = j >= 0 ? waiting.splice(j, 1)[0] : null;
    const actor = pre?.actor ?? await threatActor(key);
    const sys = actor?.system;
    const t = makeThreat(key, i, {
      name: actor?.name ?? THREATS[key]?.name,
      diff: sys?.difficulty ?? undefined, tough: sys?.toughness ?? undefined, harm: sys?.harm ?? undefined,
      actorUuid: actor?.uuid ?? null,
    });
    t.id = `${key}-${i + 1}-${foundry.utils.randomID(4)}`;
    t.tokenUuid = pre ? await revealToken(pre) : await placeToken(actor, i);
    out.push(t);
  }
  return out;
}

/** The viewed scene's tokens waiting for this obstacle's Clash: flags.morphgame.guard = { mission, obstacle }. */
function waitingGuards(where) {
  if (!where || !globalThis.canvas?.ready || !canvas.scene || !game.user.isGM) return [];
  return [...(canvas.scene.tokens ?? [])].filter(t => {
    const g = t.flags?.[SYSTEM_ID]?.guard;
    return g && g.mission === where.mission && g.obstacle === where.obstacle;
  });
}

async function revealToken(token) {
  try { if (token.hidden) await token.update({ hidden: false }); } catch (err) { console.warn(err); }
  return token.uuid ?? null;
}

async function threatActor(key) {
  let actor = game.actors.find(a => a.type === "threat" && a.system.kind === key);
  if (actor) return actor;
  try {
    const pack = game.packs.get(`${SYSTEM_ID}.threats`);
    if (!pack) return null;
    const index = await pack.getIndex();
    const entry = index.find(e => e.name === THREATS[key]?.name);
    if (entry) actor = await game.actors.importFromCompendium(pack, entry._id);
  } catch (err) { console.warn(err); }
  return actor ?? null;
}

async function placeToken(actor, i) {
  try {
    if (!actor || !globalThis.canvas?.ready || !canvas.scene || !game.user.isGM) return null;
    const grid = canvas.grid?.size ?? 100;
    const center = canvas.stage?.pivot ?? { x: 1000, y: 1000 };
    const td = await actor.getTokenDocument({ x: Math.round(center.x + (i - 1) * grid), y: Math.round(center.y - grid), actorLink: false });
    const [made] = await canvas.scene.createEmbeddedDocuments("Token", [td.toObject()]);
    return made?.uuid ?? null;
  } catch (err) { console.warn(err); return null; }
}

/** Keep threat tokens in step with the Clash: harm taken on the token, hidden once out. */
export async function syncThreatTokens(clash) {
  for (const t of clash?.threats ?? []) {
    if (!t.tokenUuid) continue;
    try {
      const token = await fromUuid(t.tokenUuid);
      if (!token) continue;
      await token.actor?.update?.({ "system.harmTaken": t.harmTaken });
      if (t.out && !token.hidden) await token.update({ hidden: true });
    } catch (err) { console.warn(err); }
  }
}

async function startClashFromGuards(S, e) {
  if (S.clash || !M.isRunning(S)) return S;
  const ob = [...(S.obstacles ?? []), ...(S.ways ?? []).flat()].find(o => o.uid === e.obstacleUid);
  const threats = await buildThreats(e.guards ?? [], ob ? { mission: S.catalogKey, obstacle: ob.id } : null);
  const r = M.startClash(S, { id: foundry.utils.randomID(8), obstacleUid: e.obstacleUid, threats, auto: { scent: autoSettings().scent } }, partyRoster(S));
  await postNotice("MG.Notice.clash", { threats: threats.map(t => t.name).join(", ") }, {
    lines: game.settings.get(SYSTEM_ID, SETTINGS.rulesReminders) ? [L("MG.Notice.clashReminder")] : [],
  });
  return r.state;
}

/* ------------------------------------------------------------------ the Storyteller's buttons */

/** Run a reducer on the active GM, then its effects. */
export function act(reducer, ...args) {
  return mutate(async S => {
    const r = reducer(S, ...args);
    return runEffects(r.state, r.effects ?? []);
  });
}

/** End the round: finalize pending rolls; in a Clash, unattended threats strike their targets. */
export function endRound(targets = {}) {
  return mutate(async S => {
    S = await finalizePending(S);
    if (S.clash) {
      const r = M.endClashRound(S, targets, partyRoster(S), { auto: { scent: autoSettings().scent } });
      S = await runEffects(r.state, r.effects);
      await syncThreatTokens(S.clash);
      return S;
    }
    const r = M.endRound(S, partyRoster(S), { auto: { scent: autoSettings().scent } });
    return runEffects(r.state, r.effects);
  });
}

/** Finalize pending rolls, then run a reducer that moves the mission on. */
export function advance(reducer, ...args) {
  return mutate(async S => {
    S = await finalizePending(S);
    const r = reducer(S, partyRoster(S), { auto: { scent: autoSettings().scent } }, ...args);
    return runEffects(r.state, r.effects ?? []);
  });
}

/** Start a Clash by choice (§6: "you can also choose to start the Clash"), or a free one. */
export function startClash(keys = null) {
  return mutate(async S => {
    S = await finalizePending(S);
    const ob = M.currentObstacle(S);
    const guards = keys ?? (M.obstacleView(S)?.guardsActive ? ob.guards : []);
    if (!guards.length) return S;
    return runEffects(S, [{ type: "clash", obstacleUid: ob?.uid ?? null, guards, part: "always", source: "manual" }]);
  });
}

/** End the Clash now (the Storyteller's call), e.g. when everyone left it. */
export function endClash() {
  return mutate(async S => {
    S = await finalizePending(S);
    const r = M.endClash(S, partyRoster(S), { auto: { scent: autoSettings().scent } });
    return runEffects(r.state, r.effects);
  });
}

/** Apply every suggestion that came from one roll card (the card's GM "Apply" button). */
export function applySuggestionsFor(messageId) {
  return mutate(async S => {
    const message = game.messages.get(messageId);
    const rec = S.rolls[messageId];
    if (message && rec?.skipped?.length) S = await applyCard(S, message, rec.skipped);
    const mine = S.suggested.filter(s => s.kind === "effect" && s.effect.source === messageId);
    S.suggested = S.suggested.filter(s => !mine.includes(s));
    for (const s of mine) S = await applyEffect(S, s.effect);
    return settleAll(S);
  });
}

/** Apply (or dismiss) one suggestion from the tracker. */
export function resolveSuggestion(index, accept) {
  return mutate(async S => {
    const s = S.suggested[index];
    if (!s) return S;
    if (s.kind === "scent") return M.resolveSuggestion(S, index, accept, {}).state;
    S.suggested.splice(index, 1);
    if (accept) S = await applyEffect(S, s.effect);
    return settleAll(S);
  });
}

/** Start a mission: the party gets ready (Wild, no Hurt, human form). */
export function startMission(opts) {
  return mutate(async S => {
    const r = M.startMission(S, opts);
    const out = await runEffects(r.state, r.effects);
    await postNotice("MG.Notice.missionStart", { name: out.name, limit: out.limit, edges: out.edges }, {
      lines: out.scent ? [L("MG.Notice.exposedStart")] : [],
    });
    return out;
  });
}

/** Wrap a finished mission up (Hunt track, Growth) and post the result. */
export function finishMission() {
  return mutate(async S => {
    const r = M.finishMission(S, partyRoster(S));
    const out = await runEffects(r.state, r.effects);
    if (out.finished) {
      await postNotice("MG.Notice.result", { name: out.name, result: L(`MG.MissionResult.${out.result}`), track: out.campaign.huntTrack }, {
        lines: [L(`MG.Notice.resultHint.${out.result}`)],
      });
    }
    return out;
  });
}

/** Re-apply the GM's view on ready: apply any final roll cards of this mission not yet applied. */
export function reconcile() {
  if (!isWriter()) return Promise.resolve();
  return mutate(async S => {
    if (!M.isRunning(S)) return S;
    for (const m of game.messages) {
      const c = cardOf(m);
      if (c?.kind === CARD.roll && c.final && c.missionId === S.id && !S.rolls[m.id]) S = await applyCard(S, m);
    }
    return settleAll(S);
  });
}

export { queued };
