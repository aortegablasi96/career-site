import { existsSync, readFileSync, statSync } from 'node:fs';
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
      // The one control a view without a business case has is its picture's, per DDR-082.
      expect(plain.replace(/<button [^>]*command="[^"]*"[^>]*>.*?<\/button>/g, '')).not.toContain('<button');
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
          `<div aria-live="polite">${items.map(({ label, text, icon, headline }) => `<div role="group" aria-label="${label}"><p>${label}</p><div><span aria-hidden="true">${icon}</span><h2>${headline}</h2></div><p>${text.replaceAll('&', '&amp;')}</p></div>`).join('')}</div>`,
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
      new RegExp(
        `<figure[^>]*><div[^>]*><img [^>]*>[\\s\\S]*?</dialog><figcaption[^>]*>${numisBook!.caption}</figcaption></figure>`,
      ),
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

  // DDR-053's gallery, laid out as DDR-081 draws it: thumbnails under the lead picture, and the
  // chosen one shown in the lead's place, held by native radios per ADR-017. NumisBook has one; the
  // stand-in items below exercise what it does not, a video and a gallery of any length.
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
    const third: GalleryItem = {
      media: { file: '/gallery-collections.webp', alt: 'The collections, each with its coins' },
      caption: 'Collections',
    };
    const withGallery = (gallery: readonly GalleryItem[]) => render({ ...numisBook!, gallery });

    /** The pictures' radios, in the markup's order. */
    const radios = (markup: string) =>
      [...markup.matchAll(/<input [^>]*name="picture"[^>]*>/g)].map(([tag]) => tag);

    /** The thumbnails, in the markup's order, as the radio each chooses, its name and its file. */
    const thumbnails = (markup: string) =>
      [
        ...markup.matchAll(
          /<label for="(picture-\d+)"[^>]*><span [^>]*aria-hidden="true">([^<]*)<\/span><img [^>]*src="([^"]*)" alt=""\/><\/label>/g,
        ),
      ].map(([, target, name, source]) => ({ target, name, source }));

    /** A rule's body, by its whole selector. */
    const rule = (selector: string) =>
      css.match(new RegExp(`(?:^|\\})\\s*${selector.replace(/[.:+()]/g, '\\$&')}\\s*\\{([^}]*)\\}`))?.[1] ?? '';

    it('leaves a view whose project has no gallery media as it was: the lead picture alone', () => {
      for (const project of projects.projects.filter(({ gallery }) => !gallery)) {
        expect(radios(render(project))).toHaveLength(0);
        expect(render(project)).toContain(`<figcaption class="`);
      }

      expect(withGallery([])).toBe(render({ ...numisBook!, gallery: undefined }));
    });

    // The owner's pictures, supplied on #244: each is a file the site carries, reached by its own
    // path, within the budget ADR-004 sets for a still, as a lead picture is.
    it('shows NumisBook’s gallery, each picture a file within the budget for a still', () => {
      const gallery = numisBook!.gallery ?? [];

      expect(gallery).toHaveLength(6);
      expect(radios(html)).toHaveLength(7);
      for (const { media, caption } of gallery) {
        const bytes = statSync(new URL(`../public${media.file}`, import.meta.url)).size;

        expect(bytes).toBeLessThanOrEqual(150 * 1024);
        expect('alt' in media && media.alt.length).toBeTruthy();
        expect(text(html)).toContain(caption.replace(/’/g, '’'));
      }
    });

    it('draws no "Gallery" heading, and keeps one h1', () => {
      const markup = withGallery([picture, video, third]);

      expect(markup).not.toMatch(new RegExp(`<h2[^>]*>${projects.view.gallery}</h2>`));
      expect(markup.match(/<h1/g)).toHaveLength(1);
    });

    // DDR-081: the pictures are one choice among several, the lead first and checked, each named
    // by its caption, so assistive technology hears the picture's words and its place in the set.
    it('is a radio group named for the gallery, the lead first and checked, each named by its caption', () => {
      const markup = withGallery([picture, video]);
      const found = radios(markup);

      expect(markup).toContain(`role="radiogroup" aria-label="${projects.view.gallery}"`);
      expect(found).toHaveLength(3);
      expect(found[0]).toContain('checked=""');
      for (const [index, tag] of found.entries()) {
        expect(tag).toContain('type="radio"');
        expect(tag).toContain(`id="picture-${index}"`);
        expect(tag).toContain(`aria-labelledby="picture-${index}-caption"`);
        if (index > 0) expect(tag).not.toContain('checked');
      }

      for (const [index, caption] of [numisBook!.caption, picture.caption, video.caption].entries()) {
        expect(bare(markup)).toContain(`<figcaption id="picture-${index}-caption">${caption}</figcaption>`);
      }
    });

    // ADR-017: a figure's radio is its previous sibling, which is what lets one stylesheet rule show
    // the checked picture and hide the rest, for any number of pictures.
    it('puts each picture’s radio immediately before its figure, in the order the content gives', () => {
      const markup = bare(withGallery([picture, video]));
      const alt = 'alt' in picture.media ? picture.media.alt : '';

      expect(markup).toMatch(
        new RegExp(
          `<input [^>]*id="picture-1"[^>]*/><figure><div><img [^>]*alt="${alt}"/><button [\\s\\S]*?</dialog><figcaption id="picture-1-caption">${picture.caption}</figcaption></figure><input [^>]*id="picture-2"`,
        ),
      );
      expect(rule('.pick:not(:checked) + .figure')).toContain('display: none');
      expect(rule('.pick:focus-visible + .figure .media')).toContain('outline:');
    });

    // DDR-081, as the owner asked on #244: every picture's thumbnail is in the row, in the order
    // the content gives, and nothing hides any of them.
    it('shows every picture’s thumbnail, the lead first, with no count', () => {
      const markup = withGallery([picture, video, third]);

      expect(thumbnails(markup).map(({ target }) => target)).toEqual([
        'picture-0',
        'picture-1',
        'picture-2',
        'picture-3',
      ]);
      expect(markup).not.toContain('<details');
    });

    // DDR-081, as the owner asked on #244: the chosen thumbnail rises with its picture's name above
    // it, so the name moves there from under the frame. It is the caption, hidden from assistive
    // technology on the thumbnail because the radio is already named by it.
    it('names each thumbnail by its caption, which the frame no longer shows', () => {
      const markup = withGallery([picture, video]);

      expect(thumbnails(markup).map(({ name }) => name)).toEqual([
        numisBook!.caption.replace(/’/g, '’'),
        picture.caption,
        video.caption,
      ]);
      expect(rule('.pictureCaption')).toContain('display: none');
      expect(markup).toMatch(/<figcaption id="picture-0-caption" class="[^"]*pictureCaption/);
      // A project without a gallery keeps its caption under its picture.
      expect(render(digitalTwin!)).toMatch(/<figcaption class="[^"]*caption/);
    });

    // The chosen thumbnail is found by place, one rule for each of twelve, because its radio is
    // beside its picture rather than beside it. Every gallery must fit: a thirteenth picture would
    // never rise.
    it('raises the chosen thumbnail for every picture a gallery may hold', () => {
      for (let place = 1; place <= 12; place += 1) {
        expect(css).toContain(
          `.pictures:has(.pick:nth-of-type(${place}):checked) .thumbnail:nth-of-type(${place})`,
        );
      }
      expect(css).not.toContain('.pick:nth-of-type(13)');
      for (const { gallery = [] } of projects.projects) {
        expect(gallery.length + 1).toBeLessThanOrEqual(12);
      }
    });

    // One thumbnail is raised: the pointer's while the pointer is on the row, the chosen one
    // otherwise. It comes to the front and shows its name; it moves only where motion is welcome.
    it('raises one thumbnail at a time, and moves it only where motion is welcome', () => {
      expect(rule('.thumbnail')).toContain('z-index: var(--raised)');
      expect(rule('.thumbnailName')).toContain('opacity: var(--raised)');
      expect(rule('.thumbnail:hover')).toContain('--pointed: 1');
      expect(rule('.pictures:has(.thumbnail:hover)')).toContain('--pointing: 1');
      expect(css).toMatch(
        /@media \(prefers-reduced-motion: no-preference\) \{\s*\.thumbnail \{\s*translate: 0 calc\(var\(--raised\) \* var\(--project-view-thumbnail-lift-back\)\);/,
      );
      expect(css.replace(/@media \(prefers-reduced-motion[\s\S]*?\n\}/g, '')).not.toMatch(/translate:[^;]*raised/);
    });

    // A thumbnail shows its own picture, or a video's poster, and says nothing: the radio is named
    // by the caption and the picture in the frame carries the alternative text.
    it('shows each picture, or a video’s poster, as its thumbnail, saying nothing twice', () => {
      expect(thumbnails(withGallery([picture, video])).map(({ source }) => source)).toEqual([
        numisBook!.media.file,
        '/gallery-picture.webp',
        '/gallery-walkthrough.webp',
      ]);
    });

    // DDR-010 and ADR-004: nothing is fetched until someone presses play, and the poster is what is
    // seen until then.
    it('leaves a video unplayed and unfetched until the reader starts it', () => {
      const element = withGallery([video]).match(/<video[^>]*>/)?.[0] ?? '';
      const description = 'poster' in video.media ? video.media.description : '';

      expect(element).toContain('preload="none"');
      expect(element).toContain('controls=""');
      expect(element).toContain('poster="/gallery-walkthrough.webp"');
      expect(element).toContain(`aria-label="${description}"`);
      expect(element).not.toContain('autoplay');
    });

    // Every path a picture or video is reached by goes through `asset()`, per ADR-004, so it
    // resolves under the Pages base path as well as locally. `components/assets.test.ts` holds
    // every attribute in `components/` to it; this holds the gallery's own.
    it('reaches each file by the one route a binary asset takes', () => {
      expect(withGallery([picture])).toContain('src="/gallery-picture.webp"');
      expect(withGallery([video])).toContain('src="/gallery-walkthrough.mp4"');
    });

    // DDR-081: the thumbnails overlap, each over the one before, and wrap, centred under the
    // picture, inside a row that isolates them from the contents bar.
    it('draws the row centred under the picture, overlapping and wrapping', () => {
      expect(rule('.thumbnails')).toContain('flex-wrap: wrap');
      expect(rule('.thumbnails')).toContain('justify-content: center');
      expect(rule('.thumbnails')).toContain('isolation: isolate');
      expect(rule('.thumbnails')).toContain('padding-inline-start: var(--project-view-thumbnail-overlap)');
      expect(rule('.thumbnail')).toContain('margin-inline-start: var(--project-view-thumbnail-overlap-back)');
      expect(rule('.thumbnailImage')).toContain('box-sizing: border-box');
      expect(rule('.thumbnailImage')).toContain('object-fit: cover');
    });
  });

  // DDR-052: the projects on either side of this one, at the foot of the view.
  // DDR-082 and ADR-018, on #246: the picture in the lead's frame opens larger in a native modal
  // dialog, opened and closed by its buttons' commands, with no script.
  describe('the picture larger', () => {
    const video: GalleryItem = {
      media: {
        file: '/gallery-walkthrough.mp4',
        poster: '/gallery-walkthrough.webp',
        description: 'A walkthrough of the application, from signing in to adding a coin',
      },
      caption: 'Walkthrough demo',
    };

    /** Each control that opens a picture larger, as the dialog it opens and its name. */
    const openers = (markup: string) =>
      [
        ...markup.matchAll(
          /<button type="button"[^>]*commandfor="([^"]+)" command="show-modal" aria-label="([^"]*)">/g,
        ),
      ].map(([, target, name]) => ({ target, name }));

    /**
     * Each larger picture, as its id, the dialog's name, its close control, its picture, its caption,
     * where it stands among the gallery's, and the controls that step to its neighbours, per DDR-083.
     */
    const dialogs = (markup: string) =>
      [...markup.matchAll(/<dialog id="([^"]+)"[^>]*aria-labelledby="([^"]+)">([\s\S]*?)<\/dialog>/g)].map(
        ([, id, labelledBy, body]) => {
          const [, closes, close] =
            body!.match(/^<button type="button"[^>]*commandfor="([^"]+)" command="close" aria-label="([^"]*)">/) ?? [];
          const [, source, alt] = body!.match(/<\/button><img [^>]*src="([^"]*)" alt="([^"]*)"\/>/) ?? [];
          const [, captionId, caption] = body!.match(/<p id="([^"]+-caption)"[^>]*>([^<]*)<\/p>/) ?? [];
          const [, positionId, position] = body!.match(/<p id="([^"]+-position)"[^>]*>([^<]*)<\/p>/) ?? [];
          const steps = [
            ...body!.matchAll(/<button type="button"[^>]*commandfor="([^"]+)" command="--show-in-place" aria-label="([^"]*)">/g),
          ].map(([, target, name]) => ({ target, name }));

          return { id, labelledBy, closes, close, source, alt, captionId, caption, positionId, position, steps };
        },
      );

    it('opens every view’s lead picture, with its alternative text, its caption and a way to close it', () => {
      for (const project of projects.projects) {
        const markup = render(project);
        const [larger] = dialogs(markup);
        const media = project.media;

        expect('alt' in media).toBe(true);
        expect(openers(markup)[0]).toEqual({ target: larger!.id, name: projects.view.enlarge });
        expect(larger).toMatchObject({
          closes: larger!.id,
          close: projects.view.close,
          labelledBy: project.gallery ? `${larger!.captionId} ${larger!.positionId}` : larger!.captionId,
          source: 'alt' in media ? media.file : '',
          alt: 'alt' in media ? media.alt : '',
          caption: project.caption,
        });
      }
    });

    it('opens whichever picture of a gallery is shown, each by its own control, and no video', () => {
      const markup = render({ ...numisBook!, gallery: [...numisBook!.gallery!, video] });
      const pictures = [{ media: numisBook!.media, caption: numisBook!.caption }, ...numisBook!.gallery!];
      const ids = dialogs(markup).map(({ id }) => id);

      expect(openers(markup).map(({ target }) => target)).toEqual(ids);
      expect(new Set(ids).size).toBe(pictures.length);
      expect(dialogs(markup).map(({ caption }) => caption)).toEqual(pictures.map(({ caption }) => caption));
      // Each control is inside its picture's figure, so the figure a radio hides hides its control.
      for (const id of ids) {
        expect(bare(markup)).toMatch(
          new RegExp(`<figure><div><img [^>]*/><button [^>]*commandfor="${id}"[^>]*>[\\s\\S]*?</dialog><figcaption`),
        );
      }
      expect(markup).not.toContain(`src="${video.media.file}" alt=`);
    });

    // DDR-083 and ADR-019, on #250: a gallery's larger picture steps to the pictures before and after
    // it, in the thumbnails' order and in a loop, and says where it stands among them.
    it('steps from each picture of a gallery to the one before and after it, in a loop, saying where it stands', () => {
      const larger = dialogs(html);
      const count = larger.length;

      expect(count).toBe(1 + numisBook!.gallery!.length);
      larger.forEach(({ id, labelledBy, captionId, positionId, position, steps }, place) => {
        expect(labelledBy).toBe(`${captionId} ${positionId}`);
        expect(position).toBe(projects.view.position(place + 1, count));
        expect(steps).toEqual([
          { target: larger[(place + count - 1) % count]!.id, name: projects.view.previousPicture },
          { target: larger[(place + 1) % count]!.id, name: projects.view.nextPicture },
        ]);
        expect(id).toBe(`picture-${place}-larger`);
      });
      // In the markup's order, which is the visual order: the caption stands between the two controls.
      expect(bare(html)).toMatch(
        /<\/button><img [^>]*\/><div><button [^>]*aria-label="Previous picture">[\s\S]*?<\/button><div><p id="picture-0-larger-caption">[^<]*<\/p><p id="picture-0-larger-position">[^<]*<\/p><\/div><button [^>]*aria-label="Next picture">/,
      );
    });

    it('passes over a gallery’s video, which opens nothing larger, and counts only the pictures', () => {
      const markup = render({ ...numisBook!, gallery: [numisBook!.gallery![0]!, video, numisBook!.gallery![1]!] });
      const larger = dialogs(markup);

      expect(larger.map(({ id }) => id)).toEqual(['picture-0-larger', 'picture-1-larger', 'picture-3-larger']);
      expect(larger[1]!.steps.map(({ target }) => target)).toEqual(['picture-0-larger', 'picture-3-larger']);
      expect(larger.map(({ position }) => position)).toEqual(['1 of 3', '2 of 3', '3 of 3']);
      expect(larger[2]!.position).toBe(projects.view.position(3, 3));
    });

    it('gives a lone picture no controls to step and no place, and a gallery of one picture and a video none either', () => {
      const lone = dialogs(render(digitalTwin!));
      const withVideo = dialogs(render({ ...numisBook!, gallery: [video] }));

      for (const [larger] of [lone, withVideo]) {
        expect(larger!.steps).toEqual([]);
        expect(larger!.position).toBeUndefined();
        expect(larger!.labelledBy).toBe(larger!.captionId);
      }
    });

    // ADR-018: the view stays a Server Component, and the movement is the one thing in it that
    // needs script, which the larger picture's own Client Component holds.
    it('stays a Server Component, and leaves the movement to the larger picture’s own component', () => {
      const source = readFileSync(new URL('./project-view.tsx', import.meta.url), 'utf8');

      expect(source).not.toMatch(/['"]use client['"]/);
      expect(source).not.toMatch(/\bon[A-Z]\w*=/);
      expect(source).toMatch(/import \{ LargerPicture, [^}]*\} from '\.\/larger-picture';/);
    });
  });

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
