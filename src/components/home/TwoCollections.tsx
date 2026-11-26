import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/content/site.config';
import { COLLECTIONS } from '@/content/schema';
import { ArchWipe } from '@/components/motion/ArchWipe';
import { SectionHead } from './SectionHead';

const IMG = { heirloom: '/renders/room-heirloom-portrait.jpg', form: '/renders/room-form-portrait.jpg' } as const;

/** Section 2: Heirloom · विरासत and Form · रूप, each behind an arch. */
export function TwoCollections() {
  const { collections } = siteConfig.brand;
  return (
    <section aria-labelledby="collections-title" className="container-page section-space">
      <SectionHead id="collections-title" kicker="Two collections" deva="दो संग्रह" title={<>Old soul or new form? <em className="text-brand-accent-strong">Or both.</em></>} />
      <ul className="mt-14 grid gap-10 md:grid-cols-2 md:gap-8">
        {COLLECTIONS.map((c, i) => (
          <li key={c} className={i === 1 ? 'md:mt-24' : ''}>
            <Link href={`/products?collection=${c}`} className="group block">
              <ArchWipe className="arch-frame relative aspect-[3/4]">
                <div className="absolute inset-0 transition-transform duration-[var(--duration-cinematic)] ease-[var(--ease-unveil)] group-hover:scale-[1.04]">
                  <Image src={IMG[c]} alt={`${collections[c].name} collection room`} fill sizes="(min-width: 768px) 45vw, 92vw" className="object-cover" />
                </div>
              </ArchWipe>
              <div className="mt-6 flex items-baseline justify-between gap-4">
                <h3 className="text-heading02">
                  {collections[c].name} <span lang="hi" className="font-deva text-heading03 text-brand-accent">{collections[c].nameDeva}</span>
                </h3>
                <span aria-hidden="true" className="text-brand-accent transition-transform duration-[var(--duration-ui)] group-hover:translate-x-1">→</span>
              </div>
              <p className="mt-2 text-body02 text-foreground-secondary">{collections[c].line}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
