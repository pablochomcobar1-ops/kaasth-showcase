import { products } from '@/content/products';
import { pickFeatured } from '@/lib/featured';
import { ProductCard } from '@/components/catalogue/ProductCard';
import { BrassLink } from '@/components/motion/BrassLink';
import { SectionHead } from './SectionHead';
import { Spotlight } from './Spotlight';

/** Section 3: horizontal rail of 6 featured pieces on a gallery-spotlight background. */
export function FeaturedPieces() {
  const items = pickFeatured(products, 6);
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
                <ProductCard product={p} sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 78vw" />
              </li>
            ))}
          </ul>
        </div>
      </Spotlight>
    </section>
  );
}
