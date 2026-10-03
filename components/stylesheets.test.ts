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

/**
 * On `max-inline-size` alone, ADR-021 admits one more limit: no wider than the room there is, nor
 * than the room's height at the box's shape, per DDR-088. It names the space there is, as `100%`
 * does, measured on the element's container, and the shape is the view's own, read from its
 * pictures, so there is no number a token could hold either.
 */
const roomAtShape = /^min\(100%, 100cqb \* var\(--[\w-]+\)\)$/;

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
 * this catches a shadow drawn at lengths of its own in a colour that is already a token. A shadow
 * may be a list of layers, and since DDR-065 a lit card draws two elevations at once, so each layer
 * of the list is held to the same rule: a token, never a length.
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

/**
 * The chat's stylesheet without its rule for text said only to assistive technology, per DDR-100.
 *
 * That rule draws nothing: it shrinks the text to a pixel, clips even that away and takes it out of
 * the flow, so that a screen reader still reads it. Its pixel is the least box a reader of every
 * screen reader is sure to find, not a size of the design's, so there is no token for it to read.
 * It is admitted once, in that stylesheet, and the test below holds it to exactly this rule.
 */
const hiddenText =
  /\.hidden \{\s*position: absolute;\s*inline-size: 1px;\s*block-size: 1px;\s*overflow: hidden;\s*clip-path: inset\(50%\);\s*white-space: nowrap;\s*\}/;

function withoutHiddenText(name: string, css: string): string {
  return name === 'digital-twin-chat.module.css' ? css.replace(hiddenText, '') : css;
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
      for (const { property, value } of declarations(withoutHiddenText(name, css))) {
        if (property === 'max-inline-size' && roomAtShape.test(value)) {
          continue;
        } else if (maximum.test(property)) {
          expect(value).toMatch(tokensOrRoom);
        } else if (minimum.test(property)) {
          expect(value).toMatch(tokensOrWord);
        } else if (property === 'box-shadow') {
          for (const layer of value.split(',')) expect(layer.trim()).toMatch(tokensOnly);
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
    //
    // DDR-075 adds one more, for the contents bar alone: the wide breakpoint or a reader without
    // script. The bar lays its links out in its row at both, because a reader who cannot open the
    // menu must not be shown one. It adds no width.
    it('writes no width media query but the wide breakpoint, or that query and paper', () => {
      const queries = [...css.matchAll(/@media([^{]*)\{/g)].map(([, query]) => query.trim());
      const allowed = ['(min-width: 48em)', '(min-width: 48em), print'];

      if (name === 'contents.module.css') {
        allowed.push('(min-width: 48em), (scripting: none)');
      }

      expect(css).not.toMatch(/@container/);
      for (const query of queries.filter((query) => /width/.test(query))) {
        expect(allowed).toContain(query);
      }
    });

    // DDR-080 puts every item of a project's business case in one cell, so the card is as tall as
    // its tallest item, and draws only the one shown. Nothing is reordered, because only one is ever
    // visible, so that stylesheet may place its items in the first cell, and only there; without
    // script it puts them back in the flow, one below the other.
    it('does not reorder content, so the visual order is the markup order', () => {
      if (name === 'business-case-slider.module.css') {
        const placed = [...css.matchAll(/\bgrid-(?:area|row|column)\s*:\s*([^;]+);/g)].map(([, value]) =>
          value.trim(),
        );

        expect(placed).toEqual(['1 / 1', 'auto']);
        expect(css.replace(/\bgrid-area\s*:\s*(?:1 \/ 1|auto);/g, '')).not.toMatch(
          /\border\s*:|-reverse\b|\bgrid-(?:area|row|column)\b/,
        );
        return;
      }

      // DDR-086 stands a gallery's larger picture between its two step controls from the wide
      // breakpoint, where the markup is the phone's: the picture, then the controls either side of
      // the caption. So that stylesheet may place the dialog's five parts by name, inside the wide
      // breakpoint and nowhere else. The controls keep their order, so the keyboard still meets
      // them as they are drawn. It is admitted once, and a second is a decision.
      //
      // DDR-088 stands the frame's picture and the control that opens it in the box's one cell, as
      // the business case's slides share theirs: the picture, then the control over its corner, in
      // the markup's order.
      if (name === 'larger-picture.module.css') {
        const wide = css.match(/@media \(min-width: 48em\) \{([\s\S]*?)\n\}/)?.[1] ?? '';
        const placed = [...wide.matchAll(/\bgrid-area\s*:\s*([^;]+);/g)].map(([, value]) => value.trim());
        const stacked = [...css.replace(wide, '').matchAll(/\bgrid-area\s*:\s*([^;]+);/g)].map(([, value]) =>
          value.trim(),
        );

        expect(placed).toEqual(['close', 'picture', 'before', 'words', 'after']);
        expect(stacked).toEqual(['1 / 1', '1 / 1']);
        expect(
          css
            .replace(wide, wide.replace(/\bgrid-area\s*:\s*\w+;/g, ''))
            .replace(/\bgrid-area\s*:\s*1 \/ 1;/g, ''),
        ).not.toMatch(/\border\s*:|-reverse\b|\bgrid-(?:area|row|column)\b/);
        return;
      }

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
    //
    // DDR-075 admits one element, the contents bar's menu panel, which hangs from the bar over the
    // page below the wide breakpoint. It is still last in the bar's markup, below the title and the
    // button as it is on screen, so nothing is reordered; it is taken out of the flow so that
    // opening it moves nothing under it. It is admitted once, and a second is a decision.
    it('takes nothing but a pseudo-element out of the flow, per DDR-021 and DDR-075', () => {
      for (const { selector, body } of rules(css)) {
        if (/position:\s*(?:absolute|fixed)/.test(body)) {
          if (name === 'contents.module.css' && selector === '.list') {
            continue;
          }

          // DDR-100 admits the chat's launcher and its panel, which stand at the window's corner
          // over the page, and its text said only to assistive technology, which draws nothing.
          // The panel is last in the page's markup, after the launcher, as the reader meets them.
          if (name === 'digital-twin-chat.module.css' && ['.launcher', '.panel', '.hidden'].includes(selector)) {
            continue;
          }

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

  // DDR-100: the chat's one rule for text said only to assistive technology is exactly the one the
  // size test above leaves out, so nothing else can shelter under it.
  it('hides text from sight in the chat by one rule alone', () => {
    const chat = stylesheets.find(({ name }) => name === 'digital-twin-chat.module.css')!;

    expect(chat.css).toMatch(hiddenText);
    expect(chat.css.match(/\b1px;/g)).toHaveLength(2);
  });
});
