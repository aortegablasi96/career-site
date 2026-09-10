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
