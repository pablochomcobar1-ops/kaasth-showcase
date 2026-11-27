import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

vi.mock('next/headers', () => ({ headers: async () => new Headers({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' }) }));

const fd = (o: Record<string, string> = {}) => { const f = new FormData(); for (const [k, v] of Object.entries(o)) f.set(k, v); return f; };

/** Fake Upstash + Turnstile endpoints; `count` is what INCR returns, `human` what siteverify says. */
function fakeServices({ count = 1, human = true, upstashDown = false } = {}) {
  const calls: { url: string; body: string }[] = [];
  vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
    calls.push({ url: String(url), body: String(init?.body ?? '') });
    if (String(url).includes('upstash')) return upstashDown ? new Response('', { status: 503 }) : Response.json([{ result: count }, { result: 1 }]);
    if (String(url).includes('siteverify')) return Response.json({ success: human });
    return new Response('', { status: 404 });
  }));
  return calls;
}

async function loadGuard(mode: 'demo' | 'live', env: Record<string, string> = {}) {
  vi.resetModules();
  vi.stubEnv('SITE_MODE', mode);
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);
  return (await import('@/lib/guard')).guardLead;
}
const LIVE = { UPSTASH_REDIS_REST_URL: 'https://x.upstash.io', UPSTASH_REDIS_REST_TOKEN: 't', TURNSTILE_SECRET_KEY: 's' };

beforeEach(() => vi.unstubAllGlobals());
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe('guardLead (live-mode protection)', () => {
  it('demo mode: no checks, no network calls', async () => {
    const calls = fakeServices();
    expect(await (await loadGuard('demo'))('booking', fd())).toBeNull();
    expect(calls).toHaveLength(0);
  });
  it('live: passes with a valid Turnstile token under the rate limit, keyed by the client IP', async () => {
    const calls = fakeServices({ count: 1, human: true });
    expect(await (await loadGuard('live', LIVE))('booking', fd({ 'cf-turnstile-response': 'tok' }))).toBeNull();
    expect(calls[0]?.body).toContain('kaasth:rl:booking:203.0.113.7');
    expect(calls[1]?.body).toContain('remoteip=203.0.113.7');
  });
  it('live: 6th try in the window is refused before Turnstile is even asked', async () => {
    const calls = fakeServices({ count: 6 });
    expect(await (await loadGuard('live', LIVE))('enquiry', fd({ 'cf-turnstile-response': 'tok' }))).toMatch(/Too many tries/);
    expect(calls.some((c) => c.url.includes('siteverify'))).toBe(false);
  });
  it('live: missing or failed human check is refused', async () => {
    fakeServices({ human: false });
    const guard = await loadGuard('live', LIVE);
    expect(await guard('booking', fd())).toMatch(/I am human/);
    expect(await guard('booking', fd({ 'cf-turnstile-response': 'bad' }))).toMatch(/I am human/);
  });
  it('live: fails closed when keys are missing or a service is down', async () => {
    fakeServices();
    expect(await (await loadGuard('live'))('booking', fd({ 'cf-turnstile-response': 'tok' }))).toMatch(/call or WhatsApp/);
    fakeServices({ upstashDown: true });
    expect(await (await loadGuard('live', LIVE))('booking', fd({ 'cf-turnstile-response': 'tok' }))).toMatch(/call or WhatsApp/);
  });
});

describe('form field hardening', () => {
  it('rejects control characters in names and messages, and absurdly long phone input', async () => {
    const { enquirySchema } = await import('@/lib/forms');
    const base = { productSlug: 'sheesham-divan', name: 'Meera Patel', phone: '9876543210', consent: 'on' };
    expect(enquirySchema.safeParse(base).success).toBe(true);
    expect(enquirySchema.safeParse({ ...base, name: 'Meera\r\nBcc: spam@x.com' }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...base, message: 'hi\u0000there' }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...base, message: 'Line one\nLine two' }).success).toBe(true);
    expect(enquirySchema.safeParse({ ...base, phone: '9'.repeat(5000) }).success).toBe(false);
  });
});
