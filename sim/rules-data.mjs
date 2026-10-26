/**
 * Second Nature (codename Morph Game) — rules data for the simulator.
 *
 * A thin re-export: every number lives once, in module/config.mjs (copied from
 * docs/CORE-RULES.md, the source of truth until chapters exist), and the Foundry
 * system reads the same file. Pure data: no Foundry, no DOM.
 *
 * The one difference: THREATS here holds only the threats a Clash can include
 * (Table 4 without the Master of the Hunt, who is never fought).
 */
import { THREATS as ALL_THREATS, FIGHTABLE_THREATS } from "../module/config.mjs";

export * from "../module/config.mjs";

/** Table 4: the threats a Clash can include. */
export const THREATS = Object.fromEntries(FIGHTABLE_THREATS.map(k => [k, ALL_THREATS[k]]));
