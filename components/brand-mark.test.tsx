import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BrandMark } from './brand-mark';

const styles = readFileSync(new URL('./brand-mark.module.css', import.meta.url), 'utf8').replace(
  /\/\*[\s\S]*?\*\//g,
  '',
);

/** The declarations of the rule whose selector is exactly `selector`. */
function rule(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return styles.match(new RegExp(`(?:^|\\n)${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
}

describe('BrandMark', () => {
  // DDR-105: the mark is the design's, on its own 59 by 40 grid, and decoration to assistive
  // technology, since the link that holds it carries the name.
  it('draws the design’s mark on its 59 by 40 grid, hidden from assistive technology', () => {
    const html = renderToStaticMarkup(<BrandMark className="bar" />);

    expect(html).toMatch(/^<svg class="[^"]+ bar" viewBox="0 0 59 40" aria-hidden="true" focusable="false">/);
    expect(html).not.toMatch(/<title|role=/);
    expect(html.match(/<path /g)).toHaveLength(3);
    expect(html).toContain('fill="url(#brand-mark-ring)"');
  });

  // DDR-105: its inks are tokens, never literal colours, so the mark cannot drift from its record.
  it('takes its inks from the mark’s tokens, per DDR-105', () => {
    const html = renderToStaticMarkup(<BrandMark />);

    expect(html).not.toMatch(/#[0-9a-f]{3,6}"/i);
    expect(rule('.ink')).toMatch(/fill:\s*var\(--color-brand-mark-ink\);/);
    expect(rule('.bar')).toMatch(/stroke:\s*var\(--color-brand-mark-ink\);/);
    expect(rule('.start')).toMatch(/stop-color:\s*var\(--color-brand-mark-start\);/);
    expect(rule('.end')).toMatch(/stop-color:\s*var\(--color-brand-mark-end\);/);
  });
});
