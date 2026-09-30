# DDR-087-A Gallery's Video Is a Silent Walkthrough, Last in Its Row

Status: Accepted

Date: 2026-09-30

**Amended by DDR-089 (2026-09-30)**: the video no longer plays in the frame. The frame shows its
still, which opens the video larger, as a picture opens, and the steps reach it. Closing it pauses
it where the page has script, and nothing the video offers downloads it. Everything else here stands:
its place, its still, its name, its description, its silence and its thumbnail.

**Answers what DDR-053, DDR-081 and DDR-084 left to the story that brings the first video**, and
amends DDR-053 in one respect: the captions track arrives with the first video that has sound, not
with the first video. Everything else those records decide stands: a video is a gallery item like
any other, drawn by `Media` with the browser's controls, it does not play by itself or loop, it
fetches nothing until it is played (DDR-010, ADR-004), it is shown whole at its own shape (DDR-085),
and a larger picture's steps pass over it (DDR-083). ADR-017's gallery without script stands, and
ADR-020 records how a video's file is made.

## Context

On 2026-09-30 the owner supplied a recording of NumisBook and one of the Stock Portfolio Viewer and
asked for both on the site (#259). They are the first videos the site carries. Each is a recording of
the application's window being used, from the first screen a reader would meet to its assistant
answering a question: 1 minute 4 seconds of NumisBook, and 1 minute 26 seconds of the Stock Portfolio
Viewer.

Neither has sound. Each file has an audio track, and it is silence from its first second to its
last, measured at -91 dB throughout.

Three records waited for this story:

* **DDR-053**: a video with speech may not land without a captions track, and "the story that
  brings the first video adds `captions` beside `poster`". The rule was recorded, not enforced.
* **DDR-081 and ADR-017**: a video that is playing keeps playing when another picture is chosen,
  because nothing pauses it without script. "The story that brings the first one decides this."
* **DDR-084**: a gallery whose first item is a video opens on its still, with nothing to open
  larger. "The story that brings the first one decides its place."

The owner chose to have the videos on the site. The rest is decided here, on #259, and is the
owner's to change.

## Decision

**A project's video is the last item of its gallery: a silent recording with no sound track, named
"Video walkthrough", shown as a still of its first frame until it is played.**

* **It is the gallery's last item.** A view still opens on a picture, which can be opened larger,
  and the pictures keep the order of the application's navigation. The video follows them, as the
  walk through what they showed one screen at a time.
* **Its name says it is a video**: "Video walkthrough". The name is the radio's accessible name and
  the words above its thumbnail, so it is how a reader learns that this item plays.
* **Its still is its own first frame**, at the video's size, so pressing play changes nothing a
  reader was looking at, and the frame keeps its shape when the video loads. It is a committed WebP
  within a still's 150 KB, made once by hand (ADR-004). It is what the thumbnail shows.
* **It has no sound track.** The owner's recordings are silent, so the track of silence is left out
  of the file the site serves. There is nothing to caption, and WCAG 1.2.2 does not apply.
* **Its description says in words everything it shows**, in the order it shows it, and that it is
  silent and how long it is. That is the alternative WCAG 1.2.1 asks of a video without sound. It is
  the video's accessible name and the text a browser that cannot play it shows (DDR-010).
* **The captions rule is now held by a check.** `Video` still has no field for a track. Until it
  has, `components/project-view.test.tsx` fails if any video the site carries has a sound track. The
  first video with sound adds the field, the `<track kind="captions">` and its own check, as DDR-053
  asks, and changes this one.
* **Nothing pauses it when another picture is chosen.** *(Amended by DDR-089: it plays only larger,
  and closing it pauses it where the page has script.)* ADR-017 stands, and the view gains no
  script. A silent video playing out of sight is heard by no one. It costs the reader their place:
  the video plays on, and may have ended when they come back to it.
* **No mark on its thumbnail says it is a video.** The design draws a play mark on its placeholder,
  and DDR-051 left the same question open for a card. It is a decision of its own, and #259 leaves
  it out.

## Alternatives Considered

### Option A: the video first in its gallery

Pros:
* The view opens on it, with its play control in sight.

Cons:
* The view opens on a still that cannot be opened larger (DDR-084), and its thumbnail stands beside
  a picture of the same screen: the Stock Portfolio Viewer's video starts on its Portfolio view,
  which is the gallery's first picture.
* It changes what both views open on, for every reader, to suit the ones who will play it.

### Option B: a still chosen from the middle of the video

Pros:
* A fuller screen than NumisBook's sign-in page, which is where its recording starts.

Cons:
* Which frame stands for a recording is a judgement about the owner's work, and the picture jumps
  when the reader presses play.
* The owner can supply another still at any time. It is one file.

### Option C: keep the silent audio track

Pros:
* The file is the owner's recording, track for track.

Cons:
* A sound track of silence makes the captions rule unenforceable: a check cannot tell silence from
  speech, so the rule would go back to being a note a reviewer reads.

### Option D: script that pauses a video when another picture is chosen

Pros:
* A reader comes back to the video where they left it.

Cons:
* It is the reason for script that ADR-017 asks a new record for, and the view would hold its
  gallery in two ways.
* With no sound, what it saves is a reader's place in a recording of a minute.

### Option E: add the `captions` field now, empty

Rejected, as DDR-053 rejected it: a shape nothing fills.

## Consequences

Benefits:
* A reader sees each application being used, not only its screens.
* Both views open as they did, and every picture still opens larger and steps as it did.
* No video with sound can land without captions by accident: the suite fails first.
* No new component, style or script. Adding a video to a gallery is content alone, as DDR-053 meant.

Tradeoffs:
* A thumbnail that is a video looks like one that is a picture until it is chosen or pointed at.
  The Stock Portfolio Viewer's first and last thumbnails show the same view.
* NumisBook's video shows its sign-in page until it is played, which is a plainer still than any of
  its pictures.
* A video that is left playing plays on out of sight. Measured on #259 in Chromium: it was at
  2.4 seconds when another picture was chosen, and at 4.9 seconds two and a half seconds later.
* A video's description is long for an accessible name: three sentences.

Risks:
* **The first video with sound** needs the captions field, a track, and a decision on pausing,
  because a voice playing out of sight is not harmless. That is a new record.
* **A recording goes out of date** as the application changes, as a picture does. Replacing it is
  replacing two files.
* **The check reads the file's track list, not its pictures.** A video whose pictures show someone
  signing or a slide of text without sound would pass it and still owe a reader more than a
  description. Neither recording is one.

## Related Documents

* Issue #259, Epic #152
* DDR-053, which this amends, and DDR-081 and DDR-084, whose open questions it answers
* DDR-010 and DDR-015, a video's controls and its still on paper; DDR-051, the card
* DDR-082 and DDR-083, the larger picture and its steps; DDR-085, the frame's shape
* ADR-017, the gallery without script; ADR-004 and ADR-020, a video's file and its budget
* WCAG 1.2.1 (Audio-only and Video-only, Prerecorded) and 1.2.2 (Captions, Prerecorded)
