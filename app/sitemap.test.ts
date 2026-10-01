import { describe, expect, it } from 'vitest';
import { experience } from '@/content/experience';
import { projects } from '@/content/projects';
import sitemap, { dynamic } from './sitemap';

describe('sitemap.xml', () => {
  const urls = sitemap().map(({ url }) => url);

  // ADR-024: the page and every view the build makes, each once, at the site's own address.
  it('lists the page and every project and role view, under the site’s domain', () => {
    expect(urls).toEqual([
      'https://andreuortegablasi.com',
      ...projects.projects.map(({ slug }) => `https://andreuortegablasi.com/portfolio/${slug}`),
      ...experience.roles.map(({ slug }) => `https://andreuortegablasi.com/experience/${slug}`),
    ]);
    expect(new Set(urls).size).toBe(urls.length);
  });

  // The build has no honest date for when a page last changed, so the sitemap gives none.
  it('gives no modification date', () => {
    expect(sitemap().every((entry) => entry.lastModified === undefined)).toBe(true);
  });

  // ADR-001: a static export builds the file only when the route is declared static.
  it('is built to a static file', () => {
    expect(dynamic).toBe('force-static');
  });
});
