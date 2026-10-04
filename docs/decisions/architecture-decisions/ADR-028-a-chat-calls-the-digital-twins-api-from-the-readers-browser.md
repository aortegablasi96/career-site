# ADR-028-A Chat Calls the Digital Twin's API from the Reader's Browser, by a Fifth Client Component

Status: Accepted

Date: 2026-10-03

**Amends ADR-001's boundaries.** One component, the chat, sends the reader's words to a service
and shows its answers, which no other component does. The site stays a static export. Nothing is
fetched when a page is built or served. The chat calls the API from the reader's browser once
the page has loaded. There is still no application logic layer.

**Amends ADR-007 with the site's fifth Client Component**, `DigitalTwinChat`. The other four are:
* `ContentsBar` (ADR-007);
* `BusinessCaseSlider` (ADR-015);
* `LargerPicture` (ADR-018);
* `ScrollAppear` (ADR-025).

**Amended by DDR-101**: the reader is no longer told, before their first message, where it goes.
See *What the reader is told*.

**Amended by ADR-029**: after 10 minutes without hearing from the API, the chat warms it again the
next time the reader engages, rather than only once per conversation. See *How the chat handles the
API's states*.

**Amended by ADR-030**: the chat sends a question to `POST /chat/stream` and reads the answer as it
arrives. The first piece has 60 seconds and each later piece 20, where a whole answer had 60. An
answer cut off partway keeps what arrived. See *How the chat handles the API's states* and *How a
reply is shown*.

## Context

Epic #304 lets a reader talk to the owner's Digital Twin on the site itself, rather than through
the link #286 added to the chatbot's own page. #305 asks how the site's pages talk to the chatbot's
API. Where the chat sits, what it says and how it looks belong to #306.

The API is a FastAPI service in `aortegablasi96/career_conversation_chatbot` (`backend/`), on
Render's free plan at `https://career-conversation-chatbot.onrender.com`. It was read on 2026-10-03:

* **`POST /warmup`** builds the engine once and answers `{"status": "ready"}`. A free instance
  sleeps when it's idle. Render documents waking it as taking up to about a minute, and the engine
  is built after that.
* **`POST /chat`** takes `{ user_id, message }`, with `message` up to 2,000 characters, and answers
  `{ user_id, reply }`.
  * Until the engine is built, it answers 503 with `Retry-After: 10`.
  * Above 20 requests a minute for one `user_id`, it answers 429.
  * It keeps the last eight messages of each `user_id` for an hour of inactivity, for at most 500
    conversations at a time.
* **`reply` is Markdown.** The chatbot's own frontend renders it with `react-markdown` and
  `remark-gfm`. The model writes lists and bold text there.
* **The API has no secret.** Its keys stay on Render, and the caller chooses its own `user_id`.
* **CORS** allows `http://localhost:3000`, the chatbot's two addresses and, since 2026-10-03,
  `https://andreuortegablasi.com`. A preflight from that origin succeeds. One from a preview of this
  site is refused.
* **The answer travels beyond Render.** The chatbot answers with OpenAI's models
  (`gpt-4o-mini`, and its embeddings), reranks with Cohere, and records traces with the OpenAI
  Agents SDK. When a reader asks to be contacted, or asks something the knowledge base can't
  answer, it sends a push notification to the owner through Pushover. A contact request carries
  the reader's name, email and notes.

The site's previews, per ADR-023, sit behind Vercel's login, at
`career-site-<id>-andreus-projects-f43ec5ad.vercel.app` and
`career-site-git-<branch>-andreus-projects-f43ec5ad.vercel.app`.

## Decision

### The site calls the API directly, from the reader's browser

**A Client Component, `components/digital-twin-chat.tsx`, holds the conversation and calls the
API with `fetch`.** It is the only component that calls a service, and ADR-001's rule that
"components do not fetch" holds for every other component.

* **The reason this record admits the component:** the reader's question exists only in the
  browser, after the page has been served, and so does the answer. No Server Component can hold a
  conversation in a static export.
* **No library.** The calls are two `fetch` requests. The states are plain React state.
* **No server of the site's own.** No Vercel Function, proxy or API route. See *Alternatives*.
* **The rules live in the component's module, as pure functions.** They cover which state
  follows which response, and when to retry. This follows `ScrollAppear`'s `next()` and is not a
  service layer.
* **Its words come from `content/`**, per ADR-001 and ADR-002, and the Content Strategist sets
  them on #306. Where it is placed, and so which route loads its code, is #306's decision. Next.js
  loads a Client Component's code only on the routes that hold it.

