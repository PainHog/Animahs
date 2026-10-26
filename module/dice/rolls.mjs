/**
 * Rolling (§1) in Foundry: pay for Help and Edges, roll the pool with Foundry's Roll
 * ("Nd6", so Dice So Nice and friends animate it), post a roll card, and the card's
 * reactions — Push (§4: 1 Wild, once per roll, rerolls every miss), Cheetah's Burst (a free
 * Push on Move), Red Fox's Wily (a Fail becomes a Partial), Hippopotamus' Charge (a Force
 * Success counts as a Critical), Moose's Antler Sweep (a Beater or Hound is out) — and
 * Accept. A Fail or Partial that could still be changed stays pending until the roller
 * accepts it, uses a reaction, or the next roll is made; then the GM's automation applies it.
 */
import { SYSTEM_ID, FLAG, CARD, OPS, SETTINGS, HOOKS, TEMPLATES, SYSTEM_PATH } from "../contracts.mjs";
import { APPROACH_INFO, TAG_INFO, ANIMALS, PERKS, FRAMES, RESULT_LABELS, CLASH_ACTIONS, THREATS } from "../config.mjs";
import { resolveFaces, pushIndices, applyPush } from "../logic/dice.mjs";
import { usedThisScene, markUsed } from "../logic/usage.mjs";
import { missionClock, isRunning, obstacleView, spendEdges as spendEdgesReducer, setCarrier } from "../logic/mission.mjs";
import { threatById } from "../logic/clash.mjs";
import { canHelp, buildRollPlan } from "../logic/roll-plan.mjs";
import { getState, mutate } from "../mission/store.mjs";
import { runOp, registerOp, owns } from "../net/gm-ops.mjs";
import { planFor, planInput, inParty, packFree } from "./roll-context.mjs";
import { cantAct } from "../actors/actor-ops.mjs";

const L = (k, d) => (d ? game.i18n.format(k, d) : game.i18n.localize(k));
const setting = key => game.settings.get(SYSTEM_ID, key);
export const cardOf = message => message?.flags?.[FLAG]?.card ?? null;

/* ------------------------------------------------------------------ rolling */

/**
 * Make a roll from the dialog's choices. Pays Edges and Help first (only what fits under
 * the Cap), then rolls and posts the card. Returns the chat message, or null.
 */
export async function performRoll(actor, choices) {
  const why = cantAct(actor);
  if (why) { ui.notifications.warn(L(`MG.Reason.${why}`)); return null; }
  let state = getState();
  const plan = planFor(actor, choices, state);
  if (!plan.canRoll) { ui.notifications.warn(L(`MG.Reason.${plan.reason}`)); return null; }
  const autoWild = setting(SETTINGS.autoWild);
  // Edges (the team's): spent through the GM. Only what fits under the Cap is spent.
  let edges = 0;
  if (plan.edgesUsed > 0) {
    const r = await runOp(OPS.spendEdges, { actorId: actor.id, n: plan.edgesUsed });
    edges = r.ok ? plan.edgesUsed : 0;
  }
  // Help: each friend pays 1 Wild (or Coyote's Pack), through the GM. "Free" was decided
  // before the Pack was stamped, so keep the plan's flags.
  let helpers = [];
  if (plan.helpersUsed.length) {
    if (autoWild) {
      const r = await runOp(OPS.payHelp, { rollerId: actor.id, helpers: plan.helpersUsed.map(h => h.id), approach: choices.approach, tags: choices.tags ?? [] });
      const paid = r.ok ? r.result.paid : [];
      helpers = plan.helpersUsed.filter(h => paid.includes(h.id));
    } else helpers = plan.helpersUsed;
  }
  state = getState();
  const input = planInput(actor, { ...choices, helpers: [] }, state);
  const final = buildRollPlan({ ...input, edges, helpers });
  return rollAndPost(actor, { ...choices, edges, helpers: helpers.map(h => h.id) }, final, { state, autoWild, input });
}

