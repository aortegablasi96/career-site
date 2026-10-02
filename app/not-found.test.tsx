import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { introduction } from '@/content/introduction';
import { notFound } from '@/content/not-found';
import NotFoundPage, { metadata } from './not-found';

const html = renderToStaticMarkup(<NotFoundPage />);

// #283 and DDR-093: an address the site does not have shows a view's frame around the top of a
// view, in place of Next.js's own page, which had no bar, no way back and the page's own title.
describe('the page an address the site does not have shows', () => {
  it('names itself in the browser tab, as a view does, rather than repeating the page’s title', () => {
    expect(metadata.title).toBe(`${notFound.title} – ${introduction.name}`);
  });

  // It is never indexed, so it names no canonical address of its own.
  it('names no canonical address', () => {
    expect(metadata.alternates).toBeUndefined();
  });

  it('has one h1, which says the page was not found', () => {
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toMatch(new RegExp(`<h1[^>]*>${notFound.title}</h1>`));
    expect(html).toContain(notFound.text);
  });

  // DDR-050: the site's own contents bar, every link leading back to the page, and nothing marked.
  it('opens with the site’s contents bar, whose links lead back to the page', () => {
    const nav = html.match(/<nav [\s\S]*?<\/nav>/)?.[0] ?? '';

    expect(html.indexOf('<nav')).toBeLessThan(html.indexOf('<main>'));
    expect(nav).toContain('href="/#portfolio"');
    expect(nav).not.toContain('aria-current');
  });

  // The one thing it offers, as the owner chose on #283, before its heading as a view's way back is.
  it('leads back to the page, above its heading', () => {
    expect(html).toMatch(new RegExp(`<a [^>]*href="/"[^>]*>.*${notFound.back}</a>`));
    expect(html.indexOf(notFound.back)).toBeLessThan(html.indexOf('<h1'));
  });

  // DDR-028: the site's own footer, where the owner's addresses are written out.
  it('ends with the site’s footer', () => {
    expect(html.indexOf('<footer')).toBeGreaterThan(html.indexOf('</main>'));
    expect(html).toContain(introduction.contact[0]!.text);
  });
});
