'use client';

import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion, registerGsap } from '@/lib/motion';
import { ringPath } from '@/lib/rings';

type Era = { year: number; title: string; text: string };

const R = [52, 98, 142, 184]; // ring radii in a 420×420 box, heartwood first
const C = { x: 210, y: 214 };

/**
 * About timeline as tree rings. Desktop: the rings stay in view (CSS sticky) and each era's
 * ring draws itself as you scroll past it. Phones and reduced motion: a plain list, rings shown complete.
 * The <ol> is the real content; the big ring drawing is decoration.
 */
export function TreeRings({ eras }: { eras: Era[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    registerGsap();
    if (!ref.current || prefersReducedMotion()) return;
    const q = gsap.utils.selector(ref);
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      gsap.set(q('[data-ring]'), { strokeDashoffset: 1 });
      gsap.set(q('[data-label]'), { autoAlpha: 0 });
      q('[data-era]').forEach((el, i) => {
        gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 80%', end: 'center 55%', scrub: 0.6 } })
          .to(q(`[data-ring="${i}"]`), { strokeDashoffset: 0, ease: 'none' })
          .to(q(`[data-label="${i}"]`), { autoAlpha: 1, duration: 0.25 }, 0.75);
        gsap.fromTo(el, { autoAlpha: 0.3 }, { autoAlpha: 1, scrollTrigger: { trigger: el, start: 'top 70%', end: 'center 55%', scrub: true } });
      });
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <div ref={ref} className="container-page grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
      <div aria-hidden="true" className="hidden lg:block">
        <div className="sticky top-[12svh] grid h-[76svh] place-items-center">
          <svg viewBox="0 0 420 420" className="w-full max-w-[520px] overflow-visible">
            <defs>
              <radialGradient id="heart" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#E9C88F" stopOpacity="0.22" />
                <stop offset="1" stopColor="#E9C88F" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx={C.x} cy={C.y} r={200} fill="url(#heart)" />
            {/* fine growth lines between the era rings */}
            {Array.from({ length: 14 }, (_, k) => 30 + k * 12.5).map((r, k) => (
              <path key={`g${k}`} d={ringPath(C.x, C.y, r, k * 0.9 + 3)} fill="none" stroke="#C9A46A" strokeOpacity="0.09" strokeWidth="0.8" />
            ))}
            <circle cx={C.x} cy={C.y} r={4} fill="#E9C88F" />
            {R.slice(0, eras.length).map((r, i) => (
              <g key={i}>
                <path data-ring={i} d={ringPath(C.x, C.y, r, i * 1.3 + 1)} pathLength={1} strokeDasharray="1" fill="none" stroke="#E9C88F" strokeOpacity={0.9 - i * 0.12} strokeWidth="1.6" />
                <text data-label={i} x={C.x + r * 0.7} y={C.y - r * 0.68} fill="#E9C88F" fontFamily="var(--font-display)" fontSize="15">{eras[i]?.year}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>
      <ol className="grid gap-14 lg:gap-0">
        {eras.map((e, i) => (
          <li key={e.year} data-era className="flex gap-6 lg:min-h-[72svh] lg:items-center">
            <svg aria-hidden="true" viewBox="0 0 48 48" className="mt-2 size-12 shrink-0 lg:hidden">
              {Array.from({ length: i + 1 }, (_, k) => (
                <circle key={k} cx="24" cy="24" r={6 + k * 5.5} fill="none" stroke="#C9A46A" strokeOpacity={k === i ? 0.95 : 0.35} strokeWidth={k === i ? 1.6 : 1} />
              ))}
            </svg>
            <div>
              <p className="font-display text-hero01 leading-none text-brand-accent-strong">{e.year}</p>
              <h3 className="mt-4 text-heading02">{e.title}</h3>
              <p className="mt-3 max-w-md text-body01 text-foreground-secondary">{e.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
