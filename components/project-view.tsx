import Link from 'next/link';
import type { Project, ProjectView as ProjectViewStrings } from '@/content/types';
import { Icon } from './icon';
import { Media } from './projects';
import styles from './project-view.module.css';

/**
 * A project's view of its own, per DDR-050, laid out as `career-site-project` draws it (node 59:2).
 *
 * At the top, a way back to the projects on the page. Below it, two columns from the wide
 * breakpoint: the project's name, what it is, what it is built with and the links that lead to it,
 * and beside them its lead picture with a caption. Below the breakpoint the two are one column, in
 * the same order, so the picture follows the links; the markup order is the visual order at both
 * widths, per DDR-014.
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
  strings: { back, builtWith, newTab },
  backHref,
}: {
  project: Project;
  strings: ProjectViewStrings;
  /** The route of the projects section on the page. */
  backHref: string;
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
    </article>
  );
}