### What renders without script

**The static HTML is the chat at rest, with a link to the chatbot's own page.** That link takes the
address from the Digital Twin's record in `content/projects.ts`, so the address is written once.

* **Without script:** a `@media (scripting: none)` rule hides the chat's controls, as ADR-007's
  first rule did. The reader keeps the invitation and the link.
* **With script, before the component has hydrated:** nothing sends a message and nothing reloads
  the page. Until the component has mounted, the send control is disabled. React reads that with
  `useSyncExternalStore` and a server snapshot of `false`, as ADR-007 does.
* **The printed CV:** whether the chat or the invitation prints is #306's decision.

### Which origins call the API

Only the API's CORS policy can allow an origin, so this is a change in the chatbot's repository,
aortegablasi96/career_conversation_chatbot#1.

| Where | Origin | How it's allowed |
| ----- | ------ | ---------------- |
| Production | `https://andreuortegablasi.com` | Listed. Done on 2026-10-03 |
| Previews | `https://career-site-*-andreus-projects-f43ec5ad.vercel.app` | `allow_origin_regex`: `^https://career-site-[a-z0-9-]+-andreus-projects-f43ec5ad\.vercel\.app$` |
| Local development | `http://localhost:3000` | Listed already |

* **The project's own production address isn't allowed.** That's
  `https://career-site-chi.vercel.app`, which the site's canonical links don't name (ADR-024).
* **The site's requests carry no credentials.** It sends `credentials: 'omit'`, so the API's
  `allow_credentials=True` sends the site nothing it would use.
* **An origin the API refuses looks like a network failure** to the component, so it shows the
  unavailable state below, with the link to the chatbot's page. So does a preview until
  chatbot#1 has landed.
* **CORS isn't a defence here.** It decides which web pages may use a reader's browser to call the
  API. A script calls it without a browser. Allowing the previews therefore exposes nothing new.
  The pattern pins the team's suffix so that it doesn't admit every `vercel.app` page.

### Where the address is configured

**In the repository, as a typed value in the chat's content module.** It holds the API's origin
and the 2,000-character limit the API accepts. It isn't an environment variable.

* **It's the same everywhere.** There is one API, and production, previews and local development
  all call it.
* **It's public already.** The chatbot's frontend sends it to every reader, and it is in that
  repository's README.
* **The repository records it.** A pull request reviews a change to it, as ADR-023 preferred the
  build command in `vercel.json` to a dashboard setting. `site.url` (ADR-024) is the precedent for
  an address in `content/`.
* **No secret reaches the browser.** The API needs none from its caller. If it ever does, the
  browser can't hold one. That would need a server of the site's own, which is a new ADR.

### How the chat handles the API's states

The chat moves between these states, and #306 designs each one:
* at rest;
* warming up;
* ready;
* sending;
* answered;
* rate-limited;
* unavailable.

**It warms the API as soon as a page that holds the chat has loaded,** once the component has
mounted. The owner chose this on #305, so that a sleeping instance has the most time to wake before
the reader asks. It does this once per conversation.
* **Amended by ADR-029**: it warms the API again after 10 minutes without hearing from it, the next
  time the question field takes focus or a question is sent, since Render's free plan sleeps after
  15 idle minutes.
* Every visit to such a page wakes the service, including visits from readers who never use the
  chat, and from crawlers that run script. That's accepted. Render's free plan gives a workspace
  750 instance hours a month, and one service awake all month uses about 744. The hours are shared
  with any other free service in the owner's Render workspace.
* So the chat can be warming up before the reader has done anything. #306 designs how that state
  looks while the chat is at rest.
* Without script, nothing is called.

**Warming up** sends `POST /warmup`. A sleeping instance holds the request open while it starts.
* If the request fails, the chat tries again. It waits 3 seconds, then twice as long each time,
  as the chatbot's own frontend does.
* A `/chat` that answers 503 also counts as warming up. The chat waits the `Retry-After` seconds,
  then sends the question again.
* **Warming gives up two minutes after its first request.** The chat is then unavailable.

**A question sent while the API is warming up is kept and sent when it's ready**, so the reader
never sends it twice. It counts as sent, and the reader sees it.

**One question at a time.** The send control is inert while an answer is pending. The API keeps
each conversation's memory as one list, and parallel requests would interleave it.

**A question too long to send can't be sent.** The field doesn't accept more than 2,000
characters, and an empty or blank question isn't sent. HTML's `maxlength` counts UTF-16 units,
which never undercounts the API's characters.

