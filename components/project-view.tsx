import Link from 'next/link';
import { asset } from '@/app/asset';
import type {
  BusinessCaseItem,
  GalleryItem,
  Project,
  ProjectView as ProjectViewStrings,
} from '@/content/types';
import { Icon } from './icon';
import { Media, projectHref } from './projects';
import styles from './project-view.module.css';

/**
 * Further pictures and videos of the project, per DDR-053, as the design draws them (node 59:84):
 * the "Gallery" label, then the items two to a row from the wide breakpoint and one below it, each
 * in the lead picture's shape with its caption beneath.
 *
 * It is a list, because the items are several of one thing and their number is worth announcing,
 * and each item is a `figure` with its `figcaption`, as the lead picture is, so the caption is tied
 * to what it names rather than standing loose under it. The label is an `h2`, as "Built with" is,
 * so the view's outline stays the project, what it is built with, and what there is to see of it.
 *
 * A video plays only when the reader starts it, shows its poster until then and fetches nothing
 * before that, because it is drawn by the same `Media` the lead picture is, per DDR-010 and
 * ADR-004. A view with nothing to show renders no gallery at all: `ProjectView` leaves it out
 * rather than this drawing an empty one, since a heading over nothing is worse than no heading.
 */
function Gallery({ title, items }: { title: string; items: readonly GalleryItem[] }) {
  return (
    <>
      <h2 className={styles.galleryTitle}>{title}</h2>
      <ul className={styles.gallery}>
        {items.map(({ media, caption }) => (
          <li key={media.file}>
            <figure className={styles.figure}>
              <Media media={media} className={styles.media} />
              <figcaption className={styles.galleryCaption}>{caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </>
  );
}

/**
 * The switch between a project's two accounts, per DDR-079 and ADR-014: the overview, which is its
 * description and how it was built, and its business case.
 *
 * It is a native radio group, because choosing one of two accounts is what a radio group is: the
 * browser holds which is chosen, assistive technology announces the group's name, each option and
 * which is checked, and the keyboard reaches the group with Tab and moves between the two with the
 * arrow keys. So it needs no script, works before hydration and without script at all, and adds no
 * Client Component, per ADR-014. The stylesheet draws each option's label as a segment of one pill
 * and shows the account whose option is checked; the radio itself takes no room. While the business
 * case is shown, "Built with", the technologies and the links are hidden with the overview, and the
 * full business case's download takes the links' place, by the same rule.
 *
 * The overview is checked in the markup, so a view opens on it, as it read before #231. One view
 * is one page, so the group's `name` need only be unique within it.
 */
function Accounts({
  name,
  overview,
  businessCase,
}: {
  /** The group's accessible name. */
  name: string;
  overview: string;
  businessCase: string;
}) {
  return (
    <div role="radiogroup" aria-label={name} className={styles.switch}>
      <label className={styles.option}>
        <input type="radio" name="account" className={styles.choice} defaultChecked />
        {overview}
      </label>
      <label className={styles.option}>
        <input type="radio" name="account" className={`${styles.choice} ${styles.caseChoice}`} />
        {businessCase}
      </label>
    </div>
  );
}

/**
 * A project's business case, per DDR-079: each of the owner's labelled items, in their order, as a
 * term and its description. The labels are not headings, so the view's outline is the same in both
 * accounts but for "How I built it", which the overview carries. The stylesheet hides it until its
 * option is checked.
 */
function BusinessCase({ items }: { items: readonly BusinessCaseItem[] }) {
  return (
    <dl className={styles.businessCase}>
      {items.map(({ label, text }) => (
        <div key={label} className={styles.caseItem}>
          <dt className={styles.caseLabel}>{label}</dt>
          <dd className={styles.caseText}>{text}</dd>
        </div>
      ))}
    </dl>
  );
}

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
 * widths, per DDR-014. Below them, where the project has any, a gallery of further pictures and
 * videos, per DDR-053. At the foot, below a divider, the projects on either side of this one, per
 * DDR-052.
 *
 * Every word is the project's own record, stated once in `content/` and shown on the page as well,
 * per ADR-002, and the words around it are the view's strings beside the projects. The name is the
 * view's one `h1`, and the label above the technologies is an `h2`, so the view's outline is the
 * project and what it is built with. Where the project says how it was built, that follows the
 * description under an `h2` of the same kind, per DDR-078. Where the project has a business case,
 * a switch under the name lets the reader read that in place of the description and how it was
 * built, per DDR-079; everything else on the view stays where it is.
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
  project: { name, media, caption, gallery, technologies, description, howBuilt, businessCase, links },
  strings: {
    back,
    howBuilt: howBuiltTitle,
    accounts: accountsName,
    overview: overviewWord,
    businessCase: businessCaseWord,
    downloadBusinessCase,
    builtWith,
    gallery: galleryTitle,
    newTab,
    previous: previousWord,
    next: nextWord,
    neighbour,
  },
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
  /** A class for a part of the overview, which the business case hides where the project has one. */
  const overviewOnly = (className: string) =>
    businessCase ? `${className} ${styles.overviewOnly}` : className;

  const overview = (
    <>
      <p className={styles.description}>{description}</p>
      {/* How the project was built, per DDR-078, where the owner's knowledge base says: one
          paragraph or several, each with the owner's bold phrases as `strong`, as the
          introduction's summary sets them. A project without it shows neither the heading nor
          an empty paragraph. */}
      {howBuilt && howBuilt.length > 0 && (
        <>
          <h2 className={styles.label}>{howBuiltTitle}</h2>
          {howBuilt.map((paragraph, index) => (
            <p key={index} className={styles.howBuilt}>
              {paragraph.map((part, partIndex) =>
                typeof part === 'string' ? part : <strong key={partIndex}>{part.strong}</strong>,
              )}
            </p>
          ))}
        </>
      )}
    </>
  );

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
          {businessCase ? (
            <>
              <Accounts
                name={accountsName}
                overview={overviewWord}
                businessCase={businessCaseWord}
              />
              <div className={styles.overview}>{overview}</div>
              <BusinessCase items={businessCase.items} />
            </>
          ) : (
            overview
          )}
          {/* "Built with", its tags and the links belong to the overview where there is a business
              case, per DDR-079, so the stylesheet hides them while it is shown. */}
          <h2 className={overviewOnly(styles.label)}>{builtWith}</h2>
          <ul className={overviewOnly(styles.technologies)}>
            {technologies.map((technology) => (
              <li key={technology} className={styles.tag}>
                {technology}
              </li>
            ))}
          </ul>
          <ul className={overviewOnly(styles.links)}>
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
          {/* While the business case is shown, the links give way to its full document, per
              DDR-079: a file this site carries, so its path goes through asset(), per ADR-004,
              and it downloads in place, as the CV does. */}
          {businessCase && (
            <ul className={`${styles.links} ${styles.caseLinks}`}>
              <li>
                <a href={asset(businessCase.file)} className={styles.primary} download>
                  <Icon name="download" />
                  {downloadBusinessCase}
                </a>
              </li>
            </ul>
          )}
        </div>
        <figure className={styles.figure}>
          <Media media={media} className={styles.media} />
          <figcaption className={styles.caption}>{caption}</figcaption>
        </figure>
      </div>
      {/* Further pictures and videos, below the introduction, per DDR-053 (node 59:84). A project
          the owner has supplied none for shows no gallery and no heading. */}
      {gallery && gallery.length > 0 && <Gallery title={galleryTitle} items={gallery} />}
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
