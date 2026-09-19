# ADR-010-Project Views

Status: Accepted

Date: 2026-09-19

**Supersedes in part ADR-002**: its content-shape finding "A single scrolling page. Nothing has, or
needs, a URL of its own. There are no detail pages." ADR-002 named this as its revisit condition 3,
"Content needs individually addressable URLs", and Epic #152 meets it: each project now has a view
at an address of its own. Everything else ADR-002 decides stands. Content is still typed TypeScript
modules in `content/`, imported by Server Components; there is still no Markdown, no parsing step
and no content API; and the page is still the CV. ADR-002 recorded Markdown as "the approach to
migrate toward" if condition 3 fired. It is not taken here, because what fired is an address per
project, not long-form writing: a view shows the same structured record the page shows.

**Amends ADR-004's asset rule in one respect**: an `href` given to `next/link` is a route of this
site rather than a file, and does not go through `asset()`. Every `src`, `poster` and `href` on a
plain element still does.

ADR-001 (static export, Server Components) and ADR-003 (GitHub Pages under `/career-site`) are
unchanged, and so is ADR-007 as ADR-008 and ADR-009 amend it: `ContentsBar` is still the site's one
Client Component.

## Context

Issue #153, the first story of Epic #152, gives each of the four projects a view of its own, laid
out as the Figma layer `career-site-project` draws it. The story asks that each view:

* has an address of its own, which opens directly on the live site under `/career-site` and locally,
  and shows the same view when reloaded;
* names the project in the browser tab and a link preview;
* states every string in the site's content;
* returns the reader to the projects section of the page.

The site is a static export served by GitHub Pages, per ADR-001 and ADR-003. There is no server to
answer an address the build did not write, so a view exists only if the build writes it.

## Decision

**Each project's view is a statically generated route, `app/projects/[slug]/page.tsx`, one file
per project, named by a slug stated in the project's content.**

* **The route is a dynamic segment with `generateStaticParams`**, which returns one `slug` per
  project in `content/projects.ts`, and `dynamicParams = false`. The export writes
  `out/projects/<slug>.html` for each, and nothing for any other slug: an unknown address is the
  site's 404 rather than something a static host cannot serve. `trailingSlash` stays off, so the
  home page's address does not change; GitHub Pages serves `/career-site/projects/<slug>` from
  `<slug>.html`, as it serves any page without its extension.
* **The slug is content**, a `slug` field on `Project`, rather than something derived from the name.
  An address the owner has sent someone must not change when a name is reworded, and "This site"
  would make a poor address. Slugs are lowercase words joined by hyphens, and unique; a test holds
  both.
* **Metadata comes from the project's record.** `generateMetadata` sets the title, and the link
  preview's, from `projects.view.title(name)`, which is in `content/` with the view's other strings,
  and the description from the project's own description.
* **Links between routes go through `next/link`**, which prefixes `basePath` itself. That is the way
  back to the projects section and, on a view, the contents bar's links back to the page. They are
  written `prefetch={false}`: prefetching the page from a view would fetch its photo and every
  project's picture whether or not the reader goes back. `components/assets.test.ts` now tells a
  `Link` from a plain element and holds only the latter to `asset()`, and it reads `app/` all the way
  down, so the new route is checked too.
* **The page's section list moved to `app/sections.tsx`.** A view's contents bar lists the same
  sections, and a Next.js page module may export only what Next.js reads from it. The page and every
  view import the one list, so the bar cannot differ between them. The view hands the bar each
  section's id and word, as the page does, and never renders a section's items.
* **`ContentsBar` takes an optional `page`**, the route of the page its sections are on. Given one,
  it renders every link through `next/link` to that page, Home to its top and each section to its
  fragment, and marks none of them. Without one, it is exactly what ADR-009 describes. It is still
  the one Client Component, and nothing else crosses the boundary.
* **The view is a Server Component**, `components/project-view.tsx`, handed the project's record and
  the view's strings as props, per ADR-002. It shares the projects' `Media`, so a project with a
  video shows it the same way on the page and on its view.

## Alternatives Considered

### Option A: A fragment per project on the one page

Such as `/#numisbook`, opening a panel or scrolling to the row.

Pros:
* Nothing new: no route, no second page, ADR-002 untouched.

Cons:
* It is not a view. The design draws a page of its own with room for the full description, every
  technology and, from #155, a gallery, none of which fits the row.
* A fragment is not a page a link preview can describe, and the browser tab would still name the
  owner rather than the project.

Rejected. It does not meet the story.

### Option B: A query parameter, `/projects?name=numisbook`

Pros:
* One route file.

Cons:
* A static export writes one file per route, not per query, so the view would be rendered in the
  browser from script, with no HTML for a crawler or a link preview and nothing without script.
* The address is worse to send to someone.

Rejected.

### Option C: Markdown or MDX, one file per project

ADR-002's named migration path if condition 3 fired.

Pros:
* Per-item routing is what that machinery is for.

Cons:
* The records have no prose body. Each is a name, a slug, a picture, a caption, technologies, a
  description and links: exactly the struct ADR-002 chose TypeScript for.
* It would add a parsing dependency and move the projects out of the one module the page and the
  CV digest already read.

Rejected. What fired is the need for an address, not for long-form writing.

### Option D: Plain `<a>` elements through `asset()` for internal links

Pros:
* No client navigation, so no behaviour to learn.

Cons:
* `asset()` is for binary files, per ADR-004. Using it for routes would blur the one rule the asset
  test enforces.
* `next/link` is the framework's own way to link routes and already knows the base path.

Rejected.

## Consequences

Positive:
* Each project has an address the owner can send, which opens straight on its view and names it in
  the tab and in a preview.
* Every view is plain HTML at build time, like the page, per ADR-001.
* The views and the page read the same records, so a project cannot say one thing on the page and
  another on its view.

Negative:
* The site has two kinds of page now, so a change to the page's frame — the bar, the footer, the
  column — has to be checked on a view as well.
* A slug, once shared, is a commitment: renaming one breaks every link to the old address, and a
  static host has no redirects to soften that.
* Moving from a view to the page is a client navigation. It scrolls to the section under the bar,
  as measured on #153, but a change to how the bar clears a heading has two paths to check.
* The CV digest covers `content/projects.ts`, so each view string and caption moves it, although
  none is a fact ADR-005 lists as shared.

## Related Documents

* GitHub issue #153 and Epic #152
* ADR-001, static export and Server Components
* ADR-002, which this supersedes in part, and its revisit condition 3
* ADR-003, GitHub Pages and the `/career-site` base path
* ADR-004, binary assets and `asset()`, which this amends for `next/link`
* ADR-007, ADR-008 and ADR-009, the contents bar's Client Component
* DDR-050, the design of the view
