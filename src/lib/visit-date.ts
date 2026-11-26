/** Showroom visit date rules, shared by the server action and the browser (no dependencies). */
export const MAX_DAYS_AHEAD = 60;

/** Today's date in India as YYYY-MM-DD. */
function todayInIndia(now: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(now);
}

/** Returns an error message for a showroom visit date, or null if the date is fine. */
export function visitDateError(iso: string, now: Date = new Date()): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso) || Number.isNaN(Date.parse(`${iso}T00:00:00Z`))) {
    return 'Please pick a valid date.';
  }
  const day = Date.parse(`${iso}T00:00:00Z`);
  const today = Date.parse(`${todayInIndia(now)}T00:00:00Z`);
  const diffDays = Math.round((day - today) / 86_400_000);
  if (diffDays < 1) return 'Please pick a date from tomorrow.';
  if (diffDays > MAX_DAYS_AHEAD) return `Please pick a date within the next ${MAX_DAYS_AHEAD} days.`;
  if (new Date(day).getUTCDay() === 1) return "We're closed on Mondays. Please pick another day.";
  return null;
}

/** Earliest/latest bookable dates (YYYY-MM-DD, India time) for the date input's min/max. */
export function visitDateBounds(now: Date = new Date()): { min: string; max: string } {
  const today = Date.parse(`${todayInIndia(now)}T00:00:00Z`);
  const iso = (d: number) => new Date(d).toISOString().slice(0, 10);
  return { min: iso(today + 86_400_000), max: iso(today + MAX_DAYS_AHEAD * 86_400_000) };
}

