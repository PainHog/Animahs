/**
 * The Hunt's Scent (Foundry-free): every rule that raises it, in one place.
 * CORE-RULES §3, §6, §7, §8, §10; rulebook chapters 4–6.
 *
 *  - Scent runs from 0 to the mission's Limit, rises only as the rules say, and never goes down.
 *  - Point obstacle: a Partial or a Fail raises it by 1 (in the Escape a Partial costs nothing).
 *  - Group obstacle: it rises once, when the obstacle ends: +1 if anyone got a Partial or a
 *    Fail (in the Escape only a Fail counts); and +1 at the end of every round from the
 *    third on while anyone still isn't past.
 *  - A Clash raises it once when it ends: +1, or +2 if it reached round 4, someone went
 *    Down, or someone shifted during it.
 *  - A shift the Hunt can see raises it by 1, except in a Clash (the Clash's rise covers it).
 *  - A Partial or Fail at scouting: Scent starts at 1.
 *  - On the Trail: Scent at least half the Limit (round up) when an Escape obstacle begins.
 *  - The Hunt is Up at the Limit; Scent past the Limit is lost.
 *
 * The simulator and the Foundry mission state both call these.
 */
import { CLASH_MAX_ROUNDS } from "../config.mjs";

/** Raise Scent by n (never down, never past the Limit). Returns { scent, huntUp, rose }. */
export function raiseScent(scent, n, limit) {
  const add = Math.max(0, Math.floor(Number(n) || 0));
  const next = Math.min(limit, scent + add);
  return { scent: next, huntUp: next >= limit, rose: next - scent };
}

/** §8 On the Trail: Scent at or above half the Limit, rounded up. */
export const onTheTrail = (scent, limit) => scent >= Math.ceil(limit / 2);

/** §8 The Hunt is Up at the Limit. */
export const huntIsUp = (scent, limit) => scent >= limit;

/** Does a result count against Scent? A Fail always; a Partial except in the Escape (§6). */
export const badForScent = (result, escape) => result === "fail" || (result === "partial" && !escape);

/** §6 A point obstacle's roll: Partial (not in the Escape) or Fail → +1. */
export const pointRollScent = (result, escape) => (badForScent(result, escape) ? 1 : 0);

/** §6 A group obstacle's one rise when it ends: +1 if any roll counted against Scent. */
export const groupEndRise = (results, escape) => (results.some(r => badForScent(r, escape)) ? 1 : 0);

/**
 * §6 A group obstacle that runs long: +1 at the end of a round from the third on, if anyone
 * still isn't past (the simulator's reading of "after the third round", A24).
 */
export const groupRoundRise = (round, anyoneNotPast) => (round >= 3 && anyoneNotPast ? 1 : 0);

/** §7 A Clash's one rise when it ends. */
export const clashEndRise = ({ rounds, anyDown, anyShifted }) =>
  (rounds >= CLASH_MAX_ROUNDS || anyDown || anyShifted ? 2 : 1);

/** §3 A shift the Hunt can see: +1 outside a Clash (in a Clash, the Clash's own rise covers it). */
export const shiftSeenRise = ({ inClash, seen }) => (seen && !inClash ? 1 : 0);

/** §3 Is a shift in sight? Always in a Clash; between obstacles only if the mission says you're watched. */
export const shiftInSight = ({ inClash, watched }) => !!inClash || !!watched;

/**
 * §10 Scouting: Critical = the team picks and gains two Edges; Success = picks and one Edge;
 * Partial = picks, Scent starts at 1; Fail = the Storyteller picks, Scent starts at 1.
 */
export function scoutOutcome(result) {
  return {
    picks: result === "fail" ? "storyteller" : "team",
    edges: result === "crit" ? 2 : result === "success" ? 1 : 0,
    scent: result === "partial" || result === "fail" ? 1 : 0,
  };
}
