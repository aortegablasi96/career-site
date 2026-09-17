# DDR-028-Footer

Status: Accepted

Date: 2026-09-17

Supersedes **the one sentence of DDR-010** that says "There is no footer", and answers the three
grounds that record rejected it on. Everything else in DDR-010 stands: its outline is unchanged,
because the footer adds no heading, and its contact-address rule is unchanged, because the footer is
what makes that rule survivable once #97 labels the pills.

It **adds no token**. The hairline is `--color-border`, the ink is `--color-text-faint` and the
space is DDR-013's scale — all three already defined, and DDR-025 already names the footer among the
users of the first two. It **adds one font file to the page**, `lora-latin-400-normal.woff2`, which
DDR-023 derived, inspected and committed for this story and deliberately left unloaded.

**Extends DDR-027's table of targets from eleven rows to fourteen.** The three addresses are
targets, and like seven of the eleven they meet WCAG 2.2's 2.5.8 by its spacing exception rather
than outright. The measurement is below.

## Context

DDR-010 rejected the design's footer in a sentence, inside its decision about the page's outline:

> **There is no footer.**

and gave its reasons in the alternatives it weighed:

> Pros: The contact addresses stay reachable at the foot of a long page.
> Cons: It repeats what the introduction already says. In the draft it is set at 12px in a grey
> measuring 2.39:1. It is new surface area carrying nothing new.

On 2026-09-17 the owner decided that the design prevails everywhere, including over the records
written to protect WCAG conformance, and Epic #70 was rewritten around that: #89 to #99 close the
gaps and the records that stand in the way are superseded rather than defended. #96 is the footer.

**What the design draws** is node 2:687: a band the full width of the frame, carrying a 0.8px
`#e2e8f0` line along its top edge and 32px of padding above and below its one row. Inside it, a
container at the page's own column width holds the owner's name on the left — Lora Regular 12px in
`#94a3b8` (node 2:690) — and the three contact addresses on the right, 20px apart, in DM Sans
Regular 12px in the same `#94a3b8` and **not underlined** (nodes 2:693, 2:696 and 2:699). It draws
nothing else: no copyright line, no "built with", no date.

**It also has to land before #97 can.** DDR-010 calls the full address on each contact pill "not
negotiable", and its reason is paper:

> On paper the address must then be printed after the label, which reintroduces the `mailto:` prefix
> DDR-006 removed — or be suppressed, which is what the draft does, leaving the printed CV with no
> email address.

The footer is the only other place on the page the addresses appear. So what the footer does on
paper is what decides whether #97 is possible at all, and this record decides it deliberately rather
than letting the footer inherit `nav`'s treatment by accident.

## Decision

**A `footer` follows `main`, holding the owner's name and the three contact addresses inside the
page's own column, above a hairline. It prints.**

```tsx
<Footer name={introduction.name} contact={introduction.contact} />
```

One component, `components/footer.tsx`, with its stylesheet and its test; one line in
`app/page.tsx`, which now returns a fragment so the footer can sit outside `main`; one file added to
the Lora list in `app/layout.tsx`. No content module is added and no string is written: the footer
is handed the introduction's own `name` and `contact` records, so the addresses are stated once in
`content/` and shown in two places, per ADR-002. It ignores each contact's `icon`, because the
design draws no mark here.

### It is the page's `contentinfo` landmark, and it adds no heading

It follows `main` rather than sitting inside it, so it is `contentinfo` rather than a generic group,
and a screen reader can reach it as a landmark of its own. It adds no heading, so DDR-010's outline
— the name as the `h1`, a section as an `h2`, an item as an `h3` — is exactly what it was. A heading
here would announce a section the page does not have.

The line is a `border-block-start` on the footer, which spans the viewport as the design's spans its
frame, and the column is on a container inside it, reading `--content-width` and `--page-gutter` —
the same two tokens `main` reads. So the name starts where the page's text starts and the last
address ends where it ends, at every width and on paper. Measured on the built page at 1536px: the
container is 1132px at x=194.4, which is `main` to the pixel.

