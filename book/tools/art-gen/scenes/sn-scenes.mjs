// Second Nature scenes: the cover, the back, part pages and chapter vignettes.
// Chapter vignettes are 1000×252 (the 7.14in × 1.8in chapter-head box); part art is
// 900×300; the cover is 612×792 (the page); the back panel is 800×600.
// Everything stands on a ground line; animals are drawn to one true scale per scene.
import { C, svg, n, S, L, P, E, Ci, R, G, T, place, sky, moon, hill, tree, wildSwirl, leaf, windowLit, rng, curve } from "./kit.mjs";
import * as A from "./animals.mjs";

const W = 1000, HH = 252;

/* ---------------------------------------------------------------- pieces */

/** A row of terraced houses along a ground line, with lit or dark windows. */
function houses(x0, x1, gy, seed = 1, lit = 0.5, h0 = 90) {
  const r = rng(seed);
  let s = "", x = x0;
  while (x < x1) {
    const w = 60 + r() * 50, h = h0 + r() * 50, roof = 22 + r() * 18;
    const col = [C.night2, C.dusk, C.brickDark][Math.floor(r() * 3)];
    s += P(`M${n(x)} ${n(gy)}V${n(gy - h)}L${n(x + w / 2)} ${n(gy - h - roof)}L${n(x + w)} ${n(gy - h)}V${n(gy)}Z`, col, C.ink, 2.2);
    if (r() < .5) s += R(x + w * .65, gy - h - roof * .9, 10, roof * .7, col, C.ink, 2);
    for (let row = 0; row < 2; row++) for (let k = 0; k < 2; k++) s += windowLit(x + 10 + k * (w / 2), gy - h + 14 + row * 38, w / 2 - 20, 22, r() < lit);
    x += w + 2;
  }
  return s;
}
/** Distant houses: the same row, drawn smaller (sc) so a far town reads as far. */
const farHouses = (x0, x1, gy, seed, lit, h0, sc) => G(`translate(0 ${n(gy)}) scale(${n(sc)})`, houses(x0 / sc, x1 / sc, 0, seed, lit, h0));
/** A night ground strip. */
const ground = (gy, fill = C.leafDeep, w = W, h = HH) => P(`M0 ${n(gy)}H${w}V${h}H0Z`, fill, C.ink, 2.6);
const groundLine = (gy, w = W) => P(`M0 ${n(gy)}H${w}`, "none", C.ink, 2.6);
/** A storm cloud. */
const cloud = (x, y, s = 1, fill = C.dusk) => S([[x - 60 * s, y], [x - 50 * s, y - 22 * s], [x - 20 * s, y - 30 * s], [x + 6 * s, y - 44 * s], [x + 40 * s, y - 34 * s], [x + 64 * s, y - 14 * s], [x + 60 * s, y + 4 * s]], fill, C.ink, 2);
/** A six-sided die resting on a surface at (x, gy): front face plus top and side. */
function die(x, gy, size, face, hit = false) {
  const s3 = size, d = size * .3;
  let s = E(x + s3 / 2 + d / 2, gy + 2, s3 * .7, 4, C.ink, null, 0, ` opacity=".25"`);
  s += P(`M${n(x)} ${n(gy - s3)}L${n(x + d)} ${n(gy - s3 - d)}H${n(x + s3 + d)}L${n(x + s3)} ${n(gy - s3)}Z`, C.paper2, C.ink, 2);
  s += P(`M${n(x + s3)} ${n(gy)}V${n(gy - s3)}L${n(x + s3 + d)} ${n(gy - s3 - d)}V${n(gy - d)}Z`, C.edge, C.ink, 2);
  s += R(x, gy - s3, s3, s3, hit ? C.light : C.paper, C.ink, 2.4, s3 * .12);
  const pip = (u, v) => Ci(x + s3 * u, gy - s3 + s3 * v, s3 * .085, hit ? C.accentDeep : C.ink, null);
  const P6 = { 1: [[.5, .5]], 2: [[.28, .28], [.72, .72]], 3: [[.25, .25], [.5, .5], [.75, .75]], 4: [[.28, .28], [.72, .28], [.28, .72], [.72, .72]], 5: [[.26, .26], [.74, .26], [.5, .5], [.26, .74], [.74, .74]], 6: [[.28, .24], [.72, .24], [.28, .5], [.72, .5], [.28, .76], [.72, .76]] };
  for (const [u, v] of P6[face]) s += pip(u, v);
  if (hit) s += R(x - 4, gy - s3 - 4, s3 + 8, s3 + 8, "none", C.accent, 3, s3 * .16);   // hits are ringed, not just coloured
  return s;
}
/** A Wild token: a green bead resting on a surface. */
const token = (x, gy, r = 11) => E(x, gy + 1, r * 1.1, 3, C.ink, null, 0, ` opacity=".25"`) + E(x, gy - r * .6, r, r * .62, C.leaf, C.ink, 2) + E(x - r * .3, gy - r * .85, r * .3, r * .16, C.leafLight, null);
/** A table edge: a wooden band from gy to the bottom. */
const table = (gy, w = W, h = HH) => R(0, gy, w, h - gy, C.wood, C.ink, 2.6) + P(`M0 ${n(gy + 14)}H${w}`, "none", C.woodDark, 2);
/** A gilded hunting horn lying on its side, its bell to the right. */
function horn(x, y, s = 1) {
  return G(`translate(${n(x)} ${n(y)}) scale(${n(s)})`,
    P(`M0 0Q40 -30 90 -18Q120 -12 140 -40L150 -2Q120 6 90 4Q40 6 0 6Z`, C.gold, C.ink, 2.4) + E(146, -21, 6, 20, C.goldDeep, C.ink, 2.4) + Ci(2, 3, 4, C.goldDeep, C.ink, 1.6));
}
/** The Hunt's crest: gold antlers over a horn, with laurel sprigs. */
function crest(cx, cy, s = 1) {
  let b = "";
  const antler = (dir) => {
    const m = dir;
    let a = L([[0, 0], [10 * m, -30], [18 * m, -60], [30 * m, -88]], C.ink, 10) + L([[0, 0], [10 * m, -30], [18 * m, -60], [30 * m, -88]], C.gold, 6);
    for (const [px, py, qx, qy] of [[10, -30, 30, -42], [18, -60, 40, -64], [16, -50, 4, -76]]) a += L([[px * m, py], [qx * m, qy]], C.ink, 9) + L([[px * m, py], [qx * m, qy]], C.gold, 5);
    return a;
  };
  b += G("translate(-14 0)", antler(-1)) + G("translate(14 0)", antler(1));
  b += horn(-75, 34, 1);
  for (const m of [-1, 1]) for (let k = 0; k < 5; k++) b += leaf(m * (56 + k * 6), 44 - k * 16, 20, m * (60 - k * 14), C.leaf);
  return G(`translate(${n(cx)} ${n(cy)}) scale(${n(s)})`, b);
}
/** A gilded cage resting on the floor. */
function cage(x, gy, w, h, open = false) {
  let s = E(x + w / 2, gy + 3, w * .55, 6, C.ink, null, 0, ` opacity=".25"`);
  s += R(x - 6, gy - 10, w + 12, 10, C.goldDeep, C.ink, 2.2, 3);
  s += P(`M${n(x)} ${n(gy - h)}Q${n(x + w / 2)} ${n(gy - h - w * .55)} ${n(x + w)} ${n(gy - h)}`, "none", C.ink, 6) + P(`M${n(x)} ${n(gy - h)}Q${n(x + w / 2)} ${n(gy - h - w * .55)} ${n(x + w)} ${n(gy - h)}`, "none", C.gold, 3);
  const bars = 7;
  for (let k = 0; k <= bars; k++) {
    const bx = x + (w * k) / bars;
    if (open && k >= 3 && k <= 5) continue;
    const top = gy - h - Math.sin(Math.PI * k / bars) * w * .27;
    s += L([[bx, gy - 10], [bx, top]], C.ink, 5) + L([[bx, gy - 10], [bx, top]], C.gold, 2.4);
  }
  s += R(x - 4, gy - h - 4, w + 8, 8, C.gold, C.ink, 2);
  // ring on top, hanging from nothing: it's a carrying ring, resting on the dome
  s += Ci(x + w / 2, gy - h - w * .3, 8, "none", C.ink, 5) + Ci(x + w / 2, gy - h - w * .3, 8, "none", C.gold, 2.4);
  if (open) {
    const dx0 = x + (w * 3) / bars, dx1 = x + (w * 5) / bars;
    s += P(`M${n(dx0)} ${n(gy - 12)}L${n(dx0 - (dx1 - dx0) * .9)} ${n(gy - 4)}L${n(dx0 - (dx1 - dx0) * .9)} ${n(gy - h + 8)}L${n(dx0)} ${n(gy - h + 2)}`, "none", C.ink, 5) + P(`M${n(dx0)} ${n(gy - 12)}L${n(dx0 - (dx1 - dx0) * .9)} ${n(gy - 4)}L${n(dx0 - (dx1 - dx0) * .9)} ${n(gy - h + 8)}L${n(dx0)} ${n(gy - h + 2)}`, "none", C.gold, 2.4);
  }
  return s;
}
/** A lantern standing on the ground. */
function lantern(x, gy, s = 1, lit = true) {
  return G(`translate(${n(x)} ${n(gy)}) scale(${n(s)})`,
    (lit ? Ci(0, -26, 34, C.lamp, null, 0, ` opacity=".25"`) : "") + R(-14, -8, 28, 8, C.woodDark, C.ink, 2) + R(-11, -44, 22, 36, lit ? C.lamp : C.night2, C.ink, 2.2, 3) + P(`M-14 -44L0 -56L14 -44Z`, C.woodDark, C.ink, 2) + Ci(0, -60, 4, "none", C.ink, 2.4));
}
/** A big house with a lit attic window (the Lodge). */
function lodge(cx, gy, s = 1, lit = 0.4) {
  const r = rng(11);
  let b = "";
  b += P(`M-150 0V-90L-120 -130H120L150 -90V0Z`, C.night2, C.ink, 2.4);
  b += P(`M-60 -130L0 -178L60 -130Z`, C.night2, C.ink, 2.4) + R(-70, -170, 16, 40, C.night2, C.ink, 2) + R(54, -170, 16, 40, C.night2, C.ink, 2);
  for (let k = -3; k <= 3; k++) for (const y of [-80, -44]) b += windowLit(k * 38 - 12, y, 24, 26, r() < lit);
  b += windowLit(-10, -158, 20, 18, true);
  b += P(`M-20 0V-30Q0 -44 20 -30V0Z`, C.woodDark, C.ink, 2);
  return G(`translate(${n(cx)} ${n(gy)}) scale(${n(s)})`, b);
}
/** A post (the barn owl's perch). */
const post = (x, gy, h, w = 14) => R(x - w / 2, gy - h, w, h, C.wood, C.ink, 2.2);

