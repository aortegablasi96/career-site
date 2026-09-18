# DDR-042-Current Section in the Contents Bar

Status: Accepted

Date: 2026-09-18

**Amends DDR-033 in one respect.** A contents link at rest is still not underlined. The link of the
section the reader is in is underlined, as a state. The underline marks where the reader is, not
what a link is, so DDR-033's argument about what identifies a contents link still holds.

**Supersedes in part DDR-010**, and DDR-031 where it carries DDR-010 forward: the half of the bullet
"It has no current-section state and does not animate" that rules out a current-section state.
The other half, about animation, is DDR-041's subject, and this record does not touch it. DDR-006,
which DDR-010 carries this from, is superseded already.

Everything else DDR-031, DDR-033, DDR-034 and DDR-041 decide about the bar stands.

## Context

Epic #131 refines how the contents bar and the contact pills behave. Issue #133 is its second story.
The bar is pinned to the window, per DDR-031, so it is always in view, but it says nothing about
where the reader is. Marking the current section turns it from a list of destinations into a map
with a "you are here".

The design draws no current-section state. Its Make file tracks only the 60px scroll threshold
DDR-034 adopted, and every contents link looks the same at every scroll position. So this is the
owner's request, not a gap between the page and the design.

DDR-006 rejected the state on two grounds, and DDR-010 carried them forward. It needs script, and
DDR-002 said a state must not rely on colour alone. The first ground went with ADR-007, which gave
the bar a Client Component that already knows the scroll position. The second is met here by an
underline.

The story asks for eight things. Exactly one link is marked from the Experience section down, and
none in the introduction. The foot of the page marks the last section. The mark follows every kind
of scroll and settles on the right section at a `#fragment`. Assistive technology announces it.
It is not colour alone and it moves nothing. Without script nothing is marked. It is checked at
320px, 390px and 1536px at both text sizes.

## Decision

**The contents bar marks the link of the section the reader is in. The link is announced as the
current location, underlined, and set in the accent.**

### Which section is current

* **The current section is the last one whose top has reached the bar's clearance.** That is the
  root's `scroll-padding-block-start`, per DDR-031, and it is the line a contents link scrolls a
  section to. So choosing a link always marks the section it lands on. A section becomes current as
  its divider, per DDR-026, passes under the bar, which is where the section begins. One pixel of
  slack covers a section that comes to rest a fraction of a pixel below the line.
* **Above the first section, nothing is marked.** The introduction has no link in the bar, so
  marking the first link there would say the reader is somewhere they are not.
* **At the foot of the page, the last section is marked**, whatever the line says. Languages is too
  short to reach the line in some windows: at 1536 by 864 its top stops 508px down. Without this
  rule, a reader looking at it would see Education marked.
* **It follows the page, not the input.** The answer is recomputed on every `scroll` and `resize`
  event, so the wheel, touch, the keyboard, a contents link's glide (DDR-041) and a page opened at a
  `#fragment` all move it the same way. During a glide the mark passes through each section the page
  moves past, which is where the reader is at that moment.

### How it is drawn

* **`aria-current="location"` on the link**, the ARIA value for the current location within a
  set of navigation. Assistive technology announces it as the current location. It is not `page`,
  because every link in the bar points into the same page.
* **The stylesheet draws the attribute, not a class.** `.link[aria-current]` is the only rule that
  marks a link, so what a sighted reader sees is exactly what assistive technology is told.
* **An underline, in the link's own ink, at `--underline-offset`.** This is the cue that is not
  colour. It is the offset a project link's underline uses, per DDR-035, so the page has one
  underline offset.
* **The accent, `--color-accent`.** This is the second cue, and the ink a contents link already
  takes under the pointer, per DDR-035. It lifts the current link to 5.87:1 on the page and 5.42:1 on
  the bar's worst blend, both of which clear WCAG 1.4.3. The link's resting ink, 4.44:1, does not.
* **Nothing that takes space.** Neither an underline nor a colour changes a box. The weight stays
  medium, because semibold would widen the word and move every link after it. Measured on the built
  page, the bar's height and every link's position and size are identical at every scroll position.

### What does not change

* **Without script, nothing is marked.** The server renders no `aria-current`, so a reader without
  script gets the bar DDR-031 and DDR-034 describe. With script, the mark is right from the first
  frame after hydration.
* **Paper.** The bar does not print, per DDR-015.
* **Hover and focus.** A current link under the pointer or focused keeps the accent it already has;
  the focus outline is the base styles' own.

## Alternatives Considered

### Mark the current link by colour alone

Pros:

* Nothing new is drawn. The accent would be enough for most readers.

Cons:

* The story rules it out, and DDR-006 rejected the state on this ground.
* The accent is also what the pointer draws, so a reader could not tell "here" from "pointed at".

### A heavier weight, or a bar under the link

Pros:

* Either would be a stronger cue than an underline.

Cons:

* Semibold widens the word and moves every link after it, which the story rules out.
* A drawn bar is a new element with its own length, colour and place. The underline already exists
  on the page, with a token for its offset.

### Mark the first section while the reader is in the introduction

Pros:

* The bar always shows something.

Cons:

* It would say the reader is in Experience when they are not. The story asks for no mark there.

### Use an `IntersectionObserver` rather than the scroll position

Pros:

* No work on each scroll event.

Cons:

* The rule is "the last section whose top has passed a line", and an observer reports crossings,
  not order, so the page would still have to be measured to resolve it. The bar already listens to
  scrolling, per ADR-007, and five measurements per scroll event are trivial.

## Consequences

### Benefits

* The bar shows where the reader is on a long page, at every width, and assistive technology
  announces it.
* The current link passes WCAG 1.4.3, where every other contents link at rest still fails it.

### Tradeoffs

* The page adds a behaviour the design does not draw, at the owner's request.
* Rendering the links from the Client Component, which is what lets it mark one, is an architectural
  change, recorded in ADR-009.

### Risks

* **A section chosen near the foot of the page can be marked as the last one.** When the page cannot
  scroll far enough to bring Education to the clearance, choosing it lands at the foot of the page,
  and Languages is marked. The story asks for exactly that at the foot. In every window measured on
  #133 Education does reach the line: its top is 51px above the top of the window at 1536 by 864.
  A taller window, or a shorter Languages section, would change that.
* **Layout that moves without a scroll or a resize is not seen until the next one**, such as a font
  that finishes loading. The fonts are preloaded, per DDR-023, so this has not been observed.

## Related Documents

* docs/decisions/design-decisions/DDR-033-contents-links-without-underline.md, which this amends
* docs/decisions/design-decisions/DDR-010-career-page-redesign-structure.md and
  DDR-031-sticky-contents-bar.md, whose "no current-section state" this supersedes
* docs/decisions/design-decisions/DDR-006-career-page-structure.md, which rejected the state first
* docs/decisions/design-decisions/DDR-035-hover-states.md, whose accent and underline offset this
  reuses
* docs/decisions/design-decisions/DDR-041-contents-links-scroll-smoothly.md
* docs/decisions/architecture-decisions/ADR-009-contents-bar-renders-its-links.md
* GitHub issue #133 and Epic #131
