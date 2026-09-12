import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// ADR-001 has component styles read the tokens rather than write literal values. DDR-004 keeps the
// site's one breakpoint in app/tokens.css and makes the markup order the visual order. These tests
// hold every component stylesheet to that, as app/globals.test.ts holds the base styles.
const directory = new URL('./', import.meta.url);
const stylesheets = readdirSync(directory)
  .filter((name) => name.endsWith('.module.css'))
  .map((name) => ({
    name,
    // Without comments, so a rule is not matched against its explanation.
    css: readFileSync(new URL(name, directory), 'utf8').replace(/\/\*[\s\S]*?\*\//g, ''),
  }));

/** A value made only of tokens, zero, and keywords, with no literal length. */
const tokensOnly = /^(?:0|auto|none|var\(--[\w-]+\))(?:\s+(?:0|auto|none|var\(--[\w-]+\)))*$/;

describe('component stylesheets', () => {
  it('exist', () => {
    expect(stylesheets).not.toHaveLength(0);
  });

  describe.each(stylesheets)('$name', ({ css }) => {
    it('sets no literal colour, only tokens', () => {
      expect(css).not.toMatch(/#[\da-f]{3,8}\b|rgba?\(|hsla?\(/i);
    });

    it('sets sizes and space from tokens only', () => {
      const values = [
        ...css.matchAll(
          /\b(?:margin|padding|gap|column-gap|row-gap|font-size|(?:min-|max-)?(?:inline|block)-size|scroll-margin)[\w-]*:\s*([^;]+);/g,
        ),
      ].map(([, value]) => value.trim());

      for (const value of values) {
        expect(value).toMatch(tokensOnly);
      }
    });

    it('writes no width media query, so the breakpoint stays in one place', () => {
      expect(css).not.toMatch(/@media[^{]*width|@container/);
    });

    it('does not reorder content, so the visual order is the markup order', () => {
      expect(css).not.toMatch(/\border\s*:|-reverse\b|\bgrid-(?:area|row|column)\b|position:\s*(?:absolute|fixed|sticky)/);
    });
  });
});
