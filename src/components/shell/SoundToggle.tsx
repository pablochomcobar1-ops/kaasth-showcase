'use client';

import { useEffect, useRef, useState } from 'react';
import { TablaIcon } from './TablaIcon';

const KEY = 'kaasth-sound';
const VOLUME = 0.35;
const FADE_MS = 1200;

function readPref(): boolean {
  try { return window.localStorage.getItem(KEY) === 'on'; } catch { return false; }
}
function writePref(on: boolean) {
  try { window.localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* storage blocked: ignore */ }
}

/**
 * Tabla loop toggle. Off by default; never autoplays. If the visitor turned it on before,
 * it resumes on their first click anywhere (browsers require a gesture). Pauses when the tab is hidden.
 */
export function SoundToggle({ className = '' }: { className?: string }) {
  const [on, setOn] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const fade = useRef<number>(0);

  const getAudio = () => {
    if (!audio.current) {
      const a = new Audio();
      a.loop = true;
      a.preload = 'none';
      a.volume = 0;
      a.src = a.canPlayType('audio/webm; codecs="opus"') ? '/audio/kaasth-tabla-loop.webm' : '/audio/kaasth-tabla-loop.mp3';
      audio.current = a;
    }
    return audio.current;
  };

  const rampTo = (target: number, after?: () => void) => {
    const a = getAudio();
    cancelAnimationFrame(fade.current);
    const from = a.volume, start = performance.now();
    const step = (t: number) => {
      // rAF timestamps can be slightly earlier than performance.now(), so clamp to keep volume in [0, 1].
      const k = Math.min(1, Math.max(0, (t - start) / FADE_MS));
      a.volume = Math.min(1, Math.max(0, from + (target - from) * k));
      if (k < 1) fade.current = requestAnimationFrame(step);
      else after?.();
    };
    fade.current = requestAnimationFrame(step);
  };

  const start = async () => {
    const a = getAudio();
    try {
      await a.play();
      rampTo(VOLUME);
      setOn(true);
      writePref(true);
    } catch {
      setOn(false);
    }
  };

  const stop = () => {
    setOn(false);
    writePref(false);
    rampTo(0, () => audio.current?.pause());
  };

  useEffect(() => {
    if (!readPref()) return;
    const resume = () => void start();
    window.addEventListener('pointerdown', resume, { once: true });
    return () => window.removeEventListener('pointerdown', resume);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onVis = () => {
      const a = audio.current;
      if (!a || !on) return;
      if (document.hidden) a.pause(); else void a.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [on]);

  useEffect(() => () => { cancelAnimationFrame(fade.current); audio.current?.pause(); }, []);

  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={(e) => { e.stopPropagation(); if (on) stop(); else void start(); }}
      className={`group inline-flex items-center gap-2 rounded-pill px-3 py-2 text-caption02 font-medium uppercase tracking-[0.2em] text-foreground-secondary transition-colors duration-[var(--duration-ui)] hover:text-brand-accent-strong ${className}`}
    >
      <TablaIcon playing={on} />
      <span>Sound {on ? 'on' : 'off'}</span>
    </button>
  );
}
