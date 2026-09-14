import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Entry } from './entry';

describe('Entry', () => {
  const html = renderToStaticMarkup(
    <Entry title="Software Engineer" metadata={['ToBeIT', 'Barcelona, Spain']}>
      <p>Body</p>
    </Entry>,
  );

  it('is an article, which the print styles keep whole on one page', () => {
    expect(html).toMatch(/^<article[ >]/);
    expect(html).toMatch(/<\/article>$/);
  });

  it('is titled by an h3, the level below the section’s heading', () => {
    expect(html).toContain('<h3>Software Engineer</h3>');
  });

  it('follows its title with the metadata line, then its body, per DDR-006', () => {
    expect(html).toMatch(
      /<\/h3><p[^>]*>ToBeIT <span aria-hidden="true">·<\/span> Barcelona, Spain<\/p><p>Body<\/p><\/article>$/,
    );
  });
});
