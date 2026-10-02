import { asset } from '@/app/asset';
import type { Cv, Introduction as IntroductionContent } from '@/content/types';
import { ContactControls } from './contact-controls';
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
 * The photo sits beside the name at every width, and is first in the markup as it is first on the
 * page, so nothing is reordered to suit a width, per DDR-014. Placing it beside the name rather than
 * above is what keeps the positioning line and the controls above the fold on a phone. Below the
 * wide breakpoint the two are one row, sized to balance and centred on each other, per DDR-077, and
 * the text column's other blocks follow at the full width.
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
 * The question, the line below it and the four controls are `ContactControls`, which since DDR-099
 * each view ends with as well; its own comment says how the controls are drawn and named.
 */
export function Introduction({
  introduction,
  cv,
}: {
  introduction: IntroductionContent;
  cv: Cv;
}) {
  const { photo, greeting, name, positioning, location, summary } = introduction;

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
        {/* The owner's bold phrase is `strong`, which DDR-023 sets semibold, inside the one
            paragraph, so it is read in its place in the sentence. */}
        <p className={styles.summary}>
          {summary.map((part, index) =>
            typeof part === 'string' ? part : <strong key={index}>{part.strong}</strong>,
          )}
        </p>
        {/* The question, the line below it and the four controls, per DDR-072 and DDR-076, which
            since DDR-099 each view ends with too. They are blocks of this column, read after the
            summary. */}
        <ContactControls introduction={introduction} cv={cv} />
      </div>
    </header>
  );
}