/** Roll the plan's pool and post the card. */
async function rollAndPost(actor, choices, plan, { state, autoWild, input }) {
  const roll = await new Roll(`${plan.pool}d6`).evaluate();
  const faces = roll.dice[0].results.map(r => r.result);
  const res = resolveFaces(faces, plan.difficulty);
  const running = inParty(state, actor);
  const ob = running && choices.context === "obstacle" ? obstacleView(state) : null;
  const threat = running && choices.context === "clash" ? threatById(state.clash, choices.threatId) : null;
  const s = actor.system;
  const card = {
    v: 1, kind: CARD.roll,
    actorId: actor.id, actorUuid: actor.uuid, userId: game.user.id,
    missionId: running ? state.id : null, sceneSerial: state.sceneSerial,
    context: running ? choices.context : "free",
    obstacleUid: ob?.uid ?? null, obstacleName: ob?.name ?? "",
    clashId: threat ? state.clash.id : null, action: threat ? choices.action : null,
    threatId: threat?.id ?? null, threatKey: threat?.key ?? null, threatName: threat?.name ?? "",
    approach: choices.approach, form: s.form, animal: s.animal,
    gnaw: !!plan.opt?.gnaw, beak: s.form === "animal" && choices.approach === "wits",
    tags: [...(choices.tags ?? [])],
    rating: plan.rating, baseDifficulty: plan.baseDifficulty, trail: !!plan.trail,
    difficulty: plan.difficulty, pool: plan.pool,
    mods: plan.mods.map(m => ({ key: m.key, source: m.source, effect: m.effect, detail: m.detail ?? null })),
    dice: plan.dice, down: plan.down, up: plan.up,
    edges: plan.edgesUsed, helpers: plan.helpersUsed.map(h => ({ id: h.id, name: h.name, free: !!h.free })),
    unpaid: !autoWild && plan.helpersUsed.length > 0,
    coiled: !!input.coiled && !!threat,
    distracted: !!input.distracted && !!threat,
    firstStrike: !!input.firstStrike && !!threat,
    faces: res.faces, hits: res.hits, sixes: res.sixes, result: res.result, rolled: res.result,
    push: null, wily: false, charge: false, sweep: false,
    huntUp: running ? !!state.huntUp : false,
    final: false,
  };
  card.final = !pendingReactions(card, actor, state);
  const msg = {
    speaker: ChatMessage.getSpeaker({ actor }),
    content: await renderRollCard(card),
    rolls: [roll],
    sound: CONFIG.sounds?.dice,
    flags: { [FLAG]: { card } },
  };
  ChatMessage.applyRollMode?.(msg, game.settings.get("core", "rollMode"));
  return ChatMessage.create(msg);
}

/* ------------------------------------------------------------------ reactions */

/** Is this card from the scene that's still running (reactions only work there)? */
function sameScene(card, state) {
  if (!card.missionId) return true;
  return state.id === card.missionId && state.sceneSerial === card.sceneSerial;
}

/**
 * The reactions available on a card now (for its actor):
 * { push, burst, wily, charge, sweep, accept }.
 */
export function reactions(card, actor, state = getState()) {
  const none = { push: false, burst: false, wily: false, charge: false, sweep: false, accept: false };
  if (!actor || card.kind !== CARD.roll) return none;
  const s = actor.system;
  const clock = missionClock(state);
  const scene = sameScene(card, state);
  const misses = card.faces.filter(f => f < 5).length;
  const animal = card.form === "animal";
  const canPush = scene && !card.push && !card.wily && !card.charge && misses > 0 && card.result !== "crit"
    && (!card.final || card.result === "success");
  return {
    push: canPush && (!setting(SETTINGS.autoWild) || s.wild.value >= 1),
    burst: canPush && animal && card.animal === "cheetah" && card.approach === "move" && !usedThisScene(s.usage, "cheetah", clock),
    wily: scene && !card.final && card.result === "fail" && animal && card.animal === "fox" && !usedThisScene(s.usage, "fox", clock),
    charge: scene && !card.charge && card.result === "success" && animal && card.animal === "hippo"
      && card.approach === "force" && !usedThisScene(s.usage, "hippo", clock),
    sweep: scene && !card.sweep && card.context === "clash" && card.action === "strike" && animal && card.animal === "moose"
      && (card.result === "success" || card.result === "crit") && ["beater", "hound"].includes(card.threatKey) && !usedThisScene(s.usage, "moose", clock),
    accept: !card.final,
  };
}

/** Could the result still change (a Fail or Partial with a Push, Burst or Wily available)? */
export function pendingReactions(card, actor, state = getState()) {
  if (!["fail", "partial"].includes(card.result)) return false;
  const r = reactions({ ...card, final: false }, actor, state);
  return r.push || r.burst || r.wily;
}

