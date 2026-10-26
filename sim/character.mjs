/**
 * §11 Making a character — legal random characters for the simulator (its own seeded
 * RNG), plus the shared validator from module/logic/character.mjs.
 */
import { FRAME_ORDER, ANIMALS, animalsOf, PERK_ORDER, HUMAN_SPREAD, APPROACHES } from "./rules-data.mjs";

/**
 * One random legal character. `taken` is the set of animals already in the group
 * (no two characters share an animal; rerolled, §11 step 1). `force` pins options for
 * balance experiments: { frame, animal, perk } (perk may be "none" for a control run).
 */
export function makeCharacter(rng, id, taken = new Set(), force = {}) {
  let animal = force.animal;
  if (!animal) {
    const frame = force.frame ?? rng.pick(FRAME_ORDER);
    const choices = animalsOf(frame).filter(a => !taken.has(a));
    animal = choices.length ? rng.pick(choices) : null;
    // §11: reroll a duplicate; if the frame has no animal left, reroll the frame too.
    while (!animal) {
      const f = rng.pick(FRAME_ORDER);
      const c = animalsOf(f).filter(a => !taken.has(a));
      animal = c.length ? rng.pick(c) : null;
    }
  }
  const frame = ANIMALS[animal].frame;
  const spread = rng.shuffle(HUMAN_SPREAD);
  const human = {};
  APPROACHES.forEach((a, i) => (human[a] = spread[i]));
  const perk = force.perk ?? rng.pick(PERK_ORDER);
  return { id, frame, animal, perk, human };
}

/** A random legal group of `size`; slot 0 may be forced. */
export function makeParty(rng, size, force0 = {}) {
  const taken = new Set();
  const party = [];
  for (let i = 0; i < size; i++) {
    const c = makeCharacter(rng, i, taken, i === 0 ? force0 : {});
    taken.add(c.animal);
    party.push(c);
  }
  return party;
}

/** Throws if a character or group breaks §11 (shared with the Foundry system). */
export { validateParty } from "../module/logic/character.mjs";
