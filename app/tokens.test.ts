import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// DDR-022 sets the type scale and its floor, where DDR-011 set the scale this one supersedes.
// These tests read the tokens as written, so a later edit to the scale cannot quietly go below it.
const tokens = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');

// DDR-014 makes the tokens mobile-first: the root block holds every token at its value for the
// narrowest viewports, and the narrow breakpoint redefines a few of them where there is room. The
// wide breakpoint redefines none, because what changes there is layout rather than a value, and it
// is written by the components; components/stylesheets.test.ts holds them to it. DDR-005
// redefines some tokens for paper in a print media query. The tests of each scale read the root
// block.
const mediaRule = /@media\s*([^{]+?)\s*\{\s*:root\s*\{([^}]*)\}\s*\}/g;
const mediaRules = [...tokens.matchAll(mediaRule)].map(([, query, body]) => ({ query, body }));
const breakpoints = mediaRules.filter(({ query }) => query !== 'print');
const print = mediaRules.find(({ query }) => query === 'print');
const root = tokens.replace(mediaRule, '');

const fontSizes = [...root.matchAll(/--font-size-([\w-]+):\s*([^;]+);/g)].map(
  ([, name, value]) => ({ name, value: value.trim() }),
);

// The steps of the scale are written in rem. The heading roles DDR-014 adds refer to a step.
const fontSteps = fontSizes.filter(({ value }) => value.endsWith('rem'));

/** The size in rem, which is also the size in multiples of 16px at the browser default. */
function rem(value: string): number {
  return Number.parseFloat(value);
}

/** Any token's value at the root, as written. */
function token(name: string): string | undefined {
  return root.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1].trim();
}

/** Every custom property a media query's root block redefines, as written. */
function redefined(body = ''): Map<string, string> {
  return new Map(
    [...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()]),
  );
}

describe('type scale tokens', () => {
  it('defines the scale', () => {
    expect(fontSteps.map(({ name }) => name)).toEqual([
      'xxxx-small',
      'xxx-small',
      'xx-small',
      'x-small',
      'small',
      'medium',
      'large',
      'x-large',
      'xx-large',
      'xxx-large',
    ]);
  });

  it('writes every size as a step in rem or a reference to one, so text follows the browser font-size setting', () => {
    const onTheScale = new RegExp(
      `^\\d*\\.?\\d+rem$|^var\\(--font-size-(?:${fontSteps.map(({ name }) => name).join('|')})\\)$`,
    );

    for (const { name, value } of fontSizes) {
      expect(value, name).toMatch(onTheScale);
    }
  });

  it('measures every rem from the browser font-size setting on screen', () => {
    expect(token('root-font-size')).toBe('100%');
  });

  // Nine of the ten are measured node by node off `career-site-design`; `xx-large` is the narrow
  // page title, which the design has no view for, and DDR-022 keeps it at the 36px DDR-011 gave it.
  it.each([
    { step: 'xxxx-small', px: 10 },
    { step: 'xxx-small', px: 11 },
    { step: 'xx-small', px: 12.8 },
    { step: 'x-small', px: 13 },
    { step: 'small', px: 14 },
    { step: 'medium', px: 15 },
    { step: 'large', px: 16 },
    { step: 'x-large', px: 20.8 },
    { step: 'xx-large', px: 36 },
    { step: 'xxx-large', px: 51.2 },
  ])('sets $step to $px px at the browser default, as DDR-022 measures it', ({ step, px }) => {
    expect(rem(fontSteps.find(({ name }) => name === step)!.value) * 16).toBeCloseTo(px, 5);
  });

  it('sets body text at 15px, the size the design sets its running text at', () => {
    const body = fontSteps.find(({ name }) => name === 'medium');

    expect(rem(body!.value)).toBe(0.9375);
  });

  it('sets no step below 10px, the floor DDR-022 lowers to for the level badge alone', () => {
    for (const { value } of fontSteps) {
      expect(rem(value)).toBeGreaterThanOrEqual(0.625);
    }
  });

  it('orders the steps from smallest to largest', () => {
    const sizes = fontSteps.map(({ value }) => rem(value));

    expect(sizes).toEqual([...sizes].sort((a, b) => a - b));
  });

  it.each([
    { role: 'regular', weight: '400' },
    { role: 'medium', weight: '500' },
    { role: 'semibold', weight: '600' },
    { role: 'bold', weight: '700' },
  ])('defines the $role weight as $weight, one of the four DDR-023 allows', ({ role, weight }) => {
    expect(token(`font-weight-${role}`)).toBe(weight);
  });

  it('defines no weight beyond those four, because each one is a font file to derive', () => {
    expect([...root.matchAll(/--font-weight-([\w-]+):/g)].map(([, name]) => name)).toEqual([
      'regular',
      'medium',
      'semibold',
      'bold',
    ]);
  });

  it.each([
    { role: 'body', family: 'dm-sans' },
    { role: 'heading', family: 'lora' },
  ])('sets the $role family from the $family files app/layout.tsx loads', ({ role, family }) => {
    expect(token(`font-family-${role}`)).toBe(`var(--font-${family})`);
  });

  it('holds running text to a measure in ch, so it follows the font size', () => {
    expect(token('measure')).toMatch(/^\d+ch$/);
  });
});

