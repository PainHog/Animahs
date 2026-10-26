/**
 * The mission state (Foundry-free): a pure reducer for one mission (§6–§10) and the
 * campaign Hunt track (§12). The Foundry GM client keeps the state in a world setting
 * and drives it from roll cards and tracker buttons; the tests drive it directly.
 *
 * Every function takes a state and returns { state, effects } (the input is never
 * mutated). Effects are what the runtime must do to actors:
 *   prepare · hurt · net · take · recover · free · expose · slip · clash · growth · unstick
 * each with { actorId?, part, source }. `part` says which automation setting covers it:
 *   "hurt" (Hurt, Netted), "taken" (Taken, Down/Netted at scene end), "clash" (start a Clash),
 *   "always" (mission set-up and wrap-up).
 *
 * Scent is a ledger of events, one rise per event (DESIGN-RULES A2): a roll, a group
 * obstacle ending, a long round, a Clash ending, a seen shift, scouting, being Exposed.
 * Re-applying an event never raises twice. Scent never goes down (the Storyteller's manual
 * correction is the one exception) and Scent past the Limit is lost.
 *
 * `roster` arguments are the party's current statuses:
 *   [{ id, name, form, hurt, down, netted, taken, exposed, stuck, animal }]
 */
import { EDGE_MAX, HUNT_TRACK_MAX, HUNT_TRACK_RISE, PERKS } from "../config.mjs";
import { onTheTrail, raiseScent, pointRollScent, groupEndRise, groupRoundRise, clashEndRise, scoutOutcome } from "./scent.mjs";
import { limitFor, obstacleSequence, missionTitle, scoutDifficulty } from "./missions.mjs";
import { newClash, resolveClashRoll, endClashRound as clashRoundEnd, checkNobodyLeft, stillIn, unattended } from "./clash.mjs";

/** Mission statuses, in order. */
export const STATUS = ["idle", "scout", "way", "in", "escape", "done"];
const RUNNING = new Set(["scout", "way", "in", "escape"]);
export const isRunning = s => RUNNING.has(s?.status);

const AUTO_ALL = { progress: true, scent: true };
const autoOf = opts => ({ ...AUTO_ALL, ...(opts?.auto ?? {}) });
const LOG_MAX = 200;
const ROLLS_MAX = 300;

/** A fresh, empty state (no mission running). */
export function emptyState() {
  return {
    v: 1,
    id: null, status: "idle",
    catalogKey: null, name: "", label: "standard", brief: "", journalUuid: null,
    partySize: 4, limit: 7, limits: null, scoutDiff: 2,
    party: [],
    scent: 0, ledger: [], suggested: [],
    huntUp: false, huntUpAt: null, huntUpChoice: null,
    edges: 0,
    watched: false,
    scout: null, wayPick: null, ways: [[], []], wayIn: null, plan: null,
    obstacles: [], current: -1,
    progress: {},
    clash: null,
    objectiveDone: false, carry: false, carrier: null, prizeDropped: false, prizeLost: false,
    withdrawn: false,
    taken: [], exposed: [], exposedStart: false,
    result: null, finished: false,
    sceneSerial: 0, roundSerial: 0,
    rolls: {}, rollOrder: [],
    log: [],
    campaign: { huntTrack: 0, history: [], exposedNext: false },
  };
}

/** Fill in anything missing from a stored state (older or partial data). */
export function normalizeState(s) {
  const base = emptyState();
  if (!s || typeof s !== "object") return base;
  const out = { ...base, ...structuredClone(s) };
  out.campaign = { ...base.campaign, ...(out.campaign ?? {}) };
  for (const k of ["party", "ledger", "suggested", "obstacles", "taken", "exposed", "log", "rollOrder"]) if (!Array.isArray(out[k])) out[k] = [];
  for (const k of ["progress", "rolls"]) if (!out[k] || typeof out[k] !== "object") out[k] = {};
  return out;
}

/* ------------------------------------------------------------------ */
/*  Small helpers                                                      */
/* ------------------------------------------------------------------ */

const clone = s => structuredClone(s);
const log = (S, k, d = {}) => { S.log.push({ k, d }); if (S.log.length > LOG_MAX) S.log.splice(0, S.log.length - LOG_MAX); };
const partyIds = S => S.party.map(p => p.id);
const inParty = (S, id) => S.party.some(p => p.id === id);
const nameOf = (S, id) => S.party.find(p => p.id === id)?.name ?? id;
const rosterOf = (S, roster = []) => roster.filter(r => inParty(S, r.id));
const standing = r => !r.down && !r.netted && !r.taken;

export const currentObstacle = S => (S.current >= 0 ? S.obstacles[S.current] ?? null : null);
export const progressOf = (S, uid) => S.progress[uid] ?? null;
const isEscape = ob => ob?.section === "escape";

/** The obstacle as it stands this scene: On the Trail adds +1 Difficulty to every approach (§8). */
export function obstacleView(S, ob = currentObstacle(S)) {
  if (!ob) return null;
  const p = progressOf(S, ob.uid) ?? {};
  const approaches = {};
  for (const [a, d] of Object.entries(ob.approaches ?? {})) approaches[a] = d + (p.trail ? 1 : 0);
  return { ...ob, approaches, baseApproaches: { ...(ob.approaches ?? {}) }, trail: !!p.trail, guardsActive: (ob.guards?.length ?? 0) > 0 && !p.guardsBeaten };
}

/** The guard keys that still count at the current obstacle (Tracker, Trophy, Animal Whisperer). */
export function activeGuardKeys(S) {
  const v = obstacleView(S);
  return v?.guardsActive ? [...v.guards] : [];
}

