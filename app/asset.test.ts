import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it } from 'vitest';
import { asset } from './asset';

// ADR-004 routes every reference to a binary asset through asset(), so that it resolves under the
// path GitHub Pages serves the site from. These tests cover the two builds that exist: the local
// one, where PAGES_BASE_PATH is unset, and the deployed one, where ADR-003's workflow sets it.
const variable = 'PAGES_BASE_PATH';
const original = process.env[variable];

afterEach(() => {
  if (original === undefined) {
    delete process.env[variable];
  } else {
    process.env[variable] = original;
  }
});

describe('asset', () => {
  it('returns the path unchanged when no base path is set, as locally', () => {
    delete process.env[variable];

    expect(asset('/andreu-ortega-blasi-cv.pdf')).toBe('/andreu-ortega-blasi-cv.pdf');
  });

  it('prefixes the base path the site is deployed under', () => {
    process.env[variable] = '/career-site';

    expect(asset('/andreu-ortega-blasi-cv.pdf')).toBe('/career-site/andreu-ortega-blasi-cv.pdf');
  });

  it('reads the variable at each call, so it is the one the build was given', () => {
    process.env[variable] = '/first';
    const first = asset('/file.webp');
    process.env[variable] = '/second';

    expect([first, asset('/file.webp')]).toEqual(['/first/file.webp', '/second/file.webp']);
  });

  it('joins without adding or dropping a separator, so the address is the file', () => {
    process.env[variable] = '/career-site';

    expect(asset('/media/numisbook.webp')).toBe('/career-site/media/numisbook.webp');
  });

  // The helper and next.config.ts have to agree on which variable they read. They are set in one
  // place, by ADR-003's workflow, and a rename that reached one and not the other would take the
  // whole site's assets down while every test still passed.
  it('reads the same variable that next.config.ts gives to basePath', () => {
    const config = readFileSync(new URL('../next.config.ts', import.meta.url), 'utf8');
    const helper = readFileSync(new URL('./asset.ts', import.meta.url), 'utf8');

    expect(config).toContain(`basePath: process.env.${variable}`);
    expect(helper).toContain(`process.env.${variable}`);
  });
});
