# DDR-081-A Project's Gallery Is a Row of Thumbnails Under Its Lead Picture

Status: Accepted

Date: 2026-09-29

**Amends DDR-053 in its layout, and DDR-050 in its lead picture.** A project's gallery is no longer
a full-size section below the introduction. It is a row of small thumbnails under the lead
picture's caption, and choosing one shows that picture in the lead's place. DDR-053's content
stands: a gallery item is `{ media, caption }`, every word and path is in `content/`, a view with
no gallery media shows nothing, and a video is drawn by `Media`, per DDR-010. DDR-053's label, its
list of full-size figures, its 20px gap and its one or two items to a row are withdrawn. ADR-017
records how the view holds which picture is shown.

## Context

Issue #244, in Epic #152, adopts the gallery the owner drew in the layer
`career-site-business-case` (node 405:93, in the right column 405:80). It is two overlapping
thumbnails, 72 by 52 with 8px corners, a 1.6px white edge and a soft shadow, the second 36px to
the right of the first and under it. After them is "+2 more" in the caption's 11px faint ink. It
stands 16px under the lead picture's caption. The layer draws no "Gallery" label.

The layer is a still frame at the wide width, and its thumbnails are placeholders. It does not say
what choosing a thumbnail or the count does, how the row arranges on a phone, or what a thumbnail
shows. As drawn, the second thumbnail covers the start of the count. The issue left these to this
record.

## Decision

**Under the lead picture's caption, a project with gallery media shows a thumbnail of each of its
pictures, the lead first. Choosing a thumbnail shows that picture, with its caption, in the lead's
place. The row shows the first two thumbnails, then a count of the rest. Choosing the count shows
the rest of the row.**

### What choosing a thumbnail does

* **It shows that picture in the lead's frame, at the lead's size, with its own caption.** The
  frame is already the largest a picture is drawn on the view, and it is what the design draws.
  An enlarged view over the page would be a pattern the design does not draw. #155 left it out for
  that reason.
* **The lead picture is the first thumbnail**, so a reader who has chosen another can go back to
  it. Its thumbnail is drawn like the others.
* **The thumbnails are one choice among several**, so they are a radio group, named by the view's
  `gallery` string ("Gallery"). Each option is named by its picture's caption. Assistive technology
  hears "A coin's record, radio button, 1 of 4, checked". The keyboard reaches the group with Tab
  and moves between the pictures with the arrow keys, as it does on the business-case switch
  (DDR-079). The alternative text stays on the picture in the frame, so the thumbnails' own images
  are decorative and say nothing twice.
* **Keyboard focus is drawn around the picture in the frame**, in the site's focus outline. The
  focused option is the picture it shows, and the arrow keys change that picture.
* **No thumbnail is marked as the current one.** The design draws no such state, and the frame and
  its caption already say which picture is shown.
* **Under the pointer, a thumbnail comes to the front and its edge takes the accent**, per DDR-035.
  So a thumbnail another covers can be seen whole before it is chosen.

### The count

* **The row shows the first two thumbnails**, which is what the design draws. A gallery of three or
  more pictures follows them with the count of the others: "+2 more". A project with two pictures
  (the lead and one item) shows both and no count.
* **The count is a disclosure.** Choosing it shows the other thumbnails in the row, after it, and
  choosing it again hides them. Assistive technology announces it as expanded or collapsed. It
  keeps its words while open, because it still names what it discloses.
* **The count never stands under a thumbnail.** It begins 12px after the last thumbnail's edge,
  which is the design's distance from the thumbnail it was drawn beside (x = 84 against a
  thumbnail ending at 72). The overlap that covers it in the layer is not reproduced.
* **The arrow keys reach every picture whether the row is open or not**, because the options are
  the radios, not the thumbnails. The count is for the pointer.

### The thumbnails' look

Every value is the layer's, as tokens of the view's own. None is a step of DDR-013's scale.

| Token | Value | Design |
| ----- | ----- | ------ |
| `--project-view-thumbnail-width` | 4.5rem | 72px |
| `--project-view-thumbnail-height` | 3.25rem | 52px |
| `--project-view-thumbnail-overlap` | 2.25rem | the second starts 36px after the first |
| `--project-view-thumbnail-edge` | 0.1rem | 1.6px |
| `--project-view-thumbnail-count-gap` | 0.75rem | 12px |
| `--project-view-thumbnail-radius` | 0.5rem | 8px; the view's own, so DDR-013's three radii stay three |
| `--shadow-thumbnail` | `0 4px 6px -1px`, `0 2px 4px -2px`, both 10% black | the layer's; dropped on paper |

