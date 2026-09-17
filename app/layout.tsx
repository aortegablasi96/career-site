import type { Metadata } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { site } from '@/content/site';
import './tokens.css';
import './globals.css';

// DDR-011's recipe, with the files DDR-023 replaces its four with. The fonts are committed to the
// repository, subset to Latin, and preloaded on every page, per ADR-001. Next.js generates a
// fallback whose metrics are adjusted to the named system font, so text does not shift when the
// web font arrives.
//
// One static file per weight and style, not one variable file per family: Firefox draws variable
// fonts as outlines when it saves a PDF, which leaves the printed CV unselectable and unsearchable
// (#22). Each file is the Fontsource variable font pinned to the weight, so the letterforms are
// unchanged.
//
// A weight or a style with no file is synthesised by the browser, so the list is exactly what the
// page sets and no more. DM Sans carries four weights, because the design draws its three labels
// bold, and the one italic a degree's thesis sentence is set in. Lora carries semibold alone,
// which is the page title and the section titles.
//
// `lora-latin-400-normal.woff2` is committed beside them and deliberately not listed. It is the
// footer's name, and #96 adds the footer; next/font preloads every file it is given, so listing it
// now would fetch 21 KB on every visit for text the page does not yet show. DDR-023 derives and
// inspects it here so that the footer story is one line rather than a second derivation.
const dmSans = localFont({
  src: [
    { path: './fonts/dm-sans-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/dm-sans-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/dm-sans-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: './fonts/dm-sans-latin-700-normal.woff2', weight: '700', style: 'normal' },
    { path: './fonts/dm-sans-latin-400-italic.woff2', weight: '400', style: 'italic' },
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
