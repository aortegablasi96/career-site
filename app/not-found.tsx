import type { Metadata } from 'next';
import { Contents } from '@/components/contents';
import { Footer } from '@/components/footer';
import { NotFoundView } from '@/components/not-found-view';
import { contents } from '@/content/contents';
import { introduction } from '@/content/introduction';
import { notFound } from '@/content/not-found';
import { sections } from '@/app/sections';

/**
 * What an address the site does not have shows, per #283 and DDR-093, in place of Next.js's own
 * page. Static export writes it to `404.html`, which the host serves with a 404 status for any
 * address it has no file for, and Next.js marks it `noindex`.
 *
 * It is a view's frame around the top of a view: the site's own contents bar, whose every link
 * leads back to the page, as DDR-050 has it on a view; the way back, a title and a line; and the
 * site's own footer, per DDR-028.
 */

/** The page every link here leads back to. */
const page = '/';

// The browser tab names the page as a view's tab names its project or role, followed by the
// owner's name. It has no canonical link and no description: it is never indexed.
export const metadata: Metadata = {
  title: `${notFound.title} – ${introduction.name}`,
};

export default function NotFoundPage() {
  return (
    <>
      <Contents
        label={contents.label}
        home={contents.home}
        title={contents.title}
        menu={contents.menu}
        sections={sections}
        page={page}
      />
      <main>
        <NotFoundView strings={notFound} backHref={page} />
      </main>
      <Footer name={introduction.name} contact={introduction.contact} />
    </>
  );
}
