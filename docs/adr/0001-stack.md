# ADR 0001: Next.js 16 + React 19 + Tailwind CSS 4 + TypeScript
Status: accepted (2026-11-25)
**Context:** premium animated showcase, five pages + product pages, deployed on Vercel, built file-by-file by one developer.
**Decision:** Next.js 16 (App Router, Server Components, Server Actions), React 19, Tailwind CSS 4 with tokens from `docs/tokens.css`, TypeScript strict, `next/font/google` for the three OFL fonts.
**Consequences:** static generation for every page (fast, cheap); server actions give us real server-side validation without a separate API.
