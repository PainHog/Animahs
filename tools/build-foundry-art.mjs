#!/usr/bin/env node
/**
 * Makes the Foundry system's pictures (assets/art/) from the book's art, listed in
 * tools/foundry-art.mjs. For each one it uses Richard's own picture when book/art/ holds
 * NAME.png, .jpg, .jpeg or .webp, and the stand-in NAME.svg otherwise, exactly as the
 * book build does. Portraits are cut to a circle (tokens and sheets show them round);
 * maps and the cover keep their shape.
 *
 *   node tools/build-foundry-art.mjs         (npm run build:art)
 * Run it after adding or changing a picture in book/art/, then rebuild the packs.
 */
import { chromium } from "playwright-core";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./pack-config.mjs";
import { FOUNDRY_ART, ART_DIR } from "./foundry-art.mjs";
import { RASTER_EXT, MIME } from "../book/tools/image-size.mjs";

const BOOK_ART = join(ROOT, "book", "art");
// the book's typefaces, so labels drawn in the art (map labels) look as they do in print
const FONT_DIR = join(ROOT, "node_modules", "@fontsource");
const fontFace = (family, pkg, weight, style) => {
  const f = join(FONT_DIR, pkg, "files", `${pkg}-latin-${weight}-${style}.woff2`);
  if (!existsSync(f)) throw new Error(`font file missing: ${f} — run npm install`);
  return `@font-face{font-family:"${family}";src:url(data:font/woff2;base64,${readFileSync(f).toString("base64")}) format("woff2");font-weight:${weight};font-style:${style};}`;
};
const FONTS = [
  ...[400, 700, 800, 900].flatMap(w => [fontFace("Alegreya Sans", "alegreya-sans", w, "normal"), fontFace("Alegreya Sans", "alegreya-sans", w, "italic")]),
  ...[700, 900].map(w => fontFace("Fraunces", "fraunces", w, "normal")),
].join("\n");
const OUT = join(ROOT, ART_DIR);
mkdirSync(OUT, { recursive: true });

/** The book's picture for a name: { html } for an <img> or inline SVG filling its box. */
function source(name, fit) {
  for (const ext of RASTER_EXT) {
    const f = join(BOOK_ART, `${name}.${ext}`);
    if (existsSync(f)) return { from: `${name}.${ext}`, html: `<img src="data:${MIME[ext]};base64,${readFileSync(f).toString("base64")}" style="width:100%;height:100%;object-fit:${fit};display:block">` };
  }
  const f = join(BOOK_ART, `${name}.svg`);
  if (!existsSync(f)) throw new Error(`book/art has no picture called ${name}`);
  const svg = readFileSync(f, "utf8").replace(/<\?xml[^>]*\?>/, "")
    .replace(/<svg\b/, `<svg preserveAspectRatio="xMidYMid ${fit === "cover" ? "slice" : "meet"}" style="width:100%;height:100%;display:block"`);
  return { from: `${name}.svg`, html: svg };
}

const CHROME = process.env.CHROME_PATH ?? (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
try {
  for (const a of FOUNDRY_ART) {
    const page = await browser.newPage({ viewport: { width: a.w, height: a.h }, deviceScaleFactor: 1 });
    const src = source(a.source ?? a.name, a.kind === "map" || a.kind === "thumb" ? "contain" : "cover");
    const round = a.kind === "portrait" ? "border-radius:50%;overflow:hidden;" : "";
    await page.setContent(`<!doctype html><html><head><style>${FONTS}</style></head><body style="margin:0;background:transparent">
      <div id="a" style="width:${a.w}px;height:${a.h}px;${round}">${src.html}</div></body></html>`);
    await page.evaluate(() => document.fonts.ready);
    const out = join(OUT, a.file);
    const opts = { path: out, clip: { x: 0, y: 0, width: a.w, height: a.h } };
    if (a.file.endsWith(".jpg")) await page.screenshot({ ...opts, type: "jpeg", quality: 86 });
    else await page.screenshot({ ...opts, type: "png", omitBackground: a.kind === "portrait" });
    await page.close();
    console.log(`  ✓ ${a.file.padEnd(22)} ${a.w}×${a.h}  from book/art/${src.from}`);
  }
} finally {
  await browser.close();
}
