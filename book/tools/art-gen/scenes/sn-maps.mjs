// Mission and town maps (800×600, printed one column wide: 3.42in, so 1 unit is
// about 0.31pt). Every label is at least 26 units, about 8pt (checklist 19: never
// under 7.5pt), in the book's fonts. Each mission map matches its obstacle table
// and caption place by place: A and B are the ways in, numbers the obstacles
// inside, ★ the objective, E (or E1, E2) the Escape. Meaning never rests on colour
// alone: places are labelled, ways in are green dashed lines, the Escape a red one.
import { C, svg, n, S, L, P, E, Ci, R, T, tree, curve } from "./kit.mjs";

const MIN = 26;
function label(x, y, t, o = {}) {
  const size = o.size ?? MIN;
  if (size < MIN) throw new Error(`map label "${t}" is ${size} units; the minimum is ${MIN}`);
  return T(x, y, t, size, o.fill ?? C.ink, { weight: o.weight ?? 700, anchor: o.anchor ?? "middle", italic: o.italic });
}
/** A label turned to read upward, for a long narrow strip. */
const upLabel = (x, y, t, o = {}) => `<g transform="translate(${n(x)} ${n(y)}) rotate(-90)">${label(0, 0, t, o)}</g>`;
/** A lettered or numbered marker: "in" (ways in), "goal" (★), "out" (Escape), or an obstacle. */
function marker(x, y, t, kind = "step") {
  const fill = { in: C.accentB, goal: C.goldLight, out: C.light, step: C.light }[kind];
  const stroke = { in: C.accentDeep, goal: C.goldDeep, out: C.alarm, step: C.accentDeep }[kind];
  return Ci(x, y, 22, fill, stroke, 4.5) + T(x, y + 9.5, t, t.length > 1 ? 24 : 28, C.ink, { weight: 900 });
}
/** A dashed route with an arrowhead at its end. */
function route(pts, col = C.accentDeep) {
  const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]];
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const head = [b, [b[0] - Math.cos(ang - .45) * 20, b[1] - Math.sin(ang - .45) * 20], [b[0] - Math.cos(ang + .45) * 20, b[1] - Math.sin(ang + .45) * 20]];
  return P(curve(pts), "none", col, 4.5, ` stroke-dasharray="13 9"`) + P(`M${head.map(p => `${n(p[0])} ${n(p[1])}`).join("L")}Z`, col, null);
}
const OUT = C.alarm;
const room = (x, y, w, h, fill = C.paper2) => R(x, y, w, h, fill, C.ink, 4, 6);
const door = (x, y, w = 44, vertical = false) => vertical ? R(x - 5, y, 10, w, C.wood, C.ink, 2.4) : R(x, y - 5, w, 10, C.wood, C.ink, 2.4);
const base = () => R(2, 2, 796, 596, C.light, C.ink, 3, 10);
const water = d => P(d, C.glass, C.ink, 3);

/* ------------------------------------------------------------ the town */

