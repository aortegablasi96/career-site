# DDR-034-Contents Bar Edge on Scroll

Status: Accepted

Date: 2026-09-18

**Supersedes in part DDR-031**: ground 4 under "DDR-010's five grounds", which declined the
design's scroll-triggered shadow, the "Shadow" and "Bottom hairline" rows of its anatomy table, and
the alternative "Adopt the scroll-triggered shadow with a client component". Everything else
DDR-031 decides about the bar stands.

**Amends DDR-020 and DDR-021 in one respect**: the site gains a fourth shadow, `--shadow-bar`. Like
DDR-021's two, it is named for the one element that may read it rather than numbered, and paper
drops it at the token layer.

## Context

Epic #70 closes the gaps between the page and the Figma design. On 2026-09-17 the owner decided that
the design prevails everywhere. Issue #114 is this one.

The Figma Make file draws the contents bar in two states (`src/App.tsx`, the `nav`):

* **At rest**, while `window.scrollY` is 60 or less: `border-b border-transparent`, with no shadow.
* **Scrolled**: `border-b border-[#e2e8f0]` and `shadow-[0_2px_16px_rgba(26,26,46,0.10)]`.
* The change takes `transition-all duration-200`.

`career-site-design` has one static frame, node 2:6, which draws the bar at rest. DDR-031 read that
frame as drawing a hairline and no shadow, declined the shadow because the design file does not
draw it, and noted that a scroll-triggered state would make the bar the site's first Client
Component. The page has drawn the hairline all the time and never the shadow. So at the top of the
page it drew a line the design does not, and once scrolled it lacked the depth the design gives it.

The owner has asked for the design's behaviour. After seeing it built, they asked on the same story
for the hairline to be "a bit darker so it's more visible".

## Decision

**The bar has two states, and changes between them when the page scrolls past 60px.**

| State    | When                     | Bottom hairline                           | Shadow                     |
| -------- | ------------------------ | ----------------------------------------- | -------------------------- |
| At rest  | `scrollY` of 60 or less  | 1px, transparent                          | none                       |
| Scrolled | `scrollY` over 60        | 1px `--color-rule`, `#cbd5e1` (1.39:1)    | `--shadow-bar`             |

* **The threshold is the design's 60px** of scroll, in CSS pixels. It is how far the page has moved,
  not a length anything is drawn at, so it is a constant in the component, not a token.
* **The shadow is the design's own**: `0 2px 16px` in `#1a1a2e` at 10%, as `--shadow-bar`. Its
  lengths are in px, as every other shadow's are.
* **The hairline is one step darker than the design's.** The design draws `#e2e8f0`, which is
  `--color-border` at 1.15:1. At the owner's request the bar takes `--color-rule`, `#cbd5e1` at
  1.39:1, the palette's next hairline up and the one beside each section heading. This is the one
  place on Epic #70 where the owner has chosen a value other than the design's, and it adds no
  colour to the palette. It still sits below the 3:1 WCAG 1.4.11 asks of meaningful non-text,
  which does not apply here: the line separates, and carries no meaning.
* **Only the hairline's colour changes, never its width.** The bar is the same height in both
  states, so nothing below it moves when the edge appears.
* **The change takes the design's 200ms**, as `--contents-bar-transition`, and only when the reader
  has no preference for reduced motion. The transition is written inside
  `@media (prefers-reduced-motion: no-preference)`, so a reader who prefers less motion gets an
  instant change, and so does a browser that does not know the query.
* **The static page is the bar at rest.** The server renders it at rest, and it stays at rest until
  script has read the scroll position.
* **With script off, the bar keeps its hairline all the time**, in the darker ink, as DDR-031 drew
  it, through `@media (scripting: none)`. With script unavailable it is better to draw the line at
  the top of the page, where it is not needed, than to leave it out everywhere below. With script
  enabled but failed, the bar stays at rest, which is still readable over its 96% surface and blur.
* **Paper is unchanged.** `nav` is hidden in print. `--shadow-bar` is also `none` in the print
  block, and `--color-rule` is transparent there, so every light and hairline is dropped in one
  place, as DDR-015 does for the rest.

How the page learns the scroll position is ADR-007's: a Client Component that marks the bar with
`data-scrolled`.

## Consequences

### Benefits

* The bar matches the design at the top of the page: there is no line under it with nothing beneath
  it to separate.
* Once scrolled, the bar separates from the content passing under it by a line and a shadow, as the
  design's does.

### Tradeoffs

* The site ships component code of its own for the first time, per ADR-007.
* The hairline departs from the design, at the owner's request. Returning to the design is one
  token name in two declarations.
* The bar has a fourth shadow token. It is named for the bar, so no other element may read it.

### Risks

* If the client runtime fails, the bar stays at rest while content scrolls under it. The 96%
  surface and the blur still separate the links from the content.
* A reader who reloads halfway down sees the bar at rest until hydration, then the edge appears,
  without animating if they prefer reduced motion. Nothing moves when it does.

## Alternatives Considered

### Keep declining it, per DDR-031

Rejected. The owner has decided the design prevails and asked for this behaviour.

### The design's `#e2e8f0` hairline

This is what the story first built. The owner found it too faint and asked for it darker.

### A new, darker hairline colour between `#cbd5e1` and the inks

Rejected for now. The owner asked for "a bit darker", and the palette already has a hairline one
step darker. A new colour would be a new token and a new contrast row to record, for a difference
the existing step already makes.

### Draw the edge from the first pixel of scroll

Rejected. The design's threshold is 60px. It also keeps the edge from flickering as the page
settles after a small scroll at the top.

## References

* Issue #114, and Epic #70
* DDR-031, which built the bar and declined this behaviour
* ADR-007, which decides the mechanism
* DDR-025, whose palette the hairline comes from
* DDR-020 and DDR-021, the site's other shadows
* DDR-015, which drops every hairline and light on paper
* Figma Make file, `src/App.tsx`, the `nav`. Figma `career-site-design`, node 2:6
