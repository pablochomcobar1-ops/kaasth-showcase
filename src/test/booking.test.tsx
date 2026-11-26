// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';

const deliverLead = vi.fn(async () => {});
vi.mock('@/lib/leads', () => ({ deliverLead: (...a: unknown[]) => deliverLead(...(a as [])) }));
vi.mock('@/lib/motion', async (importOriginal) => ({ ...(await importOriginal<typeof import('@/lib/motion')>()), useGSAP: () => {} }));

import { bookVisit } from '@/app/contact/actions';
import ContactPage from '@/app/contact/page';
import { visitDateBounds } from '@/lib/visit-date';

// "Now" = Wednesday 25 Nov 2026, 10:00 in India.
const NOW = new Date('2026-11-25T04:30:00Z');
const form = (o: Record<string, string>) => { const fd = new FormData(); for (const [k, v] of Object.entries(o)) fd.set(k, v); return fd; };
const valid = { name: 'Arjun Shah', phone: '+91 98765 43210', email: '', date: '2026-11-27', slot: '13:00', interest: 'heirloom', message: '', consent: 'on' };
const errs = async (o: Record<string, string>) => { const r = await bookVisit(null, form({ ...valid, ...o })); return r.ok ? {} : r.fieldErrors; };

beforeEach(() => { vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(NOW); deliverLead.mockClear(); });
afterEach(() => { vi.useRealTimers(); cleanup(); });

describe('bookVisit', () => {
  it('+91 phone and a valid Friday → ok, lead delivered with the normalised number', async () => {
    expect(await bookVisit(null, form(valid))).toEqual({ ok: true });
    expect(deliverLead).toHaveBeenCalledWith('booking', expect.objectContaining({ phone: '9876543210', visit: '2026-11-27 at 13:00' }));
  });
  it('yesterday → fieldErrors.date', async () => {
    expect((await errs({ date: '2026-11-24' })).date).toBe('Please pick a date from tomorrow.');
  });
  it('today → "Please pick a date from tomorrow"', async () => {
    expect((await errs({ date: '2026-11-25' })).date).toBe('Please pick a date from tomorrow.');
  });
  it('a Monday → "We\'re closed on Mondays"', async () => {
    expect((await errs({ date: '2026-11-30' })).date).toMatch(/^We're closed on Mondays/);
  });
  it('more than 60 days ahead → error', async () => {
    expect((await errs({ date: '2027-02-02' })).date).toMatch(/within the next 60 days/);
  });
  it('slot not in the list → error', async () => {
    expect((await errs({ slot: '12:00' })).slot).toBe('Please pick a time slot.');
  });
  it('honeypot filled → silent ok, nothing sent', async () => {
    expect(await bookVisit(null, form({ ...valid, company: 'x' }))).toEqual({ ok: true });
    expect(deliverLead).not.toHaveBeenCalled();
  });
});

describe('/contact', () => {
  it('date input is limited to tomorrow … +60 days, and a Monday is flagged as soon as it is picked', () => {
    render(<ContactPage />);
    const date = screen.getByLabelText('Visit date');
    expect(date).toHaveAttribute('min', '2026-11-26');
    expect(date).toHaveAttribute('max', visitDateBounds(NOW).max);
    fireEvent.change(date, { target: { value: '2026-11-30' } });
    expect(screen.getByText(/We're closed on Mondays/)).toBeInTheDocument();
    expect(date).toHaveAttribute('aria-invalid', 'true');
  });
  it('has the map, the booking anchor and a Get directions link', () => {
    render(<ContactPage />);
    expect(screen.getByRole('img', { name: /Map: Kaasth/ })).toBeInTheDocument();
    expect(document.getElementById('book')).not.toBeNull();
    expect(screen.getByRole('link', { name: 'Get directions' })).toHaveAttribute('target', '_blank');
  });
});
