import { LanternReveal } from '@/components/motion/LanternReveal';
import { LoopVideo } from './LoopVideo';
import { Parallax } from './Parallax';
import { SectionHead } from './SectionHead';

const STEPS = [
  { n: '01', t: 'Find', d: 'We travel through Shekhawati and Kutch for pieces with a past, and wood worth saving.' },
  { n: '02', t: 'Restore', d: 'Joints are re-cut, cane re-woven, carving cleaned with soft brushes. Never sanded flat.' },
  { n: '03', t: 'Pass on', d: 'Waxed by hand, given its Wood Passport, and delivered with chai and its story.' },
];

/** Section 5: full-bleed craft film with three numbered steps. */
export function HeirloomStory() {
  return (
    <section aria-labelledby="story-title" className="section-space">
      <div className="container-page">
        <SectionHead id="story-title" kicker="Heirloom story" deva="कारीगरी" title={<>Restored by hand, <em className="text-brand-accent-strong">not by machine.</em></>} />
      </div>
      <Parallax className="relative mt-12 h-[62svh] min-h-[340px] md:h-[78svh]">
        <div className="absolute inset-x-0 -inset-y-[10%]">
          <LoopVideo src="/video/heirloom-craft" poster="/video/heirloom-craft-poster.jpg" label="Sunlight falling on a hand-carved wooden chest in the workshop" className="size-full object-cover" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </Parallax>
      <ol className="container-page -mt-16 relative grid gap-10 md:grid-cols-3 md:gap-8">
        {STEPS.map((s) => (
          <li key={s.n} className="border-t border-brand-accent/40 pt-6">
            <p className="font-display text-hero02 leading-none text-brand-accent/70">{s.n}</p>
            <LanternReveal as="h3" className="mt-3 text-heading02">{s.t}</LanternReveal>
            <p className="mt-3 max-w-sm text-body02 text-foreground-secondary">{s.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
