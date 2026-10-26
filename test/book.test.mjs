/**
 * Rulebook consistency tests — run with `npm test` (node --test).
 *  - the mission obstacle tables are exactly what book/tools/mission-tables.mjs makes
 *    from the simulator's missions (DESIGN-RULES A11: book and simulator can't drift);
 *  - the ready-made Bonded follow the character rules (Table 1 ratings, the human
 *    spread, their animal's perk, starting Wild);
 *  - the threats in Chapter 10 and on the round card match Table 4;
 *  - every picture the book names exists, and book/art/ART-LIST.md is up to date.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { MISSIONS } from "../sim/scenarios.mjs";
import { FRAMES, ANIMALS, PERKS, THREATS, HUMAN_SPREAD, START_WILD } from "../sim/rules-data.mjs";
import { missionTable } from "../book/tools/mission-tables.mjs";
import { artList } from "../book/tools/art-list.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CH = join(ROOT, "book", "src", "chapters");
const chapters = readdirSync(CH).filter(f => f.endsWith(".html")).sort();
const read = f => readFileSync(join(CH, f), "utf8");
const all = chapters.map(read).join("\n");
const strip = s => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const ratingsOf = line => Object.fromEntries([...strip(line).matchAll(/(Sneak|Force|Move|Sense|Wits) (\d)/g)].map(([, k, v]) => [k.toLowerCase(), +v]));

test("every mission's obstacle table matches the simulator's mission", () => {
  for (const m of MISSIONS) {
    const re = new RegExp(`<!-- obstacles:${m.id} -->[\\s\\S]*?<!-- /obstacles:${m.id} -->`);
    const found = all.match(re);
    assert.ok(found, `the chapters hold the ${m.id} table`);
    assert.equal(found[0], missionTable(m), `${m.id}: run node book/tools/mission-tables.mjs --write`);
  }
});

test("the ready-made Bonded follow the character rules", () => {
  const html = read(chapters.find(f => /<h2>Ready-Made Bonded<\/h2>/.test(read(f))));
  const entries = [...html.matchAll(/<article class="entry" id="(pc-[a-z]+)">([\s\S]*?)<\/article>/g)];
  assert.equal(entries.length, 6, "six ready-made Bonded");
  const animalsSeen = new Set();
  for (const [, id, body] of entries) {
    const [, who, animalName] = strip(body.match(/<h3>([\s\S]*?)<\/h3>/)[1]).match(/^(.*?), \d+ · (.+)$/);
    const animal = Object.values(ANIMALS).find(a => a.name === animalName);
    assert.ok(animal, `${who}: ${animalName} is an animal in Table 2`);
    assert.ok(!animalsSeen.has(animalName), `${who}: no two share an animal`);
    animalsSeen.add(animalName);
    const frame = FRAMES[animal.frame];
    const lines = [...body.matchAll(/<p class="statline">([\s\S]*?)<\/p>/g)].map(m => m[1]);
    const human = ratingsOf(lines.find(l => l.includes("Human:")));
    assert.deepEqual(Object.values(human).sort(), [...HUMAN_SPREAD].sort(), `${who}: human ratings use the spread`);
    assert.equal(Object.keys(human).length, 5, `${who}: five human ratings`);
    const animalLine = lines.find(l => l.includes(`${animalName} (${frame.name}):`));
    assert.ok(animalLine, `${who}: animal line names ${animalName} (${frame.name})`);
    const { wits, ...rest } = frame.ratings;
    assert.deepEqual(ratingsOf(animalLine), rest, `${who}: animal ratings are the ${frame.name} row`);
    // "Strength:"/"Weakness:" when there's only one
    const tagsIn = label => (strip(animalLine).match(new RegExp(`${label}(?:es|s)?: ([A-Za-z, ]+)`))?.[1] ?? "").split(", ").map(s => s.trim().toLowerCase()).filter(Boolean);
    assert.deepEqual(tagsIn("Strength"), frame.strengths, `${who}: strengths`);
    assert.deepEqual(tagsIn("Weakness"), frame.weaknesses, `${who}: weaknesses`);
    const abilities = [...body.matchAll(/<h4>([\s\S]*?)<\/h4>/g)].map(m => strip(m[1]));
    assert.ok(abilities.some(a => a.startsWith(`${animal.perk} (animal perk`)), `${who}: has ${animalName}'s perk, ${animal.perk}`);
    const humanPerk = abilities.find(a => /\(human perk/.test(a))?.replace(/ \(human perk.*$/, "");
    const perk = Object.values(PERKS).find(p => p.name === humanPerk);
    assert.ok(perk, `${who}: ${humanPerk} is a human perk in Table 3`);
    const wild = +strip(lines.find(l => l.includes("Wild:"))).match(/Wild: (\d)/)[1];
    assert.equal(wild, START_WILD + (perk.name === "Gamer" ? 1 : 0), `${who}: starting Wild`);
    assert.ok(existsSync(join(ROOT, "book", "art", `${id}.svg`)), `${who}: has a portrait`);
  }
});

test("the threats in Chapter 10 and on the round card match Table 4", () => {
  for (const t of Object.values(THREATS)) {
    const block = all.match(new RegExp(`<article class="statblock" id="threat-${t.name.toLowerCase()}">([\\s\\S]*?)</article>`));
    assert.ok(block, `Chapter 10 has the ${t.name}`);
    const stat = label => +block[1].match(new RegExp(`<dt>${label}</dt><dd>(\\d)</dd>`))[1];
    assert.deepEqual([stat("Difficulty"), stat("Toughness"), stat("Harm")], [t.diff, t.tough, t.harm], `${t.name} in Chapter 10`);
    const row = all.match(new RegExp(`<tr><td>${t.name}</td><td>(\\d)</td><td>(\\d)</td><td>(\\d)</td>`));
    assert.ok(row, `the round card lists the ${t.name}`);
    assert.deepEqual(row.slice(1).map(Number), [t.diff, t.tough, t.harm], `${t.name} on the round card`);
  }
});

test("every picture the book names has art, and the art list is current", () => {
  const names = new Set([...all.matchAll(/data-art="([^"]+)"/g)].map(m => m[1]));
  const spots = JSON.parse(readFileSync(join(ROOT, "book", "src", "spots.json"), "utf8"));
  for (const list of Object.values(spots)) for (const n of list) names.add(n);
  for (const n of names) assert.ok(existsSync(join(ROOT, "book", "art", `${n}.svg`)), `book/art/${n}.svg exists`);
  assert.equal(readFileSync(join(ROOT, "book", "art", "ART-LIST.md"), "utf8"), artList(), "run node book/tools/art-list.mjs");
});
