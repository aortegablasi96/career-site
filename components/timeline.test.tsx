import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TimelineRow } from './timeline';

const role = renderToStaticMarkup(
  <TimelineRow dates="Jun 2023 – Oct 2024" place="Lugano, Switzerland" title="Digital Solutions Manager" subtitle="Ponera Group">
    <ul>
      <li>A point</li>
    </ul>
  </TimelineRow>,
);

const credential = renderToStaticMarkup(
  <TimelineRow dates="Jun 2024" title="Project Management Professional (PMP)" subtitle="Project Management Institute" />,
);

/** The markup's text, as a reader meets it. */
const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

/** The stylesheet without its comments, so a rule is not matched against its explanation. */
const styles = readFileSync(new URL('./timeline.module.css', import.meta.url), 'utf8')
  .replace(/\r\n/g, '\n')
  .replace(/\/\*[\s\S]*?\*\//g, '');

/** The stylesheet before its media query, so a rule there is read apart from the one inside it. */
const base = styles.split('@media')[0]!;

/** The declarations of the rule whose selector list is exactly `selector`, inside `within`. */
function rule(selector: string, within = base): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return within.match(new RegExp(`(?:^|[{}])\\s*${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
}

/** The body of a media query, so a rule inside it is read separately from the same rule outside. */
function media(query: string): string {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return styles.match(new RegExp(`@media\\s*${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1] ?? '';
}

describe('TimelineRow', () => {
  it('is an article, which the print styles keep whole on one page', () => {
    expect(role).toMatch(/^<article[ >]/);
    expect(role).toMatch(/<\/article>$/);
  });

  // The markup order is the visual order at both widths, per DDR-014: the dates come before the
  // title, which is where a narrow screen shows them, and the wide breakpoint moves them into a
  // column beside it without reordering anything.
  it('puts the dates, and a place, before the title, in the reading order', () => {
    expect(text(role)).toContain('Jun 2023 – Oct 2024 Lugano, Switzerland Digital Solutions Manager');
  });

  // DDR-010 makes the title the heading of the row and moves the company or institution out of
  // DDR-006's middle-dot line onto one of its own.
  it('titles the row with an h3, and follows it with its subtitle on a line of its own', () => {
    expect(role).toContain('<h3>Digital Solutions Manager</h3>');
    expect(text(role)).toContain('Digital Solutions Manager Ponera Group');
    expect(text(role)).not.toContain('Ponera Group ·');
  });

  it('shows only the dates in the date column when there is no place, as a credential has none', () => {
    expect(text(credential)).toContain('Jun 2024 Project Management Professional (PMP)');
    expect(credential.match(/<p[^>]*>/g)).toHaveLength(2);
  });

  it('ends at its subtitle when it has no body, as a certification does', () => {
    expect(credential).toMatch(/<p[^>]*>Project Management Institute<\/p><\/div><\/article>$/);
  });

  // The spine draws the path from one row to the next and says nothing the text does not, so a
  // screen reader never meets it, per DDR-010.
  it('hides the ornament from assistive technology, and gives it no text', () => {
    for (const html of [role, credential]) {
      const spines = [...html.matchAll(/<div [^>]*aria-hidden="true"[^>]*>(.*?)<\/div>/g)];

      expect(spines).toHaveLength(1);
      expect(spines[0]![1]!.replace(/<[^>]+>/g, '')).toBe('');
    }
  });
});

// DDR-010 lays the timeline out and DDR-014 gives it the one breakpoint it may write. These read
// the stylesheet as written, so a later edit cannot quietly drop a rule an acceptance criterion
// rests on.
describe('timeline styles', () => {
  const wide = media('(min-width: 48em)');

  it('lays a row out as the date column, the spine, and the content, per DDR-010', () => {
    expect(rule('.row', wide)).toMatch(
      /grid-template-columns:\s*var\(--timeline-date-width\) var\(--timeline-spine-width\) 1fr;/,
    );
    expect(rule('.dates', wide)).toMatch(/text-align:\s*end;/);
  });

  it('is a single column below the wide breakpoint, with the dates above the title', () => {
    expect(rule('.row')).not.toMatch(/display:\s*grid;/);
    expect(rule('.row > * + *')).toMatch(/margin-block-start:\s*var\(--space-x-small\);/);
  });

  it('does not render the spine below the wide breakpoint, so it is absent there entirely', () => {
    expect(rule('.spine')).toMatch(/display:\s*none;/);
    expect(rule('.spine', wide)).toMatch(/display:\s*flex;/);
  });

  it('draws the spine in the decoration colour, which may carry no information, per DDR-012', () => {
    expect(rule('.dot')).toMatch(/inline-size:\s*var\(--timeline-dot-size\);/);
    expect(rule('.dot')).toMatch(/background-color:\s*var\(--color-decoration\);/);
    expect(rule('.line')).toMatch(/inline-size:\s*var\(--timeline-line-width\);/);
    expect(rule('.line')).toMatch(/background-color:\s*var\(--color-decoration\);/);
  });

  // The space between two rows is carried inside the row, so the line reaches the next dot rather
  // than breaking at the gap between them. The last row has no next dot to reach.
  it('runs the line to the next row, and no further than the last one in a section', () => {
    expect(rule('.content')).toMatch(/padding-block-end:\s*var\(--space-item\);/);
    expect(rule('section > .row')).toMatch(/margin-block-start:\s*0;/);
    expect(rule('section > .row:last-child .content')).toMatch(/padding-block-end:\s*0;/);
    expect(rule('section > .row:last-child .line')).toMatch(/display:\s*none;/);
  });
});
