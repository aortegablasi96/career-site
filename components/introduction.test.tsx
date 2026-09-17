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

// Line endings are normalised first: a selector list below is matched across the newline that
// separates its two selectors, and git hands the file back with CRLF on a Windows checkout.
const styles = readFileSync(new URL('./introduction.module.css', import.meta.url), 'utf8')
  .replace(/\r\n/g, '\n')
  .replace(/\/\*[\s\S]*?\*\//g, '');

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
    expect(html).toMatch(/<header class="[^"]*"><span[^>]*><img /);
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
      introduction.contact[0].label,
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

  // DDR-029: the pill shows the design's short label and the footer shows the address. The
  // addresses the pills link to are unchanged, so the two places still agree about where a contact
  // leads.
  it('links to each contact address, with the design’s label as the link text', () => {
    expect(links.slice(0, 3).map(({ href, text }) => ({ href, text }))).toEqual(
      introduction.contact.map(({ href, label }) => ({ href, text: label })),
    );
  });

  // The whole objection DDR-010 raised against the label, held where it can be seen: with the
  // pills labelled, the introduction shows no address at all, so the footer is the only thing
  // standing between the printed CV and no contact details. app/page.test.tsx holds the other end.
  it('shows no address itself, since the footer is what carries them, per DDR-029', () => {
    // The addresses are still what the pills link to, so the hrefs are taken out first: what is
    // checked is what a reader sees, not where a control leads.
    const shown = html.replace(/ href="[^"]*"/g, '');

    for (const { text } of introduction.contact) {
      expect(shown).not.toContain(text);
    }
  });

  // DDR-010 makes the pills the one place a link is not underlined, so each is identified by its
  // border or fill and by its mark. Both cues survive greyscale. Since DDR-029 the mark is also
  // what names the service beside a label that could be any link's.
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
    expect(rule('.photo')).toMatch(/inline-size:\s*var\(--photo-width\);/);
    expect(rule('.photo')).toMatch(/aspect-ratio:\s*var\(--photo-ratio\);/);
    expect(rule('.photo')).toMatch(/object-fit:\s*cover;/);
  });

  // DDR-021: the design draws the photo as a capsule, and a radius larger than half the box is
  // clamped to half it, so the pill radius on a 3:4 box rounds the top and bottom into semicircles
  // and leaves the sides straight. It is the radius the introduction's own controls already take,
  // so the site still has the three DDR-013 gives it.
  it('draws the photo as the design’s capsule, by the radius DDR-013 already has, per DDR-021', () => {
    expect(rule('.photo')).toMatch(/border-radius:\s*var\(--radius-pill\);/);
    expect(rule('.frame')).toMatch(/border-radius:\s*var\(--radius-pill\);/);
    expect(rule('.frame::after')).toMatch(/border-radius:\s*var\(--radius-pill\);/);
  });

  // DDR-021 lights the photo twice, and the two are drawn on two elements because an inset
  // box-shadow on an `<img>` paints nothing: a replaced element's content covers it, measured in
  // Chromium and Gecko alike. The glow spreads outwards, so it goes on the outermost box; the inner
  // shadow has to be above the image, so it goes on a pseudo-element over it.
  it('lights the photo from the frame and over it, per DDR-021', () => {
    expect(rule('.frame')).toMatch(/box-shadow:\s*var\(--shadow-photo-glow\);/);
    expect(rule('.frame::after')).toMatch(/box-shadow:\s*var\(--shadow-photo-inner\);/);
    // The image itself is given neither: an inset on it would draw nothing, and the glow drawn
    // there would be clipped by the frame's own box in no engine but be a second light in every.
    expect(rule('.photo')).not.toMatch(/box-shadow/);
  });

  // The frame holds no content and takes no name, so the photo is still the image and its
  // accessible name is still the alt text content/ gives it. A pseudo-element is not in the
  // accessibility tree at all.
  it('wraps the photo in a frame that adds nothing to the accessibility tree', () => {
    expect(html).toMatch(/<span class="[^"]*"><img[^>]*alt="[^"]*"\/?><\/span>/);

    // The frame carries a class and nothing else. A role would give it a name of its own, and
    // aria-hidden would take the photo out of the tree along with it.
    const frame = html.match(/<span[^>]*_frame[^>]*>/)![0];

    expect(frame).not.toMatch(/\saria-|\srole=/);
  });

  // DDR-010 places the photo beside the name so that it never pushes the positioning line or the
  // contact controls below the fold on a phone. Below the wide breakpoint that is a float, so the
  // summary returns to the full column beneath it rather than sharing a narrow one with it.
  // Measured at 390 by 844 on #48: the name ends at 237 and two controls are above the fold, where
  // stacking the photo above the name left the first control 2px below it.
  it('puts the photo beside the name below the wide breakpoint too, per DDR-010', () => {
    // The frame is what floats since DDR-021, and it shrink-wraps the photo, so it is the photo's
    // box in every respect the layout cares about.
    expect(rule('.frame')).toMatch(/float:\s*inline-start;/);
    expect(rule('.text > h1')).toMatch(/display:\s*flow-root;/);
  });

  // #68: the photo is sized in rem, so it grows with the reader's text while the room beside it
  // shrinks. Without a minimum the name was squeezed to 119px at 390px and 200%, and broke mid-word
  // onto seven lines; at 320px it had 49px and took seventeen. The minimum is what moves the name
  // below the photo once the longest word no longer fits beside it, which is the rule browsers
  // already apply to a block that establishes its own formatting context.
  it('drops the name below the photo rather than squeezing it, when text is enlarged, per #68', () => {
    expect(rule('.text > h1')).toMatch(/min-inline-size:\s*min-content;/);
  });

  it('gives the photo a column of its own from the wide breakpoint, per DDR-010', () => {
    expect(rule('.introduction', wide)).toMatch(
      /grid-template-columns:\s*var\(--photo-width-wide\)\s*1fr;/,
    );
    expect(rule('.photo', wide)).toMatch(/inline-size:\s*var\(--photo-width-wide\);/);
    // The ratio carries the height at both widths, so the wide rule sets no height of its own.
    expect(rule('.photo', wide)).not.toMatch(/block-size/);
    // The grid places the frame, so the text stops running past it and the whole of it takes the
    // second column.
    expect(rule('.frame', wide)).toMatch(/float:\s*none;/);
  });

  // DDR-027: a control is the 37px the design draws, which is its padding and its label and no
  // minimum of its own. A minimum was also measured against the content box, since nothing on the
  // site sets border-box, so the 44px DDR-014 asked for drew a 62px pill rather than a 44px one.
  it('gives every control the padding the design draws and no minimum, per DDR-027', () => {
    const pill = rule('.contact,\n.cv');

    expect(pill).toMatch(/padding-block:\s*var\(--space-small\);/);
    expect(pill).toMatch(/padding-inline:\s*var\(--space-medium\);/);
    expect(pill).not.toMatch(/min-block-size|min-inline-size/);
  });

  it('identifies a control by its border or its fill rather than by an underline, per DDR-010', () => {
    expect(rule('.contact,\n.cv')).toMatch(/text-decoration-line:\s*none;/);
    // DDR-025 gives the border the design's indigo tint, which cannot carry meaning at 1.49:1, and
    // the white the design fills the pill with. What identifies the control is its icon, its shape
    // and that fill; the border reinforces them.
    expect(rule('.contact')).toMatch(/border:\s*1px solid var\(--color-border-accent\);/);
    expect(rule('.contact')).toMatch(/background-color:\s*var\(--color-surface-card\);/);
    expect(rule('.cv')).toMatch(/background-color:\s*var\(--color-accent\);/);
    expect(rule('.cv')).toMatch(/color:\s*var\(--color-on-accent\);/);
  });

  // DDR-025: the design sets the location line in #94a3b8, the one ink on the page fainter than
  // the muted grey `.metadata` carries. It is 2.39:1 and fails WCAG 1.4.3.
  it('sets the location line in the faintest ink, per DDR-025', () => {
    expect(rule('.location')).toMatch(/color:\s*var\(--color-text-faint\);/);
  });

  // DDR-020 raises both kinds of pill by the one shadow the site has. It is never what identifies
  // a control — the border or the fill above, and the icon, do that — so a forced-colours mode
  // that drops every shadow drops nothing a reader needs.
  it('raises both kinds of pill off the page, per DDR-020', () => {
    expect(rule('.contact,\n.cv')).toMatch(/box-shadow:\s*var\(--shadow-raised\);/);
  });

  it('hides the CV control on paper, where a download is dead and the paper is the CV', () => {
    expect(rule('.cvItem', paper)).toMatch(/display:\s*none;/);
  });

  // The introduction is the one section whose paper layout is the narrow one rather than the wide
  // one, per DDR-015: the photo prints at 28mm, which is short, so a column of its own would leave
  // three quarters of it empty, and the UI Review on #43 asks for it beside the *name*. That is the
  // float at the top of the file, so the print block writes no layout at all and the size comes
  // from the token print redefines.
  it('leaves the photo beside the name on paper, by the float rather than a layout of its own', () => {
    expect(paper).not.toMatch(/grid-template-columns|float/);
    expect(rule('.frame')).toMatch(/float:\s*inline-start;/);
    expect(rule('.photo')).toMatch(/inline-size:\s*var\(--photo-width\);/);
  });

  // The pill prints its label and nothing after it, per DDR-029. The base styles would otherwise
  // print `(mailto:…)` after "Email", which is the prefix DDR-006 removed; the address itself is on
  // the sheet once, from the footer.
  it('prints the label with no address after it, per DDR-029', () => {
    expect(rule('.contact::after', paper)).toMatch(/content:\s*none;/);
    expect(rule('.contact', paper)).toMatch(/border:\s*none;/);
  });

  // Every shadow here is put out by its token in print — the pills' by DDR-020 and the photo's two
  // by DDR-021 — as the surfaces are by DDR-015, so there is nothing here to write.
  it('writes no rule to put out its own shadows, which the tokens drop', () => {
    expect(paper).not.toMatch(/box-shadow/);
  });
});

describe('introduction content', () => {
  // `text` is the address the footer shows, and it is the address the pill beside it links to, so
  // a reader who copies it out of the footer reaches the same place the pill does.
  it('gives each contact link its own address as its text, matching what it links to', () => {
    for (const { text, href } of introduction.contact) {
      expect(href.replace(/^mailto:|^https:\/\/(?:www\.)?/, '').replace(/\/$/, '')).toBe(text);
    }
  });

  // DDR-029 takes the design's own three words. Each names a service rather than describing the
  // owner, and each is shorter than the address it replaces, which is the whole point of it.
  it('labels each contact pill with the service the design names, per DDR-029', () => {
    expect(introduction.contact.map(({ label }) => label)).toEqual(['Email', 'LinkedIn', 'GitHub']);
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
