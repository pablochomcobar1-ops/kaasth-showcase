import type { MetadataRoute } from 'next';
import { siteConfig } from '@/content/site.config';
import { siteUrl } from '@/lib/site-url';

/** Demo: ask every crawler to stay out (it is a concept brand). Live: allow, and point to the sitemap. */
export default function robots(): MetadataRoute.Robots {
  if (siteConfig.mode === 'demo') return { rules: { userAgent: '*', disallow: '/' } };
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${siteUrl}/sitemap.xml` };
}
