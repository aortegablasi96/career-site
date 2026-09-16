import type { ReactNode } from 'react';
import { MetadataLine } from './metadata-line';
import styles from './entry.module.css';

/**
 * A credential: a title, a line of metadata, and a body, which a certification does not have. It is
 * an article, which the print styles keep whole on one page.
 *
 * This is DDR-006's entry anatomy, which DDR-010 supersedes. It was shared by roles, projects and
 * credentials; experience left it for the timeline on #49 and the projects for the media-and-text
 * row on #50, so credentials are the last to use it, until #51 rebuilds them as a timeline too.
 */
export function Entry({
  title,
  metadata,
  children,
}: {
  title: string;
  metadata: readonly ReactNode[];
  children?: ReactNode;
}) {
  return (
    <article className={styles.entry}>
      <h3>{title}</h3>
      <MetadataLine parts={metadata} className={styles.metadata} />
      {children}
    </article>
  );
}
