import type { Metadata } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { site } from '@/content/site';
import './tokens.css';
import './globals.css';

// DDR-001. The fonts are committed to the repository, subset to Latin, and preloaded on every
// page, per ADR-001. Next.js generates a fallback whose metrics are adjusted to the named system
// font, so text does not shift when the web font arrives.
//
// DDR-007. One static file per weight, not one variable file per family: Firefox draws variable
// fonts as outlines when it saves a PDF, which leaves the printed CV unselectable and unsearchable
// (#22). Each file is the variable font pinned to the weight, so the letterforms are unchanged.
const sourceSans = localFont({
  src: [
    { path: './fonts/source-sans-3-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/source-sans-3-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-source-sans-3',
  adjustFontFallback: 'Arial',
  fallback: ['system-ui', 'sans-serif'],
});

const sourceSerif = localFont({
  src: [
    { path: './fonts/source-serif-4-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/source-serif-4-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-source-serif-4',
  adjustFontFallback: 'Times New Roman',
  fallback: ['Georgia', 'serif'],
});

// The same title and description serve search results and link previews.
export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The font variables must sit on the root element, where app/tokens.css reads them.
    <html lang="en" className={`${sourceSans.variable} ${sourceSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
