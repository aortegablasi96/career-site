# ADR-011-Role Views

Status: Accepted

Date: 2026-09-26

**Extends ADR-010 to the roles.** ADR-010 gave each project a statically generated route of its
own. This record gives each role in the experience section one too, built the same way, and
supersedes nothing: every rule ADR-010 sets — the static route, the slug as content, `next/link`
with `prefetch={false}`, the site's own contents bar through `page`, and `asset()` for files alone —
applies to a role's view unchanged.

## Context

Issue #176, on Epic #170, gives each of the five roles a view of its own, laid out as the Figma layer
`career-site-experience` (177:1196) draws it, which a click on the role's card in the experience
timeline opens. Since #173 and DDR-057 a role's points are not on the page at all, so the view is the
only place on screen they are shown.

The story asks the same of a role's view that #153 asked of a project's: an address of its own that
opens directly on the live site and locally, and shows the same view when reloaded; a browser tab
and a link preview that name the role and the company; every string stated in the site's content;
and a way back to the experience section.

## Decision

**Each role's view is a statically generated route, `app/experience/[slug]/page.tsx`, one file per
role, named by a slug stated in the role's content.**

* **The route is ADR-010's shape.** `generateStaticParams` returns one `slug` per role in
  `content/experience.ts`, and `dynamicParams = false`, so the export writes
  `out/experience/<slug>.html` for each and nothing for any other slug.
* **The segment is `experience`**, the section the roles are on and the word its contents link and
  its fragment already use, as `projects` is the projects'. An address reads as where the role sits
  on the site: `/career-site/experience/abb`.
* **The slug is content**, a `slug` field on `Role`, for ADR-010's reason: an address the owner has
  sent must not change when a company or a title is reworded. The five are the companies, as
  lowercase words joined by hyphens: `electronica-digital-de-proteccion`, `tobeit`, `randstad`,
  `ponera-group` and `abb`. A company the owner worked for twice would need a second word; none
  does. A test holds them unique and in that form.
* **Metadata comes from the role's record.** The title, and the link preview's, is
  `experience.view.title(role, company)`, in `content/` with the view's other strings. The
  description is the role's first point, which is what the owner did there in their own words,
  since a role has no description of its own.
* **The view is a Server Component**, `components/role-view.tsx`, handed the role's record, the
  view's strings and the date labels as props, per ADR-002. The route finds the roles on either side
  in the content's order, oldest first, as a project's route does.
* **A role's card on the page is the link to the view**, rendered by the timeline the two sections
  share, per DDR-010. `TimelineEntry` gains an optional `href`; experience passes one and education
  does not. `roleHref`, beside the experience component, is the one place a role's route is written,
  as `projectHref` is a project's.
* **The CV digest moves**, as ADR-010 foresaw for the projects: the slugs, the hint and the view's
  strings are in `content/experience.ts`, though none is a fact ADR-005 lists as shared.

## Alternatives Considered

### Option A: A fragment per role on the one page

Such as `/#abb`, opening the role's points in place.

Pros:
* No route and no second kind of view.

Cons:
* The design draws a page of its own, with a header, numbered points, skills and the roles on either
  side, none of which fits a card in a scrolling row.
* A fragment has no title of its own for the tab or a preview.

Rejected, for ADR-010's reason.

### Option B: One generic route for both kinds of view

Such as `/view/<kind>/<slug>`, with one page module for projects and roles.

Pros:
* One route file.

Cons:
* The two views draw different records with different components; one module would branch on the
  kind at every step.
* It would move every project's address, which ADR-010 made a commitment.

Rejected.

### Option C: Derive the slug from the company

Pros:
* No field to maintain.

Cons:
* A reworded company would move an address someone has been sent, and "Electrónica Digital de
  Protección" needs its accents decided somewhere either way.

Rejected, for ADR-010's reason.

## Consequences

Positive:
* Each role has an address the owner can send, which names it in the tab and in a preview.
* A role's points are on screen again, where a reader asks for them.
* The view and the page read the same record, so a role cannot say one thing in each.

Negative:
* The site has three kinds of page now, so a change to the frame — the bar, the footer, the column —
  has to be checked on a role's view as well as a project's.
* Five more slugs are commitments, for ADR-010's reason.

## Related Documents

* GitHub issue #176 and Epic #170
* ADR-010, which this extends to the roles
* ADR-001, ADR-002, ADR-003 and ADR-004, as ADR-010 cites them
* ADR-005, the facts the CV file shares
* DDR-059, the design of the view
* DDR-057, the timeline whose cards now lead to it
