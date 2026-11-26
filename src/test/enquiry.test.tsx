// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

const deliverLead = vi.fn(async () => {});
vi.mock('@/lib/leads', () => ({ deliverLead: (...a: unknown[]) => deliverLead(...(a as [])) }));
const notFound = vi.fn(() => { throw new Error('NEXT_NOT_FOUND'); });
vi.mock('next/navigation', () => ({ notFound: () => notFound(), useRouter: () => ({ push: vi.fn() }), usePathname: () => '/products/x' }));

import { submitEnquiry } from '@/app/products/[slug]/actions';
import ProductPage, { generateStaticParams } from '@/app/products/[slug]/page';
import { products } from '@/content/products';

const form = (o: Record<string, string>) => { const fd = new FormData(); for (const [k, v] of Object.entries(o)) fd.set(k, v); return fd; };
const valid = { productSlug: 'walnut-lounge-chair', name: 'Meera Patel', phone: '+91 98765 43210', message: 'Is it available in teak?', consent: 'on' };

beforeEach(() => { deliverLead.mockClear(); notFound.mockClear(); });
afterEach(cleanup);

describe('submitEnquiry', () => {
  it('valid input → { ok: true } and the lead is handed to delivery', async () => {
    expect(await submitEnquiry(null, form(valid))).toEqual({ ok: true });
    expect(deliverLead).toHaveBeenCalledWith('enquiry', expect.objectContaining({ name: 'Meera Patel', phone: '9876543210' }));
  });
  it('missing consent → fieldErrors.consent, nothing sent', async () => {
    const { consent: _c, ...noConsent } = valid;
    const r = await submitEnquiry(null, form(noConsent));
    expect(r.ok).toBe(false);
    expect(!r.ok && r.fieldErrors.consent).toBeTruthy();
    expect(deliverLead).not.toHaveBeenCalled();
  });
  it('honeypot filled → silent { ok: true } and no send', async () => {
    expect(await submitEnquiry(null, form({ ...valid, company: 'Spam Bots Ltd' }))).toEqual({ ok: true });
    expect(deliverLead).not.toHaveBeenCalled();
  });
  it('unknown product slug is rejected', async () => {
    const r = await submitEnquiry(null, form({ ...valid, productSlug: 'not-a-real-piece' }));
    expect(r.ok).toBe(false);
  });
  it('delivery failure shows a friendly message instead of crashing', async () => {
    deliverLead.mockRejectedValueOnce(new Error('down'));
    const r = await submitEnquiry(null, form(valid));
    expect(!r.ok && r.message).toMatch(/call or WhatsApp/);
  });
});

describe('/products/[slug]', () => {
  it('pre-builds one page per product', () => {
    expect(generateStaticParams()).toHaveLength(products.length);
  });
  it('unknown slug → 404', async () => {
    await expect(ProductPage({ params: Promise.resolve({ slug: 'nope' }) })).rejects.toThrow('NEXT_NOT_FOUND');
  });
  it('shows the piece, its price, passport and an enquiry button', async () => {
    render(await ProductPage({ params: Promise.resolve({ slug: 'sheesham-divan' }) }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sheesham Divan');
    expect(screen.getByRole('heading', { level: 1 }).parentElement).toHaveTextContent('Price on request');
    expect(screen.getByRole('article', { name: 'Wood Passport for Sheesham Divan' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enquire about this piece' })).toBeInTheDocument();
    expect(screen.getByText('Provenance')).toBeInTheDocument();
  });
});
