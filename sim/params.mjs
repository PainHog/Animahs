/**
 * Every judgement call the simulator makes, as a named parameter (sim/README.md §2).
 * `default` is the simulator's best reading of docs/CORE-RULES.md; `alts` are the other
 * defensible readings, swept by `node sim/run.mjs --sweep`.
 *
 * Two kinds:
 *  - rule knobs: numbers the rules state (Wild, Limits) — tuned against DESIGN D22;
 *  - judgement calls: what the rules leave to the Storyteller or to player choice.
 */

export const PARAMS = {
  // ---- rule knobs (the numbers on the page) ----
  startWild: {
    default: 4, alts: [3, 5],
    title: "Starting Wild per character",
    doc: "How many Wild tokens each character starts a mission with.",
    ref: "CORE-RULES §4",
  },
  limitShift: {
    default: 0, alts: [-1, 1],
    title: "Scent Limit shift (all missions)",
    doc: "Added to every mission's Scent Limit — a sensitivity check.",
    ref: "CORE-RULES Table 5",
  },
  escapePartialScent: {
    default: false, alts: [true],
    title: "Partials in the Escape raise Scent",
    doc: "false = in the Escape only Fails raise Scent (rules v0.1b, DESIGN D24); true = a Partial raises Scent everywhere (v0.1 text).",
    ref: "CORE-RULES §6, §8",
  },
  groupScent: {
    default: "once", alts: ["perRound"],
    title: "How a group obstacle raises Scent",
    doc: "once = +1 when the obstacle ends if anyone got a Partial or Fail, and +1 at the end of every round after the third (rules v0.1b, A2 and A24); perRound = at most once per round (v0.1 text).",
    ref: "CORE-RULES §6",
  },
  maxHelpers: {
    default: 2, alts: [1],
    title: "Friends who can Help one roll",
    doc: "Rule candidate: 2 = as many as the Cap allows (v0.1 text); 1 = only one friend can Help each roll.",
    ref: "CORE-RULES §5",
  },
  wildBySize: {
    default: null, alts: [{ 3: 5, 4: 4, 5: 3 }],
    title: "Starting Wild by party size",
    doc: "Rule candidate: null = everyone starts with startWild; a map = Wild per character by number of players.",
    ref: "CORE-RULES §4",
  },
  huntUpInside: {
    default: "pressOn", alts: ["lost"],
    title: "The Hunt is Up before the objective is done",
    doc: "pressOn = from now on every Fail means you're Taken, inside or out, but the team may still finish the objective or Withdraw (rules v0.1b, DESIGN D24); lost = the objective is lost and everyone goes to the Escape (v0.1 text).",
    ref: "CORE-RULES §8",
  },
  pressOnWhen: {
    default: "underway", alts: ["lastObstacle"],
    title: "When the team presses on after the Hunt is Up (pressOn rule only)",
    doc: "Player policy: underway = finish the objective only if it already has progress; lastObstacle = finish it whenever it's the last obstacle left. Otherwise the team Withdraws.",
    ref: "CORE-RULES §8, §10",
  },
  sizeLimit: {
    default: { 3: 0, 4: 0, 5: 0 }, alts: [],
    title: "Scent Limit adjustment by party size",
    doc: "Per-size change to the Limit (DESIGN D19). Starts at none.",
    ref: "CORE-RULES Table 5",
  },

  // ---- judgement calls (Storyteller) ----
  pressTarget: {
    default: "random", alts: ["mostHurt", "leastHurt"],
    title: "Who an unattended threat hurts",
    doc: "§7 says 'one character of the Storyteller's choice'. random = any character in the Clash; mostHurt = the Storyteller presses the weakest; leastHurt = spreads harm out.",
    ref: "CORE-RULES §7",
  },
  shiftSeenOutside: {
    default: 0, alts: [0.25],
    title: "Chance a shift outside a Clash is seen",
    doc: "§3 says shifts between obstacles are out of sight (0). 0.25 = a table that rules a quarter of them seen — kept to show why §3 states it outright.",
    ref: "CORE-RULES §3",
  },

  // ---- judgement calls (player policy) ----
  spend: {
    default: "spendy", alts: ["thrifty"],
    title: "How readily players spend Wild",
    doc: "spendy = follow the book's advice (spend it; unspent Wild is lost); thrifty = keep 2 back until the Escape.",
    ref: "CORE-RULES §4",
  },
  midClashShift: {
    default: true, alts: [false],
    title: "Shift mid-Clash when it clearly helps",
    doc: "Shifting during a Clash costs the action and makes the Clash raise Scent by 2 (and Exposes the shifter). true = do it when animal Force is 2+ better.",
    ref: "CORE-RULES §3, §7",
  },
  fightGuards: {
    default: "auto", alts: ["sneak"],
    title: "Start Clashes with guards on purpose",
    doc: "auto = start the Clash when fighting looks better than getting past them; sneak = always try to get past first.",
    ref: "CORE-RULES §6",
  },
};

export function defaults() {
  const p = {};
  for (const [k, v] of Object.entries(PARAMS)) p[k] = structuredClone(v.default);
  return p;
}

/** Presets bracketing the real game (sim/README.md §3). */
export const PRESETS = {
  default: {},
  generous: { pressTarget: "leastHurt", shiftSeenOutside: 0 },
  strict: { pressTarget: "mostHurt", shiftSeenOutside: 0.25 },
};

export function makeParams(overrides = {}) {
  return Object.assign(defaults(), overrides);
}