export function map_wrenfield() {
  let s = base();
  // Thornhill, with the Lodge behind its wall
  s += E(630, 130, 160, 106, C.accentB, C.ink, 3) + E(630, 118, 106, 64, C.leafLight, C.ink, 2.4);
  s += R(586, 76, 92, 58, "none", C.ink, 3, 4, ` stroke-dasharray="7 5"`) + R(606, 88, 52, 34, C.night2, C.ink, 3);
  s += marker(720, 92, "5") + label(632, 166, "The Lodge") + label(630, 222, "Thornhill", { italic: true });
  // Wrenwood, between the town and the hill
  for (const [x, y] of [[452, 204], [500, 236], [448, 270], [548, 282], [500, 304], [560, 232], [598, 290]]) s += tree(x, y, 46, C.leaf);
  s += label(500, 346, "Wrenwood", { italic: true });
  // the River Wren, with the weir by the mill
  s += water(`M2 410C150 380 280 420 400 450S650 500 798 486V548C650 560 520 524 400 512S150 462 2 472Z`);
  s += L([[392, 448], [404, 476], [400, 510]], C.light, 5);
  s += label(660, 586, "River Wren", { italic: true, fill: C.accentDeep });
  // the High Street, with Pemberton's Pets at its end
  s += R(34, 250, 320, 34, C.paper2, C.ink, 3, 4) + label(194, 276, "High Street");
  s += R(40, 204, 60, 44, C.brick, C.ink, 3) + marker(70, 178, "1") + label(102, 188, "Pemberton’s Pets", { anchor: "start" });
  s += R(150, 292, 72, 44, C.wall, C.ink, 3) + label(186, 364, "Library");
  s += R(252, 292, 84, 50, C.paper2, C.ink, 3) + label(294, 370, "School");
  // the museum, the zoo by the river, the mill on it
  s += R(316, 120, 92, 60, C.wall, C.ink, 3);
  for (let k = 0; k < 4; k++) s += R(326 + k * 22, 134, 8, 40, C.paper, C.ink, 1.6);
  s += P(`M310 120L362 98L414 120Z`, C.wall, C.ink, 3) + marker(362, 70, "4") + label(362, 212, "Museum");
  s += R(60, 490, 220, 96, C.leafLight, C.ink, 3, 8) + E(130, 530, 34, 20, C.glass, C.ink, 2.4) + marker(214, 524, "2") + label(150, 574, "Zoo");
  s += R(372, 396, 52, 56, C.brick, C.ink, 3) + R(386, 372, 24, 26, C.brick, C.ink, 3) + marker(458, 396, "3") + label(488, 406, "Old Mill", { anchor: "start" });
  return svg("0 0 800 600", "A map of Wrenfield: the High Street with Pemberton's Pets at its end (1), the Library and the School; the zoo by the River Wren (2); the Old Mill on the river (3); the Ashcombe Museum (4); and the Lodge (5) on Thornhill, beyond Wrenwood.", s);
}

/* ------------------------------------------------------------ the missions */

export function map_petshop() {
  let s = base();
  s += R(18, 18, 104, 564, C.stone, C.ink, 3, 6) + upLabel(80, 330, "Alley");
  s += R(130, 18, 652, 112, C.leafLight, C.ink, 3, 6) + label(420, 112, "Back yard");
  s += R(130, 508, 652, 74, C.stone, C.ink, 3, 6) + label(456, 556, "High Street");
  s += room(130, 140, 652, 360, C.wall);
  s += room(144, 152, 256, 146, C.paper) + label(272, 236, "Office");
  s += room(410, 152, 358, 146, C.paper);
  for (let k = 0; k < 6; k++) s += R(530 + k * 38, 162, 32, 40, C.paper2, C.ink, 2.4) + L([[538 + k * 38, 162], [538 + k * 38, 202]], C.ink, 1.6) + L([[554 + k * 38, 162], [554 + k * 38, 202]], C.ink, 1.6);
  s += label(620, 272, "Cage room");
  s += room(144, 308, 412, 182, C.paper2) + label(300, 476, "Shop floor");
  s += R(400, 384, 46, 30, C.wood, C.ink, 2.4);   // the till, where the watchman sleeps
  s += room(566, 308, 202, 182, C.paper) + label(667, 476, "Stockroom");
  s += R(590, 322, 154, 58, "none", C.ink, 3, 4, ` stroke-dasharray="9 6"`) + label(667, 418, "Skylight", { italic: true });
  // doors: office door, office to cage room, back door, stockroom, shop front, yard gate
  s += door(236, 303) + door(405, 204, 44, true) + door(664, 147, 50) + door(561, 420, 44, true) + door(296, 503, 64) + door(130, 52, 52, true);
  s += route([[94, 420], [150, 448], [214, 440]]) + marker(70, 420, "A", "in");
  s += route([[640, 360], [596, 420], [520, 436]]) + marker(667, 351, "B", "in");
  s += route([[400, 372], [310, 336], [272, 320]]) + marker(424, 360, "1");
  s += route([[270, 282], [330, 230], [430, 222]]) + marker(258, 303, "2");
  s += marker(470, 226, "★", "goal");
  s += route([[640, 228], [688, 168], [672, 104], [560, 70], [300, 66], [104, 78]], OUT) + marker(720, 76, "E", "out");
  return svg("0 0 800 600", "Floor plan of Pemberton's Pets: the coal chute from the alley (A), the skylight over the stockroom (B), the shop floor (1), the office door (2), the cage room (the objective), and the way out through the back yard and its gate (E).", s);
}