/**
 * Raise Scent for one event (one event, one rise). With automatic Scent off, the rise is
 * suggested to the Storyteller instead. Returns how much it actually rose.
 */
function raise(S, eventId, delta, cause, opts, data = {}) {
  delta = Math.max(0, Math.floor(Number(delta) || 0));
  if (!delta) return 0;
  if (autoOf(opts).scent === false && !opts?.forceScent) {
    if (!S.suggested.some(x => x.kind === "scent" && x.eventId === eventId)) S.suggested.push({ kind: "scent", eventId, delta, cause, data });
    return 0;
  }
  let entry = S.ledger.find(e => e.id === eventId);
  let extra = delta;
  if (entry) {
    if (delta <= entry.delta) return 0;
    extra = delta - entry.delta;
    entry.delta = delta;
  } else {
    entry = { id: eventId, delta, rose: 0, cause, serial: S.sceneSerial };
    S.ledger.push(entry);
  }
  if (S.huntUp) return 0; // Scent past the Limit is lost
  const r = raiseScent(S.scent, extra, S.limit);
  S.scent = r.scent;
  entry.rose += r.rose;
  if (r.rose) log(S, "MG.Log.scent", { n: r.rose, cause, scent: S.scent, limit: S.limit, ...data });
  if (r.huntUp && !S.huntUp) huntGoesUp(S);
  return r.rose;
}

function huntGoesUp(S) {
  S.huntUp = true;
  S.huntUpAt = S.status;
  log(S, "MG.Log.huntUp", {});
  if ((S.status === "in" || S.status === "way" || S.status === "scout") && !S.objectiveDone) S.huntUpChoice = "pending";
}

function gainEdge(S, why) {
  if (S.edges >= EDGE_MAX) { log(S, "MG.Log.edgeLost", { why }); return false; }
  S.edges += 1;
  log(S, "MG.Log.edge", { why, edges: S.edges });
  return true;
}

function rememberRoll(S, mid, rec) {
  if (!S.rolls[mid]) { S.rollOrder.push(mid); }
  S.rolls[mid] = { ...(S.rolls[mid] ?? {}), ...rec };
  while (S.rollOrder.length > ROLLS_MAX) delete S.rolls[S.rollOrder.shift()];
}

/* ------------------------------------------------------------------ */
/*  Starting a mission, scouting and the way in (§10)                  */
/* ------------------------------------------------------------------ */

/**
 * Start a mission. opts: { id, mission (catalog or custom), partySize?, party: [{ id, name,
 * perks: [..], exposed }], journalUuid?, lastHunt? }.
 * Team Captain: the team starts with 1 Edge (two captains, two). Exposed last time: Scent starts at 1.
 */
export function startMission(state, opts) {
  const prev = normalizeState(state);
  const S = emptyState();
  S.campaign = clone(prev.campaign);
  S.sceneSerial = prev.sceneSerial + 1;
  S.roundSerial = prev.roundSerial + 1;
  const m = opts.mission;
  S.id = opts.id;
  S.catalogKey = m.id ?? "custom";
  S.name = missionTitle(m) || m.name || "";
  S.label = m.label ?? "standard";
  S.brief = m.brief ?? "";
  S.journalUuid = opts.journalUuid ?? null;
  S.party = (opts.party ?? []).map(p => ({ id: p.id, name: p.name }));
  S.partySize = Number(opts.partySize ?? S.party.length) || S.party.length || 4;
  S.limits = typeof m.limit === "object" ? { ...m.limit } : null;
  S.limit = Number(opts.limit ?? limitFor(m, S.partySize) ?? 7);
  if (opts.lastHunt && S.campaign.huntTrack >= 4) S.limit = Math.max(1, S.limit - 1); // Ch 8: the Last Hunt
  S.scoutDiff = scoutDifficulty(m);
  S.watched = !!m.watched;
  S.plan = { inside: clone(m.inside ?? []), objective: clone(m.objective ?? null), escape: clone(m.escape ?? []), waysIn: clone(m.waysIn ?? [[], []]) };
  S.ways = (m.waysIn ?? [[], []]).map((way, w) => way.map((o, i) => ({ ...clone(o), uid: `w${w}-${i}-${o.id}`, section: "way" })));
  S.carry = !!m.objective?.carry;
  S.status = "scout";
  const captains = (opts.party ?? []).filter(p => (p.perks ?? []).includes("captain")).length;
  S.edges = Math.min(EDGE_MAX, captains);
  const effects = S.party.map(p => ({ type: "prepare", actorId: p.id, part: "always" }));
  log(S, "MG.Log.start", { name: S.name, size: S.partySize, limit: S.limit });
  if (captains) log(S, "MG.Log.captain", { edges: S.edges });
  const exposed = (opts.party ?? []).filter(p => p.exposed).map(p => p.id);
  if (S.campaign.exposedNext || exposed.length) {
    S.exposedStart = true;
    raise(S, "exposed", 1, "exposed", opts);
  }
  S.campaign.exposedNext = false;
  return { state: S, effects };
}

/** §10 step 1: the scouting roll's outcome. */
export function recordScout(state, { result, actorId = null, messageId = null }, opts) {
  const S = clone(state);
  if (S.status !== "scout") return { state: S, effects: [] };
  const o = scoutOutcome(result);
  S.scout = { result, actorId, messageId };
  S.wayPick = o.picks;
  for (let i = 0; i < o.edges; i++) gainEdge(S, "scout");
  // a poor roll means "Scent starts at 1": if being Exposed already started it at 1, it doesn't add (§9, D31)
  raise(S, "scout", S.exposedStart ? 0 : o.scent, "scout", opts);
  S.status = "way";
  S.sceneSerial += 1;
  log(S, "MG.Log.scout", { result, picks: o.picks, who: actorId ? nameOf(S, actorId) : "" });
  return { state: S, effects: [] };
}

