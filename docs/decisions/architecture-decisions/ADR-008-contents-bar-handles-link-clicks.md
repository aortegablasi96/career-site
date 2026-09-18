# ADR-008-Contents Bar Handles Its Links' Clicks

Status: Accepted

Date: 2026-09-18

**Amends ADR-007** in one respect. ADR-007 said `ContentsBar` "knows the scroll position and
nothing else". It now also handles a click on a link inside it, to make that link's scroll smooth.
The rest of ADR-007 stands: it is still the site's one Client Component, `Contents` is still a
Server Component that passes it the links as children, no library is added, and the page still
works without script.

## Context

DDR-041 makes the scroll a contents link starts smooth, and only that scroll (#132). CSS can make
every scroll on the root smooth, but it cannot tell a contents link's scroll apart from the back
button's or from the scroll that follows keyboard focus. Something has to mark the root for the
length of that one scroll, and it has to react to a click, which means script.

ADR-007 says a later Client Component needs its own reason, and that its component is not
permission to move rendering to the client.

## Decision

**`ContentsBar` gets an `onClick` on its `nav`, calling `glide`.** When the click lands on an
in-page link, `glide` sets `data-gliding` on the root. It removes the attribute at the first
`scroll` event after the click, or after 250ms if the page never scrolls. It does not cancel the
click and does not scroll anything itself: the browser follows the link as it always has.
`app/globals.css` makes the marked root smooth, inside the reduced-motion query.

* **The same component, not a second one.** The handler belongs to the `nav` that `ContentsBar`
  already renders, and is about the same subject, the page's scrolling. A second Client Component
  wrapping the same `nav` would add a boundary and gain nothing.
* **The links stay server-rendered.** React delegates the `nav`'s click handler, so it sees clicks on
  the server-rendered links passed in as children. None of their markup or words become client
  code.
* **Tested in Node**, with `window`, `document` and `Element` stubbed, as ADR-007's two functions
  are. No DOM environment is added.
* **It changes the DOM outside React**, one attribute on `<html>`. ADR-007 rejected an inline
  script for doing that, but the objection was to a script with no module, no types and no test.
  This is a typed, tested function in the component that owns the behaviour, and React does not
  render that attribute, so nothing overwrites it.

## Alternatives Considered

### `scroll-behavior: smooth` on the root, with no script

Pros:
* No change to ADR-007 at all.

Cons:
* It animates the back button, a page opened at a fragment, and focus-driven scrolling as well,
  measured on #132. DDR-041 has the numbers.

### Cancel the click and scroll from script

Pros:
* The script decides the scroll.

Cons:
* It would have to rebuild the history entry, the address and the sequential focus starting point
  that the browser's own fragment navigation already provides. DDR-041 covers this.

### A second Client Component around the links

Pros:
* ADR-007's "nothing else" would stay literally true of `ContentsBar`.

Cons:
* Two client boundaries around one `nav`, for one handler. ADR-007's aim, keeping client code small
  and justified, is better served by one component with two small jobs.

## Consequences

Positive:
* The glide is limited to the scroll it is meant for, and the browser keeps doing the navigation.
* The client code grows by one small function.

Negative:
* `ContentsBar` now has two jobs, and its description in ADR-007 is out of date without this record.
* One attribute on the root is written outside React.

## Related Documents

* ADR-007, which this amends
* ADR-001, which requires a reason for `'use client'`
* DDR-041, the design decision this mechanism serves
* Issue #132