### Three answers to DDR-010's three grounds

* **"It repeats what the introduction already says."** It does, and that is now the point rather
  than the objection. #97 labels the pills `Email`, `LinkedIn` and `GitHub`, and from that story the
  footer is the only place either a reader or a sheet of paper can get the addresses themselves. The
  repetition is one story wide.
* **"In the draft it is set at 12px in a grey measuring 2.39:1."** It still is. `--color-text-faint`
  is `#94a3b8`, which DDR-025 adopted from the design, measured at 2.39:1 on the page and recorded
  as failing WCAG 1.4.3. This record adds no new failure and no new token; it adds three more lines
  of text to a token whose cost DDR-025 already states in full, and DDR-025 already lists "the
  footer" among its users.
* **"It is new surface area carrying nothing new."** True, and accepted. What it buys is that the
  addresses are reachable at the foot of a 3.9m page without scrolling back, and that the printed CV
  keeps them after #97.

### The links are not underlined, and this is what identifies them

This is the one thing about the footer that needed deciding. DDR-012 made the underline what
identifies a link — "the accent is too close to the text colour to tell them apart on its own" — and
the design draws no underline here. It also draws the addresses in the **same ink as the name beside
them**, so unlike every other link on the page they are not even a different colour from the text
around them.

What identifies them instead:

* **Each is an address.** An email address and two domain names are self-evidently things that can
  be reached, which is not true of "Repository" or "Experience". This is the same property DDR-006
  relied on when it made a contact link show its address rather than a label.
* **Each repeats a control the introduction has already identified.** The three pills at the top of
  the page carry the same three strings, and DDR-025 identifies each of those by its icon, its shape
  and the white it sits on. A reader meets the control first and the footer's copy of it second.
* **Keyboard focus is visible**, from the base styles' `:focus-visible` outline in the accent at
  5.87:1, which this record does not touch. The footer is the last thing in the tab order and its
  three links take focus in the order the introduction gives them.

**What does not identify them is colour**, which is the only thing WCAG 1.4.1 forbids as a sole
means, and colour is not doing the work here — it is doing nothing at all. That is the honest
statement of it: these three links are told apart from the name beside them by what they say and by
nothing else the eye is given.

`components/contents.module.css` is the nearest comparison and it went the other way: DDR-025 kept
the contents links' underline against the design, on the grounds that at 4.44:1 "the colour is the
last thing that should have to say a link is a link". A contents link's label is a section title —
"Experience" — which carries no clue that it is a link, and the underline is the only cue it has. An
address carries the clue in the string. That is the whole of the difference, and it is thin; Option
A below is the record of the case for reversing it in one declaration.

### Two places the design's value is off the site's scales

The design was measured node by node and adopted everywhere except these two, and both are the same
judgement: the value the design draws is not on a scale this story is entitled to rewrite, and the
difference is smaller than the cost of rewriting it.

| What | The design | The page | Why |
| --- | --- | --- | --- |
| The footer's text | 12px | `--font-size-xx-small`, 12.8px | The scale has no 12px step |
| Between two addresses | 20px | `--space-medium`, 16px | The scale has no 20px step |

* **12px is a size DDR-022 did not measure**, because its audit covered the body of the page and
  the footer did not exist. It sits between `xxx-small` at 11px and `xx-small` at 12.8px. Inserting
  an eleventh step there would rename every step below `x-small`: DDR-022 names the scale after
  CSS's own absolute-size keywords and already had to invent `xxxx-small` at the bottom, so a step
  between 11px and 12.8px has no name left to take. That is a change to every stylesheet and to
  DDR-022's whole table, for 0.8px — about the width of the hairline above it. DDR-022 has the
  precedent for the other direction too: it reads a credential's name at 15px where the file draws
  14px, because a pattern mattered more than a pixel.
