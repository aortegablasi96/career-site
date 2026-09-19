# DDR-052-Project Neighbours

Status: Accepted

Date: 2026-09-19

**Amends DDR-050 in one respect**: a project's view now ends with a divider and the projects on
either side of this one. Everything else DDR-050 decides — the view's address, its way back, its
introduction, its two columns and its spacing — is unchanged, and this record follows it in reading
its values off `career-site-project`.

DDR-026's divider, DDR-014's breakpoints and markup-order rule, DDR-027's targets and DDR-035's
hover states are unchanged, and the foot of the view follows all four.

## Context

Epic #152 gives each project a view of its own. Issue #156 is its last story: a reader who has
finished one project should be able to go straight on to the next without returning to the page and
finding their place again.

The design draws it at node 59:118: below a hairline, a card in the right half of the column
showing "NEXT", the project's name and a chevron. The left half (node 59:119) is an empty container.

The story leaves three things to decide, and the owner decided two of them on #156:

* **What the last project's view shows in its place.** The owner chose no link.
* **Whether the views also link to the previous project**, which the empty left half suggests. The
  owner chose both directions.
* **How the two halves arrange on a phone**, which the design does not draw. That is decided here.

## Decision

**Each project's view ends with a divider and, below it, the projects on either side of this one:
the project before it at the left, the project after it at the right, each as a card showing the
direction above the project's name with a chevron pointing the way it leads.**

### What each view shows

* **Both neighbours, where there are two.** The owner chose this on #156 over the next alone: the
  design leaves the left half empty, which is where a link back belongs, and a reader who has gone
  one project too far should not have to use the browser's back button.
* **The projects are an order, not a ring.** The first project's view shows no link back and the
  last project's view shows none on. The owner chose this on #156 over wrapping round: a card
  labelled "Next" that leads to the project the reader started from says the wrong thing about
  where they are in the list.
* **The order is the page's**, which is `content/projects.ts`'s. Nothing here reorders it, per
  #156's exclusions.
* **The first view keeps the design's empty left half** (node 59:119), so the card for the project
  after it keeps the right one. The last view needs no such box: its one card is already at the
  left. The empty box is not drawn below the wide breakpoint, where the halves are one column and
  it would be a gap above the card.

### The card

* **The whole card is the link**, as a project card on the page is, per DDR-051, so it is one stop
  in the tab order and a pointer anywhere on it follows the link. Here the card *is* the anchor
  rather than a box a stretched pseudo-element covers, because it holds nothing but the two lines
  and the chevron.
* **Its accessible name is "Next project: Digital Twin"**, from the word the card shows and the
  project's name. "Next" and the name are two lines of a card rather than one phrase, so the name
  says what the two together mean; the visible word comes first in it, per WCAG 2.5.3. Both words
  are content, in `projects.view`.
* **The chevron points the way the link leads** — the way back's own mark for the project before,
  and its mirror, a new `forward`, for the project after. It repeats what the card says and is
  hidden from assistive technology, like every other mark, per DDR-010.
* **It is white, edged by `--color-border` at the large radius, 16px in from its edge all round,
  with the chevron 12px from the words** (node 59:120). It carries no shadow, which is the
  design's, so DDR-020's one elevation still has the eight elements and the cards DDR-051 gave it.
* **"NEXT" is set as the view's other label is**: 10px bold capitals at `--letter-spacing-x-loose`
  in the faint ink (node 59:123). The project's name is 14px semibold in the heading ink on the
  body leading (node 59:126).
* **Under the pointer and on keyboard focus it takes the accent's tint and edge**, and its words
  and chevron the accent, as the view's outlined control does, per DDR-035. Keyboard focus draws
  the outline every focused element has, around the whole card.
* **It is a route of this site**, so it goes through `next/link`, per ADR-010, and does not
  prefetch, per DDR-050's reasoning: a view carries a picture of its own, and a reader rarely opens
  both neighbours.

### Layout and space

* **A divider opens the foot**, a 1px `--color-border` hairline across the column (node 59:117),
  drawn as a border on the block it opens, as a section's divider is drawn on the section it opens,
  per DDR-026. It is the design's 56px below the view — a section boundary — and its 40px above the
  cards is the heading step.
