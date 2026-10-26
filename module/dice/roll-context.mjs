/**
 * What a roll is about and what it starts from: the mission's current obstacle, a Clash,
 * scouting, or a free roll. Builds the roll dialog's defaults and the input for the pure
 * roll plan (module/logic/roll-plan.mjs). Shared by the dialog, the roll itself and the cards.
 */
import { APPROACHES, CLASH_ACTIONS, CLASH_ACTION_ORDER, SCOUT_APPROACH, EDGE_MAX } from "../config.mjs";
import { buildRollPlan, canHelp, approachOptions } from "../logic/roll-plan.mjs";
import { isRunning, currentObstacle, obstacleView, activeGuardKeys, progressOf, missionClock } from "../logic/mission.mjs";
import { clashRollContext, threatsLeft, guardKeysOf } from "../logic/clash.mjs";
import { usedThisScene } from "../logic/usage.mjs";
import { getState } from "../mission/store.mjs";

/** Is this actor in the running mission's party? */
export const inParty = (state, actor) => isRunning(state) && state.party.some(p => p.id === actor.id);

/** Is this actor fighting in the current Clash? */
export const inClash = (state, actor) => !!state.clash && inParty(state, actor)
  && state.clash.participants.includes(actor.id) && !state.clash.left.includes(actor.id);

/** The contexts a roll can be for right now: [{ key, label, data }]. */
export function availableContexts(state, actor) {
  const out = [];
  if (inParty(state, actor)) {
    if (state.status === "scout") out.push({ key: "scout" });
    if (inClash(state, actor)) out.push({ key: "clash" });
    const ob = currentObstacle(state);
    if (ob && !state.clash && !progressOf(state, ob.uid)?.ended) out.push({ key: "obstacle", name: ob.name });
  }
  out.push({ key: "free" });
  return out;
}

/**
 * The dialog's starting choices for an actor (and an approach, if the sheet's button named one).
 * Returns { context, approach, difficulty, tags, action, threatId, edges, helpers }.
 */
export function defaultChoices(actor, { approach = null, context = null, action = null, threatId = null } = {}, state = getState()) {
  const ctxs = availableContexts(state, actor).map(c => c.key);
  const ctx = context && ctxs.includes(context) ? context : ctxs[0];
  const ch = { context: ctx, approach: approach ?? "sneak", difficulty: 2, tags: [], action: null, threatId: null, edges: 0, helpers: [] };
  if (ctx === "scout") {
    ch.approach = approach ?? SCOUT_APPROACH;
    ch.difficulty = state.scoutDiff ?? 2;
  } else if (ctx === "obstacle") {
    const v = obstacleView(state);
    ch.tags = [...(v.tags ?? [])];
    const listed = Object.keys(v.baseApproaches);
    if (!approach) ch.approach = bestListed(actor, listed, ch.tags) ?? listed[0] ?? "sneak";
    ch.difficulty = v.baseApproaches[ch.approach] ?? 2;
  } else if (ctx === "clash") {
    const v = obstacleView(state);
    ch.tags = [...(v?.tags ?? [])];
    const left = threatsLeft(state.clash);
    ch.threatId = threatId && left.some(t => t.id === threatId) ? threatId : left[0]?.id ?? null;
    ch.action = action ?? actionFor(approach ?? "force");
    ch.approach = CLASH_ACTIONS[ch.action].approaches.includes(approach) ? approach : CLASH_ACTIONS[ch.action].approaches[0];
    ch.difficulty = left.find(t => t.id === ch.threatId)?.diff ?? 2;
  }
  return ch;
}

/** The Clash action an approach most likely means. */
export const actionFor = approach => (approach === "force" ? "strike" : (approach === "sneak" || approach === "move") ? "distract" : "strike");

/** Among the listed approaches, the one with the most dice for this actor now. */
function bestListed(actor, listed, tags) {
  const opts = approachOptions(actor.system.toCharacter(), actor.system.form, tags).filter(o => listed.includes(o.approach) && o.canRoll);
  opts.sort((a, b) => b.rating - a.rating);
  return opts[0]?.approach ?? null;
}

/**
 * Bring choices in line after one of them changed (approach ↔ Difficulty, action ↔ approach,
 * threat ↔ Difficulty, context ↔ everything). `changed` is the key the user changed.
 */
