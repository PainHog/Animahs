// The animals of Second Nature, drawn at real size: 1 unit = 1 cm, ground at y = 0,
// facing right, which shows the animal's RIGHT side. A one-sided Mark (mark, notch, scar)
// is drawn on the visible side: use the drawing as it is for a right-side Mark, and flip
// it with place(..., true) for a left-side Mark, which then faces left with the Mark showing.
// Every animal has its true number of legs, eyes and ears for the view it is drawn
// in (ART-CHECKLIST 9, 21–22). Far-side legs are drawn darker, behind the body.
import { C, S, L, P, E, Ci, G, n, curve, smooth } from "./kit.mjs";

const SW = 2.2;               // outline width at real size (scaled with the animal)
const dark = (c) => c;        // far legs use a darker fill passed in explicitly

/** A thick tail: an ink stroke under a fill-coloured stroke, so it reads as outlined. */
function tail(pts, w, fill, ow = SW) {
  return P(curve(pts), "none", C.ink, w + ow * 2) + P(curve(pts), "none", fill, w);
}

/* ------------------------------------------------------------- Jaguar */
// Shoulder ~68 cm, head-and-body ~165 cm, tail ~60 cm. Rosettes are rings with a
// spot inside (checklist 21: that's what tells a jaguar from a leopard).
export function jaguar({ mark = false } = {}) {
  const fur = C.tawny, farFur = C.tawnyDark ?? C.tawny, ink = C.ink;
  let s = "";
  // far legs
  s += S([[104, -48], [118, -44], [117, -12], [123, -3], [122, 0], [104, 0], [104, -8], [100, -30]], C.tawnyDeep, ink, SW);
  s += S([[28, -50], [50, -44], [52, -28], [47, -16], [49, -4], [55, 0], [38, 0], [36, -10], [32, -20], [24, -32]], C.tawnyDeep, ink, SW);
  // tail
  s += tail([[6, -52], [-18, -44], [-38, -28], [-52, -18], [-62, -20], [-66, -28]], 8, fur);
  for (const [x, y] of [[-20, -43], [-36, -30], [-50, -20]]) s += Ci(x, y, 2.2, C.rosette, null);
  s += Ci(-64, -25, 3.2, C.rosette, null);
  // body
  s += S([[8, -58], [40, -63], [80, -61], [116, -68], [138, -70], [150, -58], [142, -36], [122, -30], [84, -27], [44, -32], [20, -38], [4, -48]], fur, ink, SW);
  // pale belly
  s += P(`M38 -33Q84 -24 124 -31Q100 -34 84 -32Q56 -31 38 -33Z`, C.tawnyLight, null);
  // near legs
  s += S([[116, -52], [132, -46], [131, -14], [138, -4], [137, 0], [120, 0], [119, -8], [115, -30]], fur, ink, SW);
  s += S([[14, -56], [40, -48], [42, -30], [34, -18], [36, -4], [42, 0], [26, 0], [24, -10], [20, -20], [10, -32]], fur, ink, SW);
  // rosettes: rings with a spot inside
  const ros = [[30, -50], [52, -54], [74, -52], [96, -55], [62, -40], [86, -42], [108, -50], [42, -40], [20, -46], [118, -60], [124, -40], [30, -26], [128, -22], [38, -12]];
  for (const [x, y] of ros) s += E(x, y, 4.2, 3.4, "none", C.rosette, 1.5) + Ci(x + .4, y + .2, 1.1, C.rosette, null);
  // head
  s += S([[136, -74], [146, -84], [160, -85], [171, -79], [179, -71], [185, -65], [183, -58], [175, -54], [161, -52], [147, -54], [137, -61]], fur, ink, SW);
  s += S([[143, -81], [147, -91], [155, -91], [158, -83]], fur, ink, SW) + S([[147, -84], [149, -88], [153, -88], [154, -84]], C.rosette, null, 0);
  s += P(`M170 -60Q178 -56 184 -60Q182 -54 172 -54Z`, C.tawnyLight, null);
  // eye (yellow-green), nose, mouth, whiskers
  s += E(166, -72, 3, 2, C.leafLight, ink, 1.1) + Ci(166.5, -72, 1, ink, null);
  if (mark) s += Ci(164.8, -72.3, 1, C.gold, C.goldDeep, .3);   // a fleck of gold in the yellow-green eye
  s += P(`M181 -66L186 -64L182 -61Z`, C.rosette, ink, .8);
  s += P(`M183 -59Q178 -57 173 -58`, "none", ink, 1.1);
  for (const [x, y] of [[150, -66], [156, -60], [146, -60], [158, -76]]) s += Ci(x, y, 1.3, C.rosette, null);
  s += L([[176, -60], [190, -62]], ink, .6) + L([[176, -59], [190, -57]], ink, .6);
  return s;
}