/** §10 step 2: the way in (0 = A, 1 = B). Starts the first obstacle. */
export function chooseWay(state, way, opts) {
  let S = clone(state);
  if (!(S.status === "way" || S.status === "scout") || ![0, 1].includes(Number(way))) return { state: S, effects: [] };
  if (S.status === "scout") log(S, "MG.Log.scoutSkipped", {});
  S.wayIn = Number(way);
  const m = { waysIn: S.plan.waysIn, inside: S.plan.inside, objective: S.plan.objective, escape: S.plan.escape };
  S.obstacles = obstacleSequence(m, S.wayIn).map((o, i) => ({ ...o, uid: `o${i}-${o.id}` }));
  log(S, "MG.Log.way", { way: S.wayIn === 0 ? "A" : "B" });
  S.status = "in";
  return startObstacle(S, 0, opts);
}

/** Start the obstacle at `index`: a new scene; On the Trail is checked as an Escape obstacle begins. */
export function startObstacle(state, index, opts) {
  const S = clone(state);
  const ob = S.obstacles[index];
  if (!ob) return { state: S, effects: [] };
  S.current = index;
  S.sceneSerial += 1;
  S.roundSerial += 1;
  S.clash = null;
  const trail = isEscape(ob) && onTheTrail(S.scent, S.limit);
  S.progress[ob.uid] = { points: 0, past: [], results: [], round: 1, cleared: false, ended: false, guardsBeaten: false, trail, phase: 0, clashDue: false };
  if (isEscape(ob)) S.status = "escape";
  log(S, "MG.Log.obstacle", { name: ob.name });
  if (trail) log(S, "MG.Log.trail", { name: ob.name });
  return { state: S, effects: [] };
}

/* ------------------------------------------------------------------ */
/*  Rolls (§6, §7, §8)                                                 */
/* ------------------------------------------------------------------ */

/**
 * Apply a final roll. card: { messageId, actorId, result, context: "scout"|"obstacle"|"clash"|"free",
 * missionId, obstacleUid, clashId, huntUp (at roll time), action, threatId, coiled, distracted,
 * sweep, form, animal }.
 * opts: { auto: { progress, scent }, force: ["progress"|"scent"] (the Storyteller applying a
 * suggestion), roster }.
 * Returns { state, effects, applied: [parts], skipped: [parts] }.
 */
export function applyRoll(state, card, opts = {}) {
  let S = clone(state);
  const out = { effects: [], applied: [], skipped: [] };
  const mid = card.messageId;
  if (!isRunning(S) || card.missionId !== S.id || !inParty(S, card.actorId) || !mid) return { state: S, ...out };
  const auto = autoOf(opts);
  const force = new Set(opts.force ?? []);
  const prev = S.rolls[mid] ?? { parts: [] };
  const done = new Set(prev.parts);
  const want = part => (auto[part] !== false || force.has(part)) && !done.has(part);
  const first = !done.has("effects");
  const res = card.result;
  const fx = (e) => { if (first) out.effects.push({ source: mid, ...e }); };
  const ropts = { ...opts, forceScent: force.has("scent") };

  // An upgrade after the roll was applied (a Push or Charge turning a Success into a Critical,
  // or Antler Sweep): apply only the difference.
  if (done.has("progress") && (prev.result !== res || (!prev.sweep && card.sweep))) {
    S = applyUpgrade(S, card, prev);
    rememberRoll(S, mid, { result: res, sweep: !!card.sweep });
    return { state: S, ...out };
  }

  if (card.context === "scout") {
    if (S.status === "scout" && want("progress")) {
      S = recordScout(S, { result: res, actorId: card.actorId, messageId: mid }, ropts).state;
      out.applied.push("progress");
    } else if (S.status === "scout") out.skipped.push("progress");
  } else if (card.context === "clash") {
    const r = applyClashPart(S, card, { want, fx, out, ropts });
    S = r;
  } else if (card.context === "obstacle") {
    const ob = currentObstacle(S);
    const p = ob && progressOf(S, ob.uid);
    if (ob && p && ob.uid === card.obstacleUid && !p.ended && !S.clash) {
      S = applyObstaclePart(S, ob, card, { want, fx, out, ropts });
    }
  }
  // §8 Hunt is Up: any Fail means you're Taken, wherever you are (also free rolls).
  if (card.context === "free" && res === "fail" && card.huntUp) fx({ type: "take", actorId: card.actorId, part: "taken" });
  if (out.effects.length || first) out.applied.push("effects");
  rememberRoll(S, mid, { parts: [...new Set([...prev.parts, ...out.applied])], result: res, sweep: !!card.sweep, actorId: card.actorId });
  return { state: S, ...out };
}

