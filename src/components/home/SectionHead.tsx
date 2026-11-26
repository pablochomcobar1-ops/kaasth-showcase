import { LanternReveal } from '@/components/motion/LanternReveal';

/** Kicker (English · Devanagari) + display heading used by every home section. */
export function SectionHead({ kicker, deva, title, id, align = 'left' }: { kicker: string; deva: string; title: React.ReactNode; id: string; align?: 'left' | 'center' }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="text-caption01 uppercase tracking-[0.16em] text-brand-accent">
        {kicker} <span aria-hidden="true">·</span> <span lang="hi" className="font-deva normal-case tracking-normal">{deva}</span>
      </p>
      <LanternReveal as="h2" className="mt-4 text-heading01">
        <span id={id}>{title}</span>
      </LanternReveal>
    </div>
  );
}
