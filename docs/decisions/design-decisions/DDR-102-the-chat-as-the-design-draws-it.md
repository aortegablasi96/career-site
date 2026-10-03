# DDR-102-The Chat as the Design Draws It

Status: Accepted

Date: 2026-10-03

**Amends DDR-100**: the chat's launcher, panel, header, messages, suggestions, field and words take
the look the owner drew in `career-site-design`. Where the chat sits, how it behaves, its states and
what a screen reader hears all stand. **Amends DDR-101** only in its words: the welcome changes, and
still nothing follows it but the suggestions.

## Context

The chat went live with Epic #304 in a design set from the owner's NumisBook widget (DDR-100),
before the owner had drawn it. The owner has since drawn it in the site's Figma file
`career-site-design` (key `RhUMRELzXCfPc0IYa0uHse`). Epic #320 adopts it, and #321 asks how the
chat looks and what it says in every state.

The design draws three nodes, and nothing else in their layers is adopted:
* `career-site-main`, node `Chatbot` 502:627: the launcher, closed;
* `career-site-chatbot`, node `Chatbot` 502:1900: the panel at rest, before any question;
* `career-site-chatbot`, node `Chatbot` 502:1897: the launcher while the panel is open.

They draw a wide window only, and one state only. The design prevails (Epic #70), so this record
takes every value the nodes draw, and designs in their style what they don't draw. A difference
from the drawing is listed under *Differences from the drawing*, with its reason.

The owner chose four things on #321:
* the design's words, with the site's curly apostrophes and without the serial comma;
* "Clear chat" at the header's right once there is a message;
* the full-window chat on a phone, in the new style;
* a 16px field on a phone, so the page doesn't zoom in when the field takes focus.

## Decision

**The chat looks as the three nodes draw it: a violet gradient launcher with a robot mark, a
360px card standing above it, a white header with an avatar, the conversation on a pale violet
surface, stacked suggestions, and a white field with the send control inside it.** Its words are
the design's.

### The launcher

* **Closed, from the wide breakpoint**: a pill `--chat-launcher-size` tall (2.75rem, 44px), with the
  robot mark (`--chat-mark-size`, 18px) and "Ask my AI Digital Twin" in white, DM Sans semibold at
  `--font-size-x-small` (13px). Padding is `--space-medium` at the sides, with `--chat-launcher-gap`
  (10px) between mark and words.
  * Its fill is the gradient from `--color-accent` (#4f46e5) to `--color-accent-violet` (#7c3aed),
    at `--chat-launcher-gradient-angle` (167deg).
  * Its shadow is `--shadow-chat-launcher`.
  * It is inset `--chat-inset` (1.5rem, 24px) from the window's right and bottom edges.
* **Under the pointer and on keyboard focus** the gradient deepens, from `--color-accent-hover`
  (#4338ca) to `--color-accent-violet-deep` (#6d28d9). The design draws no hover; these are its own
  darker stops.
* **Open, from the wide breakpoint**: it stays in view where it was, as a shorter pill
  `--chat-close-inline-size` by `--chat-close-block-size` (48 by 40px) with the site's cross (1rem).
  It closes the panel. Its fill uses the same two stops at `--chat-gradient-angle` (135deg). Its
  accessible name becomes "Close the chat", and it still says the panel is expanded. Escape on it
  closes the panel, as Escape inside the panel does. DDR-100 hid it here.
* **Below the wide breakpoint**: a circle `--chat-launcher-size` across, with the mark alone, inset
  `--space-medium`. It is hidden while the panel is open, because the panel covers the window there.
* **Its accessible name at rest is "Ask my AI Digital Twin" at every width.** Without script it is
  DDR-100's link to the chatbot's own page, drawn the same, and it says that it opens a new tab.

### The panel

* **From the wide breakpoint** it is a card `--chat-panel-width` wide (22.5rem, 360px) and
  `--chat-panel-height` tall (483px). It never grows taller than the window, less the contents bar
  and the launcher below it. Its right edge is the launcher's, and it stands `--space-medium` above
  the open launcher, at `--chat-panel-offset` from the window's foot. It is not modal, as before.
  * Its surface is `--color-chat-surface` (#f8f7ff), with a 1px `--color-chat-edge` (the
    design's violet, #a78bfa, at 35%, drawn opaque as #e0d6fd), `--chat-radius` corners (1rem, 16px) and
    `--shadow-chat-panel`.
* **Below the wide breakpoint** it takes the whole window and is modal, as DDR-100 decided. It is
  drawn on the same surface, with no edge, corners or shadow.
* **It opens with DDR-100's fade and rise**, and at once under reduced motion.

The panel holds three parts, top to bottom.

1. **The header**: white (`--color-surface-card`), above a 1px `--color-chat-hairline` (the
   violet at 20%, drawn opaque as #ede8fe). It has `--chat-bubble-padding-inline` (14px) above and below and `--space-medium`
   at the sides, with `--chat-gap` (12px) between its parts.
   * **An avatar**: a `--chat-avatar-size` (32px) circle in the 135deg gradient, with the robot
     mark in white.
   * **"AI Digital Twin"**, the panel's heading, an `h2` in DM Sans semibold at
     `--font-size-x-small` in `--color-text-chat` (#1e1b4b). Below it is "Andreu's career
     assistant", at `--font-size-xxx-small` (11px) in `--color-accent-violet-deep`.
   * **The status, at the right**: a `--chat-dot-size` (8px) dot, then a word at
     `--font-size-xxx-small` in `--color-text-muted`, `--chat-status-gap` (6px) apart. The word
     carries the meaning, and the dot only repeats it:
     * "Starting up" while the API warms up, with the dot in `--color-chat-starting` (#f59e0b);
     * "Online" once the API has answered `/warmup` or a question, with the dot in
       `--color-chat-online` (#00d492) and its glow, `--shadow-chat-online`;
     * "Unavailable" once warming has given up or the last question failed, with the dot in
       `--color-text-faint`.
   * **"Clear chat"**, after the status, once the conversation has a message: a quiet word at
     `--font-size-xxx-small` in `--color-text-secondary`, lit as DDR-100's was. It clears as
     DDR-100 decided.
   * **Below the wide breakpoint, the site's cross**, named "Close the chat", stands at the
     heading's right, because the launcher is behind the full-window panel there. The status and
     "Clear chat" take a line of their own below, at the right. From the wide breakpoint the header
     draws no cross, as the design draws none: the launcher closes the panel.
   * From the wide breakpoint, where the status and "Clear chat" don't fit beside the heading,
     they take a line of their own, still at the right. "Unavailable" with "Clear chat" doesn't
     fit, so the header is two lines then.
   * The heading and its subtitle wrap beside the avatar, between words, never below it.
2. **The conversation**, DDR-100's region named "Conversation", on the panel's surface, with
   `--space-medium` padding and `--chat-gap` between turns. It scrolls inside the panel and takes
   focus, as before.
3. **The foot**, on `--color-chat-foot` (#f3f4f6), above a 1px `--color-chat-hairline`. It has
   `--space-small` padding above, and `--chat-gap` at the sides and below.
   * **The field box**: white, a 1px `--color-chat-edge`, `--radius-large` (12px) corners and
     `--shadow-chat-field`. It has `--space-small` padding above and below and `--chat-gap` at the
     sides. The text area and the send control stand side by side in it, `--space-small` apart, at
     its foot.
   * **The text area**: no edge of its own, with the placeholder "Your question…" in
     `--color-text-faint`. Its text is DM Sans at `--font-size-x-small` (13px) from the wide
     breakpoint, and `--font-size-large` (16px) below it. It grows to five lines, then scrolls. On
     keyboard focus the whole box takes the focus outline.
   * **The send control**: a `--chat-send-size` (32px) square with `--chat-send-radius` (8px)
     corners, in the 135deg gradient, with the design's paper plane (1rem) in white. While nothing
     can be sent it is drawn at 40% opacity, as the design draws it at rest, and focus can still
     reach it (`--chat-inert-opacity`).
   * **The length count** stands below the box, at `--font-size-x-small` in
     `--color-text-secondary`. It counts and says the limit as DDR-100 decided.

### The messages

* **The Digital Twin's turns** start with a `--chat-twin-mark-size` (24px) circle in
  `--color-accent`, holding the robot mark. It sits `--space-small` before the bubble and
  `--chat-nudge` (2px) below its top. Assistive technology doesn't hear it.
  * The bubble is white, with a 1px `--color-chat-edge` and `--chat-radius` corners, except the
    bottom-left one, which is `--radius-small` (4px).
  * Its padding is `--chat-bubble-padding-block` (10px) by `--chat-bubble-padding-inline` (14px).
  * Its text is `--font-size-x-small` in `--color-text-chat`, on `--line-height-prose-small`.
  * The turn stops `--space-large` short of the right edge from the wide breakpoint, and
    `--space-medium` short below it, where enlarged text leaves little room.
  * This holds for the welcome, every answer, the line while a question waits, and both notices.
  * A reply's formatting and links are as DDR-100 decided.
* **The reader's turns** (the design draws none) stand at the right, with no mark. Each is a bubble
  in the 135deg gradient with white text, its bottom-right corner `--radius-small`, starting
  `--space-large` in from the left (`--space-medium` below the wide breakpoint). The words show exactly as typed. White on the gradient measures
  6.29:1 at its start and 5.70:1 at its end.
* **The line while a question waits** ("Starting up…" or "Writing an answer…") and **the two
  notices** are the Digital Twin's bubble with their text in `--color-text-secondary`. Nothing
  animates.
* **The suggestions**: once a question is sent they go, as DDR-100 decided. Until then they are
  stacked below the welcome, `--chat-gap` below it and `--space-small` apart, each the full width of
  the conversation.
  * Each is a white button with a 1px `--color-chat-edge` and `--radius-large` corners, padded as
    a bubble.
  * Its text is DM Sans medium at `--font-size-xx-small` in `--color-text-tag` (#4338ca).
  * Under the pointer and on focus it takes `--color-surface-hover` and
    `--color-border-accent-hover`.
  * No visible label stands above them. The list is named "Suggested questions" for assistive
    technology, where "Try asking" named it.
* **The unavailable notice's two controls** are drawn as the suggestions are, side by side and
  wrapping: "Try again" in the 135deg gradient with white words, and "Ask it on its own page"
  outlined, with the external mark. They behave as DDR-100 decided.

### The words

The owner approved these on #321. They replace DDR-100's and DDR-101's where named; every other
word stands.

| Where | Words |
| ----- | ----- |
| Heading | "AI Digital Twin" (was "My AI Digital Twin") |
| Under the heading | "Andreu's career assistant" (new) |
| Status | "Starting up", "Online", "Unavailable" (were "Starting up, which can take a minute", "Ready", "Can't answer right now") |
| Welcome | "Hi! I'm Andreu's AI Digital Twin. Ask me anything about his career, projects, skills or education — I'll answer in your language." |
| Suggestions | "Summarise Andreu's professional profile", "What AI and IoT products has he managed?", "What does his tech stack look like?", "Is he open to new opportunities?" |
| Placeholder | "Your question…" (was "Ask about Andreu…") |
| The suggestions' name, heard only | "Suggested questions" (was the visible "Try asking") |

The Content Strategist checked them against the owner's facts. The owner is a product manager for
AI and IoT products, and the chatbot answers in the language it's asked in, so each claim holds.
Each question is one the chatbot can answer from the owner's documents.

### What stands from DDR-100

* Where the chat sits, and that it doesn't print.
* The states and what each shows in the answer's place.
* Clearing, and the length limit.
* What a screen reader hears.
* Focus moving into the field on opening and back to the opener on closing.
* The invitation on the Digital Twin's view opening the chat.
* The footer's room for the launcher, which now reads the smaller launcher.

### Differences from the drawing

* **Hairlines are 1px**, where Figma draws 0.8px. The site draws every hairline at 1px.
* **One violet edge, `--color-chat-edge` at 35%**, where the drawing uses 25% on the bubble, 30% on
  the field and 35% on the panel and the suggestions. The difference doesn't show on white.
* **The edge and the hairline are opaque**, the violet as it shows at 35% and 20% on white, because
  the palette holds no translucent ink (DDR-031 and DDR-082 admit two translucent surfaces only).
  On the foot's grey and the page's off-white the difference doesn't show either.
* **The site's type scale and leadings**, where the drawing writes values the site doesn't have
  (DDR-038 holds the site to four leadings):
  * the suggestions at `--font-size-xx-small` (12.8px), where 12px is drawn;
  * the heading on `--line-height-heading` (15.6px), where 13px is drawn;
  * the field on `--line-height-body` (19.5px), where 20.15px is drawn.

  Each is under 3px.
* **The open launcher's gradient at 135deg**, where 140deg is drawn.
* **The field at 16px below the wide breakpoint**, where 13px is drawn, so a phone doesn't zoom in
  on focus (the owner's choice).
* **The cross in the header below the wide breakpoint**, because the full-window panel covers the
  launcher there (the owner's choice). The status and "Clear chat" stand on a line below it.
* **A smaller step beside the turns below the wide breakpoint**, `--space-medium` where the design
  draws `--space-large`, so that a bubble keeps room for its words on a phone with enlarged text.

### New values

These are new in `app/tokens.css`:
* the colours `--color-accent-violet`, `--color-accent-violet-deep`, `--color-text-chat`,
  `--color-chat-surface`, `--color-chat-foot`, `--color-chat-edge`, `--color-chat-hairline`,
  `--color-chat-online` and `--color-chat-starting`. The chat doesn't print, so none of them is a
  surface or hairline that DDR-015 drops on paper;
* the shadows `--shadow-chat-launcher`, `--shadow-chat-panel`, `--shadow-chat-field` and
  `--shadow-chat-online`;
* the sizes, spaces, radii and angles `--chat-inset`, `--chat-close-inline-size`,
  `--chat-close-block-size`, `--chat-panel-offset`, `--chat-launcher-gap`, `--chat-gap`,
  `--chat-bubble-padding-block`, `--chat-bubble-padding-inline`, `--chat-status-gap`,
  `--chat-nudge`, `--chat-avatar-size`, `--chat-twin-mark-size`, `--chat-mark-size`,
  `--chat-small-mark-size`, `--chat-send-size`, `--chat-dot-size`, `--chat-radius`,
  `--chat-send-radius`, `--chat-gradient-angle`, `--chat-launcher-gradient-angle` and
  `--chat-inert-opacity`.

These change:
* `--chat-launcher-size` becomes 2.75rem;
* `--chat-panel-width` becomes 22.5rem;
* `--chat-panel-height` becomes 483px, less what the window lacks.

The robot mark joins `components/icon.tsx`, drawn on the site's 24-unit grid at the design's
stroke. The paper plane is redrawn as the design draws it. The speech bubble leaves, since nothing
carries it.

### Contrast

* **Every ink the chat adds clears 4.5:1 on its surface**, except one. They are:
  * the chat's ink: 15.99:1 on white;
  * the subtitle: 7.10:1;
  * "Online" and the other statuses: 4.76:1;
  * the suggestions: 7.90:1;
  * white on the gradient: 5.70:1 at its lightest;
  * the count, in the secondary ink on the foot: 6.89:1.
* **The placeholder, `--color-text-faint` on white, measures 2.56:1 and fails 1.4.3.** It is the
  design's, so it is held by name in `app/tokens.test.ts`, as the owner decided on Epic #70.
* **The status dots aren't measured against 1.4.11**, because the word beside each one says the
  same thing.

## Alternatives Considered

### Keeping DDR-100's look with the design's words

Pros:
* Smaller change. The look stays tied to the site's existing tokens.

Cons:
* The design prevails (Epic #70), and the owner drew the chat to replace that look.

### "Clear chat" below the field, or no clearing at all

Pros:
* The header stays exactly as drawn.

Cons:
* Below the field, it competes with the count and the send control. Without it, a reader can't
  start over without reloading.

Declined by the owner.

### The card above the launcher on a phone too

Pros:
* One layout at every width, as drawn.

Cons:
* At 320px, with the on-screen keyboard up or at 200% text, the card leaves too little room for the
  conversation. A non-modal panel also lets focus wander behind it. Declined by the owner.

### 13px in the field everywhere

Pros:
* Exactly as drawn.

Cons:
* iOS zooms the page in when a field under 16px takes focus. Declined by the owner.

## Consequences

Benefits:
* The chat matches the owner's design, and every state has a look in its style.
* The launcher stays in view as the panel's close control on a wide window, so closing the panel
  is where opening it was.

Tradeoffs:
* **The chat brings its own palette**: a violet gradient and a pale violet surface the rest of the
  site doesn't use. It is the owner's design.
* **Nine colours, four shadows and twenty sizes are new.** They are named for the chat, so nothing
  else reaches for them by accident.
* **The placeholder fails 1.4.3**, as the site's other faint text does.

Risks:
* **The header holds more once there is a message**: the status, "Clear chat" and, on a phone, the
  cross. On a phone it is two lines. At 320px with 200% text it wraps to about 440px of a 640px
  window, and the conversation shows little above the field, though it still scrolls and nothing
  scrolls sideways.
* **The launcher still stands below the contents bar's menu** (DDR-075) and the larger picture's
  dialog (DDR-082), which stand above everything while open.

## Related Documents

* Epic #320, #321 (this decision) and #322 (building it)
* DDR-100: the chat, which this amends. DDR-101: the welcome without the note.
* ADR-028 and ADR-029: the chat's states and calls, unchanged
* Epic #70: the owner's decision that the design prevails
* DDR-038: the site's four leadings. DDR-015: the printed CV, unchanged