function applyObstaclePart(S, ob, card, { want, fx, out, ropts }) {
  const p = S.progress[ob.uid];
  const res = card.result;
  const esc = isEscape(ob);
  const guarded = (ob.guards?.length ?? 0) > 0 && !p.guardsBeaten;
  const who = nameOf(S, card.actorId);
  if (ob.kind === "group") {
    if (p.past.includes(card.actorId)) return S; // already past: this was a Help or a free roll
    if (want("progress")) {
      p.results.push(res);
      if (res !== "fail") {
        p.past.push(card.actorId);
        log(S, "MG.Log.past", { who, name: ob.name });
        if (res === "crit") gainEdge(S, "crit");
      }
      out.applied.push("progress");
    } else out.skipped.push("progress");
  } else {
    if (want("progress")) {
      if (res !== "fail") {
        let gain = 1;
        if (res === "crit") { if (p.points + 1 < ob.progress) gain = 2; else gainEdge(S, "crit"); }
        p.points = Math.min(ob.progress, p.points + gain);
        log(S, "MG.Log.progress", { who, points: p.points, need: ob.progress, name: ob.name });
      }
      out.applied.push("progress");
    } else out.skipped.push("progress");
    // the cost (§1 order: result, then cost)
    const n = pointRollScent(res, esc);
    if (n) {
      if (want("scent")) { raise(S, `roll:${card.messageId}`, n, "roll", ropts, { who, result: res }); out.applied.push("scent"); }
      else out.skipped.push("scent");
    }
  }
  if (res === "fail") {
    if (card.huntUp) fx({ type: "take", actorId: card.actorId, part: "taken" });
    else {
      if (ob.dangerous) fx({ type: "hurt", actorId: card.actorId, amount: 1, part: "hurt", cause: "dangerous" });
      // §6: at a group obstacle the round's rolls finish first; End Round then starts the Clash
      if (guarded && ob.kind === "group") {
        if (!p.clashDue) { p.clashDue = true; log(S, "MG.Log.clashDue", { name: ob.name }); }
      } else if (guarded) fx({ type: "clash", obstacleUid: ob.uid, guards: [...ob.guards], part: "clash" });
    }
  }
  // a point obstacle done
  if (ob.kind !== "group" && p.points >= ob.progress && !p.cleared) {
    p.cleared = true;
    if (ob.objective) objectiveDone(S, card.actorId);
    log(S, "MG.Log.cleared", { name: ob.name });
  }
  return S;
}

function applyClashPart(S, card, { want, fx, out }) {
  const c = S.clash;
  if (!c || c.id !== card.clashId || c.over) return S;
  if (!want("progress")) { out.skipped.push("progress"); }
  const r = resolveClashRoll(c, {
    actorId: card.actorId, action: card.action, threatId: card.threatId, result: card.result,
    form: card.form, animal: card.animal, sweep: !!card.sweep, coiled: !!card.coiled, distracted: !!card.distracted,
    huntUp: !!card.huntUp,
  });
  if (want("progress")) {
    S.clash = r.clash;
    const t = r.clash.threats.find(x => x.id === card.threatId);
    if (r.harmDealt) log(S, "MG.Log.harm", { who: nameOf(S, card.actorId), n: r.harmDealt, threat: t?.name ?? "" });
    if (t?.out) log(S, "MG.Log.threatOut", { threat: t.name });
    for (const e of r.effects) if (e.type === "slip") log(S, "MG.Log.slip", { who: nameOf(S, e.actorId) });
    out.applied.push("progress");
  }
  for (const e of r.effects) {
    if (e.type === "slip") continue;
    fx({ ...e, part: e.type === "take" ? "taken" : "hurt" });
  }
  return S;
}

/** A Success upgraded after it was applied: Critical bonus, or Antler Sweep. */
function applyUpgrade(S, card, prev) {
  const better = (a, b) => ["fail", "partial", "success", "crit"].indexOf(a) > ["fail", "partial", "success", "crit"].indexOf(b);
  if (card.context === "obstacle") {
    const ob = currentObstacle(S);
    const p = ob && progressOf(S, ob.uid);
    if (!ob || !p || ob.uid !== card.obstacleUid) return S;
    if (card.result === "crit" && better("crit", prev.result) && prev.result === "success") {
      // the extra progress if it's still needed, otherwise an Edge (also once the obstacle has ended)
      if (ob.kind === "group" || p.ended) gainEdge(S, "crit");
      else if (p.points < ob.progress) {
        p.points += 1;
        log(S, "MG.Log.progress", { who: nameOf(S, card.actorId), points: p.points, need: ob.progress, name: ob.name });
        if (p.points >= ob.progress && !p.cleared) { p.cleared = true; if (ob.objective) objectiveDone(S, card.actorId); log(S, "MG.Log.cleared", { name: ob.name }); }
      } else gainEdge(S, "crit");
    }
  } else if (card.context === "clash" && S.clash && S.clash.id === card.clashId) {
    const t = S.clash.threats.find(x => x.id === card.threatId);
    if (!t || t.out || card.action !== "strike") return S;
    let extra = 0;
    if (card.sweep && !prev.sweep && (t.key === "beater" || t.key === "hound")) extra = t.tough - t.harmTaken;
    else if (card.result === "crit" && prev.result === "success") extra = 1;
    if (extra > 0) {
      t.harmTaken = Math.min(t.tough, t.harmTaken + extra);
      log(S, "MG.Log.harm", { who: nameOf(S, card.actorId), n: extra, threat: t.name });
      if (t.harmTaken >= t.tough) { t.out = true; log(S, "MG.Log.threatOut", { threat: t.name }); }
      if (!S.clash.threats.some(x => !x.out)) S.clash.over = "allOut";
    }
  }
  return S;
}

function objectiveDone(S, actorId) {
  S.objectiveDone = true;
  if (S.huntUpChoice === "pending") S.huntUpChoice = null;
  log(S, "MG.Log.objective", {});
  if (S.carry && actorId) { S.carrier = actorId; S.prizeDropped = false; log(S, "MG.Log.carrier", { who: nameOf(S, actorId) }); }
}

/* ------------------------------------------------------------------ */
/*  Rounds, obstacles ending, scenes (§6, §9)                          */
/* ------------------------------------------------------------------ */

