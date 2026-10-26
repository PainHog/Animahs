// Spot illustrations: 800×600 (4:3) pieces that fill the space a chapter leaves on
// its last page (book/build.mjs sizes them to fit, from 1.3in to 5.3in tall). They
// carry no words, since they may print small. Each scene keeps one true scale:
// animals are real-size drawings (1 unit = 1 cm) placed at that scene's scale.
import { C, svg, n, S, L, P, E, Ci, R, G, place, sky, moon, hill, tree, wildSwirl, leaf, windowLit, rng } from "./kit.mjs";
import * as A from "./animals.mjs";
import { die, token, table, horn, lantern } from "./sn-scenes.mjs";

const W = 800, H = 600;
function spot(id, title, body) {
  const defs = `<defs><clipPath id="${id}-frame"><rect x="4" y="4" width="792" height="592" rx="28"/></clipPath></defs>`;
  return svg(`0 0 ${W} ${H}`, title, defs + `<g clip-path="url(#${id}-frame)">${body}</g>` + R(4, 4, 792, 592, "none", C.ink, 6, 28));
}
const rad = d => d * Math.PI / 180;
const at = (x, y, deg, body, sc = 1) => G(`translate(${n(x)} ${n(y)}) rotate(${n(deg)}) scale(${n(sc)})`, body);
/** Brick courses over a rectangle. */
function bricks(x0, y0, w, h, fill = C.brick, bh = 30, bw = 76) {
  let s = R(x0, y0, w, h, C.brickDark, null);
  for (let row = 0; row * bh < h; row++) for (let col = -1; col * bw < w + bw; col++) {
    const x = x0 + col * bw + (row % 2) * bw / 2, y = y0 + row * bh;
    s += R(x + 2, y + 2, bw - 4, bh - 4, fill, C.ink, 1.2, 3);
  }
  return s;
}
/** Grass tufts scattered over an area. */
function tufts(x0, y0, w, h, count, seed, col = C.leaf) {
  const r = rng(seed);
  let s = "";
  for (let i = 0; i < count; i++) {
    const x = x0 + r() * w, y = y0 + r() * h;
    s += L([[x - 6, y], [x - 3, y - 12]], col, 2.4) + L([[x, y], [x + 1, y - 15]], col, 2.4) + L([[x + 6, y], [x + 4, y - 11]], col, 2.4);
  }
  return s;
}
/** A street lamp: post from the ground up out of the frame's top, lamp head and its light. */
function streetLamp(x, gy, top = 40, pool = true) {
  let s = "";
  if (pool) s += P(`M${x - 30} ${top + 40}L${x - 190} ${gy + 10}H${x + 190}L${x + 30} ${top + 40}Z`, C.lamp, null, 0, ` opacity=".14"`) + E(x, gy + 6, 200, 34, C.lamp, null, 0, ` opacity=".22"`);
  s += R(x - 9, top + 30, 18, gy - top - 30, C.night2, C.ink, 2.6) + R(x - 16, gy - 26, 32, 26, C.night2, C.ink, 2.6);
  s += P(`M${x - 34} ${top + 34}L${x - 22} ${top}H${x + 22}L${x + 34} ${top + 34}Z`, C.lamp, C.ink, 2.6) + R(x - 38, top + 30, 76, 10, C.night2, C.ink, 2.4);
  return s;
}
/** A wooden gear wheel with square teeth and spokes. */
function gear(cx, cy, r, teeth, rot = 0) {
  let s = "";
  for (let k = 0; k < teeth; k++) s += at(cx, cy, rot + (k * 360) / teeth, R(r - 6, -r * .09, r * .2, r * .18, C.wood, C.ink, 2.2, 2));
  s += Ci(cx, cy, r, C.wood, C.ink, 3) + Ci(cx, cy, r * .8, C.woodDark, C.ink, 2.4);
  for (let k = 0; k < 6; k++) s += at(cx, cy, rot + k * 60, R(0, -r * .07, r * .8, r * .14, C.wood, C.ink, 2));
  s += Ci(cx, cy, r * .22, C.wood, C.ink, 2.6) + Ci(cx, cy, r * .08, C.ink, null);
  return s;
}
/** Wavy "handwriting" lines: no real words, so nothing to misread at small sizes. */
function scribble(x, y, w, lines, gap = 26, seed = 3, col = C.inkSoft) {
  const r = rng(seed);
  let s = "";
  for (let i = 0; i < lines; i++) {
    const len = w * (.55 + r() * .45), yy = y + i * gap;
    let d = `M${n(x)} ${n(yy)}`;
    for (let xx = x; xx < x + len; xx += 14) d += `Q${n(xx + 3.5)} ${n(yy - 5)} ${n(xx + 7)} ${n(yy)}T${n(xx + 14)} ${n(yy)}`;
    s += P(d, "none", col, 2);
  }
  return s;
}
/** A pencil lying at (x, y), turned by deg, length len. */
const pencil = (x, y, deg, len = 220) => at(x, y, deg,
  R(0, -8, len, 16, C.goldLight, C.ink, 2.2) + R(len - 26, -8, 26, 16, C.crimson, C.ink, 2) + R(len - 34, -8, 8, 16, C.stone, C.ink, 1.6) +
  P(`M0 -8L-34 0L0 8Z`, C.skin2, C.ink, 2) + P(`M-24 -2.4L-34 0L-24 2.4Z`, C.ink, null) + L([[0, -2.6], [len - 34, -2.6]], C.gold, 1.6));
