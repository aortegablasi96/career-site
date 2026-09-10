import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// DDR-002 relies on two base styles for accessibility that no component should have to repeat.
// These tests read the stylesheet as written, so a later edit cannot quietly remove them.
const globals = readFileSync(new URL('./globals.css', import.meta.url), 'utf8');

/** The stylesheet without its comments, so a rule is not matched against its explanation. */
const declarations = globals.replace(/\/\*[\s\S]*?\*\//g, '');

/** The declarations of the rule whose selector list is exactly `selector`. */
function rule(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return globals.match(new RegExp(`(?:^|\\n)${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
}

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

// DDR-003 lays the page out from the spacing tokens alone, and relies on the section step, with the
// section's heading, to show where one section ends and the next begins.
describe('base layout', () => {
  it('sets the page in a single centred column, as wide as the content width', () => {
    const main = rule('main');

    expect(main).toMatch(/max-inline-size:\s*var\(--content-width\);/);
    expect(main).toMatch(/margin-inline:\s*auto;/);
    expect(main).toMatch(/padding-inline:\s*var\(--page-gutter\);/);
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

// DDR-004 adapts the page through role tokens, keeps the site's one breakpoint in app/tokens.css,
// and makes the markup order the visual order at every width.
describe('responsive base styles', () => {
  it.each([
    { heading: 'h1', role: 'page-title' },
    { heading: 'h2', role: 'section-title' },
    { heading: 'h3', role: 'item-title' },
  ])('sizes $heading by the $role role, so it steps down on the narrowest viewports', ({ heading, role }) => {
    expect(rule(heading)).toMatch(new RegExp(`font-size:\\s*var\\(--font-size-${role}\\);`));
  });

  it('sets the space above and below the page by the page padding, so it tightens with the gutter', () => {
    expect(rule('main')).toMatch(/padding-block:\s*var\(--page-padding-block\);/);
  });

  it('writes no width media query, so the breakpoint stays in one place', () => {
    expect(declarations).not.toMatch(/@media[^{]*width/);
  });

  it('does not reorder content, so the visual order is the markup order', () => {
    expect(declarations).not.toMatch(/\border\s*:|-reverse\b|\bgrid-(?:area|row|column)\b/);
  });
});
