# DDR-067-Hints Above the Cards

Status: Accepted

Date: 2026-09-27

**Reworded per #291**: the hints read "Open a role…" and "Open a project to read the full description", where they read "Click any…", so they name no input device. Their place and look are unchanged.

**Amends DDR-059, DDR-057 and DDR-051.** The hint above the experience timeline now sits 8px above
the dates, where the reader saw about 73px, and it opens with an information mark instead of the
design's clock. The projects section gets the same hint above its cards. Both timelines' date bands
shrink to one line of dates, where the design gave them 64px. Paper does not change.

## Context

DDR-059 put the hint "Click any role to read the full description" above the experience timeline,
as the Figma layer `career-site-main` draws it (node 170:71): 11px in the faint ink, after a clock,
with the row 24px below it (node 170:186). On #195 the owner asked for two things:

* **Bring the hint closer to its row.** Measured on the built page, the reader saw 73px between the
  hint and the dates. 24px of that was the hint's own space. The other 49px was the top of the
  timeline's date band: DDR-057 sets each date at the foot of a 64px band (`--timeline-date-height`),
  and a date range is one 15px line, so the band left about 41px empty above it, plus 8px of padding
  below it.
* **Put the same hint above the project cards.** Since #154 each project card leads to its view,
  per DDR-051, as each role's card has since #176, but only the experience section said so.

The owner also asked for a circled "i" in place of the clock on both hints. A clock suggests time
or dates, which the timeline already shows, and an information mark says "this is guidance".

## Decision

* **One hint pattern, used twice.** `components/hint.tsx` and `hint.module.css` hold what
  `experience.module.css` held: 11px in the faint ink, the mark 1em square and `--space-small` from
  the words, and hidden on paper, where the space below it goes too. The experience section and the
  projects section both render it. The mark is still hidden from assistive technology, so each
  hint is read as its sentence alone, and it adds no tab stop.
* **The information mark replaces the clock.** It is a line drawing on the icons' 24-unit grid, the
  clock's circle with an "i" inside it, in `currentColor`. The clock is removed.
* **What follows a hint stands `--space-small`, 8px, below it**, where DDR-059 set the design's
  24px. `--timeline-hint-space` is removed: 8px is a step of DDR-013's scale, and the space is no
  longer the timeline's alone.
* **The date band is one line of dates**, `calc(var(--font-size-xxxx-small) *
  var(--line-height-body))`, in both timelines, where it was the design's 64px. The owner chose on
  #195 to shrink it in both rather than in experience alone. The dates still sit at the foot of the
  band with `--space-small` below them, and the dots are still level, because every date range sets
  on one line: the column is in rem, so it grows with the text. The link's box, per DDR-064, is
  measured from the token, so it still reaches the top of its column.
* **The projects hint reads "Click any project to read the full description"**, in the experience
  hint's words. It is `hint` on `Projects` in `content/projects.ts`. It stands between the heading
  and the first row of cards, and it and that row are one element, so the section keeps both with
  its heading, per DDR-008, and the section's heading step stays above the hint.

## Alternatives Considered

### Only the hint's own space, from 24px to 8px

Pros:
* One value changes, and the design's date band stays.

Cons:
* The reader would still see 57px, because most of the gap was the band's empty top. That was
  measured on #195, and the owner then chose to shrink the band.

### Shrink the date band in experience alone

Pros:
* Education keeps the design's band.

Cons:
* The two timelines would stop being one pattern, which DDR-010 makes them. Education has no
  hint, so without the band its dates would stand 89px below its heading, where every other section
  starts its first item 40px below. The owner chose both.

### Keep the clock

Pros:
* It is the design's own mark.

Cons:
* A clock says time. On a projects hint it says nothing, and the owner asked for an information
  mark on both.

## Consequences

Benefits:
* Each hint reads as the caption of the row below it, at 8px, or 16px with text at 200%.
* Both kinds of card that lead somewhere now say so.
* Education's dates start one heading step, 40px, below its heading, as every other section's
  first item does, where they started 89px below.

Tradeoffs:
* The page is shorter: the experience section loses 65px and education 49px from the wide
  breakpoint, and the projects section gains the hint's line and 8px.
* The date band no longer matches the design's 64px (node 170:65).

Risks:
* **The band holds one line of dates.** A date range that wraps would push its own dot down and put
  the dots out of level. None wraps at any width from 320px at either text size, because the column
  and the text both scale in rem. A longer date label, or a larger date size, means checking that
  again.

Measured on the built page in Edge at 320px, 360px, 390px, 768px, 1280px and 1536px, at the
browser's default text size and at 200%: each hint is 8px (or 16px) above the dates or the cards,
the heading step above it is unchanged, nothing scrolls sideways, every date range is one line, and
the dots are level. Printed to A4 in Edge and Firefox, with background graphics on and off: five
sheets in both, **pixel-identical** to the tree before, with identical text and no hint on paper.

## Related Documents

* DDR-059, the hint above the experience timeline, which this amends
* DDR-057, the horizontal timeline and its 64px date band, which this amends
* DDR-051, the project cards, above which the hint now stands
* DDR-064, the role's link box, measured from the date band
* DDR-008 and DDR-015, the heading kept with its first item, and print
* Issue #195
