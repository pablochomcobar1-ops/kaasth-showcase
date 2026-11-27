'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';

type TurnstileApi = { render: (el: HTMLElement, opts: Record<string, unknown>) => string; remove: (id: string) => void };
declare global { interface Window { turnstile?: TurnstileApi } }

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Cloudflare Turnstile "I am human" check, shown only when a site key is set (live mode).
 * It adds a hidden `cf-turnstile-response` field to the surrounding form, which the server verifies.
 */
export function Turnstile() {
  const ref = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const mount = () => {
    if (!ref.current || !window.turnstile || widget.current) return;
    widget.current = window.turnstile.render(ref.current, { sitekey: SITE_KEY, theme: 'dark', size: 'flexible' });
  };
  useEffect(() => {
    mount();
    return () => { if (widget.current && window.turnstile) window.turnstile.remove(widget.current); widget.current = null; };
  }, []);
  if (!SITE_KEY) return null;
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={mount} />
      <div ref={ref} className="min-h-[65px]" />
    </>
  );
}
