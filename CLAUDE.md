# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains a personal career website.

The site communicates the owner's professional identity, experience, capabilities, selected work, and professional perspective.

The primary goals are:

* clarity
* authenticity
* credibility
* accessibility
* strong content
* simple navigation
* maintainable implementation

Avoid functionality or complexity that does not meaningfully support these goals.

### Current Repository State

The application is scaffolded, and its typographic, colour, spacing, responsive, and print systems
are in place. The career page, Epic #25, has its introduction, the frame the sections join, and
all five of its sections: experience, projects, skills, education and certifications, and
languages. What remains of the Epic is rechecking page breaks against the finished page (#23).
It is a Next.js App Router
project in TypeScript, configured for static export, per ADR-001 and ADR-002, and deployed to
GitHub Pages, per ADR-003.

The live site is at **https://aortegablasi96.github.io/career-site/**.

Commands:

```text
npm install         Install dependencies
npm run dev         Start the local development server at http://localhost:3000
npm run lint        Lint with ESLint; any error or warning fails
npm run typecheck   Generate Next.js route types, then type-check with tsc
npm run test        Run the test suite once with Vitest
npm run build       Build the static site into out/
```

All of them run from a clean checkout after `npm install`, and none needs a running server.

There is deliberately no `start` script: static export produces plain files, so `next start`
does not apply. Serve `out/` with any static file server if you need to check built output.

Tooling notes that are easy to trip over:

* **Linting** uses `eslint-config-next` (Core Web Vitals and TypeScript presets) through the
  ESLint CLI, because Next.js 16 removed `next lint`. ESLint is held at 9.x because
  `eslint-config-next` depends on `eslint-plugin-react`, which does not yet support ESLint 10.
* **Type checking** runs `next typegen` first because `next-env.d.ts` and the route types are
  generated, gitignored files, and a plain `tsc` fails without them on a clean checkout.
* **Tests** sit next to the code they cover as `*.test.ts` or `*.test.tsx`. They run in Node
  and render components with `react-dom/server`, matching how pages are produced at build time.
  There is no DOM environment or Testing Library; add them only when there is interactive
  behaviour to test. What to test is the Tester's decision.
* **Fonts** are committed to `app/fonts/`, with their licences, and loaded by
  `next/font/local` in `app/layout.tsx`, so builds need no network access for fonts.
  `next/font` is a compile-time transform whose loaders throw outside the Next.js compiler, so
  a test that imports the root layout mocks `next/font/local`, as `app/layout.test.tsx` does.

Deployment, per ADR-003:

* `.github/workflows/ci.yml` runs lint, typecheck, test, and build on every pull request and on
  every push to `main`. On `main` it then deploys `out/` to GitHub Pages. If any step fails,
  nothing is deployed and the live site stays as it was. Running the workflow manually from the
  Actions tab redeploys `main` without a new commit.
* GitHub Pages serves the site under `/career-site`. The workflow passes that path to the build
  as `PAGES_BASE_PATH`, and `next.config.ts` hands it to `basePath`. Locally the variable is
  unset, so everything is served from the root. To reproduce the production build, set
  `PAGES_BASE_PATH=/career-site` before building, then serve `out/` under `/career-site/`.
* There is no custom domain yet. One is intended, with the apex as canonical, and ADR-003 lists
  the steps to adopt it. The Pages source and domain are repository settings rather than code.

Structure, beyond what Next.js's own defaults already imply:

```text
app/        Routes and layouts, the global stylesheets, and the fonts
components/ Presentational components, each with its CSS Module and its test
content/    All user-facing prose, as typed TypeScript modules
```

`content/` is the part worth knowing about. ADR-001 forbids user-facing prose inside
components, and ADR-002 makes `content/` the single place it lives: `content/types.ts` defines
the shapes, one module per content type exports the records, and Server Components import them
directly. A copy change should never require editing a component. `app/page.tsx` imports the
content and passes it to the components as props.

`app/page.tsx` also holds the page's sections in one ordered list. Each entry renders as a
section and is listed in the contents, so a section story adds its section in that one place.

Styling follows ADR-001. `app/tokens.css` defines every design token once, as a custom property
at `:root`, and `app/globals.css` applies the tokens to plain HTML elements. Component styles are
to be CSS Modules that read the tokens rather than writing literal values. A value the tokens do
not provide is a design decision to make, not a number to invent. `app/tokens.test.ts` holds the
type scale to DDR-001's floors, every colour pairing to the contrast ratio DDR-002 records, the
spacing scale and rhythm to DDR-003, the breakpoint and what it adapts to DDR-004, and the print
treatment to DDR-005, so changing a token means revising its decision record too. The spacing and
print rules in `app/globals.css` are wrapped in `:where()`, so they have no specificity and a CSS
Module's class overrides them. `components/stylesheets.test.ts` holds every component stylesheet to
the same rules: tokens only, no width media query, and no reordering.

The styles are mobile-first, per DDR-004. The `:root` values in `app/tokens.css` are for the
narrowest viewports. The site's one breakpoint, a `min-width: 20em` media query at the end of that
file, redefines the few role tokens that adapt: the heading sizes (`--font-size-page-title`,
`--font-size-section-title`, `--font-size-item-title`) and the page's edges (`--page-gutter`,
`--page-padding-block`). Styles read those roles rather than the steps behind them, and no other
stylesheet writes a width media query, because a new breakpoint is a new decision. To check the
breakpoint in a browser, change the browser's default font size, not the root's CSS font size:
an em in a media query follows the former and ignores the latter.

