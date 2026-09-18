import { ContentsBar } from './contents-bar';
import styles from './contents.module.css';

/**
 * The page's contents, per DDR-031: a bar pinned to the top of the window, holding one link to
 * each section. DDR-010 rejected the design's sticky bar on five grounds and DDR-006 on two before
 * it; DDR-031 supersedes both and answers each ground, and this is what it answers the last of
 * them with — the bar replaces the row that scrolled away with the introduction rather than
 * repeating it, so the page still lists its sections in one place.
 *
 * Each link shows the word the design draws rather than its section's heading, so the fourth reads
 * "Education" where its section reads "Education and certifications". The word is a string in
 * `content/`, beside the section's own title, per ADR-002, and the section's accessible name is
 * still taken from its `h2` rather than from here.
 *
 * It renders no state of its own: nothing marks the current section. What the bar does in the
 * browser — its edge, a hairline and a shadow drawn once the page has scrolled, per DDR-034, and
 * the glide a link starts, per DDR-041 — is `ContentsBar`'s, the one Client Component on the site,
 * per ADR-007 and ADR-008. This stays a Server Component and hands it the list as children, so only
 * the band is client code.
 *
 * With no sections there is nothing to list, so nothing renders.
 */
export function Contents({
  label,
  sections,
}: {
  label: string;
  sections: readonly { id: string; link: string }[];
}) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <ContentsBar label={label}>
      <ul className={styles.list}>
        {sections.map(({ id, link }) => (
          <li key={id}>
            <a href={`#${id}`} className={styles.link}>
              {link}
            </a>
          </li>
        ))}
      </ul>
    </ContentsBar>
  );
}
