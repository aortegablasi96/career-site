import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LabelledList } from './labelled-list';

const html = renderToStaticMarkup(
  <LabelledList
    rows={[
      { label: 'Advanced', value: 'Power BI' },
      { label: 'Basic', value: 'Docker, Kubernetes' },
    ]}
  />,
);

/** The stylesheet without its comments, so a rule is not matched against its explanation. */
const css = readFileSync(new URL('./labelled-list.module.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const print = css.match(/@media print\s*\{([\s\S]*)\}\s*$/)?.[1] ?? '';

describe('LabelledList', () => {
  it('is a description list, with one group of a label and its value per row', () => {
    expect(html).toMatch(/^<dl[^>]*>(?:<div[^>]*><dt[^>]*>[^<]+<\/dt> <dd[^>]*>[^<]+<\/dd><\/div>)+<\/dl>$/);
  });

  it('reads each row as its label, a colon, and its value, in the order given, per DDR-006', () => {
    const rows = [...html.matchAll(/<dt[^>]*>([^<]+)<\/dt> <dd[^>]*>([^<]+)<\/dd>/g)].map(([, label, value]) => [label, value]);

    expect(rows).toEqual([
      ['Advanced:', 'Power BI'],
      ['Basic:', 'Docker, Kubernetes'],
    ]);
  });

  it('sets each label and its value on one line, without the browser’s indent, per DDR-006', () => {
    expect(css).toMatch(/\.label,\s*\.value\s*\{[^}]*display:\s*inline;/);
    expect(css).toMatch(/\.value\s*\{[^}]*margin-inline-start:\s*0;/);
  });

  it('sets the label in semibold, per DDR-006', () => {
    expect(css).toMatch(/\.label\s*\{[^}]*font-weight:\s*var\(--font-weight-semibold\);/);
  });

  it('sets its rows apart by the small step, within one item, per DDR-003', () => {
    expect(css).toMatch(/\.row \+ \.row\s*\{[^}]*margin-block-start:\s*var\(--space-small\);/);
  });

  it('caps a row at the measure, as the base styles cap running text', () => {
    expect(css).toMatch(/\.row\s*\{[^}]*max-inline-size:\s*var\(--measure\);/);
  });
});

describe('LabelledList in print', () => {
  it('is kept whole on one page, per DDR-006', () => {
    expect(print).toMatch(/\.list\s*\{[^}]*break-inside:\s*avoid;/);
  });
});
