# ADR-018-A Project's Picture Opens Larger Without Script

Status: Accepted

Date: 2026-09-29

**Extends ADR-014 and ADR-017, and amends the part of ADR-017 that rejects an overlay.** A project's
view gains a third piece of state, per DDR-082: whether its picture is open larger. It gains **no
Client Component**. The state is held by a native modal `dialog`, opened and closed by its buttons'
`command` attributes (the Invoker Commands API). The site still has two Client Components,
`ContentsBar` (ADR-007) and `BusinessCaseSlider` (ADR-015).

## Context

On #246 the picture in a project view's lead frame opens larger over the page and closes again.
Unlike the switch (ADR-014) and the gallery (ADR-017), this is more than a choice. An overlay
has to:
* keep keyboard focus inside itself while it is open;
* leave the view behind unreachable;
* close with Escape;
* return focus to the control that opened it.

The issue asked whether that can be built without script, or needs a third Client Component with
a reason of its own.

ADR-017 rejected the popover API for the gallery because DDR-081 decided against an overlay. DDR-082
now decides for one.

## Decision

**The picture larger is a native `dialog`, opened as a modal by a button with
`command="show-modal"` and closed by one with `command="close"`, each pointing at it by
`commandfor`. There is no script, no React state and no new Client Component.**

* **The browser holds whether it is open.** Opened as a modal, the dialog:
  * is drawn in the top layer;
  * makes the rest of the document inert, so focus and assistive technology stay inside it;
  * closes on Escape;
  * returns focus to the button that opened it when it closes.

  Each of those is the platform's, in every engine, rather than ours to maintain.
* **The Invoker Commands API needs no script.** The buttons' attributes are markup. Measured on
  #246, the dialog opens, closes and returns focus with script turned off, in Chromium 153 and
  Firefox 156. It is supported by Chromium from 135, Firefox from 144 and Safari from 26.2.
* **React renders `commandfor` and `command` as written**, since it passes through lowercase
  attributes it does not know. Only its types lack them. `components/invoker-commands.d.ts` adds
  the two to a button's attributes, and nothing else.
* **Each picture carries its own button and dialog**, inside its `figure`. A gallery's figure that
  its radio hides hides its button too (ADR-017), so the one control shown opens the picture shown,
  with no rule pairing them by place.
* **Choosing outside the picture closes it without script**: the close button's `::before` is
  stretched over the dialog, and the picture and caption are positioned over it. The opening
  button's `::after` is stretched over the picture the same way. Both are pseudo-elements taken out
  of the flow, which `components/stylesheets.test.ts` admits (DDR-021). The buttons themselves stay
  in the flow, in the markup's order.
* **The view behind does not scroll while it is open.** `html:has(.larger[open])` hides the root's
  overflow, so closing returns the reader to where they were.
* **`ProjectView` stays a Server Component.** It writes no handler, and
  `components/project-view.test.tsx` holds it to that.

## Alternatives Considered

### A third Client Component that calls `showModal()`

Pros:
* It works in any browser with script, including ones older than the Invoker Commands API.

Cons:
* A third Client Component, which ADR-007 asks a reason for, when markup does the same.
* It does nothing before hydration or without script.

### The popover API (`popovertarget`)

Pros:
* Supported since 2024 in every engine, with light dismiss and Escape.

Cons:
* A popover is not modal: focus can leave it for the view behind, which #246 rules out.

### A `:target` overlay, opened by a link to its fragment

Pros:
* No script and supported everywhere.

Cons:
* It keeps no focus inside itself, does not close on Escape and does not return focus.
* Each opening adds a history entry, so Back closes it rather than leaving the view.

### A link to the picture's file

Pros:
* It works in every browser.

Cons:
* It leaves the view for a bare image. The reader returns through the history rather than a close
  control, and the picture has no caption and no dark ground.

## Consequences

Positive:
* The picture opens larger before hydration and without script, and ships no script.
* The browser provides the focus handling, inertness, Escape and announcements, which a script of
  ours would otherwise have to get right.
* Adding a picture to a gallery still needs content alone.

Negative:
* **A browser older than the Invoker Commands API** (Chromium before 135, Firefox before 144,
  Safari before 26.2) shows the control, and choosing it does nothing. The picture stays in its
  frame, as it was before #246. The stylesheet cannot detect the API to hide the control.
* A type augmentation (`components/invoker-commands.d.ts`) the site must drop once `@types/react`
  carries the two attributes.
* Every picture's dialog is in the markup, most of them hidden, and the page's `html` rule depends
  on the dialog's class.

## Related Documents

* DDR-082, the design; DDR-053 and DDR-081, which it amends
* ADR-014 and ADR-017, the no-script pattern this extends; ADR-007 and ADR-015, the site's two
  Client Components
* ADR-006, DDR-021 and `components/stylesheets.test.ts`, the rule on what leaves the flow
* Issue #246, Epic #152
