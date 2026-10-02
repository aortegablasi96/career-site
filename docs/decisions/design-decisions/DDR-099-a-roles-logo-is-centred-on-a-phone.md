# DDR-099-A Role's Logo Is Centred on a Phone

Status: Accepted

Date: 2026-10-02

**Amends DDR-098** in one thing: below the wide breakpoint the company's logo is centred across the
panel, where it stood at the panel's right edge. It still follows the title, a flow step below it.
Its size, its files, its empty `alt`, its 160px cap and everything from the wide breakpoint stand.

## Context

The owner reviewed DDR-098 on the live site and asked for the logo to be centred in the panel on a
small screen, such as a phone's (#289). At the right edge, under a title that runs from the left,
the logo stood apart from both the title and the pill.

## Decision

* **Below the wide breakpoint** the logo's box, at most `--role-view-logo-column` (160px) wide, is
  centred in the panel by automatic margins on both sides, and the logo is centred in its box. A
  logo wider than the box, such as Randstad's, is still scaled to it, so it stands at the same size
  as before.
* **From the wide breakpoint** nothing changes. The box gives up its end margin, so it shrinks to
  the logo and stands at its column's right edge, exactly where DDR-098 shipped it.
* The markup is unchanged: the pill line, then the title, then the logo. Nothing is reordered.

## Alternatives Considered

### Keep the logo at the panel's right edge on a phone, as DDR-098 has it

Pros:
* No change.

Cons:
* The owner asked for it centred.

### Centre the logo on a phone and in its column from the wide breakpoint

Pros:
* One rule at every width, and it matches DDR-098's wording, "centred in its column".

Cons:
* It would move the logo on a wide screen, which the owner did not ask for. As built, DDR-098's
  logo stands at its column's right edge, flush with the panel's content edge, because its box
  shrinks to the logo. Left as it is.

## Consequences

Benefits:
* On a phone the logo stands on the panel's centre line, below the title, rather than in a corner.

Tradeoffs:
* On a phone the panel's text runs from the left and its logo stands in the middle, so the panel
  has two alignments.

Risks:
* None new. The title keeps the panel's whole width, so it wraps as it did, and the box is no wider
  than before, so nothing can scroll sideways that did not.

## Related Documents

* GitHub issue #289, PR #299 (DDR-097) and PR #300 (DDR-098)
* DDR-098, which this amends
* DDR-097 and DDR-059 (role view)
* DDR-014, the breakpoints and markup order
