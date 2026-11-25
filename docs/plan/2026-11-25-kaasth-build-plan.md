# Kaasth Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **Delivery rule for this project:** every task ends with (1) a zip the owner extracts into `E:\FULL_STACK_DEVELOPMENT\kaasth-showcase`, (2) phone + desktop screenshots, (3) the exact git commands. Owner pushes himself. Never push or deploy without asking.

**Goal:** Build Kaasth (काष्ठ), a dark, cinematic, 3D-flavoured furniture showcase that BSX Agency shows to furniture businesses and can re-skin per prospect.

**Architecture:** Statically generated Next.js 16 site. All brand, copy and catalogue data come from one typed config (`src/content/`), validated with Zod at build time. Forms are Server Actions with Zod validation; `SITE_MODE=demo` stores/sends nothing, `live` adds rate limit + Turnstile + Resend. Photoreal rooms are offline ThreeRT renders shipped as images; the only live WebGL is one lazy-loaded product chair. Site map: `docs/plan/kaasth-architecture.html`.

**Tech Stack:** Next.js 16.4 · React 19.3 · TypeScript (strict) · Tailwind CSS 4.3 · GSAP 3.15 (+ScrollTrigger, SplitText) with @gsap/react 2.1 · motion 14 · Lenis 1.3 · three 0.187 + @react-three/fiber 9.8 + drei 10.7 · Zod 4 · Vitest + Testing Library · Playwright (Stage 6) · Vercel.

**Spec:** `docs/BRIEF.md` + `docs/DESIGN.md` (+ `docs/tokens.css`). ADRs in `docs/adr/`.

## Global Constraints
- Credit line everywhere: "Designed & built by BSX Agency". Badge visible site-wide: "Concept demo · BSX Agency".
- Brand: Kaasth / काष्ठ · tagline "Made to be inherited." · Ahmedabad · Est. 1962 (fictional).
- Colours, type, spacing and motion only from `docs/tokens.css`. No raw hex in components.
- Fonts: Cormorant Garamond, Instrument Sans, Tiro Devanagari Hindi via `next/font/google` (OFL). No other fonts.
- Buttons always plain English. Devanagari only as display/accent words.
- Prices in ₹ with Indian grouping (`₹48,000`, `₹1,25,000`); Heirloom antiques show "Price on request".
- Every animation has a reduced-motion version; content is visible with JS off (no SSR `opacity:0`).
- Desktop-only cursor effects (`(hover: hover) and (pointer: fine)`); none on touch.
- Sound off by default; tabla loop at 35% volume with 1.2 s fade; remembers choice in localStorage (try/catch).
- Mobile budget: LCP < 2.5 s, CLS < 0.1, INP < 200 ms; Lighthouse mobile ≥ 90 perf, 100 a11y/best-practices/SEO.
- Only licensed assets: CC0 models (Poly Haven), Pexels/Unsplash photos, owner's Gemini/Flow images, our ThreeRT renders, Pixabay audio.
- No secrets in code or `NEXT_PUBLIC_*`. `.env.example` only.

## Review Focus
1. **Booking date edge cases**: past dates, today, more than 60 days ahead, and showroom-closed Mondays must be rejected with a clear message (owned by Task 9 tests).
2. **Indian phone input**: `+91 98765 43210`, `098765-43210`, `9876543210` all accepted and normalised; 9-digit or `12345…` rejected (Task 1 schema tests).
3. **Reduced-motion users** still get the Heirloom → Form story through a visible toggle button instead of the scroll pin (Task 3 test).
4. **No-JS / slow network**: hero headline, CTA and hero image render server-side and are visible before any script; dust canvas and smoke never block LCP (Task 3 + Stage 6 Lighthouse).
5. **Catalogue filters with no matches** show a finished empty state with a "Clear filters" action, and filter state survives refresh via the URL (Task 5 tests).

---

