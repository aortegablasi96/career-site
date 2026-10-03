import { Fragment, type CSSProperties } from 'react';
import Link from 'next/link';
import { asset } from '@/app/asset';
import type {
  GalleryItem,
  PixelSize,
  Project,
  ProjectMedia,
  ProjectView as ProjectViewStrings,
} from '@/content/types';
import { BusinessCaseSlider } from './business-case-slider';
import { Icon } from './icon';
import { LargerPicture, type Steps } from './larger-picture';
import { openChatCommand } from './open-chat';
import { projectHref } from './projects';
import styles from './project-view.module.css';

/**
 * The box every picture a view shows stands in, per DDR-088 and ADR-021, as the two properties its
 * stylesheets read. Its shape is the tallest of the pictures' and videos' own, so each is as wide as
 * the box and a wider one leaves a band above and below it: the frame is one height whichever
 * picture it shows, and the larger picture one size whichever the reader steps to. Its greatest
 * width is the narrowest file's, so the larger picture never shows a picture larger than its own
 * file, per DDR-082. A lone picture's box is the picture itself.
 */
export function box(media: readonly PixelSize[]): CSSProperties {
  const tallest = media.reduce((one, other) =>
    other.height * one.width > one.height * other.width ? other : one,
  );
  const narrowest = Math.min(...media.map(({ width }) => width));

  return {
    '--project-view-box-ratio': `${tallest.width} / ${tallest.height}`,
    '--project-view-box-width': `${narrowest}px`,
  } as CSSProperties;
}

/**
 * The picture in the lead's frame, which opens larger, per DDR-082. A video is shown as its still
 * and opens larger the same way, to be played there, per DDR-089.
 */
function Frame({
  media,
  caption,
  id,
  enlarge,
  close,
  steps,
}: {
  media: ProjectMedia;
  caption: string;
  /** The larger picture's identifier, unique within the view. */
  id: string;
  /** The names of the controls that open it larger and close it. */
  enlarge: string;
  close: string;
  /** In a gallery, the items before and after it, per DDR-083. */
  steps?: Steps;
}) {
  return (
    <LargerPicture
      media={media}
      caption={caption}
      id={id}
      enlarge={enlarge}
      close={close}
      className={styles.media}
      steps={steps}
    />
  );
}

/**
 * A picture's thumbnail in the gallery's row, per DDR-081 (node 405:93): the picture itself, or a
 * video's poster, cropped to the row's small frame.
 *
 * It is the label of the picture's radio, so choosing it shows that picture in the lead's frame.
 * Above the image is the picture's name, which the stylesheet shows over the chosen thumbnail as it
 * rises, per DDR-081. The radio is named by the same caption and the picture in the frame carries
 * its alternative text, so the name and the image are hidden from assistive technology and say
 * nothing twice. A label is not in the tab order: the keyboard reaches the pictures through their
 * radios.
 */
function Thumbnail({ media, caption, index }: { media: ProjectMedia; caption: string; index: number }) {
  return (
    <label htmlFor={`picture-${index}`} className={styles.thumbnail}>
      <span className={styles.thumbnailName} aria-hidden="true">
        {caption}
      </span>
      <img
        className={styles.thumbnailImage}
        src={asset('poster' in media ? media.poster : media.file)}
        alt=""
      />
    </label>
  );
}

