import type { Metadata } from 'next';
import Link from 'next/link';
import { BrassLink } from '@/components/motion/BrassLink';

export const metadata: Metadata = { title: 'Page not found' };

/** 404: an empty, softly lit jharokha doorway. "Yeh kamra khaali hai." = "This room is empty." */
export default function NotFound() {
  return (
    <section className="container-page grid items-center gap-10 pb-28 md:min-h-[100svh] md:gap-12 md:pb-20 pt-[clamp(120px,13vw,170px)] md:grid-cols-[1fr_1.1fr]">
      <svg aria-hidden="true" viewBox="0 0 300 380" className="doorway mx-auto w-full max-w-[170px] md:max-w-[300px]">
        <defs>
          <radialGradient id="nf-glow" cx="0.5" cy="0.78" r="0.7">
            <stop offset="0" stopColor="#E9C88F" stopOpacity="0.3" />
            <stop offset="1" stopColor="#E9C88F" stopOpacity="0" />
          </radialGradient>
          <pattern id="nf-jaali" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="none" stroke="#C9A46A" strokeOpacity="0.16" strokeWidth="1" />
          </pattern>
          <clipPath id="nf-arch"><path d="M40 380 V150 Q40 60 150 18 Q260 60 260 150 V380Z" /></clipPath>
        </defs>
        <g clipPath="url(#nf-arch)">
          <rect width="300" height="380" fill="url(#nf-glow)" />
          <rect width="300" height="380" fill="url(#nf-jaali)" />
          {/* light falling through onto the floor */}
          <path d="M70 380 L120 300 L180 300 L230 380Z" fill="#E9C88F" fillOpacity="0.08" />
        </g>
        <path d="M40 380 V150 Q40 60 150 18 Q260 60 260 150 V380" fill="none" stroke="#C9A46A" strokeOpacity="0.6" strokeWidth="1.4" />
        <path d="M20 380 V146 Q20 46 150 0 Q280 46 280 146 V380" fill="none" stroke="#C9A46A" strokeOpacity="0.2" strokeWidth="1" />
        <text x="150" y="214" textAnchor="middle" fill="#E9C88F" fillOpacity="0.85" fontFamily="var(--font-display), serif" fontSize="64">404</text>
      </svg>
      <div>
        <p lang="hi" className="font-deva text-heading02 text-brand-accent">यह कमरा खाली है।</p>
        <h1 className="mt-3 text-hero02">Yeh kamra <em className="text-brand-accent-strong">khaali hai.</em></h1>
        <p className="mt-5 max-w-md text-body01 text-foreground-secondary">This room is empty. The page may have moved, or the piece found a new home. Come back to the showroom floor.</p>
        <div className="mt-10 flex flex-wrap items-center gap-8">
          <Link href="/" className="rounded-pill bg-brand-accent px-7 py-4 text-caption01 font-medium uppercase tracking-[0.14em] text-background transition-colors duration-[var(--duration-ui)] hover:bg-brand-accent-strong">Back to home</Link>
          <BrassLink href="/products">Browse all pieces</BrassLink>
        </div>
      </div>
    </section>
  );
}
