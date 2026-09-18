import { Fragment } from 'react';
import type { SkillGroup, SkillLevel, SkillLevelName } from '@/content/types';
import styles from './skills.module.css';

/**
 * The tint a level badge takes. Which tint belongs to which level is recorded here, beside the
 * markup, as `icon.tsx` records which mark belongs to which contact: a component maps a key from
 * `content/` to a shape, so no prose and no colour leaves its own layer.
 *
 * The tints read as a ranking, which is intended, and nothing depends on their reading that way:
 * each badge holds its level as a word, so the ranking survives greyscale, paper and a screen
 * reader, per DDR-010.
 */
const tints: Record<SkillLevel, string> = {
  advanced: styles.advanced,
  proficient: styles.proficient,
  basic: styles.basic,
};

/**
 * Two skill groups, which are one row of the section's grid, per DDR-010. Each group is its name as
 * an `h3` followed by one block per level, strongest first, and a level with no skills in the group
 * is left out.
 *
 * A block is a level badge — the level as a word in a tinted pill — above that level's skills
 * separated by middle dots, per DDR-037. The two stay in one paragraph, badge first, so a reader
 * still meets the level and then its skills; the skills are wrapped only so the stylesheet can start
 * them on a line of their own. Levels stay words: no bars, stars, dots or percentages, which is
 * DDR-006's rule carried forward by DDR-010. The badge's tint repeats what the badge says, so
 * nothing on the page depends on colour, and the middle dots between skills are punctuation that
 * assistive technology does not announce, as the metadata line's are.
 *
 * The page hands the section two groups at a time rather than all four, because the two columns
 * have to be one grid and the section keeps its heading with its first item on paper, per DDR-008 —
 * so the row, not the group, is the section's item. `skillRows` below is what splits them, and
 * below the wide breakpoint a row is simply its groups one after the other.
 */
export function Skills({ levels, groups }: { levels: readonly SkillLevelName[]; groups: readonly SkillGroup[] }) {
  return (
    <div className={styles.row}>
      {groups.map(({ name, skills }) => (
        <section key={name} className={styles.group}>
          <h3 className={styles.name}>{name}</h3>
          {levels.map(({ level, name: label }) => {
            const listed = skills[level] ?? [];

            return listed.length === 0 ? null : (
              <p key={level} className={styles.level}>
                <span className={`${styles.badge} ${tints[level]}`}>{label}</span>{' '}
                <span className={styles.skills}>
                  {listed.map((skill, index) => (
                    // The skills are fixed and never reordered, so their position identifies them.
                    <Fragment key={skill}>
                      {index > 0 && (
                        <>
                          {' '}
                          <span aria-hidden="true">·</span>{' '}
                        </>
                      )}
                      {skill}
                    </Fragment>
                  ))}
                </span>
              </p>
            );
          })}
        </section>
      ))}
    </div>
  );
}

/** How many groups stand side by side from the wide breakpoint, per DDR-010. */
const columns = 2;

/**
 * The groups split into the rows of the section's grid, which `app/page.tsx` hands to the section
 * one at a time.
 *
 * The count lives here, with the stylesheet that draws the columns, rather than in the page: the
 * two have to agree, and this is the file that would be edited if the design ever changed its mind.
 * A row short of a group simply leaves the track empty, as a grid does.
 */
export function skillRows(groups: readonly SkillGroup[]): readonly (readonly SkillGroup[])[] {
  return Array.from({ length: Math.ceil(groups.length / columns) }, (_, index) =>
    groups.slice(index * columns, (index + 1) * columns),
  );
}