## File Structure
```
src/
  app/
    layout.tsx                 fonts, <Shell>, metadata defaults, nonce read
    globals.css                @import tailwindcss + tokens + base styles
    page.tsx                   Home
    products/page.tsx          Catalogue
    products/[slug]/page.tsx   Product detail (generateStaticParams)
    services/page.tsx  about/page.tsx  contact/page.tsx  privacy/page.tsx
    not-found.tsx  sitemap.ts  robots.ts  opengraph-image.tsx
    actions/booking.ts         bookVisit server action
    actions/enquiry.ts         submitEnquiry server action
  content/
    site.config.ts             brand, contact, mode, nav, reviews, services, story
    products.ts                24 products
    schema.ts                  Zod schemas for config + products (build-time check)
  lib/
    forms.ts                   bookingSchema, enquirySchema, normalisePhone, ActionResult
    format.ts                  formatINR
    motion.ts                  gsap registration, ease constants from tokens
    live.ts                    rate limit + Turnstile + Resend (live mode only)
  components/
    shell/  Nav.tsx MobileMenu.tsx Footer.tsx DemoBadge.tsx SoundToggle.tsx Curtain.tsx
    effects/ SmoothScroll.tsx DustCanvas.tsx SmokeCursor.tsx (React Bits SplashCursor, MIT) CursorDot.tsx Grain.tsx
    motion/ LanternReveal.tsx ArchWipe.tsx BrassLink.tsx MagneticButton.tsx
    ui/      Button.tsx ArchImage.tsx WoodPassport.tsx Field.tsx Select.tsx
    home/    JharokhaHero.tsx Collections.tsx FeaturedPieces.tsx PassportExplainer.tsx HeirloomStory.tsx Reviews.tsx VisitBand.tsx
    products/ CatalogueFilters.tsx ProductGrid.tsx ProductCard.tsx EmptyState.tsx Gallery.tsx ChairViewer.tsx EnquiryForm.tsx
    contact/ BookingForm.tsx MapSvg.tsx
  test/      *.test.ts(x)
public/ brand/ audio/ renders/ products/ models/ 
middleware.ts                  CSP nonce + security headers
next.config.ts  .env.example  vitest.config.ts
```

## Page and section map (layout · signature motion · background · component source)
Background choices marked * still go through the background habit (3–4 option preview sheet) before that section is built.

### Home `/`
| # | Section | Layout | Motion | Background | Source |
|---|---|---|---|---|---|
| 1 | **Jharokha hero** (showpiece) | arch-masked room centre, headline bottom-left, Hinglish line + CTA bottom-right, giant faint काष्ठ | **Jharokha Open**: pin ~150vh, arch → full screen, Heirloom → Form crossfade; Lantern Reveal on load | **Sunbeam Dust** (chosen) + jaali light + grain | custom (GSAP) |
| 2 | Two collections | split: Heirloom · विरासत / Form · रूप, arch images | Arch Wipe, hover reveals collection line | night + grain | custom |
| 3 | Featured pieces | horizontal rail of 6 product cards (snap on mobile) | cards rise, image zoom on hover | background-secondary* | custom (Vengeance UI rail as an option) |
| 4 | Wood Passport explainer | Passport card centre with 5 annotated facts around it | facts draw in with lines (DrawSVG-style stroke) | paper card on night* | custom |
| 5 | Heirloom story | full-bleed workshop image + 3 craft steps | parallax image, numbered steps reveal | night + smoke cursor (site-wide) | custom |
| 6 | Sample reviews | 3 quotes, slow marquee on desktop, stack on mobile | marquee pauses on hover | background-secondary | Inspo marquee pattern |
| 7 | Visit band | "Chai pe milte hain." + Book a showroom visit | magnetic button | brass glow* | custom |
| 8 | Footer | logo, nav, contact, credit, sound toggle | Brass Underline | night | custom |

### Products `/products`
| Section | Layout | Motion | Background |
|---|---|---|---|
| Header | title + collection tabs (All · Heirloom · Form) | Lantern Reveal | night |
| Filters | category chips + wood select; URL query state | chip press | night |
| Grid | 3 / 2 / 1 columns, arch-topped images, name, wood, price | Arch Wipe stagger 60 ms | night |
| Empty state | message + Clear filters | fade | night |

### Product `/products/[slug]`
Gallery (arch main image + thumbs) · title, collection, price · **Wood Passport** (+ provenance card for Heirloom) · dimensions · Enquire (form dialog or WhatsApp deep link) · **ChairViewer** (only `model3d` products; lazy R3F, drag to rotate, poster image first) · "You may also like" (3 cards).

### Services `/services`
Four services (Custom-made · Antique restoration · Interior styling · Delivery & installation) as large alternating rows with arch images; each with a 3-step process; closing visit band.

### About `/about`
Story timeline 1962 → today (pinned horizontal timeline on desktop, vertical on mobile), the workshop, the Wood Passport promise, visit band.

### Contact `/contact`
Booking form (name, phone, email optional, date, slot, interest, message, consent) · WhatsApp + call + email tiles · SVG map + "Get directions" · showroom hours (Tue–Sun 11:00–19:00, closed Monday).

### Privacy, 404
Plain readable privacy page (DPDP-style, demo mode explains nothing is stored). 404: "Yeh kamra khaali hai." with arch illustration and links home/products.