/** A die seen from straight above. */
function dieTop(x, y, size, face, deg = 0) {
  const pip = (u, v) => Ci(size * u - size / 2, size * v - size / 2, size * .085, C.ink, null);
  const F = { 1: [[.5, .5]], 2: [[.28, .28], [.72, .72]], 3: [[.25, .25], [.5, .5], [.75, .75]], 4: [[.28, .28], [.72, .28], [.28, .72], [.72, .72]], 5: [[.26, .26], [.74, .26], [.5, .5], [.26, .74], [.74, .74]], 6: [[.28, .24], [.72, .24], [.28, .5], [.72, .5], [.28, .76], [.72, .76]] };
  return at(x, y, deg, R(-size / 2 + 4, -size / 2 + 5, size, size, C.ink, null, 0, size * .14, ` opacity=".25"`) + R(-size / 2, -size / 2, size, size, C.paper, C.ink, 2.4, size * .14) + F[face].map(([u, v]) => pip(u, v)).join(""));
}
/** An owl feather lying flat. */
const feather = (x, y, deg, len = 120) => at(x, y, deg,
  S([[0, 0], [len * .2, -len * .1], [len * .6, -len * .12], [len, -len * .02], [len * .6, len * .08], [len * .2, len * .07]], C.owl, C.ink, 2) +
  L([[-len * .12, 0], [len, -len * .02]], C.feather, 2.2) +
  [.3, .45, .6, .75].map(t => L([[len * t, -len * .1], [len * (t + .06), 0]], C.feather, 1.2, ` opacity=".7"`)).join(""));

/* ------------------------------------------------------------------ spots */

/** Chapter 4: trainer prints in the mud that turn into a big cat's pawprints. */
export function spot_tracks() {
  let s = R(0, 0, W, H, C.leafDeep, null) + tufts(0, 0, W, H, 90, 41);
  // the path: a band along a cubic curve
  const p = [[-60, 500], [260, 640], [470, 80], [860, 150]];
  const pt = t => { const u = 1 - t; return [0, 1].map(i => u * u * u * p[0][i] + 3 * u * u * t * p[1][i] + 3 * u * t * t * p[2][i] + t * t * t * p[3][i]); };
  const tan = t => { const a = pt(Math.max(0, t - .005)), b = pt(Math.min(1, t + .005)); return Math.atan2(b[1] - a[1], b[0] - a[0]); };
  const top = [], bot = [];
  for (let i = 0; i <= 30; i++) { const t = i / 30, [x, y] = pt(t), a = tan(t); top.push([x + Math.sin(a) * 80, y - Math.cos(a) * 80]); bot.push([x - Math.sin(a) * 80, y + Math.cos(a) * 80]); }
  s += P(`M${top.map(q => `${n(q[0])} ${n(q[1])}`).join("L")}L${bot.reverse().map(q => `${n(q[0])} ${n(q[1])}`).join("L")}Z`, C.brown, C.ink, 3);
  // a right trainer sole pointing along +x (its arch on the -y side); left soles mirror it
  const sole = S([[40, 0], [36, -9], [22, -13], [6, -12], [-8, -7], [-22, -9], [-36, -9], [-42, 0], [-36, 9], [-20, 11], [-4, 13], [22, 14], [36, 9]], C.brownDark, C.ink, 2) +
    [-30, -22, 4, 14, 24].map(x => L([[x, -7], [x, 8]], C.brown, 2.4)).join("");
  const paw = S([[-20, -10], [-8, -15], [4, -10], [2, 0], [4, 10], [-8, 15], [-20, 10], [-23, 0]], C.brownDark, C.ink, 2) +
    [[12, -18], [20, -6], [20, 6], [12, 18]].map(([x, y]) => E(x, y, 6.5, 7.5, C.brownDark, C.ink, 1.8)).join("");
  for (let k = 0; k < 13; k++) {
    const t = .07 + k * .072, [x, y] = pt(t), a = tan(t), side = k % 2 ? 1 : -1;
    const ox = -Math.sin(a) * 26 * side, oy = Math.cos(a) * 26 * side;
    const deg = a * 180 / Math.PI;
    if (k < 5) s += G(`translate(${n(x + ox)} ${n(y + oy)}) rotate(${n(deg)}) scale(1 ${side > 0 ? 1 : -1})`, sole);
    else if (k > 6) s += at(x + ox, y + oy, deg, paw, .95);
  }
  const [mx, my] = pt(.47);
  s += wildSwirl(mx, my, 74, 17);
  for (const [dx, dy, d] of [[-60, -40, 30], [50, 50, 200], [80, -20, 110]]) s += leaf(mx + dx, my + dy, 26, d, C.leafLight);
  return spot("st", "Trainer prints in the mud of a path that turn, after a swirl of leaves and light, into a big cat's pawprints.", s);
}

