# DDR-090-Elements Appear as the Reader Scrolls to Them

Status: Accepted

Date: 2026-10-01

**Amends DDR-063's account of the site's expressive motion**, per #274. Until now the card lift
(DDR-055, DDR-063) was the site's one piece of expressive motion, and it moved only when the reader
pointed at or focused a card. Elements now also appear as the reader scrolls to them: motion that
plays without being asked for. Everything else in DDR-063 stands.

## Context

The owner asked on #274, under Epic #216, for the site's elements to appear as the reader scrolls to
them, and for the appearance to be sudden. A visitor scrolling through the owner's experience and
work should see what they have just reached arrive, without being kept waiting for it.

The story left four choices to the owner, and the owner made them on 2026-10-01:
* which elements appear;
* how they move and for how long;
* whether an element appears again when the reader comes back to it;
* whether to build it with script, which works in every browser, or with CSS alone, which only
  Chromium runs.

It also set limits that no choice may break. Content is never lost to the effect: a reader who
prefers less motion, has no script, prints, uses a screen reader or the keyboard, or lands part-way
down a page sees every element.

## Decision

**What appears: each heading and each item, on its own.** On the page, each section's heading and
each of its items:
* a row of project cards;
* a row of skill groups;
* the languages;
* each timeline's hint;
* the experience and education timelines.

The timeline appears as one row from the wide breakpoint. Below it, each role or credential in the
column appears on its own. On a role's view, the way back, the header, each label, each point, the
skills and the neighbours appear. On a project's view, the way back, the text, the picture and the neighbours
appear. The introduction, the contents bar and the footer never appear this way: what opens a page is
there from the start, and the footer is where the CV's addresses are.

**How: a fade and rise the reader sees.** An element fades in from transparent while rising
`--appear-rise` (8px, twice the card's lift) into place. It takes `--appear-duration` (600ms) with an
ease-out. The owner first chose 200ms, then found the fade barely noticeable and asked for it slower,
so it is slow enough to be seen while still finishing well within a second. It starts the moment any part of it enters the window.
Nothing appears in sequence: elements reached together appear together.

**When: every time the reader comes down to it.**
* An element waits while it is below the window.
* It appears when the reader reaches it.
* It waits again once it leaves through the bottom of the window, so it appears again when the reader
  scrolls back down to it.
* An element that leaves through the top stays shown, so scrolling back up meets the page as it was
  read.

**What is never hidden:**
* Whatever is in the window when a page opens, or when the reader arrives part-way down it, is shown
  at once with no movement. That covers a contents link, a fragment, the back button and a reload.
  So is everything above it.
* An element that takes keyboard focus is shown at once.
* With reduced motion preferred, nothing is hidden and nothing moves, as DDR-014 asks.
* On paper, nothing is hidden and nothing moves, so the printed CV is unchanged (DDR-015).
* Without script, the page is served whole, and nothing is hidden.
* Hiding is by opacity, so a screen reader and find-in-page still reach every element.

**Nothing else moves.** The rise is a translation, so nothing is laid out again and no element
around one that appears moves.

## Alternatives Considered

### Whole sections rather than headings and items

Pros:
* Fewer appearances, so the page feels calmer.

Cons:
* A tall section would have mostly appeared before it is read, and on a phone a section is several
  windows tall. The owner chose headings and items.

### Cards and pictures only

Pros:
* Text never moves.

Cons:
* Headings would be the only parts of the page that did not appear, so the effect would not read as
  one effect across the site.

### A fade alone over 150ms, or a scale and fade

Pros:
* The fade alone is the quietest. The scale is the most sudden.

Cons:
* The fade alone barely registers on a fast scroll. The scale is more playful than the site's
  restraint suits. The owner chose the fade and rise.

### Appear once per visit

Pros:
* Less motion overall. Scrolling back down meets the page as it was left.

Cons:
* The owner chose to see elements appear every time they are reached from above.

### CSS alone, with scroll-triggered animations

Pros:
* No script and no fourth Client Component.

Cons:
* Only Chromium runs it. Firefox 157, which this machine has, does not, so its readers would never
  see the effect. The feature is also new enough that its syntax may still change. ADR-025 records
  the choice of script.

## Consequences

Benefits:
* The page and the views move as the owner wants them to, and the same way everywhere.
* Every reader who could see the whole page before still sees it whole: with less motion, without
  script, on paper, with a screen reader, from the keyboard, and on landing part-way down.

Tradeoffs:
* The site has a second piece of expressive motion, and it plays without the reader asking for it.
* An element reached by find-in-page appears over 600ms after the browser scrolls to it, rather than
  being there already.

Risks:
* An element that is taller than the window and whose top is already below it appears when its top
  enters, not when the reader reaches its middle. Every element on the site is reached top first, so
  this only matters if one becomes taller than the window.
* A new direct child of a container appears on its own. A new wrapper that holds a container appears
  only through its children, and its other children do not appear at all unless it is made a
  container too (ADR-025).

## Related Documents

* #274, under Epic #216
* ADR-025: the Client Component that does it
* DDR-055 and DDR-063: the card lift, until now the site's one piece of expressive motion
* DDR-014: reduced motion and no horizontal scroll
* DDR-015 and DDR-032: the printed CV
* DDR-041 and DDR-042: the contents links' glide and the current section's mark, both untouched
* DDR-057 and DDR-074: the timeline's row and column
