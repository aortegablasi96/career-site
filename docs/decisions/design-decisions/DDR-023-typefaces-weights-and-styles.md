# DDR-023-Typefaces, Weights and Styles

Status: Accepted

Date: 2026-09-17

**Amended in one respect by DDR-030**, which corrects the weight table's medium row and writes the
two declarations that row always implied. No face, no weight, no file and no italic moves; what
moves is which elements take medium, and the table below says so where it stands.

Supersedes, **in part**, DDR-011, the typographic system: the elements each typeface is used on, the
weights the site ships, the files in `app/fonts/`, and the no-italics rule it carried forward from
DDR-001. Everything else DDR-011 decides stands and it is still the record to read for it — the two
families themselves and their fallback stacks, the one-static-file-per-weight recipe, the PDF
guarantee, the line heights, the measure and the wrapping rules. DDR-022 had already superseded its
type scale and its floor.

It also corrects one measured claim in **DDR-018**, which is not the same as superseding it: DDR-018
says that at +0.1em tracking no DM Sans weight but 400 survives being saved as a PDF. Measured again
here, one property at a time, that is no longer true of the badge at all — see *What the printed page
gave back*. DDR-018's tracking amendment is #92's to supersede; this record only replaces the reason
it was believed to be about weight.

**Amended in one respect by DDR-051**: a project card's name, an `h3`, is set in Lora SemiBold, as
the design draws it. Every other item title stays in DM Sans, and no file is added.

## Context

Epic #70 closes the gap between the page and `career-site-design`, and on 2026-09-17 the owner
decided the design prevails over the records written to protect it. Type is where the two disagree
most bluntly, and in three places at once.

Measured node by node off the Figma file:

| Element                              | Node     | The design draws                |
| ------------------------------------ | -------- | ------------------------------- |
| The page title, `h1`                  | —        | Lora SemiBold                   |
| A section title, `h2`                 | `2:275`  | Lora SemiBold, 20.8px           |
| A role's job title, `h3`              | `2:102`  | **DM Sans SemiBold**, 15px      |
| A project's name, `h3`                | `2:292`  | **DM Sans SemiBold**, 15px      |
| A credential's name, `h3`             | `2:610`  | **DM Sans SemiBold**, 14px      |
| A skill-group name, `h3`              | `2:468`  | **DM Sans Bold**, 12.8px        |
| A level badge                         | `2:473`  | **DM Sans Bold**, 10px          |
| The timeline's date range             | `2:93`   | **DM Sans Bold**, 11px          |
| A degree's thesis sentence            | `2:616`  | **DM Sans Italic**, 13px        |
| The footer's name                     | `2:690`  | **Lora Regular**, 12px          |

Against that, DDR-011 sets *every* heading in Lora, ships one file each for DM Sans 400, 500 and 600
and Lora 600, and carries forward DDR-001's rule that the site uses no italics. The design
contradicts all three.

The cost is not the CSS. It is the files. A weight or a style with no file is synthesised by the
browser — smeared or slanted outlines rather than drawn ones — so three faces have to be derived,
named and committed. And DDR-011's guarantee, that a PDF spells every word as the page draws it, was
won by inspecting the character maps of exactly four files. It does not transfer to a file it has not
seen. An italic was the likeliest place for it to break, because it is a second set of outlines
rather than a second weight of the same ones.

## Decision

### The two families keep their faces and change their jobs

DDR-011's pairing is unchanged: **Lora** for the serif voice, **DM Sans** for everything else, with
the fallback stacks and the metric adjustments it sets. What changes is which elements take which.

**Lora is now the page title and the section titles, and no longer every heading.** `app/globals.css`
writes `font-family: var(--font-family-heading)` in the `h1` and `h2` rules rather than in the rule
that styles all six levels, so `h3` to `h6` inherit DM Sans from `body`.

**An item title is set in DM Sans SemiBold** — a role's job title, a project's name, a credential's
name and a skill-group name are `h3`s, and the design sets them in the body face at the size of the
text beneath them. What tells an item title apart from that text is its weight and its position, not
its voice. This is the design's densest idea and the reason the page reads as edited rather than
typed.

The two tokens keep their names. `--font-family-heading` is narrower than it sounds now, and it
would be wrong to rename it `--font-family-title`: #96 puts the footer's name in Lora Regular, and a
footer's name is not a title either. The token names the face's role in the page's voice, and
`app/tokens.css` says so where it is defined.

### Four weights and one italic

| Token                    | Weight | Used for                                                          |
| ------------------------ | ------ | ----------------------------------------------------------------- |
| `--font-weight-regular`  | 400    | Body text, and the thesis sentence's italic                       |
| `--font-weight-medium`   | 500    | The positioning line, the four pill controls, technology tags      |
| `--font-weight-semibold` | 600    | `h1` to `h6`, `b` and `strong`                                     |
| `--font-weight-bold`     | 700    | The date range, a level badge, a skill-group name                  |

