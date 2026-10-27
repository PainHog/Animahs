/**
 * Shared compendium pack configuration — the single source of truth for the
 * pack build (build-packs.mjs) and the validator (validate.mjs), so the two
 * can never drift on pack names, id derivation, or source layout.
 *
 * Source layout: one JSON file per document under packs/_source/<file>/, each
 * with a human-friendly `key` slug (no ids). Ids are derived deterministically
 * from (pack, key), so rebuilding never reshuffles them.
 */
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const SRC = join(ROOT, "packs", "_source");
export const OUT = join(ROOT, "packs");

/**
 * file → output pack, document class & subtype. Must match system.json packs[]
 * (and an Item/Actor subtype must be declared in system.json documentTypes).
 * The sources are written by tools/build-pack-sources.mjs from the rulebook and the
 * shared rules data; never edit them by hand.
 */
export const PACKS = [
  { file: "ready-made-bonded", out: "ready-made-bonded", collection: "actors", type: "Actor", subtype: "bonded" },
  { file: "threats", out: "threats", collection: "actors", type: "Actor", subtype: "threat" },
  { file: "rules", out: "rules", collection: "journal", type: "JournalEntry", subtype: null },
  { file: "missions", out: "missions", collection: "journal", type: "JournalEntry", subtype: null },
  // one Adventure that imports everything above, with a scene for the town and each mission
  { file: "starter", out: "starter", collection: "adventures", type: "Adventure", subtype: null },
];

/** Deterministic 16-char alphanumeric id from a namespace + key (sha256 hex prefix). */
export function makeId(...parts) {
  return createHash("sha256").update(parts.join("::")).digest("hex").slice(0, 16);
}

/**
 * Read a pack's source: one JSON file per document under packs/_source/<name>/,
 * returned as an array sorted by filename (deterministic for reproducible builds).
 */
export function readSource(file) {
  const dir = join(SRC, file);
  if (!existsSync(dir)) throw new Error(`pack source folder missing: packs/_source/${file}/`);
  return readdirSync(dir)
    .filter(f => f.endsWith(".json"))
    .sort()
    .map(f => JSON.parse(readFileSync(join(dir, f), "utf8")));
}

const manifest = JSON.parse(readFileSync(join(ROOT, "system.json"), "utf8"));

/** Provenance stamped on every document. */
export const STATS = {
  // Oldest core whose schema this data fits: v13 refuses to import documents
  // stamped with a newer core, and v14 migrates up from here.
  coreVersion: "13.351",
  systemId: manifest.id,
  systemVersion: manifest.version,
  createdTime: null,
  modifiedTime: null,
  lastModifiedBy: null,
  compendiumSource: null,
  duplicateSource: null,
  exportSource: null
};

/**
 * Turn one of our source docs into a CLI-ready document (deterministic `_id`,
 * `_key`, `_stats`, inline embedded pages). Shared by the build and validator.
 */
export function toCliDoc(def, raw, index) {
  const id = makeId(def.out, raw.key);
  const sort = (index + 1) * 100;

  if (def.type === "Adventure") return adventureDoc(def, raw, id, sort);

  if (def.type === "JournalEntry") {
    return {
      _id: id,
      _key: `!journal!${id}`,
      name: raw.name,
      pages: (raw.pages ?? []).map((page, p) => {
        const pid = makeId(def.out, raw.key, page.key ?? String(p));
        const doc = {
          _id: pid,
          _key: `!journal.pages!${id}.${pid}`,
          name: page.name,
          type: page.type ?? "text",
          title: page.title ?? { show: true, level: 1 },
          text: page.text ?? { format: 1, content: "" },
          sort: (p + 1) * 100,
          ownership: { default: -1 },
          flags: {},
          _stats: STATS
        };
        if (doc.type === "image") Object.assign(doc, { src: page.src, image: { caption: page.caption ?? "" } });
        return doc;
      }),
      categories: [],
      folder: null,
      sort,
      ownership: { default: 0 },
      flags: raw.flags ?? {},
      _stats: STATS
    };
  }

  const doc = {
    _id: id,
    _key: `!${def.collection}!${id}`,
    name: raw.name,
    type: def.subtype,
    img: raw.img,
    system: raw.system ?? {},
    effects: [],
    folder: null,
    sort,
    ownership: { default: 0 },
    flags: raw.flags ?? {},
    _stats: STATS
  };
  if (def.type === "Actor") {
    doc.items = [];
    // null (not "") disables a token bar; "" would be cleaned back to the
    // system's primaryTokenAttribute. Each source may set its own token.
    doc.prototypeToken = raw.prototypeToken ?? { bar1: { attribute: null }, bar2: { attribute: null } };
  }
  return doc;
}

