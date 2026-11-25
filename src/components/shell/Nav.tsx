'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { siteConfig } from '@/content/site.config';
import { BrassLink } from '@/components/motion/BrassLink';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { SoundToggle } from './SoundToggle';

/** Fixed top bar: transparent over the hero, blurred night once you scroll; hides on scroll down, returns on scroll up. */
export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 240 && y > last + 4 ? true : y < last - 4 ? false : (h) => h);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className={[
        'fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-[var(--duration-ui)] ease-[var(--ease-unveil)]',
        scrolled ? 'border-b border-border-subtle bg-background/75 backdrop-blur-md' : 'border-b border-transparent',
        hidden ? '-translate-y-full' : 'translate-y-0',
      ].join(' ')}
    >
      <nav aria-label="Main" className="container-page flex h-[72px] items-center justify-between gap-6 md:h-[84px]">
        <Logo />
        <ul className="hidden items-center gap-9 lg:flex">
          {siteConfig.nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <BrassLink
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`text-caption01 font-medium uppercase tracking-[0.16em] ${active ? 'text-brand-accent-strong' : 'text-foreground-secondary hover:text-foreground'}`}
                >
                  {item.label}
                </BrassLink>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:block"><SoundToggle /></div>
          <Link
            href="/contact#book"
            className="hidden rounded-pill border border-brand-accent px-5 py-3 text-caption01 font-medium uppercase tracking-[0.14em] text-brand-accent-strong transition-colors duration-[var(--duration-ui)] hover:bg-brand-accent hover:text-background md:inline-flex"
          >
            Book a visit
          </Link>
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