## 3D and media pieces
| Piece | Tech | Budget | Notes |
|---|---|---|---|
| Hero rooms (Heirloom, Form) | ThreeRT final renders, 64+ spp, 1920×1080 + 1080×1350 mobile crop | AVIF ≤ 180 KB each | replace stand-in boxes with CC0 Poly Haven furniture; ~15–20 min per render |
| Optional hero loop | ThreeRT frames → MP4/WebM | ≤ 1.5 MB | only after everything else is final; 2–4 h render; ask first |
| Product chair | R3F + drei `useGLTF`, Draco GLB | ≤ 1.5 MB, lazy | CC0 chair model (owner downloads from Poly Haven if the workspace can't) |
| Product photos | owner's Gemini/Flow images from our prompt sheet | WebP/AVIF via next/image | one fixed style line for consistency |
| Tabla loop | MP3 + WebM | 370 KB | already in `public/audio/` |

## Performance budget (written into every task's check)
Mobile: LCP < 2.5 s (hero render AVIF with `priority`), CLS < 0.1 (all images sized, fonts with `display: swap` + fallback metrics), INP < 200 ms. JS on first load ≤ 180 KB gzip for Home; R3F chunk only on product pages with a model; dust canvas starts after `requestIdleCallback`; smoke cursor loads only on fine-pointer devices after first interaction.

## Security plan (threat model)
| Asset | Threat | Entry point | Control |
|---|---|---|---|
| Visitor trust | clickjacking, injected scripts | every page | strict CSP with per-request nonce (middleware), `frame-ancestors 'none'`, HSTS, Referrer-Policy, Permissions-Policy |
| Leads (live mode) | spam, bot floods, injection | `bookVisit`, `submitEnquiry` | Zod on server, honeypot field, Turnstile, Upstash rate limit (5/10 min per IP), length caps, no HTML in emails |
| Secrets | leakage | repo, client bundle | env vars only, `.env.example`, gitleaks scan, nothing in `NEXT_PUBLIC_*` |
| Supply chain | malicious package | npm deps | lockfile committed, `npm audit`, supply-chain-risk-auditor, minimal deps |
| Personal data | over-collection | forms | demo stores nothing; live collects only name/phone/email/date; privacy page; consent checkbox |
No admin panel, no database, no payments, no uploads in this project, so those controls are out of scope (documented in Stage 5 report).

## SEO plan (no paid credits used; verify with OpenSEO only if the owner approves credits)
| Page | Title | Primary terms (unverified) |
|---|---|---|
| Home | Kaasth · Handcrafted solid wood & heirloom furniture | solid wood furniture Ahmedabad, handcrafted furniture India |
| Products | Furniture collection · Heirloom & Form | sheesham furniture, teak furniture, antique furniture India |
| Product | {name} in {wood} · Kaasth | {wood} {category} |
| Services | Custom furniture & antique restoration | custom furniture Ahmedabad, antique furniture restoration |
| About | Our workshop since 1962 | furniture workshop Ahmedabad |
| Contact | Book a showroom visit | furniture showroom Ahmedabad |
Schema.org: `FurnitureStore` (fictional, demo) + `Product` per item + `BreadcrumbList`. As a demo, `robots` stays `noindex` until BSX decides otherwise.

---

## Tasks

### Task 1: Scaffold, tokens, content model, forms library
**Files:** Create `package.json`, `next.config.ts`, `tsconfig.json`, `vitest.config.ts`, `src/app/{layout,page,globals.css}`, `src/content/{schema,site.config,products}.ts`, `src/lib/{forms,format}.ts`, `.env.example`, `src/test/{forms,format,content}.test.ts`
**Interfaces (produces):**
- `type Collection = 'heirloom' | 'form'`; `type Category = 'living'|'dining'|'bedroom'|'seating'|'storage'|'decor'`; `type Wood = 'sheesham'|'teak'|'oak'|'walnut'|'mango'|'rosewood'`
- `interface Product { slug; name; nameDeva?; collection; category; wood; priceFrom: number | null; images: string[]; passport: { wood; joinery; artisanHours: number; finish; termiteTreated: boolean; warrantyYears: number }; dimensionsCm: { w; d; h }; provenance?: { era; region; restored }; model3d?: string; blurb }`
- `siteConfig: SiteConfig` (brand, contact, mode, nav, hours, reviews, services, story); `products: Product[]`
- `formatINR(n: number): string`; `normalisePhone(raw: string): string | null` (returns 10 digits)
- `bookingSchema`, `enquirySchema` (Zod); `type ActionResult = { ok: true } | { ok: false; fieldErrors: Record<string, string>; message?: string }`
- [ ] Write failing tests: `formatINR(48000) === '₹48,000'`, `formatINR(125000) === '₹1,25,000'`; `normalisePhone('+91 98765 43210') === '9876543210'`, `normalisePhone('098765-43210') === '9876543210'`, `normalisePhone('12345') === null`, `normalisePhone('5876543210') === null`; `productsSchema.parse(products)` passes and every slug is unique; there are 24 products, ≥ 10 per collection.
- [ ] Run `npm test` → FAIL.
- [ ] Implement; scaffold Next 16 + Tailwind 4 with `docs/tokens.css` pasted into `globals.css`; fonts via `next/font/google`; placeholder home showing the token sheet.
- [ ] `npm test` → PASS; `npm run build` → success.
- [ ] Deliver zip + screenshots + `git add . && git commit -m "feat: scaffold, tokens, content model" && git push`.

### Task 2: Shell and global motion layer
**Files:** `src/components/shell/*`, `src/components/effects/{SmoothScroll,SmokeCursor,CursorDot,Grain}.tsx`, `src/components/motion/*`, `src/lib/motion.ts`, `middleware.ts`, `src/test/shell.test.tsx`
**Consumes:** `siteConfig.nav`, tokens. **Produces:** `<Shell>`, `<LanternReveal>`, `<ArchWipe>`, `<BrassLink>`, `<MagneticButton>`, `useReducedMotion()`.
- [ ] Tests: nav renders 4 links + "Book a visit"; mobile menu opens/closes with Escape and traps focus; SoundToggle starts with `aria-pressed="false"`; DemoBadge text is "Concept demo · BSX Agency".
- [ ] Implement Nav (transparent → blurred night on scroll), MobileMenu (Radix Dialog), Footer, Curtain page transition, Lenis + ScrollTrigger sync, SmokeCursor = React Bits SplashCursor with `rainbow={false} colors={['#C9A46A','#8A5A2B','#E9C88F']} intensity={0.25} size={0.2} swirl={4} trail={0.8} force={0.15} glow={0.1} quality="medium" clickSplash={false} intro={false}`, mounted only for fine pointers without reduced motion; CSP middleware with nonce.
- [ ] Tests pass; build; screenshots of nav (desktop, phone, menu open); deliver.

### Task 3: Home hero (Jharokha Open + Sunbeam Dust)
**Files:** `src/components/home/JharokhaHero.tsx`, `src/components/effects/DustCanvas.tsx`, `public/renders/*`, `src/test/hero.test.tsx`
**Consumes:** `ArchImage`, `LanternReveal`, `useReducedMotion`.
- [ ] Final ThreeRT renders (CC0 furniture, 64 spp) → AVIF/WebP desktop + mobile crops; show draft frame first.
- [ ] Tests: hero `h1` text is "Made to be inherited."; CTA link goes to `/contact#book`; with reduced motion, a button "See the modern room" swaps the room (aria-pressed toggles) and no pin is created.
- [ ] Implement pin + scrub timeline (GSAP `useGSAP` with cleanup), DustCanvas (~120 specks desktop / 60 phone, pauses when hidden, static frame under reduced motion; no cursor push since smoke owns the cursor).
- [ ] break-ui (long headline, 320 px wide, slow 3G, JS off) + compare with THE BAR; 3 upgrades if needed; deliver.

### Task 4: Rest of Home
Sections 2–8 from the map. Backgrounds marked * go through the preview sheet first. Tests: FeaturedPieces renders 6 cards with formatted prices or "Price on request"; Reviews have a visible "Sample reviews" note. Deliver.

### Task 5: Catalogue `/products`
Tests: `?collection=heirloom` shows only heirloom; `?category=seating&wood=teak` combines; no match shows EmptyState with "Clear filters" that resets the URL; filters are buttons with `aria-pressed`. Deliver.

### Task 6: Product detail + enquiry + chair viewer
`generateStaticParams` from `products`; unknown slug → 404. `submitEnquiry` server action returns `ActionResult`; tests: valid input → `{ ok: true }`; missing consent → `fieldErrors.consent`; honeypot filled → `{ ok: true }` silently (no send). ChairViewer lazy (`next/dynamic`, `ssr: false`) with poster image, only when `model3d` exists. Deliver.

### Task 7: Services · Task 8: About
Static pages from `siteConfig.services` / `siteConfig.story`; timeline pin on desktop only. Tests: 4 services render; timeline starts at 1962. Deliver each.

### Task 9: Contact + booking
`bookVisit` server action. Tests (Review Focus 1–2): date = yesterday → `fieldErrors.date`; date = today → error "Please pick a date from tomorrow"; date = a Monday → "We're closed on Mondays"; > 60 days → error; slot not in `['11:00','13:00','15:00','17:00']` → error; phone `+91 98765 43210` → ok. Success screen: "Visit booked (demo)". MapSvg + Get directions link. Deliver.

### Task 10: Privacy, 404, metadata, sitemap, robots, OG image
Tests: sitemap lists every page + 24 product URLs; robots = noindex in demo mode; OG image route responds 200. Deliver, then Stage 5 (security), 6 (QA), 7 (launch), 8 (video) as agreed.

## Execution
Native: Claude builds each task here, verifies (tests, build, screenshots, break-ui), delivers a zip, and waits for the owner's OK before the next task. One fresh reviewer checks the whole codebase before launch (Stage 6, code-review-graph).
