'use client';

import { useSyncExternalStore, type MouseEvent } from 'react';
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

/**
 * Calls `onChange` whenever the page scrolls or the window is resized, and returns what stops it.
 * A resize moves every section without scrolling the page, so the current section can change
 * without a scroll event, per DDR-042.
 */
export function subscribe(onChange: () => void): () => void {
  window.addEventListener('scroll', onChange, { passive: true });
  window.addEventListener('resize', onChange, { passive: true });

  return () => {
    window.removeEventListener('scroll', onChange);
    window.removeEventListener('resize', onChange);
  };
}

/**
 * The section the reader is in, as its id, or `null` while they are still in the introduction,
 * per DDR-042.
 *
 * It is the last section whose top has reached the line a contents link scrolls a section to: the
 * root's `scroll-padding-block-start`, which is the bar's clearance, per DDR-031. So choosing a
 * link marks the section it lands on, and a section becomes current as its divider passes under the
 * bar. The pixel of slack is for a section that comes to rest a fraction of a pixel below the line.
 *
 * At the foot of the page it is the last section, whatever the line says, because the last section
 * can be too short to reach the line at all. The pixel of slack there is for a page whose height
 * is not a whole number of pixels.
 */
export function currentSection(ids: readonly string[]): string | null {
  const root = document.documentElement;

  if (window.scrollY > 0 && window.scrollY + window.innerHeight >= root.scrollHeight - 1) {
    return ids.at(-1) ?? null;
  }

  const line = (Number.parseFloat(window.getComputedStyle(root).scrollPaddingBlockStart) || 0) + 1;
  let current: string | null = null;

  for (const id of ids) {
    const top = document.getElementById(id)?.getBoundingClientRect().top;

    if (top === undefined || top > line) {
      break;
    }

    current = id;
  }

  return current;
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

/** The server marks no section, which is also what a reader without script keeps, per DDR-042. */
function currentSectionOnServer(): string | null {
  return null;
}

/**
 * The contents bar, per DDR-031, and the one Client Component on the site, per ADR-007.
 *
 * It exists for three things, all about scrolling: to mark the bar with `data-scrolled` once the
 * page has scrolled past the design's threshold, so contents.module.css can draw the hairline and
 * the shadow, per DDR-034; to make the scroll a contents link starts glide rather than jump, per
 * DDR-041, which ADR-008 lets it do; and to mark the link of the section the reader is in with
 * `aria-current`, per DDR-042, which the stylesheet underlines.
 *
 * That last is why it renders the links itself, per ADR-009, where ADR-007 had `Contents` render
 * them and pass them in as children: a link can only be marked by what renders it. What it is
 * handed is each section's id and its word, as plain strings, so nothing but the list's markup
 * becomes client code, and the static HTML still holds every link, unmarked.
 *
 * `useSyncExternalStore` rather than state set in an effect: it reads the scroll position during
 * hydration, so a page reloaded half way down, or opened at a `#fragment`, has its edge and its
 * mark from the first frame script runs in, and React re-renders only when an answer changes, not
 * on every scroll event.
 */
export function ContentsBar({
  label,
  sections,
}: {
  label: string;
  sections: readonly { id: string; link: string }[];
}) {
  const scrolled = useSyncExternalStore(subscribe, isScrolled, isScrolledOnServer);
  const current = useSyncExternalStore(
    subscribe,
    () => currentSection(sections.map(({ id }) => id)),
    currentSectionOnServer,
  );

  return (
    <nav
      aria-label={label}
      className={styles.contents}
      data-scrolled={scrolled || undefined}
      onClick={glide}
    >
      <ul className={styles.list}>
        {sections.map(({ id, link }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={styles.link}
              aria-current={id === current ? 'location' : undefined}
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
