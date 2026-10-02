import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (name: string) => readFileSync(new URL(`./${name}`, import.meta.url));

/** A colour token's value, as `app/tokens.css` defines it at the root. */
function token(name: string): string {
  const css = read('tokens.css').toString('utf8');

  return css.match(new RegExp(`${name}:\\s*(#[0-9a-f]{6})`, 'i'))![1]!.toLowerCase();
}

// #281 and DDR-094: the site's icon is a white "A" in the headings' serif on the accent, the mark
// the owner chose. Next.js links each file from every route's head.
describe('the site’s icon', () => {
  const svg = read('icon.svg').toString('utf8');

  it('is drawn in the accent and white, the colours the owner chose', () => {
    expect(svg).toContain(`fill="${token('--color-accent')}"`);
    expect(svg).toContain(`fill="${token('--color-surface-card')}"`);
  });

  // A tab or a search result draws the file alone, with none of the site's fonts, so the letter is
  // its outline rather than text set in a font the reader may not have.
  it('draws the letter as an outline, needing no font', () => {
    expect(svg).toMatch(/<path /);
    expect(svg).not.toMatch(/<text|font-family/);
  });

  // The address browsers and crawlers ask for on their own, at the three sizes a tab, a bookmark and
  // a search result draw.
  it('is also an .ico at 16, 32 and 48 pixels', () => {
    const ico = read('favicon.ico');
    const count = ico.readUInt16LE(4);
    const sizes = Array.from({ length: count }, (_, index) => ico[6 + index * 16] || 256).sort(
      (a, b) => a - b,
    );

    expect(ico.readUInt16LE(2)).toBe(1);
    expect(sizes).toEqual([16, 32, 48]);
  });

  // A phone's home screen: 180 pixels square and edge to edge, because the phone rounds it itself.
  it('is a 180-pixel square for a phone’s home screen', () => {
    const png = read('apple-icon.png');

    expect(png.subarray(1, 4).toString('ascii')).toBe('PNG');
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([180, 180]);
  });
});
