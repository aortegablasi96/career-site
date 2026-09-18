'use client';

import { useSyncExternalStore, type ReactNode } from 'react';
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

/** The server renders the bar at rest, which is also what a reader without script keeps. */
function isScrolledOnServer(): boolean {
  return false;
}

/**
 * The contents bar's band, per DDR-031, and the one Client Component on the site, per ADR-007.
 *
 * It exists for one thing: to mark the bar with `data-scrolled` once the page has scrolled past
 * the design's threshold, so contents.module.css can draw the hairline and the shadow, per
 * DDR-034. Everything the bar holds is rendered by `Contents`, a Server Component, and passed in as
 * children, so the links and their words never reach the client bundle as code.
 *
 * `useSyncExternalStore` rather than state set in an effect: it reads the scroll position during
 * hydration, so a page reloaded half way down has its edge from the first frame script runs in,
 * and React re-renders only when the answer changes, not on every scroll event.
 */
export function ContentsBar({ label, children }: { label: string; children: ReactNode }) {
  const scrolled = useSyncExternalStore(subscribe, isScrolled, isScrolledOnServer);

  return (
    <nav aria-label={label} className={styles.contents} data-scrolled={scrolled || undefined}>
      {children}
    </nav>
  );
}