export function map_zoo() {
  let s = base();
  s += water(`M2 2H58V598H2Z`) + R(58, 2, 44, 596, C.paper2, C.ink, 3) + upLabel(90, 300, "River path", { italic: true });
  s += R(110, 18, 672, 488, C.leafLight, C.ink, 3, 8);
  s += P(`M110 506H782`, "none", C.ink, 6, ` stroke-dasharray="3 7"`);   // the perimeter fence
  s += R(110, 514, 672, 68, C.stone, C.ink, 3, 6) + label(446, 558, "Perimeter fence");
  // the big cats in their moat
  s += E(290, 150, 132, 82, C.glass, C.ink, 3) + E(290, 150, 82, 46, C.leaf, C.ink, 3) + label(290, 160, "Big cats", { fill: C.light });
  // the loading dock and its truck
  s += R(590, 36, 180, 84, C.stone, C.ink, 3, 4) + label(680, 88, "Loading dock");
  s += R(468, 190, 300, 120, C.leaf, C.ink, 3, 8) + label(640, 290, "Lawns", { fill: C.light });
  s += P(`M110 352H782`, "none", C.ink, 5, ` stroke-dasharray="4 8"`) + door(470, 352, 60) + label(640, 388, "Staff gate");
  s += R(140, 404, 262, 64, C.paper2, C.ink, 3, 8) + label(271, 446, "Aviary walkway");
  s += route([[560, 482], [500, 450], [424, 438]]) + marker(560, 506, "A", "in");
  s += route([[130, 470], [150, 452], [160, 440]]) + marker(80, 478, "B", "in");
  s += route([[452, 412], [462, 386], [476, 370]]) + marker(434, 430, "1");
  s += route([[500, 334], [520, 286], [528, 268]]) + marker(476, 352, "2");
  s += route([[540, 228], [552, 160], [556, 116]]) + marker(530, 250, "3");
  s += marker(556, 78, "★", "goal");
  s += route([[540, 92], [448, 96], [396, 134], [330, 226], [210, 250], [110, 252]], OUT) + marker(196, 290, "E", "out");
  return svg("0 0 800 600", "Map of Wrenfield Zoo: the perimeter fence (A), the river culvert (B), the aviary walkway (1), the staff gate (2), the Hound patrol on the lawns (3), the loading dock (the objective), and the way out across the moat round the big cats to the river path (E).", s);
}

