# DDR-068-A Degree's Card Opens With Its Institution's Logo

Status: Accepted

Date: 2026-09-27

**Amends DDR-066 and DDR-057.** DDR-066 gave each role's card its company's logo and said the
education timeline's cards have none. Now both degree cards open with the Universitat Politècnica de
Catalunya's logo, in exactly the style a company's logo has. The two certification cards stay
without a logo for now. And every education card's institution is set in the accent, as a company
is, where DDR-057 set it in the muted ink.

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

* **Each degree's card opens with the UPC's logo**, in DDR-066's style: centred above the
  institution's name, 12px above it, 18px tall and as wide as its own proportions, straight on the
  card's white with no tile. It is hidden from assistive technology, it loads lazily, and it does not
  print. The timeline draws it through the same code path as a role's logo, so the two cannot drift
  apart.
* **The file is the UPC's official colour logo**, the positive version in Pantone 3005 with a white
  interior. It is the "UPC" roundel beside the name "Universitat Politècnica de Catalunya ·
  BarcelonaTech", about 4.5:1 wide. As DDR-066 does with the company logos, the file is trimmed to
  the mark's edges, scaled to 36px tall (twice its displayed height) and saved as a lossless WebP at
  `public/education/upc/logo.webp`. Its ground is transparent. The downloaded PNG sits beside it,
  and `.gitignore` keeps it out of the repository. Nothing about the mark is recoloured or redrawn,
  per DDR-044.
* **It is not drawn tall.** At 4.5:1 it is a wordmark like Randstad's, not a nearly square mark like
  ToBeIT's, so it takes the shared 18px.
* **The certifications have no logo**, until PMI authorizes one. `logo` is optional on a credential
  for that reason, where it is required on a role.
* **An institution is set in the accent, bold, as a company is**, where DDR-057 took the design's
  grey, `--color-text-muted`. The owner asked on #197 for the education cards' words to be coloured
  as the experience cards' are. The name below it was already the same ink on both. The accent on
  the card's white passes WCAG 1.4.3, where the muted ink did only on the band. It prints in the
  accent too, as a company does.
* **An education card is otherwise unchanged.** It still leads nowhere and takes no hover, per
  DDR-059 and DDR-063.

## Alternatives Considered

### The PMI logo on the certifications too

Pros:
* Every card in the row would open with a logo, as the owner first asked.

Cons:
* PMI's guidelines forbid it without a written agreement, and the site is published under the
  owner's name. The owner chose to ask PMI first.

### The UPC's symbol alone, drawn tall

Pros:
* The roundel reads clearly at 28px, where the full logo's second and third lines are very small.

Cons:
* The UPC publishes no file of the symbol alone, so it has to be cut from the logo. It shipped on
  #197, and the owner chose the full logo, with its lettering, instead.

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
* The logo's second and third lines, "de Catalunya" and "BarcelonaTech", are very small at 18px,
  like EDP's full name in its logo. That is the logo's own form. `logoTall` would draw it at 28px if
  the owner asks for that.

Risks:
* A PMI logo, if PMI authorizes one, is the approved artwork PMI supplies, used unaltered. A later
  story adds it and records the authorization.

The printed CV's layout and text do not change; only the institution's ink does.

Measured on the built page in Edge at 320px, 360px, 390px, 768px, 1280px and 1536px, at the
browser's default text size and at 200%: each UPC logo is 81.5 × 18px (163 × 36px at 200%),
12px (24px) above the institution's name, and inside its card. Nothing scrolls sideways. Printed to
A4 in Edge and Firefox with background graphics on and off: five sheets in both, with text
identical to the tree before, and the pixels differing only in the institution's ink.

## Related Documents

* #197
* DDR-066: the company logos on the role cards, which this amends and follows
* DDR-057 and DDR-010: the two timelines, one pattern
* DDR-044: a brand's mark is never recoloured
* DDR-015: print
* ADR-004: binary assets as WebP, reached through `asset()`