/* ------------------------------------------------------------- Coyote */
// Shoulder ~60 cm, body ~105 cm, bushy tail held low with a dark tip.
export function coyote({ notch = false } = {}) {
  const fur = C.coyote, deep = C.coyoteDeep, ink = C.ink;
  let s = "";
  s += S([[88, -46], [95, -44], [94, -6], [98, -1], [97, 0], [88, 0], [88, -6], [86, -30]], deep, ink, SW);
  s += S([[24, -50], [40, -46], [42, -30], [36, -18], [38, -4], [43, 0], [31, 0], [30, -10], [26, -22], [20, -34]], deep, ink, SW);
  // tail
  s += S([[14, -52], [-6, -44], [-22, -30], [-30, -12], [-24, -8], [-12, -20], [4, -36], [16, -44]], fur, ink, SW);
  s += S([[-24, -26], [-30, -12], [-24, -8], [-20, -16]], C.rosette, null);
  // body
  s += S([[12, -54], [44, -58], [74, -57], [94, -62], [104, -68], [112, -58], [106, -42], [94, -36], [70, -40], [46, -44], [26, -44], [12, -48]], fur, ink, SW);
  s += P(`M60 -41Q82 -36 98 -38Q104 -46 106 -50Q100 -40 84 -40Q70 -40 60 -41Z`, C.cream, null);
  // near legs
  s += S([[98, -46], [106, -42], [104, -6], [108, -1], [107, 0], [98, 0], [98, -6], [96, -30]], fur, ink, SW);
  s += S([[14, -52], [32, -48], [34, -30], [28, -18], [30, -4], [35, 0], [23, 0], [22, -10], [18, -22], [12, -34]], fur, ink, SW);
  // head and ears (two ears, the far one darker)
  s += S([[109, -73], [112, -87], [118, -75]], deep, ink, SW);
  s += S([[101, -66], [107, -74], [115, -76], [121, -72], [129, -66], [131, -63], [126, -60.5], [115, -60], [105, -60]], fur, ink, SW);
  s += notch
    ? S([[103, -71], [104, -86], [106.5, -82], [107.5, -85], [111, -74]], fur, ink, SW)
    : S([[103, -71], [104.5, -86], [111, -74]], fur, ink, SW);
  s += P(`M118 -61.5Q125 -60 130 -62.5Q127 -60 120 -60Z`, C.cream, null);
  s += E(115.5, -69, 2, 1.4, C.goldLight, ink, .9) + Ci(115.8, -69, .7, ink, null);
  s += P(`M129.5 -65L132.5 -63.6L130 -61.8Z`, C.rosette, ink, .7);
  return s;
}

