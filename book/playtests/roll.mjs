#!/usr/bin/env node
/**
 * Real dice for playtests (WORKFLOW.md: rolls come from a script and are logged, never
 * invented). Every roll is appended to the log file with a running number and its label.
 *
 *   node book/playtests/roll.mjs <log.md> "<label>" <dice>      e.g. ... log.md "Maya sneaks the shop floor" 6
 *   node book/playtests/roll.mjs <log.md> "<label>" <dice> --reroll <faces>   a Push: reroll the misses of an earlier roll
 *
 * Prints the faces, the hits (5s and 6s) and the 6s.
 */
import { randomInt } from "node:crypto";
import { appendFileSync, existsSync, readFileSync } from "node:fs";

const [log, label, diceArg, flag, faces] = process.argv.slice(2);
const n = Number(diceArg);
if (!log || !label || !Number.isInteger(n) || n < 0 || n > 20) {
  console.error('usage: node book/playtests/roll.mjs <log.md> "<label>" <dice 0-20> [--reroll 1,5,3]');
  process.exit(2);
}
const d6 = () => randomInt(1, 7);
let out;
if (flag === "--reroll") {
  const prev = String(faces ?? "").split(",").map(Number).filter(x => x >= 1 && x <= 6);
  out = prev.map(f => (f >= 5 ? f : d6()));      // keep hits, reroll every miss
} else out = Array.from({ length: n }, d6);
const hits = out.filter(f => f >= 5).length, sixes = out.filter(f => f === 6).length;
const count = existsSync(log) ? (readFileSync(log, "utf8").match(/^- roll \d+/gm) ?? []).length : 0;
const line = `- roll ${count + 1} · ${label} · ${flag === "--reroll" ? `Push of [${faces}]` : `${n}d6`} → [${out.join(", ")}] · hits ${hits} · sixes ${sixes}`;
appendFileSync(log, line + "\n");
console.log(line);
