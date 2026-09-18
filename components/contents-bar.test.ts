import { afterEach, describe, expect, it, vi } from 'vitest';
import { glide, glideStartTimeout, isScrolled, scrolledThreshold, subscribe } from './contents-bar';

// The tests run in Node, with no DOM, so `window` is stubbed with only what the bar reads: the
// scroll position and the two listener methods.
function stubWindow(scrollY: number) {
  const window = {
    scrollY,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    setTimeout: vi.fn(() => 7),
    clearTimeout: vi.fn(),
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

// DDR-041: a contents link's scroll glides, and nothing else's does. There is no DOM, so `Element`
// and the root are stubbed with what `glide` reads: `closest` on the target and the root's
// attribute methods.
describe('glide', () => {
  class StubElement {
    constructor(private readonly selectorMatched: boolean) {}

    closest(selector: string) {
      return this.selectorMatched && selector === 'a[href^="#"]' ? this : null;
    }
  }

  function stubDocument() {
    const root = { setAttribute: vi.fn(), removeAttribute: vi.fn() };

    vi.stubGlobal('Element', StubElement);
    vi.stubGlobal('document', { documentElement: root });

    return root;
  }

  it('marks the root when a link within the page is chosen, and unmarks it once the page scrolls', () => {
    const window = stubWindow(0);
    const root = stubDocument();

    glide({ target: new StubElement(true) as unknown as EventTarget });

    expect(root.setAttribute).toHaveBeenCalledWith('data-gliding', '');
    expect(root.removeAttribute).not.toHaveBeenCalled();

    const [[event, stop, options]] = window.addEventListener.mock.calls as unknown as [
      [string, () => void, AddEventListenerOptions],
    ];

    expect(event).toBe('scroll');
    expect(options).toEqual({ passive: true });

    stop();

    expect(root.removeAttribute).toHaveBeenCalledWith('data-gliding');
    expect(window.removeEventListener).toHaveBeenCalledWith('scroll', stop);
    expect(window.clearTimeout).toHaveBeenCalledWith(7);
  });

  // A link chosen when its section is already in place scrolls nothing, so no scroll event comes to
  // take the mark away; without the timeout the next scroll of any kind would glide.
  it('unmarks the root after a short wait if the page never scrolls', () => {
    const window = stubWindow(0);
    const root = stubDocument();

    glide({ target: new StubElement(true) as unknown as EventTarget });

    const [[stop, delay]] = window.setTimeout.mock.calls as unknown as [[() => void, number]];

    expect(delay).toBe(glideStartTimeout);

    stop();

    expect(root.removeAttribute).toHaveBeenCalledWith('data-gliding');
  });

  it('does nothing for a click on the bar that is not on a link', () => {
    const window = stubWindow(0);
    const root = stubDocument();

    glide({ target: new StubElement(false) as unknown as EventTarget });

    expect(root.setAttribute).not.toHaveBeenCalled();
    expect(window.addEventListener).not.toHaveBeenCalled();
    expect(window.setTimeout).not.toHaveBeenCalled();
  });
});
