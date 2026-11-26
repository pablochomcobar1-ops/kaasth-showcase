import { siteConfig } from '@/content/site.config';
import { products } from '@/content/products';
import { formatPrice } from '@/lib/format';
import { JharokhaHero } from '@/components/home/JharokhaHero';
import { LanternReveal } from '@/components/motion/LanternReveal';

export default function Home() {
  const { brand } = siteConfig;
  const featured = products.filter((p) => p.featured).slice(0, 3);

  return (
    <main>
      <JharokhaHero />

      {/* Temporary section until Task 4 builds the rest of the home page. */}
      <section className="container-page section-space">
        <LanternReveal as="h2" className="text-heading01">Featured pieces</LanternReveal>
        <ul className="mt-12 grid gap-4 sm:grid-cols-3">
          {featured.map((p) => (
            <li key={p.slug} className="rounded-card border border-border bg-background-tertiary p-6">
              <p className="text-caption01 uppercase tracking-[0.16em] text-foreground-subtle">{brand.collections[p.collection].name}</p>
              <h3 className="mt-3 text-heading03">{p.name}</h3>
              <p className="mt-2 text-body02">{p.passport.wood} · {p.passport.artisanHours} artisan hours</p>
              <p className="mt-4 text-body02 text-brand-accent-strong">{formatPrice(p.priceFrom)}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
