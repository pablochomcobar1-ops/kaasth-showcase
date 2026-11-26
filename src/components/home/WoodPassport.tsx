import { products } from '@/content/products';
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
  const rows: [string, string][] = [
    ['Wood', pp.wood], ['Joinery', pp.joinery], ['Artisan hours', String(pp.artisanHours)],
    ['Finish', pp.finish], ['Termite treated', pp.termiteTreated ? 'Yes' : 'No'], ['Warranty', `${pp.warrantyYears} years`],
  ];
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
          <article data-card aria-label={`Wood Passport for ${p.name}`} className="order-1 mx-auto w-full max-w-[340px] rotate-[-1.5deg] rounded-card bg-paper p-7 text-foreground-on-paper shadow-[0_30px_80px_rgb(0_0_0/0.55)] lg:order-2">
            <div className="flex items-start justify-between border-b border-foreground-on-paper/20 pb-4">
              <div>
                <p className="text-caption02 uppercase tracking-[0.2em]">Wood Passport</p>
                <p lang="hi" className="font-deva text-body02">काष्ठ पत्र</p>
              </div>
              <span aria-hidden="true" className="grid size-14 rotate-[-12deg] place-items-center rounded-full border-2 border-[#9b3b2a]/60 text-center text-[8px] font-semibold uppercase leading-tight tracking-[0.12em] text-[#9b3b2a]/80">Kaasth<br />1962</span>
            </div>
            <h3 className="mt-4 font-display text-heading03 text-foreground-on-paper">{p.name}</h3>
            <p className="text-caption02 uppercase tracking-[0.2em] opacity-60">No. KST-0041 · {p.provenance?.region ?? 'Ahmedabad'}</p>
            <dl className="mt-5 grid gap-2 text-body02">
              {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-dashed border-foreground-on-paper/15 pb-2">
                  <dt className="opacity-70">{k}</dt><dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 font-display text-body01 italic opacity-80">Signed, Ramesh-bhai · karigar</p>
          </article>
          <ul className="order-3 grid gap-8">{facts.filter((f) => f.side === 'right').map((f, i) => <Fact key={f.k} f={f} i={i + 3} />)}</ul>
        </DrawIn>
      </div>
    </section>
  );
}
