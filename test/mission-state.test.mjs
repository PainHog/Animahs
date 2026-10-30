/**
 * The Scent rules (module/logic/scent.mjs), Clashes (module/logic/clash.mjs) and the
 * mission-state reducer (module/logic/mission.mjs) against CORE-RULES §3, §6–§10, §12
 * and the rulebook's worked examples (Ch 5 "the Hunt is Up at the cages", Ch 6 "two Hounds
 * on the lawn").
 */
import test from "node:test";
import assert from "node:assert/strict";
import * as Scent from "../module/logic/scent.mjs";
import * as M from "../module/logic/mission.mjs";
import { makeThreat, newClash, resolveClashRoll, endClashRound, clashRollContext, unattended } from "../module/logic/clash.mjs";
import { missionById, limitFor, obstacleSequence } from "../module/logic/missions.mjs";
import { usedThisScene, markUsed, sceneAbility, clockKey } from "../module/logic/usage.mjs";

/* ------------------------------------------------------------------ helpers */

const PARTY = [
  { id: "maya", name: "Maya", perks: ["hideseek"] },
  { id: "theo", name: "Theo", perks: ["captain"] },
  { id: "priya", name: "Priya", perks: ["brainiac"] },
  { id: "jonah", name: "Jonah", perks: ["football"] },
];
const fresh = () => Object.fromEntries(PARTY.map(p => [p.id, { id: p.id, name: p.name, form: "human", hurt: 0, down: false, netted: false, taken: false, exposed: false, stuck: false }]));

/** A tiny world: the reducer plus a roster the effects are applied to, like the GM client does. */
function world(missionId = "petshop", size = 4) {
  const W = { roster: fresh(), state: M.emptyState(), n: 0, effects: [] };
  W.list = () => Object.values(W.roster);
  W.apply = effects => {
    for (const e of effects) {
      W.effects.push(e);
      const r = W.roster[e.actorId];
      if (e.type === "hurt" && r) { r.hurt = Math.min(3, r.hurt + e.amount); if (r.hurt >= 3) { r.down = true; if (r.form === "animal") r.stuck = true; } }
      if (e.type === "net" && r) r.netted = true;
      if (e.type === "take" && r) { r.taken = true; r.exposed = true; r.down = false; r.netted = false; }
      if (e.type === "recover" && r) { r.down = false; r.hurt = 2; }
      if (e.type === "free" && r) r.netted = false;
      if (e.type === "expose" && r) r.exposed = true;
      if (e.type === "prepare" && r) Object.assign(r, { hurt: 0, down: false, netted: false, taken: false, stuck: false, exposed: false });
    }
    const clashes = effects.filter(e => e.type === "clash");
    for (const c of clashes) W.do(M.startClash, { id: `c${++W.n}`, obstacleUid: c.obstacleUid, threats: c.guards.map((k, i) => makeThreat(k, i)) }, W.list());
  };
  W.do = (fn, ...args) => {
    const r = fn(W.state, ...args);
    W.state = r.state;
    W.apply(r.effects ?? []);
    W.settle();
    return r;
  };
  W.settle = () => {
    for (let i = 0; i < 6; i++) {
      const r = M.settle(W.state, W.list());
      W.state = r.state;
      if (!r.effects.length) break;
      W.apply(r.effects);
    }
  };
  W.roll = (actorId, result, extra = {}) => {
    const ob = M.currentObstacle(W.state);
    const card = { messageId: `m${++W.n}`, actorId, result, missionId: W.state.id, huntUp: W.state.huntUp,
      context: W.state.clash ? "clash" : (W.state.status === "scout" ? "scout" : "obstacle"),
      obstacleUid: ob?.uid, clashId: W.state.clash?.id, form: W.roster[actorId]?.form ?? "human", ...extra };
    return W.do(M.applyRoll, card, {});
  };
  W.start = (party = PARTY.slice(0, size), opts = {}) =>
    W.do(M.startMission, { id: "mission1", mission: missionById(missionId), party, ...opts });
  return W;
}

/* ------------------------------------------------------------------ Scent */

