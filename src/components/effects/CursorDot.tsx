'use client';

import { useEffect, useRef, useState } from 'react';
import { hasFinePointer, prefersReducedMotion } from '@/lib/motion';

/** Brass ring that trails the pointer and grows over links and buttons. Desktop only; the native cursor stays. */
export function CursorDot() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    setOn(true);
  }, []);

  useEffect(() => {
    if (!on) return;
    const el = ref.current;
    if (!el) return;
    let x = -100, y = -100, tx = -100, ty = -100, raf = 0;
    const move = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY;
      const hot = (e.target as Element | null)?.closest('a, button, [role="button"], input, select, textarea, label');
      el.dataset.hot = hot ? 'true' : 'false';
    };
    const loop = () => {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, [on]);

  if (!on) return null;
  return <div ref={ref} aria-hidden className="cursor-ring pointer-events-none fixed left-0 top-0 z-[60]" data-hot="false" />;
}
