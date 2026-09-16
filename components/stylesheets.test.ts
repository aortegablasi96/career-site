import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// ADR-001 has component styles read the tokens rather than write literal values. DDR-014 keeps the
// narrow breakpoint in app/tokens.css, lets a component write the wide one and no other, and makes
// the markup order the visual order. These tests hold every component stylesheet to that, as
// app/globals.test.ts holds the base styles.
const directory = new URL('./', import.meta.url);
const stylesheets = readdirSync(directory)
  .filter((name) => name.endsWith('.module.css'))
  .map((name) => ({
    name,
    // Without comments, so a rule is not matched against its explanation.
    css: readFileSync(new URL(name, directory), 'utf8').replace(/\/\*[\s\S]*?\*\//g, ''),
  }));

/**
 * A value made only of tokens, zero, and keywords, with no literal length.
 *
 * `100%` counts as a keyword here rather than a length. It names the space the element has been
 * given rather than a size of its own, so it decides nothing a token could hold: ADR-001 asks that
 * a value the tokens do not provide be a design decision rather than a number invented in a
 * stylesheet, and "no wider than the room there is" is neither. The projects' media is the first
 * element on the site that needs it, because it is the first fixed-size box wide enough to
 * overflow a 320px screen when text is enlarged.
 */
const tokensOnly =
  /^(?:0|auto|none|100%|var\(--[\w-]+\))(?:\s+(?:0|auto|none|100%|var\(--[\w-]+\)))*$/;

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

    // DDR-014 gives up DDR-004's one layout at every width, which is the cost of the timeline and
    // the other multi-column rows. What replaces it is this: a component may engage the wide
    // breakpoint, and may write no other width of its own. A third breakpoint is a new decision.
    it('writes no width media query but the wide breakpoint, so a width stays a decision', () => {
      const queries = [...css.matchAll(/@media([^{]*)\{/g)].map(([, query]) => query.trim());

      expect(css).not.toMatch(/@container/);
      for (const query of queries.filter((query) => /width/.test(query))) {
        expect(query).toBe('(min-width: 48em)');
      }
    });

    it('does not reorder content, so the visual order is the markup order', () => {
      expect(css).not.toMatch(/\border\s*:|-reverse\b|\bgrid-(?:area|row|column)\b|position:\s*(?:absolute|fixed|sticky)/);
    });
  });
});
