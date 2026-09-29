# DDR-080-A Project's Business Case Shows One Item at a Time

Status: Accepted

Date: 2026-09-29

**Amends DDR-079**: the business case is no longer a list of the owner's labelled items. It is one
card that shows one item at a time, which the reader steps through with "Prev", "Next" and a dot per
item, as the owner drew it in `career-site-experience-business-case`. Everything else DDR-079
decides stands: the switch, what it hides, the download and its place. **Amends DDR-023**: the key
figure is set in Lora, which DDR-023 keeps for `h1` and `h2`. **Extends DDR-070**: the card is drawn
as a timeline card is. ADR-015 records how the card holds which item is shown.

## Context

On #240, part of Epic #152, the owner drew a new layout for the business case in the Figma file
`career-site-design`, layer `career-site-experience-business-case` (node 365:26): a card of one item,
with the item's label in a pill, an icon beside a headline, its text, a key figure with a caption
below a hairline, and at its foot "Prev", five dots and "Next". The layer draws only NumisBook, at the
wide width, on its first item, and its copy is placeholder.

The icon, headline and key figure are not in the site's content. The owner asked for them as fields
in the knowledge base, under each item of every portfolio entry, and fills them. The story leaves
the card's tokens, what the controls do at the ends, the card's height, its phone layout, the icon,
the headline's level and the dots' target size to the UI Designer.

## Decision

**A card of one item at a time, drawn as a timeline card, whose items loop, whose height is its
tallest item's, and which shows every item to a reader without script.**

| Property | Value | Why |
| --- | --- | --- |
| Place | Where DDR-079's list was: `--space-medium` below the switch, in the overview's place while the business case is shown | Only the business case's layout changes. |
| The card | `--surface-timeline-card`, a 1px `--color-border-timeline-card` edge, `--radius-large`, `--shadow-raised` with `--shadow-card-highlight` | The layer draws the timeline card's gradient, violet edge and white top line. It rests raised, as a role's card does, per DDR-063. |
| Inside the card | `--space-medium` (16px) on a phone, `--business-case-padding` (24px) from the wide breakpoint | The design's 24px, with the phone's column kept for the text, as DDR-059 pads a role's panel. |
| An item's label | A pill in `--color-surface-case-label`, `--business-case-label-block` by `--business-case-label-inline` (2px by 10px), the accent in bold capitals at `--font-size-xxxx-small`, `--letter-spacing-x-loose` | The design's pill (node 365:30). The new colour is the accent at 10% over the card's darkest stop, `#dee1fc`, where the pill sits. The accent on it is 4.87:1. |
| The icon | The owner's character, at `--business-case-icon-size` (24px), `aria-hidden`, `--business-case-gap` (12px) beside the headline and centred on it | An emoji, as the design draws "⚠️". It repeats what the headline says, so it is not announced. |
| The headline | An `h2`, in the serif and weight every `h2` takes, at `--font-size-large` (16px), untracked, in the heading ink, `--space-medium` below the label | The design sets it in Lora semibold at 16px (node 365:38). An `h2` under the view's `h1` skips no level in either account. |
| The text | `--font-size-x-small` (13px) at `--line-height-prose`, in `--color-text-secondary`, 12px below the headline, or 16px below the label where there is none | The design's 13.4px at 22.78px (node 365:42); 13px is the scale's nearest step. |
| The key figure | The figure in Lora semibold at `--business-case-figure-size` (24px), `--letter-spacing-tight`, in the accent; its caption at `--font-size-xxx-small` in `--color-text-muted`, 12px after it on one baseline; both 16px below a `--color-border-timeline-card` hairline, 16px below the text | The design's (node 365:44). It draws the figure bold; the site carries Lora at 400 and 600 only, and a weight is a font file, per DDR-011, so it is semibold. |
| A field left empty | Draws nothing, and leaves no room in its place | The owner fills the fields over time. A slide with its label and text alone is a complete slide. |
| The foot | Below a `--color-border-timeline-card` hairline, 12px above and below, "Prev" at the left, the dots in the middle, "Next" at the right | The design's (node 365:54). |
| "Prev" and "Next" | `button`s, each its chevron and its word, 4px apart, `--font-size-xxx-small` in medium, in `--color-text-muted`, the accent under the pointer and on focus | The design's, and DDR-035's answer to the pointer. Each word is its accessible name, so a speech user says what they see. |
| The dots | A `button` per item, a 6px pill (`--business-case-dot-size`) in `--color-border-accent`, 6px apart; the item shown's is 20px long (`--business-case-dot-current`) in the accent and carries `aria-current="true"`; each is named for its item's label | The design's (node 365:60). The state is the attribute, so what is drawn is what assistive technology is told. |
| At the ends | The items loop: "Next" on the last shows the first, "Prev" on the first shows the last | The design draws "Prev" on the first item in the same ink as "Next", not as spent. A control that is never spent is never skipped by focus. |
| The card's height | The tallest item's, whichever item is shown | Every item is laid out in one cell and only the one shown is visible, so the foot and the download below it never move under the pointer as the reader steps. |
| The items not shown | `visibility: hidden` | Out of the accessibility tree and the tab order, but still taking their room, which is what holds the height. |
| Announcing | The items are a polite live region, each a group named for its label | The item a control shows is read when it is shown, and a reader who arrives at it hears which it is. |
| Focus | Stays on the control pressed | The reader can press "Next" again without looking for it. |
| Without script | Every item is shown, one below the other, 32px apart, and the foot is not drawn | No control can change the item shown, so none is offered, and every item can still be read. |
| On a phone | The same card, padded 16px; the foot shares one line at the default text size at every width, and with text at 200% below 440px it wraps into three rows at the start of the line | The design draws only the wide width. Nothing on it is too wide for a phone. |
| Motion | None | The item changes at once, so a reader who prefers reduced motion loses nothing. No item changes on its own. |
| On paper | Nothing | A view does not print. |

