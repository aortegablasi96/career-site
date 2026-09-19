# DDR-032-Print Recheck for the Adopted Design

Status: Accepted

Date: 2026-09-18

**Amends DDR-015 in three respects**, and leaves everything else it decides untouched:

* **A printed address may break anywhere.** DDR-015 prints a link's address after it and says
  nothing about how it wraps. It now wraps at any character, because an address that cannot break
  made Edge shrink the whole sheet.
* **Its measurements are replaced.** DDR-015 measured four sheets in Edge and five in Firefox, and
  put the difference down to Firefox setting the summary one line longer. Both browsers now print
  **five sheets, broken in the same places**, and the difference had another cause, below.
* **Its print base is confirmed, not moved.** DDR-022 raised it from 11pt to 12pt and left #99 free
  to move it again. It stays at 12pt.

**Amended by DDR-051 in one respect**: the projects print as cards with no address, so the long
repository URL this record measured is no longer on the sheet. The CV had grown to six sheets under
DDR-037. It is five again, in Edge and Firefox, broken in the same places. DDR-051 has the
measurements.

DDR-015's table of what prints is also out of date in one row. Since DDR-029 a contact pill prints
its label, "Email", "LinkedIn" or "GitHub", and not an address. The addresses print once each,
from the footer DDR-028 added.

## Context

Epic #70 changed nearly everything DDR-015's measurements rest on:

* the type scale and the print base (DDR-022)
* the faces and weights, with three more font files (DDR-023)
* the tracking on the labels (DDR-017, DDR-024)
* the palette (DDR-025)
* a divider on every section (DDR-026)
* the footer (DDR-028)
* labelled contact pills (DDR-029)
* medium weight on the pills and tags (DDR-030)
* the contents bar (DDR-031)

Each of those stories checked what it could and left the finished sheet to #99. #99 is the story
that prints it.

DDR-015's question was what the printed CV looks like. This record asks whether that still holds
now that every one of those changes has landed.

## Decision

### Printed addresses break anywhere

`app/globals.css` now writes `overflow-wrap: anywhere` on the rule that prints a link's address after
it. It is the one change to the stylesheets this story makes.

**Why it was needed.** An address such as
`https://github.com/aortegablasi96/career_conversation_chatbot` contains no space, so a browser
treats it as a single word. A grid column cannot be narrower than its longest word. Under print
media, at A4's 642.5 CSS pixels inside the 2cm margins, that one address took the Digital Twin
project's text column to 713px. Chromium resolves a page wider than the sheet by shrinking
everything to fit. Edge therefore printed the whole CV at about **0.90** of its size:

* body text at 10.16pt instead of 11.25pt
* the photo at 25.34mm instead of 28mm
* a level badge at 6.8pt instead of 7.5pt

This is the "Edge scales the whole sheet by about 0.877" that #89 noticed and did not explain;
0.877 was the factor on the page as it stood then.

**Why there were four sheets in Edge.** The same shrinking explains DDR-015's four sheets against
five. A sheet printed smaller holds more, and Firefox never shrank it. Firefox breaks the address at
its slashes and underscores on its own, so its five sheets are **pixel-identical** with and without
this change. With the change, Edge lays the sheet out at full size and breaks it in exactly the
places Firefox does.

**Why `anywhere` and not `break-word`.** Only `anywhere` counts the breaks it allows when the
browser works out how narrow a column can be. The footer already uses it for the same reason, per
DDR-028. The declaration is on the pseudo-element, so it affects the printed address and nothing
else; the label before it wraps as it always did.

### The print base stays at 12pt

Measured with `--root-font-size` overridden and every section heading located on the sheet:

| Base   | Body text | Smallest step | Edge sheets | Firefox sheets |
| ------ | --------- | ------------- | ----------- | -------------- |
| 11pt   | 10.3pt    | 6.9pt         | 5           | 5              |
| **12pt** | **11.25pt** | **7.5pt**   | **5**       | **5**          |
| 12.8pt | 12pt      | 8pt           | 7           | 7              |
| 13.5pt | 12.7pt    | 8.4pt         | 7           | 7              |

12pt is the largest base that keeps the CV at five sheets:

* 11pt saves no sheet, so it would only make the text smaller.
* 12.8pt would put the smallest label at 8pt, a common floor for print, but it costs two sheets.

The labels at 7.5pt are the level badges. They are uppercase, bold and tracked, and each repeats a
word that means the same thing as its tint. DDR-022 left the final say on them to this story: they
stay.

### Measured

Printed to A4 through WebDriver in **Edge 153** and **Firefox 156**, background graphics on and off,
from the built page. The text of all eight PDFs was read back through both pypdf and pdfium. The
blocks that must stay whole were read from the page itself under print emulation rather than from
a hand-kept list:

* 13 articles
* 4 skill groups
* the row of language cards

| | Edge | Firefox |
| --- | --- | --- |
| Sheets, background graphics on and off | **5** and 5 | **5** and 5 |
| Sheet each section heading is on | 1, 3, 4, 5, 5 | 1, 3, 4, 5, 5 |
| Headings not followed by their first item on the same sheet | 0 of 5 | 0 of 5 |
| Blocks split across two sheets | 0 of 18 | 0 of 18 |
| Each of the three addresses in full, in every reading | once | once |
| `mailto` anywhere | 0 | 0 |
| Replacement characters | 0 | 0 |
| Apostrophes as U+2019 / U+0027 | 5 / 0 | 5 / 0 |
| Printed photo, as pdfium reads its bounds | 28.05mm | 28.6mm |
| Body text | 11.25pt | 11.25pt |

