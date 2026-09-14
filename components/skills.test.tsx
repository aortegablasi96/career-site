import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { skills } from '@/content/skills';
import type { SkillLevel } from '@/content/types';
import { Skills } from './skills';

// Rendered with the real content, since which skills are listed, and at which level, is what #31
// asks for.
const html = renderToStaticMarkup(<Skills levels={skills.levels} groups={skills.groups} />);

/** Each group, in the order the page shows them. */
const groups = html.match(/<section[^>]*>.*?<\/section>/g) ?? [];

/** A group's rows, as its level and its skills, as the reader meets them. */
const rowsOf = (group: string) =>
  [...group.matchAll(/<dt[^>]*>([^<]+):<\/dt> <dd[^>]*>([^<]+)<\/dd>/g)].map(([, level, value]) => [level, value]);

/** The stylesheet without its comments, so a rule is not matched against its explanation. */
const css = readFileSync(new URL('./skills.module.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const print = css.match(/@media print\s*\{([\s\S]*)\}\s*$/)?.[1] ?? '';

/** Every skill at a level, across the groups. */
const at = (level: SkillLevel) => skills.groups.flatMap((group) => group.skills[level] ?? []);

describe('Skills', () => {
  it('renders each group with its name as a heading, in the order the content gives', () => {
    const names = groups.map((group) => group.match(/^<section[^>]*><h3>([^<]+)<\/h3>/)?.[1]);

    expect(names).toEqual(skills.groups.map(({ name }) => name));
  });

  it('follows each group’s name with its levels, strongest first, and its skills at each, per DDR-006', () => {
    for (const [index, group] of groups.entries()) {
      const { skills: listed } = skills.groups[index]!;
      const expected = skills.levels
        .filter(({ level }) => listed[level]?.length)
        .map(({ level, name }) => [name, listed[level]!.join(', ')]);

      expect(rowsOf(group)).toEqual(expected);
    }
  });

  it('leaves out a level with no skills in the group', () => {
    const fixture = renderToStaticMarkup(
      <Skills levels={skills.levels} groups={[{ name: 'Tools', skills: { advanced: [], basic: ['Salesforce'] } }]} />,
    );

    expect(rowsOf(fixture)).toEqual([['Basic', 'Salesforce']]);
  });

  it('shows levels as words, with no score, bar, or graphic, per DDR-006', () => {
    expect(html).not.toMatch(/<(?:meter|progress|svg|img)\b|%/);
  });

  it('sets groups apart by the item step, as entries are, per DDR-003', () => {
    expect(css).toMatch(/\.group \+ \.group\s*\{[^}]*margin-block-start:\s*var\(--space-item\);/);
  });
});

describe('Skills in print', () => {
  it('keeps each group whole on one page, as an entry is, per DDR-006', () => {
    expect(print).toMatch(/\.group\s*\{[^}]*break-inside:\s*avoid;/);
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
