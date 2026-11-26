'use client';

import { useTransition, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { COLLECTIONS, CATEGORIES, WOODS } from '@/content/schema';
import { CATEGORY_LABEL, WOOD_LABEL } from '@/content/labels';
import { filtersToQuery, hasFilters, toggleFilter, type FilterKey, type Filters } from '@/lib/catalogue';

export type FacetCounts = Record<FilterKey, Record<string, number>>;

const COLLECTION_LABEL = { heirloom: { en: 'Heirloom', deva: 'विरासत' }, form: { en: 'Form', deva: 'रूप' } } as const;

/**
 * Filter buttons (aria-pressed toggles) that write to the URL, so every filtered view
 * is shareable. The grid below (children) dims while the new results load.
 */
export function CatalogueControls({ filters, counts, total, children }: { filters: Filters; counts: FacetCounts; total: number; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, start] = useTransition();
  const go = (f: Filters) => start(() => router.push(`${pathname}${filtersToQuery(f)}`, { scroll: false }));

  const Chip = ({ k, v, children: label }: { k: FilterKey; v: string; children: ReactNode }) => {
    const on = filters[k] === v;
    const n = counts[k][v] ?? 0;
    return (
      <button type="button" aria-pressed={on} disabled={!on && n === 0} onClick={() => go(toggleFilter(filters, k, v))} className="chip">
        {label} <span className="chip-count">{n}</span>
      </button>
    );
  };

  const groups: { k: FilterKey; label: string; items: { v: string; node: ReactNode }[] }[] = [
    { k: 'collection', label: 'Collection', items: COLLECTIONS.map((v) => ({ v, node: <>{COLLECTION_LABEL[v].en} <span lang="hi" className="font-deva">{COLLECTION_LABEL[v].deva}</span></> })) },
    { k: 'category', label: 'Room', items: CATEGORIES.map((v) => ({ v, node: CATEGORY_LABEL[v] })) },
    { k: 'wood', label: 'Wood', items: WOODS.map((v) => ({ v, node: WOOD_LABEL[v].en })) },
  ];

  return (
    <>
      <div className="border-y border-border-subtle py-5">
        <div className="flex flex-col gap-3">
          <button type="button" aria-pressed={!hasFilters(filters)} onClick={() => go({})} className="chip self-start">All pieces <span className="chip-count">{total}</span></button>
          {groups.map((g) => (
            <div key={g.k} role="group" aria-label={g.label} className="chip-row">
              <span aria-hidden="true" className="chip-label">{g.label}</span>
              {g.items.map((it) => <Chip key={it.v} k={g.k} v={it.v}>{it.node}</Chip>)}
            </div>
          ))}
        </div>
      </div>
      <div aria-busy={pending} className={`transition-opacity duration-[var(--duration-ui)] ${pending ? 'opacity-40' : ''}`}>{children}</div>
    </>
  );
}
