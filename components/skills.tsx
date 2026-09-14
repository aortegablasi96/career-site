import type { SkillGroup, SkillLevelName } from '@/content/types';
import { LabelledList } from './labelled-list';
import styles from './skills.module.css';

/**
 * The owner's skills, in the groups the content gives, per DDR-006. Each group has its name as a
 * heading, then one row per level, in the order the levels are given, strongest first. The label
 * is the level, and the value is the group's skills at that level. A level with no skills in the
 * group is left out.
 */
export function Skills({ levels, groups }: { levels: readonly SkillLevelName[]; groups: readonly SkillGroup[] }) {
  return (
    <>
      {groups.map(({ name, skills }) => (
        <section key={name} className={styles.group}>
          <h3>{name}</h3>
          <LabelledList
            rows={levels.flatMap(({ level, name: label }) => {
              const listed = skills[level] ?? [];

              return listed.length > 0 ? [{ label, value: listed.join(', ') }] : [];
            })}
          />
        </section>
      ))}
    </>
  );
}
