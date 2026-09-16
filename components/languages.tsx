import type { Language } from '@/content/types';
import styles from './languages.module.css';

/**
 * The languages the owner speaks, in the order the content gives, per DDR-010: one card each, with
 * the language as its term and the owner's CEFR level below it.
 *
 * It is a description list, as DDR-006's labelled list was, so a language and its level stay a pair
 * rather than becoming two unrelated lines. Each card wraps its pair in a `div`, which a `dl`
 * allows and which gives the row something to lay out.
 *
 * The card's border is decoration: the pairing is carried by the markup and by the words, so
 * removing every border would lose nothing, per DDR-010.
 */
export function Languages({ languages }: { languages: readonly Language[] }) {
  return (
    <dl className={styles.cards}>
      {languages.map(({ name, level }) => (
        <div key={name} className={styles.card}>
          <dt className={styles.name}>{name}</dt>
          <dd className={styles.level}>{level}</dd>
        </div>
      ))}
    </dl>
  );
}
