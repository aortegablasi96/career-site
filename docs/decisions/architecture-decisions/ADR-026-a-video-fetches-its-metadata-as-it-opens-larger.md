# ADR-026-A Video Fetches Its Size and Length as It Opens Larger

Status: Accepted

Date: 2026-10-02

**Amends ADR-004 (§3, "The video carries a poster still and `preload="none"`")**: a video's file is
no longer untouched until it is played. Once a reader opens it larger, the page asks for its
metadata, its size and length, so that Chrome's and Edge's controls work before play (DDR-092).
Until then nothing is fetched, as before. The markup keeps `preload="none"`, and §5's budgets stand.
**Amends ADR-022** in one respect: `LargerPicture` adds a fourth listener, on its dialog's `toggle`.
It stays the site's third Client Component, with no new one.

## Context

#278 asks for the video in the larger view to play on a click, go full screen on a double click,
and offer full screen from its controls, all before it has ever played. DDR-092 decides to keep the
browser's controls and make them work. Chrome and Edge leave them inert until the video's metadata
is known, and `preload="none"` (ADR-004) holds that back until play. Firefox fetches what it needs
on the first click by itself.

The issue asked the Architect three things:
* whether this stays within `LargerPicture`;
* how full screen is reached before the file is fetched, and what that means for ADR-004;
* what works without script.

## Decision

**When its dialog opens, `LargerPicture` sets the video's `preload` to `metadata`. The markup keeps
`preload="none"`, so nothing of the file is fetched before a reader opens the video larger.**

### Within `LargerPicture`

* **One listener on the dialog's `toggle`.** It catches every way the dialog opens: its control,
  the gallery's steps, with or without motion. When the dialog opens with a video in it, it calls
  `ready`, which sets `preload` to `metadata`. The browser then fetches the start of the file and
  keeps the rest for play.
* **Nothing else changes.** The click, the double click, full screen, Escape and the keyboard are
  the browser's own controls (DDR-092). The page adds no handler for them, and no full screen call.

### What opening costs

Measured on 2026-10-02 against the live site, with the cache off:

| Browser | NumisBook (1.36 MB) | Stock Portfolio Viewer (3.76 MB) |
| ------- | ------------------- | -------------------------------- |
| Chromium, as Chrome and Edge | 112 KB | 190 KB |
| Firefox | 1.36 MB, the whole file | 245 KB |

* **Firefox reads further than it needs.** It treats `metadata` as a hint, and it read all of
  NumisBook's short file. It would play these videos without the hint, but the page cannot tell
  which browser needs it without sniffing.
* **Nothing is fetched until the video opens.** A reader who never opens it pays nothing, which is
  what ADR-004 protected.
* **Stepping past the video opens it**, so a reader stepping through the gallery fetches its start
  too.
* **Once fetched, it stays fetched.** Closing and reopening the dialog asks for nothing more.

### Focus on the video

* **The `<video>` carries `autofocus`**, so the browser's own dialog focusing puts focus on it as
  the dialog opens, and Space plays it (DDR-092). It is markup, so it works without script, and
  React renders it as the attribute without calling `focus()` itself.
* **`swap` hands focus over only from a step control.** It used to move focus to the control that
  stands where focus was, the close control included. Now it leaves focus on the close control to
  the new dialog, which puts it there for a picture and on the video for a video. A picture's
  larger view behaves exactly as before.

### Full screen before the file

Full screen is the browser's own full screen of the `<video>`. Once the metadata is in, its
controls offer it, and the still fills the screen until the reader plays. The page never calls
`requestFullscreen`.

### What works without script

* Nothing is readied, so the video stays at `preload="none"` and fetches nothing until play.
* Firefox already plays on a click, goes full screen on a double click and offers its full screen
  control before play.
* In Chrome and Edge the reader presses play first, as before #278. Full screen follows.

## Alternatives Considered

### `preload="metadata"` in the markup

Pros:
* No script at all.

Cons:
* Every video is in the page from the start, inside its closed dialog, so every visit to the view
  would fetch its start, whether or not the reader opens it. That breaks what ADR-004 protects for
  nothing.

### Ready the video on the reader's first click on it, rather than on opening

Pros:
* A reader who opens the video and leaves fetches nothing.

Cons:
* In Chrome and Edge that click would still do nothing, and the double click and the full screen
  control would wait for it. The reader would click twice for one result.

### Call `requestFullscreen` from a control or a double click of the page's own

Pros:
* Full screen with nothing fetched.

Cons:
* DDR-092 keeps the browser's controls. The page's handlers would fight the browser's own, which
  already go full screen once ready, and Firefox's from the start.

### Ready only where the browser needs it

Rejected. Telling Chrome and Edge from Firefox means sniffing the browser, which breaks with the
next release of either.

## Consequences

Positive:
* Three of the reader's requests are met with one property, set by one listener the component
  already had room for.
* Every way of opening the dialog readies the video, because they all fire the dialog's `toggle`.
* Without script, nothing is fetched early, and focus still starts on the video.

Negative:
* Opening the video larger costs up to its whole file in Firefox, and around a tenth of it in Chrome
  and Edge, before the reader plays it.
* `LargerPicture` has a fifth reason to be a Client Component: readying the video.

## Related Documents

* DDR-092, the design; DDR-089 and DDR-010
* ADR-004, which this amends; ADR-022, which this amends; ADR-018 and ADR-019, the dialog and its
  steps
* Issue #278, Epic #152
