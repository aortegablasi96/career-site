import Link from 'next/link';
import { asset } from '@/app/asset';
import type { ReactNode } from 'react';
import styles from './timeline.module.css';

/** One entry on a timeline: a role or a credential. */
export interface TimelineEntry {
  /** What tells the entry from the others in its section, for React. */
  key: string;
  /** The date range, or the single month a certification was granted. */
  dates: ReactNode;
  /** The company or the institution, which opens the entry's card, per DDR-057. */
  subtitle: string;
  /** The path of the company's or institution's logo, which stands above the subtitle, per DDR-066 and DDR-068. */
  logo?: string;
  /** Whether the logo is drawn taller than the others, per DDR-066. */
  logoTall?: boolean;
  /** Whether a tall logo rises into the card's padding, so the name below it stays level, per DDR-066. */
  logoRaised?: boolean;
  /** The job title or the credential's name, which is the entry's heading. */
  title: string;
  /** Where a role was held. A credential has none. */
  place?: string;
  /** What only paper shows of the entry: a role's points, per DDR-057. */
  children?: ReactNode;
  /**
   * Where the entry's card leads, where it leads anywhere: a role's view, per DDR-059, or, for a
   * credential, an address off the site, per DDR-069.
   */
  href?: string;
  /**
   * What the card's link says about opening a new tab, where its href is off the site, per DDR-069:
   * such a link opens one, as a profile pill does, per DDR-043, and says so only to assistive
   * technology, after its title, per DDR-044.
   */
  newTab?: string;
}

/**
 * A timeline, per DDR-057, which experience and education share, as DDR-010 has them share one
 * pattern. What differs between a role and a credential is what goes on the card, not how the
 * timeline is built.
 *
 * On screen it is one horizontal row, oldest entry first: each entry is its dates, a dot on the
 * line that joins the first entry to the last, and a card below the dot with the company or
 * institution, the title and, for a role, the place. Where the row does not fit the column it
 * scrolls sideways inside itself, so the page never does. It is an ordered list, since the entries
 * are in time order, and it is named by its section's heading.
 *
 * Where an entry has a view of its own — a role, per DDR-059 — its card is one link to it, as a
 * project card is, per DDR-051: the link is the title, and its box is stretched over the card by a
 * pseudo-element, so a pointer anywhere on the card follows it, the card is one tab stop, and its
 * accessible name is the title rather than every word on the card run together. Tabbing to a card
 * scrolls the row to it, and the arrow keys scroll the row while a card has focus. A credential's
 * card leads off the site instead, per DDR-069, and is the same link in every other respect: it
 * looks, moves and answers as a role's does, and opens a new tab. A timeline with no links is
 * focusable itself instead, so a reader can still scroll it from the keyboard, per DDR-057; one
 * that has links does not take a tab stop of its own as well.
 *
 * A role's card opens with its company's logo, per DDR-066, on the card itself, above the company's
 * name, and a degree's with its institution's, per DDR-068. The name is written beneath it, so the logo is hidden from assistive technology, and the
 * card reads as it did without it. Paper does not show it.
 *
 * On paper it is the vertical timeline DDR-010 drew: the dates in a column of their own, the spine,
 * and the card's text beside them, with each role's points below, which the screen does not show.
 * Every entry is a list item, which print keeps whole.
 *
 * The spine carries no information, so it is hidden from assistive technology: the line coming
 * into the dot from the entry before, the ringed dot, and the line leaving it for the entry after.
 * Joined across the entries they are one line from the first dot to the last.
 *
 * Below the wide breakpoint the screen draws a second list instead, per DDR-074: the same entries
 * run down the page, newest first, as the owner chose on #218, each its dot on a line down the left
 * and its dates above its card. The order differs from the row's, and a stylesheet may not reorder
 * what it lays out, per DDR-014, so it is a list of its own, and exactly one of the two is ever
 * displayed: the row from the wide breakpoint and on paper, the column below it. A reader meets one
 * list, in the order they see it. The column holds no role's points, which only paper shows.
 */
