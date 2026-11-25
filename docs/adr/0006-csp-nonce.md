# ADR 0006: Strict CSP with per-request nonces (pages render on demand)
Status: accepted (2026-11-25)
**Context:** We want a strict Content-Security-Policy. Next.js 16 offers (a) nonces via `proxy.ts`, which needs per-request rendering, or (b) experimental hash-based SRI that keeps pages static.
**Tested:** with SRI and `script-src 'self'`, the browser blocked Next.js's inline startup scripts (3 CSP violations), so the page never became interactive. Adding `'unsafe-inline'` would weaken the policy.
**Decision:** nonce-based CSP in `src/proxy.ts` (`script-src 'self' 'nonce-…' 'strict-dynamic'`), root layout calls `connection()` so every page renders per request. `style-src` allows inline styles (React/Radix/GSAP), which cannot execute code. Other security headers stay in `next.config.ts`.
**Consequences:** strict script policy matching OWASP guidance; each page view runs a small server render on Vercel (~50–150 ms TTFB), well inside the 2.5 s LCP budget. Static assets (images, audio, fonts, JS chunks) stay cached on the CDN.
