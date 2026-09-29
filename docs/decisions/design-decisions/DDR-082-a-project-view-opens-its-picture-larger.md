# DDR-082-A Project View Opens Its Picture Larger

Status: Accepted

Date: 2026-09-29

**Amends DDR-053 (Option C) and DDR-081 (Option A)**, which both rejected an enlarged view of a
picture over the page. The owner asked for one on #246, so the picture in a project view's lead
frame can now be opened larger, in a view of its own over the page, and closed again. Everything
else both records decide stands: the gallery's content, its thumbnails, which picture the frame
shows, and a video's treatment. ADR-018 records how the view holds whether the picture is open.

## Context

The lead frame shows a project's picture at a column's width: less than 400px on a phone, and
474px to 560px from the wide breakpoint, cropped to the design's 16:10. Since #242 each picture is
served at its original's 1536 by 1024, so the file holds detail that the frame cannot show, and an
application's screens (a dashboard, a list, a chart) cannot be read at the frame's size.

DDR-053 and DDR-081 left an enlarged view out because the design does not draw one and #155
excluded it. The owner now asks for one on Epic #152. The Figma file `career-site-design` still
draws none, so its look and behaviour are decided here rather than read from a layer.

## Decision

**Over the lower right corner of the picture in the lead's frame is a round control with two
arrows pointing out. Choosing it, or anywhere on the picture, opens that picture larger: whole, on
a dark ground that fills the window, with a round control that closes it above it at the right and
its caption under it. Choosing the control, anywhere on the ground, or pressing Escape closes it
and returns the reader to the view where they were.**

### What opens

* **The picture the frame shows**: the lead, or the gallery picture the reader chose from the
  thumbnails (DDR-081). Each picture carries its own control, so the one on the frame is always the
  one shown.
* **Only pictures.** A video's own controls offer full screen, so a video in the frame carries no
  control.
* **The file the frame already shows**, so opening it fetches nothing.

### The control that opens it

