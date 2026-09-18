# DDR-036-Timeline Ringed Dot and Continuous Line

Status: Accepted

Date: 2026-09-18

**Amends DDR-010** in one respect: its spine. DDR-010's spine is "a dot at the top of each row, and
a vertical line running from it to the next row", and the page built that as a plain disc with a
line that stopped short of it on either side. The spine is now the design's: a ringed dot with an
accent core, on one line that runs unbroken from the first dot to the last. Everything else DDR-010
decides about the timeline stands — its three columns, its single column below the wide breakpoint
with no spine at all, its decorative status, and its rule that the line does not run past the last
row.

**Amends DDR-025** in one respect, and corrects it in another. Under "What this record does not
settle" it kept two differences as structure: the design's ringed dot, and the absence of a spine
in the experience section. The first is now adopted. The second was a misreading of the file, and
is withdrawn: node 2:99 is the row's empty spine column, and the experience section's spine is its
own node, 2:89, a 2px `#c7d2fe` line behind all five rows. Nothing DDR-025 decides about colour
moves: the ring and the line are `--color-border-accent`, and the core is `--color-accent`, both
already in its palette and already measured.

## Context

Epic #70 closes the gaps between the page and the Figma design. On 2026-09-17 the owner decided
that the design prevails everywhere. Issue #116 is this one.

The timeline is what makes experience and education scannable: the eye runs down the line and
stops at each entry. The page marked each stop with a 12px disc in the line's own pale tint, and
stopped the line 4px short of the disc above and below, which DDR-010's UI Review drew as a clear
ring around the dot. So the stops barely stood out from the path, and the path was broken into
segments.

Read off `career-site-design`, node by node:

| Node   | What it is                                    | Value                                                     |
| ------ | --------------------------------------------- | --------------------------------------------------------- |
| 2:89   | The experience spine                          | A 2px `#c7d2fe` line, from the first dot to the section's foot |
| 2:260  | A marker, one per row (2:262, 2:264, …)       | A 12px circle in `#f8f7f4`, ringed by `0 0 0 3px #c7d2fe` |
| 2:261  | Its core                                      | A 6px `#4f46e5` circle, inset 3px                         |
| 2:568  | The education timeline                        | The same line and markers                                 |

The marker's centre is 11px below the top of its row, which is the centre of the title's 21px first
line. The Make file says the same in its own terms: `w-3 h-3 rounded-full ring-[3px]
ring-[#c7d2fe]`, surface-filled, with an `inset-[3px]` `#4f46e5` core, and the line one absolute
2px element behind the rows.

## Decision

From the wide breakpoint, and on paper:

* **Each row's marker is the design's ringed dot.** A 12px circle in the page's surface, a 3px ring
  of `--color-border-accent` around it, and a 6px `--color-accent` core at its centre, so the
  surface shows as a 3px band between the core and the ring. The circle and the core are in rem, as
  the dot always was, so they keep their proportion to the text; the ring is a hairline in px, as
  the line it joins is. Tokens: `--timeline-dot-size`, `--timeline-dot-core`, `--timeline-dot-ring`.
* **One line runs from the first dot to the last**, in each section. Each row's spine is three
  pieces with no space between them — the line coming down into the dot, the dot, and the line
  leaving it — and the rows abut, so the pieces join into one line. The line meets the ring rather
  than stopping short of it; since the ring is the line's own colour and the circle inside it is
  opaque, the line reads as passing behind the marker.
* **The line starts at the first dot and ends at the last.** The first row's lead is not drawn, and
  the last row draws nothing below its dot, as DDR-010 already had it.
* **The dot is level with the title's first line.** `--timeline-dot-offset` is half of what an item
  title's line leaves once the dot and its ring are taken out, so it is measured from the title's
  own size and leading rather than from a number of its own. It is 0 at the default text size,
  where the ringed dot's 18px fits the title's 18px line exactly, and grows with the text.
