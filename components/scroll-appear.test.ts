import { describe, expect, it } from 'vitest';
import { appearLine, atEnd, cascade, next, showHolder, targetSelector } from './scroll-appear';

// The tests run in Node, with no DOM, so the observer's report is given as the sighting `next`
// reads, and an element as only what the component touches. `isIntersecting` is whether the
// element has crossed the line a tenth of the way up the window.
const window = 800;
const pastLine = { isIntersecting: true, top: 300, bottom: window };
const underLine = { isIntersecting: false, top: 760, bottom: window };
const below = { isIntersecting: false, top: 900, bottom: window };
const above = { isIntersecting: false, top: -400, bottom: window };
const hidden = { isIntersecting: false, top: 0, bottom: window };

describe('ScrollAppear', () => {
  // DDR-090: whatever is in the window when a page opens is shown at once, even below the line, and
  // whatever is above it is too, so a contents link, a fragment, the back button or a reload hides
  // nothing the reader can see.
  it('leaves an element in the window or above it shown when the page opens', () => {
    expect(next(undefined, pastLine, true)).toBeUndefined();
    expect(next(undefined, underLine, true)).toBeUndefined();
    expect(next(undefined, above, true)).toBeUndefined();
  });

  it('holds an element below the window back until it crosses the line', () => {
    expect(next(undefined, below, true)).toBe('waiting');
    expect(next('waiting', below, false)).toBe('waiting');
    expect(next('waiting', underLine, false)).toBe('waiting');
    expect(next('waiting', pastLine, false)).toBe('now');
  });

  // The owner chose once per visit, on the Content Strategist's advice: a recruiter scrolling back
  // to compare two roles meets them still.
  it('never holds an element back again once it has appeared', () => {
    expect(next('now', below, false)).toBe('now');
    expect(next(undefined, below, false)).toBeUndefined();
  });

  // The timeline's row and column are both in the HTML, and only one is displayed at a time.
  it('never holds back an element that is not displayed', () => {
    expect(next(undefined, hidden, true)).toBeUndefined();
  });

  it('starts an element a tenth of the way up the window', () => {
    expect(appearLine).toBe('0px 0px -10% 0px');
  });

  // Elements reached together follow one another in reading order, and none waits more than three
  // staggers.
  it('cascades elements that start together, four steps at most', () => {
    expect(cascade(1)).toEqual([0]);
    expect(cascade(3)).toEqual([0, 1, 2]);
    expect(cascade(6)).toEqual([0, 1, 2, 3, 3, 3]);
  });

  // An element below the line at the page's end can rise no further, so it appears there.
  it('knows when the page is scrolled to its end', () => {
    expect(atEnd(1200, 800, 2000)).toBe(true);
    expect(atEnd(1199.5, 800, 2000)).toBe(true);
    expect(atEnd(1100, 800, 2000)).toBe(false);
  });

  it('shows the element holding keyboard focus at once, out of its cascade', () => {
    const removed: string[] = [];
    const holder = {
      dataset: { appearing: 'now' } as { appearing?: string },
      style: { removeProperty: (name: string) => removed.push(name) },
    };
    const focused = { closest: (selector: string) => (selector === '[data-appearing]' ? holder : null) };

    showHolder(focused as unknown as EventTarget);

    expect(holder.dataset.appearing).toBeUndefined();
    expect(removed).toEqual(['--appear-order']);
  });

  it('ignores focus that nothing appearing holds, and a target that is not an element', () => {
    expect(() => showHolder({ closest: () => null } as unknown as EventTarget)).not.toThrow();
    expect(() => showHolder(null)).not.toThrow();
  });

  // No element appears inside another that is appearing, which would fade it twice and rise it
  // twice as far: a child that holds a container is left to the container's children.
  it('takes each child of a container that neither is nor holds one', () => {
    expect(targetSelector).toBe('[data-appear] > :not([data-appear], :has([data-appear]))');
  });
});
