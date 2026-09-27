# DDR-071-A Lit Timeline Entry's Dates Glow and Its Dot Darkens

Status: Accepted

Date: 2026-09-28

**Amends DDR-064**, per #206. When a timeline card is lit, under the pointer anywhere in its column
or on keyboard focus, its dates now take a soft glow in the card's hover-shadow ink. Its dot
darkens further: the ring takes the accent, where it took the pale hover edge, and the core takes a
deeper indigo, where it took the accent's hover step. At rest nothing changes, and the line between
the dots stays as it was. This applies in both timelines.

## Context

DDR-064 made a role's dates, dot and card one target, and DDR-069 did the same for a credential.
When the card is lit it lifts, takes an accent edge and draws a shadow. Its dates and dot changed by
one colour step each: the dates from `#4f46e5` to `#4338ca`, the ring from `#c7d2fe` to `#a5b4fc`
and the core from `#4f46e5` to `#4338ca`. On #206 the owner found that hard to see, and asked for the
dates to take a shadow as the card does and for the dot to darken.

The Figma layer `career-site-main` (node 321:2) draws only the resting state, so these values are
the owner's choice on #206, not the file's. The owner chose a soft glow in the card's hover ink over
an indigo glow or a pill around the dates. They also chose a darker dot on hover only, over a
darker dot at rest.

## Decision

* **The dates glow.** A lit entry's dates draw `text-shadow: var(--shadow-dates-hover)`, which is
  `0 3px 6px rgba(26, 26, 46, 0.18)`. That is the ink of `--shadow-card-hover`, so the dates and the
  card are lit by the same light. The dates still darken to `--color-accent-hover`. A text-shadow
  takes no space, so nothing moves.
* **The glow fits inside the row.** The row scrolls, so it clips whatever passes its top, and the
  dates' line starts at that edge. With `0 2px 6px`, the first value tried, the row cut one pixel row
  of the glow, by 1 level in 255. `0 3px 6px` is as soft, sits a little lower and is not cut at all:
  measured on the built page in both timelines, the pixels above the row are the same whether the row
  clips or not. `app/tokens.test.ts` holds the glow's reach above the letters, its blur less its
  offset, to 3px or less.
* **The dot darkens.** A lit dot's ring takes `--color-accent`, `#4f46e5`, and its core takes a new
  colour, `--color-accent-deep`, `#3730a3`. That is the next step down the accent's ramp after
  `--color-accent-hover`, and it is 1.58:1 against the ring, so the core stays distinct inside it. It
  is 9.27:1 on the page. The dot is hidden from assistive technology and marks dates that are written
  out, so it carries nothing and no criterion reaches it.
* **Timing is DDR-063's.** The glow comes in with the dates' colour over the card's 150ms, inside
  `prefers-reduced-motion: no-preference`. The dot already changed over the same 150ms. A reader who
  prefers reduced motion gets the glow and the darker dot at once, as they get the card's edge and
  shadow.
* **Paper is unchanged.** `--shadow-dates-hover` is `none` in the print block, as every other light
  is, per DDR-015, and a sheet is never lit anyway. Printed in Edge and Firefox with background
  graphics on and off, the CV is five sheets, with text and pixels identical to the tree before.

### Contrast

The lit dates are `#4338ca`: 7.38:1 on the page and 7.64:1 on the band, as DDR-035 records. The glow
is darkest right behind the letters, where the letters cover it. Even if it reached its full 18%
beside them, the page under it would be `#d0cfd0`, and the dates would still measure 5.10:1 there.
`app/tokens.test.ts` holds that above 4.5:1.

## Alternatives Considered

### An indigo glow

Pros:
* Echoes the dates' own colour.

Cons:
* The owner chose the card's ink, so the dates and the card share one light.

### The dates in a raised pill on hover

Pros:
* The strongest signal.

Cons:
* It is a new element, needs room above the dot and would change the row's height. The owner did not
  choose it.

### A darker dot at rest as well

Pros:
* Every dot would stand out more against its line.

Cons:
* The owner asked for the change on hover only. At rest the dots stay the design's.

## Consequences

Benefits:
* Dates, dot and card read as one lit column, as DDR-064 intends.
* No layout change: every box in both timelines is where it was, at rest and when lit.

Tradeoffs:
* One more colour and one more shadow in the tokens.
* The glow is deliberately soft, so it reads mostly as a slight darkening beneath the dates.

Risks:
* A larger blur or a smaller offset would reach past the row's top edge and be cut. The token test
  guards this.
* A date range set in a larger size or with more leading changes how far above the letters the glow
  can reach before the row cuts it. Re-measure after either change.

## Related Documents

* #206, and its Epic #170
* DDR-064: the dates, dot and card as one target, which this amends
* DDR-061 and DDR-065: `--shadow-card-hover`, whose ink the glow takes
* DDR-063: the 150ms and the reduced-motion rule
* DDR-069: the education cards, which answer as a role's card does
* DDR-036 and DDR-057: the ringed dot
* DDR-025 and DDR-035: the palette and its hover steps
* DDR-015: print
