import { siteConfig } from '@/content/site.config';
import { SectionHead } from './SectionHead';

/** Section 6: sample reviews. Slow marquee on desktop (pauses on hover), stacked on phones. */
export function Reviews() {
  const { reviews, reviewsNote } = siteConfig;
  const Card = ({ r }: { r: (typeof reviews)[number] }) => (
    <figure className="w-full shrink-0 rounded-card border border-border bg-background-tertiary p-8 md:w-[440px]">
      <blockquote className="font-display text-heading03 leading-snug text-foreground">“{r.quote}”</blockquote>
      <figcaption className="mt-6 text-body02 text-foreground-subtle">
        <span className="text-foreground">{r.name}</span>, {r.city} · <span className="text-brand-accent">{r.piece}</span>
      </figcaption>
    </figure>
  );
  return (
    <section aria-labelledby="reviews-title" className="overflow-hidden bg-background-secondary section-space">
      <div className="container-page">
        <SectionHead id="reviews-title" kicker="Kind words" deva="ग्राहकों की बात" title={<>Homes that <em className="text-brand-accent-strong">kept the story going.</em></>} />
        <p className="mt-4 text-caption01 uppercase tracking-[0.16em] text-foreground-subtle">{reviewsNote}</p>
      </div>
      <div className="marquee mt-12">
        <div className="marquee-track container-page md:max-w-none md:px-0">
          {reviews.map((r) => <Card key={r.name} r={r} />)}
          {/* Duplicate set keeps the desktop loop seamless; hidden from screen readers and phones. */}
          <div aria-hidden="true" className="marquee-dup">
            {reviews.map((r) => <Card key={`d-${r.name}`} r={r} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
