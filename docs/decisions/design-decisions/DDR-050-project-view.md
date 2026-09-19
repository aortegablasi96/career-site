# DDR-050-Project View

Status: Accepted

Date: 2026-09-19

**Amends DDR-010's page structure in one respect**: the career page is no longer the site's only
page. Each project has a view of its own, per ADR-010, which follows. DDR-010's projects section is
unchanged by this record; the cards that will lead to each view are #154's.

**Amends DDR-043 in one respect**: its scope. DDR-043 opens a new tab from the LinkedIn and GitHub
pills and "nothing else". A project view's "Source code" and "Live site" controls now open one too,
announced as DDR-044 announces the pills'. The project links on the page, the footer's addresses and
the CV control still open in the same tab.

**Amends DDR-022 in one respect**: a size that is not a step. A project view's title is the design's
41.6px, `--font-size-project-title`, a role written in rem between the scale's `xx-large` and
`xxx-large`. The ten steps are unchanged.

**Amends DDR-014 in one respect**: the narrow breakpoint adapts a fourth role token,
`--font-size-project-title-narrow`, as it adapts the page and section titles.

DDR-031 to DDR-049's contents bar and DDR-028's footer are unchanged, and a view uses both as they
are.

## Context

Epic #152 gives each project a view of its own. Issue #153 is its first story: the view's address,
its way back, and its introduction — the name, the full description, every technology, the links,
and the lead picture with a caption. The gallery is #155, the link to the next project #156, and the
cards on the page that lead here #154.

The design is the Figma layer `career-site-project` (node 59:2), drawn at one width: a 1195px frame
whose view is a 1100px box with 48px of padding. It draws its own contents bar, with the title
alone, and its own footer; the epic adopts neither as drawn.

The story leaves four things to decide, and the owner decided three of them on #153:

* **How the contents bar treats its links on a view.** The design draws the title alone. The owner
  chose the site's own bar, with every link.
* **Where the two controls open.** The owner chose a new tab, announced as the profile pills'.
* **The lead media's shape.** The design draws a 16:10 box and the four pictures are 4:3. The owner
  chose the design's shape, cropped.
* **How the two columns arrange on a phone**, which the design does not draw. That is decided here.

The owner also approved the four captions, which are new copy.

## Decision

**A project's view is the site's contents bar, then the view in the page's column, then the site's
footer. The view is a way back, then two columns from the wide breakpoint: the project's name, its
description, "Built with" and every technology, and its links on the left; its lead picture with a
caption on the right. Below the breakpoint the two are one column in the same order.**

### Structure and semantics

* **The name is the view's only `h1`**, and "Built with" is an `h2` above the technologies, so the
  outline is the project and what it is built with. #155 adds the gallery's the same way.
* **The view is one `article`** inside `main`, so the base styles inset it to the page's column as
  they inset the introduction and every section. The bar comes before `main` and the footer after,
  exactly as on the page, so a view has the same three landmarks.
* **The picture and its caption are a `figure`**. The caption names the picture in a few words; the
  alternative text still describes it in full.
* **Every string is content**: the project's record, now with a `slug` and a `caption`, and the
  view's own words in `projects.view` — "Back to portfolio", "Built with", the new-tab phrase, which
  is the introduction's own, and the title the tab shows.

### The contents bar on a view

* **The site's bar, unchanged in look**: the title, Home and the five section links. Each leads back
  to the page — Home to its top, a section's link to that section — so the bar is a way into every
  part of the site from a view.
* **Nothing is marked.** The reader is in none of the page's sections, and marking Home would claim
  they were at the top of the page.
* **Nothing glides.** DDR-041's glide is for a scroll within the page; from a view, the link loads
  the page.
* **The design draws the title alone.** This is the one place the view departs from its layer by
  the owner's choice rather than by a measure.

### The way back

* **"Back to portfolio", after a chevron**, in the contents links' muted ink and medium weight at
  13px, with no underline, as the design draws it (node 59:13). It takes the accent under the
  pointer and on focus, as a contents link does, per DDR-035. The chevron is 16px, a step above the
  label.
* **It leads to the projects section, not the top of the page**, and lands the section's divider
  under the bar, as a contents link does.

### The left column

* **A 40 by 6px pill above the name**, running from `--color-border-accent` into a new
  `--color-rule-accent-end`, `#ddd6fe`, 24px above the name (node 59:21). It is drawn on the `h1` as
  a pseudo-element, as a section's rule is drawn on its `h2`, so it is never in the accessibility
  tree. It is decoration and takes no contrast pairing.
* **The name is Lora semibold at 41.6px from the wide breakpoint**, the design's, as
  `--font-size-project-title`. Below it, `--font-size-project-title-narrow`: the narrow page title's
  36px from the narrow breakpoint, and 20.8px beneath it. At 320px with text at 200% the 36px step
  broke "Portfolio" in "Stock Portfolio Viewer" mid-word; a step lower sets every title whole at
  every width checked.
* **The description is body text on the prose leading**, 15px on 25.8px, the design's 26.25px
  within half a pixel a line.
* **"Built with" is set as the design's labels are**: 10px bold capitals at `--letter-spacing-x-loose`
  in the faint ink, 32px below the description and 12px above the tags.
* **Every technology is a tag**, the page's tag at the next step up: 12.8px medium on the tag's tint,
  8px apart each way.
* **The links are pills**, 32px below the tags: the repository filled in the accent, as the CV
  control is, and a live site outlined on white in the accent's tint, as the contact pills were
  before DDR-044. Each carries the design's arrow out of a box before its label, drawn in
  `components/icon.tsx` like the download mark. A project with no live site shows only the
  repository.
