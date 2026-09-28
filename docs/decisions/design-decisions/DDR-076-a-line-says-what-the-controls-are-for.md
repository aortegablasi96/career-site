# DDR-076-A Line Says What the Contact Controls Are For

Status: Accepted

Date: 2026-09-28

**Amends DDR-072 in one respect**: the controls no longer follow the question directly. A line
below the question now says what they are for, and the controls follow that line at the flow step
instead. Everything else in DDR-072 stands: the question's element, face, size, weight, ink, the
space above it and its absence on paper. It **adds no token**, and it supersedes nothing.

## Context

Since #214, per DDR-072, the introduction asks "Interested in working together?" and the four
controls below it are the ways to answer: the three contact pills and "Get my CV". Since #215, per
DDR-073, the email pill shows Gmail's M alone, so the row tells a sighted reader less in words than
it did.

On #223, part of Epic #209, the owner asked for a line of their own below the question:

> Get in touch or download my CV below:

The owner chose the wording on #223 so that it covers the CV control as well as the contact pills.
The story left the line's face, size, weight, ink, space, role and print treatment to the UI
Designer, and asked that it read with the question and the controls rather than with the summary.

## Decision

**The line is a paragraph of its own between the question and the controls, in the secondary ink
at the body's size and weight, a small step below the question, and it is on screen only.**

| Property  | Value                                       | Why |
| --------- | ------------------------------------------- | --- |
| Element   | `p`, after the question, before the `ul`    | Not a heading and not the list's name, for DDR-072's reasons. A screen reader reads the summary, the question, this line and then the pills, once each. |
| Face      | DM Sans                                     | DDR-023 keeps Lora for `h1` and `h2`. |
| Size      | The body's, `--font-size-medium`, 15px      | A step below the question's 16px, so the question stays the larger of the two. The line writes no size. |
| Weight    | Regular, 400                                | The question's semibold is the highlight; this is its follow-up. The line writes no weight. |
| Ink       | `--color-text-secondary`, `#475569`         | The greeting's ink: quieter than the summary's body ink, so it does not read as a last sentence of the summary, and not the accent, which DDR-072 gives the question. |
| Above it  | `--space-x-small`, 4px                      | The question and the line are one invitation, as the greeting and the name are one phrase, per DDR-056, so they sit a step closer than the flow step. |
| Below it  | `--space-flow`, 16px                        | The column's own step, which DDR-072 gave the controls below the question. |
| On paper  | Not printed                                 | For DDR-072's reason: the pills print as words, not links, and paper does not print the CV control at all, so the line would point at nothing. The controls take `--space-controls` above them, as they did, so the sheet is as it was. |

**The secondary ink passes WCAG 1.4.3 on the introduction's band.** It is 7.07:1 on the page's
surface, per DDR-025, and at least that on the lighter band, which `app/tokens.test.ts` already
holds. The line adds no pairing and no failing one.

Measured on #223 against the tree before, in Edge at the browser's default text size and at 200%,
every 10px from 300px to 900px and at 1195px, 1280px and 1536px:

* Nothing scrolls sideways and the line never breaks inside a word. At the default size it sets on
  one line from 310px up, and on two at 300px and at 320px with a classic scrollbar (305px of
  content). At 200% it takes three lines below 380px, two up to 590px and one from 600px.
* The controls row takes no more rows at any width, and the name is beside the photo, or below it,
  exactly where it was before, including at 320px, 360px and 390px at both sizes.
* The controls are 26.5px lower at the default size from 310px to 1280px, and 24.1px lower at
  1536px, where the column is centred on the photo. At 200% they are 53px to 143px lower.
* **At 390 by 844, with a phone's overlay scrollbar, they end 791.2px down, where they ended
  764.7px, so they are still above the fold, by 52.8px.** DDR-072 recorded 802.9px before this;
  #221 has since made the contents bar a row shorter on a phone.
* Printed to A4 in Edge and Firefox, with background graphics on and off: five sheets before and
  after, every sheet pixel-identical, the text identical through pypdf and pdfium, and no
  replacement character.

## Alternatives Considered

### The line in the question's accent

Pros:
* The question and the line read as one block at once.

Cons:
* Two accent lines of the same colour a step apart would compete, and DDR-072 made the question
  the one highlighted line above the controls.

### The line in the body's ink, as the summary is

Pros:
* The most legible ink on the page.

Cons:
* 40px under the summary, in the summary's ink, it reads as a sentence the summary forgot. The
  story asks for it to read with the question and the controls.

### The line in the muted ink, `--color-text-muted`

Pros:
* The quietest line that still reads as text.

Cons:
* It fails WCAG 1.4.3 on the page, at 4.44:1, and would add a failing pairing for no gain over the
  secondary ink.

### The flow step, 16px, above the line

Pros:
* The column's own rhythm, with no exception.

Cons:
* The line would stand as far from the question as from the controls, and read as a third thing
  rather than as the question's follow-up. It also costs 12px more before the controls on a phone.

### Printing the line

Pros:
* Paper and screen show the same words.

Cons:
* It says "download my CV" on the CV itself, and points at links paper does not have.

## Consequences

Benefits:
* A reader is told in words what the four controls are for, which matters most for the email pill,
  which since DDR-073 shows only a mark.
* No new token, no new pattern, no failing pairing, and paper is untouched.

Tradeoffs:
* The controls stand 26.5px lower on a phone at the default text size.
* The introduction's text column has one more exception to its flow step.

Risks:
* At 390 by 844 the controls end 52.8px above the fold. A longer summary, question or line could
  push them below it, so a change to any of them should be measured there again.

## Related Documents

* Issue #223 and Epic #209
* DDR-072, the question above the controls, which this amends
* DDR-073, the email pill that shows its mark alone
* DDR-056, the greeting, whose ink and closeness this follows
* DDR-023, the faces and weights
* DDR-025, the palette and its pairings
* DDR-040, the introduction's proportions
* DDR-015 and DDR-032, the printed CV
