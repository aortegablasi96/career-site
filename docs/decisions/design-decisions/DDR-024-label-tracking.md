# DDR-024-Label Tracking

Status: Accepted

Date: 2026-09-17

**Supersedes DDR-018's tracking amendment**, and restores the row of DDR-017's table that amendment
changed. DDR-018 stands in every other respect — its case, its ink, its selectors, and its reason
for drawing the case rather than writing it. DDR-017 stands entire: its three values, its em unit
and all six of its users are exactly as it wrote them, and this record adds no token and removes
none.

Nothing else reaches into this one. DDR-022's sizes, DDR-023's faces and weights and DDR-012's
pairings are untouched, and so are DDR-011's line heights, measure and wrapping. What moves is one
declaration in one stylesheet.

## Context

The design draws two labels at +0.1em: a level badge, at `tracking-[1px]` on 10px, and a skill
group's name, at `tracking-[1.28px]` on 12.8px. DDR-017 read those out of the file and gave both
`--letter-spacing-x-loose`. One story later DDR-018 took it off the badge, and not as a preference —
printed to A4 and read back, `PROFICIENT` came out of both browsers as `P R O F I C I E N T`, which
is the fault DDR-011's guarantee exists to prevent. The group's name kept +0.1em because it was set
in Lora, which was unaffected.

Two things have changed since, and together they make the question unavoidable rather than
deferrable.

* **DDR-022 took the badge from 13px to 10px.** At 13px, DM Sans at 400 survived +0.1em and every
  heavier weight split, so DDR-018 read the fault as being about weight. At 10px the same tracking
  splits the badge at **every** weight the site ships, 400 included. DDR-023 measured that and
  corrected the reasoning: it is the size, not the weight.
* **DDR-023 moved the group's name into DM Sans Bold.** The one thing that kept the name safe was
  that it was Lora. It is not any more.

So after DDR-023 the page has one label at +0.1em and one at +0.025em, both in DM Sans, with nothing
distinguishing them except the history of a measurement that has since been shown to be about
something else. That is the state this record ends.

**The owner has decided that the design prevails**, including over the records written to protect
WCAG conformance and DDR-011's PDF guarantee — the decision recorded on Epic #70 on 2026-09-17. This
is the story on that Epic where the cost is the smallest and the most exactly measurable: three
words of the printed CV, in one browser, through one reader.

The constraints are:

* **DDR-017's em unit**, which is the type system's one exception and does not move here.
* **ADR-001 and ADR-006**: the value is a token read by the stylesheet, never a literal.
* **DDR-011's PDF guarantee**, which this record knowingly narrows, and which therefore has to be
  restated precisely rather than quietly weakened.
* **ADR-002 and ADR-005**: the page is the CV, so what a browser writes into a PDF is part of the
  design and a fact the downloadable file is held against.
* **DDR-014**: nothing scrolls horizontally at 320px with text at 200%. Opening letters up makes a
  tracked word wider, and the badge sits on a line with the skills it labels.

## Decision

### Both DM Sans labels take `x-loose`, 0.1em

| Text                 | Tracking before | Tracking now  | As the design draws it        |
| -------------------- | --------------- | ------------- | ----------------------------- |
| A level badge        | `loose`         | **`x-loose`** | +1px on 10px, node `2:473`    |
| A skill group's name | `x-loose`       | `x-loose`     | +1.28px on 12.8px, node `2:468` |

One declaration changes: `letter-spacing` on `.badge` in `components/skills.module.css`. The token
it reads is DDR-017's, unchanged, and no literal is written anywhere.

The other four users of tracking do not move, because they already match the file: the date range
and the technology tags keep `loose` at +0.025em, and `h1` and `h2` keep `tight` at −0.025em.

### The printed CV loses three words as search terms, and that is the decision

**Measured, not predicted.** The built page was served locally and printed to A4 through WebDriver
in Edge 153 and Firefox 156, with background graphics on, and every PDF read back with both pypdf
and pypdfium2. The same page was printed a second time in each browser with the badge alone forced
back to +0.025em by an inline style — DDR-018's state exactly, with the group's name left at
+0.1em — so the two columns below differ in one property and nothing else.

Of the 496 distinct words the page shows:

| Browser | Reader | At +0.1em, as it ships                      | At +0.025em, DDR-018's value |
| ------- | ------ | ------------------------------------------- | ---------------------------- |
| Edge    | pypdf  | every word whole                            | every word whole             |
| Edge    | pdfium | every word whole                            | every word whole             |
| Firefox | pypdf  | **`ADVANCED`, `PROFICIENT`, `BASIC` split** | every word whole             |
| Firefox | pdfium | every word whole                            | every word whole             |

