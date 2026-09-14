import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { languages } from '@/content/languages';
import { Languages } from './languages';

// Rendered with the real content, since the languages and their levels are what #31 asks for.
const html = renderToStaticMarkup(<Languages languages={languages.languages} />);

describe('Languages', () => {
  it('shows one row per language, labelled by the language, with its level, as #26 gave them', () => {
    const rows = [...html.matchAll(/<dt[^>]*>([^<]+)<\/dt> <dd[^>]*>([^<]+)<\/dd>/g)].map(([, label, value]) => [label, value]);

    expect(rows).toEqual([
      ['Spanish:', 'Native (C2)'],
      ['Catalan:', 'Native (C2)'],
      ['English:', 'C1'],
      ['Italian:', 'B2'],
    ]);
  });

  it('is one description list, with no heading of its own, per DDR-006', () => {
    expect(html).toMatch(/^<dl[^>]*>.*<\/dl>$/);
    expect(html).not.toMatch(/<h\d/);
  });
});

describe('languages content', () => {
  it('gives every level on the CEFR scale', () => {
    for (const { level } of languages.languages) {
      expect(level).toMatch(/\b[ABC][12]\b/);
    }
  });
});
