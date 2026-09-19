import { readFileSync } from 'node:fs';
import type { ReactElement } from 'react';
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
    const html = renderToStaticMarkup(<Contents label="Sections" home="Home" sections={sections} />);

    expect(html).toMatch(/^<nav aria-label="Sections"/);
  });

  // DDR-031: a link shows the design's word for its section, which is not always the heading.
  // DDR-045: the first link is Home, which leads to the top of the page, before every section.
  it('links to the top of the page, then to each section by its content’s word, in order', () => {
    const html = renderToStaticMarkup(<Contents label="Sections" home="Home" sections={sections} />);
    const links = [...html.matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map(([, href, text]) => ({
      href,
      text,
    }));

    expect(links).toEqual([
      { href: '#top', text: 'Home' },
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

  // DDR-048: the edge is drawn at all times — the hairline in `--color-rule`, a step darker than
  // the design's `--color-border` at the owner's request on #114, and the design's shadow — so the
  // bar looks the same at the top of the page as it does once scrolled.
  it('draws its hairline and the design’s shadow at all times, per DDR-048', () => {
    const bar = rule('.contents');

    expect(bar).toMatch(/border-block-end:\s*1px solid var\(--color-rule\);/);
    expect(bar).toMatch(/box-shadow:\s*var\(--shadow-bar\);/);
  });

  // DDR-048: nothing marks the bar and no other rule can change its edge — not a scrolled state,
  // not a rule for a reader without script — and the edge has no transition, so it never animates.
  it('has one edge, which nothing changes or animates, per DDR-048', () => {
    const html = renderToStaticMarkup(<Contents label="Sections" home="Home" sections={sections} />);

    expect(html).not.toMatch(/data-scrolled/);
    expect(styles).not.toMatch(/\.contents\[/);
    expect(styles).not.toMatch(/scripting/);
    expect(styles).not.toMatch(/transition/);
    expect(styles.match(/border-block-end|box-shadow/g)).toHaveLength(2);
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
    expect(styles.match(/text-decoration/g)).toHaveLength(2);
  });

  // DDR-042: the static HTML marks no section, so a reader without script gets the bar as it was,
  // and a reader with script gets the mark once the scroll position has been read.
  it('marks no link as current until script has read the scroll position, per DDR-042', () => {
    const html = renderToStaticMarkup(<Contents label="Sections" home="Home" sections={sections} />);

    expect(html).not.toMatch(/aria-current/);
  });

  // DDR-042, amending DDR-033: the current section's link is underlined, as a state, and nothing
  // else about it changes — not its ink, at the owner's request, and nothing that takes space, so
  // marking a link moves nothing. The rule is keyed on `aria-current`, so what is drawn is what
  // assistive technology is told, and it is the one rule besides DDR-033's that touches the
  // underline.
  it('only underlines the current section’s link, per DDR-042', () => {
    const current = rule('.link[aria-current]');

    expect(current).not.toMatch(/color/);
    expect(current).toMatch(/text-decoration-line:\s*underline;/);
    expect(current).toMatch(/text-underline-offset:\s*var\(--underline-offset\);/);
    expect(current).not.toMatch(/font-weight|padding|margin|border|size/);
  });

  // Each section's items are server-rendered elements. Only its id and its word may reach the
  // Client Component, per ADR-009, or the items would be sent again as client props.
  it('hands the bar each section’s id and word and nothing else, per ADR-009', () => {
    const withItems = sections.map((section) => ({ ...section, items: [<p key="x">Item</p>] }));
    const bar = Contents({ label: 'Sections', home: 'Home', sections: withItems }) as ReactElement<{
      sections: unknown;
    }>;

    expect(bar.props.sections).toEqual(sections);
  });

  // DDR-045: Home's word is the one string the bar is handed that names no section.
  it('hands the bar the Home link’s word, per DDR-045', () => {
    const bar = Contents({ label: 'Sections', home: 'Home', sections }) as ReactElement<{
      home: unknown;
    }>;

    expect(bar.props.home).toBe('Home');
  });

  // DDR-035: the design takes a contents link to the accent under the pointer and on keyboard
  // focus alike, so focus is never less visible than hover. The outline the base styles draw on
  // focus stays; this rule adds a colour and takes nothing away.
  it('takes the accent under the pointer and on keyboard focus, per DDR-035', () => {
    expect(styles).toMatch(
      /\.link:hover,\s*\.link:focus-visible\s*\{\s*color:\s*var\(--color-accent\);\s*\}/,
    );
    expect(styles).not.toMatch(/outline/);
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

  // DDR-045, amending DDR-031: with Home as a sixth link, the narrow gap is the small step, so the
  // bar is never taller than it was with five links; from the wide breakpoint it is 32px, as it was.
  it('holds its links a small step apart below the wide breakpoint and a large one from it', () => {
    expect(rule('.list')).toMatch(/column-gap:\s*var\(--space-small\);/);
    expect(styles).toMatch(
      /@media \(min-width: 48em\)\s*\{\s*\.list\s*\{\s*column-gap:\s*var\(--space-large\);\s*\}\s*\}/,
    );
  });

  it('renders nothing when there are no sections to list', () => {
    expect(renderToStaticMarkup(<Contents label="Sections" home="Home" sections={[]} />)).toBe('');
  });
});
