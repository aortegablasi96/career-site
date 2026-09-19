import Link from 'next/link';
import type { Project, ProjectView as ProjectViewStrings } from '@/content/types';
import { Icon } from './icon';
import { Media, projectHref } from './projects';
import styles from './project-view.module.css';

/**
 * The project before or after this one, per DDR-052, as a card at the foot of the view (node
 * 59:120): the direction above the project's name, with a chevron pointing the way it leads.
 *
 * The whole card is the link, so it is one stop in the tab order, and its accessible name is the
 * two words together — "Next project: Digital Twin" — because "Next" and the name are two lines of
 * a card rather than one phrase. The visible word comes first in it, per WCAG 2.5.3. The chevron
 * repeats what the card says and is hidden from assistive technology, as every other mark is.
 *
 * It is a route of this site, so it goes through `next/link`, per ADR-010, and does not prefetch:
 * a view carries a picture of its own, and a reader who reads one project rarely opens both
 * neighbours.
 */
function Neighbour({
  project: { name, slug },
  direction,
  accessibleName,
  forward,
}: {
  project: Project;
  /** The word above the name: "Previous" or "Next". */
  direction: string;
  accessibleName: string;
  /** Whether this is the project after this one, which the design draws at the right (node 59:120). */
  forward: boolean;
}) {
  const mark = (
    <span className={styles.neighbourMark}>
      <Icon name={forward ? 'forward' : 'back'} />
    </span>
  );

  return (
    <Link
      href={projectHref(slug)}
      className={`${styles.neighbour} ${forward ? styles.next : styles.previous}`}
      prefetch={false}
      aria-label={accessibleName}
    >
      {!forward && mark}
      <span className={styles.neighbourText}>
        <span className={styles.direction}>{direction}</span>
        <span>{name}</span>
      </span>
      {forward && mark}
    </Link>
  );
}

/**
 * A project's view of its own, per DDR-050, laid out as `career-site-project` draws it (node 59:2).
 *
 * At the top, a way back to the projects on the page. Below it, two columns from the wide
 * breakpoint: the project's name, what it is, what it is built with and the links that lead to it,
 * and beside them its lead picture with a caption. Below the breakpoint the two are one column, in
 * the same order, so the picture follows the links; the markup order is the visual order at both
 * widths, per DDR-014. At the foot, below a divider, the projects on either side of this one, per
 * DDR-052.
 *
 * Every word is the project's own record, stated once in `content/` and shown on the page as well,
 * per ADR-002, and the words around it are the view's strings beside the projects. The name is the
 * view's one `h1`, and the label above the technologies is an `h2`, so the view's outline is the
 * project and what it is built with.
 *
 * The first link is the repository and is filled; a live site, where there is one, follows it
 * outlined, as the design draws the two. Both leave the site for another one the reader means to
 * come back from, so both open a new tab, per DDR-043 as DDR-050 extends it, and say so to
 * assistive technology after their own text. Nothing on the link shows it: the arrow out of a box
 * says the link leaves the site, which it does whichever tab it opens in.
 *
 * The way back is a route of this site, so it goes through `next/link`, which puts the base path in
 * front of it, per ADR-010. It leads to the projects section rather than the top of the page. It
 * does not prefetch, per ADR-010: prefetching the page would fetch its photo and every project's
 * picture on each view, whether or not the reader goes back.
 */
export function ProjectView({
  project: { name, media, caption, technologies, description, links },
  strings: { back, builtWith, newTab, previous: previousWord, next: nextWord, neighbour },
  backHref,
  previous,
  next,
}: {
  project: Project;
  strings: ProjectViewStrings;
  /** The route of the projects section on the page. */
  backHref: string;
  /** The project the page shows before this one, if this is not the first. */
  previous?: Project;
  /** The project the page shows after this one, if this is not the last. */
  next?: Project;
}) {
  return (
    <article className={styles.view}>
      <Link href={backHref} className={styles.back} prefetch={false}>
        <span className={styles.backMark}>
          <Icon name="back" />
        </span>
        {back}
      </Link>
      <div className={styles.columns}>
        <div className={styles.text}>
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.description}>{description}</p>
          <h2 className={styles.label}>{builtWith}</h2>
          <ul className={styles.technologies}>
            {technologies.map((technology) => (
              <li key={technology} className={styles.tag}>
                {technology}
              </li>
            ))}
          </ul>
          <ul className={styles.links}>
            {links.map(({ text, href }, index) => (
              <li key={href}>
                <a
                  href={href}
                  className={index === 0 ? styles.primary : styles.secondary}
                  target="_blank"
                  rel="noopener"
                  aria-label={`${text}, ${newTab}`}
                >
                  <Icon name="external" />
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <figure className={styles.figure}>
          <Media media={media} className={styles.media} />
          <figcaption className={styles.caption}>{caption}</figcaption>
        </figure>
      </div>
      {/* The projects on either side of this one, below the design's divider (node 59:117). The
          first project has nothing before it and the last nothing after it, and neither view
          shows a card in that half: the projects are the page's order, not a ring, per DDR-052. */}
      {(previous || next) && (
        <div className={styles.neighbours}>
          {previous ? (
            <Neighbour
              project={previous}
              direction={previousWord}
              accessibleName={neighbour(previousWord, previous.name)}
              forward={false}
            />
          ) : (
            /* The first project's empty left half, as the design draws it (node 59:119), so that
               the project after it keeps the right one. It holds nothing and is not drawn below
               the wide breakpoint, where the two halves are one column. */
            <div className={styles.half} />
          )}
          {next && (
            <Neighbour
              project={next}
              direction={nextWord}
              accessibleName={neighbour(nextWord, next.name)}
              forward
            />
          )}
        </div>
      )}
    </article>
  );
}
