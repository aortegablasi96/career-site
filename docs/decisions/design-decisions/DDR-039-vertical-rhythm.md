# DDR-039-Vertical Rhythm

Status: Accepted

Date: 2026-09-18

**Supersedes DDR-013's rhythm**, and nothing else there. DDR-013 set three levels of space, each
twice the one below: `--space-flow`, `--space-item` and `--space-section`. This record keeps the
flow step and replaces the other two with the design's own values. DDR-013's **spacing scale is
unchanged**: its five steps from 4px to 64px still set every padding, gap and inner margin on the
page. What leaves the scale is the rhythm between sections, headings and entries.

**Amends DDR-014 in one respect:** the wide breakpoint now redefines one token, `--rhythm-scale`.
DDR-014 kept every token change at the narrow breakpoint and left the wide one to the components'
layout. The rest of DDR-014 stands.

**Corrects DDR-026's statement of the section boundary.** DDR-026 described the space on each side
of the divider as "the design's own 56px and 56px". The page drew 32px on each side. The divider,
its colour and its place are unchanged. From the wide breakpoint the space on each side is now 56px.

**Amends DDR-015 in one respect:** paper keeps the rhythm it had. The print block sets the new
tokens back to the steps DDR-013 gave them, so the printed CV is pixel-identical to the one before
this record.

## Context

Epic #70 closes the gaps between the page and the Figma design `career-site-design`. On 2026-09-17
the owner decided that the design prevails everywhere. After line spacing, which DDR-038 took, the
largest remaining reason the page read denser than the file was the space between things. Issue
#119 measured it.

Every value below comes from the design file's frames at its 894px width. The Make file's classes
are the ones #119 records; a dash is a space #119 gives no class for.

| Space                                          | Design frames                        | Make file       | Design | Page before |
| ---------------------------------------------- | ------------------------------------ | --------------- | ------ | ----------- |
| Last item to the divider, and divider to heading | Section 2:82: heading at y=56, 56 below the last row | `py-14`         | 56px   | 32px        |
| Section heading to its first item              | 2:83 ends at 77; first row at 77 + 40 | `mb-10`         | 40px   | 16px        |
| One role to the next                           | Rows 2:90 and 2:129: 360.6 − 316.6    | `2.75rem`       | 44px   | 32px        |
| One credential to the next                     | Rows 2:577 and 2:590: 77.25 − 41.25   | `2.25rem`       | 36px   | 32px        |
| One project to the next                        | 2:454 and on: a 40px margin           | `space-y-10`    | 40px   | 32px        |
| One row of skill groups to the next            | 2:503 at 258.85; 2:466 is 218.85 tall | —               | 40px   | 32px        |
| The introduction to the first divider          | 2:27 ends at 500.4; 2:81 at 556.4     | —               | 56px   | 32px        |

None of 56, 44, 40 or 36 is a step of DDR-013's scale, which doubles from 4px to 64px. So taking
the design's spaces meant deciding whether to take the design's values or the nearest steps.

The design has only one frame, at 894px, so it says nothing about a phone. DDR-014 does: a space
that suits a wide screen should step down on a narrow one rather than keep its desktop value.

## Decision

### The rhythm takes the design's values

The owner chose the design's own values over the nearest steps. Each is written in rem, so it grows
with the reader's text as the scale does.

| Token                | Design | Separates                                                           |
| -------------------- | ------ | ------------------------------------------------------------------- |
| `--space-flow`       | 16px   | One block from the next inside an item. It is `--space-medium`, as before. |
| `--space-heading`    | 40px   | A section's heading from its first item                             |
| `--space-item`       | 40px   | One project from the next, one skill group from the next, and one row of groups from the next |
| `--space-role`       | 44px   | One role from the next                                              |
| `--space-credential` | 36px   | One credential from the next                                        |
| `--space-boundary`   | 56px   | The last item of a section from the divider below it, and the divider from the next heading |
| `--space-section`    | 112px  | One section from the next: two boundaries. The base styles set it, and the section splits it around its divider. |

`--space-heading` and `--space-item` have the same value but are two tokens, because they separate
two different things. In the design they are equal. They do not have to stay equal.

A role and a credential share one timeline pattern, per DDR-010. The design still spaces the two
timelines differently. So `TimelineRow` is told its kind, and `timeline.module.css` sets the padding
below each row to its own step. This is the only thing the row knows about what it holds.

### One factor steps the whole rhythm down

Each rhythm token is the design's value times `--rhythm-scale`. The factor is 0.75 by default and
1 from the wide breakpoint:

| Token                | Below 48em | From 48em |
| -------------------- | ---------- | --------- |
| `--space-boundary`   | 42px       | 56px      |
| `--space-heading`    | 30px       | 40px      |
| `--space-item`       | 30px       | 40px      |
| `--space-role`       | 33px       | 44px      |
| `--space-credential` | 27px       | 36px      |

One factor keeps the design's proportions between the spaces at every width. It is redefined in
`app/tokens.css` under `@media (min-width: 48em)`. **That amends DDR-014**, which reserved the wide
breakpoint for the components' layout. The factor is a value, not a layout, and writing it once
keeps every space in step. Components still write only the layout at the wide breakpoint, and
`app/tokens.test.ts` holds the wide block to this one token.

