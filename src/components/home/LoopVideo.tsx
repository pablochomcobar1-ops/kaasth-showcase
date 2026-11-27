'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * Muted looping video that only plays while on screen. Reduced motion never loads it.
 * Without a `poster`, an image is expected behind it: the video then waits until the page has loaded and is idle,
 * and fades in once it is actually playing, so the still image stays the fast first paint.
 */
export function LoopVideo({ src, poster, label, className = '' }: { src: string; poster?: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(!!poster);
  const [playing, setPlaying] = useState(false);

  // Over-image videos: start downloading only after the page load event and an idle moment.
  useEffect(() => {
    if (poster || prefersReducedMotion()) return;
    let idle = 0;
    const go = () => {
      idle = typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(() => setLoad(true), { timeout: 2500 })
        : (globalThis.setTimeout(() => setLoad(true), 600) as unknown as number);
    };
    if (document.readyState === 'complete') go(); else window.addEventListener('load', go, { once: true });
    return () => {
      window.removeEventListener('load', go);
      if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idle); else globalThis.clearTimeout(idle);
    };
  }, [poster]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !load || prefersReducedMotion()) return;
    v.load();
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.15 });
    io.observe(v);
    return () => io.disconnect();
  }, [load]);

  const fade = !poster;
  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload={poster ? 'metadata' : 'none'}
      poster={poster}
      aria-label={label}
      onPlaying={() => setPlaying(true)}
      className={`${className} ${fade ? `transition-opacity duration-[var(--duration-cinematic)] ${playing ? 'opacity-100' : 'opacity-0'}` : ''}`}
    >
      {load && <source src={`${src}.webm`} type="video/webm" />}
      {load && <source src={`${src}.mp4`} type="video/mp4" />}
    </video>
  );
}
