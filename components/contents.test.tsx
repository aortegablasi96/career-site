import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Contents } from './contents';

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

  it('renders nothing when there are no sections to list', () => {
    expect(renderToStaticMarkup(<Contents label="Sections" sections={[]} />)).toBe('');
  });
});
