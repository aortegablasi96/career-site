import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// ADR-001 has component styles read the tokens rather than write literal values, and ADR-006 says
// which literals are not design values and may therefore be written. DDR-014 keeps the narrow
// breakpoint in app/tokens.css, lets a component write the wide one and no other, and makes the
// markup order the visual order. These tests hold every component stylesheet to that, as
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
 * ADR-006 records why none of the three literals is a design decision: `0` is nothing, `auto` hands
 * the decision to the layout, and `none` removes a limit that was there. None of them is a length,
 * so none of them can disagree with the design system.
 */
const tokensOnly = /^(?:0|auto|none|var\(--[\w-]+\))(?:\s+(?:0|auto|none|var\(--[\w-]+\)))*$/;

/**
 * The same, and `100%`, which ADR-006 admits on a maximum and nowhere else.
 *
 * `max-inline-size: 100%` says "no wider than the room there is". It names the space the element
 * has been given rather than a size of its own, so there is no number a token could hold. The same
 * `100%` on `inline-size`, or on a padding, would be a design value and stays out.
 */
const tokensOrRoom =
  /^(?:0|auto|none|100%|var\(--[\w-]+\))(?:\s+(?:0|auto|none|100%|var\(--[\w-]+\)))*$/;

/** The two properties ADR-006 lets `100%` through on. */
const maximum = /^max-(?:inline|block)-size$/;

/** Every size or space declaration in a stylesheet, as its property and its value. */
function declarations(css: string): readonly { property: string; value: string }[] {
  const pattern =
    /\b(margin|padding|gap|column-gap|row-gap|font-size|(?:min-|max-)?(?:inline|block)-size|scroll-margin)([\w-]*):\s*([^;]+);/g;

  return [...css.matchAll(pattern)].map(([, property, suffix, value]) => ({
    property: `${property}${suffix}`,
    value: value.trim(),
  }));
}

describe('component stylesheets', () => {
  it('exist', () => {
    expect(stylesheets).not.toHaveLength(0);
  });

  describe.each(stylesheets)('$name', ({ css }) => {
    it('sets no literal colour, only tokens', () => {
      expect(css).not.toMatch(/#[\da-f]{3,8}\b|rgba?\(|hsla?\(/i);
    });

    it('sets sizes and space from tokens only, per ADR-006', () => {
      for (const { property, value } of declarations(css)) {
        expect(value).toMatch(maximum.test(property) ? tokensOrRoom : tokensOnly);
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
      expect(css).not.toMatch(
        /\border\s*:|-reverse\b|\bgrid-(?:area|row|column)\b|position:\s*(?:absolute|fixed|sticky)/,
      );
    });
  });
});
