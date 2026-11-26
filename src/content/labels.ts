import type { Category, Wood } from './schema';

/** Display labels for catalogue filters (English + Devanagari). */
export const CATEGORY_LABEL: Record<Category, string> = {
  living: 'Living', dining: 'Dining', bedroom: 'Bedroom', seating: 'Seating', storage: 'Storage', decor: 'Decor',
};
export const WOOD_LABEL: Record<Wood, { en: string; deva: string }> = {
  sheesham: { en: 'Sheesham', deva: 'शीशम' },
  teak: { en: 'Teak', deva: 'सागौन' },
  rosewood: { en: 'Rosewood', deva: 'शीशम' },
  mango: { en: 'Mango', deva: 'आम' },
  oak: { en: 'Oak', deva: 'ओक' },
  walnut: { en: 'Walnut', deva: 'अखरोट' },
};
