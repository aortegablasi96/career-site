# DDR-077-The Photo and the Name Balance on a Phone

Status: Accepted

Date: 2026-09-28

**Amends DDR-014 in one respect**: the narrow breakpoint no longer adapts the page title. The name
has two role tokens instead, as a project view's title has since DDR-050: a narrow one,
`--font-size-page-title-narrow`, which the introduction reads below the wide breakpoint, and the
full one, `--font-size-page-title`, which it reads from the wide breakpoint and on paper. The
narrow breakpoint now adapts three role tokens and the language columns. The two breakpoints, the
markup order, hover and the rule that nothing scrolls sideways from 320px all stand.

**Amends DDR-022 in one row of its table**: `xx-large`, 36px, is the name at every width below the
wide breakpoint, where it was the name below the narrow breakpoint only. The ten steps stand.

**Amends DDR-021 in one number**: the narrow photo is `7.5rem`, 120px, where it was `6rem`. The
ratio, the capsule, both lights and the wide width stand.

**Amends DDR-010's introduction below the wide breakpoint**: the photo no longer floats beside the
text on screen. It and the name are one row, centred on each other, and every block after the name
takes the full column beneath them. The photo is still beside the name at every width, and the
float is now paper's alone. **It extends DDR-059**, which centres the photo on its text from the
wide breakpoint, to the one row on a phone where the two meet.

DDR-056's `hgroup` and #68's rule are unchanged. The greeting and the name move as one box, and
the box moves below the photo rather than being squeezed.

## Context

The owner opened #225, part of Epic #216, after looking at the introduction on a phone. Measured on
the live site:

* At 390px the name was set at 51.2px, the full page title, which DDR-014 restores from the narrow
  breakpoint, 320px, up. It ran three lines, 184px tall, 212px with the greeting, beside a photo
  96px wide and 128px tall. The name dominated and the photo read as an afterthought.
* At 320px with a classic scrollbar, 305px of content, the name no longer fitted beside the photo
  and dropped below it, per #68. That left the photo alone at the left with an empty band beside
  it.

The owner asked for the two to stand side by side and balanced, at every width from 320px to the
wide breakpoint. From the wide breakpoint up, and on paper, the introduction was to stay exactly as
it was. They ruled out stacking the photo above the name, as they did on #48.

The story left it to the UI Designer and the owner to decide where the balance came from: the name's
size, the photo's size, or both.

## Decision

**Below the wide breakpoint the name is 36px and the photo is 120 by 160, and the two are one row,
centred on each other.** The owner chose this on #225 over the same layout with a 128px photo and
over a 41.6px name.

| Property | Before | Now | Why |
| --- | --- | --- | --- |
| The name, below the wide breakpoint | 51.2px from 320px, 36px below it | 36px, `--font-size-page-title-narrow` | Three lines of the name at 36px, with the greeting, are 158px, the photo's height. At 51.2px they were 212px beside 128px. |
| The name, from the wide breakpoint and on paper | 51.2px | 51.2px, `--font-size-page-title` | Out of scope. It is written in `@media (min-width: 48em), print` in the introduction, as DDR-015 lets a component write it. |
| The photo, below the wide breakpoint | 96 by 128, `6rem` | 120 by 160, `7.5rem` | Tall enough to stand level with a name of three lines, and small enough that the name's longest word still fits beside it from 300px up. |
| The layout, below the wide breakpoint | The photo floats and the text runs past it | A wrapping flex row: the photo and the name share the first line, centred on each other; every block after the name takes a line of its own | See below. |
| The space below the pair | 8px below the photo; the positioning line 8px below the name | 8px below the photo and 8px below the name, then the positioning line's 8px | The frame and the name carry the same space below them, so they are centred exactly. The positioning line stands 16px below the taller of the two at every width. |
| The layout from the wide breakpoint | DDR-059's grid | Unchanged | |
| The layout on paper | The float | The float, now written in the print block | Paper is as it was. |

**Why the float became a row.** With the balanced sizes, the name of two lines is shorter than the
photo from 370px up, and the float let the positioning line run into the space beside the photo's
foot. It wrapped in an L around the photo: "Product" alone beside the photo at 320px, and the rest
of the line below it. A clear would have left an empty band beside the photo under the name, which
is what the story set out to remove. As one row, centred as DDR-059 centres the wide layout, the
name stands level with the middle of the photo whichever of the two is taller, and the positioning
line starts under both, at the full column.

**How the row is built.** The introduction is `display: flex` with `flex-wrap: wrap` and
`align-items: center`. The text column is `display: contents`, so its blocks become the row's items
in their markup order. A `div` has no role, so the accessibility tree loses nothing. The name's
`hgroup` grows from a basis of 0 and keeps `min-inline-size: min-content`. So where the photo leaves
it less than its longest word, it wraps onto the next line, which is #68's rule written for a row
rather than a float. Every other block takes `flex-basis: 100%`. Nothing is reordered, per DDR-014.

