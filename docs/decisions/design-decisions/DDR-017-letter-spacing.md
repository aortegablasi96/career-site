# DDR-017-Letter-Spacing

Status: Accepted

Date: 2026-09-17

Supersedes nothing. It adds tracking to DDR-011's typographic system, the way DDR-009 added a
typographic rule to DDR-001's. DDR-011's sizes, families, weights, floor, line heights, measure and
wrapping all stand unchanged, and so does its guarantee that a PDF spells every word as the page
does — which this record re-checks, because tracking is a thing a PDF's text extraction can be made
to read wrong.

**DDR-018 closes this record's one open tradeoff.** The `x-loose` pair below — a level badge and a
skill group's name — was drawn for uppercase and landed on lowercase, one story early, which is
recorded under Consequences as the visible cost of separating tracking from case. DDR-018 sets those
two, and the timeline's date range, in capitals. Every value here stands; what changes is the text
they are measured against, so the reflow and PDF checks below were both repeated there.

**DDR-018 also took `x-loose` off the badge, and DDR-024 puts it back.** For one story and one
record the table below had a row that was not true of the page: the badge was set at `loose`,
because at +0.1em a saved PDF spelled its word out letter by letter. DDR-024 restores the row and
accepts the cost, because the design draws the badge at +0.1em and the owner has decided the design
prevails. **So the table below is the page again**, in every row, and the risk this record named —
that tracking can make an extractor read `ADVANCED` as `A D V A N C E D` — is now a known,
deliberate cost rather than a thing to watch for. DDR-024 measures exactly which words it takes and
from which reader. Nothing else here moves: the three values, the em unit, and all six users are as
written.

## Context

DDR-011 settled seven sizes, two families and three weights, and said nothing about the space
between letters. Nothing else has either: `letter-spacing` appears nowhere in `app/` or
`components/`, so every word on the site is set at whatever spacing Lora and DM Sans were drawn
with.

That is a gap rather than a rejection. The audit on Epic #70 compared the page against the Figma
design `career-site-design` and sorted every difference into one of two piles: choices a record
rejected, and details the page simply never followed. Tracking is in the second pile — no record
weighed it and decided against it.

The design tracks six kinds of text, and the values were read back out of the file rather than
taken from the issue:

| Text                      | Figma node | Tracking, as drawn      | As a proportion |
| ------------------------- | ---------- | ----------------------- | --------------- |
| The name, `h1`            | `2:33`     | −1.28px at 51.2px       | −0.025em        |
| A section heading, `h2`   | `2:83`     | −0.52px at 20.8px       | −0.025em        |
| A technology tag          | `2:294`    | +0.275px at 11px        | +0.025em        |
| The timeline's date range | `2:91`     | +0.275px at 11px        | +0.025em        |
| A level badge             | `2:472`    | +1px at 10px            | +0.1em          |
| A skill group's name      | `2:467`    | +1.28px at 12.8px       | +0.1em          |

Three proportions, not six values. The design draws them in pixels because Figma draws in pixels;
underneath, the same three ratios recur, which is what makes them a system worth recording rather
than six numbers to copy.

Two things the table does **not** carry forward. The design's sizes are its own — 51.2px, 11px,
10px — and DDR-011 replaced them, floor included; only the ratios are adopted here. And several of
these texts are uppercase and bold in the design. That is #75's and it is out of scope here, for a
reason the Consequences record.

The constraints are:

* **ADR-001 and ADR-006**: a design value is a token defined once at the root, and a component
  stylesheet reads tokens rather than writing literal values.
* **DDR-011**: every font size is in rem, so text follows the reader's browser font-size setting.
  Tracking has to follow it too.
* **DDR-014**: text stays readable and unclipped at 320px with text at 200%, with no horizontal
  scrollbar. Opening letters up makes every tracked word wider, which is the thing that could
  break there.
* **DDR-011's PDF guarantee**: every word of the page comes back out of a PDF saved in Edge and
  Firefox exactly as it reads. Tracking is a plausible way to lose it — a PDF stores text as runs
  with positions, and an extractor decides where a space belongs by how far one glyph sits from the
  next, so enough tracking can make an extractor read `ADVANCED` as `A D V A N C E D`.

## Decision

### Three values, in em

```css
--letter-spacing-tight: -0.025em;
--letter-spacing-loose: 0.025em;
--letter-spacing-x-loose: 0.1em;
```

Named as the size and space scales are named, so `x-loose` reads as one step beyond `loose`.

**In em, which is the one place the type system measures from the element rather than from the
root.** Everything else — sizes, spacing, radii — is in rem, and this is a deliberate exception,
not an oversight. Tracking is a proportion of the letters it separates: the page title at 48px and
a level badge at 13px cannot share an absolute amount without one of them looking wrong. An em is
that proportion. And because every font size is in rem, an em is still measured from a size that
follows the reader's browser setting, so tracking scales with the text exactly as rem would, while
also scaling *between* roles, which rem would not.