/** Chapter 5: a Hound on the towpath, and a trail of faintly glowing pawprints ahead of it. */
export function spot_scent() {
  let s = sky("ss", W, H, { top: C.deep, bottom: C.night2, stars: 40, seed: 52, starTo: .4 });
  s += moon("ss", 640, 90, 40);
  for (const [x, h, k] of [[40, 150, "pine"], [110, 190, "pine"], [190, 140, "round"], [520, 160, "round"], [600, 200, "pine"], [700, 150, "pine"], [770, 180, "pine"]]) s += tree(x, 272, h, C.night2, k);
  s += R(0, 270, W, 110, C.dusk, C.ink, 2.6);
  for (const [x, y, w] of [[80, 300, 140], [380, 330, 200], [610, 300, 120], [250, 358, 90]]) s += L([[x, y], [x + w, y]], C.moonGlow, 2.4, ` opacity=".45"`);
  s += R(0, 380, W, 220, C.stone, C.ink, 2.6) + P(`M0 404H${W}`, "none", C.ink, 1.6, ` opacity=".4"`);
  for (let x = 20; x < W; x += 70) s += L([[x, 380], [x - 6, 350]], C.leafDeep, 3) + L([[x + 8, 380], [x + 12, 356]], C.leafDeep, 3);
  // coyote prints: four toes with claw marks and a heel pad, seen low across the path
  const print = (x, y, o) => G(`translate(${n(x)} ${n(y)}) scale(1 .42)`,
    E(0, 6, 11, 10, C.wild, null, 0, ` opacity="${o}"`) + [[-12, -10], [-4, -16], [4, -16], [12, -10]].map(([a, b]) => E(a, b, 4.5, 6, C.wild, null, 0, ` opacity="${o}"`)).join(""));
  for (let k = 0; k < 8; k++) s += print(390 + k * 52, 506 - (k % 2) * 22, (0.95 - k * .1).toFixed(2));
  s += place(90, 520, 2.5, A.hound());
  return spot("ss", "A grey Hound standing on the towpath by the river at night, with a trail of faintly glowing pawprints ahead of it.", s);
}

/** Chapter 6: an empty net on the cobbles under a street lamp; a rat runs for the drain. */
export function spot_net() {
  let s = R(0, 0, W, H, C.night2, null) + bricks(0, 0, W, 330, C.brickDark, 30, 76).replace(/fill="#6e3e2e"/, `fill="${C.night}"`);
  s += R(470, 120, 120, 210, C.woodDark, C.ink, 3) + Ci(570, 230, 5, C.goldDeep, C.ink, 1.4);
  s += R(0, 330, W, 270, C.stone, C.ink, 3);
  const r = rng(63);
  for (let row = 0; row < 8; row++) for (let col = 0; col < 14; col++) s += E(col * 60 + (row % 2) * 30 + r() * 6, 352 + row * 34, 26, 13, C.fog, C.ink, 1.2, ` opacity=".55"`);
  s += streetLamp(120, 520, 30);
  // the net: a crumpled blob with a mesh, a cord rim and weights
  const blob = [[260, 470], [300, 430], [380, 420], [450, 440], [500, 470], [470, 510], [380, 524], [290, 512]];
  s += `<defs><clipPath id="sn-net"><path d="${smoothD(blob)}"/></clipPath></defs>`;
  s += P(smoothD(blob), C.night2, null, 0, ` opacity=".35"`);
  let mesh = "";
  for (let k = -12; k < 20; k++) mesh += L([[240 + k * 18, 400], [340 + k * 18, 540]], C.cream, 2) + L([[340 + k * 18, 400], [240 + k * 18, 540]], C.cream, 2);
  s += `<g clip-path="url(#sn-net)">${mesh}</g>` + P(smoothD(blob), "none", C.woodDark, 5) + P(smoothD(blob), "none", C.cream, 2);
  for (const [x, y] of blob) s += Ci(x, y, 7, C.greyDark, C.ink, 1.6);
  s += L([[260, 470], [210, 500], [150, 540], [60, 560]], C.cream, 3);
  s += R(612, 506, 128, 30, C.night, C.ink, 2.6, 4);
  for (let k = 0; k < 6; k++) s += L([[628 + k * 20, 510], [628 + k * 20, 532]], C.greyDark, 4);
  s += place(538, 520, 2.6, A.rat());
  return spot("sn", "An empty net lying on the cobbles under a street lamp, and a brown rat running for the drain.", s);
}
function smoothD(pts) { return S(pts, "none").match(/d="([^"]+)"/)[1]; }