/**
 * A project's gallery, per DDR-081 and ADR-017, as `career-site-business-case` draws it (node
 * 405:80): one picture in the lead's frame, and under it a row of thumbnails. Choosing a thumbnail
 * shows its picture in the frame, and the chosen thumbnail rises with the picture's name above it,
 * as the owner asked on #244. The name is the picture's caption, which the frame no longer shows
 * beneath it.
 *
 * The pictures are the ones the gallery lists, per DDR-084, as the owner asked on #253, where
 * DDR-081 put the lead's first: the lead picture is what the project's card shows on the page, and
 * a view shows it again only where the gallery lists it.
 *
 * The pictures are a native radio group, as the business-case switch is, per ADR-014: each picture
 * is a radio followed by its `figure`, and the stylesheet shows the figure whose radio is checked.
 * So the browser holds the choice, the keyboard moves between the pictures with the arrow keys,
 * assistive technology announces each by its caption, and all of it works without script. The
 * first picture's radio is checked in the markup, so a view opens on the gallery's first picture.
 *
 * Each picture carries its own control that opens it larger, per DDR-082, so the one on the picture
 * shown is the one a reader meets, and it opens that picture, whichever was chosen. A video does too,
 * and is played larger, per DDR-089. Larger, each steps to the item before and after it, per DDR-083
 * as DDR-089 amends it, in the thumbnails' order and in a loop, as the business case's items do
 * (DDR-080), and the place they show counts every item.
 *
 * The row shows every picture's thumbnail, as the owner asked on #244, where the design draws two
 * and a count of the rest. It wraps where the column runs out of room.
 *
 * Every picture and video stands in one box, per DDR-088, as the owner asked on #263, so the frame
 * is one height whichever is chosen, the row under it never moves, and each larger picture is one
 * size. The group hands the box to its stylesheets, and its dialogs inherit it.
 *
 * A video plays only when the reader starts it, larger, and fetches nothing before that, per DDR-010
 * and ADR-004. One view is one page, so the radios' `name` and the identifiers need only be unique
 * within it.
 */
