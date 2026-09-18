# DDR-037-Skill Level Badge Above Its Skills

Status: Accepted

Date: 2026-09-18

**Amends DDR-010** in one respect: its skills pattern. DDR-010 makes each level block "a level
badge, the level as a word in a tinted pill, followed by that level's skills". The badge now stands
on a line of its own, and the skills start on the line below it, flush with the group's edge.
Everything else DDR-010 decides about the skills stands: two columns of groups from the wide
breakpoint, one below, levels strongest first, a level with no skills left out, levels as words,
the tint redundant with the word, and each group kept whole in print.

## Context

Epic #70 closes the gaps between the page and the Figma design. On 2026-09-17 the owner decided
that the design prevails everywhere. Issue #117 is this one.

The page ran each level's skills on from its badge in one line. The first line of each list started
part-way across, 251px in at the default text size, and its wrapped lines returned to the left edge
underneath the badge. So the lists did not align with one another and the badges did not read as a
column. The design separates the rating from the list it rates.

Read off `career-site-design`, node by node:

| Node  | What it is                          | Value                                                        |
| ----- | ----------------------------------- | ------------------------------------------------------------ |
| 2:466 | A skill group                       | A flex column: the name, then the levels                     |
| 2:470 | The levels' container               | 16px above the first level (`pt-[16px]`)                     |
| 2:479 | A second level                      | 16px above it (`pt-[16px]`)                                  |
| 2:478 | A level's badge row                 | 30.2px: the 19px badge 5.2px down a 24.2px line, then 6px    |
| 2:475 | The level's paragraph               | Starts at the group's left edge, below the badge row         |
| 2:465 | The groups' grid                    | The second row starts 40px below the first (`gap-y-10`)      |

The Make file says the same in its own terms: the badge is an `inline-block` span with `mb-1.5`
above a `<p>` of the skills, in a `space-y-4` column.

## Decision

* **The badge stands on its own line and its skills start on the next**, flush with the group's
  edge. The skills are wrapped in one `span` that is `display: block`, and the badge stays
  `inline-block`, so it keeps its own width and its tint is as wide as its word.
* **The markup order does not change**, per DDR-014. The badge and the skills are still one
  paragraph, badge first, so a screen reader still reads the level and then its skills, and a
  PDF's text still gives the level before the list. The wrapper is presentational; the middle dots
  inside it are still `aria-hidden`.
* **The group's name, each level and the next are a flow step apart**, `--space-flow`, 16px, which
  is the design's `pt-[16px]` exactly. It was `--space-small` when a level was one line; it is now
  a block of its own and needs the room a paragraph does.
* **The badge is `--space-small`, 8px, above its skills.** The design's 6px is on no step of
  DDR-013's scale. As boxes, 4px and 8px are equally far from it. As ink, 8px is the nearer: the
  design sets the skills on a 21.45px line and the page on 19.5px, so the design's visible gap is
  about 8.3px, and the page's is 9.3px at 8px and 5.3px at 4px.
* **The badge keeps its size, tint, case, weight and tracking**, and the skills keep their ink, size
  and separators. Nothing about either is touched.

## Alternatives Considered

### Option A: split each level into a badge element and a separate paragraph, as the Make file does

Pros:

* It is the design's own structure.

Cons:

* The level would no longer be in the same paragraph as the skills it rates, so a screen reader in
  browse mode would meet "Advanced" as a line of its own and the list as another, with nothing to
  say one belongs to the other. One paragraph keeps them one statement.

### Option B: make the paragraph a flex column

Pros:

* It stacks the badge and the skills without a block-level child.

Cons:

* It still needs the skills wrapped, because every text run and dot between the spans would
  otherwise become a flex item of its own. With the wrapper, `display: block` on it is enough.

### Option C: shrink-wrap the badge as a block, with `inline-size: fit-content` or `display: table`

Pros:

* No wrapper in the markup.

Cons:

* ADR-006 does not let a size name the space its content needs, and `display: table` on a span can
  be exposed as a layout table by some browsers' accessibility trees. Wrapping the skills is plainer
  than either.

### Option D: take the design's 40px between two rows of groups here

Pros:

* #117 lists it among the spaces to match.

Cons:

* 40px is on no step either, and #119 decides the spacing scale for exactly this measure along
  with the section, heading and entry gaps. Taking a value here would pre-empt that decision. The
  rows stay `--space-item`, 32px, 8px short of the design, until #119.

## Consequences

Benefits:

* The badges read down the column and every list starts at the same edge.
* The reading order, the accessible text and the content are unchanged.

Tradeoffs:

* The page is taller: by 158px at 894px, by 176px at 1280px and by 261px at 320px, all of it in
  the skills section.
* Three spaces stay short of the file: the design's badge sits 5.2px down its own 24.2px line, so
  its name-to-badge distance is 21.2px where the page's is 16px; the badge-to-skills gap is 8px
  where the design's is 6px; and a row of groups follows the one above at 32px where the design's is
  40px, which is #119's.

Risks:

* **The printed CV is now six sheets in both browsers, where it was five.** Under print media at
  A4's 643px the skills section grows from 467px to 645px, and sheet 5, which DDR-032 recorded as
  close to full, can no longer hold the footer. The footer, with the owner's name and the three
  contact addresses, now stands alone on sheet 6. Every section heading is on the sheet it was on
  before — sheets 1, 3, 4, 5 and 5 — each followed by its first item, and each skill group is still
  whole on one sheet. Since #97 the footer is the only place the printed CV carries an address, so a
  sheet that holds only the footer is the one to watch. No print-only rule is added to win it back:
  177.5px is more than any spacing step inside the section returns, and #119 is about to move the
  page's spacing in any case.

Measured on the built page in Edge, at 320px, 360px, 390px, 768px, 894px and 1280px, at the default
text size and at 200%: nothing scrolls horizontally, the skills start at the group's left edge
(0px) at every width, the first badge is 16px below the group's name (32px at 200%), the skills'
first line of text begins 9px below the badge (18px at 200%), and the badge is 23px tall as before. Printed to A4 through WebDriver in Edge 153 and Firefox 156, background
graphics on and off, against the tree this branched from: six sheets in all four where it was five,
the section headings and skill groups on the same sheets as before, and no replacement character
through pypdf or pdfium.

## Related Documents

* Issue #117, Epic #70
* DDR-010, the skills pattern, which this amends
* DDR-013, the spacing scale
* DDR-014, the markup-order rule
* DDR-015 and DDR-032, the print treatment and its last measurement
* DDR-018 and DDR-024, the badge's case and tracking, unchanged
* ADR-006, the literals a component stylesheet may write
* Issue #119, the spacing scale, which owns the rows' 40px
* Figma `career-site-design`, nodes 2:465, 2:466, 2:470, 2:475, 2:478 and 2:479
