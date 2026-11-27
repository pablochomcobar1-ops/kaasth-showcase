import { NextResponse, type NextRequest } from 'next/server';

/**
 * Strict Content-Security-Policy with a fresh nonce per request (docs/adr/0006-csp-nonce.md).
 * Next.js reads the nonce from this header and stamps it on its own scripts automatically.
 */
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDev = process.env.NODE_ENV === 'development';
  // Live mode with Turnstile: allow Cloudflare's challenge script and iframe. Demo mode keeps the strict policy.
  const turnstile = process.env.SITE_MODE === 'live' && !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const cf = 'https://challenges.cloudflare.com';
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${turnstile ? ` ${cf}` : ''}${isDev ? " 'unsafe-eval'" : ''}`,
    // Inline style attributes are set by React, Radix and GSAP; styles cannot run code.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "media-src 'self'",
    `connect-src 'self'${turnstile ? ` ${cf}` : ''}`,
    ...(turnstile ? [`frame-src ${cf}`] : []),
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; ');

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);
  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|brand/|audio/|renders/|products/|video/).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
