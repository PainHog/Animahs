/**
 * SECOND NATURE (codename Morph Game) — System Configuration
 * ---------------------------------------------------------------
 * Every rules number and every piece of static game data lives here, once:
 * frames, animals, human perks, threats, tags, approaches, labels and the
 * constants of docs/CORE-RULES.md (v0.1b; the rulebook chapters in
 * book/src/chapters/ say the same in full). The Foundry system (data models,
 * sheets, dice, the mission tracker), the pure rules logic in module/logic/ and
 * the balance simulator in sim/ all read this file, so they can never drift
 * apart. sim/rules-data.mjs re-exports it.
 *
 * Pure data only: no Foundry API, no DOM, so it imports under plain Node.
 *
 * Naming: `name` and `text` are the English rules text (used by the simulator
 * and the compendium builder); `label` is the matching lang/en.json key the
 * Foundry UI shows. test/config.test.mjs checks that the two always agree.
 */

/** The system id (must match system.json "id" and contracts.mjs SYSTEM_ID). */
export const SYSTEM = "morphgame";

/* ------------------------------------------------------------------ */
/*  §1 The roll                                                        */
/* ------------------------------------------------------------------ */

/** A die showing this or more is a hit. */
export const HIT_ON = 5;
/** A Critical is a Success with at least this many 6s. */
export const CRIT_SIXES = 2;
/** Difficulty runs 1–4 on the page; Weaknesses and Trackers can push it higher. */
export const DIFF_MIN = 1;
export const DIFF_MAX = 6;

/** §1 The Cap: from all sources together, at most +2 dice and −1 Difficulty. */
export const CAP_DICE = 2;
export const CAP_DIFF = 1;

/** Result keys, worst first. */
export const RESULTS = ["fail", "partial", "success", "crit"];
export const RESULT_LABELS = {
  fail: "MG.Result.fail", partial: "MG.Result.partial", success: "MG.Result.success", crit: "MG.Result.crit",
};

/* ------------------------------------------------------------------ */
/*  §2 Approaches, forms and tags                                      */
/* ------------------------------------------------------------------ */

/** The approaches. Wits is human form only (except the Raven's Clever Beak). */
export const APPROACHES = ["sneak", "force", "move", "sense", "wits"];
export const APPROACH_INFO = {
  sneak: { name: "Sneak", label: "MG.Approach.sneak", hint: "MG.ApproachHint.sneak" },
  force: { name: "Force", label: "MG.Approach.force", hint: "MG.ApproachHint.force" },
  move:  { name: "Move",  label: "MG.Approach.move",  hint: "MG.ApproachHint.move" },
  sense: { name: "Sense", label: "MG.Approach.sense", hint: "MG.ApproachHint.sense" },
  wits:  { name: "Wits",  label: "MG.Approach.wits",  hint: "MG.ApproachHint.wits" },
};

/** The two forms. */
export const FORMS = ["human", "animal"];

/** §2 Place tags. */
export const TAGS = ["dark", "high", "narrow", "water", "open", "crowd", "locked"];
export const TAG_INFO = {
  dark:   { name: "Dark",   label: "MG.Tag.dark" },
  high:   { name: "High",   label: "MG.Tag.high" },
  narrow: { name: "Narrow", label: "MG.Tag.narrow" },
  water:  { name: "Water",  label: "MG.Tag.water" },
  open:   { name: "Open",   label: "MG.Tag.open" },
  crowd:  { name: "Crowd",  label: "MG.Tag.crowd" },
  locked: { name: "Locked", label: "MG.Tag.locked" },
};

/* ------------------------------------------------------------------ */
/*  §4 Wild and Edges · §9 Hurt · §11 Making a character · §12         */
/* ------------------------------------------------------------------ */

/** §11 Human ratings to assign. */
export const HUMAN_SPREAD = [3, 2, 2, 1, 1];
/** §12 A human rating can be raised to at most this. */
export const HUMAN_RATING_MAX = 3;

/** §4 Starting Wild; §12 / Ch 8 the most it can grow to (counting Gamer). */
export const START_WILD = 4;
export const WILD_MAX = 6;
/** §9 Hurt boxes. */
export const HURT_BOXES = 3;
/** §9 Down, then back up at scene end with this much Hurt. */
export const HURT_AFTER_DOWN = 2;
/** §4 The team holds at most this many Edges. */
export const EDGE_MAX = 2;