Print follows DDR-005. ADR-002 makes the page itself the CV, so what a browser prints, or saves
as a PDF, is designed rather than left to defaults. A `@media print` block in `app/tokens.css`
sets `--root-font-size` to 10pt, so every rem, type and space alike, is measured from a size suited
to paper. It also makes the paper the surface and lets the column fill the sheet, and an `@page`
rule beside it sets 2cm margins. The `@media print` block in `app/globals.css` hides `nav`, prints
each link's address after it, keeps entries whole, and keeps headings with what follows, which
Firefox does not honour (#23). A component
hides its own screen-only elements in print, and may drop screen-only sizing such as the minimum
target size, per DDR-006, but adds no print-only content. What DDR-006 keeps whole on paper but
the base styles do not, because it is not an `article` or list item, such as a skill group or
the labelled list, is kept whole by its own component. Check print by saving
a PDF in two browsers, and recheck page breaks when the amount of content changes.

What exists, to reuse rather than reinvent:

* **The components.** The Design Foundation, Epic #2, is decided and implemented: typography
  (DDR-001), colour (DDR-002), spacing and layout (DDR-003), responsive behaviour (DDR-004), and
  print (DDR-005). DDR-006 decides the career page's structure: its outline, the introduction,
  the contents, the entry anatomy shared by roles, projects, and credentials, and the labelled
  list shared by skills and languages. The introduction, the contents, the section wrapper, the
  metadata line, the entry, the date range, the labelled list, and the experience, projects,
  skills, credentials, and languages sections implement it. A certification is an entry with no
  body, showing only the month it was granted.
* **The content types.** `content/types.ts` covers the site metadata, the introduction, the
  contents, dates, roles, projects, skills, credentials, and languages. A credential is a degree
  or a certification.

The GitHub repository is `aortegablasi96/career-site` (public), with `main` as the default
branch. Issue templates exist in `.github/ISSUE_TEMPLATE/` (Epic, User Story, Bug), and the
labels `epic`, `story`, `content`, `ui`, and `architecture` were added alongside GitHub's
defaults.

Update this section as styling and content land.

## Project Sources of Truth

Different concerns have different sources of truth:

| Concern                        | Source of truth                 |
| ------------------------------ | ------------------------------- |
| Project work and roadmap       | GitHub issues                   |
| Project history                | GitHub issues and pull requests |
| Durable UI/UX decisions        | DDRs                            |
| Durable architecture decisions | ADRs, when used                 |
| Product/content intent         | Approved workflow artifacts     |
| Implementation                 | Existing codebase               |
| Skill responsibilities         | `.claude/skills/**/SKILL.md`    |

Do not create duplicate documentation when an existing source already serves the purpose.

## Development Principles

* Prefer simplicity over complexity.
* Prefer existing patterns over new abstractions.
* Make the smallest change that solves the problem.
* Avoid speculative functionality.
* Avoid unnecessary dependencies.
* Preserve existing behaviour unless a change is intentional.
* Keep unrelated cleanup out of focused changes.
* Do not invent requirements, content, achievements, metrics, or other facts.
* Document significant decisions rather than relying on undocumented assumptions.

## Architecture

Follow the architecture established by the existing codebase and accepted Architecture Reviews.

Before introducing a new:

* layer
* abstraction
* dependency
* integration
* data store
* architectural pattern

first determine whether an existing pattern can solve the problem.

Significant architectural changes should be reviewed by the Architect and recorded as an ADR when appropriate.

Do not make architectural decisions inside implementation work when those decisions have not been approved.

## UI and Design

Follow the existing UI patterns and approved UI Reviews.

Prefer:

* reuse of existing components
* consistent layouts
* consistent typography and spacing
* accessible interactions
* responsive behaviour
* simple navigation

Do not introduce a new interaction pattern or significantly redesign an existing experience without involving the UI Designer.

Significant and reusable design decisions should be recorded as DDRs.

## Content

Content is a first-class part of the project.

When creating or changing content:

* follow the approved Content Strategy or Content Brief when available
* write for the intended audience
* prioritize clarity and credibility
* preserve the owner's authentic voice
* support claims with real evidence
* never invent professional experience, achievements, clients, metrics, or outcomes

The Content Strategist owns content intent and scope.

The Content Builder implements approved content.

## Accessibility

Accessibility is a requirement.

Preserve and consider:

* semantic HTML
* logical heading hierarchy
* keyboard navigation
* visible focus states
* accessible names and labels
* sufficient colour contrast
* meaningful alternative text
* responsive layouts
* reduced-motion preferences where relevant

Accessibility should be considered during design, implementation, and testing.

## Testing

Testing should be proportional to the change.

Validate relevant:

* functionality
* user workflows
* responsive behaviour
* accessibility
* error and empty states
* integrations
* regressions

Do not consider an implementation complete merely because it builds successfully.

The Tester provides the final validation for work that requires formal testing.

## GitHub

GitHub is the project's work-tracking and roadmap system.

Use GitHub issues and pull requests to understand:

* planned work
* current priorities
* completed work
* related changes
* historical context
* discussions and decisions captured during development

Before starting non-trivial work, check for relevant existing issues and recent related pull requests.

Do not create duplicate issues when existing work already covers the same objective.

Use the repository's issue templates and existing labels.

The Issue Writer owns the creation and structure of GitHub issues.

## Decision Records

Decision records preserve important decisions that should remain understandable after the original work is complete.

Use:

* DDRs for significant UI and UX decisions
* ADRs for significant architecture or technical decisions, when appropriate

Do not create a decision record for every implementation detail.

Do not silently override an accepted decision.

If new work conflicts with an accepted decision:

1. identify the conflict
2. explain the tradeoffs
3. determine whether the existing decision should remain
4. record a new decision if the previous decision needs to change

When a decision supersedes another decision, preserve that relationship explicitly.

### Where Decision Records Live

```text
docs/decisions/architecture-decisions/   ADRs, plus template.md
docs/decisions/design-decisions/         DDRs, plus template.md
```

Copy the sibling `template.md` when writing a new record; both templates require Status, Date,
Context, Decision, Alternatives Considered, Consequences, and Related Documents.

File naming is sequential and descriptive:

```text
ADR-001-short-title.md
DDR-001-short-title.md
```

ADR-001, ADR-002, and ADR-003 are accepted; the next ADR is `004`. DDR-001 to DDR-006 are
accepted; the next DDR is `007`. Status values are `Proposed`, `Accepted`, `Superseded`, or `Deprecated`.

## Workflow

The project uses skills to separate responsibilities.

Typical workflow:

```text
Content Strategist
        ↓
   UI Designer
        ↓
     Architect
        ↓
   Issue Writer
        ↓
     Builder
        ↓
      Tester
```

Governance skills are used when appropriate:

```text
UI decision
    ↓
Design Recorder

Refactoring proposal
    ↓
Refactoring Reviewer
    ↓
Architect, if required
```

Not every task requires every stage.

Examples:

* small content change → Content Builder
* small UI change → UI Builder
* bug fix → Issue Writer → Builder → Tester
* significant content work → Content Strategist → Content Builder → Tester
* significant UI work → UI Designer → UI Builder → Tester
* architectural change → Architect → appropriate Builder → Tester
* significant refactor → Refactoring Reviewer → Architect, if required → Builder → Tester

Use the smallest workflow that provides sufficient confidence and preserves important decisions.

Do not create process for its own sake.

## Claude Skills

Project skills live in `.claude/skills/`.

```text
.claude/skills/
├── workflow-skills/
├── execution-skills/
├── governance-skills/
└── project-management/
```

Current workflow skills:

* `content-strategist`
* `architect`
* `ui-designer`
* `tester`

Current execution skills:

* `content-builder`
* `ui-builder`

Current governance skills:

* `design-recorder`
* `refactoring-reviewer`

Current project-management skill:

* `issue-writer`

Each skill's `SKILL.md` defines its responsibilities, workflow, inputs, and outputs.

**Read the relevant `SKILL.md` before using a skill.**

Do not duplicate detailed skill instructions in this file.

## Documentation

There are currently no layer-specific README files.

Do not assume that a README exists for a layer or subsystem.

If a part of the project becomes sufficiently complex to require its own conventions or documentation, add documentation deliberately rather than creating README files by default.

Keep documentation focused on information that would otherwise be difficult to discover or preserve.

## Working With Uncertainty

When requirements, design, architecture, or content are unclear:

* identify what is known
* identify what is uncertain
* avoid inventing missing information
* use existing GitHub context and decision records
* involve the appropriate skill when a decision is required

Do not silently resolve significant product, content, design, or architecture questions during implementation.

## Final Principle

**Keep the project simple, intentional, credible, and understandable.**

Use GitHub to track the work.

Use decision records to preserve important decisions.

Use skills to separate responsibilities.

Use the existing codebase as the default implementation reference.

When something is unclear, identify the uncertainty rather than inventing a requirement or silently making a significant decision.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