* **20px is on no step of DDR-013's scale**, whose defining property is that each step is twice the
  one below: 4, 8, 16, 32, 64. A 20px gap between three right-aligned addresses would either be a
  literal, which ADR-001 forbids a component, or a token off the scale, which is the thing DDR-013
  exists to prevent — "a value not on this scale is a decision to make, not a number to write".
  DDR-010 made the same call for the timeline's dot, taking the smallest step of the scale rather
  than the UI Review's 3px. Measured on the built page the three addresses sit 16.1px apart.

### The space above the hairline is the page's, not the design's

The design puts 16px between the last language card and the footer's line. The page puts 64px,
because `main` ends with `--page-padding-block` and the footer follows it. That is a **recorded
difference, not a decision to keep it**: closing it means making the page's bottom padding
asymmetric, which is DDR-013's symmetry and DDR-014's role token, guarded by a test in
`app/globals.test.ts`, and reached by the whole page rather than by the footer. It is the kind of
page-level change #99 is for, and it costs nothing to leave until then.

On paper the question does not arise: `--page-padding-block` is `0` in print, so the footer begins
exactly where `main` ends and its own 24pt of padding is the whole of the space. Measured under
print emulation, `main`'s bottom and the footer's top are the same coordinate.

### The footer prints, where `nav` does not

`app/globals.css` hides `nav` on paper, because in-page navigation leads nowhere there. The footer
is the opposite case: it is the only place the printed CV will carry a contact address once #97
lands, so it prints, and nothing in this stylesheet hides it.

Two consequences follow and both are decided here:

