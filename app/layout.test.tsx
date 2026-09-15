import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import RootLayout, { metadata } from '@/app/layout';
import { introduction } from '@/content/introduction';

type FontOptions = {
  variable: string;
  weight?: string;
  src: string | { path: string; weight?: string }[];
};

// next/font is a compile-time transform, and outside the Next.js compiler its loaders throw.
// The stand-in returns the configured variable name as the class, so tests can see which font
// variables reach the page. It also keeps each font's options, so tests can see what is loaded.
const fontOptions = vi.hoisted(() => [] as FontOptions[]);

vi.mock('next/font/local', () => ({
  default: (options: FontOptions) => {
    fontOptions.push(options);
    return { variable: options.variable };
  },
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

  // DDR-007: Firefox draws a variable font as outlines when it saves a PDF, so the printed CV
  // would lose its text (#22). Each font is one static file for each of DDR-001's two weights.
  it('loads each font as one static file per weight, which a PDF saved from Firefox keeps as text', () => {
    expect(fontOptions).toHaveLength(2);

    for (const { src, weight } of fontOptions) {
      expect(weight).toBeUndefined();
      expect(Array.isArray(src) && src.map((file) => file.weight)).toEqual(['400', '600']);
    }
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

describe('metadata', () => {
  it('titles the document with the name and positioning the introduction shows', () => {
    expect(metadata.title).toBe(`${introduction.name} – ${introduction.positioning}`);
  });

  it('gives link previews the same title and description as search results', () => {
    expect(metadata.openGraph).toMatchObject({
      title: metadata.title,
      description: metadata.description,
    });
  });
});
