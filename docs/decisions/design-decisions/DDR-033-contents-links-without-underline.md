# DDR-033-Contents Links Without Underline

Status: Accepted

Date: 2026-09-18

**Supersedes in part DDR-025**: the bullet under "Colour is never the only signal" that keeps the
underline on the contents links, "the one place this record does not follow the file". Everything
else in that section stands, including the underline on every other link the base styles draw.

**Amends DDR-031 in one respect**: the row "Link ink" of its anatomy table, and the bullet "The links
keep their underline" under "Where the page departs from the design". A contents link is now
`--color-text-muted` with **no** underline, as the design draws it. Everything else DDR-031 decides
about the bar stands.

It is one declaration and no token.

**Amended by DDR-042 in one respect**: the link of the section the reader is in is underlined, as a
state. Every other contents link is still drawn without an underline at rest, and what identifies a
contents link is still what this record says.

## Context

Epic #70 closes the gaps between the page and `career-site-design`. On 2026-09-17 the owner decided
that the design prevails everywhere, including over records written to protect WCAG conformance, and
that each record standing in the way is superseded rather than defended. Issue #113 is this one.

The design sets the five contents links as DM Sans Medium 13px in `#64748b`, **not underlined**
(node 2:10 and its siblings; in the Figma Make file each link is `no-underline`). The page matched
it in every respect but the underline since DDR-031, which kept it on DDR-025's ground: at 4.44:1
against the page the colour is the last thing that should have to say a link is a link, and a
contents link's label — "Experience" — carries no clue of its own that it is one.

DDR-028 made the opposite call for the footer's three addresses, which it left without an underline
because the design draws none, and recorded that the difference between the two was "thin" and "one
declaration" from reversal. This record takes that declaration.

## Decision

**A contents link is not underlined, at any width, at rest.** `contents.module.css` writes
`text-decoration-line: none` on `.link`, the one rule that styles a contents link, so no other link
on the page is touched: the projects' labelled links keep the base styles' underline, and the
contact pills, the CV control and the footer's addresses were already drawn without one.

### What identifies a contents link without it

* **Its place.** The five labels are the only content of the one `nav` on the page, which is named
  "Sections" for assistive technology, pinned above everything else on its own surface and
  hairline, per DDR-031. A row of section names in a bar at the top of the window is the
  convention for navigation, and it reads as navigation rather than as a row of inline links, which
  is what the underline made it look like.
* **Its weight.** The links are medium, per DDR-030 and DDR-031, where the page's running text is
  regular.
* **Its focus state.** The base styles' `:focus-visible` outline, 2px in the accent with a 2px
  offset, is unchanged. Measured in the browser, the outline falls wholly inside the bar, and the
  accent is **5.42:1** against the worst blend the bar can show — 96% surface over the heading ink,
  `#efeeec` — where it is 5.87:1 on the page. Both clear the 3:1 WCAG 1.4.11 asks of it.
* **Its hover state**, once #115 lands. It is not part of this record. **#115 has landed, as
  DDR-035**: under the pointer and on keyboard focus the link takes the accent, 5.87:1 on the page
  and 5.42:1 on the bar's worst blend.

### What does not identify it

**Colour does not, and it cannot**: the ink is `--color-text-muted`, which is **4.44:1** on the page
and **4.10:1** at worst on the bar, and **both fail WCAG 1.4.3**. DDR-025 already counts this ink
among its four failures and DDR-031 already measured it on the bar, so this record adds no new
failing pairing. What it removes is the cue that did not depend on that ink. That is the cost, and
it is the owner's to take: the link is now told from text by where it is, how heavy it is and what
happens when it is focused, and not by anything drawn under it.

WCAG 1.4.1 (Use of Color) is not failed by this: it asks that colour not be the *only* means of
identifying a link, and the link is identified by its position in the navigation landmark, which
is structural, rather than by its colour against surrounding text — there is no surrounding text.

## Alternatives Considered

### Keep the underline, as DDR-025 and DDR-031 decided

Pros:

* A contents link keeps a cue that does not depend on its ink, which fails 1.4.3.
* Nothing changes.

Cons:

* It is the one visible difference left between the bar and the design, and the owner has decided
  the design prevails over records written to protect conformance.
* It makes the bar read as a row of inline links rather than as navigation, which is the issue's
  complaint.

### Drop the underline and darken the ink to compensate

Pros:

* The link would pass 1.4.3 without the underline.

Cons:

* It departs from the design's `#64748b`, which DDR-025 adopted, so it trades one difference for
  another, and it changes a token that other elements read.

### Underline on hover or focus only

Pros:

* A cue returns exactly when the reader is about to act.

Cons:

* The design's hover is a colour change, and every hover on the page is #115's; deciding it here
  would decide it for that story.

## Consequences

Benefits:

* The bar matches the design in every respect DDR-031 set out to match, and reads as navigation.
* The two places on the page a link is plain text in a pale ink — the footer and the bar — now make
  the same call for the same reason, where DDR-028 recorded them going opposite ways.

Tradeoffs:

* A contents link has no cue independent of its failing ink but its place, its weight and its focus
  outline.
* No geometry changes: an underline takes no space, so the bar's height and every wrap DDR-031
  swept are unaffected, and DDR-027's target measurements stand.

Risks:

* A reader who does not recognise the bar as navigation has less to go on than before. The
  reversal is one declaration, and `components/contents.test.tsx` holds its absence, as it held its
  presence, so it cannot drift back unnoticed either way.

Print: none. The bar does not print, per DDR-015, so the printed CV is untouched.

## Related Documents

* docs/decisions/design-decisions/DDR-025-colour-system.md — the underline rule this supersedes in
  part, and the ink this keeps
* docs/decisions/design-decisions/DDR-031-sticky-contents-bar.md — the bar this amends in one row
* docs/decisions/design-decisions/DDR-028-footer.md — the same call for the footer's addresses
* docs/decisions/design-decisions/DDR-030-medium-weight-users.md — the weight that now helps carry
  the link
* Figma, `career-site-design`, node 2:10 and its siblings
* GitHub issue #113, #115 (hover states), #98, and Epic #70
