import Link from 'next/link';
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
  /** The job title or the credential's name, which is the entry's heading. */
  title: string;
  /** Where a role was held. A credential has none. */
  place?: string;
  /** What only paper shows of the entry: a role's points, per DDR-057. */
  children?: ReactNode;
  /** The route of the entry's view, where it has one: a role's, per DDR-059. A credential has none. */
  href?: string;
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
 * scrolls the row to it, and the arrow keys scroll the row while a card has focus. A timeline with
 * no links — education's — is focusable itself instead, so a reader can still scroll it from the
 * keyboard, per DDR-057; one that has links does not take a tab stop of its own as well.
 *
 * On paper it is the vertical timeline DDR-010 drew: the dates in a column of their own, the spine,
 * and the card's text beside them, with each role's points below, which the screen does not show.
 * Every entry is a list item, which print keeps whole.
 *
 * The spine carries no information, so it is hidden from assistive technology: the line coming
 * into the dot from the entry before, the ringed dot, and the line leaving it for the entry after.
 * Joined across the entries they are one line from the first dot to the last.
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
    // A focusable list is what a reader scrolls from the keyboard, per DDR-057, where no link in it
    // is: it names no interaction of its own, so it keeps the list role that says what it holds.
    <ol
      className={`${styles.timeline} ${styles[kind]}`}
      aria-labelledby={labelledBy}
      tabIndex={linked ? undefined : 0}
    >
      {entries.map(({ key, dates, subtitle, title, place, children, href }) => (
        <li key={key} className={styles.entry}>
          {/* One span, so the dates are one flex item and the spaces around their dash survive. */}
          <p className={styles.dates}>
            <span>{dates}</span>
          </p>
          <div className={styles.spine} aria-hidden="true">
            <span className={styles.lead} />
            <span className={styles.dot} />
            <span className={styles.line} />
          </div>
          <div className={styles.card}>
            <p className={styles.subtitle}>{subtitle}</p>
            <h3 className={styles.title}>
              {href ? (
                // A route of this site, per ADR-011, so it goes through `next/link` and does not
                // prefetch, as a project card's does not.
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
        </li>
      ))}
    </ol>
  );
}
