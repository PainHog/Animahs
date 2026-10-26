/**
 * The system on the fake Foundry: boot, settings, data models (defaults, derived data,
 * validation), the Bonded and threat sheets' _prepareContext and rendering, the Wild pips,
 * Hurt boxes, statuses, Shift, Patch Up, Growth picks and the character builder.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { boot, makeBonded, as, READY } from "../tools/world-fixture.mjs";
import { SETTINGS, SYSTEM_ID, CARD, FLAG } from "../module/contracts.mjs";

const W = await boot();
const { game, users, log, api } = W;

test("boot: settings, data models, sheets, the query handler, the API", () => {
  assert.deepEqual(log.errors, []);
  for (const key of Object.values(SETTINGS)) assert.doesNotThrow(() => game.settings.get(SYSTEM_ID, key), key);
  assert.equal(game.settings.get(SYSTEM_ID, SETTINGS.missionState).status, "idle");
  assert.ok(W.CONFIG.Actor.dataModels.bonded && W.CONFIG.Actor.dataModels.threat);
  const sheets = log.sheets.filter(s => !s.unregister).map(s => [s.options.types[0], s.cls.name, s.options.makeDefault]);
  assert.deepEqual(sheets, [["bonded", "BondedSheet", true], ["threat", "ThreatSheet", true]]);
  assert.equal(typeof W.CONFIG.queries["morphgame.op"], "function");
  assert.equal(game.morphGame, game.morphgame);
  assert.equal(typeof api.openTracker, "function");
});

test("Bonded data: defaults, Wild max, frame from the animal, validation", async () => {
  const blank = await as(users.gm, () => Actor.create({ name: "Blank", type: "bonded" }));
  assert.equal(blank.system.wild.value, 4);
  assert.equal(blank.system.form, "human");
  assert.deepEqual({ ...blank.system.human }, { sneak: 3, force: 2, move: 2, sense: 1, wits: 1 });
  assert.deepEqual(blank.system.problems.map(p => p.code), ["noAnimal", "noPerk"]);
  const sam = await makeBonded("sam", users.p1);
  assert.equal(sam.system.wild.max, 5, "Gamer");
  assert.equal(sam.system.frameKey, "critters");
  assert.deepEqual(sam.system.problems, []);
  // validation: bad data never reaches the document
  await assert.rejects(() => W.asUser(users.gm, () => sam.update({ "system.hurt.value": 4 })), /at most 3/);
  await assert.rejects(() => W.asUser(users.gm, () => sam.update({ "system.animal": "wolf" })), /not a valid choice/);
  // a player can't write somebody else's character
  await assert.rejects(() => W.asUser(users.p2, () => sam.update({ "system.wild.value": 1 })), /lacks permission/);
  await as(users.gm, () => sam.delete?.());
});

test("Bonded sheet context: both rating rows, current form, perks, pips, boxes, statuses, shift", async () => {
  const maya = await makeBonded("maya", users.p1);
  const sheet = new api.apps.BondedSheet({ document: maya });
  const ctx = await W.asUser(users.p1, () => sheet._prepareContext({}));
  assert.equal(ctx.isAnimal, false);
  assert.deepEqual(ctx.ratings.map(r => [r.key, r.human, r.animal, r.now]),
    [["sneak", 3, 4, 3], ["force", 1, 3, 1], ["move", 2, 3, 2], ["sense", 2, 2, 2], ["wits", 1, 0, 1]]);
  assert.equal(ctx.frame.label, "Big Cats");
  assert.equal(ctx.frame.strengths, "Dark, High");
  assert.equal(ctx.frame.weaknesses, "Water, Crowd");
  assert.equal(ctx.animal.perk, "Night Rosettes");
  assert.equal(ctx.perks[0].label, "Hide-and-Seek Champ");
  assert.equal(ctx.wildPips.length, 4);
  assert.equal(ctx.wildPips.filter(p => p.filled).length, 4);
  assert.equal(ctx.hurtBoxes.length, 3);
  assert.deepEqual(ctx.statuses.map(s => s.key), ["down", "netted", "taken", "exposed", "stuck"]);
  assert.equal(ctx.shift.label, "Shift into the Jaguar");
  assert.equal(ctx.shift.disabled, false);
  assert.equal(ctx.hasProblems, false);
  // it renders with every string localized
  await W.asUser(users.p1, () => sheet.render());
  assert.match(sheet.element.innerHTML, /Night Rosettes/);
  assert.deepEqual([...log.missingI18n], []);
  // in animal form the animal row is current and Wits can't be rolled
  await as(users.p1, () => api.shift(maya));
  const ctx2 = await W.asUser(users.p1, () => sheet._prepareContext({}));
  assert.equal(ctx2.isAnimal, true);
  assert.equal(ctx2.ratings.find(r => r.key === "wits").canRoll, false);
  assert.equal(ctx2.ratings.find(r => r.key === "sneak").now, 4);
  assert.equal(maya.system.wild.value, 3, "shifting in costs 1 Wild");
  const card = game.messages.at(-1).flags[FLAG].card;
  assert.equal(card.kind, CARD.shift);
  assert.equal(card.cost, "wild");
});

test("Wild pips, Hurt boxes (Down at 3, Stuck as an animal), statuses, problems", async () => {
  const jonah = await makeBonded("jonah", users.p2);
  const sheet = new api.apps.BondedSheet({ document: jonah });
  await W.asUser(users.p2, () => sheet.render());
  await as(users.p2, () => sheet.runAction("wildPip", { n: "2" }));
  assert.equal(jonah.system.wild.value, 1, "clicking pip 2 of 4 spends down to 1");
  await as(users.p2, () => sheet.runAction("wildPip", { n: "3" }));
  assert.equal(jonah.system.wild.value, 3, "clicking an empty pip restores up to it");
  await as(users.p2, () => api.shift(jonah));
  await as(users.p2, () => sheet.runAction("hurtBox", { n: "3" }));
  assert.equal(jonah.system.hurt.value, 3);
  assert.equal(jonah.system.status.down, true);
  assert.equal(jonah.system.status.stuck, true, "Down in animal form: Stuck");
  // Stuck: can't shift back; Down: can't act
  const before = game.messages.length;
  await as(users.p2, () => api.shift(jonah, "human"));
  assert.equal(game.messages.length, before, "no shift card");
  assert.ok(log.warnings.some(w => /Down: you can't act/.test(w)));
  await as(users.p2, () => sheet.runAction("status", { key: "down" }));
  assert.equal(jonah.system.status.down, false);
  assert.equal(jonah.system.hurt.value, 2, "getting up from Down leaves 2 Hurt");
  // ratings that break 3, 2, 2, 1, 1 are flagged
  await as(users.p2, () => jonah.update({ "system.human.sneak": 3 }));
  const ctx = await W.asUser(users.p2, () => sheet._prepareContext({}));
  assert.ok(ctx.problems.some(p => /3, 2, 2, 1 and 1/.test(p)));
  await as(users.p2, () => jonah.update({ "system.human.sneak": 1 }));
});

test("sheet buttons are for the actor's owners only", async () => {
  const maya = game.actors.find(a => a.name === "Maya Reyes");
  await as(users.gm, () => maya.update({ ownership: { default: 2, [users.p1.id]: 3 } }));   // everyone observes
  const sheet = new api.apps.BondedSheet({ document: maya });
  const before = maya.system.wild.value;
  await as(users.p2, () => sheet.runAction("wildPip", { n: "1" }));
  assert.equal(maya.system.wild.value, before);
  assert.ok(log.warnings.some(w => w.startsWith("Ben") && /That isn't your character/.test(w)));
});

test("shifting with no Wild costs 1 Hurt, unless it would put you Down", async () => {
  const lucia = await makeBonded("lucia", users.p1, { system: { wild: { value: 0, max: 4 } } });
  await as(users.p1, () => api.shift(lucia));
  assert.equal(lucia.system.form, "animal");
  assert.equal(lucia.system.hurt.value, 1);
  await as(users.p1, () => api.shift(lucia));
  assert.equal(lucia.system.form, "human", "shifting back is free");
  await as(users.p1, () => lucia.update({ "system.hurt.value": 2 }));
  await as(users.p1, () => api.shift(lucia));
  assert.equal(lucia.system.form, "human", "refused: it would put her Down");
});

test("Patch Up a friend you don't own goes through the GM; Growth picks; the builder", async () => {
  const theo = await makeBonded("theo", users.p1);
  const priya = await makeBonded("priya", users.p2);
  await as(users.gm, () => priya.update({ "system.hurt.value": 2 }));
  await as(users.p1, () => api.patchUp(theo, priya));
  assert.equal(priya.system.hurt.value, 1);
  assert.equal(theo.system.wild.value, 3);
  // Growth: a pick at 2; +1 rating to at most 3; a second perk
  const sheet = new api.apps.BondedSheet({ document: theo });
  await as(users.p1, () => theo.update({ "system.growth.value": 4 }));
  await as(users.p1, () => sheet.runAction("addPick", { type: "rating", approach: "move" }));
  assert.ok(log.warnings.some(w => /already 3/.test(w)), "Move is already 3");
  await as(users.p1, () => sheet.runAction("addPick", { type: "rating", approach: "sense" }));
  assert.equal(theo.system.human.sense, 2);
  await as(users.p1, () => sheet.runAction("addPick", { type: "wild" }));
  assert.equal(theo.system.wild.max, 5);
  assert.deepEqual(theo.system.problems, [], "a raised rating still validates");
  await as(users.p1, () => sheet.runAction("removePick", { index: "0" }));
  assert.equal(theo.system.human.sense, 1);
  // the builder rolls by the book and never repeats an animal in the world
  const blank = await as(users.gm, () => Actor.create({ name: "New", type: "bonded", ownership: { default: 0, [users.p2.id]: 3 } }));
  const b = new api.apps.CharacterBuilder({ actor: blank });
  W.diceQueue.push(1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1);     // frame 1 (Big Cats), animal 1 → the Jaguar is taken → 1 again, then 6 → Cheetah
  await as(users.p2, () => b.rollAll());
  assert.equal(b.draft.frame, "cats");
  assert.equal(b.draft.animal, "cheetah");
  await as(users.p2, () => b.apply());
  assert.equal(blank.system.animal, "cheetah");
  assert.deepEqual(blank.system.problems, []);
  W.diceQueue.length = 0;
});

test("sheet submit data: the animal sets the frame; a new frame clears an animal that doesn't fit", async () => {
  const { fixFrameAnimal } = await import("../module/sheets/bonded-sheet.mjs");
  const maya = game.actors.find(a => a.name === "Maya Reyes");
  assert.deepEqual(fixFrameAnimal(maya, { system: { frame: "cats", animal: "raven" } }).system, { frame: "birds", animal: "raven" });
  assert.deepEqual(fixFrameAnimal(maya, { system: { frame: "birds", animal: "jaguar" } }).system, { frame: "birds", animal: "" });
});

test("threat sheet: a new kind brings its Table 4 numbers", async () => {
  const t = await as(users.gm, () => Actor.create({ name: "Grey", type: "threat", system: { kind: "beater" } }));
  const { applyKindDefaults } = await import("../module/sheets/threat-sheet.mjs");
  const data = applyKindDefaults(t, { system: { kind: "huntsman" } });
  assert.deepEqual([data.system.difficulty, data.system.toughness, data.system.harm], [3, 4, 2]);
  const sheet = new api.apps.ThreatSheet({ document: t });
  await W.asUser(users.gm, () => sheet.render());
  assert.match(sheet.element.innerHTML, /Difficulty 2, Toughness 2, Harm 1/);
  assert.deepEqual([...log.missingI18n], []);
});

test("the tracker's set-up form: the mission select and the party checkboxes", async () => {
  const tracker = new api.apps.MissionTracker();
  await W.asUser(users.gm, () => tracker.render());
  const select = tracker.element.querySelector("[name=mission]");
  select.value = "mill";
  const boxes = [...tracker.element.querySelectorAll("input[data-party]")];
  for (const b of boxes) b.checked = ["Theo Park", "Priya Shah", "Jonah Mensah"].includes(game.actors.get(b.dataset.party)?.name);
  await as(users.gm, () => tracker.runAction("start"));
  const S = api.getState();
  assert.equal(S.catalogKey, "mill");
  assert.deepEqual(S.party.map(p => p.name).sort(), ["Jonah Mensah", "Priya Shah", "Theo Park"]);
  assert.equal(S.limit, 7, "The Old Mill with 3 players");
  await as(users.gm, () => api.automation.act(api.mission.closeMission));
  assert.equal(api.getState().status, "idle");
});

test("nothing logged an error", () => { assert.deepEqual(log.errors, []); });
