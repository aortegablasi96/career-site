# DDR-018-Uppercase Labels

Status: Accepted

Date: 2026-09-17

Supersedes nothing. It finishes what DDR-017 started, and it amends DDR-011's weights table the way
DDR-017 amended its type system and DDR-009 amended DDR-001's — by adding a use, not replacing a
decision. DDR-011's seven sizes, two families, three weights, 13px floor and Lora headings all stood
unchanged when this was written, and so do DDR-012's measured pairings, which this record adds no
colour to and takes none away from.

**Three later records reach into this one.** DDR-022 took the sizes and the floor, which moved the
badge from 13px to 10px. DDR-023 gave all three labels the design's bold, so the "semibold, not
bold" decision below is superseded, and it re-measured the tracking fault this record turns on:
at 10px the badge splits in a PDF at **every** weight the site ships, 400 included, so the
conclusion below that only 400 is safe at +0.1em was true of a 13px badge and is not true of this
one. **DDR-024 then supersedes the tracking amendment below outright**: the badge goes back to
`x-loose`, +0.1em, which is what DDR-017 gave it and what the design draws, and the three badge
words are given up as searchable terms in a Firefox PDF. So the section *The badge's tracking* is
history rather than the rule, and the row it amended in DDR-017's table is restored. Read DDR-024
for that decision and the measurement behind it.

Everything else here stands: the case, the accent on the date range, where the rules live, and the
reason the case is drawn in the stylesheet rather than written into `content/`.

## Context

The page has three short texts that exist to label what sits next to them: the timeline's date
range, a level badge, and a skill group's name. Until now all three were set in sentence case at
whatever weight they inherited — the date range and the badge at regular, the group name at the
semibold every heading takes — and the date range in the secondary ink every metadata line takes.
The result is that a date, a level and a group name looked like the prose around them, and the
reader had to read each one to find out what it was.

The design gives all three one treatment, and the values were read back out of
`career-site-design` rather than taken from the issue:

| Text                      | Figma node | As drawn                                            |
| ------------------------- | ---------- | --------------------------------------------------- |
| The timeline's date range | `2:91`     | `OCT 2024 – PRESENT`, bold, in the accent            |
| A level badge             | `2:472`    | `ADVANCED`, bold, on its tint                        |
| A skill group's name      | `2:467`    | `PRODUCT AND DELIVERY`, bold                         |

The place under the date range, `Quartino, Switzerland`, is drawn regular and in sentence case, and
so are the technology tags — `Next.js`, `PostgreSQL`, `Cloudflare R2` — which is what marks the
boundary of this decision rather than any rule about smallness.

This is a gap rather than a rejection. The audit on Epic #70 sorted every difference between the
page and the design into choices a record rejected and details the page simply never followed, and
case is in the second pile: no record has ever ruled on it.

**DDR-017 landed half of this one story early, and said so.** It gave the badge and the group name
`--letter-spacing-x-loose` at +0.1em, which is a convention of uppercase setting, and recorded as a
tradeoff that on lowercase it "reads airy" until the caps arrive. This is where they arrive. The two
classes DDR-017 created to carry the tracking — `.dateRange` in the timeline and `.name` in
skills — were named there as the hooks this story would need, and they are the hooks it uses.

The constraints are:

* **DDR-011**: the site ships one static font file per weight, at 400, 500 and 600. The design's
  bold is 700, and a weight with no file is synthesised by the browser, which is the fault DDR-007
  and DDR-011 exist to prevent.
* **DDR-011 again**: `h1`–`h6` are Lora. A skill group's name is an `h3`, and the design sets it in
  DM Sans; Epic #70 lists item titles in DM Sans among the differences it will not close.
* **ADR-001 and ADR-002**: user-facing prose lives in `content/` and never in a component, and the
  page is the CV, so what a browser writes into a PDF is part of the design.
* **Accessibility**: the accessible name a control or a heading takes, and the machine-readable
  value a `time` element carries, must be the ones `content/` writes. Uppercase is a way of drawing
  a word, not a way of spelling it.
* **DDR-012**: only the pairings that record measures are verified.
* **DDR-014**: text stays readable and unclipped at 320px with text at 200%, with no horizontal
  scrollbar. Capitals are wider than lowercase, which is what could break there.
* **DDR-011's PDF guarantee**: every word of the page comes back out of a PDF saved in Edge and
  Firefox exactly as it reads.

## Decision

