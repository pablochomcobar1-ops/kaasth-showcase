import type { Metadata } from 'next';
import { AboutPage } from '@/components/about/AboutPage';

export const metadata: Metadata = {
  title: 'About',
  description: 'Three generations of Ahmedabad karigars since 1962: restoration, the Wood Passport, and modern solid wood.',
};

export default function Page() {
  return <AboutPage />;
}
