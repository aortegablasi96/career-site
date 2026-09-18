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
and four pill controls — the three contact addresses and the "Get my CV" download. Since #97 each
contact pill reads "Email", "LinkedIn" or "GitHub", per DDR-029, and the address it links to is
written out in the footer instead. A `ContactLink` therefore carries both strings: `label`, which
the pill shows, and `text`, which is the address and which only the footer shows.

**The experience and education sections are the redesign's timeline, under #49 and #51.** A role and
a credential share one pattern, per DDR-010, and `components/timeline.tsx` is it. A row is one
`article`: below the wide breakpoint a single column with its dates, and a role's place, above the
title, and from the breakpoint a three-column grid of a date column, a decorative spine, and the
content. The spine is `aria-hidden` and not rendered at all below the breakpoint. Since #116, per
DDR-036, each row's spine is three pieces — a lead line down into the dot, the design's ringed dot
with its accent core, and the line leaving it — so the rows join into one unbroken line from the
first dot to the last; the first row's lead is left undrawn. The space between
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

**The footer is the design's, under #96.** A `footer` follows `main`, holding the owner's name and
the three contact addresses above a hairline, inside the page's own column — `components/footer.tsx`
and `footer.module.css`, per DDR-028, which supersedes DDR-010's "There is no footer". It writes no
token and no string. Since #97 it is the **only** place on the page, and in the printed CV, where an
address is written out, so removing it or stopping it printing is not a footer change. Its links are the one place on the site a link is neither underlined nor in the
accent, and what identifies them is in the record.

