import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { dateLabels } from '@/content/dates';
import { experience } from '@/content/experience';
import { Experience } from './experience';

// Rendered with the real content, since what the roles say is what #29 asks for and how they are
// laid out is what #49 asks for.
const html = renderToStaticMarkup(<Experience roles={experience.roles} dateLabels={dateLabels} />);

/** The markup's text, as a reader meets it. */
const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

const { roles } = experience;
const role = (company: string) => roles.find((candidate) => candidate.company === company)!;

// Only what is a role's alone is here. The row itself is the shared timeline, per DDR-010, and
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
  it('renders each role as a row of the timeline, in the order the content gives', () => {
    const rows = html.match(/<article[^>]*>/g) ?? [];
    const titles = [...html.matchAll(/<h3>([^<]+)<\/h3>/g)].map(([, title]) => title);

    expect(rows).toHaveLength(roles.length);
    expect(titles).toEqual(roles.map(({ title }) => title));
  });

  // DDR-010 makes the job title the heading and the most prominent line of the row, and moves the
  // company out of DDR-006's middle-dot line onto one of its own.
  it('gives each role its title as an h3, and its company on a line of its own below', () => {
    for (const { title } of roles) {
      expect(html).toContain(`<h3>${title}</h3>`);
    }

    expect(text).toContain('Digital Solutions Manager Ponera Group');
    expect(text).not.toContain('Ponera Group ·');
  });

  // The markup order is the visual order at both widths, per DDR-014: the dates come before the
  // title, which is where a narrow screen shows them, and the wide breakpoint moves them into a
  // column beside it without reordering anything.
  it('puts each role’s dates and place before its title, in the reading order', () => {
    expect(text).toContain('Jun 2023 – Oct 2024 Lugano, Switzerland Digital Solutions Manager');
    expect(text).toContain('Oct 2024 – Present Quartino, Switzerland Global Product Specialist');
  });

  it('shows one role, and only one, as running to the present', () => {
    expect(text.match(/– Present/g)).toHaveLength(1);
  });

  it('marks every month up with its machine-readable value', () => {
    const months = [...html.matchAll(/<time datetime="([^"]+)"/gi)].map(([, month]) => month);

    expect(months).toEqual(roles.flatMap(({ start, end }) => (end ? [start, end] : [start])));
  });

  it('shows each role’s points as a bulleted list', () => {
    const lists = html.match(/<ul[^>]*>.*?<\/ul>/g) ?? [];

    expect(lists).toHaveLength(roles.length);
    expect(lists.map((list) => list.match(/<li>/g)?.length)).toEqual(roles.map(({ points }) => points.length));
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
  it('lists the five roles, newest first', () => {
    expect(roles.map(({ company, start, end }) => [company, start, end])).toEqual([
      ['ABB', '2024-10', undefined],
      ['Ponera Group', '2023-06', '2024-10'],
      ['Randstad', '2022-03', '2023-05'],
      ['ToBeIT', '2020-09', '2021-07'],
      ['Electrónica Digital de Protección', '2018-05', '2020-07'],
    ]);
  });

  it('writes every month as a real year and month', () => {
    for (const { start, end } of roles) {
      for (const month of end ? [start, end] : [start]) {
        expect(month).toMatch(/^\d{4}-(?:0[1-9]|1[0-2])$/);
      }
    }
  });

  it('ends no role before it starts, and starts each role after the one before it', () => {
    for (const [index, { start, end }] of roles.entries()) {
      if (end) {
        expect(end >= start).toBe(true);
      }
      if (index > 0) {
        expect(start < roles[index - 1].start).toBe(true);
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