**The medium row above is DDR-030's, and this record's was wrong.** As written here it named the
contents links and the technology tags and left out the CV control, which has carried medium since
#48; on the page, neither the contents links nor the tags were ever given the weight, and the three
contact pills were at 400 where the design draws them Medium. DDR-030 sets the four controls and the
tags, corrects the row to what it now describes, and leaves the contents links to #98, which
replaces that component. Everything else in this table stands as written.

700 is the one addition, and it is the design's weight for the three labels DDR-018 sets as labels.
DDR-018 had to settle for semibold there, and said so plainly: the site shipped no file for 700 and
DDR-011 makes a fifth file a decision of its own. This is that decision. The three rules are one
declaration each, in `timeline.module.css` and `skills.module.css`.

A skill-group name now writes its own weight where it wrote none before, because the rule that
styles every heading stops at 600.

**The site has one italic**, and it is a degree's thesis sentence, set in DM Sans Italic at 400 by
`credentials.module.css`. DDR-001 banned italics and DDR-011 carried the ban forward, noting that the
UI Review had set the sentence in the secondary ink instead to save a file and a derivation. The
design sets it in italic, so the file is derived. `font-style: italic` is a keyword and not a length,
as the `text-transform: uppercase` the labels already write is, so it names no design value a token
could hold and `components/stylesheets.test.ts` needs no new admission for it.

Nothing else on the page is italic, and `components/credentials.test.tsx` fails if a second
`font-style` appears in that stylesheet.

### The files

DDR-011's recipe is unchanged and is what produced all three: take the Fontsource Latin variable
file, pin it to the weight with fontTools' instancer, name it — family, subfamily, full name and
PostScript name, on the Windows and Macintosh platforms both — and save it as WOFF2. **DM Sans
Italic comes from the italic variable file**, `dm-sans-latin-wght-italic.woff2`, not from the upright
one slanted.

| File                             | Font              | Bytes  | Loaded            |
| -------------------------------- | ----------------- | ------ | ----------------- |
| `dm-sans-latin-400-normal.woff2` | DM Sans Regular   | 14,212 | yes               |
| `dm-sans-latin-500-normal.woff2` | DM Sans Medium    | 14,472 | yes               |
| `dm-sans-latin-600-normal.woff2` | DM Sans SemiBold  | 14,276 | yes               |
| `dm-sans-latin-700-normal.woff2` | DM Sans Bold      | 14,444 | **yes, new**      |
| `dm-sans-latin-400-italic.woff2` | DM Sans Italic    | 15,120 | **yes, new**      |
| `lora-latin-600-normal.woff2`    | Lora SemiBold     | 21,948 | yes               |
| `lora-latin-400-normal.woff2`    | Lora Regular      | 21,304 | **no, until #96** |

**Lora Regular is committed and deliberately not listed in `app/layout.tsx`.** It is the footer's
name, and #96 adds the footer. `next/font` preloads every file it is given, so listing it now would
fetch 21 KB on every visit for text the page does not show. It is derived and inspected here so that
the footer story is one line rather than a second derivation, and `app/layout.test.tsx` holds both
halves of that: every listed path exists on disk, and this one file is on disk and unlisted.

**The payload.** The six files the page serves total **92.3 KiB**, where DDR-011's four totalled
63.4 KiB — **+28.9 KiB, up 46%**. The seven committed total 113.1 KiB. That is the price of the
design's type, it is paid once per visitor, and it is recorded here rather than absorbed.

### The PDF guarantee, re-established for the three new files

DDR-011's rule is what makes it hold and it does not change: `app/globals.css` sets
`font-variant-ligatures: none` and `font-feature-settings: 'calt' 0` on `body`.

Each new file's character map was inspected the way DDR-011 inspects the existing four, and each one
comes back **identical to its sibling of the same family, tag for tag and output for output**:

* **No glyph is mapped from more than one character.** DM Sans Bold and DM Sans Italic map 222
  characters to 222 glyphs; Lora Regular maps 226 to 226. That is the fault DDR-009 had to edit a
  character map for in Source Serif 4, and neither family has it.
* **The default-on features are the same two risks and no others.** `liga` substitutes `fi` and `fl`,
  both unmapped, in all three. `calt` substitutes DM Sans's arrows and typed quotes — twenty unmapped
  glyphs — and, in Lora Regular exactly as in Lora SemiBold, a raised colon after a digit, whose
  `colon.case` and `colon.tf.case` are unmapped. Both features are off.
