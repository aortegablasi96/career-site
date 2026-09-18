import { afterEach, describe, expect, it, vi } from 'vitest';
import { isScrolled, scrolledThreshold, subscribe } from './contents-bar';

// The tests run in Node, with no DOM, so `window` is stubbed with only what the bar reads: the
// scroll position and the two listener methods.
function stubWindow(scrollY: number) {
  const window = {
    scrollY,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };

  vi.stubGlobal('window', window);

  return window;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ContentsBar', () => {
  // DDR-034: the design's threshold, from the Figma Make file's `window.scrollY > 60`.
  it('takes the design’s 60px as its threshold', () => {
    expect(scrolledThreshold).toBe(60);
  });

  it.each([
    { scrollY: 0, scrolled: false },
    { scrollY: 60, scrolled: false },
    { scrollY: 61, scrolled: true },
    { scrollY: 2000, scrolled: true },
  ])('is scrolled at $scrollY px: $scrolled', ({ scrollY, scrolled }) => {
    stubWindow(scrollY);

    expect(isScrolled()).toBe(scrolled);
  });

  // A passive listener cannot delay scrolling, which is the one thing a scroll listener must not do.
  it('listens to scrolling passively, and stops when it is told to', () => {
    const window = stubWindow(0);
    const onChange = () => {};

    const unsubscribe = subscribe(onChange);

    expect(window.addEventListener).toHaveBeenCalledWith('scroll', onChange, { passive: true });

    unsubscribe();

    expect(window.removeEventListener).toHaveBeenCalledWith('scroll', onChange);
  });
});
