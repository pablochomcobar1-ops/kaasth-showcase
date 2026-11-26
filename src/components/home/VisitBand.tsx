import { siteConfig } from '@/content/site.config';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { LanternReveal } from '@/components/motion/LanternReveal';

/** Section 7: "Chai pe milte hain." inside a glowing jharokha doorway (the logo arch, lit from inside). */
export function VisitBand() {
  const { contact } = siteConfig;
  return (
    <section aria-labelledby="visit-title" className="relative overflow-hidden section-space">
      <svg aria-hidden="true" viewBox="0 0 400 520" className="doorway pointer-events-none absolute left-1/2 top-1/2 h-[118%] -translate-x-1/2 -translate-y-1/2">
        <defs>
          <radialGradient id="door-glow" cx="0.5" cy="0.72" r="0.62">
            <stop offset="0" stopColor="#E9C88F" stopOpacity="0.34" />
            <stop offset="0.55" stopColor="#C9A46A" stopOpacity="0.12" />
            <stop offset="1" stopColor="#C9A46A" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d="M30 520 V200 Q30 70 200 14 Q370 70 370 200 V520" fill="url(#door-glow)" stroke="#C9A46A" strokeOpacity="0.45" strokeWidth="1.2" />
        <path d="M58 520 V210 Q58 98 200 48 Q342 98 342 210 V520" fill="none" stroke="#C9A46A" strokeOpacity="0.18" strokeWidth="1" />
      </svg>
      <div className="container-page relative text-center">
        <p className="text-caption01 uppercase tracking-[0.16em] text-brand-accent">Visit the showroom <span aria-hidden="true">·</span> <span lang="hi" className="font-deva normal-case tracking-normal">पधारो</span></p>
        <LanternReveal as="h2" className="mt-5 text-hero02 italic">
          <span id="visit-title">Chai pe milte hain.</span>
        </LanternReveal>
        <p className="mx-auto mt-5 max-w-md text-body01 text-foreground-secondary">
          Sit on the divan, open the drawers, smell the teak. {contact.hours}. {contact.closedDay}.
        </p>
        <div className="mt-10"><MagneticButton href="/contact#book">Book a showroom visit</MagneticButton></div>
      </div>
    </section>
  );
}