* **`ccmp` and `locl` cannot fire.** `ccmp` needs a combining mark and the content uses precomposed
  characters; `locl` needs a Turkish or Catalan language tag and the document is `lang="en"`.
* **The opt-in features are never requested**: `frac`, `numr` and `dnom` in DM Sans, `frac`, `pnum`
  and `tnum` in Lora.

The italic, which was the likeliest place for the guarantee to break, breaks it nowhere: it is the
same 222 characters and the same seven features as the upright file.

### What the printed page gave back

Printed to A4 through WebDriver in **Edge 153.0.4234.32** and **Firefox 156.0**, with background
graphics on, and read back through **pypdf** and **pdfium** both:

|                          | Edge / pypdf | Edge / pdfium | Firefox / pypdf | Firefox / pdfium |
| ------------------------ | ------------ | ------------- | --------------- | ---------------- |
| Sheets                   | 5            | 5             | 5               | 5                |
| U+FFFD, the replacement  | 0            | 0             | 0               | 0                |
| U+2019, the apostrophe   | 5            | 5             | 5               | 5                |
| U+02BC, DDR-009's fault  | 0            | 0             | 0               | 0                |
| Of 478 words, missing    | 1            | 1             | 3               | 3                |

The one word Edge does not give back is **"Get"**, from the CV control print hides, which is the same
word every recheck since #52 has reported. Firefox additionally wraps *Copilot-driven* and
*data-driven* at their hyphens and writes the break as a newline, so both readers see two words; that
is a line-wrap artifact of Firefox's, not of a font, and it is present in the page before this change
as well.

**Every bold label comes back as one word** — `ADVANCED`, `PROFICIENT`, `BASIC`, `PRODUCT AND
DELIVERY`, `AI`, `DATA AND IOT`, `TOOLS`, `OCT 2024 – PRESENT` — and **both italic thesis sentences
come back whole**, word for word, in all four combinations. There is no run of single letters
anywhere in any of the four, which is the check that caught the badge on #75.

**Five sheets is not a regression.** The same measurement run against the tree this change branches
from gives five in both browsers too, word for word the same result. CLAUDE.md's "four in Edge and
five in Firefox" was last true at #89; #90 changed the whole type scale and explicitly left the sheet
count to #99, and this is where the fourth Edge sheet turns out to have gone. Nothing here moves it.

**DDR-018's fault, isolated.** Forcing the badge to +0.1em — which is what #92 proposes — still
splits it: `P R O F I C I E N T`, `B A S I C`, in Firefox through pypdf. But it splits **at 400, 600
and 700 alike**, so the weight is no longer the variable. DDR-018 measured a 13px badge; #90 took it
to 10px, and at that size the tracking alone is enough. Edge never splits it, and pdfium never splits
it. The skill-group name at +0.1em does **not** split at any weight in either browser through either
reader — it is 12.8px, and that is the whole difference. This record does not act on any of it: the
page ships the badge at +0.025em, as DDR-018 left it, and #92 decides the rest with the measurement
in hand.

### What the change costs the layout

Measured in Edge at 320px, 390px and 1280px, at the browser's real default font size and at double
it, with the old weights and the old family toggled back over the page one at a time:

* **Bold is nearly free.** The widest date range, "Mar 2022 – May 2023", goes from 124.2px to
  125.1px, which leaves 34.9px of slack in the 160px column. A badge gains at most 1.6px and a group
  name at most 3.6px. No label gains a line at any of the six combinations.
* **Lora to DM Sans on item titles costs no line either.** The `h3`s total 21, 18 and 17 lines at
  the three widths at the default size, and 32, 27 and 17 at double it — the same in both faces, with
  no single title changing. Individual widths move by at most about 7px, in both directions: DM Sans
  SemiBold sets some of these titles slightly wider than Lora SemiBold and some slightly narrower.
* **Nothing scrolls sideways** and nothing overflows the viewport at 320px, 360px, 390px or 1280px,
  at either text size.

## Alternatives Considered

### Option A: keep DDR-011's four files, and take only what they can express

Pros:
* No derivation, no inspection, no new bytes, and the PDF guarantee carries over untouched.
* The three labels stay semibold, which DDR-018 already justified.

Cons:
* It is not the design, and the owner decided on 2026-09-17 that the design prevails. Epic #70 is
  built on that decision and #91 is one of its children.
* The item titles are the largest of the three differences and the one a reader would see first: the
  design's page is set in one face with a serif reserved for its two titles, and Lora on every `h3`
  gives it a second voice it does not ask for.

### Option B: take the design's faces but synthesise the three new ones

Pros:
* No files, no bytes, no derivation.

Cons:
* A synthesised bold is a smeared outline and a synthesised italic is a slanted upright, neither of
  which is the face the design draws.
