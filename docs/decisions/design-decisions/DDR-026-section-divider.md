# DDR-026-Section Divider

Status: Accepted

Date: 2026-09-17

Supersedes **the one sentence of DDR-010** that rejects the design's divider between every section.
Everything else in DDR-010 stands, including the decorative rule it gives each section's `h2`, which
this record keeps unchanged and argues is a different line doing a different job.

**Corrected by DDR-039**, which #119 found: this record calls the space on each side of the line
"the design's own 56px and 56px", but the page drew 32px on each side, half of DDR-013's 64px step.
The divider, its colour, its place and its split are unchanged. What moved is the space: each side
is now `--space-boundary`, the design's 56px from the wide breakpoint and 42px below it.

It **changes no token and adds none**. The hairline is `--color-border`, which DDR-025 already
defines and already names this story in, and the space around it is DDR-013's section step, split
rather than enlarged.

**Amended by DDR-046 in two respects.** The divider spans the window, where it spanned the column, because each section's band now does. The half of the boundary above each divider is now the foot of the section before it, where it was the next section's margin, so each band runs from one divider to the next. The line, its colour, its place and the distance on each side are unchanged, and paper keeps the old arrangement.

## Context

DDR-010 rejected the divider in a sentence, inside its decision about the page column:

> Sections are separated by whitespace and their heading, as DDR-003 decided. A section's `h2`
> carries a decorative rule running to the right margin. The draft's additional divider between
> every section is not adopted: the heading rule already marks the boundary, and two rules doing one
> job is clutter.

That was written against the same Figma file the page is now being matched to. On 2026-09-17 the
owner decided that the design prevails everywhere, and Epic #70 was rewritten around that decision:
#89 to #99 close the gaps, and the records that stand in the way are to be superseded rather than
defended. #94 is the divider.

**What the design draws** is five hairlines, one at the top of each section and none below the last
— nodes 2:81, 2:271, 2:458, 2:568 and 2:646, each a 1px fill of `#e2e8f0` running the full width of
the content container, 846.4px of an 894.4px frame. Each section frame in the file carries 56px of
padding above its heading and 56px below its last item, so the line falls midway between the two
sections rather than against either.

It is the smallest structural story on the epic, and the only one that can be judged by looking at
the page rather than by measuring it. Its colour was settled by #93: `--color-border` is `#e2e8f0`
at 1.15:1 against the page, one of the three hairlines DDR-025 records, and DDR-025's own table
already lists "a divider" among its users.

## Decision

**A 1px hairline in `--color-border` opens every section, drawn as a border on the section itself,
and the section boundary DDR-013 sets is split in half around it.**

```css
.section {
  scroll-margin-block-start: var(--space-medium);
  margin-block-start: var(--space-item);
  border-block-start: 1px solid var(--color-border);
  padding-block-start: var(--space-item);
}
```

Four declarations in `components/section.module.css`, one of which was already there. Nothing else
on the page changes, `components/section.tsx` renders nothing new, and no other stylesheet is
touched.

### The divider belongs to the section it opens

The design draws the line at the top of each section, not at the foot of each. That is why there
are five of them and not four, why the first section has one and the last has nothing below it, and
why the line is written here as a **border on the section** rather than as a separator between two
of them.

It is therefore not in the markup at all, which is the same reason #72 gave for drawing the heading
rule as a pseudo-element. An `<hr>` between two sections is a **thematic break** in the
accessibility tree: a screen reader announces a separator immediately before announcing a landmark
named by the heading that follows it, which says the same thing twice and says the less useful of
the two first. A border says it to the eye and to nothing else.

### The boundary is split, not enlarged

`--space-section` is `--space-x-large`, and DDR-013's scale makes that exactly twice
`--space-item`. So half the step above the line and half below it leaves the distance between two
sections the distance DDR-013 set, and puts the line in the middle of it — which is the symmetry
the design draws, 56px and 56px.

**DDR-039 corrects this.** The halves were 32px each, not the design's 56px, so the symmetry was
the design's and the size was not. Since #119 each half is `--space-boundary`, and the base styles'
`--space-section` is twice it.

