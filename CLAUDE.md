# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal career website that communicates the owner's professional identity, experience,
capabilities, selected work and perspective. Its goals are clarity, authenticity, credibility,
accessibility, strong content, simple navigation and a maintainable implementation. Avoid
functionality or complexity that does not meaningfully support them.

The live site is **https://andreuortegablasi.com/**. The repository is
`aortegablasi96/career-site` (public), default branch `main`.

**What exists**: one career page (introduction, experience, portfolio, skills, education and
certifications, languages, footer) that is also the printable CV; a view per project at
`/portfolio/<slug>` and per role at `/experience/<slug>`; and a separately designed CV file,
`public/home/andreu-ortega-blasi-cv.pdf`. The redesign epics #42 and #70 are complete.

**Still open**, each the owner's to supply or decide: a role's `skills`; a video for the Digital
Twin and for this site; and the CV file catching up with the page's job titles (DDR-060). PMI's
badges appear on the certification cards alone (DDR-090); a PMI mark anywhere else needs the owner
to confirm PMI's authorization covers it.

## Commands

```text
npm install         Install dependencies
npm run dev         Start the local development server at http://localhost:3000
npm run lint        Lint with ESLint; any error or warning fails
npm run typecheck   Generate Next.js route types, then type-check with tsc
npm run test        Run the test suite once with Vitest
npm run build       Build the static site into out/
```

All of them run from a clean checkout after `npm install`, and none needs a running server. There
is deliberately no `start` script: static export produces plain files, so serve `out/` with any
static file server to check built output.

## Stack and deployment

