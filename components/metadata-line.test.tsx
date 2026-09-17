import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MetadataLine } from './metadata-line';

const styles = readFileSync(new URL('./metadata-line.module.css', import.meta.url), 'utf8');

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

  it('takes markup as a part, such as a date with its machine-readable value', () => {
    const html = renderToStaticMarkup(
      <MetadataLine
        parts={[
          'ABB',
          <time key="date" dateTime="2024-10">
            Oct 2024
          </time>,
        ]}
      />,
    );

    expect(html).toMatch(/ABB <span aria-hidden="true">·<\/span> <time datetime="2024-10">Oct 2024<\/time>/i);
  });

  // DDR-025 splits DDR-012's one secondary ink into three. This module carries the middle one,
  // which is what the design gives a company and an institution; the two users that are fainter
  // still — the introduction's location and the timeline's place — override it in their own
  // modules, and their tests hold them to it. It is 4.44:1 and fails WCAG 1.4.3, so the size and
  // the position are doing the work the colour cannot.
  it('sets metadata in the muted ink, per DDR-025', () => {
    expect(styles).toMatch(/\.metadata\s*\{[^}]*color:\s*var\(--color-text-muted\);/);
  });

  it('shows a single part with no separator', () => {
    const html = renderToStaticMarkup(<MetadataLine parts={['Jun 2024']} />);

    expect(html).not.toContain('·');
    expect(html).toContain('Jun 2024');
  });
});
