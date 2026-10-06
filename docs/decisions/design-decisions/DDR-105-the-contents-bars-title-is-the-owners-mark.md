# DDR-105-The Contents Bar's Title Is the Owner's Mark

Status: Accepted

Date: 2026-10-06

**Amends DDR-049 in two respects**: the title is no longer the words "Andreu’s site" in bold and
the heading ink, but the owner's "AO" mark; and the scroll clearance's title row, without script,
is now the mark's height and the gap below it rather than a line of text. Its place at the column's
left, the paragraph that holds it and the links' arrangement stand.

**Amends DDR-091 in two respects**: the title's link is named by `aria-label` rather than by its
visible text, and under the pointer and on keyboard focus the mark fades a little rather than
taking the accent. Where the link leads, what choosing it does, that it is never marked and that it
is the bar's first tab stop all stand.

**Amends DDR-031's height**: the bar is the design's 64px, where it was 48px. It is still a
minimum, in rem, and the clearance still follows it.

## Context

Issue #330, under Epic #216, asks for the contents bar's title to be the mark the owner drew in
`career-site-design`, layer `career-site-main`: the link `552:604` ("Link - Andreu Ortega Blasi —
home") holding `BrandMark`, `552:605`. The mark is 59 by 40px: a capital A in a deep indigo
(#1e1b4b) overlapped by a ring, the O, in a gradient from indigo (#312e81) to violet (#7c3aed). The
same mark is to become the site's icon (#331), so the reader sees one mark in both places.

The story left four things to the UI Designer: the mark's size and the bar's height, the link's
accessible name, its hover and focus states, and any colour the tokens did not hold. The design
draws the mark 40px tall in a bar 64px tall (`552:603`), with 12px above and below it. The bar was
48px. Since Epic #70 the design prevails.

## Decision

**The bar's title is the owner's mark, drawn as the design draws it, at 40px in a 64px bar. It
leads home as the title did, its link is named "Andreu Ortega Blasi, home", and it fades a little
when pointed at or focused.**

### The mark

* **Drawn exactly as the design draws it**: its three paths and its gradient's line, on its own 59
  by 40 grid, unaltered. It is inline SVG, drawn by `BrandMark`, as the icons are, so it is sharp at
  every size and its inks are tokens.
* **Its inks**: the A and its crossbar in `--color-brand-mark-ink`, which is the chat's
  `--color-text-chat`; the O from `--color-brand-mark-start`, #312e81, the one new colour, to
  `--color-brand-mark-end`, which is `--color-accent-violet`. On the bar's surface they are 14.92:1,
  10.66:1 and 5.32:1, so each clears WCAG 1.4.11's 3:1 as a mark; the violet is no worse than 4.87:1
  with black behind the bar's 96%.
* **Never recoloured**, in any state.

### Its size and the bar's

* **The mark is 40px tall, `--contents-bar-mark-height`, in rem**, so it grows with the text as the
  words it replaces did: 80px at 200%.
* **The bar is 64px, `--contents-bar-height`**, the design's, so the mark has the 12px above and
  below that the design draws. At 48px it had 4px, which looked cramped against the design.
* **The title lays the mark out as a flex item**, not on a line of text, so no line box or descender
  space is added below it.

### Its link

* **It leads where it did** (DDR-091): `#top` on the page, gliding and marking Home and closing the
  menu as Home does; the page's route from a view.
* **Its box is the mark's**, 59 by 40px, with the small radius, so the base styles' focus outline
  follows a rounded box, as the design rounds the link (6px; the nearest token, 4px, is used).
* **Its name is "Andreu Ortega Blasi, home"**, from `content/contents.ts`, carried by `aria-label`.
  It says whose site this is and where the link goes, as the design's layer name does. The mark is
  `aria-hidden`, so a screen reader announces one link, not an image and a link.
* **Under the pointer and on keyboard focus the mark fades to 80%**,
  `--contents-bar-mark-hover-opacity`, over the 150ms the bar's other states take, for a reader who
  has not asked for less motion. It is the mark that fades, not the link, so the focus outline keeps
  its full ink. DDR-035's state is a change to the accent, which the mark cannot take without being
  recoloured; a fade is the smallest change that still says the mark is live.

### What it costs

Measured on the development server, from 320px to 1280px, at the browser's default text size and at
200%:

* **The bar is taller**: 64.8px with its hairline, where it was 48.8px, at the default text size;
  128.8px at 200% at every width, where it was 125.6px from 300px to 370px and 96.8px from 380px. On
  a phone at 200% it is now one row, the mark and the button, where the title's words took two lines
  below 380px.
* **The clearance follows**: 80px, and 160px at 200%, so every heading still lands below the bar.
  Without script, below the wide breakpoint, it is 128px where the bar is 95.8px; there the mark sits
  at the bar's top edge, because the links' rows below it take the bar's slack.
* **The chat's panel is 16px shorter** on a wide window, since its height is the window less the
  bar's (DDR-102).
* **Nothing scrolls sideways.**
* **No pair of targets fails WCAG 2.5.8**: the mark's link is 59 by 40px, 118 by 80px at 200%, and
  ends at least 107px before the menu's button.
* **WCAG 2.5.3, Label in Name**: the mark shows the letters "AO", which are not in its name. A
  reader who chooses by what they see, by voice, cannot say "AO". The name keeps the owner's name
  and "home", which the design's layer gives it; the letters, read as a word, would name nothing.
  This is recorded as a shortfall, as the project's rule asks, not designed around.
* **Paper is untouched**: `nav` is not printed (DDR-015), and the chat does not print.

## Alternatives Considered

### Keep the bar at 48px and draw the mark at 40px in it

Pros:

* The bar keeps its height, and nothing below it moves.

Cons:

* 4px above and below the mark, where the design draws 12px. It looked cramped on the development
  server beside the design's own bar.

### Keep the bar at 48px and draw the mark smaller, at 32px

Pros:

* The bar keeps its height, and the mark gets 8px of room.

Cons:

* It is not the design's size, and the design prevails.

### Keep the accent on hover, by recolouring the mark

Pros:

* The bar's states would all be the same change.

Cons:

* It recolours the owner's mark, which the story asks to keep unaltered.

### Name the link "Andreu’s site" or by the letters "AO"

Pros:

* The first keeps the title's old words; the second matches what is seen (WCAG 2.5.3).

Cons:

* "Andreu’s site" does not say the link leads home, which the story asks. "AO" names nothing a
  screen reader's listener would recognise.

## Consequences

Benefits:

* The site has one mark, in the bar and, with #331, in the tab.
* On a phone at 200% text the bar is one row, where the words wrapped to two.

Tradeoffs:

* The bar takes 16px more of every window, 32px at 200% text.
* One more colour in the palette, #312e81, used only by the mark.
* The mark's link fails WCAG 2.5.3, as recorded above.

Risks:

* The gradient's id is fixed, `brand-mark-ring`, because the mark is drawn once per page. A second
  mark on one page would need its own id.

## Related Documents

* Issue #330, Epic #216; the icon story, #331.
* `career-site-design`, layer `career-site-main`, nodes `552:602` to `552:605`.
* DDR-031 (the bar), DDR-049 (its title), DDR-091 (the title leads home), DDR-075 (the menu),
  DDR-035 (hover states), DDR-027 (targets), DDR-025 (the palette), DDR-102 (the chat).
