import type { Metadata, Viewport } from 'next';
import { connection } from 'next/server';
import { cormorant, instrument, tiro } from './fonts';
import { siteConfig } from '@/content/site.config';
import { Nav } from '@/components/shell/Nav';
import { Footer } from '@/components/shell/Footer';
import { DemoBadge } from '@/components/shell/DemoBadge';
import { SmoothScroll } from '@/components/effects/SmoothScroll';
import { SmokeCursor } from '@/components/effects/SmokeCursor';
import { CursorDot } from '@/components/effects/CursorDot';
import { Grain } from '@/components/effects/Grain';
import { siteUrl } from '@/lib/site-url';
import './globals.css';

const { brand } = siteConfig;
const description = `Hand-carved heirlooms and modern solid-wood furniture from one ${brand.city} workshop since ${brand.established}. Every piece comes with a Wood Passport.`;

export const metadata: Metadata = {
  title: { default: `${brand.name} · ${brand.tagline}`, template: `%s · ${brand.name}` },
  description,
  metadataBase: new URL(siteUrl),
  openGraph: { type: 'website', siteName: brand.name, locale: 'en_IN', title: `${brand.name} · ${brand.tagline}`, description },
  twitter: { card: 'summary_large_image' },
  // Demo brand: keep it out of search results until BSX decides otherwise.
  robots: siteConfig.mode === 'demo' ? { index: false, follow: false } : undefined,
  icons: { icon: '/brand/kaasth-symbol-small.svg' },
};

export const viewport: Viewport = { themeColor: '#120d09' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Render per request so Next.js can stamp the CSP nonce on its scripts (see src/proxy.ts).
  await connection();
  return (
    <html lang="en" className={`${cormorant.variable} ${instrument.variable} ${tiro.variable}`}>
      <body>
        <a href="#main" className="sr-only z-[90] rounded-pill bg-brand-accent px-4 py-2 text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <SmoothScroll />
        <Nav />
        <main id="main" tabIndex={-1} className="outline-none">{children}</main>
        <Footer />
        <DemoBadge />
        <Grain />
        <SmokeCursor />
        <CursorDot />
      </body>
    </html>
  );
}
