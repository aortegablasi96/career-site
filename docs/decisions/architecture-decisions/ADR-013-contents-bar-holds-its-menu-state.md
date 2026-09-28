# ADR-013-Contents Bar Holds Its Menu State

Status: Accepted

Date: 2026-09-28

**Amends ADR-007 and ADR-009** in one respect: what the site's one Client Component is for. Under
ADR-007 and ADR-008 it exists for the scroll: marking the current section and making a contents
link's scroll glide. Under this record it also holds one piece of local state, whether its menu is
open below the wide breakpoint, per DDR-075. It is still the one Client Component, `Contents` is
still a Server Component, no library is added, and the page still works without script.

## Context

DDR-075 collapses the contents bar behind a menu on a phone (#221). The menu has to open and close
on a click, close on Escape, on a click outside the bar and when focus leaves it, and tell assistive
technology whether it is open. All of that is state that only the browser has.

The issue asked the Architect to confirm whether this is within ADR-009's boundary. The boundary
itself does not move: `ContentsBar` already renders the bar, its title and its links, and the
button is one more element in what it renders. What moves is ADR-007's reason, which was scrolling
alone. ADR-007 says its reason "is not a precedent for the next one", so the new reason is recorded.

## Decision

**`ContentsBar` holds whether its menu is open, in React state, and renders the button that
toggles it.**

* **One `useState`**, closed on the server and on hydration, so the static HTML is the closed menu.
  `useId` ties the button's `aria-controls` to the list.
* **The stylesheet draws the state from `aria-expanded`**, as it draws the current section from
  `aria-current`, so what is drawn is what assistive technology is told. No class is toggled.
* **Closing is handled where the events already arrive.** The bar's existing `onClick` also closes
  the menu when a link was chosen, through `choseLink`, a plain function tested in Node as the
  others are. `onKeyDown` handles Escape and `onBlur` handles focus leaving. A document
  `pointerdown` listener is added only while the menu is open, for a click outside the bar.
* **A reader without script needs none of it.** The stylesheet lays the links out in the bar under
  `@media (scripting: none)`, and the tokens count the title's row in the clearance there, so the
  bar is exactly what it was before the menu.
* **No DOM test environment is added.** The event handlers are thin, `choseLink` is tested with a
  stubbed `Element`, the rendered markup is tested on the server, and the behaviour is checked in a
  browser, as the glide's was.

## Alternatives Considered

### A second Client Component for the menu

Pros:
* `ContentsBar` stays about scrolling alone.

Cons:
* The button and the list it opens are in the same bar, and the list is already rendered by
  `ContentsBar`, per ADR-009. A second component would have to own the list too, or reach into the
  first one's markup, and the site would have two Client Components for one `nav`.

### CSS alone, with a checkbox or `:target`

Pros:
* No script and no state.

Cons:
* A checkbox is not a button to assistive technology and cannot say the menu is expanded; `:target`
  changes the address and the history. Neither closes on Escape, on a click outside or when focus
  leaves.

### The native `popover` attribute

Pros:
* Opens, closes, handles Escape and a click outside, all without script.

Cons:
* It is placed against the window, not against the bar, so it cannot hang from a bar whose height
  changes with the reader's text without CSS anchor positioning, which is not yet in every browser
  the site supports. DDR-075 records the design side.

## Consequences

Benefits:
* The menu is one more element in a component that already renders everything around it, with no
  new component, dependency or test environment.

Tradeoffs:
* The one Client Component now has two reasons to exist, where ADR-007 had one. A third should be
  recorded as this one was.

Risks:
* Between loading and hydrating, the button is drawn but does nothing.

## Related Documents

* DDR-075, the menu's design
* ADR-001, ADR-007, ADR-008 and ADR-009
* #221, part of Epic #216
