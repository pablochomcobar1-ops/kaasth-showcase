# Kaasth security review (Stage 5)

Reviewed 27 November 2026 by BSX Agency, using the `security-review` checklist (secrets, input validation, XSS/CSP, CSRF, rate limiting, error handling, dependencies). The site has no database, logins, uploads or payments, so those checklist sections do not apply.

## Result: no open issues

| Area | What was checked | Result |
|---|---|---|
| Secrets | Pattern scan of source, docs and config; only `NEXT_PUBLIC_SITE_URL` reaches the browser | Pass. **Fixed:** `.gitignore` now ignores every `.env*` file except `.env.example` (before, `.env.production` would have been committed). |
| Security headers | Live response headers on pages, images, share image, robots | Pass: strict CSP with a fresh nonce per request, HSTS (2 years, preload), `X-Frame-Options: DENY`, `nosniff`, referrer policy, permissions policy, COOP, no `X-Powered-By`. |
| XSS | No `dangerouslySetInnerHTML`, `eval`, `innerHTML` or `new Function` anywhere; React escapes all text | Pass. |
| Forged form posts (CSRF) | Real browser submit with the `Origin` header rewritten to another site | Pass: Next.js rejects it ("Invalid Server Actions request"); nothing is processed. |
| Oversized requests | +3 MB form body | Pass. **Fixed:** limit lowered from 1 MB to 32 KB (`next.config.ts`). |
| Input validation | Every field validated on the server with Zod, even when the browser already checked it | Pass. **Fixed:** names reject control characters (no `\r\n` header tricks in lead emails), messages reject invisible control characters, phone input capped at 24 characters before parsing. |
| Spam bots | Hidden honeypot field | Pass: a filled honeypot gets a fake success and nothing is sent. |
| Image resizer | Remote URLs, odd quality, huge widths | Pass: all refused with 400. |
| Errors and logging | Visitor-facing errors are generic; no personal data is logged | Pass. |
| Dependencies | `npm audit` (all and production-only) | Pass: 0 vulnerabilities. |

## Demo vs live

- **Demo (`SITE_MODE=demo`, default):** forms validate and show success; nothing is sent, stored or logged. No outside services are contacted.
- **Live (`SITE_MODE=live`):** before a lead is emailed, `src/lib/guard.ts` runs:
  1. **Rate limit:** at most 5 submissions per visitor IP per 10 minutes per form (Upstash Redis).
  2. **Human check:** Cloudflare Turnstile token verified on the server.
  3. Then the lead is emailed through Resend.

  Live mode **fails closed**: if a key is missing or a service is down, nothing is sent and the visitor is asked to call or WhatsApp instead. The CSP only opens up for `challenges.cloudflare.com` when live mode and a Turnstile site key are both set.

## Go-live checklist for a client site

1. Create free accounts: Resend (email), Cloudflare Turnstile, Upstash Redis.
2. In the hosting dashboard (e.g. Vercel → Settings → Environment Variables), set:
   `SITE_MODE=live`, `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `LEADS_TO_EMAIL`, `LEADS_FROM_EMAIL` (a verified domain address), `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
3. Redeploy (the `NEXT_PUBLIC_` values are built into the page).
4. Send one test enquiry and one test booking; confirm both emails arrive.
5. Replace the demo phone, email, address and the Privacy page's contact details with the client's real ones.
6. Never put real keys in any file in the repository.
