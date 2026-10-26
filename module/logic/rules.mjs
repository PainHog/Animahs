/**
 * SECOND NATURE — Pure Rules Logic (index)
 * -----------------------------------------
 * The convention (carried over from Heisty Spideys): every rule the system
 * automates is computed by a Foundry-free function in module/logic/ — no
 * `game`, `ui`, `foundry`, `Hooks`, `CONFIG` or DOM; only plain data in, plain
 * data out, plus static data from ../config.mjs (itself Foundry-free). Sheets,
 * chat cards and GM operations call these functions and only do the Foundry
 * plumbing around them. That keeps the rules unit-testable with `node --test`
 * and lets the simulator (sim/) reuse the exact same code the table uses.
 *
 * Each function's doc comment cites the rules passage it implements. The
 * rulebook (book/src/chapters/) and docs/CORE-RULES.md are the source of truth:
 * change them first, then these files and their tests.
 *
 *   dice.mjs        §1 classification, exact odds, Push
 *   roll-plan.mjs   §1–§2, Tables 1–4: ratings, own modifiers, the Cap, Help, Edges
 *   scent.mjs       §3, §6–§8, §10: every Scent rise, On the Trail, the Hunt is Up
 *   missions.mjs    the five missions (Part Three) and custom missions
 *   character.mjs   §11–§12: validation, Wild, Growth, random characters
 *   usage.mjs       once-per-scene uses against the mission clock
 *   clash.mjs       §7 Clashes
 *   mission.mjs     the mission state: a pure reducer the Foundry tracker drives
 */
export * from "./dice.mjs";
export * from "./roll-plan.mjs";
export * from "./scent.mjs";
export * from "./missions.mjs";
export * from "./character.mjs";
