# DDR-085-A Project View Shows Its Picture Whole

Status: Accepted

Date: 2026-09-30

**Amends DDR-050 (the right column's 16:10 crop) and DDR-081 ("at the lead's size").** The picture
in a view's frame is shown whole, as wide as its column and at its own shape. It is no longer
cropped to the design's 16:10. Everything else those records decide stands: the frame's width and
corners, the caption, the row of thumbnails under it and their own crop, and the control that opens
the picture larger (DDR-082).

## Context

DDR-050 draws a view's picture in the design's 16:10 box (node 59:71) and crops a picture of another
shape to it from the centre. That was written for four 4:3 pictures, which lost 35px at the top and
the bottom. Since #167 the lead pictures are 3:2 and lose less.

The Stock Portfolio Viewer's gallery pictures (#252) are the application's window as the owner
captured it, about 1535 by 815, which is 1.88:1. In a 16:10 frame they lose about 117px of their
1535 at each side: the sidebar's labels and the right-hand column. Since DDR-084 a gallery picture is
also what the view opens on. The owner saw the cut picture on 2026-09-30 and asked for the full
picture, smaller, in the frame (#254).

## Decision

**The frame shows its picture whole: as wide as the column, with its height following the picture's
own shape. Nothing is cropped and nothing is stretched.**

* **The width is the column's**, as before. The height is what the picture's shape gives at that
  width: 348px for a 3:2 picture in the design's 522px column, 277px for the Stock Portfolio
  Viewer's.
* **The corners, the focus outline and the control that opens the picture larger are the
  picture's own**, at its real edges, as before.
* **What stands under the picture follows it**: the row of thumbnails 16px under it, or the caption
  8px under it, whatever its height.
* **The design's 16:10 is the shape the frame holds until the file arrives**, so the view moves
  only by the difference when it does. It is still the token `--project-view-media-ratio`.
* **A video is drawn the same way**, at its poster's shape.
* **The thumbnails keep their own shape**, 96 by 64, cropped from the centre (DDR-081). A thumbnail
  is a way to choose a picture, not the picture.
* **The cards on the page keep their 16:9** (DDR-051), and the larger picture is unchanged: it
  already shows the picture whole (DDR-082).

## Alternatives Considered

### Option A: keep the 16:10 crop (DDR-050)

Pros:
* Every view's frame is the same height, as the design draws it.

Cons:
* A picture that is not 16:10 loses its edges, and a wide one loses what makes it readable.
* The owner asked for the whole picture.

### Option B: keep the 16:10 box and fit the picture inside it

Pros:
* The frame's height never changes, so the thumbnails never move.

Cons:
* A wide picture has empty bands above and below it, and a narrow one at its sides.
* The rounded corners, the focus outline and the control would be the box's, not the picture's: the
  picture would have square corners, and the control would float beside a narrow picture.

### Option C: crop from one edge rather than the centre

Cons:
* It still cuts the picture, and which edge matters differs from picture to picture.

## Consequences

Benefits:
* The frame is a smaller version of what "View larger" shows. No picture needs opening to be seen
  whole.
* The movement between the frame and the larger picture is one shape growing, with no crop to
  undo.
* The owner's pictures can be any shape.

Tradeoffs:
* The frame's height differs between views: a 3:2 picture is 22px taller than the design's box at
  the wide width, and the Stock Portfolio Viewer's are 49px shorter.
* The view is no longer the design's to the pixel in its right column.
* Until its file arrives, a picture's place is 16:10, so the thumbnails or the caption move by that
  difference once. The content does not carry a picture's size, which would remove it.

Risks:
* **A gallery whose pictures differ in shape moves its thumbnails** when another picture is chosen.
  Both galleries today hold pictures of one shape, within 2px.
* **A tall picture**, such as a phone's screen, would be as wide as the column and very tall. No
  project has one. The story that brings the first decides its size.

## Related Documents

* Issue #254, Epic #152
* DDR-050 and DDR-081, which this amends; DDR-082, the larger picture; DDR-084, the pictures a view
  shows; DDR-051, the cards
* ADR-018, the movement between the frame and the larger picture
* #252, the Stock Portfolio Viewer's gallery pictures