/** Apply a change to a card: directly if this user may update the message, else via the GM. */
async function patchCard(message, patch, newRolls = []) {
  const card = { ...cardOf(message), ...patch };
  if (message.isOwner) {
    const update = { content: await renderRollCard(card), [`flags.${FLAG}.card`]: card };
    if (newRolls.length) update.rolls = [...message.rolls, ...newRolls].map(r => (typeof r.toJSON === "function" ? r.toJSON() : r));
    return message.update(update);
  }
  return runOp(OPS.cardPatch, { messageId: message.id, patch, rolls: newRolls.map(r => r.toJSON()) });
}

/** Push (§4): spend 1 Wild — or Cheetah's Burst — and reroll every die that didn't hit. */
export async function push(message, by = "wild") {
  const card = cardOf(message);
  const actor = game.actors.get(card?.actorId);
  if (!actor?.isOwner) return null;
  const state = getState();
  const r = reactions(card, actor, state);
  if (!(by === "burst" ? r.burst : r.push)) { ui.notifications.warn(L("MG.Reason.cantPush")); return null; }
  const idx = pushIndices(card.faces);
  const roll = await new Roll(`${idx.length}d6`).evaluate();
  game.dice3d?.showForRoll?.(roll, game.user, true);
  const newFaces = roll.dice[0].results.map(x => x.result);
  const res = resolveFaces(applyPush(card.faces, newFaces), card.difficulty);
  const clock = missionClock(state);
  if (by === "burst") await actor.update({ "system.usage": markUsed(actor.system.usage, "cheetah", clock) });
  else if (setting(SETTINGS.autoWild)) await actor.update({ "system.wild.value": actor.system.wild.value - 1 });
  const next = { ...card, push: { by, indices: idx, before: card.faces, rolled: newFaces }, faces: res.faces, hits: res.hits, sixes: res.sixes, result: res.result };
  next.final = card.final || !(res.result === "fail" && reactions({ ...next, final: false }, actor, state).wily);
  return patchCard(message, { push: next.push, faces: next.faces, hits: next.hits, sixes: next.sixes, result: next.result, final: next.final }, [roll]);
}

/** Red Fox, Wily: once per scene, your Fail becomes a Partial. */
export async function wily(message) {
  const card = cardOf(message);
  const actor = game.actors.get(card?.actorId);
  if (!actor?.isOwner || !reactions(card, actor).wily) return null;
  await actor.update({ "system.usage": markUsed(actor.system.usage, "fox", missionClock(getState())) });
  return patchCard(message, { wily: true, result: "partial", final: true });
}

/** Hippopotamus, Charge: once per scene, a Force Success counts as a Critical. */
export async function charge(message) {
  const card = cardOf(message);
  const actor = game.actors.get(card?.actorId);
  if (!actor?.isOwner || !reactions(card, actor).charge) return null;
  await actor.update({ "system.usage": markUsed(actor.system.usage, "hippo", missionClock(getState())) });
  return patchCard(message, { charge: true, result: "crit", final: true });
}

/** Moose, Antler Sweep: once per scene, a Beater or Hound your Strike Succeeds against is out. */
export async function sweep(message) {
  const card = cardOf(message);
  const actor = game.actors.get(card?.actorId);
  if (!actor?.isOwner || !reactions(card, actor).sweep) return null;
  await actor.update({ "system.usage": markUsed(actor.system.usage, "moose", missionClock(getState())) });
  return patchCard(message, { sweep: true, final: true });
}

/** Accept the roll as it stands (it can't be Pushed after this). */
export async function accept(message) {
  const card = cardOf(message);
  if (!card || card.final) return null;
  const actor = game.actors.get(card.actorId);
  if (message.isOwner) return message.update({ [`flags.${FLAG}.card.final`]: true });
  if (actor?.isOwner) return runOp(OPS.acceptCard, { messageId: message.id });
  return null;
}

/* ------------------------------------------------------------------ card content */

const tagLabel = t => L(TAG_INFO[t]?.label ?? t);

