import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { dateLabels } from '@/content/dates';
import { experience } from '@/content/experience';
import { Experience } from './experience';

// Rendered with the real content, since what the roles say is what #29 asks for.
const html = renderToStaticMarkup(<Experience roles={experience.roles} dateLabels={dateLabels} />);

/** The markup's text, as a reader meets it. */
const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

const { roles } = experience;
const role = (company: string) => roles.find((candidate) => candidate.company === company)!;

describe('Experience', () => {
  it('renders each role as an entry, in the order the content gives', () => {
    const titles = [...html.matchAll(/<article[^>]*><h3>([^<]+)<\/h3>/g)].map(([, title]) => title);

    expect(titles).toEqual(roles.map(({ title }) => title));
  });

  it('gives each role’s company, place, and dates in its metadata line, per DDR-006', () => {
    expect(text).toContain('Ponera Group · Lugano, Switzerland · Jun 2023 – Oct 2024');
  });

  it('shows each role’s points as a bulleted list', () => {
    const lists = html.match(/<ul[^>]*>.*?<\/ul>/g) ?? [];

    expect(lists).toHaveLength(roles.length);
    expect(lists.map((list) => list.match(/<li>/g)?.length)).toEqual(roles.map(({ points }) => points.length));
  });

  it('shows one role, and only one, as running to the present', () => {
    expect(text.match(/– Present/g)).toHaveLength(1);
    expect(text).toContain('ABB · Quartino, Switzerland · Oct 2024 – Present');
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
