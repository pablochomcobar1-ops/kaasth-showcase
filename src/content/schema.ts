import { z } from 'zod';

import { CATEGORIES, COLLECTIONS, WOODS } from './enums';

export { CATEGORIES, COLLECTIONS, WOODS } from './enums';
export type { Category, Collection, Wood } from './enums';

const slug = z.string().regex(/^[a-z0-9-]+$/);

export const productSchema = z.object({
  slug,
  name: z.string().min(2),
  nameDeva: z.string().optional(),
  collection: z.enum(COLLECTIONS),
  category: z.enum(CATEGORIES),
  wood: z.enum(WOODS),
  priceFrom: z.number().int().positive().nullable(),
  images: z.array(z.string().startsWith('/')).min(1),
  blurb: z.string().min(20).max(220),
  passport: z.object({
    wood: z.string(),
    joinery: z.string(),
    artisanHours: z.number().int().positive(),
    finish: z.string(),
    termiteTreated: z.boolean(),
    warrantyYears: z.number().int().min(1),
  }),
  dimensionsCm: z.object({ w: z.number().positive(), d: z.number().positive(), h: z.number().positive() }),
  provenance: z.object({ era: z.string(), region: z.string(), restored: z.string() }).optional(),
  featured: z.boolean().optional(),
});

export const productsSchema = z.array(productSchema);

const review = z.object({ quote: z.string().max(240), name: z.string(), city: z.string(), piece: z.string() });

export const siteConfigSchema = z.object({
  mode: z.enum(['demo', 'live']),
  credit: z.string(),
  demoBadge: z.string(),
  brand: z.object({
    name: z.string(),
    nameDeva: z.string(),
    tagline: z.string(),
    lines: z.array(z.string()).min(1),
    established: z.number().int(),
    city: z.string(),
    collections: z.record(z.enum(COLLECTIONS), z.object({ name: z.string(), nameDeva: z.string(), line: z.string() })),
  }),
  contact: z.object({
    phone: z.string(),
    whatsapp: z.string().regex(/^91\d{10}$/),
    email: z.email(),
    address: z.array(z.string()).min(2),
    directionsUrl: z.url(),
    hours: z.string(),
    closedDay: z.string(),
  }),
  nav: z.array(z.object({ label: z.string(), href: z.string().startsWith('/') })),
  reviews: z.array(review).min(3),
  reviewsNote: z.string(),
  services: z.array(z.object({ id: slug, title: z.string(), titleDeva: z.string(), line: z.string(), steps: z.array(z.string()).length(3) })).length(4),
  story: z.array(z.object({ year: z.number().int(), title: z.string(), text: z.string() })).min(3),
});

export type Product = z.infer<typeof productSchema>;
export type SiteConfig = z.infer<typeof siteConfigSchema>;
