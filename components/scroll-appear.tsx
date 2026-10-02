'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * The attribute that makes an element's children appear as the reader scrolls to them, per DDR-090.
 * A section, its heading's block, a timeline and a view carry it; each child appears on its own.
 */
export const containerAttribute = 'data-appear';

/**
 * Every element that appears on its own: a child of a container that is neither a container itself
 * nor holds one. A child that holds one is left to its own children, so no element ever appears
 * inside another that is appearing, which would fade it twice and rise it twice as far.
 */
export const targetSelector = '[data-appear] > :not([data-appear], :has([data-appear]))';

/**
 * Where an element is in its appearance, as `data-appearing` holds it: waiting below the window,
 * appearing now, or, with no attribute, simply shown. The stylesheet hides and moves only the first
 * two, and only where motion is welcome, on a screen.
 */
export type Appearing = 'waiting' | 'now' | undefined;

/**
 * Where an element starts to appear, per DDR-090: once it has risen a tenth of the way up the
 * window, rather than at its first pixel, so the reader sees it happen rather than at the window's
 * foot, where nobody is looking.
 */
export const appearLine = '0px 0px -10% 0px';

/** How many elements reached together follow one another, per DDR-090; the rest start with the last. */
export const cascadeSteps = 4;

/** What the observer reports of an element: whether it has crossed the line, and where it is. */
export interface Sighting {
  /** Whether any of it is above the line it appears at. */
  isIntersecting: boolean;
  /** The element's top edge, from the top of the window. */
  top: number;
  /** The window's height, which the element's top is at or below while it is below the window. */
  bottom: number;
}

/**
 * The state an element moves to on a sighting, per DDR-090. It appears once per visit.
 *
 * On its first sighting, an element waits only if it is wholly below the window. One in the window
 * when the page opens, or above it, is simply shown: nothing the reader can see is hidden, and
 * nothing they arrive at by a contents link, a fragment, the back button or a reload waits for a
 * scroll to show it. That includes one in the window's lowest tenth, below the line.
 *
 * A waiting element appears once it crosses the line, and is then shown for the rest of the visit.
 * One that a single scroll carries from below the window to above it never crosses the line, so the
 * observer never reports it; `watch` shows it on the scroll instead.
 * An element that is not displayed reports a top of zero, so it is never held back; that is how the
 * timeline's row and column, only one of which is ever displayed, leave the other alone.
 */
export function next(
  state: Appearing,
  { isIntersecting, top, bottom }: Sighting,
  first: boolean,
): Appearing {
  if (first) return !isIntersecting && top >= bottom ? 'waiting' : undefined;

  return state === 'waiting' && isIntersecting ? 'now' : state;
}

/**
 * Each element's place in a cascade, per DDR-090: elements that start together follow one another
 * in reading order, one stagger apart, and from the last step on start together, so none waits
 * more than three staggers.
 */
export function cascade(count: number): number[] {
  return Array.from({ length: count }, (_, index) => Math.min(index, cascadeSteps - 1));
}

/**
 * Whether the page is scrolled to its end, where an element below the line can rise no further and
 * would never appear: there it appears as soon as any of it is in the window.
 */
export function atEnd(scrollY: number, innerHeight: number, scrollHeight: number): boolean {
  return scrollY + innerHeight >= scrollHeight - 1;
}

/** The part of an element this component reads and writes. */
interface Target {
  dataset: { appearing?: string };
  style: { removeProperty(name: string): unknown };
}

/** Sets an element's state, removing the attribute and its place in a cascade once it is shown. */
function set(target: Target, state: Appearing): void {
  if (state) {
    target.dataset.appearing = state;
  } else {
    delete target.dataset.appearing;
    target.style.removeProperty('--appear-order');
  }
}

/**
 * Shows the element that holds a focused one at once, with no movement, so keyboard focus never
 * rests on an element that is hidden, still appearing or waiting its turn in a cascade: the browser
 * scrolls a focused element into the window, and the observer would only then start it.
 */
export function showHolder(target: EventTarget | null): void {
  const closest = (target as Partial<Element> | null)?.closest;
  const holder = closest?.call(target, '[data-appearing]') as HTMLElement | null | undefined;

  if (holder) set(holder, undefined);
}

/**
 * Watches every element that appears on the page now in the document, and returns what stops it,
 * which also shows everything it hid.
 */
export function watch(document: Document): () => void {
  const targets = [...document.querySelectorAll<HTMLElement>(targetSelector)];
  const seen = new Set<Element>();

  // Starts elements together, in reading order, each at its place in the cascade. Once started, an
  // element is shown for the rest of the visit, so it is no longer watched.
  const start = (elements: HTMLElement[]) => {
    const order = cascade(elements.length);

    elements
      .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
      .forEach((element, index) => {
        element.style.setProperty('--appear-order', String(order[index]));
        set(element, 'now');
        observer.unobserve(element);
      });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const starting: HTMLElement[] = [];

      for (const { target, isIntersecting, boundingClientRect } of entries) {
        const element = target as HTMLElement;
        const state = element.dataset.appearing as Appearing;
        const sighting = { isIntersecting, top: boundingClientRect.top, bottom: window.innerHeight };
        const after = next(state, sighting, !seen.has(element));

        seen.add(element);

        if (after === 'now') {
          starting.push(element);
        } else {
          set(element, after);
          if (!after) observer.unobserve(element);
        }
      }

      start(starting);
    },
    { rootMargin: appearLine },
  );

  // The observer reports only a change of crossing, so two cases are found here. One scroll that
  // carries a waiting element from below the window to wholly above it, such as a jump to a far
  // section, never crosses it: it has been passed, so it is shown at once, with no movement. And at
  // the page's end, whatever is waiting in the window appears, since it cannot rise to the line.
  const onScroll = () => {
    const end = atEnd(window.scrollY, window.innerHeight, document.documentElement.scrollHeight);
    const starting: HTMLElement[] = [];

    for (const target of targets) {
      if (target.dataset.appearing !== 'waiting') continue;

      const { top, bottom } = target.getBoundingClientRect();

      if (bottom <= 0) {
        set(target, undefined);
        observer.unobserve(target);
      } else if (end && top < window.innerHeight) {
        starting.push(target);
      }
    }

    start(starting);
  };
  const onFocus = (event: Event) => showHolder(event.target);
  // At the end of its appearance the attribute goes, so the movement cannot replay on its own, as
  // it would if anything later set its animation again. Only the appearance's own end: a
  // descendant's animation ending bubbles here too.
  const finished = (event: AnimationEvent) => {
    const target = event.target as HTMLElement;

    if (target.dataset?.appearing === 'now') set(target, undefined);
  };

  for (const target of targets) observer.observe(target);
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('focusin', onFocus);
  document.addEventListener('animationend', finished);
  document.addEventListener('animationcancel', finished);

  return () => {
    observer.disconnect();
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('focusin', onFocus);
    document.removeEventListener('animationend', finished);
    document.removeEventListener('animationcancel', finished);
    for (const target of targets) set(target, undefined);
  };
}

/**
 * Makes the page's elements appear as the reader scrolls to them, per DDR-090 and ADR-025. It
 * renders nothing: the page is served with every element shown, so a reader without script, and
 * one who prints, sees it whole, and this only hides what is still below the window once the page
 * is running. It watches the page afresh each time the route changes, since the layout it sits in
 * stays while a link moves between the page and a view.
 */
export function ScrollAppear() {
  const pathname = usePathname();

  useEffect(() => watch(document), [pathname]);

  return null;
}
