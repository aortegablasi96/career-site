import { Icon } from './icon';
import styles from './hint.module.css';

/**
 * The line above a section's cards that says each card leads somewhere, per DDR-059 as DDR-067
 * amends it: the experience timeline's, since #195 the projects', and since #200 the education
 * timeline's, per DDR-069. It is 11px in the
 * faint ink, after an information mark, and whatever follows it stands `--space-small` below.
 *
 * The mark repeats nothing the words do not say, so it is hidden from assistive technology, as every
 * other mark is. The hint is screen only, since paper has nothing to click.
 */
export function Hint({ text }: { text: string }) {
  return (
    <p className={styles.hint}>
      <Icon name="info" />
      {text}
    </p>
  );
}
