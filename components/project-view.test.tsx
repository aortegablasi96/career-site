import { existsSync, readFileSync } from 'node:fs';
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
      backHref="/#portfolio"
      previous={neighbours.previous}
      next={neighbours.next}
    />,
  );
}

const [numisBook, digitalTwin, stockPortfolioViewer, careerSite] = projects.projects;
const html = render(numisBook!);

/** The markup's text, as a reader meets it. */
const text = (markup: string) => markup.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

/** A paragraph of how a project was built, as a reader meets it: its parts run together. */
const words = (paragraph: readonly (string | { strong: string })[]) =>
  paragraph.map((part) => (typeof part === 'string' ? part : part.strong)).join('');

/** The markup without its classes, which the CSS-module stub hashes, so its elements can be read in order. */
const bare = (markup: string) => markup.replace(/ class="[^"]*"/g, '');

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
      projects.view.howBuilt,
      words(numisBook!.howBuilt![0]!),
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

  // DDR-078: how a project was built follows its description, under an h2 set as "Built with" is.
  it('says how the project was built, under its own h2, between the description and the technologies', () => {
    for (const project of projects.projects) {
      const view = render(project);
      const paragraphs = project.howBuilt!.map(
        (paragraph) =>
          `<p>${paragraph.map((part) => (typeof part === 'string' ? part : `<strong>${part.strong}</strong>`)).join('')}</p>`,
      );

      expect(paragraphs.length).toBeGreaterThan(0);
      expect(bare(view)).toContain(
        `<p>${project.description}</p><h2>${projects.view.howBuilt}</h2>${paragraphs.join('')}`,
      );
      // A project with a business case holds both in its overview, per DDR-079, so "Built with"
      // follows the business case rather than the last paragraph; the order is the same.
      const shown = text(view);
      expect(shown.indexOf(projects.view.builtWith)).toBeGreaterThan(
        shown.indexOf(words(project.howBuilt!.at(-1)!)),
      );
      expect(view.match(/<h1/g)).toHaveLength(1);
    }
  });

  // The owner's bold phrases, from the Digital Twin's knowledge-base entry, stay bold, per #229.
  it('sets the owner’s bold phrases as strong, in their place in the paragraph', () => {
    const view = bare(render(digitalTwin!));

    for (const phrase of ['multi-agent workflow', 'structured outputs and guardrails', 'hybrid RAG approach', 'reranked with Cohere', 'FastAPI']) {
      expect(view).toContain(`<strong>${phrase}</strong>`);
    }
    expect(bare(render(numisBook!))).not.toContain('<strong>');
  });

  it('shows neither the heading nor a paragraph for a project that does not say how it was built', () => {
    const view = render({ ...careerSite!, howBuilt: undefined, businessCase: undefined });

    expect(text(view)).not.toContain(projects.view.howBuilt);
    expect(view).not.toContain('howBuilt');
    expect(bare(view)).toContain(`<p>${careerSite!.description}</p><h2>${projects.view.builtWith}</h2>`);
  });

  // DDR-079 and ADR-014: a project with a business case can be read as its overview or as that,
  // through a native radio group the stylesheet draws as one pill, with no script.
  describe('the switch between the overview and the business case', () => {
    const view = render(stockPortfolioViewer!);
    const radios = [...view.matchAll(/<input [^>]*>/g)].map(([input]) => input);

    // Since this site gained its own on #231, every project has one, so a view without one is a
    // project with its business case taken away.
    it('is on every view, since every project has a business case, and on no view without one', () => {
      expect(projects.projects.filter(({ businessCase }) => businessCase).map(({ name }) => name)).toEqual(
        projects.projects.map(({ name }) => name),
      );
      for (const project of projects.projects) {
        expect(render(project)).toContain('radiogroup');
      }
      expect(render({ ...careerSite!, businessCase: undefined })).not.toContain('radiogroup');
      expect(render({ ...careerSite!, businessCase: undefined })).not.toContain('<input');
    });

    // A view without a business case reads exactly as it did before #231: no wrapper round its
    // overview and nothing between the name and the description.
    it('leaves a view without a business case as it was', () => {
      const plain = bare(render({ ...stockPortfolioViewer!, businessCase: undefined }));

      expect(plain).toContain(
        `${stockPortfolioViewer!.name}</h1><p>${stockPortfolioViewer!.description}</p><h2>${projects.view.howBuilt}</h2>`,
      );
      expect(plain).not.toContain('role="group"');
      expect(plain).not.toContain('<button');
    });

    it('is a group of two radios named for what it switches, the overview first and checked', () => {
      expect(view).toContain(`role="radiogroup" aria-label="${projects.view.accounts}"`);
      expect(radios).toHaveLength(2);
      for (const radio of radios) {
        expect(radio).toContain('type="radio"');
        expect(radio).toContain('name="account"');
      }
      expect(radios[0]).toContain('checked=""');
      expect(radios[1]).not.toContain('checked');

      // Each radio is inside its label, so the label's word is its accessible name and the whole
      // label is its target.
      expect(bare(view)).toContain(
        `<label><input type="radio" name="account" checked=""/>${projects.view.overview}</label>` +
          `<label><input type="radio" name="account"/>${projects.view.businessCase}</label>`,
      );
    });

    it('stands between the name and the overview, and the business case follows the overview', () => {
      const shown = text(view);
      const order = [
        stockPortfolioViewer!.name,
        projects.view.overview,
        projects.view.businessCase,
        stockPortfolioViewer!.description,
        words(stockPortfolioViewer!.howBuilt![0]!),
        stockPortfolioViewer!.businessCase!.items[0]!.label,
        projects.view.builtWith,
      ];
      const positions = order.map((part) => shown.indexOf(part));

      expect(positions).not.toContain(-1);
      expect(positions).toEqual([...positions].sort((a, b) => a - b));
    });

    // The owner reordered the summary on #231, so key decisions come third and every item is
    // numbered. Since DDR-080 each item is a slide of the card, named for its label.
    it('shows each item of the business case as a slide of its label and its text, in the owner’s order', () => {
      for (const project of projects.projects) {
        const items = project.businessCase!.items;

        expect(items.map(({ label }) => label)).toEqual([
          '01 — Problem',
          '02 — Product',
          '03 — Key decisions',
          '04 — Outcome',
          '05 — My contribution',
        ]);
        // NumisBook's and the Digital Twin's items each name an "&", which the markup escapes.
        expect(bare(render(project))).toContain(
          `<div aria-live="polite">${items.map(({ label, text }) => `<div role="group" aria-label="${label}"><p>${label}</p><p>${text.replaceAll('&', '&amp;')}</p></div>`).join('')}</div>`,
        );
      }
    });

    // The labels are not headings, and a headline is an h2, so either account leaves the outline
    // one h1 and h2s.
    it('keeps one h1 and skips no heading level', () => {
      expect(view.match(/<h1/g)).toHaveLength(1);
      expect(view).not.toMatch(/<h[3-6]/);
    });

    // The business case is hidden until its option is checked, and then the overview is. A browser
    // without `:has()` keeps the overview, as the view read before.
    it('shows the business case in place of the overview only while its option is checked', () => {
      expect(css.match(/\.businessCase\s*\{([^}]*)\}/)?.[1]).toContain('display: none');
      expect(css).toMatch(/\.text:has\(\.caseChoice:checked\) \.overview \{\s*display: none;/);
      expect(css).toMatch(/\.text:has\(\.caseChoice:checked\) \.businessCase \{\s*display: block;/);
      expect(view).toMatch(/<input [^>]*class="[^"]*caseChoice[^"]*"/);
    });

    // The owner asked on #231 for "Built with" and its tags to be the overview's alone.
    it('hides "Built with" and the technologies with the overview', () => {
      expect(view).toMatch(new RegExp(`<h2 class="[^"]*overviewOnly[^"]*">${projects.view.builtWith}</h2>`));
      expect(view).toMatch(/<ul class="[^"]*technologies[^"]*overviewOnly[^"]*">/);
      expect(render({ ...careerSite!, businessCase: undefined })).not.toContain('overviewOnly');
    });

    // The radio takes no room and draws nothing, and its label draws the focus it cannot.
    it('draws each option as its label, focus included', () => {
      const choice = css.match(/\.choice\s*\{([^}]*)\}/)?.[1] ?? '';

      expect(choice).toContain('appearance: none');
      expect(choice).toContain('inline-size: 0');
      expect(css).toMatch(/\.option:has\(\.choice:focus-visible\) \{\s*outline: var\(--focus-outline-width\) solid var\(--color-focus\);/);
      expect(css).toMatch(/\.option:has\(\.choice:checked\) \{\s*background-color: var\(--color-accent\);\s*color: var\(--color-on-accent\);/);
    });
  });

  // DDR-079: while the business case is shown, the links give way to its full document, which
  // downloads as the CV does.
  describe('the full business case', () => {
    const view = render(stockPortfolioViewer!);
    const { file } = stockPortfolioViewer!.businessCase!;

    it('is a PDF beside the project’s pictures, reached by the one route a binary asset takes', () => {
      expect(file).toBe('/portfolio/stock-portfolio-viewer/stock-portfolio-viewer-business-case.pdf');
      expect(existsSync(new URL(`../public${file}`, import.meta.url))).toBe(true);
      expect(view).toContain(`href="${file}"`);
    });

    it('is each project’s own PDF on its view', () => {
      for (const project of [numisBook!, digitalTwin!, careerSite!]) {
        const projectFile = project.businessCase!.file;

        expect(projectFile).toBe(`/portfolio/${project.slug}/${project.slug}-business-case.pdf`);
        expect(existsSync(new URL(`../public${projectFile}`, import.meta.url))).toBe(true);
        expect(render(project)).toContain(`href="${projectFile}"`);
      }
    });

    it('downloads in place, as the filled pill, with its own words', () => {
      const link = view.match(new RegExp(`<a href="${file}"[^>]*>`))?.[0] ?? '';

      expect(link).toContain('download=""');
      expect(link).not.toContain('target=');
      expect(bare(view)).toContain(
        `<ul><li><a href="${file}" download=""><svg`,
      );
      expect(text(view)).toContain(projects.view.downloadBusinessCase);
    });

    it('follows the source code, which it stands in for while the business case is shown', () => {
      const shown = text(view);

      expect(shown.indexOf(projects.view.downloadBusinessCase)).toBeGreaterThan(shown.indexOf('Source code'));
      expect(view).toMatch(/<ul class="[^"]*links[^"]*overviewOnly[^"]*">/);
      expect(view).toMatch(/<ul class="[^"]*links[^"]*caseLinks[^"]*">/);
      expect(css.match(/\.caseLinks\s*\{([^}]*)\}/)?.[1]).toContain('display: none');
      // Hidden by default only if it comes after `.links`, whose `display: flex` it overrides at the
      // same specificity.
      expect(css.search(/^\.caseLinks\s*\{/m)).toBeGreaterThan(css.search(/^\.links\s*\{/m));
      expect(css).toMatch(/\.text:has\(\.caseChoice:checked\) \.overviewOnly \{\s*display: none;/);
      expect(css).toMatch(/\.text:has\(\.caseChoice:checked\) \.caseLinks \{\s*display: flex;/);
    });

    it('is on no view without a business case, whose links are as they were', () => {
      const markup = render({ ...careerSite!, businessCase: undefined });

      expect(text(markup)).not.toContain(projects.view.downloadBusinessCase);
      expect(markup).not.toContain('overviewOnly');
      expect(markup).not.toContain('download=""');
    });
  });

  it('leads back to the projects section, not the top of the page', () => {
    expect(html).toMatch(/<a [^>]*href="\/#portfolio"[^>]*>.*Back to portfolio<\/a>/);
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

  // #233: an on-premise application has no live site, so its view leads to its release instead,
  // as the second link, in a new tab, and gives way to the business case with the source code.
  it('leads to the release of a project a reader runs on their own machine', () => {
    const view = render(stockPortfolioViewer!);
    const release = 'https://github.com/aortegablasi96/stock-portfolio-viewer/releases/tag/v1.0.0';
    const overview = view.match(/<ul class="[^"]*links[^"]*overviewOnly[^"]*">.*?<\/ul>/)?.[0] ?? '';
    const links = [...overview.matchAll(/<a href="([^"]+)" class="([^"]+)"([^>]*)>/g)];

    expect(links.map(([, href]) => href)).toEqual([
      'https://github.com/aortegablasi96/stock-portfolio-viewer',
      release,
    ]);
    expect(links[1][2]).toContain('secondary');
    expect(links[1][3]).toContain('target="_blank"');
    expect(links[1][3]).toContain('rel="noopener"');
    expect(view).toContain(`aria-label="Visit release site, ${introduction.newTab}"`);

    for (const project of [numisBook!, digitalTwin!, careerSite!]) {
      expect(render(project)).not.toContain(release);
    }
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
      [...markup.matchAll(/<a ([^>]*href="\/portfolio\/[^"/]+"[^>]*)>/g)].map(([, attributes]) => ({
        href: attributes.match(/href="([^"]+)"/)?.[1],
        label: attributes.match(/aria-label="([^"]+)"/)?.[1],
      }));

    it('links to both, naming each and saying which way it leads', () => {
      const view = render(digitalTwin!, { previous: numisBook!, next: stockPortfolioViewer! });

      expect(links(view)).toEqual([
        { href: `/portfolio/${numisBook!.slug}`, label: `Previous project: ${numisBook!.name}` },
        {
          href: `/portfolio/${stockPortfolioViewer!.slug}`,
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
