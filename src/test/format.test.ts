import { describe, expect, it } from 'vitest';
import { formatINR, formatPrice } from '@/lib/format';

describe('formatINR', () => {
  it('uses Indian digit grouping', () => {
    expect(formatINR(48000)).toBe('₹48,000');
    expect(formatINR(125000)).toBe('₹1,25,000');
  });
  it('shows "Price on request" when there is no price', () => {
    expect(formatPrice(null)).toBe('Price on request');
    expect(formatPrice(48000)).toBe('From ₹48,000');
  });
});
