/**
 * Once-per-scene uses (Foundry-free), stamped against the mission clock.
 *
 * §6: a scene is one obstacle or one Clash, and once-per-scene abilities come back
 * each scene. Instead of resetting every character at every scene change, a use is
 * recorded as a stamp of the clock ("<missionId>:<sceneSerial>"); the ability is
 * available again as soon as the clock moves on, so resets need no writes at all
 * (the Heisty Spideys design, §1).
 *
 * The once-per-scene animal perks (Table 2): Cheetah Burst, Coyote Pack, Red Fox
 * Wily, Bison Shaggy Coat, Moose Antler Sweep, Hippopotamus Charge — keyed by animal.
 */
import { ANIMALS } from "../config.mjs";

/** The clock of a mission state (or of free play when no mission runs). */
export const clockOf = state => ({ missionId: state?.id ?? "freeplay", sceneSerial: Number(state?.sceneSerial ?? 0) });

/** The stamp for a clock. */
export const clockKey = clock => `${clock?.missionId ?? "freeplay"}:${Number(clock?.sceneSerial ?? 0)}`;

/** Has this ability been used in the current scene? */
export const usedThisScene = (usage, ability, clock) => (usage ?? {})[ability] === clockKey(clock);

/** The usage record with this ability stamped for the current scene. */
export const markUsed = (usage, ability, clock) => ({ ...(usage ?? {}), [ability]: clockKey(clock) });

/**
 * Can a character use its once-per-scene animal perk now? It must be that animal, in
 * animal form, and not have used it this scene. Returns { ok, reason }.
 */
export function sceneAbility(c, ability, clock) {
  if (c.animal !== ability || !ANIMALS[ability]?.scene) return { ok: false, reason: "notYours" };
  if (c.form !== "animal") return { ok: false, reason: "humanForm" };
  if (usedThisScene(c.usage, ability, clock)) return { ok: false, reason: "usedThisScene" };
  return { ok: true, reason: null };
}
