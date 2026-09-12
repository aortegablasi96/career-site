import type { Introduction as IntroductionContent } from '@/content/types';
import { MetadataLine } from './metadata-line';
import styles from './introduction.module.css';

/**
 * The introduction at the top of the page, per DDR-006: who the owner is, that they are
 * available, and how to reach them.
 */
export function Introduction({ introduction }: { introduction: IntroductionContent }) {
  const { name, positioning, location, relocation, summary, availability, contact } = introduction;

  return (
    <header>
      <h1>{name}</h1>
      <p className={styles.positioning}>{positioning}</p>
      <MetadataLine parts={[location, relocation]} className={styles.location} />
      <p>{summary}</p>
      <p>{availability}</p>
      <ul className={styles.contact}>
        {contact.map(({ text, href }) => (
          <li key={href}>
            <a href={href} className={styles.contactLink}>
              {text}
            </a>
          </li>
        ))}
      </ul>
    </header>
  );
}
