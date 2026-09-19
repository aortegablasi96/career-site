# DDR-049-Site Title in the Contents Bar

Status: Accepted

Date: 2026-09-19

**Amends DDR-031 in two respects**:

* **The bar's arrangement.** DDR-031 puts the bar's links in the page's column and nothing else in
  the bar. The site's title, "Andreu’s site", now stands at the column's left edge, larger than the
  links and in bold, and the links sit together at its right edge.
* **The scroll clearance.** DDR-031's clearance is the bar's 48px plus the flow step. Below the wide
  breakpoint it now adds the title's row as well, because the title can take a row of its own there.

Everything else DDR-031 decides stands: the sticky band, its surface and blur, its 48px minimum, and
the links' type, weight and ink.

**Amends DDR-039 in one respect**: the wide breakpoint redefined one token, `--rhythm-scale`, and
nothing else. It now also redefines `--contents-bar-title-row`, to take the title's row back out of
the clearance where the title shares the links' row.

**Records a cost against DDR-045**, which left the narrow bar with no slack. Wherever the title
cannot share a row with the links, the bar is a row taller than DDR-045 left it. DDR-045's 8px gap and
its links are unchanged.

DDR-033's unlined links, DDR-035's hover, DDR-041's glide, DDR-042's mark and DDR-048's edge apply
unchanged.

## Context

Epic #131 refines how the page is navigated. Issue #149 is its last story.

The bar lists Home and the five sections and nothing names the site. A visitor who arrives at a
section, or has scrolled the introduction away, has no constant reminder of whose site it is. The
issue asks for the site's title in bold, with the links grouped together. The design draws no
title; it is the owner's request.

The issue first put the links on the left and the title on the right, and #151 built that. Seeing
it on the page, the owner swapped the two sides and asked for a larger title, and for the bar to
grow if it had to. This record describes the arrangement as the owner revised it.

The story leaves one thing to decide: how the bar arranges the two where they cannot share a row,
at narrow widths and with enlarged text. Neither may be cut off or overlap the other; reading and tab
order must follow what is on screen; and from 320px, at both text sizes, nothing may scroll sideways,
no pair of targets may fail WCAG 2.5.8, and no focused element may be hidden behind the bar.

## Decision

**The bar's column holds the site's title at its left and the links at its right. Where the two
cannot share a row, the links wrap onto the rows below the title, still set to the right, and the
scroll clearance makes room for the title's row.**

### The arrangement

* **The column is a wrapping flex row of two items**: the title, then the list of links. The list's
  auto margin takes it to the column's right edge, and `justify-content: flex-end` sets each row it
  wraps to at the right as well, so the links read as one group.
* **Where both fit on one row they share it.** At the default text size that is every width from
  550px up.
* **Where they do not, the links wrap below the title.** The title never shrinks and never squeezes
  the links into more rows beside it.
* **The title comes first in the markup**, as it does on screen, so a screen reader reaches it
  before the links. It is not a link, so the tab order is unchanged.
* **From the wide breakpoint**, the gap between the title and the links, where they share a row, is
  the links' own 32px.

### The title

* **"Andreu’s site"**, as `title` in `content/contents.ts`, beside the bar's accessible name and
  Home's word, per ADR-002. It moves the CV digest, and is not a fact ADR-005 lists as shared.
* **A paragraph, not a heading and not a link.** The page's one `h1` is the owner's name, and Home
  already returns to the top, which the story excludes a title link for.
* **`--font-size-x-large`, 20.8px, bold, in the heading ink.** That is the step a section title
  takes from the wide breakpoint, so the title reads as the bar's name rather than as one more
  label. Its line is 31.2px, which the bar's 48px holds, so the bar needs no more height where the
  title shares the links' row. It is inside the `nav`, so it does not print.

### The clearance

* **`--contents-bar-title-row`** is the title's line plus the small step below it: 39.2px at the
  default text size, and twice that at 200%. `--contents-bar-clearance` adds it to the bar's height
  and the flow step.
* **The wide breakpoint sets it to 0**, where the title shares the links' row. Below the breakpoint
  the title shares the row too from 550px, so there a heading lands a row lower than it strictly
  needs to. That was preferred to a third breakpoint.
