#!/usr/bin/env node
/**
 * Writes the compendium pack SOURCES (packs/_source/<pack>/*.json) from the rulebook and
 * the shared rules data, so the packs follow the book (WORKFLOW.md: everything else follows
 * the book in the same piece of work). The book is only READ here, never changed.
 *
 *   ready-made-bonded  the six ready-made Bonded of Chapter 18 (stats, Mark, quote, story)
 *   threats            Table 4 (module/config.mjs) with the Chapter 10 descriptions
 *   rules              the quick reference (Chapter 19), the rules chapters (2–10, 12),
 *                      the frames/animals/perks/threats catalogue (module/config.mjs) and a
 *                      short guide to the Foundry system
 *   missions           the five missions: the map, the obstacle tables and Limits from the
 *                      shared catalog (module/logic/missions.mjs), the rest of each chapter
 *   starter            one Adventure holding all of the above, plus a scene for Wrenfield and
 *                      each mission: the book's map, a pin on every marker (linked to the
 *                      mission's journal) and the guards as hidden tokens beside their marker
 *
 * Pictures come from assets/art/ (tools/build-foundry-art.mjs makes them from book/art/), and
 * the map markers from the map drawings themselves (book/tools/art-gen/scenes/sn-maps.mjs).
 *
 * Then compile with `npm run build:packs`. Output is deterministic: same book, same files.
 *   node tools/build-pack-sources.mjs          write the sources
 *   node tools/build-pack-sources.mjs --check  exit 1 if the sources are out of date
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  FRAMES, FRAME_ORDER, ANIMALS, PERKS, PERK_ORDER, THREATS, THREAT_ORDER, TAG_INFO, APPROACH_INFO, APPROACHES,
  HURT_BOXES, animalsOf,
} from "../module/config.mjs";
import { MISSIONS, missionTitle, scoutDifficulty } from "../module/logic/missions.mjs";
import { wildMax } from "../module/logic/character.mjs";
import { missionTable } from "../book/tools/mission-tables.mjs";
import { MARKERS } from "../book/tools/art-gen/scenes/sn-maps.mjs";
import { FOUNDRY_ART, MAP_SCALE, artPath } from "./foundry-art.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CH = join(ROOT, "book", "src", "chapters");
const SRC = join(ROOT, "packs", "_source");
const SYS = "systems/morphgame";
const chapter = file => readFileSync(join(CH, file), "utf8");
const tag = t => TAG_INFO[t].name;

/* ------------------------------------------------------------------ book HTML → journal HTML */

/** The book's chapter markup as plain journal HTML: no art, no layout classes. */
export function cleanHtml(html) {
  let h = html;
  h = h.replace(/<!--[\s\S]*?-->/g, "");
  h = h.replace(/<header class="chapter-head">[\s\S]*?<\/header>/g, "");
  h = h.replace(/<figure[^>]*>\s*<figcaption>([\s\S]*?)<\/figcaption>\s*<\/figure>/g, "<p><em>$1</em></p>");
  h = h.replace(/<figure[^>]*>[\s\S]*?<\/figure>/g, "");
  h = h.replace(/<\/?section[^>]*>/g, "");
  h = h.replace(/<aside[^>]*>/g, "<blockquote>").replace(/<\/aside>/g, "</blockquote>");
  h = h.replace(/<\/?(article|div|span)[^>]*>/g, "");
  h = h.replace(/\s(class|id|data-[\w-]+)="[^"]*"/g, "");
  h = h.split("\n").map(l => l.trim()).filter(Boolean).join("\n");
  return h;
}

const titleOf = html => (html.match(/<h2>([^<]*)<\/h2>/)?.[1] ?? "").trim();
const page = (key, name, content) => ({ key, name, type: "text", text: { format: 1, content } });

/* ------------------------------------------------------------------ Chapter 18 */

const ANIMAL_BY_NAME = Object.fromEntries(Object.entries(ANIMALS).map(([k, a]) => [a.name, k]));
const PERK_BY_NAME = Object.fromEntries(Object.entries(PERKS).map(([k, p]) => [p.name, k]));
const strip = s => s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