/** §11 Ages. */
export const AGE_MIN = 11;
export const AGE_MAX = 15;

/** §12 Growth: one per mission, a pick at 2, 4 and 6. */
export const GROWTH_MAX = 6;
export const GROWTH_STEPS = [2, 4, 6];
export const GROWTH_PICKS = {
  wild:      { label: "MG.Growth.wild",      hint: "MG.GrowthHint.wild",      repeatable: false },
  perk:      { label: "MG.Growth.perk",      hint: "MG.GrowthHint.perk",      repeatable: false },
  rating:    { label: "MG.Growth.rating",    hint: "MG.GrowthHint.rating",    repeatable: true },
  wildsense: { label: "MG.Growth.wildsense", hint: "MG.GrowthHint.wildsense", repeatable: false },
};
export const GROWTH_PICK_ORDER = ["wild", "perk", "rating", "wildsense"];

/** §12 The campaign Hunt track. */
export const HUNT_TRACK_MAX = 6;
export const HUNT_TRACK_RISE = { win: 0, costly: 1, loss: 2 };
/** Ch 8: at Hunt track 4+, the Last Hunt's Limit is 1 lower. */
export const LAST_HUNT_TRACK = 4;

/** Statuses (§9). */
export const STATUSES = ["down", "netted", "taken", "exposed", "stuck"];
export const STATUS_INFO = {
  down:    { label: "MG.Status.down",    hint: "MG.StatusHint.down" },
  netted:  { label: "MG.Status.netted",  hint: "MG.StatusHint.netted" },
  taken:   { label: "MG.Status.taken",   hint: "MG.StatusHint.taken" },
  exposed: { label: "MG.Status.exposed", hint: "MG.StatusHint.exposed" },
  stuck:   { label: "MG.Status.stuck",   hint: "MG.StatusHint.stuck" },
};

/* ------------------------------------------------------------------ */
/*  §7 Clashes                                                         */
/* ------------------------------------------------------------------ */

/** A Clash lasts at most this many rounds. */
export const CLASH_MAX_ROUNDS = 4;
/** Clash actions: which approaches each may use. */
export const CLASH_ACTIONS = {
  strike:   { approaches: ["force"],         label: "MG.Clash.strike",   hint: "MG.ClashHint.strike" },
  distract: { approaches: ["sneak", "move"], label: "MG.Clash.distract", hint: "MG.ClashHint.distract" },
  slip:     { approaches: ["move", "sneak"], label: "MG.Clash.slip",     hint: "MG.ClashHint.slip" },
};
export const CLASH_ACTION_ORDER = ["strike", "distract", "slip"];

/* ------------------------------------------------------------------ */
/*  Table 1: Frames (animal-form ratings; Wits always 0). Order = d6.  */
/* ------------------------------------------------------------------ */

export const FRAMES = {
  cats:     { name: "Big Cats", label: "MG.Frame.cats",     ratings: { sneak: 4, force: 3, move: 3, sense: 2, wits: 0 }, strengths: ["dark", "high"],   weaknesses: ["water", "crowd"] },
  canines:  { name: "Canines",  label: "MG.Frame.canines",  ratings: { sneak: 3, force: 3, move: 3, sense: 4, wits: 0 }, strengths: ["open", "crowd"],  weaknesses: ["high"] },
  birds:    { name: "Birds",    label: "MG.Frame.birds",    ratings: { sneak: 2, force: 1, move: 4, sense: 4, wits: 0 }, strengths: ["high", "open"],   weaknesses: ["narrow"] },
  critters: { name: "Critters", label: "MG.Frame.critters", ratings: { sneak: 4, force: 1, move: 3, sense: 3, wits: 0 }, strengths: ["narrow", "crowd"], weaknesses: ["open"] },
  heavies:  { name: "Heavies",  label: "MG.Frame.heavies",  ratings: { sneak: 2, force: 4, move: 3, sense: 3, wits: 0 }, strengths: ["open", "locked"], weaknesses: ["narrow", "crowd"] },
  reptiles: { name: "Reptiles", label: "MG.Frame.reptiles", ratings: { sneak: 3, force: 3, move: 3, sense: 3, wits: 0 }, strengths: ["water", "dark"],  weaknesses: ["crowd"] },
};
export const FRAME_ORDER = ["cats", "canines", "birds", "critters", "heavies", "reptiles"];

