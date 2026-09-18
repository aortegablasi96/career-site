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
  });

  // DDR-034: at rest the bar has no visible edge. The hairline is there but transparent, so the bar
  // is the same height in both states and nothing below it moves when the edge appears.
  it('rests with a transparent hairline and no shadow, per DDR-034', () => {
    const bar = rule('.contents');

    expect(bar).toMatch(/border-block-end:\s*1px solid transparent;/);
    expect(bar).not.toMatch(/box-shadow/);
  });

  // DDR-034: once the page has scrolled, a hairline and the design's shadow, and only the colour of
  // the hairline changes, never its width. The hairline is `--color-rule`, a step darker than the
  // design's `--color-border`, at the owner's request on #114.
  it('draws the hairline and the design’s shadow once the page has scrolled, per DDR-034', () => {
    const scrolled = rule('.contents[data-scrolled]');

    expect(scrolled).toMatch(/border-block-end-color:\s*var\(--color-rule\);/);
    expect(scrolled).toMatch(/box-shadow:\s*var\(--shadow-bar\);/);
    expect(scrolled).not.toMatch(/border-block-end:|border-width|border-block-end-width/);
  });

  // DDR-034: with script off nothing can mark the bar, so it keeps the hairline DDR-031 drew.
  it('keeps its hairline when script is off, per DDR-034', () => {
    expect(styles).toMatch(
      /@media \(scripting: none\)\s*\{\s*\.contents\s*\{\s*border-block-end-color:\s*var\(--color-rule\);\s*\}\s*\}/,
    );
  });

  // DDR-034: the design's 200ms change, and none for a reader who prefers reduced motion. The
  // transition is written only inside the preference for motion, so it is nowhere else.
  it('changes state over the design’s 200ms only when motion is welcome, per DDR-034', () => {
    expect(styles).toMatch(
      /@media \(prefers-reduced-motion: no-preference\)\s*\{\s*\.contents\s*\{\s*transition-property:\s*border-block-end-color, box-shadow;\s*transition-duration:\s*var\(--contents-bar-transition\);\s*\}\s*\}/,
    );
    expect(styles.match(/^\s*transition[\w-]*:/gm)).toHaveLength(2);
  });

  // DDR-034: the server renders the bar at rest, which is what a reader without script keeps.
  it('renders the bar at rest, unmarked, until script has read the scroll position', () => {
    const html = renderToStaticMarkup(<Contents label="Sections" sections={sections} />);

    expect(html).not.toMatch(/data-scrolled/);
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
  // the accent. It is 4.44:1 and fails WCAG 1.4.3.
  it('sets a contents link in the muted ink, per DDR-025', () => {
    expect(rule('.link')).toMatch(/color:\s*var\(--color-text-muted\);/);
  });

  // DDR-033: the design draws no underline on a contents link, and it supersedes DDR-025's ruling
  // that kept one. The link is identified by its place in the bar, its weight and its focus
  // outline. Only the link rule takes the underline away, so no other link on the page loses it.
  it('draws no underline on a contents link, per DDR-033', () => {
    expect(rule('.link')).toMatch(/text-decoration-line:\s*none;/);
    expect(styles.match(/text-decoration/g)).toHaveLength(1);
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
