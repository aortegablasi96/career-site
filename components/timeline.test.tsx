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

// DDR-059: the same entries, each leading to a view of its own, as a role's does.
const linked = renderToStaticMarkup(
  <Timeline
    kind="role"
    labelledBy="experience-title"
    entries={[
      {
        key: 'ABB',
        dates: 'Oct 2024 – Present',
        subtitle: 'ABB',
        logo: '/experiences/abb/logo.webp',
        title: 'Global Product Specialist, Digital Solutions',
        place: 'Quartino, Switzerland',
        href: '/experience/abb',
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

  // DDR-066: a role's card opens with its company's logo, which repeats the name written beneath
  // it, so it adds nothing to what a reader hears, and it waits until the row is near.
  it('opens a card with its company’s logo, above the company, with no alternative text', () => {
    expect(linked).toMatch(
      /<div class="[^"]*"><img class="[^"]*" src="\/experiences\/abb\/logo\.webp" alt="" loading="lazy"\/><p class="[^"]*">ABB<\/p>/,
    );
    expect(text(linked)).toContain('Oct 2024 – Present ABB Global Product Specialist');
    expect(linked).not.toContain('rel="preload"');
  });

  it('draws no logo on a card that has none', () => {
    expect(roles).not.toContain('<img');
    expect(credentials).not.toContain('<img');
  });

  it('holds no link for an entry with no view of its own', () => {
    expect(roles).not.toMatch(/<a[ >]/);
    expect(credentials).not.toMatch(/<a[ >]/);
  });

  // DDR-059: an entry with a view is one link, whose text is its title, and the row takes no tab
  // stop of its own, since tabbing to a card scrolls the row to it.
  it('makes an entry’s title the link to its view, and the row no tab stop of its own', () => {
    expect(linked).toMatch(
      /<h3 [^>]*><a class="[^"]*" href="\/experience\/abb">Global Product Specialist, Digital Solutions<\/a><\/h3>/,
    );
    expect(linked.match(/<a /g)).toHaveLength(1);
    expect(linked).not.toContain('tabindex');
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

  // Paper spaces roles and credentials apart by their own steps, per DDR-039, so the list carries
  // its kind.
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

  // DDR-070 amends DDR-057's white card with the owner's surface: the grain over the gradient, a
  // violet edge and a highlight inside the top edge, all tokens that paper drops.
  it('draws each card on the design’s grained gradient, with a violet edge, a top highlight and the large radius, below its dot', () => {
    const card = rule('.card');

    expect(card).toMatch(/margin-block-start:\s*var\(--timeline-card-space\);/);
    expect(card).toMatch(/margin-inline:\s*var\(--timeline-entry-inset\);/);
    expect(card).toMatch(/padding:\s*var\(--space-medium\);/);
    expect(card).toMatch(/border:\s*1px solid var\(--color-border-timeline-card\);/);
    expect(card).toMatch(/border-radius:\s*var\(--radius-large\);/);
    expect(card).toMatch(/background:\s*var\(--surface-timeline-card\);/);
    expect(card).toMatch(/box-shadow:\s*var\(--shadow-card-highlight\);/);
    // The cards of a row are one height, with their text centred in it.
    expect(card).toMatch(/flex:\s*1;/);
    expect(card).toMatch(/justify-content:\s*center;/);
  });

  // DDR-068: the owner asked on #197 for an institution to be coloured as a company is.
  it('sets a company and an institution alike, in the accent and bold', () => {
    expect(rule('.subtitle')).toMatch(/font-weight:\s*var\(--font-weight-bold\);/);
    expect(rule('.subtitle')).toMatch(/color:\s*var\(--color-accent\);/);
    expect(styles).not.toMatch(/\.(role|credential) \.subtitle/);
  });

  it('sets the title at 11px and the place at 10px in the faint ink, as the design does', () => {
    expect(rule('.title')).toMatch(/font-size:\s*var\(--font-size-xxx-small\);/);
    expect(rule('.place')).toMatch(/font-size:\s*var\(--font-size-xxxx-small\);/);
    expect(rule('.place')).toMatch(/color:\s*var\(--color-text-faint\);/);
  });
});

// DDR-059: a card that leads to a view is one link, stretched over the card, as a project card is.
describe('timeline card links', () => {
  it('stretches the title’s link over its card', () => {
    expect(rule('.card:has(.link)', screen)).toMatch(/position:\s*relative;/);
    expect(rule('.link::after', screen)).toMatch(/position:\s*absolute;/);
    expect(rule('.link::after', screen)).toMatch(/inset:\s*0;/);
  });

  it('answers the pointer anywhere in the column, and focus, with the accent', () => {
    expect(rule('.entry:has(.link):hover .link,\n.link:focus-visible', screen)).toMatch(
      /color:\s*var\(--color-accent\);/,
    );
  });

  // DDR-064: the link's box reaches from the card out to the column's edges, so a pointer on the
  // dates or the dot follows it too. It is measured from the card's padding box: the card's edge,
  // the space above the card, the dot with its ring and the dates' band above, and the card's edge
  // and inset beside it.
  it('stretches the link’s box over the whole column, per DDR-064', () => {
    const box = rule('.link::before', screen);

    expect(box).toMatch(/position:\s*absolute;/);
    expect(box.replace(/\s+/g, ' ')).toContain(
      'inset-block: calc( -1 * ( var(--timeline-date-height) + var(--space-small) + ' +
        'var(--timeline-dot-size) + 2 * var(--timeline-dot-ring) + var(--timeline-card-space) + 1px ) ) -1px;',
    );
    expect(box).toMatch(/inset-inline:\s*calc\(-1 \* var\(--timeline-entry-inset\) - 1px\);/);
    // The dates' band is all the height the dates take, so the box reaches the column's top.
    expect(rule('.dates', screen)).toMatch(/min-block-size:\s*var\(--timeline-date-height\);/);
    expect(rule('.dates', screen)).toMatch(/padding-block-end:\s*var\(--space-small\);/);
  });

  // DDR-064: the dates and the dot answer with the card, each taking the hover step of its own
  // colour, and only in a column that leads somewhere.
  it('darkens the dates and the dot with the card, per DDR-064', () => {
    expect(rule('.entry:has(.link):hover .dates,\n.entry:has(.link:focus-visible) .dates', screen)).toMatch(
      /color:\s*var\(--color-accent-hover\);/,
    );
    expect(rule('.entry:has(.link):hover .dot,\n.entry:has(.link:focus-visible) .dot', screen)).toMatch(
      /border-color:\s*var\(--color-border-accent-hover\);/,
    );
    expect(
      rule('.entry:has(.link):hover .dot::before,\n.entry:has(.link:focus-visible) .dot::before', screen),
    ).toMatch(/background-color:\s*var\(--color-accent-hover\);/);
  });

  it('leaves the line between the dots as it is', () => {
    expect(screen).not.toMatch(/:hover[^{]*\.(?:lead|line)\b/);
  });

  // DDR-061: under the pointer or focus a role's card takes a light shadow all round, beneath its
  // resting one since DDR-065, and only a card that leads somewhere does, since the rule reads the
  // link. DDR-063 raises such a card at
  // rest as a project card is, and leaves a credential's card flat.
  it('lights a card that leads to a view under the pointer and on focus, per DDR-061', () => {
    const lit = rule('.entry:has(.link):hover .card,\n.entry:has(.link:focus-visible) .card', screen);

    // The highlight stays on the lit card, per DDR-070: it is the card's surface, not a state.
    expect(lit).toMatch(
      /box-shadow:\s*var\(--shadow-card-highlight\), var\(--shadow-raised\), var\(--shadow-card-hover\);/,
    );
    expect(lit).toMatch(/border-color:\s*var\(--color-border-accent-hover\);/);
    expect(rule('.card', screen)).toMatch(/box-shadow:\s*var\(--shadow-card-highlight\);/);
    expect(rule('.card:has(.link)', screen)).toMatch(
      /box-shadow:\s*var\(--shadow-card-highlight\), var\(--shadow-raised\);/,
    );
  });

  // DDR-063: a role's card rises as a project card does, over the same 150ms, with its edge and
  // shadow as one change, and only where motion is welcome; the edge and shadow are not motion.
  describe('lift, per DDR-063', () => {
    const motion =
      styles.match(/@media \(prefers-reduced-motion: no-preference\) \{([\s\S]*?)\n\}/)?.[1] ?? '';

    it('lifts a card that leads to a view by the lift a project card takes', () => {
      expect(rule('.entry:has(.link):hover .card,\n  .entry:has(.link:focus-visible) .card', motion)).toMatch(
        /translate:\s*0 calc\(-1 \* var\(--card-lift\)\);/,
      );
    });

    it('brings the edge, the shadow and the lift in together over 150ms', () => {
      expect(rule('.card:has(.link)', motion)).toMatch(
        /transition-property:\s*translate, border-color, box-shadow;/,
      );
      expect(rule('.card:has(.link)', motion)).toMatch(/transition-duration:\s*var\(--hover-transition\);/);
    });

    it('changes the dates and the dot over the same 150ms, per DDR-064', () => {
      expect(rule('.entry:has(.link) .dates', motion)).toMatch(/transition-property:\s*color;/);
      expect(rule('.entry:has(.link) .dates', motion)).toMatch(/transition-duration:\s*var\(--hover-transition\);/);
      const dot = rule('.entry:has(.link) .dot,\n  .entry:has(.link) .dot::before', motion);
      expect(dot).toMatch(/transition-property:\s*border-color, background-color;/);
      expect(dot).toMatch(/transition-duration:\s*var\(--hover-transition\);/);
    });

    it('writes the movement and its transition only where motion is welcome', () => {
      expect(motion).not.toBe('');
      expect(styles.replace(motion, '')).not.toMatch(/translate:|transition/);
    });

    it('holds the link’s box under a pointer at the card’s resting edge, and not on paper', () => {
      expect(rule('.link::before', motion)).toMatch(
        /inset-block-end:\s*calc\(-1 \* var\(--card-lift\) - 1px\);/,
      );
      expect(rule('.link::before', paper)).toMatch(/content:\s*none;/);
    });
  });

  // The row scrolls, so it clips the shadow's foot unless it leaves room for it, and it takes that
  // room back so that nothing on the page moves. Paper leaves none.
  it('leaves the shadow room below the cards and takes it back, per DDR-061', () => {
    expect(rule('.timeline', screen)).toMatch(/padding-block-end:\s*var\(--timeline-shadow-room\);/);
    expect(rule('.timeline', screen)).toMatch(/margin-block-end:\s*var\(--timeline-shadow-room-back\);/);
    expect(rule('.timeline', paper)).toMatch(/padding-block-end:\s*0;/);
    expect(rule('.timeline', paper)).toMatch(/margin-block-end:\s*0;/);
  });

  // DDR-063: outside the card's edge, as a project card's is; the row's room for the shadow and
  // the space beside each card keep it clear of the row's clipping edge.
  it('outlines the whole card on focus, outside its edge, per DDR-063', () => {
    expect(rule('.link:focus-visible::after', screen)).toMatch(
      /outline-offset:\s*var\(--focus-outline-offset\);/,
    );
  });

  // DDR-066: the logo stands centred above the company, straight on the card, scaled whole.
  it('sets the logo straight on the card, centred, with no tile of its own', () => {
    const logo = rule('.logo');

    expect(logo).toMatch(/align-self:\s*center;/);
    expect(logo).toMatch(/block-size:\s*var\(--timeline-logo-height\);/);
    expect(logo).toMatch(/max-inline-size:\s*100%;/);
    expect(logo).toMatch(/object-fit:\s*contain;/);
    expect(logo).toMatch(/margin-block-end:\s*var\(--space-small\);/);
    expect(logo).not.toMatch(/border|background|box-shadow|padding/);
    expect(rule('.logoTall')).toMatch(/block-size:\s*var\(--timeline-logo-height-tall\);/);
    expect(rule('.logoRaised')).toMatch(/margin-block-start:\s*var\(--timeline-logo-rise\);/);
  });

  it('prints no address after a card’s link, since paper cannot follow it', () => {
    expect(rule('.link::after', paper)).toMatch(/content:\s*none;/);
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

  // DDR-066: the logo is the screen's alone, so the printed CV is unchanged.
  it('prints no logo', () => {
    expect(rule('.logo', paper)).toMatch(/display:\s*none;/);
  });

  // Measured on #200: a positioned card is painted after the flow, so a PDF wrote its text at the
  // foot of the sheet, away from its dates. Paper stretches no link over it, so it is not positioned.
  it('does not position a linked card on paper, so a PDF reads it beside its dates', () => {
    expect(rule('.card:has(.link)')).toMatch(/position:\s*relative;/);
    expect(rule('.card:has(.link)', paper)).toMatch(/position:\s*static;/);
  });

  it('spaces roles and credentials apart by their own steps, and nothing after the last', () => {
    expect(rule('.role .card', paper)).toMatch(/padding-block-end:\s*var\(--space-role\);/);
    expect(rule('.credential .card', paper)).toMatch(/padding-block-end:\s*var\(--space-credential\);/);
    expect(rule('.entry:last-child .card', paper)).toMatch(/padding-block-end:\s*0;/);
  });
});
