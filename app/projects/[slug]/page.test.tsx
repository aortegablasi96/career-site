import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { introduction } from '@/content/introduction';
import { projects } from '@/content/projects';
import ProjectPage, { dynamicParams, generateMetadata, generateStaticParams } from './page';

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

async function render(slug: string): Promise<string> {
  return renderToStaticMarkup(await ProjectPage(params(slug)));
}

describe('a project’s view', () => {
  // ADR-010: one file per project at build time, and no address a static host could not serve.
  it('is built for every project, at the address its slug names, and for nothing else', () => {
    expect(generateStaticParams()).toEqual(projects.projects.map(({ slug }) => ({ slug })));
    expect(dynamicParams).toBe(false);
  });

  it('gives every project an address of its own', () => {
    const slugs = projects.projects.map(({ slug }) => slug);

    expect(new Set(slugs).size).toBe(slugs.length);

    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z\d]+(?:-[a-z\d]+)*$/);
    }
  });

  it.each(projects.projects.map(({ slug, name }) => [slug, name]))(
    'names %s in the browser tab and the link preview',
    async (slug, name) => {
      const metadata = await generateMetadata(params(slug));
      const title = projects.view.title(name);

      expect(metadata.title).toBe(title);
      expect(metadata.openGraph?.title).toBe(title);
      expect(title).toContain(name);
    },
  );

  it.each(projects.projects.map(({ slug }) => slug))('%s has one h1, the project’s name', async (slug) => {
    const html = await render(slug);
    const { name } = projects.projects.find((project) => project.slug === slug)!;

    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toMatch(new RegExp(`<h1[^>]*>${name}</h1>`));
  });

  // DDR-050: the site's own contents bar, every link leading back to the page, and nothing marked.
  it('opens with the site’s contents bar, whose links lead back to the page', async () => {
    const html = await render('numisbook');
    const nav = html.match(/<nav [\s\S]*?<\/nav>/)?.[0] ?? '';
    const links = [...nav.matchAll(/<a [^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map(
      ([, href, word]) => ({ href, word }),
    );

    expect(html.indexOf('<nav')).toBeLessThan(html.indexOf('<main>'));
    expect(nav).toContain('Andreu’s site');
    expect(links).toEqual([
      { href: '/', word: 'Home' },
      { href: '/#experience', word: 'Experience' },
      { href: '/#projects', word: 'Projects' },
      { href: '/#skills', word: 'Skills' },
      { href: '/#education', word: 'Education' },
      { href: '/#languages', word: 'Languages' },
    ]);
    expect(nav).not.toContain('aria-current');
  });

  it('leads back to the projects section of the page', async () => {
    expect(await render('numisbook')).toMatch(/<a [^>]*href="\/#projects"[^>]*>.*Back to portfolio<\/a>/);
  });

  // DDR-052: the projects on either side of this one, in the order the page shows them, and no
  // link where there is no project to lead to.
  it.each(projects.projects.map(({ slug }, index) => [slug, index]))(
    '%s leads to the projects the page shows on either side of it',
    async (slug, index) => {
      const html = await render(slug as string);
      const at = index as number;
      const expected = [
        projects.projects[at - 1] && {
          href: `/projects/${projects.projects[at - 1]!.slug}`,
          label: projects.view.neighbour(projects.view.previous, projects.projects[at - 1]!.name),
        },
        projects.projects[at + 1] && {
          href: `/projects/${projects.projects[at + 1]!.slug}`,
          label: projects.view.neighbour(projects.view.next, projects.projects[at + 1]!.name),
        },
      ].filter(Boolean);

      const links = [...html.matchAll(/<a ([^>]*href="\/projects\/[^>]*)>/g)].map(
        ([, attributes]) => ({
          href: attributes.match(/href="([^"]+)"/)?.[1],
          label: attributes.match(/aria-label="([^"]+)"/)?.[1],
        }),
      );

      expect(links).toEqual(expected);
    },
  );

  it('closes with the site’s footer, outside the main landmark', async () => {
    const html = await render('numisbook');

    expect(html).toMatch(/<\/main><footer/);

    for (const { text } of introduction.contact) {
      expect(html).toContain(text);
    }
  });
});