/* ---------------------------------------------------------------- cover */

export function cover() {
  const w = 612, h = 792;
  let s = sky("cv", w, h, { top: C.deep, bottom: C.dusk, stars: 90, seed: 5, starTo: .6 });
  s += moon("cv", 306, 300, 92);
  // distant Thornhill and the Lodge's gold windows
  s += hill([[-10, 520], [150, 486], [300, 500], [440, 462], [622, 496]], 792, C.night2);
  s += lodge(470, 468, .26, .8);
  // the town in the valley, far below
  s += farHouses(-10, 640, 548, 9, .35, 60, .3);
  // the near hill where the six stand
  s += hill([[-10, 620], [120, 584], [300, 572], [470, 588], [622, 612]], 792, C.leafDeep, C.ink, 3);
  s += wildSwirl(300, 548, 120, 12).replace(/opacity="([\d.]+)"/g, (m, o) => `opacity="${(o * .7).toFixed(2)}"`);
  // true scale: 0.62 px per cm
  const k = .62;
  s += place(30, 612, k, A.bison());
  s += place(240, 590, k, A.jaguar());
  s += place(365, 592, k, A.coyote());
  s += post(520, 606, 70 * k * 1.6, 9) + place(520, 606 - 70 * k * 1.6, k * 1.6, A.barnOwl());
  s += place(452, 600, k * 1.8, A.rat());
  s += place(110, 660, k, A.alligator());
  s += place(450, 360, k * 1.1, A.owlFlying());
  return svg(`0 0 ${w} ${h}`, "Six animals on a moonlit hill above the town: a bison, a jaguar, a coyote, a rat, a barn owl on a post, an alligator, and an owl flying across the moon. Far off, the Lodge's windows glow gold.", s);
}