/** The ready-made Bonded as the book prints them. */
export function readyMadeFromBook() {
  const html = chapter("41-ch18.html");
  const out = [];
  for (const m of html.matchAll(/<article class="entry" id="pc-(\w+)">([\s\S]*?)<\/article>/g)) {
    const [, key, body] = m;
    const head = strip(body.match(/<h3>([\s\S]*?)<\/h3>/)[1]);           // "Maya Reyes, 12 · Jaguar"
    const [, name, age, animalName] = head.match(/^(.+?), (\d+) · (.+)$/);
    const animal = ANIMAL_BY_NAME[animalName];
    const human = {};
    const humanLine = strip(body.match(/<p class="statline"><strong>Human:<\/strong>([\s\S]*?)<\/p>/)[1]);
    for (const part of humanLine.split("·")) {
      const [, a, n] = part.trim().match(/^(\w+) (\d)$/);
      human[a.toLowerCase()] = Number(n);
    }
    const perkName = strip(body.match(/<h4>([^<(]+)\(human perk[^)]*\)<\/h4>/)[1]);
    const perk = PERK_BY_NAME[perkName];
    const markLine = body.match(/<strong>Mark:<\/strong>([\s\S]*?)<span class="sep">/)[1];
    const wild = Number(strip(body.match(/<strong>Wild:<\/strong>([\s\S]*?)<\/p>/)[1]));
    const quote = strip(body.match(/<p class="quote">([\s\S]*?)<\/p>/)[1]);
    const story = strip(body.match(/<p class="quote">[\s\S]*?<\/p>\s*<p>([\s\S]*?)<\/p>/)[1]);
    const loves = (story.match(/(?:She|He|They) loves? ([^.]+)\./)?.[1] ?? "").trim();
    out.push({ key, name, age: Number(age), animal, frame: ANIMALS[animal].frame, perk, human, mark: strip(markLine), wild, quote, story, loves });
  }
  return out;
}

function bondedDoc(c, i) {
  const system = {
    age: c.age, mark: c.mark, loves: c.loves,
    notes: `<p><em>${c.quote}</em></p>\n<p>${c.story}</p>`,
    frame: c.frame, animal: c.animal, perk: c.perk, perk2: "",
    human: Object.fromEntries(APPROACHES.map(a => [a, c.human[a]])),
    form: "human",
    wild: { value: c.wild, max: c.wild },
    hurt: { value: 0, max: HURT_BOXES },
    status: { down: false, netted: false, taken: false, exposed: false, stuck: false },
    growth: { value: 0, picks: [] },
    usage: {},
  };
  const img = artPath(`pc-${c.key}`);     // the book's portrait
  return {
    key: `${String(i + 1).padStart(2, "0")}-${c.key}`, name: c.name, img, system,
    prototypeToken: {
      name: c.name.split(" ")[0], actorLink: true, disposition: 1,
      bar1: { attribute: "wild" }, bar2: { attribute: "hurt" }, texture: { src: img },
    },
  };
}

/* ------------------------------------------------------------------ Chapter 10 / Table 4 */

/** The book's threat descriptions: { key: { epithet, text } }. */
function threatTexts() {
  const html = chapter("22-ch10.html");
  const out = {};
  for (const m of html.matchAll(/<article class="statblock" id="threat-(\w+)">([\s\S]*?)<\/article>/g)) {
    const body = m[2];
    out[m[1]] = {
      epithet: strip(body.match(/<span class="epithet">([\s\S]*?)<\/span>/)?.[1] ?? ""),
      text: strip(body.match(/<\/dl>\s*<p>([\s\S]*?)<\/p>/)?.[1] ?? body.match(/<p>([\s\S]*?)<\/p>/)?.[1] ?? ""),
    };
  }
  return out;
}

function threatDoc(key, i, texts) {
  const T = THREATS[key];
  const tx = texts[key] ?? { epithet: "", text: "" };
  // the book's portrait where it has one (the Master has none: never fought, never seen)
  const img = FOUNDRY_ART.some(a => a.name === `threat-${key}`) ? artPath(`threat-${key}`) : `${SYS}/assets/icons/${key}.svg`;
  return {
    key: `${String(i + 1).padStart(2, "0")}-${key}`, name: T.name, img,
    system: {
      kind: key, difficulty: T.diff, toughness: T.tough, harm: T.harm, harmTaken: 0,
      special: T.special,
      notes: `<p><em>${tx.epithet}</em></p>\n<p>${tx.text}</p>`,
    },
    prototypeToken: {
      name: T.name, actorLink: false, disposition: -1,
      bar1: { attribute: null }, bar2: { attribute: null }, texture: { src: img },
    },
  };
}

/* ------------------------------------------------------------------ the rules */

