import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HomePage from '@/app/page';
import { credentials } from '@/content/credentials';
import { experience } from '@/content/experience';
import { introduction } from '@/content/introduction';
import { projects } from '@/content/projects';
import { skills } from '@/content/skills';

describe('HomePage', () => {
  const html = renderToStaticMarkup(<HomePage />);

  it('opens with the introduction, inside the page’s main landmark', () => {
    // React emits a preload link for the photo ahead of the markup, so main is not at index 0. The
    // greeting stands before the name, per DDR-056.
    expect(html).toMatch(
      /<main><header class="[^"]*"><span[^>]*><img [^>]*><\/span><div[^>]*><hgroup[^>]*><p class="[^"]*">Hi there, I’m<\/p><h1>Andreu Ortega Blasi<\/h1>/,
    );
  });

  it('has exactly one page title', () => {
    expect(html.match(/<h1/g)).toHaveLength(1);
  });

  it('no longer shows the placeholder', () => {
    expect(html).not.toContain('This site is being built');
  });

  // DDR-031: the contents are a bar pinned to the top of the window, so they come first, before
  // main, rather than between the introduction and the first section.
  it('opens with the contents bar, ahead of the main landmark', () => {
    expect(html).toMatch(/<nav [^>]*>.*<a href="#experience"[^>]*>Experience<\/a>.*<\/nav><main>/);
  });

  // DDR-031: each link shows the design's word, stated beside its section's heading in content/.
  // DDR-045: Home comes first, before every section's link.
  it('labels each contents link with its section’s own link word, after Home', () => {
    const nav = html.match(/<nav [\s\S]*?<\/nav>/)?.[0] ?? '';
    const words = [...nav.matchAll(/<a [^>]*>([^<]+)<\/a>/g)].map(([, word]) => word);

    expect(words).toEqual(['Home', 'Experience', 'Projects', 'Skills', 'Education', 'Languages']);
    expect(html).toMatch(/<h2 id="education-title"[^>]*>Education and certifications<\/h2>/);
  });

  it('lists every section in the contents after Home, in the order the Content Brief sets', () => {
    const listed = [...html.matchAll(/<a href="#([^"]+)"/g)].map(([, id]) => id);
    const shown = [...html.matchAll(/<section id="([^"]+)"/g)].map(([, id]) => id);

    expect(shown).toEqual(['experience', 'projects', 'skills', 'education', 'languages']);
    expect(listed).toEqual(['top', ...shown]);
  });

  // DDR-045: HTML sends `#top` to the top of the document only while no element has that id. One
  // that did would take the Home link to it instead.
  it('gives no element the id the Home link relies on, per DDR-045', () => {
    expect(html).not.toMatch(/\sid="top"/i);
  });

  // DDR-028: the footer follows main rather than sitting inside it, so it is the page's
  // contentinfo landmark, and it shows the introduction's own contact records rather than records
  // of its own.
  it('closes with the footer, outside the main landmark', () => {
    expect(html).toMatch(/<\/main><footer /);
  });

  it('shows the owner’s name and every contact address in the footer', () => {
    const footer = html.match(/<footer [\s\S]*<\/footer>/)?.[0] ?? '';
    const links = [...footer.matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map(([, href, text]) => ({
      href,
      text,
    }));

    expect(footer).toContain(introduction.name);
    expect(links).toEqual(introduction.contact.map(({ text, href }) => ({ href, text })));
  });

  // DDR-029 labels the contact pills, so the footer is the only place on the page — and therefore
  // on the printed CV — that an address is written out. This is the end of that: each address is
  // shown once, as text a visitor can read and copy without following the link.
  it('shows each contact address exactly once, in the footer alone, per DDR-029', () => {
    // Addresses, not the hrefs that carry them: an href is a target rather than something shown.
    const shown = html.replace(/<a href="[^"]*"/g, '<a');

    for (const { text } of introduction.contact) {
      expect(shown.split(text)).toHaveLength(2);
    }
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
      ...html.matchAll(/<section id="([^"]+)"[^>]*><div[^>]*><h2[^>]*>[^<]+<\/h2><(ol|div|dl)[\s>]/g),
    ].map(([, id, tag]) => [id, tag]);

    // Projects and skills open with a div because each item is a row of two rather than one: the
    // two columns DDR-010 and DDR-051 give them have to be one grid, and a grid needs one parent.
    // A timeline is one item since DDR-057, its whole list, because on screen it is one row.
    expect(openings).toEqual([
      ['experience', 'ol'],
      ['projects', 'div'],
      ['skills', 'div'],
      ['education', 'ol'],
      ['languages', 'dl'],
    ]);
  });

  it('shows every item once, in the order the content gives', () => {
    // A skill group's name carries a class, per DDR-017, and a project's name is its card's link,
    // per DDR-051, so the title is the heading's text whatever is inside it.
    const titles = [...html.matchAll(/<h3[^>]*>(.*?)<\/h3>/g)].map(([, title]) => title!.replace(/<[^>]+>/g, ''));

    expect(titles).toEqual([
      ...experience.roles.map(({ title }) => title),
      ...projects.projects.map(({ name }) => name),
      ...skills.groups.map(({ name }) => name),
      ...credentials.credentials.map(({ name }) => name),
    ]);
  });
});