test("Scent rules: never past the Limit, On the Trail rounds up, group rises once", () => {
  assert.deepEqual(Scent.raiseScent(5, 3, 6), { scent: 6, huntUp: true, rose: 1 });
  assert.equal(Scent.raiseScent(3, -2, 6).scent, 3, "never goes down");
  assert.equal(Scent.onTheTrail(3, 6), true); assert.equal(Scent.onTheTrail(3, 7), false); assert.equal(Scent.onTheTrail(4, 7), true);
  assert.equal(Scent.pointRollScent("partial", false), 1);
  assert.equal(Scent.pointRollScent("partial", true), 0, "in the Escape a Partial costs no Scent");
  assert.equal(Scent.pointRollScent("fail", true), 1);
  assert.equal(Scent.groupEndRise(["fail", "fail", "partial"], false), 1, "once, however many");
  assert.equal(Scent.groupEndRise(["success", "partial"], true), 0);
  assert.equal(Scent.groupEndRise(["success", "crit"], false), 0);
  assert.equal(Scent.groupRoundRise(2, true), 0);
  assert.equal(Scent.groupRoundRise(3, true), 1);
  assert.equal(Scent.groupRoundRise(5, false), 0);
  assert.equal(Scent.clashEndRise({ rounds: 2 }), 1);
  assert.equal(Scent.clashEndRise({ rounds: 4 }), 2);
  assert.equal(Scent.clashEndRise({ rounds: 1, anyDown: true }), 2);
  assert.equal(Scent.clashEndRise({ rounds: 1, anyShifted: true }), 2);
  assert.equal(Scent.shiftSeenRise({ inClash: true, seen: true }), 0, "the Clash's own rise covers it");
  assert.equal(Scent.shiftSeenRise({ inClash: false, seen: true }), 1);
  assert.deepEqual(Scent.scoutOutcome("crit"), { picks: "team", edges: 2, scent: 0 });
  assert.deepEqual(Scent.scoutOutcome("success"), { picks: "team", edges: 1, scent: 0 });
  assert.deepEqual(Scent.scoutOutcome("partial"), { picks: "team", edges: 0, scent: 1 });
  assert.deepEqual(Scent.scoutOutcome("fail"), { picks: "storyteller", edges: 0, scent: 1 });
});

test("usage stamps: once per scene against the mission clock", () => {
  const clock = { missionId: "m", sceneSerial: 3 };
  const u = markUsed({}, "fox", clock);
  assert.equal(usedThisScene(u, "fox", clock), true);
  assert.equal(usedThisScene(u, "fox", { missionId: "m", sceneSerial: 4 }), false, "a new scene: back again");
  assert.equal(clockKey({}), "freeplay:0");
  assert.equal(sceneAbility({ animal: "fox", form: "animal", usage: u }, "fox", clock).reason, "usedThisScene");
  assert.equal(sceneAbility({ animal: "fox", form: "human", usage: {} }, "fox", clock).reason, "humanForm");
  assert.equal(sceneAbility({ animal: "fox", form: "animal", usage: {} }, "fox", clock).ok, true);
  assert.equal(sceneAbility({ animal: "jaguar", form: "animal", usage: {} }, "fox", clock).ok, false);
});

/* ------------------------------------------------------------------ Clashes */

