/**
 * Bonded characters (Foundry-free): §11 Making a character and §12 Growth.
 *
 *  - validateBonded: every problem with one character, as data the sheet can show;
 *  - validateParty: throws if a group breaks §11 (the simulator's check);
 *  - wildMax: 4, +1 Gamer, +1 from the Growth pick, at most 6 (Ch 8);
 *  - growth picks: one at Growth 2, 4 and 6; never the same twice, except +1 to a
 *    human rating (a different rating each time, to at most 3);
 *  - rollCharacter: §11 by the dice, rerolling an animal someone in the group already has.
 *
 * Character data: { frame, animal, perk, perk2, human: {sneak..wits}, growth, picks: [{type, approach?, tag?}] }
 */
import {
  FRAMES, FRAME_ORDER, ANIMALS, animalsOf, PERKS, PERK_ORDER, HUMAN_SPREAD, HUMAN_RATING_MAX,
  APPROACHES, START_WILD, WILD_MAX, GROWTH_MAX, GROWTH_STEPS, GROWTH_PICKS, AGE_MIN, AGE_MAX,
} from "../config.mjs";

const sortDesc = a => [...a].sort((x, y) => y - x);
const SPREAD_KEY = sortDesc(HUMAN_SPREAD).join();

/** The frame a character's animal implies (the animal wins when both are set). */
export const frameOf = c => (c.animal && ANIMALS[c.animal] ? ANIMALS[c.animal].frame : (FRAMES[c.frame] ? c.frame : ""));

/** Every human perk a character has. */
export const perksOf = c => [c.perk, c.perk2].filter(p => p && PERKS[p]);

/** How many Growth picks a character has earned (one at 2, 4 and 6). */
export const growthPicksEarned = growth => GROWTH_STEPS.filter(s => (Number(growth) || 0) >= s).length;

/** §4, Ch 8: the Wild a character starts each mission with. */
export function wildMax(c) {
  let w = START_WILD;
  if (perksOf(c).includes("gamer")) w += 1;
  if ((c.picks ?? []).some(p => p.type === "wild")) w += 1;
  return Math.min(WILD_MAX, w);
}

/** The human ratings before Growth (+1 rating picks taken back off). */
export function baseHumanRatings(c) {
  const out = {};
  for (const a of APPROACHES) out[a] = Number(c.human?.[a] ?? 0);
  for (const p of c.picks ?? []) if (p.type === "rating" && p.approach in out) out[p.approach] -= 1;
  return out;
}

/** Are the base human ratings a permutation of 3, 2, 2, 1, 1? */
export function ratingsLegal(c) {
  const base = baseHumanRatings(c);
  return sortDesc(APPROACHES.map(a => base[a])).join() === SPREAD_KEY;
}

/**
 * Can a Growth pick be taken? Returns { ok, reason }.
 * pick: { type: "wild"|"perk"|"rating"|"wildsense", approach?, tag?, perk? }
 */
export function canPick(c, pick) {
  const picks = c.picks ?? [];
  if (!GROWTH_PICKS[pick.type]) return { ok: false, reason: "unknownPick" };
  if (picks.length >= growthPicksEarned(c.growth)) return { ok: false, reason: "noPickLeft" };
  if (!GROWTH_PICKS[pick.type].repeatable && picks.some(p => p.type === pick.type)) return { ok: false, reason: "pickTaken" };
  if (pick.type === "wild" && wildMax(c) >= WILD_MAX) return { ok: false, reason: "wildAtMax" };
  if (pick.type === "rating") {
    if (!APPROACHES.includes(pick.approach)) return { ok: false, reason: "noApproach" };
    if (picks.some(p => p.type === "rating" && p.approach === pick.approach)) return { ok: false, reason: "ratingTaken" };
    if ((Number(c.human?.[pick.approach]) || 0) >= HUMAN_RATING_MAX) return { ok: false, reason: "ratingAtMax" };
  }
  if (pick.type === "wildsense") {
    const F = FRAMES[frameOf(c)];
    if (!F || !F.strengths.includes(pick.tag)) return { ok: false, reason: "noStrength" };
  }
  if (pick.type === "perk") {
    if (pick.perk && (!PERKS[pick.perk] || pick.perk === c.perk)) return { ok: false, reason: "badPerk" };
  }
  return { ok: true, reason: null };
}

/**
 * Every problem with one character (§11, §12). Each: { code, ...detail }.
 * Codes: noAnimal, unknownAnimal, frameMismatch, noPerk, unknownPerk, samePerk,
 * perk2WithoutPick, ratings, ratingTooHigh, age, growth, tooManyPicks, duplicatePick,
 * wildSenseTag, duplicateAnimal (when `others` is given).
 */