export function back() {
  const w = 800, h = 600;
  let s = sky("bk", w, h, { top: C.deep, bottom: C.night2, stars: 50, seed: 8 });
  s += moon("bk", 620, 150, 64);
  s += hill([[-10, 400], [200, 330], [400, 300], [600, 330], [810, 390]], 600, C.night2, C.ink, 3);
  s += lodge(400, 318, 1.15, .55);
  s += R(0, 470, w, 130, C.stone, C.ink, 3);
  for (let x = 0; x < w; x += 60) s += P(`M${x} 470V600`, "none", C.ink, 1.4, ` opacity=".5"`);
  s += P(`M0 520H${w}M0 560H${w}`, "none", C.ink, 1.4, ` opacity=".5"`);
  s += place(150, 470, 1.25, A.hound());
  s += place(650, 470, 1.25, A.hound(), true);
  return svg(`0 0 ${w} ${h}`, "The Lodge on Thornhill at night, one window lit, with two grey Hounds standing on the wall below.", s);
}

/* ------------------------------------------------------------- part art */

export function part_one() {
  const w = 900, h = 300;
  let s = sky("p1", w, h, { top: C.deep, bottom: C.night2, stars: 40, seed: 21 });
  s += moon("p1", 640, 110, 58);
  for (const [x, hh, k] of [[60, 170, "pine"], [130, 200, "pine"], [800, 190, "pine"], [860, 150, "pine"], [720, 120, "round"]]) s += tree(x, 262, hh, C.leafDeep, k);
  s += ground(262, C.leafDeep, w, h);
  s += P(`M300 262Q300 236 340 232H560Q600 236 600 262Z`, C.woodDark, C.ink, 2.6);   // a fallen log, resting on the ground
  s += place(360, 234, .95, A.jaguar());
  s += place(640, 110, 1.6, A.owlFlying());
  return svg(`0 0 ${w} ${h}`, "A jaguar walking along a fallen log at the edge of the woods, with a barn owl flying across the moon.", s);
}

