# DDR-057-Experience and Education as Horizontal Timelines of Cards

Status: Accepted

Date: 2026-09-26

**Amended by DDR-059**, on 2026-09-26: each role's card is now a link to the role's view, and the
hint "Click any role to read the full description" now stands above the experience row, which then
takes no tab stop of its own. Everything else here stands, including the education row.

**Supersedes in part DDR-010**, in its timeline. DDR-010 draws experience and education as one
vertical timeline pattern: a date column, a spine and the content, newest first, with a role's
points and a degree's thesis in the content. On screen that pattern is now the design's horizontal
row of cards, oldest first, with no points and no thesis. DDR-010's rule that a role and a
credential are one pattern stands: they still share one component. Its vertical timeline survives
on paper, below.

**Supersedes in part DDR-014**, in its rule that nothing scrolls horizontally from 320px. A timeline
scrolls sideways inside itself where its entries do not fit. The page itself still never does.

**Supersedes in part DDR-015**, in its rule that a component adds no print-only content. A role's
points print and are not on the screen.

**Amends DDR-036** in the dot's size on screen: 16px with a 10px core, the design's (node 170:175).
Paper keeps DDR-036's 12px dot and 6px core. The ring, the one unbroken line and the rule that it
runs from the first dot to the last all stand, turned across the row.

**Amends DDR-023** in its italic. The owner removed the degrees' thesis sentences, the one italic on
the page, so DM Sans Italic is no longer committed or loaded. There are six font files where there
were seven.

**Amends DDR-039** in where the role and credential steps apply. `--space-role` and
`--space-credential` now space the timeline only on paper, where they were already the old steps.
On screen the design spaces the cards across the row instead.

## Context

Epic #170 reworks the introduction and the experience section. On #173 the owner reworked how
experience and education look, in the Figma layer `career-site-main` (170:2), nodes 170:65 and
170:439, and asked for exactly those two sections to be copied from it.

The design draws both as a horizontal timeline, left to right from the oldest entry to the newest:
- the dates above a ringed dot on one line;
- a white card below each dot, holding the company or institution, the title and, for a role, the
  place.

It gives each role's full description a view of its own, which a click on the card opens. It draws
no thesis.

It is drawn only at 1195px, and it does not say what a narrow screen does or what paper does.

The owner decided five things on #173:
- **The role view** is a later story. Until then the cards are not links, and the design's hint,
  "Click any role to read the full description", is not shown.
  > **Amended by DDR-059.** The view landed on #176: each role's card leads to it, and the hint is
  > shown.
- **Below the design's width** the row scrolls sideways rather than stacking.
- **On paper** each role keeps its points.
- **The thesis** is removed from the content entirely, not only from the screen.
- **Nothing else** in the layer is adopted.

## Decision

### On screen: one row, oldest first, at every width

Each timeline is an ordered list, one entry per role or credential, in time order. `content/`
lists both oldest first, so the markup order is the visual order, per DDR-014. Each entry is a
column of the row:

1. **The dates**: DDR-018's label (uppercase, bold, accent) at the design's 10px, with 1px of
   tracking (`--letter-spacing-x-loose`). They sit at the foot of a 64px band
   (`--timeline-date-height`), so every dot is level however the dates wrap.
2. **The spine**, hidden from assistive technology: the line coming in from the entry before, the
   ringed dot, and the line leaving for the entry after. The first entry's incoming line and the
   last entry's outgoing line are undrawn, so the line runs from the first dot to the last. The
   dot takes no fill, so the ring shows the band it is on, per DDR-046.
3. **The card**, `--timeline-card-space` (20px) below the dot:
   - white, with a 1px `--color-border` edge and `--radius-large`;
   - `--space-medium` padding, and `--space-x-small` between lines;
   - centred text, and one height for every card in the row.

   It holds, in this order:
   - the company in the accent, or the institution in `--color-text-muted`, both bold at 12.8px;
   - the title, the `h3`, at 11px;
   - a role's place in `--color-text-faint`, at 10px.

The design's 12px is not a step of DDR-022's scale, so the company and the institution take the
nearest, as the footer does.

The columns meet with no gap between them, so the line crosses from one to the next unbroken. The
design's 24px between cards comes from insetting the dates and the card by `--timeline-entry-inset`
(12px) on each side.

The columns share the row equally, and none is narrower than `--timeline-entry-width`, 192px. That
is the design's narrowest column at 1195px, so the design's five roles fit its column.

