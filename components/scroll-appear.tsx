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

/** What the observer reports of an element: whether any of it is in the window, and where it is. */
export interface Sighting {
  isIntersecting: boolean;
  /** The element's top edge, from the top of the window. */
  top: number;
  /** The window's height, where the element's top would have to be to have left through the bottom. */
  bottom: number;
}

/**
 * The state an element moves to on a sighting, per DDR-090.
 *
 * An element that was waiting appears the moment any of it is in the window. One that leaves
 * through the bottom of the window waits again, so it appears each time the reader comes back down
 * to it. One that leaves through the top, or is in the window when the page opens, keeps its
 * state: nothing the reader has already been shown is hidden, and nothing they arrive at by a
 * contents link, a fragment, the back button or a reload waits for a scroll to show it.
 *
 * An element that is not displayed reports a top of zero and is never in the window, so it keeps
 * its state too; that is how the timeline's row and column, only one of which is ever displayed,
 * leave the other alone.
 */
export function next(state: Appearing, { isIntersecting, top, bottom }: Sighting): Appearing {
  if (isIntersecting) return state === 'waiting' ? 'now' : state;

  return top >= bottom ? 'waiting' : state;
}

/** The part of an element this component reads and writes. */
interface Target {
  dataset: { appearing?: string };
}

/** Sets an element's state, removing the attribute once it is simply shown. */
function set(target: Target, state: Appearing): void {
  if (state) target.dataset.appearing = state;
  else delete target.dataset.appearing;
}

/**
 * Shows the element that holds a focused one at once, with no movement, so keyboard focus never
 * rests on an element that is hidden or still appearing: the browser scrolls a focused element into
 * the window, and the observer would only then start it.
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
  const observer = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting, boundingClientRect, rootBounds } of entries) {
      const element = target as HTMLElement;
      const sighting = {
        isIntersecting,
        top: boundingClientRect.top,
        bottom: rootBounds?.bottom ?? window.innerHeight,
      };

      set(element, next(element.dataset.appearing as Appearing, sighting));
    }
  });
  const onEvent = (event: Event) => showHolder(event.target);
  // At the end of its appearance the attribute goes, so the movement cannot replay on its own, as
  // it would if anything later set its animation again. Only the appearance's own end: a
  // descendant's animation ending bubbles here too.
  const finished = (event: AnimationEvent) => {
    const target = event.target as HTMLElement;

    if (target.dataset?.appearing === 'now') set(target, undefined);
  };

  for (const target of targets) observer.observe(target);
  document.addEventListener('focusin', onEvent);
  document.addEventListener('animationend', finished);
  document.addEventListener('animationcancel', finished);

  return () => {
    observer.disconnect();
    document.removeEventListener('focusin', onEvent);
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