* The edge is white, which is `--color-surface-card`. The count is the caption's 11px faint ink,
  `--font-size-xxx-small` in `--color-text-faint`, which is DDR-025's failing pairing, already held
  by name.
* The row stands `--space-medium` (16px) under the lead's caption.
* **The first thumbnail is drawn over the second**, as the layer draws it. A thumbnail the count
  shows is drawn over the one before it.
* A thumbnail shows its own picture, cropped from the centre to 72 by 52, never stretched. A video
  shows its poster.

### Target size

**Every thumbnail passes WCAG 2.5.8 without the spacing exception.** The part of a covered
thumbnail that is not covered is 36 by 52px, larger than 24 by 24. The count is one line of 11px
text, about 16.5px tall, so it is under 24px. It passes by the spacing exception. A 24px circle
centred on it meets no other target, because the nearest, the last thumbnail, is 12px from its
start. DDR-027's rule that no target has a minimum of its own stands.

### On a phone

**The row is the same at every width**, under the lead's caption, which on a phone follows the
view's links. Seventy-two pixels is the smallest a picture of an application still reads as one,
and the row of two plus the count is about 170px wide, so it fits a 300px screen. A row the count
opens that runs out of room wraps to a second line, with the same overlap.

### What stays

* A project with no gallery media shows its lead picture and caption exactly as before: no
  thumbnails, no count, no space.
* DDR-053's full-size section is gone, and nothing takes its place. The foot follows the
  introduction at DDR-052's boundary, as it did before #155.
* The view's outline loses the "Gallery" `h2`, which headed a block that no longer exists. It is
  still the project's `h1` and the labels under it.
* The page, the printed CV and every link preview are untouched. A view does not print.

## Alternatives Considered

### Option A: choosing a thumbnail opens the picture larger, over the page

Pros:
* The row's pictures stay beside the lead rather than replacing it.

Cons:
* An overlay the design does not draw, with its own closing control, focus handling and
  scrolling. #155 left it out for this reason.
* It needs the popover API or script, and a way to move between pictures inside it.

### Option B: the thumbnails are the gallery's items only, without the lead

Pros:
* Closest to the layer, whose thumbnails' placeholders differ from the lead's.

Cons:
* Once another picture is chosen, nothing leads back to the lead picture without the keyboard.

### Option C: show every thumbnail and no count

Pros:
* No disclosure. Every picture is one click away.

Cons:
* The layer draws a count, and a gallery of six would be a row as wide as the column.

### Option D: the count shows the next picture not in the row

Pros:
* No disclosure.

Cons:
* A control that says "+2 more" but shows one picture, and a different one each time, is a control
  that needs explaining.

## Consequences

Benefits:
* A reader sees at a glance that there is more to see, beside the picture it adds to, and the view
  is no longer.
* No new interaction pattern. The choice is a radio group like the business-case switch, and the
  count is the browser's own disclosure. Both work without script (ADR-017).

Tradeoffs:
* The gallery's pictures are shown at the lead's size, one at a time, rather than all at once.
* The count's words are the same while it is open.
* The thumbnails load every gallery picture with the view. They are the same files the frame
  shows, so a picture is fetched once. ADR-004's budget for a view is to be measured when media
  arrives.

Risks:
* **A video that is playing keeps playing when another picture is chosen**, out of sight, because
  nothing pauses it without script. No gallery video exists. The story that brings the first one
  decides this, alongside its captions (DDR-053).
* The first real gallery is the first time the row is measured with real pictures. No project has
  gallery media yet, so this ships the mechanism without any, as #155 did.

## Related Documents

* Issue #244, Epic #152
* DDR-053, which this amends; DDR-050, the view; DDR-079 and ADR-014, the radio pattern it reuses
* ADR-017, how the view holds the picture shown
* DDR-010 and ADR-004, video and binary assets; DDR-025, the faint ink
* DDR-027 and DDR-035, targets and hover
* `career-site-design`, layer `career-site-business-case`, nodes 405:80 and 405:93
