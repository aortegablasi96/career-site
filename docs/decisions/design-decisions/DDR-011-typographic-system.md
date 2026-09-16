# DDR-011-Typographic System

Status: Accepted

Date: 2026-09-16

Supersedes DDR-001, the typographic system, and with it the two records that amended it: DDR-007,
static font files, and DDR-009, no ligatures. All three were about the two Source families, which
the redesign replaces, so the files DDR-007 lists and the character-map edit DDR-009 makes no
longer exist. What each of them decided is carried forward here, restated for Lora and DM Sans and
re-established by the same kind of inspection.

DDR-017 adds tracking to this system: three values, in em, for the two headings the page sets large
and the four short labels. This record says nothing about the space between letters, and that gap
is what DDR-017 fills; everything below stands unchanged, including the PDF guarantee, which
DDR-017 re-checks because tracking is a way to lose it that has nothing to do with glyph mapping.

DDR-018 amends this record in two smaller places. It adds a use to the **weights** table below: 600
is now the headings, `b` and `strong`, *and* the timeline's date range and a level badge, because
the design draws those labels bold and 700 is a weight this record ships no file for. And it
restates the **PDF guarantee** once, precisely — a PDF spells every word as the page *draws* it, and
from DDR-018 the page draws three labels in capitals. The sizes, families, weights, floor, line
heights, measure and wrapping are untouched.

DDR-001's rem sizing, its measure, its no-italics rule and its wrapping rules carry forward
unchanged. DDR-007's rule — one static file per weight, derived by pinning the variable font —
carries forward unchanged. DDR-009's guarantee carries forward, and is widened: it now covers every
font feature that would substitute a glyph no character maps to, not ligatures alone.

## Context

Epic #42 adopts the redesign the owner made in Figma, and the UI Review on #43 is its contract.
The review adopts the draft's typefaces, **Lora** for headings and **DM Sans** for everything else,
and a denser scale that the old page had no use for: the redesigned page has tags, level badges and
a date column, which a single 65ch column of prose did not.

The draft cannot be taken as it stands. It breaks its own brief in three ways that are this story's
to fix:

* It loads both families from the Google Fonts CDN, and DM Sans there is a variable font. DDR-007
  exists because Firefox draws a variable font as outlines when it saves a PDF, which left the
  printed CV unselectable and unsearchable (#22). A network fetch at build time is ruled out by
  ADR-001 as well.
* It sets text at 10px, 11px, 12px and 13px. Six of its sizes are below the current site's 14.4px
  floor and two are below the 12px floor DDR-001 set.
* Its own follow-up prompt asked for a contrast check on every pairing. That step was never run;
  DDR-012 deals with what it would have found.

The sharpest constraint is DDR-009's. It made every one of the page's words come out of a PDF saved
in Firefox exactly as it reads, and it won that by inspecting Source Serif 4's character map. That
guarantee is about those two faces. Adopting new ones does not inherit it — it voids it — so the
same inspection has to be done again before Lora and DM Sans can be accepted.

The constraints are:

* **ADR-001**: fonts are self-hosted, preloaded, and subset where practical, with no
  render-blocking third-party font request and no network access needed to build. Design values
  are custom properties defined once at the root.
* **ADR-002**: the page is the CV, so what a browser writes into a PDF is part of the design, and
  descriptions are plain strings with no emphasis or inline formatting.
* **WCAG 2.2 AA**, restated as hard constraints by the brief: text stays readable and unclipped at
  200%.
* **Proper names**: the content holds the names of people, companies, institutions and places, so
  the character set must cover accented Latin letters, and the apostrophe in "Master's degree"
  must come back out of a PDF as the character the page is written with.

## Decision

### Typefaces

| Role                                     | Typeface    | Fallback stack, in order                                    |
| ---------------------------------------- | ----------- | ----------------------------------------------------------- |
| Body text, metadata, and everything else | **DM Sans** | Metric-adjusted Arial, then `system-ui`, then `sans-serif`  |
| Headings, `h1` to `h6`                   | **Lora**    | Metric-adjusted Times New Roman, then Georgia, then `serif` |

Both are adopted from the Figma design and both are licensed under the SIL Open Font License 1.1,
which permits committing and serving them.

**DM Sans** is a low-contrast geometric sans with a large x-height, which is why body text can drop
from DDR-001's 18px to 16px without reading smaller. **Lora** is a contemporary serif with
brushed curves; it gives the page title and the section headings the considered voice DDR-001
wanted from Source Serif 4, and it reads as a set document on paper.

The two are not from one superfamily, as Source Sans 3 and Source Serif 4 were. They are paired
here because the design pairs them, and because a serif heading over a geometric sans is a
conventional pairing rather than an invented one.

### How the files are prepared

DDR-007's rule stands, restated for the new faces. Each family is served as **one static file per
weight**, committed to `app/fonts/` with its licence and loaded by `next/font/local`:

| File                             | Font              |
| -------------------------------- | ----------------- |
| `dm-sans-latin-400-normal.woff2` | DM Sans Regular   |
| `dm-sans-latin-500-normal.woff2` | DM Sans Medium    |
| `dm-sans-latin-600-normal.woff2` | DM Sans SemiBold  |
| `lora-latin-600-normal.woff2`    | Lora SemiBold     |

**Lora exists only at 600**, because headings are the only thing set in it and headings are always
semibold. A weight with no file would be substituted or synthesised by the browser, so the files
are exactly the weights the page sets and no more. Adding a weight means adding its file and
revising this record.

**The recipe**, unchanged from DDR-007 but without its character-map step:

1. Take the Fontsource variable file for the Latin subset — `@fontsource-variable/dm-sans`'s
   `dm-sans-latin-wght-normal.woff2` and `@fontsource-variable/lora`'s
   `lora-latin-wght-normal.woff2`. DM Sans is also published with an optical-size axis; the
   weight-only file is the one used, as DDR-001 declined the optical-size axis for the same reason.
2. Pin it to the weight with fontTools' instancer.
3. Name it: family, weight name, full name and PostScript name, so a PDF names the font it embeds.
4. Save it as WOFF2 under the file name above.

DDR-009 added a fifth step for Source Serif 4, deleting the U+02BB and U+02BC entries from its
character map. **Neither of these faces needs it**, and the inspection below is why.

* **Latin subset only**, covering Basic Latin, Latin-1 Supplement and common punctuation. Lora
  reaches 226 characters and DM Sans 222, from U+000D to U+2215. The Cyrillic, Vietnamese, math and
  symbol subsets Lora publishes, and the Latin Extended subsets both publish, are not loaded.
* **No italics.** DDR-001's rule stands, and the redesign keeps it: the UI Review sets the draft's
  italic thesis sentence in the secondary ink instead, which saves a file and a derivation.
* **Payload.** The four files total about 65 KB, down from about 72 KB.

### A PDF spells every word as the page does

DDR-009 established this guarantee for the Source families. It is re-established here for Lora and
DM Sans, and widened, because the new faces fail in a different place.

**The rule.** `app/globals.css` sets, on `body`, where both inherit to everything:

```css
font-variant-ligatures: none;
font-feature-settings: 'calt' 0;
```

**Why.** A glyph that no character maps to has nothing in the font to say what it stands for, so
when Firefox writes it into a PDF it writes U+FFFD, the replacement character. The word then cannot
be searched for, copies damaged, and is read aloud damaged (#40). Every default-on feature of both
faces was inspected for substitutions that produce such a glyph:

| Feature  | On by default | Lora                                        | DM Sans                                          |
| -------- | ------------- | ------------------------------------------- | ------------------------------------------------ |
| `liga`   | Yes           | `fi`, `fl` — both unmapped                  | `fi`, `fl` — both unmapped                       |
| `calt`   | Yes           | a raised colon after a digit — unmapped     | arrows and quotes from typed tokens — unmapped   |
| `ccmp`   | Yes           | `.case` marks and dotless j — cannot fire   | dotless j — cannot fire                          |
| `locl`   | Yes           | Turkish i, Catalan middle dot — cannot fire | Turkish i, Catalan Ldot — cannot fire            |
| `frac`, `pnum`, `tnum`, `numr`, `dnom` | No | not applied | not applied                          |

`liga` and `calt` are switched off. `ccmp` fires only on a combining mark, and the content uses
precomposed characters; `locl` fires only for a language tag, and the document is `lang="en"`. The
opt-in features are never requested.

**`calt` is why the rule is wider than DDR-009's.** Ligatures alone would not have been enough.
Lora's contextual alternates raise a colon, and the glyph they raise it to is unmapped, so a colon
in a heading would have come out of a PDF as U+FFFD. No heading has a colon today, which is exactly
why the fault would have arrived silently. Neither face loses anything worth keeping: DM Sans uses
`calt` only for icon tokens such as `arrow_right`, which no content types.

**The second fault DDR-009 fixed does not occur.** Source Serif 4 mapped one glyph from two
different characters, so Firefox read the apostrophe in "Master's degree" back as U+02BC rather
than the U+2019 the page is written with, and no CSS could reach it. **Neither Lora nor DM Sans maps
any glyph from more than one character** — 226 glyphs from 226 characters, and 222 from 222 — so no
character-map edit is needed and the files are the upstream ones pinned and named.

**Verified on the built page.** Printed to A4 from Firefox 156 and Edge 153 through WebDriver, and
the text read back out of both PDFs: **zero replacement characters**, and every one of the 486
distinct tokens the page shows found in both. The apostrophe reads back as U+2019.

### Type scale

Seven steps, named as CSS names its own absolute sizes, with `medium` the browser default.

| Token                   | Size       | At the 16px default | Used for                                |
| ----------------------- | ---------- | ------------------- | --------------------------------------- |
| `--font-size-x-small`   | 0.8125rem  | 13px                | Technology tags and level badges        |
| `--font-size-small`     | 0.875rem   | 14px                | Metadata: dates, places, bullet text    |
| `--font-size-medium`    | 1rem       | 16px                | Body text; `h3`, an item title; `h4`–`h6` |
| `--font-size-large`     | 1.125rem   | 18px                | The positioning line; `h2` narrow       |
| `--font-size-x-large`   | 1.375rem   | 22px                | `h2`, a section heading                 |
| `--font-size-xx-large`  | 2.25rem    | 36px                | `h1` narrow                             |
| `--font-size-xxx-large` | 3rem       | 48px                | `h1`, the page title                    |

* **Sizes are in rem**, so the whole scale follows the reader's browser font-size setting. No font
  size is set in px. This is DDR-001's rule and it does not change.
* **Body text is 16px**, not DDR-001's 18px and not the draft's 15px. DM Sans has a larger x-height
  than Source Sans 3, so 16px DM Sans reads about as large as 17px of the face it replaces.
* **The scale is not one ratio.** DDR-001 generated five steps from a major third. These seven are
  the sizes the design asks for: close together at the bottom, where short labels sit, and open at
  the top, where the name sits. A generated scale would not have produced a 13px step and a 48px
  step in the same system.
* **Seven steps, because the layout has seven roles.** The page now has tags, badges and a date
  column, which a single column of prose did not.
* **An item title is body size.** A role's job title and a project's name are `h3`s set at 1rem.
  They are told apart from the text around them by the serif face, the weight and their position,
  not by size. This is the densest part of the redesign and the reason the page is shorter.

### The floor is 13px

DDR-001 set a 12px floor and never went below 14.4px. The draft goes to 10px. This record puts the
floor at **13px**, and allows it only for the technology tags and the level badges.

Those two are short, repeated labels whose meaning is also carried by the words around them: a tag
is one technology in a row of technologies under a project's name, and a badge is one of three
words, Advanced, Proficient or Basic. Dates and places, which a recruiter actually reads, sit at
14px.

**This is a real loss and it is recorded rather than absorbed.** It is the price of the density that
makes the page look edited rather than typed, and a reader who enlarges text is enlarging from a
lower base than before.

### Weights

Three, where DDR-001 had two.

| Token                    | Weight | Used for                                             |
| ------------------------ | ------ | ---------------------------------------------------- |
| `--font-weight-regular`  | 400    | Body text                                            |
| `--font-weight-medium`   | 500    | The positioning line, the contents links, tags, badges |
| `--font-weight-semibold` | 600    | Headings, `b` and `strong`, and the labels DDR-018 sets |

500 is the one addition. The draft uses it for everything that is neither running text nor a
heading, and without it those elements would have to reach for 600, which belongs to headings.

### Line height, measure and wrapping

Unchanged from DDR-001, which is why they are listed rather than argued:

* `--line-height-body: 1.5` and `--line-height-heading: 1.2`, both unitless.
* `--measure: 65ch`, applied to `p` and `li`. What changes is that the measure no longer sets the
  page's column: DDR-013 makes the column wider, and the measure now governs running text alone.
* `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs and list items,
  `overflow-wrap: break-word` on the body.

### Where the system lives

`app/tokens.css` holds the tokens, `app/globals.css` applies them to plain HTML, `app/layout.tsx`
loads the fonts, and `app/fonts/` holds the files and their licences. `app/tokens.test.ts` holds the
scale, the floor, the weights and the families to this record; `app/globals.test.ts` holds the two
font-feature declarations; `app/layout.test.tsx` holds the files to one per weight. No component
sets a literal font size, family, weight or line height.

## Alternatives Considered

### Option A: Keep Source Sans 3 and Source Serif 4, and take only the new scale

Pros:
* DDR-007's files and DDR-009's guarantee carry over untouched, with no re-derivation and no
  re-inspection.
* Nothing to download and nothing to license.

Cons:
* It is not the design. The owner decided on Epic #42 that where the Figma design and a record
  disagree, the design prevails, and the typefaces are the most visible thing the design changes.
* The scale would not fit: it is built on DM Sans's x-height, and 16px Source Sans 3 reads smaller
  than 16px DM Sans.

### Option B: Load Lora and DM Sans from the Google Fonts CDN, as the draft does

Pros:
* No binary files in the repository, and it is what the draft's stylesheet already says.

Cons:
* DM Sans there is a variable font, which reintroduces #22: a CV saved from Firefox could not be
  selected, copied or searched.
* Every build would depend on a third-party service and on network access, which ADR-001 rules out
  for a site changed a few times a year.

### Option C: Take the static files Fontsource publishes, rather than deriving them

Pros:
* Files built upstream rather than derived here.

Cons:
* A separately built font whose metrics or hinting may differ from the variable file the fallback
  metrics were checked against.
* DDR-007 rejected this for the same reason, and nothing about the new faces changes it.

### Option D: Keep the 14.4px floor, and set tags and badges at 14px

Pros:
* No floor is lowered, and no accessibility ground is given up.

Cons:
* A tag row at 14px is nearly the size of the description under it, so the tags stop reading as
  labels and start reading as text. The density is the point of the redesign.
* It was weighed and rejected in the UI Review, which the owner approved.

### Option E: Switch `calt` off in print only

Pros:
* The screen keeps whatever contextual alternates the faces offer.

Cons:
* Neither face offers anything on this page: the arrows need typed tokens and the raised colon
  needs a colon there is none of.
* Screen and paper are the same document, per ADR-002, and DDR-009 rejected a print-only ligature
  rule for exactly this reason.

## Consequences

Benefits:
* The page carries the design's own voice: a serif that reads as a document and a sans that stays
  legible at 13px.
* A PDF saved from either browser yields every word of the page exactly as it reads, with no
  replacement characters and no substituted apostrophe. The guarantee is now wider than DDR-009's:
  it covers any feature that would substitute an unmapped glyph, not ligatures alone.
* A build from a clean checkout needs no network access for fonts, and about 65 KB is served, down
  from 72 KB.
* Seven steps and three weights give the sections a vocabulary to build from, so a tag or a badge
  does not arrive with a size of its own.

Tradeoffs:
* The smallest text is 13px, down from 14.4px.
* The two faces are not from one superfamily, so their proportions were not drawn to sit together.
* Lora exists only at semibold. A serif at any other weight would be synthesised, so a design that
  wanted one needs a new file and a revision of this record.
* Neither family's ligatures or contextual alternates are used, on screen or on paper.
* Only the Latin subset is loaded, as before.

Risks:
* **The floor.** 13px tags are smaller than anything the site has shown. They are short, repeated
  and redundant with their surroundings, but a reader who enlarges text starts lower.
* **`calt` is switched off globally**, which would also switch off a contextual alternate the site
  later wanted. Neither face has one it wants.
* **Print.** DDR-005 chose its 10pt base so that DDR-001's smallest step came to exactly 9pt. This
  scale reaches lower, so at the same base the tags and badges print at 8.1pt. DDR-005 is #52's to
  rework, and `app/tokens.test.ts` records where the two records stand so the question cannot be
  overlooked.
* **Browsers may change how they write PDFs.** As DDR-005 says, a print change should still be
  checked in both Edge and Firefox, and the check should read the text back rather than look at the
  page.
* **The faces were checked against this content.** A future word, or a colon in a heading, meets
  the same features; the rule above is what makes that safe, and it has to stay.

## Related Documents

* GitHub issue #44, which this decision resolves, and Epic #42, the redesign
* The UI Review on #43, which this implements, and DDR-010, which records its structure
* DDR-001, the typographic system this supersedes, and Epic #2, which produced it
* DDR-007, static font files, superseded here, whose rule and recipe this carries forward
* DDR-009, no ligatures, superseded here, whose guarantee this re-establishes and widens
* DDR-012, DDR-013 and DDR-014, the colour, spacing and responsive records this story writes with it
* DDR-005, the print stylesheet, and GitHub issue #52, which reworks it
* GitHub issues #22 and #40, the two faults in Firefox's PDFs that shaped how the files are prepared
* ADR-001, which set the font performance constraints, and ADR-002, which made the page the CV
