import { existsSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { credentials } from '@/content/credentials';
import { dateLabels } from '@/content/dates';
import type { Certification, Credential, Degree } from '@/content/types';
import { Credentials } from './credentials';

// Rendered with the real content, since the exact names and dates are what #32 asks for.
const html = renderToStaticMarkup(
  <Credentials
    credentials={credentials.credentials}
    hint={credentials.hint}
    newTab={credentials.newTab}
    dateLabels={dateLabels}
    labelledBy="education-title"
  />,
);

/**
 * The two lists, per DDR-074: the row, oldest first, which the wide screen and paper show, and the
 * column, newest first, which a narrower screen shows instead. Only one is ever displayed; the tests
 * below read the row unless they say otherwise.
 */
const [row, column] = html.match(/<ol [^>]*>.*?<\/ol>/g) ?? [];

/** The row's text, as a reader meets it. */
const text = row!.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

/** Each credential's entry in the row, in the order the row shows them. */
const entries = row!.match(/<li class=.*?<\/li>/g) ?? [];

const isCertification = (credential: Credential): credential is Certification => 'granted' in credential;
const isDegree = (credential: Credential): credential is Degree => !isCertification(credential);

const certifications = credentials.credentials.filter(isCertification);
const degrees = credentials.credentials.filter(isDegree);

describe('Credentials', () => {
  it('renders each credential as an entry of the timeline, in the order the content gives', () => {
    // The name is its card's link, per DDR-069, so the title is the heading's text whatever is in it.
    const titles = entries.map((entry) => entry.match(/<h3[^>]*>(.*?)<\/h3>/)?.[1]?.replace(/<[^>]+>/g, ''));

    expect(html).toMatch(/<ol /);
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

  // DDR-068: a degree's card opens with the UPC's logo, above the institution, as a role's card
  // opens with its company's. It repeats the name beneath it, so it has no alternative text.
  it('opens each degree’s card with its institution’s logo, and no certification’s', () => {
    for (const [index, credential] of credentials.credentials.entries()) {
      if (isCertification(credential)) {
        expect(entries[index]).not.toContain('<img');
      } else {
        expect(entries[index]).toMatch(
          /<div class="[^"]*"><img class="[^"]*" src="\/education\/upc\/logo\.webp" alt="" loading="lazy"\/><p class="[^"]*">Universitat Politècnica de Catalunya<\/p>/,
        );
      }
    }
  });

  // DDR-069: the hint stands above the row, as the experience timeline's does, and every card is
  // one link off the site that opens a new tab and says so after its name, so the row takes no tab
  // stop of its own.
  it('stands the hint above the row, in the words the owner chose on #200', () => {
    expect(html).toMatch(/^<div data-appear="true"><p class="[^"]*"><svg[^>]*>.*?<\/svg>Open a credential to learn more<\/p><div data-appear="true"><ol /);
  });

  it('makes each credential’s name one link to its address, in a new tab it announces', () => {
    for (const [index, { name, href }] of credentials.credentials.entries()) {
      const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      expect(entries[index]).toMatch(
        new RegExp(
          `<h3 [^>]*><a href="${href}" class="[^"]*" target="_blank" rel="noopener" aria-label="${escaped}, opens in a new tab">${escaped}</a></h3>`,
        ),
      );
      expect(entries[index]!.match(/<a /g)).toHaveLength(1);
    }
    expect(html).not.toContain('tabindex');
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

    // One for each credential in each list.
    expect(spines).toHaveLength(2 * credentials.credentials.length);
    for (const [, inner] of spines) {
      expect(inner.replace(/<[^>]+>/g, '')).toBe('');
    }
  });

  // DDR-074: below the wide breakpoint the credentials run down the page, newest first, as the owner
  // chose on #218, each card leading off the site as the row's does.
  it('lists the credentials newest first in the column, each leading to its address', () => {
    const links = [...column!.matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map(([, href, name]) => ({ href, name }));

    expect(links).toEqual(credentials.credentials.map(({ href, name }) => ({ href, name })).reverse());
    expect(column).toContain('target="_blank"');
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

  // DDR-068: the UPC's official logo, as a WebP beside the others, per ADR-004. PMI allows its logo
  // only with its written authorization, which the owner has asked for on #197, so neither
  // certification carries one yet.
  it('gives both degrees the UPC’s logo, drawn tall, and neither certification a logo', () => {
    for (const { logo, logoTall } of degrees) {
      expect(logo).toBe('/education/upc/logo.webp');
      expect(logoTall).toBe(true);
      expect(existsSync(new URL(`../public${logo}`, import.meta.url))).toBe(true);
    }
    expect(certifications.map(({ logo }) => logo)).toEqual([undefined, undefined]);
  });

  // DDR-069: a degree leads to the UPC's site, and a certification to its Credly badge, the
  // addresses in the owner's knowledge base. The page links to the badge and draws none of it.
  it('leads each degree to the UPC’s site and each certification to its own badge', () => {
    expect(degrees.map(({ href }) => href)).toEqual(['https://www.upc.edu', 'https://www.upc.edu']);
    expect(certifications.map(({ href }) => href)).toEqual([
      'https://www.credly.com/badges/0453ee02-59fe-441b-9481-48ca4030662d',
      'https://www.credly.com/badges/a8e7a58f-ee8d-4f21-9b7a-136d353ffc6a',
    ]);
    expect(html).not.toMatch(/<img[^>]*credly/i);
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