Next.js App Router in TypeScript, configured for static export (ADR-001, ADR-002), deployed to
Vercel (ADR-023, superseding ADR-003's GitHub Pages).

* Vercel's Git integration deploys `main` to production and every other branch, so every pull
  request, to a preview. Its build command, in `vercel.json`, runs lint, typecheck, test and build,
  so a failing step deploys nothing and the last good deployment stays live.
* `.github/workflows/ci.yml` runs the same four commands on every pull request and every push to
  `main`, to show the result on GitHub. It deploys nothing.
* Vercel serves the site from the root, so `PAGES_BASE_PATH` is unset everywhere. `next.config.ts`
  still hands it to `basePath` and `app/asset.ts` still prefixes it; both are dormant.

## Structure

```text
app/        Routes and layouts, the global stylesheets (tokens.css, globals.css), and the fonts
components/ Presentational components, each with its CSS Module and its test
content/    All user-facing prose, as typed TypeScript modules
public/     Binary assets, arranged by view (home/, portfolio/<slug>/, experiences/<slug>/, …)
docs/       Decision records, implementation notes and the owner's knowledge base
```

* **Content** (ADR-001, ADR-002): no user-facing prose inside components. `content/types.ts`
  defines the shapes, one module per content type exports the records, and `app/page.tsx` passes
  them to components. A copy change should never require editing a component.
  `docs/knowledge-base/` is the owner's source material; draw only the facts a story names from it.
* **Sections**: `app/sections.tsx` is the page's ordered list of sections, rendered and listed in
  the contents bar. A new section goes there.
* **Styling** (ADR-001, ADR-006): `app/tokens.css` defines every design token once;
  `app/globals.css` styles plain elements; components are CSS Modules that read tokens and write no
  literal values beyond what ADR-006 admits. A value the tokens don't provide is a design decision,
  not a number to invent. Styles are mobile-first with two breakpoints, `20em` (tokens only) and
  `48em` (the only width a component may write).
* **Print**: the page itself is the CV (ADR-002), and what it prints is designed (DDR-015).
* **Tests** sit beside the code as `*.test.ts(x)`, run in Node with `react-dom/server`, and hold the
  tokens, stylesheets and content to their decision records. What to test is the Tester's decision.

**Read `docs/implementation-notes.md` before changing styles, print, the contents bar, the
timelines, the introduction, fonts or assets.** It lists the traps that the tests and the records
don't make obvious.

## Design source

The owner keeps the design in Figma: `career-site-design`
(https://www.figma.com/design/RhUMRELzXCfPc0IYa0uHse/career-site-design), with the layers
`career-site-main`, `career-site-project` and `career-site-experience`. Since 2026-09-17 (Epic #70)
the owner has decided that **the design prevails**, including over records written to protect WCAG
conformance: a value that fails is recorded as failing, held by name in `app/tokens.test.ts`, and
shipped. The file lags the owner's later choices, so adopt only what an issue names.

The owner supplies every photo, picture, video, logo and the CV file. Don't capture pictures of the owner
or their applications, and don't draw placeholders (a monogram or gradient) in a picture's place.
The one exception is this site's own gallery, which is captured from the site when the owner asks
(#252).

## Project Sources of Truth

| Concern                        | Source of truth                          |
| ------------------------------ | ---------------------------------------- |
| Project work and roadmap       | GitHub issues                            |
| Project history                | GitHub issues and pull requests          |
| Durable UI/UX decisions        | DDRs                                     |
| Durable architecture decisions | ADRs                                     |
| Non-obvious implementation traps | `docs/implementation-notes.md`         |
| Product/content intent         | Approved workflow artifacts              |
| Implementation                 | Existing codebase                        |
| Skill responsibilities         | `.claude/skills/**/SKILL.md`             |

Do not create duplicate documentation when an existing source already serves the purpose. **Keep
this file lean**: a story's history belongs in its pull request, a decision in its record, and a
trap in the implementation notes. Update this file only when something here stops being true.

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

Follow the architecture established by the existing codebase and accepted ADRs. Before introducing
a new layer, abstraction, dependency, integration, data store or architectural pattern, first
determine whether an existing pattern can solve the problem. Significant architectural changes are
reviewed by the Architect and recorded as an ADR. Do not make architectural decisions inside
implementation work when they have not been approved.

The site has three Client Components, each with its reason recorded in an ADR:
`components/contents-bar.tsx` (ADR-007), `components/business-case-slider.tsx` (ADR-015) and
`components/larger-picture.tsx` (ADR-018). A fourth one needs a reason of its own.

## UI and Design

Follow the existing UI patterns and accepted DDRs. Prefer reuse of existing components, consistent
layouts, typography and spacing, accessible interactions, responsive behaviour and simple
navigation. Do not introduce a new interaction pattern or significantly redesign an existing
experience without involving the UI Designer. Record significant and reusable design decisions as
DDRs.

## Content

Content is first-class. Follow the approved Content Strategy or Content Brief when available, write
for the intended audience, prioritize clarity and credibility, preserve the owner's authentic voice,
support claims with real evidence, and never invent experience, achievements, clients, metrics or
outcomes. The Content Strategist owns content intent and scope; the Content Builder implements it.

`content/cv.ts` carries a digest that fails the suite when a fact the CV file shares changes
(ADR-005). The CV file is the owner's to update.

## Accessibility

Accessibility is a requirement. Preserve semantic HTML, a logical heading hierarchy, keyboard
navigation, visible focus states, accessible names and labels, sufficient colour contrast,
meaningful alternative text, responsive layouts and reduced-motion preferences. Consider it during
design, implementation and testing.

## Testing

Testing should be proportional to the change. Validate relevant functionality, user workflows,
responsive behaviour, accessibility, error and empty states, integrations and regressions. Do not
consider an implementation complete merely because it builds. A visual change is checked in a
browser across widths and at 200% text, and a change that can move the printed CV is checked by
printing it (see `docs/implementation-notes.md`). The Tester provides the final validation for work
that requires formal testing.

## GitHub

GitHub issues and pull requests are the work-tracking system and the project's history. Before
starting non-trivial work, check for relevant existing issues and recent related pull requests. Do
not create duplicate issues. Use the templates in `.github/ISSUE_TEMPLATE/` (Epic, User Story, Bug)
and the existing labels (`epic`, `story`, `content`, `ui`, `architecture` and GitHub's defaults).
The Issue Writer owns the creation and structure of issues.

## Decision Records

DDRs record significant UI and UX decisions; ADRs record significant architecture and technical
decisions. Don't write one for every implementation detail, and don't silently override an accepted
one. If new work conflicts with an accepted decision: identify the conflict, explain the tradeoffs,
decide whether the decision should stand, and record a new decision if it must change, preserving
the supersession explicitly in both records.

**`docs/decisions/README.md`** holds the template rules, the next free numbers, and the map of
which records supersede or amend which. Read it before writing a record or relying on one.

## Workflow

The project uses skills in `.claude/skills/` to separate responsibilities. **Read the relevant
`SKILL.md` before using a skill**; don't duplicate its instructions here.

```text
Content Strategist → UI Designer → Architect → Issue Writer → Builder → Tester
```

* workflow skills: `content-strategist`, `ui-designer`, `architect`, `tester`
* execution skills: `content-builder`, `ui-builder`
* governance skills: `design-recorder` (after a UI decision), `refactoring-reviewer` (for a
  refactoring proposal, then the Architect if required)
* project management: `issue-writer`

Not every task needs every stage. Use the smallest workflow that gives sufficient confidence:

* small content change → Content Builder
* small UI change → UI Builder
* bug fix → Issue Writer → Builder → Tester
* significant content work → Content Strategist → Content Builder → Tester
* significant UI work → UI Designer → UI Builder → Tester
* architectural change → Architect → appropriate Builder → Tester
* significant refactor → Refactoring Reviewer → Architect, if required → Builder → Tester

Do not create process for its own sake.

## Working With Uncertainty

When requirements, design, architecture or content are unclear, identify what is known and what is
uncertain, avoid inventing missing information, use existing GitHub context and decision records,
and involve the appropriate skill when a decision is required. Do not silently resolve significant
product, content, design or architecture questions during implementation.

**Keep the project simple, intentional, credible, and understandable.**

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
