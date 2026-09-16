# DDR-009-No Ligatures

Status: Superseded

Date: 2026-09-16

Superseded by DDR-011, the typographic system of the career page redesign. This record's guarantee
— that every word of the page comes out of a saved PDF exactly as it reads — is re-established there
for Lora and DM Sans, and widened to cover every font feature that would substitute a glyph no
character maps to, because in those faces the ligatures are not the only one that would. The
character-map edit below is not carried forward: neither new face maps a glyph from more than one
character, so there is nothing to delete.

Supersedes nothing. It adds a typographic rule to DDR-001's system and a derivation step to
DDR-007's font files, and both records stand.

## Context

ADR-002 makes the page the CV, so what a visitor saves as a PDF is the document they send on.
DDR-007 made Firefox's PDFs keep their text. The checks for #40 found that some of that text is
wrong.

Both families join certain letter pairs into a single glyph, a ligature. Source Sans 3 joins ff,
ft, and fft; Source Serif 4 joins ff, fi, fl, ft, fj, and their three-letter forms. A ligature
glyph is not in the font's character map, because no single character produces it, so when Firefox
writes the glyph into a PDF it has nothing to say the glyph stands for and writes the replacement
character, U+FFFD.

Firefox's PDF of the finished page contained 14 of them. "Microsoft" came out as
"Microso&#xFFFD;" and "Software" as "So&#xFFFD;ware". A reader searching the PDF for either word
finds nothing, copying a line gives damaged words, and a screen reader reads the damage aloud.
Edge's PDF of the same page contained none.

The checks used Firefox 156.0 and Edge 153 on Windows 11, through WebDriver's print command, on
A4, as the checks for #22 did. #40 reported the fault in Firefox 155.0.1, and it reproduces
unchanged in 156.0.

The same checks found a second, quieter fault with the same cause. Source Serif 4 maps both the
modifier letters U+02BB and U+02BC and the curly quotes U+2018 and U+2019 to the same two glyphs.
Firefox works out what a glyph says by reading the character map backwards, and takes the lower of
the two characters, so "Master's" came out spelled with U+02BC, a character that looks the same and
is not the one on the page. Source Sans 3 maps each of those glyphs from one character only and is
unaffected, so the fault reaches only the headings, set in the serif.

Both faults are in what Firefox writes, not in what it draws: the page looks right on paper either
way. They are also both in the PDF alone. Text copied from the page on screen comes from the
markup and was never affected.

## Decision

### The page sets no ligatures

`app/globals.css` sets `font-variant-ligatures: none` on `body`, where it inherits to everything.
A word is therefore drawn as the letters it is spelled with, and every browser writes those letters
into a PDF.

The rule is not confined to `@media print`. Screen and paper are the same document, per ADR-002,
and a reader comparing them should not find the words set differently. Required ligatures, which
some scripts cannot be written without, are unaffected by this value; the site's Latin subset has
none.

### Source Serif 4 keeps the curly quotes and drops the modifier letters

No CSS can reach the second fault, because it is in the font's character map. The two Source Serif
4 files are re-derived with the entries for U+02BB and U+02BC removed, leaving U+2018 and U+2019 as
the only way to reach those two glyphs. Firefox then reads the apostrophe back as the character the
page is written with.

This extends DDR-007's derivation. Its recipe gains a step: after pinning each weight and naming
the font, delete the U+02BB and U+02BC entries from every character-map subtable of the serif
files, with fontTools, and save as WOFF2 under the same name.

The two characters are Spacing Modifier Letters, outside the Basic Latin, Latin-1 Supplement, and
common punctuation that DDR-001 subset the fonts to. No content uses them. Text that needed one
would now be drawn in the fallback font rather than in Source Serif 4.

### What this is worth

The joins are what the page gives up. At reading sizes the difference is not visible: rendered side
by side in Firefox at 20px and 26px, the longest sample line moved by 7.65px in 301px, about two
and a half per cent, and most moved by less than a pixel. The page still prints on five A4 sheets,
with every page break where it was, in Edge and in Firefox alike.

## Alternatives Considered

### Option A: Leave the ligatures on, and accept the PDF

Pros:
* No change.

Cons:
* The CV saved from the browser most likely to be a visitor's own cannot be searched for
  "Microsoft" or "Software", copies as damaged words, and is read aloud damaged. ADR-002 makes
  that PDF the CV, so this is a defect in the site's main output, as #22 was.

### Option B: Turn the ligatures off in print only

Pros:
* The screen keeps the joins the typefaces were drawn with.

Cons:
* The words would be set differently on screen and on paper, for a difference no reader can see
  anyway.
* A second thing for the print stylesheet to carry, and a rule whose reason is invisible until
  someone prints the page in Firefox.
* It fixes nothing that Option A's wording does not, since the fault is only ever in a PDF.

### Option C: Remove the ligature feature from the font files

Take the `liga` feature out of the four files, as the modifier letters are taken out of the serif.

Pros:
* One place for the whole fix, and nothing in the stylesheet.
* Cannot be overridden by a later style.

Cons:
* A typographic decision hidden inside a binary file, where nobody reading the CSS would find it,
  and which no test in this project can hold.
* Harder to reverse than a declaration.
* The character-map edit is unavoidable; this one is not.

### Option D: Set the apostrophe as U+0027 in the content

Pros:
* No font change.

Cons:
* A typewriter apostrophe in a heading, where the curly one is correct, to work around how a
  browser writes a PDF.
* It would not fix the left quote, or any other pair of characters a font maps to one glyph.

## Consequences

Benefits:
* Every one of the 930 words the page shows comes out of a PDF saved in Firefox exactly as it
  reads, with no replacement characters. The same holds in Edge.
* The CV can be searched, copied, and read aloud, whichever of the two browsers saved it.
* One declaration, in the base styles, where a reader of the stylesheet meets it.

Tradeoffs:
* The typefaces' ligatures are not used, on screen or on paper.
* Words containing ff, fi, fl, or ft are a fraction wider, so a line can wrap a word earlier than
  it did.
* Source Serif 4 no longer covers U+02BB or U+02BC.
* The serif files take one more step to derive, and re-deriving them from Fontsource without that
  step would bring the fault back silently.

Risks:
* Another glyph a font maps from more than one character would be written back as the lower
  character, as the apostrophe was. The Latin subset has no other such pair in use: the only
  remaining ones are the non-breaking space, the soft hyphen, and the fraction slash, none of which
  the content uses.
* Browsers may change how they write PDFs. As DDR-005 says, a print change should be checked in
  both Edge and Firefox.

## Related Documents

* GitHub issue #40, which this decision resolves
* DDR-001, the typographic system, to which this adds a rule
* DDR-005, the print stylesheet, which designs what a browser prints
* DDR-007, static font files, whose derivation this extends, and which fixed the earlier fault in
  the same PDFs (#22)
* ADR-001, which put every style in the tokens and the base stylesheet
* ADR-002, which made the page the CV
