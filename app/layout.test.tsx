import { readdirSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import RootLayout, { metadata } from '@/app/layout';
import { introduction } from '@/content/introduction';

type FontOptions = {
  variable: string;
  weight?: string;
  style?: string;
  src: string | { path: string; weight?: string; style?: string }[];
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

    expect(html).toMatch(/^<html [^>]*class="--font-dm-sans --font-lora"/);
  });

  // DDR-011: Firefox draws a variable font as outlines when it saves a PDF, so the printed CV
  // would lose its text (#22). Each font is one static file per weight and style, and a weight or
  // a style with no file would be synthesised, so the files are exactly what the page sets.
  // DDR-023 lists them: four weights for the body face, because the design draws its labels bold —
  // the italic it listed went with the theses on #173, per DDR-057 — and semibold for the heading
  // face, which is the page title and the section titles, with regular beside it since #96 for the
  // footer's name.
  it('loads each font as one static file per weight and style, which a PDF keeps as text', () => {
    expect(fontOptions.map(({ variable }) => variable)).toEqual(['--font-dm-sans', '--font-lora']);

    for (const { src, weight, style } of fontOptions) {
      expect(weight).toBeUndefined();
      expect(style).toBeUndefined();
      expect(Array.isArray(src)).toBe(true);
    }

    const [body, heading] = fontOptions;

    expect(Array.isArray(body.src) && body.src.map(({ weight, style }) => `${weight} ${style}`))
      .toEqual(['400 normal', '500 normal', '600 normal', '700 normal']);
    expect(Array.isArray(heading.src) && heading.src.map(({ weight, style }) => `${weight} ${style}`))
      .toEqual(['400 normal', '600 normal']);
  });

  // A listed file that is not there is a face the browser synthesises, which is the whole fault
  // this arrangement exists to prevent, so the paths are read off the disk rather than trusted.
  it('lists only files app/fonts/ actually holds, so nothing is synthesised', () => {
    const committed = readdirSync(new URL('./fonts/', import.meta.url));
    const declared = fontOptions
      .flatMap(({ src }) => (Array.isArray(src) ? src : []))
      .map(({ path }) => path.replace('./fonts/', ''));

    for (const file of declared) {
      expect(committed).toContain(file);
    }
  });

  // The other direction is now an equality, and #96 is why. DDR-023 derived, inspected and
  // committed Lora Regular for the footer and left it unlisted, because next/font preloads every
  // file it is given and the page would have fetched 21 KB for a face it never drew. DDR-028 adds
  // the footer, so the face is drawn and the file is loaded: every woff2 in app/fonts/ is listed,
  // and a file committed for a story still to come would fail here rather than ship unnoticed.
  it('loads every font file the repository carries, so none is fetched unused or left unlisted', () => {
    const committed = readdirSync(new URL('./fonts/', import.meta.url))
      .filter((name) => name.endsWith('.woff2'))
      .sort();
    const declared = fontOptions
      .flatMap(({ src }) => (Array.isArray(src) ? src : []))
      .map(({ path }) => path.replace('./fonts/', ''))
      .sort();

    expect(committed).toContain('lora-latin-400-normal.woff2');
    expect(declared).toEqual(committed);
  });

  // Every file is served under a licence the repository has to carry, per DDR-011.
  it('carries a licence beside the files of each family', () => {
    const fonts = readdirSync(new URL('./fonts/', import.meta.url));

    expect(fonts).toContain('dm-sans-OFL.txt');
    expect(fonts).toContain('lora-OFL.txt');
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
