import type { Project } from '@/content/types';
import { Entry } from './entry';
import styles from './projects.module.css';

/**
 * The owner's projects, in the order the content gives, per DDR-006. Each is an entry titled by the
 * project's name, with its technologies below it, a paragraph on what it is and what it
 * demonstrates, and a row of labelled links, which print their addresses on paper, per DDR-005.
 */
export function Projects({ projects }: { projects: readonly Project[] }) {
  return (
    <>
      {projects.map(({ name, technologies, description, links }) => (
        <Entry key={name} title={name} metadata={technologies}>
          <p>{description}</p>
          <ul className={styles.links}>
            {links.map(({ text, href }) => (
              <li key={href}>
                <a href={href} className={styles.link}>
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </Entry>
      ))}
    </>
  );
}
