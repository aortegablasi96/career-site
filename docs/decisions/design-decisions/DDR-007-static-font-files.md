# DDR-007-Static Font Files

Status: Accepted

Date: 2026-09-15

Supersedes the part of DDR-001 that chose variable font files. The rest of DDR-001 stands.

## Context

DDR-001 chose Source Sans 3 and Source Serif 4, each loaded as one variable font file with its
weight axis. ADR-002 makes the page the CV, and DDR-005 designs what a browser prints or saves as
a PDF.

The checks for #14 found that a PDF saved from Firefox draws text set in the site's fonts as
outlines rather than as text. It looks and prints correctly, but a reader cannot select, copy, or
search it, for example to copy the email address, and assistive technology cannot read it. #22
tracks the problem, and DDR-005 records it as a risk.

The checks for #22 confirmed the cause. They used Firefox 155.0.1 on Windows 11, through its
WebDriver BiDi print command, on A4:

* **The finished page reproduces it.** The PDF runs to five pages. It embeds only Firefox's own
  bullet font, and yields no text but the bullets. Edge's PDF of the same page embeds the site's
  fonts and yields all of its text.
* **The variable font file is the cause.** A test page set the same line in three fonts: the
  committed variable Source Sans 3, the same font pinned to single weights as static files, and
  Arial. Firefox's PDF embedded the static files and Arial and kept their text. The line set in
  the variable font was drawn as outlines. The family, how it is loaded, and the site's CSS are
  therefore not the cause.

The site does not need a variable font. DDR-001 limits it to two weights, 400 and 600, and the
optical-size axis was never loaded.

## Decision

### One static file per weight

Each family is served as two static font files, one for each weight DDR-001 allows:

| File                                    | Font                    |
| --------------------------------------- | ----------------------- |
| `source-sans-3-latin-400-normal.woff2`  | Source Sans 3 Regular   |
| `source-sans-3-latin-600-normal.woff2`  | Source Sans 3 SemiBold  |
| `source-serif-4-latin-400-normal.woff2` | Source Serif 4 Regular  |
| `source-serif-4-latin-600-normal.woff2` | Source Serif 4 SemiBold |

The four files replace the two variable files in `app/fonts/`. The licence files are unchanged.

### Derived from the variable fonts DDR-001 approved

Each static file is the previously committed variable font pinned to its weight with fontTools'
instancer. The letterforms, metrics, Latin subset, and character set are therefore those DDR-001
chose. Only the fonts' internal names change, to the family and weight, such as "Source Sans 3
SemiBold", so a PDF names the fonts it embeds.

To update a font, take the Fontsource variable file for the Latin subset, pin it to each weight,
name it, and save it as WOFF2 under the same file name.

### Only the two weights exist

A weight other than 400 or 600 now has no file. A browser asked for one would substitute the
nearer weight or synthesise it. DDR-001 already allows only the two, so nothing on the page
changes. Adding a weight means adding its files and revising this record.

### Loading is otherwise unchanged

The files are still committed, loaded with `next/font/local`, preloaded, and shown with
`font-display: swap`, with the same metric-adjusted fallbacks, per DDR-001 and ADR-001. The four
files total about 72 KB, down from about 80 KB.

## Alternatives Considered

### Option A: Keep the variable fonts, and accept the limitation

Pros:
* No change.

Cons:
* A CV saved from Firefox cannot be searched or copied, and assistive technology cannot read it.
  ADR-002 makes the printed page the CV, so this is a defect in the site's main output.

### Option B: Static fonts for print only

Keep the variable fonts on screen, and switch to static files in a `@media print` rule.

Pros:
* The screen keeps variable fonts.

Cons:
* Two sets of files for the same letterforms.
* The print files would not be preloaded, so a page printed soon after loading could print in the
  fallback fonts.
* The screen gains nothing from a variable font, because it uses only two weights.

### Option C: Download static files from Fontsource

Pros:
* Files built upstream rather than derived here.

Cons:
* A separately built font whose metrics or hinting may differ from the variable font DDR-001
  approved and the fallback metrics were checked against.
* It needs network access, where deriving the files from the committed fonts does not.

### Option D: A system font for print

Pros:
* No web font in the PDF at all.

Cons:
* A different typeface on paper from screen, and one that varies by machine. DDR-001 rejected
  system fonts partly because print output would then vary, although the page is the CV.

## Consequences

Benefits:
* A PDF saved from Firefox keeps its text: it can be selected, copied, and searched, and
  assistive technology can read it.
* The page looks as before, on screen and on paper, in every browser.
* About 8 KB less to download.

Tradeoffs:
* Four font files instead of two.
* A new weight needs new files rather than a new value.
* Updating a font takes one more step than copying a file, because the files are derived.

Risks:
* Browsers may change how they print fonts. As DDR-005 says, a print change should still be
  checked in both Edge and Firefox.

## Related Documents

* GitHub issue #22, which this decision resolves
* DDR-001, the typographic system, whose choice of variable font files this record supersedes
* DDR-005, the print stylesheet, which recorded the problem as a risk
* ADR-001, which set the font performance constraints
* ADR-002, which made the page the CV
