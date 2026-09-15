# DDR-005-Print Stylesheet

Status: Accepted

Date: 2026-09-11

## Context

ADR-002 made the page itself the canonical CV. No separate PDF is maintained or generated. That
removed any drift between two copies of the same facts, but it made printing a real requirement.
Printing, or saving as a PDF from the browser, is now the only way a visitor leaves with a
document. It is also a likely path, not an edge case. A hiring manager who wants to keep a
candidate's details, pass them to a colleague, or bring them to an interview will print to PDF.
Issue #14 asks for that document to work as a CV rather than as a screenshot of a website.

Without a print stylesheet, browsers print the screen design unchanged. On a representative page,
measured in Edge:

* **Screen type sizes.** Body text is 18px, which prints at 13.5pt, and the page title at 26.4pt.
* **A centred column.** The 65ch column is centred on the sheet, with the screen's gutter and 4rem
  of space above it.
* **Navigation prints.** In-page navigation appears on paper, where it leads nowhere.
* **Links lose their destinations.** They print as underlined words, and the reader cannot recover
  where they pointed.
* **Page breaks fall anywhere.** A section heading can end a page, and a single role can be split
  across two.
* **The surface can print.** With the browser's "Background graphics" option on, the off-white
  surface prints across every sheet.

The constraints are:

* **ADR-001**: design values are custom properties defined once at the root.
* **ADR-002**: the printed document is the same content as the screen, with no print-only content.
  Descriptions are plain strings, so links stand on their own rather than inside sentences.
* **DDR-001**: text sizes are in rem, and no text is smaller than 12px, which is 9pt.
* **DDR-002**: colour is never the only signal. Links are underlined, and metadata is set apart by
  its size.
* **DDR-003**: sections are separated by whitespace and their headings alone, with no rule or
  background.
* **DDR-004**: there is one layout and one breakpoint, at 20em. A sheet of paper is wider than
  20em, so print gets the full heading scale.
* **Issue #14** excludes generating a PDF at build time, a separately authored CV, print-only
  content, and page headers or footers beyond what the browser provides.

## Decision

### Paper is a medium, not a layout

The print treatment follows the pattern DDR-004 set for screen widths. Where a token can express
a change, the tokens are redefined in a print media query. The base styles add a print rule only
for what a token cannot express. The printed document has the same content, in the same order,
as the screen.

### Type: a 10pt base

In print, the root font size is 10pt, set by `--root-font-size`. Every rem is measured from it,
so all five type steps and the whole spacing scale shrink together, and DDR-001's and DDR-003's
proportions hold on paper.

| Step                   | On screen, at the default | On paper |
| ---------------------- | ------------------------- | -------- |
| `--font-size-small`    | 14.4px                    | 9pt      |
| `--font-size-medium`   | 18px                      | 11.25pt  |
| `--font-size-large`    | 22.4px                    | 14pt     |
| `--font-size-x-large`  | 28px                      | 17.5pt   |
| `--font-size-xx-large` | 35.2px                    | 22pt     |

* **Body text is 11.25pt**, within the usual range for a printed CV.
* **The smallest text is exactly DDR-001's floor.** Metadata is 9pt, which is 12px, so the floor
  holds on paper as well as on screen.
* **The base is in pt, a unit of paper.** On screen, `--root-font-size` is 100%, the reader's own
  setting, so nothing changes on screen. On paper, the browser's font-size setting no longer
  applies. The print dialog's scale does that job instead.
* **The rhythm keeps its proportions.** Blocks of text are 10pt apart, items 20pt, and sections
  40pt, about 14mm.

The owner chose this over a 9pt base, which would put metadata at 8.1pt, below the floor, and
over printing at the screen's sizes.

### Layout: the sheet

* **The column fills the sheet between its margins** (`--content-width: none`) and starts at the
  left margin. Paragraphs and list items keep their 65ch measure, about 12.8cm at 11.25pt, so lines
  stay readable. Headings and metadata may run the full width.
* **The sheet's margins replace the screen's edges.** The gutter and the space above and below the
  page are 0 in print (`--page-gutter`, `--page-padding-block`).
