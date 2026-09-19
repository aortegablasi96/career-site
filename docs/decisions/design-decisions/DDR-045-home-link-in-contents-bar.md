# DDR-045-Home Link in the Contents Bar

Status: Accepted

Date: 2026-09-19

**Amends DDR-031 in two respects**, and DDR-010 where DDR-031 carries it forward:

* **The bar's links.** DDR-010 and DDR-031 give the bar "one link per section". It now begins with
  one link that leads to no section: **Home**, to the top of the page. Every section still has its
  one link, in the same order, with the same word.
* **The narrow link gap.** DDR-031's 16px below the wide breakpoint becomes 8px, `--space-small`.
  From the wide breakpoint it is still 32px.

**Amends DDR-042 in one respect.** DDR-042 marks nothing while the reader is in the introduction,
because the introduction had no link in the bar. It has one now, so Home is marked there. Everything
else DDR-042 decides stands: which section is current, the mark held on a contents link's journey,
`aria-current="location"`, the underline in the link's own ink, and nothing marked without script.

DDR-033's unlined links, DDR-034's edge, DDR-035's hover and DDR-041's glide apply to Home unchanged.

## Context

Epic #131 refines how the page is navigated. Issue #141 is its fifth story. The bar lists every
section but not the first thing on the page, which holds the owner's name, photo, contact pills and
the CV control. A recruiter who has read down to Education and wants those again has to scroll the
whole page back up.

The story asks for a "Home" link, first in the bar, that brings the reader to the top of the page
with the introduction in full view below the bar. It must glide where the other links glide and
jump for a reader who asked for reduced motion, look and behave like the other links in every other
respect, be marked while the reader is in the introduction, be announced as a link named "Home",
and still fit: from 320px up, at the default text size and at 200%, the bar must wrap no more than
it does today, nothing may scroll sideways, and no pair of links may fail WCAG 2.5.8.

The design draws no Home link. It is the owner's request.

## Decision

**The contents bar begins with a link named "Home" that leads to the top of the page, is marked
while the reader is in the introduction, and is otherwise exactly a contents link.**

### Where it leads

* **`#top`**, the fragment HTML reserves for the top of the document: when no element has the id
  `top`, following it scrolls the page to 0. So Home needs no anchor of its own, lands at the very
  top rather than at a heading below the bar's clearance, and leaves the introduction in full view
  under the bar at every width — at 390 by 844 the introduction ends at 842.5px, above the fold,
  exactly as when the page is first opened.
* **No element may take that id**, or Home would go to it instead. `app/page.test.tsx` holds it.
* **The browser follows it**, as it follows every contents link, per DDR-041. The address reads
  `#top`, and the history entry and where focus starts from next are the browser's own.

### How it behaves

* **It is the bar's first link**, before Experience, in the same list, the same type, weight, ink,
  hover, focus outline and keyboard order as every other. It is not underlined at rest, per DDR-033.
* **It glides where the others glide and jumps under reduced motion**, because DDR-041's glide
  applies to every in-page link in the bar. Measured in Chromium and Firefox, from Languages to
  the top, it glides and comes to rest at 0; with reduced motion it is at 0 within 20ms.
* **It is marked while the reader is in the introduction**, which is exactly when DDR-042's rule
  finds no current section. Once the first section reaches the clearance, that section is marked
  and Home is not. Choosing Home moves the mark straight to it and holds it there for the whole
  glide back, as DDR-042 holds any chosen link. So the bar now always marks exactly one link once
  script has run, and still marks none without script.
* **Its word is `Home`**, a string in `content/contents.ts` beside the bar's accessible name,
  because it names no section and so has no section module to live in, per ADR-002.

### How the bar still fits

* **The narrow link gap is 8px, `--space-small`, where it was 16px.** With a sixth link at 16px the
  bar grew at 200% text: from three rows and 150px to four rows and 205px at 320px and 330px, and
  from two rows and 97px to three and 150px at 410px and 420px — which puts headings the contents
  move to further behind it, the risk DDR-031 took the gap to 16px to avoid. At 8px, swept every
  10px from 300px to 900px at both text sizes, the bar is **never taller** than it was with five
  links at 16px, nothing scrolls sideways, and no pair of links fails 2.5.8.
* **From the wide breakpoint nothing changes**: the gap is still 32px and the six links still sit
  on one row at the default text size.

## Alternatives Considered

### Keep the 16px gap

Pros:

* No change to DDR-031's spacing; the links sit a little further apart on a phone.

Cons:

* The bar grows by a row at 320px, 330px, 410px and 420px with text at 200%, and to 205px at 320px,
  which fails the story's fit criterion and takes back half of what DDR-031's 16px bought.

### Link to the introduction by an id rather than to `#top`

Pros:

* The destination would be an element on the page rather than a rule of HTML.

Cons:

* The root's `scroll-padding-block-start` would land the introduction a flow step below the bar
  rather than where the page first opens, with the page padding above it scrolled past, so the
  introduction would sit higher than a reader has ever seen it. It would also add an id the page
  does not otherwise need.

### A "back to top" control at the foot of the page, or a mobile menu

Pros:

* Common patterns.

Cons:

* The story rules both out. The bar is already pinned in view, so a link in it is one choice away
  from anywhere, which a control at the foot is not.

### Mark nothing in the introduction, as DDR-042 did

Pros:

* No change to DDR-042.

Cons:

* The story asks for Home to be marked there, and with a link that leads there, leaving it unmarked
  would say the reader is nowhere.

## Consequences

### Benefits

* The introduction, with the contact pills and the CV control, is one choice away from anywhere on
  the page.
* Once script has run, the bar always marks exactly one link, so it always says where the reader is.

### Tradeoffs

* The page adds a link the design does not draw, at the owner's request.
* On a phone the links sit 8px apart rather than 16px. At the default text size the six links take
  two rows at 390px and 400px where five took one, inside the same 48px bar.
* Home carries the muted ink every contents link has, which fails WCAG 1.4.3, per DDR-033.
* `ContentsBar` renders one link it is handed as a word rather than as a section, so its props gain
  `home`. The boundary ADR-009 draws is unchanged: plain strings in, the one Client Component.

### Risks

* **Any new label or section changes the wrapping**, so DDR-031's sweep has to be rerun, and now
  against an 8px gap that has no slack left to give.
* **`#top` depends on no element having that id**, which the page test holds.

## Related Documents

* docs/decisions/design-decisions/DDR-031-sticky-contents-bar.md, which this amends
* docs/decisions/design-decisions/DDR-042-current-section-in-contents-bar.md, which this amends
* docs/decisions/design-decisions/DDR-010-career-page-redesign-structure.md
* docs/decisions/design-decisions/DDR-027-target-sizes.md, whose 2.5.8 measurement this reruns
* docs/decisions/design-decisions/DDR-033-contents-links-without-underline.md
* docs/decisions/design-decisions/DDR-041-contents-links-scroll-smoothly.md
* docs/decisions/architecture-decisions/ADR-009-contents-bar-renders-its-links.md
* GitHub issue #141 and Epic #131
