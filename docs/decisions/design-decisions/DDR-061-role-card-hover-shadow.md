# DDR-061-Role Card Hover Shadow

Status: Accepted

Date: 2026-09-26

**Amends DDR-020 by adding a fourth named elevation**, `--shadow-card-hover`. DDR-020 named its
one level for what it does, so that a second would be "a decision to take rather than the next
number to reach for". DDR-021 took the second and third, the photo's two lights, and DDR-034 the
bar's edge. This is the fourth. `--shadow-raised`, its ink, its geometry and the eight elements that
read it do not change.

**Adds to DDR-059's card, and to DDR-035's hover for it.** A role's card still takes the accent's
edge under the pointer and on keyboard focus, and its title still takes the accent. Now the card
also takes a light shadow all round it. Everything else DDR-057 and DDR-059 decide about the card
and the row stands. The card still does not rise, which DDR-055 keeps for the project cards.

## Context

Since #176 each role's card in the experience timeline is a link to the role's view, per DDR-059.
At rest the card is white on the page's off-white, with a hairline edge and no shadow. Under the pointer only
two things change: the edge, to `--color-border-accent-hover`, and the title, to the accent. The
edge is a 1px line at 1.78:1, so on a white card it is a small signal.

On 2026-09-26 the owner asked, on #183, for a light shadow around a role's card while the pointer
is over it. It helps show that the whole card is one thing to click and that the pointer is on it.
The matching story for the project cards is #184.

Two things constrain it:

* **The row scrolls sideways, per DDR-057, and a box that scrolls clips anything that reaches past
  it.** A shadow is painted outside the card. The cards' feet sit exactly at the row's foot, so any
  shadow would lose its lower half. The focus outline met the same edge, and DDR-059 draws it inside
  the card for that reason. A shadow cannot be drawn inside and still be a shadow around the card.
* **The design leaves 12px on either side of each card**, `--timeline-entry-inset`, and the space
  between two cards is two of those. A shadow's blur that reaches further than 12px would be cut at
  the ends of the row, and at 24px it would spill onto the next card.

## Decision

* **A role's card takes `--shadow-card-hover` under the pointer and on keyboard focus.** The rule is
  written on `.card:has(.link:hover)` and `.card:has(.link:focus-visible)`, beside the edge's colour
  change, so the shadow and the edge are one state. It uses the same `:hover, :focus-visible` pair
  DDR-035 uses for every hover.
* **The shadow is `0 4px 12px rgba(26, 26, 46, 0.1)`.** Its ink is the contents bar's, the
  heading-dark `#1a1a2e` at 10%, so the site's soft shadows share one ink. Its blur is 12px, so it
  reaches no further than the 12px the design leaves beside a card. It is 4px down, so its weight
  falls below the card, as a light from above would put it. The lengths are in px, as every shadow's
  are.
* **Only a card that leads somewhere is lit.** The rule reads the card's link, so education's cards,
  which lead nowhere, never take it.
* **It appears at once, with no transition**, as the edge's colour does. So nothing on the card
  animates, whether or not the reader prefers reduced motion, and the query DDR-035 uses for
  transitions is not needed.
* **The row leaves room below its cards for the shadow and takes that room back.** It pads its foot
  by `--timeline-shadow-room`, 16px, which is the shadow's offset plus its blur, and takes the same
  amount back with a negative bottom margin, `--timeline-shadow-room-back`. The row's scrolling box
  therefore reaches 16px below the cards, but nothing on the page moves. The negative margin is a
  token because it is arithmetic on a token, which ADR-006 keeps out of a component stylesheet.
  Where the row scrolls, its scrollbar is drawn 16px lower, inside the section's own bottom padding.
  Both timelines share the rule, so both rows' scrollbars sit the same distance below their cards.
* **Paper draws none of it.** `--shadow-card-hover` is `none` in the print block, as every shadow
  is, per DDR-015. The timeline's print block sets the row's padding and margin back to 0, so the
  printed timeline is laid out exactly as before. A sheet cannot be hovered or focused anyway.

## Alternatives Considered

### Reuse `--shadow-raised`

Pros:

* No new elevation. DDR-020's one level would be the card's too.

Cons:

* It is a 1px shadow at 10% that marks an edge. On a white card on the off-white page it
  changes the card less than the edge's colour already does, which is the problem the owner raised.
* DDR-020 uses it for things that are raised at rest. The card is flat at rest and only lit while it
  is pointed at, which is a different state.

### Reuse `--shadow-bar`

Pros:

* The same ink, and no new geometry to justify.

Cons:

* Its 16px blur reaches past the 12px beside a card, so the row would cut it at both ends. It is
  also named for the one element that may read it, per DDR-034.

### Let the row stop clipping

Pros:

* No room to reserve.

Cons:

* `overflow-x: auto` makes the other axis clip too. CSS has no way for a box to scroll sideways and
  let its content spill vertically. Dropping the scrolling would break DDR-057's narrow layout.

### Leave the room as space, with no negative margin

Pros:

* One declaration fewer.

Cons:

* The experience and education sections would each grow by 16px at every width. The story asks
  that nothing else on the page move.

## Consequences

Benefits:

* A role's card answers the pointer with a change a reader can see at a glance, not only a 1px edge.
* Keyboard focus draws the same shadow, together with the outline, so the two ways of reaching a
  card look alike.
* The page is laid out exactly as before at every width and text size, and so is paper.

Tradeoffs:

* The site has four named shadows where DDR-020 set one.
* The row's scrolling box is 16px deeper than its cards. Where the row scrolls, the scrollbar sits
  16px lower than before.

Risks:

* A larger blur, a larger offset or a smaller `--timeline-entry-inset` would clip the shadow again.
  `app/tokens.test.ts` holds the blur to the inset and the room to the offset plus the blur.
* #184 may give the project cards a hover shadow. Whether they read this token or one of their own
  is #184's decision, and a second reader would need this record amended.

## Related Documents

* Issue #183, on Epic #170. The matching project-card story is #184, on Epic #152.
* DDR-020, which this amends, and DDR-021 and DDR-034, the elevations added before it.
* DDR-035, the hover states. DDR-055, the project cards' lift. DDR-057 and DDR-059, the row and
  the card.
* DDR-015, print. ADR-006, the literals a component stylesheet may write.
