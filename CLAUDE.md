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
languages. Its page breaks were rechecked against the finished page for #23, and each section
now keeps its heading with its first item on paper, per DDR-015.

**The redesign, Epic #42, is complete.** Every section below is DDR-010's, and its print treatment
landed under #52. The real media it was still waiting on, #63, moved to Epic #70. The token layer is
the redesign's, under #44: Lora and
DM Sans, the type scale, the new palette, the wider page column and the second breakpoint are
all in place, and DDR-011 to DDR-014 supersede DDR-001 to DDR-004. The scale DDR-011 set there is
DDR-022's since #90, below: ten steps rather than seven.

**The introduction is the redesign's, under #48**: the photo, the positioning line in the accent,
and four pill controls — the three contact addresses and the "Get my CV" download.

**The experience and education sections are the redesign's timeline, under #49 and #51.** A role and
a credential share one pattern, per DDR-010, and `components/timeline.tsx` is it. A row is one
`article`: below the wide breakpoint a single column with its dates, and a role's place, above the
title, and from the breakpoint a three-column grid of a date column, a decorative spine, and the
content. The spine is `aria-hidden` and not rendered at all below the breakpoint. The space between
two rows is padding at the foot of the content column rather than a margin between the rows, so the
spine's line runs through it to the next dot; the last row in a section, which
`timeline.module.css` finds as `section > .row:last-child`, drops both. `--timeline-*` in
`app/tokens.css` holds its measures. `experience.module.css` holds what is a role's alone, which is
the bullet points — indented one step of the scale and marked by the browser's own disc recoloured
through `::marker`, per DDR-019; a credential has no place, a degree's body is its thesis sentence,
and a certification has no body at all.

**The projects section is the redesign's media-and-text row, under #50.** A project is one
`article`: below the wide breakpoint a single column with its media above the name, and from the
breakpoint a two-column grid of the media and the text. The text is the name, the technologies as a
wrapping row of tinted tags, the description, and the labelled links. `--project-media-*` in
`app/tokens.css` holds the media's width and its 4:3 ratio, and the media is capped to the row so a
narrow screen with enlarged text wraps rather than scrolls sideways. The media is an `img` or, for a
project whose content gives it a `Video`, a `video` with its poster, controls and `preload="none"`;
no project carries a video yet, so the branch is exercised by a test rather than by the page.

**The skills and languages sections are the redesign's, under #51.** A skill group is its name as an
`h3` followed by one block per level, strongest first: a level badge — the level as a word in a
tinted pill — and then that level's skills, separated by middle dots the same way the metadata line
separates its parts, and, since #78, in the same ink and at the same size as one. Groups stand two
to a row from the wide breakpoint and one below. The *row* is
what `app/page.tsx` hands the section, not the group, because the two columns have to be one grid
and a grid needs one parent: `skillRows` in `components/skills.tsx` splits them, and it holds the
count that `skills.module.css` draws. A language is a card — the language as its term, the CEFR
level below it in the accent — and the four stand in a row from the wide breakpoint, two between the
breakpoints and one below the narrowest. That last step is `--language-columns` in `app/tokens.css`,
because it happens at the narrow breakpoint, which a component may not write.

Every section is now the redesign's, so DDR-006's entry anatomy and its labelled list are gone:
`entry.tsx`, `entry.module.css` and `labelled-list.*` were removed on #51, with their tests.

Two things about the introduction are worth knowing before changing it:

* **The photo is a placeholder**, as the four project pictures are.
  `public/andreu-ortega-blasi-photo.webp` and the four `public/project-*.webp` files are flat tinted
  rectangles — the photo 3:4 and the four media 4:3 — not the owner's portrait and not pictures of
  anything. The photo's stand-in was recut to 3:4 on #71, which is the ratio #63 crops the real
  portrait to; since #89 the stylesheet clips that rectangle to a capsule, so the file #63 exports
  is still 3:4 but its corners are cropped away on the page.
  Every binary asset this site shows is the owner's to produce, and they
  have chosen to run on stand-ins meanwhile; #63 replaces them. Replacing the file is the whole of
  the change: the path and the alternative text in `content/introduction.ts` are written for the
  real photo. Do not build anything else on the stand-in, do not draw a monogram or a gradient in
  its place — DDR-010 rejects both — and do not go and capture a picture, which the owner has said
  they will take themselves. A story that needs media the owner has not supplied, such as #50,
  commits a blank stand-in the same way and leaves the real file to #63.
* **The photo sits beside the name at every width**, where DDR-010 and the UI Review on #43 put it
  above the name below the wide breakpoint. Measured against the real copy on #48, stacking it left
  the contact controls 2px below the fold of a 390px phone, which is the very thing DDR-010 places
  the photo beside the name to prevent. The owner chose the deviation on #48; a later design story
  records it. Below the breakpoint the photo floats and the name takes the width beside it, so the
  summary returns to the full column underneath.