/** Chapter 7: a lit bedroom window at night, and a barn owl on the sill outside. */
export function spot_window() {
  let s = bricks(0, 0, W, H);
  s += R(236, 96, 328, 368, C.wood, C.ink, 4, 4);
  s += R(256, 116, 288, 328, C.lamp, C.ink, 3);
  s += Ci(400, 250, 150, C.light, null, 0, ` opacity=".35"`);
  s += S([[256, 116], [320, 116], [316, 220], [296, 330], [300, 444], [256, 444]], C.shirt4, C.ink, 2.6) + S([[544, 116], [480, 116], [484, 220], [504, 330], [500, 444], [544, 444]], C.shirt4, C.ink, 2.6);
  s += R(395, 116, 10, 328, C.wood, C.ink, 2) + R(256, 275, 288, 10, C.wood, C.ink, 2);
  s += R(216, 462, 368, 26, C.stone, C.ink, 3, 3);
  // ivy up the left of the wall
  for (let k = 0; k < 16; k++) s += leaf(90 + Math.sin(k) * 40, 590 - k * 36, 30, k % 2 ? 40 : 140, C.leaf);
  s += L([[110, 600], [90, 440], [120, 300], [80, 100], [100, 0]], C.leafDeep, 4);
  s += place(470, 462, 3.4, A.barnOwl(), true);
  return spot("sw", "A lit bedroom window at night, its curtains half open, and a barn owl standing on the sill outside, looking in.", s);
}

/** Chapter 8: a treehouse in an old oak at night, a light in its window and a rope ladder down. */
export function spot_treehouse() {
  let s = sky("tr", W, H, { top: C.deep, bottom: C.dusk, stars: 50, seed: 81 });
  s += moon("tr", 660, 110, 44);
  s += hill([[-10, 520], [200, 500], [500, 510], [810, 490]], H, C.leafDeep, C.ink, 3) + tufts(0, 520, W, 80, 30, 82);
  // the oak: trunk, two branches carrying the platform, and the crown above
  s += P(`M350 600Q370 470 372 350Q360 300 330 260L370 262Q392 300 404 330Q420 300 452 262L486 266Q440 320 436 370Q436 480 470 600Z`, C.brownDeep, C.ink, 3);
  s += S([[140, 180], [180, 90], [300, 40], [420, 30], [540, 70], [620, 150], [600, 230], [500, 262], [300, 266], [170, 250]], C.leafDeep, C.ink, 3);
  for (const [x, y, r] of [[230, 140, 50], [380, 90, 60], [520, 140, 50], [300, 210, 40], [470, 220, 44]]) s += Ci(x, y, r, C.leaf, null, 0, ` opacity=".5"`);
  s += L([[380, 450], [300, 400], [252, 360]], C.brownDeep, 16) + L([[430, 450], [510, 400], [556, 360]], C.brownDeep, 16);   // the branches the platform rests on
  s += R(230, 340, 350, 18, C.wood, C.ink, 3, 2);
  // the hut standing on the platform
  s += R(270, 240, 270, 100, C.wood, C.ink, 3);
  for (let k = 1; k < 6; k++) s += L([[270 + k * 45, 240], [270 + k * 45, 340]], C.woodDark, 2);
  s += P(`M254 244L405 180L556 244Z`, C.brickDark, C.ink, 3);
  s += windowLit(300, 262, 60, 46, true) + Ci(330, 285, 70, C.lamp, null, 0, ` opacity=".12"`) + R(430, 270, 52, 70, C.woodDark, C.ink, 2.4);
  // the rope ladder, tied to the platform, reaching the ground
  s += L([[250, 358], [246, 520]], C.cream, 3.4) + L([[290, 358], [286, 520]], C.cream, 3.4);
  for (let y = 380; y < 520; y += 26) s += L([[249, y], [289, y]], C.wood, 6);
  s += lantern(560, 524, 1.3);
  return spot("tr", "A treehouse built on the branches of an old oak at night, a light in its window and a rope ladder down to the grass, with a lantern at the foot of the tree.", s);
}

/** Chapter 9: a stack of library books with a feather on top, and a lantern. */
export function spot_books() {
  let s = R(0, 0, W, H, C.night2, null) + Ci(250, 260, 300, C.lamp, null, 0, ` opacity=".12"`);
  // a shelf of books behind, resting on its bracket
  s += R(0, 136, W, 18, C.wood, C.ink, 2.6);
  const r = rng(91), cols = [C.shirt1, C.shirt2, C.shirt4, C.shirt5, C.brick, C.olive, C.shirt3];
  for (let x = 10; x < W - 20;) { const w = 20 + r() * 18, h = 80 + r() * 50; s += R(x, 136 - h, w, h, cols[Math.floor(r() * cols.length)], C.ink, 2) + R(x + 3, 136 - h * .8, w - 6, 6, C.goldLight, null); x += w + 2; }
  s += table(430);
  const stack = [[250, 46, C.shirt4], [264, 38, C.brick], [236, 44, C.olive], [258, 34, C.shirt5], [244, 42, C.shirt2]];
  let y = 430;
  stack.forEach(([w, h, col], i) => {
    const x = 420 - w / 2 + (i % 2 ? 10 : -8);
    y -= h;
    s += R(x, y, w, h, col, C.ink, 2.6, 4) + R(x + w - 18, y + 4, 12, h - 8, C.paper, C.ink, 1.6, 2) + L([[x + 20, y + h / 2], [x + w - 40, y + h / 2]], C.goldLight, 3);
  });
  s += feather(330, y - 4, -6, 150);
  s += lantern(170, 430, 2.4);
  s += P(`M610 430V380Q610 372 618 372H680Q688 372 688 380V430Z`, C.paper2, C.ink, 2.6) + P(`M688 388Q712 392 708 410Q704 422 688 420`, "none", C.ink, 3.4);
  return spot("sb", "A stack of library books on a table with an owl feather on top, a lit lantern and a mug, and a shelf of books behind.", s);
}

