'use server';

import { bookingSchema, fieldErrorsFrom, type ActionResult } from '@/lib/forms';
import { deliverLead } from '@/lib/leads';

/** Showroom visit booking. Server re-checks every rule (date window, Mondays, slots); honeypot gets a silent fake success. */
export async function bookVisit(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries([...fd.entries()].map(([k, v]) => [k, typeof v === 'string' ? v : '']));
  if (raw.company) return { ok: true };

  const parsed = bookingSchema(new Date()).safeParse({ email: '', ...raw });
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  const b = parsed.data;
  try {
    await deliverLead('booking', {
      name: b.name,
      phone: b.phone,
      email: b.email || '(none)',
      visit: `${b.date} at ${b.slot}`,
      interest: b.interest ?? '(not given)',
      message: b.message || '(none)',
    });
  } catch {
    return { ok: false, fieldErrors: {}, message: 'We could not send that just now. Please call or WhatsApp us instead.' };
  }
  return { ok: true };
}