* **Each address is printed once, with no `mailto:` after it.** `app/globals.css` prints every
  outbound link's address after its text, which would set `aortegablasi@gmail.com
  (mailto:aortegablasi@gmail.com)`. The footer answers it the way the introduction's pills already
  do, with `content: none` on the link's `::after` — the link's text *is* its address, per DDR-006.
* **The hairline does not print, and this stylesheet writes no rule for that.** `--color-border` is
  `transparent` inside the print block in `app/tokens.css`, per DDR-015, so the footer's line goes
  the way the section divider and the timeline's spine already go, at the token layer. The space
  stays.

Until #97 lands, each address is on the sheet **twice** — once from its contact pill and once from
the footer. That is the transitional state the two stories were split into and it is stated here
rather than hidden: #97 removes the first of the two.

### What it measures

Printed to A4 through WebDriver in Edge 153 and Firefox 156 with background graphics **on**, and
printed again from the tree this branched from:

| | Sheets | Section headings | Addresses in the PDF | Longest horizontal run of ink |
| --- | --- | --- | --- | --- |
| Edge, with the footer | 5 | none stranded, same sheet as before | 3, once each, no `mailto:` | 3% of the sheet |
| Edge, the tree this branched from | 5 | — | the pills' 3 | 3% of the sheet |
| Firefox, with the footer | 5 | none stranded, same sheet as before | 3, once each, no `mailto:` | 3% of the sheet |
| Firefox, the tree this branched from | 5 | — | the pills' 3 | 3% of the sheet |

**Five sheets, before and after, in both browsers.** Every section heading falls on the same sheet
it fell on before — Experience 1, Projects 2, Skills 4, Education 4 in Edge and 5 in Firefox,
Languages 5 — and each is followed by its first item. No item is split. The footer's name lands on
sheet 5 in both. No run of ink wider than 3% of any sheet, which is the check that would find a
printed hairline; the last inked row moves down 78px in Edge and 86px in Firefox at 150dpi, which is
the footer's own line and its padding and nothing else.

Read back through pypdf and pdfium, in both browsers: no replacement character, no `mailto:`
anywhere, and the three addresses each returned exactly once more than the tree this branched from.
Of the 442 distinct words the page shows, Edge gives back all but "Get", from the CV control print
hides. Firefox also wraps "Copilot-driven" and "data-driven" at their hyphens, and pypdf alone
spells out the three level badges, which is DDR-024's tracking and is there before this change —
the same six words are missing from the baseline PDF, word for word.

On screen, measured on the built page at the browser's default font size and at double it, at every
width from 300px to 1536px: nothing overflows and nothing scrolls sideways. The row wraps on its
own, with no breakpoint — the addresses drop under the name below about 540px and stand one to a
line below about 340px — and the addresses themselves wrap within a line at 200% text below 390px.

**One declaration exists only for that last case.** `overflow-wrap: anywhere` on the link, which the
introduction's pills need for the same reason: a flex container is never laid out narrower than its
content's min-content width, and the `break-word` the base styles give every word does not enter
that calculation where `anywhere` does. Without it the GitHub address is 320px wide in a 273px
column at a 320px viewport with text at 200%, and the page scrolls sideways — which DDR-014 forbids
at any text size.

### Targets

The three addresses are targets, and they extend DDR-027's table:

| Target | Box | 2.5.8 |
| --- | --- | --- |
| The email address | 145.9 × 19.2 | by the spacing exception |
| The LinkedIn address | 157.6 × 19.2 | by the spacing exception |
| The GitHub address | 160 × 19.2 | by the spacing exception |

Each is under 24px tall, so each is undersized and each depends on the exception, as seven of
DDR-027's eleven already do. Swept every 10px from 300px to 900px at both text sizes, the closest
two footer targets ever come is **27.2px centre to centre** and **17.6px centre to box**, against the
24px and 12px the exception asks. No pair on the whole page fails at any width in the sweep.

Each link is `display: inline-flex`, as a contents link and a project's link are, per DDR-027: the
box is then the whole line the address sets in, 19.2px, rather than the shorter content area an
inline box would give it. The `row-gap` on the wrapping row is what holds two wrapped addresses
apart, and it is the same measure and the same reason as the contents row's.

### The name is the site's only Lora Regular

DDR-023 narrows the serif to the `h1` and the `h2`, and the footer's name is the one place outside
them the design draws it. It is a paragraph rather than a heading, so it takes the regular weight
from `body` and joins no outline, and `footer.module.css` writes the family and nothing else.

`app/layout.tsx` now lists `lora-latin-400-normal.woff2`, which DDR-023 committed for this story and
left unlisted because `next/font` preloads every file it is given. Every file in `app/fonts/` is now
loaded, and `app/layout.test.tsx` holds the two sets equal, so a file committed for a story still to
come fails the suite rather than shipping as 21 KB nobody fetches on purpose.

## Alternatives Considered

### Option A — the footer, with its links underlined

Pros:

* It is the only cue these links would have. The addresses are the same ink as the name beside them,
  so nothing else the eye is given separates a link from text.
* DDR-025 did exactly this one story ago, for the contents links, and the owner accepted it: "at
  4.44:1 the colour is the last thing that should have to say a link is a link, and it is the one
  place DDR-025 does not follow the file". At 2.39:1 the case is stronger, not weaker.
* One declaration, reversible in a line.

Cons:

* The design does not draw it, and the owner's ruling is that the design prevails. Two deviations of
  the same kind in two consecutive records starts to be a policy rather than an exception.
* An address is not a section title: the string itself says it can be reached, which is the cue a
  contents link's label cannot carry.
* Three underlined addresses in the faintest ink on the page are a heavier mark at the foot of the
  sheet than the design's, and the footer is meant to be quiet.

### Option B — keep DDR-010's rejection

Pros:

* The addresses really are already on the page, in controls that identify themselves properly.
* No new surface, no new failing pairing, no extra line on the printed CV.

Cons:

* The design draws a footer, and the owner has decided the design prevails. This is exactly the kind
  of rejection Epic #70 was rewritten to reverse.
* It leaves #97 with nowhere to put the addresses. The printed CV would lose the owner's email
  address entirely, which DDR-010 itself calls the reason the pills cannot be labelled.

### Option C — the footer in `app/layout.tsx` rather than in the page

Pros:

* A site-wide footer belongs to the document shell, and every future route would get it for free.
* `app/page.tsx` would keep returning a single `main`.

Cons:

* `app/layout.tsx` imports `content/site.ts` and nothing else; wiring the introduction's records
  through it would put content composition in two places, where ADR-002 has `app/page.tsx` import
  the content and hand it to the components.
* The site has one route, so "every route" is this one.

### Option D — a content module of its own for the footer

Pros:

* The footer's strings would be its own, and a future footer that says something else would have
  somewhere to say it.

Cons:

* It would restate the owner's name and three addresses that already exist in
  `content/introduction.ts`, which is two hand-maintained copies of the same facts — the thing
  ADR-002 and `content/cv.test.ts` exist to prevent.
* The acceptance criteria ask for the opposite: reuse the contact records the introduction already
  has.
* The design's footer says nothing the introduction does not. A footer that one day does is the
  story that adds the module.

## Consequences

Benefits:

* The addresses are reachable at the foot of a 3.9m page without scrolling back to the top.
* #97 becomes possible: the printed CV will still carry the email address, the LinkedIn address and
  the GitHub address in full once the pills are labelled.
* It costs no sheet, moves no heading, splits no item and prints no line.
* It adds no token, no content module and no string, and the only font file it adds was committed
  for it two stories ago.

Tradeoffs:

* **Three more lines of text at 2.39:1**, which fails WCAG 1.4.3. That is the design's ink and
  DDR-025's decision, not a new one, but this record is where the page's share of it grows.
* **Three links with no visual cue that they are links**, as above. This is the record's weakest
  point and Option A is one declaration away.
* Each address is on the printed sheet twice until #97 lands.
* The space above the hairline is the page's 64px rather than the design's 16px, recorded above and
  left to #99.
* DDR-010 loses a sentence that was right on its own terms: with labelled pills out of the question,
  a footer really did repeat the introduction and carry nothing new. What changed is the owner's
  decision and the story that now depends on it.

Risks:

* **The footer is the last thing in the tab order and the quietest thing on the page.** A reader who
  never reaches it loses nothing today, because the pills are above; from #97 they lose the
  addresses. #97 should weigh that when it decides what a labelled pill's accessible name says.
* **A second row of footer content would need a layout decision.** The row is `space-between` with
  wrapping and no breakpoint, which works for one name and three addresses and is not a pattern for
  a footer with columns.

## Related Documents

* `docs/decisions/design-decisions/DDR-010-career-page-redesign-structure.md`, whose "There is no
  footer" this supersedes and whose contact-address rule depends on what this decides about print
* `docs/decisions/design-decisions/DDR-012-colour-system.md`, which made the underline what
  identifies a link, and `DDR-025-colour-system.md`, which supersedes it, defines the three inks and
  the hairline this uses, and kept the contents links' underline against the design
* `docs/decisions/design-decisions/DDR-013-spacing-and-layout.md`, whose scale the gap is taken from
  and whose page column the footer reads
* `docs/decisions/design-decisions/DDR-015-print-treatment.md`, which drops every hairline at the
  token layer, so this stylesheet writes no print rule for its line
* `docs/decisions/design-decisions/DDR-022-type-scale.md`, whose ten steps have no 12px, and
  `DDR-023-typefaces-weights-and-styles.md`, which committed Lora Regular for this story
* `docs/decisions/design-decisions/DDR-027-target-sizes.md`, whose table of targets this extends
* `docs/decisions/architecture-decisions/ADR-002-content-model-and-authoring-approach.md`, which
  keeps every string in `content/` and has the page import the content and pass it to the components
* GitHub issue #96, and Epic #70, which closes the gaps between the page and the design
* GitHub issue #97, which labels the contact pills and depends on this, and #99, which rechecks the
  printed page
* Figma, `career-site-design`: nodes 2:687, 2:688, 2:690, 2:693, 2:696 and 2:699
