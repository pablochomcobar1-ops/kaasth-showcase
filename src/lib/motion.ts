'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

let registered = false;
/** Register GSAP plugins once (client only). */
export function registerGsap() {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  registered = true;
}

/** Motion language from docs/DESIGN.md, as GSAP eases and seconds. */
export const EASE = { unveil: 'expo.out', drift: 'power2.inOut', press: 'power3.out' } as const;
export const DURATION = { micro: 0.18, ui: 0.32, reveal: 0.9, cinematic: 1.4 } as const;

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function hasFinePointer(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
