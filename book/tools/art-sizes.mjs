/**
 * Print sizes of every kind of book art, shared by the build (which warns when a
 * drop-in picture is too small to print sharply) and the art list
 * (book/tools/art-list.mjs, which writes book/art/ART-LIST.md).
 *
 * fit: how a drop-in picture of a different shape is placed.
 *   "fill"   it is cropped to fill the box, so both sides must be big enough;
 *   "width"  it is scaled to the width, and its height follows its own shape;
 *   "height" it is scaled to the height (spot illustrations), and its width follows.
 */
export const PPI = 300;

export const KINDS = {
  cover:    { w: 8.75, h: 11.25, fit: "fill", shape: "Portrait, 8.5 : 11", note: "Fills the front cover edge to edge (the size includes the 0.125in print bleed on every side, which is trimmed off). The title sits over the top third and the version line along the bottom, so keep those parts quiet." },
  back:     { w: 4.16, h: 3.12, fit: "width", shape: "4 : 3", note: "The framed panel on the back cover, under the blurb." },
  part:     { w: 6.7, h: 2.23, fit: "width", shape: "3 : 1", note: "On a dark part-title page, under the part's name." },
  chapter:  { w: 7.14, h: 1.8, fit: "fill", shape: "About 4 : 1", note: "The strip across the top of a chapter. A picture of another shape is cropped to fill it, from the middle." },
  quickref: { w: 7.14, h: 1.14, fit: "fill", shape: "About 6 : 1", note: "A shorter strip, so the whole reference fits on one page. Cropped to fill, from the middle." },
  map:      { w: 3.42, h: 2.57, fit: "width", shape: "4 : 3", note: "One column wide. Keep every marker (A, B, the numbers, ★ and E) where the table and the text put it, and keep labels at least 7.5pt at this size." },
  portrait: { w: 1.2, h: 1.2, fit: "fill", shape: "Square, shown as a circle", note: "Cropped to the circle that fits inside the square, so keep the face and the Mark well inside it." },
  threat:   { w: 1.75, h: 1.75, fit: "fill", shape: "Square, shown as a circle", note: "Cropped to the circle that fits inside the square." },
  spot:     { w: 7.07, h: 5.3, fit: "height", shape: "4 : 3", note: "Fills the space left at a chapter's end, printed anywhere from 1.3in to 5.3in tall, so it has to read when small. No words in it." },
};

/** The kind of a piece, from its name. */
export function kindOf(name) {
  if (name === "cover") return "cover";
  if (name === "back") return "back";
  if (name.startsWith("part-")) return "part";
  if (name === "ch-19") return "quickref";   // Chapter 19 is the one-page reference (section.quickref)
  if (name.startsWith("ch-")) return "chapter";
  if (name.startsWith("map-")) return "map";
  if (name.startsWith("threat-")) return "threat";
  if (name.startsWith("frame-") || name.startsWith("pc-")) return "portrait";
  if (name.startsWith("spot-")) return "spot";
  return null;
}

/** The smallest picture, in pixels, that prints sharply (300 ppi) for a kind. */
export function minPixels(kind) {
  const k = KINDS[kind];
  return { w: Math.ceil(k.w * PPI), h: Math.ceil(k.h * PPI), fit: k.fit };
}

/** A problem with a drop-in picture of px = { width, height }, or null if it's fine. */
export function sizeProblem(name, px) {
  const kind = kindOf(name);
  if (!kind) return null;
  const { w, h, fit } = minPixels(kind);
  const short = [];
  if (fit !== "height" && px.width < w) short.push(`${w} px wide`);
  if (fit !== "width" && px.height < h) short.push(`${h} px tall`);
  return short.length ? `${name}: ${px.width}×${px.height} px is below 300 ppi at print size (needs ${short.join(" and ")})` : null;
}