/* ------------------------------------------------------------ the Starter adventure */

/**
 * An Adventure source names the documents it holds by pack and key ({ pack, key }), so they
 * are the very same actors and journals as in the other packs (same ids: importing both
 * just updates). Scenes are written out in full here; their tokens and notes name their
 * actor or journal page the same way.
 */
function adventureDoc(def, raw, id, sort) {
  const folderId = key => (key ? makeId(def.out, raw.key, "folder", key) : null);
  const resolve = ref => {
    const d = PACKS.find(x => x.file === ref.pack);
    if (!d) throw new Error(`${raw.key}: no pack "${ref.pack}"`);
    const list = readSource(d.file);
    const index = list.findIndex(x => x.key === ref.key);
    if (index < 0) throw new Error(`${raw.key}: no "${ref.key}" in ${ref.pack}`);
    return { def: d, raw: list[index], index, id: makeId(d.out, ref.key) };
  };
  // inside an Adventure the documents are plain data: no database keys
  const plain = doc => { delete doc._key; for (const pg of doc.pages ?? []) delete pg._key; return doc; };
  const pageOf = ref => {
    const r = resolve(ref);
    if (!ref.page) return { entry: r.id, page: null };
    if (!(r.raw.pages ?? []).some(p => p.key === ref.page)) throw new Error(`${raw.key}: ${ref.pack}/${ref.key} has no page "${ref.page}"`);
    return { entry: r.id, page: makeId(r.def.out, ref.key, ref.page) };
  };
  const embed = list => (list ?? []).map(ref => {
    const r = resolve(ref);
    return { ...plain(toCliDoc(r.def, r.raw, r.index)), folder: folderId(ref.folder) };
  });
  const folders = (raw.folders ?? []).map((f, i) => ({
    _id: folderId(f.key), name: f.name, type: f.type, description: "", folder: folderId(f.parent ?? null),
    sorting: "m", sort: (i + 1) * 100, color: f.color ?? null, flags: {}, _stats: STATS
  }));
  const scenes = (raw.scenes ?? []).map((sc, i) => {
    const sid = makeId(def.out, raw.key, "scene", sc.key);
    const link = sc.journal ? pageOf(sc.journal) : { entry: null, page: null };
    return {
      _id: sid,
      name: sc.name,
      active: false,
      navigation: true,
      navOrder: (i + 1) * 100,
      navName: "",
      background: { src: sc.img },
      foreground: null,
      thumb: sc.thumb ?? null,
      width: sc.width,
      height: sc.height,
      padding: 0.1,
      initial: null,
      backgroundColor: sc.backgroundColor ?? "#1f2a3a",
      grid: { type: 0, size: 100 },          // gridless: the game has no squares to count
      tokenVision: false,
      drawings: [], lights: [], sounds: [], regions: [], templates: [], tiles: [], walls: [],
      tokens: (sc.tokens ?? []).map((t, n) => ({
        _id: makeId(def.out, raw.key, sc.key, "token", String(n)),
        name: t.name,
        actorId: resolve(t.actor).id,
        actorLink: false,
        x: t.x, y: t.y, width: t.size ?? 1.2, height: t.size ?? 1.2,
        texture: { src: t.img },
        hidden: t.hidden ?? true,
        disposition: -1,
        displayName: 30,                      // on hover
        displayBars: 0,
        lockRotation: true,
        sort: n,
        flags: t.flags ?? {}
      })),
      notes: (sc.notes ?? []).map((nt, n) => {
        const to = pageOf(nt.journal);
        return {
          _id: makeId(def.out, raw.key, sc.key, "note", String(n)),
          entryId: to.entry, pageId: to.page,
          x: nt.x, y: nt.y,
          texture: { src: nt.icon },
          iconSize: nt.iconSize ?? 48,
          text: nt.text,
          fontSize: 28,
          textAnchor: 2,                      // above the pin, clear of the map's marker
          textColor: "#ffffff",
          global: false,
          sort: n,
          flags: {}
        };
      }),
      playlist: null,
      playlistSound: null,
      journal: link.entry,
      journalEntryPage: link.page,
      weather: "",
      folder: folderId(sc.folder),
      sort: (i + 1) * 100,
      ownership: { default: 0 },
      flags: sc.flags ?? {},
      _stats: STATS
    };
  });
  return {
    _id: id,
    _key: `!adventures!${id}`,
    name: raw.name,
    img: raw.img,
    caption: raw.caption ?? "",
    description: raw.description ?? "",
    actors: embed(raw.actors),
    combats: [], items: [], tables: [], macros: [], cards: [], playlists: [],
    journal: embed(raw.journal),
    scenes,
    folders,
    sort,
    flags: raw.flags ?? {},
    _stats: STATS
  };
}
