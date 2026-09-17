import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { credentials } from '@/content/credentials';
import { dateLabels } from '@/content/dates';
import type { Certification, Credential, Degree } from '@/content/types';
import { Credentials } from './credentials';

// Rendered with the real content, since the exact names and dates are what #32 asks for.
const html = renderToStaticMarkup(<Credentials credentials={credentials.credentials} dateLabels={dateLabels} />);

/** The markup's text, as a reader meets it. */
const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

/** Each credential's row, in the order the page shows them. */
const rows = html.match(/<article[^>]*>.*?<\/article>/g) ?? [];

// Only what is a credential's alone is here. The row itself is the shared timeline, per DDR-010,
// and components/timeline.test.tsx holds its stylesheet.
const styles = readFileSync(new URL('./credentials.module.css', import.meta.url), 'utf8')
  .replace(/\r\n/g, '\n')
  .replace(/\/\*[\s\S]*?\*\//g, '');

/** A content string as a literal inside a regular expression. */
const literal = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isCertification = (credential: Credential): credential is Certification => 'granted' in credential;
const isDegree = (credential: Credential): credential is Degree => 'thesis' in credential;

const certifications = credentials.credentials.filter(isCertification);
const degrees = credentials.credentials.filter(isDegree);
const degree = (name: string) => degrees.find((candidate) => candidate.name.startsWith(name))!;

describe('Credentials', () => {
  it('renders each credential as a row of the timeline, in the order the content gives', () => {
    const titles = rows.map((row) => row.match(/<h3>([^<]+)<\/h3>/)?.[1]);

    expect(rows).toHaveLength(credentials.credentials.length);
    expect(titles).toEqual(credentials.credentials.map(({ name }) => name));
  });

  // DDR-010 moves the institution out of DDR-006's middle-dot line onto a line of its own, and the
  // dates into the date column, which comes before the title in the reading order, per DDR-014.
  it('gives each certification the month it was granted, then its name and its issuer', () => {
    expect(text).toContain('May 2026 PMI Certified Professional in Managing AI (PMI-CPMAI) Project Management Institute');
    expect(text).toContain('Jun 2024 Project Management Professional (PMP) Project Management Institute');
    expect(text).not.toContain('Project Management Institute ·');
  });

  it('gives each degree the months it ran, then its name and its institution', () => {
    expect(text).toContain('Sep 2020 – Feb 2022 Master’s degree in IoT Universitat Politècnica de Catalunya');
    expect(text).toContain('Sep 2014 – Feb 2019 Bachelor’s degree in IT Universitat Politècnica de Catalunya');
    expect(text).not.toContain('Universitat Politècnica de Catalunya ·');
  });

  it('marks up every date with its machine-readable value', () => {
    for (const credential of credentials.credentials) {
      const months = isCertification(credential) ? [credential.granted] : [credential.start, credential.end];

      for (const month of months) {
        expect(html).toMatch(new RegExp(`<time datetime="${month}">`, 'i'));
      }
    }
  });

  it('follows a degree’s institution with its thesis, as a paragraph', () => {
    for (const [index, credential] of credentials.credentials.entries()) {
      if (isDegree(credential)) {
        expect(rows[index]).toMatch(
          new RegExp(`</p><p[^>]*>${literal(credential.thesis)}</p></div></article>$`),
        );
      }
    }
  });

  // DDR-022 sets a thesis sentence two steps below the credential's name and one below the
  // institution above it, which makes it the quietest line in the row. It is the one thing a degree
  // has of its own, as a role's points are the one thing a role has, so it carries a class of its
  // own and this component's stylesheet sets it: the institution is a paragraph in the same column,
  // and a certification has one of those and no thesis, so position cannot tell the two apart.
  it('sets a degree’s thesis at the step DDR-022 gives it, from a class of its own', () => {
    for (const { thesis } of degrees) {
      expect(html).toMatch(new RegExp(`<p class="[^"]+">${literal(thesis)}</p>`));
    }

    expect(styles).toMatch(/\.thesis\s*\{[^}]*font-size:\s*var\(--font-size-x-small\);/);
  });

  it('ends a certification at its institution, with one date and no body', () => {
    for (const [index, credential] of credentials.credentials.entries()) {
      if (isCertification(credential)) {
        expect(rows[index]).toMatch(/<\/h3><p[^>]*>[^<]*<\/p><\/div><\/article>$/);
        // The dates, and the institution. A role has a third for its place; a credential has none.
        expect(rows[index]!.match(/<p/g)).toHaveLength(2);
        expect(rows[index]!.match(/<time/g)).toHaveLength(1);
      }
    }
  });

  // Every credential is a row of the same timeline experience uses, per DDR-010, so the ornament is
  // hidden from assistive technology here too.
  it('hides the timeline’s ornament from assistive technology, and gives it no text', () => {
    const spines = [...html.matchAll(/<div [^>]*aria-hidden="true"[^>]*>(.*?)<\/div>/g)];

    expect(spines).toHaveLength(credentials.credentials.length);
    for (const [, inner] of spines) {
      expect(inner.replace(/<[^>]+>/g, '')).toBe('');
    }
  });
});

describe('credentials content', () => {
  it('titles the section as the Content Brief names it', () => {
    expect(credentials.title).toBe('Education and certifications');
  });

  it('names and dates each certification as its certificate does, issued by the Project Management Institute', () => {
    expect(certifications.map(({ name, institution, granted }) => [name, institution, granted])).toEqual([
      ['PMI Certified Professional in Managing AI (PMI-CPMAI)', 'Project Management Institute', '2026-05'],
      ['Project Management Professional (PMP)', 'Project Management Institute', '2024-06'],
    ]);
  });

  it('dates both degrees from Universitat Politècnica de Catalunya as the owner gave them on #26', () => {
    expect(degrees.map(({ name, institution, start, end }) => [name, institution, start, end])).toEqual([
      ['Master’s degree in IoT', 'Universitat Politècnica de Catalunya', '2020-09', '2022-02'],
      ['Bachelor’s degree in IT', 'Universitat Politècnica de Catalunya', '2014-09', '2019-02'],
    ]);
  });

  it('lists the credentials newest first, per DDR-006, so the certifications lead', () => {
    const latest = credentials.credentials.map((credential) =>
      isCertification(credential) ? credential.granted : credential.end,
    );

    expect(latest).toEqual([...latest].sort().reverse());
    expect(credentials.credentials.slice(0, 2).every(isCertification)).toBe(true);
  });

  it('writes every month as a real year and month, and ends no degree before it starts', () => {
    for (const credential of credentials.credentials) {
      const months = isCertification(credential) ? [credential.granted] : [credential.start, credential.end];

      for (const month of months) {
        expect(month).toMatch(/^\d{4}-(?:0[1-9]|1[0-2])$/);
      }
    }
    for (const { start, end } of degrees) {
      expect(end > start).toBe(true);
    }
  });

  it('names the master’s thesis on Thread, for IoT application frameworks such as Matter', () => {
    expect(degree('Master').thesis).toMatch(/\bThread network protocol\b/);
    expect(degree('Master').thesis).toMatch(/IoT application.*such as Matter/);
  });

  it('names the bachelor’s thesis on sensor evaluation and data analytics, done on an Erasmus exchange at KU Leuven', () => {
    expect(degree('Bachelor').thesis).toMatch(/sensor evaluation and data analytics/);
    expect(degree('Bachelor').thesis).toMatch(/Erasmus exchange at KU Leuven/);
  });

  it('shows no certification number, expiry date, or course, which #32 leaves out', () => {
    expect(text).not.toMatch(/\d{5,}|expir|valid until|course/i);
  });

  it('writes theses without pronouns, and without self-assessed traits', () => {
    for (const { thesis } of degrees) {
      expect(thesis).not.toMatch(/\b(?:I|me|my|we|our)\b/i);
      expect(thesis).not.toMatch(/strong|proven|leadership|servant|passionate|results-driven/i);
    }
  });
});
