import type { ReactNode } from 'react';
import { Contents } from '@/components/contents';
import { Credentials } from '@/components/credentials';
import { Experience } from '@/components/experience';
import { Introduction } from '@/components/introduction';
import { Languages } from '@/components/languages';
import { Projects } from '@/components/projects';
import { Section } from '@/components/section';
import { Skills, skillRows } from '@/components/skills';
import { contents } from '@/content/contents';
import { cv } from '@/content/cv';
import { credentials } from '@/content/credentials';
import { dateLabels } from '@/content/dates';
import { experience } from '@/content/experience';
import { introduction } from '@/content/introduction';
import { languages } from '@/content/languages';
import { projects } from '@/content/projects';
import { skills } from '@/content/skills';

/** A major section of the page: where the contents link to, its title, and its items. */
interface PageSection {
  id: string;
  title: string;
  items: readonly ReactNode[];
}

/**
 * The page's sections, in the order the Content Brief on #25 sets. Each one renders as a section
 * and is listed in the contents, from this one list, so the two cannot disagree. The section
 * stories of Epic #25 add them.
 *
 * Each item, such as a role, is its own element, which its section's component renders as a list
 * of one. The section can then keep its heading with its first item on paper, per DDR-008.
 */
const sections: readonly PageSection[] = [
  {
    id: 'experience',
    title: experience.title,
    items: experience.roles.map((role) => (
      <Experience key={`${role.company} ${role.start}`} roles={[role]} dateLabels={dateLabels} />
    )),
  },
  {
    id: 'projects',
    title: projects.title,
    items: projects.projects.map((project) => <Projects key={project.name} projects={[project]} />),
  },
  {
    id: 'skills',
    title: skills.title,
    // The section's item is a row of two groups rather than one group, because the two columns
    // DDR-010 gives the section have to be one grid and a grid needs one parent. One group to an
    // item would put the first inside the block the section keeps whole with its heading, per
    // DDR-008, and the rest outside it, which no grid can span.
    items: skillRows(skills.groups).map((groups) => (
      <Skills key={groups[0]!.name} levels={skills.levels} groups={groups} />
    )),
  },
  {
    id: 'education',
    title: credentials.title,
    items: credentials.credentials.map((credential) => (
      <Credentials key={credential.name} credentials={[credential]} dateLabels={dateLabels} />
    )),
  },
  {
    id: 'languages',
    title: languages.title,
    items: [<Languages key="languages" languages={languages.languages} />],
  },
];

export default function HomePage() {
  return (
    <main>
      <Introduction introduction={introduction} cv={cv} />
      <Contents label={contents.label} sections={sections} />
      {sections.map(({ id, title, items }) => (
        <Section key={id} id={id} title={title} items={items} />
      ))}
    </main>
  );
}