0.75 sits between keeping the desktop values on a phone and falling back to the old steps. Below
the breakpoint the old steps gave a heading 16px against 32px between items, which is not a
proportion the design has.

### Paper keeps the rhythm it had

Paper is not wide as far as the media query goes, so by default it would take the 0.75 factor.
Measured in Edge 153 and Firefox 156 on A4:

| Paper takes                       | Sheets | Headings on sheets                | Notes                                   |
| --------------------------------- | ------ | --------------------------------- | --------------------------------------- |
| The rhythm before this record     | 6      | 1, 3, 4, 5, 5                     | The CV as it was                        |
| The narrow factor, 0.75           | 6      | 1, 3, 4, 5, 6                     | Languages move onto the footer's sheet  |
| The design's values               | 7      | 2, 4, 6, 6, 7                     | Sheet 1 holds only the introduction     |

The owner chose to keep paper as it was, as they did for the leading in DDR-038. The print block
sets `--space-heading` to `--space-flow` and the other four to `--space-large`. That is exactly the
rhythm the page had before this record. Every sheet is pixel-identical to the tree before, in both
browsers, with background graphics on and off.

### What it does not cover

* **Line spacing**, which DDR-038 decided.
* **The introduction's own layout and the space above the footer**, which are #120's. The footer
  still follows `main`'s 64px bottom padding, and the page's top padding is unchanged.
* **The skill groups' column gap**, 32px on the page and 64px in the design (2:466 to 2:489). It is
  a horizontal space inside a section, not a rhythm, and #119 does not list it. It is left open.

## Alternatives Considered

### Option A — the nearest steps of DDR-013's scale

64px at the boundary, and 32px from a heading and between entries.

Pros:
* The scale stays whole, and no value off it is written anywhere.

Cons:
* The page misses the design by 4 to 8px at every space #119 measured. The owner decided the design
  prevails.

### Option B — one item step of 40px for every kind of entry

Three values: the 56px boundary, the 40px heading step, and 40px between all entries.

Pros:
* Fewer tokens. The timeline does not need to know what it holds.

Cons:
* Roles would sit 4px tighter than the design and credentials 4px looser, and this record would
  have to justify both differences. The design draws them apart on purpose.

### Option C — add the four values to the scale as steps

Pros:
* Every value would be "on the scale".

Cons:
* The scale would stop doubling. DDR-013's padding and gaps would then have steps to choose from
  that exist only for the rhythm. Keeping the rhythm as its own set of tokens is clearer.

### Option D — keep the design's values below the breakpoint too, or keep today's values there

Pros:
* The same numbers at every width, or no change on a phone.

Cons:
* DDR-014 and #119 ask for the spaces to step down on a narrow screen. Keeping the desktop values
  makes a phone page longest. Keeping today's values leaves a 16px heading step against 32px
  between items, a proportion the design never draws.

## Consequences

Measured on the built page in Edge at the browser's default text size and at 200%:

* **At the design's 894px, every space matches the design to the pixel.** The boundary is 56px on
  both sides of all five dividers and below the introduction, a heading is 40px above its first
  item, roles are 44px apart, credentials 36px, projects 40px, and the two rows of skill groups
  40px. The page is 4769px tall at 894px, against the design's 4787px. The rest of the difference is
  the introduction and the footer, which are #120's.
* **Below 48em every space is three quarters of the design's**: 42, 30, 33, 27 and 30px at 320px,
  360px and 390px. At 200% text every space doubles with the text, because it is in rem.
* **Nothing scrolls horizontally** at 320px, 360px or 390px at either text size, or at 768px, 894px
  or 1536px. Only vertical space changed, so no line reflows.
* **The page is longer on every screen.** At 390px it is 7334px.
* **The printed CV is unchanged**: six sheets in both browsers, with the headings on sheets 1, 3,
  4, 5 and 5, pixel-identical to the tree before, with background graphics on and off. Each
  address still comes back once, there is no `mailto`, and no replacement character.
* **The rhythm is no longer twice-per-level.** DDR-013's rule that each level of the rhythm is twice
  the one below is gone. The rule that space is set above an element and never below it still
  holds, except for the timeline, which carries its gap inside the row so the spine can run through
  it, as it did before.

### Risks

* **Paper and screen now differ in their spacing as well as in their leading.** A change to the
  rhythm on screen will not show on paper unless the print block changes too. That is deliberate,
  and `app/tokens.test.ts` holds the print values by name.
* **A new kind of entry needs a step.** A section whose items are not roles, credentials, projects
  or skill groups takes `--space-item` by default. If the design spaces it differently, that is a
  new token and an amendment to this record.

## Related Documents

* Issue #119, and Epic #70
* DDR-013, whose rhythm this supersedes and whose scale it keeps
* DDR-014, whose wide breakpoint this amends
* DDR-015 and DDR-032, the print treatment and its last measurement, which stand
* DDR-026, whose statement of the section boundary this corrects
* DDR-036, the timeline's spine, which runs through the padding each row carries
* DDR-038, the leading, and the same choice to keep paper as it was
* `career-site-design`, nodes 2:26, 2:82, 2:88, 2:272, 2:459 and 2:575
