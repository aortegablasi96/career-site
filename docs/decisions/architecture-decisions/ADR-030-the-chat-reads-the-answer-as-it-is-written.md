# ADR-030-The Chat Reads the Answer as It Is Written

Status: Accepted

Date: 2026-10-04

**Amends ADR-028's "How the chat handles the API's states"** and its *How a reply is shown*. The chat
sends a question to `POST /chat/stream` rather than `POST /chat`, and reads the answer as it
arrives. It no longer gives a whole answer 60 seconds. It gives the first piece 60 seconds and each
later piece 20. The rest of ADR-028 stands, and ADR-029's warming again after a long silence is
unchanged.

## Context

Epic #315 asks for the Digital Twin's answer to appear on the site as it's written. #316 asks
whether that's worth it, and how the chat receives it. ADR-028 has the chat send a question with
`fetch` and wait for one JSON answer, `{ reply }`, for at most 60 seconds.

### Where an answer's time goes

The owner added `POST /chat/stream` to the chatbot's API in
aortegablasi96/career_conversation_chatbot@cfc424e. That made the split measurable. Twelve
questions were timed against the live API on 2026-10-04, from the first byte sent to the first
piece of the answer, and to its end:

| Question | First words | Whole answer | Writing |
| -------- | ----------- | ------------ | ------- |
| "What does Andreu do in his current role?", first after warming | 20.2s | 21.5s | 1.3s |
| "Which certifications does he hold?" (twice) | 3.6s, 4.5s | 4.8s, 6.9s | 1.2s, 2.5s |
| "Tell me about Andreu's experience in product management…" | 4.6s | 10.6s | 6.0s |
| "What projects has he worked on in his portfolio?" | 4.6s | 7.9s | 3.3s |
| "Can you explain his education background in detail?" | 3.7s | 9.8s | 6.1s |
| "Summarise Andreu's professional profile" | 4.0s | 8.0s | 4.1s |
| "What AI and IoT products has he managed?" | 3.6s | 7.6s | 4.0s |
| "Is he open to new opportunities?" | 4.1s | 5.1s | 1.0s |
| "How can I contact him?" | not streamed | 2.4s | — |
| "What's the weather in Paris?" (twice) | not streamed | 1.3s, 1.7s | — |

* **The steps before the conversation agent writes take about 4 seconds** on an awake service:
  the filter agent, the query normalizer, and the hybrid search with Cohere's reranking. Streaming
  can't shorten them.
* **Writing takes 1 to 6 seconds**, in proportion to the answer's length. The longest answers, of
  about 2,000 characters, take 6.
* **So a reader sees the first words about 4 seconds after asking, where today they wait 5 to 11
  seconds for the whole answer.** For the long answers a recruiter's broad questions draw, that's
  about half the wait. The suggestions draw answers of 400 to 1,800 characters.
