import type { Metadata } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { site } from '@/content/site';
import './tokens.css';
import './globals.css';

// DDR-001. The fonts are committed to the repository, subset to Latin, and preloaded on every
// page, per ADR-001. Next.js generates a fallback whose metrics are adjusted to the named system
// font, so text does not shift when the web font arrives.
const sourceSans = localFont({
  src: './fonts/source-sans-3-latin-wght-normal.woff2',
  weight: '200 900',
  variable: '--font-source-sans-3',
  adjustFontFallback: 'Arial',
  fallback: ['system-ui', 'sans-serif'],
});

const sourceSerif = localFont({
  src: './fonts/source-serif-4-latin-wght-normal.woff2',
  weight: '200 900',
  variable: '--font-source-serif-4',
  adjustFontFallback: 'Times New Roman',
  fallback: ['Georgia', 'serif'],
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The font variables must sit on the root element, where app/tokens.css reads them.
    <html lang="en" className={`${sourceSans.variable} ${sourceSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
