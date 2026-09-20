# DDR-055-A Project Card Lifts Under the Pointer

Status: Accepted

Date: 2026-09-20

Supersedes nothing. It adds a movement to the card DDR-051 draws, beside the colour change DDR-035
already gives its name.

**DDR-014's rule that nothing depends on hover is not touched, and this record keeps it.** So is
DDR-035's rule that keyboard focus draws everything the pointer draws, which this record follows.
DDR-020's one elevation, DDR-013's radii and DDR-051's card — its surface, edge, radius, resting
shadow, content and ink — are all untouched: this record adds movement and restyles nothing.

## Context

Epic #152 made each project a card that leads to a view of its own, per DDR-051. The whole card is
one link, stretched over it by a pseudo-element, and at rest nothing says so except the ink of the
project's name. Since the cards became the only way to a project's view, that is the section's
weakest point: a visitor's pointer can cross a card without anything telling them it opens.

DDR-035 gave the name the accent under the pointer, which is a real answer but a small one on a
540 by 458px card, and it is at the top of the card rather than where the pointer is.

Issue #164 asks the card itself to answer. It is the site's first piece of expressive motion —
DDR-035's colour change and DDR-041's glide are both in service of something else — and the
projects are where the owner wants it, because they are the work the page asks a visitor to open.
The issue leaves what moves, by how much, over how long and on what easing to this record.

The owner's proposal on #164 was a slight rotation, a few degrees to the right.

### What the measurement said about the rotation

A rotation's sideways growth is `(w·cos θ + h·sin θ − w) / 2` on each side, so it scales with the
card's **height**, which is the dimension that grows most as a reader enlarges their text. Measured
on the built page in Edge 153 at a 320px viewport with the browser's default font size at 200%, a
card is 273 by 995px inside a 16px gutter:

| Rotation | Growth on each side | Against the gutter |
| -------- | ------------------- | ------------------ |
| 1°       | 8.7px               | fits               |
| 2°       | 17.3px              | **overflows**      |
| 3°       | 25.8px              | **overflows**      |

A card that reaches past the gutter puts the page into horizontal scroll, which DDR-014 forbids
from 320px. So the rotation was available but capped at about 1°, with no room left for a future
card that is taller — a longer sentence, a new technology, a larger step.

The owner was given that measurement on #164 and chose the lift instead.

## Decision

**A project card on the page rises by 4px under the pointer, anywhere on it, and on keyboard focus,
over the 150ms every link's colour already takes. It returns to rest when the pointer leaves. A
reader who has asked for reduced motion gets the card exactly as it was.**

* **What moves is the card, and only the card.** It is drawn with the `translate` property, so no
  layout is disturbed: no other card, no heading, no paragraph and no section shifts, and the
  document's height does not change. The picture, the name, the sentence, the tags, the link's box
  and the focus outline all travel with it, because they are the card's own.
* **How far is 4px**, `--project-card-lift`, `0.25rem`. It is a step of DDR-013's scale and is
  written as its own token rather than read from the scale, because it is a distance a surface
  travels rather than a space between two things: nothing is separated by it, and a change to the
  smallest space on the page should not change how far a card moves. In rem, so the movement keeps
  its proportion to the card as the reader's text grows.
* **How long is `--hover-transition`, 150ms, on the browser's `ease`** — DDR-035's, unchanged and
  unextended. The name's accent and the card's movement therefore begin and end together and read
  as one change, the site keeps one hover tempo, and no token is added for the time or the curve.
  DDR-035 already argued the browser's `ease` over a custom curve at this length.
* **The trigger is `.card:hover` and `.card:has(.link:focus-visible)`.** Hover on the card is what
  a pointer anywhere on it already means, since the link is stretched over it. The focus half is
  `:has()` rather than `:focus-within` so that a click, which focuses the link too, does not leave
  the card raised behind the pointer.
* **The movement is written inside `prefers-reduced-motion: no-preference`, not merely its
  transition.** DDR-035 puts only the transition inside the query, because there the change itself
  — a colour — is not motion. Here the change *is* the motion, so a reader who prefers less gets no
  movement at all rather than an instant jump: the card behaves exactly as it did before this
  record, accent and all. This follows DDR-041's precedent of deciding reduced motion in the
  stylesheet rather than in script.
