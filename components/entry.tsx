import type { ReactNode } from 'react';
import { MetadataLine } from './metadata-line';
import styles from './entry.module.css';

/**
 * A role, a project, or a credential, which share one anatomy, per DDR-006: a title, a line of
 * metadata, and a body. It is an article, which the print styles keep whole on one page.
 */
export function Entry({
  title,
  metadata,
  children,
}: {
  title: string;
  metadata: readonly ReactNode[];
  children: ReactNode;
}) {
  return (
    <article className={styles.entry}>
      <h3>{title}</h3>
      <MetadataLine parts={metadata} className={styles.metadata} />
      {children}
    </article>
  );
}
