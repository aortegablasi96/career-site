import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { projects } from '@/content/projects';
import { experience } from '@/content/experience';
import { sections } from './sections';

type Redirect = { source: string; destination: string; permanent: boolean };

const { redirects } = JSON.parse(
  readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'),
) as { redirects: Redirect[] };

/** Where Vercel sends `path`, reading `:name` in a source as one path segment, or undefined. */
function follow(path: string): string | undefined {
  for (const { source, destination } of redirects) {
    const names: string[] = [];
    const pattern = source.replace(/:(\w+)/g, (_, name: string) => {
      names.push(name);
      return '([^/]+)';
    });
    const match = path.match(new RegExp(`^${pattern}$`));

    if (match) {
      return names.reduce((to, name, i) => to.replace(`:${name}`, match[i + 1]!), destination);
    }
  }

  return undefined;
}

// #284 and ADR-027: the addresses ADR-012 let break lead to their new places, permanently.
describe('the portfolio’s old addresses', () => {
  it('lead each project’s old view address to its view', () => {
    for (const { slug } of projects.projects) {
      expect(follow(`/projects/${slug}`)).toBe(`/portfolio/${slug}`);
    }
  });

  it('lead the old projects address to the page at its portfolio', () => {
    expect(follow('/projects')).toBe('/#portfolio');
    expect(sections.map(({ id }) => id)).toContain('portfolio');
  });

  it('are permanent, so search engines carry the old address over', () => {
    expect(redirects.every(({ permanent }) => permanent)).toBe(true);
  });

  it('leave every current address alone', () => {
    const current = [
      '/',
      ...projects.projects.map(({ slug }) => `/portfolio/${slug}`),
      ...experience.roles.map(({ slug }) => `/experience/${slug}`),
    ];

    for (const path of current) expect(follow(path)).toBeUndefined();
  });
});
