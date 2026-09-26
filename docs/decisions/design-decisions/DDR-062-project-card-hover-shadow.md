# DDR-062-Project Card Hover Shadow

Status: Accepted

Date: 2026-09-26

**Amends DDR-061 by giving its shadow a second reader.** `--shadow-card-hover`, its ink and its
geometry do not change. DDR-061 said a second reader would need that record amended; this is it.
DDR-020 is not amended again: the site still has four named shadows, not five.

**Adds to DDR-055's lift.** A project card still rises `--project-card-lift` under the pointer and
on keyboard focus, over `--hover-transition`, and only where motion is welcome. Now it also takes a
light shadow all round it. Everything else DDR-051, DDR-054 and DDR-055 decide about the card stands,
including its resting look: white, the hairline edge, `--shadow-raised` and the large radius.

## Context

Since #164, per DDR-055, a project card on the page rises 4px under the pointer. Its resting
shadow, `--shadow-raised`, is a 1px shadow that marks an edge, and it does not change as the card
rises. So the lift reads as the card sliding up rather than coming off the page.

On 2026-09-26 the owner asked, on #184, for a light shadow around a project card while the pointer
is over it or its link has keyboard focus, to match the role cards' shadow from #183 and DDR-061.
#184 asks that whether the shadow is drawn when the reader prefers reduced motion be decided here.

The card's surroundings differ from a role card's in one way that matters: the projects do not
scroll, so nothing clips a shadow, and every card has the design's 20px, `--project-card-space`,
between it and the next card or row. The section's heading is further away still.

## Decision

* **A project card on the page takes `--shadow-card-hover` under the pointer and on keyboard
  focus**, in place of `--shadow-raised`. The rule is written on `.card:hover` and
  `.card:has(.link:focus-visible)`, the same pair DDR-055's lift is written on, so a pointer
  anywhere on the card, or focus on its link, draws both.
* **It is the role cards' shadow, not one of its own**: `0 4px 12px` in the bar's ink at 10%. The
  two kinds of card that lead to a view answer the pointer with the same light. It reaches 12px
  beside and above the card and 16px below it; the lift takes 4px of that back, so below the card's
  resting edge it reaches 12px. All of it stays inside the 20px round every card, so it covers no
  other card and no heading. `app/tokens.test.ts` holds that.
* **With reduced motion preferred, the card still takes the shadow and still does not lift.** A
  shadow is a state, as the accent on the name is, not a movement, so it is written outside DDR-055's
  `prefers-reduced-motion: no-preference` query and appears at once. Where motion is welcome, the
  shadow is added to the card's transition, `translate, box-shadow`, so it comes in with the lift
  over the same 150ms and the two are one change.
* **Paper draws none of it.** `--shadow-card-hover` is already `none` in the print block, per
  DDR-061, and a sheet cannot be hovered or focused.

## Alternatives Considered

### A shadow of the cards' own

Pros:

* The 20px round a project card would allow a softer, wider shadow than the timeline's 12px.

Cons:

* Two cards that lead to a view would answer the pointer in two different lights, which #184 asks
  to avoid, and the site would gain a fifth named shadow for no reader's benefit.

### Draw the hover shadow on top of the resting one

Pros:

* The resting edge would stay drawn under the new light.

Cons:

* At 12px of blur the hover shadow already covers the 1px one, so the second shadow adds nothing
  visible and makes the rule harder to read.

### No shadow when reduced motion is preferred

Pros:

* The card would look exactly as it did for that reader, as DDR-055 kept it.

Cons:

* A shadow does not move, and DDR-035 draws every other hover state for that reader. Leaving it out
  would take the one clear answer the card gives away from the readers who also lose the lift.

## Consequences

Benefits:

* The lift reads as the card coming off the page, and the pointed-at card stands out.
* The project cards and the role cards answer the pointer with the same light.
* Nothing on the page moves: a shadow takes no layout, and the lift is a translation. Paper is
  unchanged.

Tradeoffs:

* `--shadow-card-hover` now has two readers, so a change to it changes both kinds of card.

Risks:

* A larger blur or offset, or a smaller `--project-card-space`, would let the shadow reach the next
  card. `app/tokens.test.ts` holds the reach within the space, as it holds the timeline's.

## Related Documents

* Issue #184, on Epic #152. The matching role-card story is #183, on Epic #170.
* DDR-061, which this amends, and DDR-020, the site's elevations.
* DDR-051, DDR-054 and DDR-055, the project card and its lift. DDR-035, the hover states.
* DDR-015, print.
