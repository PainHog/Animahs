/**
 * Things a Bonded does to themselves or a friend: shift (§3), Patch Up (§4), free a
 * Netted friend (§7), take Hurt (§9: Down at 3, Stuck if Down as an animal; Bison's
 * Shaggy Coat). Owners write their own actor directly; a friend's actor goes through a
 * GM operation. Each action posts a short chat card so the table sees it.
 */
import { SYSTEM_ID, FLAG, CARD, OPS, SETTINGS, HOOKS, TEMPLATES, SYSTEM_PATH } from "../contracts.mjs";
import { HURT_BOXES, HURT_AFTER_DOWN, ANIMALS, FRAMES } from "../config.mjs";
import { usedThisScene, markUsed } from "../logic/usage.mjs";
import { missionClock, isRunning } from "../logic/mission.mjs";
import { runOp, registerOp, owns } from "../net/gm-ops.mjs";
import { getState } from "../mission/store.mjs";
import { ChatMessageClass } from "../foundry-classes.mjs";

const L = (k, d) => (d ? game.i18n.format(k, d) : game.i18n.localize(k));
const setting = key => game.settings.get(SYSTEM_ID, key);

/** The mission clock (once-per-scene uses). */
export const currentClock = () => missionClock(getState());

/** A roster entry for the mission logic. */
export function rosterEntry(actor) {
  const s = actor.system;
  return {
    id: actor.id, name: actor.name, form: s.form, hurt: s.hurt.value, animal: s.animal,
    down: s.status.down, netted: s.status.netted, taken: s.status.taken, exposed: s.status.exposed, stuck: s.status.stuck,
  };
}

/** The roster of the running mission's party (or of every Bonded when none runs). */
export function partyRoster(state = getState()) {
  const ids = state.party?.length ? state.party.map(p => p.id) : game.actors.filter(a => a.type === "bonded").map(a => a.id);
  return ids.map(id => game.actors.get(id)).filter(Boolean).map(rosterEntry);
}

/** The Bonded in the running mission (or every Bonded). */
export function partyActors(state = getState()) {
  const ids = isRunning(state) ? state.party.map(p => p.id) : null;
  return game.actors.filter(a => a.type === "bonded" && (!ids || ids.includes(a.id)));
}

/**
 * The update for setting Hurt (§9): Down at 3 boxes; Down in animal form also means Stuck.
 * Going below 3 doesn't lift Down (that happens when the scene ends).
 */
export function hurtUpdate(actor, value) {
  const v = Math.max(0, Math.min(HURT_BOXES, Math.trunc(Number(value) || 0)));
  const up = { "system.hurt.value": v };
  if (v >= HURT_BOXES && !actor.system.status.down) {
    up["system.status.down"] = true;
    if (actor.system.form === "animal") up["system.status.stuck"] = true;
  }
  return up;
}

/**
 * Take Hurt (§9). Bison, Shaggy Coat: once per scene in animal form, take 1 less.
 * Returns { taken, coat, down }. Runs on the owner's or the GM's client.
 */
export async function applyHurt(actor, amount, { cause = "" } = {}) {
  amount = Math.max(0, Math.trunc(Number(amount) || 0));
  const s = actor.system;
  if (!amount || s.status.taken) return { taken: 0, coat: false, down: false };
  const up = {};
  let coat = false;
  const clock = currentClock();
  if (s.animal === "bison" && s.form === "animal" && !usedThisScene(s.usage, "bison", clock)) {
    amount -= 1; coat = true;
    up["system.usage"] = markUsed(s.usage, "bison", clock);
  }
  const before = s.hurt.value;
  Object.assign(up, hurtUpdate(actor, before + amount));
  await actor.update(up);
  const down = !!up["system.status.down"];
  if (coat) await postNotice("MG.Notice.shaggyCoat", { name: actor.name }, { actor });
  if (down) await postNotice(actor.system.status.stuck ? "MG.Notice.downStuck" : "MG.Notice.down", { name: actor.name }, { actor });
  return { taken: Math.min(HURT_BOXES, before + amount) - before, coat, down, cause };
}

/** Why a character can't act right now, or null. */
export function cantAct(actor) {
  const st = actor.system.status;
  if (st.taken) return "taken";
  if (st.down) return "down";
  if (st.netted) return "netted";
  return null;
}

/**
 * The cost of shifting (§3): into the animal 1 Wild, or 1 Hurt with no Wild unless that
 * would put you Down; back is free; Stuck can't shift back. Returns { ok, reason, cost }.
 */
