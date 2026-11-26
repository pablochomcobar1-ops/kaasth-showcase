// @vitest-environment jsdom
import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
vi.mock('@/lib/motion', async (importOriginal) => ({ ...(await importOriginal<typeof import('@/lib/motion')>()), useGSAP: () => {} }));
import ServicesRoute from '@/app/services/page';
import AboutRoute from '@/app/about/page';
import { siteConfig } from '@/content/site.config';
import { ringPath } from '@/lib/rings';

beforeEach(() => {
  window.IntersectionObserver ??= class { observe() {} disconnect() {} unobserve() {} takeRecords() { return []; } root = null; rootMargin = ''; thresholds = []; } as unknown as typeof IntersectionObserver;
});
afterEach(cleanup);

describe('/services', () => {
  it('arch menu links to each of the 4 services, and each has 3 steps', () => {
    render(<ServicesRoute />);
    const menu = screen.getByRole('navigation', { name: 'Services' });
    const links = within(menu).getAllByRole('link');
    expect(links.map((a) => a.getAttribute('href'))).toEqual(siteConfig.services.map((s) => `#${s.id}`));
    for (const s of siteConfig.services) {
      const section = document.getElementById(s.id)!;
      expect(within(section).getByRole('heading', { level: 2 })).toHaveTextContent(s.title);
      expect(within(section).getAllByRole('listitem')).toHaveLength(3);
    }
  });
});

describe('/about', () => {
  it('tells the story as an ordered list of every year', () => {
    render(<AboutRoute />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Three generations. One workshop.');
    for (const e of siteConfig.story) expect(screen.getByRole('heading', { level: 3, name: e.title })).toBeInTheDocument();
    expect(screen.getByText('1962', { selector: 'p' })).toBeInTheDocument();
  });
  it('ring paths are closed, deterministic and server-safe', () => {
    const a = ringPath(210, 214, 98, 2.3);
    expect(a).toBe(ringPath(210, 214, 98, 2.3));
    expect(a.startsWith('M')).toBe(true);
    expect(a.endsWith('Z')).toBe(true);
  });
});