* **The link's box reaches 4px below the card while the lift is available.** A lifted card vacates
  the bottom 4px of its resting footprint, and a pointer resting in that strip would fall off the
  card, drop it and pick it up again for as long as it stayed there. A second pseudo-element on the
  link, `inset: 0 0 calc(-1 * var(--project-card-lift))`, travels up with the card and so reaches
  back down to exactly where the card's edge was. It is the link's rather than the card's so that
  the strip is the link in every respect — the name takes the accent there and a click there opens
  the view. The first pseudo-element still draws the focus outline, at the size of the card.
* **Nothing depends on the movement**, per DDR-014. No content appears, moves into reach or becomes
  readable because of it. A touch screen with no hover loses nothing.
* **Paper is untouched.** The movement needs no print rule, exactly as DDR-035's hover colours
  need none: it is written on `:hover` and `:focus-visible`, and a sheet can be in neither. The one
  print rule is the buffer's: there is no pointer to hold a card under, so it is put out beside the
  stretched box the print block already puts out.

### The token

| Token                  | Value     | Draws                                          |
| ---------------------- | --------- | ---------------------------------------------- |
| `--project-card-lift`  | `0.25rem` | how far a project card rises, and its hit-area buffer |

It is the only length on the site that is a distance travelled, so a second piece of motion is a
decision to take rather than this token to reach for — the same rule DDR-020 wrote for its one
elevation.

### Where it applies, and where it does not

The page's project cards, and nothing else. The neighbour cards at the foot of a project view
(DDR-052), the language cards, the contact pills, the CV control and the contents links keep the
hover DDR-035 gives them. Widening the motion is a decision for another story.

### What was measured

Swept every 10px from 300px to 900px, and at 1195px, 1280px and 1536px, at the browser's default
font size and at 200%, pointing at each of the four cards in turn — 512 card measurements:

* every card rises exactly 4px at the default size and 8px at 200%, and no other card moves;
* nothing scrolls sideways at any width or text size, at rest or with a card lifted;
* the document's height is identical at rest and lifted, so no layout moves;
* no card overlaps another card or reaches past the window's edge;
* no pair of targets fails WCAG 2.5.8 that did not fail at rest — none does either way.

Pointing 2px above a card's resting bottom edge lifts it and holds it there, measured 450ms apart,
rather than oscillating. With `prefers-reduced-motion: reduce` the card does not move at any of
those points, and the name still takes the accent.

Measured again at 320, 360, 390, 560, 894, 1195, 1280 and 1536px at both text sizes, comparing
**every** element on the page outside the pointed-at card, one box at a time: not one of them moved
or changed size, and each card rose exactly 4px, or 8px at 200%, with at least 24px still between it
and the heading or the row above it.

Each card is one tab stop, and the four are consecutive. On focus the card rises, the name takes the
accent, and the outline is still 2px of the accent drawn at the card's own edges. With
`prefers-reduced-motion: reduce` the tab stops, the accent and the outline are all unchanged and
nothing moves.

The built stylesheet was diffed against the one the tree built before this change: it gains the
token, four declarations and the print rule, and **nothing else differs** — no colour, no space, no
radius and no shadow. That is the check that the card was not restyled.

Printed to A4 through WebDriver in Edge 153 and Firefox 156, with background graphics on and off,
and printed again from the tree this branched from: **the same number of sheets, the same text on
each, and every sheet pixel-identical** when rendered, in all four readings. The absolute count
under this recipe is six in both browsers, where DDR-054 records five; it is six on the tree before
this change as well, so it is the measuring recipe that differs, not the page, and nothing here
moves it.

## Alternatives Considered

### Option A: a rotation of a few degrees to the right — the owner's proposal on #164

Pros:
* Expressive and memorable, and unmistakably deliberate.
* The owner's own proposal.

Cons:
* Capped at about 1° by the measurement above, because the sideways growth scales with the card's
  height and a card is 995px tall at 320px with text at 200%. At 2° the page scrolls sideways,
  which DDR-014 forbids.
