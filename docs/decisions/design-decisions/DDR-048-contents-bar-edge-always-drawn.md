# DDR-048-Contents Bar Edge Always Drawn

Status: Accepted

Date: 2026-09-19

**Supersedes in part DDR-034**: its two states, its 60px threshold, its 200ms change between them,
its script-off rule and its server-rendered resting state. What DDR-034 decided about the edge
itself stands: the hairline is `--color-rule`, one step darker than the design's, at the owner's
request on #114, and the shadow is the design's own, as `--shadow-bar`.

## Context

Epic #131 refines how the page is navigated. Issue #148 is one of its stories.

Since DDR-034 the contents bar has had no visible edge while the page is within 60px of its top.
Past that, it gains a hairline and a soft shadow over 200ms. That is the Figma Make file's
behaviour, adopted when the owner decided on Epic #70 that the design prevails.

Seen on the live page, the bar at rest does not read as a bar: on the first view, which is the view
most visitors judge the page by, the links sit on a surface almost the page's own colour with
nothing beneath them to set them apart. The owner asked on #148 for the edge to be drawn at all
times, so the bar reads as the page's navigation from the moment the page opens.

## Decision

**The bar has one state. Its hairline and its shadow are drawn at every scroll position.**

| Where                       | Bottom hairline                        | Shadow         |
| --------------------------- | -------------------------------------- | -------------- |
| Everywhere, always          | 1px `--color-rule`, `#cbd5e1` (1.39:1) | `--shadow-bar` |

* **The edge is what DDR-034's scrolled state drew**, colour for colour. Neither the hairline's
  colour nor the shadow changes here; #148 excludes both.
* **Nothing about the edge changes or animates as the page scrolls.** There is no threshold, no
  transition and no state for script to set, so `--contents-bar-transition` is removed and
  `ContentsBar` no longer marks the bar with `data-scrolled`.
* **With script off, or before script runs, the bar is exactly the same.** The edge is in the
  stylesheet's one rule for the bar, so the static HTML draws it and DDR-034's `scripting: none`
  rule has nothing left to do.
* **The bar's height does not change**: the hairline was always 1px and always there, so the bar is
  as tall as it was and nothing below it moves.
* **Paper is unchanged.** `nav` is hidden in print, and `--color-rule` and `--shadow-bar` are
  dropped in the print block as before, per DDR-015.

## Consequences

### Benefits

* The bar reads as a separate band across the top of the page on the first view, not only after a
  scroll.
* The bar has one look, so there is no change to notice or to animate, and nothing depends on
  hydration: a reader whose script fails sees the same bar as everyone else.
* Less code: one rule, one token and one piece of client state go.

### Tradeoffs

* The page departs from the design again at the top of the page, where the Make file draws the bar
  with no edge. The owner chose this on #148.
* At the top of the page the shadow falls on the introduction's band, where nothing is passing under
  the bar yet. It is the design's soft 10% shadow and does not cover content.

### Risks

* None new. `ContentsBar` stays the site's one Client Component for its other two jobs — the glide,
  per DDR-041 and ADR-008, and the current-section mark, per DDR-042 and ADR-009 — both of which
  still read the scroll position, which is ADR-007's reason.

## Alternatives Considered

### Keep DDR-034's two states

Rejected. The owner found the bar at rest did not read as a bar, and asked on #148 for the edge at
all times.

### Draw the hairline at all times and keep the shadow for the scrolled state

This is roughly DDR-031's bar before DDR-034. Rejected: #148 asks for both, looking at the top of the
page as it does once scrolled, and keeping one state change would keep the threshold, the transition
and the client state for half the effect.

## References

* Issue #148, and Epic #131
* DDR-034, which this supersedes in part
* DDR-031, the contents bar
* ADR-007, which made the bar a Client Component for the edge; ADR-008 and ADR-009 give it its
  remaining reasons
* DDR-015, which drops every hairline and light on paper
