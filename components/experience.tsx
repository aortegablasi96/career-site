import type { DateLabels, Role } from '@/content/types';
import { DateRange } from './date-range';
import { Icon } from './icon';
import { Timeline } from './timeline';
import styles from './experience.module.css';

/** A role view's route, per ADR-011. `next/link` puts the base path in front of it. */
export function roleHref(slug: string): string {
  return `/experience/${slug}`;
}

/**
 * The owner's roles, oldest first as `content/` gives them, per DDR-057. Each is an entry of the
 * timeline education shares: the dates, a dot, and a card with the company, the job title and the
 * place.
 *
 * Each card leads to the role's view, per DDR-059, where its points and skills are, and the hint
 * above the row says so, with the design's clock beside it (node 170:71). The hint is screen only,
 * since paper has nothing to click, and the clock repeats nothing the words do not say, so it is
 * hidden from assistive technology as every other mark is.
 *
 * What is a role's alone is its points. The screen does not show them on the page, per DDR-057:
 * they are the view's. Paper has nothing to lead to, so the printed CV shows them below the card's
 * text.
 */
export function Experience({
  roles,
  hint,
  dateLabels,
  labelledBy,
}: {
  roles: readonly Role[];
  /** The line above the timeline that says a card leads to its role's view. */
  hint: string;
  dateLabels: DateLabels;
  /** The id of the section heading that names the timeline. */
  labelledBy: string;
}) {
  return (
    <div>
      <p className={styles.hint}>
        <Icon name="clock" />
        {hint}
      </p>
      <Timeline
        kind="role"
        labelledBy={labelledBy}
        entries={roles.map(({ title, slug, company, place, start, end, points }) => ({
          key: `${company} ${start}`,
          dates: <DateRange start={start} end={end} labels={dateLabels} />,
          subtitle: company,
          title,
          place,
          href: roleHref(slug),
          children: (
            <ul className={styles.points}>
              {points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          ),
        }))}
      />
    </div>
  );
}