function catalogueHtml() {
  const frames = [
    "<p>Animal-form ratings (Wits is always 0). In animal form, a Strength among the place's tags gives +1 die; a Weakness, +1 Difficulty (one of each at most).</p>",
    "<table><thead><tr><th>d6</th><th>Frame</th><th>Sneak</th><th>Force</th><th>Move</th><th>Sense</th><th>Strengths (+1 die)</th><th>Weaknesses (+1 Difficulty)</th></tr></thead><tbody>",
    ...FRAME_ORDER.map((k, i) => {
      const F = FRAMES[k];
      return `<tr><td>${i + 1}</td><td><strong>${F.name}</strong></td><td>${F.ratings.sneak}</td><td>${F.ratings.force}</td><td>${F.ratings.move}</td><td>${F.ratings.sense}</td><td>${F.strengths.map(tag).join(", ")}</td><td>${F.weaknesses.map(tag).join(", ")}</td></tr>`;
    }),
    "</tbody></table>",
  ].join("\n");
  const animals = [
    "<p>Animal perks work in animal form only. Roll a d6 within the frame: 1–2 the first, 3–4 the second, 5–6 the third. No two Bonded in a group have the same animal.</p>",
    "<table><thead><tr><th>Frame</th><th>Animal</th><th>Perk</th></tr></thead><tbody>",
    ...FRAME_ORDER.flatMap(f => animalsOf(f).map((a, i) => `<tr><td>${i === 0 ? FRAMES[f].name : ""}</td><td>${ANIMALS[a].name}</td><td><strong>${ANIMALS[a].perk}:</strong> ${ANIMALS[a].text}</td></tr>`)),
    "</tbody></table>",
  ].join("\n");
  const perks = [
    "<p>Every perk works in any form unless it says otherwise; a perk's die counts towards the Cap. Roll two d6: the first picks the list (1–3 A, 4–6 B), the second the row.</p>",
    "<table><thead><tr><th></th><th>A (1–3)</th><th>B (4–6)</th></tr></thead><tbody>",
    ...[0, 1, 2, 3, 4, 5].map(r => {
      const a = PERKS[PERK_ORDER[r]], b = PERKS[PERK_ORDER[r + 6]];
      return `<tr><td>${r + 1}</td><td><strong>${a.name}:</strong> ${a.text}</td><td><strong>${b.name}:</strong> ${b.text}</td></tr>`;
    }),
    "</tbody></table>",
  ].join("\n");
  const threats = [
    "<p>Threats never roll. Strike, Distract or Slip Away against their Difficulty; they are out when their harm taken equals their Toughness.</p>",
    "<table><thead><tr><th>Threat</th><th>Difficulty</th><th>Toughness</th><th>Harm</th><th>Special</th></tr></thead><tbody>",
    ...THREAT_ORDER.map(k => {
      const T = THREATS[k];
      return `<tr><td><strong>${T.name}</strong></td><td>${T.diff ?? "—"}</td><td>${T.tough ?? "—"}</td><td>${T.harm ?? "—"}</td><td>${T.specialName ? `<strong>${T.specialName}:</strong> ` : ""}${T.special || "—"}</td></tr>`;
    }),
    "</tbody></table>",
  ].join("\n");
  return { frames, animals, perks, threats };
}