/** Chapter 10: the Hunt's gilded horn on a velvet cushion under a glass dome. */
export function spot_trophy() {
  let s = R(0, 0, W, H, C.night, null) + P(`M330 0H470L640 600H160Z`, C.lamp, null, 0, ` opacity=".12"`);
  s += R(230, 456, 340, 150, C.paper2, C.ink, 3) + R(214, 440, 372, 24, C.edge, C.ink, 3, 3) + R(330, 500, 140, 40, C.goldDeep, C.ink, 2.4, 3);
  s += L([[350, 514], [450, 514]], C.goldLight, 2) + L([[350, 526], [430, 526]], C.goldLight, 2);
  s += S([[262, 440], [270, 404], [400, 392], [530, 404], [538, 440], [400, 448]], C.crimson, C.ink, 3);
  for (const x of [262, 538]) s += L([[x, 436], [x + (x < 400 ? -8 : 8), 466]], C.gold, 3) + Ci(x + (x < 400 ? -8 : 8), 470, 6, C.gold, C.ink, 1.6);
  s += horn(282, 408, 1.55);
  s += E(500, 424, 18, 12, C.gold, C.ink, 2.6) + Ci(500, 424, 6, C.goldDeep, C.ink, 1.4) + Ci(500, 424, 2.4, C.ink, null);
  s += P(`M236 440V250Q236 110 400 110Q564 110 564 250V440`, C.glass, C.light, 3, ` fill-opacity=".14" stroke-opacity=".8"`);
  s += P(`M270 400V260Q272 170 340 140`, "none", C.light, 6, ` opacity=".5"`) + P(`M530 300V380`, "none", C.light, 4, ` opacity=".4"`);
  return spot("tp", "The Hunt's gilded horn and a gold eye-shaped brooch on a crimson velvet cushion under a glass dome, lit from above.", s);
}

/** Chapter 11: the bus stop on the High Street at night, with a coyote trotting past. */
export function spot_busstop() {
  let s = sky("bs", W, H, { top: C.deep, bottom: C.night2, stars: 20, seed: 111, starTo: .3 });
  // shopfronts along the street (true scale here: 1.5 px per cm)
  const shops = [[0, 250, C.brickDark], [250, 280, C.dusk], [530, 280, C.brickDark]];
  for (const [x, w, col] of shops) {
    s += R(x, 40, w, 460, col, C.ink, 3) + R(x + 16, 250, w - 32, 34, C.night, C.ink, 2.4);
    s += windowLit(x + 24, 300, w - 120, 150, true) + R(x + w - 80, 300, 56, 200, C.woodDark, C.ink, 2.4);
    for (const k of [0, 1]) s += windowLit(x + 30 + k * (w / 2), 100, w / 2 - 60, 90, k === 0);
  }
  s += R(0, 500, W, 100, C.stone, C.ink, 3) + L([[0, 566], [W, 566]], C.ink, 3) + R(0, 568, W, 40, C.night2, null);
  s += streetLamp(110, 500, 26, false) + E(110, 504, 140, 20, C.lamp, null, 0, ` opacity=".25"`);
  // the shelter: two posts, a roof, a glass back and a bench
  s += R(434, 180, 300, 250, C.glass, C.light, 2, 0, ` fill-opacity=".3" stroke-opacity=".6"`);
  s += R(420, 150, 10, 350, C.greyDark, C.ink, 2) + R(738, 150, 10, 350, C.greyDark, C.ink, 2) + R(404, 136, 360, 18, C.greyDark, C.ink, 2.6, 3);
  s += R(480, 420, 200, 14, C.wood, C.ink, 2.4, 2) + R(496, 434, 8, 66, C.greyDark, C.ink, 2) + R(656, 434, 8, 66, C.greyDark, C.ink, 2);
  s += R(700, 230, 30, 70, C.paper, C.ink, 2) + scribble(706, 246, 18, 3, 16, 5);
  s += place(170, 500, 1.5, A.coyote());
  return spot("bs", "The bus stop on the High Street at night, shop windows lit behind it, and a coyote trotting past under the street lamp.", s);
}