export function map_mill() {
  let s = base();
  // the river, the bank, and the millrace that turns the wheel and runs under the mill
  s += P(`M2 516H798V598H2Z`, C.glass, C.ink, 3) + label(120, 572, "River Wren", { italic: true });
  s += R(2, 448, 206, 32, C.leafLight, C.ink, 3);
  s += R(208, 480, 560, 36, C.dusk, C.ink, 3) + label(330, 508, "Millrace", { fill: C.light });
  // the mill: grain store, gear loft, and the tower with the Callhorn
  s += R(208, 168, 344, 312, C.brick, C.ink, 4);
  s += R(380, 40, 160, 128, C.brick, C.ink, 4);
  s += room(224, 370, 312, 98, C.edge) + label(370, 432, "Grain store");
  for (let k = 0; k < 5; k++) s += R(470 + (k % 2) * 26, 446 - Math.floor(k / 2) * 14, 24, 18, C.wall, C.ink, 1.6, 4);
  s += L([[260, 470], [260, 480]], C.ink, 2) + L([[276, 470], [276, 480]], C.ink, 2) + L([[292, 470], [292, 480]], C.ink, 2);   // the grating
  s += room(224, 184, 312, 176, C.paper2) + label(370, 222, "Gear loft");
  for (const [x, y, r] of [[404, 296, 50], [490, 314, 34]]) {
    s += Ci(x, y, r, C.wood, C.ink, 3) + Ci(x, y, r * .32, C.woodDark, C.ink, 2);
    for (let a = 0; a < 10; a++) { const t = a * Math.PI / 5; s += Ci(x + Math.cos(t) * r, y + Math.sin(t) * r, 5, C.wood, C.ink, 1.6); }
  }
  s += room(394, 54, 132, 104, C.paper) + label(460, 146, "Callhorn");
  s += P(`M404 96Q450 86 486 70L512 58L516 104L488 100Q450 104 404 108Z`, C.gold, C.ink, 2.4);
  s += R(534, 84, 14, 32, C.lamp, C.ink, 2.4);   // the tower window above the wheel
  // the ivy and the broken window into the grain store
  s += R(202, 378, 16, 26, C.night2, C.ink, 2.4) + P(`M204 380L210 392L214 382`, "none", C.glass, 2);
  for (let k = 0; k < 6; k++) s += E(206 + (k % 2) * 6, 412 + k * 12, 11, 7, C.leaf, C.ink, 1.4);
  s += label(108, 352, "Ivy wall");
  // the waterwheel
  s += Ci(650, 420, 92, "none", C.ink, 9) + Ci(650, 420, 92, "none", C.wood, 5) + Ci(650, 420, 15, C.woodDark, C.ink, 2.4);
  for (let a = 0; a < 8; a++) { const t = a * Math.PI / 4; s += L([[650, 420], [650 + Math.cos(t) * 92, 420 + Math.sin(t) * 92]], C.wood, 5) + R(650 + Math.cos(t) * 92 - 8, 420 + Math.sin(t) * 92 - 8, 16, 16, C.wood, C.ink, 2); }
  s += label(660, 572, "Waterwheel");
  s += route([[176, 512], [236, 500], [272, 476]]) + marker(150, 512, "A", "in");
  s += route([[124, 396], [168, 394], [210, 392]]) + marker(102, 398, "B", "in");
  s += route([[262, 376], [252, 300], [254, 242]]) + marker(262, 398, "1");
  s += route([[276, 210], [340, 184], [402, 168]]) + marker(254, 212, "2");
  s += marker(334, 100, "★", "goal");
  s += route([[552, 104], [604, 160], [636, 240], [646, 320]], OUT) + marker(724, 186, "E", "out");
  return svg("0 0 800 600", "Cutaway of the Old Mill: the millrace under the wheel and the mill (A), the ivy wall up to a broken window in the grain store (B), the grain store (1), the gear loft (2), the Callhorn at the top of the tower (the objective), and the way out through the tower window and down the waterwheel into the river (E).", s);
}

export function map_gala() {
  let s = base();
  s += R(18, 510, 764, 72, C.stone, C.ink, 3, 6);
  for (let k = 0; k < 3; k++) s += R(330 - k * 22, 492 + k * 14, 140 + k * 44, 14, C.paper2, C.ink, 2.4);
  s += label(640, 556, "Museum steps");
  s += R(30, 26, 740, 466, C.wall, C.ink, 4, 6);
  s += R(46, 38, 708, 60, C.paper, C.ink, 3, 4) + label(300, 88, "Upper galleries", { italic: true });
  s += room(46, 106, 452, 184, C.edge) + label(300, 210, "Dark exhibit halls");
  s += room(508, 106, 246, 184, C.paper) + label(631, 274, "Hall of Hunters");
  // the Trophy case under its spotlight, beside the dinosaur
  s += P(`M556 112L524 210H604L572 112Z`, C.lamp, null, 0, ` opacity=".55"`) + R(540, 168, 48, 40, C.glass, C.ink, 2.4) + E(564, 194, 12, 6, C.gold, C.ink, 1.6);
  s += L([[630, 170], [670, 150], [710, 156], [736, 176]], C.paper, 9) + L([[630, 170], [670, 150], [710, 156], [736, 176]], C.ink, 2.4);
  s += E(620, 162, 16, 10, C.paper, C.ink, 2.4);
  for (const x of [660, 676, 692, 708]) s += L([[x, 156], [x - 2, 190]], C.ink, 2.4);
  for (const x of [664, 714]) s += L([[x, 160], [x, 230]], C.ink, 4);
  s += room(46, 300, 470, 182, C.paper2) + label(290, 412, "Ballroom");
  s += room(526, 300, 228, 182, C.paper) + label(640, 412, "Kitchens");
  s += door(370, 487, 60) + door(765, 340, 44, true) + door(260, 295, 60) + door(503, 160, 44, true) + door(521, 330, 40, true);
  s += route([[400, 476], [400, 444]]) + marker(400, 504, "A", "in");
  s += route([[756, 386], [660, 360], [540, 352]]) + marker(770, 410, "B", "in");
  s += route([[176, 350], [290, 320], [290, 266]]) + marker(150, 350, "1");
  s += route([[176, 150], [380, 156], [530, 176]]) + marker(150, 150, "2");
  s += marker(564, 140, "★", "goal");
  s += route([[600, 130], [590, 56], [130, 54], [70, 110], [66, 300], [80, 460], [250, 478], [370, 492], [400, 520], [300, 544]], OUT);
  s += marker(700, 56, "E1", "out") + marker(260, 548, "E2", "out");
  return svg("0 0 800 600", "Plan of the Ashcombe Museum: the front doors at the top of the steps (A), the loading bay into the kitchens (B), the ballroom (1), the dark exhibit halls (2), the Trophy case under its spotlight in the Hall of Hunters, beside the dinosaur (the objective), and the way out back through the upper galleries (E1) and down the museum steps (E2).", s);
}

