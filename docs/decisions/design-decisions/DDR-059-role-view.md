# DDR-059-Role View

Status: Accepted

Date: 2026-09-26

**Amends DDR-057** in two things it left for later: each role's card in the experience timeline is
now a link to the role's view, and the design's hint, "Click any role to read the full
description", now stands above the row. DDR-057's row, its order, its scrolling, its print treatment
and its rule that the screen shows no points on the page all stand. Education's cards are not links
and keep DDR-057's focusable row.

**Extends DDR-050 and DDR-052 to the roles.** A role's view takes a project view's way back, its
labels, its space under the contents bar and above the footer, the site's own bar and footer, and
DDR-052's neighbouring cards in both directions, with no ring.

**Extends DDR-050's amendment to DDR-022**: the job title on a role's view takes
`--font-size-project-title`, the one size on the site that is not a step, rather than a size of its
own. The two views' titles are one role.

**Amended by DDR-060**: a role can have a short title and a full one. The view's `h1`, its tab and
its link preview give the full title; the timeline's card, the neighbouring cards and the printed CV
give the short one. Everything else here stands.

**Extends DDR-025's failing pairings** by two, below. `app/tokens.test.ts` holds eight by name.

## Context

Issue #176, on Epic #170, builds the role view the owner drew in the Figma layer
`career-site-experience` (177:1196), at 1195px, and the link to it from each role's card, which
#173 and DDR-057 left out until the view existed. Since DDR-057, a role's points are on paper and
nowhere on screen.

The owner made three choices on #176:
* **Both neighbours, in the timeline's order.** The layer draws only a "Next role" card, leading from
  ABB to Ponera Group, newer to older, beside an empty left half. The owner chose a project view's
  pattern: the older role at the left as "Previous role" and the newer at the right as "Next role".
* **The skills are the owner's to supply.** The layer's seven tags for ABB are a placeholder; neither
  the content nor the owner's knowledge base lists skills per role. The view draws the row for a
  role that has skills and nothing for one that has none, and no role has any yet.
* **The skills do not print.** The printed CV is unchanged by this story.

## Decision

### The view

From the top, in one column, as the layer draws it:

* **The way back**, "Back to experience", a project view's (node 177:1207), to `/#experience`.
* **The header**, on a panel of `--color-surface-tag` edged in `--color-border-accent` at the large
  radius (node 177:1213). Its first line is the company in a pill, bold capitals in the accent on
  `--color-border-accent`, then the dates in medium, a pale middle dot and the place, all 11px in
  the muted ink, 12px apart (node 177:1214). Below it the job title, the view's one `h1`, in Lora.
* **"Responsibilities & achievements"**, a project view's label, 48px below the panel, then every
  point the role states as an ordered list, 24px below the label and 20px apart, held to the
  design's 800px. Each point's number is drawn in the markup, bold in the accent in a 24px circle of
  `--color-border-accent`, and hidden from assistive technology, which announces the list's own
  positions. The words are body text in the body's ink at `--line-height-prose`.
* **"Skills & technologies"**, the same label 40px below the points, then the role's skills as pills
  8px apart: medium in the accent on `--color-surface-tag`, edged in `--color-border-accent` (node
  177:1275). A role without skills draws neither the label nor the row.
* **The foot**: a hairline a section boundary below the last block, and a section boundary below it
  (node 177:1317), the design's 56px and 56px, then the neighbouring cards. Each is DDR-052's card
  with a third line: the direction, the company semibold at 14px, and the job title at 11px in the
  muted ink (node 177:1302). Its accessible name is "Next role: ABB, Global Product Specialist,
  Digital Solutions", with the visible words first. The oldest role keeps the empty left half.
  **Since DDR-060** the card's third line and its name give the role's short title, "Next role:
  ABB, Global Product Manager", and the view's `h1` gives the full one.

Every word is in `content/experience.ts`: the role's own record and `experience.view`.

### The card on the page, and the hint

* **The job title is the link**, stretched over the card by `.link::after`, as a project card's name
  is, per DDR-051. So the card is one tab stop named by the title, and a pointer anywhere on it
  follows it.
* **Under the pointer and on focus** the title takes the accent and the card
  `--color-border-accent-hover`, as a project view's neighbouring card answers it, per DDR-035. The
  card does not rise: DDR-055 keeps that for the project cards.
* **The focus outline is drawn inside the card's edge**, at minus its own width. The row scrolls,
  and a scrolling box clips what reaches past it: offset outside the card, the outline lost its
  foot to the row's edge.
* **The row takes no tab stop of its own** once its cards are links. Tabbing to a card scrolls the
  row to it, and the arrow keys scroll the row while a card has focus, measured at 390px. Education's
  row, which holds no link, keeps DDR-057's `tabindex="0"`.
* **The hint** stands the heading step below the heading and 24px above the row (nodes 170:71 and
  170:186): 11px in the faint ink after the design's clock, which is a mark in `components/icon.tsx`
  hidden from assistive technology. It is screen only: paper has nothing to click, so the hint and
  the space below it are dropped in print.