function Pictures({
  name,
  pictures,
  enlarge,
  close,
  previousPicture,
  nextPicture,
  position,
}: {
  /** The radio group's accessible name. */
  name: string;
  /** The gallery's items, in the content's order. */
  pictures: readonly GalleryItem[];
  /** The names of the controls that open a picture larger and close it, per DDR-082. */
  enlarge: string;
  close: string;
  /** The names of the controls that step between the larger pictures, and the place, per DDR-083. */
  previousPicture: string;
  nextPicture: string;
  position: (place: number, count: number) => string;
}) {
  const count = pictures.length;
  const neighbour = (index: number) => `picture-${(index + count) % count}-larger`;
  const steps = (index: number): Steps => ({
    choice: `picture-${index}`,
    previous: neighbour(index - 1),
    next: neighbour(index + 1),
    position: position(index + 1, count),
    previousName: previousPicture,
    nextName: nextPicture,
  });

  return (
    <div
      role="radiogroup"
      aria-label={name}
      className={styles.pictures}
      style={box(pictures.map(({ media }) => media))}
    >
      {pictures.map(({ media, caption }, index) => (
        <Fragment key={media.file}>
          <input
            type="radio"
            name="picture"
            id={`picture-${index}`}
            className={styles.pick}
            aria-labelledby={`picture-${index}-caption`}
            defaultChecked={index === 0}
          />
          <figure className={styles.figure}>
            <Frame
              media={media}
              caption={caption}
              id={`picture-${index}-larger`}
              enlarge={enlarge}
              close={close}
              steps={steps(index)}
            />
            <figcaption id={`picture-${index}-caption`} className={styles.pictureCaption}>
              {caption}
            </figcaption>
          </figure>
        </Fragment>
      ))}
      <div className={styles.thumbnails}>
        {pictures.map(({ media, caption }, index) => (
          <Thumbnail key={media.file} media={media} caption={caption} index={index} />
        ))}
      </div>
    </div>
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
 * widths, per DDR-014. Where the project has a gallery of pictures and videos, the view shows those
 * in the lead's place, per DDR-084: the first of them in the frame, and their thumbnails under it,
 * each choosing the picture the frame shows, per DDR-081. At the foot, below a divider, the
 * projects on either side of this one, per DDR-052.
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
 * outlined, as the design draws the two, and any other place the project runs follows the same
 * way. Where the project invites the reader to try it, a line above them says so, per DDR-096. Each
 * leaves the site for another one the reader means to come back from, so each opens a new tab, per
 * DDR-043 as DDR-050 extends it, and says so to assistive technology after its own text. Since
 * DDR-100 the invitation's words open the chat with the Digital Twin instead, where script runs. Nothing on
 * the link shows it: the arrow out of a box says the link leaves the site, which it does whichever
 * tab it opens in.
 *
 * The way back is a route of this site, so it goes through `next/link`, which puts the base path in
 * front of it, per ADR-010. It leads to the projects section rather than the top of the page. It
 * does not prefetch, per ADR-010: prefetching the page would fetch its photo and every project's
 * picture on each view, whether or not the reader goes back.
 */
export function ProjectView({
  project: {
    name,
    media,
    caption,
    gallery,
    technologies,
    description,
    howBuilt,
    businessCase,
    invitation,
    links,
  },
  strings: {
    back,
    howBuilt: howBuiltTitle,
    accounts: accountsName,
    overview: overviewWord,
    businessCase: businessCaseWord,
    downloadBusinessCase,
    previousItem,
    nextItem,
    builtWith,
    gallery: galleryName,
    enlarge,
    close,
    previousPicture,
    nextPicture,
    position,
    newTab,
    previous: previousWord,
    next: nextWord,
    neighbour,
  },
  backHref,
  previous,
  next,
  chat,
}: {
  project: Project;
  strings: ProjectViewStrings;
  /** The route of the projects section on the page. */
  backHref: string;
  /** The project the page shows before this one, if this is not the first. */
  previous?: Project;
  /** The project the page shows after this one, if this is not the last. */
  next?: Project;
  /** The id of the chat's panel, which words in the invitation may open, per DDR-100. */
  chat?: string;
}) {
  /** A class for a part of the overview, which the business case hides where the project has one. */
  const overviewOnly = (className: string) =>
    businessCase ? `${className} ${styles.overviewOnly}` : className;

  /** The picture a view without a row of thumbnails shows: a gallery's one, or the lead, per DDR-084. */
  const only: GalleryItem = gallery?.[0] ?? { media, caption };

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
    <article className={styles.view} data-appear>
      <Link href={backHref} className={styles.back} prefetch={false}>
        <span className={styles.backMark}>
          <Icon name="back" />
        </span>
        {back}
      </Link>
      <div className={styles.columns} data-appear>
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
              {/* The business case, one item at a time, per DDR-080, which the stylesheet hides
                  until its option is checked. */}
              <div className={styles.businessCase}>
                <BusinessCaseSlider
                  items={businessCase.items}
                  previous={previousItem}
                  next={nextItem}
                />
              </div>
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
          {/* Where the project invites the reader to try it, a line above the links, per DDR-096,
              which goes with them while the business case is shown. Its link leaves the site as
              they do, so it opens a new tab and says so after its own text, as they do. */}
          {invitation && (
            <p className={overviewOnly(styles.invitation)}>
              {invitation.map((part, index) => {
                if (typeof part === 'string') {
                  return part;
                }

                const { text, href } = part;
                const link = (
                  <a
                    key={index}
                    href={href}
                    className={'chat' in part && chat ? styles.withoutScript : undefined}
                    target="_blank"
                    rel="noopener"
                    aria-label={`${text}, ${newTab}`}
                  >
                    {text}
                  </a>
                );

                // Since DDR-100 words that open the chat do so where script runs, by the chat's own
                // command, and stay the link to the chatbot's page where it doesn't.
                if (!('chat' in part) || !chat) {
                  return link;
                }

                return (
                  <Fragment key={index}>
                    {link}
                    <button
                      type="button"
                      className={styles.withScript}
                      commandfor={chat}
                      command={openChatCommand}
                    >
                      {text}
                    </button>
                  </Fragment>
                );
              })}
            </p>
          )}
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
        {/* Where the project has a gallery, its pictures and videos, with their thumbnails under
            the one shown, per DDR-081 (node 405:80). They are the gallery's own, per DDR-084: the
            lead picture is the card's, and a view shows it again only where the gallery lists it.
            A project the owner has supplied none for shows its lead picture alone, as it did
            before, and a gallery of one shows that one the same way. Either way, the picture shown
            can be opened larger, per DDR-082. */}
        {gallery && gallery.length > 1 ? (
          <Pictures
            name={galleryName}
            pictures={gallery}
            enlarge={enlarge}
            close={close}
            previousPicture={previousPicture}
            nextPicture={nextPicture}
            position={position}
          />
        ) : (
          <figure className={styles.figure} style={box([only.media])}>
            <Frame
              media={only.media}
              caption={only.caption}
              id="picture-larger"
              enlarge={enlarge}
              close={close}
            />
            <figcaption className={styles.caption}>{only.caption}</figcaption>
          </figure>
        )}
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
