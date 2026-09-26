import type { ReactNode } from 'react';
import { Credentials } from '@/components/credentials';
import { Experience } from '@/components/experience';
import { Languages } from '@/components/languages';
import { Projects, projectRows } from '@/components/projects';
import { headingId } from '@/components/section';
import { Skills, skillRows } from '@/components/skills';
import { credentials } from '@/content/credentials';
import { dateLabels } from '@/content/dates';
import { experience } from '@/content/experience';
import { languages } from '@/content/languages';
import { projects } from '@/content/projects';
import { skills } from '@/content/skills';

/**
 * A major section of the page: where the contents link to, its title, the word its link in the
 * contents shows, and its items.
 */
export interface PageSection {
  id: string;
  title: string;
  link: string;
  items: readonly ReactNode[];
  /** Whether paper may break inside the heading's block, which a timeline needs, per DDR-057. */
  breakable?: boolean;
}

/**
 * The page's sections, in the order the Content Brief on #25 sets. Each one renders as a section
 * and is listed in the contents, from this one list, so the two cannot disagree. The section
 * stories of Epic #25 add them.
 *
 * It is its own module rather than part of the page, since #153, because each project's view lists
 * the same sections in its contents bar, per DDR-050, and a page module may export nothing but what
 * Next.js reads from it. The view takes each section's id and word and never renders its items.
 *
 * Each item, such as a project row, is its own element, so the section can keep its heading with
 * its first item on paper, per DDR-008. A timeline is one item, since DDR-057: on screen its entries
 * are one row that scrolls, and a row needs one parent.
 */
export const sections: readonly PageSection[] = [
  {
    id: 'experience',
    title: experience.title,
    link: experience.link,
    breakable: true,
    items: [
      <Experience
        key="experience"
        roles={experience.roles}
        dateLabels={dateLabels}
        labelledBy={headingId('experience')}
      />,
    ],
  },
  {
    id: 'projects',
    title: projects.title,
    link: projects.link,
    // A row of two cards rather than one, for the reason the skills below give, per DDR-051.
    items: projectRows(projects.projects).map((row) => (
      <Projects key={row[0]!.slug} projects={row} />
    )),
  },
  {
    id: 'skills',
    title: skills.title,
    link: skills.link,
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
    link: credentials.link,
    breakable: true,
    items: [
      <Credentials
        key="education"
        credentials={credentials.credentials}
        dateLabels={dateLabels}
        labelledBy={headingId('education')}
      />,
    ],
  },
  {
    id: 'languages',
    title: languages.title,
    link: languages.link,
    items: [<Languages key="languages" languages={languages.languages} />],
  },
];
