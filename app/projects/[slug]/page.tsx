import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Contents } from '@/components/contents';
import { Footer } from '@/components/footer';
import { ProjectView } from '@/components/project-view';
import { contents } from '@/content/contents';
import { introduction } from '@/content/introduction';
import { projects } from '@/content/projects';
import { sections } from '@/app/sections';

/**
 * A project's view of its own, per ADR-010 and DDR-050, at `/projects/<slug>`.
 *
 * Every view is built to a file at build time, per ADR-001: `generateStaticParams` names one per
 * project, from the slugs in `content/`, and `dynamicParams` is off, so an address no project has
 * is a 404 rather than something a static host could never serve.
 */
export const dynamicParams = false;

/** The page every link on a view leads back to. */
const page = '/';

export function generateStaticParams(): { slug: string }[] {
  return projects.projects.map(({ slug }) => ({ slug }));
}

/**
 * The project this address names, with the ones the page shows on either side of it, per DDR-052.
 * The first has nothing before it and the last nothing after it, and each view shows a link only
 * where there is a project to lead to.
 */
function projectAt(slug: string) {
  const index = projects.projects.findIndex((project) => project.slug === slug);

  if (index < 0) notFound();

  return {
    project: projects.projects[index]!,
    previous: projects.projects[index - 1],
    next: projects.projects[index + 1],
  };
}

// The browser tab and a link preview name the project, per #153, and describe it in its own words.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { name, description } = projectAt((await params).slug).project;
  const title = projects.view.title(name);

  return { title, description, openGraph: { title, description } };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { project, previous, next } = projectAt((await params).slug);

  return (
    <>
      {/* The site's own contents bar, per DDR-050: the title, Home and every section's link, each
          leading back to the page, where the design's view draws the title alone. */}
      <Contents
        label={contents.label}
        home={contents.home}
        title={contents.title}
        sections={sections}
        page={page}
      />
      <main>
        <ProjectView
          project={project}
          strings={projects.view}
          backHref={`${page}#${sections.find(({ title }) => title === projects.title)!.id}`}
          previous={previous}
          next={next}
        />
      </main>
      {/* The site's own footer, as the page has it, per DDR-028. */}
      <Footer name={introduction.name} contact={introduction.contact} />
    </>
  );
}
