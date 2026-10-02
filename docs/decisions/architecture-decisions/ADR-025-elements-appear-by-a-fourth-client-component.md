# ADR-025-Elements Appear by a Fourth Client Component, Over a Page Served Whole

Status: Accepted

Date: 2026-10-01

**Amends ADR-007 with the site's fourth Client Component.** Elements appear as the reader scrolls to
them, per DDR-090, by `ScrollAppear`, which watches them with an `IntersectionObserver`. The other
three Client Components are:
* `ContentsBar` (ADR-007);
* `BusinessCaseSlider` (ADR-015);
* `LargerPicture` (ADR-018).

## Context

#274 asks for each heading and item to appear as the reader scrolls to it. The appearance is timed,
not tied to how far the reader has scrolled. It starts a tenth of the way up the window, elements
reached together cascade in reading order, and each appears once per visit (DDR-090). The issue asked the Architect whether this needs script and, if so, to record why.

Telling when an element reaches the window takes either script or CSS's scroll-linked animations.
Measured on 2026-10-01:
* Edge 154 supports both scroll-driven animations (`animation-timeline: view()`) and scroll-triggered
  ones (`timeline-trigger`).
* Firefox 157 supports neither.
* Every browser has `IntersectionObserver`.

## Decision

**A Client Component, `components/scroll-appear.tsx`, renders nothing.** The root layout holds it,
so it serves the page and both kinds of view. It watches the route afresh each time the route
changes, since the layout stays while a link moves between the page and a view.

**The markup says what appears, through containers.**
* An element carrying `data-appear` is a container. Each of its children appears on its own,
  provided that child neither is a container nor holds one.
* A child that holds a container is left to the inner container's children. That way no element
  appears inside another that is appearing.
* The containers are:
  * a section and its heading's block;
  * the experience and education items;
  * a timeline's block and its column;
  * a view's `article`;
  * a role view's points;
  * a project view's columns.
* Server Components write the attribute, so no component becomes a Client Component for it.

**The script writes one state, `data-appearing`, and the stylesheet decides what it means.**
* The state is `waiting` below the window and `now` while the element appears. It is removed once
  the element has appeared, when it takes focus, and when the route changes.
* The observer's root is the window less its lowest tenth, so an element starts once it crosses
  that line. Whether an element waits is decided on its first sighting alone, against the whole
  window, so nothing the reader can see is hidden. Once an element is shown it is no longer watched.
* Elements that start in one sighting are sorted into reading order, and each carries its place in
  the cascade as `--appear-order`, which the stylesheet turns into a delay.
* A passive scroll listener starts whatever is waiting in the window once the page is scrolled to
  its end, where nothing can rise to the line.
* `app/globals.css` hides and lowers a waiting element, and animates one appearing. It does this
  only under `@media screen and (prefers-reduced-motion: no-preference)`, so reduced motion and print
  are decided in the stylesheet, as DDR-041's glide is.
* `next()` holds the state's rules as a pure function, so they are tested in Node, as `ContentsBar`'s
  are.

**The page is served whole.** The HTML carries no state, so without script, and before the script
runs, every element is shown. Only an element still below the window once the script runs is ever
hidden, so nothing the reader can see disappears.

## Alternatives Considered

### CSS scroll-triggered animations

Pros:
* No script and no Client Component.
* A timed animation, as DDR-090 wants.

Cons:
* Chromium alone. Firefox's readers, and so possibly the owner's, would never see the effect.
* The feature is new, so its syntax may still change.

### CSS scroll-driven animations (`animation-timeline: view()`)

Pros:
* No script. Chromium and Safari run it.

Cons:
* The appearance would be scrubbed by the scroll, so a slow scroll would be a slow fade, which DDR-090
  rules out.
* An element at the foot of the window when a page opens would be half faded.
* Firefox does not run it.

### One Client Component per page

Pros:
* It would not need to watch the route.

Cons:
* Three pages would hold the same component, and each new kind of view would have to remember it.

### A class from a CSS module rather than an attribute

Pros:
* It would match how components style themselves.

Cons:
* The state is written by script onto elements of every component, so no one module owns it.
  `app/globals.css` already styles the root's `data-gliding` and `data-moving` for the same reason.

## Consequences

Benefits:
* The effect works in every browser the site supports. Without script, it costs nothing.
* Which elements appear is decided in the markup, by Server Components, and checked by their tests.

Tradeoffs:
* A fourth Client Component and a little more script on every route. It is one `IntersectionObserver`,
  a passive scroll listener and three document listeners.
* Every element that appears carries its state as an attribute while it waits.

Risks:
* A wrapper added between a container and its children changes what appears. If it holds a container,
  only that container's children appear, and its other children do not.
* Opacity is the only hiding, so nothing is ever removed from the accessibility tree. A future change
  to `visibility` or `display` would break that.

## Related Documents

* #274, under Epic #216
* DDR-090: what appears, how and when
* ADR-007, ADR-015 and ADR-018: the other three Client Components
* DDR-041: reduced motion decided in the stylesheet
