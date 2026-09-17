import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Contents } from './contents';

const styles = readFileSync(new URL('./contents.module.css', import.meta.url), 'utf8');

const sections = [
  { id: 'experience', title: 'Experience' },
  { id: 'projects', title: 'Projects' },
];

describe('Contents', () => {
  it('is navigation with an accessible name, so assistive technology can announce it', () => {
    const html = renderToStaticMarkup(<Contents label="Sections" sections={sections} />);

    expect(html).toMatch(/^<nav aria-label="Sections"/);
  });

  it('links to each section by its own title, in order', () => {
    const html = renderToStaticMarkup(<Contents label="Sections" sections={sections} />);
    const links = [...html.matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map(([, href, text]) => ({
      href,
      text,
    }));

    expect(links).toEqual([
      { href: '#experience', text: 'Experience' },
      { href: '#projects', text: 'Projects' },
    ]);
  });

  // DDR-025: the design sets a contents link in #64748b where every other link on the page is in
  // the accent. It is 4.44:1 and fails WCAG 1.4.3. The underline the base styles give every link is
  // untouched, so colour is not what identifies it.
  it('sets a contents link in the muted ink and leaves its underline alone, per DDR-025', () => {
    expect(styles).toMatch(/\.link\s*\{[^}]*color:\s*var\(--color-text-muted\);/);
    expect(styles).not.toMatch(/text-decoration/);
  });

  it('renders nothing when there are no sections to list', () => {
    expect(renderToStaticMarkup(<Contents label="Sections" sections={[]} />)).toBe('');
  });
});
