import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products } from '@/content/products';
import { siteConfig } from '@/content/site.config';
import { CATEGORY_LABEL } from '@/content/labels';
import { formatPrice } from '@/lib/format';
import { ProductImage } from '@/components/catalogue/ProductImage';
import { ProductCard } from '@/components/catalogue/ProductCard';
import { PassportCard, passportNumber } from '@/components/catalogue/PassportCard';
import { EnquiryDialog } from '@/components/catalogue/EnquiryDialog';
import { BrassLink } from '@/components/motion/BrassLink';
import { submitEnquiry } from './actions';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  return p ? { title: p.name, description: p.blurb } : {};
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const index = products.findIndex((x) => x.slug === slug);
  const p = products[index];
  if (!p) notFound();

  const { collections } = siteConfig.brand;
  const { contact } = siteConfig;
  const wa = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(`Hi Kaasth, I'd like to know more about the ${p.name}.`)}`;
  const related = products.filter((x) => x.collection === p.collection && x.slug !== p.slug).slice(0, 3);
  const { w, d, h } = p.dimensionsCm;

  return (
    <>
      <section className="container-page pb-20 pt-[clamp(110px,12vw,150px)]">
        <nav aria-label="Breadcrumb" className="text-caption01 uppercase tracking-[0.16em] text-foreground-subtle">
          <Link href="/products" className="hover:text-foreground">Products</Link>
          <span aria-hidden="true"> / </span>
          <Link href={`/products?collection=${p.collection}`} className="hover:text-foreground">{collections[p.collection].name}</Link>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div className="arch-frame relative aspect-[4/5] overflow-hidden bg-background-tertiary">
            <ProductImage product={p} sizes="(min-width: 1024px) 50vw, 92vw" />
          </div>

          <div className="lg:pt-10">
            <p className="text-caption01 uppercase tracking-[0.16em] text-brand-accent">
              {collections[p.collection].name} <span aria-hidden="true">·</span>{' '}
              <span lang="hi" className="font-deva normal-case tracking-normal">{collections[p.collection].nameDeva}</span>
              <span aria-hidden="true"> · </span>{CATEGORY_LABEL[p.category]}
            </p>
            <h1 className="mt-4 text-hero02">{p.name}</h1>
            {p.nameDeva && <p lang="hi" className="mt-2 font-deva text-heading03 text-brand-accent-strong">{p.nameDeva}</p>}
            <p className="mt-6 font-display text-heading02 text-brand-accent-strong">{formatPrice(p.priceFrom)}</p>
            <p className="mt-6 max-w-lg text-body01 text-foreground-secondary">{p.blurb}</p>

            <dl className="mt-8 grid max-w-lg grid-cols-3 border-y border-border py-5 text-center">
              {[['Width', w], ['Depth', d], ['Height', h]].map(([k, v]) => (
                <div key={k}><dt className="text-caption02 uppercase tracking-[0.2em] text-foreground-subtle">{k}</dt><dd className="mt-1 font-display text-heading03">{v} cm</dd></div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <EnquiryDialog action={submitEnquiry} productSlug={p.slug} productName={p.name} demo={siteConfig.mode === 'demo'} />
              <a href={wa} target="_blank" rel="noopener noreferrer" className="brass-link text-body02">Ask on WhatsApp</a>
            </div>
            <p className="mt-5 text-body02 text-foreground-subtle">Or <BrassLink href="/contact#book">book a showroom visit</BrassLink> to sit on it first.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="papers-title" className="drawing-grid relative overflow-hidden section-space">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-caption01 uppercase tracking-[0.16em] text-brand-accent">Its papers <span aria-hidden="true">·</span> <span lang="hi" className="font-deva normal-case tracking-normal">काष्ठ पत्र</span></p>
            <h2 id="papers-title" className="mt-4 text-heading01">Know exactly <em className="text-brand-accent-strong">what you are buying.</em></h2>
            {p.provenance ? (
              <div className="mt-8 max-w-md border-l border-brand-accent/50 pl-6">
                <p className="text-caption02 uppercase tracking-[0.2em] text-brand-accent">Provenance</p>
                <dl className="mt-3 grid gap-2 text-body02 text-foreground-secondary">
                  <div><dt className="inline text-foreground">Era: </dt><dd className="inline">{p.provenance.era}</dd></div>
                  <div><dt className="inline text-foreground">From: </dt><dd className="inline">{p.provenance.region}</dd></div>
                  <div><dt className="inline text-foreground">Restored: </dt><dd className="inline">{p.provenance.restored}</dd></div>
                </dl>
              </div>
            ) : (
              <p className="mt-6 max-w-md text-body01 text-foreground-secondary">Made to order in our Ahmedabad workshop. The passport travels with the piece, so the next owner knows its story too.</p>
            )}
          </div>
          <PassportCard product={p} number={passportNumber(index)} className="mx-auto rotate-[1.5deg]" />
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="container-page section-space">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="related-title" className="text-heading01">You may <em className="text-brand-accent-strong">also like</em></h2>
            <BrassLink href={`/products?collection=${p.collection}`}>All {collections[p.collection].name} pieces</BrassLink>
          </div>
          <ul className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => <li key={r.slug}><ProductCard product={r} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" /></li>)}
          </ul>
        </section>
      )}
    </>
  );
}
