# DDR-014-Responsive Strategy

Status: Accepted

Date: 2026-09-16

**Amended by DDR-050** in one respect: the narrow breakpoint adapts a fourth role token,
`--font-size-project-title-narrow`, which a project view's title reads below the wide breakpoint.

**Amended by DDR-039** in one respect: the wide breakpoint now redefines one token in
`app/tokens.css`, `--rhythm-scale`, so the vertical rhythm takes the design's values from 48em and
three quarters of them below. Components still write only layout there.

**Amended by DDR-040** in one respect: the narrow breakpoint no longer redefines
`--page-padding-block`. The space above and below the page is a section boundary, which steps down
with DDR-039's rhythm factor at the wide breakpoint instead. The narrow breakpoint now adapts three
role tokens, marked in the table below.

**Superseded in part by DDR-027**, which takes the 44 by 44 pixel minimum target below, and
DDR-004's before it. A target is now the size the design draws it, and `--target-size-min` is gone.
Everything else here stands, including the two breakpoints, the markup order, hover, and the rule
that nothing scrolls horizontally from 320px, which DDR-027 re-measured at every width from 300px to
900px at both text sizes.

Supersedes DDR-004, the responsive strategy. Its mobile-first ordering, its rule that the markup
order is the visual order at every width, its 44 by 44 pixel minimum target, its rule that nothing
depends on hover, and its rule that nothing scrolls horizontally from 320px all carry forward
unchanged. What does not carry forward is its central promise: **one layout at every width**. The
timeline is precisely what breaks it, and a second breakpoint is the cost of the redesign.

## Context

Epic #42 adopts the redesign the owner made in Figma, and the UI Review on #43 is its contract.

DDR-004 gave the site one breakpoint, at 20em, and it adapted nothing but the heading sizes and the
page's edges. Every width got the same single column, so no component could quietly disagree with
another about what a wide screen is. That guarantee was worth something, and it is being given up
knowingly: the owner confirmed it on #43 as one of two calls the review flagged as a genuine loss
rather than a clear win.

The redesign needs a width at which content is placed side by side — the timeline's three columns,
the projects' media and text, two columns of skill groups, four language cards in a row, and the
photo beside the name. That is a second breakpoint, and once one exists the discipline that replaces
DDR-004's guarantee has to be written down and enforced.

The constraints are:

* **ADR-001**: every value is a custom property defined once at the root.
* **WCAG 2.2 AA**, restated by the brief as hard constraints: 44 by 44 pixel targets, readable and
  unclipped text at 200%, and no horizontal scrolling.
* **DDR-010**: the markup order is the reading order, which is why the date column is a grid column
  and why the dates sit above the title on narrow screens rather than being moved there.
* **ADR-001** again: the site is statically exported, so nothing may depend on measuring the
  viewport in JavaScript.

## Decision

### Mobile-first, unchanged

The `:root` values in `app/tokens.css` are the values for the narrowest viewports. A breakpoint is a
minimum width that adds to them. Nothing is written as a maximum width, so there is one direction to
read the file in.

### Two breakpoints, and only two

| Width          | Behaviour                                                                     |
| -------------- | ----------------------------------------------------------------------------- |
| Below 20em     | The page and section titles step down one step; the page's edges tighten; languages go to one column |
| 20em to 48em   | One column throughout: dates above job titles, no spine, project media above text, skills in one column, languages in two |
| 48em and above | The timeline's three columns, the projects' two columns, skills in two columns, languages in four, the photo beside the name |

**Both are in em**, which in a media query is the browser's default font size and not the root's CSS
font size. A reader who enlarges text therefore falls below a breakpoint just as a narrower screen
does, and gets the single-column layout rather than a squeezed grid. At the default size they are
320px and 768px. To check a breakpoint in a browser, change the browser's default font size, not the
root's CSS font size.

### The narrow breakpoint, at 20em, is the tokens'

It redefines four role tokens in `app/tokens.css`, and nothing else:

| Role token                 | Below 20em                | From 20em                   |
| -------------------------- | ------------------------- | --------------------------- |
| `--font-size-page-title`   | `--font-size-xx-large`    | `--font-size-xxx-large`     |
| `--font-size-section-title`| `--font-size-large`       | `--font-size-x-large`       |
| `--page-gutter`            | `--space-small`           | `--space-medium`            |
| `--page-padding-block`     | `--space-large`           | `--space-section`           |

**Since DDR-040 the last row is gone**: `--page-padding-block` is `var(--space-boundary)` at every
width, 42px below 48em and 56px from it.

**It steps a heading down rather than shrinking it**, so a narrow column with enlarged text does not
break a long word such as "certifications" in the middle. Styles read the role, never the step
behind it.

**`--font-size-item-title` is not on the list.** DDR-004 stepped all three heading roles down;
DDR-011 sets an item title at body size, and there is nothing below body size a title could take.
It is the same at every width.

**No step of either scale is ever redefined.** A breakpoint changes which step a role uses, not what
a step is.

### The wide breakpoint, at 48em, is the components'

It redefines no token, because what changes there is layout rather than a value — a one-column grid
becoming three — and a media query cannot read a custom property, so there is no way to give its
width a token either. It is therefore written by each component that lays out, in its own CSS
Module.

**DDR-039 amends the first clause.** Since #119 the wide breakpoint also redefines one token,
`--rhythm-scale`, in `app/tokens.css`: the factor the vertical rhythm is measured by, 0.75 below
48em and 1 from it. It is a value rather than a layout, and it is the only one.

