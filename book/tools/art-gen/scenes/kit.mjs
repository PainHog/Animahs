// Second Nature art kit: smooth outlines, text, and the night-time scenery shared by
// every piece. Flat shapes with an inked outline (DESIGN D29). Colours only from C.
import { C, svg, n } from "./lib.mjs";
export { C, svg, n };

export const INK = C.ink;

/** Closed Catmull-Rom spline through points → a smooth path. */
export function smooth(p, t = 1) {
  const N = p.length;
  let d = `M${n(p[0][0])} ${n(p[0][1])}`;
  for (let i = 0; i < N; i++) {
    const p0 = p[(i - 1 + N) % N], p1 = p[i], p2 = p[(i + 1) % N], p3 = p[(i + 2) % N];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6 * t, p1[1] + (p2[1] - p0[1]) / 6 * t];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6 * t, p2[1] - (p3[1] - p1[1]) / 6 * t];
    d += `C${n(c1[0])} ${n(c1[1])} ${n(c2[0])} ${n(c2[1])} ${n(p2[0])} ${n(p2[1])}`;
  }
  return d + "Z";
}

/** Open Catmull-Rom spline through points (for tails, whiskers, paths). */
export function curve(p, t = 1) {
  const N = p.length;
  let d = `M${n(p[0][0])} ${n(p[0][1])}`;
  for (let i = 0; i < N - 1; i++) {
    const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(N - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6 * t, p1[1] + (p2[1] - p0[1]) / 6 * t];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6 * t, p2[1] - (p3[1] - p1[1]) / 6 * t];
    d += `C${n(c1[0])} ${n(c1[1])} ${n(c2[0])} ${n(c2[1])} ${n(p2[0])} ${n(p2[1])}`;
  }
  return d;
}

export const P = (d, fill = "none", stroke = INK, sw = 3, extra = "") =>
  `<path d="${d}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${n(sw)}" stroke-linejoin="round" stroke-linecap="round"` : ""}${extra}/>`;
export const S = (pts, fill, stroke = INK, sw = 3, extra = "") => P(smooth(pts), fill, stroke, sw, extra);
export const L = (pts, stroke = INK, sw = 3, extra = "") => P(curve(pts), "none", stroke, sw, extra);
export const E = (cx, cy, rx, ry, fill, stroke = INK, sw = 3, extra = "") =>
  `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${n(sw)}"` : ""}${extra}/>`;
export const Ci = (cx, cy, r, fill, stroke = INK, sw = 3, extra = "") => E(cx, cy, r, r, fill, stroke, sw, extra);
export const R = (x, y, w, h, fill, stroke = INK, sw = 3, rx = 0, extra = "") =>
  `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}"${rx ? ` rx="${n(rx)}"` : ""} fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${n(sw)}" stroke-linejoin="round"` : ""}${extra}/>`;
export const G = (tr, body, extra = "") => `<g transform="${tr}"${extra}>${body}</g>`;
/** Place a real-size drawing (1 unit = 1 cm, ground at y=0) at (x, y) with a scale; flip faces left. */
export const place = (x, y, s, body, flip = false) => G(`translate(${n(x)} ${n(y)}) scale(${n(flip ? -s : s)} ${n(s)})`, body);

/** Text in the book's fonts (checklist 19). */
export function T(x, y, text, size, fill = INK, o = {}) {
  const { anchor = "middle", weight = 700, family = "Alegreya Sans", italic = false, spacing = 0 } = o;
  return `<text x="${n(x)}" y="${n(y)}" text-anchor="${anchor}" font-family="${family}, sans-serif" font-weight="${weight}"${italic ? ` font-style="italic"` : ""} font-size="${n(size)}"${spacing ? ` letter-spacing="${spacing}"` : ""} fill="${fill}">${text}</text>`;
}

/** Seeded PRNG. */
export function rng(seed = 1) {
  let a = seed | 0;
  return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/* ---------------------------------------------------------------- scenery */

/** A night sky: gradient + stars. */
export function sky(id, w, h, o = {}) {
  const { top = C.deep, bottom = C.dusk, stars = 40, seed = 3, starTo = 0.7 } = o;
  const r = rng(seed);
  let s = `<defs><linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs>`;
  s += `<rect x="0" y="0" width="${w}" height="${h}" fill="url(#${id}-sky)"/>`;
  for (let i = 0; i < stars; i++) {
    const x = r() * w, y = r() * h * starTo, rr = 0.8 + r() * 1.6;
    s += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(rr)}" fill="${C.moon}" opacity="${n(0.5 + r() * 0.5)}"/>`;
  }
  return s;
}

