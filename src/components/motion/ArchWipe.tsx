'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP, prefersReducedMotion, registerGsap, EASE, DURATION } from '@/lib/motion';

/** "Arch Wipe": an image enters through the arch mask and settles from scale 1.08 to 1 when it scrolls into view. */
export function ArchWipe({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    registerGsap();
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const inner = el.firstElementChild;
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    tl.from(el, { clipPath: 'inset(100% 0% 0% 0%)', duration: DURATION.reveal, ease: EASE.unveil });
    if (inner) tl.from(inner, { scale: 1.08, duration: DURATION.cinematic, ease: EASE.unveil }, 0);
  }, { scope: ref });
  return <div ref={ref} className={`overflow-hidden ${className}`}>{children}</div>;
}
