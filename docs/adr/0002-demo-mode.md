# ADR 0002: No database; "demo" and "live" modes
Status: accepted
**Context:** a showcase must never collect real personal data, but a re-skinned client site needs working forms.
**Decision:** `SITE_MODE=demo` (default): server actions validate with Zod and return success, storing and sending nothing. `SITE_MODE=live`: the same actions also run the rate limit (Upstash) and Turnstile check, then email the lead via Resend. Keys only in env vars.
**Consequences:** zero data-protection risk in demo; switching a client live is a config change plus env vars, not a rewrite.