/* ------------------------------------------------------------------ */
/*  Table 2: Animals (three per frame, d6 1–2 / 3–4 / 5–6) and perks.   */
/*  Animal perks work in animal form only. `scene` = once per scene.   */
/* ------------------------------------------------------------------ */

export const ANIMALS = {
  jaguar:      { frame: "cats",     name: "Jaguar",           perk: "Night Rosettes", label: "MG.Animal.jaguar.name",      perkLabel: "MG.Animal.jaguar.perk",      textLabel: "MG.Animal.jaguar.text",      scene: false, text: "In Dark places, your Sneak rolls are at −1 Difficulty." },
  snowleopard: { frame: "cats",     name: "Snow Leopard",     perk: "Ambush",         label: "MG.Animal.snowleopard.name", perkLabel: "MG.Animal.snowleopard.perk", textLabel: "MG.Animal.snowleopard.text", scene: false, text: "Your first Strike in each Clash is at −1 Difficulty." },
  cheetah:     { frame: "cats",     name: "Cheetah",          perk: "Burst",          label: "MG.Animal.cheetah.name",     perkLabel: "MG.Animal.cheetah.perk",     textLabel: "MG.Animal.cheetah.text",     scene: true,  text: "Once per scene, Push a Move roll without spending Wild." },
  coyote:      { frame: "canines",  name: "Coyote",           perk: "Pack",           label: "MG.Animal.coyote.name",      perkLabel: "MG.Animal.coyote.perk",      textLabel: "MG.Animal.coyote.text",      scene: true,  text: "Once per scene, Help without spending Wild." },
  dog:         { frame: "canines",  name: "Shepherd Dog",     perk: "Good Dog",       label: "MG.Animal.dog.name",         perkLabel: "MG.Animal.dog.perk",         textLabel: "MG.Animal.dog.text",         scene: false, text: "In Crowds, your Sneak and Sense rolls are at −1 Difficulty." },
  fox:         { frame: "canines",  name: "Red Fox",          perk: "Wily",           label: "MG.Animal.fox.name",         perkLabel: "MG.Animal.fox.perk",         textLabel: "MG.Animal.fox.text",         scene: true,  text: "Once per scene, when your roll Fails, it becomes a Partial instead." },
  falcon:      { frame: "birds",    name: "Peregrine Falcon", perk: "Keen Eyes",      label: "MG.Animal.falcon.name",      perkLabel: "MG.Animal.falcon.perk",      textLabel: "MG.Animal.falcon.text",      scene: false, text: "In Open or High places, your Sense rolls are at −1 Difficulty." },
  owl:         { frame: "birds",    name: "Barn Owl",         perk: "Silent Wings",   label: "MG.Animal.owl.name",         perkLabel: "MG.Animal.owl.perk",         textLabel: "MG.Animal.owl.text",         scene: false, text: "In Dark places, +1 die on Sneak and Move rolls." },
  raven:       { frame: "birds",    name: "Raven",            perk: "Clever Beak",    label: "MG.Animal.raven.name",       perkLabel: "MG.Animal.raven.perk",       textLabel: "MG.Animal.raven.text",       scene: false, text: "Against Locked things you can roll Wits in animal form (rating 2) to work latches, keys and switches." },
  mouse:       { frame: "critters", name: "House Mouse",      perk: "Tiny",           label: "MG.Animal.mouse.name",       perkLabel: "MG.Animal.mouse.perk",       textLabel: "MG.Animal.mouse.text",       scene: false, text: "In Narrow places, your Sneak and Move rolls are at −1 Difficulty." },
  rat:         { frame: "critters", name: "Brown Rat",        perk: "Gnaw",           label: "MG.Animal.rat.name",         perkLabel: "MG.Animal.rat.perk",         textLabel: "MG.Animal.rat.text",         scene: false, text: "Against Locked things, your Force rating is 3." },
  squirrel:    { frame: "critters", name: "Grey Squirrel",    perk: "Leaper",         label: "MG.Animal.squirrel.name",    perkLabel: "MG.Animal.squirrel.perk",    textLabel: "MG.Animal.squirrel.text",    scene: false, text: "In High places, your Move rolls are at −1 Difficulty." },
  bison:       { frame: "heavies",  name: "Bison",            perk: "Shaggy Coat",    label: "MG.Animal.bison.name",       perkLabel: "MG.Animal.bison.perk",       textLabel: "MG.Animal.bison.text",       scene: true,  text: "Once per scene, when you'd take Hurt, take 1 less." },
  moose:       { frame: "heavies",  name: "Moose",            perk: "Antler Sweep",   label: "MG.Animal.moose.name",       perkLabel: "MG.Animal.moose.perk",       textLabel: "MG.Animal.moose.text",       scene: true,  text: "Once per scene, when your Strike against a Beater or Hound Succeeds, it's out at once." },
  hippo:       { frame: "heavies",  name: "Hippopotamus",     perk: "Charge",         label: "MG.Animal.hippo.name",       perkLabel: "MG.Animal.hippo.perk",       textLabel: "MG.Animal.hippo.text",       scene: true,  text: "Once per scene, when a Force roll Succeeds, it counts as a Critical." },
  gator:       { frame: "reptiles", name: "Alligator",        perk: "Lurker",         label: "MG.Animal.gator.name",       perkLabel: "MG.Animal.gator.perk",       textLabel: "MG.Animal.gator.text",       scene: false, text: "In Water, your Sneak and Force rolls are at −1 Difficulty." },
  python:      { frame: "reptiles", name: "Python",           perk: "Coil",           label: "MG.Animal.python.name",      perkLabel: "MG.Animal.python.perk",      textLabel: "MG.Animal.python.text",      scene: false, text: "When your Strike Succeeds, the next roll anyone makes against that threat this Clash is at −1 Difficulty." },
  komodo:      { frame: "reptiles", name: "Komodo Dragon",    perk: "Taste the Air",  label: "MG.Animal.komodo.name",      perkLabel: "MG.Animal.komodo.perk",      textLabel: "MG.Animal.komodo.text",      scene: false, text: "+1 die on Sense rolls, and a Hound's Tracker doesn't affect you." },
};
export const ANIMAL_ORDER = Object.keys(ANIMALS);
export const animalsOf = frame => ANIMAL_ORDER.filter(a => ANIMALS[a].frame === frame);

