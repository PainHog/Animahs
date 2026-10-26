// Second Nature book art: every piece the chapters name. Placeholders in a finished
// style (DESIGN D29); Richard's own artwork replaces any of them by dropping a PNG,
// JPG or WebP with the same name into book/art/ (book/art/ART-LIST.md).
//   node book/tools/art-gen/scenes/build.mjs            (writes every piece)
import { C, svg, n, S, L, P, E, Ci, R, G, T, place, sky, moon, hill, tree, wildSwirl, leaf, medallion, medallionRing, clip, windowLit, rng, curve } from "./kit.mjs";
import * as A from "./animals.mjs";
import * as H from "./people.mjs";

/* ------------------------------------------------------------ portraits */
// 400×400 medallions. Frames show the ready-made Bonded's own animal, Mark included.
// The animals are drawn facing right, which shows their right side; Maya's and Theo's
// Marks are on the left (her left eye, his left ear), so those two face left.

function portrait(id, title, body, ring = C.gold) {
  return svg("0 0 400 400", title, medallion(id) + clip(id, body) + medallionRing(ring));
}
const grass = (y = 330) => P(`M0 ${y}Q200 ${y - 14} 400 ${y}V400H0Z`, C.leafDeep, C.ink, 3);
const floor = (y = 330, fill = C.night2) => P(`M0 ${y}H400V400H0Z`, fill, C.ink, 3);

export function frame_cats() {
  return portrait("fc", "A jaguar walking through the dark, a fleck of gold in its left eye",
    moonBack(100, 110) + grass(312) + place(376, 314, 1.92, A.jaguar({ mark: true }), true));
}
export function frame_canines() {
  return portrait("fn", "A coyote standing on open ground, a notch in its left ear",
    moonBack(310, 100) + grass(318) + place(360, 320, 2.25, A.coyote({ notch: true }), true));
}
export function frame_birds() {
  return portrait("fb", "A barn owl perched on a fence post, pale rings around its eyes",
    moonBack(300, 100) + R(150, 300, 100, 120, C.wood, C.ink, 3) + P(`M140 300H260`, "none", C.woodDark, 6) + place(200, 300, 6.4, A.barnOwl({ rings: true })));
}
export function frame_critters() {
  return portrait("fr", "A brown rat on a cellar floor, a white patch between its ears",
    floor(300, C.night2) + R(40, 150, 120, 150, C.brickDark, C.ink, 3) + R(240, 120, 110, 180, C.brickDark, C.ink, 3) + place(118, 298, 8.4, A.rat({ patch: true })));
}
export function frame_heavies() {
  return portrait("fh", "A bison on a moonlit field, a pale scar over its right eye",
    moonBack(80, 90) + grass(332) + place(40, 334, 1.34, A.bison({ scar: true })));
}
export function frame_reptiles() {
  return portrait("fp", "An alligator at the edge of dark water, pale spots on its snout",
    moonBack(310, 96) + P(`M0 300Q200 290 400 300V400H0Z`, C.dusk, C.ink, 3) + wave(320) + wave(350) + place(-10, 300, 1.2, A.alligator({ spots: true })));
}
function moonBack(x, y) { return Ci(x, y, 46, C.moon, null, 0, ` opacity=".9"`) + Ci(x, y, 70, C.moonGlow, null, 0, ` opacity=".18"`); }
const wave = y => L([[20, y], [70, y - 6], [120, y], [170, y - 6], [220, y], [270, y - 6], [320, y], [370, y - 6]], C.glass, 2.4, ` opacity=".7"`);

export function threat_beater() { return portrait("tb", "A Beater: a hired watchman in a flat cap and heavy coat", H.beater(), C.alarm); }
export function threat_trapper() { return portrait("tt", "A Trapper in a bucket hat and waxed jacket, a net over one shoulder", H.trapper(), C.alarm); }
export function threat_huntsman() { return portrait("th", "A Huntsman in tweed, with a gold Trophy brooch on his lapel", H.huntsman(), C.alarm); }
export function threat_hound() {
  return portrait("tn", "One of the Hunt's grey Hounds, wearing a gilt collar",
    floor(330, C.night2) + place(-36, 332, 2.9, A.hound()), C.alarm);
}

export function pc_maya() { return portrait("pm", "Maya Reyes, with a fleck of gold in her left eye", H.maya()); }
export function pc_theo() { return portrait("pt", "Theo Park, with a notch in his left ear", H.theo()); }
export function pc_priya() { return portrait("pp", "Priya Shah, in round glasses", H.priya()); }
export function pc_sam() { return portrait("ps", "Sam Lindqvist, with a white streak in his fringe", H.sam()); }
export function pc_jonah() { return portrait("pj", "Jonah Mensah, with a scar through his right eyebrow", H.jonah()); }
export function pc_lucia() { return portrait("pl", "Lucía Ortega, with freckles across her nose", H.lucia()); }
