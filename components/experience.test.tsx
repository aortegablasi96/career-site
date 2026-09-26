import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { dateLabels } from '@/content/dates';
import { experience } from '@/content/experience';
import { Experience } from './experience';

// Rendered with the real content, since what the roles say is what #29 asks for and how they are
// laid out is what #49 asks for.
const html = renderToStaticMarkup(
  <Experience
    roles={experience.roles}
    hint={experience.hint}
    dateLabels={dateLabels}
    labelledBy="experience-title"
  />,
);

/** The markup's text, as a reader meets it. */
const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

const { roles } = experience;
const role = (company: string) => roles.find((candidate) => candidate.company === company)!;

// Only what is a role's alone is here. The timeline itself is shared, per DDR-010, and
// components/timeline.test.tsx holds its stylesheet.
const styles = readFileSync(new URL('./experience.module.css', import.meta.url), 'utf8')
  .replace(/\r\n/g, '\n')
  .replace(/\/\*[\s\S]*?\*\//g, '');

/** The declarations of the rule whose selector list is exactly `selector`. */
function rule(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return styles.match(new RegExp(`(?:^|[{}])\\s*${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
}

describe('Experience', () => {
  it('renders each role as an entry of the timeline, in the order the content gives', () => {
    const entries = html.match(/<li class=/g) ?? [];
    const titles = [...html.matchAll(/<h3[^>]*><a [^>]*>([^<]+)<\/a><\/h3>/g)].map(([, title]) => title);

    expect(html).toMatch(/<\/p><ol /);
    expect(entries).toHaveLength(roles.length);
    expect(titles).toEqual(roles.map(({ title }) => title));
  });

  // DDR-057: each card opens with the company, then the job title, which is the entry's heading,
  // then the place, and the dates stand above the card.
  it('reads each role as its dates, company, title and place, in that order', () => {
    for (const { title } of roles) {
      expect(html).toMatch(new RegExp(`<h3[^>]*><a [^>]*>${title}</a></h3>`));
    }

    expect(text).toContain('Jun 2023 – Oct 2024 Ponera Group Product Manager Lugano, Switzerland');
    expect(text).toContain('Oct 2024 – Present ABB Global Product Manager Quartino, Switzerland');
    expect(text).not.toContain('Ponera Group ·');
  });

  // DDR-060: a card shows the short title, on screen and on paper alike. The full one is the view's.
  it('shows each role by its short title and none by its full one', () => {
    const full = roles.flatMap(({ fullTitle }) => (fullTitle ? [fullTitle] : []));

    expect(full.length).toBeGreaterThan(0);

    for (const title of full) {
      expect(html).not.toContain(title.replace(/&/g, '&amp;'));
    }
  });

  it('shows one role, and only one, as running to the present', () => {
    expect(text.match(/– Present/g)).toHaveLength(1);
  });

  it('marks every month up with its machine-readable value', () => {
    const months = [...html.matchAll(/<time datetime="([^"]+)"/gi)].map(([, month]) => month);

    expect(months).toEqual(roles.flatMap(({ start, end }) => (end ? [start, end] : [start])));
  });

  it('gives each role its points as a bulleted list, which paper shows', () => {
    const lists = html.match(/<ul[^>]*>.*?<\/ul>/g) ?? [];

    expect(lists).toHaveLength(roles.length);
    expect(lists.map((list) => list.match(/<li>/g)?.length)).toEqual(roles.map(({ points }) => points.length));
  });

  // DDR-059: each card leads to its role's view, and the job title is the link, so the card is one
  // tab stop named by the title.
  it('leads from each role’s card to its view, by the job title', () => {
    const links = [...html.matchAll(/<a [^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map(([, href, title]) => ({
      href,
      title,
    }));

    expect(links).toEqual(roles.map(({ slug, title }) => ({ href: `/experience/${slug}`, title })));
  });

  // A timeline whose cards are links needs no tab stop of its own: tabbing to a card scrolls the
  // row to it, per DDR-059.
  it('does not make the row a tab stop of its own, since its cards are', () => {
    expect(html).not.toContain('tabindex');
  });

  it('says above the timeline that a role’s card leads to its description, beside a hidden clock', () => {
    expect(html).toMatch(/^<div><p class="[^"]*"><svg [^>]*aria-hidden="true"[^>]*>.*<\/svg>Click any role to read the full description<\/p><ol /);
  });

  // The spine draws the path from one role to the next and says nothing the text does not, so a
  // screen reader never meets it, per DDR-010.
  it('hides the timeline’s ornament from assistive technology, and gives it no text', () => {
    const spines = [...html.matchAll(/<div [^>]*aria-hidden="true"[^>]*>(.*?)<\/div>/g)];

    expect(spines).toHaveLength(roles.length);
    for (const [, inner] of spines) {
      expect(inner.replace(/<[^>]+>/g, '')).toBe('');
    }
  });
});

// What is a role’s alone in the timeline, per DDR-010: the bullet points. The row itself is
// held by components/timeline.test.tsx.
describe('experience styles', () => {
  // DDR-057: the design leads from a role's card to a view of the role for its description, which
  // is still to come, so the screen shows no points and paper, which cannot lead anywhere, does.
  it('hides the points on screen and shows them on paper', () => {
    expect(rule('.points')).toMatch(/display:\s*none;/);
    expect(styles).toMatch(/@media print\s*\{\s*\.points\s*\{[^}]*display:\s*block;/);
  });

  // DDR-059: paper has nothing to click, so the hint is the screen's alone, and the timeline takes
  // back the place it had below the heading.
  it('hides the hint on paper, and the space below it', () => {
    expect(styles).toMatch(/@media print\s*\{[\s\S]*\.hint\s*\{\s*display:\s*none;\s*\}/);
    expect(rule('.hint + *')).toMatch(/margin-block-start:\s*var\(--timeline-hint-space\);/);
    expect(styles).toMatch(/@media print\s*\{[\s\S]*\.hint \+ \*\s*\{\s*margin-block-start:\s*0;\s*\}/);
  });

  it('sets bullet text at the small step, as DDR-011 records', () => {
    expect(rule('.points')).toMatch(/font-size:\s*var\(--font-size-small\);/);
    expect(rule('.points > li + li')).toMatch(/margin-block-start:\s*var\(--space-small\);/);
  });

  // DDR-019: one step of the scale rather than the two the base styles give every list, which is
  // half the width back in the narrowest column the page has.
  // DDR-038: the points are running text, and the design sets them looser than a short line.
  it('sets the points at the prose leading, per DDR-038', () => {
    expect(rule('.points')).toMatch(/line-height:\s*var\(--line-height-prose\);/);
  });

  it('indents the points by a single step, as DDR-019 records', () => {
    expect(rule('.points')).toMatch(/padding-inline-start:\s*var\(--space-medium\);/);
  });

  // The marker is recoloured rather than replaced, per DDR-019, so the list stays a list and the
  // marker stays a marker. A rule that set `list-style: none` or drew the dot with `content` would
  // be doing something else, and would have to answer for the semantics it takes away.
  it('draws the marker in the marker ink, and leaves it a marker', () => {
    expect(rule('.points > li::marker')).toMatch(/color:\s*var\(--color-marker\);/);
    expect(styles).not.toMatch(/list-style/);
    expect(styles).not.toMatch(/content:/);
  });
});

describe('experience content', () => {
  it('lists the five roles, oldest first, per DDR-057', () => {
    expect(roles.map(({ company, start, end }) => [company, start, end])).toEqual([
      ['Electrónica Digital de Protección', '2018-05', '2020-07'],
      ['ToBeIT', '2020-09', '2021-07'],
      ['Randstad', '2022-03', '2023-05'],
      ['Ponera Group', '2023-06', '2024-10'],
      ['ABB', '2024-10', undefined],
    ]);
  });

  // ADR-011: a role's address is its slug, which someone may have been sent, so each is its own and
  // is written as an address is.
  it('gives every role an address of its own', () => {
    const slugs = roles.map(({ slug }) => slug);

    expect(new Set(slugs).size).toBe(slugs.length);

    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z\d]+(?:-[a-z\d]+)*$/);
    }
  });

  it('writes every month as a real year and month', () => {
    for (const { start, end } of roles) {
      for (const month of end ? [start, end] : [start]) {
        expect(month).toMatch(/^\d{4}-(?:0[1-9]|1[0-2])$/);
      }
    }
  });

  it('ends no role before it starts, and starts each role after the one before it in the list', () => {
    for (const [index, { start, end }] of roles.entries()) {
      if (end) {
        expect(end >= start).toBe(true);
      }
      if (index > 0) {
        expect(start > roles[index - 1].start).toBe(true);
      }
    }
  });

  it('gives each role two to four points', () => {
    for (const { points } of roles) {
      expect(points.length).toBeGreaterThanOrEqual(2);
      expect(points.length).toBeLessThanOrEqual(4);
    }
  });

  it('leads the ABB and Ponera entries with product ownership', () => {
    expect(role('ABB').points[0]).toMatch(/^Manage a global portfolio .* more than 20 countries/);
    expect(role('Ponera Group').points[0]).toMatch(/four IoT-enabled SaaS products as Product Owner/);
  });

  it('keeps the two engineering roles shorter than the three most recent', () => {
    const length = (company: string) => role(company).points.join(' ').length;
    const shortest = Math.min(...['ABB', 'Ponera Group', 'Randstad'].map(length));

    for (const company of ['ToBeIT', 'Electrónica Digital de Protección']) {
      expect(length(company)).toBeLessThan(shortest);
    }
  });

  it('describes ABB’s assets as connected UPS units, as the owner answered on #26', () => {
    expect(role('ABB').points.join(' ')).toContain('more than 1000 connected UPS units');
  });

  it('presents Randstad as external consultancy for its clients, as the owner answered on #26', () => {
    expect(role('Randstad').points[0]).toMatch(/external consultant on consultancy projects for Randstad’s clients/);
  });

  it('writes points without pronouns, and without self-assessed traits the entries do not show', () => {
    for (const { points } of roles) {
      for (const point of points) {
        expect(point).not.toMatch(/\b(?:I|me|my|we|our)\b/i);
        expect(point).not.toMatch(/strong|proven|leadership|servant|passionate|results-driven/i);
      }
    }
  });

  it('adds no explanation of the gap before Randstad, which #26 decided needs none', () => {
    expect(text).not.toMatch(/gap|career break|sabbatical/i);
  });
});
