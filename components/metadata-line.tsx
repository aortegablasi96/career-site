import { Fragment } from 'react';
import styles from './metadata-line.module.css';

/**
 * A line of metadata, such as a place and dates, per DDR-006. Its parts are separated by a middle
 * dot that assistive technology does not announce; the spaces either side stay readable, so the
 * parts are not run together.
 */
export function MetadataLine({ parts, className }: { parts: readonly string[]; className?: string }) {
  return (
    <p className={className ? `${styles.metadata} ${className}` : styles.metadata}>
      {parts.map((part, index) => (
        <Fragment key={part}>
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