test("§7 Clash: Strike harm, Critical 2, Distract, Coil, Ambush, Sweep, Net, unattended threats", () => {
  let c = newClash({ id: "c", threats: [makeThreat("hound", 0), makeThreat("hound", 1), makeThreat("trapper", 2)], participants: ["a", "b", "c"] });
  assert.equal(c.threats[0].tough, 3);
  // Distract hound 1, then the Strike on it gets −1 Difficulty
  let r = resolveClashRoll(c, { actorId: "a", action: "distract", threatId: "hound-1", result: "success" });
  c = r.clash;
  assert.equal(clashRollContext(c, { actorId: "b", threatId: "hound-1", action: "strike" }).distracted, true);
  assert.equal(clashRollContext(c, { actorId: "b", threatId: "hound-1", action: "strike" }).firstStrike, true);
  r = resolveClashRoll(c, { actorId: "b", action: "strike", threatId: "hound-1", result: "crit", distracted: true });
  c = r.clash;
  assert.equal(c.threats[0].harmTaken, 2); assert.equal(r.harmDealt, 2);
  assert.equal(c.distracted.length, 0, "the Distract is used up");
  assert.equal(clashRollContext(c, { actorId: "b", threatId: "hound-1", action: "strike" }).firstStrike, false);
  // a Partial does the job but its Harm hits you
  r = resolveClashRoll(c, { actorId: "c", action: "strike", threatId: "hound-1", result: "partial" });
  c = r.clash;
  assert.equal(c.threats[0].out, true);
  assert.deepEqual(r.effects, [{ type: "hurt", actorId: "c", amount: 1, threatId: "hound-1" }]);
  // Moose Antler Sweep on a Success against a Hound: out at once
  r = resolveClashRoll(c, { actorId: "a", action: "strike", threatId: "hound-2", result: "success", sweep: true });
  c = r.clash;
  assert.equal(c.threats[1].out, true);
  // Trapper: a Fail nets you
  r = resolveClashRoll(c, { actorId: "b", action: "strike", threatId: "trapper-3", result: "fail" });
  assert.deepEqual(r.effects, [{ type: "net", actorId: "b", threatId: "trapper-3" }]);
  // Python Coil on a Success marks the threat; the next roll against it uses it
  r = resolveClashRoll(r.clash, { actorId: "c", action: "strike", threatId: "trapper-3", result: "success", form: "animal", animal: "python" });
  assert.equal(r.clash.threats[2].coiled, true);
  assert.equal(clashRollContext(r.clash, { actorId: "a", threatId: "trapper-3", action: "distract" }).coiled, true);
  const r2 = resolveClashRoll(r.clash, { actorId: "a", action: "distract", threatId: "trapper-3", result: "success", coiled: true });
  assert.equal(r2.clash.threats[2].coiled, false);
  // the Hunt is Up: a Fail means Taken
  const r3 = resolveClashRoll(r.clash, { actorId: "a", action: "slip", threatId: "trapper-3", result: "fail", huntUp: true });
  assert.deepEqual(r3.effects.map(e => e.type), ["take"]);
  // unattended threats at the end of the round
  let c2 = newClash({ id: "c2", threats: [makeThreat("beater", 0), makeThreat("huntsman", 1)], participants: ["a"] });
  c2 = resolveClashRoll(c2, { actorId: "a", action: "strike", threatId: "beater-1", result: "success" }).clash;
  assert.deepEqual(unattended(c2).map(t => t.id), ["huntsman-2"]);
  const end = endClashRound(c2, { "huntsman-2": "a" });
  assert.deepEqual(end.effects.map(e => [e.actorId, e.amount]), [["a", 2]]);
  assert.equal(end.clash.round, 2);
  // the end of round 4
  let c4 = { ...c2, round: 4 };
  assert.equal(endClashRound(c4, {}).clash.over, "round4");
});

/* ------------------------------------------------------------------ the mission */

test("start: Limit by party size, Team Captain's Edge, Exposed starts at Scent 1, set-up effects", () => {
  assert.equal(limitFor(missionById("petshop"), 3), 7);
  assert.equal(limitFor(missionById("petshop"), 5), 5);
  assert.equal(limitFor(missionById("petshop"), 2), 7, "smaller groups use the 3-player Limit");
  assert.equal(limitFor(missionById("petshop"), 6), 5);
  const W = world();
  W.start();
  assert.equal(W.state.status, "scout");
  assert.equal(W.state.limit, 6);
  assert.equal(W.state.edges, 1, "Team Captain");
  assert.equal(W.effects.filter(e => e.type === "prepare").length, 4);
  const W2 = world();
  W2.start(PARTY.map(p => ({ ...p, exposed: p.id === "maya" })));
  assert.equal(W2.state.scent, 1);
  const W3 = world();
  W3.state.campaign.exposedNext = true;
  W3.start();
  assert.equal(W3.state.scent, 1, "only 1, however many were Exposed");
  W3.roll("priya", "fail", { context: "scout" });
  assert.equal(W3.state.scent, 1, "a poor scouting roll's Scent 1 doesn't add to Exposed's");
});

