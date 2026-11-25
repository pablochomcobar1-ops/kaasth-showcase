'use client';

import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import type { ReactNode } from 'react';

/** Primary pill button that leans toward the pointer on desktop (springy), with a soft press. */
export function MagneticButton({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.25);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const reset = () => { x.set(0); y.set(0); };
  return (
    <motion.span style={{ x, y }} className="inline-flex" whileTap={reduce ? undefined : { scale: 0.97 }}>
      <Link
        href={href}
        onPointerMove={onMove}
        onPointerLeave={reset}
        className={`inline-flex items-center rounded-pill bg-brand-accent px-7 py-4 text-caption01 font-medium uppercase tracking-[0.14em] text-background shadow-[var(--shadow-brass-glow)] transition-[box-shadow,background-color] duration-[var(--duration-ui)] hover:bg-brand-accent-strong ${className}`}
      >
        {children}
      </Link>
    </motion.span>
  );
}
