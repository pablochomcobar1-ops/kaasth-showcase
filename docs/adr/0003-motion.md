# ADR 0003: GSAP for scroll storytelling, motion/react for micro-interactions, Lenis for smooth scroll
Status: accepted
**Decision:** GSAP 3.15 + ScrollTrigger + SplitText (via `@gsap/react` `useGSAP` with cleanup) for Jharokha Open, Lantern Reveal, Arch Wipe, Curtain. `motion` 14 for hover/press/menu. Lenis 1.3 (lerp 0.1) synced to ScrollTrigger. All gated by `prefers-reduced-motion`.
**Why not one library:** GSAP is strongest for pinned scrub timelines; motion/react is simpler for component state animations.
