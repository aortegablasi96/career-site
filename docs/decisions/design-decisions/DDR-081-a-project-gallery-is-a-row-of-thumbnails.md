# DDR-081-A Project's Gallery Is a Row of Thumbnails Under Its Lead Picture

Status: Accepted

Date: 2026-09-29

**Read with DDR-087 (2026-09-30)**: the first gallery videos are silent, stand last in their rows,
and are not paused when another picture is chosen, which answers the first risk below.

**Amended by DDR-082 (2026-09-29)**: the picture in the lead's frame, whichever the thumbnails
chose, can be opened larger over the page, which Option A and "What choosing a thumbnail does"
rejected. Choosing a thumbnail still shows its picture in the frame and opens nothing.

**Amended by DDR-085 (2026-09-30)**: the picture in the frame is shown whole at its own shape,
where "at the lead's size" below meant the 16:10 box. The thumbnails keep their crop.

**Amended by DDR-084 (2026-09-30)**: the thumbnails are the gallery's pictures alone. The lead
picture is no longer the first of them, which Option B rejected, and a view with a gallery opens
on the gallery's first picture. The lead picture is in a gallery only where the gallery lists it.
The row, the raised thumbnail and the radios stand.

**Amends DDR-053 in its layout, and DDR-050 in its lead picture.** A project's gallery is no longer
a full-size section below the introduction. It is a row of small thumbnails under the lead picture.
Choosing one shows that picture in the lead's place, and the chosen thumbnail rises with the
picture's name above it. DDR-053's content stands: a gallery item is `{ media, caption }`, every
word and path is in `content/`, a view with no gallery media shows nothing, and a video is drawn by
`Media`, per DDR-010. DDR-053's label, its list of full-size figures, its 20px gap and its one or
two items to a row are withdrawn. ADR-017 records how the view holds which picture is shown.

## Context

Issue #244, in Epic #152, adopts the gallery the owner drew in the layer
`career-site-business-case` (node 405:93, in the right column 405:80). It is two overlapping
thumbnails, 72 by 52 with 8px corners, a 1.6px white edge and a soft shadow, the second 36px to
the right of the first and under it. After them is "+2 more" in the caption's 11px faint ink. It
stands 16px under the lead picture's caption. The layer draws no "Gallery" label.

The layer is a still frame at the wide width, and its thumbnails are placeholders. It does not say
what choosing a thumbnail does, how the row arranges on a phone, or what a thumbnail shows.

While the story was built, the owner supplied NumisBook's six gallery pictures and made two
choices on #244:

* **Show every thumbnail**, rather than two and a count of the rest.
* **An old carousel's effect**: the chosen thumbnail moves a bit up and its name appears above it.
  The owner chose to move the name there from under the frame rather than show it twice, and for
  the pointer to preview the effect before a thumbnail is chosen.
* **A row centred under the picture, bigger and wider** than the layer's.

## Decision

**Under the lead picture, a project with gallery media shows a thumbnail of each of its pictures,
the lead first. Choosing a thumbnail shows that picture in the lead's place. The chosen thumbnail
comes to the front, rises and shows the picture's name above it.**

### What choosing a thumbnail does

* **It shows that picture in the lead's frame, at the lead's size.** Since DDR-085 that is the
  lead's width, and the picture's own shape. Since DDR-082 the picture in the
  frame can be opened larger by a control of its own; choosing a thumbnail still opens nothing.
  The frame was the largest a picture was drawn on the view. An enlarged view over the page would be a pattern the
  design does not draw. #155 left it out for that reason.
* **The lead picture is the first thumbnail**, so a reader who has chosen another can go back to
  it. **Amended by DDR-084**: the lead picture is not among the thumbnails, and the view opens on
  the gallery's first picture.
* **The thumbnails are one choice among several**, so they are a radio group, named by the view's
  `gallery` string ("Gallery"). Each option is named by its picture's caption. The keyboard reaches
  the group with Tab and moves between the pictures with the arrow keys, as on the business-case
  switch (DDR-079). The picture in the frame keeps its alternative text, so a thumbnail's image and
  name are hidden from assistive technology and say nothing twice.
* **Keyboard focus is drawn around the picture in the frame**, in the site's focus outline, since
  the arrow keys change that picture. The chosen thumbnail rises with it.

### The raised thumbnail

* **One thumbnail is raised at a time.** It is the chosen one, or, while the pointer is on a
  thumbnail, that one, so the pointer previews what choosing it does and only one name ever shows.
* **A raised thumbnail comes to the front**, whole, over the ones beside it.
* **Its name appears above it**: the picture's caption, in the caption's 11px faint ink, centred and
  as wide as the thumbnail (96px), wrapping inside it. So a long name takes two lines rather than widening
  the row or pushing a phone's page sideways.
* **It rises by `--project-view-thumbnail-lift`, 8px**, twice a card's lift, and its name fades in,
  over the site's 150ms. Both happen only where the reader has not asked for less motion. A reader
  who has sees the name and the thumbnail in front, and nothing move.
* **The frame shows no caption under a gallery's picture**, because the name above the raised
  thumbnail is that caption. The caption stays in the markup as its figure's caption and its
  radio's name. A project without a gallery keeps its caption under its picture, as before.
* **Under the pointer a thumbnail's edge also takes the accent**, per DDR-035.

### The row

* **Every picture has its thumbnail in the row**, in the content's order, and nothing hides any of
  them. The layer's count is not drawn.
