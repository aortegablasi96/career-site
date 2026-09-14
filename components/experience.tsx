import type { DateLabels, Role } from '@/content/types';
import { DateRange } from './date-range';
import { Entry } from './entry';
import styles from './experience.module.css';

/**
 * The owner's roles, in the order the content gives, per DDR-006. Each is an entry titled by the
 * job title, with the company, place, and dates below it, and its points as a bulleted list.
 */
export function Experience({ roles, dateLabels }: { roles: readonly Role[]; dateLabels: DateLabels }) {
  return (
    <>
      {roles.map(({ title, company, place, start, end, points }) => (
        <Entry
          key={`${company} ${start}`}
          title={title}
          metadata={[company, place, <DateRange key="dates" start={start} end={end} labels={dateLabels} />]}
        >
          <ul className={styles.points}>
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </Entry>
      ))}
    </>
  );
}
