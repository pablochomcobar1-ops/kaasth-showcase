'use client';

import { useRef, type ElementType, type ReactNode } from 'react';
import { gsap, SplitText, useGSAP, prefersReducedMotion, registerGsap, EASE, DURATION } from '@/lib/motion';

type Props = { as?: ElementType; children: ReactNode; className?: string; delay?: number; onScroll?: boolean };

/**
 * "Lantern Reveal": text rises line by line out of a mask. The text is fully visible in the server HTML;
 * the animation only runs after hydration, and never for reduced motion.
 */
export function LanternReveal({ as: Tag = 'div', children, className, delay = 0, onScroll = true }: Props) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    registerGsap();
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const split = SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 110,
          duration: DURATION.reveal,
          ease: EASE.unveil,
          stagger: 0.08,
          delay,
          scrollTrigger: onScroll ? { trigger: el, start: 'top 85%', once: true } : undefined,
        }),
    });
    return () => split.revert();
  }, { scope: ref });
  return <Tag ref={ref} className={className}>{children}</Tag>;
}