/** Once-per-scene abilities, keyed by the animal that has them (usage stamps). */
export const SCENE_ABILITIES = ANIMAL_ORDER.filter(a => ANIMALS[a].scene);

/* ------------------------------------------------------------------ */
/*  Table 3: Human perks. `form`: "any" or "human".                     */
/*  Order = list A rows 1–6, then list B rows 1–6 (two d6).             */
/* ------------------------------------------------------------------ */

export const PERKS = {
  football:  { name: "Football Player",     form: "any",   label: "MG.Perk.football.name",  textLabel: "MG.Perk.football.text",  text: "+1 die on Force rolls." },
  hideseek:  { name: "Hide-and-Seek Champ", form: "any",   label: "MG.Perk.hideseek.name",  textLabel: "MG.Perk.hideseek.text",  text: "+1 die on Sneak rolls." },
  trackstar: { name: "Track Star",          form: "any",   label: "MG.Perk.trackstar.name", textLabel: "MG.Perk.trackstar.text", text: "+1 die on Move rolls." },
  scout:     { name: "Scout",               form: "any",   label: "MG.Perk.scout.name",     textLabel: "MG.Perk.scout.text",     text: "+1 die on Sense rolls." },
  brainiac:  { name: "Brainiac",            form: "human", label: "MG.Perk.brainiac.name",  textLabel: "MG.Perk.brainiac.text",  text: "+1 die on Wits rolls (human form)." },
  gamer:     { name: "Gamer",               form: "any",   label: "MG.Perk.gamer.name",     textLabel: "MG.Perk.gamer.text",     text: "Start every mission with 1 extra Wild." },
  captain:   { name: "Team Captain",        form: "any",   label: "MG.Perk.captain.name",   textLabel: "MG.Perk.captain.text",   text: "The team starts every mission with 1 Edge." },
  whisperer: { name: "Animal Whisperer",    form: "any",   label: "MG.Perk.whisperer.name", textLabel: "MG.Perk.whisperer.text", text: "+1 die on rolls against Hounds, or to get past an obstacle they guard." },
  swim:      { name: "Swim Team",           form: "any",   label: "MG.Perk.swim.name",      textLabel: "MG.Perk.swim.text",      text: "+1 die on rolls in Water." },
  gymnast:   { name: "Gymnast",             form: "any",   label: "MG.Perk.gymnast.name",   textLabel: "MG.Perk.gymnast.text",   text: "+1 die on rolls in High places." },
  nightowl:  { name: "Night Owl",           form: "any",   label: "MG.Perk.nightowl.name",  textLabel: "MG.Perk.nightowl.text",  text: "+1 die on rolls in Dark places." },
  drama:     { name: "Drama Kid",           form: "any",   label: "MG.Perk.drama.name",     textLabel: "MG.Perk.drama.text",     text: "+1 die on rolls in Crowds." },
};
export const PERK_ORDER = Object.keys(PERKS);