**Why the wide block now follows the print block.** On paper the introduction is block and the
photo floats. A sheet wide enough to match the wide breakpoint, such as A4 laid landscape, took the
grid before this change. For that sheet to still take the grid, the wide block has to win over the
print block, and at the same specificity the later rule wins. `components/introduction.test.tsx`
holds the order.

### Measured

At the browser's default text size, with the content width a phone gives, 300px to 900px:

| Width | Name lines, and the pair's height (greeting and name) | Photo | Beside |
| --- | --- | --- | --- |
| 300px to 360px | 3, 158px | 160px | Yes |
| 370px to 490px | 2, 114px | 160px | Yes |
| 500px to 767px | 1, 71px | 160px | Yes |

The name is level with the middle of the photo at every width, to the pixel. Before this change it
was below the photo at 310px. That is the width where the narrow breakpoint has just matched and
the full 51.2px name no longer fits beside the photo; with a classic scrollbar the same happens at
320px. Elsewhere it was beside the photo, with a pair 212px tall beside a photo 128px tall at
320px to 430px.

**At 390 by 844, with a phone's overlay scrollbar, the controls end 745.9px down, where they ended
790.2px, so they are 98.1px above the fold.** At 320px they end 771.7px down, where they ended
816px.

At 200% text the name moves below the photo, as #68 decided, up to 540px, and stands beside it from
550px, where it did from 500px, because the photo is larger. Below 550px the controls are 80px lower
than they were, from 2470px to 2550px at 390px.

Swept every 10px from 300px to 900px at the default text size and at 200%: nothing scrolls sideways,
neither the greeting nor the name ever breaks inside a word, and no pair of targets fails WCAG
2.5.8, measured as DDR-027 measures it.

From the wide breakpoint, every box in the introduction and the page's height are identical to the
tree before at 768px, 894px, 1280px and 1536px at the default size, and at 1536px and 1700px at
200%. Under print emulation at 643px and 794px they are identical too, 794px being wider than the
wide breakpoint.

Printed to A4 in Edge and Firefox, with background graphics on and off: five sheets before and
after, every sheet pixel-identical, the text identical through pypdf and pdfium, and no replacement
character.

The photo's file is 600 by 800, so it is drawn sharp at 3x at 120px.

## Alternatives Considered

### The same layout with a 128px photo

Pros:
* The photo reads a little larger on a phone.

Cons:
* At 320px to 360px the photo, 171px tall, is taller than the three-line name, 158px, where 120px
  matches it to 2px. The controls end about 11px lower.

### A 41.6px name, the project view's title, with a 128px photo

Pros:
* The name stays closer to its desktop size.

Cons:
* At 320px with a classic scrollbar the name no longer fits beside the photo and drops below it,
  which is the very layout the story removes.

### Keeping the 51.2px name and enlarging the photo to match it

Pros:
* The name is the design's size at every width.

Cons:
* A photo 212px tall is 159px wide. The name's longest word at 51.2px is 170.6px, so below about
  380px it no longer fits beside the photo and the name drops below it, which is the layout the
  story removes. At 320px it would have 113px.

### Keeping the float and clearing the positioning line

Pros:
* A one-line change to the layout, and paper and screen stay one layout.

Cons:
* Where the photo is taller than the name, from 370px up, it leaves an empty band beside the photo
  under the name, 46px tall at 390px and 89px from 500px, which is what the story set out to remove.
  The name also stays pinned to the top of the photo, where the wide layout centres the two.

### Stacking the photo above the name

Ruled out by the owner on #48 and again on #225.

## Consequences

Benefits:
* On a phone the photo and the name read as one balanced pair, side by side, from 300px up at the
  default text size.
* The narrow layout and the wide one now centre the photo and the name the same way.
* The controls stand 44px higher at 390px, so the first screen of a phone holds more of the
  introduction.
* Nothing changes from the wide breakpoint up, and nothing changes on paper.

Tradeoffs:
* The name is 36px below the wide breakpoint, where it was 51.2px from 320px up, so it is a smaller
  share of the first screen on a tablet in portrait.
* Paper's layout, the float, is now written in the print block rather than being the narrow screen's
  layout, and the print block has to come before the wide block.
* At 200% text the name moves below the photo at 500px to 540px, where it stood beside it, and the
  controls are 80px lower below 550px.

Risks:
* The balance is measured against "Andreu Ortega Blasi" and "Hi there, I’m". A longer name or
  greeting changes the line count, so a change to either should be measured again at 300px to 767px.
* The pair's height and the photo's height are 158px and 160px only while the heading's leading,
  the greeting's size and the space between them are what they are.

## Related Documents

* Issue #225 and Epic #216
* #48, the photo beside the name at every width
* #68, the name below the photo rather than squeezed
* DDR-010, the introduction, whose narrow layout this amends
* DDR-014, the breakpoints and role tokens, which this amends
* DDR-021, the photo's widths, which this amends
* DDR-022, the type scale, which this amends
* DDR-050, the project view's two title roles, whose pattern this follows
* DDR-056, the greeting and the name as one `hgroup`
* DDR-059, the wide introduction centred, which this extends
* DDR-027, target sizes
* DDR-015 and DDR-032, the printed CV