* **A round white button, 32px across** (`--project-view-enlarge-size`, the scale's large step), in
  the heading's ink, raised by the site's shadow (DDR-020), standing the small step (8px) in from
  the frame's lower right corner. The mark is two arrows pointing out to opposite corners, at 16px.
* **Its whole target is the picture**: the pointer opens the picture from anywhere on it, and the
  pointer there is a magnifier. Keyboard focus is drawn on the round button itself, in the site's
  outline. Under the pointer, anywhere on the picture, and on focus, the button takes the accent
  and its tint, as the view's outlined control does (DDR-035).
* It is always shown, not only under the pointer, so a phone's reader can see that the picture
  opens. Its accessible name is "View larger", from `content/`.
* In a gallery, the radio's focus is still drawn around the picture (DDR-081). The two focus rings
  differ in place: the picture's for the choice of picture, and the button's for opening it.

### The picture larger

* **It fills the window**, on the heading's ink as an opaque ground (`--color-surface-enlarged`).
  A dark neutral ground lets a picture's own colours read. The view behind it is hidden, stays
  still while it is open, and is where the reader left it when it closes.
* **Three rows**: the close control at the top right, the picture centred below it, and the caption
  under the picture. The picture takes the room the other two leave.
* **The picture is shown whole**: never cropped, stretched or squashed, and never larger than its
  own 1536 by 1024. It is as large as the room allows in both directions, at the frame's large
  radius. The frame's 16:10 crop does not apply, so a 3:2 picture shows the parts the frame cuts
  off.
* **The caption** is the picture's own, in the card's white (`--color-on-enlarged`) at the small
  step (14px), centred and at most a measure wide. It is also the dialog's name. The picture keeps
  its alternative text.
* **It is inset from the window's edges** by the small step on a phone, so the picture is as large
  as it can be, and by the medium step from the wide breakpoint.

### The control that closes it

* **The same round white button**, with the cross the contents menu uses, at the top right of the
  window. Its accessible name is "Close".
* **Its target is the whole ground around the picture**: choosing outside the picture and its
  caption closes it, and the pointer there is a magnifier that shrinks. Choosing the picture or the
  caption does not close it, so a reader can select the caption's words.
* **Escape closes it**, and keyboard focus returns to the control that opened it.
* **Keyboard focus stays inside it** while it is open. It starts on the close control, the only
  control there is. Its outline there is the white, because the accent on the dark ground is
  2.84:1, below 1.4.11's 3:1.

### Motion

* Where the reader has not asked for less motion, it fades in over the site's 150ms. A reader who
  has sees it at once. It closes at once either way.

### Target size

* Both controls are 32 by 32px, so they pass WCAG 2.5.8 outright, and 64px at 200% text. The
  opening control's target is the whole picture. No undersized target stands within 12px of it at
  any width from 300px to 900px, at the default text size and at 200%.

### On a phone

* **The same, at every width.** The picture is inset by 8px, so on a phone held upright it is
  15px to 31px wider than the frame, as measured on #246, and shows the whole picture, uncropped. The browser's own zoom
  enlarges it further.
* **Where the window is shorter than the frame**, as on a phone held sideways below the wide
  breakpoint, or at 200% text in a short window, the frame is taller than the screen. The picture
  larger fits the screen, so there it can be narrower than the frame. It is still the whole picture
  at the largest size the screen shows at once, which the frame is not. Fitting the screen takes
  precedence over being wider than the frame.

### Tokens

| Token | Value | Why |
| ----- | ----- | --- |
| `--project-view-enlarge-size` | `var(--space-large)`, 32px | The round controls. Passes 2.5.8 outright |
| `--project-view-enlarge-pull` | minus the size and the small step | Pulls the opening control, which follows the picture, up over its corner |
| `--color-surface-enlarged` | `var(--color-text-heading)`, `#0f172a` | The dark ground. Opaque, as the palette is. Dropped on paper |
| `--color-on-enlarged` | `var(--color-surface-card)`, `#ffffff` | The caption and the focus outline on the ground, 17.85:1 |

## Alternatives Considered

### Option A: the control appears only under the pointer

Cons:
* A phone has no pointer to hover, so its reader would not know the picture opens.

### Option B: the whole picture is the only control, with no visible mark

Cons:
* Nothing says the picture opens, and keyboard focus would be drawn round the picture, where a
  gallery's radio already draws it.

### Option C: the ground is the page's light surface, with the picture raised on it

Pros:
* The site's own light surface.

Cons:
* An application's light screens blend into a light ground. A dark ground is the convention for a
  picture viewed on its own, and it hides the view behind it, which is not what the reader is
  looking at.

### Option D: moving between the gallery's pictures while one is open

Cons:
* #246 leaves it out. The thumbnails already choose the picture, and browsing inside the enlarged
  view would be a story of its own.

### Option E: the close control over the picture's corner, to give the picture its row

Pros:
* The picture gains 40px of height, which counts on a phone held sideways.

Cons:
* The control would cover part of the picture, which is what the reader opened it to see.

### Option F: the picture larger than its own file on a large screen

Cons:
* Beyond 1536 by 1024 it would be blurred rather than more detailed.

## Consequences

Benefits:
* A reader can read an application's screens without leaving the view or downloading a file.
* It works without script (ADR-018), from the keyboard, the pointer and touch alike.
* The page, the printed CV and every link preview are untouched. A view does not print.

Tradeoffs:
* A second, dark surface on a light site. It is the only place the site uses it.
* On a phone held upright the gain in width is small. The gain is the whole, uncropped picture,
  and the browser's zoom on top of it.
* Where the window is shorter than the frame, the picture larger can be narrower than the frame.
* Every picture in a gallery carries its own control and dialog in the markup, most hidden.

Risks:
* Choosing the ground closes the picture, so a stray tap beside it on a phone closes it. Reopening
  it is one tap.
* A browser without the Invoker Commands API shows the control and does nothing when it is chosen
  (ADR-018).

## Related Documents

* Issue #246, Epic #152
* DDR-053 and DDR-081, which this amends; DDR-050, the view and its lead picture
* ADR-018, how the view opens and closes the picture without script
* ADR-016 and #242, the pictures at their originals' resolution
* DDR-020, DDR-025, DDR-027 and DDR-035: elevation, colour, targets and hover
* DDR-075, the cross this reuses