* **The first question after warming spent 20 seconds before writing**, and streaming saved it 1.3.
  The 20 and 43 seconds timed on 2026-10-03 (Epic #315) were most likely such waits. Making them
  shorter is outside the epic.
* **Replies not written by the conversation agent arrive whole**: the fixed reply to an off-topic
  question, and the contact flow's. They take 1 to 3 seconds already.

**The owner decided to go ahead on 2026-10-04.**

### What the API sends

Read from the chatbot's code at cfc424e, and checked against the live API:

* **`POST /chat/stream`** takes the same body as `/chat`, `{ user_id, message }`, and the same
  checks run first, before anything is streamed:
  * 503 `{"status": "warming_up"}` with `Retry-After: 10` until the engine is built;
  * 429 above 20 requests a minute for one `user_id`;
  * 422 for a message over 2,000 characters.
* **Otherwise it answers 200 with `text/event-stream`**, at once, and then a frame per event. Each
  frame is one `data:` line holding JSON, followed by a blank line:
  * `{"type": "token", "content": "…"}` for each piece the conversation agent writes;
  * `{"type": "done", "content": "…"}` once, at the end, with the whole reply;
  * `{"type": "error"}` instead of `done`, if the answer fails partway.
* **A reply that isn't the conversation agent's** sends `done` alone, with no `token` before it.
* **The conversation's memory takes the turn only as `done` is sent.** An answer that ends in
  `error` leaves the memory as it was. Since the same commit, `/chat` writes its turns to the memory
  too, which it didn't before.
* **`POST /chat` is unchanged** for the chatbot's own frontend and Telegram. The commit moved the
  chatbot's own frontend to the stream as well.
* **The stream reaches the browser piece by piece.** Through Render and Cloudflare, a 2,000-character
  answer arrived in about 300 reads spread over its 6 seconds of writing, not in one read at the end.
  The response carries no compression, `Cache-Control: no-cache` and `X-Accel-Buffering: no`.
* **CORS allows it from the site's origins**: production and, by the pattern ADR-028 set, a
  preview's.

## Decision

### The chat asks `/chat/stream`, and reads the answer as it arrives

**`deliver` sends the question to `POST /chat/stream` with `fetch`, and reads the response's body as
it arrives.**

* **`fetch`, not `EventSource`.** `EventSource` sends only a `GET`, with no body, so the question
  would have to travel in the address.
* **A pure function reads the frames**: it splits what has arrived at the blank lines, keeps a
  frame that hasn't finished for the next piece, and reads each `data:` line's JSON. It skips a
  comment, a line it doesn't know, and JSON it can't read, as a stream reader should. It's tested in
  Node with the chat's other rules. No library, as ADR-028 decided for the Markdown.
* **The pieces that arrive in one read are shown together**, as one change to the answer, so the
  chat redraws once per read rather than once per word.
* **The state gains the answer so far.** It grows with each read and becomes the answer when `done`
  arrives. `done`'s whole reply is what the conversation keeps, so it's the same text `/chat` would
  have returned.

### How the API's answers carry over

| Response | State | What happens next |
| -------- | ----- | ----------------- |
| 200, pieces, then `done` | answered | The answer grows as it arrives, and is complete at `done`. The reader can ask a follow-up |
| 200, `done` alone | answered | As ADR-028's 200: the answer arrives whole |
| 200, then `error`, or the stream ends without `done`, before any piece | unavailable | As ADR-028's failure. The reader can try again |
| 200, then `error`, the stream ends without `done`, or a time-out, after some pieces | cut off | What arrived stays. The reader can try again, or reach the chatbot's own page |
| 503 | warming up | Retried after `Retry-After`, as ADR-028 decided |
| 429 | rate-limited | As ADR-028 decided |
| No first piece within 60 seconds, a network failure, a refused origin, or any other status | unavailable | As ADR-028 decided |

**Cut off** is a new state. DDR-103 designs it.

### Time limits

* **60 seconds before the first piece**, counted from sending, as ADR-028 gave the whole answer.
  The steps before writing take about 4 seconds, and 20 at most once warm. The response's headers
  come at once, so they don't count as the first piece. `done` is the first piece of a reply that
  isn't streamed.
* **20 seconds between pieces.** The pieces of an answer come tens of milliseconds apart, so 20
  seconds without one means it has stalled.
* **No limit on the whole answer.** An answer that keeps arriving keeps being shown.
* **A time-out aborts the request**, so the API stops writing into a conversation the reader has
  left.

### A question is never sent twice into the memory

* **Nothing is retried automatically once the API has answered 200**, as ADR-028 decided for a
  time-out. The reader decides, with "Try again".
* **"Try again" after an `error` frame is safe**: the API wrote nothing into the memory.
* **After a time-out, or a stream that ended without `done` or `error`, it's almost always safe.**
  Aborting the request makes Render cancel the run before the memory takes the turn. Only a stream
  cut between the API sending `done` and the browser receiving it leaves the turn in the memory,
  and then the next answer may refer to it, as ADR-028 accepted for a time-out.
* **A 503 is still retried automatically**, since the API refused the question before running it.
* **"Try again" can notify the owner twice** through Pushover, if the cut-off question was a contact
  request or one the knowledge base couldn't answer, since the API notifies as it runs. That's
  accepted. It needs a stream cut partway, and the owner can tell a repeat.

### Clearing while an answer arrives

**Clearing aborts the request**, so the rest of the answer is dropped and the API stops writing it.
As ADR-028 decided, what arrives for a cleared conversation isn't shown.

### How a partly arrived reply is shown

**As ADR-028 shows a whole one: as text, never as HTML.** The answer so far goes through the same
Markdown function at each read. A mark that hasn't closed yet, such as a `**` before its pair has
arrived, shows as its text until it closes. Nothing reaches `dangerouslySetInnerHTML`.

### Where a stream can't be read

* **A body that arrives at once is read whole.** If a proxy or a browser holds the stream back, the
  frames all arrive in the last read, and the answer appears whole, as it does today. The frame
  reader doesn't need to know.
* **The chat doesn't fall back to `/chat`.** Every browser the site supports reads a response's body
  as a stream. Falling back after a failed stream could send the question into the memory twice.
* **If the API drops `/chat/stream`**, the chat is unavailable, and links to the chatbot's own page,
  as ADR-028 accepts for any change to the API's contract.

### Testing without the live API

As ADR-028 decided: no test calls the API.

* `fetch` is a Vitest stub that answers with a `ReadableStream` the test writes to piece by piece.
  Fake timers cover the two limits.
* The frame reader and the states are pure functions, tested in Node.
* The answer so far, and the cut-off state, are rendered with `react-dom/server`.
* The live stream is checked by hand from `localhost:3000` and on the story's preview (#318).

## Alternatives Considered

### Keep waiting for the whole answer

Pros:
* No change to the site.

Cons:
* A reader waits 5 to 11 seconds with nothing to read, where streaming shows the first words after 4.

Rejected by the owner.

### Fall back to `POST /chat` when the stream fails

Pros:
* A network that can't stream would still get an answer.

Cons:
* A stream that fails partway may have run the whole question already. Asking `/chat` would run it
  again, and could put it in the memory twice.
* No browser the site supports needs it. A buffered stream is still read, whole.

Rejected.

### Retry automatically after an `error` frame

Pros:
* The memory holds nothing of the failed answer, so a retry is safe for the conversation.

Cons:
* The reader watches an answer vanish and start again, unasked.
* It can notify the owner twice, and costs a second run.

Rejected. "Try again" leaves it to the reader.

### A WebSocket, or a stream library such as `eventsource-parser`

Pros:
* A WebSocket carries messages both ways. A library parses every corner of Server-Sent Events.

Cons:
* A WebSocket needs the API to keep a connection open per reader, for answers that only flow one way.
* The API writes one `data:` line per frame. A small tested function reads that, without a
  dependency (ADR-001).

Rejected.

### One limit on the whole answer, as before

Pros:
* One number.

Cons:
* An answer that stalls after its first words would leave the reader staring at them for up to a
  minute. An answer that keeps arriving would be cut off for being long.

Rejected.

## Consequences

Positive:
* A reader sees the first words about 4 seconds after asking, and reads while the rest arrives.
* A failed answer leaves nothing in the conversation's memory, so "Try again" is safe.
* No new dependency, and `POST /chat` is unchanged for the chatbot's frontend and Telegram.

Negative:
* **The chat depends on one more part of the API's contract**: the endpoint, the frames and the rule
  that the memory takes a turn only at `done`. The chatbot's README should document it, and name
  this site as its caller.
* **The first question after warming still waits about 20 seconds** before its first words.
* **The chat redraws an answer at each read**, about 300 times for the longest. Each redraw parses
  at most a few thousand characters.
* **A stream cut between `done` and the browser** leaves a turn in the memory that the reader never
  saw. "Try again" then sends the question a second time.

## Related Documents

* #316, which this decision resolves, under Epic #315
* aortegablasi96/career_conversation_chatbot#3 and @cfc424e: the stream, built
* ADR-028: the chat's calls, states and limits, which this amends. ADR-029: warming again, unchanged
* DDR-103 (#317): how a growing answer, and one cut off, look and are heard
* #318: the chat, streaming
