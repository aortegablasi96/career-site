import { asset } from '@/app/asset';
import type { Project, ProjectMedia } from '@/content/types';
import styles from './projects.module.css';

/**
 * What a project looks like running, per DDR-010: a still, or the demo video with a poster still.
 *
 * Both are 4:3 and both are described in `content/`, so the entry reads correctly whether or not
 * the asset arrives. A still says what it shows in its alternative text; the video carries the same
 * sentence as its accessible name and again as the text a browser that cannot play it shows
 * instead. Nothing on the page depends on watching it.
 *
 * The video has controls, does not autoplay and does not loop, per DDR-010, and fetches nothing
 * until someone presses play, per ADR-004: the poster is what a visitor sees until then, and it is
 * a committed still of its own rather than a frame pulled out of the video.
 *
 * Neither carries a width or height attribute. Both dimensions are set in the stylesheet, from
 * tokens, which fixes the box before the file arrives just as the attributes would; it has to be
 * done there because the media is capped to the width the row has for it, which an attribute
 * cannot follow.
 *
 * A project's view shows the same media at another size, per DDR-050, so it hands in a class of its
 * own in place of the row's, and everything else here — the video, its printed still, the
 * alternative text — is shared.
 */
export function Media({ media, className = styles.media }: { media: ProjectMedia; className?: string }) {
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
        {/* The same still, for paper. DDR-010 prints one image per project, and a video element
            cannot be one: measured on #52, Edge prints an empty box with a dead scrubber and no
            poster at all, and Firefox prints the poster under a controls bar. Exactly one of the two
            is displayed at any time, so the row still has one media element beside its text. */}
        <img className={`${className} ${styles.onPaper}`} src={asset(media.poster)} alt={media.description} />
      </>
    );
  }

  return <img className={className} src={asset(media.file)} alt={media.alt} />;
}

/**
 * The owner's projects, in the order the content gives, per DDR-010. Each is a row: what the
 * project looks like running, beside its name, the technologies it is built from, what it is and
 * what it demonstrates, and the links that lead to it.
 *
 * The projects are the evidence for the AI claims the introduction makes, and the readers most
 * likely to check them are technical. So the stack is a row of tags rather than a line of prose:
 * it can be scanned without being read, which is what DDR-010 replaces DDR-006's metadata line
 * with here. Each tag is text on a tint that is redundant with it, so nothing depends on colour.
 *
 * The markup order is the visual order at both widths, per DDR-014. Below the wide breakpoint the
 * row is a single column and the media sits above the name; from the breakpoint it takes a column
 * of its own beside the text. Nothing is reordered to do it.
 *
 * Each row is an article, which print keeps whole, so no project is split across two pages.
 */
export function Projects({ projects }: { projects: readonly Project[] }) {
  return (
    <>
      {projects.map(({ name, media, technologies, description, links }) => (
        <article key={name} className={styles.project}>
          <Media media={media} />
          <div className={styles.content}>
            <h3>{name}</h3>
            <ul className={styles.technologies}>
              {technologies.map((technology) => (
                <li key={technology} className={styles.tag}>
                  {technology}
                </li>
              ))}
            </ul>
            <p>{description}</p>
            <ul className={styles.links}>
              {links.map(({ text, href }) => (
                <li key={href}>
                  <a href={href} className={styles.link}>
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </>
  );
}
