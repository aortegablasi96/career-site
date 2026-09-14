import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HomePage from '@/app/page';

describe('HomePage', () => {
  const html = renderToStaticMarkup(<HomePage />);

  it('opens with the introduction, inside the page’s main landmark', () => {
    expect(html).toMatch(/^<main><header><h1>Andreu Ortega Blasi<\/h1>/);
  });

  it('has exactly one page title', () => {
    expect(html.match(/<h1/g)).toHaveLength(1);
  });

  it('no longer shows the placeholder', () => {
    expect(html).not.toContain('This site is being built');
  });

  it('lists the experience section in the contents, and follows them with it', () => {
    expect(html).toMatch(/<nav [^>]*>.*<a href="#experience"[^>]*>Experience<\/a>.*<\/nav><section id="experience"/);
  });

  it('never skips a heading level', () => {
    const levels = [...html.matchAll(/<h(\d)/g)].map(([, level]) => Number(level));

    for (const [index, level] of levels.entries()) {
      expect(level).toBeLessThanOrEqual((levels[index - 1] ?? 0) + 1);
    }
  });
});
