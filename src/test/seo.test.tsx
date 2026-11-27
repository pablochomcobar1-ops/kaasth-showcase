// @vitest-environment jsdom
import { describe, expect, it, afterEach, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import sitemap, { PAGES } from '@/app/sitemap';
import robots from '@/app/robots';
import NotFound from '@/app/not-found';
import PrivacyPage from '@/app/privacy/page';
import { products } from '@/content/products';

afterEach(() => { cleanup(); vi.unstubAllEnvs(); vi.resetModules(); });

describe('sitemap', () => {
  it('lists every page and all 24 product URLs', () => {
    const urls = sitemap().map((e) => new URL(e.url).pathname);
    for (const p of PAGES) expect(urls).toContain(p === '' ? '/' : p);
    expect(products).toHaveLength(24);
    for (const p of products) expect(urls).toContain(`/products/${p.slug}`);
    expect(urls).toHaveLength(PAGES.length + 24);
  });
});

describe('robots', () => {
  it('demo mode: everything disallowed, no sitemap advertised', () => {
    const r = robots();
    expect(r.rules).toEqual({ userAgent: '*', disallow: '/' });
    expect(r.sitemap).toBeUndefined();
  });
  it('live mode: allowed, with the sitemap', async () => {
    vi.stubEnv('SITE_MODE', 'live');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://kaasth.example');
    const live = (await import('@/app/robots')).default();
    expect(live.rules).toEqual({ userAgent: '*', allow: '/' });
    expect(live.sitemap).toBe('https://kaasth.example/sitemap.xml');
  });
});

describe('pages', () => {
  it('404 says "Yeh kamra khaali hai." and links home and to products', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Yeh kamra khaali hai.');
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Browse all pieces' })).toHaveAttribute('href', '/products');
  });
  it('privacy page tells demo visitors nothing is stored', () => {
    render(<PrivacyPage />);
    expect(screen.getByRole('note')).toHaveTextContent('nothing is sent, saved or shared');
  });
});
