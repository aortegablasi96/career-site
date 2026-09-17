import { asset } from '@/app/asset';
import type { Cv, Introduction as IntroductionContent } from '@/content/types';
import { Icon } from './icon';
import { MetadataLine } from './metadata-line';
import styles from './introduction.module.css';

/**
 * The introduction at the top of the page, per DDR-010: who the owner is, that they are available,
 * and how to reach them, without scrolling.
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
 */
export function Introduction({
  introduction,
  cv,
}: {
  introduction: IntroductionContent;
  cv: Cv;
}) {
  const { photo, name, positioning, location, relocation, summary, availability, contact } =
    introduction;

  return (
    <header className={styles.introduction}>
      <span className={styles.frame}>
        <img className={styles.photo} src={asset(photo.file)} alt={photo.alt} />
      </span>
      <div className={styles.text}>
        <h1>{name}</h1>
        <p className={styles.positioning}>{positioning}</p>
        <MetadataLine parts={[location, relocation]} className={styles.location} />
        <p>{summary}</p>
        <p>{availability}</p>
        <ul className={styles.controls}>
          {contact.map(({ text, href, icon }) => (
            <li key={href}>
              <a href={href} className={styles.contact}>
                <Icon name={icon} />
                {text}
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
