import { asset } from '@/app/asset';
import type { ContactIcon, Cv, Introduction } from '@/content/types';
import { Icon } from './icon';
import styles from './contact-controls.module.css';

/**
 * The introduction's way to get in touch: the question, the line that says what the controls are
 * for, and the four controls, which are the three contact addresses and the CV download. Since
 * DDR-099 a project's view and a role's view end with it too, so a reader who lands on a view from
 * a shared link can act on what they read without going back to the page. It is one component so
 * the five places can never draw it differently.
 *
 * It renders its three blocks with no box of their own, so each place lays them out in its own
 * column: the introduction as blocks of its text column, which below the wide breakpoint are the
 * items of its row, per DDR-077, and a view inside a block of its own.
 *
 * The question is a paragraph rather than a heading, per DDR-072, so the outline gains nothing, and
 * the line below it is a quieter paragraph, per DDR-076. A screen reader reads the question, the
 * line and then the pills, once each.
 *
 * The four controls are the one place on the site a link is not underlined, per DDR-010, so each is
 * identified by its border or fill together with its mark — two cues, neither of them a colour.
 *
 * Each contact pill shows a short label — "LinkedIn", "GitHub" — rather than the address it links
 * to, per DDR-029; since DDR-073 the email pill's label, "Email me", is its name and not shown. The
 * address is not lost: the footer shows all three, on screen and on paper alike, which is what
 * makes the label possible at all. So the pill prints its label and nothing after it, and the
 * printed CV still carries every address once.
 *
 * The LinkedIn and GitHub pills open a new tab, per DDR-043. Since DDR-044 nothing on the pill shows
 * it: the link's accessible name says so instead, so assistive technology still announces it before
 * the pill is chosen. The email pill opens the mail client and says nothing of a tab.
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

export function ContactControls({
  introduction: { invitation, callToAction, contact, newTab },
  cv,
}: {
  introduction: Pick<Introduction, 'invitation' | 'callToAction' | 'contact' | 'newTab'>;
  cv: Cv;
}) {
  return (
    <>
      {/* The question the controls answer, per DDR-072. */}
      <p className={styles.invitation}>{invitation}</p>
      {/* What the controls below are for, per DDR-076: a quieter paragraph under the question,
          read after it and before the list. */}
      <p className={styles.callToAction}>{callToAction}</p>
      <ul className={styles.controls}>
        {/* A profile opens in a new tab, so the page stays open behind it, per DDR-043. `noopener`
            keeps the new tab from reaching back to this one through `window.opener`; browsers
            imply it for a new tab today, and it is written out so the guarantee does not rest on
            a default.

            The pill shows no sign of the tab, per DDR-044, so its name carries it: the visible
            label first, so the name a speech-input user reads off the pill is still the start of
            the name, per WCAG 2.5.3, and then the words that say a tab opens. */}
        {/* A pill that shows its mark alone, per DDR-073, takes its label as its name instead, so a
            screen reader still announces what it does. */}
        {contact.map(({ label, href, icon, markOnly, newTab: opensNewTab }) => (
          <li key={href}>
            <a
              href={href}
              className={`${styles.contact} ${brandButton[icon]}${markOnly ? ` ${styles.markOnly}` : ''}`}
              {...(markOnly && { 'aria-label': label })}
              {...(opensNewTab && {
                target: '_blank',
                rel: 'noopener',
                'aria-label': `${label}, ${newTab}`,
              })}
            >
              <Icon name={icon} />
              {!markOnly && label}
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
    </>
  );
}