* **Without it**, at 320px to 390px with text at 200%, the bar was 228px and every heading a contents
  link moves to landed 15px behind it.

### What it costs

Measured on the page every 10px from 300px to 900px, and at 1280px and 1536px, at the browser's
default text size and at 200%:

| Text size | Widths         | Bar before | Bar after |
| --------- | -------------- | ---------- | --------- |
| 100%      | 300–400px      | 48.8px     | 87px      |
| 100%      | 410–540px      | 48.8px     | 59.5px    |
| 100%      | 550px and up   | 48.8px     | 48.8px    |
| 200%      | 300–310px      | 204.8px    | 345.6px   |
| 200%      | 320–390px      | 149.8px    | 228.2px   |
| 200%      | 400–780px      | 96.8px     | 173.2px   |
| 200%      | 790–900px      | 96.8px     | 118.2px   |
| 200%      | 1280, 1536px   | 96.8px     | 96.8px    |

* **Nothing scrolls sideways**, the title is never cut off or overlapping a link, it starts on the
  column's left edge and the last link ends on its right edge at every width measured.
* **No pair of targets fails 2.5.8**, because the title is not a target and the links do not move
  relative to each other.
* **From 320px, every heading a contents link moves to lands below the bar**, at both text sizes:
  at least 59px clear at the default size and 63px clear at 200%, measured at 320px, 360px, 390px,
  450px, 600px, 768px, 900px and 1280px.
* **No focused element is ever wholly behind the bar**, tabbing forward and back at the same widths
  and both sizes from 320px.
* **At 300px and 310px with text at 200%**, below DDR-014's 320px floor, the title itself wraps onto
  two lines, the bar is 345.6px, and headings land behind it. DDR-031 already recorded those two
  widths as a risk.
* **Paper is untouched**: under print emulation every box on the sheet is identical to the tree
  before, because `nav` does not print and the clearance is only a scroll padding.

## Alternatives Considered

### Links on the left, title on the right, at the links' size

Pros:

* It is what the issue first described, and the bar is shorter on a phone: 75.3px rather than 87px.

Cons:

* The owner saw it built and preferred the title first and larger.

### Keep the clearance as it was

Pros:

* No second token at the wide breakpoint.

Cons:

* At 320px to 390px with text at 200%, every heading a contents link moves to lands 15px behind
  the bar.

### Show the title only where it fits beside the links

Pros:

* The narrow bar stays exactly as DDR-045 left it, and the clearance needs no change.

Cons:

* A phone would not show the title at all, which is where a reminder of whose site it is matters
  most.

### Keep the links beside the title at every width

Pros:

* The bar never gains a row just for the title.

Cons:

* The links lose the title's width and wrap into more rows beside it. With the title at the links'
  size and at 200%, that was already 314.8px from 300px to 400px, and taller than wrapping at every
  width below 580px.

## Consequences

### Benefits

* The site is named on every view, and the links read as one group.

### Tradeoffs

* On a phone the bar is 87px rather than 48.8px at the default text size, and one row taller at
  200%, so it covers more of the page there.
* From 550px to the wide breakpoint, a heading lands a row lower than it needs to.
* The bar carries text the design does not draw, at the owner's request.

### Risks

* **The clearance assumes the title takes one line.** A longer title, a larger step, or text beyond
  200% at 320px wraps it onto two, and headings then land behind the bar. Rerun the sweep and the
  heading check after changing any of them, or a label or a section.

## Related Documents

* docs/decisions/design-decisions/DDR-031-sticky-contents-bar.md, which this amends
* docs/decisions/design-decisions/DDR-039-vertical-rhythm.md, which this amends
* docs/decisions/design-decisions/DDR-045-home-link-in-contents-bar.md
* docs/decisions/design-decisions/DDR-042-current-section-in-contents-bar.md
* docs/decisions/design-decisions/DDR-014-responsive-strategy.md, whose markup-order rule and
  320px floor this keeps
* docs/decisions/design-decisions/DDR-027-target-sizes.md, whose 2.5.8 measurement this reruns
* GitHub issue #149, PR #151 and Epic #131
