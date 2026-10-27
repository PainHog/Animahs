/**
 * The pictures the Foundry system uses, all made from the book's art (book/art/) by
 * tools/build-foundry-art.mjs, so the book and the online version show the same pictures.
 * Shared by that renderer, the pack source builder and the tests (no browser needed here).
 *
 *   map      scene backgrounds and the map page in each mission's journal (800×600 map units)
 *   thumb    a small copy of a map for Foundry's scene list
 *   portrait actor portraits and token pictures, cut to a circle
 *   cover    the Starter adventure's picture
 */
export const SYS = "systems/morphgame";
export const ART_DIR = "assets/art";

/** A map is drawn in 800×600 units; its PNG is MAP_SCALE times that, so scene pixels = units × MAP_SCALE. */
export const MAP_SCALE = 2.5;
const map = name => ({ name, file: `${name}.png`, kind: "map", w: 800 * MAP_SCALE, h: 600 * MAP_SCALE });
const thumb = name => ({ name: `${name}-thumb`, source: name, file: `${name}-thumb.png`, kind: "thumb", w: 300, h: 225 });
const portrait = name => ({ name, file: `${name}.png`, kind: "portrait", w: 512, h: 512 });
export const MAPS = ["map-wrenfield", "map-petshop", "map-zoo", "map-mill", "map-gala", "map-lodge"];

export const FOUNDRY_ART = [
  ...MAPS.map(map),
  ...MAPS.map(thumb),
  ...["pc-maya", "pc-theo", "pc-priya", "pc-sam", "pc-jonah", "pc-lucia"].map(portrait),
  ...["threat-beater", "threat-hound", "threat-trapper", "threat-huntsman"].map(portrait),
  { name: "cover", file: "cover.jpg", kind: "cover", w: 918, h: 1188 },
];

/** The Foundry path of a book picture's export, e.g. "systems/morphgame/assets/art/map-zoo.png". */
export function artPath(name) {
  const a = FOUNDRY_ART.find(x => x.name === name);
  if (!a) throw new Error(`no Foundry export for book art "${name}" (tools/foundry-art.mjs)`);
  return `${SYS}/${ART_DIR}/${a.file}`;
}
