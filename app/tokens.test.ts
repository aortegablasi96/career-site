import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// DDR-011 sets accessibility floors on the type scale. These tests read the tokens as written,
// so a later edit to the scale cannot quietly go below them.
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

  it('sets body text at 16px, the browser default, which DM Sans reads comfortably at', () => {
    const body = fontSteps.find(({ name }) => name === 'medium');

    expect(rem(body!.value)).toBe(1);
  });

  it('sets no step below 13px, the floor DDR-011 lowers to for tags and level badges alone', () => {
    for (const { value } of fontSteps) {
      expect(rem(value)).toBeGreaterThanOrEqual(0.8125);
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
  ])('defines the $role weight as $weight, one of the three DDR-011 allows', ({ role, weight }) => {
    expect(token(`font-weight-${role}`)).toBe(weight);
  });

  it('defines no weight beyond those three, because each one is a font file to derive', () => {
    expect([...root.matchAll(/--font-weight-([\w-]+):/g)].map(([, name]) => name)).toEqual([
      'regular',
      'medium',
      'semibold',
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

// DDR-012 records the contrast of every pairing the site uses. These tests measure the tokens as
// written, so a colour change fails here until the decision record is revised with it.
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
      'text-heading',
      'text',
      'text-secondary',
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
      'decoration',
      'focus',
    ]);
  });

  it('writes every colour as a six-digit hex value or a reference to another colour', () => {
    for (const [name, value] of colors) {
      expect(value, name).toMatch(/^#[\da-f]{6}$|^var\(--color-[\w-]+\)$/);
    }
  });

  it.each([
    // Text: WCAG 2.2 AA asks 4.5:1, and DDR-012 holds all text to it, whatever its size. Every
    // pairing is measured on the page and, where the text can sit on one, on a white card.
    { foreground: 'text-heading', background: 'surface', required: 4.5, recorded: 16.66 },
    { foreground: 'text-heading', background: 'surface-card', required: 4.5, recorded: 17.85 },
    { foreground: 'text', background: 'surface', required: 4.5, recorded: 9.67 },
    { foreground: 'text', background: 'surface-card', required: 4.5, recorded: 10.35 },
    { foreground: 'text-secondary', background: 'surface', required: 4.5, recorded: 7.07 },
    { foreground: 'text-secondary', background: 'surface-card', required: 4.5, recorded: 7.58 },
    { foreground: 'accent', background: 'surface', required: 4.5, recorded: 7.38 },
    { foreground: 'accent', background: 'surface-card', required: 4.5, recorded: 7.9 },
    { foreground: 'on-accent', background: 'accent', required: 4.5, recorded: 7.9 },
    // The tinted surfaces, each with the ink it carries.
    { foreground: 'text-tag', background: 'surface-tag', required: 4.5, recorded: 7.07 },
    {
      foreground: 'text-level-advanced',
      background: 'surface-level-advanced',
      required: 4.5,
      recorded: 7.29,
    },
    {
      foreground: 'text-level-proficient',
      background: 'surface-level-proficient',
      required: 4.5,
      recorded: 8.88,
    },
    {
      foreground: 'text-level-basic',
      background: 'surface-level-basic',
      required: 4.5,
      recorded: 6.92,
    },
    // Non-text elements that carry meaning: WCAG 2.2 AA asks 3:1.
    { foreground: 'focus', background: 'surface', required: 3, recorded: 7.38 },
  ])(
    '$foreground on $background meets $required:1, at the $recorded:1 DDR-012 records',
    ({ foreground, background, required, recorded }) => {
      const ratio = contrast(color(foreground), color(background));

      expect(ratio).toBeGreaterThanOrEqual(required);
      expect(ratio).toBeCloseTo(recorded, 2);
    },
  );

  // DDR-012 lets the hairlines sit below 3:1 only because none of them carries information: each
  // is hidden from assistive technology, and removing all of them would lose nothing. This test
  // holds the value to what the record measured, so it cannot drift into carrying meaning.
  it('draws decoration at the 2.39:1 DDR-012 records, which is why it may carry no information', () => {
    expect(contrast(color('decoration'), color('surface'))).toBeCloseTo(2.39, 2);
  });

  it('keeps the focus outline in the accent, per DDR-012', () => {
    expect(colors.get('focus')).toBe('var(--color-accent)');
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

describe('responsive tokens', () => {
  it('redefines tokens at one breakpoint only, a minimum width in em, so it follows the browser font-size setting', () => {
    expect(breakpoints.map(({ query }) => query)).toEqual(['(min-width: 20em)']);
  });

  it('adapts only the page and section titles and the page edges, never a step of either scale', () => {
    expect([...atBreakpoint.keys()]).toEqual(adapted.map(({ role }) => role));
  });

  it.each(adapted)(
    'sets --$role to --$narrow below the breakpoint and --$wide from it, as DDR-014 records',
    ({ role, narrow, wide }) => {
      expect(token(role)).toBe(`var(--${narrow})`);
      expect(atBreakpoint.get(role)).toBe(`var(--${wide})`);
    },
  );

  // An item title is already body size, so there is no step below it a narrow screen could take.
  it('leaves the item title at body size at every width', () => {
    expect(token('font-size-item-title')).toBe('var(--font-size-medium)');
    expect(atBreakpoint.has('font-size-item-title')).toBe(false);
  });

  it('sets the smallest interactive target at 44 CSS pixels', () => {
    expect(token('target-size-min')).toBe('44px');
  });
});

// DDR-005 sets the page for paper by redefining tokens in print, and gives the sheet its margins.
// These tests read the tokens as written, so the print treatment cannot drift from the record.
const inPrint = redefined(print?.body);

const forPaper = [
  { name: 'root-font-size', value: '10pt' },
  { name: 'color-surface', value: 'transparent' },
  { name: 'content-width', value: 'none' },
  { name: 'page-gutter', value: '0' },
  { name: 'page-padding-block', value: '0' },
];

describe('print tokens', () => {
  it('redefines only the base size, the surface, and the column and its edges', () => {
    expect([...inPrint.keys()]).toEqual(forPaper.map(({ name }) => name));
  });

  it.each(forPaper)('sets --$name to $value in print, as DDR-005 records', ({ name, value }) => {
    expect(inPrint.get(name)).toBe(value);
  });

  // DDR-005 chose its 10pt base so that the smallest step of DDR-001's scale came to exactly 9pt,
  // DDR-001's 12px floor. DDR-011's scale reaches lower, so at the same base the tags and level
  // badges print at 8.1pt. DDR-005 is #52's to rework, and this test records where the two records
  // stand rather than endorsing it: body text still prints at 10pt, and either record changing
  // fails here.
  it('prints body text at 10pt, and the smallest step at 8.1pt, which #52 has to settle', () => {
    const base = Number.parseFloat(inPrint.get('root-font-size')!);
    const body = fontSteps.find(({ name }) => name === 'medium')!;
    const smallest = Math.min(...fontSteps.map(({ value }) => rem(value)));

    expect(base * rem(body.value)).toBeCloseTo(10, 5);
    expect(base * smallest).toBeCloseTo(8.125, 5);
  });

  it('gives the sheet margins in a unit of the paper', () => {
    expect(tokens).toMatch(/@page\s*\{\s*margin:\s*2cm;\s*\}/);
  });
});
