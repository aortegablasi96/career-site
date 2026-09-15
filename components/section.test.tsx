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
    expect(html).toContain('<h2 id="experience-title">Experience</h2>');
  });

  it('holds its heading and first item in one block, and its other items after it, in order', () => {
    expect(html).toMatch(/<div[^>]*><h2 [^>]*>Experience<\/h2><p>First<\/p><\/div><p>Second<\/p><p>Third<\/p><\/section>$/);
  });

  it('holds a single item in the block with its heading', () => {
    expect(render(['Only'])).toMatch(/<\/h2><p>Only<\/p><\/div><\/section>$/);
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
