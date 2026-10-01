import type { MetadataRoute } from 'next';
import { experience } from '@/content/experience';
import { projects } from '@/content/projects';
import { site } from '@/content/site';

// A static export builds a metadata route only when it is declared static, per ADR-001.
export const dynamic = 'force-static';

/**
 * `/sitemap.xml`, per ADR-024: the page and every view the build makes, at the site's own address,
 * so a search engine finds the views without following a link. It gives no dates: the build has no
 * honest one for when a page last changed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    '',
    ...projects.projects.map(({ slug }) => `/portfolio/${slug}`),
    ...experience.roles.map(({ slug }) => `/experience/${slug}`),
  ].map((path) => ({ url: `${site.url}${path}` }));
}
