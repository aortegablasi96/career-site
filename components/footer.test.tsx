import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { ContactLink } from '@/content/types';
import { Footer } from './footer';

const styles = readFileSync(new URL('./footer.module.css', import.meta.url), 'utf8');

const contact: readonly ContactLink[] = [
  { text: 'someone@example.com', href: 'mailto:someone@example.com', icon: 'email' },
  { text: 'linkedin.com/in/someone', href: 'https://www.linkedin.com/in/someone/', icon: 'linkedin' },
  { text: 'github.com/someone', href: 'https://github.com/someone', icon: 'github' },
];

const html = renderToStaticMarkup(<Footer name="Someone" contact={contact} />);

describe('Footer', () => {
  it('is a footer, so it is the page’s contentinfo landmark when it follows main', () => {
    expect(html).toMatch(/^<footer /);
  });

  // DDR-028 keeps the page's outline exactly where DDR-010 set it: three levels, none skipped, and
  // the footer joins none of them. A heading here would announce a section the page does not have.
  it('adds no heading, so the page’s outline is untouched', () => {
    expect(html).not.toMatch(/<h[1-6][\s>]/);
  });

  it('shows the owner’s name', () => {
    expect(html).toContain('>Someone<');
  });

  // The addresses are the introduction's own records, so each link reads as its address and goes
  // where its contact pill goes. Nothing here is restated in content/, per ADR-002.
  it('links each address to the target its contact pill uses, in order', () => {
    const links = [...html.matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map(([, href, text]) => ({
      href,
      text,
    }));

    expect(links).toEqual(contact.map(({ text, href }) => ({ href, text })));
  });

  // DDR-025 sets the whole footer in the faintest of the three inks below the body's, which is the
  // design's and is 2.39:1 on the page. The links are written out rather than left to inherit,
  // because the base styles colour every link in the accent.
  it('sets the footer and its addresses in the faint ink, per DDR-025', () => {
    expect(styles).toMatch(/\.footer\s*\{[^}]*color:\s*var\(--color-text-faint\);/);
    expect(styles).toMatch(/\.link\s*\{[^}]*color:\s*var\(--color-text-faint\);/);
  });

  // DDR-028: the design draws no underline here, where DDR-012 makes the underline what identifies
  // a link. What identifies these is in the record; what the page must not do is identify them by
  // colour, and it does not — the addresses are the same ink as the name beside them.
  it('draws no underline on an address, per DDR-028', () => {
    expect(styles).toMatch(/\.link\s*\{[^}]*text-decoration-line:\s*none;/);
  });

  // DDR-023 narrows the serif to the page title and the section titles. The footer's name is the
  // one place outside them, and the one thing on the site set in Lora Regular.
  it('sets the name in the serif, per DDR-023', () => {
    expect(styles).toMatch(/\.name\s*\{[^}]*font-family:\s*var\(--font-family-heading\);/);
  });

  // DDR-013's column, read from the same two tokens `main` reads, so the footer lines up with the
  // page above it at every width and on paper.
  it('holds its content to the page’s own column, per DDR-013', () => {
    expect(styles).toMatch(/\.container\s*\{[^}]*max-inline-size:\s*var\(--content-width\);/);
    expect(styles).toMatch(/\.container\s*\{[^}]*padding-inline:\s*var\(--page-gutter\);/);
  });

  // DDR-027: a link's box is the line its label sets in, and a wrapped row needs a gap so two
  // addresses stay outside the circles WCAG 2.2's 2.5.8 measures its spacing exception with.
  it('gives an address the box its line sets and a wrapped row a gap, per DDR-027', () => {
    expect(styles).toMatch(/\.link\s*\{[^}]*display:\s*inline-flex;/);
    expect(styles).not.toMatch(/min-block-size|min-inline-size/);
    expect(styles).toMatch(/\.addresses\s*\{[^}]*row-gap:\s*var\(--space-small\);/);
  });

  // The whole reason the footer prints where nav does not: once #97 labels the contact pills, this
  // is the only place the printed CV carries an address at all, per DDR-028.
  it('prints each address once, with no mailto: prefix after it', () => {
    const print = styles.match(/@media print\s*\{([\s\S]*)\}\s*$/)?.[1] ?? '';

    expect(print).toMatch(/\.link::after\s*\{\s*content:\s*none;\s*\}/);
    expect(styles).not.toMatch(/display:\s*none/);
  });

  // DDR-015 makes every hairline transparent at the token layer, so the footer's line needs no
  // print rule of its own — and must not grow one, or paper and screen would drift apart.
  it('writes no print rule for its hairline, which the tokens drop, per DDR-015', () => {
    const print = styles.match(/@media print\s*\{([\s\S]*)\}\s*$/)?.[1] ?? '';

    expect(print).not.toMatch(/border/);
  });
});