/* ------------------------------------------------------------------ */
/*  Table 4: Threats. The Master is never fought (§8).                  */
/* ------------------------------------------------------------------ */

export const THREATS = {
  beater:   { name: "Beater",   diff: 2, tough: 2, harm: 1, label: "MG.Threat.beater.name", specialLabel: "MG.Threat.beater.special",
              special: "", specialName: "" },
  hound:    { name: "Hound",    diff: 2, tough: 3, harm: 1, tracker: true, label: "MG.Threat.hound.name", specialLabel: "MG.Threat.hound.special",
              specialName: "Tracker", special: "Sneak rolls at an obstacle a Hound guards, or in a Clash with a Hound, are at +1 Difficulty (+1 in all, however many Hounds)." },
  trapper:  { name: "Trapper",  diff: 2, tough: 2, harm: 1, net: true, label: "MG.Threat.trapper.name", specialLabel: "MG.Threat.trapper.special",
              specialName: "Net", special: "When you Fail against a Trapper in a Clash, you're Netted instead of Hurt (the Fail that starts a Clash doesn't net you)." },
  huntsman: { name: "Huntsman", diff: 3, tough: 4, harm: 2, trophy: true, label: "MG.Threat.huntsman.name", specialLabel: "MG.Threat.huntsman.special",
              specialName: "Trophy", special: "Sneak rolls at an obstacle a Huntsman guards are at +1 Difficulty." },
  master:   { name: "Master of the Hunt", diff: null, tough: null, harm: null, fightable: false, label: "MG.Threat.master.name", specialLabel: "MG.Threat.master.special",
              specialName: "Arrives", special: "Only when the Hunt is Up. Masters are never fought. While they're here, any Fail means you're Taken." },
};
export const THREAT_ORDER = ["beater", "hound", "trapper", "huntsman", "master"];
/** The threats a Clash can include (everything but the Master). */
export const FIGHTABLE_THREATS = THREAT_ORDER.filter(k => THREATS[k].fightable !== false);

/* ------------------------------------------------------------------ */
/*  Table 5: Mission labels. Each mission gives its own Limit (§8).     */
/* ------------------------------------------------------------------ */

export const LABELS = {
  easy:     { scoutDiff: 2, label: "MG.Label.easy" },
  standard: { scoutDiff: 2, label: "MG.Label.standard" },
  hard:     { scoutDiff: 2, label: "MG.Label.hard" },
};
export const LABEL_ORDER = ["easy", "standard", "hard"];
/** §10 Scouting rolls Sense. */
export const SCOUT_APPROACH = "sense";
/** Party sizes the missions give Limits for (§8). */
export const PARTY_SIZES = [3, 4, 5];

/* ------------------------------------------------------------------ */
/*  The aggregate (CONFIG.MG in Foundry)                                */
/* ------------------------------------------------------------------ */

export const MG = {
  id: SYSTEM,
  HIT_ON, CRIT_SIXES, DIFF_MIN, DIFF_MAX, CAP_DICE, CAP_DIFF,
  RESULTS, RESULT_LABELS,
  APPROACHES, APPROACH_INFO, FORMS, TAGS, TAG_INFO,
  HUMAN_SPREAD, HUMAN_RATING_MAX, START_WILD, WILD_MAX, HURT_BOXES, HURT_AFTER_DOWN, EDGE_MAX,
  AGE_MIN, AGE_MAX, GROWTH_MAX, GROWTH_STEPS, GROWTH_PICKS, GROWTH_PICK_ORDER,
  HUNT_TRACK_MAX, HUNT_TRACK_RISE, LAST_HUNT_TRACK,
  STATUSES, STATUS_INFO,
  CLASH_MAX_ROUNDS, CLASH_ACTIONS, CLASH_ACTION_ORDER,
  FRAMES, FRAME_ORDER, ANIMALS, ANIMAL_ORDER, SCENE_ABILITIES,
  PERKS, PERK_ORDER,
  THREATS, THREAT_ORDER, FIGHTABLE_THREATS,
  LABELS, LABEL_ORDER, SCOUT_APPROACH, PARTY_SIZES,
};
