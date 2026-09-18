import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  currentSection,
  glide,
  glideStartTimeout,
  holdDestination,
  isScrolled,
  markedSection,
  scrolledThreshold,
  settleTimeout,
  subscribe,
} from './contents-bar';

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
  // A resize is listened to as well, because it moves the sections without scrolling, per DDR-042.
  it('listens to scrolling and resizing passively, and stops when it is told to', () => {
    const window = stubWindow(0);
    const onChange = () => {};

    const unsubscribe = subscribe(onChange);

    expect(window.addEventListener).toHaveBeenCalledWith('scroll', onChange, { passive: true });
    expect(window.addEventListener).toHaveBeenCalledWith('resize', onChange, { passive: true });

    unsubscribe();

    expect(window.removeEventListener).toHaveBeenCalledWith('scroll', onChange);
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', onChange);
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

// DDR-042: the section the reader is in is the last whose top has reached the bar's clearance, and
// the last section at the foot of the page. There is no DOM, so the page is stubbed with what
// `currentSection` reads: the scroll position, the window's and the page's heights, the root's
// scroll padding and each section's top.
describe('currentSection', () => {
  const ids = ['experience', 'projects', 'skills', 'education', 'languages'];
  const clearance = 73;

  function stubPage({
    scrollY,
    tops,
    innerHeight = 800,
    scrollHeight = 6000,
    scrollPadding = `${clearance}px`,
  }: {
    scrollY: number;
    tops: Record<string, number>;
    innerHeight?: number;
    scrollHeight?: number;
    scrollPadding?: string;
  }) {
    vi.stubGlobal('window', {
      scrollY,
      innerHeight,
      getComputedStyle: () => ({ scrollPaddingBlockStart: scrollPadding }),
    });
    vi.stubGlobal('document', {
      documentElement: { scrollHeight },
      getElementById: (id: string) =>
        id in tops ? { getBoundingClientRect: () => ({ top: tops[id] }) } : null,
    });
  }

  // Each section 1000px below the last, the first starting 900px down the page.
  function topsAt(scrollY: number): Record<string, number> {
    return Object.fromEntries(ids.map((id, index) => [id, 900 + index * 1000 - scrollY]));
  }

  it('marks nothing while the reader is still in the introduction', () => {
    stubPage({ scrollY: 0, tops: topsAt(0) });

    expect(currentSection(ids)).toBeNull();
  });

  it('marks nothing until the first section’s top reaches the clearance', () => {
    stubPage({ scrollY: 900 - clearance - 2, tops: topsAt(900 - clearance - 2) });

    expect(currentSection(ids)).toBeNull();
  });

  // A contents link scrolls its section's top to the clearance, so choosing one marks it, even when
  // the section comes to rest a fraction of a pixel below the line.
  it.each([
    { id: 'experience', offset: 0 },
    { id: 'projects', offset: 0.5 },
    { id: 'skills', offset: -0.5 },
  ])('marks $id once its top is at the clearance, $offset px either way', ({ id, offset }) => {
    const scrollY = 900 + ids.indexOf(id) * 1000 - clearance - offset;

    stubPage({ scrollY, tops: topsAt(scrollY) });

    expect(currentSection(ids)).toBe(id);
  });

  it('keeps a section marked while the reader is anywhere inside it', () => {
    const scrollY = 900 + 1000 + 600;

    stubPage({ scrollY, tops: topsAt(scrollY) });

    expect(currentSection(ids)).toBe('projects');
  });

  // The last section can be too short to reach the clearance; at the foot of the page it is still
  // where the reader is.
  it('marks the last section at the foot of the page, even before its top reaches the clearance', () => {
    const scrollY = 5200;

    stubPage({
      scrollY,
      tops: { ...topsAt(scrollY), languages: 400 },
      innerHeight: 800,
      scrollHeight: 6000.4,
    });

    expect(currentSection(ids)).toBe('languages');
  });

  it('does not mark the last section a little above the foot of the page', () => {
    const scrollY = 5190;

    stubPage({
      scrollY,
      tops: { ...topsAt(scrollY), languages: 410 },
      innerHeight: 800,
      scrollHeight: 6000,
    });

    expect(currentSection(ids)).toBe('education');
  });

  it('measures from the top of the window when the root has no scroll padding', () => {
    stubPage({ scrollY: 900, tops: topsAt(900), scrollPadding: 'auto' });

    expect(currentSection(ids)).toBe('experience');
  });

  it('marks nothing when no section is on the page', () => {
    stubPage({ scrollY: 900, tops: {} });

    expect(currentSection(ids)).toBeNull();
  });
});

// DDR-042: a contents link moves the mark straight to its section, and holds it there while the
// page glides past the sections in between, until the page comes to rest. There is no DOM, so the
// window, the clicked link and the page `currentSection` measures are stubbed.
describe('holdDestination', () => {
  const ids = ['experience', 'projects', 'skills', 'education', 'languages'];

  class StubElement {
    constructor(private readonly href: string | null) {}

    closest(selector: string) {
      return this.href !== null && selector === 'a[href^="#"]' ? this : null;
    }

    getAttribute(name: string) {
      return name === 'href' ? this.href : null;
    }
  }

  // The page is at rest in Experience: its top is at the clearance, and every other section below.
  function stubPage() {
    let nextTimeout = 0;
    const window = {
      scrollY: 900,
      innerHeight: 800,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      setTimeout: vi.fn(() => ++nextTimeout),
      clearTimeout: vi.fn(),
      getComputedStyle: () => ({ scrollPaddingBlockStart: '64px' }),
    };

    vi.stubGlobal('window', window);
    vi.stubGlobal('Element', StubElement);
    vi.stubGlobal('document', {
      documentElement: { scrollHeight: 6000 },
      getElementById: (id: string) => ({
        getBoundingClientRect: () => ({ top: 64 + ids.indexOf(id) * 1000 }),
      }),
    });

    return window;
  }

  function choose(href: string | null) {
    holdDestination({ target: new StubElement(href) as unknown as EventTarget });
  }

  /** The scroll listener and the latest timeout the last journey registered. */
  function journey(window: ReturnType<typeof stubPage>) {
    const scroll = window.addEventListener.mock.calls.findLast(
      ([event]) => event === 'scroll',
    ) as unknown as [string, () => void];
    const timeout = window.setTimeout.mock.calls.at(-1) as unknown as [() => void, number];

    return { scroll: scroll[1], release: timeout[0], delay: timeout[1] };
  }

  it('marks the chosen section at once, and tells the bar', () => {
    const window = stubPage();
    const onChange = vi.fn();
    const unsubscribe = subscribe(onChange);

    expect(markedSection(ids)).toBe('experience');

    choose('#languages');

    expect(markedSection(ids)).toBe('languages');
    expect(onChange).toHaveBeenCalledTimes(1);

    journey(window).release();
    unsubscribe();
  });

  // The glide scrolls on every frame, so each scroll restarts the wait, and the page is taken to
  // have come to rest once it has not scrolled for `settleTimeout`.
  it('holds the mark while the page is scrolling, and lets it go once the page comes to rest', () => {
    const window = stubPage();
    const onChange = vi.fn();
    const unsubscribe = subscribe(onChange);

    choose('#languages');

    const { scroll } = journey(window);

    scroll();
    scroll();

    expect(markedSection(ids)).toBe('languages');

    const { release, delay } = journey(window);

    expect(delay).toBe(settleTimeout);

    release();

    expect(markedSection(ids)).toBe('experience');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(window.removeEventListener).toHaveBeenCalledWith('scroll', scroll);

    unsubscribe();
  });

  // A link chosen when its section is already in place scrolls nothing, so no scroll comes to
  // restart the wait; it is let go after the same wait `glide` gives it.
  it('lets the mark go after a short wait if the page never scrolls', () => {
    const window = stubPage();

    choose('#experience');

    const { release, delay } = journey(window);

    expect(delay).toBe(glideStartTimeout);

    release();

    expect(markedSection(ids)).toBe('experience');
  });

  it('lets a second link chosen on the way take over the journey', () => {
    const window = stubPage();

    choose('#languages');

    const first = journey(window);

    choose('#skills');

    expect(markedSection(ids)).toBe('skills');
    expect(window.removeEventListener).toHaveBeenCalledWith('scroll', first.scroll);

    journey(window).release();

    expect(markedSection(ids)).toBe('experience');
  });

  it('does nothing for a click on the bar that is not on a link', () => {
    const window = stubPage();

    choose(null);

    expect(markedSection(ids)).toBe('experience');
    expect(window.addEventListener).not.toHaveBeenCalled();
    expect(window.setTimeout).not.toHaveBeenCalled();
  });
});
