import fs from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { siteConfig } from '@/content/site.config';

export const alt = 'Kaasth: hand-carved heirlooms and modern solid-wood furniture, Ahmedabad';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Share preview (WhatsApp, LinkedIn, X): the haveli room, the logo and one line. Built once at build time. */
export default async function OpenGraphImage() {
  const [room, logo, serif, serifItalic, sans] = await Promise.all([
    fs.readFile(path.join(process.cwd(), 'public/renders/room-heirloom.jpg')),
    fs.readFile(path.join(process.cwd(), 'public/brand/kaasth-symbol.svg')),
    fs.readFile(path.join(process.cwd(), 'src/fonts/og/cormorant-garamond-latin-500-normal.woff')),
    fs.readFile(path.join(process.cwd(), 'src/fonts/og/cormorant-garamond-latin-500-italic.woff')),
    fs.readFile(path.join(process.cwd(), 'src/fonts/og/instrument-sans-latin-500-normal.woff')),
  ]);
  const { brand } = siteConfig;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#120D09' }}>
        <img src={`data:image/jpeg;base64,${room.toString('base64')}`} width={1200} height={675} style={{ position: 'absolute', top: -20, left: 0, objectFit: 'cover' }} alt="" />
        <div style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 630, display: 'flex', backgroundImage: 'linear-gradient(90deg, rgba(18,13,9,0.97) 0%, rgba(18,13,9,0.86) 45%, rgba(18,13,9,0.2) 100%)' }} />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <img src={`data:image/svg+xml;base64,${Buffer.from(logo.toString('utf8').replaceAll('#3A2418', '#E9C88F')).toString('base64')}`} width={56} height={56} alt="" />
            <div style={{ display: 'flex', fontFamily: 'Sans', fontSize: 20, letterSpacing: 6, color: '#C9A46A' }}>
              {`${brand.name.toUpperCase()} · EST. ${brand.established} · ${brand.city.toUpperCase()}`}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 680 }}>
            <div style={{ fontFamily: 'Serif', fontSize: 76, lineHeight: 1.02, color: '#F3ECE0' }}>Heirlooms and modern solid wood.</div>
            <div style={{ fontFamily: 'Serif', fontStyle: 'italic', fontSize: 64, lineHeight: 1.1, color: '#E9C88F', marginTop: 8 }}>Every piece with papers.</div>
          </div>
          <div style={{ display: 'flex', fontFamily: 'Sans', fontSize: 18, letterSpacing: 3, color: 'rgba(243,236,224,0.6)' }}>CONCEPT DEMO · BSX AGENCY</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Serif', data: serif, weight: 500, style: 'normal' },
        { name: 'Serif', data: serifItalic, weight: 500, style: 'italic' },
        { name: 'Sans', data: sans, weight: 500, style: 'normal' },
      ],
    },
  );
}