const GUIDE = [
  ["start", "Starting a mission", `<p>The quickest start: import the <strong>Second Nature: Starter</strong> adventure from the compendiums. It brings the six ready-made Bonded, the Hunt, the rules, the five missions and a scene for Wrenfield and each mission. On a mission's scene every map marker has a pin that opens the mission's journal, and the guards wait as hidden tokens beside their obstacle: a Clash there reveals them.</p>
<p>Open the <strong>Mission Tracker</strong> from the paw button in the token controls (on a mission's scene, that mission is already chosen). Choose one of the five missions (or a custom one), tick the Bonded who are playing and press <strong>Start the mission</strong>. Everyone gets their Wild back and loses their Hurt; Team Captain's Edge and an Exposed character's Scent 1 are applied for you.</p>
<p>Scouting comes first: a player rolls from their sheet or the tracker (the roll dialog already says Sense against Difficulty 2). The result sets the Edges, the Scent and who picks the way in; press <strong>Go in by way A</strong> or <strong>B</strong>.</p>`],
  ["rolling", "Rolling", `<p>Every <strong>Roll</strong> button opens the roll dialog. It knows the current obstacle: its tags, the approaches that work and their Difficulty, its guards and whether you're On the Trail. It lists every modifier with its source (Strengths, Weaknesses, animal perks, human perks, Tracker, Trophy, Distract, Coil) and applies the Cap. Tick friends to Help (each pays 1 Wild; Coyote's Pack pays once a scene) and choose Edges; anything over the Cap isn't spent.</p>
<p>The roll card shows the dice with hits highlighted and the result. A Fail or a Partial stays open while you could still <strong>Push</strong> (1 Wild), use <strong>Burst</strong> or <strong>Wily</strong>; press <strong>Accept</strong>, or the next roll anyone makes settles it. A Success can still be Pushed for a Critical, or counted as one with <strong>Charge</strong>.</p>`],
  ["automation", "What happens by itself", `<p>The Storyteller's client applies each roll once it is final: progress at point obstacles, who is past at group obstacles, Edges from Criticals, Scent (Partials and Fails at point obstacles, one rise when a group obstacle ends, +1 a round from the third, scouting), Hurt at dangerous obstacles, a Clash on a guarded Fail, Taken on any Fail once the Hunt is Up, and Down and Netted friends at the end of each scene. Shifting in a Clash marks the shifter Exposed and the Clash's Scent rise becomes 2.</p>
<p>In a Clash, roll against a threat (Strike, Distract or Slip Away). <strong>End round</strong> asks who each threat nobody rolled against goes for (a random friend is preselected). The Clash ends when every threat is out, nobody is left, or after round 4, and raises Scent once.</p>
<p>Every automation has a switch in the system settings. With one off, its outcome is listed on the tracker and the roll card gets an <strong>Apply the outcome</strong> button for the Storyteller.</p>`],
  ["end", "The Hunt is Up, and the end", `<p>When Scent reaches the Limit, the tracker announces it and, if the objective isn't done, offers <strong>Press on</strong> or <strong>Withdraw</strong> with the book's advice highlighted. When the last Escape obstacle is behind the team, the tracker shows Win, Costly Win or Loss; <strong>Finish the mission</strong> moves the Hunt track (+1 for a Costly Win, +2 for a Loss) and gives every character 1 Growth.</p>`],
];

/* ------------------------------------------------------------------ the Starter adventure */

const PIN = `${SYS}/assets/icons/pin.svg`;
const W = 800 * MAP_SCALE, H = 600 * MAP_SCALE, TOKEN = 120;   // scene pixels; a token is 1.2 squares of 100px
const at = ([x, y]) => [Math.round(x * MAP_SCALE), Math.round(y * MAP_SCALE)];

/** A mission's obstacle for a map label: A, B, 1–3, ★, E (or E1, E2). */
function obstacleFor(m, label) {
  if (label === "A") return { ob: m.waysIn[0][0], where: "Way in A" };
  if (label === "B") return { ob: m.waysIn[1][0], where: "Way in B" };
  if (label === "★") return { ob: m.objective, where: "Objective" };
  if (/^E\d?$/.test(label)) { const i = label === "E" ? 0 : Number(label[1]) - 1; return { ob: m.escape[i], where: m.escape.length > 1 ? `Escape ${i + 1}` : "Escape" }; }
  const i = Number(label) - 1;
  return { ob: m.inside[i], where: `Inside ${i + 1}` };
}

/** Where a marker's guards stand when the space to its right is taken by other markers. */
const GUARDS_BELOW = { lodge: ["1"] };

/** Guards as tokens in a row beside their marker (to its left near the right edge; below where
 *  GUARDS_BELOW says), kept inside the map. */
function guardTokens(m, label, ob, threatKeys) {
  const [mx, my] = at(MARKERS[m.id][label]);
  const n = ob.guards.length, gap = TOKEN + 6;
  const below = GUARDS_BELOW[m.id]?.includes(label);
  const right = mx + 64 + n * gap <= W;
  return ob.guards.map((g, j) => {
    if (below) {
      const x = mx - (n * gap - 6) / 2 + j * gap;
      return guard(m, ob, g, j, threatKeys, x, my + 64 + TOKEN / 2);
    }
    const x = right ? mx + 64 + j * gap : mx - 64 - TOKEN - j * gap;
    return guard(m, ob, g, j, threatKeys, x, my);
  });
}
function guard(m, ob, g, j, threatKeys, x, cy) {
  {
    return {
      name: THREATS[g].name, actor: { pack: "threats", key: threatKeys[g] }, img: artPath(`threat-${g}`),
      x: Math.max(0, Math.min(W - TOKEN, Math.round(x))), y: Math.max(0, Math.min(H - TOKEN, Math.round(cy - TOKEN / 2))),
      hidden: true, flags: { morphgame: { guard: { mission: m.id, obstacle: ob.id, n: j } } },
    };
  }
}

