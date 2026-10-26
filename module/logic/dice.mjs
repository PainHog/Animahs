/**
 * §1 The roll — dice classification and exact odds (Foundry-free).
 * A die showing 5 or 6 is a hit. Fail = no hits; Partial = some hits but fewer
 * than the Difficulty; Success = hits ≥ Difficulty; Critical = a Success with
 * two or more 6s. §4 Push rerolls every die that didn't hit.
 *
 * Shared by the Foundry roll cards and the simulator (sim/dice.mjs re-exports it).
 */
import { HIT_ON, CRIT_SIXES, RESULTS } from "../config.mjs";

export { RESULTS };

/** Classify a roll from its hit and six counts (§1). */
export function classify(hits, sixes, diff) {
  if (hits >= diff) return sixes >= CRIT_SIXES ? "crit" : "success";
  return hits > 0 ? "partial" : "fail";
}

/** Count the hits and sixes among some faces. */
export function countFaces(faces) {
  let hits = 0, sixes = 0;
  for (const f of faces) { if (f >= HIT_ON) hits++; if (f === 6) sixes++; }
  return { hits, sixes };
}

/** Classify faces directly: { faces, hits, sixes, result }. */
export function resolveFaces(faces, diff) {
  const { hits, sixes } = countFaces(faces);
  return { faces: [...faces], hits, sixes, result: classify(hits, sixes, diff) };
}

/** Indices of the dice a Push rerolls: every die that didn't hit (§4). */
export function pushIndices(faces) {
  const out = [];
  faces.forEach((f, i) => { if (f < HIT_ON) out.push(i); });
  return out;
}

/** Faces after a Push: the misses replaced, in order, by `newFaces`. */
export function applyPush(faces, newFaces) {
  let j = 0;
  return faces.map(f => (f >= HIT_ON ? f : newFaces[j++]));
}

/** Roll `n` dice with `rng`; returns { faces, hits, sixes }. */
export function rollPool(rng, n) {
  const faces = rng.roll(n, 6);
  let hits = 0, sixes = 0;
  for (const f of faces) { if (f >= 5) hits++; if (f === 6) sixes++; }
  return { faces, hits, sixes };
}

/** Push (§4): reroll every die that didn't hit. Returns the new { faces, hits, sixes }. */
export function pushRoll(rng, roll) {
  const faces = roll.faces.map(f => (f >= 5 ? f : rng.die(6)));
  let hits = 0, sixes = 0;
  for (const f of faces) { if (f >= 5) hits++; if (f === 6) sixes++; }
  return { faces, hits, sixes };
}

const MAXN = 10, MAXD = 6;

/** Exact distribution of (hits, sixes) for n dice: dist[n][h][s]. */
const HS = (() => {
  const out = [];
  for (let n = 0; n <= MAXN; n++) {
    let cur = [[1]]; // cur[h][s]
    for (let i = 0; i < n; i++) {
      const next = [];
      for (let h = 0; h <= i + 1; h++) next.push(new Array(i + 2).fill(0));
      for (let h = 0; h < cur.length; h++) for (let s = 0; s < cur[h].length; s++) {
        const p = cur[h][s]; if (!p) continue;
        next[h][s] += p * 4 / 6;          // miss
        next[h + 1][s] += p / 6;          // 5
        next[h + 1][s + 1] += p / 6;      // 6
      }
      cur = next;
    }
    out.push(cur);
  }
  return out;
})();

/** P(result) for n dice vs Difficulty d: { fail, partial, success, crit }. Cached. */
const ODDS = [];
for (let n = 0; n <= MAXN; n++) {
  ODDS.push([]);
  for (let d = 0; d <= MAXD; d++) {
    const o = { fail: 0, partial: 0, success: 0, crit: 0 };
    const t = HS[n];
    for (let h = 0; h < t.length; h++) for (let s = 0; s < t[h].length; s++) {
      if (t[h][s]) o[classify(h, s, Math.max(1, d))] += t[h][s];
    }
    ODDS[n].push(o);
  }
}
export function odds(n, d) {
  return ODDS[Math.max(0, Math.min(MAXN, n))][Math.max(1, Math.min(MAXD, d))];
}

/** P(at least Partial) and P(at least Success) — handy for policies and the roll dialog. */
export const pAtLeastPartial = (n, d) => 1 - odds(n, d).fail;
export const pAtLeastSuccess = (n, d) => { const o = odds(n, d); return o.success + o.crit; };

/** P(hits ≥ k) when rerolling m dice (for Push decisions). */
export function pRerollAtLeast(m, k) {
  if (k <= 0) return 1;
  let p = 0;
  const t = HS[Math.max(0, Math.min(MAXN, m))];
  for (let h = k; h < t.length; h++) for (let s = 0; s < t[h].length; s++) p += t[h][s];
  return p;
}

/**
 * Result distribution after a Push: the roll had `hits` hits and `sixes` sixes out of
 * `n` dice; every miss is rerolled. Returns { fail, partial, success, crit }.
 */
export function pushOdds(n, hits, sixes, diff) {
  const m = Math.max(0, n - hits);
  const o = { fail: 0, partial: 0, success: 0, crit: 0 };
  const t = HS[Math.min(MAXN, m)];
  for (let h = 0; h < t.length; h++) for (let s = 0; s < t[h].length; s++) {
    if (t[h][s]) o[classify(hits + h, sixes + s, Math.max(1, diff))] += t[h][s];
  }
  return o;
}
