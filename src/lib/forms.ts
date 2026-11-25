import { z } from 'zod';

export const VISIT_SLOTS = ['11:00', '13:00', '15:00', '17:00'] as const;
export const INTERESTS = ['heirloom', 'form', 'custom', 'restoration', 'not-sure'] as const;
const MAX_DAYS_AHEAD = 60;

export type ActionResult =
  | { ok: true }
  | { ok: false; fieldErrors: Record<string, string>; message?: string };

/** Indian mobile number → 10 digits, or null. Accepts +91, 0 prefix, spaces and dashes. */
export function normalisePhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

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

const name = z.string().trim().min(2, 'Please enter your name.').max(80, 'That name is too long.');
const phone = z.string().transform((value, ctx) => {
  const n = normalisePhone(value);
  if (!n) {
    ctx.addIssue({ code: 'custom', message: 'Please enter a 10-digit Indian mobile number.' });
    return z.NEVER;
  }
  return n;
});
const email = z.union([z.literal(''), z.email('Please enter a valid email or leave it empty.')]);
const message = z.string().trim().max(500, 'Please keep the message under 500 characters.').optional().default('');
const consent = z.literal('on', { error: 'Please agree so we can contact you.' });
/** Honeypot: real people never see or fill this field. */
const company = z.string().max(0).optional().default('');

export const bookingSchema = (now: Date = new Date()) =>
  z.object({
    name,
    phone,
    email,
    date: z.string().superRefine((value, ctx) => {
      const err = visitDateError(value, now);
      if (err) ctx.addIssue({ code: 'custom', message: err });
    }),
    slot: z.enum(VISIT_SLOTS, { error: 'Please pick a time slot.' }),
    interest: z.enum(INTERESTS).optional(),
    message,
    consent,
    company,
  });

export const enquirySchema = z.object({
  productSlug: z.string().regex(/^[a-z0-9-]+$/),
  name,
  phone,
  message,
  consent,
  company,
});

export type Booking = z.infer<ReturnType<typeof bookingSchema>>;
export type Enquiry = z.infer<typeof enquirySchema>;
