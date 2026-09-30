# DDR-088-A Project View's Pictures Stand in One Box

Status: Accepted

Date: 2026-09-30

**Amends DDR-085**, which showed the picture in a view's frame at its own shape and rejected fitting
it in a fixed box (its Option B). The owner asked for that box on #263 and accepted its bands, so
every picture a view shows now stands in one box, in the frame and larger. Each picture is still
whole: never cropped, never stretched.

**Amends DDR-082** in three places: the control that opens the picture larger stands at the box's
corner rather than the picture's; the box, not the picture, is its target; and larger, every picture
of a view is shown at one width. Everything else both records decide stands, and so does everything
DDR-083 and DDR-086 decide about stepping.

## Context

Since DDR-085 the frame is as tall as its picture's shape at the column's width. The owner's
pictures now differ in shape within a view:

| View | Its pictures' shapes | Frame at 1536px (column 522px) |
| --- | --- | --- |
| Digital Twin | the chat 2.12:1, Telegram 1.67:1 | 247px or 313px: the thumbnails jump 66px |
| NumisBook | 2.10:1 to 2.22:1 | 235px to 248px |
| Stock Portfolio Viewer | 1.88:1 to 1.89:1 | 276px or 277px |
| This site | 1.88:1, all seven | 277px |

DDR-085 named this risk: "a gallery whose pictures differ in shape moves its thumbnails when another
picture is chosen". Stepping through the larger picture did the same, since each picture was fitted
to the window on its own: Digital Twin's two were 1237 by 742 and 1276 by 603 at 1536 by 864.

On 2026-09-30 the owner asked for every picture to be the same size, "to not see variations between
pictures size when scrolling over them", in the frame and "when being maximized". Asked to choose
between cropping each picture to one shape and fitting each whole in one box, they chose the box.

## Decision

**Every picture and video a view shows stands in one box: as wide as the view's column, at the
shape of the view's tallest picture. Each picture is as wide as the box and centred in it, so a
wider one leaves an equal band above and below it. Larger, the same box is as large as the window
allows, and every picture is shown at its width.**

### The box's shape

