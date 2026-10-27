/**
 * The Starter adventure (packs/_source/starter): it holds the same actors and journals as
 * the other packs; every token, map pin and scene link points at something inside it; each
 * mission scene has a pin on every map marker and a hidden token for every guard; and every
 * picture it names exists in assets/ at the size tools/foundry-art.mjs gives.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PACKS, readSource, toCliDoc, makeId } from "../tools/pack-config.mjs";
import { FOUNDRY_ART, SYS, ART_DIR } from "../tools/foundry-art.mjs";
import { imageSize } from "../book/tools/image-size.mjs";
import { MARKERS } from "../book/tools/art-gen/scenes/sn-maps.mjs";
import { MISSIONS } from "../module/logic/missions.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const def = PACKS.find(d => d.file === "starter");
const [raw] = readSource("starter");
const adv = toCliDoc(def, raw, 0);
const local = path => join(ROOT, path.replace(`${SYS}/`, ""));

test("the Starter holds every ready-made Bonded, threat, mission and rules journal, with the packs' ids", () => {
  const ids = file => readSource(file).map(d => makeId(PACKS.find(p => p.file === file).out, d.key));
  assert.deepEqual(adv.actors.map(a => a._id), [...ids("ready-made-bonded"), ...ids("threats")]);
  assert.deepEqual(adv.journal.map(j => j._id), [...ids("missions"), ...ids("rules")]);
  assert.deepEqual(adv.scenes.map(s => s.name), ["Wrenfield", ...MISSIONS.map(m => adv.journal.find(j => j.flags?.morphgame?.mission === m.id).name)]);
  const folders = new Set(adv.folders.map(f => f._id));
  for (const d of [...adv.actors, ...adv.journal, ...adv.scenes]) assert.ok(folders.has(d.folder), `${d.name} is in a folder`);
  for (const d of [...adv.actors, ...adv.journal]) assert.equal(d._key, undefined, "no database keys inside an Adventure");
});

test("every token, pin and scene link points inside the adventure", () => {
  const actors = new Set(adv.actors.map(a => a._id));
  const pages = new Map(adv.journal.map(j => [j._id, new Set(j.pages.map(p => p._id))]));
  for (const s of adv.scenes) {
    assert.ok(pages.get(s.journal)?.has(s.journalEntryPage), `${s.name}: its journal page`);
    for (const t of s.tokens) assert.ok(actors.has(t.actorId), `${s.name}: ${t.name}'s actor`);
    for (const n of s.notes) assert.ok(pages.get(n.entryId)?.has(n.pageId), `${s.name}: pin "${n.text}"`);
    for (const t of s.tokens) {
      assert.ok(t.x >= 0 && t.y >= 0 && t.x + 120 <= s.width && t.y + 120 <= s.height, `${s.name}: ${t.name} is on the map`);
      assert.equal(t.hidden, true, "guards wait hidden");
    }
  }
});

test("each mission scene: a pin on every map marker and a hidden token for every guard", () => {
  for (const m of MISSIONS) {
    const s = adv.scenes.find(x => x.flags?.morphgame?.mission === m.id);
    assert.ok(s, `${m.id} has a scene`);
    assert.equal(s.notes.length, Object.keys(MARKERS[m.id]).length, `${m.id}: one pin per marker`);
    const obstacles = [...m.waysIn.flat(), ...m.inside, m.objective, ...m.escape];
    for (const ob of obstacles) assert.ok(s.notes.some(n => n.text.endsWith(`: ${ob.name}`)), `${m.id}: a pin for ${ob.name}`);
    const guards = obstacles.flatMap(ob => (ob.guards ?? []).map(g => `${ob.id}:${g}`)).sort();
    const tokens = s.tokens.map(t => `${t.flags.morphgame.guard.obstacle}:${adv.actors.find(a => a._id === t.actorId).system.kind}`).sort();
    assert.deepEqual(tokens, guards, `${m.id}: the guards`);
  }
  const town = adv.scenes.find(s => s.name === "Wrenfield");
  assert.equal(town.notes.length, MISSIONS.length, "Wrenfield: a pin for each mission");
});

test("every picture the Foundry packs name exists, at its size", () => {
  const paths = new Set([adv.img]);
  for (const a of adv.actors) { paths.add(a.img); paths.add(a.prototypeToken.texture.src); }
  for (const j of adv.journal) for (const p of j.pages) if (p.type === "image") paths.add(p.src);
  for (const s of adv.scenes) {
    paths.add(s.background.src); paths.add(s.thumb);
    for (const t of s.tokens) paths.add(t.texture.src);
    for (const n of s.notes) paths.add(n.texture.src);
  }
  for (const p of paths) assert.ok(existsSync(local(p)), `${p} exists (else: npm run build:art)`);
  for (const a of FOUNDRY_ART) {
    const size = imageSize(join(ROOT, ART_DIR, a.file));
    assert.deepEqual([size?.width, size?.height], [a.w, a.h], `${a.file} is ${a.w}×${a.h}`);
  }
  const missions = readSource("missions");
  for (const d of missions) assert.equal(d.pages[0].type, "image", `${d.name}: the map comes first`);
});
