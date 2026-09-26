# DDR-059-The Introduction's Photo Is Centred on Its Text

Status: Accepted

Date: 2026-09-26

**Supersedes nothing.** It refines DDR-010, which puts the photo beside the name, and DDR-040,
which sizes the wide photo and spaces the introduction. Neither record says where the photo sits
vertically in its row. The page set it level with the top of the text, and this record decides the
alignment in its place.

It **adds no token and no component**. The whole change is one declaration in
`components/introduction.module.css`: from the wide breakpoint the introduction's grid centres its
two items, `align-items: center`, where it set them at the start.

## Context

From the wide breakpoint the introduction is a grid of two columns, per DDR-010 and DDR-040: the
photo in the first, and in the second the greeting, the name, the positioning line, the location,
the summary and the four pills. Both items were aligned to the top of the row.

The two columns are rarely the same height. From 768px to about 1125px, at the default text size,
the text is the taller one: at 894px it is 355.1px and the photo 262.2px, so the photo's top was
level with the greeting and the 92.9px of difference was all below it. From about 1125px up the photo is the taller one, since
DDR-040 sizes it by the viewport, and the difference was all below the pills instead. Either way,
one half of the introduction looked pinned to the top of the other.

The owner asked on #178 for the photo to be centred on the text. They chose to keep the
introduction's band exactly as tall as it is, rather than filling the first screen, and to leave
the layout below the wide breakpoint alone.

The story belongs to Epic #170, which excludes design changes apart from #173 and #176, so #178 is
an exception the owner chose.

## Decision

**From the wide breakpoint, the photo and the text column are centred on each other.**

* **The row is as tall as the taller of the two, and the shorter is centred in it**, so the space
  above it and below it are equal. Where the text is taller the photo moves down. Where the photo is
  taller the text moves down, and it is centred on the photo instead. Neither is pinned to the top.
* **The band does not change.** The row's height is the same whichever way its items are aligned, so
  the introduction's height, the first divider and everything below it stay where they were.
* **Below the wide breakpoint nothing changes.** The photo is small and floats beside the greeting
  and the name, per #48 and #68, and the summary and the pills run under it. There is no column to
  centre on. Giving the photo one on a phone was rejected on #48, because it pushed the pills below
  the fold.
* **Paper does not change.** The printed introduction is the narrow float layout, per DDR-015, and
  writes no grid.
* **The markup order and the reading order are unchanged**, per DDR-014. Only where each item sits
  in its row moves.

## Alternatives Considered

### Keep both at the top of the row

Pros:

* The greeting starts level with the top of the photo, which is a clear edge to read from.

Cons:

* Whichever item is shorter leaves all its space below it. At the widths most visitors see, the
  photo floated high beside a taller column of text, which is what the owner asked to change.

### Make the introduction fill the first screen and centre its content in the window

Pros:

* The introduction would read as a complete first screen at any window height.

Cons:

* It changes the band's height at every width, and so where the first section begins. That is a
  larger design change than the owner asked for, and they declined it on #178.
* On a short window or with enlarged text the content is taller than the screen, so the rule would
  need a fallback, and a phone's controls could move below the fold.

### Centre only the photo, and keep the text at the top

Pros:

* It is what the issue's words ask for most literally.

Cons:

* Where the photo is the taller one, from about 1125px up, centring it changes nothing, and the text
  keeps its space all below the pills. Centring both is the same rule seen from either side, and it
  holds at every width.

## Consequences

Benefits:

* The photo and the text read as one balanced block at every width from the wide breakpoint.
* One declaration, no token, and nothing outside the introduction moves.

Tradeoffs:

* **The greeting no longer starts level with the top of the photo** in the wide layout. From about
  1125px up, the text starts lower than it did: 10.6px at 1195px, 23.1px at 1280px and 35.3px at
  1536px. The pills end lower by the same amount, which is still well above the fold on a desktop.

Risks:

* A change to the photo's size, or to the text's length, changes which of the two is taller, and
  so which one moves. The rule holds either way, but the widths recorded below will move with it.

## Measurements

Measured in Edge against the static build of `main` and of #178, each served on its own port, so
that nothing but the declaration differs. Widths are the viewport. Edge draws a 15px scrollbar.
Positions are from the top of the page.

### The wide layout

| Width  | Text | Band            | Photo, before  | Photo, after   | Text           | Centres differ by |
| ------ | ---- | --------------- | -------------- | -------------- | -------------- | ----------------- |
| 768px  | 100% | 49 – 541.9      | 105 – 345      | 175.5 – 415.5  | 105 – 485.9    | 0px               |
| 894px  | 100% | 49 – 516.1      | 105 – 367.2    | 151.5 – 413.7  | 105 – 460.1    | 0px               |
| 1195px | 100% | 49 – 511.5      | 105 – 455.5    | 105 – 455.5    | 115.6 – 444.9  | 0px               |
| 1280px | 100% | 49 – 536.5      | 105 – 480.5    | 105 – 480.5    | 128.1 – 457.4  | 0px               |
| 1536px | 100% | 49 – 561        | 105 – 505      | 105 – 505      | 140.3 – 469.7  | 0px               |
| 1536px | 200% | 97 – 1029.3     | 209 – 689      | 323.1 – 803.1  | 209 – 917.3    | 0px               |

From about 1125px up, at the default text size, the photo is the taller one, so it stays where it
was and the text is centred on it. Before the change the text started at 105px there, level with
the photo. With text at 200% the wide breakpoint is 1536px, so 768px to 1280px take the narrow
layout at that size.

### Everything else

Swept every 10px from 300px to 900px, and at 1195px, 1280px and 1536px, at the browser's default
text size and at 200%:

* **The band's top and bottom, the first section, the page's height and the controls row's width
  are identical before and after at every width.**
* Below the wide breakpoint every box in the introduction is identical before and after, at both
  text sizes. At 390 by 844 the controls end 687.3px down, above the fold, before and after.
* Nothing scrolls sideways at any width, before or after.

### Paper

Printed to A4 in Edge and Firefox, with background graphics on and off, before and after, and read
back through pypdf and rendered through pdfium at 100dpi: five sheets in all eight, every sheet
pixel-identical before and after, the text identical, and no replacement character.

## Related Documents

* docs/decisions/design-decisions/DDR-010-career-page-redesign-structure.md — the photo beside the
  name
* docs/decisions/design-decisions/DDR-040-introduction-proportions.md — the wide photo's size and
  the introduction's spacing
* docs/decisions/design-decisions/DDR-021-profile-photo-shape-and-light.md — the photo's shape and
  lights, unchanged
* docs/decisions/design-decisions/DDR-056-introduction-greeting-and-location.md — the text column's
  contents
* docs/decisions/design-decisions/DDR-014-responsive-strategy.md — the breakpoints and the markup
  order
* docs/decisions/design-decisions/DDR-015-print-treatment.md — the printed introduction's float
* GitHub issue #178, Epic #170, and #48 and #68
