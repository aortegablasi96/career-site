# ADR-002-Content Model and Authoring Approach

Status: Accepted

Date: 2026-09-09

**Superseded in part by ADR-010**, on 2026-09-19: the content-shape finding "A single scrolling
page. Nothing has, or needs, a URL of its own. There are no detail pages." Revisit condition 3 below
fired on Epic #152, and each project now has a view at an address of its own. Everything else here
stands, including TypeScript modules over Markdown: what fired is an address per project, not
long-form writing. The passage is marked below.

The part of this record that rules out a separate CV file is `Superseded` by ADR-004, the
downloadable CV and binary assets, on 2026-09-16. Epic #42 adopts a "Get my CV" download, and ADR-004
decides what that file is and what keeps it in step with the page. The passages this affects are
marked below. Everything else in this record stands: content is still authored as typed TypeScript
modules in `content/`, the page is still the CV, and the print stylesheet is still what produces it.

## Context

ADR-001 fixed the site's rendering strategy, framework, language, and styling, and stated a
boundary rule that this decision has to satisfy: no component contains user-facing prose, and
a copy change must never require editing a component. ADR-001 deliberately left open *where
content lives and what shape it takes*. That is what this ADR decides.

ADR-001 also observed that this is the more expensive of the two decisions. Templates are
cheap to rewrite; content outlives them. A poor content model is felt on every future edit.

### Content shape

A content shape pass was run before this decision, precisely so that the content model would
be chosen against the site's real content rather than against a generic idea of a content
site. It established:

* **A single scrolling page.** Nothing has, or needs, a URL of its own. There are no detail
  pages.

  > **Superseded by ADR-010.** Each project has a view at `/projects/<slug>`, per Epic #152.
* **Four repeating content types:** work experience and roles, projects, skills and
  capabilities, and education and certifications.
* **Content is structured records, not long-form prose.** A role is a company, a title, a date
  range, and a short description. It is a struct, not an essay.
* **Low volume.** On the order of three to eight roles, a handful of projects, a few skill
  groupings, and a few credentials. Changes are expected a few times a year, not weekly.
* **No blog, writing, or notes section**, now or planned.
* **The site is the CV.** There is no separate CV document.

The last two points matter more than they might appear. The usual justification for a
file-based content pipeline is long-form writing and per-item routing. This site has neither.

### Other constraints

* The maintainer is a developer working directly in this repository. There is no
  non-technical editor, now or anticipated.
* `CLAUDE.md` treats content as first-class, and instructs to prefer simplicity and avoid
  unnecessary dependencies. ADR-001 already accepted a larger dependency tree than the site
  strictly requires; that budget should not be spent twice.

## Decision

**Content is authored as typed TypeScript modules in a top-level `content/` directory.**

* `content/types.ts` defines the shape of each content type once.
* One module per content type exports a typed, explicitly ordered array of records.
* Server Components import content directly. It is resolved at build time. There is no
  parsing step, no content API, no runtime fetching, and no generated intermediate artefact.
* **All user-facing prose lives in `content/`.** Components contain none, satisfying ADR-001's
  first boundary rule.
* **Ordering is explicit in the data**, not produced incidentally by sort logic at render
  time. The order things appear on a CV is a content decision, so it belongs with the content.
* Descriptions remain plain strings. If a piece of content ever genuinely requires rich
  formatting, embedded links, or emphasis, that is a trigger to revisit this ADR, not a reason
  to introduce a markup layer pre-emptively.

**The CV is the page itself.** No separate PDF is maintained or generated. A print stylesheet
renders the page cleanly for printing and for browser print-to-PDF, so a visitor still leaves
with a saveable document while only one copy of the facts exists anywhere.

> **Superseded by ADR-004.** The page is still the CV, and the print stylesheet still produces it.
> But a PDF of that print output is now committed and offered as a download, and a digest over the
> content modules fails the build when the page's facts change and the file does not.

### Triggers to revisit this decision

This ADR should be reopened, rather than quietly worked around, if any of the following
becomes true:

1. A non-technical editor needs to change site content.
2. Long-form writing is added, such as a blog, notes, or article section.
3. Content needs individually addressable URLs, such as case studies with their own pages.
4. Content volume grows to the point that a single module per type becomes unwieldy.

Each of these invalidates a specific premise above. None of them is a reason to change course
today.

## Alternatives Considered

### Option A: Markdown or MDX files with frontmatter

The default answer for content-driven sites, and the approach initially assumed before the
content shape pass.

Pros:

* Content is separated from code by construction, in plain, portable files.
* Comfortable for prose, and trivially editable by hand or by a future CMS layered on top.
* Survives a framework change with no conversion at all.
* Well-trodden, with abundant tooling in the Next.js ecosystem.

Cons:

* This site's content has essentially no prose body. A role expressed as Markdown is a file
  that is entirely frontmatter with an empty body, which is a struct wearing a costume.
* Requires a parsing and validation pipeline, and therefore dependencies, to turn text into
  the typed objects the components need.
* Frontmatter is untyped by default. Type safety has to be reconstructed with a schema layer,
  which is work to reach the position TypeScript starts from.
* The routing and collection machinery that justifies this approach has nothing to do here,
  because no content item needs a URL.

Rejected. Markdown earns its place when there is long-form writing or per-item routing. This
site has neither, and adopting it would mean paying its costs to receive none of its benefits.
This is the alternative most likely to look correct in hindsight if trigger 2 or 3 fires, and
it is the approach to migrate toward if that happens.

### Option B: JSON files with runtime schema validation

Pros:

