import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Contents } from '@/components/contents';
import { Footer } from '@/components/footer';
import { RoleView } from '@/components/role-view';
import { contents } from '@/content/contents';
import { dateLabels } from '@/content/dates';
import { experience } from '@/content/experience';
import { introduction } from '@/content/introduction';
import { sections } from '@/app/sections';

/**
 * A role's view of its own, per ADR-011 and DDR-059, at `/experience/<slug>`.
 *
 * It is built as a project's view is, per ADR-010: `generateStaticParams` names one file per role,
 * from the slugs in `content/`, and `dynamicParams` is off, so an address no role has is a 404
 * rather than something a static host could never serve.
 */
export const dynamicParams = false;

/** The page every link on a view leads back to. */
const page = '/';

export function generateStaticParams(): { slug: string }[] {
  return experience.roles.map(({ slug }) => ({ slug }));
}

/**
 * The role this address names, with the ones on either side of it in the timeline's order, oldest
 * first, per DDR-059. The oldest has nothing before it and the current role nothing after it, and
 * each view shows a link only where there is a role to lead to.
 */
function roleAt(slug: string) {
  const index = experience.roles.findIndex((role) => role.slug === slug);

  if (index < 0) notFound();

  return {
    role: experience.roles[index]!,
    previous: experience.roles[index - 1],
    next: experience.roles[index + 1],
  };
}

// The browser tab and a link preview name the role and the company, per #176, the role by its full
// title, per DDR-060, and describe it by its first point, which is what the owner did in it in their
// own words.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { title, fullTitle = title, company, points } = roleAt((await params).slug).role;
  const tab = experience.view.title(fullTitle, company);
  const description = points[0];

  return { title: tab, description, openGraph: { title: tab, description } };
}

export default async function RolePage({ params }: { params: Promise<{ slug: string }> }) {
  const { role, previous, next } = roleAt((await params).slug);

  return (
    <>
      {/* The site's own contents bar, as a project view has it, per DDR-050: every link leads back
          to the page, where the design's view draws the title alone. */}
      <Contents
        label={contents.label}
        home={contents.home}
        title={contents.title}
        sections={sections}
        page={page}
      />
      <main>
        <RoleView
          role={role}
          strings={experience.view}
          dateLabels={dateLabels}
          backHref={`${page}#${sections.find(({ title }) => title === experience.title)!.id}`}
          previous={previous}
          next={next}
        />
      </main>
      {/* The site's own footer, as the page has it, per DDR-028. */}
      <Footer name={introduction.name} contact={introduction.contact} />
    </>
  );
}