export function part_two() {
  const w = 900, h = 300;
  let s = sky("p2", w, h, { top: C.deep, bottom: C.night2, stars: 30, seed: 22 });
  s += table(236, w, h);
  // an open book lying on the table, a lantern beside it, dice
  s += P(`M300 236L320 196Q380 180 450 196Q520 180 580 196L600 236Z`, C.paper, C.ink, 2.6) + P(`M450 196V236`, "none", C.ink, 2);
  for (let k = 0; k < 4; k++) s += P(`M${340 + k * 6} ${206 + k * 7}Q390 ${196 + k * 7} 436 ${206 + k * 7}M${464} ${206 + k * 7}Q510 ${196 + k * 7} ${560 - k * 6} ${206 + k * 7}`, "none", C.inkSoft, 1.6);
  s += lantern(220, 236, 1.6);
  s += die(640, 236, 38, 6, true) + die(700, 236, 38, 3);
  s += crest(790, 110, 1.05);
  return svg(`0 0 ${w} ${h}`, "The Storyteller's table: an open book, a lit lantern and two dice, with the Hunt's gold crest above.", s);
}

export function part_three() {
  const w = 900, h = 300;
  let s = sky("p3", w, h, { top: C.deep, bottom: C.dusk, stars: 30, seed: 23 });
  s += hill([[-10, 230], [200, 210], [520, 200], [700, 150], [910, 170]], 300, C.night2);
  s += lodge(780, 160, .42, .6);
  s += houses(-10, 620, 262, 31, .5, 60);
  s += ground(262, C.night2, w, h);
  for (const [x, y, k] of [[90, 150, 1], [250, 170, 2], [410, 150, 3], [560, 170, 4], [780, 70, 5]]) {
    s += Ci(x, y, 22, C.gold, C.ink, 2.6) + T(x, y + 9, String(k), 26, C.ink, { weight: 900, family: "Fraunces" });
  }
  return svg(`0 0 ${w} ${h}`, "Wrenfield at night with five numbered gold markers over the five missions, the last over the Lodge on Thornhill.", s);
}

export function part_four() {
  const w = 900, h = 300;
  let s = sky("p4", w, h, { top: C.deep, bottom: C.night2, stars: 20, seed: 24 });
  s += table(214, w, h);
  // character sheets lying flat on the table
  s += P(`M120 214L150 176H330L300 214Z`, C.paper, C.ink, 2.4) + P(`M560 214L590 176H770L740 214Z`, C.paper, C.ink, 2.4);
  for (let k = 0; k < 3; k++) s += P(`M${165 - k * 6} ${186 + k * 9}H${300 - k * 6}M${605 - k * 6} ${186 + k * 9}H${740 - k * 6}`, "none", C.inkSoft, 1.6);
  for (const [x, f, hit] of [[360, 5, true], [410, 2, false], [460, 6, true], [510, 1, false]]) s += die(x, 214, 34, f, hit);
  for (const x of [200, 230, 260, 640, 670]) s += token(x, 214);
  return svg(`0 0 ${w} ${h}`, "Two character sheets, four dice and green Wild tokens on a table.", s);
}

/* ----------------------------------------------------- chapter vignettes */

const vig = (title, body) => svg(`0 0 ${W} ${HH}`, title, body);

export function ch_01() {
  let s = sky("c1", W, HH, { top: C.deep, bottom: C.night2, stars: 40, seed: 31 });
  s += moon("c1", 820, 70, 40);
  s += cloud(160, 70, 1.3) + cloud(330, 50, 1) + cloud(560, 80, .8);
  s += houses(-10, 1010, 222, 3, 0, 80);
  s += groundLine(222);
  s += place(820, 70, 1.2, A.owlFlying());
  s += wildSwirl(600, 120, 70, 4);
  return vig("Wrenfield the night the lights went out: dark windows, storm clouds clearing, an owl across the moon and a swirl of light over the rooftops.", s);
}

export function ch_02() {
  let s = sky("c2", W, HH, { top: C.night2, bottom: C.dusk, stars: 20, seed: 32 });
  s += ground(222, C.leafDeep);
  const k = .5;   // one true scale for all six
  s += place(40, 222, k, A.alligator());
  s += place(250, 222, k, A.bison());
  s += place(430, 222, k, A.jaguar());
  s += place(560, 222, k, A.coyote());
  s += post(700, 222, 60, 8) + place(700, 162, k, A.barnOwl());
  s += R(760, 214, 60, 8, C.stone, C.ink, 2, 3) + place(770, 214, k, A.rat());
  s += T(930, 120, "true size", 22, C.moon, { italic: true, weight: 600, family: "Fraunces" });
  return vig("The six frames side by side at their true sizes: an alligator, a bison, a jaguar, a coyote, a barn owl on a post and a rat on a stone.", s);
}

export function ch_03() {
  let s = R(0, 0, W, HH, C.night2, null) + Ci(500, 40, 260, C.lamp, null, 0, ` opacity=".12"`);
  s += table(200);
  const faces = [[2, false], [5, true], [3, false], [6, true], [1, false], [6, true]];
  faces.forEach(([f, hit], i) => { s += die(250 + i * 86, 200, 58, f, hit); });
  for (const x of [120, 150, 180, 820, 850]) s += token(x, 200);
  s += P(`M60 200L64 194H232L236 200Z`, C.goldLight, C.ink, 2) + P(`M232 194L248 197L236 200Z`, C.skin2, C.ink, 1.6);
  return vig("Six dice on a table, the two 6s and the 5 ringed as hits, with green Wild tokens and a pencil lying beside them.", s);
}

