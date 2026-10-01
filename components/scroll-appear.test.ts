import { describe, expect, it } from 'vitest';
import { next, showHolder, targetSelector } from './scroll-appear';

// The tests run in Node, with no DOM, so the observer's report is given as the sighting `next`
// reads, and an element as only what the component touches.
const window = 800;
const inView = { isIntersecting: true, top: 300, bottom: window };
const below = { isIntersecting: false, top: 900, bottom: window };
const above = { isIntersecting: false, top: -400, bottom: window };
const hidden = { isIntersecting: false, top: 0, bottom: window };

describe('ScrollAppear', () => {
  // DDR-090: whatever is in view when a page opens is shown at once, and whatever has been passed is
  // left shown, so a contents link, a fragment, the back button or a reload hides nothing.
  it('leaves an element in the window or above it shown when the page opens', () => {
    expect(next(undefined, inView)).toBeUndefined();
    expect(next(undefined, above)).toBeUndefined();
  });

  it('holds an element below the window back until the reader reaches it', () => {
    expect(next(undefined, below)).toBe('waiting');
    expect(next('waiting', below)).toBe('waiting');
  });

  it('starts it the moment any of it is in the window', () => {
    expect(next('waiting', inView)).toBe('now');
    expect(next('now', inView)).toBe('now');
  });

  // The owner chose to see it every time, so one that leaves through the bottom waits again, and one
  // that leaves through the top, which the reader has already read, stays shown.
  it('holds it back again once it leaves through the bottom, and not through the top', () => {
    expect(next('now', below)).toBe('waiting');
    expect(next('now', above)).toBe('now');
    expect(next(undefined, above)).toBeUndefined();
  });

  // The timeline's row and column are both in the HTML, and only one is displayed at a time.
  it('leaves an element that is not displayed as it is', () => {
    expect(next(undefined, hidden)).toBeUndefined();
    expect(next('waiting', hidden)).toBe('waiting');
  });

  it('shows the element holding keyboard focus at once', () => {
    const holder = { dataset: { appearing: 'waiting' } as { appearing?: string } };
    const focused = { closest: (selector: string) => (selector === '[data-appearing]' ? holder : null) };

    showHolder(focused as unknown as EventTarget);

    expect(holder.dataset.appearing).toBeUndefined();
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
