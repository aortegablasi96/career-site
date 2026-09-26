import type { ReactNode } from 'react';
import styles from './section.module.css';

/**
 * One of the page's major sections, per DDR-006. It is named by its heading, so it is a landmark
 * a screen reader can move to, and its id is where the contents link to.
 *
 * It is given its items, such as roles or skill groups, one element each. The heading and the
 * first item share one block, which print keeps on one page, so a heading never ends a page
 * without what it introduces, per DDR-008.
 *
 * A timeline is the exception, per DDR-057: its one item is the whole timeline, because on screen
 * the entries are one row that scrolls and a row needs one parent. Kept whole on paper, that block
 * is taller than what the introduction leaves of the first sheet, and both browsers push the whole
 * section to the next one. So a section given `breakable` lets paper break inside it, and relies on
 * the heading's own `break-after: avoid` to stay with the first entry, which Edge honours and
 * Firefox does not.
 *
 * The heading carries the decorative rule DDR-010 gives it, which is drawn by the stylesheet as a
 * pseudo-element rather than added here as an element: it carries no information, and a heading
 * that names its section through aria-labelledby should have nothing else in its accessible name.
 */
/** The id of a section's heading, which names the section and anything in it that needs its name. */
export function headingId(id: string): string {
  return `${id}-title`;
}

export function Section({
  id,
  title,
  items,
  breakable = false,
}: {
  id: string;
  title: string;
  items: readonly ReactNode[];
  /** Whether paper may break inside the heading's block, as it must for a timeline, per DDR-057. */
  breakable?: boolean;
}) {
  const titleId = headingId(id);
  const [first, ...rest] = items;

  return (
    <section id={id} aria-labelledby={titleId} className={styles.section}>
      <div className={breakable ? `${styles.opening} ${styles.breakable}` : styles.opening}>
        <h2 id={titleId} className={styles.heading}>
          {title}
        </h2>
        {first}
      </div>
      {rest}
    </section>
  );
}
