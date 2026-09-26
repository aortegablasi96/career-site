# DDR-058-The Email Pill Reads "Email me"

Status: Accepted

Date: 2026-09-26

**Amends DDR-029 in one respect**: the email contact pill reads "Email me", where DDR-029 gave it
the design's "Email". The LinkedIn and GitHub pills keep "LinkedIn" and "GitHub". Everything else
DDR-029 decides stands unchanged. The label is content and the address is not on the pill. The
footer is the one place an address is written out, and the pill prints its label with no address
after it.

It **adds no token, no component and no declaration**. The whole change is one string in
`content/introduction.ts`. The pill's box, border, fill, mark, radius, shadow, ink, weight and size
are DDR-044's and DDR-030's, and its hover is DDR-035's, all untouched.

## Context

DDR-029 took the three labels the design draws at node 2:50: "Email", "LinkedIn" and "GitHub".
Each names a service. That reads naturally for the two profiles, since a visitor goes to LinkedIn
or GitHub to look at something.

The email pill is different. It is the one control on the page that starts a message to the owner.
"Email" only labels a way to reach them. The owner asked on #175 for it to say what it does and ask
the visitor to write.

Epic #152 excludes the introduction and the contact pills from its scope. The owner placed #175 in
that epic regardless, as an exception they chose.

## Decision

**The email pill's label is "Email me".**

| Pill     | Shows      | Links to                                 | Written out in |
| -------- | ---------- | ---------------------------------------- | -------------- |
| Email    | "Email me" | `mailto:aortegablasi@gmail.com`          | the footer     |
| LinkedIn | "LinkedIn" | `https://www.linkedin.com/in/andreu-ob/` | the footer     |
| GitHub   | "GitHub"   | `https://github.com/aortegablasi96`      | the footer     |

* **Its accessible name is its label**, "Email me". The email pill opens no new tab, so DDR-044's
  suffix does not apply and the name is exactly the visible text, per WCAG 2.5.3.
* **Only the email pill changes.** The two profiles still name their service. They are places a
  visitor looks at rather than a message they send, and "LinkedIn me" is not English.
* **It prints as it shows.** On paper the pill reads "Email me" and nothing follows it. The
  address is on the sheet once, from the footer, per DDR-029.

## Alternatives Considered

### Keep "Email", as DDR-029 and the design have it

Pros:

* Matches the design node for node, and the three labels are parallel.

Cons:

* It names a channel rather than asking to be written to, which is what the owner wants the one
  control that starts a conversation to do.

### Rename all three into calls to action, such as "Email me", "Connect on LinkedIn", "See my GitHub"

Pros:

* The three labels stay parallel.

Cons:

* The owner asked for the email pill alone.
* Longer profile labels widen two pills. The controls row would wrap more on a phone, and
  DDR-029's labels were chosen to be short.

## Consequences

Benefits:

* The one control that starts a message says so, and asks for it.
* The accessible name, the visible text and the printed word are the same two words.

Tradeoffs:

* The three labels are no longer parallel: one addresses the visitor and two name a service.
* It differs from the design at node 2:50 in one word. That is the only difference this record
  accepts.
* **The pill is 22.7px wider**: 110.5 by 37.5 where it was 87.8 by 37.5, and 218.9 by 73 at 200%
  text where it was 173.6 by 73. At four widths the controls row takes one more row, listed below.

Risks:

* Any width where the controls row is close to wrapping can now wrap. A later change to a pill's
  label, padding or gap should rerun the sweep below.

## Measurements

Measured in Edge against the page served by `next dev`, with "Email" put back in the same page for
the "before" figures, so that nothing but the label differs. Widths are the viewport. Edge draws a
15px scrollbar, so the page's own width is 15px less.

### The controls row

Swept every 10px from 300px to 900px, and at 1195px, 1280px and 1536px, at the browser's default
text size and at 200%. The row gains a row at four widths and at no others:

| Width | Text | Rows      | Row height       |
| ----- | ---- | --------- | ---------------- |
| 490px | 100% | 1 → 2     | 37.5 → 83px      |
| 500px | 100% | 1 → 2     | 37.5 → 83px      |
| 450px | 200% | 3 → 4     | 251 → 340px      |
| 460px | 200% | 3 → 4     | 251 → 340px      |

At 320px, 360px, 390px, 890px, 1195px and 1536px the row's height and every box below it are
unchanged at both text sizes. **At 390 by 844 the controls end 687.3px down before and after**,
above the fold.

### Overflow and targets

Nothing scrolls sideways at any width swept, at either text size, before or after. No pair of
targets fails WCAG 2.2's 2.5.8 at any width, before or after. The closest pair is the footer's
addresses at 27.2px centre to centre, as before. The pill clears 24 by 24 outright.

### Paper

Printed to A4 in Edge and Firefox with background graphics on, before and after, and read back
through pypdf and pdfium:

|                                   | before | after |
| --------------------------------- | ------ | ----- |
| Sheets, Edge and Firefox          | 5, 5   | 5, 5  |
| Section headings on sheets        | 1, 2, 4, 5, 5 | 1, 2, 4, 5, 5 |
| "Email me" as two words           | 0      | 1     |
| `aortegablasi@gmail.com`          | 1      | 1     |
| `mailto` anywhere                 | 0      | 0     |
| Replacement character             | 0      | 0     |

On paper the pills stand one to a line, so the wider label moves nothing. Every sheet's text is
identical before and after except for the label. Rendered at 100dpi, sheets 2 to 5 are
pixel-identical, and sheet 1 differs only in a 20 by 8 pixel patch where "me" is drawn.

## Related Documents

* docs/decisions/design-decisions/DDR-029-contact-pill-labels.md — the labels this amends
* docs/decisions/design-decisions/DDR-028-footer.md — the footer that writes the address out
* docs/decisions/design-decisions/DDR-044-contact-pills-as-service-buttons.md — the pill's look and its
  accessible name
* docs/decisions/design-decisions/DDR-027-target-sizes.md — target sizes
* docs/decisions/architecture-decisions/ADR-002-content-model-and-authoring-approach.md — why the
  label is content
* docs/decisions/architecture-decisions/ADR-005-separately-designed-cv.md — the facts the page and
  the downloadable CV share, which a pill's label is not
* GitHub issue #175, and Epic #152