* **Each thumbnail is drawn over the one before it**, so every one shows at least its first half
  and the last shows whole. The layer draws the first over the second, but with every picture in
  the row that order would cover a middle thumbnail on both sides.
* **The row is centred under the picture**, as the owner asked, and each line it wraps to is
  centred too.
* **The row wraps** where the column runs out of room, with the same overlap on every line. It
  stands `--space-medium` (16px) under the picture. The thumbnails stand on their images' foot, so
  a two-line name takes room above the row rather than pushing its image down.
* **A gallery holds at most twelve pictures, the lead's included.** ADR-017 records why. Since
  DDR-084 the twelve are all the gallery's.

### The thumbnails' look

The size is the owner's, and every other value is the layer's, as tokens of the view's own. None is
a step of DDR-013's scale.

| Token | Value | Design |
| ----- | ----- | ------ |
| `--project-view-thumbnail-width` | 6rem | 96px, where the layer draws 72, as the owner asked for bigger |
| `--project-view-thumbnail-height` | 4rem | 64px, where the layer draws 52: the 3:2 of the owner's pictures |
| `--project-view-thumbnail-overlap` | 2.25rem | 36px, the layer's; each covered thumbnail shows 60px |
| `--project-view-thumbnail-edge` | 0.1rem | 1.6px |
| `--project-view-thumbnail-radius` | 0.5rem | 8px; the view's own, so DDR-013's three radii stay three |
| `--project-view-thumbnail-lift` | 0.5rem | the owner's "a bit up"; not in the layer |
| `--shadow-thumbnail` | `0 4px 6px -1px`, `0 2px 4px -2px`, both 10% black | the layer's; dropped on paper |

* The edge is white, which is `--color-surface-card`. The name is `--font-size-xxx-small` in
  `--color-text-faint`, which is DDR-025's failing pairing, already held by name.
* A thumbnail shows its own picture, cropped from the centre to 96 by 64, never stretched. The
  owner's pictures are 3:2, so none of them is cropped. A video shows its poster.
* Seven thumbnails make a row of 456px, inside the design's 474px column, so NumisBook's gallery
  is one line from the wide breakpoint.

### Target size

**Every thumbnail passes WCAG 2.5.8 without the spacing exception.** The part of a covered
thumbnail that is not covered is 60 by 64px, larger than 24 by 24. DDR-027's rule that no target
has a minimum of its own stands.

### On a phone

**The row is the same at every width**, under the picture, which on a phone follows the view's
links. It wraps to a second line where seven thumbnails do not fit.

### What stays

* A project with no gallery media shows its lead picture and caption exactly as before: no
  thumbnails and no space.
* DDR-053's full-size section is gone, and nothing takes its place.
* The view's outline loses the "Gallery" `h2`, which headed a block that no longer exists.
* The page, the printed CV and every link preview are untouched. A view does not print.

## Alternatives Considered

### Option A: choosing a thumbnail opens the picture larger, over the page

**Amended by DDR-082**: the picture shown in the frame opens larger by its own control. A
thumbnail still only chooses the picture.

Cons:
* An overlay the design does not draw, with its own closing control and focus handling. #155 left
  it out for this reason.

### Option B: the thumbnails are the gallery's items only, without the lead

**Amended by DDR-084**: the owner chose this on #253, with the view opening on the gallery's first
picture, so there is no lead picture on the view to go back to.

Cons:
* Once another picture is chosen, nothing leads back to the lead picture without the keyboard.

### Option C: two thumbnails and a count that discloses the rest, as the layer draws

Pros:
* The layer's own row.

Cons:
* The owner chose on #244 to show every picture.

### Option D: keep the caption under the frame and show the name above the thumbnail too

Cons:
* The same words twice, a few pixels apart. The owner chose to move them.

### Option E: a name wider than its thumbnail, on one line

Pros:
* No name wraps.

Cons:
* A name wider than the thumbnail spills past it, and past the column at the row's ends. On a phone
  that pushes the page sideways, even while the name is not shown.

## Consequences

Benefits:
* A reader sees at a glance every picture there is, beside the one it adds to, and the view is no
  longer.
* The chosen picture is named in one place, over the thumbnail that chose it.
* It works without script (ADR-017).

Tradeoffs:
* The gallery's pictures are shown at the lead's size, one at a time.
* A name of two lines takes room above the whole row, so the row sits lower under the picture.
* The thumbnails load every gallery picture with the view. They are the same files the frame
  shows, so a picture is fetched once. NumisBook's six add about 315 KB.

Risks:
* **A video that is playing keeps playing when another picture is chosen**, out of sight, because
  nothing pauses it without script. No gallery video exists. The story that brings the first one
  decides this, alongside its captions (DDR-053). *Decided by DDR-087, on #259.*
* NumisBook's six pictures, supplied by the owner on #244, are the first real gallery. A gallery
  on another project is measured again when it lands.

## Related Documents

* Issue #244, Epic #152
* DDR-053, which this amends; DDR-050, the view; DDR-079 and ADR-014, the radio pattern it reuses
* ADR-017, how the view holds the picture shown and finds the chosen thumbnail
* DDR-010 and ADR-004, video and binary assets; DDR-025, the faint ink
* DDR-027, DDR-035 and DDR-055, targets, hover and the cards' lift
* `career-site-design`, layer `career-site-business-case`, nodes 405:80 and 405:93
