import Link from 'next/link';
import { asset } from '@/app/asset';
import type { Project, ProjectMedia } from '@/content/types';
import styles from './projects.module.css';

/**
 * What a project looks like running, per DDR-010: a still, or the demo video with a poster still.
 *
 * A project's view shows it, per DDR-050, and hands in the class that sizes it. A card on the page
 * does not use this: it shows a still whatever the media is, per DDR-051, below.
 *
 * A still says what it shows in its alternative text; the video carries the same sentence as its
 * accessible name and again as the text a browser that cannot play it shows instead. Nothing
 * depends on watching it.
 *
 * The video has controls, does not autoplay and does not loop, per DDR-010, and fetches nothing
 * until someone presses play, per ADR-004: the poster is what a visitor sees until then, and it is
 * a committed still of its own rather than a frame pulled out of the video.
 */
export function Media({ media, className }: { media: ProjectMedia; className: string }) {
  if ('poster' in media) {
    return (
      <>
        <video
          className={`${className} ${styles.onScreen}`}
          src={asset(media.file)}
          poster={asset(media.poster)}
          preload="none"
          controls
          aria-label={media.description}
        >
          {media.description}
        </video>
        {/* The same still, for paper. A video element cannot be one: measured on #52, Edge prints an
            empty box with a dead scrubber and no poster at all, and Firefox prints the poster under
            a controls bar. Exactly one of the two is displayed at any time. */}
        <img className={`${className} ${styles.onPaper}`} src={asset(media.poster)} alt={media.description} />
      </>
    );
  }

  return <img className={className} src={asset(media.file)} alt={media.alt} />;
}

/** A project view's route, per ADR-010. `next/link` puts the base path in front of it. */
export function projectHref(slug: string): string {
  return `/projects/${slug}`;
}

/** How many technologies a card shows before it counts the rest, per DDR-051. */
const shown = 4;

/**
 * Two projects, which are one row of the section's grid, each as a card that leads to its view, per
 * DDR-051, laid out as `career-site-main` draws them (node 58:938): the project's picture, its name,
 * the one sentence that says what it is, and its first four technologies followed by a count of the
 * rest.
 *
 * The whole card is one link, and the link is the name. Its box is stretched over the card by a
 * pseudo-element, so a pointer anywhere on the card follows it, while the link's accessible name is
 * the name alone rather than every word on the card run together. So the card is one stop in the
 * tab order, a screen reader announces it by the project's name, and the sentence and the tags are
 * read as what they are, after it.
 *
 * The picture is a still even for a project whose media is a video: the card leads to the view,
 * where the video plays, and a video's controls under a link that covers them could not be used.
 * It keeps its alternative text, since it is content, and it sits outside the link, so the link's
 * name stays the project's.
 *
 * The page hands the section two projects at a time, as it hands the skills two groups, because the
 * two columns have to be one grid and the section keeps its heading with its first item on paper,
 * per DDR-008 — so the row, not the card, is the section's item. `projectRows` splits them.
 *
 * Each card is an article, which print keeps whole, and it prints as it shows, with no address:
 * the link is a route of this site, which paper cannot follow, per Epic #152.
 */
export function Projects({ projects, more }: { projects: readonly Project[]; more: (count: number) => string }) {
  return (
    <div className={styles.row}>
      {projects.map(({ name, slug, media, summary, technologies }) => {
        const still = 'poster' in media ? { src: media.poster, alt: media.description } : { src: media.file, alt: media.alt };
        const left = technologies.length - shown;

        return (
          <article key={slug} className={styles.card}>
            <img className={styles.media} src={asset(still.src)} alt={still.alt} />
            <div className={styles.body}>
              <h3 className={styles.name}>
                <Link href={projectHref(slug)} className={styles.link} prefetch={false}>
                  {name}
                </Link>
              </h3>
              <p className={styles.summary}>{summary}</p>
              <ul className={styles.technologies}>
                {technologies.slice(0, shown).map((technology) => (
                  <li key={technology} className={styles.tag}>
                    {technology}
                  </li>
                ))}
                {left > 0 && <li className={`${styles.tag} ${styles.more}`}>{more(left)}</li>}
              </ul>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/** How many cards stand side by side from the wide breakpoint, per DDR-051. */
const columns = 2;

/**
 * The projects split into the rows of the section's grid, which `app/sections.tsx` hands to the
 * section one at a time. The count lives here, with the stylesheet that draws the columns, as
 * `skillRows` keeps the skills'. A row short of a card leaves the track empty, as a grid does.
 */
export function projectRows(projects: readonly Project[]): readonly (readonly Project[])[] {
  return Array.from({ length: Math.ceil(projects.length / columns) }, (_, index) =>
    projects.slice(index * columns, (index + 1) * columns),
  );
}
