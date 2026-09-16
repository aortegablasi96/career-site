import { readFileSync, statSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { cv } from '@/content/cv';
import { introduction } from '@/content/introduction';
import { Introduction } from './introduction';

// Rendered with the real content, since what the introduction says is what #28 asks for and what
// it shows is what DDR-010 asks for.
const html = renderToStaticMarkup(<Introduction introduction={introduction} cv={cv} />);

/** The markup's text, as a reader meets it. */
const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

/** Every link, with its address and the text it shows, ignoring the mark it carries. */
const links = [...html.matchAll(/<a href="([^"]+)"[^>]*>(.*?)<\/a>/g)].map(([, href, inner]) => ({
  href,
  text: inner.replace(/<[^>]+>/g, '').trim(),
  markup: inner,
}));

const styles = readFileSync(new URL('./introduction.module.css', import.meta.url), 'utf8').replace(
  /\/\*[\s\S]*?\*\//g,
  '',
);

/**
 * The declarations of the rule whose selector list is exactly `selector`, inside `within`.
 *
 * A selector list begins after a brace and never after a comma, which is what the boundary is for:
 * without it, `.cv` would match the rule it shares with `.contact` and report its declarations as
 * its own.
 */
function rule(selector: string, within = styles): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return within.match(new RegExp(`(?:^|[{}])\\s*${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
}

/** The body of a media query, so a rule inside it is read separately from the same rule outside. */
function media(query: string): string {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return styles.match(new RegExp(`@media\\s*${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1] ?? '';
}

describe('Introduction', () => {
  it('is the page header, with the owner’s name as the page title', () => {
    expect(html).toMatch(/<header class="[^"]*"><img /);
    expect(html).toContain(`<h1>${introduction.name}</h1>`);
  });

  it('follows the order DDR-010 sets: photo, name, positioning, location, summary, availability, controls', () => {
    const order = [
      introduction.photo.alt,
      introduction.name,
      introduction.positioning,
      introduction.location,
      introduction.relocation,
      introduction.summary,
      introduction.availability,
      introduction.contact[0].text,
      cv.label,
    ].map((part) => html.indexOf(part));

    expect(order.every((position) => position >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it('adds no heading besides the page title, so the positioning stays out of the outline', () => {
    expect(html.match(/<h\d/g)).toEqual(['<h1']);
  });

  it('shows the summary and the availability exactly as content/ writes them', () => {
    expect(html).toContain(`<p>${introduction.summary}</p>`);
    expect(html).toContain(`<p>${introduction.availability}</p>`);
  });

  it('links to each contact address, with the address as the link text', () => {
    expect(links.slice(0, 3).map(({ href, text }) => ({ href, text }))).toEqual(
      introduction.contact.map(({ href, text }) => ({ href, text })),
    );
  });

  // DDR-010 makes the pills the one place a link is not underlined, so each is identified by its
  // border or fill and by its mark. Both cues survive greyscale, and the text is the address.
  it('gives every control a mark beside its text, hidden from assistive technology', () => {
    expect(links).toHaveLength(introduction.contact.length + 1);

    for (const { markup } of links) {
      expect(markup).toMatch(/<svg [^>]*aria-hidden="true"/);
    }
  });

  it('draws a different mark for each control, so no two are the same shape', () => {
    const marks = links.map(({ markup }) => markup.match(/<svg[\s\S]*<\/svg>/)?.[0]);

    expect(new Set(marks).size).toBe(links.length);
  });
});

describe('the photo', () => {
  const image = html.match(/<img [^>]*>/)?.[0] ?? '';

  it('is shown with the alternative text content/ gives it, so it is not decorative', () => {
    expect(image).toContain(`alt="${introduction.photo.alt}"`);
    expect(introduction.photo.alt.length).toBeGreaterThan(0);
  });

  // The page reads correctly without it: the photo repeats the name beside it and carries nothing
  // the text does not, so a reader who never sees it loses nothing.
  it('says nothing the text does not, so the page reads correctly if it fails to load', () => {
    expect(text).toContain(introduction.name);
    expect(introduction.photo.alt).toBe(introduction.name);
  });

  it('reaches the file through asset(), so it resolves under the Pages base path', () => {
    expect(image).toContain(`src="${introduction.photo.file}"`);
    expect(readFileSync(new URL('./introduction.tsx', import.meta.url), 'utf8')).toContain(
      'asset(photo.file)',
    );
  });

  it('is a file the site carries, within the budget ADR-004 sets for it', () => {
    // statSync throws if the path is wrong, so this holds the path to the file that is published.
    const bytes = statSync(
      new URL(`../public${introduction.photo.file}`, import.meta.url),
    ).size;

    expect(bytes).toBeLessThanOrEqual(100 * 1024);
  });
});

describe('the CV control', () => {
  const control = links.at(-1)!;

  it('is the fourth control, and shows the label content/ gives it', () => {
    expect(control.text).toBe(cv.label);
  });

  it('resolves to the file the site carries, through asset()', () => {
    expect(control.href).toBe(cv.file);
    expect(statSync(new URL(`../public${cv.file}`, import.meta.url)).isFile()).toBe(true);
    expect(readFileSync(new URL('./introduction.tsx', import.meta.url), 'utf8')).toContain(
      'asset(cv.file)',
    );
  });

  it('downloads the file rather than opening it', () => {
    expect(html).toMatch(/<a href="[^"]*\.pdf"[^>]*download/);
  });
});

// DDR-010 decides how the introduction is laid out and what it does on paper. These read the
// stylesheet as written, so a later edit cannot quietly drop a rule an acceptance criterion rests on.
describe('introduction styles', () => {
  const wide = media('(min-width: 48em)');
  const paper = media('print');

  it('fixes both of the photo’s dimensions, so the page does not shift when it loads', () => {
    expect(rule('.photo')).toMatch(/inline-size:\s*var\(--photo-size\);/);
    expect(rule('.photo')).toMatch(/block-size:\s*var\(--photo-size\);/);
    expect(rule('.photo')).toMatch(/object-fit:\s*cover;/);
  });

  // DDR-010 places the photo beside the name so that it never pushes the positioning line or the
  // contact controls below the fold on a phone. Below the wide breakpoint that is a float, so the
  // summary returns to the full column beneath it rather than sharing a narrow one with it.
  // Measured at 390 by 844 on #48: the name ends at 237 and two controls are above the fold, where
  // stacking the photo above the name left the first control 2px below it.
  it('puts the photo beside the name below the wide breakpoint too, per DDR-010', () => {
    expect(rule('.photo')).toMatch(/float:\s*inline-start;/);
    expect(rule('.text > h1')).toMatch(/display:\s*flow-root;/);
  });

  it('gives the photo a column of its own from the wide breakpoint, per DDR-010', () => {
    expect(rule('.introduction', wide)).toMatch(
      /grid-template-columns:\s*var\(--photo-size-wide\)\s*1fr;/,
    );
    expect(rule('.photo', wide)).toMatch(/inline-size:\s*var\(--photo-size-wide\);/);
    // The grid places it, so the text stops running past it and the whole of it takes the second
    // column. The same applies on paper, which is laid out by the print rules rather than by width.
    expect(rule('.photo', wide)).toMatch(/float:\s*none;/);
    expect(rule('.photo', paper)).toMatch(/float:\s*none;/);
  });

  it('gives every control at least the minimum target in each direction, per DDR-014', () => {
    const pill = rule('.contact,\n.cv');

    expect(pill).toMatch(/min-block-size:\s*var\(--target-size-min\);/);
    expect(pill).toMatch(/min-inline-size:\s*var\(--target-size-min\);/);
  });

  it('identifies a control by its border or its fill rather than by an underline, per DDR-010', () => {
    expect(rule('.contact,\n.cv')).toMatch(/text-decoration-line:\s*none;/);
    // A control's edge carries meaning, so it is the secondary ink rather than the decoration one.
    expect(rule('.contact')).toMatch(/border:\s*1px solid var\(--color-text-secondary\);/);
    expect(rule('.cv')).toMatch(/background-color:\s*var\(--color-accent\);/);
    expect(rule('.cv')).toMatch(/color:\s*var\(--color-on-accent\);/);
  });

  it('hides the CV control on paper, where a download is dead and the paper is the CV', () => {
    expect(rule('.cvItem', paper)).toMatch(/display:\s*none;/);
  });

  it('keeps the photo beside the name on paper, reduced, per DDR-010', () => {
    expect(rule('.introduction', paper)).toMatch(
      /grid-template-columns:\s*var\(--photo-size\)\s*1fr;/,
    );
    expect(rule('.photo', paper)).toMatch(/inline-size:\s*var\(--photo-size\);/);
  });

  it('prints a contact address once, as the link’s own text, per DDR-006', () => {
    expect(rule('.contact::after', paper)).toMatch(/content:\s*none;/);
    expect(rule('.contact', paper)).toMatch(/border:\s*none;/);
  });
});

describe('introduction content', () => {
  it('gives each contact link its own address as its text, so it is not printed twice', () => {
    for (const { text, href } of introduction.contact) {
      expect(href.replace(/^mailto:|^https:\/\/(?:www\.)?/, '').replace(/\/$/, '')).toBe(text);
    }
  });

  it('gives each contact link a mark of its own, so no two controls look alike', () => {
    const icons = introduction.contact.map(({ icon }) => icon);

    expect(new Set(icons).size).toBe(icons.length);
  });

  it('shows neither a phone number nor a date of birth, per the Content Brief', () => {
    expect(text).not.toMatch(/\+?\d[\d ]{7,}\d/);
    expect(text).not.toMatch(/1996|born/i);
  });

  it('shows no work permit, which the owner left out on #26', () => {
    expect(text).not.toMatch(/permit/i);
  });

  it('invites a conversation rather than announcing a job search, since the ABB role is current (#28)', () => {
    expect(introduction.availability).toMatch(/happy to talk/);
    expect(text).not.toMatch(/open to (?:new )?(?:product )?roles|looking for|job search/i);
  });
});
