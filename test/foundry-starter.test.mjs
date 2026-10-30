/**
 * End to end on the fake Foundry: import the Starter adventure (its actors and journals
 * with their ids, and the Zoo's scene with its guard tokens, as Foundry's Adventure import
 * does), then play "The Zoo After Dark" from the tracker to the result through the
 * automation: scouting, the way in, every obstacle, a Clash at the Hound patrol that reveals
 * the waiting guards, the crates, the Escape, the result and the campaign step.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { boot, as, state } from "../tools/world-fixture.mjs";
import { FLAG, SYSTEM_ID } from "../module/contracts.mjs";
import { PACKS, readSource, toCliDoc } from "../tools/pack-config.mjs";

const W = await boot();
const { game, users, log, api, diceQueue } = W;
const card = m => m.flags[FLAG].card;
const last = () => game.messages.at(-1);

const adv = toCliDoc(PACKS.find(d => d.file === "starter"), readSource("starter")[0], 0);

/** Foundry's Adventure import keeps every id; the fake has no Adventure class, so do it by hand. */
async function importStarter() {
  const owners = { "Maya Reyes": users.p1, "Priya Shah": users.p1, "Theo Park": users.p2, "Jonah Mensah": users.p2 };
  for (const a of adv.actors) {
    const owner = owners[a.name];
    await as(users.gm, () => Actor.create({ ...structuredClone(a), ownership: { default: 0, ...(owner ? { [owner.id]: 3 } : {}) } }));
  }
  for (const j of adv.journal) game.journal.push({ id: j._id, uuid: `JournalEntry.${j._id}`, name: j.name, flags: j.flags, pages: j.pages });
  const sc = adv.scenes.find(s => s.flags?.[SYSTEM_ID]?.mission === "zoo");
  const tokens = sc.tokens.map(t => ({
    id: t._id, uuid: `Scene.${sc._id}.Token.${t._id}`, name: t.name, hidden: t.hidden, flags: t.flags,
    actor: game.actors.get(t.actorId), async update(d) { Object.assign(this, d); return this; },
  }));
  const made = [];
  const scene = { id: sc._id, name: sc.name, flags: sc.flags, tokens, async createEmbeddedDocuments(type, docs) { made.push(...docs); return []; } };
  globalThis.canvas = { ready: true, scene, grid: { size: 100 }, stage: { pivot: { x: 0, y: 0 } }, tokens: { placeables: [] } };
  game.scenes.viewed = scene;
  return { scene, made };
}

const by = name => game.actors.getName(name);
const userOf = a => (["Maya Reyes", "Priya Shah"].includes(a.name) ? users.p1 : users.p2);
/** One roll with exactly these faces; checks the pool size and the result. */
async function roll(actor, opts, faces, expect) {
  diceQueue.length = 0;
  diceQueue.push(...faces);
  const m = await as(userOf(actor), () => api.performRoll(actor, { helpers: [], edges: 0, tags: [], ...opts }));
  assert.equal(diceQueue.length, 0, `${actor.name}: the pool used exactly ${faces.length} dice`);
  assert.equal(card(m).result, expect, `${actor.name}: ${opts.approach} → ${expect}`);
  return m;
}

test("the Starter imports: 11 actors with portraits, 9 journals, the Zoo's scene with 4 hidden guards", async () => {
  const { scene } = await importStarter();
  assert.equal(game.actors.filter(a => a.type === "bonded").length, 6);
  assert.equal(game.actors.filter(a => a.type === "threat").length, 5);
  assert.match(by("Maya Reyes").img, /assets\/art\/pc-maya\.png$/);
  assert.equal(game.journal.length, 9);
  assert.deepEqual(scene.tokens.map(t => [t.name, t.hidden]), [["Hound", true], ["Hound", true], ["Trapper", true], ["Trapper", true]]);
});

