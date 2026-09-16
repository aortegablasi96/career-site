import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// DDR-012 relies on two base styles for accessibility that no component should have to repeat.
// These tests read the stylesheet as written, so a later edit cannot quietly remove them.
// Line endings are normalised first, as content/cv.test.ts does and for the same reason: Git checks
// this file out with CRLF on Windows and LF on the Linux runner that deploys the site. `rule()`
// anchors a selector list on a newline, so without this the two multi-line lists matched nothing,
// and the tests that read them failed on Windows alone while CI stayed green.
const globals = readFileSync(new URL('./globals.css', import.meta.url), 'utf8').replace(
  /\r\n/g,
  '\n',
);

/** The stylesheet without its comments, so a rule is not matched against its explanation. */
const declarations = globals.replace(/\/\*[\s\S]*?\*\//g, '');

/** The declarations of the rule whose selector list is exactly `selector`. */
function rule(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return globals.match(new RegExp(`(?:^|\\n)${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
}

/** The selector list of the rule that styles every level of heading. */
const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].join(',\n');

describe('base styles', () => {
  it('underlines links, so they are not told apart from text by colour alone', () => {
    expect(rule('a')).toMatch(/text-decoration-line:\s*underline;/);
  });

  it('shows keyboard focus with an outline in the focus colour', () => {
    expect(rule(':focus-visible')).toMatch(
      /outline:\s*var\(--focus-outline-width\) solid var\(--color-focus\);/,
    );
  });

  it('sets no literal colour, only tokens', () => {
    expect(globals).not.toMatch(/#[\da-f]{3,8}\b|rgba?\(|hsla?\(/i);
  });
});

// DDR-011 switches off every font feature that would substitute a glyph no character maps to,
// because Firefox writes such a glyph into a saved PDF as the replacement character, which leaves
// words such as "certifications" unsearchable and misread aloud (#40). In Lora and DM Sans those
// features are the ligatures and the contextual alternates.
describe('base typography', () => {
  it('turns ligatures off, so every word survives being saved as a PDF', () => {
    expect(rule('body')).toMatch(/font-variant-ligatures:\s*none;/);
  });

  it('turns contextual alternates off with them, for the same reason', () => {
    expect(rule('body')).toMatch(/font-feature-settings:\s*'calt' 0;/);
  });

  it("sets headings in the heading ink, the darkest of DDR-012's three levels", () => {
    expect(rule(headings)).toMatch(/color:\s*var\(--color-text-heading\);/);
  });

  // DDR-017 tightens the two headings the page sets large, where a face's own spacing, drawn for
  // text, leaves the letters loose.
  it.each(['h1', 'h2'])('tightens %s, the text the page sets largest', (heading) => {
    expect(rule(heading)).toMatch(/letter-spacing:\s*var\(--letter-spacing-tight\);/);
  });

  // An item title is body size, so it is left at the spacing Lora was drawn with, and so is
  // everything set in DM Sans that is not one of DDR-017's four labels.
  it.each(['h3', 'h4,\nh5,\nh6', 'body'])('leaves %s at the spacing the face was drawn with', (selector) => {
    expect(rule(selector)).not.toMatch(/letter-spacing/);
  });
});

// DDR-013 lays the page out from the spacing tokens alone, and relies on the section step, with the
// section's heading, to show where one section ends and the next begins.
describe('base layout', () => {
  it('sets the page in a single centred column, as wide as the content width', () => {
    const main = rule('main');

    expect(main).toMatch(/max-inline-size:\s*var\(--content-width\);/);
    expect(main).toMatch(/margin-inline:\s*auto;/);
    expect(main).toMatch(/padding-inline:\s*var\(--page-gutter\);/);
  });

  it('holds running text to the measure rather than to the column, per DDR-013', () => {
    expect(rule(['p', 'li'].join(',\n'))).toMatch(/max-inline-size:\s*var\(--measure\);/);
  });

  it('separates major sections by the section step', () => {
    expect(rule(':where(main > * + section)')).toMatch(
      /margin-block-start:\s*var\(--space-section\);/,
    );
  });

  it('sets no literal length for space, only tokens', () => {
    const values = [...declarations.matchAll(/\b(?:margin|padding|gap)[\w-]*:\s*([^;]+);/g)].map(
      ([, value]) => value.trim(),
    );

    expect(values).not.toHaveLength(0);
    for (const value of values) {
      expect(value).toMatch(/^(?:0|auto|var\(--[\w-]+\))(?:\s+(?:0|auto|var\(--[\w-]+\)))*$/);
    }
  });
});

// DDR-014 adapts the page through role tokens, keeps the narrow breakpoint in app/tokens.css, and
// makes the markup order the visual order at every width. The base styles engage neither
// breakpoint: what changes at the wide one is the sections' layout, which is theirs to write.
describe('responsive base styles', () => {
  it.each([
    { heading: 'h1', role: 'page-title' },
    { heading: 'h2', role: 'section-title' },
    { heading: 'h3', role: 'item-title' },
  ])('sizes $heading by the $role role, which DDR-014 adapts or holds', ({ heading, role }) => {
    expect(rule(heading)).toMatch(new RegExp(`font-size:\\s*var\\(--font-size-${role}\\);`));
  });

  it('sets the space above and below the page by the page padding, so it tightens with the gutter', () => {
    expect(rule('main')).toMatch(/padding-block:\s*var\(--page-padding-block\);/);
  });

  it('writes no width media query at all, so a page-wide adaptation stays in the tokens', () => {
    expect(declarations).not.toMatch(/@media[^{]*width/);
  });

  it('does not reorder content, so the visual order is the markup order', () => {
    expect(declarations).not.toMatch(/\border\s*:|-reverse\b|\bgrid-(?:area|row|column)\b/);
  });
});

// DDR-005 treats the page for paper. The tokens do most of it; the print rules add what they
// cannot express.
const print = declarations.match(/@media print\s*\{([\s\S]*)\}\s*$/)?.[1] ?? '';

describe('print base styles', () => {
  it('measures every rem from the root font size token, which DDR-005 sets for paper', () => {
    expect(rule(':root')).toMatch(/font-size:\s*var\(--root-font-size\);/);
  });

  it('hides in-page navigation, which leads nowhere on paper', () => {
    expect(print).toMatch(/:where\(nav\)\s*\{\s*display:\s*none;\s*\}/);
  });

  it('prints the address after every link that leaves the page', () => {
    expect(print).toMatch(
      /:where\(a\[href\]:not\(\[href\^='#'\]\)\)::after\s*\{\s*content:\s*' \(' attr\(href\) '\)';\s*\}/,
    );
  });

  it('keeps a heading on the page with what it introduces', () => {
    expect(print).toMatch(
      /:where\(h1, h2, h3, h4, h5, h6\)\s*\{\s*break-after:\s*avoid;\s*break-inside:\s*avoid;\s*\}/,
    );
  });

  it('never splits a single entry across two pages', () => {
    expect(print).toMatch(/:where\(article, li\)\s*\{\s*break-inside:\s*avoid;\s*\}/);
  });
});
