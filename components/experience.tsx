import type { DateLabels, Role } from '@/content/types';
import { DateRange } from './date-range';
import { MetadataLine } from './metadata-line';
import styles from './experience.module.css';

/**
 * The owner's roles, newest first as `content/` gives them, per DDR-010. Each is a row of the
 * timeline: the dates and the place, a spine, and the content — the job title, the company, and
 * the points on what the role involved.
 *
 * The job title is the heading and the most prominent line of the row. It is the only line set in
 * the heading face, in the darkest ink, and the only one at body size; everything else in the row
 * is metadata a step below it. The progression of titles is the story experience tells, per
 * DDR-010, so it is what the eye meets first.
 *
 * The markup order is the visual order at both widths, per DDR-014. Below the wide breakpoint the
 * row is a single column and the dates read above the title; from the breakpoint they move into a
 * column of their own beside the role. Nothing is reordered to do it.
 *
 * The spine carries no information — it draws the path from one role to the next, and removing it
 * would lose nothing — so it is hidden from assistive technology, and below the wide breakpoint it
 * is not rendered at all.
 *
 * Each row is an article, which print keeps whole, so no role is split across two pages.
 */
export function Experience({ roles, dateLabels }: { roles: readonly Role[]; dateLabels: DateLabels }) {
  return (
    <>
      {roles.map(({ title, company, place, start, end, points }) => (
        <article key={`${company} ${start}`} className={styles.role}>
          <div className={styles.dates}>
            <MetadataLine
              parts={[<DateRange key="dates" start={start} end={end} labels={dateLabels} />]}
            />
            <MetadataLine parts={[place]} />
          </div>
          <div className={styles.spine} aria-hidden="true">
            <span className={styles.dot} />
            <span className={styles.line} />
          </div>
          <div className={styles.content}>
            <h3>{title}</h3>
            <MetadataLine parts={[company]} className={styles.company} />
            <ul className={styles.points}>
              {points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </>
  );
}
