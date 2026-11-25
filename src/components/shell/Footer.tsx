import { siteConfig } from '@/content/site.config';
import { BrassLink } from '@/components/motion/BrassLink';

export function Footer() {
  const { brand, contact, nav } = siteConfig;
  const year = 2026;
  return (
    <footer className="relative border-t border-border-subtle">
      <div className="container-page grid gap-14 py-20 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <img src="/brand/kaasth-stacked-reversed-transparent.svg" alt={brand.name} width={150} height={123} className="h-auto w-[150px]" />
          <p className="mt-6 font-display text-heading03 italic text-foreground">{brand.tagline}</p>
          <p className="mt-2 font-deva text-body01 text-brand-accent-strong">चाय पे मिलते हैं।</p>
        </div>
        <div>
          <h2 className="font-sans text-caption01 font-medium uppercase tracking-[0.16em] text-foreground-subtle">Explore</h2>
          <ul className="mt-5 space-y-3">
            {nav.map((n) => (
              <li key={n.href}><BrassLink href={n.href} className="text-body02 text-foreground-secondary hover:text-foreground">{n.label}</BrassLink></li>
            ))}
            <li><BrassLink href="/privacy" className="text-body02 text-foreground-secondary hover:text-foreground">Privacy</BrassLink></li>
          </ul>
        </div>
        <div>
          <h2 className="font-sans text-caption01 font-medium uppercase tracking-[0.16em] text-foreground-subtle">Visit</h2>
          <address className="mt-5 space-y-1 text-body02 not-italic">
            {contact.address.map((line) => <p key={line}>{line}</p>)}
          </address>
          <p className="mt-4 text-body02">{contact.hours}</p>
          <p className="text-body02 text-foreground-subtle">{contact.closedDay}</p>
        </div>
        <div>
          <h2 className="font-sans text-caption01 font-medium uppercase tracking-[0.16em] text-foreground-subtle">Talk to us</h2>
          <ul className="mt-5 space-y-3 text-body02">
            <li><a className="brass-link text-foreground" href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a></li>
            <li><a className="brass-link text-foreground" href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp us</a></li>
            <li><a className="brass-link text-foreground" href={`mailto:${contact.email}`}>{contact.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-border-subtle pb-20 pt-6 md:pb-8 text-caption02 uppercase tracking-[0.2em] text-foreground-subtle md:flex-row md:justify-between">
        <p>© {year} {brand.name} · fictional brand for a concept demo</p>
        <p>{siteConfig.credit}</p>
      </div>
    </footer>
  );
}
