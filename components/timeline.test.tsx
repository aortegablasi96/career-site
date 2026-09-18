import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { dateLabels } from '@/content/dates';
import { DateRange } from './date-range';
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

  // DDR-017 tracks the dates and not the place, and both are metadata lines in the same column, so
  // the date line is the one that carries a class of its own. A credential has only the date line.
  it('marks the date line, and not the place beside it, as the one that is tracked', () => {
    const classes = (html: string) =>
      [...html.matchAll(/<p class="([^"]*)"/g)].map(([, value]) => value.split(' ').length);

    expect(classes(role).slice(0, 2)).toEqual([2, 1]);
    expect(classes(credential)[0]).toBe(2);
  });

  // DDR-018 draws the case in the stylesheet, so the string a screen reader announces, and the
  // value the time element carries, are still the ones content/ writes.
  it('draws the case rather than rewriting the dates, so the row keeps what it announces', () => {
    const dated = renderToStaticMarkup(
      <TimelineRow
        dates={<DateRange start="2024-10" labels={dateLabels} />}
        title="Digital Product Manager"
        subtitle="Zerouno Informatica"
      />,
    );

    expect(dated).toMatch(/<time datetime="2024-10">Oct.2024<\/time>/i);
    expect(text(dated).replace(/ /g, ' ')).toContain('Oct 2024 – Present');
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
  const wide = media('(min-width: 48em), print');

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

  it('draws the spine in the indigo hairline, which may carry no information, per DDR-025', () => {
    expect(rule('.line')).toMatch(/inline-size:\s*var\(--timeline-line-width\);/);
    expect(rule('.line')).toMatch(/background-color:\s*var\(--color-border-accent\);/);
    expect(rule('.lead')).toMatch(/inline-size:\s*var\(--timeline-line-width\);/);
    expect(rule('section > .row .lead')).toMatch(/background-color:\s*var\(--color-border-accent\);/);
  });

  // DDR-036: the design's ringed marker, node 2:260 — a circle in the page's surface, ringed in the
  // line's tint, with an accent core at its centre.
  it('marks each row with the design’s ringed dot and its accent core, per DDR-036', () => {
    const dot = rule('.dot');

    expect(dot).toMatch(/inline-size:\s*var\(--timeline-dot-size\);/);
    expect(dot).toMatch(/block-size:\s*var\(--timeline-dot-size\);/);
    expect(dot).toMatch(/border:\s*var\(--timeline-dot-ring\) solid var\(--color-border-accent\);/);
    expect(dot).toMatch(/background-color:\s*var\(--color-surface\);/);

    const core = rule('.dot::before');

    expect(core).toMatch(/inline-size:\s*var\(--timeline-dot-core\);/);
    expect(core).toMatch(/block-size:\s*var\(--timeline-dot-core\);/);
    expect(core).toMatch(/background-color:\s*var\(--color-accent\);/);
  });

  // DDR-036: one line from the first dot to the last. The lead brings the dot level with the
  // title's first line and, below the first row, joins the line the row above sends down; nothing
  // holds the pieces apart.
  it('runs one unbroken line through the dots, from the first to the last', () => {
    expect(role).toMatch(/<span class="[^"]*lead[^"]*"><\/span><span class="[^"]*dot[^"]*"><\/span><span class="[^"]*line[^"]*"><\/span>/);
    expect(rule('.lead')).toMatch(/block-size:\s*var\(--timeline-dot-offset\);/);
    expect(rule('.lead')).not.toMatch(/background/);
    expect(rule('.spine', wide)).not.toMatch(/gap|padding/);
  });

  // DDR-025: the design sets a place in #94a3b8 where it sets a company in #64748b, so the place
  // is the one line in the column the faint ink reaches — the date range above it is in the accent,
  // at a specificity this rule cannot reach.
  it('sets the date column in the faintest ink, and the date range above it in the accent', () => {
    expect(rule('.dates p')).toMatch(/color:\s*var\(--color-text-faint\);/);
  });

  // DDR-017 opens the dates, which label the row, and leaves the place below them alone, which is
  // a proper name and reads as the words it is. The two sit in the same column, so the tracking is
  // the date line's own rather than the column's. DDR-018 sets the rest of the label treatment on
  // the same line, and on no other.
  it('opens the dates and leaves the place beside them alone, per DDR-017', () => {
    expect(rule('.dates .dateRange')).toMatch(/letter-spacing:\s*var\(--letter-spacing-loose\);/);
    expect(rule('.dates')).not.toMatch(/letter-spacing/);
  });

  // DDR-018's case and accent, and DDR-023's weight: the design draws the range bold, which
  // DDR-018 could not reach because the site shipped no file for 700.
  it('sets the dates in uppercase, bold and the accent, per DDR-018 and DDR-023', () => {
    const dateRange = rule('.dates .dateRange');

    expect(dateRange).toMatch(/text-transform:\s*uppercase;/);
    expect(dateRange).toMatch(/font-weight:\s*var\(--font-weight-bold\);/);
    expect(dateRange).toMatch(/color:\s*var\(--color-accent\);/);
  });

  // The place is the one other line in the column, and DDR-018 leaves it exactly as it was: the
  // secondary ink the metadata line gives it, at the weight and case it is written in.
  it('leaves the place below the dates in its own case, weight and ink', () => {
    expect(rule('.dates')).not.toMatch(/text-transform|font-weight|color/);
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
