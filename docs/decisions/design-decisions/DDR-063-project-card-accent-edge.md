# DDR-063-Project Card Accent Edge

Status: Accepted

Date: 2026-09-26

**Amends DDR-051, DDR-055 and DDR-062 in one respect.** Under the pointer and on keyboard focus, a
project card on the page now draws its edge in `--color-border-accent-hover`, the colour a role's
card takes under DDR-059 and DDR-061. The card's resting look, which is DDR-051's, is not changed. It
still lifts `--project-card-lift`, per DDR-055, and still takes `--shadow-card-hover`, per DDR-062.
Its name still takes the accent, per DDR-035. No token is added or changed.

## Context

The page has two kinds of card that lead to a view of their own, and until now they answered the
pointer differently:

| Under the pointer or on focus | Role card (DDR-059, DDR-061) | Project card (DDR-055, DDR-062) |
| ----------------------------- | ---------------------------- | ------------------------------- |
| Title takes the accent        | yes                          | yes                             |
| `--shadow-card-hover`         | yes                          | yes                             |
| Edge in the accent's hover    | yes                          | no, stays the hairline          |
| Lifts 4px                     | no                           | yes, where motion is welcome    |

On 2026-09-26 the owner asked for the site's hover effects to be standardised, with the project
cards reusing the experience cards' effects. Asked whether that meant giving up the lift, the owner
chose to keep it on the project cards. So the only difference left to close is the edge. That work
is #187, on Epic #152.

The neighbouring cards at the foot of a project view and a role view already share one hover: the
accent's hover edge, the hover surface and the accent ink. They are not part of this change.

## Decision

* **A project card on the page draws its 1px edge in `--color-border-accent-hover` under the pointer
  and on keyboard focus.** The rule is the one DDR-062 already writes, on `.card:hover` and
  `.card:has(.link:focus-visible)`, so a pointer anywhere on the card, or focus on its link, draws
  the edge, the shadow and the accent together. On focus, the focus outline is drawn as well.
* **The edge is a state rather than a movement**, so like the shadow it is written outside DDR-055's
  `prefers-reduced-motion: no-preference` query. A reader who prefers less motion gets the edge and
  the shadow at once, and no lift.
* **Where motion is welcome, the edge joins the card's transition**, which becomes
  `translate, border-color, box-shadow` over `--hover-transition`. The edge, the light and the lift
  therefore arrive as one change. A role's card takes its edge at once, because it has no movement to
  keep pace with. That difference in timing is the lift's, which the owner kept.
* **Only the colour changes, never the width**, so the card is the same size and nothing on the page
  moves.
* **Paper draws none of it.** `--color-border-accent-hover` is transparent in the print block, per
  DDR-015, and a sheet cannot be hovered or focused.

## Alternatives Considered

### Take the lift away, so the two cards match exactly

Pros:

* One hover everywhere, and the site's one piece of expressive motion goes.

Cons:

* The owner chose on 2026-09-26 to keep the lift. It is also what DDR-055 gives a card whose only
  resting cue that it is a link is the ink of its name.

### Give the role cards the lift as well

Pros:

* The two cards would match by adding to one of them rather than taking away from the other.

Cons:

* The timeline's row scrolls and clips whatever reaches past it, and DDR-061 already had to make
  room there for the shadow. A lift would need more room, and #187 leaves the role cards out.

### Leave the edge as the hairline

Pros:

* Nothing changes.

Cons:

* The two kinds of card that lead to a view would keep answering the pointer in two ways, which is
  what the owner asked to end.

## Consequences

Benefits:

* Both kinds of card that open a view take the same edge, light and accent under the pointer.
* The edge takes no space, so layout, wrapping and print are untouched.

Tradeoffs:

* `--color-border-accent-hover` has one more reader, so changing it changes the pills, the
  neighbouring cards, the role cards and now the project cards together.
* The edge is 1.99:1 on a card's white, as it already is on a role's card, where DDR-035 measures it
  at 1.78:1 on the hover surface. Like every hover edge on the site it fails WCAG 1.4.11. Nothing depends on it: the accent on
  the name, the shadow, and on focus the outline, all say the same thing.

Risks:

* None beyond those DDR-062 records for the shadow.

## Related Documents

* Issue #187, on Epic #152. The owner's request and choice are recorded there.
* DDR-051, DDR-055 and DDR-062, which this amends.
* DDR-059 and DDR-061, the role card's hover, which this reuses.
* DDR-035, the hover states, and DDR-025, the colour this edge is drawn in.
* DDR-015, print.