That is the only reason a margin is written in this file at all. The base styles' rhythm rule,
`:where(main > * + section)`, has no specificity by design, "so a component's own class overrides
them"; this splits the step that rule sets rather than fighting it, and both halves are still one
step of the scale. Measured on the built page at 1536px and at 320px: 32px above the line, a 1px
line the full width of the column, 32px below it, on all five sections.

Taking the whole step and then padding the section would have made the boundary 6rem — half again
as wide as any other space on the page, and off DDR-013's rhythm — and would have put the line hard
against the section above rather than between the two.

### Two lines, two jobs

DDR-010's objection was that the heading rule already marks the boundary. The two are not one job,
and the page now shows why:

* **They run in opposite directions from different places.** The divider runs the full column and
  closes what came before. The heading rule starts where the title ends and runs to the right
  margin; it belongs to the heading, not to the boundary.
* **They are different weights.** The divider is `--color-border` at 1.15:1 and the heading rule is
  `--color-rule` at 1.39:1, so the nearer line to the title is the stronger one and the boundary
  reads as a surface the section sits on rather than as two rules competing.
* **The heading rule is not always drawn.** Per #72 it grows from a basis of zero and yields
  entirely when a title needs the whole line. Measured at 320px, "Education and certifications"
  wraps to two lines and its rule is **0px wide**, while its divider is the full 272.8px column. On
  the narrowest viewport DDR-010's "the heading rule already marks the boundary" is false for one
  section in five, and the divider is the only line that marks it.

### It carries nothing, so it is held to nothing

At 1.15:1 the divider is the faintest thing the page draws. That is allowed, and for the reason
DDR-025 gives the whole hairline family: WCAG 1.4.11 asks 3:1 of non-text that **carries meaning**,
and removing every divider from the page would lose nothing. The boundary is still the whitespace,
the heading, and the `section` landmark the heading names, which is what a screen reader has always
been given and what this record does not change.

### Paper draws no divider

`--color-border` is `transparent` inside the `@media print` block in `app/tokens.css`, per DDR-015,
so the divider goes the way the heading rule and the timeline's spine already go: at the token
layer, with **no print rule in this stylesheet**. The space stays, which is the boundary a sheet
already had.

That also settles the question of a divider stranded at the foot of a sheet, away from the section
it opens. It cannot be, because on paper it is not drawn at all.

Printed to A4 through WebDriver in Edge 153 and Firefox 156, with background graphics **on**:

| | Sheets | Section headings | Articles whole | Widest horizontal run of ink |
| --- | --- | --- | --- | --- |
| Edge, with the divider | 5 | none stranded | 13 of 13 | none over 55% of the sheet |
| Edge, the tree this branched from | 5 | none stranded | 13 of 13 | none over 55% of the sheet |
| Firefox, with the divider | 5 | none stranded | 13 of 13 | none over 55% of the sheet |
| Firefox, the tree this branched from | 5 | none stranded | 13 of 13 | none over 55% of the sheet |

Every heading falls on the same sheet before and after — Projects on 2, Skills on 4, Education on 4
in Edge and 5 in Firefox, Languages on 5 — and each is followed by its first item on that sheet. No
replacement character in either PDF through pypdf or pdfium, and the only words the two readers
disagree on are the ones Firefox wraps at a hyphen, which is there before this change. The sheet
count is where #91 left it and where #93 did not measure.

### Where the contents link to

`scroll-margin-block-start` is unchanged at `--space-medium`, but the box it is measured from now
begins at the divider. So a reader who follows a contents link lands on the boundary — the line,
then a step, then the heading — rather than on the heading alone. That is recorded rather than
compensated for: arriving at the top of the section the link named is what the offset was for, and
the divider is now part of it. #98 replaces the contents row with the design's sticky bar and will
have to set the offset against the bar's own height, so the value is better decided there than
twice.

## Alternatives Considered

### Option A — keep DDR-010's rejection

Pros:

* One line per boundary, which was a defensible reading of clutter.
* No record to write and no change to make.

