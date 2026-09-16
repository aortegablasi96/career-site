import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { cv } from './cv';

// ADR-002 ruled out a second copy of the owner's facts, because two hand-maintained documents drift
// apart and nobody finds out. Epic #42 adopted the download anyway. This test is what ADR-004 and
// ADR-005 answer that with: the CV is pinned to the content it was written from, so the facts cannot
// move without somebody being told. ADR-003 will not deploy a failing build.
const directory = new URL('./', import.meta.url);

/**
 * The content modules that hold the site's prose.
 *
 * `types.ts` holds shapes rather than prose, and `cv.ts` holds the digest and so cannot be part of
 * what it fingerprints. Neither states a fact the CV repeats, so neither belongs in the digest.
 */
const proseModules = readdirSync(directory)
  .filter((name) => name.endsWith('.ts') && !name.endsWith('.test.ts'))
  .filter((name) => name !== 'types.ts' && name !== 'cv.ts')
  .sort();

/**
 * A fingerprint of those modules, over their names as well as their contents, so that renaming one
 * or removing one counts as a change too.
 *
 * Line endings are normalised first. Git checks these files out with CRLF on Windows and LF on the
 * Linux runner that deploys the site, and a digest that disagreed between the two would fail in CI
 * for a reason nobody could reproduce locally.
 */
function digestOfContent(): string {
  const hash = createHash('sha256');

  for (const name of proseModules) {
    hash.update(name);
    hash.update(readFileSync(new URL(name, directory), 'utf8').replace(/\r\n/g, '\n'));
  }

  return hash.digest('hex');
}

describe('the downloadable CV', () => {
  it('fingerprints every content module that holds prose', () => {
    // Guards the digest itself: were the filter to stop matching, the test below would pass over
    // nothing and keep passing while the content changed underneath it.
    expect(proseModules).toEqual([
      'contents.ts',
      'credentials.ts',
      'dates.ts',
      'experience.ts',
      'introduction.ts',
      'languages.ts',
      'projects.ts',
      'site.ts',
      'skills.ts',
    ]);
  });

  it('is in step with the content the page shows', () => {
    const digest = digestOfContent();

    expect(
      cv.contentDigest,
      [
        "The site's content has changed since the CV was last brought into step with it.",
        '',
        'ADR-005 lists the facts the two documents must share: employers and job titles, role dates',
        'to the month and locations, every role the site lists, credentials and their dates,',
        'languages and their levels, and every named project and quantified claim. The site is the',
        'source of truth for all of them, so the CV is corrected to match it.',
        '',
        `Update ${cv.file} from the design tool, replace the file in public/, then set`,
        `contentDigest in content/cv.ts to:\n  ${digest}`,
      ].join('\n'),
    ).toBe(digest);
  });

  it('is a file the site carries, within the budget ADR-004 sets for it', () => {
    // statSync throws if the path is wrong, so this holds cv.file to the file that is published.
    const bytes = statSync(new URL(`../public${cv.file}`, import.meta.url)).size;

    expect(bytes).toBeLessThanOrEqual(2 * 1024 * 1024);
  });
});
