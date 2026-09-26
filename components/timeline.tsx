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
 * are in time order, and it is focusable and named by its section's heading so a reader can scroll
 * it from the keyboard. Its entries hold no link, so it would otherwise be the one thing on the
 * row a keyboard could not reach.
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
  return (
    // A focusable list is what a reader scrolls from the keyboard, per DDR-057: it names no
    // interaction of its own, so it keeps the list role that says what it holds.
    <ol className={`${styles.timeline} ${styles[kind]}`} aria-labelledby={labelledBy} tabIndex={0}>
      {entries.map(({ key, dates, subtitle, title, place, children }) => (
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
            <h3 className={styles.title}>{title}</h3>
            {place && <p className={styles.place}>{place}</p>}
            {children}
          </div>
        </li>
      ))}
    </ol>
  );
}
