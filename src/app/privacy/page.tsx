import type { Metadata } from 'next';
import { siteConfig } from '@/content/site.config';

export const metadata: Metadata = { title: 'Privacy', description: 'What Kaasth collects when you enquire or book a visit, why, and how to reach us about it.' };

/** Plain-language privacy notice in the spirit of India's DPDP Act 2023. Demo mode says plainly that nothing is stored. */
export default function PrivacyPage() {
  const { contact, mode } = siteConfig;
  const h2 = 'mt-14 text-heading02';
  const p = 'mt-4 text-body01 text-foreground-secondary';
  return (
    <article className="container-page max-w-[760px] pb-[clamp(80px,10vw,160px)] pt-[clamp(120px,13vw,170px)]">
      <p className="text-caption01 uppercase tracking-[0.16em] text-brand-accent">Privacy <span aria-hidden="true">·</span> <span lang="hi" className="font-deva normal-case tracking-normal">गोपनीयता</span></p>
      <h1 className="mt-4 text-hero02">Your details, <em className="text-brand-accent-strong">kept simple.</em></h1>
      <p className="mt-6 text-body02 text-foreground-subtle">Last updated 27 November 2026</p>

      {mode === 'demo' && (
        <div role="note" className="mt-10 rounded-card border border-brand-accent/40 bg-background-tertiary p-6">
          <p className="text-body01 text-foreground"><strong className="font-medium text-brand-accent-strong">This is a concept demo by BSX Agency.</strong> Kaasth is a made-up brand. Forms on this site check what you type and then show a success message, but nothing is sent, saved or shared.</p>
        </div>
      )}

      <h2 className={h2}>What we collect</h2>
      <p className={p}>Only what you type into a form: your name, mobile number, an optional email, the piece you asked about or the visit date and time you chose, and any message. We do not ask for anything else.</p>

      <h2 className={h2}>Why we collect it</h2>
      <p className={p}>To reply to your enquiry or confirm your showroom visit, and nothing more. We do not sell your details, and we do not use them for advertising.</p>

      <h2 className={h2}>Your consent</h2>
      <p className={p}>Every form has a tick box. We only contact you if you tick it. You can withdraw your consent at any time by writing to us, and we will stop.</p>

      <h2 className={h2}>How long we keep it</h2>
      <p className={p}>Enquiries and bookings are deleted 12 months after our last conversation with you, or sooner if you ask.</p>

      <h2 className={h2}>Cookies and tracking</h2>
      <p className={p}>None. This site sets no advertising or analytics cookies, and the map is a drawing, not an embedded Google Map. The sound toggle remembers your choice only in your own browser.</p>

      <h2 className={h2}>Your rights</h2>
      <p className={p}>You can ask to see, correct or delete the details we hold about you, or raise a concern. We reply within 7 days.</p>

      <h2 className={h2}>Contact</h2>
      <p className={p}>Write to <a className="brass-link text-foreground" href={`mailto:${contact.email}`}>{contact.email}</a> or call <a className="brass-link text-foreground" href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>.</p>
    </article>
  );
}