test("§10 scouting: Critical 2 Edges (max 2), Partial Scent 1, Fail the Storyteller picks", () => {
  for (const [res, edges, scent, picks] of [["crit", 2, 0, "team"], ["success", 2, 0, "team"], ["partial", 1, 1, "team"], ["fail", 1, 1, "storyteller"]]) {
    const W = world();
    W.start();
    W.roll("priya", res, { context: "scout" });
    assert.equal(W.state.status, "way");
    assert.equal(W.state.edges, edges, res);
    assert.equal(W.state.scent, scent, res);
    assert.equal(W.state.wayPick, picks);
  }
});

test("point obstacles: progress adds up, Partial/Fail raise Scent, Critical extra progress or an Edge", () => {
  const W = world();
  W.start();
  W.roll("priya", "success", { context: "scout" });
  W.do(M.chooseWay, 1);                       // the skylight: point, progress 2
  const ob = M.currentObstacle(W.state);
  assert.equal(ob.id, "skylight");
  W.roll("priya", "partial");
  assert.equal(W.state.progress[ob.uid].points, 1);
  assert.equal(W.state.scent, 1);
  W.roll("priya", "fail");
  assert.equal(W.state.progress[ob.uid].points, 1);
  assert.equal(W.state.scent, 2);
  W.roll("priya", "crit");                    // the extra isn't needed: an Edge (already 2, so lost)
  assert.equal(W.state.progress[ob.uid].points, 2);
  assert.equal(W.state.edges, 2);
  assert.equal(W.state.progress[ob.uid].ended, true, "cleared and ended");
  // the same roll applied twice changes nothing (one event, one rise)
  const before = structuredClone(W.state);
  const r = M.applyRoll(W.state, { messageId: "m3", actorId: "priya", result: "fail", missionId: "mission1", context: "obstacle", obstacleUid: ob.uid }, {});
  assert.deepEqual(r.state.scent, before.scent);
  // next: the shop floor (group, guarded by a Beater)
  W.do(M.nextObstacle, W.list());
  assert.equal(M.currentObstacle(W.state).id, "floor");
});

test("a Critical's extra progress when it's needed; a Push for a Critical adds only the difference", () => {
  const W = world();
  W.start();
  W.do(M.chooseWay, 1);
  const ob = M.currentObstacle(W.state);
  W.roll("priya", "crit");
  assert.equal(W.state.progress[ob.uid].points, 2, "1 progress + 1 extra");
  const W2 = world();
  W2.start();
  W2.do(M.chooseWay, 1);
  const ob2 = M.currentObstacle(W2.state);
  W2.roll("priya", "success");
  const mid = `m${W2.n}`;
  W2.do(M.applyRoll, { messageId: mid, actorId: "priya", result: "crit", missionId: "mission1", context: "obstacle", obstacleUid: ob2.uid }, {});
  assert.equal(W2.state.progress[ob2.uid].points, 2, "the upgrade adds the extra progress once");
  W2.do(M.applyRoll, { messageId: mid, actorId: "priya", result: "crit", missionId: "mission1", context: "obstacle", obstacleUid: ob2.uid }, {});
  assert.equal(W2.state.progress[ob2.uid].points, 2);
  // the last roll at a group obstacle Pushed into a Critical after it ended: still an Edge
  const W3 = world();
  W3.start();
  W3.do(M.chooseWay, 0);
  const ob3 = M.currentObstacle(W3.state);
  W3.state.edges = 0;
  for (const id of ["maya", "theo", "priya", "jonah"]) W3.roll(id, "success");
  assert.equal(W3.state.progress[ob3.uid].ended, true);
  W3.do(M.applyRoll, { messageId: `m${W3.n}`, actorId: "jonah", result: "crit", missionId: "mission1", context: "obstacle", obstacleUid: ob3.uid }, {});
  assert.equal(W3.state.edges, 1);
});

