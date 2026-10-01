# DDR-090-A Certification's Card Opens With Its Badge

Status: Accepted

Date: 2026-10-01

**Amends DDR-068.** DDR-068 gave each degree's card the UPC's logo and left the two certification
cards without one, "until PMI authorizes one". PMI has authorized it. Each certification's card now
opens with its own PMI digital badge, in the place a degree's card shows the UPC's logo, drawn at
56px rather than a logo's 28px.

## Context

On #197 the owner asked for the institutions' logos on the education cards. PMI's *Trademark Usage
Guidelines* allow its marks only with its written authorization, so DDR-068 shipped the UPC's logo
alone while the owner asked PMI.

On #272 (2026-10-01) the owner confirmed that PMI has given its written authorization, and supplied
the two badges PMI awarded them, as Credly issues them: the PMP badge and the PMI-CPMAI badge, each
a 680 × 680 PNG with a transparent ground. They are round, with the credential's name lettered
inside them: "PMP" and "PMI-CPMAI" on a label, "Professional Certification" below it, PMI's mark
below that, and the certification's full name around the rim.

DDR-068 had rejected these badges as an alternative, for being round rather than wordmarks like the
other logos, and because only the owner could export them. The owner has now exported them and
asked for them on the cards.

## Decision

* **Each certification's card opens with its own badge**: the PMP card with the PMP badge, and the
  PMI-CPMAI card with the PMI-CPMAI badge. It stands where a degree's card shows the UPC's logo, in
  DDR-066's style: centred above the institution's name, 12px above it, straight on the card's
  white with no tile, hidden from assistive technology, loaded lazily, and not printed. The
  timeline draws it through the same code path as every other logo.
* **It is drawn at 56px, `--timeline-logo-height-badge`**, twice a tall logo's 28px, in rem so it
  grows with the reader's text. A badge carries its name inside a circle, so at 28px it is a
  coloured dot whose lettering cannot be read. At 56px "PMP" and "PMI-CPMAI" can be, and the badge
  weighs about what the UPC's 127 × 28px logo does in the cards beside it. The badge's smaller
  lettering, round its rim, stays too small to read: that is the badge's own form, and the card
  names the certification in full below it.
* **The badge is used exactly as PMI issues it**, per DDR-044: not cropped into another shape,
  recoloured or redrawn. The file is trimmed to the badge's edge, scaled to 112px (twice its drawn
  height, as for the other logos) and saved as a lossless WebP at
  `public/education/certifications/pmp.webp` and `pmi-cpmai.webp`. The owner's PNGs sit beside them,
  and `.gitignore` keeps them out of the repository.
* **A certification names its picture `badge`**, where a degree names its `logo`, and a degree's
  `logo` is now required, as a role's is.
* **PMI's authorization covers these two cards.** A PMI mark anywhere else, in the introduction, a
  view, the footer or the CV file, needs the owner to confirm the authorization covers it first.
* **Nothing else on the card changes.** The card still leads to the badge's page on Credly, per
  DDR-069, and the site embeds none of Credly's own widget or script.

## Alternatives Considered

### The badge at a tall logo's 28px

Pros:
* Every logo in the row would be one height, and the row would not grow.

Cons:
* The badge would be a dot of colour, whose name cannot be read: it would mark the card without
  saying anything.

### The badge at 44px

Pros:
* The row grows by 10px rather than 22px.

Cons:
* "PMP" is just legible and "PMI-CPMAI" is not, and the badges look smaller than the UPC's logo
  beside them.

### PMI's wordmark, as DDR-068 first imagined

Pros:
* A wordmark matches the other logos' form.

Cons:
* The owner asked for the badges PMI awarded them, and supplied those. A badge also says which
  certification it is, where PMI's logo would be the same on both cards.

### Credly's embedded badge

Pros:
* Credly's widget verifies the badge on the page itself.

Cons:
* It loads a script and a frame from a third party, and draws its own card inside ours. The card
  already leads to the badge's page on Credly, where it is verified.

## Consequences

Benefits:
* A reader recognises PMI's certifications at a glance, as they recognise the university and the
  companies, and every card in the row opens with a mark.

Tradeoffs:
* The row is 22px taller on screen: at 1280px every education card is 151px tall, where it was 129px.
  Every card in a row is as tall as the tallest, so the degree cards grow too and their text stays
  centred. Below the wide breakpoint, in the column, only a certification's card grows.
* A badge's rim lettering is not legible at this size.

Risks:
* The authorization is the owner's to keep. If PMI withdraws it, or its terms limit where the badges
  appear, the badges come off and this record is superseded.

The printed CV does not change: paper shows no logo, per DDR-066 and DDR-068.

Measured on the development server in Chromium at 320px, 360px, 390px, 480px, 600px, 767px, 768px,
900px, 1280px and 1536px, at the browser's default text size and at 200%: each badge is 56 × 56px
(112 × 112px at 200%), loaded, and inside its card, and nothing scrolls sideways. The badge is not
a target, and no card's link changes width, so WCAG 2.5.8 is as it was. Printed to A4 in Edge and
Firefox, with background graphics on and off, before and after: five sheets in every case, and the
sheet that holds the education section identical to the pixel.

## Related Documents

* #272, #197
* DDR-068: a degree's card opens with its institution's logo, which this amends
* DDR-066: the company logos on the role cards, whose style this follows
* DDR-069: education cards lead off the site
* DDR-044: a brand's mark is never recoloured
* DDR-015: print
* ADR-004: binary assets as WebP, reached through `asset()`
