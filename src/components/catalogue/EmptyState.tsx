'use client';

import { usePathname, useRouter } from 'next/navigation';

/** Shown when no piece matches; "Clear filters" resets the URL to the full catalogue. */
export function EmptyState() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div role="status" className="mx-auto flex max-w-md flex-col items-center py-24 text-center">
      <p lang="hi" aria-hidden="true" className="font-deva text-hero02 text-brand-accent/40">खाली</p>
      <h2 className="mt-4 text-heading02">No piece matches all of these.</h2>
      <p className="mt-3 text-body02 text-foreground-secondary">Try fewer filters, or tell us what you have in mind. Our karigars make to order too.</p>
      <button type="button" onClick={() => router.push(pathname, { scroll: false })} className="mt-8 rounded-pill bg-brand-accent px-7 py-4 text-caption01 font-medium uppercase tracking-[0.14em] text-background transition-colors duration-[var(--duration-ui)] hover:bg-brand-accent-strong">
        Clear filters
      </button>
    </div>
  );
}