/** One modifier's line on the card and the dialog. */
export function modLabel(m, ctx = {}) {
  let src;
  switch (m.source) {
    case "strength": src = L("MG.Mod.strength", { tag: tagLabel(m.detail) }); break;
    case "weakness": src = L("MG.Mod.weakness", { tag: tagLabel(m.detail) }); break;
    case "wildsense": src = L("MG.Mod.wildsense", { tag: tagLabel(m.detail) }); break;
    case "animal": src = ANIMALS[m.key] ? L(ANIMALS[m.key].perkLabel) : m.key; break;
    case "perk": src = PERKS[m.key] ? L(PERKS[m.key].label) : m.key; break;
    case "threat": src = L(`MG.Mod.${m.key}`); break;
    case "clash": src = L(`MG.Mod.${m.key}`); break;
    default: src = m.key;
  }
  const eff = m.effect === "dice" ? L("MG.Mod.plusDie") : m.effect === "down" ? L("MG.Mod.minusDiff") : m.effect === "up" ? L("MG.Mod.plusDiff") : L(`MG.Mod.note.${m.key}`);
  return { text: `${src}: ${eff}`, cls: m.effect === "up" ? "bad" : (m.effect === "note" ? "note" : "good"), ...ctx };
}

/** What the result does where it was rolled (the card's hint line; the GM's automation applies it). */
export function outcomeLines(card, state = getState()) {
  const out = [];
  const r = card.result;
  if (card.context === "scout") out.push(L(`MG.Outcome.scout.${r}`));
  else if (card.context === "obstacle") {
    const ob = state.obstacles?.find(o => o.uid === card.obstacleUid);
    const esc = ob?.section === "escape";
    if (ob?.kind === "group") out.push(L(r === "fail" ? "MG.Outcome.group.fail" : r === "crit" ? "MG.Outcome.group.crit" : "MG.Outcome.group.past"));
    else out.push(L(`MG.Outcome.point.${r}`) + (r === "partial" && esc ? ` ${L("MG.Outcome.escapeFree")}` : ""));
    if (r === "fail") {
      if (card.huntUp) out.push(L("MG.Outcome.taken"));
      else {
        if (ob?.dangerous) out.push(L("MG.Outcome.dangerous"));
        if (ob?.guards?.length && !state.progress?.[ob.uid]?.guardsBeaten) out.push(L("MG.Outcome.clash"));
      }
    }
  } else if (card.context === "clash") {
    const name = card.threatName || L("MG.Clash.theThreat");
    const t = THREATS[card.threatKey];
    if (card.action === "strike") out.push(L(card.sweep ? "MG.Outcome.strike.sweep" : `MG.Outcome.strike.${r}`, { name }));
    else out.push(L(`MG.Outcome.${card.action}.${r === "crit" ? "success" : r}`, { name }));
    if (r === "fail" && card.huntUp) out.push(L("MG.Outcome.taken"));
    else if (r === "fail" && t?.net) out.push(L("MG.Outcome.netted"));
    else if (r === "fail" || r === "partial") out.push(L("MG.Outcome.harm", { name, n: t?.harm ?? 1 }));
  } else if (card.huntUp && r === "fail") out.push(L("MG.Outcome.taken"));
  return out;
}

/** Render a roll card's HTML (static content; buttons are added per viewer on render). */
export async function renderRollCard(card) {
  const actor = game.actors.get(card.actorId);
  const state = getState();
  const pushed = new Set(card.push?.indices ?? []);
  const dice = card.faces.map((f, i) => ({ face: f, hit: f >= 5, six: f === 6, rerolled: pushed.has(i) }));
  const approach = L(APPROACH_INFO[card.approach]?.label ?? card.approach);
  const variant = card.gnaw ? L("MG.Roll.gnaw") : (card.beak ? L("MG.Roll.beak") : "");
  const where = card.context === "obstacle" ? card.obstacleName
    : card.context === "clash" ? L(`MG.Clash.${card.action}Vs`, { name: card.threatName })
    : card.context === "scout" ? L("MG.Roll.scouting") : L("MG.Roll.free");
  const mods = (card.mods ?? []).map(m => modLabel(m));
  if (card.trail) mods.push({ text: L("MG.Mod.trail"), cls: "bad" });
  if (card.edges) mods.push({ text: L("MG.Roll.edgesUsed", { n: card.edges }), cls: "good" });
  for (const h of card.helpers ?? []) mods.push({ text: L(h.free ? "MG.Roll.helpFree" : "MG.Roll.help", { name: h.name }), cls: "good" });
  const cap = [];
  if (card.dice?.capped) cap.push(L("MG.Roll.capDice"));
  if (card.down?.capped) cap.push(L("MG.Roll.capDiff"));
  const notes = [];
  if (card.push) notes.push(L(card.push.by === "burst" ? "MG.Roll.pushedBurst" : "MG.Roll.pushed", { n: card.push.indices.length }));
  if (card.wily) notes.push(L("MG.Roll.wily"));
  if (card.charge) notes.push(L("MG.Roll.charge"));
  if (card.sweep) notes.push(L("MG.Roll.sweep"));
  if (card.unpaid) notes.push(L("MG.Roll.unpaid"));
  return foundry.applications.handlebars.renderTemplate(`${SYSTEM_PATH}/${TEMPLATES.rollCard}`, {
    card, name: actor?.name ?? "", img: actor?.img ?? null,
    approach, variant, where,
    form: L(card.form === "animal" ? "MG.Form.animal" : "MG.Form.human"),
    animalName: card.form === "animal" && ANIMALS[card.animal] ? L(ANIMALS[card.animal].label) : "",
    dice, mods, cap: cap.join(" "), notes,
    resultLabel: L(RESULT_LABELS[card.result]), resultClass: card.result,
    hits: card.hits, pool: card.pool, difficulty: card.difficulty,
    outcome: outcomeLines(card, state),
    pending: !card.final,
    reminder: setting(SETTINGS.rulesReminders) && !card.final ? L("MG.Roll.pendingHint") : "",
    tags: (card.tags ?? []).map(tagLabel).join(", "),
  });
}

