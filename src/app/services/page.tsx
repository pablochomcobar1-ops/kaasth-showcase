import type { Metadata } from 'next';
import { ServicesPage } from '@/components/services/ServicesPage';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Custom-made furniture, antique restoration, interior styling, and delivery with installation by our own team.',
};

export default function Page() {
  return <ServicesPage />;
}
