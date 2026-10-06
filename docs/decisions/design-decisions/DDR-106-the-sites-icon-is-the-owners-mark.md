# DDR-106-The Site's Icon Is the Owner's Mark

Status: Accepted

Date: 2026-10-06

**Supersedes DDR-094**: the icon is no longer a white serif A on the accent, but the owner's "AO"
mark on a white rounded square. DDR-094's three files, their sizes, the browser's rounded square
and the phone's full square stand; what they draw changes.

## Context

Issue #331, under Epic #216, asks for the site's icon to be the mark the contents bar's title shows
since DDR-105: `BrandMark`, node `552:605` of `career-site-design`, layer `career-site-main`. Its A
is a deep indigo (#1e1b4b), and its O a ring in a gradient from indigo (#312e81) to violet
(#7c3aed). The icon DDR-094 chose, a serif A on the accent, appears nowhere on the site itself, so
the tab and the bar did not connect.

The story asked that the mark keep its shape and colours, and left to the UI Designer and the owner
how it is framed for a tab and at what padding. DDR-094 rejected two candidates for the two risks
this mark carries: two letters cramped at 16px, and a dark mark that vanishes on a dark tab.

Five framings were drawn and compared at 16, 32 and 64px on a white tab, a light grey strip, a dark
tab (#35363a) and a dark strip (#202124): the bare mark; a white rounded square with the mark 3/64
or 6/64 from its sides; a white circle; and a square in the page's surface. The owner chose the
white rounded square with the tighter padding.

## Decision

**The site's icon is the owner's mark, drawn as the bar draws it, on a white rounded square, 3/64
of a side from its left and right edges and centred.**

* **The mark is `BrandMark`'s own**: its three paths and its gradient's line, unaltered, in the
  tokens' inks (`--color-brand-mark-ink`, `--color-brand-mark-start`, `--color-brand-mark-end`)
  written as values, since a tab draws the file without the site's stylesheets.
* **The ground is white**, `--color-surface-card`, so the dark A has a light ground on every
  browser theme. On a dark tab the square stands out at 16.1:1 (#202124) and 12.07:1 (#35363a); on
  a white tab it merges with the tab, and the mark stands on it as it does on the page.
* **The padding is tight**, 3 of 64, so the mark is as large as the square allows: about 14.5 by
  10px in a 16px tab.
* **In a browser it is a rounded square**, the corner 14 of 64, as DDR-094 drew it.
* **On a phone's home screen it is the full square**, 180 pixels, white to the edges, with no alpha
  channel: the phone rounds its corners itself, and a transparent corner would show black.
* **The same three files**, linked by Next.js from every route's head: `icon.svg`, `favicon.ico`
  (16, 32 and 48 pixels, each rendered from the SVG at its own size) and `apple-icon.png`.

## Alternatives Considered

### The bare mark, with no ground

Pros:

* Exactly as the bar draws it, and the largest mark a 16px tab can hold.

Cons:

* The A is 1.01:1 on a dark tab (#202124) and 1.32:1 on #35363a: it vanishes, leaving a violet O.
  This is the risk DDR-094 recorded.

### A white rounded square with 6/64 padding

Pros:

* More air around the mark.

Cons:

* The mark is about 13px wide at 16px, where the tighter padding gives 14.5px.

### A white circle

Pros:

* A softer shape.

Cons:

* The mark must fit inside the circle, so it is the smallest of the framed candidates, about 11.5px
  wide at 16px.

### A square in the page's surface (#f8f7f4)

Pros:

* The page's own ground.

Cons:

* At 16px it reads as white, and on a white tab its edge shows faintly as a grey box.

## Consequences

Benefits:

* The reader meets one mark in the bar and in the tab, bookmark, history entry, search result and
  home screen.
* No surface shows the serif A: `/favicon.ico` is the AO mark too.

Tradeoffs:

* At 16px the two letters are small. The A and the O stay distinct, but the A's crossbar is under
  two pixels thick; the mark is recognised by its shape and colours more than read. Per the
  project's rule that the design prevails, this is recorded, not designed around.
* On a white tab the square is invisible, so the icon's edge is not seen, only the mark.
* On a phone's home screen the mark comes within about 8 of 180 pixels of the square's sides, which
  the phone's rounding leaves intact but close.

Risks:

* The icon carries the inks' values, written into the files. A change to any of the mark's tokens or
  to its paths leaves the icon in the old drawing until the files are drawn again;
  `app/icon.test.ts` fails when they disagree.

## Related Documents

* #331 and Epic #216; the bar's title, #330 and DDR-105.
* DDR-094, which this supersedes; #281 and PR #294, which drew it.
* `career-site-design`, layer `career-site-main`, node `552:605`.
* DDR-025: the colour system.