**No fourth value, and no `normal` token.** Text that is not one of the roles below is left at the
spacing its face was drawn with. There is nothing to write for it, so there is no token for it.

### Which text takes which

| Value     | Text                                                                  |
| --------- | --------------------------------------------------------------------- |
| `tight`   | The page title (`h1`) and the section headings (`h2`)                  |
| `loose`   | A technology tag, and the timeline's date range                        |
| `x-loose` | A level badge, and a skill group's name                                |
| *none*    | Everything else                                                        |

**Tight, for the two headings the page sets large.** A text face is spaced for text. At 48px and
22px that spacing reads loose, because the gaps grow with the letters while the eye's tolerance
does not. Tightening is what large type conventionally gets, and Lora at semibold takes it without
the letters touching.

**Only `h1` and `h2`.** An item title is an `h3` at body size, per DDR-011, which is text size, so
it keeps the spacing Lora was drawn with. `h4` to `h6` likewise.

**Loose, for the two labels that are read as labels but still read as words.** A technology tag is
one word to scan in a row of them; opening it slightly is what makes the row read as a set of
labels rather than a broken sentence. The timeline's date range is the same: it labels the row.

**The place beside the date range takes none**, which is why the tracking is the date line's own
class and not the date column's. "Quartino, Switzerland" is a proper name, and a proper name should
read as the words it is. The design draws it untracked too.

**Extra-loose, for the two smallest labels.** A level badge and a skill group's name are the
shortest, most repeated text on the page, and each is a label for a list rather than a name for a
thing. At that length, wide tracking is what separates a label from a word.

**A skill group's name is an `h3`**, the same element as a role's job title, and it is the one
place an item title is set apart. The rule is written in `skills.module.css` against a class of its
own rather than on `h3` in the base styles, so no other item title is touched.

### Where it lives

`app/tokens.css` defines the three, in the typography block, per ADR-001. `app/globals.css` applies
`tight` to `h1` and `h2`, because those are plain HTML elements. The four label roles are classes,
so each is written in the CSS Module that owns it: `projects.module.css` for the tag,
`timeline.module.css` for the date range, `skills.module.css` for the badge and the group name.

`components/stylesheets.test.ts` now reads `letter-spacing` alongside the sizes and spaces it
already checks, so a component that writes a literal tracking value fails the suite. `letter-spacing`
was not in that list before, because until now there was no tracking to write.

`app/tokens.test.ts` holds the three values and the em unit; `app/globals.test.ts` holds the two
headings and checks that nothing else in the base styles is tracked.

### Nothing is redefined for a width or for paper

Tracking takes no narrow value and no print value. It is a proportion of the text, and DDR-015
already measures every rem on paper from an 11pt base, so the type and its tracking shrink
together. There is one system at every width and on both surfaces.

## Alternatives Considered

### Option A: Copy the design's six pixel values

Pros:
* Matches the Figma file exactly, value for value.

Cons:
* Six numbers where there are three ratios. The repetition in the design's own table is the system;
  writing it out six times hides it.
* Pixel tracking does not follow the reader's text size, so a reader at 200% would get letters
  twice as large with the same gaps between them — which is a different design, and a worse one.
* The design's sizes are not this site's. Its 10px and 11px are below DDR-011's floor, so a pixel
  value copied from it would be tracking sized for text the page does not set.

### Option B: Set tracking in rem, as every other length is

Pros:
* One unit across the whole token layer, with no exception to explain.

Cons:
* It gets the typography wrong. A single rem value would put the same absolute gap between 48px
  letters and 13px letters; whichever of the two it suited, it would not suit the other.
* It would need six values to compensate — one per role — which is Option A again with a different
  unit.
* The reason rem is right for sizes and spaces is that they are measured against the page. Tracking
  is measured against the word, and em is the unit for that.

### Option C: Apply tracking to `h1`–`h6` and to every small label at once, in the base styles

Pros:
* Shorter: two rules rather than six, and no new class in two components.

Cons:
* A skill group's name and a role's job title are both `h3`, and the design tracks one and not the
  other. A base rule cannot tell them apart.
* The same for the date range and the place: both are metadata lines in the same column, and only
  one is tracked.
* It would track item titles, which the design leaves alone, so the page would stop matching the
  file in the course of making it match.

### Option D: Wait for #75, and land the tracking with the caps

Pros:
* Every text that takes `x-loose` is also uppercase in the design, and wide tracking is a convention
  of uppercase setting. Landing them together would never show the intermediate state.

