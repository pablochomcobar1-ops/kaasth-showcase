import type { Metadata, Viewport } from 'next';
import { cormorant, instrument, tiro } from './fonts';
import { siteConfig } from '@/content/site.config';
import './globals.css';

const { brand } = siteConfig;

export const metadata: Metadata = {
  title: { default: `${brand.name} · ${brand.tagline}`, template: `%s · ${brand.name}` },
  description: `Hand-carved heirlooms and modern solid-wood furniture from one ${brand.city} workshop since ${brand.established}. Every piece comes with a Wood Passport.`,
  // Demo brand: keep it out of search results until BSX decides otherwise.
  robots: siteConfig.mode === 'demo' ? { index: false, follow: false } : undefined,
  icons: { icon: '/brand/kaasth-symbol-small.svg' },
};

export const viewport: Viewport = { themeColor: '#120d09' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${instrument.variable} ${tiro.variable}`}>
      <body>{children}</body>
    </html>
  );
}
