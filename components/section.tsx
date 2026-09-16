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
 * The heading carries the decorative rule DDR-010 gives it, which is drawn by the stylesheet as a
 * pseudo-element rather than added here as an element: it carries no information, and a heading
 * that names its section through aria-labelledby should have nothing else in its accessible name.
 */
export function Section({ id, title, items }: { id: string; title: string; items: readonly ReactNode[] }) {
  const headingId = `${id}-title`;
  const [first, ...rest] = items;

  return (
    <section id={id} aria-labelledby={headingId} className={styles.section}>
      <div className={styles.opening}>
        <h2 id={headingId} className={styles.heading}>
          {title}
        </h2>
        {first}
      </div>
      {rest}
    </section>
  );
}