### Three texts, one label treatment

| Text                      | Case      | Weight                        | Ink                             |
| ------------------------- | --------- | ----------------------------- | ------------------------------- |
| The timeline's date range | uppercase | semibold                      | **the accent**, where it was the secondary ink |
| A level badge             | uppercase | semibold                      | its level's ink, unchanged      |
| A skill group's name      | uppercase | semibold, which it already is | the heading ink, unchanged      |

Nothing else on the page is uppercased, and nothing else's weight or ink changes.

One thing DDR-017 decided does change, and it is forced rather than chosen: **a level badge's
tracking drops from `x-loose` to `loose`**, because a semibold badge at +0.1em does not survive
being saved as a PDF. That is argued in full below, under *The badge's tracking*. The date range
keeps `loose` and the group's name keeps `x-loose`.

### The case is drawn, never written

`text-transform: uppercase`, in the stylesheet. No string in `content/` is rewritten, which is
ADR-001's rule about where prose lives and an accessibility requirement at the same time:

* A screen reader is given `Oct 2024 – Present`, `Advanced` and `Product and delivery`, which are
  words, rather than `OCT`, which is not.
* `<time datetime="2024-10">` keeps the value it had, because the element and its attribute are
  untouched.
* `content/cv.ts`'s digest over the content modules does not move, so the CV and the page stay in
  the step ADR-005 requires of them.

### Semibold, because 600 is the heaviest weight the site has a file for

The design draws all three bold. DM Sans Bold is not one of the four files `app/fonts/` holds, and
DDR-011 records what happens to a weight with no file: the browser synthesises it. Adding a fifth
file is a decision that revises DDR-011, and it is not this story's; #75 names it out of scope.

So the three take `--font-weight-semibold`, one step down from the design and the heaviest thing on
the page. Only two rules write it: the date range in `timeline.module.css` and the badge in
`skills.module.css`. The third is not written at all — a skill group's name is an `h3`, and
`app/globals.css` already sets every heading semibold.

**This adds a use to DDR-011's weights table.** 600 was "headings, and `b` and `strong`"; it is now
those and the two labels that are not already headings.

### The badge's tracking: `loose`, where DDR-017 gave it `x-loose`

**This amends an accepted record, and it is a measurement rather than a preference.**

DDR-017 named the risk precisely: "a PDF stores text as runs with positions, and an extractor
decides where a space belongs by how far one glyph sits from the next, so enough tracking can make
an extractor read `ADVANCED` as `A D V A N C E D`". It then checked, and at the time the badge came
back whole. Making the badge semibold breaks that. Printed to A4 and read back, the three badge
words came out of pypdf as `A D V A N C E D`, `P R O F I C I E N T` and `B A S I C` — three words of
the CV a text search would no longer find, from **both** browsers.

Measured one property at a time, printing the same page with one override each, in Edge and in
Firefox, and reading every PDF with both pypdf and pdfium:

| Badge                                   | Edge              | Firefox           |
| --------------------------------------- | ----------------- | ----------------- |
| uppercase, 600, `x-loose`               | **spells it out** | **spells it out** |
| uppercase, 500, `x-loose`               | whole             | **spells it out** |
| sentence case, 600 or 500, `x-loose`    | **spells it out** | **spells it out** |
| uppercase, 400, `x-loose`               | whole             | whole             |
| uppercase, 600, `loose`                 | whole             | whole             |
| uppercase, 500 or 400, `loose`          | whole             | whole             |
| uppercase, 600, no tracking             | whole             | whole             |

Three things follow, and each of them is the reason for a piece of the decision:

* **The case has nothing to do with it.** Sentence case at 600 splits exactly the same way, which
  means this fault was one story away from arriving with no capitals at all. What the capitals did
  was bring the weight, and the weight is what crossed the line.
* **At +0.1em, no weight DM Sans ships is safe except the 400 the badge had before it was a label.**
  So there is no weight that satisfies the issue's "heavier than the text beside them" *and* leaves
  the PDF whole. One of the two properties has to give, and tracking is the one with a value that
  still works.
* **At +0.025em every weight is safe in both browsers**, which makes `loose` the value that keeps
  the badge heavier, keeps it tracked, and keeps the guarantee.

