/**
 * The Starter adventure's scenes on the fake Foundry: on a mission's scene the Mission
 * Tracker offers that mission first, and a Clash reveals the guards already waiting on the
 * map beside their obstacle instead of making new tokens.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { boot, as, state } from "../tools/world-fixture.mjs";
import { SETTINGS, SYSTEM_ID } from "../module/contracts.mjs";

const W = await boot();
const { game, users, api, diceQueue } = W;
const make = (name, owner, system) => as(users.gm, () => Actor.create({ name, type: "bonded", ownership: { default: 0, [owner.id]: 3 }, system: { form: "animal", ...system } }));
const leo = await make("Leo", users.p1, { animal: "snowleopard", frame: "cats", perk: "scout", human: { sneak: 3, force: 2, move: 2, sense: 1, wits: 1 } });
const bo = await make("Bo", users.p2, { animal: "bison", frame: "heavies", perk: "scout" });
await as(users.gm, () => game.settings.set(SYSTEM_ID, SETTINGS.threatTargets, "random"));

test("on a mission's scene, the tracker offers that mission first", async () => {
  game.scenes.viewed = { flags: { [SYSTEM_ID]: { mission: "zoo" } } };
  const tracker = new api.apps.MissionTracker();
  const ctx = await W.asUser(users.gm, () => tracker._prepareContext({}));
  assert.deepEqual(ctx.setup.missions.filter(m => m.selected).map(m => m.key), ["zoo"]);
  game.scenes.viewed = null;
  const none = await W.asUser(users.gm, () => tracker._prepareContext({}));
  assert.equal(none.setup.missions.some(m => m.selected), false, "no scene: nothing preselected");
});

test("a Clash reveals the hidden guards waiting beside their obstacle", async () => {
  const hound = await as(users.gm, () => Actor.create({ name: "Hound", type: "threat", system: { kind: "hound", difficulty: 2, toughness: 3, harm: 1 } }));
  const token = (id, obstacle) => ({
    id, uuid: `Scene.lodge.Token.${id}`, hidden: true, actor: hound,
    flags: { [SYSTEM_ID]: { guard: { mission: "lodge", obstacle, n: 0 } } },
    async update(d) { Object.assign(this, d); return this; },
  });
  const waiting = [token("h1", "deerpark"), token("h2", "deerpark"), token("k1", "kennels")];
  const made = [];
  globalThis.canvas = { ready: true, scene: { tokens: waiting, async createEmbeddedDocuments(type, docs) { made.push(...docs); return []; } }, grid: { size: 100 }, stage: { pivot: { x: 0, y: 0 } }, tokens: { placeables: [] } };
  try {
    await as(users.gm, () => api.startMission({ missionKey: "lodge", actorIds: [leo.id, bo.id] }));
    await as(users.gm, () => api.automation.act(api.mission.chooseWay, 0));          // the deer park: two Hounds
    await as(users.gm, () => leo.update({ "system.wild.value": 0 }));
    diceQueue.push(1, 1, 1, 1, 1);
    await as(users.p1, () => api.performRoll(leo, { context: "obstacle", approach: "sneak", difficulty: 2, tags: ["open", "dark"], helpers: [], edges: 0 }));
    await as(users.gm, () => api.endRound());
    const S = state();
    assert.ok(S.clash, "a Clash");
    assert.deepEqual(S.clash.threats.map(t => t.tokenUuid), ["Scene.lodge.Token.h1", "Scene.lodge.Token.h2"], "the two deer-park Hounds, not new tokens");
    assert.deepEqual(waiting.map(t => t.hidden), [false, false, true], "revealed; the kennels' Hound still waits");
    assert.equal(made.length, 0, "no tokens made");
  } finally {
    globalThis.canvas = { ready: false, scene: null, grid: null, tokens: { placeables: [] } };
  }
});
