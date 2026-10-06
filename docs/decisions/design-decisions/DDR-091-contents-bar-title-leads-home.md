# DDR-091-The Contents Bar's Title Leads Home

Status: Accepted

Date: 2026-10-02

**Amended by DDR-105**: the title is the owner's mark, so its link is named by `aria-label`, "Andreu
Ortega Blasi, home", rather than by its visible text, and under the pointer and on focus the mark
fades rather than taking the accent. Where it leads and what choosing it does stand.

**Amends DDR-049 in one respect**: the site's title in the contents bar is no longer "not a link".
Its words lead where the bar's Home link leads. Everything else DDR-049 decides stands: the title's
words, size, weight, ink and place, the paragraph that holds it, the links' arrangement and the
scroll clearance.

**Amends DDR-075's closing rule in passing**: the menu closes when one of the bar's links is chosen,
and the title is now one of them, though it is outside the menu. A click on the button still is not.

DDR-035's hover, DDR-041's glide, DDR-042's mark, DDR-045's Home link and DDR-050's links back from a
view apply unchanged.

## Context

Issue #276, under Epic #216, asks for the site's title, "Andreu’s site", to take the reader where
Home does. A visitor expects the site's name at the top left to lead home, and on almost every site
it does. Here it was plain text, so choosing it did nothing. On a phone, Home is behind the menu
(DDR-075) while the title is always shown, so getting home took two taps where it could take one.

DDR-049 decided the title would be a paragraph and not a link, because Home already returns to the
top, and #149, the story that added the title, excluded a title link for the same reason. This
reverses that at the owner's request, so it is recorded here rather than built over DDR-049
silently.

The story leaves the title's hover and focus states to the UI Designer, and asks that at rest it look
exactly as it does now.

## Decision

**The title's words are a link to where Home leads: `#top` on the page, and the page's route from a
project's or a role's view. At rest it looks exactly as the title did; under the pointer and on
keyboard focus it takes the accent, as a contents link does.**

### What it does

* **On the page it leads to `#top`, Home's own address.** So it is handled by the code that handles
  every contents link: it glides (DDR-041), with no glide for a reader who asks for less motion or
  who has no script; it holds the mark on its way and marks Home once the page has come to rest
  (DDR-042); and it closes the menu if the menu is open (DDR-075).
* **On a view it leads to the page's route**, as Home does there (DDR-050), without prefetching.
* **It is never marked itself.** Home is the link that names that place, and an underline on the
  title would change how it looks at rest.

### How it looks

* **At rest, as the title always has:** "Andreu’s site", 20.8px bold, in the heading ink, with no
  underline, in the same place. A site's name in the top left corner of the page is recognised as
  the way home without an underline, and in this bar an underline already means "the section you
  are in" (DDR-042).
* **Under the pointer and on keyboard focus: the accent**, `--color-accent`, as a contents link and
  the menu's button take, per DDR-035, over the same 150ms for a reader who has not asked for less
  motion. No underline on hover, for the reason above.
* **Focus:** the base styles' outline, unchanged.

### Where the target is

* **The words, and nothing more.** The paragraph keeps its place and still takes the room the menu's
  button leaves it below the wide breakpoint, but the link inside it stays inline, so the empty
  room beside the words is not a target. A reader reaching for the menu's button who lands short of
  it lands on nothing, as before, rather than being sent home.
* **The link adds no box**, so the bar's height cannot change.

### Its name and order

* **Its accessible name is its visible text**, "Andreu’s site", with no `aria-label`, so a reader
  who says what they see can choose it (WCAG 2.5.3).
* **It comes first in the bar**, before the menu's button or Home, as it does on screen, so it is the
  bar's first tab stop.

### What it costs

Measured against `main` on the built page, every 10px from 300px to 900px and at 1280px, 1536px and
1920px, at the browser's default text size and at 200%:

* **The bar's height is unchanged at every width**: 48.8px at the default text size; 125.6px from
  300px to 370px and 96.8px from 380px at 200%.
* **Nothing scrolls sideways.**
* **No pair of targets fails WCAG 2.5.8, and no two overlap.** The title's link is 133 by 27.2px at
  the default text size, 266.1 by 54.4px at 200% where it takes one line, and 180.3 by 116.8px where
  it wraps onto two (300px to 370px), so it is a 24 by 24 target outright, beside a button that is
  one too. Its words end at least 115.8px before the button at the default text size and 18.7px
  before it at 200%, from 320px.
* **No focused element is hidden behind the bar**: the title is in the bar, and the bar has not
  changed height, so DDR-049's and DDR-075's measurements stand.
* **Paper is untouched**: under print emulation `nav` is not displayed, and every box outside it is
  identical to `main`'s.

## Alternatives Considered

### Keep the title as text (DDR-049)

Pros:

* One link to the top, not two, and nothing to decide about the title's states.

Cons:

* It breaks the convention every visitor brings, and leaves a phone two taps from home.

### Make the whole paragraph the link

Pros:

* A larger target.

Cons:

* Below the wide breakpoint the paragraph fills the bar up to the menu's button, so a tap that just
  misses the button would send the reader home.

### Underline the title on hover

Pros:

* The base styles' way of saying "link".

Cons:

* In this bar the underline marks the section the reader is in (DDR-042), and no other contents link
  underlines on hover. The accent alone is what the bar's other targets do.

### Remove the Home link now that the title leads home

Pros:

* One link to the top.

Cons:

* The story excludes it. Home names the place in words, carries the mark while the reader is in the
  introduction (DDR-045), and is the first thing a reader scanning the links for "Home" finds.

## Consequences

Benefits:

* The site's name works as visitors expect, and on a phone home is one tap away.
* No new token, component or pattern: the bar's own link handling, hover treatment and focus outline
  are reused.

Tradeoffs:

* A screen reader user hears two links to the top in one `nav`, under different names. Both names
  say where they lead.

Risks:

* **A different title changes the target's measurements.** A longer title, a larger step, or text
  beyond 200% narrows the room between its words and the menu's button. Rerun the sweep and the
  2.5.8 measurement after changing any of them.

## Related Documents

* docs/decisions/design-decisions/DDR-049-contents-bar-title.md, which this amends
* docs/decisions/design-decisions/DDR-075-contents-menu-on-a-phone.md, whose closing rule now covers the title
* docs/decisions/design-decisions/DDR-045-home-link-in-contents-bar.md
* docs/decisions/design-decisions/DDR-041-contents-links-scroll-smoothly.md
* docs/decisions/design-decisions/DDR-042-current-section-in-contents-bar.md
* docs/decisions/design-decisions/DDR-050-project-view.md
* docs/decisions/design-decisions/DDR-035-hover-states.md
* docs/decisions/design-decisions/DDR-027-target-sizes.md, whose 2.5.8 measurement this reruns
* GitHub issue #276, Epic #216, and issue #149
