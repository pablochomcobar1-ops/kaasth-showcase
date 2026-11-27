import { headers } from 'next/headers';
import { siteConfig } from '@/content/site.config';

export const RATE_LIMIT = { max: 5, windowSeconds: 600 } as const;
const BUSY = 'Too many tries from this connection. Please wait a few minutes, or call or WhatsApp us.';
const HUMAN = 'Please complete the "I am human" check and try again.';
const DOWN = 'We could not send that just now. Please call or WhatsApp us instead.';

/** Visitor IP as reported by the host (Vercel/most proxies set x-forwarded-for; first entry is the client). */
async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
}

/** Fixed-window counter in Upstash Redis over its REST API: INCR, and start the window on the first hit. */
async function overLimit(ip: string, kind: string): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('missing Upstash config');
  const key = `kaasth:rl:${kind}:${ip}`;
  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([['INCR', key], ['EXPIRE', key, String(RATE_LIMIT.windowSeconds), 'NX']]),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Upstash ${res.status}`);
  const [incr] = (await res.json()) as [{ result: number }];
  return incr.result > RATE_LIMIT.max;
}

/** Cloudflare Turnstile server-side verification of the widget token. */
async function isHuman(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error('missing Turnstile secret');
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token, remoteip: ip });
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body, cache: 'no-store' });
  if (!res.ok) return false;
  return ((await res.json()) as { success?: boolean }).success === true;
}

/**
 * Live mode only: rate limit, then the human check. Returns a visitor-facing message to stop, or null to continue.
 * Fails closed: if a key is missing or a service is down, nothing is sent and the visitor is pointed to call/WhatsApp.
 * Demo mode returns null straight away (nothing is ever sent there).
 */
export async function guardLead(kind: 'enquiry' | 'booking', fd: FormData): Promise<string | null> {
  if (siteConfig.mode !== 'live') return null;
  try {
    const ip = await clientIp();
    if (await overLimit(ip, kind)) return BUSY;
    const token = fd.get('cf-turnstile-response');
    if (!(await isHuman(typeof token === 'string' ? token : '', ip))) return HUMAN;
    return null;
  } catch {
    return DOWN;
  }
}
