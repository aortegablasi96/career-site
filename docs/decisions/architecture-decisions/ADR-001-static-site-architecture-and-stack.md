# ADR-001-Static Site Architecture and Technology Stack

Status: Accepted

Date: 2026-09-09

## Context

The repository contains no application code. Before any content, design, or feature work can
begin, the site needs a rendering strategy, a framework, a language, and a styling approach,
along with a stated boundary between UI, content, and application logic.

The relevant constraints are:

* The site is a personal career site: a small number of content-led pages presenting
  professional identity, experience, capabilities, and selected work.
* It is maintained by one person, indefinitely, alongside other work. Long gaps between
  changes are expected, so the cost of returning to the project after months away matters
  more than the cost of the initial build.
* `CLAUDE.md` sets the governing priorities: clarity, credibility, accessibility, simple
  navigation, and maintainable implementation, with explicit instructions to prefer
  simplicity, avoid unnecessary dependencies, and avoid complexity that does not
  meaningfully serve those goals.
* Accessibility is a stated requirement, not an enhancement.
* The maintainer's frontend background is React and Next.js.
* The site will not include a writing, blog, or notes section.
* Nothing on the site requires server-side behaviour. There is no form submission, no
  authentication, no personalisation, and no user-generated content.

There is one further constraint that is unusual for an architecture decision but legitimate
here, and recording it explicitly is better than leaving it implicit:

* **The repository is itself part of the artefact.** This is a career site shown to hiring
  managers, and the codebase behind it is likely to be looked at. The stack therefore carries
  a signalling and skill-transferability value that a purely internal project would not have.
  A technology the maintainer uses professionally is worth more here than the same technology
  would be worth on a private project.

## Decision

**Rendering strategy: static site generation.** Every page is built to HTML at build time and
served as a static file. There is no server runtime and no data fetching at request time.

**Framework: Next.js, App Router, configured for static export** (`output: 'export'`).

**Language: TypeScript.** Component props and content structures are typed, and type errors
fail the build.

**Styling: plain modern CSS. Design tokens are defined once as CSS custom properties at the
root; component styles are authored as CSS Modules.** No CSS framework and no CSS-in-JS.

**Performance constraints.** Next.js is not the lightest way to build this site, and the
choice above accepts a cost that must therefore be actively managed rather than assumed away.
These constraints are part of the decision, not advice:

1. **Server Components are the default. `'use client'` requires a reason.** The site is
   almost entirely non-interactive, so almost nothing should need it.
2. **Images must be optimised deliberately.** Under static export, `next/image` does not
   perform its usual on-demand optimisation. Images are to be sized, compressed, and served
   in a modern format as part of the authoring process, with explicit `width` and `height` to
   prevent layout shift. An unoptimised photograph will cost more than the entire JavaScript
   baseline several times over, so this is the constraint that most affects real performance.
3. **Fonts are self-hosted and preloaded, subset where practical.** No render-blocking
   third-party font requests.
4. **No client-side JavaScript library may be added for a purely presentational effect.**

**Boundaries.** Three rules define how UI, content, and logic relate. They are the most
durable part of this decision and later work is expected to respect them:

1. **No component contains user-facing prose.** Components receive content as typed props or
   read it from the content layer. A copy change must never require editing a component.
   This rule is what makes ADR-002 implementable, and it is the one most likely to be
   violated under time pressure.
2. **Components are presentational.** They render what they are given. They do not fetch,
   derive, or decide what content exists.
3. **There is no application logic layer, and none should be created.** Shared code is
   limited to pure helpers such as date formatting. If something appears to need a service,
   store, or state management layer, that is a signal to revisit this ADR rather than to add
   one quietly.

The content model itself, meaning where content files live and what shape they take, is
deliberately out of scope here and is decided in ADR-002. This ADR fixes only the boundary
that the content model must satisfy.

## Alternatives Considered

### Option A: Astro

Astro was the initial recommendation of the architecture review for issue #3, and was
rejected in favour of Next.js after the signalling constraint above was weighed.

Pros:

* Ships zero JavaScript by default. A Next.js static page carries roughly 80 to 100 KB of
  gzipped JavaScript, comprising React, React DOM, and the Next client runtime, even when the
  page is entirely static text. Astro carries none of it.
* Static generation is the default and primary mode rather than an export path configured on
  top of a server framework.
* Smaller dependency footprint and a stabler upgrade path.
* Built-in scoped component styles, removing the need for CSS Modules.
* The React knowledge would have largely transferred, since `.astro` components are close to
  JSX, and React remains available for islands.

Cons:

* A framework the maintainer does not use professionally, so the learning cost is real even
  if small, and the resulting experience transfers less to other work.
* Less recognisable in a repository that forms part of a professional portfolio.

