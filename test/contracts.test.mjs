/**
 * The shared names (module/contracts.mjs) are all real: every setting is registered,
 * every GM operation is registered exactly once, every card kind, hook, template and app id
 * is used; and every UI string the code and templates use exists in lang/en.json, with the
 * config's English rules text matching the language file word for word.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SETTINGS, OPS, CARD, HOOKS, TEMPLATES, APPS } from "../module/contracts.mjs";
import * as C from "../module/config.mjs";
import { boot } from "../tools/world-fixture.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const walk = (dir, ext) => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir, e.name), ext) : e.name.endsWith(ext) ? [join(dir, e.name)] : []);
const code = walk(join(ROOT, "module"), ".mjs").map(f => readFileSync(f, "utf8")).join("\n");
const templates = walk(join(ROOT, "templates"), ".hbs").map(f => readFileSync(f, "utf8")).join("\n");
const lang = JSON.parse(readFileSync(join(ROOT, "lang/en.json"), "utf8"));
const get = (k) => k.split(".").reduce((o, p) => (o == null ? undefined : o[p]), lang);

test("every setting is registered, every GM operation registered once", async () => {
  const W = await boot();
  for (const key of Object.values(SETTINGS)) assert.doesNotThrow(() => W.game.settings.get("morphgame", key), key);
  const { registeredOps } = await import("../module/net/gm-ops.mjs");
  assert.deepEqual([...registeredOps()].sort(), Object.values(OPS).sort());
});

test("every card kind, hook, template and app id is used", () => {
  for (const [k, v] of Object.entries(CARD)) assert.match(code, new RegExp(`CARD\\.${k}\\b`), `CARD.${k} (${v})`);
  for (const k of Object.keys(HOOKS)) assert.match(code, new RegExp(`HOOKS\\.${k}\\b`), `HOOKS.${k}`);
  for (const [k, path] of Object.entries(TEMPLATES)) {
    assert.ok(existsSync(join(ROOT, path)), path);
    assert.match(code, new RegExp(`TEMPLATES\\.${k}\\b`), `TEMPLATES.${k}`);
  }
  for (const k of Object.keys(APPS)) assert.match(code, new RegExp(`APPS\\.${k}\\b`), `APPS.${k}`);
});

test("every static MG.* key used in code and templates exists in lang/en.json", () => {
  const keys = new Set();
  for (const m of (code + templates).matchAll(/["'`](MG\.[A-Za-z0-9_.]+)["'`]/g)) if (!m[1].endsWith(".")) keys.add(m[1]);
  for (const m of templates.matchAll(/localize ["'](MG\.[A-Za-z0-9_.]+)["']/g)) keys.add(m[1]);
  const missing = [...keys].filter(k => typeof get(k) !== "string");
  assert.deepEqual(missing, []);
});

test("dynamic key families are complete (reasons, problems, log lines, causes, results)", async () => {
  // MG.Reason.<code>: every reason the code can produce
  const reasons = new Set([...code.matchAll(/reason:\s*"(\w+)"/g)].map(m => m[1]));
  for (const m of code.matchAll(/return\s*\{\s*ok:\s*false,\s*reason:\s*"(\w+)"/g)) reasons.add(m[1]);
  for (const r of ["taken", "down", "netted", "animalWits", "zeroRating", "actionApproach"]) reasons.add(r);
  assert.deepEqual([...reasons].filter(r => typeof get(`MG.Reason.${r}`) !== "string"), []);
  // MG.Problem.<code>: every validateBonded code
  const charCode = readFileSync(join(ROOT, "module/logic/character.mjs"), "utf8");
  const problems = [...charCode.matchAll(/code:\s*"(\w+)"/g)].map(m => m[1]);
  assert.ok(problems.length >= 10);
  assert.deepEqual(problems.filter(p => typeof get(`MG.Problem.${p}`) !== "string"), []);
  // MG.Log.* and MG.Cause.* from the mission reducer
  const mission = readFileSync(join(ROOT, "module/logic/mission.mjs"), "utf8");
  const logs = [...mission.matchAll(/"(MG\.Log\.\w+)"/g)].map(m => m[1]);
  assert.deepEqual(logs.filter(k => typeof get(k) !== "string"), []);
  const causes = new Set([...mission.matchAll(/raise\(S, [^,]+, [^,]+, "(\w+)"/g)].map(m => m[1]));
  for (const m of mission.matchAll(/gainEdge\(S, "(\w+)"\)/g)) causes.add(m[1]);
  assert.ok(causes.size >= 6);
  assert.deepEqual([...causes].filter(c => typeof get(`MG.Cause.${c}`) !== "string"), []);
  for (const r of C.RESULTS) assert.equal(typeof get(`MG.Result.${r}`), "string");
  for (const r of ["win", "costly", "loss"]) { assert.equal(typeof get(`MG.MissionResult.${r}`), "string"); assert.equal(typeof get(`MG.Notice.resultHint.${r}`), "string"); }
  for (const s of ["idle", "scout", "way", "in", "escape", "done"]) assert.equal(typeof get(`MG.Tracker.status.${s}`), "string");
  for (const t of ["hurt", "net", "take", "recover", "free", "expose", "clash", "growth", "unstick", "prepare"]) assert.equal(typeof get(`MG.Tracker.suggestEffect.${t}`), "string");
  for (const c of ["wild", "hurt", "manual", "none"]) { assert.equal(typeof get(`MG.Shift.into.${c}`), "string"); assert.equal(typeof get(`MG.Sheet.shiftCost.${c}`), "string"); }
  for (const a of C.CLASH_ACTION_ORDER) assert.equal(typeof get(`MG.Clash.${a}Vs`), "string");
  for (const k of Object.values(SETTINGS)) if (!["missionState", "systemMigrationVersion", "customMission"].includes(k)) {
    assert.equal(typeof get(`MG.Setting.${k}.name`), "string", k); assert.equal(typeof get(`MG.Setting.${k}.hint`), "string", k);
  }
});

test("the config's English text and its lang keys agree word for word", () => {
  const same = (key, english) => assert.equal(get(key), english, key);
  for (const a of Object.values(C.APPROACH_INFO)) same(a.label, a.name);
  for (const t of Object.values(C.TAG_INFO)) same(t.label, t.name);
  for (const f of Object.values(C.FRAMES)) same(f.label, f.name);
  for (const a of Object.values(C.ANIMALS)) { same(a.label, a.name); same(a.perkLabel, a.perk); same(a.textLabel, a.text); }
  for (const p of Object.values(C.PERKS)) { same(p.label, p.name); same(p.textLabel, p.text); }
  for (const t of Object.values(C.THREATS)) { same(t.label, t.name); if (t.special) same(t.specialLabel, t.special); }
  for (const [k, l] of Object.entries(C.LABELS)) same(l.label, k[0].toUpperCase() + k.slice(1));
  for (const s of Object.values(C.STATUS_INFO)) { assert.equal(typeof get(s.label), "string"); assert.equal(typeof get(s.hint), "string"); }
  for (const g of Object.values(C.GROWTH_PICKS)) { assert.equal(typeof get(g.label), "string"); assert.equal(typeof get(g.hint), "string"); }
  same("TYPES.Actor.bonded", "Bonded");
  same("MG.SystemTitle", JSON.parse(readFileSync(join(ROOT, "system.json"), "utf8")).title);
});

test("no forbidden names anywhere in the system's code, templates, styles, language, packs or docs", () => {
  const files = [
    ...walk(join(ROOT, "module"), ".mjs"), ...walk(join(ROOT, "templates"), ".hbs"), ...walk(join(ROOT, "styles"), ".css"),
    join(ROOT, "lang/en.json"), join(ROOT, "system.json"), ...walk(join(ROOT, "packs/_source"), ".json"),
    ...["docs/FOUNDRY.md", "TESTING.md"].map(f => join(ROOT, f)).filter(existsSync),
  ];
  const banned = [["Ani", "morphs"].join(""), ["Clau", "de"].join(""), ["Anthro", "pic"].join("")];
  for (const f of files) {
    const s = readFileSync(f, "utf8");
    for (const b of banned) assert.ok(!s.includes(b), `${f} mentions ${b}`);
  }
});
