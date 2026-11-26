// @vitest-environment jsdom
import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
vi.mock('@/lib/motion', async (importOriginal) => ({ ...(await importOriginal<typeof import('@/lib/motion')>()), useGSAP: () => {} }));
import { FeaturedPieces } from '@/components/home/FeaturedPieces';
import { Reviews } from '@/components/home/Reviews';
import { VisitBand } from '@/components/home/VisitBand';
import { pickFeatured } from '@/lib/featured';
import { products } from '@/content/products';

beforeEach(() => {
  window.IntersectionObserver ??= class { observe() {} disconnect() {} unobserve() {} takeRecords() { return []; } root = null; rootMargin = ''; thresholds = []; } as unknown as typeof IntersectionObserver;
});
afterEach(cleanup);

describe('pickFeatured', () => {
  it('returns 6 featured pieces alternating Heirloom and Form', () => {
    const six = pickFeatured(products, 6);
    expect(six).toHaveLength(6);
    expect(six.every((p) => p.featured)).toBe(true);
    expect(six.map((p) => p.collection)).toEqual(['heirloom', 'form', 'heirloom', 'form', 'heirloom', 'form']);
  });
});

describe('FeaturedPieces', () => {
  it('renders 6 cards, each with a formatted price or "Price on request"', () => {
    render(<FeaturedPieces />);
    const cards = screen.getAllByTestId('featured-card');
    expect(cards).toHaveLength(6);
    for (const card of cards) {
      expect(within(card).getByText(/^(From ₹[\d,]+|Price on request)$/)).toBeInTheDocument();
      expect(within(card).getByRole('link')).toHaveAttribute('href', expect.stringMatching(/^\/products\/[a-z0-9-]+$/));
    }
    expect(screen.getAllByText('Price on request').length).toBeGreaterThan(0);
  });
});

describe('Reviews', () => {
  it('shows the visible "Sample reviews" note and each review once for screen readers', () => {
    render(<Reviews />);
    expect(screen.getByText(/Sample reviews/)).toBeVisible();
    // the marquee duplicate is aria-hidden, so accessible figures = number of reviews
    expect(screen.getAllByRole('figure')).toHaveLength(3);
  });
});

describe('VisitBand', () => {
  it('links to booking', () => {
    render(<VisitBand />);
    expect(screen.getByRole('link', { name: 'Book a showroom visit' })).toHaveAttribute('href', '/contact#book');
  });
});
