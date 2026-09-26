import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { credentials } from '@/content/credentials';
import { dateLabels } from '@/content/dates';
import type { Certification, Credential, Degree } from '@/content/types';
import { Credentials } from './credentials';

// Rendered with the real content, since the exact names and dates are what #32 asks for.
const html = renderToStaticMarkup(
  <Credentials credentials={credentials.credentials} dateLabels={dateLabels} labelledBy="education-title" />,
);

/** The markup's text, as a reader meets it. */
const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

/** Each credential's entry, in the order the page shows them. */
const entries = html.match(/<li class=.*?<\/li>/g) ?? [];

const isCertification = (credential: Credential): credential is Certification => 'granted' in credential;
const isDegree = (credential: Credential): credential is Degree => !isCertification(credential);

const certifications = credentials.credentials.filter(isCertification);
const degrees = credentials.credentials.filter(isDegree);

describe('Credentials', () => {
  it('renders each credential as an entry of the timeline, in the order the content gives', () => {
    const titles = entries.map((entry) => entry.match(/<h3[^>]*>([^<]+)<\/h3>/)?.[1]);

    expect(html).toMatch(/^<ol /);
    expect(entries).toHaveLength(credentials.credentials.length);
    expect(titles).toEqual(credentials.credentials.map(({ name }) => name));
  });

  // DDR-057: the dates stand above the card, which opens with the institution and then the name.
  it('gives each certification the month it was granted, then its issuer and its name', () => {
    expect(text).toContain('May 2026 Project Management Institute PMI Certified Professional in Managing AI (PMI-CPMAI)');
    expect(text).toContain('Jun 2024 Project Management Institute Project Management Professional (PMP)');
    expect(text).not.toContain('Project Management Institute ·');
  });

  it('gives each degree the months it ran, then its institution and its name', () => {
    expect(text).toContain('Sep 2020 – Feb 2022 Universitat Politècnica de Catalunya Master’s degree in IoT');
    expect(text).toContain('Sep 2014 – Feb 2019 Universitat Politècnica de Catalunya Bachelor’s degree in IT');
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

  // The owner removed each degree's thesis on #173, per DDR-057, so no credential has a body.
  it('closes every credential’s card at its name, with no body and no place', () => {
    for (const entry of entries) {
      expect(entry).toMatch(/<\/h3><\/div><\/li>$/);
      // The dates, and the institution.
      expect(entry.match(/<p/g)).toHaveLength(2);
    }
    expect(text).not.toMatch(/thesis/i);
  });

  it('gives a certification one date and a degree two', () => {
    for (const [index, credential] of credentials.credentials.entries()) {
      expect(entries[index]!.match(/<time/g)).toHaveLength(isCertification(credential) ? 1 : 2);
    }
  });

  // Every credential is an entry of the same timeline experience uses, per DDR-010, so the
  // ornament is hidden from assistive technology here too.
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
      ['Project Management Professional (PMP)', 'Project Management Institute', '2024-06'],
      ['PMI Certified Professional in Managing AI (PMI-CPMAI)', 'Project Management Institute', '2026-05'],
    ]);
  });

  it('dates both degrees from Universitat Politècnica de Catalunya as the owner gave them on #26', () => {
    expect(degrees.map(({ name, institution, start, end }) => [name, institution, start, end])).toEqual([
      ['Bachelor’s degree in IT', 'Universitat Politècnica de Catalunya', '2014-09', '2019-02'],
      ['Master’s degree in IoT', 'Universitat Politècnica de Catalunya', '2020-09', '2022-02'],
    ]);
  });

  it('lists the credentials oldest first, per DDR-057, so the certifications come last', () => {
    const latest = credentials.credentials.map((credential) =>
      isCertification(credential) ? credential.granted : credential.end,
    );

    expect(latest).toEqual([...latest].sort());
    expect(credentials.credentials.slice(2).every(isCertification)).toBe(true);
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

  it('shows no certification number, expiry date, or course, which #32 leaves out', () => {
    expect(text).not.toMatch(/\d{5,}|expir|valid until|course/i);
  });
});