export function ch_04() {
  let s = sky("c4", W, HH, { top: C.deep, bottom: C.night2, stars: 25, seed: 34 });
  s += tree(120, 222, 200, C.leafDeep) + tree(880, 222, 180, C.leafDeep, "pine");
  s += ground(222, C.leafDeep);
  s += wildSwirl(470, 150, 90, 9);
  s += place(660, 80, 1.6, A.owlFlying());
  return vig("A swirl of light and leaves in a garden at night, with a barn owl flying up out of it. Nothing of the change itself is shown.", s);
}

export function ch_05() {
  let s = sky("c5", W, HH, { top: C.deep, bottom: C.night2, stars: 30, seed: 35 });
  s += hill([[-10, 160], [300, 130], [620, 150], [1010, 120]], HH, C.night2);
  s += place(760, 136, .55, A.hound(), true);
  s += ground(200, C.leafDeep);
  s += P(`M40 252Q300 210 520 214Q700 218 900 196`, "none", C.edge, 26) + P(`M40 252Q300 210 520 214Q700 218 900 196`, "none", C.paper2, 20);
  // the wall and gate at the end of the path
  s += R(880, 150, 120, 50, C.stone, C.ink, 2.4) + R(890, 160, 30, 40, C.woodDark, C.ink, 2);
  // paw prints along the path
  const r = rng(5);
  for (let i = 0; i < 9; i++) { const x = 120 + i * 80, y = 232 - i * 3.5 + (i % 2) * 6; s += paw(x, y, 7, C.wild); }
  return vig("A pale path through the dark leading to a gate in a wall, glowing paw prints along it, and a grey Hound on the far hill, sniffing.", s);
}
function paw(x, y, r, fill) {
  return E(x, y, r, r * .8, fill, C.ink, 1.2) + [[-1, -1.3], [-.35, -1.7], [.35, -1.7], [1, -1.3]].map(([u, v]) => E(x + u * r * .9, y + v * r * .9, r * .32, r * .38, fill, C.ink, 1)).join("");
}

export function ch_06() {
  let s = sky("c6", W, HH, { top: C.deep, bottom: C.night2, stars: 25, seed: 36 });
  s += ground(226, C.leafDeep);
  const k = .62;
  s += place(180, 226, k, A.bison());
  s += place(640, 226, k * 1.05, A.hound(), true);
  s += place(800, 226, k * 1.05, A.hound(), true);
  return vig("A bison squares up to two grey Hounds on a dark lawn.", s);
}

export function ch_07() {
  let s = R(0, 0, W, HH, C.night2, null);
  s += R(700, 30, 120, 120, C.dusk, C.ink, 3) + P(`M760 30V150M700 90H820`, "none", C.ink, 3) + P(`M700 150L560 230H900L820 150Z`, C.moonGlow, null, 0, ` opacity=".18"`);
  s += R(0, 210, W, 42, C.stone, C.ink, 2.6);
  for (let x = 40; x < W; x += 90) s += P(`M${x} 210V252`, "none", C.ink, 1.4, ` opacity=".5"`);
  s += cage(380, 212, 150, 130, true);
  s += G("translate(600 210)", P(`M0 0Q20 -10 46 -4Q24 0 0 0Z`, C.owl, C.ink, 1.6) + P(`M0 0L44 -4`, "none", C.ink, 1));
  return vig("An empty gilded cage with its door open on a stone floor, moonlight from a window, and a single owl feather lying beside it.", s);
}

export function ch_08() {
  let s = sky("c8", W, HH, { top: C.deep, bottom: C.dusk, stars: 30, seed: 38 });
  s += moon("c8", 560, 60, 30);
  s += hill([[-10, 222], [400, 210], [700, 140], [860, 90], [1010, 110]], HH, C.night2, C.ink, 2.4);
  s += lodge(860, 92, .38, .8);
  s += houses(-10, 330, 222, 13, .6, 60);
  s += ground(222, C.night2);
  const road = [[300, 240], [480, 214], [620, 176], [700, 150], [780, 120], [830, 100]];
  s += P(curve(road), "none", C.edge, 14) + P(curve(road), "none", C.paper2, 9);
  road.slice(0, 5).forEach(([x, y], i) => { s += lantern(x, y + 2, .5, true); });
  return vig("The road from Wrenfield up Thornhill to the Lodge, with lanterns marking the way: a campaign's missions on the road to the Last Hunt.", s);
}

