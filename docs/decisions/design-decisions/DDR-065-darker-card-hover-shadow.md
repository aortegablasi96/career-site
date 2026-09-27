# DDR-065-A Card Under the Pointer Keeps Its Resting Shadow, and a Darker One Beneath It

Status: Accepted

Date: 2026-09-27

**Amends DDR-061, DDR-062 and DDR-063.** Under the pointer and on keyboard focus, a role's card and
a project card on the page draw two shadows:

* **`--shadow-raised`**, the crisp shadow they rest with, which they used to give up on hover;
* **`--shadow-card-hover`**, the soft shadow all round, whose ink is now the heading-dark `#1a1a2e`
  at **18%**, where it was 10%.

Its geometry, `0 4px 12px`, does not change, and nothing else about the hover does: the accent edge,
the accent on the title, the 4px lift, the 150ms transition, and a role's dates and dot, per DDR-064.
At rest both cards are as they were.

## Context

DDR-062 gave a lifted project card `--shadow-card-hover` in place of its resting `--shadow-raised`,
and DDR-063 gave a role's card the same. The soft shadow is wide and pale, so a hovered card lost
the crisp, darker edge of light it had at rest, and its new shadow was faint. The card under the
pointer stood out less than it did before #184.

On 2026-09-27 the owner asked, on #191, for the darker shadow back, keeping every other hover effect,
so that the card being pointed at stands out more. Shown the resting shadow put back under the soft
one alone, which barely differed, the owner chose a clearly darker soft shadow as well.

## Decision

* **A lit card draws `var(--shadow-raised), var(--shadow-card-hover)`.** The crisp shadow stays
  where it was at rest, and the soft shadow spreads beneath it. Both are tokens, so the component
  decides neither a length nor an ink. `components/stylesheets.test.ts` now reads a `box-shadow`
  as a list of layers and holds each layer to a token.
* **`--shadow-card-hover` is `0 4px 12px rgba(26, 26, 46, 0.18)`.** It keeps the contents bar's
  hue, so the site's soft shadows still share one ink, at nearly twice the bar's 10%. It is a
  shadow, which carries nothing, so it is held to no contrast ratio, as DDR-020 argued.
* **Its reach is unchanged**, so every measure DDR-061, DDR-062 and DDR-063 took of it still holds:
  it fits the 12px beside a role's card, the row's `--timeline-shadow-room` below it, the 20px
  between a lifted role's card and its dot, and the 20px round a project card. The crisp layers reach
  1.5px, well inside all of them.
* **Reduced motion and paper are as before.** The shadow is a state, written outside the motion
  query, so a reader who prefers less motion gets it at once. Both tokens are `none` in print.

## Alternatives Considered

**Put back the resting shadow alone.** This is literally the look before #184. Measured in Chromium
at 1280px, the crisp 1px layers add almost nothing under a 12px soft shadow, and the owner chose a
clearly darker one on #191.

**A 25% ink.** Offered to the owner. It reads as a card floating well off the page, a different
elevation from the rest of the site's light shadows.

**A larger or longer shadow.** It would reach past the 12px beside a role's card or the room the row
leaves below it, and the scrolling row would clip it. Darkening the ink draws more without reaching
further.

**A new token for the lit card's two layers.** It would be a fifth elevation that only restates two
that exist. Listing the two tokens says what the card does: it keeps its resting shadow and adds one.

## Consequences

* The card under the pointer stands out plainly from the cards beside it, on the page's two surfaces.
* `--shadow-card-hover` is no longer in the bar's exact ink, only its hue. `app/tokens.test.ts`
  holds the hue to the bar's and the ink to 18%.
* A change to `--shadow-raised` now changes the hovered cards too, as it already changes the resting
  ones.
* The neighbouring cards on the views, which keep their own hover, and every other raised surface
  are unchanged. Paper is unchanged.

## Related Documents

* #191, on Epic #152.
* DDR-061, whose shadow this darkens. DDR-062, whose "in place of its resting one" this reverses.
* DDR-063, the one hover both cards share. DDR-064, a role's column as one target.
* DDR-020, `--shadow-raised`, and why a shadow is held to no contrast ratio.
* DDR-034, the contents bar's shadow, whose hue this keeps. DDR-015, print.