test("group obstacles: Scent once when it ends; rounds from the third cost; Escape Partials are free", () => {
  const W = world();
  W.start();
  W.do(M.chooseWay, 0);                       // the coal chute: group
  const ob = M.currentObstacle(W.state);
  W.roll("maya", "partial"); W.roll("theo", "fail"); W.roll("priya", "fail"); W.roll("jonah", "success");
  assert.equal(W.state.scent, 0, "no Scent until it ends");
  W.do(M.endRound, W.list());
  W.roll("theo", "fail"); W.roll("priya", "success");
  W.do(M.endRound, W.list());
  assert.equal(W.state.scent, 0);
  W.roll("theo", "fail");
  W.do(M.endRound, W.list());                 // end of round 3, Theo still not past: +1
  assert.equal(W.state.scent, 1);
  W.roll("theo", "partial");                  // everyone past: the obstacle ends: +1 once
  assert.equal(W.state.progress[ob.uid].ended, true);
  assert.equal(W.state.scent, 2);
  // the Escape: Partials cost nothing; a Fail counts
  const E = world();
  E.start();
  E.do(M.chooseWay, 0);
  E.state.objectiveDone = true;
  E.do(M.startEscape, E.list());
  assert.equal(E.state.status, "escape");
  E.roll("maya", "partial"); E.roll("theo", "partial"); E.roll("priya", "success"); E.roll("jonah", "partial");
  assert.equal(E.state.scent, 0);
  assert.equal(E.state.status, "done");
  assert.equal(E.state.result, "win");
});

test("dangerous obstacles: a Fail deals 1 Hurt; Down at a group obstacle gets up past it", () => {
  const W = world("zoo");
  W.start();
  W.do(M.chooseWay, 1);                       // the river culvert: dangerous group
  W.roster.maya.hurt = 2;
  W.roll("maya", "fail");
  assert.equal(W.roster.maya.down, true);
  W.roll("theo", "success"); W.roll("priya", "success"); W.roll("jonah", "success");
  // everyone standing is past: the scene ends, Maya gets back up with 2 Hurt
  assert.equal(W.roster.maya.down, false);
  assert.equal(W.roster.maya.hurt, 2);
  assert.equal(W.state.scent, 1);
});

test("guarded group obstacle: a Fail starts a Clash at the end of the round; the obstacle's rise first, then the Clash's (§6, as simulated)", () => {
  const W = world("zoo");
  W.start();
  W.do(M.chooseWay, 0);
  for (let i = 0; i < 3; i++) W.do(M.nextObstacle, W.list()); // to the Hound patrol
  W.state.scent = 0; W.state.ledger = [];
  const ob = M.currentObstacle(W.state);
  assert.equal(ob.id, "patrol");
  W.roll("maya", "fail");                      // Lucía fails to sneak past: two Hounds turn
  assert.equal(W.state.clash, null, "the round's other rolls come first");
  W.do(M.endRound, W.list());
  assert.ok(W.state.clash, "a Clash");
  assert.deepEqual(W.state.clash.participants.sort(), W.list().map(r => r.id).sort(), "the whole team is in it");
  assert.equal(W.state.clash.threats.length, 2);
  const [h1, h2] = W.state.clash.threats.map(t => t.id);
  W.roll("priya", "success", { action: "distract", threatId: h1 });
  W.roll("jonah", "success", { action: "strike", threatId: h1, distracted: true });
  W.roll("theo", "partial", { action: "strike", threatId: h2 });
  W.roll("maya", "success", { action: "strike", threatId: h1 });
  assert.equal(W.roster.theo.hurt, 1, "the Hound bites back");
  assert.deepEqual(M.unattendedThreats(W.state), []);
  W.do(M.endClashRound, {}, W.list());
  W.roll("jonah", "crit", { action: "strike", threatId: h2 });
  W.roll("maya", "success", { action: "strike", threatId: h1 });
  assert.equal(W.state.clash, null, "every threat out: the Clash ends");
  const causes = W.state.ledger.map(e => [e.cause, e.rose]);
  assert.deepEqual(causes, [["group", 1], ["clash", 1]], "the lawn raises Scent by 1 before the Clash, then the Clash by 1");
  assert.equal(W.state.progress[ob.uid].ended, true, "beating the guards clears it");
});

