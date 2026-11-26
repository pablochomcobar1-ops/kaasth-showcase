import type { Metadata } from 'next';
import { siteConfig } from '@/content/site.config';
import { visitDateBounds } from '@/lib/visit-date';
import { LanternReveal } from '@/components/motion/LanternReveal';
import { BookingForm } from '@/components/contact/BookingForm';
import { SurveyMap } from '@/components/contact/SurveyMap';
import { bookVisit } from './actions';

export const metadata: Metadata = {
  title: 'Contact & visit',
  description: 'Book a showroom visit in Ahmedabad (Tuesday to Sunday, 11:00 to 19:00), or reach us on WhatsApp, phone or email.',
};

export default function ContactPage() {
  const { contact } = siteConfig;
  const { min, max } = visitDateBounds();
  const tel = contact.phone.replace(/\s/g, '');
  const tiles = [
    { k: 'WhatsApp', v: 'Chat with us', href: `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent('Hi Kaasth, I have a question.')}`, ext: true },
    { k: 'Call', v: contact.phone, href: `tel:${tel}` },
    { k: 'Email', v: contact.email, href: `mailto:${contact.email}` },
  ];
  return (
    <>
      <header className="container-page pb-14 pt-[clamp(120px,13vw,170px)]">
        <p className="text-caption01 uppercase tracking-[0.16em] text-brand-accent">Contact <span aria-hidden="true">·</span> <span lang="hi" className="font-deva normal-case tracking-normal">संपर्क</span></p>
        <LanternReveal as="h1" onScroll={false} className="mt-4 max-w-3xl text-hero02">Come and <em className="text-brand-accent-strong">sit on it first.</em></LanternReveal>
        <ul className="mt-12 grid gap-4 sm:grid-cols-3">
          {tiles.map((t) => (
            <li key={t.k}>
              <a href={t.href} {...(t.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="group flex items-center justify-between rounded-card border border-border bg-background-tertiary px-6 py-5 transition-colors duration-[var(--duration-ui)] hover:border-brand-accent">
                <span>
                  <span className="block text-caption02 uppercase tracking-[0.2em] text-brand-accent">{t.k}</span>
                  <span className="mt-1 block text-body01 text-foreground">{t.v}</span>
                </span>
                <span aria-hidden="true" className="text-brand-accent transition-transform duration-[var(--duration-ui)] group-hover:translate-x-1">→</span>
              </a>
            </li>
          ))}
        </ul>
      </header>

      <section id="book" aria-labelledby="book-title" className="container-page scroll-mt-24 grid gap-16 pb-[clamp(80px,10vw,160px)] lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <div>
          <h2 id="book-title" className="text-heading01">Book a <em className="text-brand-accent-strong">showroom visit</em></h2>
          <p className="mt-3 max-w-md text-body01 text-foreground-secondary">Pick a day and time. We keep the pieces you are curious about out on the floor, and the chai hot.</p>
          <div className="mt-10"><BookingForm action={bookVisit} min={min} max={max} demo={siteConfig.mode === 'demo'} /></div>
        </div>
        <aside aria-label="Showroom address and hours" className="lg:pt-2">
          <SurveyMap />
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <address className="not-italic">
              <p className="text-caption02 uppercase tracking-[0.2em] text-brand-accent">Showroom</p>
              <p className="mt-2 text-body01 text-foreground">{contact.address.map((l) => <span key={l} className="block">{l}</span>)}</p>
            </address>
            <div>
              <p className="text-caption02 uppercase tracking-[0.2em] text-brand-accent">Hours</p>
              <p className="mt-2 text-body01 text-foreground">{contact.hours}</p>
              <p className="text-body02 text-foreground-secondary">{contact.closedDay}</p>
            </div>
          </div>
          <a href={contact.directionsUrl} target="_blank" rel="noopener noreferrer" className="brass-link mt-8 inline-block text-body01">Get directions</a>
        </aside>
      </section>
    </>
  );
}
