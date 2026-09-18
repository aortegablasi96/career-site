import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { ContactLink } from '@/content/types';
import { Footer } from './footer';

const styles = readFileSync(new URL('./footer.module.css', import.meta.url), 'utf8');

// Each record carries the label its pill shows as well as the address, per DDR-029. The footer is
// the place that shows the address, so the labels here are what it must not show. The two profiles
// open a new tab from their pills, per DDR-043, which the footer is to ignore.
const contact: readonly ContactLink[] = [
  {
    label: 'Email',
    text: 'someone@example.com',
    href: 'mailto:someone@example.com',
    icon: 'email',
    newTab: false,
  },
  {
    label: 'LinkedIn',
    text: 'linkedin.com/in/someone',
    href: 'https://www.linkedin.com/in/someone/',
    icon: 'linkedin',
    newTab: true,
  },
  {
    label: 'GitHub',
    text: 'github.com/someone',
    href: 'https://github.com/someone',
    icon: 'github',
    newTab: true,
  },
];

const html = renderToStaticMarkup(<Footer name="Someone" contact={contact} />);

describe('Footer', () => {
  // DDR-043 opens the two profiles in a new tab from their pills only. The footer's addresses are
  // not controls, so they open where they are.
  it('opens every address in the same tab, per DDR-043', () => {
    expect(html).not.toMatch(/target=/);
  });

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

  // The footer shows the address where the pill shows the label, per DDR-029, and that division is
  // what leaves the printed CV with contact details at all.
  it('shows the address rather than the label its pill carries, per DDR-029', () => {
    for (const { label } of contact) {
      expect(html).not.toContain(`>${label}<`);
    }
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

  // DDR-035: an address takes the accent under the pointer and on keyboard focus, as the design
  // draws it, and nothing else about it changes — it is still not underlined.
  it('takes the accent under the pointer and on keyboard focus, per DDR-035', () => {
    expect(styles).toMatch(
      /\.link:hover,\s*\.link:focus-visible\s*\{\s*color:\s*var\(--color-accent\);\s*\}/,
    );
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

  // DDR-040 closes DDR-028's open item: the design holds the footer 16px below the page, which ends
  // with a section boundary, so the last section stands 72px above the hairline. Paper keeps the
  // space it had, so the margin is dropped there as screen-only sizing.
  it("sets the design's 16px above its hairline on screen and none on paper, per DDR-040", () => {
    const print = styles.match(/@media print\s*\{([\s\S]*)\}\s*$/)?.[1] ?? '';

    expect(styles).toMatch(/\.footer\s*\{[^}]*margin-block-start:\s*var\(--space-medium\);/);
    expect(print).toMatch(/\.footer\s*\{\s*margin-block-start:\s*0;\s*\}/);
  });
});
