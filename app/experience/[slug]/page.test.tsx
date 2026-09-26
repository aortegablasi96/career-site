import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { experience } from '@/content/experience';
import { introduction } from '@/content/introduction';
import RolePage, { dynamicParams, generateMetadata, generateStaticParams } from './page';

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

async function render(slug: string): Promise<string> {
  return renderToStaticMarkup(await RolePage(params(slug)));
}

const { roles, view } = experience;

describe('a role’s view', () => {
  // ADR-011: one file per role at build time, and no address a static host could not serve.
  it('is built for every role, at the address its slug names, and for nothing else', () => {
    expect(generateStaticParams()).toEqual(roles.map(({ slug }) => ({ slug })));
    expect(dynamicParams).toBe(false);
  });

  // DDR-060: the tab and the preview give the job title in full, as the view's heading does.
  it.each(roles.map(({ slug, title, fullTitle = title, company }) => [slug, fullTitle, company]))(
    'names %s’s role, in full, and company in the browser tab and the link preview',
    async (slug, title, company) => {
      const metadata = await generateMetadata(params(slug));
      const expected = view.title(title, company);

      expect(metadata.title).toBe(expected);
      expect(metadata.openGraph?.title).toBe(expected);
      expect(expected).toContain(title);
      expect(expected).toContain(company);
      expect(metadata.description).toBe(roles.find((role) => role.slug === slug)!.points[0]);
    },
  );

  it.each(roles.map(({ slug }) => slug))('%s has one h1, the job title in full', async (slug) => {
    const html = await render(slug);
    const { title, fullTitle = title } = roles.find((role) => role.slug === slug)!;

    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toMatch(new RegExp(`<h1[^>]*>${fullTitle.replace(/&/g, '&amp;')}</h1>`));
  });

  // DDR-059, as DDR-050 has it for a project: the site's own contents bar, every link leading back
  // to the page, and nothing marked.
  it('opens with the site’s contents bar, whose links lead back to the page', async () => {
    const html = await render('abb');
    const nav = html.match(/<nav [\s\S]*?<\/nav>/)?.[0] ?? '';

    expect(html.indexOf('<nav')).toBeLessThan(html.indexOf('<main>'));
    expect(nav).toContain('href="/#experience"');
    expect(nav).not.toContain('aria-current');
  });

  it('leads back to the experience section of the page', async () => {
    expect(await render('abb')).toMatch(/<a [^>]*href="\/#experience"[^>]*>.*Back to experience<\/a>/);
  });

  // DDR-059: the roles on either side of this one, in the timeline's order — the older before, the
  // newer after — and no link where there is no role to lead to.
  it.each(roles.map(({ slug }, index) => [slug, index]))(
    '%s leads to the roles on either side of it in the timeline',
    async (slug, index) => {
      const html = await render(slug as string);
      const at = index as number;
      const neighbour = (direction: string, at: number) =>
        roles[at] && {
          href: `/experience/${roles[at]!.slug}`,
          label: view.neighbour(direction, roles[at]!.company, roles[at]!.title),
        };
      const expected = [neighbour(view.previous, at - 1), neighbour(view.next, at + 1)].filter(Boolean);

      const links = [...html.matchAll(/<a ([^>]*href="\/experience\/[^>]*)>/g)].map(([, attributes]) => ({
        href: attributes.match(/href="([^"]+)"/)?.[1],
        label: attributes.match(/aria-label="([^"]+)"/)?.[1],
      }));

      expect(links).toEqual(expected);
    },
  );

  it('shows ABB’s previous role as Ponera Group and no next role, since ABB is current', async () => {
    const html = await render('abb');

    expect(html).toContain('aria-label="Previous role: Ponera Group, Product Manager"');
    expect(html).not.toContain('Next role');
  });

  it('closes with the site’s footer, outside the main landmark', async () => {
    const html = await render('abb');

    expect(html).toMatch(/<\/main><footer/);

    for (const { text } of introduction.contact) {
      expect(html).toContain(text);
    }
  });
});