**A skill group's name keeps `x-loose`**, at semibold, because it is set in **Lora** and Lora is not
affected: `PRODUCT AND DELIVERY` comes back whole from both browsers through both readers. So the
rule this leaves behind is not "`x-loose` is unsafe" but the narrower, true one: **`x-loose` on DM
Sans above regular does not survive a PDF**, and after this record the badge is no longer such a
case. `x-loose` keeps one user, the group's name, and `loose` gains a third alongside the technology
tag and the date range.

DDR-017 stands in every other respect: its three values, its em unit, its reasoning, and its five
other users are untouched. What changes is one row of its table, for a reason it wrote down itself.

### The accent belongs to the date range, and to nothing else in the column

`--color-accent` on `--color-surface` is **7.38:1**, and on `--color-surface-card` **7.90:1**. Both
are in DDR-012's table already, so this record adds no pairing and DDR-012 needs no revision: the
accent simply gains a user, as it gained the technology tags and the language cards' levels before.

**The place below the date range is untouched** — secondary ink, regular, sentence case — for the
reason DDR-017 gave for leaving its tracking alone: "Quartino, Switzerland" is a proper name and
should read as the words it is. The design draws it that way too. The date column now says at a
glance which of its two lines is the label and which is the place.

The accent is also what the underline exists to distinguish a link from, per DDR-012. A date range
is not underlined and neither are the technology tags, which have carried the accent since #50, so
this is a colour the page already uses for text that is not a link.

### The technology tags are not part of this

They are the fourth short label on the page and the obvious candidate, and they stay in sentence
case, because they are proper names: `Next.js`, `PostgreSQL` and `Cloudflare R2` are spelled the way
their owners spell them, and `NEXT.JS` is not a name anyone writes. The design leaves them alone
too. What they share with the other three is the tracking DDR-017 gave them, which is as far as the
label vocabulary goes for a name.

### Where it lives

* `components/timeline.module.css` — one rule, `.dates .dateRange`, carrying the ink, the weight,
  the case and the tracking DDR-017 put there.
* `components/skills.module.css` — `.badge` takes the case and the weight, `.name` takes the case
  alone.
* Nothing in `app/`. There is no token to add: `text-transform` takes a keyword rather than a value,
  and the weight and the colour are tokens DDR-011 and DDR-012 already define.

**The timeline's selector names the column as well as the line, and that is deliberate.**
`MetadataLine` composes `${styles.metadata} ${className}`, so `.metadata` from one CSS Module and
`.dateRange` from another land on the same element. Tracking could sit at one class because nothing
else set it; an ink cannot, because `.metadata` sets the secondary ink at exactly the same
specificity, and which of the two wins would then depend on the order the bundler happens to emit
the two files in. `.dates .dateRange` settles it in the stylesheet that means it.

### Nothing is redefined for a width or for paper

As with DDR-017, there is one treatment at every width and on both surfaces. Case and weight do not
depend on the size of the text, and DDR-015 leaves every ink alone on paper — it drops the surfaces
under them — so the printed date range is the accent on white, at 7.90:1.

## Alternatives Considered

### Option A: Write the labels in capitals in `content/`

Pros:
* No styling at all: what the page shows is what the module says, which is the most direct reading
  of "the content is the source of truth".

Cons:
* It is not content. The case of a label is how it is drawn, and ADR-001 puts how things are drawn
  in the stylesheet. The same three words in a different design would be sentence case again.
* A screen reader would be given `OCT 2024 – PRESENT` and `PRODUCT AND DELIVERY`, and an initialism
  is exactly the shape a screen reader spells out letter by letter. #75 names this as the thing not
  to do.
* `content/cv.ts`'s digest would move, so the separately designed CV would have to be re-cut to
  match capitals it does not use, per ADR-005.
* The `time` element's text and its `datetime` attribute would stop agreeing in case for no reason.

### Option B: Ship DM Sans Bold and set the three at 700, as the design draws them

Pros:
* Matches the design exactly, and 700 separates a label from 400 body text more plainly than 600
  does.

Cons:
* A fifth font file to derive, name, license and commit, and a revision of DDR-011 — which #75 puts
  out of scope precisely so that adding a weight stays a decision of its own rather than a side
  effect of a case change.
* 600 is already the heaviest thing on the page; a label heavier than every heading would invert
  the hierarchy DDR-011 built.
* It goes the wrong way on the fault the badge just hit. 600 at +0.1em already spells the badge out
  in a PDF; 700 puts more space between the letters, not less.

### Option C: Leave the badge's tracking at `x-loose` and take its weight down instead

