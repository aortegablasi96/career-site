import type { DateLabels, Role } from '@/content/types';
import { DateRange } from './date-range';
import { Timeline } from './timeline';
import styles from './experience.module.css';

/**
 * The owner's roles, oldest first as `content/` gives them, per DDR-057. Each is an entry of the
 * timeline education shares: the dates, a dot, and a card with the company, the job title and the
 * place.
 *
 * What is a role's alone is its points. The screen does not show them, per DDR-057: the design
 * leads from a role's card to a view of the role for its full description, which is still to come.
 * Paper has nothing to lead to, so the printed CV shows them below the card's text.
 */
export function Experience({
  roles,
  dateLabels,
  labelledBy,
}: {
  roles: readonly Role[];
  dateLabels: DateLabels;
  /** The id of the section heading that names the timeline. */
  labelledBy: string;
}) {
  return (
    <Timeline
      kind="role"
      labelledBy={labelledBy}
      entries={roles.map(({ title, company, place, start, end, points }) => ({
        key: `${company} ${start}`,
        dates: <DateRange start={start} end={end} labels={dateLabels} />,
        subtitle: company,
        title,
        place,
        children: (
          <ul className={styles.points}>
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        ),
      }))}
    />
  );
}
