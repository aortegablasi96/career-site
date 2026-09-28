# DDR-074-The Timelines Run Down the Page on a Phone

Status: Accepted

Date: 2026-09-28

**Amends DDR-057 in one respect**: below the wide breakpoint the experience and education timelines
are no longer the row that scrolls sideways. Each is a column that runs down the page, newest first.
DDR-057's sentence "There is no breakpoint: a phone scrolls the same row", and the owner's choice on
#173 behind it, no longer hold. From the wide breakpoint up, and on paper, everything DDR-057
decides stands: the row, oldest first, its scrolling, its equal columns and the printed vertical
timeline with each role's points.

**Keeps DDR-014's rule that the visual order is the reading order.** No stylesheet reorders
anything: a timeline is drawn twice, each list in the order it is shown, and exactly one of the two
is displayed at any width.

**Amends DDR-063 and DDR-064 for the column alone.** A card in the column still lifts by
`--card-lift` over 150ms, where motion is welcome, and its dates, dot and card are still one target.
The lift is a margin rather than a translation, and the focus outline is drawn on the card itself
rather than by the link's stretched box. How the card looks at rest and lit is unchanged.

## Context

On #218, part of Epic #216, the owner asked for the timelines to stack on a phone. Having used the
site on one, they found the row did not suit it. A phone showed part of one or two cards, and a
reader had to discover that the row swipes to find the rest of five roles and four credentials.

The issue left two things to decide. The layout was the UI Designer's. The order, oldest first as
the row reads or newest first, was to be decided with the owner.

The owner chose **newest first**. The row reads oldest first, per DDR-057, and so does paper.
DDR-014 forbids a stylesheet from reordering content, so newest first on a phone cannot be the
row's markup restyled. The owner was offered two ways:

* Reverse the content everywhere. The desktop row would then read newest on the left, and the
  printed CV newest first. #218 excludes both.
* Draw each timeline twice from the same content: the row, oldest first, and a column, newest
  first. Only one is displayed at a time.

The owner chose the second.

## Decision

**Below the wide breakpoint each timeline is a column of its entries, newest first. From the wide
breakpoint and on paper it is DDR-057's row, oldest first. The two are separate lists, and exactly
one is displayed.**

* **Two lists, one displayed.** `Timeline` renders the row's `ol` and a second `ol` for the column,
  inside one `div`, from the same entries. The column is hidden from 48em and on paper, and the
  row is hidden below 48em. A hidden list is `display: none`, so it is not in the accessibility
  tree and none of its links take focus. A reader meets one list, named by its section's heading,
  in the order they see it. Keyboard order below the wide breakpoint is therefore newest first,
  where it was oldest first.
* **The column's entry.** The spine stands at the left, `--timeline-spine-width` wide, as on paper.
  Beside it, the dates stand above the card. The ringed dot is at the top of the entry, level with
  the dates, which stand on a line `--timeline-dot-span` tall, centred on it. The line runs down past
  the card and the space below it to the next entry's dot, so it runs from the first dot to the
  last, per DDR-036. The spine comes first in the column's markup. It is hidden from assistive
  technology, so a reader meets the dates and then the card, as in the row.
* **The space between entries is paper's**, `--space-role` and `--space-credential`, which the
  rhythm factor makes 33px and 27px on a phone. The column is the printed timeline's shape, and
  these are the design's steps for it, per DDR-039.
* **The card is the row's card.** It has the same surface, logo, company or institution, title and
  place, and leads where the row's card leads: a role's view, or a credential's page in a new tab.
  Its text begins at its left edge, below the dates, rather than centred. A raised logo does not
  rise: it rises in the row only to keep a name level with the cards beside it, and the column has
  none beside it. The column holds no role's points. Only paper shows them, and paper prints the
  row.
* **One target, whatever the dates wrap to.** At 200% text below 380px a date range wraps onto a
  second line. So the link's stretched box is measured from the block that holds the dates and the
  card, not from the card. It covers the dates, the dot, the spine beside the card and the card,
  and stops at the card's foot, so the space before the next entry leads nowhere.
* **So the card is not moved by a translation in the column.** A translated or positioned box
  becomes what an absolutely positioned box inside it is measured from. Lifted by `translate`, the
  card would take the link's box with it, and a pointer on the dates would lose the card. In the
  column the card rises by a margin instead: `--card-lift-back` above and `--card-lift` below, so
  nothing around it moves. The lift and its transition are both inside
  `prefers-reduced-motion: no-preference`, as the row's are.
