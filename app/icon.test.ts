import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { BrandMark } from '../components/brand-mark';

const read = (name: string) => readFileSync(new URL(`./${name}`, import.meta.url));

/** A colour token's value, as `app/tokens.css` defines it at the root, following any `var()`. */
function token(name: string): string {
  const css = read('tokens.css').toString('utf8');
  const value = css.match(new RegExp(`${name}:\\s*([^;]+);`))![1]!.trim();
  const alias = value.match(/^var\((--[\w-]+)\)$/);

  return alias ? token(alias[1]!) : value.toLowerCase();
}

/** The `d` of every path, in order. */
const paths = (markup: string) => [...markup.matchAll(/\bd="([^"]+)"/g)].map((match) => match[1]);

// #331 and DDR-106, superseding DDR-094: the site's icon is the owner's mark, the one the contents
// bar draws (DDR-105), on a white rounded square. Next.js links each file from every route's head.
describe('the site’s icon', () => {
  const svg = read('icon.svg').toString('utf8');

  // A tab draws the file alone, with none of the site's stylesheets, so the icon carries the mark's
  // inks as values. They must stay the tokens' values, or the tab and the bar would show two marks.
  it('is drawn in the mark’s inks, on white', () => {
    expect(svg).toContain(`fill="${token('--color-surface-card')}"`);
    expect(svg).toContain(`fill="${token('--color-brand-mark-ink')}"`);
    expect(svg).toContain(`stroke="${token('--color-brand-mark-ink')}"`);
    expect(svg).toContain(`stop-color="${token('--color-brand-mark-start')}"`);
    expect(svg).toContain(`stop-color="${token('--color-brand-mark-end')}"`);
  });

  // The mark keeps its own shape: the icon draws BrandMark's three paths, unaltered.
  it('draws the bar’s mark, its paths unaltered', () => {
    const mark = renderToStaticMarkup(createElement(BrandMark));

    expect(paths(svg)).toEqual(paths(mark));
    expect(svg).toMatch(/<rect width="64" height="64" rx="14" /);
    expect(svg).not.toMatch(/<text|<image|font-family/);
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

  // A phone's home screen: 180 pixels square and edge to edge, because the phone rounds it itself,
  // and with no alpha channel, so no corner can show black.
  it('is an opaque 180-pixel square for a phone’s home screen', () => {
    const png = read('apple-icon.png');

    expect(png.subarray(1, 4).toString('ascii')).toBe('PNG');
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([180, 180]);
    expect(png[25]).toBe(2);
  });
});
