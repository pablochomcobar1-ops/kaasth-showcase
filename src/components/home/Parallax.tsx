'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP, prefersReducedMotion, registerGsap } from '@/lib/motion';

/** Moves its child slower than the page while the section crosses the viewport. */
export function Parallax({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    registerGsap();
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    gsap.fromTo(el.firstElementChild, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  }, { scope: ref });
  return <div ref={ref} className={`overflow-hidden ${className}`}>{children}</div>;
}
