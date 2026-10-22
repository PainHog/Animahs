/** Small statistics helpers for the simulator reports. */

export function median(xs) {
  if (!xs.length) return 0;
  const a = [...xs].sort((x, y) => x - y);
  const m = a.length >> 1;
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

export const pct = (x, d = 1) => `${(100 * x).toFixed(d)}%`;
export const num = (x, d = 2) => x.toFixed(d);
export const pts = x => `${x >= 0 ? "+" : "−"}${Math.abs(100 * x).toFixed(1)}`;