Cons:

* The design draws five dividers, and the owner has decided the design prevails. This is exactly the
  kind of rejection Epic #70 was rewritten to reverse.
* It leaves the narrowest viewport with no line at all above "Education and certifications", because
  the heading rule yields to the title there.

### Option B — a separator element in `app/page.tsx`

Pros:

* Closest to the design's own node, which is a frame in the content flow.
* Independent of the section's box, so the section keeps exactly the styles it has.

Cons:

* An `<hr>` is a thematic break in the accessibility tree, announced before a landmark that already
  names the boundary. A `<div>` avoids that but exists only to be 1px tall.
* It would be a sixth kind of thing in the one ordered list of sections `app/page.tsx` holds, which
  is the list the contents are also built from.
* It needs margins of its own to sit in the middle of the boundary, where a border needs none.

### Option C — the whole section step above the line, a step of padding below it

Pros:

* Leaves the base styles' rhythm rule to do its job untouched, so nothing overrides `:where()`.

Cons:

* A 6rem boundary, which is on no step of DDR-013's scale and is half again as wide as any other
  space on the page.
* The line would sit against the section above rather than between the two, which is neither the
  design's symmetry nor a boundary.

### Option D — a border at the foot of each section instead

Pros:

* No padding needed: the next section's own margin would already sit below the line.

Cons:

* It draws four lines in the wrong places — none above the first section and one below the last,
  which is the opposite of what the file draws.
* All 4rem of the boundary would fall below the line and none above it.

## Consequences

Benefits:

* The page's section boundaries are the design's, which is what Epic #70 is for, and the last
  structural difference in the body of the page that could be settled by looking at it.
* The boundary is now drawn at every width, including the one case where the heading rule is not
  drawn at all.
* It costs nothing on paper: no sheet, no moved heading, no split item, and no line.
* It adds no token, no element, no class and no print rule. The whole change is three declarations.

Tradeoffs:

* The section step is no longer applied in one place. `app/globals.css` names it and
  `section.module.css` splits it, so a reader looking for the distance between two sections has to
  add two halves. The comment in each file says so, and `components/section.test.tsx` holds both
  halves to `--space-item` so neither can drift.
* A contents link now lands a step higher up the section than it did, as above.
* DDR-010 loses a sentence it was right about on its own terms: with a heading rule that never
  yields, two lines at one boundary would be clutter. What changed is the owner's decision and the
  measurement at 320px, not the logic.

Risks:

* **A future section with no heading rule to pair with.** The divider is on the section, so any
  `<section>` the page gains gets one. That is the intent, but a section whose opening is not an
  `h2` would get a line with nothing to answer it. The footer #96 adds is not a `section` and has
  its own top border, so it is unaffected; the record notes the case rather than guarding it.
* **The first divider sits below the contents row**, which is a `nav` rather than a section, so the
  page's first hairline separates the contents from the experience section. The design has no such
  row in the flow — its navigation is the sticky bar #98 adds — so where that line reads best is a
  question #98 reopens.

## Related Documents

* `docs/decisions/design-decisions/DDR-010-career-page-redesign-structure.md`, whose rejection of
  the divider this supersedes and whose heading rule it leaves untouched
* `docs/decisions/design-decisions/DDR-013-spacing-and-layout.md`, whose section step is split
  around the line and not changed
* `docs/decisions/design-decisions/DDR-015-print-treatment.md`, which drops every hairline at the
  token layer, so this stylesheet writes no print rule
* `docs/decisions/design-decisions/DDR-025-colour-system.md`, which defines `--color-border` at
  1.15:1 and names this story among its users
* GitHub issue #94, and Epic #70, which closes the gaps between the page and the design
* GitHub issue #72, which drew the heading rule as a pseudo-element for the same reason this is a
  border, and measured the case where that rule yields
* GitHub issues #96 and #98, the footer and the sticky contents bar, which are the two places this
  boundary is revisited
* Figma, `career-site-design`: nodes 2:81, 2:271, 2:458, 2:568 and 2:646