Cons:
* The two are separate decisions about separate properties, and #74's acceptance criteria ask for
  tracking on its own. Merging them would put case, weight and tracking in one story and one
  record, which is harder to review and harder to revisit.
* Tracking is recorded here and case is recorded by #75; each record then says one thing.
* The intermediate state is visible but not broken, and it is the length of one story. It is
  recorded as a tradeoff below rather than designed around.

### Option E: Track nothing, and record that as the decision

Pros:
* No new tokens, no new classes, no risk to the PDF guarantee, nothing to check at 200%.
* The faces' own spacing is what their designers drew.

Cons:
* Epic #70's outcome is that every difference from the design is either a recorded decision or
  tracked work. This would be a recorded decision, so it is a legitimate answer — but it answers by
  declining the design's texture.
* At 48px, Lora's default spacing genuinely does read loose. The tightening is not decoration; it
  is what makes the name read as a set heading.

## Consequences

Benefits:

* The page has a tracking system where it had none: three values, named, defined once, read by
  role. A later component asking "how much tracking?" has a token to read rather than a number to
  invent, which is the same guarantee ADR-001 gives sizes and colours.
* Six of the differences the #70 audit found are closed at once, and they are closed by three
  decisions rather than six measurements.
* Tracking follows the reader's text size, and follows the 11pt print base, with no rule of its own
  in either place.
* Because tracking is now in `components/stylesheets.test.ts`'s list, the next component that wants
  a density of its own has to come back here rather than write a number.

Tradeoffs:

* **`x-loose` lands one story before the caps it was drawn for.** In the design, the level badge
  and the skill group's name are uppercase, and +0.1em is a convention of uppercase setting; on
  lowercase it reads airy. #75 sets them in caps and the pair resolves. This is the visible cost of
  splitting tracking from case, and the split is what keeps each record about one property.
* Tracked text is wider. Every tracked run on the page grew, most of it by under a character's
  width; the measurements are below.
* The type system now has two units where it had one. The exception is confined to tracking and the
  reason is written down, but "every length is in rem" is no longer true without qualification.
* Two components gained a class that exists only to carry tracking — `.name` in skills and
  `.dateRange` in the timeline. Both are hooks #75 will need anyway.

Risks:

* **The PDF guarantee.** Tracking is a way to lose it that has nothing to do with glyph mapping: an
  extractor infers word boundaries from glyph positions, so enough tracking can split a word.
  **Checked, not assumed** — the built page was printed to A4 in Edge and Firefox through WebDriver
  and the text read back with both pypdf and pdfium. Of the 434 distinct words the page shows, all
  434 came back out of both PDFs through both readers except "Get", from the CV control print
  hides, which is the same single exception #52 recorded. No replacement character in either, the
  apostrophe still reads back as U+2019, and a search for any run of single letters separated by
  spaces — which is what a split word would look like — found none. The badge words at +0.1em come
  back whole. This is the check to repeat if any tracking value is raised.
* **Paper did not grow.** Edge prints 4 sheets and Firefox 5, which is exactly what #52 recorded
  and #71 rechecked, and in both every section heading still sits on the sheet as its first item.
* **Reflow.** Wider words are the thing that breaks 320px at 200%. Checked at 320px, 360px and
  390px, each at the browser's default font size and at double it: no horizontal scrollbar in any
  of the six. At the worst case, 320px at 200%, no skill group name gained a line, the name still
  sets in three, and the page grew 248px in about 26,800 — under 1%. The widest single tracked run
  grew by 26px there, and the widest of them all, a level badge, sets at 174px in a 273px column.
  The value to watch is `x-loose`, which is both the largest and the one on the longest labels.
* **A future value.** A fourth step, or `x-loose` raised, needs both checks above again. The
  ratios here are small enough that neither check was close.
* **Tight on a future heading.** −0.025em is safe for Lora at semibold at 22px and up. A heading set
  much smaller, or in a lighter weight, would need it re-judged; `h3` is already excluded for this
  reason.

## Related Documents

* GitHub issue #74, which this decision resolves, and Epic #70, which found the gap
* DDR-011, the typographic system this amends, which stands unchanged otherwise
* DDR-009, which amended DDR-001 the same way, and is the precedent for amending rather than
  superseding
* DDR-014, the responsive record whose 320px-at-200% requirement the tracking was checked against
* DDR-015, the print record, whose 11pt base carries tracking down to paper with the type
* GitHub issue #75, which sets the label text in caps, and #76 to #78, the rest of Epic #70
* ADR-001, which makes a design value a token, and ADR-006, which says which literals a component
  stylesheet may write
* The Figma design `career-site-design`, nodes `2:33`, `2:83`, `2:91`, `2:294`, `2:467` and `2:472`
* GitHub issues #22 and #40, the PDF faults that made text extraction the way print is checked
