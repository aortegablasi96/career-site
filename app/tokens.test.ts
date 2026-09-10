import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// DDR-001 sets accessibility floors on the type scale. These tests read the tokens as written,
// so a later edit to the scale cannot quietly go below them.
const tokens = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');

const fontSizes = [...tokens.matchAll(/--font-size-([\w-]+):\s*([^;]+);/g)].map(
  ([, name, value]) => ({ name, value: value.trim() }),
);

/** The size in rem, which is also the size in multiples of 16px at the browser default. */
function rem(value: string): number {
  return Number.parseFloat(value);
}

describe('type scale tokens', () => {
  it('defines the scale', () => {
    expect(fontSizes.map(({ name }) => name)).toEqual([
      'small',
      'medium',
      'large',
      'x-large',
      'xx-large',
    ]);
  });

  it('sizes every step in rem, so text follows the browser font-size setting', () => {
    for (const { value } of fontSizes) {
      expect(value).toMatch(/^\d*\.?\d+rem$/);
    }
  });

  it('sets body text at 16px or larger', () => {
    const body = fontSizes.find(({ name }) => name === 'medium');

    expect(rem(body!.value)).toBeGreaterThanOrEqual(1);
  });

  it('sets no step below 12px', () => {
    for (const { value } of fontSizes) {
      expect(rem(value)).toBeGreaterThanOrEqual(0.75);
    }
  });

  it('orders the steps from smallest to largest', () => {
    const sizes = fontSizes.map(({ value }) => rem(value));

    expect(sizes).toEqual([...sizes].sort((a, b) => a - b));
  });
});

// DDR-002 records the contrast of every pairing the site uses. These tests measure the tokens as
// written, so a colour change fails here until the decision record is revised with it.
const colors = new Map(
  [...tokens.matchAll(/--color-([\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [
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
      'text',
      'text-secondary',
      'accent',
      'border',
      'focus',
    ]);
  });

  it('writes every colour as a six-digit hex value or a reference to another colour', () => {
    for (const [name, value] of colors) {
      expect(value, name).toMatch(/^#[\da-f]{6}$|^var\(--color-[\w-]+\)$/);
    }
  });

  it.each([
    // Text: WCAG 2.1 AA asks 4.5:1, and DDR-002 holds all text to it, whatever its size.
    { foreground: 'text', background: 'surface', required: 4.5, recorded: 16.5 },
    { foreground: 'text-secondary', background: 'surface', required: 4.5, recorded: 6.57 },
    { foreground: 'accent', background: 'surface', required: 4.5, recorded: 8.04 },
    { foreground: 'surface', background: 'accent', required: 4.5, recorded: 8.04 },
    // Non-text elements that carry meaning: WCAG 2.1 AA asks 3:1.
    { foreground: 'focus', background: 'surface', required: 3, recorded: 8.04 },
    { foreground: 'border', background: 'surface', required: 3, recorded: 3.42 },
  ])(
    '$foreground on $background meets $required:1, at the $recorded:1 DDR-002 records',
    ({ foreground, background, required, recorded }) => {
      const ratio = contrast(color(foreground), color(background));

      expect(ratio).toBeGreaterThanOrEqual(required);
      expect(ratio).toBeCloseTo(recorded, 2);
    },
  );
});

// DDR-003 derives the spacing scale from a base unit and names the rhythm the page uses. These
// tests read the tokens as written, so a value off the scale cannot be added quietly.
const spaces = new Map(
  [...tokens.matchAll(/--space-([\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [
    name,
    value.trim(),
  ]),
);

const steps = [...spaces].filter(([, value]) => value.endsWith('rem'));
const stepNames = steps.map(([name]) => name);

/** Any token's value, as written. */
function token(name: string): string | undefined {
  return tokens.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1].trim();
}

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
  ])('separates at the $role level by the $step step, as DDR-003 records', ({ role, step }) => {
    expect(spaces.get(role)).toBe(`var(--space-${step})`);
  });

  it('holds the column to the measure, with a gutter from the scale', () => {
    expect(token('content-width')).toBe('var(--measure)');
    expect(token('page-gutter')).toBe('var(--space-medium)');
  });
});
