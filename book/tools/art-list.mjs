#!/usr/bin/env node
/**
 * Writes book/art/ART-LIST.md: every picture the book uses, where it goes, its shape,
 * its printed size and the smallest file that prints sharply, read from the chapters,
 * book/src/spots.json and book/tools/art-sizes.mjs, so the list can't drift from the book.
 *
 *   node book/tools/art-list.mjs           write the list
 *   node book/tools/art-list.mjs --check   exit 1 if the list is out of date (used by the tests)
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { KINDS, kindOf, minPixels } from "./art-sizes.mjs";

const BOOK = join(dirname(fileURLToPath(import.meta.url)), "..");
const CH = join(BOOK, "src", "chapters");
const ART = join(BOOK, "art");
const OUT = join(ART, "ART-LIST.md");
const strip = s => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

/** Every data-art use in reading order, with a plain description of where it is. */
function uses() {
  const found = [];
  for (const f of readdirSync(CH).filter(f => f.endsWith(".html")).sort()) {
    const html = readFileSync(join(CH, f), "utf8");
    let where;
    if (/class="cover"/.test(html)) where = "Front cover";
    else if (/class="back-cover"/.test(html)) where = "Back cover";
    else if (/class="part"/.test(html)) where = `${strip(html.match(/class="part-kicker">([\s\S]*?)</)?.[1] ?? "")} page`.replace(/^(\w)(\w*)\s(\w)/, (m, a, b, c) => a + b.toLowerCase() + " " + c.toUpperCase());
    else {
      const num = strip(html.match(/class="chapter-num">([\s\S]*?)</)?.[1] ?? "").split(" · ")[0];
      const title = strip(html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1] ?? f);
      where = num ? `${num}, ${title}` : title;
    }
    for (const m of html.matchAll(/data-art="([^"]+)"/g)) found.push({ name: m[1], where, chapterId: html.match(/<section class="chapter[^"]*" id="([^"]+)"/)?.[1] });
  }
  return found;
}

function chapterNames() {
  const names = {};
  for (const f of readdirSync(CH).filter(f => f.endsWith(".html"))) {
    const html = readFileSync(join(CH, f), "utf8");
    const id = html.match(/<section class="chapter[^"]*" id="([^"]+)"/)?.[1];
    if (!id) continue;
    names[id] = `${strip(html.match(/class="chapter-num">([\s\S]*?)</)?.[1] ?? "").split(" · ")[0]}, ${strip(html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1] ?? id)}`;
  }
  return names;
}

/** What the stand-in shows: the SVG's title. */
function brief(name) {
  const f = join(ART, `${name}.svg`);
  if (!existsSync(f)) return "—";
  return (readFileSync(f, "utf8").match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "—").replace(/\|/g, "/").trim();
}

const SECTIONS = [
  ["Covers", ["cover", "back"]],
  ["Part pages", ["part"]],
  ["Chapter strips", ["chapter", "quickref"]],
  ["Maps", ["map"]],
  ["Portraits", ["portrait", "threat"]],
  ["Spot illustrations", ["spot"]],
];

export function artList() {
  const rows = uses();
  const spots = JSON.parse(readFileSync(join(BOOK, "src", "spots.json"), "utf8"));
  const chapters = chapterNames();
  for (const [ch, list] of Object.entries(spots)) {
    list.forEach((name, i) => rows.push({
      name,
      where: ch === "spare" ? "A spare: the end of any chapter with room" : `The end of ${chapters[ch] ?? ch}${i ? " (second choice)" : ""}, when there's room`,
    }));
  }
  const byName = new Map();
  for (const r of rows) { if (!byName.has(r.name)) byName.set(r.name, []); byName.get(r.name).push(r.where); }
  const unknown = [...byName.keys()].filter(n => !kindOf(n));
  if (unknown.length) throw new Error(`no print size for: ${unknown.join(", ")} (add it to book/tools/art-sizes.mjs)`);

  const out = [
    "# Art list",
    "",
    "Every picture in the book, where it goes, and the smallest file that prints sharply.",
    "This list is written by the build tools from the chapters; don't edit it by hand",
    "(run `node book/tools/art-list.mjs` after changing which pictures the book uses).",
    "",
    "## Swapping in your own artwork",
    "",
    "1. Save your picture in `book/art/` with the **name** from the tables below and the",
    "   ending `.png`, `.jpg` or `.webp`, for example `book/art/map-zoo.png`.",
    "2. Rebuild the book (`npm run build:book`, and `npm run build:book -- --print` for the print file).",
    "   Your picture is used in place of the stand-in drawing of the same name; nothing else changes.",
    "   To go back to the stand-in, move your file out of `book/art/`.",
    "3. The build warns if a picture is too small to print sharply (under 300 pixels per inch",
    "   at its printed size). The **smallest file** column gives the size to aim for; bigger is fine.",
    "",
    "Notes:",
    "",
    "- Draw at the shape given. A picture of another shape still works: strips and portraits",
    "  are cropped to fill, from the middle; maps, part pages and the back panel keep their",
    "  own shape and are scaled to the width; spot illustrations are scaled to the height.",
    "- PNG keeps transparency. Portraits are shown as circles, so their corners never show.",
    "- Keep the checklist in `ART-CHECKLIST.md` in mind (true scale, the right number of legs,",
    "  each character's Mark on the correct side, and nothing halfway through a change).",
    "- Words drawn into a picture must stay at least 7.5pt when printed; spot illustrations",
    "  should have none, because they can print small.",
    "",
  ];
  for (const [title, kinds] of SECTIONS) {
    const names = [...byName.keys()].filter(n => kinds.includes(kindOf(n))).sort();
    if (!names.length) continue;
    out.push(`## ${title}`, "");
    for (const k of kinds) if (names.some(n => kindOf(n) === k)) {
      const K = KINDS[k], px = minPixels(k);
      const need = K.fit === "width" ? `${px.w} px wide` : K.fit === "height" ? `${px.h} px tall` : `${px.w} × ${px.h} px`;
      out.push(`**${K.shape}**, printed ${K.w} × ${K.h} in. Smallest file: ${need}. ${K.note}`, "");
    }
    out.push("| Name | Where it goes | Smallest file | What the stand-in shows |", "|---|---|---|---|");
    for (const n of names) {
      const k = kindOf(n), px = minPixels(k);
      const need = KINDS[k].fit === "width" ? `${px.w} px wide` : KINDS[k].fit === "height" ? `${px.h} px tall` : `${px.w} × ${px.h}`;
      out.push(`| \`${n}\` | ${byName.get(n).join("; ")} | ${need} | ${brief(n)} |`);
    }
    out.push("");
  }
  out.push(`${byName.size} pictures in all.`, "");
  return out.join("\n");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const text = artList();
  if (process.argv.includes("--check")) {
    const cur = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
    if (cur !== text) { console.error("book/art/ART-LIST.md is out of date: run node book/tools/art-list.mjs"); process.exit(1); }
    console.log("ART-LIST.md is up to date");
  } else {
    writeFileSync(OUT, text);
    console.log(`wrote book/art/ART-LIST.md`);
  }
}