export function shiftCost(actor, toForm) {
  const s = actor.system;
  if (toForm === s.form) return { ok: false, reason: "sameForm", cost: "none" };
  const why = cantAct(actor);
  if (why) return { ok: false, reason: why, cost: "none" };
  if (toForm === "human") return s.status.stuck ? { ok: false, reason: "stuck", cost: "none" } : { ok: true, reason: null, cost: "none" };
  if (!s.animal || !ANIMALS[s.animal]) return { ok: false, reason: "noAnimal", cost: "none" };
  if (!setting(SETTINGS.autoWild)) return { ok: true, reason: null, cost: "manual" };
  if (s.wild.value >= 1) return { ok: true, reason: null, cost: "wild" };
  if (s.hurt.value + 1 < HURT_BOXES) return { ok: true, reason: null, cost: "hurt" };
  return { ok: false, reason: "shiftWouldDown", cost: "none" };
}

/** Shift into the animal or back (§3). Posts a shift card the GM's automation reacts to. */
export async function shift(actor, toForm = actor.system.form === "animal" ? "human" : "animal") {
  const c = shiftCost(actor, toForm);
  if (!c.ok) { ui.notifications.warn(L(`MG.Reason.${c.reason}`)); return null; }
  const from = actor.system.form;
  const up = { "system.form": toForm };
  if (c.cost === "wild") up["system.wild.value"] = actor.system.wild.value - 1;
  if (c.cost === "hurt") up["system.hurt.value"] = actor.system.hurt.value + 1;
  await actor.update(up, { [SYSTEM_ID]: { shift: true } });
  Hooks.callAll(HOOKS.shifted, actor, from, toForm);
  const state = getState();
  const running = isRunning(state) && state.party.some(p => p.id === actor.id);
  const inClash = running && !!state.clash && state.clash.participants.includes(actor.id) && !state.clash.left.includes(actor.id);
  const animal = ANIMALS[actor.system.animal];
  const key = toForm === "animal" ? `MG.Shift.into.${c.cost}` : "MG.Shift.back";
  const lines = [];
  if (running && inClash) lines.push(L("MG.Shift.inClash"));
  else if (running && state.watched) lines.push(L("MG.Shift.watched"));
  if (running && state.carrier === actor.id) lines.push(L("MG.Shift.prizeDrops"));
  if (setting(SETTINGS.rulesReminders)) lines.push(L("MG.Shift.reminder"));
  return postCard(CARD.shift, {
    actorId: actor.id, from, to: toForm, cost: c.cost, missionId: running ? state.id : null, inClash,
  }, {
    actor, title: L(key, { name: actor.name, animal: animal ? L(animal.label) : "" }), lines,
  });
}

/**
 * Patch Up (§4): spend 1 Wild and your action to heal 1 Hurt, yours or a friend's.
 * A Down friend keeps being Down until the scene ends (they can't act until then).
 */
export async function patchUp(healer, target = healer) {
  const why = cantAct(healer);
  if (why) { ui.notifications.warn(L(`MG.Reason.${why}`)); return false; }
  const auto = setting(SETTINGS.autoWild);
  if (auto && healer.system.wild.value < 1) { ui.notifications.warn(L("MG.Reason.noWild")); return false; }
  if (target.system.hurt.value < 1) { ui.notifications.warn(L("MG.Reason.notHurt")); return false; }
  if (target.system.status.taken) { ui.notifications.warn(L("MG.Reason.taken")); return false; }
  if (target.id === healer.id || target.isOwner) {
    if (auto && target.id === healer.id) await healer.update({ "system.wild.value": healer.system.wild.value - 1, "system.hurt.value": healer.system.hurt.value - 1 });
    else {
      if (auto) await healer.update({ "system.wild.value": healer.system.wild.value - 1 });
      await target.update({ "system.hurt.value": target.system.hurt.value - 1 });
    }
  } else {
    const r = await runOp(OPS.heal, { healerId: healer.id, targetId: target.id });
    if (!r.ok) return false;
    if (auto) await healer.update({ "system.wild.value": healer.system.wild.value - 1 });
  }
  await postNotice(target.id === healer.id ? "MG.Notice.patchSelf" : "MG.Notice.patchFriend", { name: healer.name, target: target.name }, { actor: healer });
  return true;
}

