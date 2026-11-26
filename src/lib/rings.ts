/**
 * Organic tree-ring outline: a closed SVG path around (cx, cy) whose radius wobbles slightly,
 * so rings look grown, not drawn with a compass. Deterministic for a given seed (SSR-safe).
 */
export function ringPath(cx: number, cy: number, r: number, seed: number, points = 72): string {
  const pts: string[] = [];
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * Math.PI * 2;
    const k = 1 + 0.045 * Math.sin(3 * t + seed) + 0.025 * Math.sin(7 * t + seed * 1.7) + 0.012 * Math.sin(13 * t + seed * 2.3);
    const x = cx + r * k * Math.cos(t);
    const y = cy + r * 0.92 * k * Math.sin(t);
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return `${pts.join('')}Z`;
}