* **The margins are 2cm on every side**, set by an `@page` rule in `app/tokens.css`. They are a
  measure of the paper, not a step of the spacing scale, so they are in cm and written once. The
  paper size is left to the visitor, whether A4 or US Letter.
* **Browser headers and footers are left to the visitor.** They carry the date, title, URL, and page
  numbers, and the print dialog switches them on or off. The margins leave room for them. The owner
  chose this over page margins of 0, which suppress them but leave text running to the paper's
  edge at every page break.

### Colour: the paper is the surface

* **In print, `--color-surface` is transparent**, so the page has no background. The sheet is white
  whether or not the browser prints backgrounds, and no ink is spent on a tint.
* **Text colours do not change.** White paper is lighter than the surface, so every text pairing
  DDR-002 records has at least as much contrast on paper as on screen.
* **In black and white**, the accent and secondary text print as greys. Links are still identified
  by their underline, and metadata by its size, as DDR-002 requires.

### What is hidden

* **In-page navigation is not printed.** A `nav` leads nowhere on paper. None exists yet, and the
  base styles hide it, so the first one needs nothing more.
* **Other screen-only elements are hidden by their own component.** An element such as a button is
  hidden in print by the component that renders it, in that component's own print rule.
* **Nothing else is hidden.** A component adds no print-only content.

### Links

* **A link that leaves the page prints its address after its text**, in brackets, such as
  "Profile (https://example.com/profile)". This includes email links, which print the address
  with its `mailto:` prefix.
* **A link within the page prints nothing extra.**
* **The rule cannot see a link's text.** A link whose text already is its address prints the
  address twice.
* **In a PDF saved from Edge or Firefox, links also stay clickable.**

The owner chose this over relying on link text, which would need a content rule that CSS cannot
enforce.

### Page breaks

* **A single entry is never split across two pages.** An `article` or a list item avoids breaking
  within itself, so a role, a project, or a credential stays whole.
* **A heading avoids being the last thing on a page.** Headings avoid a break after them, and
  avoid breaking within themselves. In Edge and Chrome, a section heading therefore moves to the
  next page with its first entry.
* **Firefox does not honour the rule that keeps a heading with what follows it.** There, a section
  heading can end a page, although entries still stay whole. The owner accepted this limitation
  rather than add a workaround. #23 tracks rechecking it once real content exists.
* **Sections are not forced onto new pages.** A section starts wherever the previous one ends, so
  pages fill rather than ending half-empty.
* **An entry longer than a page still breaks**, as it must.

### Where the treatment lives

* `app/tokens.css` defines `--root-font-size` at `:root` as 100%. A print media query there
  redefines five tokens: the base size, the surface, the column width, the gutter, and the page
  padding. An `@page` rule sets the margins.
* `app/globals.css` sets the root font size from `--root-font-size`. Its print media query hides
  `nav`, prints link addresses, and sets the break rules. Like the spacing rules, these have zero
  specificity, through `:where()`.
* **A component** hides its own screen-only elements in print, and adds no print-only content.

## Alternatives Considered

Options A to E were offered to the owner.

### Option A: A 9pt base, with body text at about 10pt

Pros:
* The densest option, on the fewest pages.

Cons:
* Metadata falls to 8.1pt, below the 12px floor DDR-001 sets.

### Option B: Print at the screen's sizes

Pros:
* The largest and most legible option, and nothing to decide.

Cons:
* Body text at 13.5pt is large for paper. The representative page ran to five Letter pages instead
  of four.

### Option C: Rely on link text, and print no addresses

Pros:
* The cleanest result on paper and on screen, if every link's text is its own address.

Cons:
* It depends on a content rule that has not been decided and that CSS cannot enforce. Any link
  whose text is not its address would lose its destination on paper.

### Option D: Page margins of 0, to suppress the browser's headers and footers

Pros:
* No URL or date is stamped on the page.

Cons:
* Only the start and end of the document keep space at the top and bottom. Everywhere else, text
  runs to the paper's edge at a page break.
* Headers and footers are the visitor's choice in the print dialog, which issue #14 leaves to the
  browser.