/** §9 Scene end: Down and Netted friends get up (or are freed), or are Taken. */
export function sceneEndEffects(S, roster, source = `scene:${S.sceneSerial}`) {
  const party = rosterOf(S, roster);
  const friend = party.some(standing);
  const effects = [];
  for (const r of party) {
    if (r.taken || !(r.down || r.netted)) continue;
    if (friend && !S.huntUp) effects.push({ type: r.down ? "recover" : "free", actorId: r.id, part: "taken", source });
    else effects.push({ type: "take", actorId: r.id, part: "taken", source });
  }
  return effects;
}

/**
 * End a round (End Round on the tracker). At a group obstacle, Scent +1 at the end of a round
 * from the third on while anyone still isn't past. In a Clash, see endClashRound.
 */
export function endRound(state, roster, opts) {
  const S = clone(state);
  const ob = currentObstacle(S);
  const p = ob && progressOf(S, ob.uid);
  if (!ob || !p || p.ended || S.clash) return { state: S, effects: [] };
  const effects = [];
  if (ob.kind === "group") {
    const pending = rosterOf(S, roster).filter(r => standing(r) && !p.past.includes(r.id));
    raise(S, `round:${ob.uid}:${p.round}`, groupRoundRise(p.round, pending.length > 0), "longRound", opts, { round: p.round });
    // a guarded Fail this round: the whole team is in the Clash now (startClash applies the
    // obstacle's own Scent for the rolls so far first)
    if (p.clashDue && !p.guardsBeaten) effects.push({ type: "clash", obstacleUid: ob.uid, guards: [...ob.guards], part: "clash" });
    p.clashDue = false;
  }
  p.round += 1;
  S.roundSerial += 1;
  log(S, "MG.Log.round", { round: p.round });
  return { state: S, effects };
}

/**
 * End the current obstacle: a group obstacle raises Scent once (+1 if anyone got a Partial or a
 * Fail; in the Escape only Fails count); then the scene ends. `forced` = the Storyteller moved
 * on before it was cleared.
 */
export function endObstacle(state, roster, opts = {}) {
  let S = clone(state);
  const ob = currentObstacle(S);
  const p = ob && progressOf(S, ob.uid);
  if (!ob || !p || p.ended) return { state: S, effects: [] };
  p.ended = true;
  if (ob.kind === "group") {
    raise(S, `group:${ob.uid}:${p.phase}`, groupEndRise(p.results, isEscape(ob)), "group", opts, { name: ob.name });
    if (!opts.forced) p.cleared = true;
  }
  if (p.cleared && ob.objective && !S.objectiveDone) objectiveDone(S, null);
  const effects = opts.skipSceneEnd ? [] : sceneEndEffects(S, roster);
  log(S, opts.forced && !p.cleared ? "MG.Log.leftBehind" : "MG.Log.ended", { name: ob.name });
  // the last Escape obstacle: the mission is over
  if (isEscape(ob) && S.current === S.obstacles.length - 1) S = finishOutcome(S);
  return { state: S, effects };
}

/** Is the current group obstacle done (everyone standing is past)? */
export function groupCleared(S, roster) {
  const ob = currentObstacle(S);
  const p = ob && progressOf(S, ob.uid);
  if (!ob || ob.kind !== "group" || !p || p.ended || S.clash) return false;
  const party = rosterOf(S, roster);
  const pending = party.filter(r => standing(r) && !p.past.includes(r.id));
  return party.some(standing) && pending.length === 0;
}

/** Move on: end the current obstacle if it hasn't ended, then start the next one. */
export function nextObstacle(state, roster, opts) {
  let S = clone(state);
  let effects = [];
  const ob = currentObstacle(S);
  if (ob && !progressOf(S, ob.uid)?.ended) {
    const r = endObstacle(S, roster, { ...opts, forced: true });
    S = r.state; effects = r.effects;
  }
  if (S.status === "done") return { state: S, effects };
  const next = S.obstacles[S.current + 1];
  if (!next) { S = finishOutcome(S); return { state: S, effects }; }
  if (isEscape(next) && !S.objectiveDone && !S.withdrawn) {
    S.withdrawn = true;
    log(S, "MG.Log.withdraw", {});
  }
  const r = startObstacle(S, S.current + 1, opts);
  return { state: r.state, effects };
}

/** §10 step 3: go to the Escape (after the objective, or Withdrawing). */
export function startEscape(state, roster, opts) {
  let S = clone(state);
  let effects = [];
  const ob = currentObstacle(S);
  if (ob && !isEscape(ob) && !progressOf(S, ob.uid)?.ended) {
    const r = endObstacle(S, roster, { ...opts, forced: true });
    S = r.state; effects = r.effects;
  }
  const idx = S.obstacles.findIndex(o => isEscape(o));
  if (idx < 0) { S = finishOutcome(S); return { state: S, effects }; }
  if (!S.objectiveDone && !S.withdrawn) { S.withdrawn = true; log(S, "MG.Log.withdraw", {}); }
  if (S.huntUpChoice === "pending") S.huntUpChoice = "withdraw";
  const r = startObstacle(S, idx, opts);
  return { state: r.state, effects };
}

/** §8, §10 step 4: Withdraw straight to the Escape (a Loss). */
export function withdraw(state, roster, opts) {
  const S = clone(state);
  if (!isRunning(S) || S.objectiveDone) return { state: S, effects: [] };
  S.withdrawn = true;
  if (S.huntUpChoice === "pending") S.huntUpChoice = "withdraw";
  log(S, "MG.Log.withdraw", {});
  if (S.status === "scout" || S.status === "way") { S.status = "done"; return { state: finishOutcome(S), effects: [] }; }
  return startEscape(S, roster, opts);
}

