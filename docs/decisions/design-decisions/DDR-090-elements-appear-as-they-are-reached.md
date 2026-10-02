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

The owner then tried the effect and found it barely noticeable at 200ms. They asked for it slower,
then had the Content Strategist and the UI Designer review it. The Content Strategist asked that the
motion lead the eye through the evidence in reading order and never move content already read
again. The UI Designer found why the effect was hard to see: it played at the window's very foot,
where nobody looks, and everything reached together moved as one. The owner accepted every
refinement below.

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

**How: a fade and rise the reader sees.**
* An element fades in from transparent while rising `--appear-rise` (16px) into place.
* It takes `--appear-duration` (600ms) on `--appear-easing`, a curve that moves fast and settles
  slowly. So it is seen, and still finishes well within a second.
* It starts once it has risen a tenth of the way up the window, not at its first pixel, so it plays
  where the reader is looking. An element that cannot rise that far, at the page's end, starts as
  soon as the page is scrolled to its end.

**In reading order: a cascade.** Elements that start together follow one another in reading order,
`--appear-stagger` (80ms) apart. A heading comes before its item, and the second card after the
first. The cascade has four steps at most, so no element waits more than 240ms for its turn. It
stays hidden while it waits.

**When: once per visit.**
* An element waits while it is wholly below the window, and appears when the reader reaches it.
* Once it has appeared it stays shown, so a reader scrolling back to compare two roles meets them
  still.

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

### A fade alone over 150ms, or a scale and fade, or a blur

Pros:
* The fade alone is the quietest. The scale is the most sudden.

Cons:
* The fade alone barely registers on a fast scroll. The scale and the blur are more showy than the
  site's restraint suits. The owner chose the fade and rise.

### Appear every time the reader comes back down

Pros:
* The page moves on every pass.

Cons:
* Content already read moves again each time a reader scrolls back and forth, which recruiters
  comparing roles do. The owner first chose this, then chose once per visit on the Content
  Strategist's advice.

### Start at an element's first pixel, with no cascade

Pros:
* Simpler. Nothing waits for its turn.

Cons:
* The fade plays at the window's foot, where nobody looks, and elements reached together move as
  one. That is why the owner found it barely noticeable.

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
* The last element of a cascade is fully in place about 840ms after it is reached.
* An element reached by find-in-page appears over 600ms after the browser scrolls to it, rather than
  being there already.

Risks:
* An element whose top is below the line appears when its top crosses the line, however tall it is.
  Every element on the site is reached top first, so this only matters if one becomes taller than the
  window.
* A new direct child of a container appears on its own. A new wrapper that holds a container appears
  only through its children, and its other children do not appear at all unless it is made a
  container too (ADR-025).

## Related Documents

* #274, under Epic #216, with the Content Brief and UI Review that refined it
* ADR-025: the Client Component that does it
* DDR-055 and DDR-063: the card lift, until now the site's one piece of expressive motion
* DDR-014: reduced motion and no horizontal scroll
* DDR-015 and DDR-032: the printed CV
* DDR-041 and DDR-042: the contents links' glide and the current section's mark, both untouched
* DDR-057 and DDR-074: the timeline's row and column
