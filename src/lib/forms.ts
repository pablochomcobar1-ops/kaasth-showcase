import { z } from 'zod';
import { visitDateError } from './visit-date';

export { visitDateError, visitDateBounds, MAX_DAYS_AHEAD } from './visit-date';

export const VISIT_SLOTS = ['11:00', '13:00', '15:00', '17:00'] as const;
export const INTERESTS = ['heirloom', 'form', 'custom', 'restoration', 'not-sure'] as const;

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

/** First error message per field, from a failed Zod parse. */
export function fieldErrorsFrom(issues: readonly { path: readonly PropertyKey[]; message: string }[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of issues) out[String(issue.path[0] ?? 'form')] ??= issue.message;
  return out;
}

/** Control characters (except tab/newline in messages) have no place in a name or note, and can break email headers. */
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const NAME_CONTROL = /[\u0000-\u001F\u007F]/;
const name = z.string().trim().min(2, 'Please enter your name.').max(80, 'That name is too long.')
  .refine((v) => !NAME_CONTROL.test(v), 'Please use letters only in your name.');
const phone = z.string().max(24, 'Please enter a 10-digit Indian mobile number.').transform((value, ctx) => {
  const n = normalisePhone(value);
  if (!n) {
    ctx.addIssue({ code: 'custom', message: 'Please enter a 10-digit Indian mobile number.' });
    return z.NEVER;
  }
  return n;
});
const email = z.union([z.literal(''), z.email('Please enter a valid email or leave it empty.')]);
const message = z.string().trim().max(500, 'Please keep the message under 500 characters.')
  .refine((v) => !CONTROL.test(v), 'Please remove any unusual characters.').optional().default('');
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