/** §8 The team presses on after the Hunt is Up. */
export function pressOn(state) {
  const S = clone(state);
  if (S.huntUpChoice === "pending") { S.huntUpChoice = "press"; log(S, "MG.Log.pressOn", {}); }
  return { state: S, effects: [] };
}

/** The book's advice for the Hunt-is-Up choice: press on only if already working on the objective. */
export function suggestPressOn(S) {
  const ob = currentObstacle(S);
  const p = ob && progressOf(S, ob.uid);
  if (S.taken.length) return "withdraw";
  return ob?.objective && (p?.points ?? 0) > 0 ? "press" : "withdraw";
}

/* ------------------------------------------------------------------ */
/*  Clashes (§7)                                                       */
/* ------------------------------------------------------------------ */

/**
 * Start a Clash. opts: { id, obstacleUid?, threats: [makeThreat…], participants?: [actorIds] }.
 * A Clash is its own scene.
 */
export function startClash(state, opts, roster = []) {
  const S = clone(state);
  if (!isRunning(S) || S.clash) return { state: S, effects: [] };
  // §6 (as the simulator plays it): at a group obstacle, the rolls made so far raise its Scent
  // first, then the Clash starts; rolls after the Clash count towards the obstacle's end rise
  const ob = currentObstacle(S);
  const p = ob && progressOf(S, ob.uid);
  if (ob && p && !p.ended && ob.kind === "group" && (opts.obstacleUid ?? ob.uid) === ob.uid && p.results.length) {
    raise(S, `group:${ob.uid}:${p.phase}`, groupEndRise(p.results, isEscape(ob)), "group", opts, { name: ob.name });
    p.phase += 1;
    p.results = [];
    p.clashDue = false;
  }
  const participants = opts.participants ?? rosterOf(S, roster).filter(standing).map(r => r.id);
  S.clash = newClash({ id: opts.id, obstacleUid: opts.obstacleUid ?? currentObstacle(S)?.uid ?? null, threats: opts.threats, participants });
  S.sceneSerial += 1;
  log(S, "MG.Log.clash", { threats: opts.threats.map(t => t.name).join(", ") });
  return { state: S, effects: [] };
}

/** The threats that need a target at the end of this Clash round. */
export const unattendedThreats = S => (S.clash ? unattended(S.clash) : []);

/**
 * End a Clash round. targets: { threatId: actorId } (the Storyteller's choice; the runtime
 * defaults to a random friend still in the Clash). After round 4 the Clash ends.
 */
export function endClashRound(state, targets, roster, opts) {
  let S = clone(state);
  if (!S.clash || S.clash.over) return { state: S, effects: [] };
  const r = clashRoundEnd(S.clash, targets);
  S.clash = r.clash;
  const effects = r.effects.map(e => ({ ...e, part: "hurt", source: `clashround:${S.clash.id}:${r.clash.round}` }));
  for (const e of effects) log(S, "MG.Log.unattended", { who: nameOf(S, e.actorId), n: e.amount });
  if (!S.clash.over) log(S, "MG.Log.clashRound", { round: S.clash.round });
  return { state: S, effects };
}

/**
 * End the Clash: Scent rises once (+1, or +2 if it reached round 4, someone went Down or
 * someone shifted); shifters are Exposed; the scene ends; beating the guards (or seeing them
 * pull back) clears the obstacle unless it still needs progress.
 */
export function endClash(state, roster, opts) {
  let S = clone(state);
  const c = S.clash;
  if (!c) return { state: S, effects: [] };
  const party = rosterOf(S, roster);
  c.anyDown = c.anyDown || party.some(r => c.participants.includes(r.id) && r.down);
  const rise = clashEndRise({ rounds: c.round, anyDown: c.anyDown, anyShifted: c.anyShifted });
  raise(S, `clash:${c.id}`, rise, "clash", opts, { rounds: c.round });
  const effects = [];
  for (const id of c.shifters) effects.push({ type: "expose", actorId: id, part: "always", source: `clash:${c.id}` });
  effects.push(...sceneEndEffects(S, roster, `clash:${c.id}`));
  log(S, "MG.Log.clashEnd", { rounds: c.round, rise });
  S.clash = null;
  S.sceneSerial += 1;
  const ob = currentObstacle(S);
  const p = ob && progressOf(S, ob.uid);
  if (ob && p && c.obstacleUid === ob.uid && !p.ended) {
    p.guardsBeaten = true;
    if (ob.kind === "group") {
      // Slip Away at a group obstacle gets you past it (§7); at a point obstacle you just wait
      for (const id of c.left) if (!p.past.includes(id)) p.past.push(id);
      if (ob.guardsClear) {
        for (const r of party) if (!r.taken && !p.past.includes(r.id)) p.past.push(r.id);
        const e = endObstacle(S, roster, { ...opts, skipSceneEnd: true });
        S = e.state;
      }
    } else if (ob.guardsClear) {
      p.points = ob.progress;
      p.cleared = true;
      if (ob.objective) objectiveDone(S, null);
      const e = endObstacle(S, roster, { ...opts, skipSceneEnd: true });
      S = e.state;
    } else {
      log(S, "MG.Log.stillProgress", { name: ob.name });
    }
  }
  return { state: S, effects };
}

/**
 * A shift (§3). In a Clash it's in sight: the Clash will rise by 2 and the shifter is Exposed.
 * Elsewhere it's out of sight unless the mission says you're watched (then Scent +1, Exposed).
 * The prize drops at the carrier's feet.
 */