/** Chapter 12: an open notebook with notes on one page and a sketched plan on the other. */
export function spot_notebook() {
  let s = R(0, 0, W, H, C.wood, null);
  for (let y = 30; y < H; y += 80) s += L([[0, y], [W, y + 10]], C.woodDark, 2, ` opacity=".5"`);
  s += R(108, 92, 584, 430, C.ink, null, 0, 10, ` opacity=".25"`);
  s += R(100, 80, 290, 430, C.paper, C.ink, 3, 8) + R(410, 80, 290, 430, C.paper, C.ink, 3, 8);
  for (let y = 100; y < 500; y += 30) s += Ci(400, y, 8, "none", C.greyDark, 3);
  s += scribble(130, 140, 230, 11, 30, 12);
  for (const y of [140, 230, 320]) s += Ci(122, y - 3, 5, C.accentDeep, null);
  // the plan: rooms, a dashed route, circled steps and a star
  s += R(440, 120, 110, 90, "none", C.inkSoft, 2.4) + R(560, 120, 110, 160, "none", C.inkSoft, 2.4) + R(440, 220, 110, 160, "none", C.inkSoft, 2.4) + R(560, 290, 110, 90, "none", C.inkSoft, 2.4);
  s += L([[470, 470], [500, 330], [610, 330], [620, 200]], C.accentDeep, 3, ` stroke-dasharray="10 8"`);
  for (const [x, y] of [[470, 470], [500, 330], [610, 330]]) s += Ci(x, y, 13, C.paper, C.accentDeep, 3);
  s += P(starD(620, 180, 18), C.goldLight, C.goldDeep, 2.4);
  s += pencil(500, 552, -14, 230);
  return spot("nb", "An open notebook on a wooden table: notes on one page, and on the other a sketched plan of rooms with a dashed route, circled steps and a star.", s);
}
function starD(cx, cy, r) {
  let d = "";
  for (let k = 0; k < 10; k++) { const a = rad(-90 + k * 36), rr = k % 2 ? r * .45 : r; d += `${k ? "L" : "M"}${n(cx + Math.cos(a) * rr)} ${n(cy + Math.sin(a) * rr)}`; }
  return d + "Z";
}

/** Chapter 13: "missing" posters on a lamp post, and a coyote sniffing at its foot. */
export function spot_poster() {
  let s = bricks(0, 0, W, 470, C.brickDark);
  s += R(0, 470, W, 130, C.stone, C.ink, 3) + L([[0, 560], [W, 560]], C.ink, 2.6);
  s += streetLamp(360, 500, -60, false) + Ci(360, 0, 120, C.lamp, null, 0, ` opacity=".2"`);
  // posters taped to the post: a drawn pet, wavy lines, and tear-off tabs
  const poster = (x, y, deg, pet) => at(x, y, deg,
    R(-62, -80, 124, 160, C.light, C.ink, 2.4) + pet + scribble(-48, 30, 96, 2, 16, 21) +
    [-50, -30, -10, 10, 30].map(xx => R(xx, 64, 16, 16, C.light, C.ink, 1.4)).join("") +
    R(-20, -88, 40, 14, C.glass, null, 0, 2, ` opacity=".7"`));
  const cat = S([[-30, 10], [-26, -20], [-18, -40], [-22, -58], [-12, -50], [0, -52], [10, -58], [8, -40], [14, -24], [20, 4], [30, 6], [34, -20], [40, -18], [36, 12], [20, 16]], C.inkSoft, C.ink, 1.6);
  const dog = S([[-36, 10], [-34, -20], [-20, -26], [10, -26], [20, -44], [36, -40], [40, -28], [28, -24], [26, 10], [16, 10], [14, -6], [-20, -6], [-22, 10]], C.inkSoft, C.ink, 1.6);
  s += poster(300, 260, -5, cat) + poster(430, 300, 4, dog);
  s += place(560, 508, 1.5, A.coyote(), true);
  return spot("sp", "Two hand-drawn posters for missing pets taped to a lamp post, and a coyote sniffing at the foot of the post.", s);
}

/** Chapter 14: an alligator on a muddy bank among the reeds at night. */
export function spot_alligator() {
  let s = sky("sa", W, H, { top: C.deep, bottom: C.night2, stars: 40, seed: 141, starTo: .45 });
  s += moon("sa", 130, 100, 36);
  s += hill([[-10, 300], [300, 280], [600, 296], [810, 270]], H, C.night2);
  s += R(0, 440, W, 160, C.dusk, C.ink, 2.6);
  for (const [x, y, w] of [[60, 480, 160], [360, 520, 220], [620, 470, 140], [200, 560, 120]]) s += L([[x, y], [x + w, y]], C.moonGlow, 2.4, ` opacity=".4"`);
  s += P(`M0 380Q300 350 560 372Q700 382 810 360V448H0Z`, C.brownDark, C.ink, 3);
  // reeds and bulrushes behind and in front
  const reed = (x, gy, h, head = true) => L([[x, gy], [x + 4, gy - h]], C.leafDeep, 4) + (head ? R(x - 3, gy - h - 6, 12, 34, C.brown, C.ink, 1.6, 6) : "") + L([[x, gy], [x - 24, gy - h * .6]], C.leaf, 3);
  for (const [x, h] of [[640, 200], [670, 240], [700, 180], [730, 220], [760, 260], [40, 160], [70, 200]]) s += reed(x, 380, h);
  s += place(140, 400, 1.3, A.alligator());
  for (const [x, h] of [[600, 120], [790, 160], [20, 120]]) s += reed(x, 448, h, false);
  return spot("sa", "An alligator lying on a muddy riverbank among the reeds and bulrushes at night, the moon over the water.", s);
}

