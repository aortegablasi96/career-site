# DDR-103-A Streaming Answer

Status: Accepted

Date: 2026-10-04

**Amends DDR-100's "Sending" and "Answered" states, its scrolling when an answer arrives, and what a
screen reader hears.** An answer now replaces "Writing an answer…" with its first words and grows in
place. An answer cut off partway keeps what arrived, with a notice below it. Everything else
DDR-100, DDR-101 and DDR-102 decide stands, including how every message and notice looks.

## Context

Epic #315 shows the Digital Twin's answer as it's written. ADR-030 (#316) has the chat read the
answer from `POST /chat/stream` as it arrives, and adds a state, *cut off*, for an answer that stops
partway. The first words come about 4 seconds after the question, and a long answer takes up to 6
more seconds to finish.

DDR-100 designed the chat for answers that arrive whole. "Writing an answer…" stands in the answer's
place until the whole answer replaces it. The conversation then scrolls once, and a polite live
region reads the answer out once. #317 asks how a growing answer looks, how the conversation
scrolls while it grows, what a screen reader hears, and what the reader sees when it's cut off.

The owner chose on #317:
* nothing marks an answer that's still arriving;
* an answer cut off partway keeps what arrived;
* the cut-off notice's words;
* the conversation following a growing answer to its end, past the panel's foot, which the owner
  asked for after trying the first version. That stopped once the answer's first line reached the
  top.

## Decision

### Until the first words

**As DDR-100 decided:** the reader's question appears at once, with "Writing an answer…" in the
answer's place below it. A question held while the service starts up shows DDR-100's line for it.

### While the answer grows

* **The first words replace "Writing an answer…"** in the same place, as the Digital Twin's turn,
  with its mark and bubble as DDR-102 draws them.
* **The answer grows in place** as it arrives, formatted as DDR-100 formats a whole one. A mark of
  Markdown shows as its characters until its pair arrives, such as a `**` before the bold words are
  complete.
* **Nothing marks that more is coming.** No cursor, dots or line, and nothing animates, as DDR-100
  declined the typing dots. The answer stops growing when it's complete.
* **The send control stays inert until the answer is complete**, as it is while an answer is
  written. The reader can type a follow-up meanwhile.
* **A reply that isn't streamed**, such as the reply to an off-topic question or the contact flow's,
  arrives whole, as before.

### How the conversation scrolls

* **While the answer grows, the conversation follows its end**, so the newest words stay in view as
  the answer runs past the panel's foot, until the answer is complete. It then stays at the answer's
  end. This replaces DDR-100's rule for an answer that grows: DDR-100 put a long answer's first line
  at the top. An answer that arrives whole, such as the reply to an off-topic question, keeps
  DDR-100's rule.
* **It follows at once, never smoothly**, whether or not the reader has asked for less motion. A
  smooth scroll for each piece would never settle. The reader's question still comes into view as
  DDR-100 decided.
* **A reader who scrolls up while the answer grows is left where they are.** The conversation
  doesn't follow the answer, or move when it completes or is cut off.
* **A reader who scrolls back down to the answer's end is followed again**, as the answer grows.
  Otherwise the following starts again with the next question, or with "Try again".

### What a screen reader hears

* **Each answer once, in full, when it's complete**, as DDR-100 decided. The growing answer isn't
  read out piece by piece: the conversation isn't a live region, and the live region speaks only
  once the answer is complete.
* **The cut-off notice once**, but not the part of the answer that arrived. The reader finds it in
  the conversation, just before the notice.
* The reader's own question still isn't announced.

### An answer cut off partway

ADR-030's cut-off state: the answer stops with an error, ends without completing, or goes 20 seconds
without a piece, after some of it has arrived.

* **What arrived stays**, as the Digital Twin's turn, so the reader keeps what they were reading.
* **Below it, the notice**, as the Digital Twin's turn in DDR-102's notice style: "The answer was cut
  off before it was finished." Below its words stand DDR-102's two controls, "Try again" and "Ask it
  on its own page".
* **"Try again" sends the question again, and the new answer takes the partial one's place.** The
  chatbot's memory holds none of the cut-off answer (ADR-030).
* **Sending a new question instead keeps the partial answer** in the conversation, before the new
  question.
* **The status says "Unavailable"**, as after any failure.
* **An answer that fails before any of it has arrived** shows DDR-100's unavailable notice, as
  before.

### Clearing while an answer grows

As DDR-100 decided: clearing empties the conversation, and the rest of the answer is dropped.

### The words

The owner approved this on #317. It's the only new word.

| Where | Words |
| ----- | ----- |
| The cut-off notice | "The answer was cut off before it was finished." |

### New values

None. The growing answer and the cut-off notice use the bubbles, inks and controls DDR-102 draws.

## Alternatives Considered

### A static mark at the end of a growing answer

A faint "…" that goes once the answer is complete.

Pros:
* The reader can tell an answer that's still arriving from one that's complete.

Cons:
* Answers finish in a few seconds, and the send control already becomes usable when they do.
* One more element to place within formatted text, such as at the end of a list.

Declined by the owner.

### "Writing an answer…" below the growing answer

Pros:
* The same words say the same thing until the answer is complete.

Cons:
* The line jumps down with every piece, below text that's already being written.

Declined by the owner.

### Dropping what arrived when an answer is cut off

The partial answer goes, and DDR-100's unavailable notice takes its place.

Pros:
* No new words and no new state: a cut-off answer looks as any failure does.

Cons:
* The reader loses the words they were reading.

Declined by the owner.

### Following the answer only until its first line reaches the top

DDR-100's rule kept at every moment: the conversation follows the answer's end while it fits, then
holds its first line at the top, and the reader scrolls on.

Pros:
* A long answer is read from its start, as DDR-100 shows a whole one.

Cons:
* The newest words run out of sight below the panel's foot while the answer is still arriving.

This was the first version. The owner asked for the conversation to follow the answer to its end
instead.

### Following the growing answer smoothly

Pros:
* The scroll animates, as DDR-100's does when an answer arrives.

Cons:
* A smooth scroll per piece restarts tens of times a second, and never settles while the answer
  grows.

Rejected.

### Reading the growing answer out as it arrives

Pros:
* A screen reader hears the answer begin as soon as a sighted reader sees it.

Cons:
* A live region reads each change, so the reader hears fragments, repeats or interruptions,
  depending on the screen reader. #317 rules it out.

Rejected.

## Consequences

Benefits:
* A reader starts reading an answer about 4 seconds after asking.
* A screen reader hears each answer once, as before.
* The newest words stay in view while the answer arrives.
* A reader who scrolls up to read isn't pulled down.
* A cut-off answer keeps what arrived, and "Try again" replaces it.

Tradeoffs:
* **A reader can't tell a complete answer from one still arriving**, except that it stops growing
  and the send control becomes usable.
* **A Markdown mark can show briefly** as its characters, until its pair arrives.
* **A screen reader user waits for the whole answer**, as before streaming.
* **A long answer ends with its last lines in view, not its first**, so the reader scrolls up to
  read it from the start.

Risks:
* **A reader who scrolled away during an answer doesn't see its cut-off notice** until they scroll
  down. The status says "Unavailable", and the live region says the notice.

## Related Documents

* #317, which this decision resolves, under Epic #315. #318 builds it.
* ADR-030: how the chat reads the stream, its limits and the cut-off state
* DDR-100: the chat's states, scrolling and live region, which this amends
* DDR-101: the welcome without the note. DDR-102: the look of every message and notice, unchanged
* DDR-090: reduced motion