export function map_lodge() {
  let s = base();
  s += R(18, 18, 132, 564, C.leafLight, C.ink, 3, 8);
  for (const [x, y] of [[50, 90], [110, 150], [56, 220], [112, 370], [48, 440], [104, 510]]) s += tree(x, y, 56, C.leaf);
  s += label(84, 570, "Wrenwood", { italic: true });
  // the wall round the grounds
  s += R(166, 26, 610, 548, C.accentB, C.ink, 8, 6);
  s += R(186, 330, 268, 226, C.leafLight, C.ink, 3, 8) + label(320, 470, "Deer park");
  for (const [x, y] of [[250, 520], [380, 400], [410, 520]]) s += tree(x, y, 40, C.leaf);
  s += R(472, 330, 286, 226, C.leafLight, C.ink, 3, 8) + label(700, 376, "Lawn") + label(560, 540, "The wall");
  // the kennels, the ice house, and the Lodge
  s += room(186, 46, 124, 140, C.paper) + label(248, 92, "Kennels");
  s += Ci(210, 246, 20, C.stone, C.ink, 3) + label(232, 296, "Ice house");
  s += room(330, 46, 428, 266, C.wall);
  s += room(346, 60, 250, 120, C.paper2) + label(470, 150, "Trophy hall");
  s += R(346, 196, 250, 100, C.edge, C.ink, 3, 6, ` stroke-dasharray="10 6"`) + label(470, 280, "Cellar (below)", { italic: true });
  s += door(330, 108, 44, true) + door(620, 311, 60);
  s += route([[62, 296], [150, 282], [186, 258]]) + route([[214, 222], [220, 196]]) + marker(40, 296, "B", "in");
  s += route([[312, 382], [312, 290], [296, 198]]) + marker(312, 404, "A", "in");
  s += route([[272, 150], [304, 132], [326, 130]]) + marker(248, 150, "1");
  s += route([[380, 100], [400, 98], [416, 98]]) + marker(354, 120, "2");
  s += route([[456, 96], [600, 110], [626, 170], [596, 216]]) + marker(434, 100, "3");
  s += marker(570, 236, "★", "goal");
  s += route([[594, 252], [650, 300], [640, 440], [728, 552]], OUT);
  s += marker(600, 420, "E1", "out") + marker(740, 574, "E2", "out");
  return svg("0 0 800 600", "Plan of the Lodge grounds: the deer park (A) and the ice-house tunnel from Wrenwood (B), the kennels (1), the servants' door (2), the trophy hall (3), the cellar cage below it (the objective), and the way out across the lawn (E1) and over the wall (E2).", s);
}