export function starterAdventure({ ready, threats, rules, missions }) {
  const threatKeys = Object.fromEntries(threats.map(t => [t.system.kind, t.key]));
  const missionKey = id => missions.find(d => d.flags.morphgame.mission === id).key;
  const scenes = [{
    key: "wrenfield", name: "Wrenfield", img: artPath("map-wrenfield"), thumb: artPath("map-wrenfield-thumb"), width: W, height: H, folder: "scenes",
    journal: { pack: "rules", key: "02-the-rules", page: "23-ch11" },
    // pins 1–5: the five missions, in the book's order
    notes: Object.entries(MARKERS.wrenfield).map(([label, pt]) => {
      const m = MISSIONS[Number(label) - 1];
      const [x, y] = at(pt);
      return { x, y: y - 92, icon: PIN, text: `${label}. ${missionTitle(m)}`, journal: { pack: "missions", key: missionKey(m.id), page: "mission" } };
    }),
  }, ...MISSIONS.map(m => {
    const notes = [], tokens = [];
    for (const [label, pt] of Object.entries(MARKERS[m.id])) {
      const { ob, where } = obstacleFor(m, label);
      if (!ob) throw new Error(`${m.id}: the map's marker ${label} has no obstacle`);
      const [x, y] = at(pt);
      notes.push({ x, y: y - 92, icon: PIN, text: `${where}: ${ob.name}`, journal: { pack: "missions", key: missionKey(m.id), page: "mission" } });
      if (ob.guards?.length) tokens.push(...guardTokens(m, label, ob, threatKeys));
    }
    return {
      key: m.id, name: missionTitle(m), img: artPath(`map-${m.id}`), thumb: artPath(`map-${m.id}-thumb`), width: W, height: H, folder: "scenes",
      journal: { pack: "missions", key: missionKey(m.id), page: "mission" }, notes, tokens,
      flags: { morphgame: { mission: m.id } },
    };
  })];
  return {
    key: "01-starter",
    name: "Second Nature: Starter",
    img: artPath("cover"),
    caption: "Everything for a first night: six ready-made Bonded, the Hunt, the rules, and five missions with their maps.",
    description: [
      "<p>Kids who can become animals, against the rich and secret Gilded Hunt. This adventure brings everything a first night needs:</p>",
      "<ul>",
      "<li><strong>The six ready-made Bonded</strong> of Chapter 18, with their portraits, and <strong>the Hunt</strong>: Beaters, Hounds, Trappers, Huntsmen and the Masters.</li>",
      "<li><strong>A scene for Wrenfield and for each of the five missions</strong>, from the easy first night at Pemberton's Pets to the Lodge on the Hill. Every map marker has a pin that opens the mission's journal; the guards wait as hidden tokens beside their obstacle.</li>",
      "<li><strong>The rules</strong> and the one-page reference, as journals.</li>",
      "</ul>",
      "<p><strong>To play:</strong> give each player a Bonded, open the scene for <em>Pemberton's Pets</em>, then open the Mission Tracker (the paw button in the token controls), tick the players' Bonded and press <strong>Start the mission</strong>.</p>",
    ].join("\n"),
    folders: [
      { key: "bonded", name: "Second Nature: Ready-Made Bonded", type: "Actor", color: "#3e5a34" },
      { key: "hunt", name: "Second Nature: The Hunt", type: "Actor", color: "#8c2f24" },
      { key: "missions", name: "Second Nature: Missions", type: "JournalEntry", color: "#8c2f24" },
      { key: "rules", name: "Second Nature: Rules", type: "JournalEntry", color: "#3e5a34" },
      { key: "scenes", name: "Second Nature", type: "Scene", color: "#1f2a3a" },
    ],
    actors: [
      ...ready.map(d => ({ pack: "ready-made-bonded", key: d.key, folder: "bonded" })),
      ...threats.map(d => ({ pack: "threats", key: d.key, folder: "hunt" })),
    ],
    journal: [
      ...missions.map(d => ({ pack: "missions", key: d.key, folder: "missions" })),
      ...rules.map(d => ({ pack: "rules", key: d.key, folder: "rules" })),
    ],
    scenes,
  };
}

/* ------------------------------------------------------------------ write */

