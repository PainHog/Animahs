/**
 * The shared roll plan (module/logic/roll-plan.mjs) and dice (module/logic/dice.mjs):
 * every Strength and Weakness rule, every animal perk that changes a roll, every human
 * perk, Wild Sense, the Cap, Gnaw and Clever Beak, Help and Edges — checked against
 * docs/CORE-RULES.md and the worked examples in the rulebook.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { buildRollPlan, approachOptions, canHelp, selfMods, optionsFor, finalPool, modifierList } from "../module/logic/roll-plan.mjs";
import { classify, countFaces, resolveFaces, pushIndices, applyPush, odds, pushOdds } from "../module/logic/dice.mjs";
import { ANIMALS, PERK_ORDER, ANIMAL_ORDER, FRAMES } from "../module/config.mjs";

const human = { sneak: 3, force: 2, move: 2, sense: 1, wits: 1 };
const ch = (animal, perk = null, extra = {}) => ({ animal, frame: ANIMALS[animal].frame, perk, human, ...extra });
const plan = (c, form, approach, tags = [], difficulty = 2, more = {}) => buildRollPlan({ c, form, approach, tags, difficulty, ...more });
const pd = p => [p.pool, p.difficulty];

test("§1 dice: hits, sixes, results, Push", () => {
  assert.deepEqual(countFaces([1, 5, 6, 6, 3]), { hits: 3, sixes: 2 });
  assert.equal(resolveFaces([1, 2, 3], 1).result, "fail");
  assert.equal(resolveFaces([5, 2], 2).result, "partial");
  assert.equal(resolveFaces([5, 6], 2).result, "success");
  assert.equal(resolveFaces([6, 6], 2).result, "crit");
  assert.equal(resolveFaces([6, 6, 1], 3).result, "partial", "two 6s without a Success is no Critical");
  assert.equal(classify(1, 0, 1), "success", "at Difficulty 1 a single hit is a Success");
  assert.deepEqual(pushIndices([1, 5, 6, 4]), [0, 3]);
  assert.deepEqual(applyPush([1, 5, 6, 4], [6, 2]), [6, 5, 6, 2]);
  // the book's Push example (Ch 3): 1 2 3 4 5 6 → reroll the four misses 6 2 5 1
  const pushed = resolveFaces(applyPush([1, 2, 3, 4, 5, 6], [6, 2, 5, 1]), 3);
  assert.equal(pushed.hits, 4); assert.equal(pushed.result, "crit");
  // odds table in Ch 3: 3 dice, at least a Partial 70%; Success at D2 26%
  assert.equal(Math.round(100 * (1 - odds(3, 2).fail)), 70);
  assert.equal(Math.round(100 * (odds(3, 2).success + odds(3, 2).crit)), 26);
  assert.ok(Math.abs(pushOdds(2, 0, 0, 1).fail - (4 / 9)) < 1e-12);
});

test("§2 human form uses human ratings and ignores tags", () => {
  const p = plan(ch("jaguar"), "human", "sneak", ["dark", "water", "crowd"]);
  assert.deepEqual(pd(p), [3, 2]);
  assert.equal(p.mods.length, 0);
});

test("§2 Strengths +1 die (once), Weaknesses +1 Difficulty (once), both can apply", () => {
  assert.deepEqual(pd(plan(ch("cheetah"), "animal", "move", ["dark", "high"])), [4, 2], "two Strengths still one die");
  assert.deepEqual(pd(plan(ch("cheetah"), "animal", "move", ["water", "crowd"])), [3, 3], "two Weaknesses still one step");
  assert.deepEqual(pd(plan(ch("snowleopard"), "animal", "move", ["water", "dark"])), [4, 3]);
  const m = plan(ch("snowleopard"), "animal", "move", ["water", "dark"]).mods.map(x => x.key);
  assert.deepEqual(m, ["strength", "weakness"]);
});

test("Table 2: every animal perk that changes a roll", () => {
  const A = (animal, approach, tags, more = {}) => pd(plan(ch(animal), "animal", approach, tags, 2, more));
  assert.deepEqual(A("jaguar", "sneak", ["dark"]), [5, 1], "Night Rosettes (+ Dark Strength)");
  assert.deepEqual(A("jaguar", "move", ["dark"]), [4, 2], "Night Rosettes is Sneak only");
  assert.deepEqual(A("snowleopard", "force", [], { action: "strike", firstStrike: true }), [3, 1], "Ambush: first Strike");
  assert.deepEqual(A("snowleopard", "force", [], { action: "strike", firstStrike: false }), [3, 2]);
  assert.deepEqual(A("dog", "sense", ["crowd"]), [5, 1], "Good Dog (+ Crowd Strength)");
  assert.deepEqual(A("dog", "sneak", ["crowd"]), [4, 1]);
  assert.deepEqual(A("falcon", "sense", ["open"]), [5, 1], "Keen Eyes");
  assert.deepEqual(A("falcon", "sense", ["dark"]), [4, 2]);
  assert.deepEqual(A("owl", "move", ["dark"]), [5, 2], "Silent Wings");
  assert.deepEqual(A("owl", "sneak", ["dark"]), [3, 2]);
  assert.deepEqual(A("mouse", "move", ["narrow"]), [4, 1], "Tiny (+ Narrow Strength)");
  assert.deepEqual(A("squirrel", "move", ["high"]), [3, 1], "Leaper");
  assert.deepEqual(A("gator", "force", ["water"]), [4, 1], "Lurker (+ Water Strength)");
  assert.deepEqual(A("gator", "sneak", ["water"]), [4, 1]);
  assert.deepEqual(A("komodo", "sense", []), [4, 2], "Taste the Air: +1 die on Sense");
});

test("Gnaw and Clever Beak: Locked things only", () => {
  // Brown Rat, Gnaw: Force rating 3 against Locked things (+1 die for a Narrow Strength)
  const g = plan(ch("rat"), "animal", "force", ["locked", "narrow"], 3);
  assert.equal(g.rating, 3); assert.equal(g.opt.gnaw, true); assert.deepEqual(pd(g), [4, 3]);
  assert.ok(g.mods.some(m => m.key === "rat"));
  assert.equal(plan(ch("rat"), "animal", "force", ["narrow"], 3).rating, 1, "no Gnaw without Locked");
  // Raven, Clever Beak: Wits 2 in animal form against Locked things
  assert.equal(plan(ch("raven"), "animal", "wits", ["locked"]).rating, 2);
  const nob = plan(ch("raven"), "animal", "wits", []);
  assert.equal(nob.canRoll, false); assert.equal(nob.reason, "animalWits");
  assert.equal(plan(ch("falcon"), "animal", "wits", ["locked"]).canRoll, false, "only the Raven");
  const opts = approachOptions(ch("raven"), "animal", ["locked"]);
  assert.equal(opts.find(o => o.approach === "wits").beak, true);
  assert.equal(approachOptions(ch("rat"), "animal", ["locked"]).find(o => o.approach === "force").gnaw, true);
});

test("Table 3: every human perk", () => {
  const H = (perk, approach, tags = [], more = {}, form = "human") => pd(plan(ch("cheetah", perk), form, approach, tags, 2, more));
  assert.deepEqual(H("football", "force"), [3, 2]);
  assert.deepEqual(H("hideseek", "sneak"), [4, 2]);
  assert.deepEqual(H("trackstar", "move"), [3, 2]);
  assert.deepEqual(H("scout", "sense"), [2, 2]);
  assert.deepEqual(H("brainiac", "wits"), [2, 2]);
  assert.deepEqual(H("swim", "move", ["water"]), [3, 2]);
  assert.deepEqual(H("gymnast", "move", ["high"]), [3, 2]);
  assert.deepEqual(H("nightowl", "sense", ["dark"]), [2, 2]);
  assert.deepEqual(H("drama", "wits", ["crowd"]), [2, 2]);
  assert.deepEqual(H("whisperer", "sneak", [], { guardKeys: ["hound"] }), [4, 3], "+1 die past Hounds (and the Tracker's +1)");
  assert.deepEqual(H("whisperer", "force", [], { threat: { key: "hound" } }), [3, 2], "+1 die against a Hound");
  assert.deepEqual(H("whisperer", "force", [], { threat: { key: "beater" }, guardKeys: ["hound"] }), [2, 2], "not against a Beater");
  for (const p of ["gamer", "captain"]) assert.deepEqual(H(p, "force"), [2, 2], `${p} doesn't change rolls`);
  // perks work in both forms, except Brainiac (human form)
  assert.deepEqual(H("football", "force", [], {}, "animal"), [4, 2]);
  assert.equal(plan(ch("raven", "brainiac"), "animal", "wits", ["locked"]).pool, 2, "Brainiac is human form only");
});

test("Table 4 specials: Tracker, Trophy; Komodo ignores the Tracker", () => {
  assert.deepEqual(pd(plan(ch("python"), "animal", "sneak", [], 2, { guardKeys: ["hound"] })), [3, 3]);
  assert.deepEqual(pd(plan(ch("komodo"), "animal", "sneak", [], 2, { guardKeys: ["hound"] })), [3, 2]);
  assert.deepEqual(pd(plan(ch("komodo"), "human", "sneak", [], 2, { guardKeys: ["hound"] })), [3, 3], "only the Komodo in animal form");
  assert.deepEqual(pd(plan(ch("python"), "animal", "sneak", [], 2, { guardKeys: ["huntsman", "hound"] })), [3, 4], "Tracker and Trophy both, uncapped");
  assert.deepEqual(pd(plan(ch("python"), "animal", "move", [], 2, { guardKeys: ["hound"] })), [3, 2], "Sneak only");
});

test("§7 Distract and Coil lower the Difficulty, inside the Cap", () => {
  assert.deepEqual(pd(plan(ch("python"), "animal", "force", [], 2, { action: "strike", distracted: true })), [3, 1]);
  assert.deepEqual(pd(plan(ch("snowleopard"), "animal", "force", [], 3, { action: "strike", firstStrike: true, distracted: true, coiled: true })), [3, 2],
    "Ambush, Distract and Coil together: still only −1");
  const p = plan(ch("snowleopard"), "animal", "force", [], 3, { action: "strike", firstStrike: true, distracted: true, coiled: true });
  assert.equal(p.down.wanted, 3); assert.equal(p.down.applied, 1); assert.equal(p.down.capped, true);
});

test("§1 the Cap: +2 dice, −1 Difficulty, never below 1; Help and Edges count", () => {
  // Barn Owl in a Dark High place with Gymnast: Strength + Silent Wings + Gymnast = +3, capped at +2
  const p = plan(ch("owl", "gymnast"), "animal", "move", ["dark", "high"]);
  assert.deepEqual(pd(p), [6, 2]); assert.equal(p.dice.capped, true);
  // Difficulty never below 1
  assert.equal(plan(ch("jaguar"), "animal", "sneak", ["dark"], 1).difficulty, 1);
  // the book: Jonah the bison, Force 4 + Locked + Football Player = the Cap; Theo's Help isn't needed
  const jonah = { animal: "bison", frame: "heavies", perk: "football", human: { sneak: 1, force: 3, move: 2, sense: 1, wits: 2 } };
  const j = plan(jonah, "animal", "force", ["locked"], 3, { helpers: [{ id: "theo", name: "Theo" }] });
  assert.deepEqual(pd(j), [6, 3]);
  assert.deepEqual(j.helpersUsed, [], "Help beyond the Cap is not spent");
  assert.equal(j.boosts[0].counted, false);
  // Edges first, then Help, until the Cap
  const e = plan(ch("cheetah"), "human", "force", [], 2, { edges: 1, helpers: [{ id: "a", name: "A" }, { id: "b", name: "B" }] });
  assert.equal(e.pool, 4); assert.equal(e.edgesUsed, 1); assert.deepEqual(e.helpersUsed.map(h => h.id), ["a"]);
  // the book's Clash example: Priya the owl Distracts, Move 4 + Open + Silent Wings = 6 dice vs 2
  const priya = { animal: "owl", frame: "birds", perk: "brainiac", human: { sneak: 1, force: 1, move: 2, sense: 2, wits: 3 } };
  assert.deepEqual(pd(plan(priya, "animal", "move", ["open", "dark"], 2, { action: "distract" })), [6, 2]);
});

test("Wild Sense (§12): one frame Strength works in human form; a second perk stacks inside the Cap", () => {
  const c = ch("jaguar", "nightowl", { wildSense: "dark" });
  assert.deepEqual(pd(plan(c, "human", "sneak", ["dark"])), [5, 2], "Wild Sense + Night Owl");
  assert.deepEqual(pd(plan(c, "human", "sneak", ["high"])), [3, 2], "only the chosen Strength");
  assert.deepEqual(pd(plan({ ...c, wildSense: "water" }, "human", "sneak", ["water"])), [3, 2], "must be one of the frame's Strengths");
  const two = { ...ch("cheetah"), perks: ["football", "nightowl"] };
  assert.deepEqual(pd(plan(two, "human", "force", ["dark"])), [4, 2]);
});

test("Clash actions only take their approaches; rating 0 can't roll", () => {
  assert.equal(plan(ch("cheetah"), "human", "sense", [], 2, { action: "strike" }).canRoll, false);
  assert.equal(plan(ch("cheetah"), "animal", "wits").canRoll, false);
  assert.equal(plan({ ...ch("cheetah"), human: { ...human, wits: 0 } }, "human", "wits").canRoll, false);
});

test("§5 Help: animal form can't help Wits (the Raven can, against Locked things); Down can't help", () => {
  const h = (form, animal, extra = {}) => ({ id: "h", form, animal, wild: 1, status: {}, ...extra });
  assert.equal(canHelp(h("animal", "bison"), { approach: "wits" }).ok, false);
  assert.equal(canHelp(h("human", "bison"), { approach: "wits" }).ok, true);
  assert.equal(canHelp(h("animal", "raven"), { approach: "wits", tags: ["locked"] }).ok, true);
  assert.equal(canHelp(h("animal", "raven"), { approach: "wits", tags: [] }).ok, false);
  assert.equal(canHelp(h("human", "bison", { wild: 0 }), { approach: "force" }).reason, "noWild");
  assert.equal(canHelp(h("animal", "coyote", { wild: 0 }), { approach: "force", packFree: true }).free, true);
  assert.equal(canHelp(h("human", "bison", { status: { down: true } }), { approach: "force" }).ok, false);
  assert.equal(canHelp(h("human", "bison"), { approach: "force", rollerId: "h" }).ok, false, "not your own roll");
});

test("the simulator's view (selfMods/finalPool) equals the plan for every animal, perk and place", () => {
  const tagsets = [[], ["dark"], ["high", "open"], ["narrow", "locked"], ["water", "crowd"], ["locked"], ["dark", "water", "high"]];
  for (const animal of ANIMAL_ORDER) for (const perk of [...PERK_ORDER, "none"]) for (const tags of tagsets) for (const form of ["human", "animal"]) {
    const c = ch(animal, perk);
    const ob = { tags, approaches: { sneak: 2, force: 3, move: 2, sense: 2, wits: 2 } };
    for (const opt of optionsFor(c, form, ob)) {
      const m = selfMods(c, form, opt, { tags, guardKeys: ["hound"] });
      const f = finalPool(opt, m);
      const p = buildRollPlan({ c, form, approach: opt.approach, tags, difficulty: opt.D, guardKeys: ["hound"] });
      assert.deepEqual([p.pool, p.difficulty], [f.n, f.d], `${animal}/${perk}/${form}/${opt.approach}/${tags}`);
      assert.deepEqual(p.fires, m.fires);
    }
  }
  // every modifier names a source
  for (const m of modifierList(ch("jaguar", "nightowl"), "animal", { approach: "sneak", rollAs: "sneak", D: 2, rating: 4 }, { tags: ["dark", "water"], guardKeys: ["huntsman"] })) {
    assert.ok(["strength", "weakness", "animal", "perk", "wildsense", "threat", "clash"].includes(m.source));
  }
  assert.equal(Object.keys(FRAMES).length, 6);
});
