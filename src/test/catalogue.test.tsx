// @vitest-environment jsdom
import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }), usePathname: () => '/products' }));
vi.mock('@/lib/motion', async (importOriginal) => ({ ...(await importOriginal<typeof import('@/lib/motion')>()), useGSAP: () => {} }));

import ProductsPage from '@/app/products/page';
import { filterProducts, filtersToQuery, parseFilters, toggleFilter } from '@/lib/catalogue';
import { products } from '@/content/products';

beforeEach(() => {
  push.mockClear();
  window.IntersectionObserver ??= class { observe() {} disconnect() {} unobserve() {} takeRecords() { return []; } root = null; rootMargin = ''; thresholds = []; } as unknown as typeof IntersectionObserver;
});
afterEach(cleanup);

const renderPage = async (sp: Record<string, string>) => render(await ProductsPage({ searchParams: Promise.resolve(sp) }));

describe('catalogue filters (logic)', () => {
  it('ignores unknown values instead of trusting the URL', () => {
    expect(parseFilters({ collection: 'heirloom', wood: '<script>', category: ['seating', 'x'] })).toEqual({ collection: 'heirloom', category: 'seating', wood: undefined });
  });
  it('toggles a value on, replaces it, and clears it when clicked again', () => {
    const a = toggleFilter({}, 'wood', 'teak');
    expect(a.wood).toBe('teak');
    expect(toggleFilter(a, 'wood', 'oak').wood).toBe('oak');
    expect(toggleFilter(a, 'wood', 'teak').wood).toBeUndefined();
    expect(filtersToQuery({ wood: 'teak', collection: 'form' })).toBe('?collection=form&wood=teak');
    expect(filtersToQuery({})).toBe('');
  });
});

describe('/products page', () => {
  it('?collection=heirloom shows only heirloom pieces', async () => {
    await renderPage({ collection: 'heirloom' });
    const cards = screen.getAllByTestId('catalogue-card');
    expect(cards).toHaveLength(products.filter((p) => p.collection === 'heirloom').length);
    for (const c of cards) expect(c).toHaveTextContent('Heirloom');
    expect(screen.getByRole('button', { name: /Heirloom/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('?category=seating&wood=teak combines both filters', async () => {
    const expected = filterProducts(products, { category: 'seating', wood: 'teak' });
    expect(expected.length).toBeGreaterThan(0);
    await renderPage({ category: 'seating', wood: 'teak' });
    expect(screen.getAllByTestId('catalogue-card')).toHaveLength(expected.length);
    expect(screen.getByText(`Showing ${expected.length} of ${products.length} pieces`)).toBeInTheDocument();
  });

  it('no match shows the empty state, and "Clear filters" resets the URL', async () => {
    const noMatch = (['heirloom', 'form'] as const).flatMap((c) => (['oak', 'walnut', 'teak', 'sheesham', 'mango', 'rosewood'] as const).map((w) => ({ c, w })))
      .find(({ c, w }) => filterProducts(products, { collection: c, wood: w }).length === 0);
    expect(noMatch).toBeDefined();
    await renderPage({ collection: noMatch!.c, wood: noMatch!.w });
    expect(screen.queryAllByTestId('catalogue-card')).toHaveLength(0);
    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(push).toHaveBeenCalledWith('/products', { scroll: false });
  });

  it('filters are buttons with aria-pressed that write the choice to the URL', async () => {
    await renderPage({});
    const teak = screen.getByRole('button', { name: /^Teak/ });
    expect(teak).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: /All pieces/ })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(teak);
    expect(push).toHaveBeenCalledWith('/products?wood=teak', { scroll: false });
  });
});
