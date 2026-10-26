// Head-and-shoulders portraits, front view, for 400×400 medallions. Hands are never
// in frame (checklist 9 asks for five fingers, so portraits stop at the chest).
// "Left" and "right" are the CHARACTER's: their left is the viewer's right.
import { C, S, L, P, E, Ci, R, G, n } from "./kit.mjs";

const INK = C.ink;

/** Shoulders and shirt. */
function torso(shirt, collar = null) {
  let s = S([[40, 400], [62, 338], [110, 306], [162, 292], [200, 300], [238, 292], [290, 306], [338, 338], [360, 400]], shirt, INK, 4);
  if (collar) s += P(`M162 296Q200 352 238 296L226 292Q200 330 174 292Z`, collar, INK, 3);
  return s;
}
const neck = skin => R(172, 248, 56, 64, skin, INK, 4, 18) + P(`M176 270Q200 286 224 270`, "none", INK, 2, ` opacity=".35"`);
function ears(skin, notchLeft = false) {
  let s = E(129, 214, 13, 22, skin, INK, 4);
  // the character's left ear is on the viewer's right
  s += notchLeft
    ? P(`M271 192Q286 192 285 214Q284 236 271 236Q276 222 279 214L272 210Z`, skin, INK, 4)
    : E(271, 214, 13, 22, skin, INK, 4);
  return s;
}
const head = skin => E(200, 206, 70, 84, skin, INK, 4);
function eyes(o = {}) {
  const { iris = C.brownDark, flecLeft = false } = o;
  let s = "";
  for (const x of [172, 228]) {
    s += E(x, 210, 13, 9, C.light, INK, 3) + Ci(x, 210, 6.5, iris, null) + Ci(x, 210, 3, INK, null) + Ci(x + 2.4, 207.6, 1.6, C.light, null);
  }
  if (flecLeft) s += Ci(231, 213, 2, C.gold, null);   // the character's left eye
  return s;
}
function brows(color, scarRight = false) {
  let s = P(`M156 190Q172 182 188 188`, "none", color, 6) + P(`M212 188Q228 182 244 190`, "none", color, 6);
  if (scarRight) s += P(`M168 180L178 197`, "none", C.skin1, 3.4) + P(`M168 180L178 197`, "none", C.hippoLight, 1.6);   // the character's right brow
  return s;
}
const nose = () => P(`M198 220Q194 240 202 244`, "none", INK, 3);
const mouth = (open = false) => open
  ? P(`M180 262Q200 280 220 262Q200 268 180 262Z`, C.light, INK, 3)
  : P(`M182 262Q200 276 218 262`, "none", INK, 3.4);
const freckles = () => [[184, 232], [190, 238], [178, 240], [210, 234], [216, 240], [222, 232], [196, 230], [204, 228]].map(([x, y]) => Ci(x, y, 1.8, C.brown, null, 0, ` opacity=".75"`)).join("");

/* ---------------------------------------------------------- the six Bonded */

export function maya() {      // jaguar; Mark: a fleck of gold in her left eye
  const skin = C.skin2, hair = C.hair1;
  let s = S([[124, 196], [140, 120], [200, 104], [262, 122], [278, 198], [286, 300], [250, 320], [260, 230], [140, 230], [150, 320], [114, 300]], hair, INK, 4);
  s += torso(C.shirt2) + neck(skin) + ears(skin) + head(skin);
  s += S([[130, 196], [144, 128], [200, 114], [258, 130], [270, 196], [244, 158], [200, 146], [158, 160]], hair, INK, 4);
  s += eyes({ flecLeft: true }) + brows(C.hair1) + nose() + mouth();
  return s;
}

export function theo() {      // coyote; Mark: a notch in his left ear
  const skin = C.skin1, hair = C.hair4;
  let s = torso(C.shirt4, C.light) + neck(skin) + ears(skin, true) + head(skin);
  s += S([[132, 190], [136, 140], [170, 116], [214, 112], [254, 130], [268, 186], [252, 162], [210, 150], [168, 156], [146, 170]], hair, INK, 4);
  s += eyes({ iris: C.hair1 }) + brows(C.hair4) + nose() + mouth(true);
  s += T7(200, 372, "7");
  return s;
}
const T7 = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Alegreya Sans, sans-serif" font-weight="800" font-size="40" fill="${C.light}" stroke="${INK}" stroke-width="1.5">${t}</text>`;

export function priya() {     // barn owl; Mark: round glasses
  const skin = C.skin3, hair = C.hair1;
  let s = S([[126, 200], [138, 124], [200, 106], [262, 124], [274, 200], [266, 262], [236, 240], [164, 240], [134, 262]], hair, INK, 4);
  s += torso(C.shirt5) + neck(skin) + ears(skin) + head(skin);
  // the braid, over her right shoulder (viewer's left)
  s += S([[136, 250], [150, 262], [142, 300], [150, 336], [140, 366], [124, 360], [130, 330], [122, 296], [128, 262]], hair, INK, 4);
  for (const y of [282, 312, 342]) s += P(`M126 ${y}Q138 ${y + 8} 148 ${y - 2}`, "none", C.hair2, 2.4);
  s += S([[132, 194], [146, 128], [200, 116], [254, 128], [268, 194], [232, 150], [168, 150]], hair, INK, 4);
  s += eyes() + brows(C.hair1) + nose() + mouth();
  s += Ci(172, 210, 22, "none", C.goldDeep, 5) + Ci(228, 210, 22, "none", C.goldDeep, 5) + P(`M194 208Q200 202 206 208`, "none", C.goldDeep, 4);
  return s;
}

