import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { dateLabels } from '@/content/dates';
import { DateRange } from './date-range';
import { Timeline } from './timeline';

const roles = renderToStaticMarkup(
  <Timeline
    kind="role"
    labelledBy="experience-title"
    entries={[
      {
        key: 'Ponera',
        dates: 'Jun 2023 – Oct 2024',
        subtitle: 'Ponera Group',
        title: 'Digital Solutions Manager',
        place: 'Lugano, Switzerland',
        children: (
          <ul>
            <li>A point</li>
          </ul>
        ),
      },
      {
        key: 'ABB',
        dates: <DateRange start="2024-10" labels={dateLabels} />,
        subtitle: 'ABB',
        title: 'Global Product Specialist, Digital Solutions',
        place: 'Quartino, Switzerland',
      },
    ]}
  />,
);

const credentials = renderToStaticMarkup(
  <Timeline
    kind="credential"
    labelledBy="education-title"
    entries={[
      {
        key: 'PMP',
        dates: 'Jun 2024',
        subtitle: 'Project Management Institute',
        title: 'Project Management Professional (PMP)',
      },
    ]}
  />,
);

/** The markup's text, as a reader meets it. */
const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/ /g, ' ');

/** The stylesheet without its comments, so a rule is not matched against its explanation. */
const styles = readFileSync(new URL('./timeline.module.css', import.meta.url), 'utf8')
  .replace(/\r\n/g, '\n')
  .replace(/\/\*[\s\S]*?\*\//g, '');

/** The stylesheet before its media query, which is the screen's. */
const screen = styles.split('@media')[0]!;

/** The print block. */
const paper = styles.match(/@media print\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';

/** The declarations of the rule whose selector list is exactly `selector`, inside `within`. */
function rule(selector: string, within = screen): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return within.match(new RegExp(`(?:^|[{}])\\s*${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
}

describe('Timeline', () => {
  // DDR-057: the entries are in time order, so they are an ordered list, and each entry is a list
  // item, which the print styles keep whole on one sheet.
  it('is an ordered list with one item per entry', () => {
    expect(roles).toMatch(/^<ol[ >]/);
    expect(roles).toMatch(/<\/ol>$/);
    expect(roles.match(/<li class=/g)).toHaveLength(2);
    expect(credentials.match(/<li class=/g)).toHaveLength(1);
  });

  // The row can scroll sideways, and holds no link, so it has to take focus itself for a keyboard
  // to scroll it, and it takes its name from its section's heading, per DDR-057.
  it('takes focus, and is named by its section’s heading', () => {
    expect(roles).toMatch(/^<ol [^>]*aria-labelledby="experience-title"[^>]*tabindex="0"/);
    expect(credentials).toMatch(/^<ol [^>]*aria-labelledby="education-title"/);
  });

  it('holds no link, since the role view the design leads to is still to come', () => {
    expect(roles).not.toMatch(/<a[ >]/);
    expect(roles).not.toMatch(/Click any role/i);
  });

  // The markup order is the visual order, per DDR-014: the dates stand above the card, and on the
  // card the company or institution is above the title, and a role's place below it.
  it('reads each entry as its dates, subtitle, title and place, in that order', () => {
    expect(text(roles)).toContain('Jun 2023 – Oct 2024 Ponera Group Digital Solutions Manager Lugano, Switzerland');
    expect(text(credentials)).toContain('Jun 2024 Project Management Institute Project Management Professional (PMP)');
  });

  it('titles each entry with an h3, the job title or the credential’s name', () => {
    expect(roles).toMatch(/<h3 class="[^"]*">Digital Solutions Manager<\/h3>/);
    expect(credentials).toMatch(/<h3 class="[^"]*">Project Management Professional \(PMP\)<\/h3>/);
  });

  it('gives a credential no place, and closes its card at its title', () => {
    expect(credentials).toMatch(/<\/h3><\/div><\/li><\/ol>$/);
  });

  // DDR-018 draws the case in the stylesheet, so the string a screen reader announces, and the
  // value the time element carries, are still the ones content/ writes.
  it('draws the case rather than rewriting the dates, so the entry keeps what it announces', () => {
    expect(roles).toMatch(/<time datetime="2024-10">Oct.2024<\/time>/i);
    expect(text(roles)).toContain('Oct 2024 – Present');
  });

  // The spine draws the path from one entry to the next and says nothing the text does not, so a
  // screen reader never meets it, per DDR-010.
  it('hides the spine from assistive technology, and gives it no text', () => {
    const spines = [...roles.matchAll(/<div [^>]*aria-hidden="true"[^>]*>(.*?)<\/div>/g)];

    expect(spines).toHaveLength(2);
    for (const [, inner] of spines) {
      expect(inner).toMatch(/^<span class="[^"]*lead[^"]*"><\/span><span class="[^"]*dot[^"]*"><\/span><span class="[^"]*line[^"]*"><\/span>$/);
    }
  });

  // The design sets a company in the accent and an institution in grey, so the list carries its
  // kind, and paper spaces roles and credentials apart by their own steps, per DDR-039.
  it('marks the list with its kind', () => {
    expect(roles).toMatch(/^<ol class="_timeline_\w+ _role_\w+"/);
    expect(credentials).toMatch(/^<ol class="_timeline_\w+ _credential_\w+"/);
  });
});

// DDR-057 lays the timeline out, from `career-site-main` nodes 170:65 and 170:439. These read the
// stylesheet as written, so a later edit cannot quietly drop a rule an acceptance criterion rests on.
describe('timeline styles on screen', () => {
  it('is one row at every width, which scrolls inside itself rather than the page, per DDR-057', () => {
    expect(rule('.timeline')).toMatch(/display:\s*flex;/);
    expect(rule('.timeline')).toMatch(/overflow-x:\s*auto;/);
    expect(styles).not.toMatch(/@media \(min-width/);
  });

  it('shares the row equally, and holds each entry to the timeline’s width at the least', () => {
    const entry = rule('.entry');

    expect(entry).toMatch(/flex:\s*1 0 0;/);
    expect(entry).toMatch(/min-inline-size:\s*var\(--timeline-entry-width\);/);
    expect(entry).toMatch(/text-align:\s*center;/);
  });

  // DDR-018's case, accent and weight, at the design's 10px and 1px of tracking.
  it('sets the dates as a label at the foot of their band', () => {
    const dates = rule('.dates');

    expect(dates).toMatch(/align-items:\s*flex-end;/);
    expect(dates).toMatch(/min-block-size:\s*var\(--timeline-date-height\);/);
    expect(dates).toMatch(/color:\s*var\(--color-accent\);/);
    expect(dates).toMatch(/font-size:\s*var\(--font-size-xxxx-small\);/);
    expect(dates).toMatch(/font-weight:\s*var\(--font-weight-bold\);/);
    expect(dates).toMatch(/letter-spacing:\s*var\(--letter-spacing-x-loose\);/);
    expect(dates).toMatch(/text-transform:\s*uppercase;/);
  });

  // DDR-036 as DDR-057 lays it across: one line from the first dot to the last.
  it('runs one line across the row, from the first dot to the last', () => {
    expect(rule('.lead,\n.line')).toMatch(/block-size:\s*var\(--timeline-line-width\);/);
    expect(rule('.lead,\n.line')).toMatch(/background-color:\s*var\(--color-border-accent\);/);
    expect(rule('.entry:first-child .lead,\n.entry:last-child .line')).toMatch(/background-color:\s*transparent;/);
  });

  it('marks each entry with the ringed dot and its accent core, per DDR-036', () => {
    const dot = rule('.dot');

    expect(dot).toMatch(/inline-size:\s*var\(--timeline-dot-size\);/);
    expect(dot).toMatch(/border:\s*var\(--timeline-dot-ring\) solid var\(--color-border-accent\);/);
    // No fill of its own since DDR-046: the surface inside the ring is the band the timeline is on.
    expect(dot).not.toMatch(/background/);
    expect(rule('.dot::before')).toMatch(/background-color:\s*var\(--color-accent\);/);
  });

  it('draws each card white, with a hairline edge and the large radius, below its dot', () => {
    const card = rule('.card');

    expect(card).toMatch(/margin-block-start:\s*var\(--timeline-card-space\);/);
    expect(card).toMatch(/margin-inline:\s*var\(--timeline-entry-inset\);/);
    expect(card).toMatch(/padding:\s*var\(--space-medium\);/);
    expect(card).toMatch(/border:\s*1px solid var\(--color-border\);/);
    expect(card).toMatch(/border-radius:\s*var\(--radius-large\);/);
    expect(card).toMatch(/background-color:\s*var\(--color-surface-card\);/);
    // The cards of a row are one height, with their text centred in it.
    expect(card).toMatch(/flex:\s*1;/);
    expect(card).toMatch(/justify-content:\s*center;/);
  });

  it('sets a company in the accent and an institution in the muted ink, both bold', () => {
    expect(rule('.subtitle')).toMatch(/font-weight:\s*var\(--font-weight-bold\);/);
    expect(rule('.role .subtitle')).toMatch(/color:\s*var\(--color-accent\);/);
    expect(rule('.credential .subtitle')).toMatch(/color:\s*var\(--color-text-muted\);/);
  });

  it('sets the title at 11px and the place at 10px in the faint ink, as the design does', () => {
    expect(rule('.title')).toMatch(/font-size:\s*var\(--font-size-xxx-small\);/);
    expect(rule('.place')).toMatch(/font-size:\s*var\(--font-size-xxxx-small\);/);
    expect(rule('.place')).toMatch(/color:\s*var\(--color-text-faint\);/);
  });
});

// On paper the timeline is DDR-010's vertical one, per DDR-057, because a sheet cannot scroll.
describe('timeline styles on paper', () => {
  it('stacks the entries, each as the date column, the spine and the card’s text', () => {
    expect(rule('.timeline', paper)).toMatch(/display:\s*block;/);
    expect(rule('.entry', paper)).toMatch(
      /grid-template-columns:\s*var\(--timeline-date-width\) var\(--timeline-spine-width\) 1fr;/,
    );
    expect(rule('.entry', paper)).toMatch(/text-align:\s*start;/);
    expect(rule('.dates', paper)).toMatch(/text-align:\s*end;/);
    expect(rule('.spine', paper)).toMatch(/flex-direction:\s*column;/);
  });

  // DDR-024: at 10px and 0.1em the label splits into letters in a Firefox PDF.
  it('prints the dates at the size and tracking they had before DDR-057', () => {
    expect(rule('.dates', paper)).toMatch(/font-size:\s*var\(--font-size-xxx-small\);/);
    expect(rule('.dates', paper)).toMatch(/letter-spacing:\s*var\(--letter-spacing-loose\);/);
  });

  it('levels the dot with the card’s first line, and runs the line down to the next entry', () => {
    expect(rule('.lead', paper)).toMatch(/block-size:\s*var\(--timeline-dot-offset\);/);
    expect(rule('.line', paper)).toMatch(/inline-size:\s*var\(--timeline-line-width\);/);
  });

  it('spaces roles and credentials apart by their own steps, and nothing after the last', () => {
    expect(rule('.role .card', paper)).toMatch(/padding-block-end:\s*var\(--space-role\);/);
    expect(rule('.credential .card', paper)).toMatch(/padding-block-end:\s*var\(--space-credential\);/);
    expect(rule('.entry:last-child .card', paper)).toMatch(/padding-block-end:\s*0;/);
  });
});