* 1° is the whole budget. A longer sentence, a new technology or a larger step makes the card
  taller and eats into it, so the value could not be revisited upward later.
* It slants the name, the sentence, the tags and the picture. #164 asks that the card's picture and
  text stay legible throughout the movement, and rotated text is softer than upright text.

Rejected by the owner on #164, after being shown the measurement.

### Option B: a lift of 4px — **chosen**

Pros:
* It grows nothing sideways at any width or text size, so it has no cap and needs no guard.
* Text and picture stay upright and crisp.
* It says what it means without explanation: the card is a raised object, per DDR-020, and it rises
  further when it is about to be opened.
* It rises into the 20px the design already leaves above every card, so it overlaps nothing.

Cons:
* It is the conventional card hover rather than something of the site's own.
* A lifted card vacates the bottom 4px of its footprint, which needs the hit-area buffer above.

### Option C: both, a 1° rotation and a 4px lift

Pros:
* The strongest of the three signals, and it keeps the owner's rotation.

Cons:
* Carries the rotation's slant and its 1° cap as well as the lift's buffer, for a signal the lift
  already gives on its own.

Rejected by the owner on #164.

### A slower curve of its own, around 200–250ms on an ease-out

Pros:
* Movement is often given a little more time than colour.

Cons:
* It adds a token for the time and one for the curve, and the name's accent would finish before the
  card stopped, so the two would read as two changes rather than one.

Rejected by the owner on #164 in favour of DDR-035's 150ms.

### Growing the card, or deepening its shadow, instead of moving it

Pros:
* A stronger shadow is the other half of the conventional lift.

Cons:
* A scale changes the card's size at every edge, so it reaches towards its neighbour and the
  section's edge at every width, and it resamples the picture and the text.
* A second shadow is a second elevation, which DDR-020 makes a decision of its own, and #164
  excludes restyling the card's resting shadow.

### `:focus-within` in place of `:has(.link:focus-visible)`

Pros:
* One less selector feature, and older support.

Cons:
* It is true after a mouse click as well, so the card would stay raised behind the pointer until
  something else took focus. DDR-035 uses `:focus-visible` throughout, and this matches it.

## Consequences

Benefits:
* A visitor's pointer anywhere on a card is answered by the card, not only by the ink of its name
  at the top of it, so the section says that its cards open.
* Keyboard focus draws the movement as well as the accent and the outline, per DDR-035.
* One token, one tempo and one trigger; no new colour, no new elevation and no new curve.
* A reader who has asked for less motion gets the page exactly as it was, and paper is untouched.

Tradeoffs:
* The site now has a piece of motion that is expressive rather than functional, and it is on the
  projects alone, so the page is no longer uniform in how its links answer a pointer. That is the
  point of the story, and this record names where the line is.
* Two pseudo-elements are now stretched over the card, one for the hit area and one for the
  outline, where DDR-051 needed one.
* The owner's rotation was not built.

Risks:
* On a touch screen, a tapped card can keep its hover state — now a 4px lift as well as a colour —
  until something else is tapped. Nothing is hidden or blocked by it, and the tap has already
  opened the view. The same risk DDR-035 records.
* A card that grows much taller does not threaten the lift, which grows nothing sideways; but the
  4px buffer below the link is measured from the token, so changing the token changes both together
  and neither can drift from the other.
* `:has()` is not supported by browsers older than Chromium 105 or Firefox 121. There, keyboard
  focus draws the accent and the outline but no movement, which is the reduced-motion behaviour and
  is the right way to fall short.

## Related Documents

* GitHub issue #164 and Epic #152
* DDR-051, which decides the card, its surface and its stretched link
* DDR-054, which puts every technology on it
* DDR-035, whose 150ms, `ease` and "focus draws what hover draws" this reuses
* DDR-041, the precedent for deciding reduced motion in the stylesheet
* DDR-014, whose rules that nothing depends on hover and nothing scrolls sideways from 320px stand
* DDR-013 and DDR-020, whose radii and one elevation are untouched
* DDR-015 and DDR-032, the printed CV, which is unchanged