* **Focus outlines the card.** The row's stretched box draws the outline at the card's size. The
  column's box is larger, so the column draws the outline on the card itself, with the same width,
  colour and offset.
* **Hover and focus are otherwise the row's**, from the same rules: the accent edge, the lit shadow,
  the title in the accent, the dates' glow and the darker dot, per DDR-063, DDR-065 and DDR-071.
* **Two tokens are added.** `--timeline-dot-span` is the ringed dot's whole height, the dot and its
  ring on either side: 22px. `--card-lift-back` is `--card-lift` negated, for the margin.
* **A logo is fetched once.** Each logo is `loading="lazy"`, and a lazy image that is not displayed
  is not fetched, so only the displayed list's logos load.

Measured on #218 in Chromium against the built site, every 10px from 300px to 900px at the
browser's default text size and at 200%, with `main` built beside it:

* Nothing scrolls sideways at any width, and neither list overflows its column.
* At every width exactly one of each timeline's two lists is displayed. The row takes over at 770px
  at the default size, which is 48em plus the scrollbar.
* No pair of targets fails WCAG 2.5.8.
* For every entry at every width, a pointer on the dates' first and last characters, on the dot,
  on the spine beside the card and on the card lands on that entry's link. A pointer in the space
  below a card lands on nothing.
* Date ranges wrap onto a second line only at 200% text, from 300px to 370px, and are still inside
  the target there.
* From 780px to 1536px at the default size, and at 1560px and 1920px at 200%, every box on the page
  is where it was on `main`, to a tenth of a pixel. The only new boxes are the two `div`s that hold
  each timeline's lists.
* Printed to A4 in Edge and Firefox, with background graphics on and off: five sheets in all four,
  every sheet pixel-identical to `main`, and the same text through pypdf. Each job title comes back
  once.

## Alternatives Considered

### Oldest first, the row's markup restyled as a column

Pros:
* One list and one markup order, so no content is drawn twice.
* Screen, paper and keyboard read in one order at every width.

Cons:
* The owner chose newest first, which reads as a CV does, current role at the top.

### Newest first everywhere

Pros:
* One list, drawn once.

Cons:
* The desktop row would read newest on the left, and the printed CV newest first. #218 excludes
  both.

### Reverse the column with `flex-direction: column-reverse` or `order`

Pros:
* One list.

Cons:
* The visual order would not be the reading order. A screen reader and the keyboard would meet the
  entries oldest first while the eye reads newest first. DDR-014 forbids it, and
  `components/stylesheets.test.ts` refuses it.

### The dot beside the card, with the dates above it

Pros:
* The in-flow spine could sit beside the card in the markup order dates, spine, card, as in the
  row.

Cons:
* The dot belongs to the dates it marks, and a reader scanning the line down the left meets each
  date beside its dot. The column has its own markup, so the spine can come first, hidden, without
  reordering anything a reader meets.

### The card as the link's box, reaching a fixed height above it

Pros:
* The card could lift by `translate` and draw its outline through the link's box, as in the row.

Cons:
* The box could only reach up by a fixed height. Where a date wraps onto a second line, at 200%
  text below 380px, the first line of the date would lead nowhere while it still lit the card.

## Consequences

Benefits:
* A reader on a phone sees every role and credential by scrolling the page, as they already do,
  with no row to discover and swipe.
* The newest role and credential lead each section on a phone.
* The desktop row and the printed CV are unchanged, to the pixel.

Tradeoffs:
* Each card is in the page's HTML twice, once per list. Only one list is displayed, and each logo
  is fetched once.
* A phone and the desktop read the timelines in opposite orders, and so does the keyboard.
* In the column a card lifts by a margin rather than a translation, and draws its own focus outline.
  It looks the same as the row's, but it is a second way of doing it.

Risks:
* A test or a reader of the markup that counts entries, headings or links now counts each twice.
  `app/page.test.tsx` sets the columns aside and holds them to the reverse of the rows.
* The dot is centred on a single line of dates. Where a date wraps, the dot stands level with its
  first line, a little below that line's centre.
* A change to the row's card, dates or dot changes the column's too, since they share their rules,
  but a change to how an entry is laid out does not. Check both below and above 48em.

## Related Documents

* Issue #218 and Epic #216
* DDR-057, which this record amends, and DDR-010, DDR-014, DDR-036, DDR-039, DDR-063, DDR-064,
  DDR-066, DDR-067, DDR-069, DDR-070 and DDR-071
* DDR-015 and DDR-032: the printed CV, which is unchanged
* DDR-027: target sizes and WCAG 2.5.8