export function ch_09() {
  let s = R(0, 0, W, HH, C.night2, null) + Ci(250, 90, 220, C.lamp, null, 0, ` opacity=".14"`);
  s += table(200);
  // a desk lamp standing on the table
  s += R(220, 190, 70, 10, C.greyDark, C.ink, 2) + L([[255, 190], [230, 120], [270, 80]], C.ink, 7) + L([[255, 190], [230, 120], [270, 80]], C.grey, 4);
  s += P(`M250 70L300 60L310 100L262 104Z`, C.greyDark, C.ink, 2.4);
  // sheets, dice, a bowl of tokens
  s += P(`M360 200L380 170H560L540 200Z`, C.paper, C.ink, 2.4);
  for (let k = 0; k < 3; k++) s += P(`M${392 - k * 5} ${178 + k * 8}H${540 - k * 5}`, "none", C.inkSoft, 1.6);
  s += die(600, 200, 40, 5, true) + die(656, 200, 40, 4);
  s += P(`M740 200Q740 176 790 170Q840 176 840 200Z`, C.woodDark, C.ink, 2.4);
  for (const x of [768, 790, 812]) s += E(x, 172, 10, 6, C.leaf, C.ink, 1.6);
  return vig("The Storyteller's table: a desk lamp, a character sheet lying flat, two dice and a bowl of green tokens.", s);
}

export function ch_10() {
  let s = R(0, 0, W, HH, C.deep, null);
  s += P(`M380 0H620V200L500 236L380 200Z`, C.crimson, C.ink, 3);
  s += crest(500, 116, .95);
  s += ground(226, C.night2);
  s += place(120, 226, .9, A.hound());
  s += place(880, 226, .9, A.hound(), true);
  return vig("The Gilded Hunt's crest, gold antlers over a horn on a crimson banner, between two grey Hounds.", s);
}

export function ch_11() {
  let s = sky("c11", W, HH, { top: C.dusk, bottom: C.moonGlow, stars: 8, seed: 41, starTo: .3 });
  s += hill([[600, 200], [760, 120], [860, 100], [1010, 140]], HH, C.leafDeep, C.ink, 2.4);
  s += lodge(860, 102, .3, .3);
  // the mill with its wheel
  s += R(40, 90, 110, 120, C.brick, C.ink, 2.4) + P(`M40 90L95 50L150 90Z`, C.brickDark, C.ink, 2.4) + R(70, 20, 50, 70, C.brick, C.ink, 2.4);
  s += Ci(170, 196, 34, "none", C.ink, 6) + Ci(170, 196, 34, "none", C.wood, 3);
  for (let a = 0; a < 8; a++) { const t = a * Math.PI / 4; s += L([[170, 196], [170 + Math.cos(t) * 34, 196 + Math.sin(t) * 34]], C.wood, 3); }
  s += houses(220, 480, 212, 17, .2, 50);
  // the museum with its dome
  s += R(500, 120, 150, 92, C.wall, C.ink, 2.4) + P(`M540 120Q575 70 610 120Z`, C.stone, C.ink, 2.4);
  for (let k = 0; k < 5; k++) s += R(510 + k * 28, 140, 10, 70, C.light, C.ink, 1.6);
  s += tree(690, 212, 70) + tree(730, 212, 90) + tree(770, 212, 60);
  s += R(0, 212, W, 40, C.glass, C.ink, 2.4);
  s += L([[0, 228], [200, 222], [400, 228], [600, 222], [800, 228], [1000, 222]], C.light, 2, ` opacity=".6"`);
  return vig("Wrenfield at dusk: the Old Mill and its waterwheel by the river, the High Street, the museum's dome, the zoo's trees, and the Lodge on Thornhill.", s);
}

export function ch_12() {
  let s = R(0, 0, W, HH, C.night2, null) + Ci(500, 60, 300, C.lamp, null, 0, ` opacity=".1"`);
  s += table(160);
  // a hand-drawn map lying flat on the table, a pencil fully on the map
  s += P(`M240 252L290 168H710L760 252Z`, C.paper, C.ink, 2.6);
  s += P(`M330 236Q400 200 480 214T640 186`, "none", C.inkSoft, 3, ` stroke-dasharray="10 8"`);
  for (const [x, y] of [[330, 236], [480, 214], [640, 186]]) s += P(`M${x - 8} ${y - 8}L${x + 8} ${y + 8}M${x + 8} ${y - 8}L${x - 8} ${y + 8}`, "none", C.crimson, 3.4);
  s += R(380, 180, 70, 22, "none", C.accentDeep, 2.4, 3) + R(560, 216, 90, 24, "none", C.accentDeep, 2.4, 3);
  s += P(`M560 196L566 191H680L684 196Z`, C.goldLight, C.ink, 1.8) + P(`M680 191L694 193.5L684 196Z`, C.skin2, C.ink, 1.4);
  s += die(800, 232, 34, 2) + die(860, 240, 34, 5, true);
  return vig("A hand-drawn mission map lying on a table, with a dotted route, three crosses, a pencil on the map and two dice beside it.", s);
}

