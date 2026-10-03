# ADR-029-The Chat Warms the API Again After a Long Silence

Status: Accepted

Date: 2026-10-03

**Amends ADR-028's "It does this once per conversation".** The chat still warms the API as soon as
a page that holds it has loaded. After a long silence from the API it also warms it again, the next
time the reader engages with the chat. Everything else ADR-028 decides stands.

## Context

ADR-028 has the chat warm the chatbot's API once, when the page loads, and from then on treat it
as awake. The API runs on Render's free plan. Render's documentation (read on 2026-10-03) says:

* it spins a free web service down after **15 minutes without inbound traffic**;
* the next request spins it back up, which **takes about a minute**;
* it shows connecting browsers a loading page while the service spins up.

A reader can therefore load a page, read for longer than 15 minutes, and then ask a question of a
service that has gone to sleep. #314, found while testing #307, sets out what follows from
ADR-028's rules:

* The chat shows "Writing an answer…" while the service is in fact starting.
* The question goes straight to `/chat`, which ADR-028 gives 60 seconds. A cold start can take
  longer. A request answered by Render's loading page, rather than by the API, fails the API's CORS
  policy.
* Either way the chat is unavailable, and ADR-028 doesn't retry a question automatically. The
  reader has to press "Try again".

Warming already handles all of this. It retries failures for two minutes, and holds a question
until the API is ready. The chat just never warms again after the first time.

## Decision

**The chat notes when it last heard from the API. After 10 minutes without hearing from it, it
treats the service as possibly asleep, and warms it again the next time the reader engages.**

* **Hearing from the API** means any HTTP response to `/warmup` or `/chat`: an answer, a 503 or a
  429. Each shows the instance is awake. A network failure, a refused origin and a time-out don't
  count.
* **10 minutes** leaves a margin under Render's 15. It covers the time between the chat's check
  and the request reaching Render, and any difference in how Render counts. Other visitors can
  only keep the service awake longer, never put it to sleep sooner, so the margin is never too
  small because of them.
* **The reader engages** when:
  * the question field takes focus. Opening the panel focuses it, so opening the chat counts, and so
    does coming back to a panel left open.
  * a question is sent.

  Warming then starts before the reader has typed, so a sleeping service has the most time to wake,
  as ADR-028 wanted for the first warm.
* **Warming again is ADR-028's warming**: `POST /warmup`, the same retries and the same two-minute
  limit. The chat is in the warming-up state while it runs. A question sent meanwhile is held and
  sent once the API is ready, as on a page's first load. It's sent once.
* **While the API has been heard from within 10 minutes, nothing changes.** Follow-ups go straight
  to `/chat` with no added request or wait.
* **Nothing runs on a timer.** The chat doesn't ping the API while the reader is away, and a reader
  who never comes back to the chat doesn't wake the service.

ADR-028's 60-second limit on an answer, and its rule that a timed-out question isn't retried, are
unchanged. A question is sent to `/chat` only once the chat has heard from the API within 10
minutes, so it reaches an awake service.

The rule is a pure function in the chat's module, tested in Node as ADR-028's rules are. Fake
timers stand in for the 10 minutes.

## Alternatives Considered

### Keeping the service awake while a page is open

Send `/warmup` every few minutes while the page is open, so the service never sleeps.

Pros:
* No question ever meets a sleeping service while the page is open.

Cons:
* A tab left open overnight keeps the service awake all night. That spends Render's free
  instance hours, which the owner's other free services share (ADR-028), for readers who have
  gone.
* It sends requests nobody asked for. Warming on load was accepted as the cost of a short wait. This
  would make the cost open-ended.

Rejected.

### Warming again when the tab becomes visible

Warm after a long silence when the reader returns to the tab (`visibilitychange`).

Pros:
* It warms earlier than the field's focus does, if the reader returns to the tab before opening the
  chat.

Cons:
* It wakes the service for every reader who comes back to a tab, including those who never use
  the chat. Focus on the field targets readers about to ask.
* A second trigger to test, for a few seconds' head start.

Rejected. The field's focus is enough.

### Retrying a question automatically after a time-out

Send the question to `/chat` again when the first request runs out of time.

Pros:
* No new rule about when the service last answered.

Cons:
* ADR-028 rejected it: the API may have answered the first request into the conversation's memory,
  so a retry could repeat the question.
* The reader still waits 60 seconds, watching "Writing an answer…", before the retry starts.

Rejected.

### Asking the API whether it's awake before every question

Send `/warmup` before each question.

Pros:
* No timing rule at all.

Cons:
* It adds a request and its round trip to every follow-up, while the service is awake.

Rejected.

## Consequences

Positive:
* A reader who comes back to a page left open gets an answer without pressing "Try again". They
  see the warming-up state while the service starts, as on a first load.
* Follow-ups in an active conversation are unchanged.
* No request is sent while the reader is away.

Negative:
* **A reader who returns after 10 to 15 minutes may see the warming-up state briefly**, while
  `/warmup` answers from a service that was still awake. It answers quickly, and the field's focus
  usually starts it before the reader has finished typing.
* **The chat now depends on Render's idle time.** If the plan, the host, or Render's 15 minutes
  change, the 10 minutes must change with them.
* **The chat holds a time.** It's in the component's memory, like the conversation's id, and
  nothing is stored.

## Related Documents

* #314, which this decision resolves
* ADR-028: the chat's warming, states and time limits, which this amends
* DDR-100: the warming-up state and the held question's line, which the reader sees
* Epic #315 and #316: streaming answers, which amends ADR-028 too
* Render's documentation of free web services, https://render.com/docs/free
