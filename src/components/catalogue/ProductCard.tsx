import Link from 'next/link';
import type { Product } from '@/content/schema';
import { siteConfig } from '@/content/site.config';
import { formatPrice } from '@/lib/format';
import { ProductImage } from './ProductImage';

/** Product card shared by the home rail and the catalogue grid. */
export function ProductCard({ product: p, sizes }: { product: Product; sizes: string }) {
  const { collections } = siteConfig.brand;
  return (
    <Link href={`/products/${p.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-background-tertiary shadow-[var(--shadow-card)]">
        <div className="absolute inset-0 transition-transform duration-[var(--duration-cinematic)] ease-[var(--ease-unveil)] group-hover:scale-[1.05]">
          <ProductImage product={p} sizes={sizes} />
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
  );
}