test("a guarded point objective still needs progress after the Clash; Down in a Clash makes it +2", () => {
  const W = world("zoo");
  W.start();
  W.do(M.chooseWay, 0);
  for (let i = 0; i < 4; i++) W.do(M.nextObstacle, W.list());
  const ob = M.currentObstacle(W.state);
  assert.equal(ob.id, "crates");
  W.state.ledger = []; W.state.scent = 0;
  W.roll("priya", "fail");
  assert.ok(W.state.clash);
  const [t1, t2] = W.state.clash.threats.map(t => t.id);
  W.roster.theo.hurt = 2;
  W.roll("theo", "fail", { action: "strike", threatId: t1 });   // a Trapper's Fail: Netted
  assert.equal(W.roster.theo.netted, true);
  W.do(M.endClashRound, { [t2]: "maya" }, W.list());           // nobody rolled against the other Trapper: it hurts Maya
  assert.equal(W.roster.maya.hurt, 1);
  W.roster.jonah.hurt = 2;
  W.roll("jonah", "partial", { action: "strike", threatId: t2 }); // Jonah goes Down
  assert.equal(W.roster.jonah.down, true);
  W.roll("maya", "crit", { action: "strike", threatId: t1 });
  W.roll("priya", "crit", { action: "strike", threatId: t2 });
  assert.equal(W.state.clash, null);
  assert.deepEqual(W.state.ledger.map(e => [e.cause, e.rose]), [["roll", 1], ["clash", 2]], "someone went Down: +2");
  assert.equal(W.roster.theo.netted, false, "freed at the end of the scene");
  assert.equal(W.roster.jonah.down, false); assert.equal(W.roster.jonah.hurt, 2);
  assert.equal(W.state.progress[ob.uid].ended, false, "progress is still needed");
  W.roll("priya", "success"); W.roll("priya", "success"); W.roll("priya", "success");
  assert.equal(W.state.objectiveDone, true);
  assert.equal(W.state.clash, null, "the guards don't come back");
});

test("Ch 5 example: a Partial that finishes the objective and brings the Hunt Up: the job is done first", () => {
  const W = world();
  W.start();
  W.do(M.chooseWay, 1);
  for (let i = 0; i < 3; i++) W.do(M.nextObstacle, W.list());
  const ob = M.currentObstacle(W.state);
  assert.equal(ob.id, "cages");
  W.state.scent = 5;
  W.state.progress[ob.uid].points = 2;
  W.roll("priya", "partial");
  assert.equal(W.state.objectiveDone, true);
  assert.equal(W.state.huntUp, true);
  assert.equal(W.state.huntUpChoice, null, "the objective is done: no choice to make");
  // In the Escape every Fail now means Taken
  W.do(M.startEscape, W.list());
  W.roll("maya", "fail");
  assert.equal(W.roster.maya.taken, true);
  W.roll("theo", "success"); W.roll("priya", "success"); W.roll("jonah", "success");
  assert.equal(W.state.status, "done");
  assert.equal(W.state.result, "costly");
});

test("§8 the Hunt is Up before the objective: Fails are Taken, no more Clashes, press on or Withdraw", () => {
  const W = world();
  W.start();
  W.do(M.chooseWay, 0);
  W.do(M.nextObstacle, W.list());               // the shop floor (guarded group)
  W.state.scent = 5;
  W.do(M.adjustScent, 1);
  assert.equal(W.state.huntUp, true);
  assert.equal(W.state.huntUpChoice, "pending");
  assert.equal(M.suggestPressOn(W.state), "withdraw", "not working on the objective yet");
  W.roll("maya", "fail");
  assert.equal(W.roster.maya.taken, true);
  assert.equal(W.state.clash, null, "a guarded Fail doesn't start a Clash any more");
  W.do(M.withdraw, W.list());
  assert.equal(W.state.status, "escape");
  assert.equal(W.state.huntUpChoice, "withdraw");
  W.roll("theo", "success"); W.roll("priya", "success"); W.roll("jonah", "success");
  assert.equal(W.state.result, "loss");
  // wrap up: the Hunt track +2, Growth for everyone
  W.do(M.finishMission, W.list());
  assert.equal(W.state.campaign.huntTrack, 2);
  assert.equal(W.effects.filter(e => e.type === "growth").length, 4);
  assert.equal(W.state.campaign.exposedNext, true, "Maya was Taken, so Exposed");
  // the next mission starts at Scent 1, keeps the Hunt track
  W.do(M.closeMission);
  W.start();
  assert.equal(W.state.scent, 1);
  assert.equal(W.state.campaign.huntTrack, 2);
});

