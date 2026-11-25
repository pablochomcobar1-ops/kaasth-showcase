import Link from 'next/link';
import type { ComponentProps } from 'react';

/** Text link whose brass underline draws in from the left on hover/focus (CSS only). */
export function BrassLink({ className = '', ...props }: ComponentProps<typeof Link>) {
  return <Link {...props} className={`brass-link ${className}`} />;
}
