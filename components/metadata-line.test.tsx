import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MetadataLine } from './metadata-line';

describe('MetadataLine', () => {
  it('separates its parts with a middle dot that assistive technology does not announce', () => {
    const html = renderToStaticMarkup(<MetadataLine parts={['ABB', 'Quartino, Switzerland']} />);

    expect(html).toMatch(/ABB <span aria-hidden="true">·<\/span> Quartino, Switzerland/);
  });

  it('keeps a space either side of the separator, so the parts are not read as one word', () => {
    const html = renderToStaticMarkup(<MetadataLine parts={['A', 'B', 'C']} />);
    const read = html.replace(/<span aria-hidden="true">·<\/span>/g, '').replace(/<[^>]+>/g, '');

    expect(read).toBe('A  B  C');
  });

  it('shows a single part with no separator', () => {
    const html = renderToStaticMarkup(<MetadataLine parts={['Jun 2024']} />);

    expect(html).not.toContain('·');
    expect(html).toContain('Jun 2024');
  });
});
