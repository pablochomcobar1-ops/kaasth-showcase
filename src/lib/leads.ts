import { siteConfig } from '@/content/site.config';

export type LeadKind = 'enquiry' | 'booking';

/**
 * Sends a lead to the showroom by email (Resend) in live mode.
 * Demo mode sends and stores nothing. Server-only: reads secret env vars.
 */
export async function deliverLead(kind: LeadKind, fields: Record<string, string>): Promise<void> {
  if (siteConfig.mode !== 'live') return;
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_TO_EMAIL;
  if (!key || !to) throw new Error('Live mode needs RESEND_API_KEY and LEADS_TO_EMAIL.');
  const text = Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join('\n');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.LEADS_FROM_EMAIL || 'Kaasth website <onboarding@resend.dev>',
      to: [to],
      subject: `New ${kind} from the website: ${fields.name ?? ''}`.trim(),
      text,
    }),
  });
  if (!res.ok) throw new Error(`Email service replied ${res.status}.`);
}
