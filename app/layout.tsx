import type { Metadata } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { DigitalTwinChat } from '@/components/digital-twin-chat';
import { ScrollAppear } from '@/components/scroll-appear';
import { chat } from '@/content/chat';
import { site } from '@/content/site';
import { shareCard } from './share';
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
// page sets and no more. DM Sans carries four weights, because the design draws its labels bold.
// It carried an italic too, for a degree's thesis sentence, until the owner removed the theses on
// #173, per DDR-057. Lora carries semibold, which is the page title and the section titles.
//
// Lora carries regular as well since #96: the footer's name is the one place on the page the serif
// is neither the page title nor a section title, per DDR-023, and it is the file that record
// derived, inspected and committed ahead of this story. Every committed file is now loaded.
const dmSans = localFont({
  src: [
    { path: './fonts/dm-sans-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/dm-sans-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/dm-sans-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: './fonts/dm-sans-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-dm-sans',
  adjustFontFallback: 'Arial',
  fallback: ['system-ui', 'sans-serif'],
});

const lora = localFont({
  src: [
    { path: './fonts/lora-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/lora-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-lora',
  adjustFontFallback: 'Times New Roman',
  fallback: ['Georgia', 'serif'],
});

// The same title and description serve search results and link previews. Each page's canonical
// link is a path, which metadataBase puts under the site's own address, per ADR-024. A preview
// shows the share card, per DDR-095, large rather than as a thumbnail; a view that sets its own
// `openGraph` replaces this one whole, so each view names its picture again.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    images: [shareCard],
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The font variables must sit on the root element, where app/tokens.css reads them.
    <html lang="en" className={`${dmSans.variable} ${lora.variable}`}>
      <body>
        {children}
        {/* The chat with the Digital Twin, on every page, per DDR-100 and ADR-028: a launcher at the
            window's corner and the panel it opens. In the layout, so the conversation carries over
            as the reader moves between the site's pages. */}
        <DigitalTwinChat chat={chat} />
        {/* Makes the elements of whichever route is shown appear as the reader scrolls to them,
            per DDR-090. It renders nothing, and the page is whole without it (ADR-025). */}
        <ScrollAppear />
      </body>
    </html>
  );
}