/** Chapter 15: wooden gears in the mill loft, a lantern on a hook, a rat on the beam. */
export function spot_gears() {
  let s = R(0, 0, W, H, C.woodDark, null);
  for (let x = 0; x < W; x += 64) s += L([[x, 0], [x, H]], C.brownDeep, 3);
  s += Ci(560, 160, 220, C.lamp, null, 0, ` opacity=".1"`);
  // the big wheel and the small one mesh: centre distance = sum of radii, minus tooth depth
  // each wheel turns on an axle fixed to an upright post that runs from the floor to the beam
  s += R(270, 100, 40, 500, C.wood, C.ink, 2.6) + R(548, 100, 36, 500, C.wood, C.ink, 2.6);
  s += gear(290, 360, 180, 24, 4) + gear(566, 452, 110, 15, 10);
  s += R(0, 70, W, 40, C.wood, C.ink, 3);
  // the ladder up through the floor, leaning on the beam
  s += L([[690, 600], [660, 110]], C.wood, 12) + L([[760, 600], [730, 110]], C.wood, 12);
  for (let y = 150; y < 600; y += 48) { const t = (y - 110) / 490; s += L([[660 + 30 * t, y], [730 + 30 * t, y]], C.wood, 8); }
  // the lantern hanging from a hook in the beam
  s += L([[560, 110], [560, 160]], C.ink, 3) + lantern(560, 220, 1.5);
  s += place(400, 70, 2.8, A.rat());
  return spot("sg", "Two great wooden gears meshing in the mill loft, a lantern hanging from the beam above, a ladder leaning on it and a brown rat running along the beam.", s);
}

/** Chapter 16: a ring of keys on a nail by a heavy door with an iron lock. */
export function spot_keys() {
  let s = R(0, 0, W, H, C.night2, null) + P(`M520 0H800V600H260Z`, C.moonGlow, null, 0, ` opacity=".1"`);
  s += R(150, 0, 500, 600, C.wood, C.ink, 4);
  for (let x = 150; x < 650; x += 84) s += L([[x, 0], [x, 600]], C.woodDark, 3);
  for (const y of [110, 470]) s += R(150, y, 500, 34, C.greyDark, C.ink, 3) + [190, 610].map(x => Ci(x, y + 17, 7, C.grey, C.ink, 2)).join("");
  s += R(500, 250, 100, 150, C.greyDark, C.ink, 3, 8) + Ci(550, 300, 14, C.ink, null) + P(`M542 304L536 350H564L558 304Z`, C.ink, null);
  s += Ci(330, 240, 7, C.grey, C.ink, 2);   // the nail
  const key = (deg, len, bit) => at(330, 240, deg,
    Ci(0, 46, 46, "none", C.ink, 7) + Ci(0, 46, 46, "none", C.grey, 4) + "", 1) + at(330, 240, deg,
    G("translate(0 92)", Ci(0, 14, 14, "none", C.ink, 8) + Ci(0, 14, 14, "none", C.goldDeep, 5) + R(-5, 26, 10, len, C.goldDeep, C.ink, 2.4) + bit(len + 26)));
  s += at(330, 240, 0, Ci(0, 46, 46, "none", C.ink, 7) + Ci(0, 46, 46, "none", C.grey, 4));
  const bitA = y => R(5, y - 30, 20, 12, C.goldDeep, C.ink, 2) + R(5, y - 14, 14, 12, C.goldDeep, C.ink, 2);
  const bitB = y => R(5, y - 26, 26, 22, C.goldDeep, C.ink, 2);
  s += at(330, 240, -24, G("translate(0 92)", Ci(0, 14, 14, "none", C.ink, 8) + Ci(0, 14, 14, "none", C.goldDeep, 5) + R(-5, 26, 10, 120, C.goldDeep, C.ink, 2.4) + bitA(146)));
  s += at(330, 240, 6, G("translate(0 92)", Ci(0, 14, 14, "none", C.ink, 8) + Ci(0, 14, 14, "none", C.grey, 5) + R(-5, 26, 10, 96, C.grey, C.ink, 2.4) + bitB(122).replace(new RegExp(C.goldDeep, "g"), C.grey)));
  s += at(330, 240, 30, G("translate(0 92)", Ci(0, 14, 14, "none", C.ink, 8) + Ci(0, 14, 14, "none", C.goldDeep, 5) + R(-5, 26, 10, 80, C.goldDeep, C.ink, 2.4) + bitA(106)));
  return spot("sk", "A ring of old keys hanging from a nail on a heavy wooden door with iron bands and a lock.", s);
}

