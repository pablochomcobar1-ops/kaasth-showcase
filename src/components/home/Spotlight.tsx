'use client';

import { useRef, type ReactNode } from 'react';

/**
 * "Gallery spotlight" background: a warm pool of light that follows the pointer
 * (desktop mouse only). Touch and reduced motion get a still glow from CSS.
 */
export function Spotlight({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty('--sx', `${x}px`);
      el.style.setProperty('--sy', `${y}px`);
      el.dataset.lit = 'true';
    });
  };
  const onLeave = () => { if (ref.current) ref.current.dataset.lit = 'false'; };
  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`spotlight ${className}`}>
      {children}
    </div>
  );
}