Rejected on the signalling and transferability constraint, not on technical grounds. The
performance advantage is genuine but small in absolute terms for a site of this size: both
approaches prerender their HTML, so content paints at a comparable time, and the difference is
hydration cost that occurs after the content is already visible. Managed under the performance
constraints above, the practical gap for this site does not outweigh building it in the stack
the maintainer actually works in.

### Option B: Vite and React as a single-page application

Pros:

* Minimal build configuration and a fast development loop.
* Entirely familiar React model.

Cons:

* Client-side rendering is actively wrong for this site. Content arrives only after
  JavaScript executes, which harms search indexing, link previews, first paint, and
  resilience when scripts fail.
* Weaker accessibility baseline: client-side routing must reimplement focus management and
  route announcements that static navigation provides for free.
* The site's entire purpose is content discoverability and credibility, both of which this
  approach undermines.

Rejected outright. This is the wrong rendering model for a content site, and it gives up
prerendering without gaining anything the site needs.

### Option C: Hand-written HTML and CSS, no framework

Pros:

* Zero dependencies and zero build step. Nothing to maintain, upgrade, or outlive.
* Completely transparent and permanently understandable.
* The fastest possible result by any measure.

Cons:

* Shared markup such as navigation, header, and footer must be duplicated across every page
  and updated in every copy, which is precisely the maintenance burden that causes small
  sites to drift into inconsistency.
* No component boundary, so the separation of content from presentation would rest on
  discipline alone rather than on structure.
* No type checking and no build-time validation of content.

Rejected. Genuinely viable at three pages, but the duplication cost grows with every page
added, and the boundary rules above would have nothing structural to rest on.

### Styling alternatives

**Tailwind** was considered and rejected. It adds a build-time dependency and configuration to
a site that otherwise needs neither, and it places design decisions inside markup as utility
strings. That works against the Design Foundation epic, whose purpose is to record
typography, colour, and spacing as durable decisions expressed in tokens. CSS custom
properties express those decisions directly and in one place; Tailwind would express them once
in configuration and again, diffusely, across every template.

**CSS-in-JS** was considered and rejected. Runtime styling libraries conflict with a Server
Components-first approach, add a dependency, and solve a scoping problem that CSS Modules
already solve at build time with no runtime cost.

## Consequences

Positive:

* Pages are static files. Hosting is cheap or free, effectively immune to traffic spikes, and
  has no runtime to patch or monitor.
* The maintainer is productive immediately, in a stack used professionally, which lowers the
  chance the site is abandoned through friction. For a personal project maintained across
  years, this is a real durability argument and not merely a convenience.
* The repository demonstrates commonly valued skills to the audience that will read it.
* No hosting lock-in beyond needing a static host, which keeps ADR-003 a low-stakes decision.
* CSS custom properties give the Design Foundation epic a direct, dependency-free expression
  for design tokens.
* Type checking catches content and props mismatches at build time rather than in production.

Negative:

* Roughly 80 to 100 KB of gzipped JavaScript is shipped and executed for capability the site
  does not use. This is accepted knowingly. It is expected to be imperceptible on a normal
  connection and to add a few hundred milliseconds to interactivity on a low-end device over
  a poor connection, on pages that have nothing to interact with.
* Static export disables much of what justifies Next.js: no incremental regeneration, no
  server components at request time, no middleware, and no built-in image optimisation. The
  framework is being used for a fraction of its capability.
* A substantially larger dependency tree than the site's needs justify, which sits in tension
  with the project's instruction to avoid unnecessary dependencies. The tension is accepted
  for the reasons above and recorded here rather than hidden.
* Next.js has a history of significant migrations, most notably pages router to app router. A
  site touched a few times a year absorbs that churn poorly, and periodic upgrade work should
  be expected as a maintenance cost of this decision.
* The image optimisation gap under static export is a real trap. Constraint 2 above exists
  because the framework will not catch this automatically.
* The prohibition on prose inside components is a discipline that must be actively upheld.
  Nothing in the tooling enforces it.

Reversibility is worth stating plainly, since it is what makes this decision safe to take now:
content is stored separately from presentation by rule, and the output is plain static HTML.
If Next.js proves to be the wrong choice, the content survives the migration and only the
templates are rewritten. The expensive decision is ADR-002, not this one.

## Related Documents

* GitHub issue #3, which this decision resolves
* GitHub issue #1, Project Architecture & Foundation
* ADR-002, content model and authoring approach, not yet written. It must satisfy the
  boundary rules stated above.
* ADR-003, hosting and deployment, not yet written. This decision constrains it only to the
  extent that any static host is sufficient.
* GitHub issue #2, Design Foundation, which the styling decision above unblocks
