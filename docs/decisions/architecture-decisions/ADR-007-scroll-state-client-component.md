# ADR-007-Scroll State in a Client Component

Status: Accepted

Date: 2026-09-18

Applies ADR-001's rule that "`'use client'` requires a reason" for the first time, and records the
reason. It supersedes nothing: Server Components stay the default, no client-side library is
added, and the site stays a static export.

**Amended in part by ADR-008**: the component no longer "knows the scroll position and nothing
else". It also handles a click on its own links, so that a contents link's scroll is smooth, per
DDR-041. It is still the one Client Component, and everything else here stands.

**Amended in part again by ADR-009**: the client boundary. `Contents` no longer passes the links in
as `children`; it passes each section's id and word, and `ContentsBar` renders the list, so that it
can mark the current section's link, per DDR-042. It is still the one Client Component.

**Its first purpose is gone since DDR-048**, per #148: the bar draws its edge at all times, so
`ContentsBar` no longer marks it with `data-scrolled` and the `scripting: none` rule is removed. The
component still reads the scroll position, with the `useSyncExternalStore` subscription decided
here, to mark the current section, per DDR-042 and ADR-009, and it still glides a link's scroll, per
ADR-008. So the reason this record gives — the page needs to know something that exists only in the
browser — still holds, and nothing else here changes.

## Context

Issue #114 adopts the design's scroll-triggered edge on the contents bar: while the reader is at the
top of the page the bar has no visible bottom edge, and once the page has scrolled past 60px it
gains a hairline and a soft shadow, over 200ms. DDR-031 declined this on #98, partly because the
static design file does not draw it and partly because it needs the page to know how far it has
scrolled, which no Server Component can. The owner now wants it, and DDR-034 records that decision.
This record decides how the page learns the scroll position.

Every component on the site is a Server Component. The page already ships Next.js's client runtime,
because ADR-001 accepted that baseline of about 80 to 100 KB; it ships no component code of its own.

The mechanism has to satisfy four things the issue asks for: the edge appears past a threshold rather
than growing with the scroll, the change takes the design's 200ms, the change does not animate when
the reader prefers reduced motion, and the page works without script.

## Decision

**A small Client Component, `components/contents-bar.tsx`, renders the bar's `nav` and marks it with
`data-scrolled` once `window.scrollY` passes the threshold.** The stylesheet draws both states and
the transition between them. The component knows the scroll position and nothing else.

* **`Contents` stays a Server Component.** It renders the list of links and passes it to
  `ContentsBar` as `children`, so the links and their words reach the browser as server-rendered
  markup, not as component code. The client boundary is the band around them.
* **The scroll position is read with `useSyncExternalStore`**, subscribed to a passive `scroll`
  listener on `window`. React re-renders only when the answer changes, not on every scroll event.
  A passive listener cannot hold up scrolling. The server snapshot is `false`, so the static HTML is
  the bar at rest. A page reloaded halfway down gets its edge as soon as it hydrates.
* **No library.** ADR-001 forbids one for a purely presentational effect, and none is needed.
* **Without script, the bar keeps a hairline all the time.** An `@media (scripting: none)` rule in
  the stylesheet draws it. When script is enabled but has not run yet, or has failed, the bar stays
  at rest, which is still a readable bar over its 96% surface.

This is the reason ADR-001 asks for: the page needs to know something that exists only in the
browser. A later Client Component needs its own reason. It is not permission to move rendering to
the client.

## Alternatives Considered

### Scroll-driven animations (`animation-timeline: scroll()`)

Pros:
* No script at all.

Cons:
* It links the change to the scroll position, so the edge fades in across a range of scroll rather
  than switching at 60px over 200ms. A step at the threshold loses the transition, and a transition
  cannot be triggered by an animation.
* Firefox 156 does not support it. On #114, `CSS.supports('animation-timeline: scroll()')` returned
  false there and true in Edge 153. So Firefox readers would never get the edge, which falls short
  of the design in one of the two browsers the site is checked in.

### Scroll-state container queries (`@container scroll-state(scrollable: top)`)

Pros:
* It is a real state change, so a transition works, with no script.

Cons:
* Only Chromium supports it. Measured on #114, Firefox 156 does not.
* It switches as soon as the page has scrolled at all, not at the design's 60px.
* `components/stylesheets.test.ts` refuses `@container`, so it would need an exception of its own.

### An `IntersectionObserver` on a sentinel element 60px down the page

Pros:
* No scroll listener.

Cons:
* It adds an empty element to the markup to measure something the window already reports. With a
  passive listener and a snapshot that only re-renders on change, the observer saves nothing.

### A script that sets an attribute on `<html>` outside React

Pros:
* The bar could stay a Server Component.

Cons:
* It changes the DOM outside React, in an inline script that has no module, no type checking and no
  test. A Client Component is how this project's framework says to do it.

### Keep declining it, per DDR-031

Pros:
* The site keeps no component code on the client.

Cons:
* The owner has decided the design prevails, and asked for this behaviour on #114.

## Consequences

Positive:
* The bar behaves as the design's does in every browser the site supports.
* The client code is one hook and one attribute. The component's two functions are tested in Node
  with a stubbed `window`, so no DOM test environment is added.
* The static HTML still contains every link, and the page is fully usable before or without script.

Negative:
* The site now ships component code of its own, a few hundred bytes on top of the runtime ADR-001
  already accepted. A future Client Component should not treat this record as precedent.
* The bar's edge depends on hydration. If the client runtime fails to load, the bar stays at rest,
  which the design draws at the top of the page, even when content is scrolling beneath it.
* A static server that sends JavaScript without `charset=utf-8` makes Firefox decode the chunks
  wrongly and skip hydration. This was measured on #114 against Python's `http.server`. GitHub Pages
  sends the charset, so the live site is unaffected, but a local check has to serve `out/` the same
  way.

## Related Documents

* ADR-001, which makes Server Components the default and requires a reason for `'use client'`
* DDR-034, the design decision this mechanism serves
* DDR-031, which declined the behaviour on #98
* Issue #114
