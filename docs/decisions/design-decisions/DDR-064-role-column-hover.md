# DDR-064-A Role's Dates and Dot Answer With Its Card

Status: Accepted

Date: 2026-09-27

**Amends DDR-036, DDR-059 and DDR-063.** In the experience timeline, a role's dates, its dot on the
line and its card are one target:

* **Pointing anywhere in the role's column** — the dates, the dot or the card — shows the hover
  state on all three, and a click there opens the role's view. Keyboard focus on the role shows the
  same state.
* **The card** answers exactly as DDR-063 has it: the accent edge, `--shadow-card-hover`, the accent
  on the title and the 4px lift.
* **The dates** darken from `--color-accent` to `--color-accent-hover`.
* **The dot** takes the card's hover edge on its ring, `--color-border-accent-hover`, where it was
  `--color-border-accent`, and its core darkens to `--color-accent-hover`.
* The dates and the dot change over the card's 150ms where motion is welcome, and at once where it
  is not. Neither moves.

The line between the dots, the other roles and the education timeline do not change. No token is
added or changed.

## Context

Since DDR-057 each role is a column of the row: its dates, its dot on the line and its card below.
Since DDR-059 the card is a link to the role's view, and since DDR-063 it answers the pointer as a
project card does. The dates and the dot above it did not answer at all, so the row read as cards
with loose labels over them, and a pointer on a role's dates did nothing.

The owner asked on #189 that the dates and the dot answer with the card. They chose that the whole
column sets it off, not only the card, and left the look to design.

## Decision

### The whole column is the link

The link is the card's title, and its box has been stretched over the card since DDR-059.
`.link::before` now reaches from the card out to the column's edges: up through the card's edge,
the space above it (`--timeline-card-space`), the dot and its ring, and the dates' band
(`--timeline-date-height` and the `--space-small` below it), and out through the card's edge and
`--timeline-entry-inset` on each side. Where motion is welcome it still reaches the lift below the
card, as DDR-055's buffer did, so a click in the strip a lifted card leaves opens the view.

It stays the link's own box, so the column is still one tab stop, and its accessible name is still
the job title. The columns meet with no gap, so two roles' boxes meet and do not overlap: measured in
Chromium at 390px, 1280px and 1536px, the pixel before a column's edge is its own role's link and the
pixel at it is the next role's.

The box is always drawn, where DDR-055 drew its buffer only where motion is welcome, because it is
now what a click on the dates follows.

### The state is the column's

The rules read `.entry:has(.link):hover`, not the link's `:hover`, for the pointer, and
`.entry:has(.link:focus-visible)` for focus. The card's lift moves the link's box with it, since a
`translate` makes the card the box's containing block. The column itself never moves, so a pointer
on the dates cannot lose the state as the card rises away. Only a column that has a link has the
state, so the education timeline gets none of it.

### The dates and the dot take their colours' hover steps

Every hover on the site answers in one of two ways, per DDR-035: an accent ink darkens to
`--color-accent-hover`, and a pale accent edge takes `--color-border-accent-hover`. The dates and the
dot follow the same rule:

| | At rest | Under the pointer or on focus |
| --- | --- | --- |
| The dates | `--color-accent`, `#4f46e5` | `--color-accent-hover`, `#4338ca` |
| The dot's ring | `--color-border-accent`, `#c7d2fe` | `--color-border-accent-hover`, `#a5b4fc`, the card's hover edge |
| The dot's core | `--color-accent`, `#4f46e5` | `--color-accent-hover`, `#4338ca` |

The dates stay a passing pairing, and a darker one: `#4338ca` is the ink DDR-012 measured at 7.38:1
on the page. The ring is decoration, per DDR-036, and it now matches the card's edge beneath it, so
the dot and the card read as one role.

## Alternatives Considered

**The card alone sets off the state.** The owner considered it on #189 and chose the whole column,
so a reader can point at the dates they are reading and open that role.

**The dot grows.** This was one of the options put to the owner. It is motion, so it would have been
a third thing to leave out under reduced motion. It would also be a size change inside a row that
clips what reaches past it. Colour alone makes the change visible, with no new token and no new
motion.

**The link's own `:hover` sets off the state**, as it did for the card alone. When the pointer is on
the dates and the card rises, the link's box rises with the card. Its top would then have to reach
past the column's top to keep the pointer, and the row clips anything past its edge. Reading the
column's hover needs no reach.

**The line between the dots is lit as well.** Each half of the line belongs to two roles, so lighting
it would light part of a neighbour's. DDR-036 makes the line the row's, not one role's.

## Consequences

* A click anywhere in a role's column opens the role's view. That includes the empty space above
  the dates and beside the card.
* A change to the dates' band, the dot, the space above the card or the card's inset changes how far
  the link's box has to reach. The box is written from those same tokens, and
  `components/timeline.test.tsx` holds it to them.
* If the dates ever grow taller than their band, the top of the column stops opening the view. The
  column still shows the state there, because the state is the column's. Measured at 200% text at
  320px, 390px, 768px and 1280px, the band held the dates at every width.
* Paper is unchanged. A sheet is never pointed at, the link's box is not drawn in print, and the hover
  edge prints as nothing, per DDR-015.

## Related Documents

* #189, on Epic #170.
* DDR-063, whose card hover this keeps, and whose trigger it moves to the column.
* DDR-059, whose link this stretches from the card to the column.
* DDR-036, whose dot gains a hover state. DDR-057 sizes the dot on screen.
* DDR-055, whose buffer below a lifted card the box keeps.
* DDR-035, the hover steps. DDR-018, the dates as a label in the accent.
* DDR-015, print.
