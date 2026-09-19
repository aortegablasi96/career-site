# DDR-049-Site Title in the Contents Bar

Status: Accepted

Date: 2026-09-19

**Amends DDR-031 in one respect**: its arrangement of the bar. DDR-031 puts the bar's links in the
page's column and nothing else in the bar. The links now start at the column's left edge, and the
site's title, "Andreu’s site", stands at its right edge, in bold. Everything else DDR-031 decides
stands: the sticky band, its surface and blur, its 48px minimum, the links' type, weight and ink,
and the root's scroll clearance.

**Records a cost against DDR-045**, which left the narrow bar with no slack. Below 410px at the
default text size, and below 790px at 200%, the title takes a row of its own, so the bar is one row
taller there than DDR-045 left it. DDR-045's 8px gap and its links are unchanged.

DDR-033's unlined links, DDR-035's hover, DDR-041's glide, DDR-042's mark and DDR-048's edge apply
unchanged.

## Context

Epic #131 refines how the page is navigated. Issue #149 is its last story.

The bar lists Home and the five sections and nothing names the site. A visitor who arrives at a
section, or has scrolled the introduction away, has no constant reminder of whose site it is. The
owner asked for the links to sit together at the left of the column and for the site's title at the
right, in bold. The design draws no title; it is the owner's request.

The story leaves one thing to decide: how the bar arranges the two where they cannot share a row,
at narrow widths and with enlarged text. Neither may be cut off or overlap the other; reading and tab
order must follow what is on screen; and from 320px, at both text sizes, nothing may scroll sideways,
no pair of targets may fail WCAG 2.5.8, and no focused element may be hidden behind the bar.

DDR-045 recorded that the narrow bar has no slack: six links at 8px apart already fill its rows.

## Decision

**The bar's column holds the links at its left and the site's title at its right. Where the two
cannot share a row, the title takes a row of its own below the links, still at the right.**

### The arrangement

* **The column is a wrapping flex row of two items**: the list of links and the title. The list is
  not indented, so Home starts where the page's text starts. The title's auto margin takes it to the
  column's right edge.
* **Where both fit on one row they share it.** At the default text size that is every width from
  410px up; at 200% it is from 790px up.
* **Where they do not, the title wraps below the links**, at the right. The links wrap among
  themselves exactly as they did, and the title never squeezes them into more rows or shrinks.
* **The title follows the links in the markup**, as it does on screen, so a screen reader reaches it
  after the six links and the tab order is unchanged: the title is not a link.
* **From the wide breakpoint**, the gap between the links and the title, where they share a row, is
  the links' own 32px.

### The title

* **"Andreu’s site"**, as `title` in `content/contents.ts`, beside the bar's accessible name and
  Home's word, per ADR-002. It moves the CV digest, and is not a fact ADR-005 lists as shared.
* **A paragraph, not a heading and not a link.** The page's one `h1` is the owner's name, and Home
  already returns to the top, which the story excludes a title link for.
* **Bold, in the heading ink, at the links' size**: `--font-weight-bold`, `--color-text-heading`,
  `--font-size-x-small`. It is inside the `nav`, so it prints with it, which is not at all.

### What it costs

Measured on the built page every 10px from 300px to 900px, and at 1280px and 1536px, at the
browser's default text size and at 200%:

| Text size | Widths         | Bar before | Bar after |
| --------- | -------------- | ---------- | --------- |
| 100%      | 300–400px      | 48.8px     | 75.3px    |
| 100%      | 410px and up   | 48.8px     | 48.8px    |
| 200%      | 300–310px      | 204.8px    | 259.8px   |
| 200%      | 320–390px      | 149.8px    | 204.8px   |
| 200%      | 400–780px      | 96.8px     | 149.8px   |
| 200%      | 790px and up   | 96.8px     | 96.8px    |

* **Nothing scrolls sideways**, the title is never cut off or overlapping a link, and it ends on the
  column's right edge at every width measured.
* **No pair of targets fails 2.5.8**, because the title is not a target and the links do not move
  relative to each other.
* **No focused element is ever wholly behind the bar**, tabbing forward and back at 320px, 360px,
  390px, 768px and 1280px at both sizes.
* **Every heading a contents link moves to still lands below the bar**, but closer to it: 31–32px
  below at 320px to 390px at the default size, where it was 58px, and 8px below at 200%, where it
  was 63px. The root's clearance is unchanged.
* **Paper is untouched**: under print emulation every box on the sheet is identical to the tree
  before, because `nav` does not print.

## Alternatives Considered

### Raise the scroll clearance below the wide breakpoint by a row

Pros:

* Headings would land as far below the taller bar as they did below the old one.

Cons:

* It changes a second token for a phone-only fault that does not occur: every heading still lands
  below the bar at both sizes. The owner chose the arrangement without it.

### Show the title only where it fits beside the links

Pros:

* The narrow bar stays exactly as DDR-045 left it.

Cons:

* A phone would not show the title at all, which is where a reminder of whose site it is matters
  most, and the story asks for it at the right of the column.

### Keep the title beside the links at every width

Pros:

* The title is always on the first row.

Cons:

* It takes width from the links, so they wrap into more rows beside it. Measured at 200%, the bar
  grew to 314.8px from 300px to 400px and was taller than the chosen arrangement at every width
  below 580px.

### Let the title share the links' last row

Pros:

* It would use space the last row leaves.

Cons:

* It needs `display: contents` on the list, which risks its list semantics, and measured every 10px
  it saved no height anywhere: the last row never has room for the title.

## Consequences

### Benefits

* The site is named on every view, and the links read as one group.

### Tradeoffs

* The bar is 26.5px taller on a phone below 410px, and one row taller at 200% below 790px, so it
  covers more of the page there, and a heading lands closer beneath it.
* The bar carries text the design does not draw, at the owner's request.

### Risks

* **The narrow bar is now one row further from having slack.** A new label, a new section or a
  longer title changes the wrapping; rerun the sweep, and check that headings still land below the
  bar at 320px with text at 200%, where there is 8px to spare.

## Related Documents

* docs/decisions/design-decisions/DDR-031-sticky-contents-bar.md, which this amends
* docs/decisions/design-decisions/DDR-045-home-link-in-contents-bar.md
* docs/decisions/design-decisions/DDR-042-current-section-in-contents-bar.md
* docs/decisions/design-decisions/DDR-014-responsive-strategy.md, whose markup-order rule and
  320px floor this keeps
* docs/decisions/design-decisions/DDR-027-target-sizes.md, whose 2.5.8 measurement this reruns
* GitHub issue #149 and Epic #131
