import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { skills } from '@/content/skills';
import type { SkillLevel } from '@/content/types';
import { Skills, skillRows } from './skills';

// Rendered with the real content, since which skills are listed, and at which level, is what #31
// asks for, and how they are grouped and badged is what #51 asks for. The page hands the section
// one row at a time; here they are rendered together, which reads the same.
const html = skillRows(skills.groups)
  .map((groups) => renderToStaticMarkup(<Skills levels={skills.levels} groups={groups} />))
  .join('');

/** Each group, in the order the page shows them. */
const groups = html.match(/<section[^>]*>.*?<\/section>/g) ?? [];

/** A group's levels, as the badge's word and the skills that follow it, as a reader meets them. */
const levelsOf = (group: string) =>
  [...group.matchAll(/<p class="[^"]*"><span class="([^"]*)">([^<]+)<\/span>(.*?)<\/p>/g)].map(
    ([, tint, label, listed]) => [
      // The tint's class, as the stylesheet names it: a CSS Module is hashed when it is imported.
      tint!.split(' ').at(-1)!.replace(/^_|_[^_]*$/g, ''),
      label!,
      listed!.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
    ],
  );

/** The stylesheet without its comments, so a rule is not matched against its explanation. */
const css = readFileSync(new URL('./skills.module.css', import.meta.url), 'utf8')
  .replace(/\r\n/g, '\n')
  .replace(/\/\*[\s\S]*?\*\//g, '');
const wide = css.match(/@media \(min-width: 48em\), print\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
const print = css.match(/@media print\s*\{([\s\S]*)\}\s*$/)?.[1] ?? '';

/** Every skill at a level, across the groups. */
const at = (level: SkillLevel) => skills.groups.flatMap((group) => group.skills[level] ?? []);

describe('Skills', () => {
  it('renders each group with its name as a heading, in the order the content gives', () => {
    const names = groups.map((group) => group.match(/^<section[^>]*><h3>([^<]+)<\/h3>/)?.[1]);

    expect(names).toEqual(skills.groups.map(({ name }) => name));
  });

  // DDR-010: each group is one block per level, strongest first, and each block is the level as a
  // word in a tinted badge followed by that level's skills separated by middle dots.
  it('follows each group’s name with its levels, strongest first, badged and dotted', () => {
    for (const [index, group] of groups.entries()) {
      const { skills: listed } = skills.groups[index]!;
      const expected = skills.levels
        .filter(({ level }) => listed[level]?.length)
        .map(({ level, name }) => [level, name, listed[level]!.join(' · ')]);

      expect(levelsOf(group)).toEqual(expected);
    }
  });

  it('leaves out a level with no skills in the group', () => {
    const fixture = renderToStaticMarkup(
      <Skills levels={skills.levels} groups={[{ name: 'Tools', skills: { advanced: [], basic: ['Salesforce'] } }]} />,
    );

    expect(levelsOf(fixture)).toEqual([['basic', 'Basic', 'Salesforce']]);
  });

  it('shows levels as words, with no score, bar, or graphic, per DDR-010', () => {
    expect(html).not.toMatch(/<(?:meter|progress|svg|img)\b|%/);
  });

  // The dots are punctuation between the skills, as the metadata line's are, so a screen reader
  // reads a level as its word and its skills rather than announcing a separator between each.
  it('hides the middle dots between skills from assistive technology', () => {
    const dots = [...html.matchAll(/<span aria-hidden="true">([^<]*)<\/span>/g)].map(([, dot]) => dot);
    const separators = skills.groups
      .flatMap(({ skills: listed }) => Object.values(listed))
      .reduce((count, listed) => count + listed.length - 1, 0);

    expect(dots).toHaveLength(separators);
    expect(new Set(dots)).toEqual(new Set(['·']));
  });

  it('lays the groups out two to a row, which is the grid DDR-010 gives the section', () => {
    expect(skillRows(skills.groups).map((row) => row.map(({ name }) => name))).toEqual([
      ['Product and delivery', 'AI'],
      ['Data and IoT', 'Tools'],
    ]);
    expect(skillRows(skills.groups.slice(0, 3)).map((row) => row.length)).toEqual([2, 1]);
    expect(skillRows([])).toEqual([]);
  });
});

// DDR-010 lays the section out and DDR-014 gives it the one breakpoint it may write. These read the
// stylesheet as written, so a later edit cannot quietly drop a rule an acceptance criterion rests
// on.
describe('skills styles', () => {
  it('stands two groups side by side from the wide breakpoint, and stacks them below it', () => {
    expect(wide).toMatch(/\.row\s*\{[^}]*grid-template-columns:\s*repeat\(2, 1fr\);/);
    expect(css).toMatch(/\.group \+ \.group\s*\{\s*margin-block-start:\s*var\(--space-item\);/);
    expect(wide).toMatch(/\.group \+ \.group\s*\{\s*margin-block-start:\s*0;/);
  });

  // DDR-012 records each tint with the ink it carries: 7.29:1, 8.88:1 and 6.92:1. Every one of them
  // clears 4.5:1, which is the floor the brief sets, and the words survive the tint being dropped.
  it('gives each level its own tint and ink, from the tokens DDR-012 measured', () => {
    for (const level of ['advanced', 'proficient', 'basic']) {
      expect(css).toMatch(
        new RegExp(
          `\\.${level}\\s*\\{\\s*background-color:\\s*var\\(--color-surface-level-${level}\\);\\s*color:\\s*var\\(--color-text-level-${level}\\);`,
        ),
      );
    }
  });

  it('sets a badge at the smallest step, which DDR-011 allows for tags and badges alone', () => {
    expect(css).toMatch(/\.badge\s*\{[^}]*font-size:\s*var\(--font-size-x-small\);/);
    expect(css).toMatch(/\.level\s*\{[^}]*font-size:\s*var\(--font-size-small\);/);
  });
});

describe('Skills in print', () => {
  it('keeps each group whole on one page, as a timeline row is, per DDR-010', () => {
    expect(print).toMatch(/\.group\s*\{[^}]*break-inside:\s*avoid;/);
  });

  // The tints are dropped by the tokens, for every surface at once, per DDR-015, so a badge keeps
  // its ink and nothing here repeats the rule per level.
  it('leaves a badge nothing to say on paper, since the tints are dropped by the tokens, per DDR-015', () => {
    expect(print).not.toMatch(/background-color/);
  });
});

describe('skills content', () => {
  it('names the three levels the Content Brief defines, strongest first', () => {
    expect(skills.levels).toEqual([
      { level: 'advanced', name: 'Advanced' },
      { level: 'proficient', name: 'Proficient' },
      { level: 'basic', name: 'Basic' },
    ]);
  });

  it('has the four groups the Content Brief defines, in its order', () => {
    expect(skills.groups.map(({ name }) => name)).toEqual(['Product and delivery', 'AI', 'Data and IoT', 'Tools']);
  });

  it('lists cloud services, Docker, Kubernetes, and Salesforce at the Basic level, as #26 decided', () => {
    expect(at('basic')).toEqual(expect.arrayContaining(['Docker', 'Kubernetes', 'Salesforce']));
    expect(at('basic').some((skill) => skill.startsWith('Cloud services'))).toBe(true);
  });

  it('lists each skill once, at one level', () => {
    const all = skills.levels.flatMap(({ level }) => at(level));

    expect(new Set(all).size).toBe(all.length);
  });

  it('gives no level an empty list, so what a group lists is what the page shows', () => {
    for (const group of skills.groups) {
      for (const listed of Object.values(group.skills)) {
        expect(listed.length).toBeGreaterThan(0);
      }
    }
  });

  it('lists no soft skills, which the entries show instead', () => {
    for (const skill of skills.levels.flatMap(({ level }) => at(level))) {
      expect(skill).not.toMatch(/leadership|communication|teamwork|servant|thinking|collaboration/i);
    }
  });
});