**Where the entries do not fit, the list scrolls sideways inside itself.** There is no breakpoint: a
phone scrolls the same row. The list is focusable and named by its section's heading, so the
keyboard's arrow keys scroll it and a screen reader announces it as a list named "Experience" or
"Education and certifications". The site's focus outline marks it. It holds no link.

**Reading order**: the dates, the company or institution, the title, then the place. The `h3`
follows the company because the card draws it there.

### On paper: DDR-010's vertical timeline, with the points

A sheet cannot scroll, and a column of cards has no room for a role's points. So each entry prints
as DDR-010's three columns did: the dates at the end of a 160px column, the spine, and the card's
text beside them, with each role's points below it. Paper keeps the date label's 11px and loose
tracking, the 12px dot, the 1.5 leading and the old spacing steps. The design's 10px at 0.1em would
split the date into letters in a Firefox PDF, per DDR-024.

The card's surface and edge are dropped at the token layer, as every surface and hairline is. The
points are the one print-only content on the page, which this record allows.

### Keeping a heading with its first entry on paper

DDR-008 keeps a heading with its first item by holding both in one block that paper does not
split. A timeline's first item is now the whole timeline, because on screen its entries are one
row, and a row needs one parent.

Kept whole, the experience timeline is taller than what the introduction leaves of sheet 1, and
both browsers pushed the section onto sheet 2. That made the CV six sheets, with the introduction
alone on the first.

So a timeline section is `breakable`: paper may break inside its opening block between entries,
and each entry stays whole. What keeps the heading with the first entry is the heading's own
`break-after: avoid`. Measured on a test page with the heading at 15 positions near a sheet's foot:
- Edge honours it, stranding the heading 0 times.
- Firefox ignores it, stranding the heading 8 times, the same as with no rule.

On the current content neither timeline heading is stranded, in either browser.

No DOM gives both. The heading has to sit outside the scrolling list on screen, and on paper it has
to share a block with the first entry and not with the second. Those two can't both be true.

## Alternatives Considered

### Stack the cards below the wide breakpoint

Pros:
* Nothing scrolls sideways, as DDR-014 asks.

Cons:
* The owner chose the scrolling row on #173.

### Print the row of cards

Pros:
* Paper matches the screen.

Cons:
* Five columns on a sheet leave no room for the points the owner wants printed.
* A row that does not fit a sheet cannot scroll there.

### Keep the timeline whole with its heading on paper

Pros:
* The heading can never strand, in either browser.

Cons:
* Measured: both browsers pushed Experience to sheet 2, leaving sheet 1 with the introduction
  alone and making the CV six sheets.

### Keep the thesis in the content and hide it on screen

Pros:
* Paper could still print it.

Cons:
* The owner chose to remove it entirely on #173.

## Consequences

Benefits:
* The career history reads at a glance, left to right through time, as the owner designed it.
* Every name is shown whole. The design clips the two longest at their card's edge; the page wraps
  them.
* The printed CV keeps every role's points and is still five sheets in Edge and Firefox. The
  section headings are on sheets 1, 3, 4, 5 and 5, as DDR-032 recorded them.
* One font file fewer is loaded.

Tradeoffs:
* On screen, a role's points are nowhere until the role view lands.
* Both the screen and paper run oldest first, which is unusual for a CV.
* Paper and screen are two layouts of one markup, where DDR-015 has paper take the wide layout.
* Education's heading prints on sheet 5 where it printed on sheet 4, because each role now prints
  its place on a line of its own, below its title, rather than in the date column.

Risks:
* In Firefox, a timeline heading can strand at the foot of a sheet if the content before it changes.
  Reprint after any change to what comes before experience or education.
* A scrolling row's cue is a card cut at the right edge. At about one width in five no card is cut,
  because a column's edge falls there, and the cue is then the line running off the edge past the
  last dot, and the scrollbar where the platform draws one. Measured every 10px from 320px to
  1536px at both text sizes.
* A new role or credential changes where the row starts to scroll, and a sixth role makes it scroll
  at the design's width.

## Related Documents

* Issue #173, its UI Review, and Epic #170
* Figma `career-site-design`, layer `career-site-main` (170:2), nodes 170:65 and 170:439
* DDR-010, DDR-014, DDR-015, DDR-023, DDR-036 and DDR-039, which this record amends
* DDR-008 and DDR-032 (keeping headings with their first item; the printed CV's sheets)
* DDR-018, DDR-022, DDR-024 and DDR-025 (the label, the scale, the tracking fault, the inks)
* DDR-046 (the bands the timelines sit on)
* ADR-005 (neither a thesis nor a role's points is a fact the CV file shares)
