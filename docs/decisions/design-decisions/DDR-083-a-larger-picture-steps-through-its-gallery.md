# DDR-083-A Larger Picture Steps Through Its Gallery

Status: Accepted

Date: 2026-09-30

**Amends DDR-082 (Option D)**, which rejected moving between a gallery's pictures while one is open
larger, because #246 left it out. The owner asked for it on #250. So a reader who has opened a
picture of a gallery larger can now show the picture before it and the one after it in place,
without closing it. Everything else DDR-082 decides stands: the control that opens a picture, the
veil and the blur, the picture shown whole, the control that closes it, and its movement into and out
of the frame. ADR-019 records how one picture's dialog hands over to the next.

## Context

NumisBook's gallery has seven pictures, each a screen of the application. Since #246 a reader can
open the picture in the frame larger, but to see the next one they have to close it, choose the next
thumbnail and open that. That is three steps per picture. The Figma file `career-site-design` draws no
enlarged picture, so how the steps look and behave is decided here.

## Decision

**Under a gallery's larger picture, its caption stands between two round controls: a chevron
pointing left at the window's lower left corner, which shows the picture before, and one pointing
right at the lower right corner, which shows the picture after. Under the caption is where the
picture stands among the gallery's, "3 of 7". The left and right arrow keys step too. The pictures
are a loop. On closing, the frame shows the last picture the reader saw.**

### The controls

* **The same round white buttons as the close control**, 32px across
  (`--project-view-enlarge-size`), in the heading's ink, with the back and forward chevrons the
  view already uses for its way back and its neighbouring projects. Under the pointer and on focus
  they take the accent and its tint, and focus is drawn on them in the white, as on the close
  control (DDR-082).
* **At the window's lower corners**, a small step in on a phone and a medium one from the wide
  breakpoint, as the close control is at its upper right. On a phone a thumb reaches both, and the
  picture keeps its whole row, so the controls cover none of it (DDR-082, Option E).
* **Their accessible names are "Previous picture" and "Next picture"**, from `content/`. Each shows
  a chevron alone.
* **What the controls and the caption leave in their row is still the ground**, and choosing it
  closes the picture, as anywhere else around it.
* **A view with a single picture has neither**, and neither does a gallery whose only other item is
  a video. Such a view is drawn as it was since #246.

### The keys

* **The left and right arrow keys show the picture before and after**, wherever focus is in the
  dialog, as the same keys move between the gallery's radios on the view (DDR-081). With a modifier
  held they do nothing of ours, so the browser's own shortcuts stand.
* **Focus stays on the control that had it.** A reader who pressed "Next picture" can press it
  again. One who stepped with the arrow keys from the close control stays on the close control.

### The order and its ends

* **The thumbnails' order**, the lead first.
* **A loop**: the step before the first picture is the last, and the step after the last is the
  first, as the business case's items are (DDR-080). Neither control is ever spent, so neither is
  drawn differently at the ends, and the place under the caption says where the reader is.
* **A video is passed over.** It opens nothing larger (DDR-082), so it is not in the sequence, and
  the place counts the pictures alone. A gallery with a video would show "2 of 3" for its second
  picture even when the video stands between the two in the thumbnails.

### Where the reader is

* **"3 of 7" under the caption**, in the caption's white, at its size, centred with it.
* **It is part of the dialog's name**, after the caption: "The collections 3 of 7". When the reader
  steps, focus moves into the next picture's dialog, so assistive technology announces that
  dialog's name, and the reader hears which picture is now shown and where it stands.

### How one picture gives way to the next

* **The one fades into the other in place**, over 300ms (`--project-view-enlarge-duration`). The
  veil, the blur, the controls and the view behind it do not move. There is no slide: the picture
  does not come from anywhere, and a slide would add a direction to a loop.
* **A reader who has asked for less motion** sees the next picture at once. So does a browser that
  cannot draw a view transition.

### On closing

* **The frame shows the last picture the reader saw**, and its thumbnail is the chosen one, as if
  they had chosen it from the row. The picture shrinks back into that frame (DDR-082), and keyboard
  focus returns to the control that opens it. The reader who closes on the settings sees the
  settings in the frame, rather than a picture they left several steps before.

### Without script

* **The two controls are not drawn.** Each picture still opens and closes as it does since #246, and
  still says where it stands among the gallery's. Stepping from one picture's dialog to another's
  needs script (ADR-019).

### Target size

* Both controls are 32 by 32px, so they pass WCAG 2.5.8 outright, as the close control does, and
  64px at 200% text.

### Tokens

None. The controls, the place and the fade reuse DDR-082's tokens.

## Alternatives Considered

### Option A: the controls over the picture's left and right edges, at mid-height

Pros:
* The lightbox convention, and the controls are near where the reader looks.

Cons:
* They cover part of the picture, which DDR-082 rejected for the close control (Option E).
* On a phone held upright, the picture is its narrowest, and they would cover the most of it.

### Option B: the controls in columns beside the picture

Pros:
* Nothing covers the picture.

Cons:
* On a phone the picture is limited by the window's width, so two 40px columns take a quarter of
  what it gains over the frame (DDR-082).

### Option C: the first and last pictures' controls spent, rather than a loop

Pros:
* The reader knows they have reached an end without reading the place.

Cons:
* A spent control is drawn differently, and a reader who meets one has to look for the other. The
  business case's items are a loop (DDR-080), and the gallery would be the only sequence on the
  site that is not.

### Option D: a swipe steps too

Pros:
* The convention for pictures on a phone.

Cons:
* A swipe on the picture competes with the browser's own pinch to zoom and its pan, which DDR-082
  counts on to enlarge the picture further on a phone.
* The controls are in reach of a thumb already, so a swipe adds a second way to do the same thing.

### Option E: the next picture slides in from the side it comes from

Pros:
* It says which way the reader moved.

Cons:
* In a loop the first picture would slide in from the right after the last. A fade says only that
  the picture changed, which is all the reader needs.

### Option F: on closing, the frame returns to the picture first opened

Pros:
* The view is as the reader left it before opening.

Cons:
* The picture that shrinks back into the frame is the one shown, so the frame would change under it
  as it lands. The reader closes on the picture they were looking at, and can choose another from
  the row.

### Option G: a thumbnail strip inside the enlarged picture

Cons:
* It takes a row of height from the picture, and the view's own row already does this job.

## Consequences

Benefits:
* A reader can go through a gallery at a readable size in one sitting, from the pointer, touch and
  the keyboard alike.
* The reader always knows which picture is shown and where it stands, on screen and from assistive
  technology.
* The page, the printed CV and every link preview are untouched. A view does not print.

Tradeoffs:
* Without script a gallery's picture opens and closes, but stepping needs closing it and choosing
  the next thumbnail, as before #250.
* At 320px and 200% text the caption between the controls has about 113px, so a long word in it
  breaks.
* The caption's row now holds three things where it held one.

Risks:
* The controls give their command to the neighbour's dialog, as the others do (ADR-019). A browser
  older than the Invoker Commands API cannot open the picture in the first place (ADR-018), so it
  never shows them.

## Related Documents

* Issue #250, Epic #152
* DDR-082, which this amends; DDR-081, the gallery and its radios; DDR-080, the business case's
  loop
* ADR-019, how the dialogs hand over; ADR-018, the dialog
* DDR-027 and DDR-035: targets and hover
