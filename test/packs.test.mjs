/**
 * Compendium content against the rulebook: the six ready-made Bonded match Chapter 18,
 * the threats match docs/CORE-RULES.md Table 4 and Chapter 10, the mission journals carry
 * the shared catalog's obstacles and Limits, and the sources are up to date with the book.
 * (tools/validate.mjs separately checks that the compiled packs match these sources.)
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { ANIMALS, PERKS, FRAMES, THREATS, THREAT_ORDER, APPROACHES } from "../module/config.mjs";
import { validateBonded, wildMax } from "../module/logic/character.mjs";
import { MISSIONS, missionTitle } from "../module/logic/missions.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = pack => readdirSync(join(ROOT, "packs/_source", pack)).filter(f => f.endsWith(".json")).sort()
  .map(f => JSON.parse(readFileSync(join(ROOT, "packs/_source", pack, f), "utf8")));
const text = s => s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

test("the six ready-made Bonded match Chapter 18", () => {
  const html = readFileSync(join(ROOT, "book/src/chapters/41-ch18.html"), "utf8");
  const entries = [...html.matchAll(/<article class="entry"[^>]*>([\s\S]*?)<\/article>/g)].map(m => text(m[1]));
  const docs = source("ready-made-bonded");
  assert.equal(docs.length, 6);
  assert.equal(entries.length, 6);
  entries.forEach((e, i) => {
    const d = docs[i];
    const s = d.system;
    const A = ANIMALS[s.animal];
    // "Maya Reyes, 12 · Jaguar"
    assert.ok(e.startsWith(`${d.name}, ${s.age} · ${A.name}`), `${d.name}: name, age, animal`);
    const human = APPROACHES.map(a => `${a[0].toUpperCase()}${a.slice(1)} ${s.human[a]}`).join(" · ");
    assert.ok(e.includes(`Human: ${human}`), `${d.name}: human ratings ${human}`);
    const F = FRAMES[s.frame];
    const animal = ["sneak", "force", "move", "sense"].map(a => `${a[0].toUpperCase()}${a.slice(1)} ${F.ratings[a]}`).join(" · ");
    assert.ok(e.includes(`${A.name} (${F.name}): ${animal}`), `${d.name}: frame ratings`);
    assert.ok(e.includes(`${A.perk} (animal perk)`), `${d.name}: animal perk`);
    assert.ok(e.includes(`${PERKS[s.perk].name} (human perk`), `${d.name}: human perk`);
    assert.ok(e.includes(`Mark: ${s.mark}`), `${d.name}: Mark`);
    assert.ok(e.includes(`Wild: ${s.wild.value}`), `${d.name}: Wild`);
    assert.equal(s.wild.max, wildMax({ perk: s.perk, picks: [] }));
    assert.ok(e.includes(`loves ${s.loves}`), `${d.name}: loves`);
    assert.deepEqual(validateBonded({ ...s, growth: 0, picks: [] }, { others: docs.filter(o => o !== d).map(o => o.system) }), [], `${d.name} is a legal character`);
    assert.equal(d.prototypeToken.actorLink, true);
    assert.equal(d.prototypeToken.bar1.attribute, "wild");
  });
});

test("the threats match CORE-RULES Table 4 and Chapter 10", () => {
  const doc = readFileSync(join(ROOT, "docs/CORE-RULES.md"), "utf8");
  const ch10 = text(readFileSync(join(ROOT, "book/src/chapters/22-ch10.html"), "utf8"));
  const docs = source("threats");
  assert.deepEqual(docs.map(d => d.system.kind), THREAT_ORDER);
  for (const d of docs) {
    const T = THREATS[d.system.kind];
    const row = doc.split("\n").find(l => l.startsWith(`| ${T.name}`) && l.includes("|"));
    assert.ok(row, `Table 4 row for ${T.name}`);
    const cells = row.split("|").slice(1, -1).map(s => s.trim());
    const num = c => (c === "—" ? null : Number(c));
    assert.deepEqual([d.system.difficulty, d.system.toughness, d.system.harm], [num(cells[1]), num(cells[2]), num(cells[3])], `${T.name} numbers`);
    if (T.fightable !== false) assert.ok(ch10.includes(`Difficulty${d.system.difficulty} Toughness${d.system.toughness} Harm${d.system.harm}`) || ch10.includes(`Difficulty ${d.system.difficulty} Toughness ${d.system.toughness} Harm ${d.system.harm}`), `${T.name} in Chapter 10`);
    assert.equal(d.prototypeToken.actorLink, false, "threat tokens are unlinked (a Clash may need several)");
  }
});

test("the mission journals carry the catalog's obstacles, Limits and a tracker flag", () => {
  const docs = source("missions");
  assert.equal(docs.length, MISSIONS.length);
  MISSIONS.forEach((m, i) => {
    const d = docs[i];
    assert.equal(d.name, missionTitle(m));
    assert.equal(d.flags.morphgame.mission, m.id);
    const obs = d.pages.find(p => p.key === "obstacles").text.content;
    for (const o of [...m.waysIn.flat(), ...m.inside, m.objective, ...m.escape]) assert.ok(obs.includes(o.name), `${m.id}: ${o.name}`);
    assert.ok(obs.includes(`${m.limit[3]} with 3 players · ${m.limit[4]} with 4 · ${m.limit[5]} with 5`), `${m.id}: Limits`);
    const story = d.pages.find(p => p.key === "mission").text.content;
    assert.ok(story.includes("Read This Aloud"), `${m.id}: the chapter text`);
    assert.doesNotMatch(story, /<table class|obstacles:/, "the book's own table is replaced by the catalog page");
  });
});

test("the rules journals: quick reference, chapters, the catalogue; clean HTML", () => {
  const docs = source("rules");
  assert.deepEqual(docs.map(d => d.name), ["Quick Reference", "The Rules", "Frames, Animals, Perks and Threats", "Second Nature in Foundry"]);
  const all = docs.flatMap(d => d.pages.map(p => p.text.content)).join("\n");
  assert.doesNotMatch(all, /<figure|class="|data-art|<section/);
  const cat = docs[2].pages.map(p => p.text.content).join("\n");
  for (const a of Object.values(ANIMALS)) assert.ok(cat.includes(a.name) && cat.includes(a.text), a.name);
  for (const p of Object.values(PERKS)) assert.ok(cat.includes(p.name) && cat.includes(p.text), p.name);
  assert.ok(docs[0].pages[0].text.content.includes("The Cap"));
});

test("the pack sources are up to date with the book (else: node tools/build-pack-sources.mjs && npm run build:packs)", () => {
  const r = spawnSync(process.execPath, [join(ROOT, "tools/build-pack-sources.mjs"), "--check"], { cwd: ROOT, encoding: "utf8" });
  assert.equal(r.status, 0, r.stdout + r.stderr);
});