/* ----------------------------------------------------------- Barn owl */
// Front view, perched: height ~34 cm. Heart-shaped white face, dark eyes, buff back.
// Two feet, each with four toes visible around the perch.
export function barnOwl({ rings = false } = {}) {
  const ink = C.ink;
  let s = "";
  // wings (behind body)
  s += S([[-10, -27], [-15, -15], [-12, -2], [-6, -3], [-7, -16]], C.owl, ink, 1.4);
  s += S([[10, -27], [15, -15], [12, -2], [6, -3], [7, -16]], C.owl, ink, 1.4);
  // body
  s += E(0, -15, 10, 14, C.cream, ink, 1.4);
  for (const [x, y] of [[-4, -16], [3, -12], [-2, -8], [5, -18], [0, -20], [-5, -10]]) s += Ci(x, y, .5, C.feather, null);
  // head
  s += S([[0, -41], [8, -39], [12, -33], [11, -26], [6, -22], [0, -21], [-6, -22], [-11, -26], [-12, -33], [-8, -39]], C.owl, ink, 1.4);
  // heart-shaped face
  s += S([[0, -36], [-4, -38.5], [-8.5, -37.5], [-10, -32], [-6, -25], [0, -22.5], [6, -25], [10, -32], [8.5, -37.5], [4, -38.5]], C.light, ink, 1);
  if (rings) { s += Ci(-4, -31, 3.2, "none", C.fog, 1.2) + Ci(4, -31, 3.2, "none", C.fog, 1.2); }
  s += E(-4, -31, 1.7, 2, C.ink, null) + E(4, -31, 1.7, 2, C.ink, null);
  s += Ci(-3.5, -31.6, .45, C.light, null) + Ci(4.5, -31.6, .45, C.light, null);
  s += P(`M-1 -29L1 -29L0 -26Z`, C.hippoLight, ink, .6);
  // feet: four toes each, gripping the perch top (y = 0)
  for (const fx of [-3.6, 3.6]) {
    s += E(fx, -1.6, 1.8, 1.4, C.cream, ink, .8);
    for (const dx of [-1.6, -.5, .6, 1.6]) s += P(`M${n(fx + dx)} -.8Q${n(fx + dx * 1.3)} .6 ${n(fx + dx * 1.2)} 1.6`, "none", ink, .6);
  }
  return s;
}

/** A barn owl in flight, seen from below-side (wings spread). Wingspan ~90 cm. */
export function owlFlying() {
  const ink = C.ink;
  let s = "";
  s += S([[0, -6], [-14, -18], [-34, -26], [-46, -24], [-42, -16], [-30, -8], [-14, -2]], C.owl, ink, 1.4);
  s += S([[0, -6], [14, -18], [34, -26], [46, -24], [42, -16], [30, -8], [14, -2]], C.owl, ink, 1.4);
  s += E(0, -4, 6, 9, C.cream, ink, 1.4);
  s += S([[0, -16], [5, -14], [5.5, -10], [0, -7.5], [-5.5, -10], [-5, -14]], C.light, ink, 1);
  s += Ci(-2, -11.5, 1, ink, null) + Ci(2, -11.5, 1, ink, null);
  s += S([[-3, 4], [0, 8], [3, 4]], C.owl, ink, 1);
  return s;
}

/* ---------------------------------------------------------- Brown rat */
// Body ~22 cm, tail ~20 cm, height ~8 cm. Two ears (the far one peeks), four feet.
export function rat({ patch = false } = {}) {
  const ink = C.ink, fur = C.brown;
  let s = "";
  s += tail([[1, -4], [-8, -2.2], [-16, -1.4], [-22, -2.4], [-26, -3.4]], 1, C.hippoLight, .35);
  s += E(17.2, -6.2, 1.6, 1.4, C.brownDark, ink, .6);           // far foot
  s += E(4.8, -1.2, 2.4, 1.2, C.brownDark, ink, .6);
  s += S([[0, -5], [4, -9.5], [11, -11], [17, -9.6], [22, -7], [26.4, -4.8], [24.6, -3], [19, -2.2], [9, -1.6], [2, -2.6]], fur, ink, .9);
  s += P(`M8 -2.2Q15 -1.4 22 -3Q18 -3.4 14 -3.2Q10 -3 8 -2.2Z`, C.cream, null);
  s += E(20.6, -9.8, 1.3, 1.5, C.hippoLight, ink, .6);           // far ear
  s += E(18.6, -10.2, 1.8, 2.0, C.hippoLight, ink, .7);          // near ear
  if (patch) s += E(19.8, -10.6, 1.6, 1.0, C.snow, null);
  s += Ci(22.4, -6.8, .8, ink, null) + Ci(22.6, -7, .25, C.light, null);
  s += Ci(26.2, -4.8, .6, C.hippoLight, ink, .4);
  s += E(8, -.8, 2.2, 1.1, fur, ink, .6) + E(19.4, -1.6, 1.8, 1.0, fur, ink, .6);
  s += L([[25, -4.6], [29, -5.4]], ink, .25) + L([[25, -4.2], [29, -3.6]], ink, .25);
  return s;
}

