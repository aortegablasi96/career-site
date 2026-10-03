# DDR-100-A Chat with the Digital Twin on Every Page

Status: Accepted

Date: 2026-10-03

**Amends DDR-096**: with script, the invitation's link on the Digital Twin's view opens the chat.
It no longer opens the chatbot's own page. Without script it is the link DDR-096 decided. **Amends
DDR-028 at the page's end, on screen only**: the footer leaves room below its line for the chat's
launcher. Paper keeps the padding it set. Everything else those records decide stands.

**Amended by DDR-101**: the note on where messages go is removed. The chat opens with the welcome
and the suggestions alone.

**Amended by DDR-102**: the launcher, the panel, its header, the messages, the suggestions, the
field and the words take the look the owner drew in `career-site-design`. On a wide window the
launcher stays in view as the panel's close control. Where the chat sits, its states, clearing,
the length limit and what a screen reader hears stand.

**Revised on 2026-10-03 by #307, which built it.**
* As first accepted, this record put the room for the launcher in the last section's padding,
  amending DDR-040 and DDR-046. On every page the footer comes after the last section, so the room
  is the footer's, and the record amends DDR-028 instead.
* The panel's height and the field's five lines were measured with two more tokens, listed under
  *New values*.
* A reply's numbered list keeps its numbering when the chatbot spaces its items with blank lines
  or writes points under them. Those points join their item as new lines (ADR-028's one level).
* The owner asked for two changes while reviewing it:
  * **The panel at the corner keeps one height**, rather than growing with the conversation. It
    stops short of the contents bar, which stands above it, where it had reached up under the bar
    on a short window.
  * **A control clears the chat**, under *The panel* and in *The words, and each state*.

## Context

Epic #304 lets a reader talk to the owner's Digital Twin on the site itself. ADR-028 (#305)
decided how: a fifth Client Component, `DigitalTwinChat`, calls the chatbot's API from the
reader's browser. That record also names the states the chat moves through. #306 asks where the chat
sits, what it says and how it looks in each state. It is a new interaction pattern, so it needs
the UI Designer, and the Content Strategist owns its words.

The owner chose every page, with a widget "like the one in NumisBook". That is the owner's
collection app, `aortegablasi96/numisbook`, whose assistant is a round chat button fixed at the
window's bottom-right corner. It opens a panel above itself, with a header, a welcome message with
suggested questions, the conversation and a field. On a phone the panel becomes a sheet. The owner
also chose four things:
* the invitation on the Digital Twin's view opens the widget;
* the chat suggests the four questions from the bot's own welcome in Telegram;
* the launcher shows its words from the wide breakpoint;
* on a phone the open chat takes the whole window.

The Content Brief and the UI Review on #306 hold the reasoning. The owner approved the copy below
on #306.

## Decision

**A launcher at the window's bottom-right corner, on every page of the site, opens a chat panel
with the Digital Twin.** It is the site's one floating control, and the chat is the site's one
conversation.

### Where it is

* **Every route**: the career page, every project's and role's view, and the page for a missing
  address. It stands in the site's layout, so the conversation carries over as the reader moves
  between the site's pages. It ends when the page is reloaded or left, per ADR-028.
* **On screen only.** Neither the launcher nor the panel prints, so the printed CV (DDR-015) is
  unchanged.
* **The page's end leaves room for the launcher.** On screen, the footer pads its foot by the
  launcher's size and the widest of its insets, beyond the step DDR-028 set. The launcher then
  never covers the page's last line once the reader has scrolled to the end.

### The launcher

* **Filled in the accent, as a view's first link is** (DDR-050): `--color-accent` with
  `--color-on-accent`, deepening to `--color-accent-hover` under the pointer and on focus. It
  carries a speech-bubble mark, a new mark drawn as the site's other marks are. Its shadow is
  `--shadow-card-hover`.
* **Below the wide breakpoint it is a circle**, `--chat-launcher-size` (3.25rem, 52px, NumisBook's
  size), with the mark alone, inset `--space-medium` from the window's edges.
* **From the wide breakpoint it is a pill**, the mark and "Ask my AI Digital Twin", the height
  of the circle, inset `--space-large`.
* **Its accessible name at every width is "Ask my AI Digital Twin".** It says the panel is
  expanded or collapsed.
* **It shows nothing while the API warms up.** The reader has asked nothing yet, and the panel says
  how the service is when it opens.
* **It is hidden while the panel is open.** The panel's own close control takes its place.
* **Without script it is a link to the chatbot's own page**, drawn the same, and opens a new tab
  saying so: "Ask my AI Digital Twin, opens in a new tab" (DDR-043). ADR-028's static HTML is that
  link.

### The panel

* **From the wide breakpoint**, the panel stands where the launcher was, at the window's
  bottom-right corner inset `--space-large`. It is `--chat-panel-width` wide (27.5rem) and at
  `--chat-panel-height` tall (40rem), whatever the conversation holds. It is never taller than the
  window less the contents bar and its insets, so it never reaches under the bar.
  * It is not modal: the page behind it can still be read, scrolled and used.
  * Escape closes it while focus is inside it.
* **Below the wide breakpoint it takes the whole window**, over the contents bar.
  * It is modal: the page behind it is inert, so focus can't wander behind it.
  * Escape and the close control close it.
  * At 200% text the wide breakpoint is 1,536px, so most windows show the chat this way.
* **It is a card**: `--color-surface-card`, a 1px `--color-border`, `--radius-large` and
  `--shadow-bar`. In the full window it has no radius, no border and no shadow.
* **It opens with a short fade and a rise** of `--appear-rise` over `--hover-transition`, on
  `--appear-easing`. **Under reduced motion it appears at once.**

The panel holds three parts, top to bottom:

1. **The header.** "My AI Digital Twin" is the panel's heading, an `h2` in Lora at
   `--font-size-large`. Below it is a status line in `--color-text-muted` at
   `--font-size-x-small`, which tells how the service is:
   * "Starting up, which can take a minute" while the API warms up;
   * "Ready" once it has answered `/warmup` or a question;
   * "Can't answer right now" once warming has given up or the last question failed.

   At the header's right is the close control: the cross the site already draws, named "Close the
   chat". Once the conversation has a message, "Clear chat" stands before the cross, a word at
   `--font-size-x-small` in the cross's ink, lit as it is. Where the heading and the two controls
   don't fit on one line, the controls take a line of their own, still at the right. The header is separated from the conversation by a hairline in `--color-border`.
2. **The conversation**, a region named "Conversation" that scrolls inside the panel.
   * It can take focus, so a keyboard can scroll it.
   * It is a list of messages, and each one starts with its sender, said only to assistive
     technology: "You:" or "Digital Twin:".
3. **The field and the send control**, at the panel's foot, above a hairline.
   * A text area named "Your question", with the placeholder "Ask about Andreu…". It grows to five
     lines, then scrolls.
   * Enter sends, and Shift+Enter starts a new line.
   * The send control is a circle in the accent, with a paper-plane mark (new) named "Send". It
     is as tall as one line of the field.
   * Opening the panel moves focus into the field. Closing it returns focus to the control that
     opened it, either the launcher or the invitation.

### The messages

* **The Digital Twin's messages stand at the left**, on `--color-surface`, and stop `--space-large`
  short of the right edge.
* **The reader's stand at the right**, on `--color-surface-tag`, and start `--space-large` in from
  the left.
* **Both use** `--color-text`, the body face at `--font-size-small` on the prose leading,
  `--radius-large` corners, `--space-small` by `--space-medium` padding, and `--space-small`
  between messages.
* **A reply's formatting is ADR-028's.** Its paragraphs, lists, bold and code show as such. A
  heading shows as a bold paragraph. A link is an ordinary underlined link in DDR-096's colours,
  and opens a new tab saying so (DDR-043).
* **The reader's words show exactly as typed.**
* **When an answer arrives**, the conversation scrolls so that the answer's first line is at the
  top of what it shows, or the answer's end if it fits. It scrolls smoothly, or at once under
  reduced motion.

### The words, and each state

Every word below is content, written once in `content/` (ADR-001, ADR-002). The owner approved
them on #306.

| State (ADR-028) | What the panel shows |
| --------------- | -------------------- |
| At rest (no message yet) | The welcome, as the Digital Twin's first message, which is never sent to the API: "Hi! I'm Andreu's AI Digital Twin. I can answer questions about his professional background, experience, projects, skills and education, in the language you ask in." Then "Try asking", in the label style, above four suggestions in outlined pills: "Can you summarise Andreu's profile?", "What projects has he worked on?", "What are his strongest skills?", "What kind of roles fit his experience?" Choosing one sends it. (DDR-101 removed the note on where messages go that followed them.) |
| Warming up | The status line says "Starting up, which can take a minute". The reader can type and send meanwhile. |
| Sending while warming up | The reader's question appears at once. In the answer's place, as the Digital Twin's message, in `--color-text-secondary`: "Starting up. This can take up to a minute; your question will be answered as soon as it's ready." |
| Sending | The reader's question appears at once, and below it, in the same ink: "Writing an answer…". Nothing animates. The send control is inert until the answer arrives. |
| Answered | The answer replaces the line above. The field is empty, and focus stays there for a follow-up. |
| Rate-limited | In the answer's place: "You've sent a lot of questions in a short time. Wait a minute, then send yours again." The question goes back into the field. |
| Cleared | "Clear chat" empties the conversation: the welcome and the suggestions again, as at rest. It drops any question on its way or kept after a notice, and an answer that arrives for it isn't shown. The next question starts a new conversation with a new id, so the API keeps nothing of the old one. Focus moves to the field, the status line stays as it was, and nothing asks to confirm. |
| Unavailable | In the answer's place: "The Digital Twin can't answer right now." Below it are two pills: "Try again", filled, and "Ask it on its own page", outlined, which opens the chatbot's page in a new tab and says so. "Try again" sends the kept question again, or starts warming again if there is none. The status line says "Can't answer right now". |

* **Removed by DDR-101.** The note on where messages go was the last part of the welcome. The reader meets it before the
  field, and it stays at the top of the conversation: "Your messages leave this site for the
  Digital Twin's service, where AI models from OpenAI and Cohere are used to answer them. If you
  ask to be contacted, or ask something it can't answer, Andreu is notified." It is set in
  `--color-text-muted` at `--font-size-x-small`, outside any message.
* **The suggestions go once the first question is sent.** They are pills, outlined as a view's
  second link is (DDR-050), at `--font-size-x-small`, and they wrap.
* **The length limit.** The field accepts 2,000 characters.
  * From 1,800, a count shows below the field, in `--color-text-muted`: "1,850 / 2,000".
  * At 2,000, the count is followed by "Questions can be up to 2,000 characters."
  * An empty or blank question isn't sent, and the send control is inert.

### What a screen reader hears

**A visually hidden polite live region announces each of these once:**
* each new answer, in full;
* the line shown while a question waits for the service to start;
* the rate-limited notice;
* the unavailable notice;
* reaching the length limit;
* clearing the chat: "The chat is cleared."

The status line and the conversation aren't live regions themselves, so nothing is announced
twice. The reader's own question isn't announced.

### On the Digital Twin's view (amends DDR-096)

**With script, the words "Ask my AI Digital Twin" in the invitation open the chat.** They look as
DDR-096 draws them, but they are a control that opens the panel, not a link that leaves the site.
* They don't say they open a new tab.
* They return focus to themselves when the panel closes.
* **Without script they are DDR-096's link**, to the chatbot's own page in a new tab.

"Source code", "Live site" and "Telegram" stay as they are.

### New values

These tokens are new in `app/tokens.css`:
* `--chat-launcher-size`, 3.25rem;
* `--chat-panel-width`, 27.5rem;
* `--chat-panel-height`, 40rem, and never more than the window less the contents bar and its
  insets;
* `--chat-field-height`, the field's five lines and its padding;
* `--footer-padding-block-end`, the footer's foot, which is DDR-028's step on paper.

The two marks, a speech bubble and a paper plane, join `components/icon.tsx`. A sender's name and the
live region are hidden from sight by one rule, the only one in a component stylesheet that writes a
pixel, held to that by `components/stylesheets.test.ts`. Every other value is a token the site
already has.

## Alternatives Considered

### The Digital Twin's view only

A panel in that view's flow, below its two columns. The chat's code and the warm-up would load
on that route alone, and nothing would float over the page. Declined by the owner, who wants the
chat available everywhere.

### The main page too, in the introduction

Every reader of the CV page would meet it, but it would change the introduction (DDR-044, DDR-072,
DDR-076) and the printed CV would need a decision. Superseded by the widget, which covers every
page without touching either.

### A round launcher at every width, as NumisBook's

It covers the least content, but a first-time reader on a wide window sees only a mark. The owner
chose the pill with words from the wide breakpoint.

### A bottom sheet on a phone, as NumisBook's

It rises to about 72% of the window and leaves the page's top in view. Declined: with the on-screen
keyboard up, or at 200% text, little room is left for the conversation, and focus could reach the
page behind. The full window is modal instead.

### Keeping the invitation's link to the chatbot's page, or removing the line

Keeping it would offer two ways to ask on one view. Removing it would lose the owner's invitation
in the view's own words. The owner chose for the link to open the chat.

### Animated typing dots

NumisBook shows three bouncing dots while it waits. Declined: "Writing an answer…" says the same in
words, and needs no motion to respect reduced motion.

## Consequences

Benefits:
* A reader can ask the Digital Twin about the owner's career from any page, in the site's design,
  and keep the conversation while moving between pages.
* Each state ADR-028 names has a look and words. The chat fails into the chatbot's own page, and
  without script the launcher is that page's link.
* The printed CV is unchanged.

Tradeoffs:
* **Every visit to any page wakes the chatbot's service**, because ADR-028 warms the API as a page
  that holds the chat loads, and every page holds it. ADR-028 accepts that cost.
* **The chat's code loads on every route.**
* **A floating control covers a corner of the page.** The page's end makes room for it, but while
  the reader scrolls it passes over content at the bottom-right.
* **The conversation scrolls inside the panel**, a nested scroll the site otherwise avoids, except
  in a timeline (DDR-057).

Risks:
* **On a narrow window at 200% text**, the full-window panel holds little conversation above the
  field and the on-screen keyboard. The field's five-line cap and the scrolling conversation keep
  it usable. #307 checks it at 320px. Once there is a message, "Clear chat" and the cross take a
  line of their own there, about 67px more of the window.
* **The launcher must stay below the contents bar's menu** (DDR-075) and the larger picture's dialog
  (DDR-082), which stand above everything while open.
* **The note names OpenAI and Cohere.** If the chatbot changes providers, the note must change with
  it. (The note is gone since DDR-101.)

## Related Documents

* GitHub issue #306, its Content Brief and UI Review, under Epic #304. #307 builds it.
* ADR-028: the chat's states, rules and calls
* DDR-096, which this amends, and DDR-050, DDR-043, DDR-035
* DDR-028: the footer, whose foot this amends on screen
* DDR-101: the note on where messages go, removed
* DDR-015: the printed CV, unchanged. DDR-075 and DDR-082: the layers above the launcher
* DDR-090: reduced motion, as the site's appearing elements respect it
