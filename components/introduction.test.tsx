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

/** A content string as a literal inside a regular expression. */
const literal = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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

  it('follows the order DDR-056 sets: photo, greeting, name, positioning, location, summary, controls', () => {
    const order = [
      introduction.photo.alt,
      introduction.greeting,
      // The name is also the photo's alternative text, so it is found by its heading.
      `<h1>${introduction.name}`,
      introduction.positioning,
      introduction.location,
      introduction.summary,
      introduction.contact[0].label,
      cv.label,
    ].map((part) => html.indexOf(part));

    expect(order.every((position) => position >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it('adds no heading besides the page title, so the positioning stays out of the outline', () => {
    expect(html.match(/<h\d/g)).toEqual(['<h1']);
  });

  it('shows the summary exactly as content/ writes it, as the one paragraph below the location', () => {
    expect(html).toMatch(new RegExp(`<p class="[^"]+">${literal(introduction.summary)}</p>`));
    expect(html.match(/<p class="[^"]*summary[^"]*"/g)).toHaveLength(1);
  });

  // DDR-056: the greeting is a paragraph before the heading rather than part of it, so the page
  // title and the outline still carry the name alone. The two are one hgroup, so the layout keeps
  // them together.
  it('greets the visitor in a paragraph of its own, grouped with the page title', () => {
    expect(html).toMatch(
      new RegExp(
        `<hgroup class="[^"]+"><p class="[^"]+">${literal(introduction.greeting)}</p><h1>${literal(introduction.name)}</h1></hgroup>`,
      ),
    );
  });

  // #171: the owner removed the relocation note and the availability sentence.
  it('says nothing about relocation', () => {
    expect(text).not.toMatch(/relocat/i);
  });

  // DDR-056: the place carries a map pin that repeats what its words say, so it is hidden from
  // assistive technology and the place is still read as text.
  it('marks the location with a pin hidden from assistive technology, before the place’s words', () => {
    expect(html).toMatch(
      new RegExp(`<p class="[^"]*location[^"]*"><svg [^>]*aria-hidden="true"[^>]*>.*?</svg>${literal(introduction.location)}</p>`),
    );
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

  // DDR-043: a profile opens in a new tab so the page stays open behind it, and the new tab cannot
  // reach back to this one. The email pill opens the mail client, so it opens no tab.
  it('opens LinkedIn and GitHub in a new tab that cannot reach this one, per DDR-043', () => {
    const anchors = [...html.matchAll(/<a [^>]*>/g)].map(([tag]) => tag);

    for (const { href, newTab } of introduction.contact) {
      const tag = anchors.find((anchor) => anchor.includes(`href="${href}"`))!;

      if (newTab) {
        expect(tag).toContain('target="_blank"');
        expect(tag).toMatch(/rel="[^"]*\bnoopener\b[^"]*"/);
      } else {
        expect(tag).not.toMatch(/target=|rel=/);
      }
    }
  });

  // DDR-044: the pill shows no sign of the tab, so its accessible name says it, and says it after
  // the visible label, so the name a reader speaks to choose the pill is still the start of the
  // name, per WCAG 2.5.3. The email pill opens no tab and takes its name from its label alone.
  it('says a pill opens a new tab in its accessible name, after the visible label, per DDR-044', () => {
    const anchors = [...html.matchAll(/<a [^>]*>/g)].map(([tag]) => tag);

    for (const { href, label, newTab } of introduction.contact) {
      const tag = anchors.find((anchor) => anchor.includes(`href="${href}"`))!;

      if (newTab) {
        expect(tag).toContain(`aria-label="${label}, ${introduction.newTab}"`);
      } else {
        expect(tag).not.toContain('aria-label');
      }
    }

    // Nothing visible says it: no mark on a pill is named, and the visible labels are DDR-029's.
    expect(html).not.toMatch(/role="img"/);
    expect(links.slice(0, 3).map(({ text }) => text)).toEqual(['Email', 'LinkedIn', 'GitHub']);
  });

  // DDR-044: the three contact marks are solid shapes, where the download beside them is still a
  // line drawing. None is given a class: its colour is its pill's, or for Gmail, its own.
  it('draws the three contact marks as solid shapes in their pill’s ink, per DDR-044', () => {
    for (const { label } of introduction.contact) {
      const svg = links.find(({ text }) => text === label)!.markup.match(/<svg[^>]*>/)![0];

      expect(svg).toContain('fill="currentColor"');
      expect(svg).not.toMatch(/stroke=|class=/);
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

  // DDR-038: the summary is running text and takes the prose leading. The positioning line and the
  // location are paragraphs in the same column and are short lines, so the leading is a class.
  it('sets the summary at the prose leading, and no other line of the introduction, per DDR-038', () => {
    expect(rule('.summary')).toMatch(/line-height:\s*var\(--line-height-prose\);/);
    expect(styles.match(/line-height:/g)).toHaveLength(1);
  });

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
    expect(rule('.heading')).toMatch(/display:\s*flow-root;/);
  });

  // #68: the photo is sized in rem, so it grows with the reader's text while the room beside it
  // shrinks. Without a minimum the name was squeezed to 119px at 390px and 200%, and broke mid-word
  // onto seven lines; at 320px it had 49px and took seventeen. The minimum is what moves the name
  // below the photo once the longest word no longer fits beside it, which is the rule browsers
  // already apply to a block that establishes its own formatting context.
  it('drops the name below the photo rather than squeezing it, when text is enlarged, per #68', () => {
    // Since DDR-056 the greeting shares the name's box, so the two move together.
    expect(rule('.heading')).toMatch(/min-inline-size:\s*min-content;/);
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

  // DDR-040: the design's proportions. 64px between the photo and the text, the summary held to
  // 680px, and the summary and the controls set further apart from what precedes them than the
  // flow step, by two spaces of the rhythm.
  it("sets the introduction's gap, measure and spaces to the design's, per DDR-040", () => {
    expect(rule('.introduction', wide)).toMatch(/gap:\s*var\(--space-x-large\);/);
    expect(rule('.summary')).toMatch(/max-inline-size:\s*var\(--measure-summary\);/);
    expect(rule('.location + .summary')).toMatch(/margin-block-start:\s*var\(--space-summary\);/);
    expect(rule('.summary + .controls')).toMatch(
      /margin-block-start:\s*var\(--space-controls\);/,
    );
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

  // DDR-035: under the pointer a contact pill takes the tag's pale indigo and a stronger border, and
  // the CV pill darkens its fill and its border together, so neither changes size. Keyboard focus
  // draws the same, so it is never less visible than hover.
  it('answers the pointer and keyboard focus with the design’s colours, per DDR-035', () => {
    const contact = rule('.contact:hover,\n.contact:focus-visible');
    const cv = rule('.cv:hover,\n.cv:focus-visible');

    expect(contact).toMatch(/border-color:\s*var\(--color-border-accent-hover\);/);
    expect(contact).toMatch(/background-color:\s*var\(--color-surface-hover\);/);
    expect(cv).toMatch(/border-color:\s*var\(--color-accent-hover\);/);
    expect(cv).toMatch(/background-color:\s*var\(--color-accent-hover\);/);
    expect(`${contact}${cv}`).not.toMatch(/(?:^|[^-])(?:border|padding|box-shadow):/);
  });

  // DDR-044: the LinkedIn and GitHub pills are each service's own button — its colour behind a white
  // mark and label — and under the pointer only the fill darkens, so no mark is ever recoloured.
  it('makes every contact pill its service’s own button, per DDR-044', () => {
    for (const brand of ['linkedin', 'github']) {
      const rest = rule(`.${brand}`);
      const hover = rule(`.${brand}:hover,\n.${brand}:focus-visible`);

      expect(rest).toContain(`background-color: var(--color-surface-${brand});`);
      expect(rest).toContain(`border-color: var(--color-surface-${brand});`);
      expect(rest).toMatch(/(?:^|[^-])color: var\(--color-on-brand\);/);
      expect(hover).toContain(`background-color: var(--color-surface-${brand}-hover);`);
      expect(hover).not.toMatch(/(?:^|[^-])color:/);
    }

    const anchors = [...html.matchAll(/<a [^>]*>/g)].map(([tag]) => tag);
    const classes = (href: string) =>
      anchors.find((tag) => tag.includes(`href="${href}"`))!.match(/class="([^"]+)"/)![1];

    for (const { href } of introduction.contact) {
      expect(classes(href).split(' ')).toHaveLength(2);
    }

    // The email pill is Gmail's light button: white, with Google's grey edge and near-black label,
    // and Google's grey state layer under the pointer.
    expect(rule('.gmail')).toContain('border-color: var(--color-google-border);');
    expect(rule('.gmail')).toMatch(/(?:^|[^-])color: var\(--color-google-ink\);/);
    expect(rule('.gmail:hover,\n.gmail:focus-visible')).toContain(
      'background-color: var(--color-surface-google-hover);',
    );
  });

  // DDR-044: Gmail's M is drawn in its own four colours, which are the mark, and nothing on the pill
  // sets them; the other two marks have one colour each, which their pill decides.
  it('draws Gmail’s M in its own colours, and the other marks in their pill’s ink, per DDR-044', () => {
    const gmail = links.find(({ text }) => text === 'Email')!.markup;

    for (const colour of ['#4285f4', '#34a853', '#fbbc04', '#ea4335']) {
      expect(gmail).toContain(`fill="${colour}"`);
    }
    for (const label of ['LinkedIn', 'GitHub']) {
      expect(links.find(({ text }) => text === label)!.markup).not.toMatch(/fill="#/);
    }
  });

  // DDR-044: no fill prints, so on paper each brand's mark and label take the brand's own colour,
  // which is its mark on white, rather than a white that would vanish.
  it('prints the LinkedIn and GitHub marks in their own brand colours, per DDR-044', () => {
    expect(rule('.linkedin', paper)).toMatch(/color:\s*var\(--color-linkedin\);/);
    expect(rule('.github', paper)).toMatch(/color:\s*var\(--color-github\);/);
  });

  // DDR-025: the design sets the location line in #94a3b8, the one ink on the page fainter than
  // the muted grey `.metadata` carries. It is 2.39:1 and fails WCAG 1.4.3.
  it('sets the location line in the faintest ink, per DDR-025', () => {
    expect(rule('.location')).toMatch(/color:\s*var\(--color-text-faint\);/);
  });

  // DDR-056: the greeting is smaller than the name, in the secondary ink rather than the accent,
  // and on screen only.
  it('sets the greeting at the positioning line’s size in the secondary ink, per DDR-056', () => {
    expect(rule('.greeting')).toMatch(/font-size:\s*var\(--font-size-large\);/);
    expect(rule('.greeting')).toMatch(/color:\s*var\(--color-text-secondary\);/);
  });

  it('hides the greeting on paper and adds nothing above the name there, per DDR-056', () => {
    expect(rule('.greeting', paper)).toMatch(/display:\s*none;/);
    expect(rule('.greeting + h1', paper)).toMatch(/margin-block-start:\s*0;/);
  });

  // DDR-020 raises both kinds of pill by the one shadow the site has. It is never what identifies
  // a control — the border or the fill above, and the icon, do that — so a forced-colours mode
  // that drops every shadow drops nothing a reader needs.
  it('raises both kinds of pill off the page, per DDR-020', () => {
    expect(rule('.contact,\n.cv')).toMatch(/box-shadow:\s*var\(--shadow-raised\);/);
  });

  // DDR-030 adds the four controls to DDR-023's medium row. The weight sits on the shared rule
  // rather than on each kind of pill, because it belongs to a control's label and every control has
  // one; the CV pill, which carried it alone, therefore writes none of its own any more.
  it('sets all four control labels in medium, per DDR-030', () => {
    expect(rule('.contact,\n.cv')).toMatch(/font-weight:\s*var\(--font-weight-medium\);/);
    expect(rule('.cv')).not.toMatch(/font-weight/);
    expect(rule('.contact')).not.toMatch(/font-weight/);
  });

  // DDR-046, as revised: the introduction is the first band, so the contents bar above it is set
  // apart from the first view. It carries the space above the page, which `main` carried, and the
  // half of the first boundary above the first divider, which was that section's margin. Paper
  // gives the half back to the section, where a margin is truncated at a break and a padding is not.
  it('is the first band, from the contents bar to the first divider, per DDR-046', () => {
    expect(rule('.introduction')).toMatch(/background-color:\s*var\(--color-surface-band\);/);
    expect(rule('.introduction')).toMatch(/padding-block:\s*var\(--page-padding-block\) var\(--space-boundary\);/);
    expect(rule('.introduction', paper)).toMatch(/padding-block-end:\s*0;/);
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

  // DDR-043: the two profiles open a new tab and the email address does not.
  it('opens the two profiles in a new tab and the email address in the mail client, per DDR-043', () => {
    expect(introduction.contact.map(({ label, newTab }) => [label, newTab])).toEqual([
      ['Email', false],
      ['LinkedIn', true],
      ['GitHub', true],
    ]);
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

  it('announces no job search, since the ABB role is current (#28)', () => {
    expect(text).not.toMatch(/open to (?:new )?(?:product )?roles|looking for|job search/i);
  });
});