* **Beside is conditional, per #68.** The photo is sized in rem, so it grows with the reader's text
  while the room beside it shrinks; before #68 the name was squeezed to 119px at 390px and 200% and
  broke mid-word onto seven lines, and to 49px at 320px, where it took seventeen.
  `min-inline-size: min-content` on the `h1` is what fixes it: a block that establishes its own
  formatting context and cannot fit beside a float moves below it instead. So the name drops under
  the photo, at the full column, once its longest word no longer fits beside it — at 360px and
  390px nothing changes at any text size the page was checked at, and at 320px the name now sits
  below the photo at the default size too, which is three whole words rather than four broken lines.
  Anything that changes the photo's size, the name's size or the float has to be rechecked at 200%,
  not only at 100%.

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
* **Fonts** are Lora and DM Sans, per DDR-011, with DDR-023 deciding which elements take which:
  Lora is `h1` and `h2` alone, and everything else — including `h3` to `h6`, which are the item
  titles — is DM Sans. They are committed
  to `app/fonts/`, with their licences, and loaded by `next/font/local` in `app/layout.tsx`, so
  builds need no network access for fonts. Each is one static file per weight and style, not a
  variable font: Firefox draws variable fonts as outlines when it saves a PDF, so the printed CV's
  text could not be selected (#22). **There are seven files, six of them loaded**, per DDR-023 —
  DM Sans at 400, 500, 600 and 700 plus a 400 italic, and Lora at 600. The seventh,
  `lora-latin-400-normal.woff2`, is committed and deliberately **not** listed in `app/layout.tsx`:
  it is the footer's name and #96 adds the footer, and `next/font` preloads every file it is given,
  so listing it now would fetch 21 KB for text the page does not show. `app/layout.test.tsx` holds
  both halves — every listed path exists, and that one file exists and is unlisted.
  They are derived, not downloaded: take the
  Fontsource variable file for the Latin subset, pin it to the weight with fontTools' instancer,
  name it, and save it as WOFF2; the italic comes from the italic variable file, not the upright
  one. A weight or a style with no file would be synthesised, so adding one means
  adding a file and revising DDR-023.
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
A section is given its items one element each, such as one role, so that it can keep its heading
with its first item on paper, per DDR-015.

Styling follows ADR-001. `app/tokens.css` defines every design token once, as a custom property
at `:root`, and `app/globals.css` applies the tokens to plain HTML elements. Component styles are
to be CSS Modules that read the tokens rather than writing literal values. A value the tokens do
not provide is a design decision to make, not a number to invent. `app/tokens.test.ts` holds the
type scale step by step and its floor to DDR-022, every colour pairing to the contrast ratio DDR-012 records, the
spacing scale, rhythm, column and radii to DDR-013, the narrow breakpoint and what it adapts to
DDR-014, the photo's two widths and its ratio to DDR-021, the three tracking values to DDR-017,
the bullet marker's 4.17:1 to DDR-019, the raised shadow and its 22% ink to DDR-020 and the photo's
two lights to DDR-021, the timeline's and
the projects' measures to DDR-010, and the print
treatment to DDR-015 as DDR-022 amends it — the 12pt base, every surface dropped and no ink touched, the 28mm photo, and
every shadow put out — so changing a token means revising its decision record too. The spacing and print rules in `app/globals.css` are wrapped in `:where()`, so they have no
specificity and a CSS Module's class overrides them. `components/stylesheets.test.ts` holds every
component stylesheet to the same rules: tokens only — sizes, spaces, tracking since DDR-017 and
`box-shadow` since DDR-020 —
no reordering, nothing but a pseudo-element taken out of the flow since DDR-021, and no width media
query but
the wide breakpoint, which DDR-015 lets a component extend to paper as `(min-width: 48em), print`
and no further. **ADR-006 says which literals it admits**: `0`, `auto` and `none` anywhere,
`100%` on `max-inline-size` and `max-block-size`, and `min-content` on `min-inline-size` and
`min-block-size`. The shape of the rule, which a new case should be tested against rather than the
list, is that **a limit may name the space there is or the space the content needs, and a size may
not**. #50 widened the rule for the projects' media; #51 narrowed it to the two maxima, then added
the two minima for the introduction's name, per #68.

The styles are mobile-first, per DDR-014. The `:root` values in `app/tokens.css` are for the
narrowest viewports, and the site has two breakpoints, both in em.

The **narrow** one, a `min-width: 20em` media query in that file, is the tokens'. It redefines the
four role tokens that adapt: the page and section titles (`--font-size-page-title`,
`--font-size-section-title`) and the page's edges (`--page-gutter`, `--page-padding-block`). Styles
read those roles rather than the steps behind them. `--font-size-item-title` is body size at every
width, because there is nothing below body size a title could take.

The **wide** one, `min-width: 48em`, is the components'. It redefines no token — what changes there
is layout, and a media query cannot read a custom property — so each component that lays out in
columns writes it in its own CSS Module. That is the one width a component stylesheet may write, and
the test enforces it. A third breakpoint is a new decision and a new record. To check either in a
browser, change the browser's default font size, not the root's CSS font size: an em in a media
query follows the former and ignores the latter.

Print follows DDR-015, which supersedes DDR-005 and DDR-008. ADR-002 makes the page itself the CV,
so what a browser prints, or saves as a PDF, is designed rather than left to defaults.

**Paper is the wide surface.** A component that lays out in columns writes
`@media (min-width: 48em), print`, so the sheet gets the layout the wide screen gets: the timeline's
date column, the projects' media beside their text, two columns of skill groups, four language cards
in a row. A sheet of A4 inside its margins is about 40em and an em in a media query is the browser's
default font size, which paper does not have, so the width alone never matches on paper; writing the
grid twice would leave the two free to drift. `components/stylesheets.test.ts` admits that one
variation and no other. **The introduction is the exception**: at 28mm the printed photo is short,
so a column of its own would leave three quarters of it empty, and the UI Review asks for the photo
beside the *name* — which is the float the narrow layout already uses. Its print block writes no
layout at all.

The `@media print` block in `app/tokens.css` sets `--root-font-size` to 12pt, which DDR-022 raised
from DDR-015's 11pt when the scale changed, so every rem, type and space alike, is measured from a
size suited to paper: body text at 11.25pt and the smallest step, a level badge, at 7.5pt. It makes **every** surface transparent — the page, the card, the tag and
the three level tints — and the decoration colour and the one shadow with them, so no component
writes a print rule to drop its own background or put out its own light, and the sheet reads the
same whether or not the browser prints background graphics. It lets the column fill the sheet, and sets the printed photo to 28mm, in mm because a
photograph on a sheet is a size of the paper. An `@page` rule beside it sets 2cm margins.

The `@media print` block in `app/globals.css` hides `nav`, prints each link's address after it,
keeps entries whole, and keeps headings with what follows. Firefox does not honour that last rule,
so `components/section.tsx` holds each section's heading and first item in one block that print
keeps whole, per DDR-015. A component hides its own screen-only elements in print, and may drop
screen-only sizing such as the minimum target size, but adds no print-only content. What the base
styles do not keep whole, because it is not an `article` or list item, such as a skill group or the
row of language cards, is kept whole by its own component.

**A video does not print.** Measured on #52: Edge prints an empty box with a dead scrubber and no
poster at all, and Firefox prints the poster under a controls bar. So a project whose media is a
video renders its poster a second time as an image, and exactly one of the two is displayed — the
video on screen, the still on paper. That is the same content in the form paper can carry, not
print-only content, and DDR-015 draws the line.

What a PDF says, not only how it looks, is part of the design: `app/globals.css` sets `font-variant-ligatures: none` and
`font-feature-settings: 'calt' 0`, per DDR-011, because Firefox writes a glyph that no character
maps to into a saved PDF as the replacement character, which left words such as "Software"
unsearchable (#40). In Lora and DM Sans those are the ligatures and the contextual alternates, and
with both off a PDF spells every word as the page does — re-verified on #52, where all 466 distinct
words the page shows came back out of both browsers' PDFs through both pypdf and pdfium, with no
replacement character and the apostrophe still U+2019. The only word that does not come back is
"Get", from the CV control print hides. Check print by saving a PDF in two browsers, read the text
back out of both, and recheck page breaks when the amount of content changes.

What exists, to reuse rather than reinvent:

* **The design system.** Typography (DDR-011), colour (DDR-012), spacing and layout (DDR-013) and
  responsive behaviour (DDR-014) are the redesign's, reworked on #44, and print (DDR-015) is the
  redesign's too, reworked on #52. The type scale and its floor are DDR-022's since #90, and
  DDR-011 keeps everything else it decides.
* **The components.** Every section is DDR-010's: the introduction under #48, the timeline that
  experience and education share under #49 and #51, the projects' media-and-text row under #50, and
  the skill groups and language cards under #51. What still carries over from DDR-006 is its
  outline, its contents row, and the metadata line — which DDR-010 narrows to a single part, so the
  timeline's dates, place and company each get a line set the same way. The contents, the section
  wrapper, the metadata line and the date range are shared by the sections that need them.
* **The icons**, in `components/icon.tsx`: one per contact address and one for the CV. They are
  inline SVG rather than committed files, drawn in `currentColor` and sized in em, and each is
  hidden from assistive technology because it repeats what its control's own text says. Which mark
  a contact takes is a key in `content/`, not something worked out from its address.
* **The content types.** `content/types.ts` covers the site metadata, an image, a video, the
  introduction and its contact links, the contents, dates, roles, projects, skills, credentials,
  languages, and the CV. A credential is a degree or a certification, and a project's media is an
  image or a video.

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

ADR-001 to ADR-006 are accepted, with ADR-004 superseding the part of ADR-002 that rules out a
separate CV file, and ADR-005 superseding the part of ADR-004 that makes the CV a PDF saved from the
page's print output; the rest of both records stands. ADR-006 supersedes nothing: it refines
ADR-001's styling boundary by saying which literal values a component stylesheet may write: `0`,
`auto` and `none` anywhere, `100%` on a maximum, and `min-content` on a minimum. The next ADR is
`007`.

The accepted DDRs are DDR-010 to DDR-015 and DDR-017 to DDR-024. The next DDR is `025`. Status
values are `Proposed`, `Accepted`, `Superseded`, or `Deprecated`.

Three accepted records are superseded **in part**, and each says so at the top and again at the
section concerned:

* **DDR-011** is superseded twice over. DDR-022 takes its type scale and its 13px floor; DDR-023
  takes which elements each typeface is used on, the three weights, the four files and the
  no-italics rule. What DDR-011 is still the record to read for is the two faces themselves and
  their fallback stacks, the one-static-file-per-weight recipe, the PDF guarantee, the line
  heights, the measure and the wrapping rules.
* **DDR-015** keeps everything but its print base, which DDR-022 raises from 11pt to 12pt.
* **DDR-018** keeps its case and its ink. DDR-023 takes its "semibold, not bold" decision, and
  corrects its measurement of the tracking fault: at the 10px badge DDR-022 left, +0.1em splits the
  word in a Firefox PDF at **every** weight the site ships, 400 included, where DDR-018 concluded
  400 was safe. **DDR-024 then takes its tracking amendment outright**, putting the badge back at
  +0.1em and restoring the row of DDR-017's table DDR-018 had changed.

`Superseded` are DDR-001 to DDR-009, and DDR-016:

| Superseded | By      | What changed                                                            |
| ---------- | ------- | ----------------------------------------------------------------------- |
| DDR-001    | DDR-011 | New typefaces, seven steps instead of five, three weights, a 13px floor   |
| DDR-002    | DDR-012 | New surface, three inks, a new accent, and the tinted surfaces           |
| DDR-003    | DDR-013 | The column stops being the measure; the scale and rhythm are unchanged   |
| DDR-004    | DDR-014 | A second breakpoint, at 48em, so one layout at every width is given up   |
| DDR-006    | DDR-010 | The whole career page structure                                          |
| DDR-007    | DDR-011 | The Source font files it prepares no longer exist; its rule carries over |
| DDR-005    | DDR-015 | An 11pt base, every tint dropped at the token layer, and paper takes the wide layout |
| DDR-008    | DDR-015 | Its block survives; its claim that both browsers break alike does not    |
| DDR-009    | DDR-011 | Its PDF guarantee is re-established for the new faces, and widened       |
| DDR-016    | DDR-021 | The photo’s corner radius and its two lights; the ratio and widths carry over |

DDR-008 had superseded DDR-005's acceptance that Firefox can leave a section heading at the foot of
a page, before DDR-015 superseded both. Each superseded record says at the top what carries forward
and what does not; read the new one first and the old one for the reasoning behind it.

DDR-010 is the design contract for Epic #42, the career page redesign, and it is built: its token
layer under #44, its introduction under #48, its five section components under #49 to #51, and its
print treatment under #52, as DDR-015. Everything DDR-010 asks for is now built: the decorative rule
beside each section's `h2`, the last of it, landed under #72.

**Epic #70 closes the remaining gaps between the page and the Figma design**, and its `Not Included`
section is the part to read before touching it. The owner also keeps the redesign as a Figma
*design* file, `career-site-design`
(https://www.figma.com/design/RhUMRELzXCfPc0IYa0uHse/career-site-design), which every Figma MCP tool
can read, unlike the Make file. **It is the same draft DDR-010 was written against**, so a difference
between it and the page is usually a recorded rejection rather than a defect: DDR-010 rejects the
sticky bar, the footer, the divider between sections and the gradient monogram; DDR-011 the 10–11px
text and the 15px body; DDR-012 the accent `#4f46e5` and the greys `#94a3b8` and `#64748b`; DDR-014
the 37px targets. **That is no longer how to read a difference.** On 2026-09-17 the owner decided
the design prevails everywhere, including over the records written to protect WCAG conformance, and
Epic #70 was rewritten around that: #89 to #99 are its children, and DDR-010 to DDR-012, DDR-014 and
DDR-016 to DDR-020 are each to be superseded rather than defended. The owner knows what it costs and
chose it over two narrower options; a value that fails something is recorded as failing and shipped.
Two things stay out — the gradient monogram, because #63 supplies a real portrait, and the mobile
"Sections" toggle, because the design has no narrow view to match.

The earlier audit's nine, #71 to #78 plus #63, are all landed but #63, which is the owner's to
produce rather than the repository's. **#89, #90 and #91 are the rewritten epic's first three to
land.**

**#71 has landed, as DDR-016: the photo is 3:4**, not the square it was. `--photo-size` and
`--photo-size-wide` are now `--photo-width`, `--photo-width-wide` and `--photo-ratio`, following the
projects' width-and-ratio pattern, so the stylesheet sets one length and a shape rather than two
lengths. Measured at the browser's real default font size, the taller photo moves the contact
controls not at all at 390px, 32px at 320px and 64px at 200% text, and it costs no sheet on paper.
**DDR-016's corner radius is superseded by DDR-021**, below; its ratio and its two widths are not.

**#89 has landed, as DDR-021: the photo is the design's capsule, and it is lit.** Three things about
it are worth knowing before touching it.

* **The design's shape is a capsule, not an ellipse, and `--radius-pill` draws it exactly.** The
  file's `rounded-[113.536px]` is more than half the frame's 196.762 width, and CSS and Figma both
  clamp a radius that large to half the box — so the top and bottom become semicircles and the sides
  stay straight. Measured against the rendered frame and against the built page, it tracks a capsule
  to within 1.7px and is up to 9.3px from an ellipse. So DDR-013 keeps its three radii and gains no
  fourth, which is the objection DDR-016 turned the shape down on. **#63's crop does not change**:
  the capsule is drawn by the stylesheet, so the exported file is still a 3:4 rectangle — but its
  corners are cropped away on the page, which is a constraint on how the portrait is framed.
* **An inset `box-shadow` on an `<img>` paints nothing**, in Chromium and Gecko alike: an inner
  shadow is painted below the border and a replaced element's content is painted above it, so the
  image covers it. Measured on #89, the image's top rows are identical with the inset declared and
  without it. So the photo is wrapped in a `<span class={styles.frame}>` that floats, shrink-wraps
  it, and carries `--shadow-photo-glow` and the radius, while `.frame::after` carries
  `--shadow-photo-inner` over the image. The frame holds no content and takes no role and no
  `aria-hidden` — the photo's accessible name is still its `alt`.
* **`components/stylesheets.test.ts` now admits `position: absolute` on a pseudo-element and refuses
  it everywhere else.** The rule it narrows is DDR-014's "the visual order is the markup order",
  which is about content; a pseudo-element has no place in the markup order and is not in the
  accessibility tree. It is used once, here. The glow is also the first value on the site adopted
  **below** a floor a record set — 1.17:1 against the page, where DDR-020 rejected 1.50:1 — because
  it is indigo rather than neutral and differs by hue: 10.8 ΔE at its strongest, against the 2.3 an
  eye can just see. DDR-021 has both tables, and #68's six cases measured identical before and
  after.

**#90 has landed, as DDR-022: the type scale is the design's, and the floor drops to 10px.** Ten
steps where there were seven, `--font-size-xxxx-small` to `--font-size-xxx-large`, measured node by
node off the Figma file. Nine of them are the design's own sizes — 10, 11, 12.8, 13, 14, 15, 16,
20.8 and 51.2px — and `xx-large`, 36px, is the narrow page title, which the design has no view for.
Every size on the page was read back off the built page and matches the file, and DDR-022 has the
table.

Five things about it are worth knowing before touching type anywhere.

* **`medium` is body text, not 1rem.** DDR-011 could say both; the design's body is 15px, so the two
  parted and the name stayed with the body. `body` in `app/globals.css` and
  `--font-size-item-title` both read it, and a step and the root are no longer the same thing
  anywhere. An item title is still body size, so it still has no narrow value — and that includes a
  credential's name, which the file draws 1px smaller than a role's job title and which DDR-022
  deliberately reads as 15px, because DDR-010 makes a role and a credential one pattern.
* **The narrow titles are unchanged, and DDR-014 is untouched.** The page title still steps down to
  2.25rem below the narrow breakpoint and the section title to the step below its own; both role
  tokens and the breakpoint block are written exactly as they were, because the new scale keeps the
  same names in the same places. Only the values behind them moved.
* **Two size rules could not go on an existing selector.** `timeline.module.css` writes `.dates p`,
  naming the element so it outranks `.metadata` from another module without giving the place a class
  — which keeps `.dates .dateRange` the one class pair in `components/`. And
  `components/credentials.module.css` is new, holding a degree's thesis at 13px: it is the sibling
  of `experience.module.css` that the convention already implied, since a thesis is a paragraph in
  the same column as an institution and a certification has one of those and no thesis, so no
  positional selector tells them apart. #91 puts the design's italic there.
* **Line heights did not move, and that is a known remaining difference.** The design sets its
  running text at 1.65 to 1.75 and its short lines at 1.5; the page keeps DDR-011's single 1.5, so
  it now sets prose *tighter* than the file. Two tokens cannot hold six leadings, and #90 scoped
  them out; DDR-022 records it as an open item for Epic #70's closing pass rather than as a
  rejection.
* **Paper is measured from 12pt**, where DDR-015 set 11pt, because body text is 0.9375rem here and
  an unchanged base would have printed it at 10.3pt and the level badges at 6.9pt. At 12pt body text
  prints at 11.25pt and the smallest step at 7.5pt. **Nothing about the printed page was measured on
  this story** — the sheet count, the breaks and what comes back out of a PDF are #99's, and it may
  move the base again.

Measured at the browser's real default font size and at double it: nothing scrolls horizontally and
nothing overflows the viewport at 320px, 360px or 390px at either size; the widest date range now
sets on one line with about 36px of slack in the 160px column, where DDR-018 measured 1.9px; and one
float case moves — at a 320px viewport with a classic scrollbar, so the breakpoint matched with
305px of room, the name drops below the photo and takes the full column, because the title grew
from 48px to 51.2px and its longest word no longer fits beside it. It is three whole words on three
lines either way, and at a full 320px of content it still sits beside the photo, so #68's own
measurements stand. DDR-022 has both tables.

**#91 has landed, as DDR-023: the page is set in the faces, weights and styles the design draws.**
Lora is now `h1` and `h2` alone — an item title is an `h3` and the design sets it in DM Sans
SemiBold at the size of the text beneath it, told apart by weight and position rather than by voice,
so `app/globals.css` writes the family in the `h1` and `h2` rules instead of the rule that styles
all six levels, and `h3` to `h6` inherit DM Sans from `body`. The three labels DDR-018 sets — the
timeline's date range, a level badge and a skill-group name — take a new `--font-weight-bold` at
700, which is the weight DDR-018 wanted and could not have. A degree's thesis sentence is the site's
one italic, where DDR-011 carried DDR-001's rule that it uses none; `font-style: italic` is a
keyword rather than a length, as `text-transform: uppercase` is, so the stylesheet test needs no new
admission for it.

Five things about it are worth knowing before touching type or a font file.

* **There are seven files and six are loaded**, listed above under Fonts. Lora Regular is derived,
  inspected and committed for the footer #96 adds, and left out of `app/layout.tsx` until then
  because `next/font` preloads everything it is given.
* **The payload is 46% larger**: 92.3 KiB served, where DDR-011's four files served 63.4 KiB. That
  is the design's price and DDR-023 records it rather than absorbing it.
* **DDR-011's PDF guarantee was re-established, not assumed.** Each new file's character map is its
  sibling's, tag for tag: 222 characters to 222 glyphs in both DM Sans files and 226 to 226 in Lora
  Regular, none mapped twice, and the same `liga` and `calt` substitutions that `app/globals.css`
  already switches off. Printed to A4 in Edge 153 and Firefox 156 with background graphics on and
  read back through pypdf and pdfium both: no replacement character anywhere, the apostrophe still
  U+2019, every bold label back as one word and both italic sentences back whole. Of the 478 words
  the page shows, Edge gives back all but "Get", from the CV control print hides, and Firefox also
  wraps "Copilot-driven" and "data-driven" at their hyphens, which is its own behaviour and is there
  before this change too.
* **The sheet count is five in both browsers, and #90 is where Edge's fourth went.** The same
  measurement run against the tree this branched from gives five and five as well. "Four in Edge"
  was last true at #89; #99 owns the print recheck.
* **DDR-018's tracking fault was re-measured and it is no longer about weight.** Forcing the badge
  to +0.1em — which is what #92 proposes — still splits it in Firefox through pypdf, but now at 400,
  600 and 700 alike, because DDR-022 took the badge from 13px to 10px. The skill-group name at
  +0.1em does not split at any weight in either browser through either reader, which is why moving
  it into DM Sans Bold cost nothing. The page ships the badge at +0.025em as DDR-018 left it; #92
  decides the rest. Nothing on the page gained or lost a line: bold costs the widest date range
  0.9px, leaving 34.9px of slack in the 160px column, and Lora to DM Sans on the item titles leaves
  every `h3` line count identical at 320px, 390px and 1280px at both text sizes.

**#72 has landed: each section's `h2` carries its rule**, drawn by `section.module.css` as a
pseudo-element on the heading rather than an element in `section.tsx`, so it is never in the
accessibility tree and cannot reach the accessible name the section takes from its heading. It is a
border in `--color-decoration`, so paper drops it at the token layer with no print rule of its own.
The rule grows from a basis of zero and **yields to nothing when the title needs the whole line** —
which only ever happens to "Education and certifications", below about 390px or with enlarged text.
That is deliberate: giving it a minimum width instead takes the content to 342px in a 320px viewport
at 200% text, which is a reflow failure. Decoration gives way to the title.

**#74 has landed, as DDR-017: the page has tracking**, which it had nowhere before. Three values in
em — `--letter-spacing-tight` at −0.025em, `--letter-spacing-loose` at 0.025em and
`--letter-spacing-x-loose` at 0.1em — and six users: `h1` and `h2` take tight, from
`app/globals.css`; a technology tag and the timeline's date range take loose; a skill group's name
and, since #92, a level badge take x-loose. Everything else is left at the spacing its face was drawn with, so
there is no `normal` token. **em, not rem**, is deliberate and is the type system's one exception:
tracking is a proportion of the letters it separates, and a 48px title and a 13px badge cannot share
an absolute amount. Two classes exist only to carry it, `.name` in skills and `.dateRange` in the
timeline — the place beside the date range is untracked, and a skill group's name is the one `h3`
set apart from the other item titles. `components/stylesheets.test.ts` now reads `letter-spacing`
alongside the sizes and spaces, so a literal tracking value fails the suite. The `x-loose` pair was
drawn uppercase in the design and landed lowercase; **#75 closed that gap**, below.

**#75 has landed, as DDR-018: the page's three labels are set as labels.** The timeline's date
range, a level badge and a skill group's name are uppercase and semibold, and the date range is in
the accent where it was the secondary ink. That is the whole of it: three rules, in the two classes
DDR-017 left as hooks and in `.badge`. The **case is drawn, never written** — `text-transform` in
the stylesheet, so a screen reader is still handed "Oct 2024 – Present" and "Advanced", the `time`
element keeps its value, and `content/cv.ts`'s digest does not move. **Semibold, not the design's
bold**, because the site ships files for 400, 500 and 600 only and DDR-011 makes a fifth file a
decision of its own; the group name was already semibold, as every heading is, so only two rules
write a weight. The technology tags are deliberately **not** part of it: they are proper names, and
`NEXT.JS` is not one. The accent adds no pairing — DDR-012 already measures it at 7.38:1 on the page
— and the place below the date range is untouched.

Three things about it are worth knowing before touching any of them.

* **A level badge's tracking dropped from x-loose to loose, and DDR-018 amended DDR-017 to say so.**
  It was not a preference: a semibold badge at +0.1em printed to A4 came back out of both browsers
  as `P R O F I C I E N T`, which is exactly the failure DDR-017 named as tracking's risk and
  checked for. Measured one property at a time in both browsers, the case had nothing to do with it,
  and DDR-018 concluded the weight was what crossed the line. **#90 showed that was the wrong
  reading and #92 has reversed the amendment** — see DDR-024 below. What still stands here is the
  case, the ink and the selectors.
* `timeline.module.css` writes `.dates .dateRange`, the one **two-class selector** in `components/`,
  because `.metadata` sets the secondary ink on the same element from another module at the same
  specificity, and a single class would leave the winner to the order the bundler emits the two
  files in.
* **The date column was the tightest fit on the page** until #90 took a date range from 14px to
  11px: from the wide breakpoint it is a fixed 10rem, and the widest range, "Mar 2022 – May 2023",
  set at 158.1px in 160px here, where it was 149.7px. Measured again on #90 it has about 36px of
  slack. It still sets on one line, and it wraps rather than overflows if it ever stops. Checked at 320px,
  360px, 390px and 1280px, each at the browser's default font size and at double it: no horizontal
  scrollbar in any of the eight, and no group name gained a line.

**#76 has landed, as DDR-019: a role's points are indented one step and their marker is
recoloured.** Two declarations in `experience.module.css` — `padding-inline-start: var(--space-medium)`
on the list, and `color: var(--color-marker)` on `.points > li::marker` — and one new token. They
are the only marked list on the site; the other four `ul`s set `list-style: none`, so the two steps
`app/globals.css` gives every list now apply to nothing that is drawn.

Three things about it are worth knowing before touching it.

* **The marker is recoloured, never replaced.** `list-style: none` and a drawn dot would cost the
  list its semantics in Safari and VoiceOver, would need `position: absolute` to hang beside the
  first line of a wrapped point — which `components/stylesheets.test.ts` forbids — and would put the
  dot's size on neither scale. Recoloured, the marker keeps its semantics, its hanging alignment and
  a size proportional to the text: about 4.8px beside the 14px points in Chromium, which is the
  design's 4px without a length. `components/experience.test.tsx` fails if either `list-style` or
  `content` appears in that stylesheet.
* **`--color-marker` is `#6366f1`, not the design's `#a5b4fc`.** The design's value is 1.86:1 on the
  page — fainter than the hairlines DDR-012 calls the lightest that read at all — so DDR-019 takes
  the lightest of the ramp that clears the 3:1 WCAG asks of meaningful non-text, at 4.17:1. The
  owner chose it on #76 over reusing `--color-accent`.
* **It is deliberately not `--color-decoration`.** DDR-015 makes decoration transparent at the token
  layer, so a marker drawn in it would leave the printed CV with no markers at all, where it has
  them today. That is the whole reason the palette gains a colour rather than reusing one, and it is
  why `--color-marker` is absent from the print block that drops every surface.

**#77 has landed, as DDR-020: the site has one elevation, and the design's shadow is darkened to
reach it.** One token, `--shadow-raised`, and one declaration each in `introduction.module.css` and
`languages.module.css`, so exactly eight elements are raised off the page: the three contact pills,
the CV control and the four language cards. Nothing else on the page is, and depth is otherwise
still a tint, a hairline and a radius.

Three things about it are worth knowing before touching it.

* **The ink is 22% black where the design draws 10%.** The geometry is the design's, unchanged. Its
  ink is not: at 10% the darkest row the shadow draws is 1.50:1 against the page, fainter than the
  hairlines DDR-012 calls the lightest that read at all, and at 22% it is 2.45:1 in Chromium and
  2.47:1 in Gecko — the lightest ink that clears them. The floor is the hairlines' 2.39:1 rather than
  WCAG's 3:1, because a shadow carries nothing; DDR-020 has the ramp and the argument. The owner
  chose a shadow that reads over the design's own and over having none at all.
* **The ink is deliberately not in the palette.** Every colour token is an opaque hex, and this one
  is translucent black, which is wrong on text, on a border and on a surface. It lives inside
  `--shadow-raised` rather than beside the colours, and `app/tokens.test.ts` holds the palette opaque
  so it stays the only translucency in the file.
* **Paper draws no shadow**, by `--shadow-raised: none` in the print block rather than by a rule in
  either component — the same mechanism DDR-015 uses for the surfaces. Checked by printing with
  background graphics on, which is the only way a browser prints a shadow at all: no grey band on any
  sheet in either browser.

**#78 has landed: a level's skills are set in the secondary ink.** One declaration,
`color: var(--color-text-secondary)` on `.level` in `components/skills.module.css`, which had set
the metadata *size* since #51 and left the metadata ink behind, so the skills were the one piece of
metadata on the page as dark as running text. It writes no new token and no new decision: the ink is
DDR-012's, already measured at 7.07:1 on the page surface and already held there by
`app/tokens.test.ts`, and the design's `#475569` is that token's own value — the records and the
design agreed and the page was the outlier.

Two things about it are worth knowing before touching it.

* **It writes the pair `metadata-line.module.css` writes, rather than reusing that module**, because
  a level's line is not a metadata line: it carries a badge, its parts are skills separated for
  reading rather than parts of one fact, and `skills.tsx` draws its own dots. What the two share is
  the role, so they share the two tokens that draw it.
* **The badges keep their own inks** without a rule to protect them, since a declared colour beats an
  inherited one. `.basic` was already the secondary ink by way of `--color-text-level-basic`, so
  what changed there is the line around it, not the badge.

Everything the section stories left to #52 has landed. For the record, since the gaps are named in
those PRs: the timeline prints its date column, the projects print their media beside their text,
the skill groups print two to a row and the language cards four, the printed photo is 28mm beside
the name, the type base is 11pt rather than 10pt — 12pt since #90 — and a video prints its poster as
an image.

**Printed on #52 in Edge 153 and Firefox 155**, to A4 through WebDriver, the page runs to **four
sheets in Edge and five in Firefox**. #23 recorded five, #48 had it at four, #50 and #51 took it to
six; the wide layout on paper has taken two sheets back off it. In both browsers no section heading
is stranded and none of the 18 items is split across two sheets. Rechecked on #74, after tracking
landed: still four and five, with no heading stranded, and all 434 distinct words back out of both
PDFs through both pypdf and pdfium — every word but "Get", from the CV control print hides.
Rechecked again on #75, after the capitals: still four and five, every word back out of both PDFs
through both readers but "Get", no replacement character, the apostrophe still U+2019, and no run of
single letters anywhere — which is the check that **caught** the badge's tracking on that story, so
it is not a formality. Rechecked on #76, after the bullet marker and its indent: still four and
five, no heading stranded, no item split, every word back out of both readers in both browsers, and
the markers themselves drawn on every sheet that carries points — the one thing on the page that
prints and is neither text nor a surface. Rechecked on #77, after elevation landed, this time with
background graphics **on**: still four and five, all 472 distinct words back out of both readers in
both browsers, and no shadow anywhere — the longest run of neutral grey on any sheet is 35px, where a
card's shadow would be a band about 240px wide. Rechecked on #78, after the skills' ink: still four
and five, no heading stranded, each skill group still whole on one sheet with the section breaking
between its two rows, and no replacement character in either PDF — the only words the two readers
disagree on are the ones wrapped at a hyphen, which is pdfium's own behaviour rather than a fault.

**The two browsers no longer agree on the total, and that is worth knowing before touching the
introduction.** Every break rule behaves identically in both. Firefox simply sets the summary one
line longer than Edge does, which pushes the second role past the foot of page 1, and
`break-inside: avoid` then moves the whole role rather than splitting it. The difference is one line
wide, so an edit to the summary could move Firefox to four sheets or Edge to five. The stand-ins are
already the full box, so the real pictures on #63 will not change the length. Rechecked on #71, after
the photo went from square to 3:4: still four sheets in Edge and five in Firefox, with no heading
stranded and no item split in either. Rechecked on #89, after the photo became a lit capsule, with
background graphics **on**: still four and five, 483 distinct words back out of both PDFs through
both readers, and neither light drawn — not one pixel in the 18px band beside the printed photo is
anything but paper white in either browser. The capsule itself does print. Worth knowing:
**Firefox prints the photo at 28.11mm and Edge at 24.55mm**, because Edge scales the whole sheet by
about 0.877; Edge printed the DDR-016 photo at 24.55mm too, so that is not #89's doing.

ADR-004 and ADR-005 together decide the downloadable CV and the site's first binary assets. The CV
itself has landed, under #56: `public/andreu-ortega-blasi-cv.pdf` is a separately designed document,
and `content/cv.ts` carries a digest over the content modules that `content/cv.test.ts` checks, so a
change to any fact on the page fails the test suite until the CV is brought back into step. ADR-005
lists the facts the two documents must share and makes the site the one that wins when they disagree.

Both halves of the reference machinery have landed. `app/asset.ts`, under #47, is the one route a
binary's path takes so that it resolves under `PAGES_BASE_PATH` as well as locally, and
`components/assets.test.ts` holds every `src`, `poster` and `href` in `components/` and `app/` to
it: a root-relative path written straight into one of those attributes is correct locally and 404s
on the live site, so it is checked rather than remembered. The CV control itself landed with the
introduction, under #48, and the page now offers the file.

`eslint.config.mjs` turns `@next/next/no-img-element` off, because ADR-004 rules `next/image` out
and the rule would otherwise argue with an accepted decision at every image.

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
