import type { ReactNode } from 'react';
import { MetadataLine } from './metadata-line';
import styles from './timeline.module.css';

/**
 * One row of a timeline, per DDR-010. A role and a credential share this one pattern, which is what
 * DDR-010 replaces DDR-006's entry anatomy with for both: what differs between them is what goes in
 * the row, not how the row is built.
 *
 * Below the wide breakpoint a row is a single column with its dates above the title; from the
 * breakpoint it is three columns — the dates, a decorative spine, and the content. The markup order
 * is the visual order at both widths, per DDR-014, so nothing is reordered to do it.
 *
 * The title is the most prominent line of the row: the only one set in the heading face, in the
 * darkest ink, and the only one at body size. For a role it is the job title, whose progression is
 * the story experience tells, per DDR-010; for a credential it is the credential's name.
 *
 * The spine carries no information — it draws the path from one row to the next, and removing it
 * would lose nothing — so it is hidden from assistive technology, and below the wide breakpoint it
 * is not rendered at all. It is three pieces, per DDR-036: the line coming down into the dot from
 * the row above, the ringed dot, and the line leaving it for the row below. Joined across the rows,
 * they are one line from the first dot to the last with a stop at each entry.
 *
 * Each row is an article, which print keeps whole, so no role and no credential is split across two
 * pages.
 */
export function TimelineRow({
  dates,
  place,
  title,
  subtitle,
  children,
}: {
  /** The date range, or the single month a certification was granted. */
  dates: ReactNode;
  /** Where a role was held. A credential has none, and shows only its dates. */
  place?: string;
  /** The job title or the credential's name, which is the row's heading. */
  title: string;
  /** The company or the institution, on a line of its own below the title, per DDR-010. */
  subtitle: string;
  /** What the row says beyond its title: a role's points, or a degree's thesis. */
  children?: ReactNode;
}) {
  return (
    <article className={styles.row}>
      <div className={styles.dates}>
        <MetadataLine parts={[dates]} className={styles.dateRange} />
        {place && <MetadataLine parts={[place]} />}
      </div>
      <div className={styles.spine} aria-hidden="true">
        <span className={styles.lead} />
        <span className={styles.dot} />
        <span className={styles.line} />
      </div>
      <div className={styles.content}>
        <h3>{title}</h3>
        <MetadataLine parts={[subtitle]} className={styles.subtitle} />
        {children}
      </div>
    </article>
  );
}
