import Link from 'next/link';
import type { DateLabels, Role, RoleView as RoleViewStrings } from '@/content/types';
import { DateRange } from './date-range';
import { roleHref } from './experience';
import { Icon } from './icon';
import styles from './role-view.module.css';

/**
 * The role before or after this one, per DDR-059, as a card at the foot of the view (node
 * 177:1302): the direction, the company and the job title, with a chevron pointing the way it
 * leads. It is a project view's neighbouring card, per DDR-052, with the job title as a third line.
 *
 * The whole card is the link, so it is one stop in the tab order, and its accessible name is the
 * three lines together — "Next role: ABB, Global Product Specialist, Digital Solutions" — with the
 * visible words first, per WCAG 2.5.3. The chevron repeats what the card says and is hidden from
 * assistive technology, as every other mark is.
 */
function Neighbour({
  role: { title, slug, company },
  direction,
  accessibleName,
  forward,
}: {
  role: Role;
  /** The words above the company: "Previous role" or "Next role". */
  direction: string;
  accessibleName: string;
  /** Whether this is the newer role, which the design draws at the right (node 177:1302). */
  forward: boolean;
}) {
  const mark = (
    <span className={styles.neighbourMark}>
      <Icon name={forward ? 'forward' : 'back'} />
    </span>
  );

  return (
    <Link
      href={roleHref(slug)}
      className={`${styles.neighbour} ${forward ? styles.next : styles.previous}`}
      prefetch={false}
      aria-label={accessibleName}
    >
      {!forward && mark}
      <span className={styles.neighbourText}>
        <span className={styles.direction}>{direction}</span>
        <span className={styles.neighbourCompany}>{company}</span>
        <span className={styles.neighbourTitle}>{title}</span>
      </span>
      {forward && mark}
    </Link>
  );
}

/**
 * A role's view of its own, per DDR-059, laid out as `career-site-experience` draws it (node
 * 177:1206).
 *
 * At the top, a way back to the experience section on the page. Below it, the role's header on a
 * tinted panel: the company in a pill, the dates and the place, then the job title, which is the
 * view's one `h1`. Below that, every point the role states as a numbered list, and, where the
 * owner has supplied them, the role's skills as tags. At the foot, below a divider, the roles on
 * either side of this one, in the timeline's order.
 *
 * Every word is the role's own record, stated once in `content/` and shown on the page as well, per
 * ADR-002, and the words around it are the view's strings beside the roles. The two labels are
 * `h2`, so the view's outline is the role, what the owner did in it and what it drew on.
 *
 * The points are an ordered list, because the design numbers them. Each number is drawn in the
 * markup rather than by a counter, so it can sit in its tinted circle beside the first line of a
 * point however many lines the point runs to; it is hidden from assistive technology, which already
 * announces a numbered list's positions.
 *
 * The way back is a route of this site, so it goes through `next/link`, per ADR-011, and leads to
 * the experience section rather than the top of the page. It does not prefetch, as a project
 * view's does not: prefetching the page would fetch its photo and every project's picture.
 */
export function RoleView({
  role: { title, company, place, start, end, points, skills },
  strings: { back, points: pointsLabel, skills: skillsLabel, previous: previousWords, next: nextWords, neighbour },
  dateLabels,
  backHref,
  previous,
  next,
}: {
  role: Role;
  strings: RoleViewStrings;
  dateLabels: DateLabels;
  /** The route of the experience section on the page. */
  backHref: string;
  /** The older role, if this is not the oldest. */
  previous?: Role;
  /** The newer role, if this is not the current one. */
  next?: Role;
}) {
  return (
    <article className={styles.view}>
      <Link href={backHref} className={styles.back} prefetch={false}>
        <span className={styles.backMark}>
          <Icon name="back" />
        </span>
        {back}
      </Link>
      <header className={styles.header}>
        {/* The company, the dates and the place, one line above the title (node 177:1214). The
            spaces between the parts are text, so a screen reader does not run them together; the
            dot between the dates and the place is only drawn, as the metadata line's is. */}
        <p className={styles.meta}>
          <span className={styles.company}>{company}</span>{' '}
          <span>
            <DateRange start={start} end={end} labels={dateLabels} />
          </span>{' '}
          <span className={styles.separator} aria-hidden="true">
            ·
          </span>{' '}
          <span>{place}</span>
        </p>
        <h1 className={styles.title}>{title}</h1>
      </header>
      <h2 className={styles.label}>{pointsLabel}</h2>
      <ol className={styles.points}>
        {points.map((point, index) => (
          <li key={point} className={styles.point}>
            <span className={styles.number} aria-hidden="true">
              {index + 1}
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ol>
      {/* The skills the owner supplies, per #176. A role without them shows no label and no row. */}
      {skills && skills.length > 0 && (
        <>
          <h2 className={`${styles.label} ${styles.skillsLabel}`}>{skillsLabel}</h2>
          <ul className={styles.skills}>
            {skills.map((skill) => (
              <li key={skill} className={styles.skill}>
                {skill}
              </li>
            ))}
          </ul>
        </>
      )}
      {/* The roles on either side of this one, below the design's divider (node 177:1317). The
          oldest role has nothing before it and the current one nothing after it, and neither view
          shows a card in that half: the roles are the timeline's order, not a ring. */}
      {(previous || next) && (
        <div className={styles.neighbours}>
          {previous ? (
            <Neighbour
              role={previous}
              direction={previousWords}
              accessibleName={neighbour(previousWords, previous.company, previous.title)}
              forward={false}
            />
          ) : (
            /* The oldest role's empty left half, as the design draws it beside the one card it has
               (node 177:1301), so that the newer role keeps the right one. It holds nothing and is
               not drawn below the wide breakpoint, where the two halves are one column. */
            <div className={styles.half} />
          )}
          {next && (
            <Neighbour
              role={next}
              direction={nextWords}
              accessibleName={neighbour(nextWords, next.company, next.title)}
              forward
            />
          )}
        </div>
      )}
    </article>
  );
}
