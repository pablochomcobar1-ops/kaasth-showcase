import { describe, expect, it } from 'vitest';
import { products } from '@/content/products';
import { siteConfig } from '@/content/site.config';
import { productsSchema, siteConfigSchema } from '@/content/schema';

describe('content', () => {
  it('site config is valid', () => {
    expect(() => siteConfigSchema.parse(siteConfig)).not.toThrow();
    expect(siteConfig.credit).toBe('Designed & built by BSX Agency');
  });
  it('has 24 valid products with unique slugs', () => {
    expect(() => productsSchema.parse(products)).not.toThrow();
    expect(products).toHaveLength(24);
    expect(new Set(products.map((p) => p.slug)).size).toBe(24);
  });
  it('has at least 10 pieces in each collection', () => {
    expect(products.filter((p) => p.collection === 'heirloom').length).toBeGreaterThanOrEqual(10);
    expect(products.filter((p) => p.collection === 'form').length).toBeGreaterThanOrEqual(10);
  });
  it('gives every heirloom piece a provenance card', () => {
    for (const p of products.filter((x) => x.collection === 'heirloom')) expect(p.provenance).toBeDefined();
  });
});
