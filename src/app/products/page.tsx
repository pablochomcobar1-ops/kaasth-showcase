import type { Metadata } from 'next';
import { products } from '@/content/products';
import { FILTER_KEYS, filterProducts, parseFilters, type Filters } from '@/lib/catalogue';
import { CatalogueControls, type FacetCounts } from '@/components/catalogue/CatalogueControls';
import { EmptyState } from '@/components/catalogue/EmptyState';
import { ProductCard } from '@/components/catalogue/ProductCard';
import { FilmBanner } from '@/components/catalogue/FilmBanner';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Twenty-four pieces of heirloom and modern solid-wood furniture, each with its own Wood Passport.',
};

/** Facet counts: how many pieces each option would show, given the other active filters. */
function facetCounts(f: Filters): FacetCounts {
  const out = { collection: {}, category: {}, wood: {} } as FacetCounts;
  for (const k of FILTER_KEYS) {
    for (const p of filterProducts(products, { ...f, [k]: undefined })) out[k][p[k]] = (out[k][p[k]] ?? 0) + 1;
  }
  return out;
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const filters = parseFilters(await searchParams);
  const list = filterProducts(products, filters);
  return (
    <>
      <FilmBanner />
      <section aria-label="Catalogue" className="container-page pb-[clamp(80px,10vw,160px)]">
        <CatalogueControls filters={filters} counts={facetCounts(filters)} total={products.length}>
          <p aria-live="polite" className="mt-8 text-caption01 uppercase tracking-[0.16em] text-foreground-subtle">
            Showing {list.length} of {products.length} pieces
          </p>
          {list.length === 0 ? <EmptyState /> : (
            <ul className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {list.map((p, i) => (
                <li key={p.slug} data-testid="catalogue-card" className="card-in" style={{ '--i': i % 8 } as React.CSSProperties}>
                  <ProductCard product={p} sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" />
                </li>
              ))}
            </ul>
          )}
        </CatalogueControls>
      </section>
    </>
  );
}