// DDR-017 adds tracking to DDR-011's system. These read the three values as written, so a change
// to any of them fails here until the record is revised with it.
describe('tracking tokens', () => {
  const tracking = [...root.matchAll(/--letter-spacing-([\w-]+):\s*([^;]+);/g)].map(
    ([, name, value]) => ({ name, value: value.trim() }),
  );

  it('defines the three densities DDR-017 sets, and no fourth', () => {
    expect(tracking.map(({ name }) => name)).toEqual(['tight', 'loose', 'x-loose']);
  });

  it.each([
    { role: 'tight', value: '-0.025em' },
    { role: 'loose', value: '0.025em' },
    { role: 'x-loose', value: '0.1em' },
  ])('sets the $role value to $value, as the design measures it', ({ role, value }) => {
    expect(token(`letter-spacing-${role}`)).toBe(value);
  });

  // Tracking has to keep its proportion to the letters it separates, so it is measured from the
  // element rather than from the root: the page title and a level badge cannot share an absolute
  // amount. Every font size is in rem, so an em here still follows the browser's font-size setting.
  it('writes every value in em, so tracking scales with the text it separates', () => {
    for (const { value } of tracking) {
      expect(value).toMatch(/^-?\d*\.?\d+em$/);
    }
  });

  // The tight value pulls letters together, and a large enough negative value would run them into
  // one another. These are the two directions, held apart, so neither can be edited into the other.
  it('tightens by less than it opens, and opens by more where the labels are smallest', () => {
    expect(rem(token('letter-spacing-tight')!)).toBeLessThan(0);
    expect(rem(token('letter-spacing-loose')!)).toBeGreaterThan(0);
    expect(rem(token('letter-spacing-x-loose')!)).toBeGreaterThan(
      rem(token('letter-spacing-loose')!),
    );
  });

  // Tracking is not redefined anywhere: it is a proportion of the text, so it needs no narrow
  // value and no value of its own on paper. The 11pt print base carries it down with the type.
  it('is the same at every width and on paper, because em already follows the size', () => {
    for (const { body } of [...breakpoints, ...(print ? [print] : [])]) {
      expect([...redefined(body).keys()].filter((name) => name.startsWith('letter-spacing'))).toEqual(
        [],
      );
    }
  });
});

