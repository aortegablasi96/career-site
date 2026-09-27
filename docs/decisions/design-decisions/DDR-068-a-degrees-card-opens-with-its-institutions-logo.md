# DDR-068-A Degree's Card Opens With Its Institution's Logo

Status: Accepted

Date: 2026-09-27

**Amends DDR-066.** DDR-066 gave each role's card its company's logo and said the education
timeline's cards have none. Now both degree cards open with the Universitat Politècnica de
Catalunya's symbol, the roundel without the name beside it, in the style a company's logo has, at
the tall logo's 28px. The two certification cards stay
without a logo for now. Paper does not change.

## Context

On #197 the owner asked for the institutions' official logos on the education cards: the
Universitat Politècnica de Catalunya (UPC) for the two degrees, and the Project Management Institute
(PMI) for the two certifications. They asked that the logos match the experience cards.

The UPC publishes its logo for download on its brand page
(https://www.upc.edu/comunicacio/ca/identitat/descarrega-arxius-grafics/arxius-marca-principal).
The PMI does not allow this use. Its *Trademark Usage Guidelines* (Rev. Jan 2023) say, in §4, "Only
third parties expressly authorized by PMI (i.e., by executed written agreement) may use the PMI
logo". §5 limits the PMP certification logo to business cards and email signatures. The owner chose
to ask PMI for authorization and to ship the UPC's logo alone meanwhile.

## Decision

* **Each degree's card opens with the UPC's symbol**, in DDR-066's style: centred above the
  institution's name, 12px above it, as wide as its own proportions, straight on the
  card's white with no tile. It is hidden from assistive technology, it loads lazily, and it does not
  print. The timeline draws it through the same code path as a role's logo, so the two cannot drift
  apart.
* **The file is the symbol from the UPC's official colour logo**, the positive version in Pantone
  3005 with a white interior. That logo is the "UPC" roundel beside the name "Universitat
  Politècnica de Catalunya · BarcelonaTech". The owner asked on #197 for the roundel without the
  lettering, since the name is written on the card beneath it. The UPC publishes no file of the
  symbol alone, so the roundel is cut from the logo at the blank space between it and the name,
  unchanged: nothing recoloured or redrawn. The file is trimmed to the mark's edges, scaled to 56px
  tall (twice its displayed height, as for the other tall logos) and saved as a lossless WebP at
  `public/education/upc/logo.webp`. Its ground is transparent. The downloaded PNG sits beside it,
  and `.gitignore` keeps it out of the repository. Nothing about the mark is recoloured or redrawn,
  per DDR-044.
* **It is drawn tall, at 28px, `--timeline-logo-height-tall`.** The roundel is square, so at the
  shared 18px it would be far smaller than the wordmarks, as ToBeIT's was. The owner asked on #197
  for it bigger. It is not raised: the degree cards are the row's tallest, and the certification
  cards have no logo to be level with.
* **The certifications have no logo**, until PMI authorizes one. `logo` is optional on a credential
  for that reason, where it is required on a role.
* **An education card is otherwise unchanged.** It still leads nowhere and takes no hover, per
  DDR-059 and DDR-063.

## Alternatives Considered

### The PMI logo on the certifications too

Pros:
* Every card in the row would open with a logo, as the owner first asked.

Cons:
* PMI's guidelines forbid it without a written agreement, and the site is published under the
  owner's name. The owner chose to ask PMI first.

### The full logo, with the name, at 18px

Pros:
* It is the UPC's file exactly as published, and it shipped first on #197.

Cons:
* At 18px its second and third lines, "de Catalunya" and "BarcelonaTech", are unreadable, and the
  name is written on the card beneath it anyway. The owner asked for the roundel alone, bigger.

### PMI's digital badges from Credly

Pros:
* PMI issues them to be shared, on websites among other places.

Cons:
* They are round badges rather than wordmarks, so they would not match the other logos, and only
  the owner can export them. The owner chose to ask PMI instead.

### Logos on neither kind of education card until PMI answers

Pros:
* The row would stay uniform.

Cons:
* The degrees would wait on an answer that has nothing to do with them.

## Consequences

Benefits:
* A reader recognises the university on the education timeline as they recognise the companies on
  the experience timeline.

Tradeoffs:
* The row is uneven until PMI answers: two cards with a logo, two without. Every card in a row is as
  tall as the tallest, so the certification cards grow with the degree cards and their text stays
  centred.
* The UPC's brand defines its mark as the symbol and the logotype together, and publishes no file of
  the symbol alone, so the page shows a part of its mark. The symbol is not altered, and the
  university's full name is written directly beneath it.

Risks:
* A PMI logo, if PMI authorizes one, is the approved artwork PMI supplies, used unaltered. A later
  story adds it and records the authorization.

Measured on the built page in Edge at 320px, 360px, 390px, 768px, 1280px and 1536px, at the
browser's default text size and at 200%: each UPC symbol is 28.5 × 28px (57 × 56px at 200%),
12px (24px) above the institution's name, and inside its card. Nothing scrolls sideways. Printed to
A4 in Edge and Firefox with background graphics on and off: five sheets in both, pixel- and
text-identical to the tree before.

## Related Documents

* #197
* DDR-066: the company logos on the role cards, which this amends and follows
* DDR-057 and DDR-010: the two timelines, one pattern
* DDR-044: a brand's mark is never recoloured
* DDR-015: print
* ADR-004: binary assets as WebP, reached through `asset()`
