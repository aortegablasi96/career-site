import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HomePage from '@/app/page';
import { credentials } from '@/content/credentials';
import { experience } from '@/content/experience';
import { projects } from '@/content/projects';
import { skills } from '@/content/skills';

describe('HomePage', () => {
  const html = renderToStaticMarkup(<HomePage />);

  it('opens with the introduction, inside the page’s main landmark', () => {
    // React emits a preload link for the photo ahead of the markup, so main is not at index 0.
    expect(html).toMatch(/<main><header class="[^"]*"><img [^>]*><div[^>]*><h1>Andreu Ortega Blasi<\/h1>/);
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

  it('lists every section in the contents, in the order the Content Brief sets', () => {
    const listed = [...html.matchAll(/<a href="#([^"]+)"/g)].map(([, id]) => id);
    const shown = [...html.matchAll(/<section id="([^"]+)"/g)].map(([, id]) => id);

    expect(shown).toEqual(['experience', 'projects', 'skills', 'education', 'languages']);
    expect(listed).toEqual(shown);
  });

  it('never skips a heading level', () => {
    const levels = [...html.matchAll(/<h(\d)/g)].map(([, level]) => Number(level));

    for (const [index, level] of levels.entries()) {
      expect(level).toBeLessThanOrEqual((levels[index - 1] ?? 0) + 1);
    }
  });

  // DDR-008: Firefox ignores break-after: avoid on a heading, so each section keeps its heading and
  // its first item in one block, which print keeps whole (#23).
  it('holds each section’s heading in one block with the section’s first item', () => {
    const openings = [
      ...html.matchAll(/<section id="([^"]+)"[^>]*><div[^>]*><h2[^>]*>[^<]+<\/h2><(article|section|dl)[\s>]/g),
    ].map(([, id, tag]) => [id, tag]);

    expect(openings).toEqual([
      ['experience', 'article'],
      ['projects', 'article'],
      ['skills', 'section'],
      ['education', 'article'],
      ['languages', 'dl'],
    ]);
  });

  it('shows every item once, in the order the content gives', () => {
    const titles = [...html.matchAll(/<h3>([^<]+)<\/h3>/g)].map(([, title]) => title);

    expect(titles).toEqual([
      ...experience.roles.map(({ title }) => title),
      ...projects.projects.map(({ name }) => name),
      ...skills.groups.map(({ name }) => name),
      ...credentials.credentials.map(({ name }) => name),
    ]);
  });
});
