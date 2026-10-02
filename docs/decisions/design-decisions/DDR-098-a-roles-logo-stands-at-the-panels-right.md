# DDR-098-A Role's Logo Stands at the Panel's Right, Centred on the Title

Status: Accepted

Date: 2026-10-02

**Amended by DDR-099**, at the owner's request: below the wide breakpoint the logo is centred
across the panel, still after the title. From the wide breakpoint nothing changes.

**Amends DDR-097** in where the logo stands. Its size, its files, its empty `alt`, its 160px column
and the company's pill all stand.

* **From the wide breakpoint** the logo's column is at the panel's right, and the job title stands
  at its left. The logo is centred in its column and centred on the title, not on the pill and the
  title together. The company, the dates and the place stand above both, across the panel.
* **Below the wide breakpoint** the logo stands after the title, at the panel's right edge, a flow
  step below it (centred across the panel since DDR-099). Under DDR-097 it stood first, at the start, above the pill.

## Context

The owner reviewed DDR-097 on the live site the day it shipped (#289, PR #299). They asked for the
company, the dates and the title on the left and the logo on the right, and then for the logo to be
centred on the job title.

An intermediate version put the logo at the title's right at every width, with a track that shrank
on a phone. The owner turned it down for the wide layout. On a phone, it also took the title's room.
At 390px ABB's title went from three lines to five, and at 300px to 320px with text at 200%, the
title's longest word and the gap ran the page sideways.

## Decision

* **The markup is the pill line, then a row with the title and the logo.** The logo follows the
  title, so DDR-014's rule that visual order is markup order holds and nothing is reordered. The
  stylesheet tests forbid moving it with `order`, a `-reverse` direction or grid placement. The logo
  is decorative and hidden from assistive technology, so its place does not change what a screen
  reader reads: the pill, then the title.
* **From the wide breakpoint** the row is a grid: the title in `minmax(0, 1fr)`, the logo in
  `--role-view-logo-column`, 160px, the large step apart, with both centred on each other. The
  column and the gap are DDR-097's, so the longest title still takes one line at the page's widest:
  the title keeps 810px for ABB's 805px.
* **Below it** the row is two blocks. The logo's box is at most the column's 160px, pushed to the
  right edge by an automatic start margin, with the logo at its end, a flow step below the title.
  The title keeps the panel's whole width, as before DDR-097.
* **Because the logo must follow the title in the markup**, it cannot stand above the pill on a
  phone, as DDR-097 put it, while standing at the right from the wide breakpoint. Its place on a
  phone follows from its place on a wide screen.

## Alternatives Considered

### The logo centred on the whole block, the pill and the title

Pros:
* The mirror of DDR-097's wide layout, which the owner first asked for. The logo's column spans the
  pill line too.

Cons:
* The owner asked for the logo to be centred on the job title. On the whole block it stood above
  the title's centre, by half the pill line and its step.

### The logo beside the title on a phone too

Pros:
* One layout at every width.

Cons:
* Built and measured: the title lost the logo's width and a gap. ABB's and Randstad's titles took
  five lines at 390px instead of three, and with text at 200% the page scrolled sideways at 300px
  to 320px.

### The logo above the pill on a phone, as DDR-097 has it

Pros:
* Keeps DDR-097's phone layout.

Cons:
* The logo would have to come first in the markup and be moved to the right on a wide screen, which
  the project's rules forbid, or be in the markup twice.

## Consequences

Benefits:
* On a wide screen the job title leads the panel at the left, where a reader starts, and the logo
  stands at its right, level with it.
* On a phone the title has the panel's whole width, so it wraps exactly as it did before DDR-097.

Tradeoffs:
* On a phone the logo comes after the title, so a reader meets the company's mark last in the panel.
  The company's name in its pill is still the first thing in it.
* From the wide breakpoint the logo is level with the title, not with the panel's middle, so on a
  view whose pill line wraps, EDP's at 1280px, it stands below the panel's middle.

Risks:
* Those of DDR-097, unchanged: a longer title may wrap beside the column at the page's widest, and
  a logo wider than about 4.5:1 reads short in the 160px column.

Measured on the built site in Chromium, on all five views, every 10px from 300px to 900px and at
1195px, 1280px and 1536px, at the browser's default text size and at 200%. Nothing scrolls
sideways. The logo never reaches past the panel or over the title. From the wide breakpoint the
logo's centre is within 1px of the title's. Below it, the logo's right edge is the panel's content
edge. Each view has one `h1`, and no job title breaks mid-word. At 320px and 390px every title takes
as many lines as it did before DDR-097. No target was added or moved, and the views do not print.

## Related Documents

* GitHub issue #289 and PR #299, which shipped DDR-097
* DDR-097, which this amends
* DDR-059 (role view), the panel
* DDR-014, the breakpoints and markup order
