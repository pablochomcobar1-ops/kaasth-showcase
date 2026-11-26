import fs from 'node:fs';
import path from 'node:path';
import Image from 'next/image';
import type { Product } from '@/content/schema';

/** True when the photo file exists in /public (checked at build/render time on the server). */
function hasFile(src: string) {
  return fs.existsSync(path.join(process.cwd(), 'public', src));
}

/** Wood name in Devanagari, shown on placeholders for pieces without their own Hindi name. */
const WOOD_DEVA: Record<Product['wood'], string> = { sheesham: 'शीशम', teak: 'सागौन', rosewood: 'शीशम', mango: 'आम', oak: 'ओक', walnut: 'अखरोट' };

const TONE: Record<Product['wood'], string> = {
  sheesham: 'from-[#5b3a25] to-[#24170f]',
  teak: 'from-[#8a5f3c] to-[#2e1e13]',
  rosewood: 'from-[#4a2a1e] to-[#1c110b]',
  mango: 'from-[#a07a52] to-[#3a2718]',
  oak: 'from-[#b89470] to-[#4a3524]',
  walnut: 'from-[#6b4630] to-[#24170f]',
};

/**
 * Product photo, or (until the owner's photos arrive) a warm wood-toned placeholder
 * with the piece's Devanagari name. Dropping `/public/products/{slug}-1.webp` in swaps it automatically.
 */
export function ProductImage({ product, index = 0, sizes, className = '' }: { product: Product; index?: number; sizes: string; className?: string }) {
  const src = product.images[index] ?? product.images[0];
  if (src && hasFile(src)) {
    return <Image src={src} alt={product.name} fill sizes={sizes} className={`object-cover ${className}`} />;
  }
  return (
    <div role="img" aria-label={product.name} className={`absolute inset-0 grid place-items-center bg-gradient-to-br ${TONE[product.wood]} ${className}`}>
      <span aria-hidden="true" className="font-deva text-[clamp(2.5rem,6vw,4.5rem)] text-brand-accent-strong/35">{product.nameDeva ?? WOOD_DEVA[product.wood]}</span>
    </div>
  );
}
