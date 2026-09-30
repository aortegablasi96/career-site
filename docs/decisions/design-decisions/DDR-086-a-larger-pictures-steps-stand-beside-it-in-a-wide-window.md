# DDR-086-A Larger Picture's Steps Stand Beside It in a Wide Window

Status: Accepted

Date: 2026-09-30

**Amends DDR-083 (where the controls sit, and Option B)**, which put the two controls that step
between a gallery's pictures at the window's lower corners at every width, and rejected columns
beside the picture. The owner asked on #256 for them to stand left and right of the picture, centred
in the page. So from the wide breakpoint they stand at the window's left and right edges, level with
the picture's middle. Below it they stay at the lower corners. Everything else DDR-083 decides
stands: the controls themselves, their names, the arrow keys, the loop, the place, the fade, what
happens on closing and without script.

**Amends DDR-014 (the markup order is the visual order)** in one place: this stylesheet places its
content by name, from the wide breakpoint only. The reason is below.

## Context

Since #250 a gallery's larger picture has its caption between two round controls, at the window's
lower corners. On a phone that is where a thumb is. In a wide window it is far from the picture the
reader is looking at, and not where a reader expects to find them.

On 2026-09-30 the owner asked for the controls left and right of the picture, centred in the page,
and chose between the placements on #256:

* **From the wide breakpoint, at the window's edges**, rather than directly beside the picture or
  over its edges.
* **On a phone, the lower corners as today**, rather than beside the picture or over it.

## Decision

**From the wide breakpoint, a gallery's larger picture stands between its two controls: "Previous
picture" at the window's left edge and "Next picture" at its right edge, each level with the
picture's middle. The caption and the place stay under the picture, centred. Below the wide
breakpoint nothing changes.**

### From the wide breakpoint

* **The controls are at the window's left and right edges**, the medium step in (16px), as the close
  control is at the upper right. They are the same 32px round buttons (DDR-083).
* **Level with the picture's middle.** The picture is centred in the room between the close control
  and the caption, and the controls are centred in the same room.
* **They do not move between pictures.** Their columns are as wide as the controls, whatever the
  picture's shape, so a reader can press "Next picture" again without moving the pointer. NumisBook's
  and the Digital Twin's pictures differ in shape, and the controls stay where they are.
* **Neither covers the picture.** The picture keeps the small step (8px) from each.
* **The caption and the place are under the picture**, centred across the window, as a lone
  picture's caption is.
* **The ground is still everything else**: above and below each control, and either side of the
  caption. Choosing it closes the picture.
* **A phone held sideways** is a wide window once it reaches 48em. The picture is limited by the
  window's height there, so the columns take nothing from it.

### Below the wide breakpoint

* **As DDR-083 decides**: the controls at the window's lower corners, either side of the caption,
  and the picture across the window's width.
* A reader who has enlarged text to 200% is below the wide breakpoint in any window narrower than
  1536px, since the breakpoint is in em (DDR-014), and gets this layout.

### The keyboard and assistive technology

* **The keyboard reaches the close control, then "Previous picture", then "Next picture"**, at every
  width. In a wide window that is upper right, left, right.
* **The markup is one, the phone's**: the close control, the picture, "Previous picture", the
  caption and the place, "Next picture". Assistive technology meets them in that order at every
  width.

### The markup order and DDR-014

DDR-014 has the visual order follow the markup order, and no stylesheet place its content. Below the
wide breakpoint the controls follow the picture. From it they stand either side of it. One markup
order cannot be both, so one of the two layouts has to be placed.

* **This stylesheet places the dialog's five parts by name, inside the wide breakpoint and nowhere
  else**: the close control, the control before, the picture, the control after, and the words.
* **The order a reader moves through does not change.** The two controls keep their order, left
  before right, so the focus order follows what is drawn. What differs is that the picture comes
  before "Previous picture" for assistive technology and after it on screen. The picture is not a
  control, and the sequence still reads: the picture, how to step, what it is.
* `components/stylesheets.test.ts` admits it by name, for this stylesheet and these five areas. A
  second is a decision.

### What the picture gives up

* **In a wide window the picture is up to 80px narrower** than since #250, where the window's width
  limits it: two 32px columns and two 8px steps. At 1280 by 720, NumisBook's dashboard is 1153px
  wide where it was 1233px, and at 1536 by 864 it is 1409px where it was 1489px.
* **It is still far wider than the frame**: at 770px, 643px where the frame is 334px.
* A picture limited by the window's height loses nothing.

### Tokens

None. The columns are the controls' own width (`--project-view-enlarge-size`), and the step between
a control and the picture is `--space-small`.

## Alternatives Considered

### Option A: the controls directly beside the picture, moving with its shape

Pros:
* The controls are as near the picture as they can be.

Cons:
* They move whenever the next picture has another shape, so a reader pressing "Next picture" again
  has to find it again. The owner chose the window's edges.

### Option B: the controls over the picture's left and right edges

Pros:
* The lightbox convention, and the picture loses no width.

Cons:
* Each covers a 32px disc of the screen the reader opened the picture to read, which DDR-082
  rejected for the close control (Option E) and DDR-083 for these (Option A).

### Option C: beside the picture on a phone too

Pros:
* One layout at every width, and no placement by the stylesheet if the markup followed it.

Cons:
* On a phone the picture is limited by the window's width. At 320px it is 289px wide, and beside
  the controls it would be 209px, narrower than the frame it was opened from, which is 273px. The
  owner chose the lower corners.

### Option D: two pairs of controls in the markup, one shown at each width

Pros:
* Each layout's visual order is its markup order, so DDR-014 stands untouched.

Cons:
* Every dialog carries four step controls, two of them hidden at any width. The arrow keys and the
  focus hand-over (ADR-019) would have to tell the shown pair from the hidden one, and focus on a
  control is lost when a window is resized across the breakpoint.
* Controls drawn twice to avoid placing them once.

### Option E: leave the controls at the lower corners at every width

Cons:
* The owner asked for them beside the picture.

## Consequences

Benefits:
* In a wide window the controls are where a reader looks for them, beside the picture, and stay
  still from one picture to the next.
* A phone keeps the picture at the window's whole width, and the controls in reach of a thumb.
* One markup, one pair of controls, and no change to how the dialogs hand over (ADR-019).

Tradeoffs:
* In a wide window a picture limited by the window's width is up to 80px narrower.
* The first stylesheet that places its content where the markup does not. For assistive technology
  the picture comes before "Previous picture" in a wide window, where on screen it comes after.
* The larger picture now has two layouts, so a change to it is checked at both.
* Without script the two controls are not drawn, and their two empty columns still keep their steps,
  so the picture is 16px narrower there than a lone picture's.

Risks:
* The exception is a precedent someone may reach for. The test admits it by name, and this record
  says why it is one.

## Related Documents

* Issue #256, Epic #152
* DDR-083, which this amends; DDR-082, the larger picture
* DDR-014, the responsive strategy, which this amends in one place
* ADR-019, how the dialogs hand over, which is unchanged
* DDR-027 and DDR-035: targets and hover