The obvious first answer once the PDF fault appeared, and it is where this story went before the
second browser was measured.

Pros:
* It leaves DDR-017 completely untouched, which is the tidier outcome on paper.
* In Edge alone it works: at 500 and +0.1em the badge comes back whole.

Cons:
* **It does not work.** Firefox splits the badge at 500 as well as at 600; only 400 survives +0.1em
  there, and 400 is the weight the badge already had, which fails the issue's requirement that a
  label be heavier than the text beside it.
* Checking one browser would have shipped it. DDR-005 requires both, and this is the case that
  shows why.

### Option D: Leave the badge at 400 and let the capitals do the work

Pros:
* Nothing to amend, and capitals plus a tint do distinguish a badge from the skills beside it.

Cons:
* It declines an acceptance criterion the issue states plainly, rather than meeting it.
* On paper the tint is gone, per DDR-015. Case alone would then be the whole of the difference
  between a badge and the words it labels.

### Option E: Small capitals, rather than capitals

Pros:
* Gentler than full capitals, and it keeps the shape of the sentence-case string, so a screen reader
  meets the same rendered word.
* It is the conventional typographic answer to "a label in a line of text".

Cons:
* Neither Lora nor DM Sans ships `smcp` in the Latin subset committed here, so a browser would
  synthesise small caps by scaling capitals — the same synthesis DDR-011 refuses for weights, for
  the same reason.
