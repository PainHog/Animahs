/**
 * Simulator tests (sim/README.md §10): dice odds, rules wiring against hand-worked cases,
 * the character generator, the missions' data rules (A25), determinism, termination, and
 * that the simulator's numbers match the tables in docs/CORE-RULES.md (A11).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { classify, odds, pushOdds } from "../sim/dice.mjs";
import { playMission, __test as T } from "../sim/engine.mjs";
import { MISSIONS } from "../sim/scenarios.mjs";
import { makeParty, validateParty } from "../sim/character.mjs";
import { makeParams } from "../sim/params.mjs";
import { makeRng } from "../sim/rng.mjs";
import * as R from "../sim/rules-data.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);

test("§1 result bands", () => {
  assert.equal(classify(0, 0, 2), "fail");
  assert.equal(classify(1, 1, 2), "partial");
  assert.equal(classify(2, 1, 2), "success");
  assert.equal(classify(2, 2, 2), "crit");
  assert.equal(classify(1, 0, 1), "success");
  assert.equal(classify(3, 2, 4), "partial", "two 6s without a Success is not a Critical");
});

test("§1 exact odds", () => {
  for (let n = 1; n <= 8; n++) for (let d = 1; d <= 4; d++) {
    const o = odds(n, d);
    close(o.fail + o.partial + o.success + o.crit, 1);
    close(o.fail, (2 / 3) ** n);
  }
  close(odds(1, 1).success, 1 / 3);
  close(odds(2, 1).crit, 1 / 36);
  // Push from a fail with 3 dice: reroll all three
  close(pushOdds(3, 0, 0, 1).fail, (2 / 3) ** 3);
});

test("rules wiring: Strengths, Weaknesses, perks and the Cap", () => {
  const ch = (animal, perk = "none") => ({ animal, frame: R.ANIMALS[animal].frame, perk, human: { sneak: 3, force: 2, move: 2, sense: 1, wits: 1 } });
  const roll = (c, form, ob, approach, ctx = {}) => {
    const opt = T.optionsFor(c, form, ob).find(o => o.approach === approach);
    const m = T.selfMods(c, form, opt, { tags: ob.tags, guardKeys: ob.guards ?? [], ...ctx });
    return T.finalPool(opt, m);
  };
  // Jaguar, Night Rosettes: Sneak 4, +1 die (Dark Strength), −1 Difficulty
  assert.deepEqual(roll(ch("jaguar"), "animal", { tags: ["dark"], approaches: { sneak: 2 } }, "sneak"), { n: 5, d: 1 });
  // Big Cats in Water: +1 Difficulty; the Tiger ignores it
  assert.deepEqual(roll(ch("cheetah"), "animal", { tags: ["water"], approaches: { move: 2 } }, "move"), { n: 3, d: 3 });
  assert.deepEqual(roll(ch("tiger"), "animal", { tags: ["water"], approaches: { move: 2 } }, "move"), { n: 3, d: 2 });
  // The Cap: Barn Owl in a Dark High place with Gymnast = +3 dice, capped at +2
  assert.deepEqual(roll(ch("owl", "gymnast"), "animal", { tags: ["dark", "high"], approaches: { move: 2 } }, "move"), { n: 6, d: 2 });
  // Human form has no Strengths or Weaknesses
  assert.deepEqual(roll(ch("jaguar"), "human", { tags: ["dark", "water"], approaches: { sneak: 2 } }, "sneak"), { n: 3, d: 2 });
  // Hound Tracker: +1 Difficulty to Sneak past; Komodo ignores it
  assert.deepEqual(roll(ch("python"), "animal", { tags: [], approaches: { sneak: 2 }, guards: ["hound"] }, "sneak"), { n: 3, d: 3 });
  assert.deepEqual(roll(ch("komodo"), "animal", { tags: [], approaches: { sneak: 2 }, guards: ["hound"] }, "sneak"), { n: 3, d: 2 });
  // Brown Rat, Gnaw: Force rating 3 against Locked things (+1 die: Narrow Strength)
  assert.deepEqual(roll(ch("rat"), "animal", { tags: ["locked", "narrow"], approaches: { force: 3 } }, "force"), { n: 4, d: 3 });
  // Animals can't roll Wits; the Raven can against Locked things (rating 2)
  assert.equal(T.optionsFor(ch("hawk"), "animal", { tags: ["locked"], approaches: { wits: 2 } }).length, 0);
  assert.equal(T.optionsFor(ch("raven"), "animal", { tags: ["locked"], approaches: { wits: 2 } })[0].rating, 2);
});

test("§11 the character generator makes only legal groups", () => {
  for (let i = 0; i < 500; i++) {
    const size = 3 + (i % 3);
    validateParty(makeParty(makeRng(9, "t", i), size));
  }
  const p = makeParty(makeRng(1, "x"), 3);
  p[1] = { ...p[1], animal: p[0].animal, frame: p[0].frame };
  assert.throws(() => validateParty(p), /duplicate animal/);
});

test("missions follow A25 and use every place tag", () => {
  const tags = new Set();
  for (const m of MISSIONS) {
    assert.equal(m.waysIn.length, 2, `${m.id}: two ways in`);
    for (const s of [3, 4, 5]) assert.ok(Number.isInteger(m.limit[s]), `${m.id}: Limit for ${s} players`);
    assert.ok(R.LABELS[m.label], `${m.id}: label`);
    for (const ob of [...m.waysIn.flat(), ...m.inside, m.objective, ...m.escape]) {
      for (const t of ob.tags) { assert.ok(R.TAGS.includes(t), `${ob.id}: tag ${t}`); tags.add(t); }
      for (const [a, d] of Object.entries(ob.approaches)) { assert.ok(R.APPROACHES.includes(a)); assert.ok(d >= 1 && d <= 4); }
      for (const g of ob.guards) assert.ok(R.THREATS[g], `${ob.id}: threat ${g}`);
    }
    for (const ob of m.escape) assert.ok(Object.keys(ob.approaches).length >= 2, `${m.id}/${ob.id}: escape solvable more than one way`);
  }
  assert.deepEqual([...tags].sort(), [...R.TAGS].sort());
});

test("same seed → same mission; every mission ends", () => {
  const params = makeParams();
  for (const m of MISSIONS) for (const size of [3, 4, 5]) {
    for (let i = 0; i < 150; i++) {
      const party = makeParty(makeRng(3, "p", m.id, size, i), size);
      const a = playMission(m, party, makeRng(3, "d", m.id, size, i), params);
      assert.equal(a.st.maxRoundsHit, 0, `${m.id} ${size}p run ${i} hit the safety stop`);
      if (i < 5) {
        const b = playMission(m, party, makeRng(3, "d", m.id, size, i), params);
        assert.deepEqual(a, b);
      }
      assert.ok(["win", "costly", "loss"].includes(a.result));
      assert.ok(a.scent <= a.limit);
    }
  }
});

test("A11: the simulator's numbers match docs/CORE-RULES.md", () => {
  const doc = readFileSync(join(ROOT, "docs/CORE-RULES.md"), "utf8");
  const cells = line => line.split("|").slice(1, -1).map(s => s.trim());
  // Table 1: frames
  for (const [i, key] of R.FRAME_ORDER.entries()) {
    const F = R.FRAMES[key];
    const row = doc.split("\n").find(l => l.startsWith(`| ${i + 1} | ${F.name} |`));
    assert.ok(row, `Table 1 row for ${F.name}`);
    const c = cells(row);
    assert.deepEqual(c.slice(2, 6).map(Number), [F.ratings.sneak, F.ratings.force, F.ratings.move, F.ratings.sense], `${F.name} ratings`);
    const list = s => s.toLowerCase().split(",").map(x => x.trim());
    assert.deepEqual(list(c[6]), F.strengths, `${F.name} Strengths`);
    assert.deepEqual(list(c[7]), F.weaknesses, `${F.name} Weaknesses`);
  }
  // Table 2: every animal and perk name
  for (const a of Object.values(R.ANIMALS)) assert.ok(doc.includes(`| ${a.name} | **${a.perk}:**`), `Table 2: ${a.name}`);
  // Table 3: every human perk name
  for (const p of Object.values(R.PERKS)) assert.ok(doc.includes(`**${p.name}`), `Table 3: ${p.name}`);
  // Table 4: threats
  for (const t of Object.values(R.THREATS)) {
    const row = doc.split("\n").find(l => l.startsWith(`| ${t.name} `));
    assert.ok(row, `Table 4 row for ${t.name}`);
    assert.deepEqual(cells(row).slice(1, 4).map(Number), [t.diff, t.tough, t.harm], `${t.name} numbers`);
  }
  // Table 5: each test mission's Limits
  for (const m of MISSIONS) {
    const name = m.name.replace(/^\d+\. /, "");
    assert.ok(doc.includes(`${name} ${m.limit[3]} / ${m.limit[4]} / ${m.limit[5]}`), `Table 5: ${name}`);
  }
  // §4 starting Wild
  assert.ok(doc.includes(`starts every mission with **${R.START_WILD} Wild**`));
  assert.equal(makeParams().startWild, R.START_WILD);
});