**When `/chat` answers, or fails:** (amended by ADR-030, which sends the question to
`/chat/stream`, gives the first piece 60 seconds and each later piece 20, and adds the cut-off state)

| Response | State | What happens next |
| -------- | ----- | ----------------- |
| 200 with a `reply` string | answered | The reader can ask a follow-up |
| 503 | warming up | Retried as above |
| 429 | rate-limited | No automatic retry. The reader can send again once the minute has passed |
| No answer within 60 seconds | unavailable | The request is aborted. It isn't retried automatically: the API may have answered it into the conversation's memory, so a retry could repeat it |
| A network failure, a refused origin, any other status, or a body without `reply` | unavailable | The reader can try again |

The reader's question stays available to send again in the last two cases, and the
unavailable state links to the chatbot's own page.

### How a reply is shown

**Amended by ADR-030**: a reply that's still arriving is shown the same way, read again as each
piece arrives.

**As text, never as HTML.** The reply is the model's output, so it can carry anything a reader
typed. Nothing reaches `dangerouslySetInnerHTML`.

**A pure function turns the Markdown the chatbot writes into React elements.** It handles:
* paragraphs and line breaks;
* one level of bulleted and numbered lists;
* bold and italic text, and inline code;
* links whose address starts with `https://` or `http://`.

Anything else stays as its text.
* A heading in a reply becomes a bold paragraph, not a heading element, so a reply can't
  break the page's heading structure.
* No Markdown library. The chatbot's frontend uses one. Here a small, tested function covers what
  the chatbot writes, and adds no dependency (ADR-001).

### How a conversation is identified

**By a random id, `crypto.randomUUID()`, created when the conversation starts.** It is sent as
`user_id`.
* **The id lives only in the component's memory.** There is no storage and no cookie, so the site
  still stores nothing in the reader's browser.
* **A conversation ends when the component unmounts.** That happens when the reader reloads, leaves
  the page, or moves to a route that doesn't hold the chat. The epic leaves keeping a conversation
  out.
* **On the API's side** it lasts an hour of inactivity, and the API remembers eight messages.

### Exposure to abuse

**The current rate limit is accepted, and the chatbot's repository adds none for this epic.**
* **The site adds no exposure.** The API is public already: the chatbot's frontend gives its
  address to every reader, and a script can call it with any `user_id` it chooses. Placing the
  chat on the site changes neither fact. It brings readers, and 20 requests a minute for each
  conversation is more than any reader sends.
* **No browser-side measure helps.** A key or token in the site's code is public too. A challenge,
  such as a CAPTCHA, needs a server to verify it, and puts a hurdle in front of every reader.
* **The worst case is cost, and a spend limit bounds it.** It's set on the owner's OpenAI and
  Cohere accounts, in their dashboards. It is recommended, not required. A spend limit stops the
  chatbot everywhere once reached, including on its own page and in Telegram, so its level is the
  owner's choice.
* **This is reviewed again if abuse appears.** The chatbot's repository would then add a limit
  that doesn't take the caller's word. That could be a limit per client address, from the address
  Render's proxy records, not the leftmost `X-Forwarded-For` value, which the client controls.
  That limit would be a decision of the chatbot's own.

### What the reader is told

**Before sending their first message, the reader is told where it goes.** The facts are:
* It leaves this site for the Digital Twin's service.
* It is answered by AI models from other companies.
* A request to be contacted, or a question the Digital Twin can't answer, reaches the owner.

The Content Strategist words it on #306 from the facts in *Context*, and the owner approves it.

**Amended by DDR-101 on 2026-10-03**: at the owner's request the chat no longer tells the reader
this. The facts above still hold.

### Testing without the live API

**No test calls the API.**
* The component's tests replace `fetch` with Vitest's stubs, and use fake timers for the retries
  and the time limits.
* **The rules are pure functions, tested in Node**, as `ScrollAppear`'s and `ContentsBar`'s are.
  These are the state transitions, the retry schedule and the Markdown function.
* **Each state's markup is rendered with `react-dom/server`** from a given state, as the site's
  other components are. No DOM test environment is added.
