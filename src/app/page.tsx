import { siteConfig } from '@/content/site.config';
import { products } from '@/content/products';
import { formatPrice } from '@/lib/format';

/** Temporary home (Stage 4 · Task 1): proves fonts, tokens and content load. Replaced by the real hero in Task 3. */
export default function Home() {
  const { brand } = siteConfig;
  const featured = products.filter((p) => p.featured).slice(0, 3);

  return (
    <main className="container-page section-space">
      <img src="/brand/kaasth-horizontal-reversed-transparent.svg" alt={`${brand.name} logo`} width={260} height={64} className="h-14 w-auto" />

      <p className="mt-16 font-deva text-heading02 text-brand-accent-strong">
        {brand.collections.heirloom.nameDeva} · {brand.collections.form.nameDeva}
      </p>
      <h1 className="mt-4 text-hero01">
        Made to be <em className="text-brand-accent-strong">inherited.</em>
      </h1>
      <p className="mt-6 max-w-[62ch]">
        Hand-carved heirlooms and modern solid wood, from one {brand.city} workshop since {brand.established}.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <a href="#" className="rounded-pill bg-brand-accent px-6 py-4 text-caption01 font-medium uppercase tracking-[0.14em] text-background">
          Book a showroom visit
        </a>
        <a href="#" className="rounded-pill border border-brand-accent px-6 py-4 text-caption01 font-medium uppercase tracking-[0.14em] text-brand-accent-strong">
          Book a visit
        </a>
      </div>

      <ul className="mt-20 grid gap-4 sm:grid-cols-3">
        {featured.map((p) => (
          <li key={p.slug} className="rounded-card border border-border bg-background-tertiary p-6">
            <p className="text-caption01 uppercase tracking-[0.16em] text-foreground-subtle">{brand.collections[p.collection].name}</p>
            <h2 className="mt-3 text-heading03">{p.name}</h2>
            <p className="mt-2 text-body02">{p.passport.wood} · {p.passport.artisanHours} artisan hours</p>
            <p className="mt-4 text-body02 text-brand-accent-strong">{formatPrice(p.priceFrom)}</p>
          </li>
        ))}
      </ul>

      <footer className="mt-24 border-t border-border-subtle pt-6 text-caption02 uppercase tracking-[0.2em] text-foreground-subtle">
        {siteConfig.demoBadge} · {siteConfig.credit} · Stage 4 · Task 1 scaffold
      </footer>
    </main>
  );
}
