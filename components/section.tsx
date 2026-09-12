import type { ReactNode } from 'react';
import styles from './section.module.css';

/**
 * One of the page's major sections, per DDR-006. It is named by its heading, so it is a landmark
 * a screen reader can move to, and its id is where the contents link to.
 */
export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId} className={styles.section}>
      <h2 id={headingId}>{title}</h2>
      {children}
    </section>
  );
}