test("a whole mission on the Zoo's scene, from the tracker to the campaign step", async () => {
  const maya = by("Maya Reyes"), theo = by("Theo Park"), priya = by("Priya Shah"), jonah = by("Jonah Mensah");
  const party = [maya, theo, priya, jonah];
  const tracker = new api.apps.MissionTracker();
  const ctx = await W.asUser(users.gm, () => tracker._prepareContext({}));
  assert.equal(ctx.setup.missions.find(m => m.selected)?.key, "zoo", "the scene's mission is chosen");
  await as(users.gm, () => tracker.runAction("start", { mission: "zoo", party: party.map(a => a.id).join(",") }));
  let S = state();
  assert.equal(S.name, "The Zoo After Dark");
  assert.equal(S.limit, 8);
  assert.equal(S.journalUuid, `JournalEntry.${adv.journal.find(j => j.flags?.[SYSTEM_ID]?.mission === "zoo")._id}`, "linked to the imported journal");
  assert.equal(S.edges, 1, "Theo is Team Captain");

  // scouting: Priya, Sense 2 as a kid
  await roll(priya, { context: "scout", approach: "sense", difficulty: 2 }, [5, 6], "success");
  assert.equal(state().edges, 2);
  await as(users.gm, () => api.automation.act(api.mission.chooseWay, 0));                // the perimeter fence
  const fence = { context: "obstacle", approach: "move", difficulty: 2, tags: ["open", "high"] };
  await roll(maya, fence, [5, 5], "success");
  await roll(theo, fence, [5, 5, 1], "success");
  await roll(priya, fence, [6, 5], "success");
  await roll(jonah, fence, [5, 5], "success");
  await as(users.gm, () => api.automation.advance(api.mission.nextObstacle));            // find the Trappers: point, 2
  assert.equal(api.mission.currentObstacle(state()).id, "find");
  const find = { context: "obstacle", approach: "sense", difficulty: 2, tags: ["high", "open", "dark"] };
  await roll(priya, find, [5, 5], "success");
  await roll(priya, find, [5, 5], "success");
  await as(users.gm, () => api.automation.advance(api.mission.nextObstacle));            // the staff gate: talk your way in
  const gate = { context: "obstacle", approach: "wits", difficulty: 2 };
  await roll(theo, gate, [5, 5], "success");
  await roll(priya, gate, [5, 5, 1, 1], "success");                                     // Wits 3 + Brainiac
  await roll(jonah, gate, [5, 6], "success");
  await roll(maya, gate, [5], "partial");                                               // Wits 1: past, at a cost
  await as(users.gm, () => api.automation.advance(api.mission.nextObstacle));            // the Hound patrol, guarded
  assert.equal(state().scent, 1, "the staff gate's one rise for Maya's Partial");
  assert.equal(api.mission.currentObstacle(state()).id, "patrol");

  // Maya's Sneak fails (Sneak 3 + Hide-and-Seek, against 2 + the Hounds' Tracker); the rest get past
  await as(users.gm, () => maya.update({ "system.wild.value": 0 }));                    // nothing to Push with: final at once
  const m = await roll(maya, { context: "obstacle", approach: "sneak", difficulty: 2, tags: ["open", "dark"] }, [1, 2, 3, 4], "fail");
  assert.equal(card(m).difficulty, 3);
  const move = { context: "obstacle", approach: "move", difficulty: 2, tags: ["open", "dark"] };
  await roll(theo, move, [5, 5, 1], "success");
  await roll(priya, move, [5, 5], "success");
  await roll(jonah, move, [6, 5], "success");
  assert.equal(state().clash, null, "the round's rolls come first");
  await as(users.gm, () => api.endRound());
  S = state();
  assert.ok(S.clash, "End Round starts the Clash");
  assert.equal(S.scent, 2, "the patrol's rise for the Fail comes first");
  const patrolTokens = canvas.scene.tokens.filter(t => t.flags[SYSTEM_ID].guard.obstacle === "patrol");
  assert.deepEqual(S.clash.threats.map(t => t.tokenUuid), patrolTokens.map(t => t.uuid), "the waiting Hounds, revealed");
  assert.deepEqual(canvas.scene.tokens.map(t => t.hidden), [false, false, true, true], "the Trappers still wait at the dock");
  assert.deepEqual(S.clash.participants.sort(), party.map(a => a.id).sort(), "the whole team is in it");

  // the Clash: Jonah's Critical and Theo's Success put the first Hound out; Priya strikes the second
  const [h1, h2] = S.clash.threats.map(t => t.id);
  const strike = threatId => ({ context: "clash", action: "strike", threatId, approach: "force", difficulty: 2 });
  await roll(jonah, strike(h1), [6, 6, 1, 1], "crit");                                  // Force 3 + Football Player
  await roll(theo, strike(h1), [5, 5], "success");
  await roll(priya, strike(h2), [5], "partial");                                        // a hit back for 1 Hurt
  await as(users.gm, () => api.endRound());
  await roll(jonah, strike(h2), [6, 6, 2, 3], "crit");
  S = state();
  assert.equal(S.clash, null, "every Hound out: the Clash ends");
  assert.equal(S.scent, 3, "the Clash's own rise");
  assert.equal(priya.system.hurt.value, 1);

  // the crates: three progress with clever hands, no Fail, so the Trappers never turn
  await as(users.gm, () => api.automation.advance(api.mission.nextObstacle));
  assert.equal(api.mission.currentObstacle(state()).id, "crates");
  const crates = { context: "obstacle", approach: "wits", difficulty: 2, tags: ["locked"] };
  for (let i = 0; i < 3; i++) await roll(priya, crates, [5, 5, 1, 1], "success");
  assert.equal(state().objectiveDone, true);

  // the Escape across the moat
  await as(users.gm, () => api.automation.advance(api.mission.startEscape));
  const moat = { context: "obstacle", approach: "move", difficulty: 2, tags: ["water", "open"] };
  await roll(maya, moat, [5, 5], "success");
  await roll(theo, moat, [5, 5, 1], "success");
  await roll(priya, moat, [5, 6], "success");
  await roll(jonah, moat, [5, 5], "success");
  S = state();
  assert.equal(S.result, "win");
  assert.equal(S.scent, 3);
  await as(users.gm, () => api.automation.finishMission());
  S = state();
  assert.equal(S.campaign.huntTrack, 0, "a Win doesn't move the Hunt track");
  assert.ok(party.every(a => a.system.growth.value === 1), "everyone marks 1 Growth");
  assert.deepEqual([...log.missingI18n], []);
  assert.deepEqual(log.errors, []);
});
