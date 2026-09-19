import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { introduction } from '@/content/introduction';
import { projects } from '@/content/projects';
import type { Project } from '@/content/types';
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
