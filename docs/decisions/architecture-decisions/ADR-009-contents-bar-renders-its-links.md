# ADR-009-Contents Bar Renders Its Links

Status: Accepted

Date: 2026-09-18

**Amends ADR-007** in one respect: where the client boundary falls. Under ADR-007, `Contents`
rendered the links and passed them to `ContentsBar` as `children`, so the boundary was the band
around them. Now `Contents` passes each section's id and word as plain strings, and `ContentsBar`
renders the list itself. It is still the site's one Client Component. `Contents` is still a Server
Component, no library is added, and the page still works without script.

**Amends ADR-008** only in that its "The links stay server-rendered" bullet no longer describes the
component. The click handler it records is unchanged.

## Context

DDR-042 has the contents bar mark the link of the section the reader is in with
`aria-current="location"` (#133). Which section that is depends on the scroll position, which only
the browser knows, and `ContentsBar` already reads it, per ADR-007.

A link can only be marked by what renders it. Under ADR-007, `ContentsBar` received the links as
`children`, already rendered on the server. It could not add an attribute to one of them through
React.

The issue asked the Architect to confirm whether this stays within ADR-007 or needs its own record.
It stays within ADR-007's reason, since it is more of the same scroll knowledge in the same
component. It does not stay within ADR-007's boundary, which is why this is recorded.

## Decision

**`ContentsBar` takes `sections`, each an `{ id, link }` pair of strings, and renders the list of
links. It marks the current one with `aria-current`.**

* **It reuses the store ADR-007 set up.** A second `useSyncExternalStore` reads `currentSection`,
  subscribed to the same passive listener, now on `resize` as well as `scroll`. The server snapshot
  is `null`, so the static HTML marks nothing, which is also what a reader without script keeps.
  React re-renders only when the current section changes.
* **`Contents` strips each section to its id and word.** `app/page.tsx` hands `Contents` whole
  section records, and each carries its items as server-rendered React elements. Passed on as they
  are, those items would be serialised again as client props. `components/contents.test.tsx` holds
  the props to the two strings.
* **What becomes client code is the list's markup**, a `ul` with one `li` and `a` per section. The
  words were already in the RSC payload as rendered children under ADR-007; now they are there as
  props. No content module is imported into client code.
* **The click handler also holds the destination**, since the 2026-09-19 revision of DDR-042.
  `ContentsBar`'s `onClick` calls `glide`, per ADR-008, and `holdDestination`, which keeps the chosen
  section marked until the page has stopped scrolling. The destination lives in module state beside
  the store, and a module-level set of listeners lets it tell the bar when it lets go, since that
  happens when nothing scrolls. The bar reads `markedSection`, which is the destination if one is
  held and `currentSection` otherwise.
* **Still tested in Node.** `currentSection` is a plain function that reads `window` and
  `document`, so it is tested with both stubbed, as ADR-007's and ADR-008's functions are. No DOM
  environment is added.

## Alternatives Considered

### Keep the links as children and set `aria-current` on them from script

Pros:

* ADR-007's boundary stays where it was.

Cons:

* It writes to elements React rendered and owns, from outside React. ADR-008 accepted one
  attribute written outside React, on `<html>`, only because React renders nothing there. Here
  React owns every link.

### A second Client Component for each link

Pros:

* `Contents` would keep rendering the list, and each link would read the shared store itself.

Cons:

* Five client boundaries, and a second Client Component, for state the bar already holds. ADR-008
  rejected a second Client Component around the same `nav` for the same reason.

### A class or data attribute on the `nav`, drawn by CSS

Pros:

* The links could stay server-rendered, with the bar marked by something like
  `data-current="skills"`.

Cons:

* CSS cannot match an attribute's value against each link's `href` without one rule per section,
  and the stylesheet would have to know the section ids.
* `aria-current` has to be on the link itself for assistive technology to announce it, which the
  story requires.

## Consequences

Positive:

* The current link is marked through React, with the same store and listener the bar already has.
* The static HTML is unchanged: every link is present and nothing is marked.

Negative:

* ADR-007's boundary, the band around server-rendered links, is gone. The list's markup is now
  client code, a few hundred bytes more.
* The bar now re-renders its five links, rather than one attribute, when the current section changes.
  That is five times on a full scroll of the page.

## Related Documents

* ADR-007, which this amends
* ADR-008, whose click handler is unchanged
* ADR-001, which requires a reason for `'use client'`
* DDR-042, the design decision this mechanism serves
* Issue #133
