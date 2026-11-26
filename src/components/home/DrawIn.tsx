'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP, prefersReducedMotion, registerGsap, EASE } from '@/lib/motion';

/** Draws `[data-line]` connectors and fades in `[data-fact]` items once the block scrolls into view. */
export function DrawIn({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    registerGsap();
    if (!ref.current || prefersReducedMotion()) return;
    const q = gsap.utils.selector(ref);
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true } });
    tl.from(q('[data-card]'), { y: 40, rotate: -2, autoAlpha: 0, duration: 1, ease: EASE.unveil })
      .from(q('[data-line]'), { scaleX: 0, duration: 0.7, ease: 'power2.out', stagger: 0.12 }, 0.4)
      .from(q('[data-fact]'), { autoAlpha: 0, y: 12, duration: 0.6, ease: EASE.unveil, stagger: 0.12 }, 0.6);
  }, { scope: ref });
  return <div ref={ref} className={className}>{children}</div>;
}
