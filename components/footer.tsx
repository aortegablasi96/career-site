import type { ContactLink } from '@/content/types';
import styles from './footer.module.css';

/**
 * The page's footer, per DDR-028, which supersedes DDR-010's "There is no footer": the owner's
 * name on the left, the three contact addresses on the right, above a hairline at the foot of the
 * page.
 *
 * It is given the introduction's own `name` and `contact` records rather than records of its own,
 * so the two places the addresses appear cannot disagree and no string is restated in `content/`,
 * per ADR-002. It ignores each contact's `icon`: the design draws no mark here, and the pills above
 * are where a contact is a control with a shape of its own.
 *
 * It sits after `main` rather than inside it, so it is the page's `contentinfo` landmark, and it
 * adds no heading, so the page's outline is the one DDR-010 sets and this record does not touch.
 *
 * Its links are not underlined, which is the design's and is the one thing about this footer that
 * needed deciding: DDR-012 made the underline what identifies a link, and DDR-028 records what
 * identifies these instead — each is an address, and each repeats a contact control the
 * introduction has already identified by its icon, its shape and its fill.
 *
 * On paper the footer prints, where `nav` does not. That is deliberate and it is what #97 depends
 * on: the printed CV has to carry the three addresses somewhere, and once the pills above are
 * labelled this is the only place left that carries them.
 */
export function Footer({ name, contact }: { name: string; contact: readonly ContactLink[] }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.name}>{name}</p>
        <ul className={styles.addresses}>
          {contact.map(({ text, href }) => (
            <li key={href}>
              <a href={href} className={styles.link}>
                {text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
