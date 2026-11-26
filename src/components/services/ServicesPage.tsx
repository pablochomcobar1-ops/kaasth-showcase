import Image from 'next/image';
import { siteConfig } from '@/content/site.config';
import { firstExisting } from '@/lib/media';
import { ArchWipe } from '@/components/motion/ArchWipe';
import { LanternReveal } from '@/components/motion/LanternReveal';
import { VisitBand } from '@/components/home/VisitBand';

/** Owner photo first (public/services/service-{id}.webp), then a stand-in from assets we already have. */
const IMAGE: Record<string, string[]> = {
  custom: ['/services/service-custom.webp', '/products/walnut-lounge-chair-1.webp'],
  restoration: ['/services/service-restoration.webp', '/video/heirloom-craft-poster.jpg'],
  styling: ['/services/service-styling.webp', '/renders/room-form-portrait.jpg'],
  delivery: ['/services/service-delivery.webp', '/renders/room-heirloom-portrait.jpg'],
};

function ServiceImage({ id, title, sizes }: { id: string; title: string; sizes: string }) {
  const src = firstExisting(...(IMAGE[id] ?? []));
  return src
    ? <Image src={src} alt={title} fill sizes={sizes} className="object-cover" />
    : <div role="img" aria-label={title} className="absolute inset-0 bg-gradient-to-br from-[#6b4630] to-[#24170f]" />;
}

/** /services: arch menu of the four services, then one alternating row per service with its 3 steps. */
export function ServicesPage() {
  const { services } = siteConfig;
  return (
    <>
      <header className="container-page pb-16 pt-[clamp(120px,13vw,170px)]">
        <p className="text-caption01 uppercase tracking-[0.16em] text-brand-accent">Services <span aria-hidden="true">·</span> <span lang="hi" className="font-deva normal-case tracking-normal">सेवाएँ</span></p>
        <LanternReveal as="h1" onScroll={false} className="mt-4 max-w-3xl text-hero02">Four ways we <em className="text-brand-accent-strong">work with you.</em></LanternReveal>
        <nav aria-label="Services" className="mt-12">
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {services.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="group block">
                  <div aria-hidden="true" className="arch-frame relative aspect-[3/4] overflow-hidden bg-background-tertiary">
                    <div className="absolute inset-0 transition-transform duration-[var(--duration-cinematic)] ease-[var(--ease-unveil)] group-hover:scale-[1.06]">
                      <ServiceImage id={s.id} title="" sizes="(min-width: 768px) 22vw, 45vw" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent" />
                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-display text-heading03 text-foreground/80">0{i + 1}</span>
                  </div>
                  <p className="mt-4 text-body02 text-foreground transition-colors duration-[var(--duration-ui)] group-hover:text-brand-accent-strong">{s.title}</p>
                  <p lang="hi" className="font-deva text-body02 text-brand-accent">{s.titleDeva}</p>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {services.map((s, i) => (
        <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="container-page scroll-mt-24 section-space">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-20">
            <ArchWipe className={`arch-frame relative aspect-[3/4] max-h-[78svh] overflow-hidden bg-background-tertiary ${i % 2 ? 'md:order-2' : ''}`}>
              <ServiceImage id={s.id} title={s.title} sizes="(min-width: 768px) 45vw, 92vw" />
            </ArchWipe>
            <div>
              <p aria-hidden="true" className="font-display text-hero02 leading-none text-brand-accent/60">0{i + 1}</p>
              <LanternReveal as="h2" className="mt-4 text-heading01"><span id={`${s.id}-title`}>{s.title}</span></LanternReveal>
              <p lang="hi" className="mt-2 font-deva text-heading03 text-brand-accent">{s.titleDeva}</p>
              <p className="mt-5 max-w-md text-body01 text-foreground-secondary">{s.line}</p>
              <ol className="mt-10 grid max-w-md border-t border-border">
                {s.steps.map((step, k) => (
                  <li key={step} className="flex items-baseline gap-5 border-b border-border py-5">
                    <span className="shrink-0 text-caption02 uppercase tracking-[0.2em] text-brand-accent">Step {k + 1}</span>
                    <span className="text-body01 text-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      ))}
      <VisitBand />
    </>
  );
}
