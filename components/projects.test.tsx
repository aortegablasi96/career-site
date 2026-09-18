import { readFileSync, statSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { projects } from '@/content/projects';
import type { Project } from '@/content/types';
import { Projects } from './projects';

// Rendered with the real content, since what the projects say and link to is what #30 asks for and
// what they show is what DDR-010 asks for.
const html = renderToStaticMarkup(<Projects projects={projects.projects} />);

/** The markup's text, as a reader meets it. */
const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

/** Each project's row, in the order the page shows them. */
const rows = html.match(/<article[^>]*>.*?<\/article>/g) ?? [];

/** A row's links, as the reader meets them. */
const linksOf = (row: string) =>
  [...row.matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map(([, href, text]) => ({ href, text }));

/** A row's technology tags, in the order it shows them. */
const tagsOf = (row: string) =>
  [...(row.match(/<ul class="[^"]*technologies[^"]*">.*?<\/ul>/)?.[0] ?? '').matchAll(
    /<li[^>]*>([^<]+)<\/li>/g,
  )].map(([, tag]) => tag);

const source = readFileSync(new URL('./projects.tsx', import.meta.url), 'utf8');

/** The stylesheet without its comments, so a rule is not matched against its explanation. */
const css = readFileSync(new URL('./projects.module.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

/** The body of a media query, so a rule inside it is read separately from the same rule outside. */
function media(query: string): string {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return css.match(new RegExp(`@media\\s*${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1] ?? '';
}

/** The declarations of the rule whose selector is exactly `selector`, inside `within`. */
function rule(selector: string, within = css): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return within.match(new RegExp(`(?:^|[{}])\\s*${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
}

describe('Projects', () => {
  it('renders each project as a row, in the order the content gives', () => {
    const titles = rows.map((row) => row.match(/<h3>([^<]+)<\/h3>/)?.[1]);

    expect(titles).toEqual(projects.projects.map(({ name }) => name));
  });

  // DDR-010's order: the media, then the name, the tags, the description and the links. The markup
  // order is the visual order at both widths, per DDR-014, so this is also what a screen reader and
  // a keyboard meet.
  it('follows the order DDR-010 sets: media, name, tags, description, links', () => {
    for (const row of rows) {
      expect(row).toMatch(
        /^<article[^>]*><(?:img|video)[^>]*\/?>(?:<\/video>)?<div[^>]*><h3>[^<]+<\/h3><ul class="[^"]*technologies[^"]*">(?:<li[^>]*>[^<]+<\/li>)+<\/ul><p>[^<]+<\/p><ul[^>]*>(?:<li><a [^>]+>[^<]+<\/a><\/li>)+<\/ul><\/div><\/article>$/,
      );
    }
  });

  it('shows every technology as a discrete tag, not as a line of prose, per DDR-010', () => {
    for (const [index, { technologies }] of projects.projects.entries()) {
      expect(tagsOf(rows[index]!)).toEqual([...technologies]);
    }

    // DDR-006 ran them together in one metadata line. DDR-010 replaces that here.
    expect(text).not.toContain('·');
  });

  it('shows each description exactly as content/ writes it', () => {
    for (const { description } of projects.projects) {
      expect(html).toContain(`<p>${description}</p>`);
    }
  });

  it('links every project to its public repository on the owner’s GitHub account, first', () => {
    for (const row of rows) {
      expect(linksOf(row)[0]).toEqual({
        href: expect.stringMatching(/^https:\/\/github\.com\/aortegablasi96\/[\w.-]+$/),
        text: 'Source code',
      });
    }
  });

  it('links NumisBook and the chatbot to the live versions recorded on their repositories', () => {
    const [numisbook, chatbot, viewer] = rows;

    expect(linksOf(numisbook!)).toContainEqual({ href: 'https://numisbook.vercel.app', text: 'Live site' });
    expect(linksOf(chatbot!)).toContainEqual({ href: 'https://career-conversation-chatbot.vercel.app', text: 'Live site' });
    expect(linksOf(viewer!).map(({ text }) => text)).not.toContain('Live site');
  });

  it('links this site’s row to this repository, and to nothing else', () => {
    expect(linksOf(rows.at(-1)!)).toEqual([
      { href: 'https://github.com/aortegablasi96/career-site', text: 'Source code' },
    ]);
  });

  it('opens every link in the same tab, per DDR-006', () => {
    expect(html).not.toMatch(/target=/);
  });

  // DDR-027: a link's box is the line its label sets in, as the design draws it, with no minimum
  // padding it out. A wrapped row needs a gap of its own, though, or two 19.5px links would sit
  // inside the circles WCAG 2.2's 2.5.8 measures its spacing exception with.
  it('gives every link the box the design draws and a wrapped row a gap, per DDR-027', () => {
    expect(rule('.link')).not.toMatch(/min-block-size|min-inline-size/);
    expect(rule('.links')).toMatch(/row-gap:\s*var\(--space-small\);/);
  });

  // DDR-035: the one link on the page still underlined draws the design's pale underline, 2px below
  // the text. It keeps the base styles' underline rather than drawing one of its own, so it writes
  // the colour and the offset and never the line.
  it('underlines every link in the design’s pale indigo, 2px below the text, per DDR-035', () => {
    expect(rule('.link')).toMatch(/text-decoration-color:\s*var\(--color-underline\);/);
    expect(rule('.link')).toMatch(/text-underline-offset:\s*var\(--underline-offset\);/);
    expect(css).not.toMatch(/text-decoration-line/);
  });

  it('darkens the text and strengthens the underline under the pointer and on focus, per DDR-035', () => {
    const hovered = css.match(/\.link:hover,\s*\.link:focus-visible\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(hovered).toMatch(/color:\s*var\(--color-accent-hover\);/);
    expect(hovered).toMatch(/text-decoration-color:\s*var\(--color-underline-hover\);/);
  });

  // The pale underline is the screen's. Paper prints the underline it printed before DDR-035, in
  // the link's own ink where the browser places it, so the printed CV does not change.
  it('prints the underline in the link’s own ink, where the browser places it, per DDR-035', () => {
    const printed = rule('.link', media('print'));

    expect(printed).toMatch(/text-decoration-color:\s*currentColor;/);
    expect(printed).toMatch(/text-underline-offset:\s*auto;/);
  });
});

describe('a project’s media', () => {
  const images = rows.map((row) => row.match(/<img [^>]*>/)?.[0] ?? '');

  it('shows every project’s media, with the alternative text content/ gives it', () => {
    for (const [index, { media }] of projects.projects.entries()) {
      expect('poster' in media).toBe(false);
      expect(images[index]).toContain(`alt="${'alt' in media ? media.alt : ''}"`);
      expect(images[index]).toContain(`src="${media.file}"`);
    }
  });

  // The media shows what the words cannot, and says nothing the words do not: every alternative
  // text names the project beside it, so a reader who never sees the picture still meets the name,
  // the stack, the description and the links.
  it('leaves the row reading correctly when the asset fails to load', () => {
    for (const [index, { name, media }] of projects.projects.entries()) {
      expect('alt' in media && media.alt.length).toBeGreaterThan(0);
      expect(text).toContain(name);
      expect(rows[index]).toMatch(/<p>[^<]+<\/p>/);
    }
  });

  it('reaches every file through asset(), so it resolves under the Pages base path', () => {
    expect(source).toContain('asset(media.file)');
    expect(source).toContain('asset(media.poster)');
  });

  it('is a file the site carries, within the budget ADR-004 sets for a still', () => {
    for (const { media } of projects.projects) {
      // statSync throws if the path is wrong, so this holds the path to the file that is published.
      const bytes = statSync(new URL(`../public${media.file}`, import.meta.url)).size;

      expect(bytes).toBeLessThanOrEqual(150 * 1024);
    }
  });

  it('fixes both of the media’s dimensions, so the page does not shift when it loads', () => {
    expect(rule('.media')).toMatch(/inline-size:\s*var\(--project-media-width\);/);
    expect(rule('.media')).toMatch(/aspect-ratio:\s*var\(--project-media-ratio\);/);
    expect(rule('.media')).toMatch(/object-fit:\s*cover;/);
  });

  // DDR-014 forbids a horizontal scrollbar from 320px. The media is the first fixed-size box on
  // the site wide enough to overflow one when text is enlarged, so it is capped to the row.
  it('never grows wider than the room the row has for it', () => {
    expect(rule('.media')).toMatch(/max-inline-size:\s*100%;/);
  });

  // DDR-013's radius table gives a language card and a piece of project media the same corner, and
  // reserves the small radius for a technology tag and a level badge. The page drew the media at
  // the small one until #73, so the two surfaces the record groups together were rounded
  // differently.
  it('is rounded at the large radius, as a language card is, per DDR-013', () => {
    expect(rule('.media')).toMatch(/border-radius:\s*var\(--radius-large\);/);
  });
});

// DDR-010 gives the Digital Twin its demo video in place of a still. The file itself is outstanding
// on #63, so no project carries one yet; this renders one to hold the markup the record asks for,
// rather than leaving the branch to be written for the first time when the file lands.
describe('a project whose media is a video', () => {
  const demo: Project = {
    ...projects.projects[1]!,
    media: {
      file: '/project-digital-twin.mp4',
      poster: '/project-digital-twin.webp',
      description: 'The Digital Twin chatbot answering a question',
    },
  };
  const markup = renderToStaticMarkup(<Projects projects={[demo]} />);
  const video = markup.match(/<video[^>]*>/)?.[0] ?? '';
  const still = markup.match(/<img[^>]*>/)?.[0] ?? '';

  it('shows the video with controls, per DDR-010', () => {
    expect(video).toMatch(/\bcontrols\b/);
  });

  it('neither plays nor repeats by itself, per DDR-010', () => {
    expect(video).not.toMatch(/\bautoplay\b|\bloop\b/);
  });

  it('shows its poster and fetches nothing until it is played, per ADR-004', () => {
    expect(video).toContain('poster="/project-digital-twin.webp"');
    expect(video).toContain('preload="none"');
  });

  // The UI Review on #43 makes the video content rather than decoration, so it is not hidden from
  // assistive technology: it carries an accessible name and a description of what it shows, and
  // nothing on the page depends on watching it.
  it('carries an accessible name describing what it shows, and is not hidden', () => {
    expect(video).toContain('aria-label="The Digital Twin chatbot answering a question"');
    expect(video).not.toContain('aria-hidden');
  });

  // DDR-010 prints one still per project, and measured on #52 a video element cannot be it: Edge
  // prints an empty box with a dead scrubber and no poster at all, and Firefox prints the poster
  // under a controls bar. So the poster is rendered a second time, as an image, and exactly one of
  // the two is displayed — the video on screen, the still on paper, per DDR-015.
  it('carries its poster as an image for paper, described in the same words', () => {
    expect(still).toContain('src="/project-digital-twin.webp"');
    expect(still).toContain('alt="The Digital Twin chatbot answering a question"');
  });

  it('marks the two so that exactly one is shown, and the row keeps a single media element', () => {
    // A CSS Module is hashed when it is imported, so the class is read back by its last part.
    const name = (markup: string) =>
      (markup.match(/class="([^"]*)"/)?.[1]?.split(' ').at(-1) ?? '').replace(/^_|_[^_]*$/g, '');

    expect(name(video)).toBe('onScreen');
    expect(name(still)).toBe('onPaper');
  });

  // Both are the same box as a still project's image: one class carries the width, the ratio and
  // the radius, so the three never drift apart. Read by its first part, since the mark above is
  // its last.
  it('draws the video and the printed still as the same box an image would be', () => {
    const first = (markup: string) =>
      (markup.match(/class="([^"]*)"/)?.[1]?.split(' ')[0] ?? '').replace(/^_|_[^_]*$/g, '');

    expect(first(video)).toBe('media');
    expect(first(still)).toBe('media');
  });
});

// DDR-010 decides how a project is laid out and what it does on paper. These read the stylesheet as
// written, so a later edit cannot quietly drop a rule an acceptance criterion rests on.
describe('project styles', () => {
  const wide = media('(min-width: 48em), print');
  const paper = media('print');

  it('gives the media a column of its own from the wide breakpoint, per DDR-010', () => {
    expect(rule('.project', wide)).toMatch(
      /grid-template-columns:\s*var\(--project-media-width\)\s*1fr;/,
    );
  });

  // A video element cannot be the still DDR-010 prints, so the poster is rendered a second time as
  // an image and the two swap places on paper, per DDR-015.
  it('shows the video on screen and its poster still on paper, per DDR-015', () => {
    expect(rule('.onPaper')).toMatch(/display:\s*none;/);
    expect(rule('.onScreen', paper)).toMatch(/display:\s*none;/);
    expect(rule('.onPaper', paper)).toMatch(/display:\s*block;/);
  });

  it('separates projects by the item step, as roles and skill groups are, per DDR-013', () => {
    expect(rule('.project + .project')).toMatch(/margin-block-start:\s*var\(--space-item\);/);
  });

  // DDR-030 writes the weight DDR-023's table has always named for a tag and which no rule ever
  // wrote. It is the smallest text on the page, and the one an extra stroke helps most.
  it('sets a tag in medium, per DDR-030', () => {
    expect(rule('.tag')).toMatch(/font-weight:\s*var\(--font-weight-medium\);/);
  });

  it('reads a tag’s tint and its ink from the pairing DDR-012 measures', () => {
    expect(rule('.tag')).toMatch(/background-color:\s*var\(--color-surface-tag\);/);
    expect(rule('.tag')).toMatch(/color:\s*var\(--color-text-tag\);/);
    expect(rule('.tag')).toMatch(/font-size:\s*var\(--font-size-xxx-small\);/);
  });

  // DDR-022 takes the design's sizes: a tag and a link are labels rather than prose, and a
  // description is set at the step a role's points take rather than at the introduction's.
  it('sets a tag, the description and a link at the steps DDR-022 gives each', () => {
    expect(rule('.tag')).toMatch(/font-size:\s*var\(--font-size-xxx-small\);/);
    expect(rule('.content > p')).toMatch(/font-size:\s*var\(--font-size-small\);/);
    expect(rule('.link')).toMatch(/font-size:\s*var\(--font-size-x-small\);/);
  });

  // DDR-017 opens a tag, which is a label to scan rather than a word to read. The description
  // under it is prose, so it keeps the spacing DM Sans was drawn with.
  it('opens a tag to the label tracking, and leaves the text around it alone, per DDR-017', () => {
    expect(rule('.tag')).toMatch(/letter-spacing:\s*var\(--letter-spacing-loose\);/);
    expect(rule('.content > * + *')).not.toMatch(/letter-spacing/);
  });

  // The tint is dropped by the token, for every surface on the page at once, per DDR-015, so the
  // tag has no print rule of its own and its padding becomes the space between one technology and
  // the next.
  it('leaves a tag nothing to say on paper, since the tint is dropped by the token, per DDR-015', () => {
    expect(rule('.tag', paper)).toBe('');
  });

  // A link's own box is already the height of its text on screen, since DDR-027, so what paper
  // still needs is the display: the address prints as a pseudo-element, and a flex container would
  // lay that out as an item of its own rather than let it read as part of the line.
  it('lets a link and the address after it read as one line, per DDR-005', () => {
    expect(rule('.link', paper)).toMatch(/display:\s*inline;/);
  });

  it('lets every link print its address, since each one leaves the page, per DDR-005', () => {
    for (const { href } of rows.flatMap(linksOf)) {
      expect(href).toMatch(/^https:\/\//);
    }
    expect(css).not.toMatch(/::after|content:/);
  });
});

describe('projects content', () => {
  it('lists the three portfolio projects, then this site, as #26 decided', () => {
    expect(projects.projects.map(({ name }) => name)).toEqual([
      'NumisBook',
      'Digital Twin',
      'Stock Portfolio Viewer',
      'This site',
    ]);
  });

  it('names at least one technology for each project', () => {
    for (const { technologies } of projects.projects) {
      expect(technologies.length).toBeGreaterThan(0);
    }
  });

  it('writes descriptions without pronouns, and without self-assessed traits', () => {
    for (const { description } of projects.projects) {
      expect(description).not.toMatch(/\b(?:I|me|my|we|our)\b/i);
      expect(description).not.toMatch(/strong|proven|leadership|servant|passionate|results-driven/i);
    }
  });
});
