import type { ReactNode } from 'react';
import { Contents } from '@/components/contents';
import { Experience } from '@/components/experience';
import { Introduction } from '@/components/introduction';
import { Projects } from '@/components/projects';
import { Section } from '@/components/section';
import { contents } from '@/content/contents';
import { dateLabels } from '@/content/dates';
import { experience } from '@/content/experience';
import { introduction } from '@/content/introduction';
import { projects } from '@/content/projects';

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
