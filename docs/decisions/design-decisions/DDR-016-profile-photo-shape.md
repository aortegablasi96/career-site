# DDR-016-profile-photo-shape

Status: Accepted

Date: 2026-09-16

Refines DDR-010, which adopted the profile photo and placed it beside the name but fixed neither its
aspect ratio nor its corner radius. DDR-010 stands in every other respect. It also supersedes the
description of the photo as square in ADR-004's size budget; the budget itself, 100 KB, is unchanged.

## Context

The page shows the profile photo as a square. Nothing decided that. DDR-010 adopted the photo, and
the UI Review on #43 measured it at 176px and 208px; #48 revised the narrow size to 96px and put the
photo beside the name at every width. The shape came along with those measurements as a single
`--photo-size` token used for both dimensions, and was never a decision anyone took.

The Figma design file `career-site-design` draws it differently: a 3:4 portrait, and the box's sides
rounded until it reads as an oval.

This has to be settled before #63, because that story is the owner cropping and exporting the real
photograph. A shape decided afterwards means cropping it twice.

The question also has a measurable half. DDR-010 places the photo beside the name so that it never
pushes the positioning line or the contact controls below the fold on a phone, and #48 measured that
the rejected layout left the first control 2px below the fold of a 390px phone. A taller photo is a
taller float, so the ratio has to be measured against that reason rather than argued about.

## Decision

**The photo is 3:4 — taller than it is wide — at `--radius-large`, the radius DDR-013 already gives
a language card and a piece of project media.**

The shape is carried by two tokens rather than one, following the pattern DDR-010 gives the
projects' media:

| Token                 | Value    | What it is                                |
| --------------------- | -------- | ----------------------------------------- |
| `--photo-width`       | `6rem`   | The width below the wide breakpoint       |
| `--photo-width-wide`  | `13rem`  | The width from the wide breakpoint        |
| `--photo-ratio`       | `3 / 4`  | The shape, at both widths and on paper    |

* **The width is a length and the height follows from the ratio.** `--photo-size` and
  `--photo-size-wide` are renamed to `--photo-width` and `--photo-width-wide`, because a token that
  sets one dimension should not be called a size. The widths themselves are unchanged: 96px and
  208px at the default font size.
* **The widths stay in rem** and the ratio has no unit, exactly as `--project-media-width` and
  `--project-media-ratio` are. The photo therefore keeps its proportion to the name beside it when
  text is enlarged, which is what #68 depends on.
* **Print redefines the width alone.** DDR-015 prints the photo at 28mm; the ratio is a shape, so it
  is not redefined and the printed photo is 28mm across and about 37mm tall.
* **The corner radius is `--radius-large`.** DDR-013 has three radii and this is one of them.
* **A photograph that is not 3:4 is cropped rather than distorted**, by `object-fit: cover`, as
  before.

### What this asks of #63

The real photograph is cropped to **3:4, portrait**, and exported at twice the size it is shown at,
per ADR-004 — 416px wide or more. The stand-in committed with this record is 420 × 560.

## Alternatives Considered

### Option A: 3:4 at `--radius-large` — adopted

Pros:

* It is the ratio a head-and-shoulders portrait already has. A square crop either cuts the shoulders
  or leaves headroom above the head, and the owner has to choose which when cropping.
* It is the design's ratio, so the page and the Figma file agree on the half of the shape that
  matters to the photograph.
* It costs nothing where DDR-010 cares. Measured at the browser's real default font size: at 390px
  the contact controls do not move at all — the float's extra 32px is absorbed inside the name's own
  height, which already runs past the foot of the photo. At 320px they move 32px; at 200% text they
  move 64px, where they already sit 2.3k to 2.8k pixels down the page.
* The name wraps identically in all four cases measured, at the same widths and the same three
  lines, and #68's rule still moves it below the photo when its longest word no longer fits beside
  it. Nothing overflows horizontally at 320px or 390px, at 100% or 200%.
* It adds no radius. DDR-013's three radii still cover every rounded surface on the site.

Cons:

* It differs from the Figma file, which draws an oval.
* The page is 32px longer at 320px than it was.

### Option B: 3:4 as an oval, as the design file draws it

Pros:

* It matches the design file exactly.
* A portrait in an oval is a conventional CV device and reads as deliberate.

Cons:

* It is a fourth rounding, and not a length at all but a proportion of the box. DDR-013's reasoning
  — "a tag, a badge, a card and a pill each have a radius to read rather than a number to invent" —
  gets a fifth case that is none of those things.
* An ellipse crops the corners out of the photograph, so the framing of the real portrait has to
  suit the shape. That is a constraint on a file the repository cannot produce and cannot check.
* It is the one strongly decorative element on a page whose whole design language is whitespace,
  type and hairlines.

### Option C: keep the square, and record it

Pros:

* Nothing moves. The page is 32px shorter at 320px than Option A.
* The stand-in and the eventual real file stay as they are.

Cons:

* It keeps a shape nobody chose, which is what this record exists to fix.
* It makes the crop harder for the one asset the owner has to produce by hand.
* The page and the design file keep a difference with no reason recorded behind it.

## Consequences

* **`--photo-size` and `--photo-size-wide` no longer exist.** Anything reading them reads
  `--photo-width`, `--photo-width-wide` and `--photo-ratio` instead. `app/tokens.test.ts` and
  `components/introduction.test.tsx` are held to the new names.
* **`introduction.module.css` sets a width and a ratio**, not two lengths, so the wide breakpoint
  sets no height of its own. The box is still settled before the image loads, so the page does not
  shift when it arrives.
* **The page is up to 32px longer on a narrow screen**, and unchanged at 390px, which is the width
  DDR-010's reasoning is measured at.
* **#63 crops to 3:4.** Its acceptance criteria are updated to say so.
* **ADR-004's budget is unchanged at 100 KB.** Only its description of the photo as square is
  superseded here; a 3:4 photograph at 208px wide has about a third more pixels than a square one
  and is nowhere near the budget.
* **The printed photo is 28mm across and about 37mm tall**, and the sheet count was rechecked in
  both browsers on this story.
* **The oval is rejected, not deferred.** Adopting it later is a new decision superseding this one.

## Related Documents

* DDR-010, the career page redesign structure, which adopts the photo and places it beside the name
* DDR-013, the spacing and layout scale, whose three radii this record uses rather than extends
* DDR-014, which keeps the wide breakpoint in the components, and DDR-015, which prints the photo at
  28mm
* ADR-004, the binary asset decision, whose size budget for the photo is unchanged
* ADR-006, which admits `min-content` on a minimum, on which #68's fix rests
* GitHub issue #71, which this decision resolves, and Epic #70
* GitHub issue #63, which supplies the real photograph, and #68, which stopped the name being
  squeezed beside the photo
* The Figma design file `career-site-design`,
  https://www.figma.com/design/RhUMRELzXCfPc0IYa0uHse/career-site-design?node-id=2-28, whose ratio
  this adopts and whose oval it does not