Exactly three words, in one browser, through one reader. They come back as

```text
A DVA N C E D          P R O F I C I E N T          B A S I C
```

so `ADVANCED` breaks into fragments and the other two spell out letter by letter. A case-sensitive
search of a Firefox-saved PDF for `PROFICIENT` no longer matches; the same search of an Edge-saved
PDF still does, and a reader looking at either sheet still sees the word.

**Every other word survives, in both browsers through both readers.** The four skill-group names —
`PRODUCT AND DELIVERY`, `AI`, `DATA AND IOT` and `TOOLS` — come back whole at +0.1em in all four
extractions, which is what makes this a decision about the badge alone. All seven date ranges come
back whole. There is no replacement character anywhere, the apostrophe is still U+2019 and never
U+02BC, and the only other words the page shows that do not come back are the ones that did not come
back before this change either: `Get` and `CV`, from the CV control that print hides, in both
browsers, and `Copilot-driven` and `data-driven`, which Firefox wraps at their hyphens. Those four
appear in both columns above and are not this record's doing.

### DDR-011's guarantee, restated

DDR-018 had already narrowed it once, to "a PDF spells every word as the page **draws** it". This
record narrows it again, and this is now the whole of it:

> A PDF saved from this page spells every word as the page draws it, except the three level badges
> saved from Firefox, whose letters a text extractor reads as separate words.

That is a statement about the page as it ships, and a later change that puts +0.1em on any other DM
Sans run at or near 10px has to print and read back before it can claim more.

### Nothing else moves

No token is added, removed or redefined. No component stylesheet writes a literal tracking value;
`components/stylesheets.test.ts` still reads `letter-spacing` alongside the sizes and spaces, so it
still fails on one. No string in `content/` is rewritten — the case is drawn, per DDR-018 — so
`content/cv.ts`'s digest does not move and the downloadable CV stays in step, per ADR-005. There is
no print rule and no width at which the tracking differs: one value everywhere, as DDR-017 set it.

## Alternatives Considered

### Option A: Leave the badge at `loose` and record that as the decision

Pros:

* Keeps DDR-011's guarantee whole, and keeps three words of the printed CV searchable.
* Costs nothing to measure and risks nothing.

Cons:

* It declines the design on the one Epic whose premise is that the design prevails. The owner has
  decided that question, and a UI story is not the place to reopen it.
* It leaves the page with two DM Sans labels at two trackings and no rule telling them apart. After
  DDR-023 the only thing distinguishing them is that one was measured at a size it no longer has.
* It does not actually retreat to safety. DDR-023 measured the group's name at +0.1em in DM Sans
  Bold and it comes back whole, so the page already ships a DM Sans label at the tracking DDR-018
  called unsafe. The rule was already inconsistent; this option preserves the inconsistency.

### Option B: Take the group's name down to `loose` as well, so both labels match at +0.025em

Pros:

* One tracking for both labels, which is the consistency Option A lacks.
* No word of the CV is lost.

Cons:

* It moves *away* from the design in two places rather than towards it in one, which is the opposite
  of what this Epic is for.
* It would leave `--letter-spacing-x-loose` with no user at all, so a token would exist for nothing
  and DDR-017's three-value system would become a two-value one by side effect.
* The name's +0.1em is measured safe. Removing a value that works, to match one that does not, is a
  cost with no benefit on either side of the argument.

### Option C: Keep +0.1em but add word-spacing or a hidden duplicate so the extractor reads it whole

Pros:

* In principle it could have both: the design's texture on screen and the whole word in the PDF.

Cons:

* Print-only content is what DDR-015 draws the line at. A second copy of the word for a text
  extractor is content that exists for a machine and for no reader, which is exactly the shape of
  thing that record refuses.
* It is a guess about how two extractors segment runs, not a mechanism either of them documents. It
  would work until a reader changed.
* Hiding it needs `position: absolute` or a clip, and `components/stylesheets.test.ts` admits
  absolute positioning on a pseudo-element alone, per DDR-021.

### Option D: Take the badge back up in size so +0.1em is safe again

Pros:

* At 13px, +0.1em was safe at 400 — DDR-018 measured it. A larger badge could carry the design's
  tracking and keep the word.

Cons:

* It trades one difference from the design for another, and a larger one: DDR-022 read the badge's
  10px node by node off the file, and the size is a decision of its own that this story has no
  standing to reverse.
* It is only safe at 400, and DDR-023 gives the badge the design's bold. There is no combination of
  size and weight the file draws that is also safe.

