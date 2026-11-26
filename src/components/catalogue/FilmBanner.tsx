import { LoopVideo } from '@/components/home/LoopVideo';
import { LanternReveal } from '@/components/motion/LanternReveal';

/** Products page banner: the modern-room film loops behind the title (muted, paused off-screen). */
export function FilmBanner() {
  return (
    <header className="relative flex min-h-[62svh] items-end overflow-hidden pb-14 pt-[140px] md:min-h-[70svh] md:pb-20">
      <LoopVideo src="/video/form-room" poster="/video/form-room-poster.jpg" label="A calm modern living room with solid wood furniture in afternoon sun" className="absolute inset-0 size-full object-cover" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgb(18_13_9/0.88),rgb(18_13_9/0.25)_65%),linear-gradient(transparent_45%,var(--color-background))]" />
      <div className="container-page relative">
        <p className="text-caption01 uppercase tracking-[0.16em] text-brand-accent">
          The collection <span aria-hidden="true">·</span> <span lang="hi" className="font-deva normal-case tracking-normal">संग्रह</span>
        </p>
        <LanternReveal as="h1" onScroll={false} className="mt-4 max-w-3xl text-hero02">
          Twenty-four pieces. <em className="text-brand-accent-strong">Each with papers.</em>
        </LanternReveal>
        <p className="mt-5 max-w-lg text-body01 text-foreground-secondary">Restored heirlooms and modern solid wood, side by side. Filter by collection, room or wood, then come and sit on them.</p>
      </div>
    </header>
  );
}
