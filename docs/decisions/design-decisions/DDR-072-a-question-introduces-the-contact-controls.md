# DDR-072-A Question Introduces the Contact Controls

Status: Accepted

Date: 2026-09-28

**Amended by DDR-076 in one respect**: since #223 a line below the question says what the
controls are for, and the controls follow that line at the flow step rather than the question.
Everything else here stands.

**Amends DDR-040 in one respect**: the design's space above the controls, `--space-controls`, now
stands above the question that introduces them, and the controls follow the question at the text
column's flow step. Nothing else about DDR-040 changes. It **adds no token**: the question reads the
accent, the larger step and the semibold weight the palette and the type scale already have. It
supersedes nothing.

## Context

Until #214 the introduction told a visitor who the owner is and then offered four controls, the
three contact pills and "Get my CV", with no words between them. On Epic #209 the owner asked for a
question in their own words between the summary and the pills:

> Interested in working together?

The story asks for it to be highlighted, so that a reader tells it apart from the summary at a
glance and reads the pills below as the ways to answer it. It left the question's face, size,
weight, ink, space, role and print treatment to the UI Designer.

The summary above it already carries one semibold phrase, "Curious by nature and ambitious by
choice", in the body's ink. A question set the same way would read as a second phrase of the
summary rather than as something new.

## Decision

**The question is a paragraph of its own between the summary and the controls, in the accent, at
`--font-size-large` and `--font-weight-semibold`, and it is on screen only.**

| Property  | Value                                   | Why |
| --------- | --------------------------------------- | --- |
| Element   | `p`, after the summary, before the `ul` | Not a heading: the name stays the page's one heading, the outline gains nothing and the contents bar is untouched. A screen reader reads it after the summary and before the list. |
| Face      | DM Sans                                 | DDR-023 keeps Lora for `h1` and `h2`. |
| Size      | `--font-size-large`, 16px               | The positioning line's and the greeting's size, a step above the summary's 15px. |
| Weight    | `--font-weight-semibold`, 600           | A step heavier than the positioning line's medium, so the two accent lines are not the same line twice. |
| Ink       | `--color-accent`, `#4f46e5`             | Sets it apart from the summary's semibold phrase, which is in the body's ink. |
| Above it  | `--space-controls`, 27px narrow, 36px wide | The design's space above the controls, per DDR-040, now above the question. |
| Below it  | `--space-flow`, 16px                    | The column's own step, so the question reads with the controls it introduces. Since DDR-076 the question's follow-up line stands here, 4px below it, and the controls follow that line at this step. |
| On paper  | Not printed                             | The pills print as words, not links, so the question has nothing to lead into. The controls take back `--space-controls` above them, so the sheet is as it was. |

**The accent on the introduction's band passes WCAG 1.4.3.** It is 5.87:1 on the page's surface,
per DDR-025, and at least that on the lighter band, which `app/tokens.test.ts` already holds for
every pairing measured on the page. The question adds no failing pairing.

Measured on #214 against the tree before, in Edge at the browser's default text size and at 200%,
every 10px from 300px to 900px and at 1195px, 1280px and 1536px:

* Nothing scrolls sideways and the question never breaks inside a word. It sets on one line at the
  default size everywhere, and on two or three lines at 200% below the wide breakpoint.
* The controls row takes no more rows at any width, and the name is beside the photo, or below it,
  exactly where it was before, including at 320px, 360px and 390px at both sizes.
* The controls are 40px lower at the default size below the wide breakpoint, and 29.8px lower at
  1280px. **At 390 by 844 they end 802.9px down, where they ended 762.9px, so they are still above
  the fold.**
* Printed to A4 in Edge and Firefox, with background graphics on and off: five sheets before and
  after, every sheet pixel-identical, the text identical through pypdf and pdfium, and no
  replacement character.

## Alternatives Considered

### The question in the heading ink, semibold

Pros:
* Keeps the positioning line the only accent text in the introduction.

Cons:
* It is the same ink and weight as the summary's bold phrase 40px above it, a size apart. The
  story asks for a reader to tell it apart at a glance, and this barely does.

### A larger step, `--font-size-x-large`

Pros:
* The strongest highlight.

Cons:
* It competes with the name, and costs about 7px more before the controls on a phone, with nothing
  gained over the accent.

### A heading, `h2`

Pros:
* A screen-reader user could jump to it.

Cons:
* It adds an entry to the outline that is not a section, and the story requires the name to stay
  the page's only `h1` and the outline to gain nothing. The question is what the list answers, not
  a title for what follows.

### The question as the list's accessible name, through `aria-labelledby`

Pros:
* The list would be announced with the question.

Cons:
* A screen reader would read the question twice, once as the paragraph and once as the list's
  name. Read in order, the paragraph already does the job.

### Printing the question

Pros:
* Paper and screen show the same words.

Cons:
* On paper the pills are words rather than links, so a question about getting in touch leads
  nowhere. The printed CV opens with the name and nothing added, as DDR-056 decided for the greeting.

## Consequences

Benefits:
* The end of the introduction invites the reader to get in touch, and the pills read as the answer.
* No new token, no new pattern, no failing pairing, and paper is untouched.

Tradeoffs:
* The introduction has two lines in the accent, the positioning line and the question, told apart
  by weight and place.
* The controls stand 40px lower on a phone.

Risks:
* At 390 by 844 the controls end 41px above the fold. A longer summary or question could now push
  them below it, so a change to either should be measured there again.

## Related Documents

* Issue #214 and Epic #209
* DDR-023, the faces and weights
* DDR-025, the palette and its pairings
* DDR-029, DDR-044 and DDR-058, the contact pills
* DDR-040, the introduction's proportions, which this amends
* DDR-056, the greeting, which is on screen only for the same reason
* DDR-015 and DDR-032, the printed CV