* Where a face does have them, they are an OpenType feature, and DDR-011 switched `calt` and `liga`
  off across the site because a feature that substitutes a glyph no character maps to is what made
  words unsearchable in a saved PDF (#40). Turning a substituting feature back on, for text the CV
  shows, is the exact risk that record was written to close.
* It is not what the design draws.

### Option F: Uppercase every short label, tags included

Pros:
* One rule to state: the smallest text on the site is a label, and labels are capitals.

Cons:
* The tags are proper names and would be misspelled by it.
* The design draws them in sentence case, so the page would stop matching the file in the course of
  making it match.

### Option G: Leave the case alone, and record that as the decision

Pros:
* Nothing to measure, no risk to reflow or to the PDF, and the page's words stay the page's words in
  every medium.

Cons:
* DDR-017's `x-loose` was drawn for capitals. Left as it is, the badge and the group name keep a
  tracking that only makes sense with the case that never arrived, which is a worse state than
  either choice made whole.
* The reader still has to read a date to know it is a date. That is the problem the issue opens
  with, and declining leaves it.

## Consequences

Benefits:

* The three labels read as labels. The date column is scannable down the edge it shares with the
  content — accent, capitals, semibold — which is what makes a timeline a timeline rather than a
  list of paragraphs with dates in them.
* **A level badge survives paper.** DDR-015 drops every tint at the token layer, so on a printed
  sheet the badge used to be one word in the same face, size and weight as the skills it labels,
  told apart by its position alone. It now has case and weight, and nothing on the page depends on
  the tint that is gone.
* DDR-017's open tradeoff is closed one story after it was opened, as that record predicted, and the
  two hooks it left are used rather than replaced.
* Three more of Epic #70's audit findings are closed, with no new token, no new file and no new
  colour.

Tradeoffs:

* **A saved PDF now spells those runs in capitals.** Every word still comes out — checked below —
  but a case-sensitive search of the CV for `Present` or `Advanced` no longer matches, because the
  text the browser writes is the text it draws. DDR-011's guarantee is therefore restated once,
  precisely: a PDF spells every word as the page **draws** it, and the page draws three labels in
  capitals.
* **A level badge is tracked one step less than DDR-017 drew it**, which is the design's texture
  given up to keep the CV searchable. At 13px the difference between +0.1em and +0.025em is about a
  pixel per letter.
* **The labels are one weight lighter than the design.** 600 where the file says 700, which is
  DDR-011's file rule doing its job rather than a compromise made here.
* **A skill group's name is uppercase Lora, where the design draws uppercase DM Sans.** That is
  DDR-011's headings rule, and Epic #70 lists it among the differences it will not close.
* **The first two-class selector in a component stylesheet.** `.dates .dateRange` is heavier than
  anything else in `components/`, and the reason is written above it. A third module that needs to
  override `.metadata` should reach for the same shape rather than invent another.
* **`Data and IoT` draws as `DATA AND IOT`.** Capitals flatten the one group name that carries case
  of its own. It is the same initialism either way, and the string in `content/` is untouched, so
  the heading's accessible name is unchanged. It is the cost of a rule that applies to a whole role
  rather than to each string.
* Capitals are wider than lowercase, and every one of the three grew: measured at the browser's
  default font size, the widest date range from 149.7px to 158.1px, the longest group name from
  190.1px to 232.7px, and the widest badge's word from 70.9px to 77.3px — less than the other two,
  because the capitals it gained are partly paid for by the tracking it gave up.

Risks:

* **Reflow.** Capitals are the widest the labels have ever been, and 320px at
  200% text is where that shows. **Checked, not assumed** — measured at 320px, 360px and 390px, each
  at the browser's default font size and at double it, and at 1280px, where the timeline's date
  column is a fixed 10rem. **No horizontal scrollbar in any of the eight**, and no group name gained
  a line: "Product and delivery" already set in two at 200% and still does. Two date ranges gain a
  second line at 200% — "Oct 2024 – Present" at 320px and "Mar 2022 – May 2023" at 360px — and both
  are in the narrow layout, where the dates sit above the title at the full width of the column and
  a second line costs a line rather than a boundary.
* **The tightest fit on the page is now the date column**, and it is worth knowing before anything
  touches it. From the wide breakpoint the column is `--timeline-date-width`, a fixed 10rem, and at
  the browser's default size the widest range — "Mar 2022 – May 2023", the two widest capitals this
  content has — sets at 158.1px in 160px. It was 149.7px. It still sets on one line in both
  browsers, and if a later change ever takes it past 160px the range wraps to a second right-aligned
  line inside its column rather than overflowing, because the no-break spaces leave the en dash as a
  break point. Anything that widens the date range — a fourth weight, more tracking, a longer
  present-tense word than "Present" — should be measured against that 1.9px rather than assumed.
* **Screen readers.** The DOM text is unchanged, which is the whole mitigation and the right one:
  what a screen reader is handed is `Advanced`, not `ADVANCED`. Some engines announce the
  *rendered* text for a `text-transform`ed run, and for a short all-capitals string that can be spelt
  out. Every string here is a word or a date rather than an initialism, so the worst case is a word
  read as a word.
* **Print, and the guarantee itself.** **Checked, not assumed.** The built page was printed to A4
  through WebDriver in Edge 153 and Firefox 155 and the text read back with both pypdf and pdfium.
  It runs to **four sheets in Edge and five in Firefox**, which is what #52 recorded and #71 and #74
  rechecked; no section heading is stranded and no item is split. Of the 445 distinct words the page
  shows, all 445 come back out of both PDFs through both readers except "Get", from the CV control
  print hides, which is the same single exception #52 recorded. No replacement character in either,
  the apostrophe still reads back as U+2019 and never as U+02BC, and a search for any run of single
  letters separated by spaces — which is what a split word looks like — now finds none in any of the
  four extractions. The same run against the build without these rules is what the badge measurements
  above are compared to.
* **A fourth label.** Anything later that wants this treatment should take all of it — case, weight
  and tracking — rather than one part, and should come back here if it is a proper name.
* **`x-loose` on DM Sans.** After this record, `--letter-spacing-x-loose` has one user, a skill
  group's name, and that user is set in Lora. Giving it to DM Sans at any weight above regular is
  what produced the fault above, so a component that wants it has to print the page and read the
  text back before it can have it. That check is the one DDR-017 prescribes, and this is the first
  time it has failed.

## Related Documents

* GitHub issue #75, which this decision resolves, and Epic #70, which found the gap
* DDR-017, which gave these three their tracking one story early, recorded the wait for this one,
  and whose table this amends in a single row
* DDR-011, the typographic system this amends, whose weights, files and Lora headings decide most of
  what is above, and whose PDF guarantee this restates
* DDR-012, the colour system, which already measures the accent this gives the date range
* DDR-010, which puts the dates in a right-aligned column and keeps levels as words
* DDR-014, the responsive record whose 320px-at-200% requirement the capitals were checked against
* DDR-015, the print record, which drops the badge's tint and leaves its ink alone
* ADR-001, which keeps prose out of components, ADR-002, which makes the page the CV, and ADR-005,
  which holds the CV and the page to the same facts
* The Figma design `career-site-design`, nodes `2:91`, `2:294`, `2:467` and `2:472`
* GitHub issue #40, the fault that made an OpenType feature a thing to be careful with