/* ------------------------------------------------------------------ chat buttons */

/**
 * renderChatMessageHTML: add this viewer's buttons to a roll card (owners: reactions; the
 * GM: apply a pending outcome, or the parts left to apply when an automation is off).
 */
export function onRenderChatMessage(message, html) {
  const card = cardOf(message);
  if (!card || card.kind !== CARD.roll) return;
  const box = html.querySelector?.(".mg-card-actions");
  if (!box) return;
  const actor = game.actors.get(card.actorId);
  const state = getState();
  const buttons = [];
  if (actor?.isOwner) {
    const r = reactions(card, actor, state);
    if (r.push) buttons.push({ action: "push", label: L(card.result === "success" ? "MG.Card.pushCrit" : "MG.Card.push") });
    if (r.burst) buttons.push({ action: "burst", label: L("MG.Card.burst") });
    if (r.wily) buttons.push({ action: "wily", label: L("MG.Card.wily") });
    if (r.charge) buttons.push({ action: "charge", label: L("MG.Card.charge") });
    if (r.sweep) buttons.push({ action: "sweep", label: L("MG.Card.sweep") });
    if (r.accept) buttons.push({ action: "accept", label: L("MG.Card.accept") });
  }
  if (game.user.isGM) {
    if (!card.final && !actor?.isOwner) buttons.push({ action: "accept", label: L("MG.Card.finalize") });
    const rec = state.rolls?.[message.id];
    const pend = (state.suggested ?? []).some(s => s.kind === "effect" && s.effect?.source === message.id);
    if (card.final && card.missionId === state.id && ((rec?.skipped?.length ?? 0) > 0 || pend)) buttons.push({ action: "apply", label: L("MG.Card.apply") });
  }
  if (!buttons.length) return;
  const wrap = document.createElement("div");
  wrap.className = "mg-buttons";
  wrap.innerHTML = buttons.map(b => `<button type="button" data-mg-action="${b.action}">${foundry.utils.escapeHTML(b.label)}</button>`).join("");
  box.appendChild(wrap);
  for (const btn of wrap.querySelectorAll("button")) {
    btn.addEventListener("click", ev => {
      ev.preventDefault?.();
      btn.disabled = true;
      onCardButton(message, btn.dataset.mgAction).catch(err => { console.error(err); ui.notifications.warn(String(err?.message ?? err)); });
    });
  }
}

async function onCardButton(message, action) {
  const fresh = game.messages.get(message.id) ?? message;
  switch (action) {
    case "push": return push(fresh, "wild");
    case "burst": return push(fresh, "burst");
    case "wily": return wily(fresh);
    case "charge": return charge(fresh);
    case "sweep": return sweep(fresh);
    case "accept": return accept(fresh);
    case "apply": return game[SYSTEM_ID]?.automation?.applySuggestionsFor(fresh.id);
  }
  return null;
}

/* ------------------------------------------------------------------ GM operations */