export function validateBonded(c, { others = [] } = {}) {
  const out = [];
  if (!c.animal) out.push({ code: "noAnimal" });
  else if (!ANIMALS[c.animal]) out.push({ code: "unknownAnimal", animal: c.animal });
  else if (c.frame && c.frame !== ANIMALS[c.animal].frame) out.push({ code: "frameMismatch", frame: c.frame, animal: c.animal });
  if (!c.perk) out.push({ code: "noPerk" });
  else if (!PERKS[c.perk]) out.push({ code: "unknownPerk", perk: c.perk });
  const picks = c.picks ?? [];
  if (c.perk2) {
    if (!PERKS[c.perk2]) out.push({ code: "unknownPerk", perk: c.perk2 });
    else if (c.perk2 === c.perk) out.push({ code: "samePerk" });
    if (!picks.some(p => p.type === "perk")) out.push({ code: "perk2WithoutPick" });
  }
  if (!ratingsLegal(c)) out.push({ code: "ratings", ratings: APPROACHES.map(a => Number(c.human?.[a] ?? 0)) });
  for (const a of APPROACHES) if ((Number(c.human?.[a]) || 0) > HUMAN_RATING_MAX) out.push({ code: "ratingTooHigh", approach: a });
  if (c.age != null && c.age !== "" && (Number(c.age) < AGE_MIN || Number(c.age) > AGE_MAX)) out.push({ code: "age", age: Number(c.age) });
  const growth = Number(c.growth ?? 0);
  if (growth < 0 || growth > GROWTH_MAX) out.push({ code: "growth", growth });
  if (picks.length > growthPicksEarned(growth)) out.push({ code: "tooManyPicks", picks: picks.length, earned: growthPicksEarned(growth) });
  const seen = new Set();
  for (const p of picks) {
    const k = p.type === "rating" ? `rating:${p.approach}` : p.type;
    if (seen.has(k)) out.push({ code: "duplicatePick", pick: k });
    seen.add(k);
    if (p.type === "wildsense" && !(FRAMES[frameOf(c)]?.strengths ?? []).includes(p.tag)) out.push({ code: "wildSenseTag", tag: p.tag });
  }
  if (c.animal && others.some(o => o.animal === c.animal)) out.push({ code: "duplicateAnimal", animal: c.animal });
  return out;
}

/** Throws if a character or group breaks §11 (the simulator's group check). */
export function validateParty(party) {
  const seen = new Set();
  for (const c of party) {
    if (!ANIMALS[c.animal]) throw new Error(`unknown animal ${c.animal}`);
    if (ANIMALS[c.animal].frame !== c.frame) throw new Error(`${c.animal} is not a ${c.frame}`);
    if (!FRAMES[c.frame]) throw new Error(`unknown frame ${c.frame}`);
    if (seen.has(c.animal)) throw new Error(`duplicate animal ${c.animal}`);
    seen.add(c.animal);
    const spread = APPROACHES.map(a => c.human[a]).sort((a, b) => b - a);
    if (spread.join() !== [...HUMAN_SPREAD].sort((a, b) => b - a).join()) throw new Error(`bad human ratings ${spread}`);
    if (c.perk !== "none" && !PERK_ORDER.includes(c.perk)) throw new Error(`unknown perk ${c.perk}`);
  }
  return true;
}

/** §11 step 1: the animal a d6 picks in a frame (1–2 the first, 3–4 the second, 5–6 the third). */
export const animalForDie = (frame, die) => animalsOf(frame)[Math.min(2, Math.floor((die - 1) / 2))];

/** §11 step 3 (Table 3): two d6 — the first picks the list (1–3 A, 4–6 B), the second the row. */
export const perkForDice = (first, second) => PERK_ORDER[(first <= 3 ? 0 : 6) + (second - 1)];

/**
 * §11 by the dice. `d6` is a function returning 1–6; `taken` the animals other characters
 * in the group already have. A duplicate animal is rerolled with the animal die (keeping the
 * frame, as the book allows); if every animal of the frame is taken, the frame is rerolled.
 * Human ratings: 3, 2, 2, 1, 1 shuffled with the dice (a starting point; players usually
 * place them by hand). Returns { frame, animal, perk, human, dice: [{what, roll}] }.
 */
export function rollCharacter(d6, taken = []) {
  const dice = [];
  const roll = what => { const r = Math.max(1, Math.min(6, Math.floor(Number(d6()) || 1))); dice.push({ what, roll: r }); return r; };
  const takenSet = new Set(taken);
  let frame, animal;
  for (let guard = 0; guard < 60 && !animal; guard++) {
    frame = FRAME_ORDER[roll("frame") - 1];
    if (animalsOf(frame).every(a => takenSet.has(a))) continue;
    for (let g2 = 0; g2 < 60 && !animal; g2++) {
      const a = animalForDie(frame, roll("animal"));
      if (!takenSet.has(a)) animal = a;
    }
  }
  if (!animal) { animal = Object.keys(ANIMALS).find(a => !takenSet.has(a)) ?? "jaguar"; frame = ANIMALS[animal].frame; }
  const perk = perkForDice(roll("perkList"), roll("perkRow"));
  // Shuffle the spread (Fisher–Yates with dice: reroll anything out of range).
  const spread = [...HUMAN_SPREAD];
  for (let i = spread.length - 1; i > 0; i--) {
    let j;
    for (let g = 0; g < 30; g++) { const r = roll("rating") - 1; if (r <= i) { j = r; break; } }
    j ??= i;
    [spread[i], spread[j]] = [spread[j], spread[i]];
  }
  const human = {};
  APPROACHES.forEach((a, i) => (human[a] = spread[i]));
  return { frame, animal, perk, human, dice };
}
