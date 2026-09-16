# DDR-001-Typographic System

Status: Accepted

Date: 2026-09-10

DDR-007 supersedes this record's choice of variable font files: each family is now served as one
static file per weight, because Firefox draws variable fonts as outlines in a saved PDF (#22).
The rest of this record stands.

DDR-009 adds a rule to this system: the page sets no ligatures, because Firefox writes a ligature
into a saved PDF as the replacement character (#40). It also drops U+02BB and U+02BC from Source
Serif 4's subset, for the same reason.

## Context

Almost everything a visitor sees on this site is text. ADR-002 established a single scrolling
page of structured records, such as roles, projects, skills, and credentials. Each record has a
title, some metadata such as dates and places, and a short description. The same ADR made the
page the CV, so it is also printed and saved as a PDF. Typography therefore carries most of the
design, and it forms a visitor's impression of the site before they have read a sentence.

Without a decided system, each new section picks sizes that looked right when it was written.
The drift is invisible while authoring and obvious once the page is read as a whole. Issue #10
asks for one decision covering typefaces, a size scale, weights, line heights, and measure,
expressed as tokens that every later page uses.

The constraints are:

* **ADR-001**: fonts are self-hosted, preloaded, and subset where practical, with no
  render-blocking third-party font request. Design values are CSS custom properties defined once
  at the root.
* **Accessibility**: body text is at least 16px at its base size, and no text is smaller than
  12px. Text stays readable and unclipped when the browser font size is raised to 200%.
* **ADR-002**: descriptions are plain strings, with no emphasis, links, or inline formatting.
  The type system needs no italics and no rich-text styles.
* **Proper names**: content will include the names of people, companies, institutions, and
  places, so the character set must cover accented Latin letters, not only ASCII.

These are out of scope and decided elsewhere: colour (#11), spacing between elements (#12), how
the scale adapts across viewport sizes (#13), and print treatment (#14).

## Decision

### Typefaces

The site uses two families from one superfamily, both variable-weight fonts:

| Role                                    | Typeface       | Fallback stack, in order                                       |
| --------------------------------------- | -------------- | -------------------------------------------------------------- |
| Body text, metadata, and everything else | Source Sans 3  | Metric-adjusted Arial, then `system-ui`, then `sans-serif`     |
| Headings, `h1` to `h6`                  | Source Serif 4 | Metric-adjusted Times New Roman, then Georgia, then `serif`    |

**Source Sans 3** is a humanist sans-serif that Adobe designed for user interfaces and running
text. Its open letterforms stay legible at small sizes, which matters for a page dense with
titles, dates, and short descriptions.

**Source Serif 4** was designed as Source Sans's companion. It gives the page title and headings
a considered voice, and it reads like a well-set document on paper, which suits a page that is
also the CV. Pairing two faces from one superfamily avoids the clashing proportions that come
from combining faces by different designers.

Both fonts are licensed under the SIL Open Font License 1.1, which permits committing and
serving them.

The owner chose this direction from the four options set out under Alternatives Considered.

**Loading.** Both font files are committed to `app/fonts/`, each with its licence, and loaded
with `next/font/local`. This self-hosts and preloads them on every page. It also generates a
fallback whose metrics are adjusted to the named system font, so the page does not shift when
the web font arrives. Text uses `font-display: swap`: it renders at once in the fallback and is
never invisible while the font loads.

* **Latin subset only.** This covers Basic Latin, Latin-1 Supplement, and common punctuation
  and symbols, which includes Western European accented letters. Latin Extended is not loaded.
* **Weight axis only.** The optical-size axis of Source Serif 4 is not loaded.
* **No italics**, because ADR-002's plain strings leave nothing to italicise. If emphasis is
  ever needed, add the italic files rather than relying on obliques synthesised by the browser.
* **Payload.** The two files total about 80 KB: Source Sans 3 is 29 KB and Source Serif 4 is
  51 KB.

Superseded by DDR-007: the variable files are replaced by static files pinned to the two weights
below, with the same letterforms, subset, and loading.

### Type scale

The scale has five named steps. They follow a major-third ratio (1.25) from the body size,
rounded to readable values. The names follow CSS's own absolute-size keywords.

| Token                  | Size     | At the 16px browser default | Used for                                      |
| ---------------------- | -------- | --------------------------- | --------------------------------------------- |
| `--font-size-small`    | 0.9rem   | 14.4px                      | Metadata such as dates, places, and labels; `small` |
| `--font-size-medium`   | 1.125rem | 18px                        | Body text; `h4` to `h6`                       |
| `--font-size-large`    | 1.4rem   | 22.4px                      | `h3`, an item title such as a role or project |
| `--font-size-x-large`  | 1.75rem  | 28px                        | `h2`, a section heading                       |
| `--font-size-xx-large` | 2.2rem   | 35.2px                      | `h1`, the page title                          |

* **Sizes are in rem**, so the whole scale follows the reader's browser font-size setting. No
  font size is set in px.
* **Body text is 18px**, not the 16px browser default. Source Sans 3 has a smaller x-height
  than common system sans-serifs such as Arial, so it looks smaller than they do at the same
  nominal size. At 18px it reads comfortably.
* **The smallest step is 14.4px**, above the 12px floor. No text is set smaller than
  `--font-size-small`.
* **Five steps is enough.** The page has three levels of heading (page, section, and item),
  plus body text and metadata. `h4` to `h6` are set at body size and are distinguished from
  body text by face and weight. A larger scale would invite steps chosen at random.
* **The scale is fixed.** How the steps adapt across viewport sizes is decided in #13. Any other
  new size is added by superseding this DDR, not by writing a literal value.

### Weights

There are two weights. **400** (`--font-weight-regular`) is for body text. **600**
(`--font-weight-semibold`) is for headings and for `b` and `strong`.

The variable fonts could render any weight from 200 to 900. Limiting the site to two keeps
hierarchy carried by size and typeface rather than by a gradient of weights.

### Line height

* **`--line-height-body: 1.5`** is for running text and metadata. WCAG recommends at least 1.5
  within paragraphs (1.4.8, level AAA), and it is comfortable at 18px.
* **`--line-height-heading: 1.2`** is for headings. They are larger and short, and at 1.5 a
  heading that wraps would look like two separate lines.

Both are unitless, so they scale with the font size they apply to.

### Measure

Paragraphs and list items are at most **65ch** wide (`--measure`), which sits within the
conventional range of 45 to 75 characters per line for comfortable reading.

The ch unit is the width of the zero character in the current font, so the measure grows and
shrinks with the text. It holds at any zoom level or font-size setting. On a viewport narrower
than the measure, text simply fills the width available.

### Wrapping

* **Headings use `text-wrap: balance`.** A heading that wraps, such as a long job title or the
  page title on a narrow screen, breaks into lines of similar length instead of leaving one word
  on the last line.
* **Paragraphs and list items use `text-wrap: pretty`**, which avoids a single word on the last
  line where the browser supports it.
* **The body uses `overflow-wrap: break-word`**, so long unbroken strings such as URLs and email
  addresses wrap instead of overflowing when text is enlarged.

These are progressive enhancements. A browser that does not support them wraps text normally.

### Where the system lives

* `app/tokens.css` holds the tokens, defined once at `:root`.
* `app/globals.css` holds the base element styles that apply the tokens to plain HTML.
* `app/layout.tsx` loads the fonts and defines their fallback stacks.
* `app/fonts/` holds the font files and their licences.

Components use the tokens. No component sets a literal font size, family, weight, or line
height.

## Alternatives Considered

The first four options were the typeface directions offered to the owner.

### Option A: Inter throughout

Pros:
* A single font file.
* Excellent legibility on screen, with a large x-height and tabular figures for dates.

Cons:
* It is used across so much software and so many websites that it reads as neutral or generic
  rather than personal.
* With a single face, hierarchy can come only from size and weight.

### Option B: IBM Plex Sans throughout

Pros:
* A single font file.
* A distinctive, engineered character.

Cons:
* Its stronger personality can compete with the content.
* It projects a particular professional identity, which is for the content to establish, not
  the typeface.

### Option C: System fonts only, with no web fonts

Pros:
* Nothing to download, so text renders instantly.
* A native feel on every platform.

Cons:
* A different typeface on each platform, such as San Francisco, Segoe UI, or Roboto. The scale,
  measure, and line breaks cannot be tuned to one set of metrics.
* Print output varies from machine to machine, although the page is the CV.
* Nothing distinguishes the site.

### Option D: Serif for body text, sans-serif for headings

Pros:
* A serif body reads like a printed document.

Cons:
* The page is mostly short structured records rather than long-form reading. A sans-serif is
  clearer for small metadata such as dates and places, particularly on lower-resolution
  screens.

### Loading the fonts from Google Fonts at build time

This means using `next/font/google` instead of committing the font files.

Pros:
* No binary files in the repository, and subsetting is automatic.
* The same result at runtime: the fonts are still self-hosted and preloaded, with no request from
  the browser to Google.

Cons:
* Every build downloads the fonts from Google, so building depends on a third-party service and
  on network access.
* The font version can change between builds without any commit.

Rejected because committed files keep builds reproducible and able to run offline. That suits a
site that is changed only a few times a year, which ADR-001 names as a governing constraint.

### Loading Source Serif 4's optical-size axis

Pros:
* Letterforms drawn specifically for display sizes in headings.

Cons:
* The file grows from 51 KB to 122 KB, for a refinement that is visible mostly at the largest
  sizes.

## Consequences

Benefits:
* A small vocabulary for every page: five sizes, two weights, two line heights, and one measure.
  Later work chooses from it instead of inventing values.
* Accessibility is a property of the system rather than of individual pages. Body text is 18px,
  the smallest text is 14.4px, sizes in rem follow the reader's settings, and the measure in ch
  holds at 200%.
* The serif and sans-serif pairing gives the page character, stays legible, and prints well.
* About 80 KB of fonts, self-hosted and preloaded, with metric-adjusted fallbacks. There is no
  dependency on a font service when building or serving the site.

Tradeoffs:
* Two font files instead of one.
* Only the Latin subset is loaded. Characters outside it, such as some Central European or
  Turkish letters, render in the fallback font. Adding the Latin Extended files is the remedy if
  real content needs them.
* There are no italics.
* Updating a font means replacing the committed files by hand.
* The sizes are fixed until #13 decides how they adapt. On a phone, the 35.2px page title may
  wrap to two lines. On a 320px screen with the browser font size at 200%, one long word in a
  heading can be wider than the whole line, such as "Infrastructure" in an `h3`. The word then
  breaks in the middle. Nothing is clipped and the text stays readable, but it looks poor. #13
  should fix this, for example by using smaller heading steps on narrow viewports.

Risks:
* The scale was set against placeholder text. Real job titles and company names may wrap
  awkwardly at `--font-size-large`, as issue #10 warns. The scale should be reviewed once real
  content lands, and changing it means superseding this DDR.
* Browsers implement `text-wrap: balance` and `text-wrap: pretty` differently. They improve
  wrapping but do not guarantee a particular result.

## Related Documents

* GitHub issue #10, which this decision resolves
* GitHub issue #2, Design Foundation
* ADR-001, which set the styling approach and the font performance constraints
* ADR-002, which made content plain strings and the page the CV
* GitHub issues #11 (colour), #12 (spacing and layout), #13 (responsive strategy), and #14
  (print), which build on this system
* DDR-007, static font files, which supersedes this record's choice of variable font files