The sections break as follows in both browsers:

* **Sheets 1–2:** the introduction and Experience.
* **Sheets 3–4:** Projects, two to a sheet.
* **Sheet 4:** Skills begins below the projects, with its first row of groups.
* **Sheet 5:** the second row of skill groups, Education and certifications, Languages and the
  footer. Skills breaks between its two rows, never inside a group.

The bullet markers are drawn on sheets 1 and 2, the two that carry points, in both browsers.

**Words.** The page shows **479** distinct words on paper. "Get my CV" is hidden in print and is not
counted.

* **As letters, all 479 come back from every one of the eight readings**: two browsers, background
  on and off, two readers.
* **As whole words**, pypdf misses the following, and each has a reason:

| Word | Missing from | Why |
| --- | --- | --- |
| `Copilot-driven`, `data-driven` | pypdf, Edge and Firefox | The line wraps at the hyphen and pypdf returns the two halves as two words. Before this story only Firefox wrapped there; Edge now sets the same lines. |
| `ADVANCED`, `PROFICIENT`, `BASIC` | pypdf, Firefox | The level badges at DDR-024's +0.1em come back spelled out, as `P R O F I C I E N T`. DDR-024 measured and accepted this. pdfium and Edge return them whole. |

pdfium writes U+FFFE where a line wraps at a hyphen. Read as a hyphen, every word comes back from
pdfium.

**What background graphics change.** Every surface, every hairline, the raised shadow and both of the
photo's lights are still dropped at the token layer, so none of them prints either way. The layout
and text are identical, sheet for sheet. **The inks are not identical.** With background graphics
off, both browsers print the pale inks darker, which is their own economy mode for light text. It
is plainest in `--color-text-muted`, a company, an institution or a thesis, and in
`--color-text-faint`, a place or the footer.

With background graphics on, they print the colours the page draws. This record leaves that alone.
It is the browsers' behaviour, not a surface, and it helps the reader. Forcing it with
`print-color-adjust: exact` would print the 2.39:1 grey on every sheet.

## Alternatives Considered

### Option A: Leave the address unbreakable and accept Edge's scaling

Pros:
* No change at all, and Firefox is unaffected either way.

Cons:
* Edge, which is Chromium and so stands for most visitors, prints the CV at 90%, with 10.2pt body
  text and 6.8pt badges.
* The two browsers break the CV in different places for a reason that has nothing to do with the
  content.

### Option B: Let the projects' text column shrink below its content, with `min-inline-size: 0`

Pros:
* It fixes the one column that overflowed.

Cons:
* The address would then run out of its column into the margin rather than wrap.
* Every other grid that ever carries a long address would need the same fix.
* The column is not what is wrong; the unbreakable address is.

### Option C: Shorten or hide long addresses on paper

Pros:
* Neater sheets.

Cons:
* It changes what the printed CV says, which #99 excludes, and a shortened address would be
  print-only content, which ADR-002 forbids.
* A reader of paper needs the whole address to type it in.

### Option D: Raise the base to 12.8pt, so no text prints below 8pt

Pros:
* The badges reach a conventional print floor.

Cons:
* Seven sheets instead of five in both browsers, for labels that repeat their tint.

## Consequences

Benefits:
* **Edge and Firefox print the same five sheets, broken in the same places.** DDR-015 recorded their
  disagreement as a loss; it is gone, and the cause is understood.
* The CV prints at the size the tokens say in both browsers: body text at 11.25pt, the photo at
  28mm.
* Every word the sheet shows comes back out of both browsers' PDFs. DDR-011's guarantee has been
  verified for the last time on Epic #70.

Tradeoffs:
* A long address can now break in the middle of a word, such as `career-conversation-` at the end of
  one line and `chatbot` on the next. Firefox already did this.
* Edge now wraps `Copilot-driven` and `data-driven` at their hyphens, as Firefox does, so pypdf gives
  back half-words in both browsers.
* The smallest printed label stays at 7.5pt.

Risks:
* **Only one line separates five sheets from six.** Sheet 5 now carries the education section, the
  languages and the footer. A longer credential or a sixth project could push the footer onto a
  sixth sheet. Page breaks still have to be rechecked when the amount of content changes.
* **The footer's space on screen is still the page's 64px, not the design's 16px.** DDR-028 left
  that page-level question to this story. #99's scope excludes any change to what the page shows,
  so it remains open and needs a story of its own. On paper it does not arise.
* **Browsers change how they print.** The check has to be the text read back out of both browsers'
  PDFs, not a look at the page.

## Related Documents

* GitHub issue #99, and Epic #70
* DDR-015, the print treatment, which this amends
* DDR-011, whose PDF guarantee this re-verifies
* DDR-022, which raised the print base to 12pt and left it to this story
* DDR-024, whose badge tracking pypdf spells out
* DDR-028, the footer, whose open item about the space above it is carried forward, and which
  already uses `overflow-wrap: anywhere` for the same reason
* DDR-029, whose labelled pills leave the footer as the one place the addresses print
* ADR-002, which makes the page the CV and forbids print-only content
* ADR-005, which lists the facts the CV file shares with the page; no content changed here
* GitHub issues #22, #23 and #40, the print bugs whose regressions this checks