export function ch_13() {
  let s = sky("c13", W, HH, { top: C.deep, bottom: C.night2, stars: 20, seed: 43 });
  s += R(0, 30, 160, 192, C.brickDark, C.ink, 2.4);                     // the alley wall
  s += R(60, 196, 50, 26, C.greyDark, C.ink, 2) + P(`M60 196L85 186L110 196`, "none", C.ink, 2);   // the coal hatch
  s += R(240, 40, 520, 182, C.brick, C.ink, 2.6);                       // the shop
  s += R(232, 30, 536, 14, C.brickDark, C.ink, 2.4);
  s += P(`M560 30L600 14H680L700 30Z`, C.glass, C.ink, 2.2);           // the skylight on the flat roof
  s += R(290, 56, 420, 40, C.leafDeep, C.ink, 2.4) + T(500, 86, "PEMBERTON’S PETS", 28, C.goldLight, { weight: 800, family: "Fraunces", spacing: 2 });
  s += R(290, 110, 250, 112, C.night2, C.ink, 2.4);
  for (let k = 0; k < 3; k++) for (let j = 0; j < 2; j++) { const x = 304 + k * 76, y = 120 + j * 48; s += R(x, y, 64, 40, "none", C.fog, 2); for (let b = 1; b < 5; b++) s += P(`M${x + b * 13} ${y}V${y + 40}`, "none", C.fog, 1.4); s += Ci(x + 24, y + 22, 2.4, C.goldLight, null) + Ci(x + 34, y + 22, 2.4, C.goldLight, null); }
  s += R(580, 110, 80, 112, C.woodDark, C.ink, 2.4) + Ci(648, 170, 3.6, C.gold, C.ink, 1);
  s += groundLine(222) + R(0, 222, W, 30, C.stone, C.ink, 2.4);
  s += R(820, 120, 14, 102, C.greyDark, C.ink, 2) + P(`M800 120H854`, "none", C.ink, 3) + Ci(827, 104, 14, C.lamp, C.ink, 2) + Ci(827, 104, 34, C.lamp, null, 0, ` opacity=".2"`);
  return vig("Pemberton's Pets at night: cages in the window with eyes glinting inside, the coal hatch in the alley, a skylight on the flat roof and a streetlamp.", s);
}

export function ch_14() {
  let s = sky("c14", W, HH, { top: C.deep, bottom: C.night2, stars: 25, seed: 44 });
  s += tree(80, 200, 160) + tree(160, 200, 120) + tree(940, 200, 150, C.leafDeep, "pine");
  s += ground(200, C.leafDeep);
  // the loading dock and the truck with its lights off
  s += R(300, 150, 200, 50, C.stone, C.ink, 2.4);
  s += R(520, 90, 220, 96, C.wall, C.ink, 2.6) + R(740, 120, 80, 66, C.night2, C.ink, 2.6) + R(752, 130, 46, 26, C.glass, C.ink, 2);
  for (const x of [560, 690, 790]) s += Ci(x, 192, 16, C.ink, C.ink, 2) + Ci(x, 192, 7, C.grey, null);
  // crates on the dock, the top one resting fully on the one below
  s += R(320, 98, 70, 52, C.wood, C.ink, 2.4) + R(400, 98, 70, 52, C.wood, C.ink, 2.4) + R(336, 50, 70, 48, C.wood, C.ink, 2.4);
  for (const [x, y] of [[320, 98], [400, 98], [336, 50]]) s += P(`M${x + 8} ${y + 8}L${x + 62} ${y + 40}`, "none", C.woodDark, 2);
  s += T(435, 128, "THORNHILL", 10.5, C.ink, { weight: 800 });
  s += Ci(352, 120, 2.6, C.goldLight, null) + Ci(362, 120, 2.6, C.goldLight, null);
  // the moat in front
  s += R(0, 220, W, 32, C.glass, C.ink, 2.4) + L([[0, 236], [250, 230], [500, 236], [750, 230], [1000, 236]], C.light, 2, ` opacity=".6"`);
  return vig("The zoo's loading dock at night: crates stencilled THORNHILL, a pair of eyes glinting in one, a truck with its lights off and the moat in front.", s);
}

export function ch_15() {
  let s = sky("c15", W, HH, { top: C.deep, bottom: C.night2, stars: 30, seed: 45 });
  s += moon("c15", 160, 60, 34);
  s += R(380, 70, 240, 150, C.brick, C.ink, 2.6) + P(`M380 70L500 30L620 70Z`, C.brickDark, C.ink, 2.6);
  s += R(460, -10, 80, 80, C.brick, C.ink, 2.6) + R(478, 6, 44, 36, C.night2, C.ink, 2);
  s += horn(480, 36, .3);
  for (const x of [400, 450, 550]) s += windowLit(x, 120, 30, 36, false);
  // ivy on the back wall (left side)
  for (let k = 0; k < 14; k++) s += leaf(390 + (k % 3) * 10, 90 + k * 9, 14, 30 + k * 23, C.leaf);
  // the waterwheel standing in the river at the mill's side
  s += Ci(680, 200, 60, "none", C.ink, 8) + Ci(680, 200, 60, "none", C.wood, 4) + Ci(680, 200, 10, C.woodDark, C.ink, 2);
  for (let a = 0; a < 12; a++) { const t = a * Math.PI / 6; s += L([[680, 200], [680 + Math.cos(t) * 60, 200 + Math.sin(t) * 60]], C.wood, 4) + R(680 + Math.cos(t) * 60 - 6, 200 + Math.sin(t) * 60 - 6, 12, 12, C.woodDark, C.ink, 1.4); }
  s += R(0, 220, W, 32, C.glass, C.ink, 2.4) + L([[0, 236], [250, 230], [500, 236], [750, 230], [1000, 236]], C.light, 2, ` opacity=".6"`);
  s += R(0, 200, 380, 20, C.leafDeep, C.ink, 2.4) + R(740, 200, 260, 20, C.leafDeep, C.ink, 2.4);
  return vig("The Old Mill at night: a glint of brass from the tower window, ivy on the wall, the waterwheel turning in the river.", s);
}