export function sam() {       // brown rat; Mark: a white streak in his fringe
  const skin = C.skin1, hair = C.hair3;
  let s = torso(C.shirt1) + neck(skin) + ears(skin) + head(skin);
  s += S([[130, 196], [128, 140], [160, 112], [206, 104], [250, 116], [274, 152], [270, 196], [256, 168], [236, 150], [212, 170], [196, 150], [176, 172], [160, 150], [146, 176]], hair, INK, 4);
  s += S([[196, 150], [204, 108], [222, 110], [212, 170]], C.snow, INK, 2.4);
  s += eyes({ iris: C.shirt4 }) + brows(C.hair2) + nose() + mouth(true);
  return s;
}

export function jonah() {     // bison; Mark: a scar through his right eyebrow
  const skin = C.skin4, hair = C.hair4;
  let s = torso(C.brick) + neck(skin) + ears(skin) + head(skin);
  s += S([[134, 180], [140, 136], [178, 116], [222, 116], [260, 136], [266, 180], [248, 156], [200, 146], [152, 156]], hair, INK, 4);
  s += eyes({ iris: C.hair1 }) + brows(C.hair4, true) + nose() + mouth();
  return s;
}

export function lucia() {     // alligator; Mark: freckles across her nose
  const skin = C.skin2, hair = C.hair2;
  let s = S([[120, 210], [126, 132], [200, 104], [274, 132], [280, 210], [292, 290], [262, 300], [266, 240], [134, 240], [138, 300], [108, 290]], hair, INK, 4);
  s += torso(C.shirt3) + neck(skin) + ears(skin) + head(skin);
  s += S([[128, 200], [138, 136], [200, 112], [262, 136], [272, 200], [252, 170], [222, 150], [196, 166], [170, 150], [146, 172]], hair, INK, 4);
  s += eyes() + brows(C.hair2) + nose() + mouth(true) + freckles();
  return s;
}

/* ---------------------------------------------------------- the Hunt's people */

export function beater() {    // flat cap, heavy coat, stubble
  const skin = C.skin1;
  let s = torso(C.coat) + P(`M150 300Q200 340 250 300L262 316Q200 360 138 316Z`, C.alarm, INK, 3);
  s += neck(skin) + ears(skin) + head(skin);
  s += S([[124, 172], [140, 124], [200, 110], [262, 124], [284, 160], [300, 172], [280, 180], [200, 166], [122, 182]], C.wood, INK, 4);
  s += eyes({ iris: C.greyDark }) + P(`M156 192Q172 188 188 192M212 192Q228 188 244 192`, "none", C.hair2, 6) + nose() + P(`M182 264Q200 260 218 264`, "none", INK, 3.4);
  for (let i = 0; i < 40; i++) { const a = i * 2.4, x = 200 + Math.cos(a) * (30 + (i % 5) * 7), y = 262 + Math.abs(Math.sin(a)) * 22; s += Ci(x, y, 1.1, C.greyDark, null); }
  return s;
}

export function trapper() {   // bucket hat, waxed jacket, a net over one shoulder
  const skin = C.skin2;
  let s = torso(C.oliveDark) + P(`M170 296L200 340L230 296`, "none", C.olive, 5);
  // the net hangs over the character's left shoulder (viewer's right)
  s += P(`M238 296Q300 290 340 360L330 400L250 400Q258 340 238 296Z`, "none", C.cream, 0);
  for (let k = 0; k < 6; k++) s += P(`M${246 + k * 14} 300Q${276 + k * 10} 340 ${262 + k * 12} 400`, "none", C.cream, 2.2) + P(`M240 ${310 + k * 16}Q290 ${304 + k * 16} 344 ${340 + k * 12}`, "none", C.cream, 2.2);
  s += neck(skin) + ears(skin) + head(skin);
  s += P(`M120 176Q130 120 200 112Q270 120 280 176Q300 178 310 190L90 190Q100 178 120 176Z`, C.olive, INK, 4);
  s += eyes({ iris: C.leafDeep }) + brows(C.hair2) + nose() + mouth();
  return s;
}

export function huntsman() {  // tweed, a tie, a gold Trophy brooch; slicked silver hair
  const skin = C.skin1;
  let s = torso(C.brownDark);
  for (let i = 0; i < 12; i++) s += P(`M${70 + i * 26} 400L${90 + i * 22} 320`, "none", C.brown, 2, ` opacity=".6"`);
  s += P(`M176 294L200 330L224 294L216 290L200 314L184 290Z`, C.light, INK, 2.4) + P(`M194 316L206 316L210 400L190 400Z`, C.crimson, INK, 2.6);
  // the Trophy on his left lapel (viewer's right): a gold brooch shaped like a hawk's eye
  s += E(262, 352, 18, 12, C.gold, INK, 3) + Ci(262, 352, 6, C.goldDeep, INK, 1.6) + Ci(262, 352, 2.4, INK, null);
  s += neck(skin) + ears(skin) + head(skin);
  s += S([[132, 176], [140, 128], [196, 108], [256, 120], [270, 170], [244, 146], [188, 140], [150, 154]], C.fog, INK, 4);
  s += eyes({ iris: C.greyDark }) + P(`M156 192L188 186M212 186L244 192`, "none", C.greyDark, 5) + nose() + P(`M180 260Q200 270 222 258`, "none", INK, 3.4);
  return s;
}
