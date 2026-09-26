# DDR-060-Short and Full Role Titles

Status: Accepted

Date: 2026-09-26

**Amends DDR-059 in one respect**: a role can have two titles. The view's `h1`, its browser tab and
its link preview give the job title in full. The timeline's card, the neighbouring cards at a
view's foot and the printed CV give it short. Everything else DDR-059 decides stands, and so does
DDR-057's card, which still shows the job title as its heading.

It **adds no token, no component and no declaration**. A role gains an optional `fullTitle` in
`content/types.ts`. The view and its metadata read it, falling back to `title` where a role states
none. Nothing about how a title is drawn changes.

## Context

Issue #181, on Epic #170, retitles each role from the owner's knowledge base. Two of the five
headings there differ from the page: ABB's role is "Global Product Manager - Digital Solutions",
where the page had "Global Product Specialist, Digital Solutions", and Ponera Group's is "Product
Manager", where the page had "Digital Solutions Manager". Randstad's is "Project Manager in Data &
Digital Projects", where the page had the same words in another order.

The owner also asked for the cards in the timeline to show a shorter title than the role's view.
The cards stand side by side, and a reader compares roles along the row. A qualifier such as
"Digital Solutions" tells the reader about one role and slows the comparison. The role's view is
where a reader goes to read about one role, so it can give the title in full.

The owner chose on #181:

* **The full title is the knowledge base's heading as it is written there**, hyphen included,
  rather than rewritten in the page's comma style.
* **The short title drops the qualifier.**
* **Only the role's view and its tab give the full title.** The neighbouring cards and the printed
  CV give the short one.

## Decision

| Role | Short title | Full title |
| --- | --- | --- |
| Electrónica Digital de Protección | Electronic and Software Engineer | the same |
| ToBeIT | Software Engineer | the same |
| Randstad | Project Manager | Project Manager in Data & Digital Projects |
| Ponera Group | Product Manager | the same |
| ABB | Global Product Manager | Global Product Manager - Digital Solutions |

* **The short title is the role's `title`.** It is the timeline card's `h3` and its link, so the
  card's accessible name is the short title. It is the third line of a neighbouring card at a view's
  foot, and that card's accessible name, "Previous role: Ponera Group, Product Manager". It is what
  the printed CV shows, since paper draws the timeline's cards.
* **The full title is the role's `fullTitle`.** It is the view's one `h1`, and the role in the
  browser tab's and the link preview's title, "Global Product Manager - Digital Solutions, ABB –
  Andreu Ortega Blasi".
* **A role whose title has no qualifier states it once.** Three of the five do. Their `fullTitle` is
  left out and the view shows `title`.
* **The two are both stated in `content/`**, per ADR-002. Neither is derived from the other,
  because the qualifier is not always a suffix: Randstad's is "in Data & Digital Projects".

## Alternatives Considered

### One title everywhere, the knowledge base's in full

Pros:

* One string per role, and nothing for a reader to reconcile between the card and the view.

Cons:

* The owner asked for the cards to be quicker to read. At 1195px ABB's and Randstad's full titles
  take two lines on a card where the short ones take one.

### The full title on paper as well

Pros:

* The printed CV is read on its own, with no view to open, so the qualifier has nowhere else to be.

Cons:

* The owner chose the short title for paper. The printed timeline is the screen's cards laid out
  for a sheet, and it prints the same title they show.

### The full title on the neighbouring cards

Pros:

* A neighbouring card leads to one role, as the view is about one role.

Cons:

* It is a card, like the timeline's, and the owner chose the short title for it. A full title on
  the smaller card would wrap more often at a phone's width.

## Consequences

Benefits:

* Every role's title is the owner's own, and every one traces to the knowledge base.
* On the timeline, the three retitled roles' titles take one line at every width checked, where
  they took two or three. Electrónica Digital de Protección's still takes two.

Tradeoffs:

* The same role is named two ways: "Global Product Manager" on its card and "Global Product
  Manager - Digital Solutions" on its view. The view's company, dates and place say it is the same
  role.
* The printed CV gives no role's qualifier.
* The separately designed CV file differs from the page on these titles until the owner updates it,
  per ADR-005. The CV digest in `content/cv.ts` moved to record that.

Risks:

* A role with a `fullTitle` that is the same as its `title` would state it twice. Nothing prevents
  that except review.

## Measurements

Measured in Edge against the built site, with the tree before this change built beside it, so that
nothing but the titles differs. Widths are the viewport.

### Screen

At 320px, 360px, 390px, 768px and 1195px, at the browser's default text size and at 200%, on the
page and all five views:

* nothing scrolls sideways, before or after;
* no card title and no view's `h1` breaks mid-word;
* every timeline card's title takes one line, where Randstad's, Ponera Group's and ABB's took two
  or three;
* **the page is exactly as tall as before** at every width and size, because Electrónica Digital de
  Protección's title still takes two lines and the row is as tall as its tallest card;
* a view's `h1` takes the same number of lines as before, except Ponera Group's, which is one line
  shorter;
* ToBeIT's, Randstad's and ABB's views are up to 66px shorter, because a neighbouring card's title
  is shorter.

No target became smaller than it was, so WCAG 2.5.8 was not re-swept.

### Paper

Printed to A4 in Edge and Firefox with background graphics on, before and after, and read back
through pypdf and pdfium:

| | before | after |
| --- | --- | --- |
| Sheets, Edge and Firefox | 5, 5 | 5, 5 |
| Section headings on sheets | 1, 3, 4, 5, 5 | 1, 3, 4, 5, 5 |
| Replacement character | 0 | 0 |

In both browsers every sheet's text is identical before and after except for the three titles
that changed, on sheets 2 and 3.

## Related Documents

* GitHub issue #181, and Epic #170
* docs/decisions/design-decisions/DDR-059-role-view.md — the view and its neighbouring cards, which
  this amends
* docs/decisions/design-decisions/DDR-057-horizontal-timelines.md — the timeline's card
* docs/decisions/design-decisions/DDR-015-print-treatment.md and DDR-032-print-recheck.md — the
  printed CV
* docs/decisions/architecture-decisions/ADR-002-content-model-and-authoring-approach.md — why both
  titles are content
* docs/decisions/architecture-decisions/ADR-005-separately-designed-cv.md — the job titles are facts
  the page and the CV file share
