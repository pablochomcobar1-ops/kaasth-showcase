'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

type Speck = { x: number; y: number; r: number; vx: number; vy: number; a: number; tw: number };

/**
 * "Sunbeam Dust": tiny warm specks drifting through a slanted beam of light.
 * Starts when the browser is idle, pauses off-screen and in hidden tabs, ~120 specks on desktop / 60 on phones,
 * one static frame for reduced motion. No cursor interaction (the smoke cursor owns the pointer).
 */
export function DustCanvas({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduce = prefersReducedMotion();
    let w = 0, h = 0, raf = 0, visible = true, specks: Speck[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Beam runs from the top-left towards the centre, like sun through a high jaali.
    const inBeam = (x: number, y: number) => {
      const t = (x / w) * 0.9 + (y / h) * 0.35;
      return Math.max(0, 1 - Math.abs(t - 0.55) / 0.22);
    };

    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = w < 768 ? 60 : 120;
      specks = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: 0.6 + Math.random() * 1.8,
        vx: 0.05 + Math.random() * 0.15, vy: -0.04 - Math.random() * 0.12,
        a: 0.25 + Math.random() * 0.6, tw: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of specks) {
        if (!reduce) {
          s.x += s.vx; s.y += s.vy;
          if (s.x > w + 4) s.x = -4;
          if (s.y < -4) s.y = h + 4;
        }
        const beam = inBeam(s.x, s.y);
        if (beam <= 0.02) continue;
        const twinkle = reduce ? 1 : 0.65 + 0.35 * Math.sin(time / 900 + s.tw);
        ctx.globalAlpha = s.a * beam * twinkle;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = '#f3d9a6';
        ctx.shadowColor = '#e9c88f';
        ctx.shadowBlur = 6;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (time: number) => {
      draw(time);
      raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const wake = () => { if (!raf && visible && !document.hidden && !reduce) raf = requestAnimationFrame(loop); };

    resize();
    const io = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; wake(); });
    io.observe(canvas);
    const ro = new ResizeObserver(() => { resize(); if (reduce) draw(0); });
    ro.observe(canvas);
    document.addEventListener('visibilitychange', wake);

    const start = () => (reduce ? draw(0) : wake());
    const hasIdle = typeof window.requestIdleCallback === 'function';
    const idle = hasIdle ? window.requestIdleCallback(start, { timeout: 1200 }) : globalThis.setTimeout(start, 300);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', wake);
      if (hasIdle) window.cancelIdleCallback(idle as number); else globalThis.clearTimeout(idle);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none ${className}`} />;
}