export function recordShift(state, { actorId, eventId, toForm }, opts) {
  const S = clone(state);
  const effects = [];
  if (!isRunning(S) || !inParty(S, actorId)) return { state: S, effects };
  const inClash = !!S.clash && S.clash.participants.includes(actorId) && !S.clash.left.includes(actorId);
  if (inClash) {
    S.clash.anyShifted = true;
    if (!S.clash.shifters.includes(actorId)) S.clash.shifters.push(actorId);
    effects.push({ type: "expose", actorId, part: "always", source: eventId });
    log(S, "MG.Log.shiftSeen", { who: nameOf(S, actorId) });
  } else if (S.watched) {
    raise(S, `shift:${eventId}`, 1, "shift", opts, { who: nameOf(S, actorId) });
    effects.push({ type: "expose", actorId, part: "always", source: eventId });
    log(S, "MG.Log.shiftSeen", { who: nameOf(S, actorId) });
  }
  if (S.carrier === actorId) {
    S.carrier = null; S.prizeDropped = true;
    log(S, "MG.Log.prizeDropped", { who: nameOf(S, actorId), form: toForm ?? "" });
  }
  return { state: S, effects };
}

/* ------------------------------------------------------------------ */
/*  Settling after actor changes (§9)                                  */
/* ------------------------------------------------------------------ */

/**
 * Bring the mission in line with the party's statuses (idempotent; call after effects are
 * applied and whenever an actor changes): Taken lists, a Taken carrier loses the prize, Down
 * during a Clash, everyone Down/Netted/Taken at once, a Clash with nobody left, a group
 * obstacle everyone is past.
 */
export function settle(state, roster, opts = {}) {
  let S = clone(state);
  let effects = [];
  if (!isRunning(S)) return { state: S, effects };
  const party = rosterOf(S, roster);
  for (const r of party) {
    if (r.taken && !S.taken.includes(r.id)) { S.taken.push(r.id); log(S, "MG.Log.taken", { who: nameOf(S, r.id) }); }
    if (r.exposed && !S.exposed.includes(r.id)) S.exposed.push(r.id);
  }
  if (S.carrier && S.taken.includes(S.carrier)) {
    log(S, "MG.Log.prizeLost", { who: nameOf(S, S.carrier) });
    S.carrier = null; S.prizeLost = true;
  }
  if (S.clash) S.clash.anyDown = S.clash.anyDown || party.some(r => S.clash.participants.includes(r.id) && r.down);
  // §9 Everyone Down, Netted or Taken at once: everyone is Taken, and the mission is a Loss.
  if (party.length && !party.some(standing)) {
    const take = party.filter(r => !r.taken).map(r => ({ type: "take", actorId: r.id, part: "taken", source: "allOut" }));
    if (take.length) { log(S, "MG.Log.allOut", {}); return { state: S, effects: take }; }
    if (S.status !== "done") { S.clash = null; S = finishOutcome(S); }
    return { state: S, effects };
  }
  if (S.clash) {
    S.clash = checkNobodyLeft(S.clash, party);
    if (S.clash.over) {
      const r = endClash(S, roster, opts);
      S = r.state; effects = effects.concat(r.effects);
    }
  }
  if (groupCleared(S, roster)) {
    const r = endObstacle(S, roster, opts);
    S = r.state; effects = effects.concat(r.effects);
  } else {
    const ob = currentObstacle(S);
    const p = ob && progressOf(S, ob.uid);
    if (ob && p && ob.kind !== "group" && p.cleared && !p.ended && !S.clash) {
      const r = endObstacle(S, roster, opts);
      S = r.state; effects = effects.concat(r.effects);
    }
  }
  return { state: S, effects };
}

/* ------------------------------------------------------------------ */
/*  Results and the campaign (§10, §12)                                */
/* ------------------------------------------------------------------ */

/** §10 Results: Win (done, nobody Taken), Costly Win (done, someone Taken), Loss (not done). */
export function missionResult(S) {
  const allTaken = S.party.length > 0 && S.party.every(p => S.taken.includes(p.id));
  const done = S.objectiveDone && !S.prizeLost && !allTaken;
  return done ? (S.taken.length ? "costly" : "win") : "loss";
}

function finishOutcome(S) {
  S.status = "done";
  S.clash = null;
  S.result = missionResult(S);
  log(S, "MG.Log.result", { result: S.result });
  return S;
}

/** End the mission now (the Storyteller's call), computing the result. */
export function endMission(state) {
  const S = clone(state);
  if (S.status === "idle" || S.status === "done") return { state: S, effects: [] };
  return { state: finishOutcome(S), effects: [] };
}

/**
 * Wrap the mission up: the Hunt track rises (Costly Win +1, Loss +2, at most 6), every
 * character marks 1 Growth and comes unstuck, and Exposed carries to the next mission.
 */
export function finishMission(state, roster) {
  const S = clone(state);
  if (S.status !== "done" || S.finished) return { state: S, effects: [] };
  S.result ??= missionResult(S);
  const before = S.campaign.huntTrack;
  S.campaign.huntTrack = Math.min(HUNT_TRACK_MAX, before + (HUNT_TRACK_RISE[S.result] ?? 0));
  S.campaign.history.push({ id: S.id, name: S.name, result: S.result, scent: S.scent, limit: S.limit, taken: S.taken.length });
  S.campaign.exposedNext = rosterOf(S, roster).some(r => r.exposed) || S.exposed.length > 0;
  S.finished = true;
  log(S, "MG.Log.finished", { result: S.result, from: before, to: S.campaign.huntTrack });
  if (S.campaign.huntTrack >= HUNT_TRACK_MAX && before < HUNT_TRACK_MAX) log(S, "MG.Log.lastHunt", {});
  const effects = [];
  for (const p of S.party) {
    effects.push({ type: "growth", actorId: p.id, part: "growth", source: `finish:${S.id}` });
    effects.push({ type: "unstick", actorId: p.id, part: "always", source: `finish:${S.id}` });
  }
  return { state: S, effects };
}

