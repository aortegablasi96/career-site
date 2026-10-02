import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Hint } from './hint';

const html = renderToStaticMarkup(<Hint text="Open a card" />);

/** The stylesheet without its comments, so a rule is not matched against its explanation. */
const styles = readFileSync(new URL('./hint.module.css', import.meta.url), 'utf8')
  .replace(/\r\n/g, '\n')
  .replace(/\/\*[\s\S]*?\*\//g, '');

/** The body of the first rule with this selector, which is the screen's. */
function rule(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return styles.match(new RegExp(`(?:^|[{}])\\s*${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
}

describe('Hint', () => {
  // DDR-067: an information mark, which says nothing the words do not, so a reader hears the words.
  it('is its words after a hidden information mark', () => {
    expect(html).toMatch(/^<p class="[^"]*"><svg [^>]*aria-hidden="true"[^>]*>.*<\/svg>Open a card<\/p>$/);
    expect(html).toContain('<circle cx="12" cy="12" r="10.5"></circle><path d="M12 11v5.5"></path>');
  });

  it('takes no tab stop', () => {
    expect(html).not.toMatch(/<a |<button|tabindex/);
  });
});

describe('hint styles', () => {
  // DDR-067: the row it describes stands 8px below it, where DDR-059 set the design's 24px.
  it('stands what follows it on the scale’s small step below', () => {
    expect(rule('.hint + *')).toMatch(/margin-block-start:\s*var\(--space-small\);/);
  });

  // DDR-059: paper has nothing to click, so the hint is the screen's alone, and what follows it
  // takes back the place it had below the heading.
  it('hides the hint on paper, and the space below it', () => {
    expect(styles).toMatch(/@media print\s*\{[\s\S]*\.hint\s*\{\s*display:\s*none;\s*\}/);
    expect(styles).toMatch(/@media print\s*\{[\s\S]*\.hint \+ \*\s*\{\s*margin-block-start:\s*0;\s*\}/);
  });
});
