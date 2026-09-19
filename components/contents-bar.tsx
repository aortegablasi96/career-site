'use client';

import { useSyncExternalStore, type MouseEvent } from 'react';
import styles from './contents.module.css';

/** Everything subscribed, so a change that is not a scroll or a resize can still be announced. */
const listeners = new Set<() => void>();

/**
 * Calls `onChange` whenever the page scrolls, the window is resized or a contents link's
 * destination is held or let go, and returns what stops it. A resize moves every section without
 * scrolling the page, so the current section can change without a scroll event, per DDR-042; and
 * letting a destination go changes the mark once the page has come to rest, when nothing scrolls.
 */
export function subscribe(onChange: () => void): () => void {
  window.addEventListener('scroll', onChange, { passive: true });
  window.addEventListener('resize', onChange, { passive: true });
  listeners.add(onChange);

  return () => {
    window.removeEventListener('scroll', onChange);
    window.removeEventListener('resize', onChange);
    listeners.delete(onChange);
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

/**
 * How long, in milliseconds, the page has to go without scrolling before a contents link's journey
 * is over, per DDR-042. A glide scrolls on every frame, about every 16ms, so a pause six times that
 * long means it has ended. It is a wait rather than anything drawn, so it is not a token.
 */
export const settleTimeout = 100;

/** The section a contents link is taking the reader to, while the page is on its way there. */
let destination: string | null = null;

/** What lets go of the destination being held, if one is. */
let letGo: (() => void) | null = null;

function announce(): void {
  listeners.forEach((listener) => listener());
}

/**
 * Moves the mark straight to the section a contents link was chosen for, and holds it there until
 * the page comes to rest, per DDR-042. Without it, a glide from Experience to Languages would mark
 * Projects, Skills and Education in turn as the page moved past them.
 *
 * The destination is let go once the page has not scrolled for `settleTimeout`, or, if it never
 * starts scrolling, after `glideStartTimeout`, the same wait `glide` gives it. A second link chosen
 * on the way takes over the first one's journey. After it lets go, the mark follows the page again,
 * which is where the section has come to rest.
 */
export function holdDestination(event: Pick<MouseEvent, 'target'>): void {
  const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;

  if (!link) {
    return;
  }

  letGo?.();

  let timeout = window.setTimeout(release, glideStartTimeout);

  function wait() {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(release, settleTimeout);
  }

  function stop() {
    window.removeEventListener('scroll', wait);
    window.clearTimeout(timeout);
    destination = null;
    letGo = null;
  }

  function release() {
    stop();
    announce();
  }

  destination = link.getAttribute('href')!.slice(1);
  letGo = stop;
  window.addEventListener('scroll', wait, { passive: true });
  announce();
}

/**
 * Where the Home link leads, per DDR-045: the fragment HTML reserves for the top of the document,
 * which scrolls there whenever no element on the page has that id. It is also the id the bar marks
 * Home by, so the Home link is held and marked through the same code as a section's.
 */
export const homeId = 'top';

/**
 * The part of the page the bar marks: the one a contents link is taking the reader to, while it
 * is, and otherwise the section the reader is in, or Home while they are still in the
 * introduction, per DDR-045.
 */
export function markedSection(ids: readonly string[]): string {
  return destination ?? currentSection(ids) ?? homeId;
}

/** Handles a click in the bar: the glide, per DDR-041, and the mark held on its way, per DDR-042. */
function choose(event: MouseEvent): void {
  glide(event);
  holdDestination(event);
}

/**
 * The server marks no link, not even Home, which is also what a reader without script keeps, per
 * DDR-042 and DDR-045.
 */
function currentSectionOnServer(): string | null {
  return null;
}

/**
 * The contents bar, per DDR-031, and the one Client Component on the site, per ADR-007.
 *
 * It exists for two things, both about scrolling: to make the scroll a contents link starts glide
 * rather than jump, per DDR-041, which ADR-008 lets it do; and to mark the link of the section the
 * reader is in with `aria-current`, per DDR-042, which the stylesheet underlines — moving it
 * straight to the section a contents link was chosen for rather than through every section the
 * glide passes. The bar's edge, which ADR-007 first made it a Client Component for, is drawn by the
 * stylesheet alone since DDR-048, so the bar no longer marks itself with anything.
 *
 * Its first link is Home, per DDR-045, which leads to the top of the page and is marked while the
 * reader is in the introduction. It is held, glided and marked exactly as a section's link is; the
 * only thing that sets it apart is that it has no section to measure.
 *
 * That last is why it renders the links itself, per ADR-009, where ADR-007 had `Contents` render
 * them and pass them in as children: a link can only be marked by what renders it. What it is
 * handed is each section's id and its word, as plain strings, so nothing but the list's markup
 * becomes client code, and the static HTML still holds every link, unmarked.
 *
 * `useSyncExternalStore` rather than state set in an effect: it reads the scroll position during
 * hydration, so a page reloaded half way down, or opened at a `#fragment`, has its mark from the
 * first frame script runs in, and React re-renders only when the answer changes, not on every
 * scroll event.
 */
export function ContentsBar({
  label,
  home,
  sections,
}: {
  label: string;
  home: string;
  sections: readonly { id: string; link: string }[];
}) {
  const current = useSyncExternalStore(
    subscribe,
    () => markedSection(sections.map(({ id }) => id)),
    currentSectionOnServer,
  );

  return (
    <nav
      aria-label={label}
      className={styles.contents}
      onClick={choose}
    >
      <ul className={styles.list}>
        {[{ id: homeId, link: home }, ...sections].map(({ id, link }) => (
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
