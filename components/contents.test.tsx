import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Contents } from './contents';

const styles = readFileSync(new URL('./contents.module.css', import.meta.url), 'utf8').replace(
  /\/\*[\s\S]*?\*\//g,
  '',
);

/** The declarations of the rule whose selector is exactly `selector`. */
function rule(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return styles.match(new RegExp(`(?:^|\\n)${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
}

const sections = [
  { id: 'experience', link: 'Experience' },
  { id: 'education', link: 'Education' },
];

describe('Contents', () => {
  it('is navigation with an accessible name, so assistive technology can announce it', () => {
    const html = renderToStaticMarkup(<Contents label="Sections" sections={sections} />);

    expect(html).toMatch(/^<nav aria-label="Sections"/);
  });

  // DDR-031: a link shows the design's word for its section, which is not always the heading.
  it('links to each section by the word its content gives the link, in order', () => {
    const html = renderToStaticMarkup(<Contents label="Sections" sections={sections} />);
    const links = [...html.matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map(([, href, text]) => ({
      href,
      text,
    }));

    expect(links).toEqual([
      { href: '#experience', text: 'Experience' },
      { href: '#education', text: 'Education' },
    ]);
  });

  // DDR-031: pinned by `position: sticky`, which keeps the bar in the flow and in the markup order,
  // on the design's translucent surface and blur, over its bottom hairline.
  it('pins the bar to the top of the window on the design’s surface, per DDR-031', () => {
    const bar = rule('.contents');

    expect(bar).toMatch(/position:\s*sticky;/);
    expect(bar).toMatch(/inset-block-start:\s*0;/);
    expect(bar).toMatch(/background-color:\s*var\(--color-surface-bar\);/);
    expect(bar).toMatch(/backdrop-filter:\s*blur\(var\(--contents-bar-blur\)\);/);
    expect(bar).toMatch(/border-block-end:\s*1px solid var\(--color-border\);/);
  });

  // The design's scroll-triggered shadow is declined, per DDR-031, so the bar draws none.
  it('draws no shadow, so it needs no script to draw one on scroll', () => {
    expect(styles).not.toMatch(/box-shadow/);
  });

  it('lays the links out in the page’s column, at least the design’s height tall', () => {
    const list = rule('.list');

    expect(list).toMatch(/min-block-size:\s*var\(--contents-bar-height\);/);
    expect(list).toMatch(/max-inline-size:\s*var\(--content-width\);/);
    expect(list).toMatch(/margin-inline:\s*auto;/);
    expect(list).toMatch(/padding-inline:\s*var\(--page-gutter\);/);
    expect(list).toMatch(/flex-wrap:\s*wrap;/);
  });

  // DDR-025: the design sets a contents link in #64748b where every other link on the page is in
  // the accent. It is 4.44:1 and fails WCAG 1.4.3. The underline the base styles give every link is
  // untouched, so colour is not what identifies it. DDR-031 does not reopen that.
  it('sets a contents link in the muted ink and leaves its underline alone, per DDR-025', () => {
    expect(rule('.link')).toMatch(/color:\s*var\(--color-text-muted\);/);
    expect(styles).not.toMatch(/text-decoration/);
  });

  // DDR-030 left the design's medium weight on these links to the story that rewrote this file.
  it('sets a contents link in medium, as the design draws it, per DDR-030 and DDR-031', () => {
    expect(rule('.link')).toMatch(/font-weight:\s*var\(--font-weight-medium\);/);
  });

  // DDR-027: a link's box is the line its label sets in — the design's own 20px — where DDR-014
  // padded it to 44px. The flex container is what makes the box the whole line rather than the
  // shorter content area an inline box would give it, and the row gap keeps two wrapped links
  // outside the circles WCAG 2.2's 2.5.8 measures its spacing exception with.
  it('gives a link the box the design draws and a wrapped row a gap, per DDR-027', () => {
    expect(rule('.link')).toMatch(/display:\s*inline-flex;/);
    expect(rule('.link')).not.toMatch(/min-block-size|min-inline-size/);
    expect(rule('.list')).toMatch(/row-gap:\s*var\(--space-small\);/);
  });

  it('renders nothing when there are no sections to list', () => {
    expect(renderToStaticMarkup(<Contents label="Sections" sections={[]} />)).toBe('');
  });
});
