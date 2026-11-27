# Kaasth quality review (Stage 6)

Reviewed 27 November 2026 by BSX Agency. Production build (`npm run build && npm start`), tested in Chromium.

## Final results

| Check | Tool | Result |
|---|---|---|
| Accessibility | axe-core 4 (WCAG 2.2 AA + best practices) on 10 pages × desktop and phone | **0 violations** |
| Accessibility | Lighthouse | **100** on every page |
| Best practices | Lighthouse | **100** on every page |
| Broken links | Every internal link on every page | **0 broken** (32 checked) |
| Screen sizes | Sideways overflow at 320, 375, 768, 1024, 1440, 1920, 2560 px | **None** |
| Keyboard | First Tab = "Skip to content"; focus visible on every element | **Pass** |
| Browser errors | Console errors, failed requests, CSP issues | **None** |
| Layout shift (CLS) | Lighthouse | **0–0.003** (good is under 0.1) |
| Speed, desktop | Lighthouse | **97–100** |
| Speed, phone | Lighthouse (simulated) | **71–89** |
| Main content shown, phone | Real browser, Slow 4G + 4× slower CPU | **1.1–2.4 s** on every page (good is under 2.5 s) |
| SEO | Lighthouse | 66 *on purpose*: demo mode tells Google not to list a made-up brand. In live mode this check passes. |

Lighthouse's phone score simulates a slow device and is pessimistic for pages with scroll animation; the real-browser measurement above is what visitors experience. Phone scores vary by about ±5 between runs.

## What was fixed in this stage

| Problem found | Fix |
|---|---|
| Home page blocked the phone for ~2 s at start-up (Lighthouse TBT 2,010 ms) | Text reveals now split their lines only when a heading is about to scroll into view, not all at once on load. TBT dropped to 220–420 ms. |
| Home hero was re-wrapped by the scroll library after load, so the browser re-timed the main content | Hero now stays in view with CSS `position: sticky` inside a tall track instead of a JavaScript pin. Same animation, less work. |
| Products banner: the still image was found late, then the video was counted as the main content at 4.4 s | Optimised still image with high priority; the video downloads only after the page has loaded and fades in on top. Main content now at 1.8 s. |
| The validation library (Zod, ~60 KB) was shipped to visitors on the Products page and probed `eval` (blocked by our CSP) | Catalogue word lists moved to `src/content/enums.ts`. Zod no longer reaches the browser on any page. |
| Pages other than Home had no "main" landmark and a second "banner" | `<main id="main">` now wraps every page in the root layout. |
| Filter counts and dimmed timeline years had low contrast | Counts raised to 85 % opacity; timeline years stay at full contrast (the drawing rings carry the motion). |
| Products jumped from the page title to card titles | Added a section heading ("All pieces") for screen readers. |
| Form boxes only changed border colour when focused | Clear brass focus ring, including the date picker. |
| Demo badge sat outside any landmark | Wrapped as a labelled side note. |

## How to re-run

The scripts used live outside the project (BSX's workspace `tools/`): Lighthouse 12 on 6 pages × 2 devices, an axe + links + overflow + keyboard sweep, and a real-browser LCP measurement on an emulated Slow 4G phone.
