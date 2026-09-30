# ADR-022-A Gallery's Video Opens in the Larger Picture's Dialog, and Script Withholds Its Download

Status: Accepted

Date: 2026-09-30

**Amends ADR-018**: `LargerPicture` now carries a video as well as a picture, per DDR-089. The frame
shows the video's still, and the dialog shows the video with the browser's controls. It stays the
site's third Client Component, now with two more reasons: pausing the video when its dialog closes,
and withholding the browser's menu on the video. **Amends ADR-019**: the view's steps reach a video
rather than passing over it. **Amends ADR-017** in one respect: where the page has script, a video
is no longer left playing out of sight. ADR-004 stands. Nothing of a video's file is fetched until it
is played.

## Context

Since #259 a gallery's video has been drawn in the frame by `Media`, as a `<video>` with the
browser's controls. DDR-082 left it out of the larger view. On #265 the owner asked to show it
larger before playing it, and to offer no way to download it. DDR-089 decides how both look.

The issue asked three things:
* whether this stays within `LargerPicture` or needs something else;
* what works without script;
* how the download is withheld in each browser.

## Decision

**The view hands a video to `LargerPicture` as it hands a picture. The frame shows the video's still,
as an `<img>`. The dialog shows the `<video>` with `preload="none"`, `controls` and
`controlsList="nodownload"`. The component adds three listeners: on its dialog's `close`, it pauses
the video; on the video's `contextmenu`, it declines the menu; and its arrow-key handler leaves a
key that comes from the video to the video.**

### Within `LargerPicture`

* **The dialog, its commands, its motion and its hand-over are the same for a video.** The
  component draws the video where it draws the larger picture, in the same room at the same width.
  Everything ADR-018 and ADR-019 give a picture, a video now has.
* **The frame's still is the poster file**, which the video also shows before it is played. So
  opening the dialog fetches nothing new, and `preload="none"` keeps the video's file unfetched until
  the reader presses play (ADR-004).
* **`Media` goes.** The frame was its one use on screen. The still in the frame is an `<img>`, which
  prints as itself, so the pair of a video for the screen and a still for paper is not needed
  (DDR-015).
* **No new Client Component.** The two new listeners belong to the dialog and the video that
  `LargerPicture` already owns.

### The view

* **`ProjectView` stays a Server Component.** Its `Frame` hands every item to `LargerPicture`.
* **Every item of a gallery is a step**, in the thumbnails' order and in a loop. The place counts
  them all (DDR-089).

### Withholding the download

| Where | How | Needs script |
| ----- | --- | ------------ |
| Chrome's and Edge's controls menu | `controlsList="nodownload"` | No |
| Firefox's controls | They have no download item | No |
| The browser's menu on the video, in all three | `contextmenu` declined on the video | Yes |

* **Not withheld**: the browser's menu without script, and Firefox's menu when Shift is held,
  which Firefox never lets a page decline. The file is served from the site like every other asset,
  so it can be saved from the developer tools or the network. DDR-089 records these as limits.

### What script adds, and what works without it

* **Without script** the video opens larger and closes, from the pointer, touch and the keyboard,
  and it plays with the browser's controls, with no download item in Chrome and Edge. It does not
  step, as no picture does (ADR-019). Closing it does not pause it, so it plays on out of sight.
* **With script** it also moves, steps, pauses as it closes, and withholds the browser's menu.

## Alternatives Considered

### Keep `Media` in the frame and give the video a dialog of its own

Pros:
* The video still plays in the frame.

Cons:
* Two players for one file, one of which can be playing behind the other.
* A second dialog component, beside `LargerPicture`, with the same veil, commands and motion.
* DDR-089 decides the video does not play in the frame.

### One `<video>` element, moved from the frame into the dialog

Pros:
* One player, which keeps its place when it moves.

Cons:
* Moving an element needs script, so without script the dialog would be empty.
* Moving a playing video can restart it in some browsers.

### Serve the video through a service or as encrypted streaming

Rejected on #265. It is a service, or a streaming setup, that a static site on GitHub Pages
(ADR-003) does not have. It would protect a silent walkthrough of a minute.

### Withhold the menu with an element laid over the video

Pros:
* No script.

Cons:
* An element over the video takes the browser's controls' clicks too.

## Consequences

Positive:
* The video reuses the dialog's handling: focus stays inside, the view behind is inert, Escape closes
  it and focus returns to its control, with no script.
* Every gallery item is handled one way, so `Frame` has one branch less and `Media` goes.
* Nothing new is fetched to open a video.

Negative:
* **`LargerPicture` has more reasons to be a Client Component**: the movement, the hand-over, the
  pause and the menu.
* Without script a closed video plays on, as ADR-017 and DDR-087 already accepted for a silent one.
* `controlsList` is honoured by Chrome and Edge only. Another browser that adds a download control
  offers it.

## Related Documents

* DDR-089, the design; DDR-082, DDR-083 and DDR-087, which it amends
* ADR-018 and ADR-019, which this amends; ADR-017, the gallery's radio group; ADR-004, a video's
  file; ADR-003, the site's hosting
* Issue #265, Epic #152
