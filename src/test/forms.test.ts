import { describe, expect, it } from 'vitest';
import { bookingSchema, enquirySchema, normalisePhone, visitDateError } from '@/lib/forms';

describe('normalisePhone', () => {
  it('accepts common Indian formats', () => {
    expect(normalisePhone('+91 98765 43210')).toBe('9876543210');
    expect(normalisePhone('098765-43210')).toBe('9876543210');
    expect(normalisePhone('9876543210')).toBe('9876543210');
  });
  it('rejects short or invalid numbers', () => {
    expect(normalisePhone('12345')).toBeNull();
    expect(normalisePhone('5876543210')).toBeNull();
    expect(normalisePhone('987654321')).toBeNull();
  });
});

// Wednesday 25 Nov 2026, 12:00 in India
const now = new Date('2026-11-25T06:30:00Z');

describe('visitDateError', () => {
  it('rejects past dates and today', () => {
    expect(visitDateError('2026-11-24', now)).toBe('Please pick a date from tomorrow.');
    expect(visitDateError('2026-11-25', now)).toBe('Please pick a date from tomorrow.');
  });
  it('rejects Mondays', () => {
    expect(visitDateError('2026-11-30', now)).toBe("We're closed on Mondays. Please pick another day.");
  });
  it('rejects dates more than 60 days ahead', () => {
    expect(visitDateError('2027-01-26', now)).toBe('Please pick a date within the next 60 days.');
  });
  it('accepts tomorrow', () => {
    expect(visitDateError('2026-11-26', now)).toBeNull();
  });
  it('rejects nonsense', () => {
    expect(visitDateError('26/11/2026', now)).toBe('Please pick a valid date.');
  });
});

const validBooking = {
  name: 'Riya Shah', phone: '+91 98765 43210', email: '', date: '2026-11-27',
  slot: '13:00', interest: 'heirloom', message: '', consent: 'on', company: '',
};

describe('bookingSchema', () => {
  it('accepts a valid booking and normalises the phone', () => {
    const r = bookingSchema(now).safeParse(validBooking);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.phone).toBe('9876543210');
  });
  it('rejects an unknown time slot', () => {
    const r = bookingSchema(now).safeParse({ ...validBooking, slot: '09:00' });
    expect(r.success).toBe(false);
  });
  it('requires consent', () => {
    const r = bookingSchema(now).safeParse({ ...validBooking, consent: undefined });
    expect(r.success).toBe(false);
  });
});

describe('enquirySchema', () => {
  it('caps the message length at 500', () => {
    const r = enquirySchema.safeParse({ productSlug: 'sheesham-divan', name: 'Riya', phone: '9876543210', message: 'x'.repeat(501), consent: 'on', company: '' });
    expect(r.success).toBe(false);
  });
});