test("Down or Netted at scene end with the Hunt Up are Taken; everyone down at once is a Loss", () => {
  const W = world();
  W.start();
  W.do(M.chooseWay, 0);
  W.roster.maya.down = true;
  W.state.huntUp = true;
  W.do(M.nextObstacle, W.list());
  assert.equal(W.roster.maya.taken, true);
  const A = world();
  A.start();
  A.do(M.chooseWay, 1);
  for (const id of ["maya", "theo", "priya"]) A.roster[id].down = true;
  A.roster.jonah.hurt = 2;
  A.roll("jonah", "fail");                      // not dangerous: no Hurt; still standing
  assert.equal(A.state.status, "in");
  A.roster.jonah.netted = true;
  A.settle();
  assert.equal(A.state.status, "done");
  assert.equal(A.state.result, "loss");
  assert.ok(Object.values(A.roster).every(r => r.taken));
});

test("the prize: carried out, dropped by a shift, lost with a Taken carrier", () => {
  const W = world("gala");
  W.start();
  W.do(M.chooseWay, 1);
  W.do(M.nextObstacle, W.list()); W.do(M.nextObstacle, W.list()); W.do(M.nextObstacle, W.list());
  const ob = M.currentObstacle(W.state);
  assert.equal(ob.id, "case");
  W.state.progress[ob.uid].points = 2;
  W.roll("priya", "success");
  assert.equal(W.state.carrier, "priya");
  W.do(M.recordShift, { actorId: "priya", eventId: "s1", toForm: "animal" });
  assert.equal(W.state.carrier, null); assert.equal(W.state.prizeDropped, true);
  W.do(M.setCarrier, "theo");
  W.roster.theo.taken = true;
  W.settle();
  assert.equal(W.state.prizeLost, true);
  W.do(M.startEscape, W.list());
  for (const id of ["maya", "priya", "jonah"]) W.roll(id, "success");
  W.do(M.nextObstacle, W.list());
  for (const id of ["maya", "priya", "jonah"]) W.roll(id, "success");
  assert.equal(W.state.result, "loss", "the prize was lost");
});

test("shifts: in a Clash the Clash rises by 2 and you're Exposed; watched missions cost +1 outside", () => {
  const W = world();
  W.start();
  W.do(M.chooseWay, 0);
  W.do(M.nextObstacle, W.list());
  W.state.scent = 0; W.state.ledger = [];
  W.roll("maya", "fail");
  W.do(M.endRound, W.list());
  assert.ok(W.state.clash);
  const before = W.state.scent;                // the shop floor's own +1 came before the Clash
  W.do(M.recordShift, { actorId: "jonah", eventId: "sh1", toForm: "animal" });
  assert.equal(W.roster.jonah.exposed, true);
  assert.equal(W.state.scent, before, "no separate +1 in a Clash");
  const t = W.state.clash.threats[0].id;
  W.roll("jonah", "crit", { action: "strike", threatId: t });
  assert.equal(W.state.clash, null);
  assert.equal(W.state.ledger.find(e => e.cause === "clash").rose, 2);
  const V = world();
  V.start();
  V.do(M.chooseWay, 0);
  V.do(M.recordShift, { actorId: "maya", eventId: "sh2", toForm: "animal" });
  assert.equal(V.state.scent, 0, "between obstacles a shift is out of sight");
  V.do(M.setWatched, true);
  V.do(M.recordShift, { actorId: "maya", eventId: "sh3", toForm: "animal" });
  assert.equal(V.state.scent, 1);
  assert.equal(V.roster.maya.exposed, true);
});

test("custom missions (Ch 12) are checked and filled in", async () => {
  const { validateMission, blankMission } = await import("../module/logic/missions.mjs");
  const ok = validateMission(blankMission());
  assert.deepEqual(ok.problems, []);
  assert.equal(ok.mission.objective.kind, "point");
  const bad = validateMission({ waysIn: [[{ name: "Door", kind: "swing", tags: ["shiny"], approaches: { charm: 2, wits: 9 } }]], escape: [], limit: { 3: 7 } });
  assert.ok(bad.problems.some(p => /two ways in/.test(p)));
  assert.ok(bad.problems.some(p => /kind must be/.test(p)));
  assert.ok(bad.problems.some(p => /unknown tag "shiny"/.test(p)));
  assert.ok(bad.problems.some(p => /unknown approach "charm"/.test(p)));
  assert.ok(bad.problems.some(p => /Difficulty must be 1 to 6/.test(p)));
  assert.ok(bad.problems.some(p => /Escape needs/.test(p)));
  assert.ok(bad.problems.some(p => /Limit for 4 players/.test(p)));
});

