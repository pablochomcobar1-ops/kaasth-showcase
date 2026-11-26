import type { Product } from '@/content/schema';

/** The cream Wood Passport card: one per piece (home explainer + product page). */
export function PassportCard({ product: p, number, className = '' }: { product: Product; number: string; className?: string }) {
  const pp = p.passport;
  const rows: [string, string][] = [
    ['Wood', pp.wood], ['Joinery', pp.joinery], ['Artisan hours', String(pp.artisanHours)],
    ['Finish', pp.finish], ['Termite treated', pp.termiteTreated ? 'Yes' : 'No'], ['Warranty', `${pp.warrantyYears} years`],
  ];
  return (
    <article data-card aria-label={`Wood Passport for ${p.name}`} className={`w-full max-w-[360px] rounded-card bg-paper p-7 text-foreground-on-paper shadow-[0_30px_80px_rgb(0_0_0/0.55)] ${className}`}>
      <div className="flex items-start justify-between border-b border-foreground-on-paper/20 pb-4">
        <div>
          <p className="text-caption02 uppercase tracking-[0.2em]">Wood Passport</p>
          <p lang="hi" className="font-deva text-body02">काष्ठ पत्र</p>
        </div>
        <span aria-hidden="true" className="grid size-14 rotate-[-12deg] place-items-center rounded-full border-2 border-[#9b3b2a]/60 text-center text-[8px] font-semibold uppercase leading-tight tracking-[0.12em] text-[#9b3b2a]/80">Kaasth<br />1962</span>
      </div>
      <h3 className="mt-4 font-display text-heading03 text-foreground-on-paper">{p.name}</h3>
      <p className="text-caption02 uppercase tracking-[0.2em] opacity-60">No. {number} · {p.provenance?.region ?? 'Ahmedabad'}</p>
      <dl className="mt-5 grid gap-2 text-body02">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 border-b border-dashed border-foreground-on-paper/15 pb-2">
            <dt className="opacity-70">{k}</dt><dd className="text-right font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 font-display text-body01 italic opacity-80">Signed, Ramesh-bhai · karigar</p>
    </article>
  );
}

/** Stable passport number from the product's position in the catalogue. */
export const passportNumber = (index: number) => `KST-${String(41 + index).padStart(4, '0')}`;
