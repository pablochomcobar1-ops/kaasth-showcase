'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, registerGsap, EASE } from '@/lib/motion';

let firstLoad = true;

/**
 * Page-change curtain: on client navigation a walnut panel with an arch cut-out sweeps up off the new page.
 * Skipped on the very first load (never delays the first paint) and for reduced motion.
 */
export function Curtain() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (firstLoad || prefersReducedMotion()) {
      firstLoad = false;
      el.style.display = 'none';
      return;
    }
    registerGsap();
    const tween = gsap.fromTo(el, { yPercent: 0 }, { yPercent: -110, duration: 0.7, ease: EASE.drift, delay: 0.05, onComplete: () => { el.style.display = 'none'; } });
    return () => { tween.kill(); };
  }, []);
  return (
    <div ref={ref} aria-hidden className="curtain pointer-events-none fixed inset-0 z-[80]">
      <svg className="absolute inset-x-0 bottom-full h-[18vh] w-full" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden>
        <path d="M0 20V12C20 12 38 8 50 0C62 8 80 12 100 12V20Z" fill="currentColor" />
      </svg>
    </div>
  );
}