export function registerRollOps() {
  registerOp(OPS.payHelp, {
    check: ({ rollerId, helpers }, user) => {
      const roller = game.actors.get(rollerId);
      if (!owns(user, roller)) return { ok: false, reason: "notOwner" };
      if (!Array.isArray(helpers) || helpers.length > 2) return { ok: false, reason: "badHelp" };
      return { ok: true };
    },
    apply: async ({ rollerId, helpers, approach, tags }) => {
      const clock = missionClock(getState());
      const paid = [];
      for (const id of helpers) {
        const a = game.actors.get(id);
        if (!a || a.type !== "bonded") continue;
        const free = packFree(a, clock);
        const v = canHelp({ id: a.id, form: a.system.form, animal: a.system.animal, wild: a.system.wild.value, status: a.system.status }, { approach, tags, rollerId, packFree: free });
        if (!v.ok) continue;
        if (v.free) await a.update({ "system.usage": markUsed(a.system.usage, "coyote", clock) });
        else await a.update({ "system.wild.value": a.system.wild.value - 1 });
        paid.push(id);
      }
      return { paid };
    },
  });
  registerOp(OPS.spendEdges, {
    check: ({ actorId, n }, user) => {
      if (!owns(user, game.actors.get(actorId))) return { ok: false, reason: "notOwner" };
      if (!(Number(n) > 0) || Number(n) > getState().edges) return { ok: false, reason: "noEdges" };
      return { ok: true };
    },
    apply: async ({ n }) => {
      const out = await mutate(S => spendEdgesReducer(S, n));
      if (!out.ok) throw new Error("no Edges");
      return { edges: out.state.edges };
    },
  });
  registerOp(OPS.cardPatch, {
    check: ({ messageId, patch }, user) => {
      const m = game.messages.get(messageId);
      const card = cardOf(m);
      if (!card || card.kind !== CARD.roll) return { ok: false, reason: "noCard" };
      if (!owns(user, game.actors.get(card.actorId))) return { ok: false, reason: "notOwner" };
      const allowed = new Set(["push", "faces", "hits", "sixes", "result", "final", "wily", "charge", "sweep"]);
      if (Object.keys(patch ?? {}).some(k => !allowed.has(k))) return { ok: false, reason: "badPatch" };
      if (card.final && !(["success", "crit"].includes(card.result))) return { ok: false, reason: "cardFinal" };
      return { ok: true };
    },
    apply: async ({ messageId, patch, rolls = [] }) => {
      const m = game.messages.get(messageId);
      const card = { ...cardOf(m), ...patch };
      const update = { content: await renderRollCard(card), [`flags.${FLAG}.card`]: card };
      if (rolls.length) update.rolls = [...m.rolls.map(r => (typeof r.toJSON === "function" ? r.toJSON() : r)), ...rolls];
      await m.update(update);
      return true;
    },
  });
  registerOp(OPS.acceptCard, {
    check: ({ messageId }, user) => {
      const card = cardOf(game.messages.get(messageId));
      if (!card) return { ok: false, reason: "noCard" };
      if (!owns(user, game.actors.get(card.actorId))) return { ok: false, reason: "notOwner" };
      return { ok: true };
    },
    apply: async ({ messageId }) => { await game.messages.get(messageId).update({ [`flags.${FLAG}.card.final`]: true }); return true; },
  });
  registerOp(OPS.handPrize, {
    check: ({ actorId, toId }, user) => {
      const st = getState();
      if (!owns(user, game.actors.get(actorId))) return { ok: false, reason: "notOwner" };
      if (st.carrier !== actorId) return { ok: false, reason: "notCarrier" };
      if (!st.party.some(p => p.id === toId)) return { ok: false, reason: "noTarget" };
      return { ok: true };
    },
    apply: async ({ toId }) => { await mutate(S => setCarrier(S, toId)); return true; },
  });
}

/** Fire HOOKS.rollResolved on every client when a roll card is created or changes. */
export function registerRollHooks() {
  const fire = message => { const c = cardOf(message); if (c?.kind === CARD.roll) Hooks.callAll(HOOKS.rollResolved, message, c); };
  Hooks.on("createChatMessage", fire);
  Hooks.on("updateChatMessage", fire);
  Hooks.on("renderChatMessageHTML", onRenderChatMessage);
}

export { FRAMES, CLASH_ACTIONS, isRunning };
