import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import RootLayout from '@/app/layout';

// next/font is a compile-time transform, and outside the Next.js compiler its loaders throw.
// The stand-in returns the configured variable name as the class, so tests can see which font
// variables reach the page.
vi.mock('next/font/local', () => ({
  default: ({ variable }: { variable: string }) => ({ variable }),
}));

describe('RootLayout', () => {
  it('declares the document language, so assistive technology reads the page correctly', () => {
    const html = renderToStaticMarkup(<RootLayout>{null}</RootLayout>);

    expect(html).toMatch(/^<html lang="en"[\s>]/);
  });

  it('defines both font variables on the root element, where the typography tokens read them', () => {
    const html = renderToStaticMarkup(<RootLayout>{null}</RootLayout>);

    expect(html).toMatch(/^<html [^>]*class="--font-source-sans-3 --font-source-serif-4"/);
  });

  it('renders the page inside the document body', () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <main />
      </RootLayout>,
    );

    expect(html).toContain('<body><main></main></body>');
  });
});
