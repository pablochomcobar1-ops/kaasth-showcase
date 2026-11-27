/**
 * Catalogue vocabularies as plain constants. Kept apart from schema.ts (which imports Zod)
 * so browser code can use them without shipping the validation library to visitors.
 */
export const COLLECTIONS = ['heirloom', 'form'] as const;
export const CATEGORIES = ['living', 'dining', 'bedroom', 'seating', 'storage', 'decor'] as const;
export const WOODS = ['sheesham', 'teak', 'oak', 'walnut', 'mango', 'rosewood'] as const;

export type Collection = (typeof COLLECTIONS)[number];
export type Category = (typeof CATEGORIES)[number];
export type Wood = (typeof WOODS)[number];
