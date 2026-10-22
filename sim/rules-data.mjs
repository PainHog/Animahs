/**
 * Second Nature (codename Morph Game) — rules data for the simulator, v0.1 draft.
 *
 * Every number here is copied from docs/CORE-RULES.md (the source of truth until
 * chapters exist). It lives in sim/ rather than module/config.mjs because the core
 * rules are still a draft (WORKFLOW.md: data moves into the Foundry config once the
 * author approves the rulebook text). Pure data: no Foundry, no DOM.
 */

/** §2 The approaches. Wits is human form only. */
export const APPROACHES = ["sneak", "force", "move", "sense", "wits"];

/** §2 Place tags. */
export const TAGS = ["dark", "high", "narrow", "water", "open", "crowd", "locked"];

/** §11 Human ratings to assign. */
export const HUMAN_SPREAD = [3, 2, 2, 1, 1];

/** §4 Starting Wild; §9 Hurt boxes. */
export const START_WILD = 4;
export const HURT_BOXES = 3;
export const EDGE_MAX = 2;

/** §1 The Cap. */
export const CAP_DICE = 2;
export const CAP_DIFF = 1;

/** §7 A Clash lasts at most this many rounds. */
export const CLASH_MAX_ROUNDS = 4;

/** Table 1: Frames (animal-form ratings; Wits always 0). Order = d6 roll. */
export const FRAMES = {
  cats:     { name: "Big Cats", ratings: { sneak: 4, force: 3, move: 3, sense: 2, wits: 0 }, strengths: ["dark", "high"],   weaknesses: ["water", "crowd"] },
  canines:  { name: "Canines",  ratings: { sneak: 3, force: 3, move: 3, sense: 4, wits: 0 }, strengths: ["open", "crowd"],  weaknesses: ["high"] },
  birds:    { name: "Birds",    ratings: { sneak: 2, force: 1, move: 4, sense: 4, wits: 0 }, strengths: ["high", "open"],   weaknesses: ["narrow"] },
  critters: { name: "Critters", ratings: { sneak: 4, force: 1, move: 3, sense: 3, wits: 0 }, strengths: ["narrow", "crowd"], weaknesses: ["open"] },
  heavies:  { name: "Heavies",  ratings: { sneak: 2, force: 4, move: 3, sense: 3, wits: 0 }, strengths: ["open", "locked"], weaknesses: ["narrow", "crowd"] },
  reptiles: { name: "Reptiles", ratings: { sneak: 3, force: 3, move: 3, sense: 3, wits: 0 }, strengths: ["water", "dark"],  weaknesses: ["crowd"] },
};
export const FRAME_ORDER = ["cats", "canines", "birds", "critters", "heavies", "reptiles"];

/** Table 2: Animals (three per frame, in d6 order 1–2 / 3–4 / 5–6) and their perks. */
export const ANIMALS = {
  jaguar:   { frame: "cats",     name: "Jaguar",          perk: "Night Rosettes" },
  snowleopard: { frame: "cats",  name: "Snow Leopard",    perk: "Ambush" },
  cheetah:  { frame: "cats",     name: "Cheetah",         perk: "Burst" },
  coyote:   { frame: "canines",  name: "Coyote",          perk: "Pack" },
  dog:      { frame: "canines",  name: "Shepherd Dog",    perk: "Good Dog" },
  fox:      { frame: "canines",  name: "Red Fox",         perk: "Wily" },
  falcon:   { frame: "birds",    name: "Peregrine Falcon", perk: "Keen Eyes" },
  owl:      { frame: "birds",    name: "Barn Owl",        perk: "Silent Wings" },
  raven:    { frame: "birds",    name: "Raven",           perk: "Clever Beak" },
  mouse:    { frame: "critters", name: "House Mouse",     perk: "Tiny" },
  rat:      { frame: "critters", name: "Brown Rat",       perk: "Gnaw" },
  squirrel: { frame: "critters", name: "Grey Squirrel",   perk: "Leaper" },
  bison:    { frame: "heavies",  name: "Bison",           perk: "Shaggy Coat" },
  moose:    { frame: "heavies",  name: "Moose",           perk: "Antler Sweep" },
  hippo:    { frame: "heavies",  name: "Hippopotamus",    perk: "Charge" },
  gator:    { frame: "reptiles", name: "Alligator",       perk: "Lurker" },
  python:   { frame: "reptiles", name: "Python",          perk: "Coil" },
  komodo:   { frame: "reptiles", name: "Komodo Dragon",   perk: "Taste the Air" },
};
export const ANIMAL_ORDER = Object.keys(ANIMALS);
export const animalsOf = frame => ANIMAL_ORDER.filter(a => ANIMALS[a].frame === frame);

/** Table 3: Human perks. `form`: "any" or "human". Order = list A rows 1–6, then list B. */
export const PERKS = {
  football:  { name: "Football Player",      form: "any" },
  hideseek:  { name: "Hide-and-Seek Champ",  form: "any" },
  trackstar: { name: "Track Star",           form: "any" },
  scout:     { name: "Scout",                form: "any" },
  brainiac:  { name: "Brainiac",             form: "human" },
  gamer:     { name: "Gamer",                form: "any" },
  captain:   { name: "Team Captain",         form: "any" },
  whisperer: { name: "Animal Whisperer",     form: "any" },
  swim:      { name: "Swim Team",            form: "any" },
  gymnast:   { name: "Gymnast",              form: "any" },
  nightowl:  { name: "Night Owl",            form: "any" },
  drama:     { name: "Drama Kid",            form: "any" },
};
export const PERK_ORDER = Object.keys(PERKS);

/** Table 4: Threats. */
export const THREATS = {
  beater:   { name: "Beater",   diff: 2, tough: 2, harm: 1 },
  hound:    { name: "Hound",    diff: 2, tough: 3, harm: 1, tracker: true },
  trapper:  { name: "Trapper",  diff: 2, tough: 2, harm: 1, net: true },
  huntsman: { name: "Huntsman", diff: 3, tough: 4, harm: 2, trophy: true },
};

/** Table 5: Mission labels. Each mission states its own Limit for 3, 4 and 5 players (§8). */
export const LABELS = {
  easy:     { scoutDiff: 2 },
  standard: { scoutDiff: 2 },
  hard:     { scoutDiff: 2 },
};
export const LABEL_ORDER = ["easy", "standard", "hard"];