* **Both open a new tab, with `rel="noopener"`**, and say so in their accessible name: "Source code,
  opens in a new tab". The visible label comes first, per WCAG 2.5.3. The arrow says the link leaves
  the site, and is hidden from assistive technology like every other mark.

### The right column

* **The lead picture is 16:10 at the large radius**, as wide as its column, and cropped to that from
  the centre with `object-fit: cover`. On each of the four 560 by 420 pictures that takes 35px off
  the top and the bottom, which is at most an application's title bar. It is never stretched.
* **The caption is centred below it**, 8px down, 11px in the faint ink (node 59:81).
* **A project whose media is a video shows it the same way**, through the projects' own `Media`.

### Layout and space

* **Two equal columns from the wide breakpoint, 56px apart**, both from the top. Each column's
  minimum is zero, so a picture wider than its column cannot widen it.
* **One column below the breakpoint, in the markup order**: the way back, the name, the description,
  the technologies, the links, then the picture and its caption, 42px below the links. The picture
  follows the text rather than leading it because the design reads that way at its width, per
  DDR-014, and on a phone the name and the way back are what the reader needs first.
* **48px between the bar and the way back**, the design's, as `--space-view-top`, which follows
  DDR-039's rhythm factor. 40px between the way back and the rule, which is `--space-heading`.
  72px from the view's foot to the footer's hairline, which is the page's own
  `--page-padding-block-end`.

### What the view does not do

* **It does not print.** Only the page is the printed CV, per Epic #152. The view has no print rule.
* **It carries no placeholder media.** The design's "Add image" frame is not drawn.

## Differences From the Design

Measured at the design's 1195px against node 59:2:

| Part | Design | View | Why |
| --- | --- | --- | --- |
| Contents bar | The title alone | The site's bar, every link | The owner's choice on #153 |
| Column | 1004px inside a 1100px box | The page's 1100px column | The page's column, so the view lines up with the bar's title |
| Each column | 474px | 522px | Follows from the column |
| Lead picture | 474 × 296.25 | 522 × 326.25 | Follows from the column; same 16:10 |
| Tags | 12px, padding 4 by 10, radius 6 | 12.8px, padding 4 by 8, radius 4 | The nearest steps of DDR-022 and DDR-013, as the page's tags take |
| Gap between the links | 12px | 8px | The introduction's controls' gap |
| "Built with" tracking | 0.12em | 0.1em | DDR-017's `x-loose` |
| Name's leading | 1.1 | 1.2 | The heading leading every `h1` and `h2` takes, per DDR-038 |
| Lead picture | Gradient placeholder | The project's own picture | Placeholders are not shipped, per Epic #152 |

Everything else matches the layer at its width: the way back 48px below the bar, the rule 40px below
the way back, and every space inside the left column. The picture's file is 560px wide and is drawn
at 522px, so it is sharp at 1× and soft on a high-density screen, as DDR-040 records for the photo.
A larger original is the fix.

## Consequences

### Benefits

* Each project has a page with room for its whole description and every technology, at an address
  the owner can send.
* A view is the site's own frame, so a visitor who arrives on one can reach every section of the
  page from the bar.
* The view reuses the page's patterns — the tag, the two pills, the section's rule, the projects'
  media — so it adds two marks and nine tokens, and no new interaction.

### Tradeoffs

* **Three new inks are faint.** "Built with" and the caption are in `--color-text-faint`, 2.39:1 on
  the page, and the way back in `--color-text-muted`, 4.44:1, both failing WCAG 1.4.3 as DDR-025
  records for the same inks on the page.
* **The picture is cropped.** 16% of each 4:3 picture's height is not shown on a view, though it is
  on the page. The alternative text describes the whole picture.
* **A second size off the scale.** `--font-size-project-title` is the one size on the site that is
  not a step, and `--project-view-rule-gap` and `--project-view-label-gap` are two measures that are
  not steps of DDR-013's scale.

### Risks

* **A longer project name** could break mid-word at the narrowest widths with enlarged text. The
  narrow title was measured on every current name at every 10px from 300px to 900px at both text
  sizes; a new name means measuring it again.
* **A view shorter than the window** ends with the footer and then the page's surface below it. No
  view reaches the foot of a 1000px window at 1195px wide. #155's gallery makes every view with
  one taller.

## Alternatives Considered

### The design's bar, the title alone

As `career-site-project` draws it, the title linking to the page. Declined by the owner on #153,
who chose the site's own bar so a view offers the same way around the site as the page.

### The picture at its own 4:3

The whole picture, 18% taller than the design's box. Declined by the owner on #153, who chose the
design's shape.

### Same-tab controls

As the project links on the page open. Declined by the owner on #153: a reader who opens a
repository from a view means to come back to it, which is DDR-043's reason for the profile pills.

### The picture first on a phone

Above the name, as the projects' rows put their media above the name below the wide breakpoint.
Not chosen: on a view the picture is one of several and the name is the page's heading, and the way
back and the name are what a reader arriving from a link needs first.

## References

* GitHub issue #153 and Epic #152
* `career-site-design`, layer `career-site-project`, nodes 59:2, 59:6, 59:12, 59:13, 59:19, 59:21,
  59:54, 59:56, 59:61, 59:71 and 59:81
* ADR-010, the route each view is
* DDR-010, DDR-014, DDR-022 and DDR-043, which this amends
* DDR-017, DDR-020, DDR-025, DDR-027, DDR-030, DDR-031 to DDR-049 and DDR-044
