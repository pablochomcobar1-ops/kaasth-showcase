import type { MetadataRoute } from 'next';
import { products } from '@/content/products';
import { siteUrl } from '@/lib/site-url';

export const PAGES = ['', '/products', '/services', '/about', '/contact', '/privacy'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map((p) => ({ url: `${siteUrl}${p}`, changeFrequency: 'monthly' as const, priority: p === '' ? 1 : 0.7 })),
    ...products.map((p) => ({ url: `${siteUrl}/products/${p.slug}`, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}
