# DDR-097-A Role's View Opens With Its Company's Logo

Status: Accepted

Date: 2026-10-02

**Amends DDR-059 (role view)** in its header. The panel now opens with the company's logo, the one
the role's card shows. Below the wide breakpoint the logo stands first in the panel, above the
company's pill. From the wide breakpoint the panel is two columns: the logo, centred in a column of
its own, then the company, the dates, the place and the title beside it. The pill, the dates, the
place and the title are drawn as DDR-059 draws them. Its points, its skills row, its foot and
everything else stand.

**Amends DDR-066** in one thing: each logo's file is now twice the view's height, 72px tall, and
112px for a tall logo, where it was twice the card's, 36px and 56px. The card draws the same file
at the same size as before.

## Context

Issue #289, on Epic #216. On the page, each role's card leads with its company's logo (DDR-066),
and that is what a reader picks it by. The role's view dropped the logo. It named the company only
in the small pill above the title, so the view looked less like the card that opened it. A reader
who arrived from a shared link, without the card, saw no mark of the company at all.

The issue also asked for the wide header to be looked at again. At 1280px DDR-059's panel is the
page's 1100px column: a pill, one line of 11px metadata and a title of one line, with most of its
width empty to the right of the title.

The issue left three things to the UI Designer: where the logo stands, its size, and whether the
company's label stays beside it. Nothing in the Figma file draws a logo on the view.

## Decision

### Where the logo stands

* **Below the wide breakpoint** the logo stands first in the panel, at its start, with a flow step,
  16px, between it and the company's pill. That is the same step as between the pill and the title.
  The panel reads logo, company, dates and place, title, from the top.
* **From the wide breakpoint** the panel is a grid of two columns. The first, `--role-view-logo-column`,
  160px, holds the logo, centred across the column and centred on the block beside it. The second
  holds the pill line and the title, a large step, 32px, from the column. The panel's padding stays
  DDR-059's 48px.
* **The markup order is the visual order**: the logo, then the block with the pill and the title.
  Nothing is reordered, so DDR-014's rule holds and reading order follows the screen.

The column is 160px because that is about as wide as the longest title allows. At the page's
widest, 1100px, ABB's full title, "Global Product Manager - Digital Solutions", is 805px in Lora at
the project title's size, and the column leaves the title 810px. Randstad's is 789px. A wider column or a wider
gap would put "- Digital Solutions" on a line of its own. Centring the logo in the column puts a
short wordmark (ABB's) and a long one (Randstad's) at the same optical centre, so the titles start
at one place on every view.

### Its size

* **Twice its height on the card**: `--role-view-logo-height`, 36px, and
  `--role-view-logo-height-tall`, 56px, for a logo the content marks `logoTall` (ToBeIT's and EDP's).
  DDR-066's `logoTall` flag carries over unchanged. `logoRaised` does not apply on the view: it
  levels a card with its neighbours in the row, and the view has no neighbour beside it.
* **No wider than the column, at every width.** A long wordmark is scaled down to 160px, and at
  narrow widths to the panel. So Randstad's is 160 × 24px and Ponera's 160 × 30px, on a phone as
  beside the title. Without the cap, Randstad's ran 242px across a phone's panel, much heavier than
  ABB's 93px.
* All three are in rem, so the logo and its column grow with the reader's text, as the title does.

### The company's label stays

The pill stays where DDR-059 puts it, and the logo is hidden from assistive technology, with an
empty `alt`, as DDR-066 hides the card's. Three reasons:

* **Not every logo says the company's name.** Ponera Group's says "PONERA". EDP's sets "Electrónica
  Digital de Protección" in small letters beside its mark. The pill is the company's name, written.
* **A screen reader names the company once.** The logo is skipped and the pill is read, so the
  issue's rule holds: the company is never announced twice in a row. Alternative text on the logo,
  with the pill kept, would have read "ABB, ABB".
* **The pill belongs to the line of facts** (company, dates, place) that DDR-059 draws as one line.
  Dropping it would leave that line without its subject when the logo doesn't load.

### The logo's ground, loading and files

* **No tile.** The logo stands straight on the panel's tint, `--color-surface-tag`, as DDR-066 put
  the card's on the card's white after the owner turned down the design's tile on #193. Every file
  has a transparent ground. Each brand's own colours (ABB's red, Randstad's blue, Ponera's orange
  and black, ToBeIT's green and blue, EDP's orange and black) stay clear on the pale tint.
