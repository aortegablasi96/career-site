import { Fragment, type ReactNode } from 'react';
import styles from './metadata-line.module.css';

/**
 * A line of metadata, such as a place and dates, per DDR-006. Its parts are separated by a middle
 * dot that assistive technology does not announce; the spaces either side stay readable, so the
 * parts are not run together. A part may be markup, such as dates with their machine-readable
 * value.
 *
 * DDR-010 narrows it: where the timeline gives the dates, the place and the company lines of their
 * own, each is one of these with a single part, so every piece of metadata on the page is set the
 * same way and no separator is drawn.
 */
export function MetadataLine({ parts, className }: { parts: readonly ReactNode[]; className?: string }) {
  return (
    <p className={className ? `${styles.metadata} ${className}` : styles.metadata}>
      {parts.map((part, index) => (
        // The parts are fixed and never reordered, so their position identifies them.
        <Fragment key={index}>
          {index > 0 && (
            <>
              {' '}
              <span aria-hidden="true">·</span>{' '}
            </>
          )}
          {part}
        </Fragment>
      ))}
    </p>
  );
}
