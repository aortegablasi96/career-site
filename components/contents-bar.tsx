'use client';

import { useSyncExternalStore, type MouseEvent, type ReactNode } from 'react';
import styles from './contents.module.css';

/**
 * How far the page has to scroll, in CSS pixels, before the bar draws its edge. The design's own
 * threshold, from the Figma Make file (`window.scrollY > 60`), per DDR-034. It is a distance the
 * page has moved rather than a length anything is drawn at, so it is not a token.
 */
export const scrolledThreshold = 60;

/** Whether the page has scrolled past the threshold. */
export function isScrolled(): boolean {
  return window.scrollY > scrolledThreshold;
}

/** Calls `onChange` whenever the page scrolls, and returns what stops it. */
export function subscribe(onChange: () => void): () => void {
  window.addEventListener('scroll', onChange, { passive: true });

  return () => window.removeEventListener('scroll', onChange);
}

/**
 * How long, in milliseconds, a contents link's glide waits for its scroll to start before it gives
 * up, per DDR-041. The browser reads `scroll-behavior` as it starts the scroll a fragment asks for —
 * Chromium while the click is still being handled, Firefox a frame or two after it — and a scroll
 * that has started runs to its end whatever the root says afterwards. So the glide ends as soon as
 * the page scrolls at all. This is only for a click that scrolls nothing, such as a section's link
 * chosen while its heading is already where the link would put it; it is a wait rather than
 * anything drawn, so it is not a token.
 */
export const glideStartTimeout = 250;

/**
 * Makes the scroll a contents link starts smooth, and only that scroll, per DDR-041.
 *
 * It marks the root with `data-gliding`, which app/globals.css turns into `scroll-behavior: smooth`
 * for a reader who has not asked for less motion, and takes the mark away once that scroll has
 * started. It does not scroll the page or cancel the click: the browser still follows the link as
 * it always has, so the address bar, the history entry and where keyboard focus starts from next
 * are the browser's own. Scrolling the link did not start — the back button, a page opened with a
 * `#fragment`, focus moving down the page — is never smooth, because the mark is not there for it.
 */
export function glide(event: Pick<MouseEvent, 'target'>): void {
  if (!(event.target instanceof Element) || !event.target.closest('a[href^="#"]')) {
    return;
  }

  const root = document.documentElement;

  const stop = () => {
    root.removeAttribute('data-gliding');
    window.removeEventListener('scroll', stop);
    window.clearTimeout(timeout);
  };

  root.setAttribute('data-gliding', '');
  window.addEventListener('scroll', stop, { passive: true });
  const timeout = window.setTimeout(stop, glideStartTimeout);
}

/** The server renders the bar at rest, which is also what a reader without script keeps. */
function isScrolledOnServer(): boolean {
  return false;
}

/**
 * The contents bar's band, per DDR-031, and the one Client Component on the site, per ADR-007.
 *
 * It exists for two things, both about scrolling: to mark the bar with `data-scrolled` once the
 * page has scrolled past the design's threshold, so contents.module.css can draw the hairline and
 * the shadow, per DDR-034; and to make the scroll a contents link starts glide rather than jump,
 * per DDR-041, which ADR-008 lets it do. Everything the bar holds is rendered by `Contents`, a Server Component, and passed in as
 * children, so the links and their words never reach the client bundle as code.
 *
 * `useSyncExternalStore` rather than state set in an effect: it reads the scroll position during
 * hydration, so a page reloaded half way down has its edge from the first frame script runs in,
 * and React re-renders only when the answer changes, not on every scroll event.
 */
export function ContentsBar({ label, children }: { label: string; children: ReactNode }) {
  const scrolled = useSyncExternalStore(subscribe, isScrolled, isScrolledOnServer);

  return (
    <nav
      aria-label={label}
      className={styles.contents}
      data-scrolled={scrolled || undefined}
      onClick={glide}
    >
      {children}
    </nav>
  );
}
