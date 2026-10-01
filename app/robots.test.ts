import { describe, expect, it } from 'vitest';
import robots, { dynamic } from './robots';

describe('robots.txt', () => {
  // ADR-024: nothing on the site is hidden from search engines, and they are told where the
  // sitemap is, at the site's own address.
  it('lets every crawler read the whole site and names the sitemap', () => {
    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/' },
      sitemap: 'https://andreuortegablasi.com/sitemap.xml',
    });
  });

  // ADR-001: a static export builds the file only when the route is declared static.
  it('is built to a static file', () => {
    expect(dynamic).toBe('force-static');
  });
});