/* -------------------------------------------------------------- Bison */
// Shoulder ~180 cm (the hump), body ~300 cm. Shaggy dark front, two short horns.
export function bison({ scar = false } = {}) {
  const ink = C.ink, coat = C.brown, shag = C.brownDark;
  let s = "";
  s += S([[136, -82], [152, -80], [150, -10], [156, -2], [155, 0], [136, 0], [136, -10], [134, -50]], C.brownDeep, ink, SW);
  s += S([[34, -96], [62, -92], [60, -54], [56, -28], [58, -6], [62, 0], [44, 0], [42, -10], [40, -40], [32, -70]], C.brownDeep, ink, SW);
  s += tail([[4, -118], [-2, -98], [-4, -78]], 3, coat) + S([[-8, -82], [-2, -84], [0, -66], [-6, -62]], shag, ink, 1.6);
  // body: rear coat, then the shaggy hump and chest over it
  s += S([[2, -118], [40, -130], [90, -150], [124, -186], [146, -188], [166, -170], [176, -144], [170, -100], [160, -74], [120, -80], [80, -82], [40, -86], [12, -96]], coat, ink, SW);
  s += S([[96, -150], [124, -186], [146, -188], [166, -170], [176, -144], [172, -104], [162, -74], [140, -78], [122, -100], [104, -128]], shag, ink, SW);
  // near legs (front legs shaggy at the top)
  s += S([[150, -86], [168, -84], [166, -12], [172, -3], [171, 0], [150, 0], [150, -10], [148, -50]], coat, ink, SW);
  s += S([[148, -96], [170, -92], [168, -58], [152, -56]], shag, ink, SW);
  s += S([[14, -100], [46, -94], [46, -54], [40, -28], [42, -6], [46, 0], [28, 0], [26, -10], [24, -40], [12, -70]], coat, ink, SW);
  for (const x of [152, 160, 28, 36]) s += R0(x - 6, -4, 12, 4, C.coat);
  // head, carried low, with a beard
  s += S([[164, -154], [186, -150], [202, -134], [208, -108], [204, -86], [192, -78], [176, -86], [166, -112]], shag, ink, SW);
  s += S([[178, -86], [194, -80], [190, -58], [180, -64]], shag, ink, SW);
  // horns: two short curves, the far one higher and darker
  s += P(`M186 -150Q196 -164 190 -174Q186 -164 180 -156Z`, C.coat, ink, 1.6);
  s += P(`M174 -150Q178 -166 170 -176Q168 -164 166 -154Z`, C.oliveDark, ink, 1.4);
  s += E(194, -124, 2.6, 2, C.ink, null) + Ci(194.6, -124.6, .7, C.light, null);
  if (scar) s += P(`M188 -133L200 -127`, "none", C.hippoLight, 1.6);
  s += E(205, -100, 2, 3, C.coat, null);
  return s;
}
const R0 = (x, y, w, h, fill) => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="1.2" fill="${fill}" stroke="${C.ink}" stroke-width="1.2"/>`;

/* ---------------------------------------------------------- Alligator */
// ~350 cm long, ~35 cm high. Short splayed legs, ridged back, long snout.
export function alligator({ spots = false } = {}) {
  const ink = C.ink, hide = C.olive, deep = C.oliveDark;
  let s = "";
  s += S([[238, -16], [252, -22], [262, -10], [270, -2], [256, 0], [248, -8]], deep, ink, SW);
  s += S([[136, -16], [150, -22], [160, -10], [168, -2], [154, 0], [146, -8]], deep, ink, SW);
  s += S([[0, -4], [40, -12], [90, -24], [140, -32], [200, -36], [262, -30], [292, -28], [304, -26], [330, -16], [352, -11], [352, -7], [330, -5], [290, -8], [240, -8], [180, -8], [120, -8], [60, -6], [20, -2]], hide, ink, SW);
  s += P(`M120 -9Q200 -4 290 -9Q240 -12 180 -12Q140 -12 120 -9Z`, C.leafLight, null, 0, ` opacity=".7"`);
  for (let x = 60; x <= 270; x += 13) { const y = x < 140 ? -10 - (x - 40) * .22 : -34 + (x - 140) * .03; s += P(`M${n(x - 4)} ${n(y + 1)}L${n(x)} ${n(y - 5)}L${n(x + 4)} ${n(y + 1)}Z`, deep, ink, .9); }
  s += E(296, -29, 5, 3.6, hide, ink, 1.4) + E(297, -29.6, 2.2, 1.6, C.goldLight, ink, .7) + E(297.4, -29.6, .5, 1.4, ink, null);
  s += P(`M300 -16L350 -9`, "none", ink, 1.2);
  for (const x of [312, 322, 332, 342]) s += P(`M${x} -13.6L${x + 1.6} -10.4L${x + 3.2} -13`, C.light, ink, .5);
  s += Ci(350, -11, 1, ink, null);
  if (spots) for (const [x, y] of [[326, -16], [332, -17], [338, -15], [329, -13.5]]) s += Ci(x, y, 1.1, C.cream, null);
  s += S([[244, -14], [258, -20], [266, -8], [276, -1], [260, 1], [252, -6]], hide, ink, SW);
  s += S([[142, -14], [156, -20], [164, -8], [174, -1], [158, 1], [150, -6]], hide, ink, SW);
  return s;
}

/* -------------------------------------------------------------- Hound */
// The Hunt's breed: tall and lean like a deerhound. Shoulder ~76 cm, gilt collar.
export function hound() {
  const ink = C.ink, coat = C.grey, deep = C.greyDark;
  let s = "";
  s += S([[78, -46], [85, -44], [84, -6], [88, -1], [87, 0], [78, 0], [78, -6], [76, -28]], deep, ink, SW);
  s += S([[20, -58], [35, -55], [39, -42], [32, -24], [35, -4], [39, 0], [29, 0], [28, -6], [25, -24], [19, -42]], deep, ink, SW);
  s += tail([[11, -64], [-1, -50], [-8, -32], [-9, -20], [-5, -14]], 3.2, coat);
  s += S([[9, -66], [40, -70], [68, -72], [82, -76], [90, -84], [98, -80], [94, -60], [84, -40], [70, -44], [50, -55], [28, -58], [12, -60]], coat, ink, SW);
  s += P(`M60 -48Q72 -42 84 -42Q90 -52 92 -60Q86 -46 74 -46Q66 -46 60 -48Z`, C.fog, null);
  s += S([[86, -46], [93, -44], [92, -6], [96, -1], [95, 0], [86, 0], [86, -6], [84, -28]], coat, ink, SW);
  s += S([[9, -62], [26, -58], [30, -44], [22, -24], [25, -4], [30, 0], [19, 0], [18, -6], [15, -24], [8, -44]], coat, ink, SW);
  s += S([[90, -91], [99, -95], [108, -94], [118, -90], [125, -87], [123, -83.5], [112, -82.5], [99, -82.5], [92, -84]], coat, ink, SW);
  s += S([[96, -94], [100, -98], [105, -94], [101, -91]], deep, ink, 1.4);
  s += P(`M88 -84Q94 -78 100 -82L98 -76Q92 -74 87 -78Z`, C.gold, ink, 1.2);
  s += Ci(94, -76, 1.6, C.goldLight, ink, .8);
  s += E(109, -90.5, 1.7, 1.1, C.goldLight, ink, .8) + Ci(109.3, -90.5, .55, ink, null);
  s += Ci(124.4, -86.6, 1.2, ink, null);
  return s;
}
