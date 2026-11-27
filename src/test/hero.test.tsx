// @vitest-environment jsdom
import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// Unit tests check markup and behaviour; the GSAP scroll story is verified in a real browser.
vi.mock('@/lib/motion', async (importOriginal) => ({ ...(await importOriginal<typeof import('@/lib/motion')>()), useGSAP: () => {} }));
import { JharokhaHero } from '@/components/home/JharokhaHero';

const setReducedMotion = (reduce: boolean) => {
  window.matchMedia = ((query: string) => ({
    matches: reduce && query.includes('reduce'), media: query, onchange: null,
    addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
};

beforeEach(() => {
  // jsdom lacks these
  window.IntersectionObserver ??= class { observe() {} disconnect() {} unobserve() {} takeRecords() { return []; } root = null; rootMargin = ''; thresholds = []; } as unknown as typeof IntersectionObserver;
  window.ResizeObserver ??= class { observe() {} disconnect() {} unobserve() {} } as unknown as typeof ResizeObserver;
  HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as unknown as typeof HTMLCanvasElement.prototype.getContext;
});
afterEach(cleanup);

describe('JharokhaHero', () => {
  it('shows the headline and a booking call to action', () => {
    setReducedMotion(false);
    render(<JharokhaHero />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Made to be inherited.');
    expect(screen.getByRole('link', { name: 'Book a showroom visit' })).toHaveAttribute('href', '/contact#book');
  });

  it('gives both rooms real descriptions', () => {
    setReducedMotion(false);
    render(<JharokhaHero />);
    expect(screen.getByAltText(/carved day bed/i)).toBeInTheDocument();
    expect(screen.getByAltText(/modern solid-wood armchairs/i)).toBeInTheDocument();
  });

  it('with reduced motion, swaps rooms with a button instead of scroll', async () => {
    setReducedMotion(true);
    const user = userEvent.setup();
    const { container } = render(<JharokhaHero />);
    const btn = await screen.findByRole('button', { name: 'See the modern room' });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    await user.click(btn);
    expect(screen.getByRole('button', { name: 'See the heirloom room' })).toHaveAttribute('aria-pressed', 'true');
    expect(container.ownerDocument.querySelector('.pin-spacer')).toBeNull();
  });

  it('without reduced motion, shows no swap button', () => {
    setReducedMotion(false);
    render(<JharokhaHero />);
    expect(screen.queryByRole('button', { name: /see the modern room/i })).toBeNull();
  });
});
