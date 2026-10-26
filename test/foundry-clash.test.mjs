/**
 * Clashes on the fake Foundry: threats from the guards, the roll dialog against a threat
 * (Snow Leopard's Ambush, Python's Coil, Distract), Moose's Antler Sweep button, Bison's
 * Shaggy Coat taking 1 Hurt less, a Trapper's Net and freeing a friend, the end of round 4,
 * and Down and Netted friends at the end of the scene.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { boot, as, state } from "../tools/world-fixture.mjs";
import { FLAG, SETTINGS, SYSTEM_ID } from "../module/contracts.mjs";

const W = await boot();
const { game, users, log, api, diceQueue, renderMessage, clickButton, buttonLabels } = W;
const card = m => m.flags[FLAG].card;
const last = () => game.messages.at(-1);
const make = (name, owner, system) => as(users.gm, () => Actor.create({ name, type: "bonded", ownership: { default: 0, [owner.id]: 3 }, system: { form: "animal", ...system } }));

const leo = await make("Leo", users.p1, { animal: "snowleopard", frame: "cats", perk: "scout", human: { sneak: 3, force: 2, move: 2, sense: 1, wits: 1 } });
const mo = await make("Mo", users.p1, { animal: "moose", frame: "heavies", perk: "scout" });
const bo = await make("Bo", users.p2, { animal: "bison", frame: "heavies", perk: "scout" });
const py = await make("Py", users.p2, { animal: "python", frame: "reptiles", perk: "scout" });
const party = [leo, mo, bo, py];
await as(users.gm, () => game.settings.set(SYSTEM_ID, SETTINGS.threatTargets, "random"));

const strike = async (actor, user, threatId, faces, extra = {}) => {
  diceQueue.length = 0;
  diceQueue.push(...faces);
  const m = await as(user, () => api.performRoll(actor, { context: "clash", action: "strike", threatId, approach: "force", difficulty: 2, tags: [], helpers: [], edges: 0, ...extra }));
  diceQueue.length = 0;                          // faces beyond the pool are not used
  return m;
};

test("a guarded Fail at the Lodge's deer park: two Hounds, rolled against with the right numbers", async () => {
  await as(users.gm, () => api.startMission({ missionKey: "lodge", actorIds: party.map(a => a.id) }));
  await as(users.gm, () => api.automation.act(api.mission.chooseWay, 0));
  for (const a of party) await as(users.gm, () => a.update({ "system.form": "animal" }));
  await as(users.gm, () => leo.update({ "system.wild.value": 0 }));
  diceQueue.push(1, 1, 1, 1, 1);                // Leo sneaks (Sneak 4 + Dark Strength, Tracker +1): a Fail
  const roll = await as(users.p1, () => api.performRoll(leo, { context: "obstacle", approach: "sneak", difficulty: 2, tags: ["open", "dark"], helpers: [], edges: 0 }));
  assert.equal(card(roll).difficulty, 3, "a Hound's Tracker: +1 Difficulty to Sneak");
  assert.match(last().content, /A Clash!/);
  const S = state();
  assert.ok(S.clash);
  assert.deepEqual(S.clash.threats.map(t => [t.key, t.diff, t.tough, t.harm]), [["hound", 2, 3, 1], ["hound", 2, 3, 1]]);
  // the dialog against a Hound: Ambush for the snow leopard's first Strike
  const dlg = new api.apps.RollDialog({ actor: leo, approach: "force" });
  const ctx = await W.asUser(users.p1, () => dlg._prepareContext({}));
  assert.equal(ctx.isClash, true);
  assert.ok(ctx.mods.some(m => /Ambush/.test(m.text)));
  assert.equal(ctx.plan.difficulty, 1);
});

test("Python's Coil, then Antler Sweep on a Hound", async () => {
  let S = state();
  const [h1, h2] = S.clash.threats.map(t => t.id);
  await strike(py, users.p2, h1, [5, 5, 1, 1]);   // Force 3 + Dark Strength: a Success, 1 harm, Coil
  S = state();
  assert.equal(S.clash.threats[0].harmTaken, 1);
  assert.equal(S.clash.threats[0].coiled, true);
  const dlg = new api.apps.RollDialog({ actor: mo, approach: "force", threatId: h1 });
  const ctx = await W.asUser(users.p1, () => dlg._prepareContext({}));
  assert.ok(ctx.mods.some(m => /Coiled/.test(m.text)), "the next roll against it is at −1 Difficulty");
  await strike(mo, users.p1, h1, [5, 1, 1, 1, 1], { threatId: h1 });
  assert.equal(card(last()).coiled, true);
  assert.equal(card(last()).difficulty, 1, "Coil: Difficulty 2 − 1");
  const m = last();
  assert.equal(card(m).result, "success");
  assert.ok(buttonLabels(m, users.p1).includes("Antler Sweep: it's out"));
  clickButton(renderMessage(m, users.p1), "Antler Sweep", users.p1);
  await W.settle();
  S = state();
  assert.equal(S.clash.threats[0].out, true, "Antler Sweep: out at once");
  assert.equal(S.clash.threats[0].coiled, false);
  // once per scene
  await strike(mo, users.p1, h2, [5, 1, 1, 1, 1]);
  assert.equal(buttonLabels(last(), users.p1).includes("Antler Sweep: it's out"), false);
});

test("Bison's Shaggy Coat: the first Hurt each scene is 1 less; unattended threats strike at End Round", async () => {
  let S = state();
  const h2 = S.clash.threats[1].id;
  await as(users.gm, () => bo.update({ "system.wild.value": 0 }));
  await strike(bo, users.p2, h2, [1, 1, 1, 1, 1]);   // a Fail: the Hound's Harm 1, the Coat takes it
  assert.equal(bo.system.hurt.value, 0);
  assert.ok(game.messages.some(x => /Shaggy Coat takes 1 Hurt less/.test(x.content)));
  await strike(bo, users.p2, h2, [1, 1, 1, 1, 1]);
  assert.equal(bo.system.hurt.value, 1, "once per scene");
  // End Round: both threats were rolled against this round — nobody unattended
  await as(users.gm, () => api.endRound());
  S = state();
  assert.equal(S.clash.round, 2);
  const hurtBefore = party.reduce((n, a) => n + a.system.hurt.value, 0);
  await as(users.gm, () => api.endRound());       // round 2: nobody rolled: the Hound hits someone
  const hurtAfter = party.reduce((n, a) => n + a.system.hurt.value, 0);
  assert.equal(hurtAfter, hurtBefore + 1);
  assert.equal(state().clash.round, 3);
});

test("the end of round 4: the Clash ends, the Hounds pull back, Scent +2, the obstacle is cleared", async () => {
  const before = state().scent;
  await as(users.gm, () => api.endRound());
  await as(users.gm, () => api.endRound());
  const S = state();
  assert.equal(S.clash, null);
  const clash = S.ledger.find(e => e.cause === "clash");
  assert.equal(clash.rose, 2, "it reached round 4");
  assert.ok(S.scent >= before + 2);
  assert.equal(S.progress[api.mission.currentObstacle(S).uid].ended, true);
});

test("a Trapper's Net, freeing a friend through the GM, and Netted at the end of the scene", async () => {
  await as(users.gm, () => api.automation.startClash(["trapper"]));
  const S = state();
  const t = S.clash.threats[0].id;
  await as(users.gm, () => py.update({ "system.wild.value": 0 }));
  await strike(py, users.p2, t, [1, 1, 1, 1]);
  assert.equal(py.system.status.netted, true, "a Fail against a Trapper: Netted, not Hurt");
  // Ana (Mo's player) frees Ben's Python: a GM operation
  await as(users.p1, () => api.freeNetted(mo, py));
  assert.equal(py.system.status.netted, false);
  await strike(py, users.p2, t, [1, 1, 1, 1]);
  assert.equal(py.system.status.netted, true);
  // the Clash ends with a friend standing and the Hunt not Up: freed at the end of the scene
  await as(users.gm, () => api.automation.endClash());
  assert.equal(py.system.status.netted, false);
  assert.equal(state().clash, null);
});

test("nothing logged an error", () => { assert.deepEqual(log.errors, []); assert.deepEqual([...log.missingI18n], []); });
