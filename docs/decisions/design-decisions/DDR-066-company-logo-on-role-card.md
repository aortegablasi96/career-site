# DDR-066-A Role's Card Opens With Its Company's Logo

Status: Accepted

Date: 2026-09-27

**Amends DDR-057.** On screen, each role's card in the experience timeline opens with its company's
logo in a small tile, centred above the company's name. Nothing else about the card, the timeline
or the printed CV changes. The education timeline's cards have no logo.

## Context

On 2026-09-27 the owner added a `CompanyLogo` node to every role's card in the Figma layer
`career-site-main` (286:2): nodes 286:87, 286:110, 286:133, 286:156 and 286:179, in the experience
section 286:65. Each is a 28px square tile with an 8px radius, a white fill, a `#e2e8f0` hairline
and a light shadow, centred at the top of the card, 6px above the company's name. Inside it the
layer draws the company's initial in the accent, which is a placeholder.

The owner asked, on #193, for that tile on the page with each company's real logo in it, and for
nothing else in the layer to be adopted: the layer's card also differs from the page in its type
sizes and inks, and those stay as the DDRs leave them. The owner supplied the five logos. Every one
is a wordmark or a mark beside a wordmark, from 1.4:1 (ToBeIT) to 4.8:1 (Randstad) wide.

## Decision

* **The tile is the design's height, and as wide as the logo.** It is 28px tall: an 18px logo,
  `--timeline-logo-height`, padded by `--space-x-small` above and below inside a 1px edge.
  Across, it pads the logo by `--space-small`. The owner chose on #193 to let the width follow the
  logo, because a 28px square would shrink a wordmark past reading: Randstad's would be under 5px
  tall.
* **It is drawn as the design draws it, from the site's tokens**: `--color-surface-card`, a 1px
  `--color-border` edge and `--shadow-raised`, the site's one elevation. The design's 8px radius
  falls between DDR-013's 4px and 12px, and the tile takes `--radius-small`, because a 12px radius
  on a 28px box is nearly a capsule. DDR-013 keeps its three radii.
* **It stands first on the card, centred**, and the card's own gap, `--space-x-small`, is the space
  below it, where the design has 6px. The card's text, spacing and states are unchanged, and the
  tile rises with the card under the pointer, per DDR-063.
* **The logo is the owner's file, in the brand's own form and colours**, per DDR-044's rule that a
  brand's mark is never recoloured. It is scaled to the tile's height, and to the card's width
  where a card is narrower than the logo, and never cropped or distorted.
* **It is hidden from assistive technology.** The company's name is written directly beneath it, so
  the logo says nothing a reader would miss: its `alt` is empty, and a screen reader reads the card
  as it did before. The card's link, and so its accessible name, is still the title.
* **It is lazy.** The timeline is below the fold, and an eager image is one React also asks the
  browser to preload, ahead of the introduction's photo.
* **It does not print.** The printed CV is DDR-057's vertical timeline, with the company's name
  beside each entry, and the tile takes no box on paper, so no sheet moves.
* **Each logo is one WebP**, per ADR-004, at `public/experiences/<slug>/logo.webp`, beside the
  owner's PNG original, which `.gitignore` keeps out of the repository. Each file is the original
  trimmed to its mark, at twice the displayed height, 36px, and lossless. Ponera Group's original
  had a white ground. The owner asked for it to be taken out, so it was converted to transparency
  by colour-to-alpha, which draws the same on white.

## Alternatives Considered

### The design's 28px square

Pros:
* Exactly the layer's tile.

Cons:
* Each wordmark shrinks to the square's width. Randstad's would be 4.6px tall and ABB's 9px, which
  is illegible, so the logo would be a smudge above the name.

### Square symbols in place of the wordmarks

Pros:
* Keeps the square.

Cons:
* Two of the five companies, ABB and ToBeIT, have no symbol apart from their wordmark, and cutting
  a symbol out of a logo alters the brand's mark. The owner supplied wordmarks.

### The initial, as the layer draws it

Pros:
* Needs no files and matches the layer exactly.

Cons:
* The owner drew it as a placeholder and asked for the real logos.

## Consequences

Benefits:
* A reader recognises a company by its logo before reading its name.
* The card, its states and the printed CV are otherwise exactly as they were.

Tradeoffs:
* The tiles differ in width from card to card, where the design's are one square.
* EDP's and ToBeIT's logos carry small secondary text, the company's full name and a tagline, which
  is unreadable at 18px. That is the logos' own form, and a simpler file from the owner would read
  better.
* The site has more raised elements than DDR-020's eight: five tiles join the cards DDR-063 raised.

Risks:
* A logo much wider than Randstad's 4.8:1 would be scaled down to the card's width and read smaller.
  Check a new logo in the narrowest card, 192px, at the default text size and at 200%.
* A new role needs a logo, since `Role` requires one, and `components/experience.test.tsx` checks
  that its file exists.

## Related Documents

* #193, and Epic #170
* DDR-057: the horizontal timeline, which this amends
* DDR-063: the role card's hover, which the tile moves with
* DDR-044: a brand's mark is never recoloured
* DDR-013: the three radii
* DDR-020: the site's one elevation
* DDR-015: print
* ADR-004: binary assets as WebP, reached through `asset()`
