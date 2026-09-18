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

/**
 * The same, and `min-content`, which ADR-006 admits on a minimum and nowhere else.
 *
 * `min-inline-size: min-content` says "at least the longest word". It is measured from the content
 * and the face it is set in, so it changes with the text and with the reader's font size and there
 * is no number a token could hold either. On `inline-size` it would be a layout decision — shrink
 * to the longest word — and stays out.
 */
const tokensOrWord =
  /^(?:0|auto|none|min-content|var\(--[\w-]+\))(?:\s+(?:0|auto|none|min-content|var\(--[\w-]+\)))*$/;

/** The two properties ADR-006 lets `100%` through on. */
const maximum = /^max-(?:inline|block)-size$/;

/** The two it lets `min-content` through on. */
const minimum = /^min-(?:inline|block)-size$/;

/**
 * Every size, space, tracking or elevation declaration in a stylesheet, as its property and its
 * value.
 *
 * `line-height` is here because DDR-038 puts leading in tokens: a component that wrote its own
 * would be setting its text at a density the design does not draw.
 *
 * `letter-spacing` is here because DDR-017 puts tracking in tokens: it is a length like the rest,
 * measured in em rather than rem, and a component that wrote one would be choosing a density of
 * its own the way a literal margin would choose a rhythm of its own.
 *
 * `box-shadow` is here because DDR-020 puts the site's one elevation in a token: it is lengths and
 * an ink, and a component that wrote its own would be deciding both how far off the page a surface
 * sits and how dark the page goes under it. The literal-colour rule above already catches the ink;
 * this catches a shadow drawn at lengths of its own in a colour that is already a token.
 *
 * The underline's offset and thickness are here because DDR-035 puts the one offset the design
 * draws in a token: a component that wrote its own would be deciding how far a link's line sits
 * from its letters.
 */
function declarations(css: string): readonly { property: string; value: string }[] {
  const pattern =
    /\b(margin|padding|gap|column-gap|row-gap|font-size|line-height|letter-spacing|box-shadow|text-underline-offset|text-decoration-thickness|(?:min-|max-)?(?:inline|block)-size|scroll-margin)([\w-]*):\s*([^;]+);/g;

  return [...css.matchAll(pattern)].map(([, property, suffix, value]) => ({
    property: `${property}${suffix}`,
    value: value.trim(),
  }));
}

/**
 * Every rule in a stylesheet, as its selector and its body.
 *
 * The pattern matches innermost braces, so a rule inside a media query is read as itself rather
 * than as part of the query. Comments are already gone, so a selector is only ever a selector.
 */
function rules(css: string): readonly { selector: string; body: string }[] {
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({
    selector: selector.trim(),
    body,
  }));
}

describe('component stylesheets', () => {
  it('exist', () => {
    expect(stylesheets).not.toHaveLength(0);
  });

  describe.each(stylesheets)('$name', ({ name, css }) => {
    it('sets no literal colour, only tokens', () => {
      expect(css).not.toMatch(/#[\da-f]{3,8}\b|rgba?\(|hsla?\(/i);
    });

    it('sets sizes, space, tracking and elevation from tokens only, per ADR-006', () => {
      for (const { property, value } of declarations(css)) {
        if (maximum.test(property)) {
          expect(value).toMatch(tokensOrRoom);
        } else if (minimum.test(property)) {
          expect(value).toMatch(tokensOrWord);
        } else {
          expect(value).toMatch(tokensOnly);
        }
      }
    });

    // DDR-014 gives up DDR-004's one layout at every width, which is the cost of the timeline and
    // the other multi-column rows. What replaces it is this: a component may engage the wide
    // breakpoint, and may write no other width of its own. A third breakpoint is a new decision.
    //
    // DDR-015 adds the one variation: a component may extend that query to paper, and only to
    // paper, because a sheet is a wide surface and the columns are what a wide surface is for. The
    // width alone never matches on A4, so without this each component would repeat its grid in a
    // print block and the two could drift.
    it('writes no width media query but the wide breakpoint, or that query and paper', () => {
      const queries = [...css.matchAll(/@media([^{]*)\{/g)].map(([, query]) => query.trim());

      expect(css).not.toMatch(/@container/);
      for (const query of queries.filter((query) => /width/.test(query))) {
        expect(['(min-width: 48em)', '(min-width: 48em), print']).toContain(query);
      }
    });

    it('does not reorder content, so the visual order is the markup order', () => {
      expect(css).not.toMatch(/\border\s*:|-reverse\b|\bgrid-(?:area|row|column)\b/);
    });

    // Taking an element out of the flow is the other way to reorder it, so content stays in it.
    //
    // A pseudo-element is the exception, and DDR-021 records why: it is not content, it has no
    // place in the markup order to disturb, and it is not in the accessibility tree, so lifting
    // one out of the flow cannot change what a reader meets or the order they meet it in. The
    // photo's inner shadow needs it — an inset box-shadow on an `<img>` paints nothing, because a
    // replaced element's content covers it, so the shadow is drawn on a pseudo-element over the
    // image. Anything that is content, matched by a class or an element, stays in the flow.
    it('takes nothing but a pseudo-element out of the flow, per DDR-021', () => {
      for (const { selector, body } of rules(css)) {
        if (/position:\s*(?:absolute|fixed)/.test(body)) {
          expect(selector, selector).toMatch(/::[\w-]+$/);
        }
      }
    });

    // DDR-031 pins the contents bar with `position: sticky`, and that is not taking it out of the
    // flow: a sticky element keeps its box and its place in the markup order, so what follows is
    // laid out beneath it rather than under it and nothing is reordered. It is still an element
    // that passes over the content, so it is admitted once, for the bar, and a second use is a
    // decision rather than a precedent.
    it('pins nothing but the contents bar, per DDR-031', () => {
      const pinned = rules(css)
        .filter(({ body }) => /position:\s*sticky/.test(body))
        .map(({ selector }) => selector);

      expect(pinned).toEqual(name === 'contents.module.css' ? ['.contents'] : []);
    });
  });
});
