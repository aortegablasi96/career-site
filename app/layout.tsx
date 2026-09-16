import type { Metadata } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { site } from '@/content/site';
import './tokens.css';
import './globals.css';

// DDR-011. The fonts are committed to the repository, subset to Latin, and preloaded on every
// page, per ADR-001. Next.js generates a fallback whose metrics are adjusted to the named system
// font, so text does not shift when the web font arrives.
//
// One static file per weight, not one variable file per family: Firefox draws variable fonts as
// outlines when it saves a PDF, which leaves the printed CV unselectable and unsearchable (#22).
// Each file is the Fontsource variable font pinned to the weight, so the letterforms are
// unchanged. DM Sans carries the three weights the page sets; Lora is only ever semibold, because
// headings are the only thing set in it.
const dmSans = localFont({
  src: [
    { path: './fonts/dm-sans-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/dm-sans-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/dm-sans-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-dm-sans',
  adjustFontFallback: 'Arial',
  fallback: ['system-ui', 'sans-serif'],
});

const lora = localFont({
  src: [{ path: './fonts/lora-latin-600-normal.woff2', weight: '600', style: 'normal' }],
  variable: '--font-lora',
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
    <html lang="en" className={`${dmSans.variable} ${lora.variable}`}>
      <body>{children}</body>
    </html>
  );
}
