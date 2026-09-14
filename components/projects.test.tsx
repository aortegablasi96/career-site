import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { projects } from '@/content/projects';
import { Projects } from './projects';

// Rendered with the real content, since what the projects say and link to is what #30 asks for.
const html = renderToStaticMarkup(<Projects projects={projects.projects} />);

/** The markup's text, as a reader meets it. */
const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

/** Each project's entry, in the order the page shows them. */
const entries = html.match(/<article[^>]*>.*?<\/article>/g) ?? [];

/** An entry's links, as the reader meets them. */
const linksOf = (entry: string) =>
  [...entry.matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map(([, href, text]) => ({ href, text }));

/** The stylesheet without its comments, so a rule is not matched against its explanation. */
const css = readFileSync(new URL('./projects.module.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const print = css.match(/@media print\s*\{([\s\S]*)\}\s*$/)?.[1] ?? '';

describe('Projects', () => {
  it('renders each project as an entry, in the order the content gives', () => {
    const titles = entries.map((entry) => entry.match(/<h3>([^<]+)<\/h3>/)?.[1]);

    expect(titles).toEqual(projects.projects.map(({ name }) => name));
  });

  it('gives each project’s technologies in its metadata line, per DDR-006', () => {
    for (const { technologies } of projects.projects) {
      expect(text).toContain(technologies.join(' · '));
    }
  });

  it('follows the metadata with the description, then the links as a list, per DDR-006', () => {
    for (const entry of entries) {
      expect(entry).toMatch(/<\/p><p>[^<]+<\/p><ul[^>]*>(?:<li><a [^>]+>[^<]+<\/a><\/li>)+<\/ul><\/article>$/);
    }
  });

  it('links every project to its public repository on the owner’s GitHub account, first', () => {
    for (const entry of entries) {
      expect(linksOf(entry)[0]).toEqual({
        href: expect.stringMatching(/^https:\/\/github\.com\/aortegablasi96\/[\w.-]+$/),
        text: 'Source code',
      });
    }
  });

  it('links NumisBook and the chatbot to the live versions recorded on their repositories', () => {
    const [numisbook, chatbot, viewer] = entries;

    expect(linksOf(numisbook!)).toContainEqual({ href: 'https://numisbook.vercel.app', text: 'Live site' });
    expect(linksOf(chatbot!)).toContainEqual({ href: 'https://career-conversation-chatbot.vercel.app', text: 'Live site' });
    expect(linksOf(viewer!).map(({ text }) => text)).not.toContain('Live site');
  });

  it('links this site’s entry to this repository, and to nothing else', () => {
    expect(linksOf(entries.at(-1)!)).toEqual([
      { href: 'https://github.com/aortegablasi96/career-site', text: 'Source code' },
    ]);
  });

  it('opens every link in the same tab, per DDR-006', () => {
    expect(html).not.toMatch(/target=/);
  });

  it('gives every link a target of at least the minimum size on screen, per DDR-004', () => {
    expect(css).toMatch(/\.link\s*\{[^}]*min-block-size:\s*var\(--target-size-min\);[^}]*min-inline-size:\s*var\(--target-size-min\);/);
  });
});

describe('Projects in print', () => {
  it('lets every link print its address, since each one leaves the page, per DDR-005', () => {
    for (const { href } of entries.flatMap(linksOf)) {
      expect(href).toMatch(/^https:\/\//);
    }
    expect(css).not.toMatch(/::after|content:/);
  });

  it('drops the minimum target size, which nothing on paper needs, per DDR-006', () => {
    expect(print).toMatch(/\.link\s*\{[^}]*min-block-size:\s*0;[^}]*min-inline-size:\s*0;/);
  });
});

describe('projects content', () => {
  it('lists the three portfolio projects, then this site, as #26 decided', () => {
    expect(projects.projects.map(({ name }) => name)).toEqual([
      'NumisBook',
      'Career Conversation Chatbot',
      'Stock Portfolio Viewer',
      'This site',
    ]);
  });

  it('names at least one technology for each project', () => {
    for (const { technologies } of projects.projects) {
      expect(technologies.length).toBeGreaterThan(0);
    }
  });

  it('writes descriptions without pronouns, and without self-assessed traits', () => {
    for (const { description } of projects.projects) {
      expect(description).not.toMatch(/\b(?:I|me|my|we|our)\b/i);
      expect(description).not.toMatch(/strong|proven|leadership|servant|passionate|results-driven/i);
    }
  });
});