**The discipline that replaces DDR-004's guarantee:** a component stylesheet may write the wide
breakpoint, exactly `@media (min-width: 48em)`, and may write no other width of its own.
`components/stylesheets.test.ts` holds every component stylesheet to that — it previously forbade
width queries outright — so a second opinion about what a wide screen is cannot arrive quietly. A
third breakpoint is a new decision and a new record.

48em is the draft's own `md:` prefix, which is 768px at the default font size.

### The markup order is the visual order

DDR-004's rule, unchanged, and the redesign is built around it rather than against it:

* Nothing is reordered by `order`, by grid placement, or by a reversed direction.
* The timeline's date column is a grid column, so the dates sit **above** the title on a narrow
  screen rather than being moved there.
* The project media precedes the text in the markup, so it sits above it when the columns collapse.
* `components/stylesheets.test.ts` checks for the properties that would break this.

### Targets, hover and overflow

All three carry forward from DDR-004 unchanged:

* **Superseded by DDR-027.** **Every interactive target is at least 44 by 44 CSS pixels on screen**,
  reached by padding rather than by enlarging text. `--target-size-min: 44px`, in px because WCAG
  measures a target in px and a finger is not sized by the text. The draft fails this in three
  places and each is corrected in DDR-010. On paper nothing is tapped, so a component may drop the
  minimum and a link takes the height of its text.

  DDR-027 removes the token and the minimum with it: a target is the size `career-site-design` draws
  it, which is 37.1px for a control and the line of its text for a link. Two things this record got
  wrong are corrected there — 44 by 44 is WCAG 2.5.5 at Level AAA and not the AA criterion cited
  here, and a minimum against the content box made a "44px" pill 61.6px. The last sentence, that a
  component may drop the minimum on paper, survives as the rule that lets the projects drop their
  row gap there.
* **Nothing depends on hover.** No content is revealed by pointing at anything, and hover adds a
  second non-colour cue rather than replacing one.
* **Nothing scrolls horizontally from 320px**, at any font size.

## Alternatives Considered

### Option A: Keep one breakpoint, and build the multi-column rows with intrinsic sizing

Use `flex-wrap`, `grid-template-columns: repeat(auto-fit, minmax(...))` or `clamp()` so the rows
reflow without a query.

Pros:
* DDR-004's guarantee survives: one layout, no component disagreeing with another.
* It would respond to the container rather than to the viewport, which is usually the better tool.

Cons:
* It does not express the timeline. A three-column grid of 160px, 28px and the rest has to collapse
  to one column and drop the spine entirely, which is a change of structure rather than a reflow.
* `auto-fit` on the language cards would give four, then two, then one at widths nothing chose, so
  the layout would change at three widths instead of one and none of them would be written down.

### Option B: Use container queries instead of a viewport breakpoint

Pros:
* A component would adapt to the space it is given, which is what it actually wants to know.
* No shared number, so no component could disagree with another.

Cons:
* Each section sits directly in the page column, so the container width and the viewport width are
  the same thing here minus the gutter. It would buy nothing this page uses.
* It is a new mechanism to learn and to test for a site changed a few times a year, and
  `components/stylesheets.test.ts` would have to be taught it.

### Option C: Take the draft's breakpoints as they are

The draft uses Tailwind's `md:` at 768px and `lg:` at 1024px.

Pros:
* It matches the Figma file exactly.

Cons:
* Its widths are in px, so a reader who enlarges text stays above them and gets a squeezed grid.
  Both of this site's breakpoints are in em for that reason.
* `lg:` in the draft changes only the page's horizontal padding, which is not worth a third
  breakpoint and a third thing for a component to disagree about.

## Consequences

Benefits:
* The redesign's layouts are possible, which is the point: a timeline, a media-and-text row, two
  columns of skills and a row of cards.
* Both breakpoints are in em, so a reader who enlarges text gets the simpler layout rather than a
  cramped one.
* The narrow breakpoint stays entirely in the tokens, so a page-wide adaptation is still written in
  one place.
* The rule that replaces DDR-004's guarantee is enforced by a test rather than by memory.

Tradeoffs:
* **DDR-004's one layout at every width is gone.** Its replacement is weaker: components may use one
  query, and only that one.
* A component now has two places to look for how it adapts — the role tokens for what the tokens
  change, its own stylesheet for what it changes.
* The item title no longer steps down, so DDR-004's "headings step down one size" is now "the page
  and section titles step down one size".

Risks:
* **The discipline is only as good as the test.** `components/stylesheets.test.ts` checks the width
  of a query, not whether a component should have written one. A stylesheet that engages 48em for
  something that did not need it will pass.
* **Two breakpoints invite a third.** Each one added makes the next easier to justify. A third is a
  new decision and a new record, and it should have to argue for itself as this one did.
* **48em is not checked against real content at every size.** Between 48em and the point where the
  page reaches its full width, the timeline's 160px date column and the projects' 280px media column
  take a larger share of the row than the design drew them at.

## Related Documents

* GitHub issue #44, which this decision resolves, and Epic #42, the redesign
* The UI Review on #43, which this implements, and the owner's approval on it, which accepted the
  second breakpoint as a knowing loss
* DDR-010, which records the layouts that engage the wide breakpoint
* DDR-004, the responsive strategy this supersedes, and Epic #2, which produced it
* DDR-011, DDR-012 and DDR-013, the typographic, colour and spacing records this story writes with it
* DDR-005, the print stylesheet, and GitHub issue #52, which reworks it
* ADR-001, which put every value in the tokens and keeps the site static
