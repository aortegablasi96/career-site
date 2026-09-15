# DDR-008-Section Openings in Print

Status: Accepted

Date: 2026-09-15

Supersedes the part of DDR-005 that accepted Firefox leaving a section heading at the foot of a
printed page. The rest of DDR-005 stands.

## Context

ADR-002 makes the page the CV, and DDR-005 designs what a browser prints or saves as a PDF. DDR-005
keeps a heading with what follows it through `break-after: avoid`. Edge and Chrome honour it.
Firefox does not, and it ignores `break-before: avoid` on what follows a heading too. The checks
for #14 found that, with fixture content, a section heading ended a page in 19 of 31 layouts in
Firefox. The owner accepted the limitation, and #23 tracked rechecking it against real content.

The recheck for #23 used the finished page, with the content of Epic #25. It printed the page to
PDF on A4, in Firefox 155.0.1 and Edge 153 on Windows 11. A spacer of 0 to 720pt, in 24pt steps,
was added above the introduction, which moved the page breaks through every position in 31
layouts. Each PDF's text showed which page each section heading, and the first and last line of
each item, fell on.

* **Firefox strands headings at least as often with real content.** A section heading ended a page
  in 20 of the 31 layouts.
* **It happens to the page as it prints today.** With no spacer, "Projects" ends page 2 and
  "Skills" ends page 3, each with its first entry on the next page.
* **Edge keeps every section heading with its first item**, in all 31 layouts.
* **No item was split in either browser.** Firefox honours `break-inside: avoid`.

A heading alone at the foot of a page reads as a mistake, on the one document a visitor takes away.

## Decision

### A section's heading and first item form one block

Each of the page's five sections holds its heading and its first item, such as the first role or
skill group, in one block. Print keeps that block whole. When the first item does not fit below the
heading, the heading moves to the next page with it.

* **Every section has the block, whatever its first item is**: an entry, a skill group, or the list
  of languages.
* **The heading keeps DDR-005's `break-after: avoid`**, which Edge and Chrome honour. The block adds
  `break-inside: avoid`, which Firefox honours.
* **The other items follow the block**, each still kept whole, as DDR-005 and DDR-006 set.
* **A block taller than a page still breaks**, as an entry longer than a page does.

### Nothing changes on screen

The block is a plain element with no role, so the outline and landmarks DDR-006 sets are unchanged.
It keeps the section's spacing: the first item follows the heading at the flow step, and the next
item follows the block at the item step, per DDR-003.

### Measured

Measured as in the recheck, across the same 31 layouts:

| Layouts in which a section heading ended a page | Firefox  | Edge     |
| ----------------------------------------------- | -------- | -------- |
| Before this decision                            | 20 of 31 | 0 of 31  |
| With the block                                  | 0 of 31  | 0 of 31  |

With the block, Firefox puts each section heading on the same page as Edge does, in all 31 layouts.
Edge's pages do not change. No item is split in either browser.

### Where it lives

`components/section.tsx` renders the block. `components/section.module.css` keeps its spacing, and
keeps it whole in print. A section is given its items one element each, so that it can group the
first, and `app/page.tsx` hands them over.

## Alternatives Considered

### Option A: Accept the limitation again

Pros:
* No change.

Cons:
* In Firefox, a section heading ends a page in 20 of 31 layouts, including the page as it prints
  today.

### Option B: Reserve space below each heading

This is DDR-005's Option E: 14rem reserved below each section heading in print, and cancelled by
a negative margin.

Pros:
* Only CSS. The markup does not change.

Cons:
* In Firefox, a section heading still ended a page in 4 of 31 layouts.
* It works only when the first item is shorter than the space reserved, which depends on content.
* A value off the spacing scale.
* It changes page breaks in every browser, including those that already keep a heading with its
  first item.

### Option C: `break-before: avoid` on what follows a heading

Pros:
* The same intent, from the other side of the break, with no change to the markup.

Cons:
* Firefox ignores it, as DDR-005 records.

### Option D: Keep each whole section on one page

This option was not measured.

Pros:
* A heading could never be parted from its items.

Cons:
* A whole section would move to the next page to stay together, leaving much of a page empty.
* A section longer than a page would break anyway.

## Consequences

Benefits:
* In Firefox, as in Edge, no section heading ends a printed page.
* Firefox and Edge break the page in the same places, so the CV looks the same whichever
  browser saves it.
* The screen is unchanged.

Tradeoffs:
* When a section's first item does not fit, the heading moves with it, leaving space at the foot of
  the page. Edge already did this.
* Each section has one more element in its markup, with no visual or semantic role.
* A section is given its items one at a time, so each section's component renders a list of one for
  each item.

Risks:
* A first item taller than a page would break, and could leave its heading at the foot of a page.
  No item on the page is anywhere near that tall.
* The checks used A4. US Letter is shorter, which moves the breaks, but the block works the same
  way.
* Browsers may change how they break pages. As DDR-005 says, a print change should still be checked
  in both Edge and Firefox.

## Related Documents

* GitHub issue #23, which this decision resolves
* GitHub issue #14 and pull request #24, whose checks found the limitation
* DDR-005, the print stylesheet, whose acceptance of the limitation this record supersedes
* DDR-006, the career page's structure, whose outline and sections this record keeps
* DDR-003, spacing and layout, whose steps the block keeps
* ADR-002, which made the page the CV