export function reconcileChoices(actor, choices, changed, state = getState()) {
  let ch = { ...choices, tags: [...(choices.tags ?? [])], helpers: [...(choices.helpers ?? [])] };
  if (changed === "context") return { ...defaultChoices(actor, { approach: null, context: ch.context }, state), edges: 0, helpers: [] };
  if (ch.context === "obstacle" && changed === "approach") {
    const v = obstacleView(state);
    if (v?.baseApproaches?.[ch.approach] != null) ch.difficulty = v.baseApproaches[ch.approach];
  }
  if (ch.context === "clash") {
    if (changed === "action" && !CLASH_ACTIONS[ch.action]?.approaches.includes(ch.approach)) ch.approach = CLASH_ACTIONS[ch.action].approaches[0];
    if (changed === "approach" && !CLASH_ACTIONS[ch.action]?.approaches.includes(ch.approach)) ch.action = actionFor(ch.approach);
    if (changed === "threatId") ch.difficulty = threatsLeft(state.clash).find(t => t.id === ch.threatId)?.diff ?? ch.difficulty;
  }
  ch.edges = Math.max(0, Math.min(Number(ch.edges) || 0, state.edges ?? 0, EDGE_MAX));
  return ch;
}

/** A helper's data for canHelp. */
const helperData = a => ({ id: a.id, form: a.system.form, animal: a.system.animal, wild: a.system.wild.value, status: a.system.status, usage: a.system.usage });

/** Coyote's Pack: once per scene, Help without spending Wild (animal form). */
export const packFree = (a, clock) => a.system.animal === "coyote" && a.system.form === "animal" && !usedThisScene(a.system.usage, "coyote", clock);

/** Friends who could Help this roll: [{ id, name, ok, reason, free, checked }]. */
export function helperOptions(actor, choices, state = getState()) {
  const clock = missionClock(state);
  const ids = inParty(state, actor) ? state.party.map(p => p.id) : null;
  const friends = game.actors.filter(a => a.type === "bonded" && a.id !== actor.id && (ids ? ids.includes(a.id) : !a.system.status.taken));
  const tags = choices.tags ?? [];
  return friends.map(a => {
    const v = canHelp(helperData(a), { approach: choices.approach, tags, rollerId: actor.id, packFree: packFree(a, clock) });
    return { id: a.id, name: a.name, ok: v.ok, reason: v.reason, free: v.free, checked: v.ok && (choices.helpers ?? []).includes(a.id) };
  });
}

/** The pure roll plan's input for an actor and the dialog's choices. */
export function planInput(actor, choices, state = getState()) {
  const c = actor.system.toCharacter();
  const input = {
    c, form: c.form, approach: choices.approach, tags: choices.tags ?? [],
    difficulty: Number(choices.difficulty) || 2, edges: Number(choices.edges) || 0,
    helpers: helperOptions(actor, choices, state).filter(h => h.checked).map(h => ({ id: h.id, name: h.name, free: h.free })),
  };
  if (choices.context === "obstacle" && currentObstacle(state)) {
    input.guardKeys = activeGuardKeys(state);
    input.trail = !!obstacleView(state)?.trail;
  } else if (choices.context === "clash" && state.clash) {
    const cc = clashRollContext(state.clash, { actorId: actor.id, threatId: choices.threatId, action: choices.action });
    Object.assign(input, { guardKeys: cc.guardKeys, threat: cc.threat, action: choices.action, firstStrike: cc.firstStrike, distracted: cc.distracted, coiled: cc.coiled });
  }
  return input;
}

/** The plan for an actor and choices. */
export const planFor = (actor, choices, state = getState()) => buildRollPlan(planInput(actor, choices, state));

/** Everything the dialog shows about the current context. */
export function contextInfo(state, choices) {
  if (choices.context === "obstacle") {
    const v = obstacleView(state);
    return v ? { name: v.name, kind: v.kind, approaches: v.approaches, base: v.baseApproaches, trail: v.trail, guards: v.guardsActive ? v.guards : [], dangerous: v.dangerous } : null;
  }
  if (choices.context === "clash" && state.clash) {
    return { threats: threatsLeft(state.clash), guards: guardKeysOf(state.clash), round: state.clash.round };
  }
  if (choices.context === "scout") return { scoutDiff: state.scoutDiff };
  return null;
}

export { APPROACHES, CLASH_ACTION_ORDER };
