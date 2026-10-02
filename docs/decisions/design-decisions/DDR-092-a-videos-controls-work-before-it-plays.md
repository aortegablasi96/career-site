# DDR-092-A Video's Controls Work Before It Plays

Status: Accepted

Date: 2026-10-02

**Amends DDR-089 ("It waits for the reader")**: DDR-089 says of the browser's controls in the larger
view, "Their full screen control makes it larger still". As DDR-082 did before it, it assumed a
control that Chrome and Edge only offer once the video has started. Now the larger view readies the
controls as it opens, so that control works before play, and so do a click and a double click on the
video. Everything else DDR-089 decides stands: the still in the frame, the larger view, the steps,
the pause on closing, no download and no picture-in-picture. DDR-010 stands too. The video has the
browser's controls, and it never plays by itself or loops. ADR-026 records how and what it costs.

## Context

On #278, under Epic #152, the owner asked for three things in the larger view, all of which must work
before the video has ever played:

* show it at full screen without playing it;
* click once on it to play it, and once more to pause or resume it;
* click twice on it to show it at full screen.

Each browser's own controls already do the second and the third once they know the video's size and
length. Measured on 2026-10-02:

| Before play, with `preload="none"` | Chrome and Edge | Firefox |
| ---------------------------------- | --------------- | ------- |
| The full screen control | Greyed out | Works |
| A click on the picture | Nothing | Plays |
| A double click on the picture | Nothing | Full screen |

So the gap is Chrome's and Edge's. Their controls stay inert until the video's metadata is known,
which `preload="none"` (ADR-004) holds back until play. The Figma file `career-site-design` draws
none of this.

## Decision

**The browser's controls stay the video's only controls. The larger view readies them as it opens,
so in every browser the reader can play, pause and show the video at full screen from the moment it
opens.**

### With a pointer

* **A click on the video's picture plays it**, including the very first play. Another click pauses
  it, and the next resumes it. This works in the larger view and at full screen.
* **A double click shows it at full screen**, and another leaves it. Before play, the video stays
  on its still. While it plays, it keeps playing, and while it is paused, it stays paused. Chrome and
  Edge pause and resume it within the same moment, which no reader sees. Firefox, on a paused video,
  can move it on by a few hundredths of a second.
* **The controls' own full screen control works before play**, at the controls' right end, where
  the browser draws it.

### With the keyboard

* From the close control, Tab reaches the video's controls: play, the timeline, then full screen,
  in Chrome and Edge. Enter on it shows the video at full screen, before play too. The controls'
  focus and names are the browser's.

### At full screen

* **It is the browser's own full screen of the video**: the video alone, whole, at its shape, on
  black, with the browser's controls. Before play it shows the still. The caption, the steps and the
  close control are not there. The browser's control, Escape or a double click leaves it.
* **Leaving full screen returns to the larger view**, with the video where it was and playing or
  paused as it was. Escape only leaves full screen. A second Escape closes the larger view, as it
  does today.
* **Still no download and no picture-in-picture** (DDR-089). Full screen has the same controls and
  the same declined menu.

### With touch, the browser's own

* **Chrome on a phone keeps the tap and the double tap for itself.** A tap shows or hides the
  controls, and a double tap moves the video ten seconds back or forward. So on touch the reader
  plays it with the play control and shows it at full screen with the full screen control, which now
  works before play. The page does not take these gestures from the browser.

### Without script

* Nothing is readied. Firefox behaves as above. In Chrome and Edge the video behaves as it did
  before #278: the reader presses play first, and full screen follows.

### What does not change

* The frame on the view: choosing the video still opens the larger view (DDR-089).
* The pictures, which gain no full screen.
* Motion: entering and leaving full screen is the browser's, and the page adds none.

## Alternatives Considered

### Option A: a full screen control of the site's own, beside the close control

Pros:
* It looks like the site's other round controls.

Cons:
* Once the video is readied, the browser's controls already hold one, so the larger view would have
  two controls that do the same thing.
* It needs script, as DDR-089 found for Option B there. It would also leave the click and the
  double click to be solved.

### Option B: the page's own click and double click on the video

Pros:
* The page decides how a single click is told from a double click.

Cons:
* Firefox already plays on a click and goes full screen on a double click, and Chrome and Edge do
  too once ready. The page's handlers would toggle the video a second time on each click.
* Telling the two apart means delaying every click, which the browsers already do their own way.

### Option C: the site's own player controls in place of the browser's

Rejected. It goes against DDR-010, and it means rebuilding the timeline, keyboard access and full
screen that the browser gives for free.

### Option D: the page takes the tap and the double tap on touch

Rejected. It would take from Chrome the tap that shows the controls and the double tap that moves
through the video, and it would make the video behave differently from every other video on the
phone.

## Consequences

Benefits:
* A reader shows the walkthrough at full screen before it starts, in every browser.
* A click and a double click do what readers already expect of a video, from the first moment.
* No new control, and no new pattern: the controls are the browser's, as DDR-010 decided.

Tradeoffs:
* Opening the video larger fetches part of its file before it plays. ADR-026 measures and records
  this, amending ADR-004.
* At full screen the reader sees no caption and no steps. They leave full screen to step.
* On touch in Chrome, a tap does not play the video. The play control does.

Risks:
* **The browsers' controls change.** The behaviour above is each browser's, measured on 2026-10-02,
  and a browser can change it.
* **Firefox on Android and Safari** were not checked. They keep their own controls' behaviour.

## Related Documents

* Issue #278, Epic #152
* DDR-089, which this amends; DDR-082, whose same assumption DDR-089 corrected; DDR-010, the
  browser's controls
* ADR-026, how the view readies the controls; ADR-004, which it amends; ADR-022
