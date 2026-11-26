import Image from 'next/image';
import { siteConfig } from '@/content/site.config';
import { firstExisting } from '@/lib/media';
import { LanternReveal } from '@/components/motion/LanternReveal';
import { BrassLink } from '@/components/motion/BrassLink';
import { Parallax } from '@/components/home/Parallax';
import { SectionHead } from '@/components/home/SectionHead';
import { VisitBand } from '@/components/home/VisitBand';
import { TreeRings } from './TreeRings';

const FACTS = [
  { n: '64', l: 'years in the same pol' },
  { n: '3', l: 'generations of karigars' },
  { n: '11', l: 'craftspeople today' },
  { n: '2,400+', l: 'pieces sent home with papers' },
];

const PROMISES = [
  { t: 'Honest wood', d: 'The passport names the exact wood. Never "wood finish", never veneer sold as solid.' },
  { t: 'Real joints', d: 'Mortise and tenon, dovetail, domino. The joinery is written down, so you can check it.' },
  { t: 'Looked after', d: 'Up to 10 years of warranty, and a free re-polish in year one.' },
];

/** /about: tree-ring story timeline, the workshop today, the Wood Passport promise, visit band. */
export function AboutPage() {
  const { story } = siteConfig;
  const oldPhoto = firstExisting('/about/about-1962.webp');
  const workshop = firstExisting('/about/about-workshop.webp', '/renders/room-heirloom.jpg');
  return (
    <>
      <header className="container-page grid items-end gap-12 pb-20 pt-[clamp(120px,13vw,170px)] lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="text-caption01 uppercase tracking-[0.16em] text-brand-accent">About <span aria-hidden="true">·</span> <span lang="hi" className="font-deva normal-case tracking-normal">हमारी कहानी</span></p>
          <LanternReveal as="h1" onScroll={false} className="mt-4 text-hero02">Three generations. <em className="text-brand-accent-strong">One workshop.</em></LanternReveal>
          <p className="mt-6 max-w-lg text-body01 text-foreground-secondary">
            Kaasth (काष्ठ) means wood in Sanskrit. Since 1962 our family has repaired, restored and built furniture in the same lane near Manek Chowk, Ahmedabad.
          </p>
        </div>
        {oldPhoto && (
          <figure className="relative mx-auto aspect-[4/5] w-full max-w-[320px] rotate-[2deg] bg-paper p-3 shadow-[0_30px_80px_rgb(0_0_0/0.55)]">
            <div className="relative size-full overflow-hidden"><Image src={oldPhoto} alt="The first Kaasth workshop in the pol, early 1960s" fill sizes="320px" className="object-cover" /></div>
            <figcaption className="absolute -bottom-8 left-0 right-0 text-center font-display text-body01 italic text-foreground-secondary">Manek Chowk, 1962</figcaption>
          </figure>
        )}
      </header>

      <section aria-labelledby="story-title" className="pb-[clamp(80px,10vw,160px)]">
        <div className="container-page mb-12 lg:mb-0">
          <SectionHead id="story-title" kicker="Our story" deva="सालों की परतें" title={<>Every year <em className="text-brand-accent-strong">adds a ring.</em></>} />
        </div>
        <TreeRings eras={story} />
      </section>

      <section aria-labelledby="workshop-title" className="section-space">
        {workshop && (
          <Parallax className="relative h-[56svh] min-h-[320px] md:h-[72svh]">
            <div className="absolute inset-x-0 -inset-y-[10%]">
              <Image src={workshop} alt="The Kaasth workshop with carved jaali window and workbenches" fill sizes="100vw" className="object-cover" />
            </div>
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-background/50" />
          </Parallax>
        )}
        <div className="container-page relative -mt-24">
          <SectionHead id="workshop-title" kicker="The workshop today" deva="कारख़ाना" title={<>Same lane. <em className="text-brand-accent-strong">Same hand tools.</em></>} />
          <dl className="mt-12 grid grid-cols-2 gap-8 border-t border-border pt-10 md:grid-cols-4">
            {FACTS.map((f) => (
              <div key={f.l}>
                <dt className="sr-only">{f.l}</dt>
                <dd className="font-display text-hero02 leading-none text-brand-accent-strong">{f.n}</dd>
                <dd className="mt-2 text-body02 text-foreground-secondary">{f.l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="promise-title" className="drawing-grid relative overflow-hidden section-space">
        <div className="container-page">
          <SectionHead id="promise-title" kicker="The Wood Passport promise" deva="हमारा वादा" title={<>Papers for <em className="text-brand-accent-strong">every piece.</em></>} />
          <ol className="mt-12 grid gap-10 md:grid-cols-3">
            {PROMISES.map((p, i) => (
              <li key={p.t} className="border-t border-brand-accent/40 pt-6">
                <p className="text-caption02 uppercase tracking-[0.2em] text-brand-accent">0{i + 1}</p>
                <h3 className="mt-3 text-heading03">{p.t}</h3>
                <p className="mt-3 text-body02 text-foreground-secondary">{p.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12"><BrassLink href="/products">See the pieces and their papers</BrassLink></div>
        </div>
      </section>
      <VisitBand />
    </>
  );
}
