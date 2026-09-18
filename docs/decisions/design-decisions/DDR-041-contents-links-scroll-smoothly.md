# DDR-041-Contents Links Scroll Smoothly

Status: Accepted

Date: 2026-09-18

Supersedes nothing. It adds a behaviour to the contents bar DDR-031 draws. Where a section comes to
rest is still DDR-031's clearance, and the bar's edge is still DDR-034's.

## Context

Epic #131 refines how the contents bar and the contact pills behave. Issue #132 is its first story:
choosing a link in the contents bar should scroll the page smoothly to its section rather than jump
there. A jump swaps one screen for another, so a reader loses track of where the section sits
relative to where they were. A short scroll shows the page moving past, which keeps a reader
oriented on a long page.

The story sets five limits. The section must come to rest exactly where it does today, with its
heading clear of the bar. A reader who asks for reduced motion gets today's jump. Keyboard focus,
the `#fragment` in the address bar and the back button behave as they do today. A page opened from a
link that already has a `#fragment` behaves as it does today. And no other scrolling on the page is
animated.

## Decision

**Only the scroll that a contents link starts is smooth, and only for a reader who has not asked
for reduced motion.**

* **The browser still follows the link.** The click is not cancelled and the page is not scrolled
  from script. The only change is that the browser's own fragment navigation runs with
  `scroll-behavior: smooth`. So the address bar gains the `#fragment`, the back button returns to
  where the reader was, and the next Tab starts from the section, exactly as before. The section
  comes to rest at the root's `scroll-padding-block-start`, per DDR-031.
* **The root is smooth only while a contents link has marked it.** `ContentsBar` handles a click on
  any in-page link inside the `nav`, whether it comes from a mouse, a tap or Enter, and sets
  `data-gliding` on the root. It removes the attribute at the first `scroll` event, once the scroll
  has started. `app/globals.css` turns `:root[data-gliding]` into `scroll-behavior: smooth`. If the
  page never scrolls, for example because the section is already in place, a 250ms fallback removes
  the attribute so the next scroll is not smooth.
* **Reduced motion is decided in the stylesheet.** The rule sits inside
  `@media (prefers-reduced-motion: no-preference)`, as every transition on the site does. A reader
  who has asked for less motion, or a browser that does not know the query, gets the jump. The
  script does not check the preference.
* **Its speed and easing are the browser's.** CSS offers no duration for `scroll-behavior`, and
  both browsers scale the scroll to its distance. Measured on #132, the glide took 16 to 39 frames
  in Firefox and 23 to 87 in Edge, depending on distance and width.

This needs `ContentsBar` to handle an event as well as read the scroll position. ADR-007 limited
that component to reading the scroll position, so ADR-008 records the change.

## Alternatives Considered

### `scroll-behavior: smooth` on the root at all times

Pros:
* One declaration, no script.
* It is the common way to do this.

Cons:
* It animates every scroll the browser makes, not only the contents link's. Measured on #132 in Edge
  and Firefox, it also animated the back button, a page opened at `#projects` (which scrolled down
  visibly from the top instead of opening in place), and the scroll that follows keyboard focus down
  the page, in up to 38 frames per Tab. The story rules out all three.

### Scroll from script with `scrollIntoView({ behavior: 'smooth' })`

Pros:
* The glide is fully under the page's control.

Cons:
* The click has to be cancelled, so the script would have to rebuild what the browser already does:
  push the history entry, update the address, fire `hashchange`, and move the point that the next
  Tab starts from. The last one has no API short of focusing the section, which would draw an outline
  that is not drawn today. Each piece rebuilt is a way to fall short of "behaves as it does today".
* It would have to read the reduced-motion preference itself, in a second place.

### Remove the mark on a timer or after a fixed number of frames

Pros:
* No scroll listener.

Cons:
* Firefox starts a fragment scroll a frame or two after the click, and reads `scroll-behavior` at
  that moment. Measured on #132, removing the mark after one frame made Firefox jump in one of three
  clicks. Two frames worked, but with one frame of margin. The first `scroll` event proves the
  smooth scroll has started, so it has no margin to run out of. The timer remains only as a fallback
  for a click that scrolls nothing.

## Consequences

Benefits:
* A contents link now glides to its section in Edge and Firefox, whether chosen by mouse, touch or
  keyboard. Every other scroll on the page is unchanged: the back button, a page opened at a
  fragment, focus-driven scrolling, and the reader's own wheel, keys and scrollbar.
* Without script, and before hydration, the link jumps as it always has. That is the right way to
  fail.

Tradeoffs:
* The site's one Client Component now does two things. ADR-008 records why that is not a second
  component.
* The glide's duration and easing cannot be set, so they differ slightly between browsers.

Risks:
* If a browser started a fragment scroll more than 250ms after the click, it would jump instead,
  which is today's behaviour, not a fault. Neither browser has come close.
* A future in-page link inside the `nav` would glide too. That is intended: the handler reads any
  `href` that starts with `#`, not the five current links.

## Related Documents

* Issue #132 and Epic #131
* DDR-031, whose clearance sets where a section comes to rest
* DDR-034, whose transition is also written only for readers who have not asked for less motion
* ADR-007 and ADR-008, on the Client Component this adds to
