/**
 * The five v0.1 test missions (DESIGN D20), as data. Draft content: the book's
 * versions (with maps) come with the chapters, after the core is approved.
 *
 * Obstacle fields (CORE-RULES §6):
 *  kind        "point" (one roll a round; progress adds up) or "group" (everyone must get past)
 *  tags        place tags (§2)
 *  approaches  { approach: Difficulty } — the approaches that work here
 *  progress    progress needed (point obstacles)
 *  guards      threat keys (Table 4); a Fail starts a Clash with them
 *  guardsClear true = beating the guards clears the obstacle; false = progress still needed
 *  dangerous   a Fail also deals 1 Hurt
 *  carry       the objective is a prize that must be carried out (§10)
 *
 * Each mission states its Scent Limit for 3, 4 and 5 players (§8, Table 5), set from the
 * simulator so that its label holds at every party size (DESIGN D19, D24).
 */

const ob = (o) => ({ kind: "point", tags: [], approaches: {}, progress: 1, guards: [], guardsClear: true, dangerous: false, carry: false, ...o });

export const MISSIONS = [
  {
    id: "petshop", name: "1. Pemberton's Pets", label: "easy", limit: { 3: 7, 4: 6, 5: 5 },
    brief: "The Hunt bought the old pet shop and is caging the town's strays as bait. Free them.",
    waysIn: [
      [ob({ id: "chute", name: "The coal chute", kind: "group", tags: ["dark", "narrow"], approaches: { sneak: 2, move: 2 } })],
      [ob({ id: "skylight", name: "The skylight", tags: ["high", "locked"], approaches: { move: 2, wits: 2, force: 3 }, progress: 2 })],
    ],
    inside: [
      ob({ id: "floor", name: "The shop floor (night watchman)", kind: "group", tags: ["dark"], approaches: { sneak: 2, move: 2 }, guards: ["beater"] }),
      ob({ id: "office", name: "The office door", tags: ["locked"], approaches: { wits: 2, force: 3 }, progress: 2 }),
    ],
    objective: ob({ id: "cages", name: "The cages", tags: ["locked", "narrow"], approaches: { wits: 2, force: 3 }, progress: 3 }),
    escape: [
      ob({ id: "back", name: "Out the back", kind: "group", tags: ["dark", "open"], approaches: { sneak: 2, move: 2 } }),
    ],
  },
  {
    id: "zoo", name: "2. The Zoo After Dark", label: "standard", limit: { 3: 8, 4: 8, 5: 8 },
    brief: "Hunt Trappers are crating the zoo's animals for the Lodge. Stop the trucks.",
    waysIn: [
      [ob({ id: "fence", name: "The perimeter fence", kind: "group", tags: ["open", "high"], approaches: { move: 2, sneak: 3 } })],
      [ob({ id: "culvert", name: "The river culvert", kind: "group", tags: ["water", "narrow", "dark"], approaches: { move: 2, sneak: 2 }, dangerous: true })],
    ],
    inside: [
      ob({ id: "find", name: "Find the Trappers", tags: ["high", "open", "dark"], approaches: { sense: 2 }, progress: 2 }),
      ob({ id: "gate", name: "The night keeper at the staff gate", kind: "group", tags: [], approaches: { wits: 2, sneak: 3 } }),
      ob({ id: "patrol", name: "The Hound patrol", kind: "group", tags: ["open", "dark"], approaches: { sneak: 2, move: 2, sense: 3 }, guards: ["hound", "hound"] }),
    ],
    objective: ob({ id: "crates", name: "The crates on the loading dock", tags: ["locked"], approaches: { wits: 2, force: 3 }, progress: 3, guards: ["trapper", "trapper"], guardsClear: false }),
    escape: [
      ob({ id: "moat", name: "Across the moat", kind: "group", tags: ["water", "open"], approaches: { move: 2, sneak: 2 } }),
    ],
  },
  {
    id: "mill", name: "3. The Old Mill", label: "standard", limit: { 3: 7, 4: 7, 5: 6 },
    brief: "The Hunt has built a Callhorn in the mill tower; when it sounds, every Hound in town will hunt. Wreck it.",
    waysIn: [
      [ob({ id: "millrace", name: "The millrace", kind: "group", tags: ["water", "dark"], approaches: { move: 2, sneak: 2 }, dangerous: true })],
      [ob({ id: "ivy", name: "The ivy wall", kind: "group", tags: ["high"], approaches: { move: 2, sneak: 3 } })],
    ],
    inside: [
      ob({ id: "grain", name: "The grain store (a Beater and a Hound)", kind: "group", tags: ["dark", "narrow"], approaches: { sneak: 2, wits: 2, move: 3, sense: 3 }, guards: ["beater", "hound"] }),
      ob({ id: "loft", name: "The gear loft", tags: ["high", "narrow"], approaches: { move: 2, sense: 3 }, progress: 3, dangerous: true }),
    ],
    objective: ob({ id: "horn", name: "The Callhorn", tags: ["high", "locked"], approaches: { force: 3, wits: 2 }, progress: 3, guards: ["huntsman"], guardsClear: false }),
    escape: [
      ob({ id: "wheel", name: "Down the waterwheel", kind: "group", tags: ["water", "high"], approaches: { move: 2, sneak: 3 } }),
    ],
  },
  {
    id: "gala", name: "4. The Trophy Gala", label: "hard", limit: { 3: 6, 4: 6, 5: 6 },
    brief: "The Hunt shows off its Trophies at the museum gala. Steal back the one holding a Bonded girl's otter.",
    waysIn: [
      [ob({ id: "doors", name: "The front doors", kind: "group", tags: ["crowd"], approaches: { wits: 2, sneak: 3 } })],
      [ob({ id: "bay", name: "The loading bay", tags: ["dark", "locked"], approaches: { wits: 2, force: 3, sneak: 3 }, progress: 2 })],
    ],
    inside: [
      ob({ id: "ballroom", name: "The ballroom", kind: "group", tags: ["crowd", "open"], approaches: { sneak: 2, wits: 2 } }),
      ob({ id: "halls", name: "The dark exhibit halls", kind: "group", tags: ["dark", "high"], approaches: { sneak: 2, move: 2, sense: 3 }, guards: ["hound", "hound", "trapper"] }),
    ],
    objective: ob({ id: "case", name: "The Trophy case", tags: ["locked", "crowd"], approaches: { wits: 3, force: 3 }, progress: 3, guards: ["huntsman"], guardsClear: false, carry: true }),
    escape: [
      ob({ id: "galleries", name: "The galleries", kind: "group", tags: ["dark", "high"], approaches: { move: 2, sneak: 2 } }),
      ob({ id: "steps", name: "The museum steps", kind: "group", tags: ["open", "crowd"], approaches: { move: 2, sneak: 2 } }),
    ],
  },
  {
    id: "lodge", name: "5. The Lodge on the Hill", label: "hard", limit: { 3: 7, 4: 7, 5: 7 },
    brief: "A Bonded boy was Taken last week. He's caged in the Lodge cellar. Get him out.",
    waysIn: [
      [ob({ id: "deerpark", name: "The deer park", kind: "group", tags: ["open", "dark"], approaches: { sneak: 2, move: 2 }, guards: ["hound", "hound"] })],
      [ob({ id: "icehouse", name: "The ice-house tunnel", kind: "group", tags: ["narrow", "dark", "water"], approaches: { move: 2, sneak: 2 }, dangerous: true })],
    ],
    inside: [
      ob({ id: "kennels", name: "The kennels", kind: "group", tags: ["narrow", "dark"], approaches: { sneak: 2, move: 3, sense: 3 }, guards: ["hound", "hound", "hound"] }),
      ob({ id: "servants", name: "The servants' door", tags: ["locked"], approaches: { wits: 2, force: 3 }, progress: 2 }),
      ob({ id: "hall", name: "The trophy hall", tags: ["high", "dark"], approaches: { sense: 2 }, progress: 2 }),
    ],
    objective: ob({ id: "cellar", name: "The cellar cage", tags: ["locked", "narrow"], approaches: { wits: 2, force: 3 }, progress: 3, guards: ["trapper", "trapper"], guardsClear: false }),
    escape: [
      ob({ id: "lawn", name: "The lawn", kind: "group", tags: ["open"], approaches: { move: 2, sneak: 3 } }),
      ob({ id: "wall", name: "The wall", kind: "group", tags: ["high"], approaches: { move: 2, force: 3 } }),
    ],
  },
];

export const missionById = id => MISSIONS.find(m => m.id === id);
