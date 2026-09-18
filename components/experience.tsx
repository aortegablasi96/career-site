import type { DateLabels, Role } from '@/content/types';
import { DateRange } from './date-range';
import { TimelineRow } from './timeline';
import styles from './experience.module.css';

/**
 * The owner's roles, newest first as `content/` gives them, per DDR-010. Each is a row of the
 * timeline: the dates and the place, a spine, and the content — the job title, the company, and
 * the points on what the role involved.
 *
 * The row itself is `TimelineRow`, which education shares, per DDR-010: a role and a credential
 * are one pattern, and what differs between them is what goes in the row. What is a role's alone
 * is the points, which are set a step below the title beside them.
 */
export function Experience({ roles, dateLabels }: { roles: readonly Role[]; dateLabels: DateLabels }) {
  return (
    <>
      {roles.map(({ title, company, place, start, end, points }) => (
        <TimelineRow
          kind="role"
          key={`${company} ${start}`}
          dates={<DateRange start={start} end={end} labels={dateLabels} />}
          place={place}
          title={title}
          subtitle={company}
        >
          <ul className={styles.points}>
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </TimelineRow>
      ))}
    </>
  );
}
