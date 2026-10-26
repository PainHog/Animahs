/**
 * Character rules (module/logic/character.mjs): §11 Making a character and §12 Growth.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  validateBonded, validateParty, wildMax, canPick, ratingsLegal, rollCharacter, growthPicksEarned,
  animalForDie, perkForDice, frameOf,
} from "../module/logic/character.mjs";
import { ANIMALS, PERK_ORDER } from "../module/config.mjs";

const base = { frame: "cats", animal: "jaguar", perk: "hideseek", perk2: "", human: { sneak: 3, force: 1, move: 2, sense: 2, wits: 1 }, age: 12, growth: 0, picks: [] };
const codes = c => validateBonded(c).map(p => p.code);

test("§11 a legal character has no problems; the animal implies the frame", () => {
  assert.deepEqual(codes(base), []);
  assert.equal(frameOf({ animal: "rat", frame: "cats" }), "critters");
  assert.deepEqual(codes({ ...base, frame: "birds" }), ["frameMismatch"]);
  assert.deepEqual(codes({ ...base, animal: "" }), ["noAnimal"]);
  assert.deepEqual(codes({ ...base, perk: "" }), ["noPerk"]);
});

test("§11 human ratings must be 3, 2, 2, 1, 1 in some order", () => {
  assert.ok(ratingsLegal(base));
  assert.deepEqual(codes({ ...base, human: { sneak: 3, force: 3, move: 2, sense: 1, wits: 1 } }), ["ratings"]);
  assert.deepEqual(codes({ ...base, human: { sneak: 2, force: 2, move: 2, sense: 2, wits: 1 } }), ["ratings"]);
  assert.deepEqual(codes({ ...base, age: 17 }), ["age"]);
});

test("§12 Growth picks: at 2, 4, 6; never the same twice except ratings; +1 rating to 3 at most", () => {
  assert.equal(growthPicksEarned(1), 0); assert.equal(growthPicksEarned(2), 1); assert.equal(growthPicksEarned(6), 3);
  const g = { ...base, growth: 2 };
  assert.equal(canPick(base, { type: "wild" }).reason, "noPickLeft");
  assert.equal(canPick(g, { type: "wild" }).ok, true);
  assert.equal(canPick(g, { type: "rating", approach: "sneak" }).reason, "ratingAtMax");
  assert.equal(canPick(g, { type: "rating", approach: "force" }).ok, true);
  assert.equal(canPick(g, { type: "wildsense", tag: "water" }).reason, "noStrength");
  assert.equal(canPick(g, { type: "wildsense", tag: "dark" }).ok, true);
  const two = { ...base, growth: 4, picks: [{ type: "rating", approach: "force" }], human: { ...base.human, force: 2 } };
  assert.deepEqual(codes(two), [], "a raised rating is still legal");
  assert.equal(canPick(two, { type: "rating", approach: "force" }).reason, "ratingTaken");
  assert.equal(canPick(two, { type: "rating", approach: "wits" }).ok, true);
  const wild = { ...two, picks: [...two.picks, { type: "wild" }] };
  assert.equal(canPick({ ...wild, growth: 6 }, { type: "wild" }).reason, "pickTaken");
  // a second perk needs its Growth pick; not the same perk twice
  assert.deepEqual(codes({ ...base, perk2: "scout" }), ["perk2WithoutPick"]);
  assert.deepEqual(codes({ ...base, growth: 2, perk2: "hideseek", picks: [{ type: "perk" }] }), ["samePerk"]);
  assert.deepEqual(codes({ ...base, growth: 0, picks: [{ type: "wild" }] }), ["tooManyPicks"]);
});

test("§4 / Ch 8 Wild: 4, +1 Gamer, +1 Growth, at most 6", () => {
  assert.equal(wildMax(base), 4);
  assert.equal(wildMax({ ...base, perk: "gamer" }), 5);
  assert.equal(wildMax({ ...base, perk: "gamer", picks: [{ type: "wild" }] }), 6);
  assert.equal(wildMax({ ...base, perk: "scout", perk2: "gamer", picks: [{ type: "perk" }, { type: "wild" }] }), 6);
});

test("§11 by the dice: frame, animal 1–2/3–4/5–6, perk lists, duplicate animals rerolled", () => {
  assert.equal(animalForDie("cats", 1), "jaguar"); assert.equal(animalForDie("cats", 4), "snowleopard"); assert.equal(animalForDie("cats", 6), "cheetah");
  assert.equal(perkForDice(1, 1), "football"); assert.equal(perkForDice(3, 6), "gamer"); assert.equal(perkForDice(4, 1), "captain"); assert.equal(perkForDice(6, 6), "drama");
  // Lucía (Ch 2): frame 6 Reptiles, animal 2 → Alligator; perk 4, 3 → Swim Team
  const seq = [6, 2, 4, 3, 1, 1, 1, 1];
  const l = rollCharacter(() => seq.shift() ?? 1);
  assert.equal(l.animal, "gator"); assert.equal(l.frame, "reptiles"); assert.equal(l.perk, "swim");
  // a duplicate: the jaguar is taken, so the animal die is rolled again
  const seq2 = [1, 1, 3, 1, 1, 1, 1, 1, 1];
  const r = rollCharacter(() => seq2.shift() ?? 1, ["jaguar"]);
  assert.equal(r.animal, "snowleopard");
  // every big cat taken: the frame is rerolled
  const seq3 = [1, 2, 5, 1, 1, 1, 1, 1, 1, 1];
  assert.equal(rollCharacter(() => seq3.shift() ?? 1, ["jaguar", "snowleopard", "cheetah"]).frame, "canines");
  for (let i = 0; i < 200; i++) {
    const c = rollCharacter(() => 1 + Math.floor(Math.random() * 6), ["jaguar", "coyote"]);
    assert.ok(ANIMALS[c.animal] && !["jaguar", "coyote"].includes(c.animal));
    assert.ok(PERK_ORDER.includes(c.perk));
    assert.deepEqual(codes({ ...c, perk2: "", age: 12, growth: 0, picks: [] }), []);
  }
});

test("validateParty (the simulator's group check) rejects a duplicate animal", () => {
  const a = { animal: "jaguar", frame: "cats", perk: "scout", human: base.human };
  assert.ok(validateParty([a, { ...a, animal: "coyote", frame: "canines" }]));
  assert.throws(() => validateParty([a, a]), /duplicate animal/);
  assert.equal(validateBonded(a, { others: [a] }).some(p => p.code === "duplicateAnimal"), true);
});
