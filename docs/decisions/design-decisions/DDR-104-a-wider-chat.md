# DDR-104-A Wider Chat

Status: Accepted

Date: 2026-10-05

**Amends DDR-102's panel width and its header's second line.** From the wide breakpoint the chat's
panel is 400px wide, where the design draws 360px, so the header's status and "Clear chat" stand
beside the heading in every state. Everything else DDR-100 to DDR-103 decide stands, including the
panel's height, its place above the launcher and the chat below the wide breakpoint.

## Context

DDR-102 took the design's 360px card (`career-site-chatbot`, node 502:1900). The design draws the
chat at rest, where the header holds only "Online". Once there is a message, "Clear chat" joins the
status at the header's right, and DDR-102 let the two take a line of their own where they don't
fit beside the heading.

Measured at the default text size, they don't fit in two of the three states. "AI Digital Twin" and
its subtitle beside the avatar take 173px, and "Starting up" with "Clear chat" 148px. With the 12px
gap between them that's 333px, where the header has 326px inside its padding. "Unavailable" is as
wide. So a
reader who asks while the service warms up, which is most first questions, sees the status and
"Clear chat" fall below the heading at the right, and the header grow from 63px to 99px. It reads as
broken just as the reader waits for the first answer.

The owner asked on #328 for the chat to be a little wider, and for the status and "Clear chat" to
stop falling below.

## Decision

**From the wide breakpoint the panel is `--chat-panel-width`, 25rem (400px), 40px wider than the
design draws it.**

* **The header is one line in every state**: "Starting up", "Online" and "Unavailable", with and
  without "Clear chat". The widest leaves 33px to spare, and the fallback faces, Arial and
  Georgia, leave 45px.
* **The panel keeps its right edge on the launcher's**, `--chat-inset` from the window's edge, and
  grows to the left. At the narrowest wide window, 48em, it stands 329px from the left edge.
* **It scales with the text**, being in rem as the header's parts are. At 200% text the wide
  breakpoint begins at 1536px, the panel is 800px wide and the header is still one line.
* **DDR-102's second line stays as the fallback** where the header's parts still don't fit, so a
  longer word or a narrower face wraps there rather than spilling out.
* **The conversation, the suggestions and the field take the extra width.** Bubbles keep their
  steps from the panel's edges, so a line of an answer holds a few more words.
* **The height stays 483px**, less what the window lacks, as DDR-102 decides.
* **Below the wide breakpoint nothing changes**: the panel takes the whole window, with the status
  under the heading and "Clear chat" at that line's right.

## Alternatives Considered

### Keep 360px and shorten the words

Pros:
* The design's width stands.

Cons:
* "Starting up" and "Clear chat" are the owner's approved words (DDR-102). Shorter words are a
  content decision, and the owner asked for a wider chat, not new words.

### Keep 360px and move "Clear chat" out of the header

Pros:
* The design's width stands, and the header stays as drawn at rest.

Cons:
* The owner declined "Clear chat" below the field (DDR-102). Moving it again redesigns the chat's
  controls to solve a width problem.

### The least that fits, about 23rem (368px)

Pros:
* The smallest departure from the design.

Cons:
* It leaves under 5px to spare in "Starting up", so a fallback face, a rounding difference or a
  later word wraps again.
* The owner asked for a larger window, not the least that fits.

### 24rem (384px)

Pros:
* About 18px to spare.

Cons:
* Less room for the answers, which the owner also wanted.

## Consequences

Benefits:
* The header stays 63px tall in every state, so the conversation keeps its height as the service
  warms up or fails.
* Answers take fewer lines.

Tradeoffs:
* **The chat departs from the design's width**, the owner's choice on #328. Epic #70 lets the design
  prevail, and the owner may also choose against it.
* **It covers 40px more of the page** beside it, which stays in use while the panel is open.

Risks:
* **A longer status or a translated "Clear chat"** may still not fit. The header then takes
  DDR-102's second line, so nothing spills out.

## Related Documents

* #328 (this decision and its build), Epic #320
* DDR-102: the panel's width and the header's second line, which this amends
* DDR-100: the chat. DDR-103: a streaming answer, unchanged
* Epic #70: the owner's decision that the design prevails
