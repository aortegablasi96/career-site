import { asset } from '@/app/asset';
import type { ContactIcon, Cv, Introduction as IntroductionContent } from '@/content/types';
import { Icon } from './icon';
import { MetadataLine } from './metadata-line';
import styles from './introduction.module.css';

/**
 * The introduction at the top of the page, per DDR-010: who the owner is, in their own words, and
 * how to reach them, without scrolling.
 *
 * Since DDR-056 a greeting stands before the name. It is a paragraph of its own rather than part
 * of the `h1`, so the heading and the page's outline still carry the name alone, and a screen
 * reader meets the greeting and then the heading, once each. The two are an `hgroup`, which is
 * HTML's element for a heading and the words that go with it, and which lets them sit beside the
 * photo or below it together, never one on each side of it. It is on screen only: the printed CV
 * opens with the name. The location carries a map pin, which is decoration like every other mark
 * here, so the place is still read as its words.
 *
 * The photo sits beside the name from the wide breakpoint and above it below, which is also the
 * order of the markup, so nothing is reordered to suit a width, per DDR-014. Placing it beside the
 * name rather than above is what keeps the positioning line and the controls above the fold on a
 * phone.
 *
 * The photo sits inside a frame, per DDR-021, because the design lights it twice: a glow outside
 * and a shadow inside its top edge. An inset box-shadow on an `<img>` paints nothing — the
 * replaced content covers it, in Chromium and Gecko alike — so the frame carries the glow and
 * draws the inner shadow as a pseudo-element over the image. The frame holds no content and takes
 * no name: the photo is still the `<img>`, with its own alternative text.
 *
 * The photo carries no width or height attribute. Both of its dimensions are set in the stylesheet,
 * from tokens, which fixes the box before the image arrives just as the attributes would; it has to
 * be done there because the size is a design value that differs between the breakpoints and on
 * paper, and an attribute cannot follow that.
 *
 * The four controls are the three contact addresses and the CV download. They are the one place on
 * the page a link is not underlined, per DDR-010, so each is identified by its border or fill
 * together with its mark — two cues, neither of them a colour.
 *
 * Each contact pill shows the design's short label — "Email", "LinkedIn", "GitHub" — rather than the
 * address it links to, per DDR-029. The address is not lost: the footer shows all three, on screen
 * and on paper alike, which is what makes the label possible at all. So the pill prints its label
 * and nothing after it, and the printed CV still carries every address once.
 *
 * The LinkedIn and GitHub pills open a new tab, per DDR-043. Since DDR-044 nothing on the pill
 * shows it: the link's accessible name says so instead, so assistive technology still announces it
 * before the pill is chosen. The email pill opens the mail client and says nothing of a tab.
 *
 * Each contact pill is its service's own button, per DDR-044: Gmail's white button with its
 * four-colour M, and LinkedIn's and GitHub's filled in the brand's colour with a white mark.
 */
/**
 * The class that makes each contact pill its service's own button, per DDR-044: Gmail's, since the
 * address is on gmail.com, LinkedIn's and GitHub's.
 */
const brandButton: Record<ContactIcon, string> = {
  gmail: styles.gmail,
  linkedin: styles.linkedin,
  github: styles.github,
};

export function Introduction({
  introduction,
  cv,
}: {
  introduction: IntroductionContent;
  cv: Cv;
}) {
  const {
    photo,
    greeting,
    name,
    positioning,
    location,
    summary,
    contact,
    newTab,
  } = introduction;

  return (
    <header className={styles.introduction}>
      <span className={styles.frame}>
        <img className={styles.photo} src={asset(photo.file)} alt={photo.alt} />
      </span>
      <div className={styles.text}>
        <hgroup className={styles.heading}>
          <p className={styles.greeting}>{greeting}</p>
          <h1>{name}</h1>
        </hgroup>
        <p className={styles.positioning}>{positioning}</p>
        <MetadataLine
          parts={[
            <>
              <Icon name="location" />
              {location}
            </>,
          ]}
          className={styles.location}
        />
        <p className={styles.summary}>{summary}</p>
        <ul className={styles.controls}>
          {/* A profile opens in a new tab, so the page stays open behind it, per DDR-043. `noopener`
              keeps the new tab from reaching back to this one through `window.opener`; browsers
              imply it for a new tab today, and it is written out so the guarantee does not rest on
              a default.

              The pill shows no sign of the tab, per DDR-044, so its name carries it: the visible
              label first, so the name a speech-input user reads off the pill is still the start of
              the name, per WCAG 2.5.3, and then the words that say a tab opens. */}
          {contact.map(({ label, href, icon, newTab: opensNewTab }) => (
            <li key={href}>
              <a
                href={href}
                className={`${styles.contact} ${brandButton[icon]}`}
                {...(opensNewTab && {
                  target: '_blank',
                  rel: 'noopener',
                  'aria-label': `${label}, ${newTab}`,
                })}
              >
                <Icon name={icon} />
                {label}
              </a>
            </li>
          ))}
          {/* The CV is a file this site carries, so its path goes through asset(), per ADR-004.
              The control is hidden in print: a download is dead on paper, and the paper is the
              CV. */}
          <li className={styles.cvItem}>
            <a href={asset(cv.file)} className={styles.cv} download>
              <Icon name="download" />
              {cv.label}
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