* **Each view's own: its tallest picture's**, among the pictures and videos it shows (a video's is
  its recording's, which its poster shares). One shape for every project would leave bands on
  every picture of a view whose pictures agree: in the design's 16:10, NumisBook's would lose a
  quarter of the frame's height to bands.
* **The tallest, not the widest**, so every picture is as wide as the box, and as large as it was
  under DDR-085. The widest would shrink every other picture to fit the box's height.
* **A lone picture's box is the picture itself**, so a view with one picture is as it was.
* Today's bands: Digital Twin's chat has 33px above and below it at the wide width; NumisBook's
  pictures have at most 7px, and the Stock Portfolio Viewer's and this site's, 1px or none.

### What fills the bands

* **Nothing.** The box draws no surface of its own, so the bands are the page's ground, and larger,
  the veil. A tinted box would draw one- and two-pixel slivers around NumisBook's pictures, which
  read as a fault, and would add a surface the design does not draw. No colour token is needed.

### What belongs to the box, and what to the picture

* **The picture keeps its own rounded corners**, at the frame's large radius, in the frame and
  larger. A box that draws nothing has no corners to show.
* **The control that opens the picture larger stands at the box's lower right corner**, the small
  step in from both edges, so it stands in one place whichever picture is chosen. Where a picture
  leaves a band, the control stands in it, just below the picture's corner.
* **The box is the control's target**, bands included, so the pointer opens the picture from
  anywhere in the box, and the magnifier shows over all of it.
* **A gallery radio's focus is drawn around the box**, at the large radius, so the outline stays
  where it is as the arrow keys change the picture. The opening control's own focus is still drawn
  on the round button.
* **A video is drawn as the box**, and fits its own picture inside it, as a video element does.

### The larger picture

* **The box is as large as the room the picture's row leaves, at the box's shape**, and every
  picture of the view is shown at its width, centred in the room. A wider picture leaves bands of
  the veil above and below it. Choosing a band closes the picture, as the ground does.
* **It is never wider than the view's narrowest file**, so no picture is shown larger than its own
  file, as DDR-082 has it.
* Fitting the screen still takes precedence (DDR-082): where the window is short, the box is limited
  by its height, and still one size for every picture.
* **The step controls stand at the foot of the caption's row**, level with the place ("3 of 7"), on
  a phone. A caption that wraps to a second line grows the row upwards, so the controls and the
  place do not move. From the wide breakpoint they stand at the window's edges, as DDR-086 has them.
  Measured at 320px and 390px, NumisBook's "A tetradrachm of Mark Antony and Cleopatra" wraps, and
  its controls stood 10px higher than the others' until they were stood at the foot.

### Before the files arrive

* **The box holds its shape before any file arrives, and each picture holds its own**, because the
  content records each picture's size (ADR-021). Nothing on the view moves when a file arrives,
  where DDR-085 moved it once, by the difference from the design's 16:10.

### What does not change

* The thumbnails, 96 by 64 and cropped from the centre (DDR-081). The cards on the page, 16:9
  (DDR-051). The printed CV, which shows no view. Each view's link preview.
* How a picture moves out of its frame and back (DDR-082, ADR-018): the frame's picture and the
  larger one are the same shape, so it is one shape growing.

## Alternatives Considered

### Option A: crop every picture to one shape

Pros:
* No bands. The picture fills the box.

Cons:
* It cuts the pictures' edges, which DDR-085 stopped doing on the owner's request (#254).
* The owner chose the whole picture.

### Option B: one shape for every project (the design's 16:10)

Pros:
* Every view's frame is the same height, as the design draws it. The content need carry no sizes.

Cons:
* Every picture on the site is wider than 16:10, so every picture has bands: NumisBook's lose a
  quarter of the box to them, and the Stock Portfolio Viewer's and this site's a sixth, where their
  pictures agree and need none.

### Option C: the widest picture's shape

Pros:
* The frame is as short as it can be.

Cons:
* Every other picture is fitted to the box's height, so it is narrower than the column, with bands
  at its sides: Digital Twin's Telegram picture would be 79% of the column's width.

### Option D: a tinted box, drawn as a mat under the picture

Pros:
* The box is visible, so the control and the focus outline stand on something.

Cons:
* Views whose pictures nearly agree show slivers of one or two pixels, which read as a fault.
* A surface the design does not draw, and a colour the tokens would need.

### Option E: the control and the focus outline at the picture's edges

Pros:
* The control stays on the picture, as DDR-082 drew it.

Cons:
* Both move by the band whenever another picture is chosen, which is the movement #263 removes.

## Consequences

Benefits:
* Choosing a picture, or stepping to another while one is open larger, changes nothing around it:
  the frame's height, the thumbnails, the caption, the control, the step controls and the place.
* The page no longer moves when a picture's file arrives.
* The larger picture is still the frame enlarged: the same box, the same picture in it.

Tradeoffs:
* A wider picture has bands, and the frame is as tall as the view's tallest picture: Digital Twin's
  chat picture is shown in a frame 66px taller than itself at the wide width.
* Where a picture leaves a band, the opening control stands in it rather than over the picture.
* The content records each picture's size in pixels, which the owner supplies with the picture
  (ADR-021).

Risks:
* **A tall picture**, such as a phone's screen, would make every picture of its view sit in a tall
  box with wide bands. No project has one. The story that brings the first decides whether it
  shares the box.
* **A larger picture on a phone**: a caption that wraps shortens the room by a line, which moves the
  picture's centre by half a line. Its size does not change, since a phone's box is limited by the
  window's width.

## Tokens

None added. `--project-view-media-ratio` (the design's 16:10, which a picture's place held until
its file arrived) and `--project-view-enlarge-pull` (which pulled the control up over the picture)
are removed. The box's shape and greatest width are the view's own, read from its content
(ADR-021).

## Related Documents

* Issue #263, Epic #152
* DDR-085 and DDR-082, which this amends; DDR-083 and DDR-086, the steps; DDR-081 and DDR-084, the
  thumbnails and the pictures a view shows; DDR-087, a gallery's video; DDR-051, the cards
* ADR-021, the pictures' sizes in the content and the box handed to the stylesheets
* ADR-018 and ADR-019, the larger picture and its steps
