'use server';

import { products } from '@/content/products';
import { enquirySchema, type ActionResult } from '@/lib/forms';
import { deliverLead } from '@/lib/leads';

/** Product enquiry. Validates on the server; a filled honeypot gets a silent fake success and nothing is sent. */
export async function submitEnquiry(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries([...fd.entries()].map(([k, v]) => [k, typeof v === 'string' ? v : '']));
  if (raw.company) return { ok: true };

  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, fieldErrors };
  }
  const product = products.find((p) => p.slug === parsed.data.productSlug);
  if (!product) return { ok: false, fieldErrors: { form: 'That piece is no longer listed.' } };

  try {
    await deliverLead('enquiry', {
      piece: `${product.name} (${product.slug})`,
      name: parsed.data.name,
      phone: parsed.data.phone,
      message: parsed.data.message || '(none)',
    });
  } catch {
    return { ok: false, fieldErrors: {}, message: 'We could not send that just now. Please call or WhatsApp us instead.' };
  }
  return { ok: true };
}
