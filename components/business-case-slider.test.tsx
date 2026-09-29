import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { projects } from '@/content/projects';
import type { BusinessCaseItem } from '@/content/types';
import { BusinessCaseSlider, step } from './business-case-slider';

// DDR-080: a project's business case as a card that shows one item at a time. The markup is read
// as the server renders it, which is what a reader meets before hydration and without script; what
// the controls do is `step`, and the browser checks on #240.
const { items } = projects.projects[0]!.businessCase!;
const { previousItem, nextItem } = projects.view;

function render(slides: readonly BusinessCaseItem[] = items): string {
  return renderToStaticMarkup(
    <BusinessCaseSlider items={slides} previous={previousItem} next={nextItem} />,
  );
}

const html = render();

/** The markup without its classes, which the CSS-module stub hashes, so its elements can be read in order. */
const bare = (markup: string) => markup.replace(/ class="[^"]*"/g, '');

/** The stylesheet without its comments, so a rule is not matched against its explanation. */
const css = readFileSync(new URL('./business-case-slider.module.css', import.meta.url), 'utf8').replace(
  /\/\*[\s\S]*?\*\//g,
  '',
);

/** A rule's body, by its selector as written. */
const rule = (selector: string) =>
  css.match(new RegExp(`(?:^|\\})\\s*${selector.replace(/[.[\]]/g, '\\$&')}\\s*\\{([^}]*)\\}`))?.[1] ?? '';

describe('step', () => {
  it('moves one item either way', () => {
    expect(step(0, 1, 5)).toBe(1);
    expect(step(3, -1, 5)).toBe(2);
  });

  // The items are a loop, per DDR-080, so neither control is ever spent.
  it('leads from the last item to the first, and from the first to the last', () => {
    expect(step(4, 1, 5)).toBe(0);
    expect(step(0, -1, 5)).toBe(4);
  });
});

describe('BusinessCaseSlider', () => {
  it('has every item in the markup, in the owner’s order, each a group named for its label', () => {
    const groups = [...html.matchAll(/role="group" aria-label="([^"]*)"/g)].map(([, label]) => label);

    expect(groups).toEqual(items.map(({ label }) => label));
  });

  it('shows the first item, and only the first, before any control is pressed', () => {
    const slides = [...html.matchAll(/<div role="group"[^>]*class="([^"]*)"/g)].map(([, name]) => name);

    expect(slides).toHaveLength(items.length);
    expect(slides[0]).toMatch(/shown/);
    expect(slides.slice(1).filter((name) => /shown/.test(name))).toEqual([]);
  });

  it('announces the item a control shows, politely', () => {
    expect(html).toContain('aria-live="polite"');
  });

  it('steps with two buttons whose words are their names, "Prev" first and "Next" last', () => {
    const buttons = [...bare(html).matchAll(/<button[^>]*>(.*?)<\/button>/g)].map(([button]) => button);

    expect(buttons).toHaveLength(items.length + 2);
    expect(buttons[0]).toMatch(new RegExp(`^<button type="button"><svg[^]*</svg>${previousItem}</button>$`));
    expect(buttons.at(-1)).toMatch(new RegExp(`^<button type="button">${nextItem}<svg[^]*</svg></button>$`));
  });

  it('has a dot for each item between them, named for its item, marking the one shown', () => {
    const dots = [...html.matchAll(/<button type="button"[^>]*aria-label="([^"]*)"([^>]*)>/g)];

    expect(dots.map(([, label]) => label)).toEqual(items.map(({ label }) => label));
    expect(dots[0]![2]).toContain('aria-current="true"');
    expect(dots.slice(1).filter(([, , rest]) => rest!.includes('aria-current'))).toEqual([]);
    expect(bare(html)).toMatch(/<\/button><ul><li><button/);
  });

  // No project's entry fills them yet, so a slide is its label and its text alone, with nothing
  // drawn where the rest would be.
  it('draws no icon, headline or figure the owner has left empty', () => {
    expect(html).not.toContain('<h2');
    expect(html).not.toContain('aria-hidden="true">');
    expect(bare(html)).toContain(`<p>${items[0]!.label}</p><p>${items[0]!.text}</p></div>`);
  });

  it('draws each part the owner fills, the headline as an h2 and the icon unannounced', () => {
    const filled = bare(
      render([
        { ...items[0]!, icon: '⚠️', headline: 'A headline', figure: { value: '3', caption: 'a caption' } },
        ...items.slice(1),
      ]),
    );

    expect(filled).toContain(
      `<p>${items[0]!.label}</p><div><span aria-hidden="true">⚠️</span><h2>A headline</h2></div>` +
        `<p>${items[0]!.text}</p><p><span>3</span><span>a caption</span></p></div>`,
    );
  });

  it('draws a headline without an icon, and an icon without a headline', () => {
    expect(bare(render([{ ...items[0]!, headline: 'Alone' }]))).toContain('<div><h2>Alone</h2></div>');
    expect(bare(render([{ ...items[0]!, icon: '⚠️' }]))).toContain(
      '<div><span aria-hidden="true">⚠️</span></div>',
    );
  });

  // Every item takes the one cell, so the card is as tall as its tallest item and the controls stay
  // put; the items not shown keep their room but leave the accessibility tree and the tab order.
  it('stacks every item in one cell and draws only the one shown', () => {
    expect(rule('.items')).toContain('display: grid');
    expect(rule('.item')).toContain('grid-area: 1 / 1');
    expect(rule('.item')).toContain('visibility: hidden');
    expect(rule('.shown')).toContain('visibility: visible');
  });

  it('shows every item and no controls to a reader without script', () => {
    const block = css.match(/@media \(scripting: none\) \{([\s\S]*?)\n\}/)?.[1] ?? '';

    expect(block).toMatch(/\.item \{\s*grid-area: auto;\s*visibility: visible;/);
    expect(block).toMatch(/\.controls \{\s*display: none;/);
  });

  it('marks the item shown by its dot’s state, not a class of its own', () => {
    expect(css).toMatch(/\.dot\[aria-current\] \{\s*inline-size: var\(--business-case-dot-current\);\s*background-color: var\(--color-accent\);/);
  });

  it('answers the pointer and the keyboard on every control, per DDR-035', () => {
    expect(css).toMatch(/\.step:hover,\s*\.step:focus-visible \{/);
    expect(css).toMatch(/\.dot:hover,\s*\.dot:focus-visible \{/);
  });
});
