# ADR-017-A Project's Gallery Holds Its Choice Without Script

Status: Accepted

Date: 2026-09-29

**Amended by ADR-018 (2026-09-29)**: DDR-082 now opens the picture in the frame larger, as a
native modal dialog opened by the Invoker Commands API, without script; a third Client Component,
`LargerPicture`, only moves the picture as it opens and closes. The gallery's choice is still held
without script. The popover
alternative below was rejected because DDR-081 decided against an overlay; ADR-018 records why a
modal dialog, not a popover, is the overlay.

**Extends ADR-014 to the gallery, and amends nothing.** A project's view gains a second control with
state, per DDR-081: which picture its lead frame shows, and which thumbnail is raised. It gains
**no Client Component**. The state is held by native radio buttons and read by the stylesheet. The
site still has two Client Components, `ContentsBar` (ADR-007) and `BusinessCaseSlider` (ADR-015).

## Context

On #244 a project's gallery becomes a row of thumbnails under its lead picture. Choosing one shows
that picture in the lead's frame, and the chosen thumbnail rises with the picture's name above it.
Which picture is shown is state only the browser has. The issue asked whether the gallery can hold
it without script, or needs a third Client Component with a reason of its own.

The gallery has to work before hydration and without script, reach every picture by keyboard and
by pointer, and announce the choice to assistive technology. A view whose project has no gallery
must render exactly as before.

## Decision

**The pictures are a native radio group, and the stylesheet shows the picture whose radio is
checked and raises its thumbnail. There is no script, no React state and no new Client
Component.**

* **The browser holds the choice.** Each picture, the lead first, is a visually hidden
  `input type="radio"`, sharing one `name`, immediately followed by its `figure`. The lead's is
  `defaultChecked`. The group is a `div` with `role="radiogroup"` and an `aria-label`. Each radio is
  named by its figure's caption through `aria-labelledby`, which names it even though the caption
  is not displayed.
* **The stylesheet shows one picture**, by an adjacent-sibling rule: a figure whose radio is not
  checked is `display: none`. A picture that is not shown is out of the accessibility tree. The
  focus outline is drawn on the figure after the focused radio, by the same rule.
* **The thumbnails are `label` elements** pointing at their radios by `for`. They sit in the row
  below the frame, not beside their radios, so they are not in the tab order. Choosing one checks
  its radio, as any label does.
* **The stylesheet finds the chosen thumbnail by place.** A radio sits beside its figure, not its
  thumbnail, and a stylesheet cannot pair two elements that are not siblings by anything but their
  position. So there is one rule for each position,
  `.pictures:has(.pick:nth-of-type(n):checked) .thumbnail:nth-of-type(n)`, for twelve. Each sets a
  flag, and the pointer sets two more, from which one custom property says which thumbnail is
  raised. `components/project-view.test.tsx` holds every gallery to twelve pictures, so a
  thirteenth fails the suite rather than a thumbnail that never rises.
* **Identifiers are fixed** (`picture-0`, `picture-0-caption`, …). One view is one page, as the
  switch's `name` is.
* **`ProjectView` stays a Server Component.** A project without gallery media renders its lead
  `figure` alone, with no radio, as before.

## Alternatives Considered

### A third Client Component with `useState`

Pros:
* One rule for the chosen thumbnail, however many pictures there are.
* It could pause a playing video when another picture is chosen.

Cons:
* A third Client Component, which ADR-007 asks a reason for, when native controls hold the choice
  and announce it.
* The raised thumbnail would be wrong, or missing, before hydration and without script.

### Radios beside their thumbnails, the figures moved into the frame with `order` or grid placement

Pros:
* Adjacent-sibling rules both ways, and no limit on the number of pictures.

Cons:
* `components/stylesheets.test.ts` rules out both, so that the visual order is the markup order.
  A figure would be read after its thumbnail but drawn above the row.
* Measured on #244: in one flex container with the thumbnails, the figure cannot both fill the
  column and be sure of a line of its own, because of the padding the row's overlap needs.

### The popover API, one popover per picture

Cons:
* DDR-081 decides against an overlay. (DDR-082 later decides for one, and ADR-018 builds it as a
  modal dialog, because a popover is not modal.)

## Consequences

Benefits:
* The gallery works before hydration and without script, and ships no script. Without script the
  chosen thumbnail still rises, because the radio holds the choice.
* The browser provides the keyboard behaviour and the announcements.
* Adding pictures to a gallery is still content alone, up to twelve.

Tradeoffs:
* A figure's radio must stay its previous sibling, and the thumbnails must stay in the pictures'
  order. `components/project-view.test.tsx` holds the markup to both.
* Twelve near-identical selectors, and a limit a content change can meet.
* A raised thumbnail is brought to the front by `z-index` inside a row that isolates it, so it
  cannot rise over the contents bar, the site's other `z-index`.

Risks:
* **Without script, nothing pauses a video that is playing when another picture is chosen.** No
  gallery video exists. If the first one needs this, it is a reason for script, and a new record.
* A browser may restore the checked radio when the reader returns to a view through the history.

## Related Documents

* DDR-081, the gallery's design; DDR-053, which it amends
* ADR-014, the pattern this extends; ADR-007 and ADR-015, the site's two Client Components
* ADR-006 and `components/stylesheets.test.ts`, the rule on reordering
* ADR-004, binary assets
* Issue #244, Epic #152
