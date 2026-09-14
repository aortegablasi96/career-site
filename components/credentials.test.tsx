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

/** Each credential's entry, in the order the page shows them. */
const entries = html.match(/<article[^>]*>.*?<\/article>/g) ?? [];

const isCertification = (credential: Credential): credential is Certification => 'granted' in credential;
const isDegree = (credential: Credential): credential is Degree => 'thesis' in credential;

const certifications = credentials.credentials.filter(isCertification);
const degrees = credentials.credentials.filter(isDegree);
const degree = (name: string) => degrees.find((candidate) => candidate.name.startsWith(name))!;

describe('Credentials', () => {
  it('renders each credential as an entry, in the order the content gives', () => {
    const titles = entries.map((entry) => entry.match(/<h3>([^<]+)<\/h3>/)?.[1]);

    expect(titles).toEqual(credentials.credentials.map(({ name }) => name));
  });

  it('gives each certification its issuer and the month it was granted, per DDR-006', () => {
    expect(text).toContain('Project Management Institute · May 2026');
    expect(text).toContain('Project Management Institute · Jun 2024');
  });

  it('gives each degree its institution and the months it ran, per DDR-006', () => {
    expect(text).toContain('Universitat Politècnica de Catalunya · Sep 2020 – Feb 2022');
    expect(text).toContain('Universitat Politècnica de Catalunya · Sep 2014 – Feb 2019');
  });

  it('marks up every date with its machine-readable value', () => {
    for (const credential of credentials.credentials) {
      const months = isCertification(credential) ? [credential.granted] : [credential.start, credential.end];

      for (const month of months) {
        expect(html).toMatch(new RegExp(`<time datetime="${month}">`, 'i'));
      }
    }
  });

  it('follows a degree’s metadata with its thesis, as a paragraph', () => {
    for (const [index, credential] of credentials.credentials.entries()) {
      if (isDegree(credential)) {
        expect(entries[index]!.endsWith(`</p><p>${credential.thesis}</p></article>`)).toBe(true);
      }
    }
  });

  it('ends a certification at its metadata line, with one date and no body', () => {
    for (const [index, credential] of credentials.credentials.entries()) {
      if (isCertification(credential)) {
        expect(entries[index]).toMatch(/<\/h3><p[^>]*>.*<\/p><\/article>$/);
        expect(entries[index]!.match(/<p/g)).toHaveLength(1);
        expect(entries[index]!.match(/<time/g)).toHaveLength(1);
      }
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