export function ch_16() {
  let s = sky("c16", W, HH, { top: C.deep, bottom: C.night2, stars: 20, seed: 46 });
  s += P(`M260 60L500 10L740 60Z`, C.wall, C.ink, 2.6);
  s += R(270, 60, 460, 140, C.wall, C.ink, 2.6);
  for (let k = 0; k < 7; k++) s += R(290 + k * 64, 70, 22, 130, C.light, C.ink, 2);
  for (let k = 0; k < 6; k++) s += windowLit(316 + k * 64, 100, 26, 70, true);
  s += R(440, 30, 120, 22, C.crimson, C.ink, 2) + T(500, 47, "GALA", 18, C.goldLight, { weight: 800, spacing: 3 });
  for (let k = 0; k < 4; k++) s += R(230 - k * 20, 200 + k * 10, 540 + k * 40, 10, C.stone, C.ink, 2);
  s += R(0, 240, W, 12, C.stone, C.ink, 2);
  s += Ci(500, 130, 200, C.lamp, null, 0, ` opacity=".08"`);
  return vig("The Ashcombe Museum lit up for the gala: tall columns, every window glowing, a crimson GALA banner and wide stone steps.", s);
}

export function ch_17() {
  let s = sky("c17", W, HH, { top: C.deep, bottom: C.night2, stars: 30, seed: 47 });
  s += moon("c17", 820, 60, 36) + cloud(760, 80, .8, C.night2);
  s += hill([[-10, 200], [300, 150], [500, 130], [700, 150], [1010, 200]], HH, C.leafDeep, C.ink, 2.4);
  s += lodge(500, 134, .62, .05);
  s += R(0, 210, W, 42, C.stone, C.ink, 2.6) + R(470, 190, 60, 62, C.woodDark, C.ink, 2.4);
  for (let x = 0; x < W; x += 70) s += P(`M${x} 210V252`, "none", C.ink, 1.4, ` opacity=".5"`);
  s += place(200, 180, .5, A.hound()) + place(760, 190, .5, A.hound(), true);
  return vig("The Lodge on Thornhill: a great dark house with one lit window high under the roof, Hounds on the lawn and the old wall with its gate.", s);
}

export function ch_18() {
  let s = sky("c18", W, HH, { top: C.deep, bottom: C.dusk, stars: 40, seed: 48 });
  s += hill([[-10, 200], [300, 172], [600, 168], [1010, 196]], HH, C.leafDeep, C.ink, 2.6);
  const k = .45;
  // the ready-made Bonded, with their Marks; Maya's (left eye) and Theo's (left ear)
  // are on the left, so the jaguar and the coyote face left to show them
  s += place(150, 186, k, A.alligator({ spots: true }));
  s += place(330, 176, k, A.bison({ scar: true }));
  s += place(570, 172, k, A.jaguar({ mark: true }), true);
  s += place(650, 172, k, A.coyote({ notch: true }), true);
  s += post(700, 176, 50, 7) + place(700, 126, k, A.barnOwl({ rings: true }));
  s += place(735, 177, k, A.rat({ patch: true }));
  s += place(860, 70, 1, A.owlFlying());
  return vig("The six Bonded in animal form on a hilltop at night, all drawn to one true scale, with a barn owl flying overhead.", s);
}

export function ch_19() {
  let s = R(0, 0, W, HH, C.paper2, null);
  s += P(`M0 200H${W}`, "none", C.ink, 2.6);
  s += die(110, 200, 64, 6, true) + token(270, 200, 22);
  s += G("translate(400 200)", P(`M0 -70L18 -26L64 -24L28 4L42 48L0 22L-42 48L-28 4L-64 -24L-18 -26Z`, C.goldLight, C.ink, 2.6, ` transform="translate(0 -52) scale(.7)"`));
  s += paw(560, 160, 22, C.wild);
  s += cage(660, 200, 90, 90);
  s += horn(820, 190, .9);
  // a shorter strip (1000×160, printed 7.14in × 1.14in) so the reference fits on one page
  return svg(`0 50 ${W} 160`, "The pieces of the game: a die, a Wild token, an Edge, a paw print for Scent, a gilded cage and the Hunt's horn.", s);
}

// shared with the spot illustrations (sn-spots.mjs)
export { die, token, table, horn, lantern, post, cage };
