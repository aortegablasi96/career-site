# DDR-089-A Gallery's Video Opens Larger Before It Plays, and Offers No Download

Status: Accepted

Date: 2026-09-30

**Amended by DDR-092 (2026-10-02)**: "Their full screen control makes it larger still" was only true
once the video had started. Chrome and Edge grey that control out until they know the video's size
and length. Now the larger view readies the controls as it opens. A click plays and pauses the video,
a double click shows it at full screen, and the full screen control works, all before play.
Everything else here stands.

**Amends DDR-082 ("Only pictures")**: a video in the frame now opens larger, as a picture does.
DDR-082 left it out because "a video's own controls offer full screen", but they only offer it once
the video is playing. **Amends DDR-083**: the larger picture's steps now reach the video rather than
passing over it, and the place counts every item of the gallery. **Amends DDR-087** in two respects:
the video no longer plays in the frame, and closing it pauses it. Everything else those records
decide stands. That includes the control, the veil, the blur, the motion, the steps' look and places
(DDR-086), the video's place at the end of its gallery, its still, name, description and silence, and
its thumbnail with no mark. DDR-010 stands too: the video has the browser's controls, and it never
plays by itself or loops. ADR-022 records how the view does it.

## Context

On #265 the owner asked for two things on Epic #152:

* **Show a project's video larger before starting it.** NumisBook's and the Stock Portfolio
  Viewer's walkthroughs are recorded at 1920 pixels wide. In the frame, their figures and labels are
  too small to read. The browser's full screen control only appears on the video's controls, which a
  reader meets after pressing play small.
* **The video should not be downloadable.** Chrome's and Edge's controls offer a download item, and
  every browser's menu on a video offers to save it.

The Figma file `career-site-design` draws neither, so both are decided here.

## Decision

**In the frame, a video is its still with the same round control as a picture. Choosing it opens the
video larger, exactly as a picture opens: whole, over the view blurred behind the veil, with its
caption under it and the close control above it. There it waits for the reader to press play, with
the browser's own controls. Nothing the video offers downloads it.**

### In the frame

* **The video's still stands in the frame**, as a picture does, with the round "View larger" control
  at the box's lower right corner. The whole box is the control's target (DDR-088).
* **It does not play in the frame.** The frame shows no player controls, because a reader who
  chooses the video wants to watch it large. The name above the chosen thumbnail, "Video
  walkthrough", still says that this item is a video (DDR-087).

### Larger

* **It opens as a picture opens.** It grows out of the frame where motion is welcome and appears at
  once elsewhere. It is shown whole at the box's width, never wider than the view's narrowest file,
  at the frame's large radius (DDR-082, DDR-088).
* **It waits for the reader.** It shows its still, and the browser's controls play it, pause it and
  move through it. Their full screen control makes it larger still. It does not play by itself,
  as DDR-010 decided, so opening it fetches nothing more than the still the frame already shows
  (ADR-004).
  > **Amended by DDR-092.** The full screen control only worked once the video had started. The
  > larger view now readies the controls as it opens, so it works before play, and a click and a
  > double click on the video play it and show it at full screen. Opening fetches the video's
  > start (ADR-026).
* **Closing it pauses it.** Closing with the control, with the ground or with Escape, or stepping to
  another item, pauses the video. Opening it again resumes it where it stopped. Without script
  nothing can pause it, so it plays on out of sight. It is silent (DDR-087), so no one hears it.
* **Its caption and its name** are the dialog's, as for a picture. The video keeps its description as
  its accessible name.

### The steps reach it

* **The video is one of the gallery's steps.** It stands last, so "Next picture" from the last
  picture shows the video, and "Next picture" from the video shows the first picture. The place
  counts every item: NumisBook's video is "8 of 8".
* **The arrow keys step, except on the video.** While keyboard focus is on the video, the arrow keys
  move through it, as the browser's own controls do. Tab reaches the step controls from there.

### No download

* **The video's controls show no download item.** Chrome and Edge list one in their controls'
  menu, and the page asks them to leave it out. Firefox's controls have none.
* **The browser's menu on the video is not offered** where the page has script. That is the
  right-click menu, the long press and the keyboard's menu key. It is the menu that says "Save video
  as" in Chrome, Edge and Firefox. It also holds loop and speed, which a reader loses with it.
* **The video cannot float in a window of its own.** Picture-in-picture, which Chrome and Edge list
  in their controls' menu and Firefox draws as a button over the video, is not offered, as the
  owner asked on #265. The video is watched on the view, larger, or at full screen.
* **What stays**, recorded as limits:
  * Without script, the browser's menu is offered.
  * In Firefox, holding Shift while right-clicking always opens its menu.
  * Any file a browser plays can be saved from its developer tools or its network traffic. The page
    makes saving the video harder than choosing an item. It cannot prevent it.
  * The still is a picture like the gallery's others, and can be saved as they can.

### Accessibility

* The frame's control, the close control and the steps are the ones a picture has, with their names
  and their focus.
* The browser's controls are keyboard-operable. Focus reaches the video after the close control,
  and the arrow keys are the video's while it has focus.
* The motion follows the reader's preference, as for a picture.

## Alternatives Considered

### Option A: keep the video playing in the frame, with a control of its own to enlarge it

Pros:
* A reader can still watch it small.

Cons:
* The browser's controls fill the frame's foot, where the opening control stands. The control would
  have to stand elsewhere on the video than on a picture.
* The whole box cannot be the control's target, because the browser's controls need it.
* The video playing small and the video larger would be two players to keep in step.

### Option B: the browser's own full screen, from a control on the frame

Pros:
* The largest the video can be.

Cons:
* It is not the site's larger view. It has no caption, no steps and no close control of the site's.
* It needs script, since full screen is only asked for from script. Without script the control would
  do nothing.

### Option C: the video plays as soon as it opens

Pros:
* One action less for a reader who wants to watch it.

Cons:
* The owner asked to enlarge the video *before* starting it.
* A video that starts by itself goes against DDR-010, and opening would fetch the file (ADR-004).
* Without script it could not start, so the two would differ.

### Option D: the steps keep passing over the video

Pros:
* No change to DDR-083.

Cons:
* Now that the video opens larger, a step that skips it hides an item the reader can see among the
  thumbnails.

### Option E: stream the video, or serve it from a video host, so its file cannot be saved

Rejected on #265, which leaves it out. It is an architecture decision of its own, with a service or
encrypted streaming, for a silent walkthrough of a minute.

## Consequences

Benefits:
* A reader watches the walkthrough at a size where its screens can be read, from the first frame.
* A video behaves like every other item of the gallery: the same control, the same larger view, the
  same steps.
* Choosing the video's item offers no download.

Tradeoffs:
* A reader cannot watch the video in the frame.
* The browser's menu on the video is gone, with its loop and speed.
* A reader cannot keep the video playing in a floating window while they read the view.
* In the frame, a video looks like a picture until it is opened. The chosen thumbnail's name says it
  is a video, as it did.
* Watching takes two actions: opening, then playing.

Risks:
* **The download is withheld, not prevented.** A reader who wants the file can still get it, as
  recorded above.
* **A browser's controls change.** If a browser adds a download control the page cannot remove,
  the site offers it again until a new record decides.

## Related Documents

* Issue #265, Epic #152
* DDR-082, DDR-083 and DDR-087, which this amends; DDR-086 and DDR-088, which stand
* DDR-010, a video's controls; ADR-004, nothing fetched until played
* ADR-022, how the view does it
