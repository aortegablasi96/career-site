# DDR-013-Spacing and Layout

Status: Accepted

Date: 2026-09-16

**Amended by DDR-026** in one respect: sections are no longer separated by whitespace and a heading
alone, because the design's divider is now drawn between them. The scale, the rhythm and every value
below are untouched — DDR-026 splits the section step in half around the line rather than adding to
it, so two sections are exactly as far apart as this record sets them.

Supersedes DDR-003, spacing and layout. Its **spacing scale and its three-level rhythm carry
forward unchanged**, and so does its decision to separate sections by whitespace and a heading
rather than by a rule. Its **layout does not**: the single column as wide as the measure becomes a
page wide enough to place things beside each other, so `--content-width` stops equalling
`--measure` and the measure now governs running text alone. Three corner radii are added.

## Context

Epic #42 adopts the redesign the owner made in Figma, and the UI Review on #43 is its contract.

DDR-003 made the page one column as wide as the measure, 65ch, and everything about the old page
followed from that: one entry anatomy for roles, projects and credentials, one labelled list for
skills and languages, and five sections that were the same vertical list of the same shape. That
was the right column for prose and it is the reason the page reads as undifferentiated.

The redesign places things side by side — a date column beside a timeline spine beside the content,
project media beside project text, two columns of skill groups, four language cards in a row — and
none of that fits in 65ch. The column is the change every other change depends on.

The spacing scale itself was never the problem. DDR-003's 0.25 / 0.5 / 1 / 2 / 4rem doubling and its
flow / item / section rhythm serve the new layout as well as the old one, and the UI Review keeps
them explicitly.

The constraints are:

* **ADR-001**: every value is a custom property defined once at the root, and no component writes a
  literal length.
* **DDR-011**: the measure stays 65ch, and no line of running text may exceed it.
* **DDR-014**: the multi-column rows engage at one breakpoint and one only.
* **ADR-002**: the page is the CV, so the column has to collapse onto a sheet of A4.

## Decision

### The spacing scale, unchanged

A base unit of 1rem, halved and doubled, so each step is twice the one below.

| Token             | Size     | At the 16px default |
| ----------------- | -------- | ------------------- |
| `--space-x-small` | 0.25rem  | 4px                 |
| `--space-small`   | 0.5rem   | 8px                 |
| `--space-medium`  | 1rem     | 16px                |
| `--space-large`   | 2rem     | 32px                |
| `--space-x-large` | 4rem     | 64px                |

In rem, so space follows the reader's browser font-size setting with the text it separates. A value
not on this scale is a decision to make, not a number to write.

### The rhythm, unchanged

| Token            | Step              | Separates                                    |
| ---------------- | ----------------- | -------------------------------------------- |
| `--space-flow`   | `--space-medium`  | One block from the next inside an item        |
| `--space-item`   | `--space-large`   | One item from the next inside a section       |
| `--space-section`| `--space-x-large` | One section from the next                     |

Each level is twice the one below, so a section boundary is plain from whitespace and its heading.
Space is set above an element and never below it, so the gap between two blocks is always the one
the second asks for and margins never collapse into a value that is not on the scale.

**Sections are still separated by whitespace and their heading.** A section's `h2` now carries a
decorative rule running to the right margin, which DDR-012 colours and DDR-010 places. The draft's
additional `<Divider>` between every section is not adopted: the heading rule already marks the
boundary, and two rules doing one job is clutter.

**DDR-026 adopts the divider**, following DDR-010's own reversal, and the boundary is now a hairline
with half the section step above it and half below. The step itself does not move: `--space-section`
is exactly twice `--space-item`, so the two halves are one step of this scale and the distance
between two sections is the distance this record sets. What is no longer true is the sentence above
and the claim under the table that a section boundary is plain from whitespace and its heading — it
is now plain from whitespace, a heading and a line.

### The page column

**`--content-width: 68.75rem`**, which is 1100px at the 16px default, replacing DDR-003's
`var(--measure)`.

* **It is in rem, not px.** The design says 1100px and that is what it is at the default font size.
  Written in rem, the column grows with the text when a reader enlarges it, so the columns inside
  it keep their proportions instead of cramping. Every other length on the site follows the
  reader's setting; the page's own width should not be the exception.
* **The measure now governs running text alone.** `--measure` stays 65ch and `app/globals.css`
  applies it to `p` and `li`, so **no line of running text exceeds 65ch** however wide the page is.
  The wider page buys columns, not longer lines: at 1100px the timeline's content column is about
  55ch and a project's text column about 49ch, so the measure binds only on the introduction's
  summary, which is capped explicitly.