/** Free a Netted friend (§7): your action, no roll. */
export async function freeNetted(actor, target) {
  const why = cantAct(actor);
  if (why) { ui.notifications.warn(L(`MG.Reason.${why}`)); return false; }
  if (!target?.system.status.netted) { ui.notifications.warn(L("MG.Reason.notNetted")); return false; }
  if (target.isOwner) await target.update({ "system.status.netted": false });
  else {
    const r = await runOp(OPS.freeNetted, { actorId: actor.id, targetId: target.id });
    if (!r.ok) return false;
  }
  await postNotice("MG.Notice.freed", { name: actor.name, target: target.name }, { actor });
  return true;
}

/** Toggle a status by hand (the sheet). Taken also means Exposed (§9). */
export async function toggleStatus(actor, key) {
  const st = actor.system.status;
  const up = { [`system.status.${key}`]: !st[key] };
  if (key === "taken" && !st.taken) Object.assign(up, { "system.status.exposed": true, "system.status.down": false, "system.status.netted": false });
  if (key === "down" && st.down && actor.system.hurt.value >= HURT_BOXES) up["system.hurt.value"] = HURT_AFTER_DOWN;
  return actor.update(up);
}

/** Set up a character for a new mission (§4, §9): Wild to its maximum, no Hurt, human form. */
export function prepareUpdate(actor) {
  return {
    "system.wild.value": actor.system.wild.max,
    "system.hurt.value": 0,
    "system.form": "human",
    "system.status.down": false, "system.status.netted": false, "system.status.taken": false,
    "system.status.stuck": false, "system.status.exposed": false,
    "system.usage": {},
  };
}

/* ------------------------------------------------------------------ chat */

/**
 * Post a system chat card. data → flags.morphgame.card (with kind); view → template data
 * ({ title, lines, actor }). Returns the message.
 */
export async function postCard(kind, data, { actor = null, title = "", lines = [], whisperGM = false } = {}) {
  const card = { v: 1, kind, ...data };
  const content = await foundry.applications.handlebars.renderTemplate(`${SYSTEM_PATH}/${TEMPLATES.noticeCard}`, {
    kind, title, lines, img: actor?.img ?? null, name: actor?.name ?? "",
  });
  const msg = {
    content,
    speaker: ChatMessageClass().getSpeaker({ actor }),
    flags: { [FLAG]: { card } },
  };
  if (whisperGM) msg.whisper = game.users.filter(u => u.isGM).map(u => u.id);
  return ChatMessageClass().create(msg);
}

/** A short notice card. */
export function postNotice(key, data = {}, { actor = null, whisperGM = false, lines = [] } = {}) {
  return postCard(CARD.notice, { key, data }, { actor, title: L(key, data), lines, whisperGM });
}

/* ------------------------------------------------------------------ GM operations */

export function registerActorOps() {
  registerOp(OPS.heal, {
    check: ({ healerId, targetId }, user) => {
      const healer = game.actors.get(healerId), target = game.actors.get(targetId);
      if (!owns(user, healer)) return { ok: false, reason: "notOwner" };
      if (!target || target.type !== "bonded") return { ok: false, reason: "noTarget" };
      if (cantAct(healer)) return { ok: false, reason: cantAct(healer) };
      if (target.system.hurt.value < 1) return { ok: false, reason: "notHurt" };
      if (setting(SETTINGS.autoWild) && healer.system.wild.value < 1) return { ok: false, reason: "noWild" };
      return { ok: true };
    },
    apply: async ({ targetId }) => {
      const target = game.actors.get(targetId);
      await target.update({ "system.hurt.value": target.system.hurt.value - 1 });
      return { hurt: target.system.hurt.value };
    },
  });
  registerOp(OPS.freeNetted, {
    check: ({ actorId, targetId }, user) => {
      const actor = game.actors.get(actorId), target = game.actors.get(targetId);
      if (!owns(user, actor)) return { ok: false, reason: "notOwner" };
      if (cantAct(actor)) return { ok: false, reason: cantAct(actor) };
      if (!target?.system?.status?.netted) return { ok: false, reason: "notNetted" };
      return { ok: true };
    },
    apply: async ({ targetId }) => { await game.actors.get(targetId).update({ "system.status.netted": false }); return true; },
  });
}

/** The frame's Strengths for a character (for the sheet's Wild Sense choice). */
export const frameStrengths = actor => FRAMES[actor.system.frameKey]?.strengths ?? [];
