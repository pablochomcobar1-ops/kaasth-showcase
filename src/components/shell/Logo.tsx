import Link from 'next/link';
import { siteConfig } from '@/content/site.config';

/** Jharokha Seal logo (ivory + brass on night). `compact` hides the "Est." line for the nav. */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`} aria-label={`${siteConfig.brand.name}, home`}>
      <img src="/brand/kaasth-horizontal-reversed-transparent.svg" alt="" width={184} height={44} className="h-9 w-auto md:h-11" />
    </Link>
  );
}
