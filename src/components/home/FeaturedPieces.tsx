import Link from 'next/link';
import { products } from '@/content/products';
import { siteConfig } from '@/content/site.config';
import { formatPrice } from '@/lib/format';
import { pickFeatured } from '@/lib/featured';
import { ProductImage } from '@/components/catalogue/ProductImage';
import { BrassLink } from '@/components/motion/BrassLink';
import { SectionHead } from './SectionHead';
import { Spotlight } from './Spotlight';

/** Section 3: horizontal rail of 6 featured pieces on a gallery-spotlight background. */
export function FeaturedPieces() {
  const items = pickFeatured(products, 6);
  const { collections } = siteConfig.brand;
  return (
    <section aria-labelledby="featured-title" className="relative bg-background-secondary">
      <Spotlight className="section-space">
        <div className="container-page flex flex-wrap items-end justify-between gap-6">
          <SectionHead id="featured-title" kicker="Featured pieces" deva="चुनिंदा" title={<>Pieces worth <em className="text-brand-accent-strong">passing on.</em></>} />
          <BrassLink href="/products">View all 24 pieces</BrassLink>
        </div>
        <div role="region" aria-label="Featured pieces, scroll sideways" tabIndex={0} className="rail mt-12 focus-visible:outline-none">
          <ul className="rail-track">
            {items.map((p) => (
              <li key={p.slug} data-testid="featured-card" className="rail-item">
                <Link href={`/products/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-background-tertiary shadow-[var(--shadow-card)]">
                    <div className="absolute inset-0 transition-transform duration-[var(--duration-cinematic)] ease-[var(--ease-unveil)] group-hover:scale-[1.05]">
                      <ProductImage product={p} sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 78vw" />
                    </div>
                    <span className="absolute left-3 top-3 rounded-pill bg-background/70 px-3 py-1 text-caption02 uppercase tracking-[0.2em] text-foreground backdrop-blur">
                      {collections[p.collection].name}
                    </span>
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-3">
                    <h3 className="text-heading03">{p.name}</h3>
                    {p.nameDeva && <span lang="hi" className="font-deva text-body02 text-brand-accent">{p.nameDeva}</span>}
                  </div>
                  <p className="mt-1 text-body02 text-foreground-subtle">{p.passport.wood} · {p.passport.artisanHours} artisan hours</p>
                  <p className="mt-3 text-body02 text-brand-accent-strong">{formatPrice(p.priceFrom)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Spotlight>
    </section>
  );
}
