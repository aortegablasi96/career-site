import { Icon } from './icon';
import styles from './hint.module.css';

/**
 * The line above a section's cards that says each card leads to a view of its own, per DDR-059 as
 * DDR-067 amends it: the experience timeline's and, since #195, the projects'. It is 11px in the
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