export function Timeline({
  kind,
  labelledBy,
  entries,
}: {
  /** Whether the entries are roles or credentials, which sets the ink of the subtitle and the space between entries on paper. */
  kind: 'role' | 'credential';
  /** The id of the section heading that names the timeline. */
  labelledBy: string;
  entries: readonly TimelineEntry[];
}) {
  const linked = entries.some(({ href }) => href);

  return (
    // One block, so what stands above the timeline, such as its hint, is spaced from whichever of
    // the two lists is displayed.
    <div>
      {/* A focusable list is what a reader scrolls from the keyboard, per DDR-057, where no link in
          it is: it names no interaction of its own, so it keeps the list role that says what it
          holds. */}
      <ol
        className={`${styles.timeline} ${styles[kind]}`}
        aria-labelledby={labelledBy}
        tabIndex={linked ? undefined : 0}
      >
        {entries.map((entry) => (
          <li key={entry.key} className={styles.entry}>
            {/* One span, so the dates are one flex item and the spaces around their dash survive. */}
            <p className={styles.dates}>
              <span>{entry.dates}</span>
            </p>
            <Spine />
            <Card entry={entry}>{entry.children}</Card>
          </li>
        ))}
      </ol>
      {/* The column never scrolls, so it takes no tab stop of its own, links or none. The spine
          comes first, at the left, and the dates and the card beside it, so the markup is the order
          they are laid out in; the spine is hidden from assistive technology, so a reader meets the
          dates and then the card, as in the row. */}
      <ol className={`${styles.stack} ${styles[kind]}`} aria-labelledby={labelledBy}>
        {[...entries].reverse().map((entry) => (
          <li key={entry.key} className={styles.entry}>
            <Spine />
            <div className={styles.body}>
              <p className={styles.dates}>
                <span>{entry.dates}</span>
              </p>
              <Card entry={entry} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** An entry's part of the line, and its ringed dot. */
function Spine() {
  return (
    <div className={styles.spine} aria-hidden="true">
      <span className={styles.lead} />
      <span className={styles.dot} />
      <span className={styles.line} />
    </div>
  );
}

/** An entry's card: the logo, the company or institution, the title and a role's place. */
function Card({ entry, children }: { entry: TimelineEntry; children?: ReactNode }) {
  const { subtitle, logo, logoTall, logoRaised, title, place, href, newTab } = entry;

  return (
    <div className={styles.card}>
      {/* Lazy, because the timeline is below the fold, and an eager image is one React also asks the
          browser to preload, ahead of the introduction's photo. A lazy image that is not displayed
          is not fetched, so each logo is fetched once, for the list that shows it. */}
      {logo && (
        <img
          className={[styles.logo, logoTall && styles.logoTall, logoRaised && styles.logoRaised]
            .filter(Boolean)
            .join(' ')}
          src={asset(logo)}
          alt=""
          loading="lazy"
        />
      )}
      <p className={styles.subtitle}>{subtitle}</p>
      <h3 className={styles.title}>
        {href && newTab ? (
          // An address off the site opens a new tab, per DDR-069 as DDR-043 has it, and says so
          // after the title, which the name still leads with, per WCAG 2.5.3. `noopener` keeps the
          // new tab from reaching back to this one, as a profile pill's does.
          <a href={href} className={styles.link} target="_blank" rel="noopener" aria-label={`${title}, ${newTab}`}>
            {title}
          </a>
        ) : href ? (
          // A route of this site, per ADR-011, so it goes through `next/link` and does not prefetch,
          // as a project card's does not.
          <Link href={href} className={styles.link} prefetch={false}>
            {title}
          </Link>
        ) : (
          title
        )}
      </h3>
      {place && <p className={styles.place}>{place}</p>}
      {children}
    </div>
  );
}
