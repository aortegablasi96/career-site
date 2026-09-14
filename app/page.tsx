import type { ReactNode } from 'react';
import { Contents } from '@/components/contents';
import { Credentials } from '@/components/credentials';
import { Experience } from '@/components/experience';
import { Introduction } from '@/components/introduction';
import { Languages } from '@/components/languages';
import { Projects } from '@/components/projects';
import { Section } from '@/components/section';
import { Skills } from '@/components/skills';
import { contents } from '@/content/contents';
import { credentials } from '@/content/credentials';
import { dateLabels } from '@/content/dates';
import { experience } from '@/content/experience';
import { introduction } from '@/content/introduction';
import { languages } from '@/content/languages';
import { projects } from '@/content/projects';
import { skills } from '@/content/skills';

/** A major section of the page: where the contents link to, its title, and what it holds. */
interface PageSection {
  id: string;
  title: string;
  body: ReactNode;
}

/**
 * The page's sections, in the order the Content Brief on #25 sets. Each one renders as a section
 * and is listed in the contents, from this one list, so the two cannot disagree. The section
 * stories of Epic #25 add them.
 */
const sections: readonly PageSection[] = [
  {
    id: 'experience',
    title: experience.title,
    body: <Experience roles={experience.roles} dateLabels={dateLabels} />,
  },
  {
    id: 'projects',
    title: projects.title,
    body: <Projects projects={projects.projects} />,
  },
  {
    id: 'skills',
    title: skills.title,
    body: <Skills levels={skills.levels} groups={skills.groups} />,
  },
  {
    id: 'education',
    title: credentials.title,
    body: <Credentials credentials={credentials.credentials} dateLabels={dateLabels} />,
  },
  {
    id: 'languages',
    title: languages.title,
    body: <Languages languages={languages.languages} />,
  },
];

export default function HomePage() {
  return (
    <main>
      <Introduction introduction={introduction} />
      <Contents label={contents.label} sections={sections} />
      {sections.map(({ id, title, body }) => (
        <Section key={id} id={id} title={title}>
          {body}
        </Section>
      ))}
    </main>
  );
}
