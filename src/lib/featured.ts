import type { Product } from '@/content/schema';

/** Featured pieces for the home rail: alternates Heirloom and Form so both collections show. */
export function pickFeatured(all: Product[], count = 6): Product[] {
  const f = all.filter((p) => p.featured);
  const h = f.filter((p) => p.collection === 'heirloom');
  const m = f.filter((p) => p.collection === 'form');
  const out: Product[] = [];
  for (let i = 0; out.length < count && (i < h.length || i < m.length); i++) {
    const a = h[i];
    const b = m[i];
    if (a) out.push(a);
    if (b && out.length < count) out.push(b);
  }
  return out;
}
