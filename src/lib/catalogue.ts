import { CATEGORIES, COLLECTIONS, WOODS, type Category, type Collection, type Wood } from '@/content/enums';
import type { Product } from '@/content/schema';

export type Filters = { collection?: Collection; category?: Category; wood?: Wood };
export const FILTER_KEYS = ['collection', 'category', 'wood'] as const;
export type FilterKey = (typeof FILTER_KEYS)[number];

const pick = <T extends string>(allowed: readonly T[], v: unknown): T | undefined => {
  const s = Array.isArray(v) ? v[0] : v;
  return typeof s === 'string' && (allowed as readonly string[]).includes(s) ? (s as T) : undefined;
};

/** Reads filters from URL search params; unknown values are ignored, never trusted. */
export function parseFilters(sp: Record<string, string | string[] | undefined>): Filters {
  return {
    collection: pick(COLLECTIONS, sp.collection),
    category: pick(CATEGORIES, sp.category),
    wood: pick(WOODS, sp.wood),
  };
}

/** Every set filter must match (AND). */
export function filterProducts(all: Product[], f: Filters): Product[] {
  return all.filter((p) =>
    (!f.collection || p.collection === f.collection) && (!f.category || p.category === f.category) && (!f.wood || p.wood === f.wood));
}

/** `?collection=…&category=…` (stable key order), or '' when nothing is set. */
export function filtersToQuery(f: Filters): string {
  const q = new URLSearchParams();
  for (const k of FILTER_KEYS) { const v = f[k]; if (v) q.set(k, v); }
  const s = q.toString();
  return s ? `?${s}` : '';
}

/** Clicking an active filter clears it; clicking another value replaces it. */
export function toggleFilter(f: Filters, key: FilterKey, value: string): Filters {
  return { ...f, [key]: f[key] === value ? undefined : value } as Filters;
}

export const hasFilters = (f: Filters) => FILTER_KEYS.some((k) => f[k]);
