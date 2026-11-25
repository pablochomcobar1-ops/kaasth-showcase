'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { siteConfig } from '@/content/site.config';
import { SoundToggle } from './SoundToggle';

/** Full-screen menu for phones and tablets. Radix Dialog gives focus trap, Escape to close and scroll lock. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  const { contact, brand } = siteConfig;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className="inline-flex size-11 items-center justify-center rounded-pill border border-border text-foreground lg:hidden"
        aria-label="Open menu"
      >
        <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M0 1h18M6 11h12" /></svg>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content className="mobile-menu fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-background px-[var(--gutter)] pb-10 pt-6">
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-deva text-heading03 text-brand-accent-strong">{brand.nameDeva}</Dialog.Title>
            <Dialog.Close className="inline-flex size-11 items-center justify-center rounded-pill border border-border text-foreground" aria-label="Close menu">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1l12 12M13 1L1 13" /></svg>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Site navigation and contact details</Dialog.Description>
          <ul className="mt-14 flex flex-col gap-2">
            {[{ label: 'Home', href: '/' }, ...siteConfig.nav].map((item, i) => (
              <li key={item.href} className="menu-item" style={{ '--i': i } as React.CSSProperties}>
                <Link href={item.href} className="block py-2 font-display text-hero02 text-foreground">{item.label}</Link>
              </li>
            ))}
          </ul>
          <Link href="/contact#book" className="mt-10 inline-flex w-fit rounded-pill bg-brand-accent px-6 py-4 text-caption01 font-medium uppercase tracking-[0.14em] text-background">
            Book a showroom visit
          </Link>
          <div className="mt-auto space-y-1 pt-12 text-body02">
            <p className="text-foreground">{contact.phone}</p>
            <p>{contact.hours}</p>
            <p className="text-foreground-subtle">{contact.closedDay}</p>
            <SoundToggle className="-ml-3 mt-4" />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