* **The live API is checked by hand, on the preview of the story that builds the chat (#307).**
  That needs chatbot#1's preview origins first. It covers a cold start, an answer, a follow-up, and
  the chatbot's page reached from the unavailable state.

## Alternatives Considered

### A server of the site's own between the reader and the API

A Vercel Function, or a Next.js route handler, that takes the reader's question and calls the API
from the server.

Pros:
* The API's address and any future key stay off the browser.
* No CORS change, since the call would be same-origin.
* A limit per reader's address could live there.

Cons:
* The site stops being a static export, which ADR-001 and ADR-023 rest on. It gains a runtime to
  run, watch and pay for, and a second cold start in front of Render's.
* The address isn't secret and there is no key, so it hides nothing.
* The proxy is public too, so it would need the same abuse defences the API lacks.

Rejected.

### The chatbot's own frontend, in an `iframe`

Pros:
* No Client Component, no CORS change and no new code on the site.

Cons:
* The chat keeps the chatbot's design: a black full-screen app, a loader and its own avatars. The
  epic wants the site's.
* It loads a second Next.js application, with Tailwind, Framer Motion and a Markdown library, into
  the page.
* Its keyboard, focus and screen reader behaviour are the frame's, outside what this site's tests
  and decisions hold. Its `sessionStorage` keeps the conversation across reloads, which the epic
  leaves out.

Rejected.

### The API's address in an environment variable

`NEXT_PUBLIC_…`, set in Vercel's dashboard, as the chatbot's frontend does.

Pros:
* A preview could point at another API.

Cons:
* There is no other API.
* The value would be set in a dashboard no pull request reviews, and would have to be set again
  for local development and CI.
* The build writes a `NEXT_PUBLIC_` variable into the browser's code anyway, so it would be
  just as public.

Rejected.

### A Markdown library, such as `react-markdown`

Pros:
* It handles all of Markdown, and safely by default.

Cons:
* A dependency of tens of kilobytes, for what a small tested function does for the subset the
  chatbot writes.
* It renders headings as heading elements unless it's configured not to.

Rejected. The decision is revisited if the chatbot starts writing tables or nested lists.

### Showing the reply as plain text

Pros:
* No function at all.

Cons:
* The reader sees the Markdown's asterisks and hashes, and lists run together.

Rejected.

### Keeping the conversation in `sessionStorage`, as the chatbot's frontend does

Pros:
* A reload continues the conversation.

Cons:
* The epic leaves this out. It would also be the first thing the site stores in a reader's
  browser.

Rejected for this epic.

### Warming the API only when the reader first engages

The chat warms the API the first time the reader opens it or focuses its field.

Pros:
* A reader who never uses the chat doesn't wake the service, and neither does a crawler.

Cons:
* The reader waits the whole cold start, up to a minute or more, at the moment they've decided to
  ask. That is when waiting costs the most.

Rejected by the owner on #305. The chat warms the API as the page loads.

## Consequences

Positive:
* A reader can talk to the Digital Twin in the site's own design, and the site stays a static
  export on the same host, with no server of its own.
* No new dependency. The rules and the reply's formatting are pure functions, tested in Node like
  the site's other Client Components.
* The chat fails into the existing link to the chatbot's page, and without script it is that link.
* The site still stores nothing in a reader's browser.

Negative:
* **The site depends on a service it doesn't host.** When Render's instance is asleep, the first
  answer waits for it. When the API is down, the chat is unavailable, and changes to the API's
  contract break it. The chatbot's repository owns those, so its README should name this site
  as a caller.
* **A reader's words leave the site** for Render, OpenAI, Cohere and, sometimes, the owner's phone.
  The chat said so before the first message until DDR-101 removed the note.
* **A fifth Client Component, with more logic than the other four.** It loads only on the routes
  where the chat is placed.
* **A timed-out question may still be answered into the API's memory**, so the next answer can
  refer to it.
* **The API's memory holds 500 conversations.** Beyond that, the oldest conversation silently loses
  its memory, and its next answer lacks context.
* **A preview can't run the chat until chatbot#1 adds the preview pattern.** The pattern names
  the Vercel team's suffix, so it changes if the project moves to another team.
* **Any Content-Security-Policy the site adds later must allow the API's origin in
  `connect-src`.** The site sends no such header today.

## Related Documents

* #305, which this decision resolves, under Epic #304
* aortegablasi96/career_conversation_chatbot#1: the origins this record sets
* #306: the chat's placement, words and design, for the states this record names
* #307: the chat, built
* #286 and DDR-096: the invitation and the link to the chatbot's page
* ADR-001: static export and the boundaries this record amends
* ADR-007, ADR-015, ADR-018 and ADR-025: the other four Client Components
* ADR-023: previews behind Vercel's login. ADR-024: `site.url`