function write(pack, docs) {
  const dir = join(SRC, pack);
  mkdirSync(dir, { recursive: true });
  const want = new Map(docs.map(d => [`${d.key}.json`, JSON.stringify(d, null, 2) + "\n"]));
  const changes = [];
  for (const f of existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith(".json")) : []) {
    if (!want.has(f)) { changes.push(`${pack}/${f} (removed)`); if (!CHECK) rmSync(join(dir, f)); }
  }
  for (const [f, text] of want) {
    const path = join(dir, f);
    const old = existsSync(path) ? readFileSync(path, "utf8") : null;
    if (old !== text) { changes.push(`${pack}/${f}`); if (!CHECK) writeFileSync(path, text); }
  }
  return changes;
}

const CHECK = process.argv.includes("--check");

export function buildAll() {
  const ready = readyMadeFromBook().map(bondedDoc);
  for (const d of ready) {
    if (d.system.wild.max !== wildMax({ perk: d.system.perk, picks: [] })) throw new Error(`${d.name}: the book's Wild doesn't match the rules`);
  }
  const texts = threatTexts();
  const threats = THREAT_ORDER.map((k, i) => threatDoc(k, i, texts));
  const cat = catalogueHtml();
  const rulesChapters = ["12-ch02.html", "13-ch03.html", "14-ch04.html", "15-ch05.html", "16-ch06.html", "17-ch07.html", "18-ch08.html", "21-ch09.html", "22-ch10.html", "23-ch11.html", "24-ch12.html"];
  const rules = [
    { key: "01-quick-reference", name: "Quick Reference", pages: [page("at-the-table", titleOf(chapter("42-ch19.html")), cleanHtml(chapter("42-ch19.html")))] },
    { key: "02-the-rules", name: "The Rules", pages: rulesChapters.map(f => page(f.replace(/\.html$/, ""), titleOf(chapter(f)), cleanHtml(chapter(f)))) },
    { key: "03-catalogue", name: "Frames, Animals, Perks and Threats", pages: [
      page("frames", "Frames", cat.frames), page("animals", "Animals and Animal Perks", cat.animals),
      page("perks", "Human Perks", cat.perks), page("threats", "Threats", cat.threats),
    ] },
    { key: "04-foundry", name: "Second Nature in Foundry", pages: GUIDE.map(([k, n, html]) => page(k, n, html)) },
  ];
  const missionFiles = readdirSync(CH).filter(f => f.endsWith(".html"));
  const missions = MISSIONS.map((m, i) => {
    const file = missionFiles.find(f => chapter(f).includes(`<!-- obstacles:${m.id} -->`));
    const html = file ? chapter(file) : "";
    const body = cleanHtml(html.replace(new RegExp(`<!-- obstacles:${m.id} -->[\\s\\S]*?<!-- /obstacles:${m.id} -->`), ""));
    const table = cleanHtml(missionTable(m));
    const label = m.label[0].toUpperCase() + m.label.slice(1);
    return {
      key: `${String(i + 1).padStart(2, "0")}-${m.id}`, name: missionTitle(m),
      flags: { morphgame: { mission: m.id } },
      pages: [
        { key: "map", name: "Map", type: "image", src: artPath(`map-${m.id}`),
          caption: `${missionTitle(m)}. A and B are the ways in, the numbers the obstacles inside, ★ the objective and E the Escape, as in the table on the next page.` },
        page("obstacles", "Obstacles and Limits", [
          `<p><strong>${label} mission.</strong> ${m.brief}</p>`,
          table,
          `<p>Scouting: Sense, Difficulty ${scoutDifficulty(m)}. Run it from the Mission Tracker: it knows every obstacle on this page.</p>`,
        ].join("\n")),
        page("mission", "The Mission", body),
      ],
    };
  });
  const starter = starterAdventure({ ready, threats, rules, missions });
  return [
    ...write("ready-made-bonded", ready),
    ...write("threats", threats),
    ...write("rules", rules),
    ...write("missions", missions),
    ...write("starter", [starter]),
  ];
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const changes = buildAll();
  if (CHECK) {
    if (changes.length) { console.error(`Pack sources are out of date:\n  ${changes.join("\n  ")}\nRun: node tools/build-pack-sources.mjs && npm run build:packs`); process.exit(1); }
    console.log("Pack sources are up to date.");
  } else console.log(changes.length ? `Wrote:\n  ${changes.join("\n  ")}` : "Pack sources already up to date.");
}

export { tag, APPROACH_INFO };