### Option E: Keep `x-loose` on the name and give the badge a fourth value between the two

Pros:

* It might find the widest tracking the badge survives, keeping most of the design's texture.

Cons:

* A fourth value is a new token and a revision of DDR-017's "three proportions, not six values",
  which is the thing that record exists to say.
* It would not be the design's value either, so the difference this Epic exists to close would stay
  open, just smaller.

## Consequences

### Benefits

* **Both DM Sans labels are drawn as the file draws them**, which closes the last of Epic #70's
  typographic differences. Taken with DDR-022 and DDR-023, every size, face, weight, style and
  tracking on the page is now the design's.
* **The rule that is left is simple and true**: the two labels that label the block below them take
  the widest tracking, and everything else takes what its face was drawn with, or one small step.
  Nobody has to know which of them was once measured at a different size.
* **DDR-017's table is the page again**, in every row, for the first time since DDR-018.
* The cost is bounded and written down, rather than discovered by whoever next prints the CV.

### Tradeoffs

* **Three words of the printed CV are no longer searchable in a PDF saved from Firefox.**
  `ADVANCED`, `PROFICIENT` and `BASIC`. They are searchable in Edge, visible on the sheet in both,
  and present in the separately designed `public/andreu-ortega-blasi-cv.pdf`, which is not affected
  by how a browser prints the page.
* **DDR-011's guarantee now carries an exception**, which it did not before. It is stated above in
  one sentence, and it is the first exception that record has accepted in its lifetime.
* **The badge is wider.** Measured in Edge at the browser's default font size, the widest badge grows
  from 76.3px to 83.8px, and at 200% text from 152.5px to 167.5px.
* **A line of skills wraps where it did not, at the narrowest widths only.** Measured in Edge with
  the badge alone toggled back, the document grows by 39px at 320px at the default size and 78px at
  200% text, by nothing at 360px at the default size and 39px at 200%, and by nothing at 390px at
  either size. Each 39px is one line of a level's skills inside a skill group — the line the badge
  leads — and never a heading, a badge or a group name: no `h3` and no badge gains a line at any of
  the eight combinations checked, and the badge stays on one line throughout.

### Risks

* **Reflow.** **Checked, not assumed.** Measured in Edge with the browser's default font size set
  over CDP, at 320px, 360px, 390px and 1280px, each at 16px and at 32px: the document's scroll width
  equals its client width in all eight, so nothing scrolls horizontally, and the badge stays on one
  line in all eight.
* **The printed length.** **Checked, not assumed.** Five sheets in Edge and five in Firefox, at
  +0.1em and at +0.025em alike, which is what DDR-023 recorded for the page this branched from. The
  one extra line of skills falls inside a group rather than at a boundary, so no section heading is
  stranded and no item is split. #99 owns the Epic's closing print check and takes the final count.
* **A third DM Sans label at +0.1em.** The measurement above is of these two runs at these two
  sizes. Anything later that wants the widest tracking on DM Sans has to print the page and read the
  text back before it can have it — which is the check DDR-017 prescribed, DDR-018 first failed, and
  this record fails deliberately.
* **Screen readers are unaffected.** The DOM text is untouched, tracking is not announced, and the
  badge's accessible text is still `Advanced`.
* **The level is still a word.** DDR-010 keeps levels as words rather than dots or bars precisely so
  that nothing depends on the tint, and DDR-018 gave the badge case and weight so that it survives
  paper without one. None of that is affected by how an extractor segments the glyphs: a reader
  looking at the sheet sees `ADVANCED`.

## Related Documents

* GitHub issue #92, which this decision resolves, and Epic #70, which decided that the design
  prevails over a conflicting record
* DDR-017, letter-spacing, whose amended row this restores and whose three values this leaves alone
* DDR-018, the uppercase labels, whose tracking amendment this supersedes
* DDR-022, the type scale, which took the badge to 10px and is why the fault is no longer about
  weight, and DDR-023, the typefaces, which measured that and moved the group's name into DM Sans
* DDR-011, the typographic system, whose PDF guarantee this narrows
* DDR-010, which keeps a level as a word, and DDR-015, which drops the badge's tint on paper
* DDR-014, the responsive record, whose 320px-at-200% requirement the wider badge was checked
  against
* ADR-001 and ADR-006, which keep the value a token, ADR-002, which makes the page the CV, and
  ADR-005, which holds the CV and the page to the same facts
* GitHub issues #22, #40 and #75, the three faults in what a browser writes into a PDF that made
  this a thing to measure
