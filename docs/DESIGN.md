# Kaasth · काष्ठ: Design System (Haveli Nights)
*Concept demo for BSX Agency · Designed & built by BSX Agency*

## 1. Idea in one line
A dark, candle-lit haveli at dusk. Sunlight falls through a sandstone jaali; the furniture is the hero. **One cinematic moment per screen, everything else calm.**

## 2. Brand basics
- Logo: Jharokha Seal (see brand kit). On dark: Ivory symbol, Brass "Est." line.
- Tagline: *Made to be inherited.* Lines: *Purana dil, naya andaaz.* · *Har lakdi ki apni kahani.* · *Chai pe milte hain.*
- Language: English first, Hinglish lines, Devanagari display words (काष्ठ · विरासत · रूप) as design elements. Buttons always plain English.

## 3. Colour (tokens in `tokens.css`)
| Token | Hex | Use | Contrast on night |
|---|---|---|---|
| background | #120D09 | page | n/a |
| background-secondary | #1A130D | alternating sections | n/a |
| background-tertiary | #241A12 | cards, menus | n/a |
| foreground | #F3ECE0 | headings | 16.4:1 |
| foreground-secondary | #CFC3AE | body | 11.1:1 |
| foreground-subtle | #9D917C | captions, meta | 6.2:1 |
| brand-accent | #C9A46A | primary buttons (night text on brass 8.3:1), rules | 8.3:1 |
| brand-accent-strong | #E9C88F | italic words, hover, focus ring | 12.1:1 |
| paper / foreground-on-paper | #F3ECE0 / #3A2418 | Wood Passport card | 12.4:1 |
| border / border-subtle | #3A2C1F / #2A2017 | hairlines | n/a |
Rule: brass is for one thing per view (the main button or the italic word), never for large fills.

## 4. Type
| Role | Font | Notes |
|---|---|---|
| Display | Cormorant Garamond 500 (+ italic) | headlines, line-height 0.95, tracking -0.01em; the italic word goes brass-light |
| UI / body | Instrument Sans 400/500 | body 17px/1.6; captions uppercase +0.16em |
| Devanagari | Tiro Devanagari Hindi 400 | accent lines in brass; giant faint काष्ठ at 8% opacity |
Scale (01 = largest): hero01 48→96 · hero02 40→72 · heading01 32→52 · heading02 24→36 · heading03 22 · body01 17 · body02 15 · caption01 13 · caption02 11. Max line length 62ch.

## 5. Space and layout
- 4px base grid. Section rhythm: `clamp(80px, 10vw, 144px)` at every seam.
- Container 1320px, padding-inline `clamp(20px, 4vw, 48px)`. Full-bleed only for backgrounds and the hero.
- Hero fits the first viewport (100svh): nav, headline, line, CTA all visible on 1280×800 and 375×667.
- Shapes: images use the **jharokha arch mask** (signature) or square; buttons are pills; cards 6px radius.

## 6. Backgrounds
- **Hero: Sunbeam Dust** (picked). Slanted warm beam + ~120 dust specks on canvas, drifting away from the cursor; jaali light patch at low opacity; film grain overlay. Pauses off-screen; static under reduced-motion; ~60 specks on phones.
- Other sections: night with grain, a faint jaali pattern used at most once per page.

## 7. Motion language (named)
| Name | What happens | Timing |
|---|---|---|
| **Jharokha Open** (hero showpiece) | Hero pins for ~150vh; the arch mask grows to full screen while the room crossfades Heirloom → Form; headline lines slide out | GSAP ScrollTrigger scrub, pin; ease-drift |
| **Lantern Reveal** | Headings rise line by line from a mask (SplitText lines) | 900ms, ease-unveil, 80ms stagger |
| **Arch Wipe** | Images enter through the arch clip-path, scale 1.08 → 1 | 900ms, ease-unveil |
| **Brass Underline** | Links: underline draws from the left | 320ms, ease-unveil |
| **Press** | Buttons: scale 0.97 on press, brass glow on hover; magnetic on desktop only | 180ms, ease-press |
| **Curtain** | Page transition: a walnut panel with an arch cut-out sweeps up | 700ms, ease-drift |
| **Dust Drift** | Background specks float; cursor pushes them | continuous, 60fps cap |
Reference study (Fisch & Tisch, Louis Poulsen): premium furniture sites keep UI motion at 250 to 750 ms with strong ease-out curves and no scroll-jacking. We follow that everywhere except the single Jharokha Open moment.
Smooth scroll: Lenis, light (lerp 0.1), never on phones' native momentum fights.
**Reduced motion:** no pin or scrub (the Heirloom/Form switch becomes a simple crossfade button), reveals become fades, dust static, no cursor effects.

## 8. Sound
- Tabla loop (`kaasth-tabla-loop.mp3/.webm`, 31 s, seamless, ~350 KB), from Pixabay (Pixabay Content License; keep the source page link on file).
- **Off by default.** Toggle in the nav (small tabla icon + "Sound"). Fades in over 1.2 s at 35% volume; remembers the choice per visitor; pauses when the tab is hidden.

## 9. Cursor and extra effects
- Desktop only, never on touch: custom cursor dot (brass ring that grows over links); magnetic main buttons.
- **Splash Cursor (React Bits, MIT)** tuned as *dhoop smoke*: brass/umber palette, no rainbow, low intensity, slow swirl, no click splash, no intro. Placement to be confirmed (proposal: one section only, not the hero).

## 10. Components and sources
- Base UI: shadcn-style primitives (custom-styled to these tokens).
- Motion pieces: GSAP (ScrollTrigger, SplitText), motion/react for micro-interactions, Lenis.
- Optional standouts: Vengeance UI / Animate UI / Uiverse only where they serve one moment.

## 11. Performance budget (mobile)
LCP < 2.5s (hero render as AVIF, priority) · CLS < 0.1 · INP < 200ms · no WebGL in the first paint except the dust canvas · heavy 3D (rotating chair) lazy-loaded below the fold.
