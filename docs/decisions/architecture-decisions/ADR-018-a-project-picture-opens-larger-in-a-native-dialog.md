# ADR-018-A Project's Picture Opens Larger in a Native Dialog, and Script Only Moves It

Status: Accepted

Date: 2026-09-29

**Extends ADR-014 and ADR-017, amends the part of ADR-017 that rejects an overlay, and amends
ADR-007 with the site's third Client Component.** A project's view gains a third piece of state, per
DDR-082: whether its picture is open larger. A native modal `dialog` holds it, opened and closed by
its buttons' `command` attributes (the Invoker Commands API), with no script. The owner also asked
for the picture to grow out of its frame and shrink back into it. That movement is the one thing
that needs script, so it is a third Client Component, `LargerPicture`, and nothing else depends on
it. The other two are `ContentsBar` (ADR-007) and `BusinessCaseSlider` (ADR-015).

## Context

On #246 the picture in a project view's lead frame opens larger over the page and closes again.
Unlike the switch (ADR-014) and the gallery (ADR-017), this is more than a choice. An overlay has
to:
* keep keyboard focus inside itself while it is open;
* leave the view behind unreachable;
* close with Escape;
* return focus to the control that opened it.

The issue asked whether that can be built without script, or needs a third Client Component with a
reason of its own.

The owner then asked for two more things on #246:
* the view behind the picture blurred rather than hidden;
* the picture growing out of its frame as it opens, and shrinking back into it as it closes.

The blur is a stylesheet's. The movement is not: it has to know where the frame is and where the
picture ends up, which only the browser knows once it has laid both out.

ADR-017 rejected the popover API for the gallery because DDR-081 decided against an overlay. DDR-082
now decides for one.

## Decision

**The picture larger is a native `dialog`, opened as a modal by a button with
`command="show-modal"` and closed by one with `command="close"`, each pointing at it by
`commandfor`. Where script runs, `LargerPicture` opens and closes the same dialog inside a view
transition, so the picture moves between the frame and the window.**

### What needs no script

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
* **The blur is the dialog's own `backdrop-filter`**, over a translucent veil, as the contents bar
  draws its own (DDR-031).
* **The view behind does not scroll while it is open.** `html:has(.larger[open])` hides the root's
  overflow and keeps its scrollbar's room, so closing returns the reader to where they were and the
  blurred view does not shift sideways.

### What script adds: the movement

* **`LargerPicture` is a Client Component** (`components/larger-picture.tsx`) holding a frame's
  picture, its control and its dialog. `ProjectView` stays a Server Component and renders it for
  every picture, never for a video.
* **It listens to the dialog's own events**: the cancelable `command` event a button's command
  fires at the dialog, and the `cancel` event Escape fires. Where it moves the picture, it declines
  the browser's default and opens or closes the dialog itself, inside
  `document.startViewTransition()`.
* **The picture carries one `view-transition-name`, `larger-picture`, while it moves**: the frame's
  picture as the browser captures the view before, and the larger picture as it captures the view
  after, or the reverse on closing. So the browser draws one picture growing out of the frame, or
  shrinking back into it, while the rest of the view fades between the page and the veil. Neither
  picture keeps the name once the move is over, so only one element ever has it.
* **The transition's pseudo-elements are styled in `app/globals.css`**, because they belong to the
  root and no module's class reaches them: the duration, and the two pictures covering the moving
  box rather than stretching to it.
* **It moves nothing where the reader has asked for less motion, or where the browser cannot draw
  a view transition.** It leaves the event to the browser, and the dialog opens and closes at once.
  So does Escape where the browser does not let the page decline it.
* **The dialog, its focus handling and its closing are the same with or without it.** Before
  hydration and without script, the picture opens and closes at once, and nothing else differs.

## Alternatives Considered

### The whole overlay as a Client Component that calls `showModal()`

Pros:
* It works in any browser with script, including ones older than the Invoker Commands API.

Cons:
* It does nothing before hydration or without script, where the markup alone opens the dialog.
* The script would own opening and closing, rather than only the movement.

### The movement in a stylesheet alone

Pros:
* No Client Component.

Cons:
* A stylesheet can fade or scale the dialog in place, but it does not know where the frame is on
  screen, so it cannot move the picture from the frame and back. CSS anchor positioning could tie
  the larger picture to the frame, but animating between an anchored and a centred position is not
  yet dependable across the engines the site checks.

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
  control, and the picture has no caption and no veil.

## Consequences

Positive:
* The picture opens and closes before hydration and without script. The browser provides the focus
  handling, inertness, Escape and announcements.
* The movement is the platform's view transition. The script only names the picture and starts
  the transition, and a failure in it leaves the dialog working.
* Adding a picture to a gallery still needs content alone.

Negative:
* **A third Client Component.** Its reason is the movement alone, which no stylesheet can draw. It
  is not a precedent for moving other state into script.
* **A browser older than the Invoker Commands API** (Chromium before 135, Firefox before 144,
  Safari before 26.2) shows the control, and choosing it does nothing. The picture stays in its
  frame, as it was before #246. The stylesheet cannot detect the API to hide the control.
* A type augmentation (`components/invoker-commands.d.ts`) the site must drop once `@types/react`
  carries the two attributes.
* Every picture's dialog is in the markup, most of them hidden, and the page's `html` rule depends
  on the dialog's class.

## Related Documents

* DDR-082, the design; DDR-053 and DDR-081, which it amends
* ADR-014 and ADR-017, the no-script pattern this extends; ADR-007 and ADR-015, the site's other
  two Client Components
* ADR-006, DDR-021 and `components/stylesheets.test.ts`, the rule on what leaves the flow
* DDR-031, the contents bar's blur
* Issue #246, Epic #152