// DDR-025 records the contrast of every pairing the site uses, and it is the first colour record
// that has failures to record: the owner decided on 2026-09-17 that `career-site-design` prevails
// over the records written to protect WCAG conformance, so five pairings the page draws now sit
// below what WCAG 2.2 AA asks. These tests measure the tokens as written and hold each pairing to
// the ratio the record states rather than to a floor, so a colour still cannot change without the
// record changing — and a pairing cannot quietly get better or worse either.
const colors = new Map(
  [...root.matchAll(/--color-([\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [
    name,
    value.trim(),
  ]),
);

/** The token's colour as a hex string, following a var() reference to another colour token. */
function color(name: string): string {
  const value = colors.get(name);
  const reference = value?.match(/^var\(--color-([\w-]+)\)$/);

  return reference ? color(reference[1]) : value!;
}

/** Relative luminance, as defined by WCAG 2.1. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = Number.parseInt(hex.slice(i, i + 2), 16) / 255;

    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio, as defined by WCAG 2.1. */
function contrast(foreground: string, background: string): number {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);

  return (lighter + 0.05) / (darker + 0.05);
}

describe('colour tokens', () => {
  it('defines the palette by role', () => {
    expect([...colors.keys()]).toEqual([
      'surface',
      'surface-card',
      'surface-bar',
      'text-heading',
      'text',
      'text-secondary',
      'text-muted',
      'text-faint',
      'accent',
      'on-accent',
      'surface-tag',
      'text-tag',
      'surface-level-advanced',
      'text-level-advanced',
      'surface-level-proficient',
      'text-level-proficient',
      'surface-level-basic',
      'text-level-basic',
      'rule',
      'border',
      'border-accent',
      'marker',
      'surface-hover',
      'accent-hover',
      'border-accent-hover',
      'underline',
      'underline-hover',
      'focus',
    ]);
  });

  // Every colour but one. DDR-031 gives the contents bar the design's translucent surface, which
  // is the one colour on the site that is not opaque, and it is held out here by name.
  it('writes every colour as a six-digit hex value or a reference to another colour', () => {
    for (const [name, value] of colors) {
      if (name === 'surface-bar') {
        continue;
      }

      expect(value, name).toMatch(/^#[\da-f]{6}$|^var\(--color-[\w-]+\)$/);
    }
  });

  // DDR-031: the bar is the page's own off-white at 96%, so it is measured by what it can become.
  // Over the page it is the page. Over the darkest ink the page draws it is the darkest it gets,
  // and a contents link on that is 4.10:1 — below the 4.44:1 DDR-025 records on the page, and on
  // the same side of 4.5.
  it('draws the contents bar in the page’s surface at 96%, and measures its link on the worst blend', () => {
    const [r, g, b, alpha] = colors.get('surface-bar')!.match(/[\d.]+/g)!.map(Number);
    const hex = (channels: readonly number[]) =>
      `#${channels.map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')}`;
    const under = color('text-heading');
    const beneath = [1, 3, 5].map((i) => Number.parseInt(under.slice(i, i + 2), 16));
    const blend = hex([r!, g!, b!].map((channel, i) => alpha! * channel + (1 - alpha!) * beneath[i]!));

    expect(hex([r!, g!, b!])).toBe(color('surface'));
    expect(alpha).toBe(0.96);
    expect(contrast(color('text-muted'), blend)).toBeCloseTo(4.1, 1);
    expect(contrast(color('text-muted'), blend)).toBeLessThan(4.5);
    // DDR-035: under the pointer or on focus the link takes the accent, which clears 4.5:1 there.
    expect(contrast(color('accent'), blend)).toBeCloseTo(5.42, 2);
  });

  // Every pairing the page draws, with the ratio DDR-025 measures, the Success Criterion that
  // applies to it, and whether it is met. A pairing that is not here is unverified and is not to be
  // used, which is DDR-012's rule carried forward.
  //
  // `asked` is 4.5 for text, per WCAG 2.2 AA 1.4.3, whatever its size; 3 for non-text that carries
  // meaning, per 1.4.11; and 0 for a hairline that carries nothing, which neither criterion
  // reaches. `meets` is what the record states, not what the page ought to do — four rows below
  // say `false`, and they are the cost of the design prevailing.
  const pairings = [
    { foreground: 'text-heading', background: 'surface', asked: 4.5, recorded: 16.66, meets: true },
    { foreground: 'text-heading', background: 'surface-card', asked: 4.5, recorded: 17.85, meets: true },
    { foreground: 'text', background: 'surface', asked: 4.5, recorded: 9.67, meets: true },
    { foreground: 'text-secondary', background: 'surface', asked: 4.5, recorded: 7.07, meets: true },
    // A company, an institution, a thesis and a contents link. Running text, below 4.5:1.
    { foreground: 'text-muted', background: 'surface', asked: 4.5, recorded: 4.44, meets: false },
    // The introduction's location, a role's place, and from #96 the footer. Below half of it.
    { foreground: 'text-faint', background: 'surface', asked: 4.5, recorded: 2.39, meets: false },
    { foreground: 'accent', background: 'surface', asked: 4.5, recorded: 5.87, meets: true },
    { foreground: 'accent', background: 'surface-card', asked: 4.5, recorded: 6.29, meets: true },
    { foreground: 'on-accent', background: 'accent', asked: 4.5, recorded: 6.29, meets: true },
    // The tinted surfaces, each with the ink it carries. The design and the records agree on all
    // four, which is why none of them moves here.
    { foreground: 'text-tag', background: 'surface-tag', asked: 4.5, recorded: 7.07, meets: true },
    { foreground: 'text-level-advanced', background: 'surface-level-advanced', asked: 4.5, recorded: 7.29, meets: true },
    { foreground: 'text-level-proficient', background: 'surface-level-proficient', asked: 4.5, recorded: 8.88, meets: true },
    { foreground: 'text-level-basic', background: 'surface-level-basic', asked: 4.5, recorded: 6.92, meets: true },
    // Non-text that carries meaning. The focus outline is offset onto the page, so that is the one
    // surface it is measured against, and it still clears 3:1 with the accent two steps lighter.
    { foreground: 'focus', background: 'surface', asked: 3, recorded: 5.87, meets: true },
    // The bullet marker, which DDR-019 held to 3:1 because it prints and because it is what tells
    // a point from a paragraph. The design's own value is not a fifth of the way there.
    { foreground: 'marker', background: 'surface', asked: 3, recorded: 1.86, meets: false },
    // A contact pill's border, on the white the design fills the pill with. DDR-012 held a
    // control's edge to 3:1 on the ground that it carries meaning; DDR-025 gives that up and says
    // what identifies the control instead.
    { foreground: 'border-accent', background: 'surface-card', asked: 3, recorded: 1.49, meets: false },
    // Under the pointer and on keyboard focus, per DDR-035. A contact pill's text on its hover fill,
    // and its border on the same fill: stronger than at rest and still below 3:1. The CV pill's
    // darker fill under white, and a project link's darker ink on the page.
    { foreground: 'accent', background: 'surface-hover', asked: 4.5, recorded: 5.62, meets: true },
    { foreground: 'border-accent-hover', background: 'surface-hover', asked: 3, recorded: 1.78, meets: false },
    { foreground: 'on-accent', background: 'accent-hover', asked: 4.5, recorded: 7.9, meets: true },
    { foreground: 'accent-hover', background: 'surface', asked: 4.5, recorded: 7.38, meets: true },
    // A project link's underline, which DDR-012 made what identifies a link: the design's pale
    // indigo at rest, and the stronger one under the pointer.
    { foreground: 'underline', background: 'surface', asked: 3, recorded: 1.86, meets: false },
    { foreground: 'underline-hover', background: 'surface', asked: 3, recorded: 4.17, meets: true },
    // Hairlines that carry nothing, so neither criterion reaches them: the rule beside a section
    // heading, a card's edge against the page it sits on and the white it encloses, and the
    // timeline's spine and dots.
    { foreground: 'rule', background: 'surface', asked: 0, recorded: 1.39, meets: true },
    { foreground: 'border', background: 'surface', asked: 0, recorded: 1.15, meets: true },
    { foreground: 'border', background: 'surface-card', asked: 0, recorded: 1.23, meets: true },
    { foreground: 'border-accent', background: 'surface', asked: 0, recorded: 1.39, meets: true },
  ] as const;

  it.each(pairings)(
    '$foreground on $background measures the $recorded:1 DDR-025 records',
    ({ foreground, background, recorded }) => {
      expect(contrast(color(foreground), color(background))).toBeCloseTo(recorded, 2);
    },
  );

  // The measurement above says what a pairing is, not whether it is enough. This says which rows
  // the records admit are failures, by name, so another cannot join them quietly and none of them
  // can be quietly improved without its record being revised with it. The first four are DDR-025's
  // and the last two DDR-035's.
  it('fails exactly the six pairings DDR-025 and DDR-035 record as failures, and no others', () => {
    for (const { foreground, background, asked, recorded, meets } of pairings) {
      expect(recorded >= asked, `${foreground} on ${background}`).toBe(meets);
    }

    expect(pairings.filter(({ meets }) => !meets).map(({ foreground }) => foreground)).toEqual([
      'text-muted',
      'text-faint',
      'marker',
      'border-accent',
      'border-accent-hover',
      'underline',
    ]);
  });

  // DDR-025 takes the design's #4f46e5, which DDR-012 measured at 5.87:1 and turned down in favour
  // of #4338ca at 7.38:1 because the filled CV control carries white text at 13px. It still clears
  // AA both ways and reaches AAA neither way, where the colour it replaces reached AAA both.
  it('keeps the accent above AA as text and under white text, though no longer above AAA', () => {
    expect(contrast(color('accent'), color('surface'))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(color('on-accent'), color('accent'))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(color('accent'), color('surface'))).toBeLessThan(7);
  });

  // The one ink the design draws that is not the accent. DDR-012 made the tag's ink a reference to
  // the accent because the draft set both in #4338ca; the design sets a tag in #4338ca and
  // everything else in #4f46e5, so the two part here and the tag keeps the darker value.
  it('writes the tag’s ink out rather than following the accent, per DDR-025', () => {
    expect(colors.get('text-tag')).toBe('#4338ca');
    expect(color('text-tag')).not.toBe(color('accent'));
  });

  // Every hairline is now fainter than the 2.39:1 DDR-012 called the lightest value at which a line
  // reads at all — which is, exactly, the ratio the faint ink now sets text at. This holds the two
  // apart: a hairline may not climb into the inks, and an ink may not sink into the hairlines.
  it('draws every hairline below the value DDR-012 called the lightest that reads', () => {
    const faintest = contrast(color('text-faint'), color('surface'));

    for (const name of ['rule', 'border', 'border-accent']) {
      expect(contrast(color(name), color('surface')), name).toBeLessThan(faintest);
    }
  });

  it('keeps the focus outline in the accent, per DDR-025', () => {
    expect(colors.get('focus')).toBe('var(--color-accent)');
  });
});

// DDR-020 gives the site one elevation: the introduction's four controls and the four language
// cards are raised, and nothing else is. DDR-021 adds the second and last, the profile photo's two
// lights. These read the tokens as written, so neither the geometry the designs drew nor the ink
// the records measured can drift from them.
describe('elevation tokens', () => {
  const shadows = [...root.matchAll(/--shadow-([\w-]+):/g)].map(([, name]) => name);

  // DDR-020 named its level for what it does rather than numbering it, so that a second would be a
  // decision to take rather than the next number to reach for. DDR-021 took it, and named the two
  // for the one element that may read them rather than putting them on a scale above `raised`: the
  // photo is not raised off the page the way a control or a card is, it is lit.
  it('names every shadow for what it does, so a third is a decision rather than a number', () => {
    expect(shadows).toEqual(['raised', 'photo-glow', 'photo-inner', 'bar']);
  });

  // The photo's two lights are the design's own, ink and geometry both, per DDR-021. They are two
  // tokens rather than one value with two layers because they are drawn on two elements: an inset
  // box-shadow on an `<img>` paints nothing, since the replaced content covers it, so the glow goes
  // on the frame around the photo and the inner shadow on a pseudo-element over it.
  it('keeps the photo’s two lights exactly as the design draws them, per DDR-021', () => {
    expect(token('shadow-photo-glow')).toBe('0 8px 40px rgba(79, 70, 229, 0.18)');
    expect(token('shadow-photo-inner')).toBe('inset 0 4px 4px rgba(0, 0, 0, 0.25)');
  });

  // Only the inner one is inset, and only it. The glow spreads outwards from the frame, so an
  // `inset` on it would draw the light inside the photo instead of around it.
  it('insets the inner shadow and nothing else', () => {
    expect(token('shadow-photo-inner')).toMatch(/^inset\b/);
    expect(token('shadow-photo-glow')).not.toMatch(/\binset\b/);
    expect(token('shadow-raised')).not.toMatch(/\binset\b/);
    expect(token('shadow-bar')).not.toMatch(/\binset\b/);
  });

  // DDR-034: the contents bar's edge once the page has scrolled, ink and geometry both from the
  // Figma Make file, where the bar is `shadow-[0_2px_16px_rgba(26,26,46,0.10)]`.
  it('keeps the bar’s shadow exactly as the design draws it, per DDR-034', () => {
    expect(token('shadow-bar')).toBe('0 2px 16px rgba(26, 26, 46, 0.1)');
  });

  // The design's `duration-200`. A time rather than a length, so it is in ms.
  it('changes the bar’s edge over the design’s 200ms, per DDR-034', () => {
    expect(token('contents-bar-transition')).toBe('200ms');
  });

  // DDR-035: the design's `transition-colors`, whose default is 150ms — shorter than the bar's,
  // because a link answers a pointer and the bar answers the page.
  it('changes a link’s colours over the design’s 150ms, per DDR-035', () => {
    expect(token('hover-transition')).toBe('150ms');
  });

  // DDR-035: the design's `underline-offset-2`, in px as the focus outline's offset is.
  it('draws a project link’s underline 2px below the text, per DDR-035', () => {
    expect(token('underline-offset')).toBe('2px');
  });

  // The two layers, their lengths and their ink are all the design's now, per DDR-025, which amends
  // DDR-020. That record kept the geometry and took the ink from 10% black to 22%, because at 10%
  // the darkest row the shadow draws is 1.50:1 against the page — below the 2.39:1 of the hairlines
  // it was measured against. Those hairlines are gone: every one of the three DDR-025 draws is
  // fainter than 1.50:1, so the floor the darkening cleared no longer exists.
  it('keeps the design’s two layers and its own ink, as DDR-025 amends DDR-020', () => {
    expect(token('shadow-raised')).toBe(
      '0 1px 1.5px rgba(0, 0, 0, 0.1), 0 1px 1px rgba(0, 0, 0, 0.1)',
    );
  });

  // A shadow marks an edge and gains nothing from growing with the reader's text, so its lengths
  // are in px, as the focus outline's and the timeline's line are. DDR-021's two follow it.
  it.each(['raised', 'photo-glow', 'photo-inner', 'bar'])(
    'draws --shadow-%s in px, as the site’s other hairlines do',
    (name) => {
      expect(token(`shadow-${name}`)!.replace(/rgba\([^)]*\)/g, '')).not.toMatch(/\d(?:rem|em|%)/);
    },
  );

  // The palette above is opaque throughout, and this is why: the shadow's ink is translucent black,
  // which is wrong on text, on a border and on a surface, so it is held inside the one value that
  // uses it rather than offered to anything that can read a colour token.
  // DDR-031 admits one translucent colour, the contents bar's surface. It is a surface rather than
  // an ink, and the argument above is about inks; it still holds for every one of them.
  it('keeps its translucent ink out of the palette, whose one translucency is the bar’s surface', () => {
    for (const [name, value] of colors) {
      if (name === 'surface-bar') {
        continue;
      }

      expect(value, name).not.toMatch(/rgba?\(|#[\da-f]{8}\b/i);
    }

    expect(token('shadow-raised')!.match(/rgba\(/g)).toHaveLength(2);
    expect(token('shadow-photo-glow')!.match(/rgba\(/g)).toHaveLength(1);
    expect(token('shadow-photo-inner')!.match(/rgba\(/g)).toHaveLength(1);
    expect(token('shadow-bar')!.match(/rgba\(/g)).toHaveLength(1);
    // Every translucency at the root belongs to a shadow, five of them, or is the bar's surface.
    expect(root.match(/rgba\(/g)).toHaveLength(6);
  });
});

// DDR-013 derives the spacing scale from a base unit and names the rhythm the page uses. These
// tests read the tokens as written, so a value off the scale cannot be added quietly.
const spaces = new Map(
  [...root.matchAll(/--space-([\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [
    name,
    value.trim(),
  ]),
);

const steps = [...spaces].filter(([, value]) => value.endsWith('rem'));
const stepNames = steps.map(([name]) => name);

describe('spacing tokens', () => {
  it('defines the scale', () => {
    expect(stepNames).toEqual(['x-small', 'small', 'medium', 'large', 'x-large']);
  });

  it('writes every spacing token as a step in rem or a reference to a step', () => {
    const onTheScale = new RegExp(`^\\d*\\.?\\d+rem$|^var\\(--space-(?:${stepNames.join('|')})\\)$`);

    for (const [name, value] of spaces) {
      expect(value, name).toMatch(onTheScale);
    }
  });

  it('derives the scale from a 1rem base unit, each step twice the one below', () => {
    const sizes = steps.map(([, value]) => rem(value));

    expect(rem(spaces.get('medium')!)).toBe(1);
    expect(sizes.slice(1)).toEqual(sizes.slice(0, -1).map((size) => size * 2));
  });

  it.each([
    { role: 'flow', step: 'medium' },
    { role: 'item', step: 'large' },
    { role: 'section', step: 'x-large' },
  ])('separates at the $role level by the $step step, as DDR-013 records', ({ role, step }) => {
    expect(spaces.get(role)).toBe(`var(--space-${step})`);
  });

  // DDR-013's single change to DDR-003: the column is no longer the measure. It is wide enough for
  // the sections to place things beside each other, and running text is held to the measure by the
  // base styles instead.
  it('sets the column wider than running text, in rem, so it grows with the text', () => {
    expect(token('content-width')).toBe('68.75rem');
    expect(token('content-width')).not.toBe(token('measure'));
  });

  it.each([
    { name: 'radius-small', value: '0.25rem' },
    { name: 'radius-large', value: '0.75rem' },
    { name: 'radius-pill', value: '9999px' },
  ])('rounds a corner by --$name, one of the three DDR-013 defines', ({ name, value }) => {
    expect(token(name)).toBe(value);
  });

  // DDR-010's photo. Two tokens rather than one that adapts, because DDR-014 keeps the wide
  // breakpoint out of this file and a media query cannot read a custom property; the introduction
  // swaps between them. In rem, as the column is, so the photo keeps its proportion to the name
  // beside it when text is enlarged.
  it('sizes the profile photo at both widths, in rem, the wider one larger', () => {
    expect(token('photo-width')).toBe('6rem');
    expect(token('photo-width-wide')).toBe('13rem');
    expect(token('photo-ratio')).toBe('3 / 4');
    expect(rem(token('photo-width-wide')!)).toBeGreaterThan(rem(token('photo-width')!));
  });

  it('adapts the photo in the components rather than here, so the wide breakpoint stays theirs', () => {
    expect(atBreakpoint.has('photo-width')).toBe(false);
    expect(atBreakpoint.has('photo-width-wide')).toBe(false);
    expect(atBreakpoint.has('photo-ratio')).toBe(false);
  });

  // DDR-010's timeline, at the widths the UI Review on #43 measured: a 160px date column, a 28px
  // spine, and a 12px dot. In rem, as the page column and the photo are, so the timeline keeps its
  // proportion to the text beside it when text is enlarged.
  it('sizes the timeline’s columns and its dot in rem, at the widths DDR-010 lays out', () => {
    expect(token('timeline-date-width')).toBe('10rem');
    expect(token('timeline-spine-width')).toBe('1.75rem');
    expect(token('timeline-dot-size')).toBe('0.75rem');
  });

  it('keeps the dot inside the spine column it sits in', () => {
    expect(rem(token('timeline-dot-size')!)).toBeLessThan(rem(token('timeline-spine-width')!));
  });

  // The line down the spine marks the path from one dot to the next and gains nothing from growing
  // with the text, so it is a hairline in px, as the focus outline is.
  it('draws the spine’s line as a hairline in px', () => {
    expect(token('timeline-line-width')).toBe('2px');
  });

  // DDR-036: the design's ringed marker, node 2:260 — a 6px core at the centre of the 12px circle,
  // and a 3px ring around it. The core grows with the circle; the ring is a hairline, as the line
  // it joins is.
  it('draws the dot’s core at half the dot, and its ring as a hairline in px, per DDR-036', () => {
    expect(token('timeline-dot-core')).toBe('0.375rem');
    expect(rem(token('timeline-dot-core')!) * 2).toBe(rem(token('timeline-dot-size')!));
    expect(token('timeline-dot-ring')).toBe('3px');
  });

  // The dot's centre is the centre of the title's first line, which is an item title set at the
  // heading's leading, so the offset is measured from those two and not from a number of its own.
  it('sets the dot level with the title’s first line, from the title’s own size and leading', () => {
    const offset = token('timeline-dot-offset')!.replace(/\s+/g, ' ');

    expect(offset).toContain('var(--font-size-item-title) * var(--line-height-heading)');
    expect(offset).toContain('var(--timeline-dot-size)');
    expect(offset).toContain('var(--timeline-dot-ring)');
  });

  it('lays the timeline out in the components rather than here, so the wide breakpoint stays theirs', () => {
    for (const name of [
      'timeline-date-width',
      'timeline-spine-width',
      'timeline-dot-size',
      'timeline-dot-core',
      'timeline-dot-ring',
      'timeline-dot-offset',
      'timeline-line-width',
    ]) {
      expect(atBreakpoint.has(name), name).toBe(false);
    }
  });

  // DDR-010's project media, at the width the UI Review on #43 measured: a 280px column, at 4:3.
  // The width is in rem, as the page column, the photo and the timeline are; the ratio is a shape
  // rather than a length, so it has no unit.
  it('sizes the projects’ media in rem, at the 4:3 DDR-010 lays it out', () => {
    expect(token('project-media-width')).toBe('17.5rem');
    expect(token('project-media-ratio')).toBe('4 / 3');
  });

  // ADR-004 prepares each file once, by hand, at the size it is shown, so the media is one width
  // rather than one per breakpoint. It is the widest thing the page places beside running text,
  // and it still leaves the text column room: at the 1100px page it is about a quarter of it.
  it('leaves the text room beside the media, which is a quarter of the page column', () => {
    expect(rem(token('project-media-width')!)).toBeLessThan(rem(token('content-width')!) / 3);
  });

  it('lays the projects out in the components rather than here, so the wide breakpoint stays theirs', () => {
    for (const name of ['project-media-width', 'project-media-ratio']) {
      expect(atBreakpoint.has(name), name).toBe(false);
    }
  });
});

// DDR-014 adapts the scales at the narrow breakpoint, in em, by redefining the role tokens that
// differ, and records the step each takes on either side of it. These tests read the tokens as
// written, so a third breakpoint, or a new adaptation, cannot be added quietly.
const atBreakpoint = redefined(breakpoints[0]?.body);

const adapted = [
  { role: 'font-size-page-title', narrow: 'font-size-xx-large', wide: 'font-size-xxx-large' },
  { role: 'font-size-section-title', narrow: 'font-size-large', wide: 'font-size-x-large' },
  { role: 'page-gutter', narrow: 'space-small', wide: 'space-medium' },
  { role: 'page-padding-block', narrow: 'space-large', wide: 'space-section' },
];

// DDR-014's table also sends the language cards from one column to two at the breakpoint, and a
// component may write only the wide breakpoint, so the count adapts here. It is a count rather than
// a step, which is why it is held separately: one card to a line at the narrowest is what keeps the
// row from overflowing a 320px screen at 200% text, per DDR-010 and #51.
const adaptedCounts = [{ role: 'language-columns', narrow: '1', wide: '2' }];

describe('responsive tokens', () => {
  it('redefines tokens at one breakpoint only, a minimum width in em, so it follows the browser font-size setting', () => {
    expect(breakpoints.map(({ query }) => query)).toEqual(['(min-width: 20em)']);
  });

  it('adapts only the page and section titles, the page edges and the language columns, never a step of either scale', () => {
    expect([...atBreakpoint.keys()]).toEqual([...adapted, ...adaptedCounts].map(({ role }) => role));
  });

  it.each(adapted)(
    'sets --$role to --$narrow below the breakpoint and --$wide from it, as DDR-014 records',
    ({ role, narrow, wide }) => {
      expect(token(role)).toBe(`var(--${narrow})`);
      expect(atBreakpoint.get(role)).toBe(`var(--${wide})`);
    },
  );

  it.each(adaptedCounts)(
    'sets --$role to $narrow below the breakpoint and $wide from it, as DDR-010 records',
    ({ role, narrow, wide }) => {
      expect(token(role)).toBe(narrow);
      expect(atBreakpoint.get(role)).toBe(wide);
    },
  );

  // An item title is already body size, so there is no step below it a narrow screen could take.
  it('leaves the item title at body size at every width', () => {
    expect(token('font-size-item-title')).toBe('var(--font-size-medium)');
    expect(atBreakpoint.has('font-size-item-title')).toBe(false);
  });

  // DDR-027 takes DDR-014's 44px minimum away rather than lowering it: a target is the size the
  // design draws it, which is padding and a label on a control and the line of text on a link, and
  // there is no length left for a token to hold. The name is held absent so that reinstating a
  // minimum has to move the record with it.
  it('holds no interactive target to a minimum size, per DDR-027', () => {
    expect(token('target-size-min')).toBeUndefined();
    expect(tokens).not.toMatch(/target-size/);
  });
});

// DDR-015 sets the page for paper by redefining tokens in print, and gives the sheet its margins.
// These tests read the tokens as written, so the print treatment cannot drift from the record.
const inPrint = redefined(print?.body);

const forPaper = [
  { name: 'root-font-size', value: '12pt' },
  { name: 'color-surface', value: 'transparent' },
  { name: 'color-surface-card', value: 'transparent' },
  { name: 'color-surface-bar', value: 'transparent' },
  { name: 'color-surface-tag', value: 'transparent' },
  { name: 'color-surface-level-advanced', value: 'transparent' },
  { name: 'color-surface-level-proficient', value: 'transparent' },
  { name: 'color-surface-level-basic', value: 'transparent' },
  { name: 'color-surface-hover', value: 'transparent' },
  { name: 'color-rule', value: 'transparent' },
  { name: 'color-border', value: 'transparent' },
  { name: 'color-border-accent', value: 'transparent' },
  { name: 'color-border-accent-hover', value: 'transparent' },
  { name: 'shadow-raised', value: 'none' },
  { name: 'shadow-photo-glow', value: 'none' },
  { name: 'shadow-photo-inner', value: 'none' },
  { name: 'shadow-bar', value: 'none' },
  { name: 'content-width', value: 'none' },
  { name: 'page-gutter', value: '0' },
  { name: 'page-padding-block', value: '0' },
  { name: 'photo-width', value: '28mm' },
];

describe('print tokens', () => {
  it('redefines only the base size, every surface, every hairline, the shadows, the column and its edges, and the photo', () => {
    expect([...inPrint.keys()]).toEqual(forPaper.map(({ name }) => name));
  });

  it.each(forPaper)('sets --$name to $value in print, as DDR-015 records', ({ name, value }) => {
    expect(inPrint.get(name)).toBe(value);
  });

  // DDR-015: every tint on the page is dropped on paper, so the sheet reads the same whether or not
  // the browser prints background graphics, and no hairline is drawn at all. The inks the tints
  // carried are untouched: each is darker on white paper than on the surface it was measured
  // against, so no pairing DDR-025 records gets worse.
  //
  // DDR-025 splits DDR-012's one `--color-decoration` into three, so what paper drops is three
  // tokens rather than one. The bullet marker stays drawn, per DDR-019, and this holds it out of
  // the list: it is the one mark on the page that carries something a reader of paper needs.
  it('drops every surface and every hairline, and touches no ink or marker, per DDR-015', () => {
    const dropped = [...inPrint.keys()].filter((name) => inPrint.get(name) === 'transparent');
    const droppable = [
      ...root.matchAll(/--(color-surface[\w-]*|color-rule|color-border[\w-]*):/g),
    ].map(([, name]) => name);

    expect(dropped.sort()).toEqual(droppable.sort());
    for (const name of inPrint.keys()) {
      expect(name).not.toMatch(/^color-text|^color-marker$/);
    }
  });

  // The photo prints beside the name at the measure the UI Review on #43 gives it. The introduction
  // is the one section whose paper layout is the narrow one, per DDR-015 — a 28mm photo is short,
  // so a column of its own would leave three quarters of it empty — so it is the narrow token that
  // print redefines. The measure is in mm because a photograph on a sheet is a size of the paper
  // rather than a multiple of the type, as the sheet's own margins are.
  it('prints the photo at 28mm beside the name, in a unit of the paper, per DDR-015', () => {
    expect(inPrint.get('photo-width')).toBe('28mm');
    expect(token('photo-width')).toMatch(/rem$/);
    expect(inPrint.has('photo-width-wide')).toBe(false);
    // The ratio is a shape, so paper keeps the one the screen has: 28mm across, about 37mm tall.
    expect(inPrint.has('photo-ratio')).toBe(false);
  });

  // DDR-005 chose a 10pt base so that the smallest step of DDR-001's scale came to exactly 9pt.
  // DDR-011's scale reached lower, and DDR-015 settled it by raising the base to 11pt, which put
  // body text — then a 1rem step — at 11pt and the smallest step at 8.94pt. DDR-022 takes the
  // design's scale, where body text is 0.9375rem, so an unchanged base would print it at 10.3pt
  // and the level badges at 6.9pt. It amends DDR-015 by raising the base to 12pt, which puts body
  // text at 11.25pt and the smallest step at 7.5pt. Either record changing fails here.
  it('prints body text at 11.25pt and the smallest step at 7.5pt, as DDR-022 amends DDR-015', () => {
    const base = Number.parseFloat(inPrint.get('root-font-size')!);
    const body = fontSteps.find(({ name }) => name === 'medium')!;
    const smallest = Math.min(...fontSteps.map(({ value }) => rem(value)));

    expect(base * rem(body.value)).toBeCloseTo(11.25, 5);
    expect(base * smallest).toBeCloseTo(7.5, 5);
  });

  // DDR-020: a sheet is lit by the room it is read in, and the surfaces the shadow raises are flat
  // on paper anyway, their fills and edges dropped just above it. Dropping it here rather than in a
  // component is what keeps a stylesheet from writing a print rule to put out its own light.
  // DDR-021's two follow it: the glow spreads 40px of indigo across the sheet and the inner shadow
  // darkens the top of the portrait, and a reader of paper is missing neither. The photograph keeps
  // its shape, which is drawn by a radius rather than by a light.
  it('draws no shadow on paper, per DDR-020, DDR-021 and DDR-034', () => {
    expect(inPrint.get('shadow-raised')).toBe('none');
    expect(inPrint.get('shadow-photo-glow')).toBe('none');
    expect(inPrint.get('shadow-photo-inner')).toBe('none');
    expect(inPrint.get('shadow-bar')).toBe('none');
  });

  it('gives the sheet margins in a unit of the paper', () => {
    expect(tokens).toMatch(/@page\s*\{\s*margin:\s*2cm;\s*\}/);
  });
});
