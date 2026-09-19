import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { introduction } from '@/content/introduction';
import { projects } from '@/content/projects';
import type { GalleryItem, Project } from '@/content/types';
import { ProjectView } from './project-view';

// Rendered with the real content, since what a view says is the project's own record, per #153,
// with the projects on either side of it, per #156.
function render(project: Project, neighbours: { previous?: Project; next?: Project } = {}): string {
  return renderToStaticMarkup(
    <ProjectView
      project={project}
      strings={projects.view}
      backHref="/#projects"
      previous={neighbours.previous}
      next={neighbours.next}
    />,
  );
}

const [numisBook, digitalTwin, stockPortfolioViewer, careerSite] = projects.projects;
const html = render(numisBook!);

/** The markup's text, as a reader meets it. */
const text = (markup: string) => markup.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

/** The stylesheet without its comments, so a rule is not matched against its explanation. */
const css = readFileSync(new URL('./project-view.module.css', import.meta.url), 'utf8').replace(
  /\/\*[\s\S]*?\*\//g,
  '',
);

describe('ProjectView', () => {
  it('shows the parts #153 lists, in its order', () => {
    const order = [
      projects.view.back,
      numisBook!.name,
      numisBook!.description,
      projects.view.builtWith,
      ...numisBook!.technologies,
      ...numisBook!.links.map(({ text }) => text),
      numisBook!.caption,
    ];
    const shown = text(html);
    const positions = order.map((part) => shown.indexOf(part));

    expect(positions).not.toContain(-1);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('makes the name its only h1, and labels the technologies with an h2', () => {
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toMatch(new RegExp(`<h1[^>]*>${numisBook!.name}</h1>`));
    expect(html).toMatch(new RegExp(`<h2[^>]*>${projects.view.builtWith}</h2>`));
  });

  it('leads back to the projects section, not the top of the page', () => {
    expect(html).toMatch(/<a [^>]*href="\/#projects"[^>]*>.*Back to portfolio<\/a>/);
  });

  it('shows every technology the content states', () => {
    const tags = [...html.matchAll(/<li class="[^"]*tag[^"]*">([^<]+)<\/li>/g)].map(([, tag]) => tag);

    expect(tags).toEqual(numisBook!.technologies);
  });

  // DDR-050 extends DDR-043: the repository and the live site open a new tab, and say so to
  // assistive technology after their own text, as a profile pill does.
  it('opens each link in a new tab it cannot control, and says so after the link’s own text', () => {
    const links = [...html.matchAll(/<a href="(https:[^"]+)"([^>]*)>/g)];

    expect(links.map(([, href]) => href)).toEqual(numisBook!.links.map(({ href }) => href));

    for (const [, , attributes] of links) {
      expect(attributes).toContain('target="_blank"');
      expect(attributes).toContain('rel="noopener"');
    }

    expect(html).toContain(`aria-label="Source code, ${introduction.newTab}"`);
    expect(html).toContain(`aria-label="Live site, ${introduction.newTab}"`);
  });

  it('shows no live site control for a project without one', () => {
    const view = render(stockPortfolioViewer!);

    expect(text(view)).toContain('Source code');
    expect(text(view)).not.toContain('Live site');
  });

  it('shows the lead picture with its alternative text and its caption below it', () => {
    const media = numisBook!.media;

    expect('alt' in media).toBe(true);
    expect(html).toContain(`alt="${'alt' in media && media.alt}"`);
    expect(html).toMatch(
      new RegExp(`<figure[^>]*><img [^>]*><figcaption[^>]*>${numisBook!.caption}</figcaption></figure>`),
    );
  });

  // DDR-050: the design's 16:10, which crops a 4:3 picture rather than distorting it.
  it('keeps the picture in the design’s shape without stretching it', () => {
    const media = css.match(/\.media\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(media).toContain('aspect-ratio: var(--project-view-media-ratio)');
    expect(media).toContain('object-fit: cover');
    expect(media).toContain('align-self: stretch');
  });

  // #159: in a grid of one track, Firefox sizes the row from the picture's own height rather than
  // the 16:10 it is drawn at, and leaves 101.75px between the picture and its caption. A flex column
  // does not, as DDR-051 found for the project cards.
  it('lays the picture and its caption out as a flex column, which Firefox sizes by the picture as drawn', () => {
    const figure = css.match(/\.figure\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(figure).toContain('display: flex');
    expect(figure).toContain('flex-direction: column');
  });

  // DDR-053: further pictures and videos below the introduction. No project states a gallery yet —
  // the media is the owner's to supply, as on #63 — so the branch that shows one is exercised here
  // rather than by a page, as the video branch of `Media` has been since #50.
  describe('the gallery', () => {
    const picture: GalleryItem = {
      media: { file: '/gallery-picture.webp', alt: 'The assistant adding a coin from a photograph' },
      caption: 'AI assistant in action',
    };
    const video: GalleryItem = {
      media: {
        file: '/gallery-walkthrough.mp4',
        poster: '/gallery-walkthrough.webp',
        description: 'A walkthrough of the application, from signing in to adding a coin',
      },
      caption: 'Walkthrough demo',
    };
    const withGallery = (gallery: readonly GalleryItem[]) => render({ ...numisBook!, gallery });

    it('shows nothing at all for a project the owner has supplied no media for', () => {
      for (const project of projects.projects) {
        expect(project.gallery).toBeUndefined();
        expect(text(render(project))).not.toContain(projects.view.gallery);
      }

      expect(text(withGallery([]))).not.toContain(projects.view.gallery);
    });

    it('heads the block with an h2 and lists every item in the order the content gives', () => {
      const shown = text(withGallery([picture, video]));

      expect(withGallery([picture, video])).toMatch(
        new RegExp(`<h2[^>]*>${projects.view.gallery}</h2>`),
      );
      expect(shown.indexOf(picture.caption)).toBeGreaterThan(shown.indexOf(projects.view.gallery));
      expect(shown.indexOf(video.caption)).toBeGreaterThan(shown.indexOf(picture.caption));
    });

    // Each item is a figure with its caption, as the lead picture is, so the words below a picture
    // are tied to it rather than standing loose under it.
    it('ties each caption to its own picture, and describes the picture for a reader who cannot see it', () => {
      const markup = withGallery([picture]);
      const alt = 'alt' in picture.media ? picture.media.alt : '';

      expect(markup).toMatch(
        new RegExp(`<figure[^>]*><img [^>]*alt="${alt}"[^>]*><figcaption[^>]*>${picture.caption}</figcaption></figure>`),
      );
    });

    // DDR-010 and ADR-004: nothing is fetched until someone presses play, and the poster is what is
    // seen until then. The still beside it is for paper, and exactly one of the two is displayed.
    it('leaves a video unplayed and unfetched until the reader starts it', () => {
      const markup = withGallery([video]);
      const element = markup.match(/<video[^>]*>/)?.[0] ?? '';
      const description = 'poster' in video.media ? video.media.description : '';

      expect(element).toContain('preload="none"');
      expect(element).toContain('controls=""');
      expect(element).toContain('poster="/gallery-walkthrough.webp"');
      expect(element).toContain(`aria-label="${description}"`);
      expect(element).not.toContain('autoplay');
      expect(markup).toContain(`<img class="`);
    });

    // Every path a picture or video is reached by goes through `asset()`, per ADR-004, so it
    // resolves under the Pages base path as well as locally. `components/assets.test.ts` holds
    // every attribute in `components/` to it; this holds the gallery's own two.
    it('reaches each file by the one route a binary asset takes', () => {
      expect(withGallery([picture])).toContain('src="/gallery-picture.webp"');
      expect(withGallery([video])).toContain('src="/gallery-walkthrough.mp4"');
    });

    // DDR-053: one item to a row below the wide breakpoint, where two 16:10 pictures side by side
    // on a phone would be about 130px wide each, and two from it, as the design draws them.
    it('stands one item to a row below the wide breakpoint and two from it', () => {
      expect(css.match(/\.gallery\s*\{([^}]*)\}/)?.[1]).toContain('grid-template-columns: minmax(0, 1fr);');
      expect(css).toMatch(
        /@media \(min-width: 48em\) \{[\s\S]*\.gallery \{\s*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/,
      );
    });

    // An item is drawn in the lead picture's shape, at the same ratio and radius, so it is cropped
    // rather than stretched by the rule #153 already measured.
    it('keeps each item in the design’s shape, as the lead picture is kept', () => {
      expect(withGallery([picture, video])).toMatch(/<img class="[^"]*media[^"]*"/);
      expect(css.match(/\.media\s*\{([^}]*)\}/)?.[1]).toContain('object-fit: cover');
    });
  });

  // DDR-052: the projects on either side of this one, at the foot of the view.
  describe('the projects on either side', () => {
    const links = (markup: string) =>
      [...markup.matchAll(/<a ([^>]*href="\/projects\/[^>]*)>/g)].map(([, attributes]) => ({
        href: attributes.match(/href="([^"]+)"/)?.[1],
        label: attributes.match(/aria-label="([^"]+)"/)?.[1],
      }));

    it('links to both, naming each and saying which way it leads', () => {
      const view = render(digitalTwin!, { previous: numisBook!, next: stockPortfolioViewer! });

      expect(links(view)).toEqual([
        { href: `/projects/${numisBook!.slug}`, label: `Previous project: ${numisBook!.name}` },
        {
          href: `/projects/${stockPortfolioViewer!.slug}`,
          label: `Next project: ${stockPortfolioViewer!.name}`,
        },
      ]);
    });

    // WCAG 2.5.3: the word the card shows begins the name it is announced by.
    it('shows the word its accessible name begins with, above the project’s own', () => {
      const view = text(render(digitalTwin!, { previous: numisBook!, next: stockPortfolioViewer! }));

      expect(view).toContain(`${projects.view.previous} ${numisBook!.name}`);
      expect(view).toContain(`${projects.view.next} ${stockPortfolioViewer!.name}`);
    });

    it('shows no link back from the first project and none on from the last', () => {
      const first = render(numisBook!, { next: digitalTwin! });
      const last = render(careerSite!, { previous: stockPortfolioViewer! });

      expect(links(first).map(({ label }) => label)).toEqual([`Next project: ${digitalTwin!.name}`]);
      expect(links(last).map(({ label }) => label)).toEqual([
        `Previous project: ${stockPortfolioViewer!.name}`,
      ]);
    });

    // The design leaves the first project's left half empty (node 59:119) so the next card keeps
    // the right one, which is what the empty box is for. Below the wide breakpoint it is not drawn.
    it('keeps the right half for the next project where there is none before it', () => {
      expect(render(numisBook!, { next: digitalTwin! })).toMatch(/<div class="[^"]*half[^"]*">/);
      expect(render(digitalTwin!, { previous: numisBook!, next: stockPortfolioViewer! })).not.toMatch(
        /<div class="[^"]*half[^"]*">/,
      );
      expect(css.match(/\.half\s*\{([^}]*)\}/)?.[1]).toContain('display: none');
      expect(css).toMatch(/@media \(min-width: 48em\) \{[\s\S]*\.half \{\s*display: block;/);
    });

    it('opens the foot with a divider and lays the halves side by side from the wide breakpoint only', () => {
      const neighbours = css.match(/\.neighbours\s*\{([^}]*)\}/)?.[1] ?? '';

      expect(neighbours).toContain('border-block-start: 1px solid var(--color-border)');
      expect(neighbours).toContain('grid-template-columns: minmax(0, 1fr);');
      expect(css).toMatch(
        /@media \(min-width: 48em\) \{[\s\S]*\.neighbours \{\s*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/,
      );
    });
  });

  it('lays the two columns side by side from the wide breakpoint only', () => {
    expect(css).toMatch(/@media \(min-width: 48em\) \{\s*\.columns \{\s*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/);
    expect(css.match(/\.columns\s*\{[^}]*\}/)?.[0]).toContain('grid-template-columns: minmax(0, 1fr);');
  });
});
