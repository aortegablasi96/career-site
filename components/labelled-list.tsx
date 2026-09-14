import styles from './labelled-list.module.css';

/** A row of a labelled list: a label, such as a level or a language, and its value. */
export interface LabelledRow {
  label: string;
  value: string;
}

/**
 * A list of labels and their values, which skills and languages share, per DDR-006. It is a
 * description list. Each row reads as its label in semibold, a colon, and its value, on one line
 * that wraps back to its start, so it needs no width and no breakpoint.
 */
export function LabelledList({ rows }: { rows: readonly LabelledRow[] }) {
  return (
    <dl className={styles.list}>
      {rows.map(({ label, value }) => (
        <div key={label} className={styles.row}>
          <dt className={styles.label}>{`${label}:`}</dt> <dd className={styles.value}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
