import { products } from '@/content/products';
import { PassportCard, passportNumber } from '@/components/catalogue/PassportCard';
import { SectionHead } from './SectionHead';
import { DrawIn } from './DrawIn';

/** Section 4: the Wood Passport card on a carpenter's drawing grid, with 5 annotated facts. */
export function WoodPassport() {
  const p = products.find((x) => x.slug === 'sheesham-divan') ?? products[0];
  if (!p) return null;
  const pp = p.passport;
  const facts = [
    { side: 'left', k: 'The wood', v: `${pp.wood}, air-dried for two monsoons so it never warps.` },
    { side: 'left', k: 'The joint', v: `${pp.joinery}. No nails, no shortcuts.` },
    { side: 'left', k: 'The hands', v: `${pp.artisanHours} artisan hours, signed by the karigar who made it.` },
    { side: 'right', k: 'The finish', v: `${pp.finish}${pp.termiteTreated ? ', termite-treated' : ''}.` },
    { side: 'right', k: 'The promise', v: `${pp.warrantyYears}-year warranty, with free re-polish in year one.` },
  ] as const;
  const Fact = ({ f, i }: { f: (typeof facts)[number]; i: number }) => (
    <li data-fact className={`passport-fact relative ${f.side === 'left' ? 'lg:text-right' : ''}`} data-side={f.side}>
      <span data-line aria-hidden="true" className="passport-line" />
      <p className="text-caption02 uppercase tracking-[0.2em] text-brand-accent">0{i + 1} · {f.k}</p>
      <p className="mt-2 text-body02 text-foreground-secondary">{f.v}</p>
    </li>
  );
  return (
    <section aria-labelledby="passport-title" className="drawing-grid relative overflow-hidden section-space">
      <div className="container-page">
        <SectionHead align="center" id="passport-title" kicker="Wood Passport" deva="हर लकड़ी की अपनी कहानी" title={<>Every piece comes with <em className="text-brand-accent-strong">its own papers.</em></>} />
        <DrawIn className="mt-16 grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-16">
          <ul className="order-2 grid gap-8 lg:order-1">{facts.filter((f) => f.side === 'left').map((f, i) => <Fact key={f.k} f={f} i={i} />)}</ul>
          <PassportCard product={p} number={passportNumber(products.indexOf(p))} className="order-1 mx-auto rotate-[-1.5deg] lg:order-2" />
          <ul className="order-3 grid gap-8">{facts.filter((f) => f.side === 'right').map((f, i) => <Fact key={f.k} f={f} i={i + 3} />)}</ul>
        </DrawIn>
      </div>
    </section>
  );
}
