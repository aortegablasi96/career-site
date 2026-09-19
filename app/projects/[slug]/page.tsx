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

function projectAt(slug: string) {
  return projects.projects.find((project) => project.slug === slug) ?? notFound();
}

// The browser tab and a link preview name the project, per #153, and describe it in its own words.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { name, description } = projectAt((await params).slug);
  const title = projects.view.title(name);

  return { title, description, openGraph: { title, description } };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = projectAt((await params).slug);

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
        />
      </main>
      {/* The site's own footer, as the page has it, per DDR-028. */}
      <Footer name={introduction.name} contact={introduction.contact} />
    </>
  );
}
