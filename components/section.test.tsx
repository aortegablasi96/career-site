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

  it('keeps the spacing a section has without the block, per DDR-003', () => {
    expect(css).toMatch(/\.opening > \* \+ \*\s*\{\s*margin-block-start:\s*var\(--space-flow\);\s*\}/);
    expect(css).toMatch(/\.opening \+ \*\s*\{\s*margin-block-start:\s*var\(--space-item\);\s*\}/);
  });
});

describe('Section in print', () => {
  // Firefox ignores break-after: avoid on a heading, so a heading could end a page (#23).
  it('keeps its heading and first item on one page, per DDR-008', () => {
    expect(print).toMatch(/\.opening\s*\{\s*break-inside:\s*avoid;\s*\}/);
  });
});