* **The brand's own form and colours**, never recoloured, per DDR-044. The logo is scaled whole and
  never cropped or distorted.
* **It is not lazy.** It is at the top of the view, above the fold at every width. React therefore
  preloads it.
* **One file per company, at twice the view's height**: the owner's PNG original, trimmed to its
  mark and saved as lossless WebP, 72px tall, and 112px for a tall logo. Where the original is
  shorter than that, it is used at its own height and never enlarged: EDP's is 82px and ToBeIT's
  101px. The card draws the same file at a quarter of the height (or about a third, for the tall
  ones), so it still draws at DDR-066's 18px and 28px, and is sharper than before on a dense
  screen. The five files are 39 KB together, where they were 22 KB.

## Alternatives Considered

### The logo above the pill at every width

Pros:
* One layout and no wrapper, and no title gets narrower at the wide breakpoint.

Cons:
* At 1280px the panel kept its empty right two-thirds and got a row taller. The issue asked for the
  wide header's room to be used.

### The logo at the panel's right, opposite the title

Pros:
* Fills the empty space exactly where it is, and the title keeps the panel's left edge.

Cons:
* The logo would come after the title in the markup, so below the wide breakpoint it would sit
  under the title, at the panel's foot. Putting it first in the markup and drawing it at the right
  is reordering, which DDR-014 and the stylesheet tests rule out.

### A hairline between the logo's column and the title

Pros:
* Separates the two columns more firmly. It was mocked in the panel's border tint.

Cons:
* It needs room on both sides of the line. That room pushed ABB's title onto two lines at 1280px,
  with "- Digital Solutions" starting the second. The panel's own space separates the columns well
  enough without it.

### Drop the pill, and give the logo the company's name as alternative text

Pros:
* No company named twice on screen, and the logo carries the name for a screen reader.

Cons:
* Ponera's and EDP's logos don't spell the company's name as the page does, and the line of facts
  loses its subject when the logo doesn't load.

### A separate, larger file for the view

Pros:
* The card's files stay exactly as they were.

Cons:
* Two files per company, and a second path in the content for one picture. The card's 18px draws
  the larger file just as well.

## Consequences

Benefits:
* A role's view carries the mark a reader chose it by, and a reader who arrives from a shared link
  sees the company at once.
* From the wide breakpoint, the panel's width holds the role, and every title still takes one line
  at 1280px and 1536px.
* Every logo, on the card and the view, is drawn at twice its displayed height or from the full
  original.

Tradeoffs:
* From the wide breakpoint the title's column is 192px narrower. With windows from about 960px to
  1140px wide, ABB's and Randstad's titles took one line and now take two. Below that they already
  took two. EDP's pill line wraps
  "Barcelona, Spain" onto a second line at 1280px, as it already did on a phone.
* EDP's and ToBeIT's files are drawn at 1.5 and 1.8 pixels per CSS pixel at 56px, short of two,
  because their originals are 82px and 101px tall. A larger original from the owner would sharpen
  them.
* The view's panel is taller below the wide breakpoint by the logo and a flow step: 52px for a
  wordmark and 72px for a tall logo.

Risks:
* A longer job title could wrap beside the column at the page's widest. Check a new title at 1280px.
* A new logo wider than about 4.5:1 is capped by the column and reads shorter than 36px, as
  Randstad's does at 24px. Check a new logo at the column's width.
* `components/role-view.test.tsx` holds the logo's place, its empty `alt`, its tall size and the
  wide grid.

Measured on the built site in Chromium, on all five views, every 10px from 300px to 900px and at
1195px, 1280px and 1536px, at the browser's default text size and at 200%: nothing scrolls
sideways, the logo never reaches past the panel, the view has one `h1`, and no job title breaks
mid-word. No target was added or moved, so WCAG 2.5.8 was not swept again. The views do not print,
and the logo takes no box on the printed page (DDR-066), so the printed CV is unchanged.

## Related Documents

* GitHub issue #289, and Epic #216
* DDR-059 (role view), which this amends
* DDR-066, the company's logo on a role's card, whose files this re-exports
* DDR-044, a brand's mark is never recoloured
* DDR-014, the breakpoints and markup order
* ADR-004, binary assets as WebP, reached through `asset()`