**Targets, measured against WCAG 2.5.8.** "Prev" and "Next" are 16.5px tall at the default text
size, and pass by the spacing exception at every width and text size swept: nothing else is within
12px of either's centre. **The dots fail the criterion themselves**: each is 6px, and their centres
are 12px apart. They meet it through its *equivalent* exception, because "Prev" and "Next" reach
every item and pass. This is the design prevailing, as the owner decided on 2026-09-17, and it is
recorded here by name. Epic #152's Definition of Done asks that no pair of targets fail 2.5.8; the
dots rely on the exception rather than meeting that outright.

**Contrast, from the tokens, at the card's darkest stop.** The text is 6.78:1, the label on its pill
4.87:1, and the headline and the figure pass as a timeline card's title does. Two pairings fail, as
the design draws them, and `app/tokens.test.ts` holds both by name:

* "Prev", "Next" and the key figure's caption are the muted ink, 4.26:1, as on a tag's tint, which is
  the same colour. They fail WCAG 1.4.3.
* The dots not shown are `--color-border-accent`, 1.33:1. They say which items are not shown, so
  WCAG 1.4.11 asks 3:1 of them, and they fail it. The dot shown is the accent, at 5.62:1, and is
  longer than the rest, so which item is shown is not told by colour alone.

The two inner hairlines are the card's edge colour, where the design draws them a little lighter
(violet at 20% rather than 30%), and the gradient is DDR-070's 143° with its grain, where the layer
draws 146° without it. Neither is a new token.

Measured on #240 in Chromium: all four views in the business case account, every 10px from 300px to
900px and at 1280px and 1536px, at the default text size and at 200% (504 measurements). Nothing
scrolls sideways, and nothing reaches past the card. The card is 193px tall at 1280px on every item
of NumisBook. With script disabled, every item is visible in order and the foot is not drawn.

## Alternatives Considered

### The dots at WCAG 2.5.8's 24px, or 24px apart

Pros:
* Every target would meet the criterion outright, as Epic #152's Definition of Done asks.

Cons:
* The dots would be four times the drawn size, or the row four times as long, which is not the
  design, and the owner decided the design prevails. "Prev" and "Next" already give every reader a
  target that meets the criterion.

### "Prev" and "Next" spent at the ends

Pros:
* The ends of the sequence are shown.

Cons:
* The design does not draw them spent. A disabled button drops the focus of a reader who has just
  pressed it; one that stays focusable but does nothing is a control that lies.

### A card whose height follows the item shown

Pros:
* No room is kept for a longer item.

Cons:
* The foot, and the download below the card, would move under the pointer each time the reader
  steps, so pressing "Next" twice could press something else.

### Radios, as the switch holds its state

See ADR-015.

## Consequences

Benefits:
* The business case reads one item at a time, with its evidence beside it once the owner fills the
  fields, as the owner drew it.
* A new item, headline, icon or figure is content alone.

Tradeoffs:
* The site has a second Client Component, per ADR-015.
* The card keeps room for its longest item, so a short item stands in more space than it needs.
  At 200% text on a 300px screen the card is about 1,050px tall.
* Two pairings fail WCAG as drawn, and the dots rely on 2.5.8's equivalent exception.

Risks:
* A much longer item makes every item's card that tall. Rerun the sweep after a long one lands.
* An emoji is drawn by the reader's system, so it looks different from one system to another.
* Only the item shown is on screen, so a search in the page (Ctrl+F) does not find words in the
  others.

## Related Documents

* Issue #240 and Epic #152
* ADR-015, how the card holds which item is shown
* DDR-079, the switch and the download, which this amends
* DDR-070, the timeline card, whose surface the card takes
* DDR-023, faces and weights, which this amends for the key figure
* DDR-027, target sizes, and DDR-035, hover
* DDR-025, the palette and its pairings
