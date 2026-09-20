import { readFileSync, statSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { projects } from '@/content/projects';
import type { Project } from '@/content/types';
import { Media, Projects, projectRows } from './projects';

// Rendered with the real content, a row at a time as the page renders it, since what the cards say
// and lead to is what #154 asks for.
const html = projectRows(projects.projects)
  .map((row) => renderToStaticMarkup(<Projects projects={row} />))
  .join('');

/** The markup's text, as a reader meets it. */
const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

/** Each project's card, in the order the page shows them. */
const cards = html.match(/<article[^>]*>.*?<\/article>/g) ?? [];

/** A card's links, as the reader meets them. */
const linksOf = (card: string) =>
  [...card.matchAll(/<a [^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map(([, href, text]) => ({ href, text }));

/** A card's tags, in the order it shows them. */
const tagsOf = (card: string) =>
  [...(card.match(/<ul class="[^"]*technologies[^"]*">.*?<\/ul>/)?.[0] ?? '').matchAll(
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
  it('renders each project as a card, in the order the content gives, two to a row', () => {
    const names = cards.map((card) => card.match(/<h3[^>]*><a [^>]*>([^<]+)<\/a><\/h3>/)?.[1]);

    expect(names).toEqual(projects.projects.map(({ name }) => name));
    expect(projectRows(projects.projects).map((row) => row.length)).toEqual([2, 2]);
  });

  // DDR-051's order, which is the design's: the picture, then the name, the sentence and the tags.
  // The markup order is the visual order at both widths, per DDR-014.
  it('follows the order DDR-051 sets: picture, name, sentence, tags', () => {
    for (const card of cards) {
      expect(card).toMatch(
        /^<article[^>]*><img [^>]*\/?><div[^>]*><h3[^>]*><a [^>]+>[^<]+<\/a><\/h3><p[^>]*>[^<]+<\/p><ul class="[^"]*technologies[^"]*">(?:<li[^>]*>[^<]+<\/li>)+<\/ul><\/div><\/article>$/,
      );
    }
  });

  // The whole card is one link, and the link is the name: one stop in the tab order, announced by
  // the project's name rather than by every word on the card run together.
  it('makes each card one link to its project’s view, named by the project alone', () => {
    for (const [index, { name, slug }] of projects.projects.entries()) {
      expect(linksOf(cards[index]!)).toEqual([{ href: `/projects/${slug}`, text: name }]);
    }
  });

  it('opens the view in the same tab, since it is a page of this site', () => {
    expect(html).not.toMatch(/target=/);
  });

  // A card says what the project is in one sentence; the full description is the view's.
  it('shows each card’s sentence, and leaves the full description to the view', () => {
    for (const { summary, description } of projects.projects) {
      expect(html).toContain(`>${summary}</p>`);
      expect(text).not.toContain(description);
    }
  });

  // DDR-054 takes DDR-051's cap of four and the count that followed it: a card shows the lot.
  it('shows every technology the project states, in the content’s order', () => {
    for (const [index, { technologies }] of projects.projects.entries()) {
      expect(tagsOf(cards[index]!)).toEqual([...technologies]);
    }
  });

  // The two projects that had technologies hidden behind a click are the reason #163 exists, so
  // they are named: six tags each, where both showed four and "+2".
  it('leaves nothing behind a count, on the two cards that used to hide two', () => {
    expect(tagsOf(cards[0]!)).toEqual([
      'Next.js',
      'TypeScript',
      'PostgreSQL on Neon',
      'OpenAI',
      'Vercel',
      'Cloudflare R2',
    ]);
    expect(tagsOf(cards[1]!)).toEqual([
      'LangGraph',
      'OpenAI Agents SDK',
      'Chroma',
      'Cohere',
      'FastAPI',
      'Next.js',
    ]);
    expect(html).not.toMatch(/>\+\d+</);
  });

  // The printed CV carries no project address since Epic #152, and the card has none to carry.
  it('carries no source or live address', () => {
    expect(html).not.toMatch(/https?:\/\//);
  });
});

describe('a card’s picture', () => {
  const images = cards.map((card) => card.match(/<img [^>]*>/)?.[0] ?? '');

  it('shows every project’s picture, with the alternative text content/ gives it', () => {
    for (const [index, { media }] of projects.projects.entries()) {
      expect('poster' in media).toBe(false);
      expect(images[index]).toContain(`alt="${'alt' in media ? media.alt : ''}"`);
      expect(images[index]).toContain(`src="${media.file}"`);
    }
  });

  // The picture is content, so it keeps its alternative text, and it sits outside the link, so the
  // link's name stays the project's.
  it('is outside the link, so it adds nothing to the link’s name', () => {
    for (const card of cards) {
      expect(card).not.toMatch(/<a [^>]*>[^]*<img/);
    }
  });

  it('reaches every file through asset(), so it resolves under the Pages base path', () => {
    expect(source).toContain('asset(still.src)');
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

  // A card leads to the view, where a video plays; its controls could not be used under a link
  // stretched over them. So a card shows the poster still, described in the video's own words.
  it('shows a video’s poster still, and no video, for a project whose media is one', () => {
    const demo: Project = {
      ...projects.projects[1]!,
      media: {
        file: '/project-digital-twin.mp4',
        poster: '/project-digital-twin.webp',
        description: 'The Digital Twin chatbot answering a question',
      },
    };
    const markup = renderToStaticMarkup(<Projects projects={[demo]} />);

    expect(markup).not.toContain('<video');
    expect(markup).toMatch(/<img [^>]*src="\/project-digital-twin\.webp"/);
    expect(markup).toContain('alt="The Digital Twin chatbot answering a question"');
  });
});

// DDR-010 gives the Digital Twin its demo video in place of a still, and a project's view shows it,
// per DDR-050. The file itself is outstanding on #63, so no project carries one yet; this renders
// one to hold the markup the record asks for.
describe('a project’s media as a video', () => {
  const markup = renderToStaticMarkup(
    <Media
      media={{
        file: '/project-digital-twin.mp4',
        poster: '/project-digital-twin.webp',
        description: 'The Digital Twin chatbot answering a question',
      }}
      className="media"
    />,
  );
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

  it('carries an accessible name describing what it shows, and is not hidden', () => {
    expect(video).toContain('aria-label="The Digital Twin chatbot answering a question"');
    expect(video).not.toContain('aria-hidden');
  });

  // Measured on #52, a video element cannot be the printed still: Edge prints an empty box and
  // Firefox the poster under a controls bar. So the poster is rendered a second time, as an image,
  // and exactly one of the two is displayed, per DDR-015.
  it('carries its poster as an image for paper, described in the same words', () => {
    expect(still).toContain('src="/project-digital-twin.webp"');
    expect(still).toContain('alt="The Digital Twin chatbot answering a question"');
  });

  it('marks the two so that exactly one is shown, and gives both the class it is handed', () => {
    // A CSS Module is hashed when it is imported, so the class is read back by its last part.
    const classes = (markup: string) => markup.match(/class="([^"]*)"/)?.[1]?.split(' ') ?? [];
    const last = (markup: string) => (classes(markup).at(-1) ?? '').replace(/^_|_[^_]*$/g, '');

    expect(last(video)).toBe('onScreen');
    expect(last(still)).toBe('onPaper');
    expect(classes(video)[0]).toBe('media');
    expect(classes(still)[0]).toBe('media');
  });
});

// DDR-051 decides how a card is drawn and what it does on paper. These read the stylesheet as
// written, so a later edit cannot quietly drop a rule an acceptance criterion rests on.
describe('project styles', () => {
  const wide = media('(min-width: 48em), print');
  const paper = media('print');

  it('stands two cards in a row from the wide breakpoint and on paper, and one below it', () => {
    expect(rule('.row')).toMatch(/grid-template-columns:\s*minmax\(0,\s*1fr\);/);
    expect(rule('.row', wide)).toMatch(/grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/);
  });

  it('spaces the cards by the design’s 20px each way, the second row included', () => {
    expect(rule('.row')).toMatch(/gap:\s*var\(--project-card-space\);/);
    expect(rule('section > .row')).toMatch(/margin-block-start:\s*var\(--project-card-space\);/);
    expect(rule('.body')).toMatch(/padding:\s*var\(--project-card-space\);/);
  });

  // A card is a language card's surface: white, the hairline edge, the one shadow, the large radius.
  it('draws a card as the language cards are drawn, per DDR-020 and DDR-013', () => {
    const card = rule('.card');

    expect(card).toMatch(/background-color:\s*var\(--color-surface-card\);/);
    expect(card).toMatch(/border:\s*1px solid var\(--color-border\);/);
    expect(card).toMatch(/box-shadow:\s*var\(--shadow-raised\);/);
    expect(card).toMatch(/border-radius:\s*var\(--radius-large\);/);
  });

  it('crops the picture to the design’s 16:9 rather than stretching it', () => {
    expect(rule('.media')).toMatch(/aspect-ratio:\s*var\(--project-card-media-ratio\);/);
    expect(rule('.media')).toMatch(/object-fit:\s*cover;/);
    expect(rule('.media')).toMatch(/align-self:\s*stretch;/);
  });

  // Measured on #154: in a grid of one track, Firefox sizes the row from the picture's own height
  // rather than the 16:9 it is drawn at, and leaves 117px empty below it. A flex column does not.
  it('lays a card out as a flex column, which Firefox sizes by the picture as drawn', () => {
    expect(rule('.card')).toMatch(/display:\s*flex;/);
    expect(rule('.card')).toMatch(/flex-direction:\s*column;/);
  });

  // The link's box covers the card, so a pointer anywhere on it follows the link, and keyboard focus
  // outlines the card rather than the name.
  it('stretches the link over the card, and outlines the card on focus', () => {
    expect(rule('.card')).toMatch(/position:\s*relative;/);
    expect(rule('.link::after')).toMatch(/position:\s*absolute;/);
    expect(rule('.link::after')).toMatch(/inset:\s*0;/);
    expect(rule('.link:focus-visible::after')).toMatch(
      /outline:\s*var\(--focus-outline-width\) solid var\(--color-focus\);/,
    );
  });

  it('answers the pointer and keyboard focus by taking the accent, per DDR-035', () => {
    const hovered = css.match(/\.link:hover,\s*\.link:focus-visible\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(hovered).toMatch(/color:\s*var\(--color-accent\);/);
  });

  // DDR-055: the card itself rises, which is the site's one piece of expressive motion. These hold
  // the whole of it — where it is written, what moves, how far, how long for, and what a reader who
  // has asked for less motion gets — because every one of #164's criteria rests on one of them.
  describe('the lift, per DDR-055', () => {
    const motion = media('(prefers-reduced-motion: no-preference)');

    it('rises under a pointer anywhere on the card, and on keyboard focus, per DDR-035', () => {
      const lifted = motion.match(/\.card:hover,\s*\.card:has\(\.link:focus-visible\)\s*\{([^}]*)\}/)?.[1] ?? '';

      expect(lifted).toMatch(/translate:\s*0 calc\(-1 \* var\(--project-card-lift\)\);/);
      // Only the movement. The card is not restyled: its surface, edge, radius and shadow stand.
      expect(lifted.match(/[\w-]+:/g)).toEqual(['translate:']);
    });

    // A translation moves no layout, so no other card, heading or section shifts with it.
    it('moves the card with `translate`, and moves nothing else', () => {
      expect(motion).not.toMatch(/margin|inset-block-start|scale|rotate/);
      expect(css.match(/translate:/g)).toHaveLength(1);
    });

    it('takes the 150ms every link’s colour takes, so the two are one change, per DDR-035', () => {
      expect(rule('.card', motion)).toMatch(/transition-property:\s*translate;/);
      expect(rule('.card', motion)).toMatch(/transition-duration:\s*var\(--hover-transition\);/);
    });

    // The movement itself is inside the query, not merely its transition as DDR-035 writes the
    // colours', so a reader who prefers reduced motion gets the card exactly as it was.
    it('writes the movement, not only its transition, where motion is welcome', () => {
      expect(motion).not.toBe('');
      expect(css.replace(motion, '')).not.toMatch(/translate:|transition/);
    });

    // A lifted card vacates the bottom 4px of its resting footprint. Without this the pointer would
    // fall off the card there, drop it and pick it up again for as long as it stayed.
    it('holds the link’s box under a pointer at the card’s resting edge', () => {
      expect(rule('.link::before', motion)).toMatch(
        /inset:\s*0 0 calc\(-1 \* var\(--project-card-lift\)\);/,
      );
      expect(rule('.link::before', motion)).toMatch(/position:\s*absolute;/);
    });

    // The other pseudo-element draws the focus outline, which stays the size of the card.
    it('leaves the focus outline the size of the card', () => {
      expect(rule('.link::after')).toMatch(/inset:\s*0;/);
    });

    // The movement needs no print rule, as DDR-035's hover colours need none: paper cannot be
    // pointed at or focused. The buffer is put out, since there is no pointer to hold anything
    // under, and it is the one thing this adds to a sheet if it is left drawn.
    it('draws neither the movement nor its buffer on paper', () => {
      expect(rule('.card', paper)).toBe('');
      expect(rule('.link::before', paper)).toMatch(/content:\s*none;/);
      expect(paper).not.toMatch(/translate|transition/);
    });
  });

  // DDR-051 amends DDR-023 for this one heading: the design sets a card's name in Lora.
  it('sets the name in the serif, per DDR-051', () => {
    expect(rule('.name')).toMatch(/font-family:\s*var\(--font-family-heading\);/);
  });

  it('sets the sentence in the muted ink at the label step, on the small prose leading', () => {
    expect(rule('.summary')).toMatch(/color:\s*var\(--color-text-muted\);/);
    expect(rule('.summary')).toMatch(/font-size:\s*var\(--font-size-x-small\);/);
    expect(rule('.summary')).toMatch(/line-height:\s*var\(--line-height-prose-small\);/);
  });

  it('sets a tag in medium on its tint, tracked, per DDR-030 and DDR-017', () => {
    expect(rule('.tag')).toMatch(/font-weight:\s*var\(--font-weight-medium\);/);
    expect(rule('.tag')).toMatch(/background-color:\s*var\(--color-surface-tag\);/);
    expect(rule('.tag')).toMatch(/color:\s*var\(--color-text-tag\);/);
    expect(rule('.tag')).toMatch(/font-size:\s*var\(--font-size-xxx-small\);/);
    expect(rule('.tag')).toMatch(/letter-spacing:\s*var\(--letter-spacing-loose\);/);
  });

  // DDR-054 removed the count, so the rule that drew it goes with it rather than lingering as a
  // class nothing renders.
  it('draws no count, since a card leaves no technology out', () => {
    expect(rule('.more')).toBe('');
  });

  // A card with more tags than fit one line takes a second, at the same 8px the tags are apart.
  it('wraps the tags rather than letting a card scroll, per DDR-054', () => {
    expect(rule('.technologies')).toMatch(/flex-wrap:\s*wrap;/);
    expect(rule('.technologies')).toMatch(/gap:\s*var\(--space-x-small\);/);
  });

  it('leaves a tag nothing to say on paper, since the tint is dropped by the token, per DDR-015', () => {
    expect(rule('.tag', paper)).toBe('');
  });

  // The view is a route paper cannot follow, so the base styles' address after the link is put out,
  // along with the box the link is stretched over.
  it('prints no address after the card’s link', () => {
    expect(rule('.link::after', paper)).toMatch(/content:\s*none;/);
  });

  it('keeps a row of cards whole on paper', () => {
    expect(rule('.row', paper)).toMatch(/break-inside:\s*avoid;/);
  });

  it('shows a view’s video on screen and its poster still on paper, per DDR-015', () => {
    expect(rule('.onPaper')).toMatch(/display:\s*none;/);
    expect(rule('.onScreen', paper)).toMatch(/display:\s*none;/);
    expect(rule('.onPaper', paper)).toMatch(/display:\s*block;/);
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

  it('writes descriptions and sentences without pronouns, and without self-assessed traits', () => {
    for (const { description, summary } of projects.projects) {
      for (const words of [description, summary]) {
        expect(words).not.toMatch(/\b(?:I|me|my|we|our)\b/i);
        expect(words).not.toMatch(/strong|proven|leadership|servant|passionate|results-driven/i);
      }
    }
  });

  it('gives each card a sentence well under half the length of the project’s description', () => {
    for (const { description, summary } of projects.projects) {
      expect(summary.length).toBeLessThan(description.length / 2);
    }
  });
});
