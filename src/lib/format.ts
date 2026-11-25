const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

/** ₹ with Indian digit grouping: 125000 → "₹1,25,000". */
export function formatINR(amount: number): string {
  return inr.format(amount);
}

/** Catalogue price line. `null` means the piece is priced on request (antiques). */
export function formatPrice(priceFrom: number | null): string {
  return priceFrom === null ? 'Price on request' : `From ${formatINR(priceFrom)}`;
}
