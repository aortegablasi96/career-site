import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { languages } from '@/content/languages';
import { Languages } from './languages';

// Rendered with the real content, since the languages and their levels are what #31 asks for, and
// the cards are what #51 asks for.
const html = renderToStaticMarkup(<Languages languages={languages.languages} />);

/** The stylesheet without its comments, so a rule is not matched against its explanation. */
const css = readFileSync(new URL('./languages.module.css', import.meta.url), 'utf8')
  .replace(/\r\n/g, '\n')
  .replace(/\/\*[\s\S]*?\*\//g, '');
const wide = css.match(/@media \(min-width: 48em\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
const print = css.match(/@media print\s*\{([\s\S]*)\}\s*$/)?.[1] ?? '';

describe('Languages', () => {
  it('shows one card per language, with the language as its term and its level below, as #26 gave them', () => {
    const cards = [...html.matchAll(/<dt[^>]*>([^<]+)<\/dt><dd[^>]*>([^<]+)<\/dd>/g)].map(([, name, level]) => [
      name,
      level,
    ]);

    expect(cards).toEqual([
      ['Spanish', 'Native (C2)'],
      ['Catalan', 'Native (C2)'],
      ['English', 'C1'],
      ['Italian', 'B2'],
    ]);
  });

  // DDR-010 keeps DDR-006's description list: a language and its level stay a pair rather than
  // becoming two unrelated lines, and the section has no h3, so the heading order is unbroken.
  it('is one description list, with each pair in its own card, and no heading of its own', () => {
    expect(html).toMatch(/^<dl[^>]*>.*<\/dl>$/);
    expect(html).not.toMatch(/<h\d/);
    expect(html.match(/<div class="[^"]*">/g)).toHaveLength(languages.languages.length);
  });
});

// DDR-010 lays the row out; DDR-014 puts the count below the wide breakpoint in a token, because
// the narrow breakpoint is the tokens' and a component may write only the wide one.
describe('languages styles', () => {
  it('reads its column count from the token below the wide breakpoint, and stands four in a row from it', () => {
    expect(css).toMatch(/\.cards\s*\{[^}]*grid-template-columns:\s*repeat\(var\(--language-columns\), 1fr\);/);
    expect(wide).toMatch(/\.cards\s*\{\s*grid-template-columns:\s*repeat\(4, 1fr\);/);
  });

  it('draws a card as the white surface with a hairline edge, per DDR-012', () => {
    expect(css).toMatch(/\.card\s*\{[^}]*background-color:\s*var\(--color-surface-card\);/);
    expect(css).toMatch(/\.card\s*\{[^}]*border:\s*1px solid var\(--color-decoration\);/);
    expect(css).toMatch(/\.card\s*\{[^}]*border-radius:\s*var\(--radius-large\);/);
  });

  it('sets the level in the accent, at 7.90:1 on the card, per DDR-012', () => {
    expect(css).toMatch(/\.level\s*\{[^}]*color:\s*var\(--color-accent\);/);
    expect(css).toMatch(/\.name\s*\{[^}]*font-weight:\s*var\(--font-weight-semibold\);/);
  });
});

describe('Languages in print', () => {
  it('keeps the row whole on one page, per DDR-010', () => {
    expect(print).toMatch(/\.cards\s*\{[^}]*break-inside:\s*avoid;/);
  });

  it('drops the card’s fill and its edge, which carry nothing the text does not, per DDR-010', () => {
    expect(print).toMatch(/\.card\s*\{[^}]*border:\s*none;/);
    expect(print).toMatch(/\.card\s*\{[^}]*background-color:\s*var\(--color-surface\);/);
  });
});

describe('languages content', () => {
  it('gives every level on the CEFR scale', () => {
    for (const { level } of languages.languages) {
      expect(level).toMatch(/\b[ABC][12]\b/);
    }
  });
});
