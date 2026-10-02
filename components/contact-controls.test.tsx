import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { cv } from '@/content/cv';
import { introduction } from '@/content/introduction';
import { ContactControls } from './contact-controls';

// Rendered with the real content, since these are the introduction's own controls, per DDR-072 and
// DDR-076, which DDR-099 puts at the end of every view too. components/introduction.test.tsx holds
// where they stand in the introduction, and the views' tests where they stand in a view.
const html = renderToStaticMarkup(<ContactControls introduction={introduction} cv={cv} />);

/** Every link, with its address and the text it shows, ignoring the mark it carries. */
const links = [...html.matchAll(/<a href="([^"]+)"[^>]*>(.*?)<\/a>/g)].map(([, href, inner]) => ({
  href,
  text: inner.replace(/<[^>]+>/g, '').trim(),
  markup: inner,
}));

// Line endings are normalised first: a selector list below is matched across the newline that
// separates its two selectors, and git hands the file back with CRLF on a Windows checkout.
const styles = readFileSync(new URL('./contact-controls.module.css', import.meta.url), 'utf8')
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

describe('ContactControls', () => {
  // DDR-072 and DDR-076: the question, the line below it and the list, in that order and with no box
  // of their own, so each place lays the three out in its own column.
  it('renders the question, the line and the controls as three blocks with no box of their own', () => {
    expect(html).toMatch(
      new RegExp(
        `^<p class="[^"]*invitation[^"]*">${literal(introduction.invitation)}</p><p class="[^"]*callToAction[^"]*">${literal(introduction.callToAction)}</p><ul class="[^"]*controls[^"]*">.*</ul>$`,
      ),
    );
  });

  // The question is a paragraph, per DDR-072, so a view's outline gains nothing from it either.
  it('adds no heading', () => {
    expect(html).not.toMatch(/<h\d/);
  });

  it('shows the three contact pills, then the CV control', () => {
    expect(links.map(({ href }) => href)).toEqual([
      ...introduction.contact.map(({ href }) => href),
      cv.file,
    ]);
  });

  it('reaches the CV through asset(), so it resolves under the Pages base path, and downloads it', () => {
    expect(readFileSync(new URL('./contact-controls.tsx', import.meta.url), 'utf8')).toContain(
      'asset(cv.file)',
    );
    expect(html).toMatch(/<a href="[^"]*\.pdf"[^>]*download/);
  });
});

describe('contact control styles', () => {
  const paper = media('print');

  // The controls follow the line above them at the flow step wherever they stand: the introduction's
  // column gives them that anyway, and a view's block, a `div`, gives them nothing.
  it('sets the controls a flow step below the line above them', () => {
    expect(rule('.callToAction + .controls')).toMatch(/margin-block-start:\s*var\(--space-flow\);/);
  });

  // The blocks have no box, so the space above the question is the place's to set, not this one's.
  it('sets no space above the question, which is the place’s to set', () => {
    expect(rule('.invitation')).not.toMatch(/margin/);
  });

  it('sets the line a step below the question in the secondary ink, per DDR-076', () => {
    expect(rule('.invitation + .callToAction')).toMatch(
      /margin-block-start:\s*var\(--space-x-small\);/,
    );
    expect(rule('.callToAction')).toMatch(/color:\s*var\(--color-text-secondary\);/);
    // The body's size and weight, so it writes neither, and the question stays the highlight.
    expect(rule('.callToAction')).not.toMatch(/font-(size|weight)/);
  });

  it('highlights the question in the accent at the larger step and semibold, per DDR-072', () => {
    expect(rule('.invitation')).toMatch(/color:\s*var\(--color-accent\);/);
    expect(rule('.invitation')).toMatch(/font-size:\s*var\(--font-size-large\);/);
    expect(rule('.invitation')).toMatch(/font-weight:\s*var\(--font-weight-semibold\);/);
  });

  // On paper the controls take back the space the question and the line below it took, so the
  // sheet is as it was.
  it('hides the question and the line below it on paper and gives the controls their space there, per DDR-072 and DDR-076', () => {
    expect(rule('.invitation', paper)).toMatch(/display:\s*none;/);
    expect(rule('.callToAction', paper)).toMatch(/display:\s*none;/);
    expect(rule('.callToAction + .controls', paper)).toMatch(
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

    for (const { href, markOnly } of introduction.contact) {
      expect(classes(href).split(' ')).toHaveLength(markOnly ? 3 : 2);
    }

    // The email pill is Gmail's light button: white, with Google's grey edge and near-black label,
    // and Google's grey state layer under the pointer.
    expect(rule('.gmail')).toContain('border-color: var(--color-google-border);');
    expect(rule('.gmail')).toMatch(/(?:^|[^-])color: var\(--color-google-ink\);/);
    expect(rule('.gmail:hover,\n.gmail:focus-visible')).toContain(
      'background-color: var(--color-surface-google-hover);',
    );
  });

  // DDR-073: a mark shown alone takes the square a label's line would, so the pill is as tall as
  // the labelled pills beside it, and it keeps their padding with the GitHub pill's content width,
  // so it is exactly as wide as the GitHub pill, with the mark centred.
  it('draws a pill that shows its mark alone as tall as the others and as wide as GitHub’s, per DDR-073', () => {
    expect(rule('.markOnly')).toMatch(/inline-size:\s*var\(--contact-mark-pill-width\);/);
    expect(rule('.markOnly')).toMatch(/justify-content:\s*center;/);
    expect(rule('.markOnly')).not.toMatch(/padding/);
    expect(rule('.contact,\n.cv')).toMatch(/padding-inline:\s*var\(--space-medium\);/);
    expect(rule('.markOnly svg')).toMatch(/inline-size:\s*var\(--contact-mark-size\);/);
    expect(rule('.markOnly svg')).toMatch(/block-size:\s*var\(--contact-mark-size\);/);
    expect(rule('.contact,\n.cv')).toMatch(/padding-block:\s*var\(--space-small\);/);
  });

  // DDR-044: Gmail's M is drawn in its own four colours, which are the mark, and nothing on the pill
  // sets them; the other two marks have one colour each, which their pill decides.
  it('draws Gmail’s M in its own colours, and the other marks in their pill’s ink, per DDR-044', () => {
    const gmail = links.find(({ href }) => href.startsWith('mailto:'))!.markup;

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

  it('hides the CV control on paper, where a download is dead and the paper is the CV', () => {
    expect(rule('.cvItem', paper)).toMatch(/display:\s*none;/);
  });

  // The pill prints its label and nothing after it, per DDR-029. The base styles would otherwise
  // print `(mailto:…)` after "Email me", which is the prefix DDR-006 removed; the address itself is
  // on the sheet once, from the footer.
  it('prints the label with no address after it, per DDR-029', () => {
    expect(rule('.contact::after', paper)).toMatch(/content:\s*none;/);
    expect(rule('.contact', paper)).toMatch(/border:\s*none;/);
  });
});
