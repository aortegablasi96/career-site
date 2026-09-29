# ADR-017-A Project's Gallery Holds Its Choice Without Script

Status: Accepted

Date: 2026-09-29

**Extends ADR-014 to the gallery, and amends nothing.** A project's view gains a second control with
state, per DDR-081: which picture its lead frame shows, and whether the rest of the thumbnails are
shown. It gains **no Client Component**. The state is held by native radio buttons and a native
disclosure, and read by the stylesheet. The site still has two Client Components, `ContentsBar`
(ADR-007) and `BusinessCaseSlider` (ADR-015).

## Context

On #244 a project's gallery becomes a row of thumbnails under its lead picture. Choosing one shows
that picture in the lead's frame, and a count discloses the thumbnails beyond the first two. Which
picture is shown is state only the browser has. The issue asked whether the gallery can hold it
without script, or needs a third Client Component with a reason of its own.

The gallery has to work before hydration and without script, reach every picture by keyboard and
by pointer, and announce the choice to assistive technology. A view whose project has no gallery
must render exactly as before.

## Decision

**The pictures are a native radio group, and the stylesheet shows the picture whose radio is
checked. The count is a `details` element. There is no script, no React state and no new Client
Component.**

* **The browser holds the choice.** Each picture, the lead first, is a visually hidden
  `input type="radio"`, sharing one `name`, immediately followed by its `figure`. The lead's is
  `defaultChecked`. The group is a `div` with `role="radiogroup"` and an `aria-label`. Each radio is
  named by its figure's caption through `aria-labelledby`.
* **The stylesheet shows one picture**, by an adjacent-sibling rule: a figure whose radio is not
  checked is `display: none`. It needs no `:has()`, and a picture that is not shown is out of the
  accessibility tree. The focus outline is drawn on the figure after the focused radio, by the same
  rule.
* **The thumbnails are `label` elements** pointing at their radios by `for`. They sit in the row
  below the frame, not beside their radios, so they are not in the tab order. Choosing one checks
  its radio, as any label does.
* **The count is `details` and `summary`.** The thumbnails beyond the first two are inside it.
  Their radios are not, so the keyboard reaches every picture whether it is open or not.
* **Identifiers are fixed** (`picture-0`, `picture-0-caption`, …). One view is one page, as the
  switch's `name` is.
* **`ProjectView` stays a Server Component.** A project without gallery media renders its lead
  `figure` alone, with no radio, as before.

## Alternatives Considered

### A third Client Component with `useState`

Pros:
* It could pause a playing video when another picture is chosen, and mark the current thumbnail.

Cons:
* A third Client Component, which ADR-007 asks a reason for, when native controls hold the choice
  and announce it.
* It does nothing before hydration or without script. A reader without script would see the lead
  and nothing else.

### The popover API, one popover per picture

Pros:
* No script, and a picture can be shown larger than the frame.

Cons:
* DDR-081 decides against an overlay. Moving between pictures would need a control in each
  popover.

### `:has()` on the group, as ADR-014 does

Pros:
* The radios could sit inside their thumbnails, which could then mark the checked one.

Cons:
* A rule per picture, because the stylesheet cannot pair the n-th radio with the n-th figure in
  general. The adjacent-sibling rule is one rule for any number.

## Consequences

Benefits:
* The gallery works before hydration and without script, and ships no script.
* The browser provides the keyboard behaviour, the announcements and the disclosure.
* Adding pictures to a gallery is still content alone.

Tradeoffs:
* A figure's radio must stay its previous sibling. `components/project-view.test.tsx` holds the
  markup to it.
* The first thumbnail is drawn over the second by `z-index` inside a row that isolates it, so it
  cannot rise over the contents bar, the site's other `z-index`.

Risks:
* **Without script, nothing pauses a video that is playing when another picture is chosen.** No
  gallery video exists. If the first one needs this, it is a reason for script, and a new record.
* A browser may restore the checked radio when the reader returns to a view through the history.

## Related Documents

* DDR-081, the gallery's design; DDR-053, which it amends
* ADR-014, the pattern this extends; ADR-007 and ADR-015, the site's two Client Components
* ADR-004, binary assets
* Issue #244, Epic #152
