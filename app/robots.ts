import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

// A static export builds a metadata route only when it is declared static, per ADR-001.
export const dynamic = 'force-static';

/**
 * `/robots.txt`, per ADR-024: every crawler may read the whole site, and is told where the sitemap
 * is. It is built to a static file, per ADR-001.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