**The skills and languages sections are the redesign's, under #51.** A skill group is its name as an
`h3` followed by one block per level, strongest first: a level badge — the level as a word in a
tinted pill — on a line of its own, per DDR-037, and below it that level's skills, separated by middle dots the same way the metadata line
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
  titles — is DM Sans. Which elements take **medium** is DDR-030's since #109: the positioning line,
  the four pill controls and the technology tags, and since #98 the contents links, per DDR-031. They are committed
  to `app/fonts/`, with their licences, and loaded by `next/font/local` in `app/layout.tsx`, so
  builds need no network access for fonts. Each is one static file per weight and style, not a
  variable font: Firefox draws variable fonts as outlines when it saves a PDF, so the printed CV's
  text could not be selected (#22). **There are seven files and all seven are loaded**, per DDR-023
  as DDR-028 completes it — DM Sans at 400, 500, 600 and 700 plus a 400 italic, and Lora at 400 and
  600. Lora Regular was committed and deliberately unlisted until #96, because it is the footer's
  name and `next/font` preloads every file it is given; the footer now draws it.
  `app/layout.test.tsx` holds the two sets **equal**, so a file committed for a story still to come
  fails the suite rather than shipping as bytes nobody fetches on purpose.
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
with its first item on paper, per DDR-015. Since #96 the page returns a fragment rather than a
single `main`: the footer follows `main` so that it is the page's `contentinfo` landmark, per
DDR-028, and it is handed the introduction's own name and contact records.

Styling follows ADR-001. `app/tokens.css` defines every design token once, as a custom property
at `:root`, and `app/globals.css` applies the tokens to plain HTML elements. Component styles are
to be CSS Modules that read the tokens rather than writing literal values. A value the tokens do
not provide is a design decision to make, not a number to invent. `app/tokens.test.ts` holds the
type scale step by step and its floor to DDR-022, every colour pairing to the contrast ratio DDR-025 records — including the four that fail, held by name so a fifth cannot join them quietly — the
spacing scale, column and radii to DDR-013, the rhythm — each space the design's value times one
factor, and paper's steps as they were — to DDR-039, the narrow breakpoint and what it adapts to
DDR-014, the **absence** of a target minimum to DDR-027 — the name is held missing, so reinstating
one moves the record with it — the photo's two widths and its ratio to DDR-021, the three tracking values to DDR-017, the four leadings — each running-text block within half a pixel a line of the design, and 1.5 on paper — to DDR-038,
the bullet marker's 1.86:1 to DDR-019 as DDR-025 amends it, the raised shadow and its 10% ink to DDR-020 as DDR-025 amends it, and the photo's
two lights to DDR-021, the timeline's and
the projects' measures to DDR-010, and the print
treatment to DDR-015 as DDR-022 amends it — the 12pt base, every surface dropped and no ink touched, the 28mm photo, and
every shadow put out — so changing a token means revising its decision record too. The spacing and print rules in `app/globals.css` are wrapped in `:where()`, so they have no
specificity and a CSS Module's class overrides them. `components/stylesheets.test.ts` holds every
component stylesheet to the same rules: tokens only — sizes, spaces, tracking since DDR-017,
`box-shadow` since DDR-020 and leading since DDR-038 —
no reordering, nothing but a pseudo-element taken out of the flow since DDR-021, `position: sticky`
on the contents bar alone since DDR-031, and no width media
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

The **wide** one, `min-width: 48em`, is the components'. It redefines one token, `--rhythm-scale`,
per DDR-039 — 0.75 below it and 1 from it — and nothing else: what changes there is layout, and a
media query cannot read a custom property, so each component that lays out in columns writes it in
its own CSS Module. That is the one width a component stylesheet may write, and
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
the three level tints — and all three hairline colours and the one shadow with them, so no component
writes a print rule to drop its own background or put out its own light, and the sheet reads the
same whether or not the browser prints background graphics. It lets the column fill the sheet, and sets the printed photo to 28mm, in mm because a
photograph on a sheet is a size of the paper. An `@page` rule beside it sets 2cm margins.

The `@media print` block in `app/globals.css` hides `nav` — and only `nav`: the footer prints, per
DDR-028, because since #97 labelled the contact pills it is the only place the printed CV carries an
address at all. It prints each link's address after it,
keeps entries whole, and keeps headings with what follows. Firefox does not honour that last rule,
so `components/section.tsx` holds each section's heading and first item in one block that print
keeps whole, per DDR-015. A component hides its own screen-only elements in print, and may drop
screen-only sizing such as the row gap that holds two links apart for a finger, per DDR-027 — which
is the projects' one remaining use of that allowance, since DDR-027 took the target minimum it used
to name — but adds no print-only content. What the base
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

* **The design system.** Typography (DDR-011), colour (DDR-025, superseding DDR-012), spacing and layout (DDR-013, as DDR-026 amends its section boundary) and
  responsive behaviour (DDR-014, whose target minimum DDR-027 takes) are the redesign's, reworked on
  #44, and print (DDR-015) is the
  redesign's too, reworked on #52. The type scale and its floor are DDR-022's since #90, and
  DDR-011 keeps everything else it decides. Target sizes are DDR-027's since #95.
* **The components.** Every section is DDR-010's: the introduction under #48, the timeline that
  experience and education share under #49 and #51, the projects' media-and-text row under #50, and
  the skill groups and language cards under #51. The footer below them is DDR-028's, under #96. What still carries over from DDR-006 is its
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

ADR-001 to ADR-007 are accepted, with ADR-004 superseding the part of ADR-002 that rules out a
separate CV file, and ADR-005 superseding the part of ADR-004 that makes the CV a PDF saved from the
page's print output; the rest of both records stands. ADR-006 supersedes nothing: it refines
ADR-001's styling boundary by saying which literal values a component stylesheet may write: `0`,
`auto` and `none` anywhere, `100%` on a maximum, and `min-content` on a minimum. ADR-007 supersedes
nothing either: it is the first time ADR-001's "`'use client'` requires a reason" is met, and it
records the reason — the contents bar has to know how far the page has scrolled — and is not a
precedent for the next one. The next ADR is `008`.

The accepted DDRs are DDR-010, DDR-011, DDR-013 to DDR-015 and DDR-017 to DDR-039. The next DDR is
`040`. Status values are `Proposed`, `Accepted`, `Superseded`, or `Deprecated`.

Fourteen accepted records are superseded or amended **in part**, and each says so at the top and again
at the section concerned:

* **DDR-010** keeps its whole structure and every pattern in it, including the decorative rule it
  gives each section's `h2`. DDR-026 takes the one sentence that rejects the design's divider
  between every section, which is now drawn. DDR-027 takes its 44 by 44 pixel target and corrects
  its "about 28px tall" for the design's contents links, which are 20px tall and 28px apart.
  DDR-028 takes the one sentence that says "There is no footer", and answers the three grounds it
  rejected one on; the outline is untouched, because the footer adds no heading. DDR-029 then takes
  the bullet this record calls "not negotiable", which makes each contact pill's text its address:
  the pills carry the design's labels and DDR-028's footer carries the addresses. The print
  exception that followed from the old rule survives — a contact link still prints no address after
  itself. DDR-035 takes its "Hover thickens the underline": hover changes colour instead.
  DDR-031 takes its "It is not sticky": the contents are the design's pinned bar, and
  DDR-031 also amends DDR-021's out-of-flow rule, DDR-025's opaque palette and DDR-030's open item.
  DDR-036 amends its spine: a ringed dot on one unbroken line. DDR-037 amends its skills pattern:
  a level's badge stands above its skills.
* **DDR-014** keeps its two breakpoints, its mobile-first ordering, its markup-order rule, its hover
  rule and its rule that nothing scrolls horizontally from 320px. DDR-039 lets the wide breakpoint
  redefine one token, `--rhythm-scale`. DDR-027 takes its 44 by 44 pixel
  minimum target, and `--target-size-min` with it. The one sentence of that bullet which survives is
  the one letting a component drop screen-only sizing on paper.
* **DDR-013** keeps its scale, `--space-flow` and every other value. DDR-039 takes its rhythm: the
  space between sections, from a heading to its first item and between entries is the design's own,
  off the scale. DDR-026 amends the sentence that makes whitespace and a heading the whole section
  boundary: the boundary now carries a hairline, with the section's space split around it.
* **DDR-026** keeps its divider, its colour, its place and its split. DDR-039 corrects its claim
  that the page drew the design's 56px on each side of the line: it drew 32px until #119.

* **DDR-023** keeps its two faces, its four weights, its one italic, its seven files and its rule
  about which elements take which face. DDR-030 corrects the one row of its weight table that was
  wrong in both directions: the medium row named the contents links and the tags, neither of which
  had the weight, and left out the CV control, which did. It now names the positioning line, the
  four pill controls and the tags. DDR-031 adds the contents links, which were #98's.
* **DDR-011** is superseded three times over. DDR-022 takes its type scale and its 13px floor; DDR-023
  takes which elements each typeface is used on, the three weights, the four files and the
  no-italics rule; DDR-038 adds two running-text leadings to its 1.5 and 1.2, which stand. What
  DDR-011 is still the record to read for is the two faces themselves and their fallback stacks,
  the one-static-file-per-weight recipe, the PDF guarantee, the short-line and heading leadings,
  the measure and the wrapping rules.
* **DDR-015** keeps everything but its print base, which DDR-022 raises from 11pt to 12pt. DDR-025
  splits the one `--color-decoration` it drops on paper into three tokens; all three are dropped in
  the same block, for the same reason, and since DDR-026 one of them draws the section divider,
  which therefore prints as nothing at all. DDR-032 keeps the 12pt base, lets a printed address break
  anywhere, and replaces its page-break measurements: five sheets in both browsers. DDR-038 keeps
  running text at 1.5 on paper, where the screen now sets it looser, and DDR-039 keeps the rhythm
  at its old steps on paper, where the screen now takes the design's.
* **DDR-018** keeps its case and its ink. DDR-023 takes its "semibold, not bold" decision, and
  corrects its measurement of the tracking fault: at the 10px badge DDR-022 left, +0.1em splits the
  word in a Firefox PDF at **every** weight the site ships, 400 included, where DDR-018 concluded
  400 was safe. **DDR-024 then takes its tracking amendment outright**, putting the badge back at
  +0.1em and restoring the row of DDR-017's table DDR-018 had changed.
* **DDR-019** keeps its indent, its recoloured `::marker`, its three reasons against a drawn dot,
  and its reason for being a token of its own that paper does not drop. DDR-025 takes its colour:
  the marker is the design's `#a5b4fc` at 1.86:1, which DDR-019 measured and rejected, and it now
  fails WCAG 1.4.11.
* **DDR-028** keeps everything it decides. What moved is the ground under it: it recorded DDR-010's
  contact-address rule as unchanged, and DDR-029 has since taken that rule, so the footer is no
  longer a repetition of the pills above but the one place an address is written out. The record
  says so at the top and at the two places it anticipated #97.
* **DDR-027** keeps its ruling that a target is the size the design draws it, and its argument that
  44 by 44 was an AAA criterion the records had cited as AA. DDR-028 extends its table of every
  target on the page from eleven rows to fourteen: the footer's three addresses are 19.2px tall and
  meet 2.5.8 by the spacing exception, as seven of the eleven already do.
* **DDR-020** keeps one elevation, its name, its eight elements, the design's geometry and its
  reason for holding a translucent ink inside the shadow. DDR-025 takes its ink back to the design's
  10% black, because the hairlines the 22% was measured against no longer exist.
* **DDR-025** keeps everything but one bullet: DDR-033 takes its ruling that the contents links keep
  their underline. Every other link still has one. DDR-035 amends it too: five hover and underline
  colours join the palette, and its four failing pairings become six. DDR-036 adopts the ringed
  timeline dot it kept as structure, and withdraws its claim that the design has no experience
  spine, which misread the file.
* **DDR-031** keeps everything but its links' underline, which DDR-033 takes, per #113, and its
  declined scroll-triggered edge, which DDR-034 adopts, per #114, with its hairline row and its
  shadow row.

`Superseded` are DDR-001 to DDR-009, DDR-012, and DDR-016:

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
| DDR-012    | DDR-025 | The design's palette entire: three inks below the body's, a new accent, three hairlines, and four pairings that fail WCAG |

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
produce rather than the repository's. **#89 to #97 are the rewritten epic's first nine to land**,
as DDR-021 to DDR-029.

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
* **Line heights did not move on #90**, and DDR-022 left the difference as an open item. **#118
  closed it, as DDR-038**, below.
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

* **There are seven files and, since #96, all seven are loaded**, listed above under Fonts. Lora
  Regular was derived, inspected and committed here for the footer #96 adds, and left out of
  `app/layout.tsx` until then because `next/font` preloads everything it is given.
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

**#93 has landed, as DDR-025: the page's colours are the design's, and four pairings now fail
WCAG.** It supersedes DDR-012 and amends DDR-019's marker and DDR-020's shadow ink. This is the
story on Epic #70 with a real cost to real readers, and the record says so rather than absorbing it;
`app/tokens.test.ts` holds every pairing to its measured ratio rather than to a floor, and holds the
four failures **by name**, so a fifth cannot join them quietly and none of the four can be quietly
improved without the record moving with it.

Twenty-two colour tokens where DDR-012 had eighteen. What moved:

| Role                                                 | Was                   | Now                       |
| ---------------------------------------------------- | --------------------- | ------------------------- |
| The accent                                           | `#4338ca` (7.38:1)    | `#4f46e5` (5.87:1, AA)    |
| A company, an institution, a thesis, a contents link | `#475569` (7.07:1)    | `--color-text-muted`, `#64748b` (**4.44:1, fails 1.4.3**) |
| The location, a role's place, the footer             | `#475569` (7.07:1)    | `--color-text-faint`, `#94a3b8` (**2.39:1, fails 1.4.3**) |
| A technology tag's ink                               | `var(--color-accent)` | `#4338ca`, written out    |
| The rule beside a section heading                    | `--color-decoration`  | `--color-rule`, `#cbd5e1` (1.39:1) |
| A card's edge; from #94 and #96 a divider and the footer's border | `--color-decoration` | `--color-border`, `#e2e8f0` (1.15:1) |
| A contact pill's border; the timeline's spine and dots | `--color-text-secondary` / `--color-decoration` | `--color-border-accent`, `#c7d2fe` (**1.49:1 on the pill, fails 1.4.11**) |
| A role's bullet marker                               | `#6366f1` (4.17:1)    | `#a5b4fc` (**1.86:1, fails 1.4.11**) |
| The raised shadow's ink                              | 22% black             | 10% black, the design's   |

`--color-surface`, `--color-surface-card`, `--color-text-heading`, `--color-text`,
`--color-text-secondary`, the four tinted surfaces and their inks are untouched: the design and
DDR-012 already agreed on them. `--color-decoration` is gone.

Six things about it are worth knowing before touching colour anywhere.

* **There is no longer a border colour that carries meaning, and that is why `--color-decoration` is
  gone.** DDR-012 kept a control's edge at `--color-text-secondary` and named the hairline
  `decoration` "so that reaching for it for a control's edge is a visible mistake rather than an
  easy one". The design draws the contact pill's border in an indigo tint at 1.49:1, so the rule has
  nothing left to guard and the three hairlines are named for what they draw. **What identifies a
  contact pill now is its icon, its shape and its fill** — the design puts each pill on white, and
  `introduction.module.css` now does too, which is both the design's and the surface the 1.49:1 is
  measured on.
* **The tag's ink is the one place `#4338ca` survives.** The design sets a technology tag in it and
  everything else in `#4f46e5`, so `--color-text-tag` stops being a reference to the accent and is
  written out. The test holds the two apart.
* **Three inks below the body's, and which module carries which.** `metadata-line.module.css` has
  the muted ink, because a company and an institution are its commonest users. The two that are
  fainter override it on rules that already existed: `.location` in the introduction, and `.dates p`
  in the timeline, which DDR-022 added there for the size. The date range above the place is in the
  accent at a specificity neither can reach.
* **The contents links kept their underline**, which the design does not draw, on the ground that at
  4.44:1 the colour is the last thing that should have to say a link is a link. **DDR-033 has since
  dropped it**, per #113.
* **Print is unchanged in mechanism and the markers still print.** Three hairline tokens drop at the
  token layer where one did; no component writes a print rule of its own; `--color-marker` is
  deliberately not in that block. Verified in the browser under print emulation: every hairline
  transparent, every shadow `none`, the marker still `#a5b4fc`, no ink touched. **The sheet itself
  was not measured on this story** — the count, the breaks and what comes back out of a PDF are
  #99's.
* **Four measured values are not in the issue's table**, because DDR-012 folded them into one token
  and the design does not: a card's edge is `#e2e8f0` (node 2:654), the timeline's spine is
  `#c7d2fe` (node 2:576), a contact pill sits on white (node 2:51), and a tag's ink is `#4338ca`
  (node 2:296). Three differences found on this story are **structure rather than colour and stay**:
  the design's timeline dot is a `#4f46e5` core in a `#c7d2fe` ring on the page's own surface
  (node 2:637) where the page draws one disc; the design draws **no spine at all** in the experience
  section (node 2:99 is empty) where the page draws it in both — **both since settled by #116**, as
  DDR-036: the dot is now the design's, and the "no spine" reading was wrong, because the spine is
  its own node, 2:89; and the contents bar's border is
  transparent in the design (node 2:6), not the `#e2e8f0` the issue gives it — the bar is #98's.

Measured on the built page at 1536px and 320px: every value above matches the design node for node,
the focus outline is the accent at 5.87:1 on the page, and nothing overflows at 320px. No geometry
changed, so no layout was disturbed — the pill's border is still 1px and a fill takes no space.

**#94 has landed, as DDR-026: a hairline opens every section**, which DDR-010 rejected in a
sentence. Three declarations in `components/section.module.css` and nothing else: the divider is a
`border-block-start` on `.section` in `--color-border`, and the section step is **split in half
around it** — `margin-block-start: var(--space-item)` above, `padding-block-start: var(--space-item)`
below — because `--space-section` is exactly twice `--space-item`. So the distance between two
sections is the distance DDR-013 already set, and the line falls midway, which is the design's own
56px and 56px.

Four things about it are worth knowing before touching a section boundary.

* **It is a border on the section, not an element between two of them.** The design draws five
  lines, one at the top of each section and none below the last (nodes 2:81, 2:271, 2:458, 2:568,
  2:646), so it belongs to the section it opens. `section.tsx` renders nothing new, and an `<hr>`
  was turned down for the reason #72 turned one down: it is a thematic break in the accessibility
  tree, announced immediately before a landmark named by the heading that follows it.
* **DDR-010 was not wrong on its own terms, and the measurement that settles it is #72's.** Its
  objection was that two rules doing one job is clutter. The heading rule grows from a basis of zero
  and yields entirely to a title that needs the whole line, so at 320px "Education and
  certifications" has a **0px** rule while its divider is the full 272.8px column — at that width
  the heading rule marks nothing. The two are also different lines: the divider closes the section
  above across the column at 1.15:1, the rule opens the one below from the title outward at 1.39:1.
* **Paper draws no divider and needs no print rule.** `--color-border` is transparent in the print
  block, per DDR-015, so the hairline goes the way the heading rule and the spine already go, and
  the space stays. That is also why it can never be stranded at the foot of a sheet: it is not
  drawn there at all.
* **The spacing is now stated in two places.** `app/globals.css` names `--space-section` and
  `section.module.css` splits it, so the distance between two sections is two halves rather than one
  value. Both halves are held to `--space-item` by `components/section.test.tsx`.

Printed to A4 in Edge 153 and Firefox 156 with background graphics on, and printed again from the
tree this branched from: **five sheets in both browsers either way**, every section heading on the
same sheet before and after and each followed by its first item, all 13 articles whole on one sheet,
no replacement character through pypdf or pdfium, and **no horizontal run of ink wider than 55% of
any sheet** — the check that would find a divider that printed. On screen at 1536px and 320px: 32px,
a 1px `#e2e8f0` line the full width of the column, 32px, on all five sections, and nothing overflows
at 320px. One behaviour moved: a contents link now lands on the divider rather than on the heading,
because the offset is measured from a box that now begins a step higher. DDR-026 records it and
leaves the value to #98, which replaces the contents row with the design's sticky bar.

**#95 has landed, as DDR-027: a target is the size the design draws it, and the page has no minimum
at all.** `--target-size-min` is gone, with the six declarations that read it. The three contact
pills and the CV control keep their 8px and 16px padding and lose their minimum, which is 37.1px —
the design's own 37.1px. A contents link and a project's labelled links take the line their label
sets in, 19.5px, against the design's 20px and 19.5px. DDR-027 supersedes DDR-014's 44 by 44 pixel
minimum and DDR-004's before it, and amends DDR-010 twice.

Five things about it are worth knowing before touching a target anywhere.

* **44 by 44 was never the AA criterion the records cited.** It is WCAG 2.5.5, Level **AAA**. Level
  AA asks 24 by 24, at 2.5.8, and that has an exception for undersized targets far enough apart. So
  the page kept an AAA criterion for four stories and gives it up here; DDR-027 has the table of
  **every** target on the page, one line each, and every one of the eleven meets 2.5.8 — the four
  controls outright, the seven links by the spacing exception — while none meets 2.5.5.
* **The minimum was measured against the content box**, since nothing on the site sets `border-box`,
  so a "44px" contact pill was **61.6px**. DDR-010's three undersized targets were not corrected to
  44px, they were corrected past it. That is why the page is 219px shorter at 320px, 360px and
  390px, and why at 390 by 844 the four controls now end 841px down — above the fold of a phone,
  where they ended 939px down and below it.
* **Both wrapping rows gained `row-gap: var(--space-small)`**, in `contents.module.css` and
  `projects.module.css`. It is the one measure here the design does not supply, because its frame is
  894px wide and neither row wraps in it. It is also not a precaution: measured with the gap off,
  the contents row **fails 2.5.8 at every viewport from 420px to 490px**, where "Education and
  certifications" wraps directly under "Experience" and two circles come within 22.5px of 24px.
* **A link stays `display: inline-flex`** in both, which is the one thing that is not simply
  removing a minimum. An inline box's hit area is the font's content area, about 17px here; a flex
  container's is the whole line box, 19.5px. So the flex container is both nearer the design and
  2.5px more target, for a declaration that was already there.
* **Paper did not move at all.** The projects' print block drops the row gap — screen-only sizing,
  which DDR-015 lets a component drop, and not free, since the address printed after each link wraps
  that row on every sheet and the gap would have cost the printed CV 16px. Measured under print
  emulation against the tree this branched from, every box on the sheet is identical to the pixel,
  so #99's recheck is unaffected by this story.

**#96 has landed, as DDR-028: the page has the design's footer**, which DDR-010 rejected in a
sentence. `components/footer.tsx` renders a `footer` after `main` — the owner's name on the left,
the three contact addresses on the right, above a hairline in `--color-border` — and `app/page.tsx`
now returns a fragment so the footer can sit outside the main landmark. It adds no token, no content
module and no string: the introduction's own `name` and `contact` records are handed to it, per
ADR-002, so the addresses are stated once and shown twice.

Six things about it are worth knowing before touching it.

* **It prints, where `nav` does not, and that is the whole point of the story.** DDR-010 calls the
  full address on each contact pill "not negotiable" because labelling the pills would leave the
  printed CV with no email address; the footer is the only other place the addresses appear, so it
  is what makes #97 possible. `.link::after { content: none }` keeps `app/globals.css` from printing
  each address again after itself, which is the same rule the introduction's pills write. **#97 has
  landed**, so each address is now on the sheet once, from here, where it was on it twice.
* **The hairline does not print and the stylesheet writes no rule for it.** `--color-border` is
  transparent in the print block, per DDR-015, so the footer's line goes the way the section divider
  and the timeline's spine already go.
* **Two of the design's values are off the site's scales and the nearest step was taken.** The
  design sets the footer at 12px, and DDR-022's ten steps have no 12px — inserting one between 11px
  and 12.8px would rename every step below `x-small`, so the footer takes `xx-small`, 12.8px. The
  design holds the addresses 20px apart, which is on no step of DDR-013's doubling scale, so they
  take `--space-medium`, 16px. DDR-028 has both arguments.
* **The links are not underlined**, which is the design's and is the one thing about the footer that
  needed deciding, because DDR-012 makes the underline what identifies a link and the addresses are
  the *same ink* as the name beside them. DDR-028 records what identifies them instead — each is an
  address, and each repeats a pill the introduction has already identified — and records that
  DDR-025 went the other way for the contents links. It is one declaration away from reversal.
* **The space above the hairline is the page's 64px, not the design's 16px.** `main` ends with
  `--page-padding-block` and the footer follows it; closing the gap means making the page's bottom
  padding asymmetric, which is DDR-013's and DDR-014's and guarded by `app/globals.test.ts`. DDR-028
  records it as an open item for #99 rather than taking a page-level decision inside a footer story.
  On paper it does not arise: the page padding is 0 there, so the footer's own 24pt is the space.
* **`overflow-wrap: anywhere` on the link is not decoration.** A flex container is never laid out
  narrower than its content's min-content width and `break-word` does not enter that calculation;
  without it the GitHub address is 320px in a 273px column at 320px with text at 200%, and the page
  scrolls sideways.

Printed to A4 in Edge 153 and Firefox 156 with background graphics on, and printed again from the
tree this branched from: **five sheets in both browsers either way**, every section heading on the
same sheet before and after and each followed by its first item, no item split, and no horizontal
run of ink wider than 3% of any sheet — the check that would find a printed hairline. All three
addresses come back out of both PDFs through pypdf and pdfium, once each, with no `mailto:` and no
replacement character; the six words the two readers miss are the six they missed before this
change. On screen, swept every 10px from 300px to 900px at both text sizes, no pair of targets fails
WCAG 2.5.8 — the closest two footer addresses come is 27.2px centre to centre — and nothing
overflows at any width from 300px to 1536px.

**#97 has landed, as DDR-029: the three contact pills read "Email", "LinkedIn" and "GitHub"**, which
DDR-010 called "not negotiable" and DDR-006 set before it. It adds no token, no component and no
declaration: `ContactLink` gains a `label` beside its `text`, `content/introduction.ts` carries the
three words, and `components/introduction.tsx` renders the label where it rendered the address. The
pill's box, border, fill, radius, shadow, ink and 13px are untouched.

Five things about it are worth knowing before touching a contact anywhere.

* **`label` is what the pill shows and `text` is the address, which only the footer shows.** Both
  are stated once, so the two places cannot disagree about where a contact leads, per ADR-002.
  `app/page.test.tsx` holds each address to **exactly one** appearance on the page, so a second copy
  of one fails the suite.
* **The footer is now load-bearing rather than a repetition.** DDR-010's objection to the label was
  never about the label: it was that the draft suppresses the printed address after a `mailto:` link
  and leaves the printed CV with no way to reach the owner. #96 answered that, and this story is the
  one place on Epic #70 where the design is free — because another story paid for it. Removing the
  footer, hiding it, or stopping it printing now costs the printed CV its contact details.
* **`.contact::after { content: none }` is the declaration DDR-006 already wrote, kept for a new
  reason.** Before, it stopped an address being printed twice; now it stops
  `(mailto:aortegablasi@gmail.com)` being printed after "Email". Only the comment changed.
* **The introduction is 91px shorter at every phone width.** The controls row is 83px where it was
  174px at 320px, 360px and 390px, because four pills now fit on two rows where they took four; at
  200% text it is 340px where it was 457px. At 390 by 844 the controls end 751.3px down, where they
  ended 842.3px down, and the contents row now begins at 783.3px — above the fold, where it began at
  874.3px and was not on the screen at all.
* **`overflow-wrap: anywhere` on the pill no longer breaks anything**, since the widest of the four
  is now "Get my CV". It is kept, and the comment says so; it is the footer that still needs the
  same declaration to hold the GitHub address inside a 273px column at 200% text.

Printed to A4 in Edge 153 and Firefox 156 with background graphics on, and printed again from the
tree this branched from: **five sheets in both browsers either way**. `mailto` appears nowhere on
any sheet; each of the three addresses comes back **once**, from the footer, where it came back
twice; "Email" and "LinkedIn" are on the sheet as words where they were not; no replacement
character and the apostrophe still U+2019 — all four readings agreeing, pypdf and pdfium in both
browsers. Of the 479 distinct words the page shows in print, Edge gives back every one and Firefox
all but five: the two wrapped at a hyphen and the three level badges pypdf spells out, which are the
same five missing from the same PDFs before this change. On screen, swept every 10px from 300px to
900px at both text sizes, no pair of targets fails WCAG 2.5.8 — the pills are 87 by 37.5 at their
smallest and clear 24 by 24 outright, as they did at 203.2 by 37.5 — and nothing overflows at 320px,
360px, 390px or 1536px at either text size.

**The weight gap #97 found is closed by #109**, below.

**#109 has landed, as DDR-030: the pill controls and the technology tags are set in medium.** Two
declarations and no token. `introduction.module.css` moves `font-weight: var(--font-weight-medium)`
out of `.cv` and into the `.contact, .cv` rule the two kinds of pill share, so all four controls are
one weight and neither kind writes its own; `projects.module.css` adds the same to `.tag`.

Three things about it are worth knowing before touching a weight.

* **DDR-023's medium row was wrong in both directions and DDR-030 corrects it.** It named the
  contents links and the technology tags, neither of which had ever been given the weight, and left
  out the CV control, which has carried it since #48. Nothing here was a new decision: the design
  and DDR-023 already agreed, and the declaration was missing.
* **The contents links are still at 400, deliberately.** The design draws them medium at node 2:10,
  and #98 replaces `contents.module.css` with the design's sticky bar, so the weight goes with that
  story rather than into a file it rewrites. DDR-030 names it so it is not forgotten.
* **A tag row gains a line at six of the 61 widths swept**, because a tag is about 1–1.5px wider:
  at 360px at the default text size, and at 310, 420, 570, 690 and 710px at 200%. Every other width
  from 300px to 900px is unchanged at both sizes, including 320px, 390px and 1536px, and nothing but
  a tag row moves — no paragraph, heading or list item reflows anywhere. The pills grow by under
  2px each and the controls row does not change height at any width.

Printed to A4 in Edge 153 and Firefox 156 with background graphics on, and printed again from the
tree this branched from: **five sheets in both browsers either way**, and every reading identical
through pypdf and pdfium both. No new word splits, which is the check this change needed most:
DDR-018 blamed a weight above 400 for a split word, DDR-024 showed tracking was the cause, and a tag
is the only tracked text this touches — at +0.025em, well below the +0.1em where the badge splits.
Swept every 10px from 300px to 900px at both text sizes, no pair of targets fails WCAG 2.5.8.

**#98 has landed, as DDR-031: the contents are the design's bar, pinned to the top of the window.**
`components/contents.tsx` renders the `nav` **before `main`**, so `app/page.tsx` now returns the bar,
`main` and the footer. The bar is `position: sticky` over `--color-surface-bar`, which is the page's
off-white at 96%, with a `--contents-bar-blur` backdrop blur and a `--color-border` hairline. Its
links sit in the page's own column, in medium, at least `--contents-bar-height` (48px) tall. #98
declined the design's scroll-triggered shadow, and **#114 has since adopted it**, below.

Five things about it are worth knowing before touching it.

* **Each link's word lives in its section's content module**, as `link`, beside `title`. The fourth
  reads "Education" while its heading reads "Education and certifications", and the section still
  takes its accessible name from its `h2`. The CV digest moved for this; no ADR-005 fact did.
* **The clearance is the root's `scroll-padding-block-start`, not a section's `scroll-margin`.**
  `--contents-bar-clearance` is the bar's height plus the flow step, and on the root it covers
  keyboard focus as well as the contents links, which is WCAG 2.4.11. A section now writes no scroll
  margin, because the two would add up.
* **The column gap is 16px below the wide breakpoint and 32px from it**, where the design has 28px.
  With 32px at 320px and 200% text, the links take four rows, the bar is 229px and headings end up
  behind it. The font size is set on the list rather than on the link, so each row is 19.5px and two
  rows fit the 48px bar. Any new label or section changes the wrapping, so rerun DDR-031's sweep.
* **The links are not underlined**, since #113, per DDR-033, which supersedes DDR-025's ruling that
  kept the underline. What identifies one is its place in the bar, its medium weight and its focus
  outline, which is 5.42:1 on the bar's worst blend. Their ink is 4.44:1 on the page and as low as
  4.10:1 on the bar, both failing 1.4.3. It is one declaration, `text-decoration-line: none` on
  `.link`, and `contents.test.tsx` holds it there and nowhere else.
* **`z-index: 1` is the site's only z-index.** Without it, the photo's positioned inner shadow would
  paint over the bar.

Measured every 10px from 300px to 900px and at 1280px and 1536px, at both text sizes: nothing
scrolls sideways, no pair of targets fails 2.5.8, and no focused element is ever wholly behind the
bar. Every heading the contents reach clears the bar from 320px up. At 300px and 310px with 200%
text it does not, which is below DDR-014's floor and recorded as a risk. Print is untouched in
mechanism, because `nav` is hidden, and the sheet was not printed to PDF on this story; #99 printed it
after, under DDR-032.

**#114 has landed, as DDR-034 and ADR-007: the contents bar draws its edge only once the page has
scrolled.** At rest its 1px hairline is transparent and it has no shadow; past 60px of scroll
`ContentsBar` marks the `nav` with `data-scrolled`, and it takes a `--color-rule` hairline and
`--shadow-bar` over `--contents-bar-transition`, 200ms. The hairline is **one step darker than the
design's** `#e2e8f0`, which the owner asked for on the story; it is the only value on Epic #70 the
owner chose over the design's.

Four things about it are worth knowing before touching it.

* **`components/contents-bar.tsx` is the site's only Client Component**, per ADR-007. It renders the
  `nav` and reads `window.scrollY` through `useSyncExternalStore` with a passive listener, and knows
  nothing else. `Contents` stays a Server Component and hands it the list as `children`. Its two
  functions are tested in Node against a stubbed `window`, so there is still no DOM environment.
* **Only the hairline's colour changes, never its width**, so the bar is 49px in both states and
  nothing below it moves. The transition is written inside `prefers-reduced-motion: no-preference`.
* **With script off, `@media (scripting: none)` keeps the hairline drawn all the time.** Before
  hydration, or if script fails, the bar is at rest, which is what the static HTML renders.
* **Check it against a server that sends `charset=utf-8`.** Python's `http.server` sends JavaScript
  without one, Firefox then decodes the chunks wrongly and never hydrates, and the bar never gains
  its edge. GitHub Pages sends the charset. This is a local artefact, not a fault in the site.

**#115 has landed, as DDR-035: every link and control answers the pointer.** A contact pill takes
`--color-surface-hover` and `--color-border-accent-hover`, the CV control darkens to
`--color-accent-hover`, the contents links and the footer's addresses take the accent, and a project
link darkens and its underline strengthens. Its resting underline is the design's pale
`--color-underline`, `--underline-offset` below the text.

Four things about it are worth knowing before touching a link.

* **Every hover rule is written `:hover, :focus-visible`**, so keyboard focus draws everything the
  pointer does and the outline besides. Only colours change; no box moves.
* **The transition is written once**, on `a` in `app/globals.css`, over `--hover-transition` (150ms)
  inside `prefers-reduced-motion: no-preference`. A new link inherits it but needs its own hover rule.
* **Two more pairings fail WCAG 1.4.11**: the pill's hover border at 1.78:1 and the project link's
  resting underline at 1.86:1. `app/tokens.test.ts` holds six failures by name now.
* **Paper is unchanged.** The hover fill and border drop at the token layer, and the projects' print
  block puts the underline back in the link's own ink with the browser's offset.

**#116 has landed, as DDR-036: each timeline entry is marked by the design's ringed dot, on one
continuous line.** A 12px circle in the page's surface, ringed by 3px of `--color-border-accent`,
with a 6px `--color-accent` core drawn by `.dot::before`. Three tokens join the timeline's:
`--timeline-dot-core`, `--timeline-dot-ring` and `--timeline-dot-offset`.

Three things about it are worth knowing before touching it.

* **The offset is arithmetic on the title, not a number.** `--timeline-dot-offset` is half of what
  an item title's line — `--font-size-item-title` times `--line-height-heading` — leaves once the
  dot and its ring are taken out, so the dot stays level with the title's first line as text grows.
  It is 0 at the default size. Changing either of those tokens, as #118 may, moves the dot with it.
* **The line ends at the last dot**, as #116 and DDR-010 ask, where node 2:89 carries it on to the
  foot of the last row. DDR-036 records it as the one place the page stays short of the file.
* **The core prints; the ring, the line and the surface inside the ring do not**, all at the token
  layer. Each printed entry keeps a 6px accent dot beside its title.

**#117 has landed, as DDR-037: a level's badge stands above its skills.** The skills are wrapped
in one `span` that `skills.module.css` sets `display: block`, so they start flush with the group's
edge; the badge stays `inline-block` and first in the same paragraph, so the reading order does not
move. The name and each level are `--space-flow` apart, where they were `--space-small`, and the
badge is `--space-small` above its skills, the nearest step to the design's 6px. The design's 40px
between two rows of groups is left to #119, which owns the spacing scale. **The printed CV is six
sheets in both browsers since this story**: the skills section grows by 177.5px on paper and the
footer — the only place the printed CV carries an address — now stands alone on sheet 6. Every
section heading and every skill group is on the sheet it was on before.

**#118 has landed, as DDR-038: running text is set with the design's leading.** Two tokens join
DDR-011's two: `--line-height-prose`, 1.72, on the summary, a role's points and a project's
description, and `--line-height-prose-small`, 1.65, on a level's skills and a thesis. Two is the
fewest that keep every block within half a pixel a line of the file, and `app/tokens.test.ts`
computes that from the tokens. Short lines stay at 1.5 and headings at 1.2.

Three things about it are worth knowing before touching leading.

* **Paper keeps 1.5**, by setting both prose tokens to `var(--line-height-body)` in the print block.
  The owner chose it on #118. With the screen's leading the CV printed seven sheets, sheet 1 held
  only the introduction, and Edge and Firefox broke in different places again. As shipped, every
  sheet is pixel-identical to the tree before, in both browsers, with background graphics on and
  off. Removing the override looks harmless and costs a sheet.
* **The summary is a class**, `.summary`, on both of its paragraphs, because the positioning line
  and the location are paragraphs in the same column and are short lines. The skills' leading is on
  `.skills`, not on `.level`, so the badge's line stays at 1.5.
* **The page is longer on every screen**: 180px at the design's 894px, 307px at 390px, and 1706px at
  320px with 200% text. Nothing scrolls sideways at any width or text size checked, and the name
  beside the photo (#68) behaves exactly as before in every case, since no heading, photo or float
  changed.

**#119 has landed, as DDR-039: sections, headings and entries are spaced as the design spaces
them.** Five rhythm tokens are the design's own values, measured off the file at 894px, times
`--rhythm-scale`: `--space-boundary` 56px on each side of a section's divider, `--space-heading`
40px from a heading to its first item, `--space-item` 40px between projects and skill groups,
`--space-role` 44px and `--space-credential` 36px. `--space-section` is two boundaries. The owner
chose the design's values over the nearest steps of DDR-013's scale, which is unchanged.

Three things about it are worth knowing before touching space.

* **The factor is 0.75 below the wide breakpoint and 1 from it**, so a phone gets three quarters of
  every space and the design's proportions between them. It is the one token the wide breakpoint
  redefines, in `app/tokens.css`.
* **`TimelineRow` takes a `kind`**, `role` or `credential`, because the design spaces the two
  timelines differently. It is the only thing the row knows about what it holds.
* **Paper keeps the old steps**, by setting the five tokens back in the print block. The owner chose
  it on #119. The narrow factor keeps six sheets but moves Languages onto the footer's sheet, and
  the design's values cost a seventh. As shipped, every sheet is pixel-identical to the tree before
  in both browsers, with background graphics on and off.

At 894px every space matches the design to the pixel, and the page is 4769px against the design's
4787px; the rest is the introduction and the footer, which are #120's. The page is 452px longer at
894px, 147px at 390px and 294px at 320px with 200% text. Nothing scrolls sideways at 320px, 360px,
390px, 768px, 894px or 1536px at either text size. The skill groups' column gap, 32px against the
design's 64px, is not in #119 and is left open.

**#72 has landed: each section's `h2` carries its rule**, drawn by `section.module.css` as a
pseudo-element on the heading rather than an element in `section.tsx`, so it is never in the
accessibility tree and cannot reach the accessible name the section takes from its heading. It is a
border in `--color-rule`, since #93 — `--color-decoration` before it — so paper drops it at the
token layer with no print rule of its own.
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
`NEXT.JS` is not one. The accent adds no pairing — DDR-012 already measured it at 7.38:1 on the page, and DDR-025 measures its successor at 5.87:1
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
* **`--color-marker` was `#6366f1` and is the design's `#a5b4fc` since #93.** DDR-019 measured the
  design's value at 1.86:1 — fainter than the hairlines DDR-012 called the lightest that read at all
  — and took the lightest of the ramp that clears the 3:1 WCAG asks of meaningful non-text, at
  4.17:1; the owner chose it on #76 over reusing `--color-accent`. **DDR-025 reverses that**, and
  records the marker as failing WCAG 1.4.11.
* **It is deliberately not a hairline.** DDR-015 makes every hairline transparent at the token
  layer, so a marker drawn in one would leave the printed CV with no markers at all, where it has
  them today. That is the whole reason the palette gains a colour rather than reusing one, and it is
  why `--color-marker` is absent from the print block that drops every surface — which DDR-025 does
  not change, so the marker still prints.

**#77 has landed, as DDR-020: the site has one elevation.** One token, `--shadow-raised`, and one declaration each in `introduction.module.css` and
`languages.module.css`, so exactly eight elements are raised off the page: the three contact pills,
the CV control and the four language cards. Nothing else on the page is, and depth is otherwise
still a tint, a hairline and a radius.

Three things about it are worth knowing before touching it.

* **The ink was 22% black and is the design's 10% since #93.** The geometry is the design's and
  always was. DDR-020 darkened the ink because at 10% the darkest row the shadow draws is 1.50:1
  against the page, fainter than the hairlines DDR-012 called the lightest that read at all, where
  at 22% it is 2.45:1 in Chromium and 2.47:1 in Gecko. Its floor was the hairlines' 2.39:1 rather
  than WCAG's 3:1, because a shadow carries nothing; DDR-020 has the ramp and the argument.
  **DDR-025 reverses that**, because its three hairlines are all fainter than 1.50:1, so the floor
  the darkening cleared no longer exists.
* **The ink is deliberately not in the palette.** Every colour token is an opaque hex, and this one
  is translucent black, which is wrong on text, on a border and on a surface. It lives inside
  `--shadow-raised` rather than beside the colours, and `app/tokens.test.ts` holds every ink opaque.
  Since DDR-031 the palette has one translucent colour, and it is a surface, not an ink: the
  contents bar's `--color-surface-bar`.
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

Those rechecks, and #71's and #89's after them, all found four sheets in Edge and five in Firefox,
and put the difference down to Firefox setting the summary one line longer. **#99 found the real
cause, and it is gone**, below.

**#99 has landed, as DDR-032: the printed CV is five sheets in both browsers, broken in the same
places.** It is the Epic's closing print check. One declaration changed: the rule in
`app/globals.css` that prints a link's address after it now also writes `overflow-wrap: anywhere`.

Four things about it are worth knowing before touching print.

* **An unbreakable address made Edge shrink the whole sheet.** A URL contains no space, so it is one
  word, and a grid column cannot be narrower than its longest word. The Digital Twin project's
  repository address took its text column to 713px on a sheet with 642.5px of room, and Chromium
  then scaled everything to fit, to about 0.90. Body text printed at 10.16pt rather than 11.25pt and
  the photo at 25.34mm rather than 28mm. That is the 0.877 #89 noticed, and it is why Edge printed
  four sheets: a smaller sheet holds more. Firefox breaks the address at its slashes on its own and
  prints pixel-identically with and without the change. **A new long address or a new grid
  column is the thing to recheck**, by measuring `scrollWidth` at 643px under print media in Edge.
* **The base stays at 12pt.** Priced in both browsers: 11pt still prints five sheets, and 12.8pt,
  which would put the smallest label at 8pt, prints seven. Body text prints at 11.25pt and a level
  badge at 7.5pt.
* **Background graphics change the inks, and nothing else.** Every surface, hairline and light is
  dropped at the token layer, so layout and text are identical either way; but with background
  graphics off both browsers darken the pale inks themselves — the muted and faint text, and the
  footer. That is their economy mode and is left alone; `print-color-adjust: exact` would force the
  2.39:1 grey onto every sheet.
* **Sheet 5 is close to full.** It carries the second row of skill groups, education, languages and
  the footer, so a longer credential or a new project can make the CV six sheets.

Printed to A4 through WebDriver in Edge 153 and Firefox 156, background graphics on and off, and read
back through pypdf and pdfium: five sheets in all four, the section headings on sheets 1, 3, 4, 5
and 5 in both browsers, each with its first item; none of the 18 blocks the page itself names — 13
articles, four skill groups and the row of language cards — split across two sheets; each address
once, from the footer, and no `mailto`; no replacement character; five apostrophes, all U+2019; and
the markers drawn on both sheets that carry points. All 479 words the page shows on paper come back
from all eight readings as letters. As whole words pypdf misses five, each explained: `Copilot-driven`
and `data-driven`, wrapped at the hyphen, in both browsers; and the three level badges, which it
spells out from Firefox, as DDR-024 recorded. "Get" is no longer counted, because print hides it.
**The footer's 64px above its hairline, which DDR-028 left to #99, is still open**: #99 excludes any
change to what the page shows, so it needs a story of its own.

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
