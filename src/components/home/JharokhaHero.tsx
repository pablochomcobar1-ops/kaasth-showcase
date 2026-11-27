'use client';

import { getImageProps } from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '@/content/site.config';
import { DustCanvas } from '@/components/effects/DustCanvas';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { gsap, useGSAP, registerGsap, prefersReducedMotion } from '@/lib/motion';

const ROOMS = {
  heirloom: { name: 'heirloom', alt: 'A sunlit haveli room with a carved day bed, a teak almirah and brass, lit through a sandstone jaali' },
  form: { name: 'form', alt: 'The same sunlit room furnished with modern solid-wood armchairs, a low credenza and an oak coffee table' },
} as const;

/** Art-directed room photo: landscape render on desktop, portrait render on phones (next/image optimises both). */
function RoomPicture({ room, priority, className, show }: { room: (typeof ROOMS)[keyof typeof ROOMS]; priority?: boolean; className?: string; show?: boolean }) {
  const common = { alt: room.alt, sizes: '100vw', priority, fill: true, quality: 90 } as const;
  const { props: { srcSet: desktop } } = getImageProps({ ...common, src: `/renders/room-${room.name}.jpg` });
  const { props: { srcSet: mobile, ...rest } } = getImageProps({ ...common, src: `/renders/room-${room.name}-portrait.jpg` });
  return (
    <picture data-room={room.name}>
      <source media="(min-width: 768px)" srcSet={desktop} />
      <source media="(max-width: 767px)" srcSet={mobile} />
      <img {...rest} className={className} data-show={show ? 'true' : undefined} />
    </picture>
  );
}

/** Arch width/height for the current viewport (must match the CSS defaults in globals.css). */
function archSize() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w = vw < 768 ? Math.min(vw * 0.62, vh * (vh <= 700 ? 0.22 : 0.28)) : Math.min(vw * 0.3, 420);
  return { w, h: w * 1.3 };
}

/**
 * Home hero, the site's showpiece ("Jharokha Open").
 * The room is seen through a jharokha arch; scrolling pins the hero while the arch opening grows to fill the
 * screen and the room changes from Heirloom to Form. Only the arch-shaped mask grows; the photo never stretches.
 * Reduced motion: no pin; a button swaps the rooms instead. Without JS: the static arch with the Heirloom room.
 */