* **Two equal halves from the wide breakpoint, 24px apart**, as the design draws them. Each half's
  minimum is zero, so a long project name can never widen it.
* **One column below the breakpoint, in the markup order**: the project before, then the one after.
  That is the design's reading order, and it keeps the visual order the markup order, per DDR-014.
  Each card is the column's full width and keeps its own alignment — the one before at the left,
  the one after at the right — so the direction is still visible at a glance on a phone.
* **A long name wraps anywhere inside the card.** At 320px with text at 200% the card leaves the
  words 136px and "Portfolio" alone is wider than that; without it the name runs out over the
  card's edge. It is the declaration the view's pills and the footer's addresses already carry.

### Two measures of the view's own

`--project-neighbour-gap`, 24px between the halves, and `--project-neighbour-mark-gap`, 12px
between the words and the chevron. Neither is a step of DDR-013's scale, and the view is the
design's to the pixel at its width, so they are measures of the view's own, as the rule above the
name and the label gap already are, per DDR-050.

### What the foot does not do

* **It does not print.** Only the page is the printed CV, per Epic #152, and the view has no print
  rule of its own. The hairline would drop at the token layer in any case, per DDR-015.
* **It adds no second way between projects**, such as a list of all four on each view, per #156's
  exclusions.

## Alternatives Considered

### Option A — the next project alone, as the design draws it

Pros:

* Exactly the design, with no pattern invented for the empty half.
* One card, so a phone gets one row rather than two.

Cons:

* The empty half is drawn on the *first* project's view in the design, which reads as a slot for a
  link back rather than as a rule that there is never one.
* A reader who has gone one project too far has only the browser's back button or the way back to
  the projects and their place in the section.

Rejected by the owner on #156.

### Option B — wrapping round, so the last project leads to the first

Pros:

* Every view has the same two cards, and the foot never changes shape.
* The reader can keep going without ever reaching a dead end.

Cons:

* "Next" on the last project leads backwards, which says the wrong thing about where the reader is.
* It hides how many projects there are: nothing in the sequence ever ends.

Rejected by the owner on #156.

### Option C — placing the next card in the right half with `grid-column`

Pros:

* No empty box in the markup on the first project's view.

Cons:

* `components/stylesheets.test.ts` refuses `grid-column` in a component stylesheet, because
  DDR-014 makes the visual order the markup order, and this would be the first exception.
* The design already draws the empty half, so the box is the design's own rather than a workaround.

## Consequences

Benefits:

* A reader can move through the projects in either direction without returning to the page.
* The foot is the design's at its width, node for node, and the two words it shows are content.
* No new elevation, ink, radius or hover state: the card reuses what DDR-020, DDR-025, DDR-035 and
  DDR-051 already decide.

Tradeoffs:

* The first and last views are a card short, so the foot is not the same shape on all four.
* Two measures that are not on DDR-013's scale join the view's own, for the same reason DDR-050's
  two did.
* A phone gets two rows of cards where the design has one, which is 24px and a card of height.

Risks:

* A longer project name changes how a card wraps at narrow widths. Measured every 10px from 300px
  to 900px on all four views at the browser's default text size, and from 300px to 760px at 200%,
  where the wide layout cannot apply: nothing scrolls sideways, no card's words are cut, and the
  closest pair of targets is 27.2px centre to centre, which is the footer's addresses and unchanged
  by this story. A new or renamed project means running that sweep again.
* The site now has two chevrons that differ only in direction. Both are in `components/icon.tsx`
  and neither is in the accessibility tree.

## Related Documents

* DDR-050 (the project view), which this amends
* DDR-051 (the project cards on the page, whose whole-card link this follows)
* DDR-026 (the section divider), DDR-013 and DDR-039 (spacing), DDR-014 (breakpoints and markup
  order), DDR-020 (elevation), DDR-025 (colour), DDR-027 (targets), DDR-035 (hover)
* ADR-010 (a project view is a route; a `next/link` href is not an asset path)
* Issue #156 and Epic #152
