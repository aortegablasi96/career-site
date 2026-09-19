import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Section } from './section';

const render = (items: string[]) =>
  renderToStaticMarkup(
    <Section id="experience" title="Experience" items={items.map((item) => <p key={item}>{item}</p>)} />,
  );

/** The stylesheet without its comments, so a rule is not matched against its explanation. */
const css = readFileSync(new URL('./section.module.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const print = css.match(/@media print\s*\{([\s\S]*)\}\s*$/)?.[1] ?? '';

describe('Section', () => {
  const html = render(['First', 'Second', 'Third']);

  it('carries the id the contents link to', () => {
    expect(html).toMatch(/^<section id="experience"/);
  });

  it('is named by its heading, so it is a landmark assistive technology can move to', () => {
    expect(html).toMatch(/aria-labelledby="experience-title"/);
    expect(html).toMatch(/<h2 id="experience-title" class="[^"]*">Experience<\/h2>/);
    // The rule beside it is drawn by the stylesheet, so nothing but the title is in the markup and
    // nothing but the title can reach the section's accessible name, per DDR-010.
    expect(html).not.toMatch(/aria-hidden|<span|<hr/);
  });

  it('holds its heading and first item in one block, and its other items after it, in order', () => {
    expect(html).toMatch(/<div[^>]*><h2 [^>]*>Experience<\/h2><p>First<\/p><\/div><p>Second<\/p><p>Third<\/p><\/section>$/);
  });

  it('holds a single item in the block with its heading', () => {
    expect(render(['Only'])).toMatch(/<\/h2><p>Only<\/p><\/div><\/section>$/);
  });

  // DDR-010: "A section's h2 carries a decorative rule running to the right margin." It is a
  // pseudo-element, so it is never in the accessibility tree, and it grows from a basis of zero, so
  // a heading that fills the column wraps as it would without a rule rather than overflowing.
  it('draws the rule beside the heading as a pseudo-element, per DDR-010', () => {
    expect(css).toMatch(/\.heading\s*\{[^}]*display:\s*flex;/);
    expect(css).toMatch(/\.heading\s*\{[^}]*gap:\s*var\(--space-medium\);/);
    expect(css).toMatch(/\.heading::after\s*\{[^}]*content:\s*'';/);
    expect(css).toMatch(/\.heading::after\s*\{[^}]*flex:\s*1;/);
  });

  // The rule carries no information, so it is a hairline rather than an ink, per DDR-025 — and
  // paper therefore drops it at the token layer, with no print rule of its own. It is the one
  // hairline of the three that is drawn nowhere else.
  it('draws the rule in the hairline the design gives it, so paper drops it without a rule here', () => {
    expect(css).toMatch(/\.heading::after\s*\{[^}]*border-block-start:[^;]*var\(--color-rule\);/);
    expect(print).not.toMatch(/\.heading/);
  });

  // DDR-026 supersedes DDR-010's rejection of the design's divider. It is a border on the section
  // it opens, so it is never in the accessibility tree and section.tsx renders nothing for it —
  // which the landmark test above already holds, by refusing an <hr>.
  // DDR-031 clears the contents bar with the root's scroll padding, which already includes the flow
  // step DDR-006 kept here. A scroll margin on the section as well would add the two together.
  it('leaves the space it lands below the contents bar to the root, per DDR-031', () => {
    expect(css).not.toMatch(/scroll-margin/);
  });

  it('draws the divider above the section as a border, per DDR-026', () => {
    expect(css).toMatch(/\.section\s*\{[^}]*border-block-start:[^;]*var\(--color-border\);/);
  });

  // The base styles set --space-section between two sections, which is twice --space-boundary, the
  // design's 56px, per DDR-039. A boundary above the line and one below leaves that distance and
  // puts the line in the middle of it, where the design draws it. A section that took the whole
  // space and then padded itself would open a boundary half as wide again.
  //
  // Since DDR-046 both halves are inside a section, so that its band runs from its own divider to
  // the next: the half below its divider at its top, and the half above the next at its foot, where
  // it was the next section's margin. Only the first keeps its margin, below the introduction.
  it('splits the section boundary around the divider rather than adding to it, per DDR-026', () => {
    expect(css).toMatch(/\.section\s*\{[^}]*margin-block-start:\s*var\(--space-boundary\);/);
    expect(css).toMatch(/\.section\s*\{[^}]*padding-block:\s*var\(--space-boundary\);/);
    expect(css).toMatch(/\.section \+ \.section\s*\{\s*margin-block-start:\s*0;\s*\}/);
  });

  // DDR-040's 72px between the last section and the footer's hairline, inside the last section, so
  // its band meets that line as every other band meets a divider.
  it('pads the last section down to the footer’s hairline, per DDR-046', () => {
    expect(css).toMatch(/\.section:last-child\s*\{\s*padding-block-end:\s*var\(--page-padding-block-end\);\s*\}/);
  });

  // DDR-046: the sections alternate, starting with the lighter band after the introduction.
  // Counted among the sections alone, so the introduction, a header, never shifts the count.
  it('draws the band on every second section, starting with the first, per DDR-046', () => {
    expect(css).toMatch(/\.section:nth-of-type\(odd\)\s*\{\s*background-color:\s*var\(--color-surface-band\);\s*\}/);
    expect(css).not.toMatch(/nth-of-type\(even\)|nth-child/);
  });

  // The divider and the band are a hairline and a surface, so paper drops both at the token layer
  // with no print rule here, as the heading's rule is dropped. Paper puts the space back where it
  // was before DDR-046, as the next section's margin, since a margin is truncated at a page break
  // where a padding is not — and the sheets are pixel-identical to the tree before.
  it('leaves the divider and the band to the token layer on paper, and keeps its breaks, per DDR-015', () => {
    expect(print).not.toMatch(/border|background/);
    expect(print).toMatch(/\.section,\s*\.section:last-child\s*\{\s*padding-block-end:\s*0;\s*\}/);
    expect(print).toMatch(/\.section \+ \.section\s*\{\s*margin-block-start:\s*var\(--space-boundary\);\s*\}/);
  });

  it('sets the first item the heading step below the heading, and the next at the item step, per DDR-039', () => {
    expect(css).toMatch(/\.opening > \* \+ \*\s*\{\s*margin-block-start:\s*var\(--space-heading\);\s*\}/);
    expect(css).toMatch(/\.opening \+ \*\s*\{\s*margin-block-start:\s*var\(--space-item\);\s*\}/);
  });
});

describe('Section in print', () => {
  // Firefox ignores break-after: avoid on a heading, so a heading could end a page (#23).
  it('keeps its heading and first item on one page, per DDR-008', () => {
    expect(print).toMatch(/\.opening\s*\{\s*break-inside:\s*avoid;\s*\}/);
  });
});