test("On the Trail: an Escape obstacle at +1 Difficulty when it begins at half the Limit", () => {
  const W = world();
  W.start();
  W.do(M.chooseWay, 0);
  W.state.objectiveDone = true;
  W.state.scent = 3;                            // Limit 6: half is 3
  W.do(M.startEscape, W.list());
  const v = M.obstacleView(W.state);
  assert.equal(v.trail, true);
  assert.deepEqual(v.approaches, { sneak: 3, move: 3 });
  assert.deepEqual(v.baseApproaches, { sneak: 2, move: 2 });
});

test("automation off: Scent is suggested, not applied; the Storyteller applies it with one click", () => {
  const W = world();
  W.start();
  W.do(M.chooseWay, 1);
  const ob = M.currentObstacle(W.state);
  const r = M.applyRoll(W.state, { messageId: "x1", actorId: "priya", result: "partial", missionId: "mission1", context: "obstacle", obstacleUid: ob.uid }, { auto: { scent: false } });
  assert.equal(r.state.scent, 0);
  assert.deepEqual(r.skipped, ["scent"]);
  assert.equal(r.state.progress[ob.uid].points, 1);
  const again = M.applyRoll(r.state, { messageId: "x1", actorId: "priya", result: "partial", missionId: "mission1", context: "obstacle", obstacleUid: ob.uid }, { auto: { scent: false }, force: ["scent"] });
  assert.equal(again.state.scent, 1);
  assert.equal(again.state.progress[ob.uid].points, 1, "progress isn't applied twice");
  const s = M.endRound(M.startObstacle(W.state, 0).state, W.list(), { auto: { scent: false } });
  assert.equal(s.state.suggested.length, 0, "nothing to suggest in round 1");
});

test("the catalog: every mission has two ways in, an objective and an Escape", () => {
  for (const id of ["petshop", "zoo", "mill", "gala", "lodge"]) {
    const m = missionById(id);
    const seq = obstacleSequence(m, 0);
    assert.equal(seq.filter(o => o.objective).length, 1);
    assert.ok(seq.at(-1).section === "escape");
  }
});

test("Hunt track: Win +0, Costly +1, Loss +2, at most 6", () => {
  const W = world();
  W.state.campaign.huntTrack = 5;
  W.start();
  W.do(M.withdraw, W.list());
  assert.equal(W.state.status, "done");
  W.do(M.finishMission, W.list());
  assert.equal(W.state.campaign.huntTrack, 6);
  assert.ok(W.state.log.some(l => l.k === "MG.Log.lastHunt"));
});

test("§7 a Clash nobody is left in: the guards stay, and the next Fail starts a new Clash", () => {
  const W = world("zoo");
  W.start();
  W.do(M.chooseWay, 0);
  for (let i = 0; i < 4; i++) W.do(M.nextObstacle, W.list());   // to the crates: point, guarded by two Trappers
  const ob = M.currentObstacle(W.state);
  assert.equal(ob.id, "crates");
  W.roll("maya", "fail");
  assert.ok(W.state.clash, "a Clash");
  const t = W.state.clash.threats[0].id;
  for (const id of W.state.clash.participants) W.roll(id, "success", { action: "slip", threatId: t });
  assert.equal(W.state.clash, null, "nobody left: the Clash ends");
  assert.equal(W.state.progress[ob.uid].guardsBeaten, false, "the Trappers are still on guard");
  assert.equal(W.state.progress[ob.uid].ended, false);
  W.roll("priya", "fail");
  assert.ok(W.state.clash, "the next Fail starts a new Clash with them");
  assert.equal(M.withdraw(W.state, W.list(), {}).state.withdrawn, false, "no Withdraw in the middle of a Clash");
});