/** A full moon with a soft glow. */
export function moon(id, x, y, r) {
  return `<defs><radialGradient id="${id}-glow"><stop offset="0" stop-color="${C.moonGlow}" stop-opacity=".55"/><stop offset="1" stop-color="${C.moonGlow}" stop-opacity="0"/></radialGradient></defs>` +
    Ci(x, y, r * 2.6, `url(#${id}-glow)`, null) + Ci(x, y, r, C.moon, null) +
    Ci(x - r * .3, y - r * .2, r * .18, C.moonGlow, null, 0, ` opacity=".6"`) + Ci(x + r * .25, y + r * .3, r * .12, C.moonGlow, null, 0, ` opacity=".6"`);
}

/** Rolling hill silhouette from x0 to x1 with tops given as [[x,y],...], filled down to `base`. */
export function hill(pts, base, fill, stroke = null, sw = 0) {
  const d = curve(pts) + `L${n(pts[pts.length - 1][0])} ${n(base)}L${n(pts[0][0])} ${n(base)}Z`;
  return P(d, fill, stroke, sw);
}

/** A conifer or round tree silhouette standing at (x, groundY). */
export function tree(x, gy, h, fill = C.leafDeep, kind = "round") {
  const trunk = R(x - h * .04, gy - h * .32, h * .08, h * .32 + 1, C.woodDark, null);
  if (kind === "pine") {
    return trunk + P(`M${n(x)} ${n(gy - h)}L${n(x + h * .26)} ${n(gy - h * .25)}L${n(x - h * .26)} ${n(gy - h * .25)}Z`, fill, INK, 2.2);
  }
  return trunk + S([[x, gy - h], [x + h * .3, gy - h * .82], [x + h * .36, gy - h * .5], [x + h * .2, gy - h * .3], [x - h * .2, gy - h * .3], [x - h * .36, gy - h * .52], [x - h * .28, gy - h * .84]], fill, INK, 2.2);
}

/** A swirl of the Wild: curling light ribbons and leaves around (cx, cy). */
export function wildSwirl(cx, cy, r, seed = 7) {
  const rr = rng(seed);
  let s = "";
  for (let k = 0; k < 3; k++) {
    const pts = [];
    const a0 = k * 2.1, turns = 1.4;
    for (let i = 0; i <= 14; i++) {
      const t = i / 14, a = a0 + t * turns * Math.PI * 2, rad = r * (0.25 + 0.75 * t);
      pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad * 0.8]);
    }
    s += L(pts, k === 1 ? C.moon : C.wild, 5 - k, ` opacity="${0.75 - k * 0.15}"`);
  }
  for (let i = 0; i < 11; i++) {
    const a = rr() * Math.PI * 2, rad = r * (0.3 + rr() * 0.8);
    s += leaf(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad * 0.8, 9 + rr() * 8, (a * 180 / Math.PI) + 90, i % 3 ? C.leafLight : C.leaf);
  }
  for (let i = 0; i < 14; i++) {
    const a = rr() * Math.PI * 2, rad = r * rr();
    s += Ci(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad * 0.8, 1.5 + rr() * 2.5, C.moon, null, 0, ` opacity=".85"`);
  }
  return s;
}

/** One leaf (an almond with a midrib), centred at (x, y), length l, rotated deg. */
export function leaf(x, y, l, deg = 0, fill = C.leaf) {
  const body = P(`M${n(-l / 2)} 0Q0 ${n(-l * .38)} ${n(l / 2)} 0Q0 ${n(l * .38)} ${n(-l / 2)} 0Z`, fill, INK, Math.max(1, l * .08)) +
    P(`M${n(-l / 2)} 0L${n(l * .42)} 0`, "none", INK, Math.max(.7, l * .05));
  return G(`translate(${n(x)} ${n(y)}) rotate(${n(deg)})`, body);
}

/** A circular medallion background for portraits (400×400 viewBox). */
export function medallion(id, fill = C.dusk, ring = C.gold) {
  return `<defs><clipPath id="${id}-clip"><circle cx="200" cy="200" r="186"/></clipPath>` +
    `<radialGradient id="${id}-bg" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="${C.soft}"/><stop offset="1" stop-color="${fill === C.dusk ? C.deep : fill}"/></radialGradient></defs>` +
    Ci(200, 200, 186, `url(#${id}-bg)`, null);
}
export const medallionRing = (ring = C.gold) => Ci(200, 200, 186, "none", ring, 8) + Ci(200, 200, 194, "none", INK, 3);
export const clip = (id, body) => `<g clip-path="url(#${id}-clip)">${body}</g>`;

/** A lit window. */
export const windowLit = (x, y, w, h, lit = true) => R(x, y, w, h, lit ? C.lamp : C.night2, INK, 2) + P(`M${n(x + w / 2)} ${n(y)}V${n(y + h)}M${n(x)} ${n(y + h / 2)}H${n(x + w)}`, "none", INK, 1.6);