/** Chapter 17: a bison behind a wooden fence on a moonlit meadow, fireflies in the grass. */
export function spot_bison() {
  let s = sky("bi", W, H, { top: C.deep, bottom: C.dusk, stars: 40, seed: 171, starTo: .5 });
  s += moon("bi", 620, 110, 46);
  s += hill([[-10, 400], [260, 360], [560, 380], [810, 350]], H, C.night2) + R(0, 470, W, 130, C.leafDeep, C.ink, 2.6);
  s += place(230, 480, 1.25, A.bison());
  // the fence in front: posts in the ground, rails between them
  for (const x of [40, 230, 420, 610, 790]) s += R(x - 9, 360, 18, 140, C.wood, C.ink, 2.6);
  for (const y of [390, 440]) s += R(0, y, W, 14, C.wood, C.ink, 2.4);
  s += tufts(0, 500, W, 100, 40, 172);
  const r = rng(173);
  for (let i = 0; i < 18; i++) { const x = r() * W, y = 300 + r() * 280; s += Ci(x, y, 9, C.lamp, null, 0, ` opacity=".25"`) + Ci(x, y, 3, C.lamp, null); }
  return spot("bi", "A bison standing behind a wooden fence on a moonlit meadow, with fireflies over the grass.", s);
}

/** Chapter 19: game night: dice, sheets, Wild tokens, cups and a bowl of popcorn. */
export function spot_table() {
  let s = R(0, 0, W, H, C.dusk, null);
  s += R(560, 50, 180, 170, C.deep, C.ink, 4) + Ci(690, 100, 24, C.moon, null) + L([[650, 50], [650, 220]], C.wood, 8) + L([[560, 135], [740, 135]], C.wood, 8);
  s += table(300, W, H);
  s += P(`M60 480L110 360H330L300 480Z`, C.paper, C.ink, 2.6) + P(`M470 470L510 350H720L700 470Z`, C.paper, C.ink, 2.6);
  for (let k = 0; k < 5; k++) s += L([[118 - k * 4, 384 + k * 20], [308 - k * 2, 384 + k * 20]], C.inkSoft, 2) + L([[516 - k * 5, 374 + k * 20], [706 - k * 2, 374 + k * 20]], C.inkSoft, 2);
  s += P(`M330 330Q330 386 400 390Q470 386 470 330Z`, C.shirt1, C.ink, 3) + E(400, 330, 70, 14, C.brownDark, C.ink, 2.4);
  const r = rng(191);
  for (let i = 0; i < 22; i++) s += Ci(342 + r() * 116, 316 + r() * 14 - (i % 3) * 6, 9, C.cream, C.ink, 1.4);
  for (const [x, col] of [[200, C.shirt4], [600, C.shirt3]]) s += P(`M${x - 26} 340V290Q${x - 26} 284 ${x - 20} 284H${x + 20}Q${x + 26} 284 ${x + 26} 290V340Z`, col, C.ink, 2.6) + E(x, 286, 23, 5, C.brownDark, C.ink, 1.6) + P(`M${x + 26} 298Q${x + 46} 302 ${x + 42} 318Q${x + 38} 328 ${x + 26} 326`, "none", C.ink, 3.4);
  s += die(300, 560, 50, 6, true) + die(370, 570, 50, 2) + die(440, 556, 50, 5, true);
  for (const x of [540, 572, 604, 636]) s += token(x, 560, 13);
  s += pencil(130, 540, -8, 180);
  return spot("tb", "Game night: two character sheets, dice and green Wild tokens on the table, cups, a bowl of popcorn, and a window onto the moon.", s);
}

/** Chapter 2: a character sheet seen from above, with a pencil, a die and a feather. */
export function spot_sheet() {
  let s = R(0, 0, W, H, C.wood, null);
  for (let y = 40; y < H; y += 90) s += L([[0, y], [W, y - 12]], C.woodDark, 2, ` opacity=".5"`);
  let sh = R(-196, -250, 392, 500, C.paper, C.ink, 3, 6) + R(-196, -250, 392, 56, C.accentDeep, C.ink, 3, 6);
  sh += Ci(-120, -120, 52, C.paper2, C.ink, 2.6);
  // a pawprint drawn in the portrait circle
  sh += E(-120, -106, 16, 13, C.inkSoft, null) + [[-138, -130], [-126, -140], [-112, -140], [-100, -130]].map(([x, y]) => E(x, y, 6, 7.5, C.inkSoft, null)).join("");
  sh += scribble(-40, -150, 200, 3, 26, 31);
  for (let row = 0; row < 5; row++) {
    sh += scribble(-170, -20 + row * 40, 110, 1, 0, 40 + row);
    for (let d = 0; d < 5; d++) sh += Ci(-30 + d * 34, -26 + row * 40, 11, d < 1 + ((row * 3) % 4) ? C.inkSoft : C.paper, C.ink, 2);
  }
  sh += R(-170, 186, 340, 46, "none", C.inkSoft, 2, 4) + [0, 1, 2].map(k => R(-150 + k * 50, 196, 28, 26, "none", C.ink, 2.4, 3)).join("");
  s += at(380, 300, -4, sh);
  s += pencil(560, 500, -38, 230) + dieTop(150, 470, 64, 5, 14) + feather(600, 130, 160, 150);
  return spot("sh", "A character sheet lying on a wooden table, a pawprint drawn in its portrait circle, with a pencil, a die and an owl feather beside it.", s);
}
