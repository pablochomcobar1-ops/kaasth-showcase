'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { hasFinePointer, prefersReducedMotion } from '@/lib/motion';

const SplashCursor = dynamic(() => import('./SplashCursor'), { ssr: false });

/**
 * Faint brass "dhoop smoke" that follows the cursor, site-wide.
 * Desktop with a fine pointer only, never with reduced motion, and only loaded after the first mouse move
 * so it never competes with the page's first paint.
 */
export function SmokeCursor() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    const start = () => setEnabled(true);
    window.addEventListener('pointermove', start, { once: true, passive: true });
    return () => window.removeEventListener('pointermove', start);
  }, []);

  if (!enabled) return null;
  return (
    <SplashCursor
      rainbow={false}
      colors={['#C9A46A', '#8A5A2B', '#E9C88F']}
      colorSpeed={0.3}
      intensity={0.18}
      size={0.2}
      force={0.15}
      swirl={4}
      trail={0.8}
      momentum={0.8}
      shading={0.4}
      glow={0}
      quality="medium"
      clickSplash={false}
      intro={false}
      zIndex={40}
      style={undefined}
    />
  );
}