* It reintroduces #22 in a new form. The whole reason this site ships static files is that what a
  browser writes into a PDF is part of the design, and a synthesised face is exactly the sort of
  thing the guarantee has no way to reach.

### Option C: set the thesis sentence in the secondary ink rather than in italic

Pros:
* It is what the UI Review on #43 chose and what DDR-011 recorded, and it saves the largest of the
  three derivations along with its risk.

Cons:
* The thesis is already in the secondary ink, at the smallest running-text step, per DDR-022. Ink is
  doing all the work it can there; italic is what the design uses to say the sentence is a title of
  something rather than a description of it.
* The risk was the reason to hesitate and it was measured rather than assumed. It did not
  materialise: the italic file's character map is the upright file's, and both sentences come back
  whole out of both browsers through both readers.

### Option D: rename `--font-family-heading` to `--font-family-title`

Pros:
* The token would name what it now does, since `h3` to `h6` no longer take it.

Cons:
* It would be wrong again in one story's time. #96 sets the footer's name in Lora Regular, and a
  footer's name is not a title.
* The rename touches three files to make a comment unnecessary, which the comment does more cheaply
  and more honestly.

### Option E: load Lora Regular now, with the rest

Pros:
* One list, one story, and nothing left half-wired for #96 to finish.

Cons:
* `next/font` preloads every file it is given, so every visitor would fetch 21 KB — a fifth of the
  whole font payload — for a face nothing on the page draws.
* The work this story owns is deriving, naming and inspecting the file, and all of that is done. The
  line in `app/layout.tsx` is one line, and #96 is where it belongs.

## Consequences

Benefits:
* The page is set in the faces, weights and styles the design draws, which is Epic #70's whole
  purpose and the largest single step of it.
* The three labels reach the weight DDR-018 wanted and could not have, so the badge, the date range
  and the group name are told apart from their surroundings by the design's own means.
* The PDF guarantee is re-established rather than assumed: every word of the page still comes back
  out of both browsers through both readers, bold labels and italic sentences included, with no
  replacement character and the apostrophe still U+2019.
* The layout is unchanged. No heading, label or title gains or loses a line at any width or text size
  checked, and the printed sheet count does not move.

Tradeoffs:
* **The font payload is 46% larger**: 92.3 KiB served where DDR-011 served 63.4 KiB. On a site
  changed a few times a year and served from a CDN this is a one-off cost per visitor, and it is the
  design's price rather than an accident.
* The serif is now reserved for two headings, so the page has less of Lora's voice in it than
  DDR-011's page did.
* There are seven font files to keep in step with one recipe, and one of them is committed and
  unloaded, which is a state a reader has to be told about rather than infer.
* `--font-family-heading` no longer means every heading, which is a name that has to be read with its
  comment.

Risks:
* **A fifth weight or a second italic is a fifth and sixth file.** The arrangement only holds while
  the list in `app/layout.tsx` is exactly what the page sets; `app/layout.test.tsx` holds the list,
  but nothing can stop a new rule asking for a weight nobody derived. Adding one means adding a file
  and revising this record.
* **Lora Regular is inspected but never rendered.** Its character map is the semibold file's, so the
  guarantee covers it, but no PDF has been printed with it in yet. #96 prints one.
* **The badge's tracking fault got worse and it was not this story that did it.** At 10px, +0.1em
  splits the badge in Firefox through pypdf at every weight the site ships, 400 included. #92 decides
  whether to adopt it anyway; this record's contribution is the measurement.
* **The faces were checked against this content.** A future word meets the same features, and the two
  declarations in `app/globals.css` are what keeps that safe. They have to stay.

## Related Documents

* GitHub issue #91, which this decision resolves, and Epic #70, which it belongs to
* Figma, `career-site-design`, nodes `2:93`, `2:102`, `2:275`, `2:292`, `2:468`, `2:473`, `2:610`
  and `2:616`, measured in the table above
* DDR-011, the typographic system, whose families, files, weights and no-italics rule this
  supersedes and whose recipe and PDF guarantee it carries forward
* DDR-007 and DDR-009, superseded by DDR-011, for the reasoning behind the recipe and the guarantee
* DDR-001, superseded by DDR-011, whose no-italics rule ends here
* DDR-018, the uppercase labels, which settled for semibold because no 700 file existed, and whose
  measurement of the tracking fault this record corrects
* DDR-022, the type scale, which set the sizes these faces are drawn at and took the badge to 10px
* DDR-017, letter-spacing, and GitHub issue #92, which decides the tracking of the two labels
* GitHub issue #96, the footer, which loads Lora Regular, and #99, which rechecks the printed page
* GitHub issues #22 and #40, the two faults in Firefox's PDFs that shaped how the files are prepared
* ADR-001, which rules out a network font fetch at build time, and ADR-002, which makes the page the
  CV