export function JharokhaHero() {
  const root = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { brand } = siteConfig;

  useEffect(() => setReduced(prefersReducedMotion()), []);

  useGSAP(() => {
    registerGsap();
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const q = gsap.utils.selector(el);
    const big = () => Math.max(window.innerWidth, window.innerHeight) * 3.6;

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      // The hero stays in view with CSS sticky inside a tall track (no JS pin), so the DOM is never re-wrapped.
      scrollTrigger: { trigger: el.parentElement, start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true },
    });
    tl.to(q('[data-hero-copy]'), { autoAlpha: 0, y: -40, duration: 0.22 }, 0)
      .to(q('[data-ghost]'), { autoAlpha: 0, scale: 1.08, duration: 0.3 }, 0)
      .to(q('[data-cue]'), { autoAlpha: 0, duration: 0.1 }, 0)
      .to(q('[data-frame]'), { autoAlpha: 0, scale: 1.15, duration: 0.25 }, 0.04)
      .fromTo(
        q('[data-mask]'),
        { '--mw': () => `${archSize().w}px`, '--mh': () => `${archSize().h}px` },
        { '--mw': () => `${big()}px`, '--mh': () => `${big() * 1.3}px`, ease: 'power2.in', duration: 0.62 },
        0.04,
      )
      .fromTo(
        q('[data-room="form"] img'),
        { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 100%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: 0.3 },
        0.5,
      )
      .to(q('[data-label="heirloom"]'), { autoAlpha: 0, duration: 0.12 }, 0.5)
      .fromTo(q('[data-label="form"]'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.15 }, 0.66)
      .fromTo(q('[data-end-copy]'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.76);
  }, { scope: root });

  return (
    <div className="hero-track relative">
    <section ref={root} aria-labelledby="hero-title" className="hero sticky top-0 h-[100svh] min-h-[620px] overflow-hidden bg-background">
      {/* light + dust */}
      <div aria-hidden className="hero-beam pointer-events-none absolute inset-0" />
      <DustCanvas className="absolute inset-0 h-full w-full" />

      {/* giant faint काष्ठ */}
      <p data-ghost aria-hidden className="hero-ghost pointer-events-none absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-deva text-brand-accent">
        {brand.nameDeva}
      </p>

      {/* the room, seen through the arch */}
      <div data-mask className="hero-mask absolute inset-0">
        <RoomPicture room={ROOMS.heirloom} priority className="object-cover" />
        <RoomPicture
          room={ROOMS.form}
          show={reduced && showForm}
          className="hero-room-form object-cover transition-opacity duration-[var(--duration-reveal)]"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/20" />
      </div>
      <svg data-frame aria-hidden className="hero-frame pointer-events-none absolute" viewBox="0 0 100 130" preserveAspectRatio="none">
        <path d="M0 130V52C0 30 28 22 50 0C72 22 100 30 100 52V130Z" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* room labels */}
      <p className="hero-label pointer-events-none absolute left-1/2 -translate-x-1/2 text-caption02 font-medium uppercase tracking-[0.22em] text-foreground">
        <span data-label="heirloom" className={reduced && showForm ? 'opacity-0' : ''}>Heirloom · <span className="font-deva normal-case tracking-normal">{brand.collections.heirloom.nameDeva}</span></span>
        <span data-label="form" className={`absolute inset-0 hidden whitespace-nowrap md:inline ${reduced && showForm ? 'opacity-100' : 'opacity-0'}`}>Form · <span className="font-deva normal-case tracking-normal">{brand.collections.form.nameDeva}</span></span>
      </p>

      {/* copy */}
      <div data-hero-copy className="container-page pointer-events-none absolute inset-x-0 bottom-0 grid gap-8 pb-20 md:grid-cols-[1fr_auto] md:items-end md:pb-16">
        <h1 id="hero-title" className="pointer-events-auto text-hero01">
          Made to be{' '}<br /><em className="text-brand-accent-strong">inherited.</em>
        </h1>
        <div className="pointer-events-auto max-w-[320px]">
          <p className="hidden font-deva text-heading03 text-brand-accent-strong md:block">
            {brand.collections.heirloom.nameDeva} · {brand.collections.form.nameDeva}
          </p>
          <p className="hero-tagline mt-2 font-display text-heading03 italic text-foreground">{brand.lines[0]}</p>
          <p className="mt-3 hidden text-body02 md:block">
            Hand-carved heirlooms and modern solid wood, from one {brand.city} workshop since {brand.established}.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <MagneticButton href="/contact#book">Book a showroom visit</MagneticButton>
            {reduced ? (
              <button
                type="button"
                aria-pressed={showForm}
                onClick={() => setShowForm((v) => !v)}
                className="rounded-pill border border-brand-accent px-5 py-3 text-caption01 font-medium uppercase tracking-[0.14em] text-brand-accent-strong"
              >
                {showForm ? 'See the heirloom room' : 'See the modern room'}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* end state copy (revealed by the scroll story) */}
      <div data-end-copy className="hero-end container-page pointer-events-none absolute inset-x-0 bottom-0 pb-20 md:pb-16">
        <p className="font-deva text-heading02 text-brand-accent-strong">{brand.collections.heirloom.nameDeva} → {brand.collections.form.nameDeva}</p>
        <p className="mt-3 max-w-[16ch] font-display text-hero02 leading-[0.95] text-foreground">Same room. Two souls.</p>
        <Link href="/products" className="brass-link pointer-events-auto mt-6 inline-block text-caption01 font-medium uppercase tracking-[0.16em] text-foreground">
          Explore both collections
        </Link>
      </div>

      <p data-cue aria-hidden className="hero-cue pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-caption02 font-medium uppercase tracking-[0.22em] text-foreground-subtle md:flex">
        Scroll · the room changes
      </p>
    </section>
    </div>
  );
}
