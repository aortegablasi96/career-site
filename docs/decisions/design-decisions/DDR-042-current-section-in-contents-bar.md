# DDR-042-Current Section in the Contents Bar

Status: Accepted

Date: 2026-09-18

**Revised 2026-09-19, at the owner's request, after #133 landed.** Two things changed, and the
record below is the revised decision. The current link is **underlined only**: it no longer takes
the accent. And when a contents link is chosen, the mark moves **straight to that link** and stays
there while the page glides past the sections in between, where it used to pass through each of
them. The accent and the pass-through are kept below, under Alternatives Considered, as what was
first decided and why it changed.

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
current location and underlined, and nothing else about it changes.**

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
* **It follows the page.** The answer is recomputed on every `scroll` and `resize` event, so the
  wheel, touch, the keyboard and a page opened at a `#fragment` all move it the same way.
* **Except on a contents link's journey, when it goes straight to the destination.** Choosing a
  contents link, by pointer or by keyboard, moves the mark to that link at once, before the page
  moves, and holds it there while the page glides past the sections in between (DDR-041). The reader
  asked to go to that section, and marking Projects, Skills and Education in turn on the way to
  Languages says they are somewhere they are only passing through. The mark is let go once the page
  has not scrolled for 100ms, which a glide never pauses for, or after 250ms if the page never
  starts scrolling, the same wait DDR-041 gives the glide. From then on it follows the page again,
  which is where the section has come to rest. A second link chosen on the way takes over. With
  reduced motion the page jumps, so the hold is over as soon as it has begun.

### How it is drawn

* **`aria-current="location"` on the link**, the ARIA value for the current location within a
  set of navigation. Assistive technology announces it as the current location. It is not `page`,
  because every link in the bar points into the same page.
* **The stylesheet draws the attribute, not a class.** `.link[aria-current]` is the only rule that
  marks a link, so what a sighted reader sees is exactly what assistive technology is told.
* **An underline, in the link's own ink, at `--underline-offset`, and nothing else.** It is not
  colour at all, which is the cue DDR-006 asked for. It is the offset a project link's underline
  uses, per DDR-035, so the page has one underline offset. The ink stays the muted ink every contents
  link has at rest, which is 4.44:1 on the page and fails WCAG 1.4.3, as DDR-033 already records for
  every contents link.
* **Nothing that takes space.** An underline does not change a box. The weight stays
  medium, because semibold would widen the word and move every link after it. Measured on the built
  page, the bar's height and every link's position and size are identical at every scroll position.

### What does not change

* **Without script, nothing is marked.** The server renders no `aria-current`, so a reader without
  script gets the bar DDR-031 and DDR-034 describe. With script, the mark is right from the first
  frame after hydration.
* **Paper.** The bar does not print, per DDR-015.
* **Hover and focus.** A current link under the pointer or focused takes the accent like any other
  contents link, per DDR-035, and keeps its underline; the focus outline is the base styles' own.

## Alternatives Considered

### Mark the current link by colour alone

Pros:

* Nothing new is drawn. The accent would be enough for most readers.

Cons:

* The story rules it out, and DDR-006 rejected the state on this ground.
* The accent is also what the pointer draws, so a reader could not tell "here" from "pointed at".

### The underline and the accent — first decided on #133, revised

Pros:

* A second cue, and the one a pointed-at link already takes.
* The current link would pass WCAG 1.4.3, at 5.87:1 on the page, where the muted ink does not.

Cons:

* The owner did not want the colour to change, only the underline. The accent is what a link takes
  under the pointer, so it also blurred "here" with "pointed at". Dropped on 2026-09-19.

### Let the mark follow the page during a glide — first decided on #133, revised

Pros:

* One rule for every kind of scroll, with no state to hold.
* During a glide the reader is, strictly, in each section the page moves past.

Cons:

* A contents link is a request to go to one section. Marking every section on the way flickers
  through the bar and names places the reader never meant to stop at. The owner asked for the mark
  to go straight from where they were to where they chose. Revised on 2026-09-19.

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
* Choosing a contents link moves the mark once, from where the reader was to where they chose.

### Tradeoffs

* The page adds a behaviour the design does not draw, at the owner's request.
* The current link's ink fails WCAG 1.4.3, as every contents link's at rest already does, per
  DDR-033. The accent would have lifted it past, and the owner chose the underline alone.
* The mark is held for as long as the page keeps scrolling. A reader who interrupts a glide with the
  wheel sees the destination marked until they pause for 100ms, and then the section they are in.
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
* docs/decisions/design-decisions/DDR-035-hover-states.md, whose underline offset this
  reuses
* docs/decisions/design-decisions/DDR-041-contents-links-scroll-smoothly.md
* docs/decisions/architecture-decisions/ADR-009-contents-bar-renders-its-links.md
* GitHub issue #133 and Epic #131
