# ADR-021-A Project Picture Carries Its Size, and a View Hands Its Box to Its Stylesheets

Status: Accepted

Date: 2026-09-30

**Extends the content model (ADR-001, ADR-002)**: every project picture and video records its size
in pixels. **Amends ADR-006** with one limit a stylesheet may write on `max-inline-size`: the room's
height at the box's shape. Nothing else either record decides changes.

## Context

DDR-088 (#263) shows every picture a view shows in one box at the shape of the view's tallest
picture, and no wider, larger, than the view's narrowest file. Neither the shape nor that width can
be written in a stylesheet: both depend on the pictures the owner supplies for each project.
DDR-085 had already noted that "the content does not carry a picture's size", which is also why a
picture's place held the design's 16:10 until its file arrived.

The larger picture needs the shape as a number the stylesheet can compute with: the box there is as
large as the room its row leaves, so its width is the smaller of the room's width and the room's
height at the box's shape. That is a limit taken from the room there is, which ADR-006's rule
admits in spirit ("a limit may name the space there is"), but not in the list of values it gives.

## Decision

1. **`ProjectMedia` carries `width` and `height`**, the picture's size in pixels as its file was
   prepared (a video's are its recording's, which its poster shares). They are required, so a new
   picture without them fails the type check. `components/project-view.test.tsx` reads each file's
   WebP header and holds the content to it, so a replaced picture of another size fails the suite.
   The owner supplies them with the picture. Nothing is read from a file as the site is built, and
   no dependency is added.
2. **A view works its box out from its content and hands it to its stylesheets** as two custom
   properties on the element that holds its pictures: `--project-view-box-ratio` (`width / height`
   of the tallest picture) and `--project-view-box-width` (the narrowest file's width, in px). They
   are written in the element's `style` attribute, the site's first, because they are the content's
   rather than the design's: they are not tokens and are not in `app/tokens.css`. The dialogs are
   inside that element, so the larger pictures inherit them.
3. **A picture's `img` carries its `width` and `height` attributes**, in the frame and larger, so
   its place holds its shape before the file arrives. The cards and the thumbnails are unchanged.
4. **ADR-006 admits, on `max-inline-size` alone, `min(100%, 100cqb * var(--token))`**: no wider than
   the room, nor than the room's height at a shape. Like `100%`, it names the space there is,
   measured on the element's container, and the shape is read from the content, so there is no
   number a token could hold. The larger picture's room is a size container for it. It is admitted
   once; a second use is a decision.

## Alternatives Considered

### Option A: read each picture's size from its file as the site is built

Pros:
* Nothing to keep in step by hand.

Cons:
* A WebP reader in the site's own code, and a view that reads the file system as it renders, which
  nothing on the site does. The test reads the header anyway, so a recorded size cannot drift.

### Option B: record the box's shape per project, not each picture's size

Pros:
* Two numbers per project rather than two per picture.

Cons:
* A design value in the content, which the owner would have to work out, and which goes stale when
  a picture is added. It gives no picture its place before its file arrives.

### Option C: size the frame without any size, by stacking every picture in one cell

Pros:
* The frame would be as tall as the tallest picture with no data at all.

Cons:
* The pictures not shown would have to be laid out, hidden, rather than not drawn. The larger
  pictures are separate dialogs, one open at a time, which cannot share a cell, so they would still
  need the shape.

## Consequences

Positive:
* The frame and the larger picture share one box, worked out in one place from the content.
* No picture's file moves the view when it arrives.
* The type check and the suite catch a picture without a size, or with the wrong one.

Negative:
* Two more fields per picture for the owner to supply. The suite's failure says which, and what.
* The site's first `style` attribute. It carries only the content's two values; everything the
  design decides stays in the stylesheets and the tokens.
* The content digest (ADR-005) moved, with no fact the CV shares.

## Related Documents

* DDR-088, the box; DDR-085 and DDR-082, which it amends
* ADR-001 and ADR-002, the content model; ADR-006, which this amends; ADR-004, ADR-016 and ADR-020,
  the pictures and videos as files
* Issue #263
