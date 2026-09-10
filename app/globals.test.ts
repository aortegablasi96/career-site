import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// DDR-002 relies on two base styles for accessibility that no component should have to repeat.
// These tests read the stylesheet as written, so a later edit cannot quietly remove them.
const globals = readFileSync(new URL('./globals.css', import.meta.url), 'utf8');

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
