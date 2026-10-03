# DDR-096-A Project View Invites the Reader to Try It

Status: Accepted

Date: 2026-10-02

**Amended by DDR-100 in one respect**: with script, the invitation's words open the chat with the
Digital Twin, which stands on every page since #306, rather than linking to the chatbot's own page
in a new tab. Without script they are the link decided here. Everything else here stands.

**Amends DDR-050 in two respects**: a project's view may show a line above its links that invites
the reader to try the project, and its links may go on past the repository and the live site to
any other place the project runs. Everything else DDR-050 and its amendments decide stands.

## Context

Issue #286, under Epic #209, found that nothing on the site tells a reader they can talk to the
owner's Digital Twin about the owner's career. For a reader weighing the owner as a product manager
for AI products, that chatbot is the most direct evidence the site has: they can try the product, not
only read about it. Yet its view ended with "Source code" and "Live site", the same controls every
project has. The owner's CV file links to the bot in Telegram, and the view's gallery shows it
there, but the site never linked to it.

The Content Brief on #286 offered the owner four places for an invitation: the introduction, the
portfolio's card, the Digital Twin's view, or more than one. The owner chose the view alone, with
the line "Have a question? Ask my AI Digital Twin about my career." above its links, the words
"Ask my AI Digital Twin" linking to the chatbot. The owner confirmed the bot's Telegram address and
chose to show it as a third link, "Telegram", keeping "Source code" and "Live site" as they were.

## Decision

**Where a project invites the reader to try it, its view shows the invitation as one line of running
text between the technologies and the links, with the words that lead to the project as a link in
the sentence. Only the Digital Twin has one.**

* **It is the project's content**, `invitation`, a run of text in which a part may be a link, as the
  summary's parts may be strong. A project without one shows its links where they were, 32px below
  the tags.
* **It is set as the description is**: body text on the prose leading, in the body's ink. It stands
  32px below the tags, where the links stood, and the links follow it at the flow step, 16px, as the
  introduction's controls follow the line above them (DDR-076).
* **Its link is an ordinary underlined link** in the accent, its underline in `--color-underline`,
  and under the pointer and on focus both deepen, to `--color-accent-hover` and
  `--color-underline-hover`. These are the colours DDR-035 gave a project link, which no element had
  used since the project rows became cards.
* **The link opens a new tab, with `rel="noopener"`, and says so after its own text**: "Ask my AI
  Digital Twin, opens in a new tab". It leaves the site as the view's pills do, so it follows
  DDR-043 as DDR-050 extends it. It carries no arrow: it is a link inside a sentence, not a control,
  and the underline is what marks it. *Since DDR-100 this holds without script only: with script
  the words open the chat on the page, and don't say they open a new tab.*
* **It goes with the links while the business case is shown** (DDR-079), as "Built with" and the
  technologies do: it invites the reader to the product, which the overview describes.
* **It is on screen only**, since a view does not print (DDR-050).

**A project's links may name any place it runs.** The Digital Twin's are "Source code", filled, then
"Live site" and "Telegram", both outlined, each opening a new tab and saying so. The third link is
drawn as the second is, and the pills wrap onto as many rows as they need.

## Alternatives Considered

### The invitation in the introduction

A line under the introduction's controls, leading to the chatbot. Every reader of the page would
meet it, and it would need a DDR of its own amending DDR-044, DDR-072 and DDR-076. Declined by the
owner on #286, who kept the introduction as it is.

### The invitation on the portfolio's card

The whole card is already one link to the view (DDR-051), so a second link inside it would nest one
interactive element in another. Not offered.

### Relabelling the links as invitations

"Ask about my career" in place of "Live site", and "Ask in Telegram". Declined by the owner, who kept
the labels every project shares and put the invitation in its own line.

## Consequences

Benefits:

* A reader who opens the Digital Twin's view is told, in the owner's words, that they can ask it
  about the owner's career, and can reach it in one step, on the web or in Telegram.
* The pattern is content: another project can invite the reader the same way with no change to a
  component.

Tradeoffs:

* The chatbot's web address is linked twice on the view, from the line and from "Live site".
* A reader of the page who never opens the Digital Twin's view is not invited. The owner chose
  that over a change to the introduction.
* The underline at rest, `--color-underline`, is 1.86:1 on the page and fails WCAG 1.4.11, as
  DDR-035 records. The link is still told apart from the text around it by its accent ink and its
  underline, and its ink passes 1.4.3.

Risks:

* Three pills wrap onto a second row at the narrowest widths and at 200% text. They wrap as the
  introduction's controls do, and each pair stays 8px apart.

## Related Documents

* GitHub issue #286 and Epic #209
* DDR-050, which this amends, and DDR-051, DDR-079
* DDR-035 (the project link's colours), DDR-043 (new tab), DDR-076 (the line above the controls)
* ADR-002 (the line is content)
