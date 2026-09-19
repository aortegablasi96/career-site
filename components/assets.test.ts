import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// ADR-004 gives binary assets one rule: they live in public/, their paths are data in content/, and
// every reference to one passes through asset() so that it resolves under the path GitHub Pages
// serves the site from. Writing the path straight into a src, href or poster attribute works
// locally, where PAGES_BASE_PATH is unset, and 404s on the live site. The mistake is therefore
// invisible on the machine that makes it, which is why it is checked here rather than remembered,
// as components/stylesheets.test.ts checks ADR-001's tokens-only rule.
//
// This covers app/ as well as components/. app/page.tsx renders the page and could write a path
// just as readily; the test lives here because that is where ADR-004 put it and where the markup is.
// app/ is read all the way down, since #153 put each project's view in a route of its own there.
const directories = [new URL('./', import.meta.url), new URL('../app/', import.meta.url)];

const sources = directories.flatMap((directory) =>
  readdirSync(directory, { recursive: true, encoding: 'utf8' })
    .map((name) => name.split(/[\\/]/).join('/'))
    .filter((name) => name.endsWith('.tsx') && !name.endsWith('.test.tsx'))
    .map((name) => ({
      name: `${directory.pathname.split('/').at(-2)}/${name}`,
      // Without block comments, so an attribute is not matched inside its own explanation or
      // inside a JSX comment.
      source: readFileSync(new URL(name, directory), 'utf8').replace(/\/\*[\s\S]*?\*\//g, ''),
    })),
);

/** An attribute that addresses a file: what it is called, and what it was given. */
interface Attribute {
  /** The element it is written on, such as `a` or `Link`. */
  element: string;
  name: string;
  /** The value as written, without its quotes or its braces. */
  value: string;
  /** Whether it was written as a string rather than as an expression. */
  literal: boolean;
}

/**
 * Every `src`, `poster` and `href` in a file, with the value each was given.
 *
 * The value is read by walking the braces rather than by matching to the first `}`, so that a
 * template literal such as `` `#${id}` `` is read whole rather than sliced in half.
 */
function addressingAttributes({ source }: { source: string }): Attribute[] {
  const found: Attribute[] = [];

  for (const match of source.matchAll(/\b(src|poster|href)=/g)) {
    const name = match[1];
    const element = /<([\w.]+)/.exec(source.slice(source.lastIndexOf('<', match.index)))?.[1] ?? '';
    const start = match.index + match[0].length;
    const opening = source[start];

    if (opening === '"' || opening === "'") {
      const end = source.indexOf(opening, start + 1);

      found.push({ element, name, value: source.slice(start + 1, end), literal: true });
      continue;
    }

    if (opening !== '{') continue;

    let depth = 0;
    let quote = '';

    for (let at = start; at < source.length; at += 1) {
      const character = source[at];

      if (quote) {
        if (character === '\\') at += 1;
        else if (character === quote) quote = '';
        continue;
      }

      if (character === '"' || character === "'" || character === '`') quote = character;
      else if (character === '{') depth += 1;
      else if (character === '}') {
        depth -= 1;
        if (depth === 0) {
          found.push({ element, name, value: source.slice(start + 1, at).trim(), literal: false });
          break;
        }
      }
    }
  }

  return found;
}

describe('asset references', () => {
  it('are looked for in every component and in the page itself', () => {
    // Guards the scan: were the filter to stop matching, every test below would pass over nothing
    // and keep passing while a reference went in unchecked.
    const names = sources.map(({ name }) => name);

    expect(names).toContain('components/introduction.tsx');
    expect(names).toContain('components/projects.tsx');
    expect(names).toContain('app/page.tsx');
    expect(names).toContain('app/projects/[slug]/page.tsx');
  });

  describe.each(sources)('$name', (file) => {
    // A `Link` is the exception, per ADR-010: its href is a route of this site rather than a file,
    // and `next/link` puts the base path in front of it itself. Given `asset()` as well, it would
    // carry the base path twice.
    const attributes = addressingAttributes(file).filter(({ element }) => element !== 'Link');

    it('writes no path from the site root, which would lose the base path', () => {
      const literals = attributes.filter(({ literal }) => literal).map(({ value }) => value);

      for (const value of literals) {
        expect(value.startsWith('/')).toBe(false);
      }
    });

    // Nothing this site shows is fetched from anywhere else: ADR-004 commits one file per asset to
    // public/ and rules out an image pipeline, a CDN and an external host. So every src and poster
    // on the page addresses a file this repository carries, and every one of them needs the helper.
    it('reaches an image or a video through asset()', () => {
      const media = attributes.filter(({ name }) => name === 'src' || name === 'poster');

      for (const { value } of media) {
        expect(value).toContain('asset(');
      }
    });

    // An href is the one of the three that legitimately points somewhere else: a contact address, a
    // project's repository, or a section of this page. Those are a Link's own href, per ADR-002, and
    // an in-page anchor. Anything else an href is given is a path this site carries, and needs the
    // helper — the downloadable CV in content/cv.ts is the first of them.
    it('reaches a file this site carries through asset()', () => {
      const links = attributes.filter(({ name }) => name === 'href');

      for (const { value, literal } of links) {
        if (literal || value === 'href') continue;
        if (/^`#/.test(value)) continue;

        expect(value).toContain('asset(');
      }
    });
  });
});