### Option E: Reserving space below each heading, for Firefox

An invisible block of fixed height below each heading, cancelled by a negative margin. Firefox
then moves a heading to the next page when less than that height remains below it.

Pros:
* In Firefox, a section heading ended a page in 1 of 31 tested layouts with 14rem of reserved
  space, and in 9 with 8rem, against 19 without it.

Cons:
* Not a guarantee. It works only when the first entry is shorter than the space reserved, which
  depends on content.
* A value off the spacing scale.
* It changes page breaks in every browser, including those that already keep a heading with its
  entry, and can leave more space at the foot of a page.

### `break-before: avoid` on what follows a heading

Pros:
* The same intent, expressed from the other side of the break.

Cons:
* Firefox ignores it too. A section heading still ended a page in 19 of 31 layouts, so it adds
  nothing to `break-after: avoid`.

### A separate print layout, such as two columns or a sidebar

Pros:
* A more conventional CV shape, and more on each page.

Cons:
* A second layout to design and maintain, against DDR-004's single layout, and it is a redesign
  rather than a treatment for paper.

### Keeping the column centred

Pros:
* Paper looks the same as the screen.

Cons:
* Printed documents align to the left margin. Centring wastes the left side of the sheet and gives
  headings no more room than paragraphs.

### Starting each section on a new page

Pros:
* Each section begins at the top of a sheet.

Cons:
* Half-empty pages and more paper, on a page with only four sections of a few entries each.

### Separate print type tokens, in pt

Pros:
* Each size could be tuned for paper on its own.

Cons:
* A second scale to keep in step with the first. A single base keeps DDR-001's proportions with
  one value.

## Consequences

Benefits:
* The one copy of the facts prints as a document, which ADR-002 depends on.
* The treatment is small: five tokens redefined, an `@page` rule, and four print rules.
* DDR-001's type floor holds on paper.
* The output does not depend on the browser printing backgrounds.
* Link destinations survive on paper, and links stay clickable in a saved PDF.

Tradeoffs:
* Email links print their `mailto:` prefix, and a link whose text is its address prints it twice.
* Browser headers and footers appear if the visitor leaves them on.
* On paper, the reader's browser font-size setting no longer applies.
* Headings and metadata run the full width while paragraphs keep the measure, so right edges
  vary.
* Keeping entries whole can leave space at the foot of a page, where the next entry did not fit.
* In Firefox, a section heading can end a page.

Risks:
* Page breaks depend on how much content there is. They were checked on a representative page, and
  should be checked again once real content exists.
* Browsers differ more in print than on screen. The treatment was checked in Edge and Firefox, and
  a print change should be checked in both.
* When Firefox 155 saves a PDF, text in the site's web fonts is drawn as outlines rather than as
  text. It looks and prints correctly, and links stay clickable, but the text cannot be selected,
  copied, or searched. This was found through Firefox's WebDriver BiDi print command, not yet from
  its own print dialog. Edge's PDFs keep the text. In the same Firefox PDFs, text set in Arial
  stays text, so the cause lies with the site's web fonts. They are variable fonts, per DDR-001,
  and PDF has no direct support for variable fonts, but that has not been confirmed as the cause.
  #22 tracks it, and a fix may mean a change to how the fonts are loaded.
  Resolved by DDR-007. The checks for #22 confirmed that the variable font files were the cause,
  and DDR-007 replaces them with static files, which Firefox's PDFs keep as text.

## Related Documents

* GitHub issue #14, which this decision resolves
* GitHub issue #2, Design Foundation
* GitHub issues #22 (Firefox PDF text) and #23 (Firefox page breaks at headings), follow-ups from
  the checks for #14
* ADR-001, which set the styling approach
* ADR-002, which made the page the CV, excluded print-only content, and made descriptions plain
  strings
* DDR-001, the typographic system, whose scale and floor print keeps
* DDR-002, the colour system, whose pairings and signals print keeps
* DDR-003, spacing and layout, whose rhythm print keeps in proportion
* DDR-004, the responsive strategy, whose pattern of redefining tokens print follows
* DDR-007, static font files, which resolves the Firefox PDF text risk
