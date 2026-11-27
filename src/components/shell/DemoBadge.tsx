'use client';

import { useEffect, useState } from 'react';
import { siteConfig } from '@/content/site.config';

/**
 * Always-visible honesty badge: this is a concept demo, not a real shop.
 * Steps aside when the footer (which carries the same credit) is on screen. Short label on phones.
 */
export function DemoBadge() {
  const [footerVisible, setFooterVisible] = useState(false);
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => setFooterVisible(!!entry?.isIntersecting), { threshold: 0 });
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <aside aria-label="Concept demo notice">
    <a
      href="https://buildscalex.in"
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={footerVisible || undefined}
      tabIndex={footerVisible ? -1 : undefined}
      className={[
        'fixed bottom-4 left-4 z-40 rounded-pill border border-border bg-background/80 px-3 py-2 backdrop-blur',
        'text-caption02 font-medium uppercase tracking-[0.18em] text-foreground-subtle transition-[opacity,color] duration-[var(--duration-ui)] hover:text-brand-accent-strong',
        footerVisible ? 'pointer-events-none opacity-0' : 'opacity-100',
      ].join(' ')}
    >
      <span className="sr-only sm:not-sr-only">{siteConfig.demoBadge}</span>
      <span aria-hidden className="sm:hidden">Demo · BSX</span>
    </a>
    </aside>
  );
}