* **The gutter is unchanged**, padding outside the column so content keeps off the edges of a
  narrow screen. DDR-014 halves it and the space above and below on the narrowest viewports.

### Corner radii

Three, one for each kind of surface the redesign has, so nothing rounds by an amount of its own.

| Token             | Size      | Used for                                        |
| ----------------- | --------- | ----------------------------------------------- |
| `--radius-small`  | 0.25rem   | A technology tag, a level badge                 |
| `--radius-large`  | 0.75rem   | A language card, a piece of project media       |
| `--radius-pill`   | 9999px    | The three contact pills and the CV control      |

The first two are the draft's own values, in rem so a rounded corner keeps its proportion to the
text inside it when text is enlarged. The third is not a length: it is any value large enough to
round an edge to a semicircle, which is what a pill is.

DDR-003 had no radius because the old page had no tinted or bordered surface. These exist so that
the section stories read a token rather than each choosing a number.

### Where the layout lives

`app/tokens.css` holds the tokens and `app/globals.css` sets the page column, the measure on running
text and the rhythm. The rhythm rules are wrapped in `:where()`, so they have no specificity and a
CSS Module's class overrides them. The multi-column rows themselves are the section components', per
DDR-010, and they read these tokens. `app/tokens.test.ts` holds the scale, the rhythm, the column
and the radii to this record, and `components/stylesheets.test.ts` holds every component stylesheet
to tokens only.

## Alternatives Considered

### Option A: Keep the column at the measure, and let the sections overflow it

Pros:
* No record is superseded, and running text needs no separate cap.

Cons:
* A 65ch column cannot hold a 160px date column, a 28px spine and 55ch of content, which is the
  timeline. The layout is the redesign.
* A section that breaks out of the page's own column is a worse rule than a wider column with a cap
  on running text.

### Option B: Set the column to 1100px

Pros:
* Exactly what the design says, at every zoom level and every font size.

Cons:
* A reader at 200% gets the same 1100px, so every column inside it halves in character count while
  the text doubles in size. The timeline's content column would fall from about 55ch to about 27ch.
* It would be the only length on the site that does not follow the reader's setting.

### Option C: Change the spacing scale to the draft's values

The draft spaces roles 2.75rem apart, projects 2.5rem, skill groups 2.5rem, and the page 3.5rem top
and bottom.

Pros:
* The page would match the Figma file exactly.

Cons:
* Those are five values off any scale, chosen individually. DDR-003's doubling exists precisely so
  that the next section does not add a sixth.
* The UI Review keeps DDR-003's scale explicitly, and the owner approved it.

### Option D: One radius rather than three

Pros:
* One number, and nothing to choose between.

Cons:
* A 13px tag and a language card rounded by the same amount look wrong at both ends: the tag reads
  as a lozenge and the card as barely rounded.
* A pill is not a radius on a scale at all; it is an edge rounded to its own height.

## Consequences

Benefits:
* The page is wide enough for the layout the redesign is, and running text is still held to a
  comfortable measure — the two are now separate decisions rather than one.
* The spacing scale and the rhythm survive the redesign untouched, so every component that reads
  them keeps working and the page's vertical rhythm does not have to be relearned.
* A tag, a badge, a card and a pill each have a radius to read rather than a number to invent.

Tradeoffs:
* `--content-width` and `--measure` are two things where they used to be one, so a component that
  renders running text has to remember which it wants. The base styles cap `p` and `li`, which
  covers everything except text that is neither.
* 68.75rem is not a round number. It is 1100px at the default, which is the number the design gives.

Risks:
* **Until the sections are rebuilt, the page is wider than its content.** #44 changes the token;
  #48 to #51 rebuild the sections that fill it. In between, the old single-column components sit at
  65ch inside a 68.75rem column, so the page reads as left-weighted on a wide screen. This is an
  interim state on a redesign epic, and it resolves as the section stories land.
* **A wider page is more to print.** The timeline prints its date column on A4, which DDR-010
  expects, but the printed length is not known until the page exists. #52 goes last for this reason
  and must state it.
* **Nothing enforces the measure on text that is not a `p` or an `li`.** A description rendered in a
  `div` would run the full column width.

## Related Documents

* GitHub issue #44, which this decision resolves, and Epic #42, the redesign
* The UI Review on #43, which this implements, and DDR-010, which records the layouts that use it
* DDR-003, spacing and layout, which this supersedes, and Epic #2, which produced it
* DDR-011, DDR-012 and DDR-014, the typographic, colour and responsive records this story writes
  with it
* DDR-005, the print stylesheet, and GitHub issue #52, which reworks it and states the printed length
* ADR-001, which put every value in the tokens, and ADR-002, which made the page the CV