/** Back to no mission (the campaign is kept). */
export function closeMission(state) {
  const prev = normalizeState(state);
  const S = emptyState();
  S.campaign = clone(prev.campaign);
  S.sceneSerial = prev.sceneSerial + 1;
  S.roundSerial = prev.roundSerial + 1;
  return { state: S, effects: [] };
}

/* ------------------------------------------------------------------ */
/*  The Storyteller's controls                                         */
/* ------------------------------------------------------------------ */

/** A manual Scent correction (the Storyteller only). It may go down: it fixes a mistake. */
export function adjustScent(state, delta) {
  const S = clone(state);
  const before = S.scent;
  S.scent = Math.max(0, Math.min(S.limit, S.scent + Math.trunc(Number(delta) || 0)));
  S.ledger.push({ id: `manual:${S.ledger.length}:${S.sceneSerial}`, delta: S.scent - before, rose: S.scent - before, cause: "manual", serial: S.sceneSerial });
  if (S.scent >= S.limit && !S.huntUp) huntGoesUp(S);
  else if (S.scent < S.limit && S.huntUp) { S.huntUp = false; S.huntUpAt = null; if (S.huntUpChoice === "pending") S.huntUpChoice = null; }
  log(S, "MG.Log.manualScent", { from: before, to: S.scent });
  return { state: S, effects: [] };
}

/** Apply a suggested Scent rise (automatic Scent off) or dismiss it. */
export function resolveSuggestion(state, index, accept, opts) {
  let S = clone(state);
  const s = S.suggested[index];
  if (!s) return { state: S, effects: [] };
  S.suggested.splice(index, 1);
  if (accept && s.kind === "scent") raise(S, s.eventId, s.delta, s.cause, { ...opts, forceScent: true }, s.data);
  return { state: S, effects: [] };
}

export function setEdges(state, n) {
  const S = clone(state);
  S.edges = Math.max(0, Math.min(EDGE_MAX, Math.trunc(Number(n) || 0)));
  return { state: S, effects: [] };
}

/** Spend team Edges (§4). Returns { state, ok }. */
export function spendEdges(state, n) {
  const S = clone(state);
  n = Math.max(0, Math.trunc(Number(n) || 0));
  if (n > S.edges) return { state: S, effects: [], ok: false };
  S.edges -= n;
  if (n) log(S, "MG.Log.edgeSpent", { n, edges: S.edges });
  return { state: S, effects: [], ok: true };
}

export function setCarrier(state, actorId) {
  const S = clone(state);
  S.carrier = actorId && inParty(S, actorId) ? actorId : null;
  if (S.carrier) { S.prizeDropped = false; log(S, "MG.Log.carrier", { who: nameOf(S, S.carrier) }); }
  return { state: S, effects: [] };
}

export function setWatched(state, on) {
  const S = clone(state);
  S.watched = !!on;
  return { state: S, effects: [] };
}

export function setHuntTrack(state, n) {
  const S = clone(state);
  S.campaign.huntTrack = Math.max(0, Math.min(HUNT_TRACK_MAX, Math.trunc(Number(n) || 0)));
  return { state: S, effects: [] };
}

/** Mark a friend past a group obstacle by hand (e.g. carried past, a ruling). */
export function markPast(state, actorId, past = true) {
  const S = clone(state);
  const ob = currentObstacle(S);
  const p = ob && progressOf(S, ob.uid);
  if (!p || ob.kind !== "group") return { state: S, effects: [] };
  p.past = p.past.filter(x => x !== actorId);
  if (past) p.past.push(actorId);
  return { state: S, effects: [] };
}

/** Change progress at a point obstacle by hand. */
export function adjustProgress(state, delta) {
  const S = clone(state);
  const ob = currentObstacle(S);
  const p = ob && progressOf(S, ob.uid);
  if (!p || ob.kind === "group") return { state: S, effects: [] };
  p.points = Math.max(0, Math.min(ob.progress, p.points + Math.trunc(Number(delta) || 0)));
  if (p.points >= ob.progress && !p.cleared) { p.cleared = true; if (ob.objective) objectiveDone(S, null); }
  if (p.points < ob.progress) p.cleared = false;
  return { state: S, effects: [] };
}

/* ------------------------------------------------------------------ */
/*  Views                                                              */
/* ------------------------------------------------------------------ */

/** The mission clock for once-per-scene uses. */
export const missionClock = S => ({ missionId: S?.id ?? "freeplay", sceneSerial: Number(S?.sceneSerial ?? 0) });

/** Who in the party is still to get past the current group obstacle. */
export function pendingAtObstacle(S, roster) {
  const ob = currentObstacle(S);
  const p = ob && progressOf(S, ob.uid);
  if (!ob || !p) return [];
  return rosterOf(S, roster).filter(r => standing(r) && !(ob.kind === "group" && p.past.includes(r.id)));
}

/** Who is in the Clash and can still act. */
export const clashFighters = (S, roster) => (S.clash ? stillIn(S.clash, rosterOf(S, roster)) : []);

/** The human perks a party member has (used for Team Captain at the start). */
export const captainCount = party => party.filter(p => (p.perks ?? []).some(k => k === "captain" && PERKS[k])).length;

export { partyIds };
