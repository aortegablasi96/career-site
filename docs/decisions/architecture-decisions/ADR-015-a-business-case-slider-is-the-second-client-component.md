# ADR-015-A Business Case Slider Is the Site's Second Client Component

Status: Accepted

Date: 2026-09-29

**Amends ADR-007 as ADR-013 amends it**: `ContentsBar` is no longer the site's only Client
Component. `BusinessCaseSlider` is the second, and this is the reason ADR-001 asks for its
`'use client'`. **Supersedes nothing in ADR-014**: the switch between a project's two accounts is
still native radios read by the stylesheet, and the slider sits inside the business case it shows.

## Context

On #240, part of Epic #152, a project's business case becomes a card that shows one of its items at
a time, per DDR-080. The reader steps through the items with "Prev" and "Next", or goes straight to
one with its dot. Which item is shown is state that only the browser has.

ADR-014 held the switch's state without script, in radio buttons, and said a later need beyond that
"would need script or a route, and a new record". The issue asked the Architect whether the slider
can hold its state the same way, or needs a Client Component. The story asks for every control to be
reached and operated with the keyboard alone, for the item shown to be announced, and for every
item to be readable without script.

## Decision

**`components/business-case-slider.tsx` is a Client Component that holds the index of the item
shown in `useState`. Every item is in the server's markup; the stylesheet draws the one shown, and
without script it draws them all.**

* **The component holds the index and nothing else.** "Prev" and "Next" are buttons that step it,
  looping at the ends, through a pure function, `step`, which is tested in Node. Each dot is a
  button that sets it. No effect, no listener and no timer: nothing runs until the reader presses a
  control.
* **`ProjectView` stays a Server Component.** It renders the slider inside the business case and
  hands it the items and the two control words, which are plain data. Nothing it renders is passed
  through the boundary, so no rendered item is sent twice, as ADR-009 asks of the contents bar.
* **The server renders the first item as shown**, so the page reads the same before hydration and
  after it, and nothing moves when it hydrates.
* **The stylesheet shows the item.** The item shown carries a class; every item sits in the same
  grid cell and the others are `visibility: hidden`. That keeps the card at its tallest item's
  height and takes the rest out of the accessibility tree and the tab order.
  `components/stylesheets.test.ts` admits that `grid-area` in this one stylesheet.
* **Without script, `@media (scripting: none)` puts every item back in the flow and hides the
  controls**, as the contents bar lays its links out for a reader without script, per DDR-075.
* **The switch is untouched.** The business case, slider and all, is still shown and hidden by
  `.text:has(.caseChoice:checked)`, per ADR-014.

## Alternatives Considered

### Radios, as the switch holds its state (ADR-014)

Five radios would hold the item shown with no script, and each dot would be a radio's label.

Pros:
* No second Client Component, and it works before hydration.

Cons:
* "Prev" and "Next" are not a choice among options. The item before and after depends on the item
  shown, so each would be five labels, one per item, with the stylesheet showing the right one.
* A label cannot be focused or pressed from the keyboard, so "Prev" and "Next" would be for the
  pointer alone, and the keyboard would have to use the 6px dots. The story asks for every control
  to be reached and operated with the keyboard.

### `:target`, with a fragment per item

Pros:
* No script, and each item has an address.

Cons:
* Each step adds a history entry and scrolls the page to the item, so the Back button would step
  back through items rather than leave the view. #240 leaves addresses out of scope.

### Scroll snapping, with every item in a row that scrolls sideways

Pros:
* No script for the scrolling itself, and it answers touch.

Cons:
* "Prev", "Next" and the dots still need script to scroll the row and to say which item is shown,
  and a row that scrolls sideways is what DDR-057 allows a timeline alone.

## Consequences

Benefits:
* Every control is a button, so the browser provides the keyboard behaviour and the announcement of
  each control's name.
* A reader without script reads every item, and one with script meets no change on hydration.
* The component holds one number, so there is little to go wrong and little to test in a browser.

Tradeoffs:
* A second Client Component: a view now ships React's client runtime for the slider, as the page
  does for the contents bar. Each view already loads it for the bar.
* ADR-007's line that the bar's reason "is not a precedent for the next one" still holds: this is a
  reason of its own. A third Client Component needs its own record.

Risks:
* The component and its stylesheet agree on `.shown`, and the dots' look on `aria-current`.
  `components/business-case-slider.test.tsx` holds both.
* The items are hidden by `visibility`, so a later style that sets `visibility` on an item's child
  would show it through another item.

## Related Documents

* DDR-080, the slider's design
* Issue #240, part of Epic #152
* ADR-014, the switch, which this leaves as it is
* ADR-001, ADR-007, ADR-009 and ADR-013, the site's Client Components
* DDR-075, the contents bar's `(scripting: none)`
