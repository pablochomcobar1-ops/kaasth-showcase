import localFont from 'next/font/local';

/** Self-hosted OFL fonts (see src/fonts/LICENSE.md). No request to Google at build or run time. */
export const cormorant = localFont({
  src: [
    { path: '../fonts/cormorant-garamond-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/cormorant-garamond-latin-500-italic.woff2', weight: '500', style: 'italic' },
    { path: '../fonts/cormorant-garamond-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-cormorant',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
});

export const instrument = localFont({
  src: [
    { path: '../fonts/instrument-sans-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/instrument-sans-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/instrument-sans-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-instrument',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

export const tiro = localFont({
  src: [
    { path: '../fonts/tiro-devanagari-hindi-devanagari-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/tiro-devanagari-hindi-latin-400-normal.woff2', weight: '400', style: 'normal' },
  ],
  variable: '--font-tiro',
  display: 'swap',
  preload: false,
  fallback: ['serif'],
});