* **The core prints; nothing else about the spine does.** The ring, the line and the surface inside
  the ring are hairline and surface tokens, which DDR-015 makes transparent on paper. The core is
  the accent, which is an ink and is not dropped, so each printed entry keeps a 6px accent dot
  beside its title, as it keeps its accent dates. That is the answer #116 asked to have recorded.

Unchanged: below the wide breakpoint the spine is not rendered at all, per DDR-010, and the spine is
`aria-hidden` and adds nothing to any entry's accessible name. The core is a pseudo-element, so the
spine gains one empty element, the lead, and no content.

## Alternatives Considered

### Option A: draw the ring as a box-shadow, as the design and the Make file do

Pros:

* It is the design's own mechanism, and a box-shadow takes no space, so the dot's box stays 12px.

Cons:

* A box-shadow in a component must be a token, per DDR-020, and every shadow token is named for a
  light on the page. A ring is a hairline, not a light, and would be the first shadow that prints
  as nothing because its colour is dropped rather than because the shadow is.
* A border draws the same ring. The offset absorbs the space it takes, so the marker sits where the
  design puts it either way.

### Option B: one line element behind every row, as the Make file draws it

Pros:

* It is literally one line.

Cons:

* It needs an element spanning the section, positioned behind the rows. `components/stylesheets.test.ts`
  takes nothing but a pseudo-element out of the flow, per DDR-021, and the section component knows
  nothing about timelines.
* Three abutting pieces per row draw a line with no visible join, measured at 0px apart between
  every pair of rows at both text sizes.

### Option C: run the line to the foot of the last row, as node 2:89 does

Pros:

* It is the file exactly: the line ends 6px above the section's end, well below the last dot.

Cons:

* #116 asks for the line from the first marker to the last, and DDR-010 says it does not run past
  the last row. A line trailing below the last entry points at nothing. This is the one place the
  page stays short of the file, and it is recorded rather than absorbed.

### Option D: keep the core off paper as well

Pros:

* Every other part of the spine is dropped on paper, per DDR-015.

Cons:

* It needs a print rule in the component, which DDR-015 keeps for screen-only elements; the core is
  not screen-only, it is an accent mark like the date beside it. Printed, the core is a quiet stop
  beside each title, and it costs no space and moves no break.

## Consequences

Benefits:

* Each entry's stop stands out from the path in the accent, and the path is one line.
* The dot's position is derived from the title it marks, so enlarged text keeps it level: measured
  0.6px from the centre of the title's first line at 100% and at 200%.

Tradeoffs:

* The line ends at the last dot, where the file carries it on to the foot of the last row.
* The ringed dot is 18px across where the disc was 12px. It fits the 28px spine column with 5px to
  spare on either side.

Risks:

* The offset reads `--font-size-item-title` and `--line-height-heading`. If either changes — #118
  sets running text with the design's leadings — the dot follows the title, which is what it should
  do, but it is worth a look.
* Chromium draws a border narrower than written when the window is scaled, as at a 125% Windows
  display in an automated browser, where every border on the site measures 0.8 of its width. The
  ring is a border, so it does the same; at a device pixel ratio of 1 it is 3px.

Measured on the built page in Chromium, at 320px, 360px, 390px, 800px and 1280px at the default
text size, and at 320px to 1700px at 200%: nothing scrolls horizontally, the spine is absent below
the wide breakpoint, the widest date range sets on one line, the dot is within 0.6px of the title's
first line, and the gap between one row's line and the next row's is 0px. Under print media the
ring, the line and the surface are transparent and the core is `#4f46e5`. The sheet was not printed
to PDF on this story: the spine is shorter than every row it sits in, so the rows' heights are their
content's and no break should move, but that is reasoned rather than measured.

## Related Documents

* Issue #116, Epic #70
* DDR-010, the timeline pattern, whose spine this amends
* DDR-025, the colour system, whose note on the dot and the experience spine this amends and corrects
* DDR-015, the print treatment, which drops the ring and the line
* DDR-020, the one elevation, which is why the ring is not a shadow
* DDR-021, which admits only pseudo-elements out of the flow
* Figma `career-site-design`, nodes 2:89, 2:260 to 2:269, and 2:568
