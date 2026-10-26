#!/usr/bin/env node
/**
 * Mission obstacle tables for the rulebook, generated from sim/scenarios.mjs so the
 * book and the simulator can't drift apart (DESIGN-RULES A11). The mission chapters
 * hold the output between <!-- obstacles:ID --> and <!-- /obstacles:ID --> markers;
 * test/book.test.mjs checks that they match.
 *
 *   node book/tools/mission-tables.mjs            print every table
 *   node book/tools/mission-tables.mjs --write    rewrite the tables in the chapters
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { MISSIONS } from "../../sim/scenarios.mjs";
import { THREATS } from "../../sim/rules-data.mjs";

const CH = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "chapters");
const cap = s => s[0].toUpperCase() + s.slice(1);
const APPROACH_ORDER = ["sneak", "force", "move", "sense", "wits"];

function guardText(keys) {
  const counts = {};
  for (const k of keys) counts[k] = (counts[k] ?? 0) + 1;
  return Object.entries(counts).map(([k, n]) => (n > 1 ? `${n} ${THREATS[k].name}s` : `a ${THREATS[k].name}`)).join(" and ");
}

function notes(ob, isObjective) {
  const out = [];
  if (ob.guards.length) {
    const them = ob.guards.length > 1 ? "them" : "it";
    out.push(`Guarded by ${guardText(ob.guards)}. ${ob.guardsClear ? `Beating ${them} clears it.` : "Clash first, then progress."}`);
  }
  if (ob.dangerous) out.push("Dangerous: a Fail deals 1 Hurt.");
  if (isObjective && ob.carry) out.push("A prize to carry out.");
  return out.join(" ") || "—";
}

/** The whole mission as one table: where, obstacle, tags, approaches, kind and progress, notes. */
export function missionTable(m) {
  const rows = [];
  const add = (where, ob, isObjective = false) => {
    const appr = APPROACH_ORDER.filter(a => ob.approaches[a]).map(a => `${cap(a)} ${ob.approaches[a]}`).join(" · ");
    const tags = ob.tags.length ? ob.tags.map(cap).join(", ") : "—";
    // group: everyone gets past on their own; point: the team needs this much progress
    const kind = ob.kind === "group" ? "Group" : `Point&nbsp;·&nbsp;${ob.progress}`;
    rows.push(`      <tr><td>${where}</td><td><strong>${ob.name}</strong></td><td>${tags}</td><td>${appr}</td><td>${kind}</td><td>${notes(ob, isObjective)}</td></tr>`);
  };
  m.waysIn[0].forEach((ob, i) => add(m.waysIn[0].length > 1 ? `Way in A${i + 1}` : "Way in A", ob));
  m.waysIn[1].forEach((ob, i) => add(m.waysIn[1].length > 1 ? `Way in B${i + 1}` : "Way in B", ob));
  m.inside.forEach((ob, i) => add(`Inside ${i + 1}`, ob));
  add("Objective", m.objective, true);
  m.escape.forEach((ob, i) => add(m.escape.length > 1 ? `Escape ${i + 1}` : "Escape", ob));
  return [
    `<!-- obstacles:${m.id} -->`,
    `  <table class="tbl wide obstacles">`,
    `    <thead><tr><th>Where</th><th>Obstacle</th><th>Tags</th><th>Approaches (Difficulty)</th><th>Kind · Progress</th><th>Notes</th></tr></thead>`,
    `    <tbody>`,
    ...rows,
    `    </tbody>`,
    `  </table>`,
    `  <p class="limits"><strong>Scent Limit:</strong> ${m.limit[3]} with 3 players · ${m.limit[4]} with 4 · ${m.limit[5]} with 5. <strong>Scouting:</strong> Sense, Difficulty 2.</p>`,
    `<!-- /obstacles:${m.id} -->`,
  ].join("\n");
}

/** Replace every marked table in the chapters with a fresh one. Returns the files changed. */
export function writeTables() {
  const changed = [];
  for (const f of readdirSync(CH).filter(f => f.endsWith(".html"))) {
    const file = join(CH, f);
    let s = readFileSync(file, "utf8");
    const before = s;
    for (const m of MISSIONS) {
      const re = new RegExp(`<!-- obstacles:${m.id} -->[\\s\\S]*?<!-- /obstacles:${m.id} -->`);
      if (re.test(s)) s = s.replace(re, missionTable(m));
    }
    if (s !== before) { writeFileSync(file, s); changed.push(f); }
  }
  return changed;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.includes("--write")) console.log("updated:", writeTables().join(", ") || "nothing");
  else for (const m of MISSIONS) console.log(missionTable(m) + "\n");
}
