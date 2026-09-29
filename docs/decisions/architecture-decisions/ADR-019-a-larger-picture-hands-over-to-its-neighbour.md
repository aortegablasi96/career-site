# ADR-019-A Larger Picture Hands Over to Its Neighbour by a Command of the Page's Own

Status: Accepted

Date: 2026-09-30

**Amends ADR-018.** A gallery's larger picture can now show the picture before or after it in place,
per DDR-083. Each step control points at its neighbour's dialog by `commandfor`, as the other
controls point at theirs, with a command of the page's own, `--show-in-place`. The neighbour's
`LargerPicture` closes the dialog the control is in, checks its own picture's radio and opens its
own dialog. It stays the site's third Client Component, now with two reasons: the movement, and the
hand-over. Everything else ADR-018 decides stands. So does ADR-017: the gallery's native radio group
still holds which picture the frame shows.

## Context

On #250 the owner asked to move between a gallery's pictures while one is open larger. ADR-018 gives
each picture its own native modal `dialog`, opened and closed by its buttons' commands without
script. ADR-017 holds the frame's picture in a native radio group. Stepping crosses both: the dialog
that is open closes, another opens, and, per DDR-083, the frame's radio follows, so the reader closes
on the frame showing the last picture they saw.

The issue asked whether this stays within `LargerPicture` or needs something else, and what still
works without script.

## Decision

**Each step control is a button with `commandfor` set to the neighbour's dialog and
`command="--show-in-place"`. The browser does nothing with a command that starts with two dashes but
fire the `command` event at that dialog, with the button as its `source`. The neighbour's
`LargerPicture` hears it and hands over: it closes the dialog the button is in, checks its own
radio, focuses its own opening control, opens its own dialog, and gives focus to the control that
stands where focus was.**

### Why the neighbour does the work

* **Each `LargerPicture` already holds its own dialog, its own opening control and its own frame
  picture.** Only its radio is new to it, which the view passes as `steps.choice`. Arriving is then
  all its own: nothing reaches into another component's elements but the dialog the button came
  from, which the event names.
* **The wiring is markup**, by `commandfor`, as ADR-018's is, so the server-rendered HTML says which
  picture each control leads to, and the view's tests read it there.
* **The order matters**, and `swap` holds it:
  1. The open dialog closes. Its figure is still shown, so it closes in place.
  2. The neighbour's radio is checked. The frame shows its picture and the thumbnails follow, by the
     stylesheet alone, as when the reader chooses the thumbnail.
  3. The neighbour's opening control is focused, without scrolling. It is now the one on the picture
     shown.
  4. The neighbour's dialog opens as a modal. The browser records the control focused in step 3 as
     the one to return focus to, so closing it returns focus there, as when the reader opens it.
  5. The control in the new dialog that stands where focus was in the old one takes it: "Next
     picture" for "Next picture".
* **Checking the radio from script fires no `change` event.** Nothing listens for one: the radio
  group is read by the stylesheet (ADR-017).

### The view

* **`ProjectView` stays a Server Component.** It works out each picture's neighbours among the
  gallery's pictures, passing over videos, in a loop, and passes them to `LargerPicture` with the
  place ("3 of 7") and the controls' names.
* **A lone picture gets no `steps`**, and `LargerPicture` renders its dialog as ADR-018 does.

### What script adds

* **The hand-over**, above, inside a view transition where the reader welcomes motion, so the
  browser crossfades the root from one picture to the next. No element is named for it, so the
  `larger-picture` name and the root's `data-moving` stay the movement's alone.
* **The arrow keys**: the dialog's `keydown` presses the step control for that direction, so a key
  and a click take the same path.

### What works without script

* **Opening and closing, as ADR-018 decides**, for every picture. Each dialog still says where its
  picture stands.
* **Not stepping.** A command of the page's own does nothing without script, and no built-in command
  closes one dialog and opens another. So a stylesheet rule, `@media (scripting: none)`, hides the
  two controls, as `BusinessCaseSlider` hides its own (ADR-015).

## Alternatives Considered

### The step control opens the neighbour's dialog with `show-modal`

Pros:
* It works without script.

Cons:
* The dialog it is in stays open underneath. The reader would be two veils deep after one step, and
  Escape or the close control would take them back a picture rather than to the view.

### One dialog per gallery, holding every picture

Pros:
* Stepping would change what the one dialog shows, with no hand-over.

Cons:
* Which picture it shows would be a second piece of state beside the radio group, kept in step by
  script. ADR-018's one dialog per picture, which its figure hides with the picture, would go.
* Each picture's opening control would have to open the dialog at its own picture, which needs
  script too.

### A scroll-snapped strip of pictures inside one dialog

Pros:
* A swipe or a scroll moves between the pictures without script.

Cons:
* It cannot open at the picture chosen without script. DDR-083 also rejects a swipe (Option D).

### The step control's click handler looks up the neighbour by id

Pros:
* No custom command.

Cons:
* The neighbour would be named only in script, so the markup and the tests could not show which
  picture a control leads to.
* The component on the old picture would have to work the new picture's radio, opening control and
  dialog, which are the neighbour's own.

### Labels for the gallery's radios, inside the dialog

Cons:
* The radios are outside the modal dialog, so they are inert while it is open.
* Checking one would not close the dialog that is open.

## Consequences

Positive:
* Stepping reuses the platform's own dialog handling: focus stays inside, the view behind is inert,
  Escape closes, and focus returns to the right control, with no focus management of ours beyond
  the order above.
* The radio group stays the one place that holds which picture the frame shows.
* Adding a picture to a gallery still needs content alone.

Negative:
* **`LargerPicture` has a second reason to be a Client Component.** It is still the only component
  in the gallery with script.
* A component acts on an element outside itself: the dialog the command came from, which it closes.
* `components/invoker-commands.d.ts` admits any command that starts with two dashes, as the platform
  does.

## Related Documents

* DDR-083, the design; DDR-082, which it amends
* ADR-018, which this amends; ADR-017, the gallery's radio group; ADR-015, `BusinessCaseSlider` and
  its `scripting` rule
* Issue #250, Epic #152
