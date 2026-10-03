# DDR-101-The Chat No Longer Says Where Messages Go

Status: Accepted

Date: 2026-10-03

**Amends DDR-100**: the note on where messages go is removed from the chat. **Amends ADR-028's
"What the reader is told"**: the reader is no longer told, before their first message, where it
goes. Everything else those records decide stands.

## Context

DDR-100 ended the chat's welcome with a note on where the reader's messages go, which ADR-028 asked
for: "Your messages leave this site for the Digital Twin's service, where AI models from OpenAI and
Cohere are used to answer them. If you ask to be contacted, or ask something it can't answer,
Andreu is notified." The chat went live with #307 (PR #312).

The owner asked for the note to be taken away. The options put to them were removing it, shortening
it to a line, or moving it below the field. They chose to remove it.

## Decision

**The chat opens with the welcome and, until the first question is sent, the suggestions. Nothing
follows them.** The note's words leave `content/chat.ts`, and its rule leaves the chat's stylesheet.

* Clearing the chat returns it to the welcome and the suggestions, as at rest.
* Nothing else in the chat changes. The facts the note gave stay true and are recorded in ADR-028:
  a reader's words leave the site for Render, OpenAI and Cohere, and some reach the owner.

## Alternatives Considered

### A one-line note

"Answered by AI. Your messages are sent to OpenAI and Cohere."

Pros:
* The reader is still told where their words go, in fewer words.

Cons:
* It keeps a line the owner wants gone.

Declined by the owner.

### The note below the field

The same words in small print at the panel's foot.

Pros:
* The reader still meets it before sending, and the conversation opens with the welcome alone.

Cons:
* The panel keeps the note, which is what the owner wants removed.

Declined by the owner.

## Consequences

Benefits:
* The chat opens shorter, with the Digital Twin's own welcome and the suggestions alone.
* The note no longer needs to follow the chatbot's providers.

Tradeoffs:
* **A reader isn't told that their words leave the site**, that AI models from OpenAI and Cohere
  answer them, or that a contact request or an unanswered question reaches the owner. The site has
  no other page that says so.

Risks:
* **Data protection rules**, such as the GDPR and Switzerland's FADP, generally expect people to be
  told when their data goes to third parties. The owner accepts this. If the site gains a privacy
  page, or the chat starts holding readers' details, this is reconsidered.

## Related Documents

* DDR-100: the chat, whose note this removes
* ADR-028: "What the reader is told", which this amends
* #307 and PR #312: the chat, built