* **Paper prints no address after a card's link**, as a project card's does not.

### Differences from the layer at 1195px

| What | The layer | The page | Why |
| ---- | --------- | -------- | --- |
| Column | 1004px inside a 1100px box | The page's 1100px column | As DDR-050 has a project view, so the view lines up with the bar's title |
| Foot | "Next role" alone, newer to older | Both neighbours, older to newer | The owner's choice on #176 |
| Skills | Seven placeholder tags for ABB | None until the owner supplies them | The owner's choice on #176 |
| Panel radius | 16px | 12px, `--radius-large` | DDR-013 has three radii, as DDR-051 takes for a card |
| Title | 38.4px on 42.24px | 41.6px on 1.2 | A project view's title role, and the heading leading |
| Company pill | Fully rounded, tracked 0.12em | 12px corners, tracked 0.1em | The large radius is the same shape on one line and a rounded box when a long company wraps at 320px with text at 200%, where the pill's radius drew an ellipse; 0.1em is the x-loose step |
| Skill pill | 12px text | 12.8px | The scale's nearest step, as a project view's tag takes it |
| Number | 2px below the line's top | Level with it | No token for 2px; the circle is within a pixel of the line's centre |
| Hint | 12px clock, 6px gap | 11px clock, 8px gap | A mark is 1em square; 8px is the nearest step, as DDR-037 takes it |
| Panel padding below 48em | — | 16px | The layer has no narrow view; 48px each side of a phone's column with text at 200% leaves the title too little room |

Everything else measured on the built view matches the layer: the way back 48px below the bar, the
panel 40px below it, the label 48px below the panel, the points 24px below the label and 20px apart,
held to 800px, and the foot's hairline 56px below the last point with the card 56px below it.

### Colour

Four new pairings, measured by `app/tokens.test.ts`:

| Pairing | Ratio | WCAG |
| ------- | ----- | ---- |
| The job title, `--color-text-heading` on the panel's `--color-surface-tag` | 15.97:1 | Meets 1.4.3 |
| The dates and the place, `--color-text-muted` on `--color-surface-tag` | **4.26:1** | **Fails 1.4.3** |
| The company pill and a point's number, `--color-accent` on `--color-border-accent` | **4.22:1** | **Fails 1.4.3** |
| A skill, `--color-accent` on `--color-surface-tag` | 5.62:1 | Meets 1.4.3 |

The two failures are the design's own inks, adopted as Epic #70's rule adopts them: recorded, and
shipped. The company is also said by the title's own tab and preview, and the dates in the
timeline on the page; the number repeats a position the list already announces.

## Alternatives Considered

### Only "Next role", as the layer draws it

Rejected by the owner on #176, for DDR-052's reasons: a reader on the oldest role could not reach
the next one, and a single direction reads against the timeline, which runs oldest to newest.

### Draw the layer's tags as the ABB role's skills

Rejected. They cannot be traced to the owner's knowledge base, and the project's content rules
forbid inventing them.

### Numbers by a CSS counter

A counter in `::before` would keep the markup plain. Rejected: generated content is read by some
screen readers, doubling the list's own positions, and a drawn number in the markup can be hidden
with `aria-hidden`.

### Keep the row focusable as well as its cards

Rejected. It would put a tab stop before the first card that does nothing a card does not.

## Consequences

Positive:
* A role's points are on screen again, one click from its card, with an address the owner can send.
* The page's experience section says its cards lead somewhere, and they do.
* The printed CV is unchanged: five sheets in Edge and Firefox, background graphics on and off,
  every sheet pixel-identical to the tree before, and the same words back through pypdf and pdfium.
  pypdf reads a card's lines in a different order, because the card now holds a link.

Negative:
* Two more pairings fail WCAG 1.4.3, on the view's panel.
* At 320px with text at 200%, "ELECTRÓNICA" breaks inside the company's pill on its view, and
  "Electrónica" inside the neighbouring card on ToBeIT's, as "Portfolio" does in DDR-052's. Nothing
  scrolls sideways and nothing is cut. A longer company means rerunning the sweep.
* The skills row is built and drawn nowhere until the owner supplies skills; a test holds it.

Measured every 10px from 320px to 900px and at 1195px, 1280px and 1536px, at the browser's default
text size and at 200%, on the page and all five views: nothing scrolls sideways, no job title
breaks mid-word, and no pair of targets fails WCAG 2.5.8.

## Related Documents

* GitHub issue #176 and Epic #170
* ADR-011, the route
* DDR-057, which this amends
* DDR-050 and DDR-052, a project view and its neighbours, which this extends
* DDR-051 and DDR-055, a card that leads to its view, and the lift kept for project cards
* DDR-022, DDR-025, DDR-035, DDR-037 and DDR-038
* DDR-014 and DDR-027, the 320px floor and target sizes
* DDR-015 and DDR-032, the printed CV