* Unambiguously data rather than code, and trivially machine-readable.
* Portable to any consumer, including a future CMS or a different framework.
* A validation library such as Zod would give both parse-time checking and inferred types.

Cons:

* Loses type safety at the point of authoring. A mistake surfaces when validation runs, not
  as you type it.
* Requires a validation dependency and a validation step to recover guarantees TypeScript
  provides natively and for free.
* No comments, so the reasoning behind a content choice has nowhere to live.
* Verbose and easy to break, particularly for multi-sentence description strings.

Rejected. JSON is the right answer when content is edited by non-developers or arrives from
another system. Neither applies here, so its costs buy nothing.

### Option C: A headless CMS

Such as Contentful, Sanity, or a Git-backed editor like TinaCMS or Decap.

Pros:

* Content is editable without touching the repository, including from a phone.
* Structured editing with validation and a preview.
* The obvious answer if a non-technical editor ever needs access.

Cons:

* Introduces an external service, an account, a network dependency, and a deployment webhook,
  in order to manage roughly twenty records that change a few times a year.
* Content leaves the repository, so it is no longer versioned alongside the code that renders
  it, and is no longer available offline.
* A vendor to outlive. Free tiers change, products are discontinued, and migrating content out
  is real work.
* Directly contradicts `CLAUDE.md`'s instructions to prefer simplicity and avoid unnecessary
  dependencies and integrations.

Rejected as substantially disproportionate to the problem. This is the correct answer only if
trigger 1 fires.

### Option D: Content written directly into components

Pros:

* The least possible ceremony. Nothing to wire up.
* No indirection between what is written and what renders.

Cons:

* Violates ADR-001's first boundary rule outright.
* Makes every copy change a component edit, entangling content and presentation permanently.
* Makes it impossible to see all content in one place, or to move it later without unpicking
  it from markup.

Rejected. ADR-001 excluded this by rule, and it is recorded here only to note that the rule
exists precisely because this is the path of least resistance under time pressure.

### CV alternatives

**A separately maintained PDF** was the maintainer's initial preference and was rejected after
discussion. Two hand-maintained representations of the same facts drift apart, and a visitor
who reads both sees the site and the CV disagree. The drift is silent and the cost lands on
credibility, which is one of the project's stated goals.

**Generating a PDF at build time** from the same content was considered and deferred. It
cannot drift, and it offers a genuine download button. It was not chosen because it requires a
PDF generation dependency and layout work to produce output worth downloading, in order to
improve on what browser print already does. If a download button is later judged important,
this is the option to take, and the content model chosen above supports it without change.

> **Resolved by ADR-004.** A download button was judged important on Epic #42, so both CV
> alternatives above were reconsidered, and ADR-004 took neither as written. The layout work this
> paragraph names had since been done by DDR-005, DDR-008 and DDR-009, which made the printed page a
> designed and verified artefact, so the committed file is a saved copy of that print output rather
> than a generated one. The drift the paragraph above it names is answered by a digest over the
> content modules that fails the test suite, instead of by generating the file. Build-time
> generation is recorded in ADR-004 as the option to take if that proves insufficient.

## Consequences

Positive:

* No new dependencies at all. The content layer is the language.
* Type errors are caught at build time. A missing or misspelled field fails the build instead
  of silently rendering an empty element in production.
* No parsing, no serialisation, no intermediate build artefact, and nothing to debug between
  writing content and seeing it render.
* Editor support comes free: autocomplete, go-to-definition, and safe renaming across content
  and components.
* Content is versioned in Git alongside the code that renders it, so history and reasoning
  stay together.
* All site copy is discoverable in one directory, which makes reviewing the site's actual
  words possible without reading templates.
* One representation of the maintainer's professional facts exists anywhere in the project,
  so nothing can contradict anything else.

Negative:

* **Content is technically code.** A typo fix is a commit, a build, and a deploy. For a
  developer editing their own site this is unremarkable, and it is already true of everything
  else in the project, but it does mean no editing from a phone and no editing by anyone who
  is not comfortable in the repository. This is the decision's principal cost and it is
  accepted knowingly.
* Content is less portable than Markdown or JSON. A future migration away from TypeScript
  would require converting it, though the conversion is mechanical and the content itself is
  small.
* Plain strings mean no emphasis, links, or formatting inside descriptions. This is a
  deliberate constraint rather than an oversight; it keeps content and presentation cleanly
  separated, but it will feel restrictive the first time a link inside a role description
  seems desirable.
* Without a separate CV file, print output quality becomes a real requirement rather than an
  afterthought, and the print stylesheet needs testing as part of the work rather than being
  assumed to work. This consequence outlived the decision that produced it: ADR-004 adds a CV file,
  and it is a saved copy of that print output, so the requirement is now stronger rather than
  weaker.

The decision is deliberately easy to leave. Because content is already separated, typed, and
structured, migrating to Markdown, JSON, or a CMS is a mechanical transformation of a small
amount of data, not a rewrite. The triggers listed above name the circumstances in which that
becomes worth doing.

## Related Documents

* GitHub issue #4, which this decision resolves
* GitHub issue #1, Project Architecture & Foundation
* ADR-001, which established the boundary rules this decision satisfies and deferred the
  content model to this ADR
* ADR-003, hosting and deployment, not yet written. This decision does not constrain it.
* GitHub issue #5, which implements this decision as part of scaffolding the application
* GitHub issue #2, Design Foundation, whose scope now includes print styles as a consequence
  of the CV decision above
* ADR-004, the downloadable CV and binary assets, which supersedes the part of this record that
  rules out a separate CV file
