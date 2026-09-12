import styles from './contents.module.css';

/**
 * The list of links to the page's sections, per DDR-006. Each link's text is its section's own
 * title. With no sections there is nothing to list, so nothing renders.
 */
export function Contents({
  label,
  sections,
}: {
  label: string;
  sections: readonly { id: string; title: string }[];
}) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <nav aria-label={label} className={styles.contents}>
      <ul className={styles.list}>
        {sections.map(({ id, title }) => (
          <li key={id}>
            <a href={`#${id}`} className={styles.link}>
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
