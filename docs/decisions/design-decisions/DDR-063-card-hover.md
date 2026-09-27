# DDR-063-One Hover for the Cards That Open a View

Status: Accepted

Date: 2026-09-26

**Amended by DDR-069**, per #200: an education card leads off the site, and it rests raised and takes the same hover as a role's card.

**Amended by DDR-065**, per #191: both cards keep `--shadow-raised` under the pointer and on focus, with a darker `--shadow-card-hover` beneath it. Every other part of the hover is unchanged.

**Amended by DDR-064**, per #189: a role's hover is its column's, so pointing at its dates or its dot sets it off too, and the dates and the dot answer with the card. A project card is unchanged.

**Amends DDR-051, DDR-055, DDR-057, DDR-059, DDR-061 and DDR-062.** A project card on the page and a
role's card in the experience timeline now look and behave exactly alike, at rest, under the
pointer and on keyboard focus:

* **A project card takes the role card's accent edge** under the pointer and on focus.
* **A role's card takes everything else from the project card**: the resting `--shadow-raised`
  (DDR-051), the 4px lift (DDR-055), the transition that brings the edge, the shadow and the lift in
  together (DDR-062), and the focus outline offset outside the edge.

A credential's card leads nowhere, so it gets none of this and stays flat and still. So do the
neighbouring cards at the foot of each view, which already share a hover of their own.

`--project-card-lift` is renamed `--card-lift`, because it now moves both kinds of card. Its value
does not change. No other token is added or changed.

## Context

The page has two kinds of card that open a view of their own. Until #187 they answered the pointer
in different ways:

| | Role card before (DDR-059, DDR-061) | Project card before (DDR-051, DDR-055, DDR-062) |
| --- | --- | --- |
| At rest | Hairline edge, no shadow | Hairline edge, `--shadow-raised` |
| Title or name | Takes the accent | Takes the accent |
| Edge | `--color-border-accent-hover` | Stayed the hairline |
| Shadow | `--shadow-card-hover` | `--shadow-card-hover` |
| Lift | None | 4px, where motion is welcome |
| Timing | Edge and shadow at once | Shadow in over 150ms, with the lift |
| Focus outline | Inside the edge | Outside the edge |

On 2026-09-26 the owner asked, on #187, for the site's hover effects to be standardised. It began as
a request for the project cards to reuse the role cards' effects. Offered the choice, the owner kept
the lift on project cards. After seeing the remaining differences measured, the owner asked for the
lift on the role cards too, and for every difference to be matched. That included the resting look,
where the owner chose to raise the role cards rather than flatten the project cards.

## Decision

* **Both kinds of card rest with a hairline edge, `--shadow-raised` and the large radius, on white.**
  A role's card takes the shadow on `.card:has(.link)`, so a credential's card, which has no link,
  stays flat.
* **Under the pointer and on focus, both take `--color-border-accent-hover`, `--shadow-card-hover`
  and the accent on the title**, and both rise `--card-lift`, 4px.
* **Where motion is welcome, the edge, the shadow and the lift come in together** over
  `--hover-transition`, 150ms, as `translate, border-color, box-shadow`. The title's colour takes the
  same 150ms from DDR-035.
* **With reduced motion preferred, neither card moves and nothing animates.** The edge, the shadow and
  the accent still appear at once. They are states, not movements, so they are written outside the
  motion query.
* **A lifted card keeps a pointer that rests on its old footprint.** Each card's link reaches
  `--card-lift` below the card, as DDR-055 does for project cards, so a pointer in the 4px the card
  has vacated does not drop it.
* **Focus outlines the whole card outside its edge**, at `--focus-outline-offset`, on both. DDR-059
  drew the role card's outline inside the edge because the scrolling row clipped its foot. Since
  DDR-061 the row leaves 16px below the cards, and 12px lie beside each one, so the outline's 4px no
  longer reaches the row's edge.
* **The role card's lift fits inside its row.** It rises into the 20px between the dot and the card,
  `--timeline-card-space`. The hover shadow then reaches 12px above the card's resting edge and 12px
  below it, inside the row's 16px, `--timeline-shadow-room`. `app/tokens.test.ts` holds both.
* **Paper draws none of it.** Both shadows and the hover edge are `none` or transparent in the print
  block, per DDR-015, and a sheet cannot be pointed at or focused. The timeline's print block puts
  out the link's buffer, as the projects' already does.

## Alternatives Considered

### Match the project cards to the role cards: no lift, no resting shadow

Pros:

* The site would have no expressive motion, and the timeline would need no room for a lift.

Cons:

* The owner chose on #187 to keep the lift and put it on the role cards. On a project card the lift
  is also what DDR-055 gives a card whose only resting cue that it is a link is the ink of its name.

### Flatten the project cards at rest instead of raising the role cards

Pros:

* The page would carry one fewer shadow at rest.

Cons:

* The owner chose to raise the role cards. `--shadow-raised` is the site's one elevation for a
  surface that stands off the page, per DDR-020, and both kinds of card are such surfaces.

### Keep the role card's focus outline inside its edge

Pros:

* It could never be clipped, whatever room the row left.

Cons:

* The two cards would still differ on focus, and the row has had room for an outline outside the
  edge since DDR-061. `app/tokens.test.ts` holds that room to the shadow's reach, which is larger
  than the outline's.

## Consequences

Benefits:

* Every card that opens a view answers the pointer, the keyboard and a reduced-motion preference in
  one way, so a visitor learns it once.
* Nothing is laid out again: the lift is a translation, and the edge and the shadows take no space.
  Measured at 320px, 390px, 768px and 1280px with each role card focused and lifted, the page is laid
  out as it was, and neither the page nor the row scrolls vertically.

Tradeoffs:

* `--card-lift`, `--shadow-raised`, `--shadow-card-hover` and `--color-border-accent-hover` each move
  both kinds of card now, so a change to any of them changes both.
* The site's one piece of expressive motion, which DDR-055 kept to the project cards, now also moves
  the role cards.
* The hover edge is 1.99:1 on a card's white and fails WCAG 1.4.11, like every hover edge on the
  site. Nothing depends on it: the accent on the title and the shadow say the same thing, and on focus
  so does the outline.

Risks:

* A longer lift, a larger shadow or a smaller `--timeline-card-space` or `--timeline-shadow-room`
  would let the row clip a lifted role card. `app/tokens.test.ts` fails first.

## Related Documents

* Issue #187, on Epic #152, which records the owner's request and choices.
* DDR-051, DDR-055 and DDR-062: the project card, its lift and its hover shadow.
* DDR-057, DDR-059 and DDR-061: the timeline, the role card and its hover shadow.
* DDR-020, the site's elevations. DDR-035, the hover states. DDR-015, print.
