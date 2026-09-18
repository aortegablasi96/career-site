# DDR-038-Running Text Leading

Status: Accepted

Date: 2026-09-18

**Supersedes DDR-011's line heights**, and nothing else there. DDR-011 set two leadings, 1.5 for
all text and 1.2 for headings, and carried them over from DDR-001 without argument. This record
keeps both and adds two for running text. DDR-011 is still the record to read for the typefaces,
the file recipe, the PDF guarantee, the measure and the wrapping rules.

**Closes DDR-022's open item.** DDR-022 took the design's sizes and left its leading behind. It
said the page would set running text tighter than the file, and that Epic #70's closing pass
should treat that as an open item. Issue #118 is that item.

**Amends DDR-015 in one respect:** paper sets running text at the body's leading, not the screen's.
The print block redefines the two new tokens and nothing else changes. DDR-032's measurements
therefore stand: the printed sheets are pixel-identical to the ones before this record.

## Context

Epic #70 closes the gaps between the page and the Figma design `career-site-design`. On 2026-09-17
the owner decided that the design prevails everywhere. Line spacing is the largest remaining reason
the page reads denser than the file.

The design sets running text looser than short lines, and it gets tighter as the text gets smaller.
These values come from the Figma Make file, as issue #118 records them:

| Text                       | Size | Design's leading | Line box        |
| -------------------------- | ---- | ---------------- | --------------- |
| The introduction's summary | 15px | 1.75             | 26.25px         |
| A role's bullet points     | 14px | 1.7              | 23.8px          |
| A project's description    | 14px | 1.72             | 24.08px         |
| A level's skills           | 13px | 1.65             | 21.45px         |
| A thesis sentence          | 13px | `leading-relaxed`, 1.625 | 21.125px |
| Short lines                | —    | 1.5              | —               |

The page set all of them at 1.5. #118 asks for the smallest set of named tokens that reproduces the
design within half a pixel per line, with headings keeping their own leading.

## Decision

### Four leadings, two of them for running text

| Token                       | Value | Sets                                                            |
| --------------------------- | ----- | --------------------------------------------------------------- |
| `--line-height-body`        | 1.5   | Every short line, and anything that sets no leading of its own  |
| `--line-height-prose`       | 1.72  | The summary, a role's points, a project's description           |
| `--line-height-prose-small` | 1.65  | A level's skills, a thesis sentence                             |
| `--line-height-heading`     | 1.2   | Every heading, unchanged                                        |

**Two is the fewest that reach the design.** To stay within half a pixel of the summary, a single
leading would have to be between 1.717 and 1.783. To stay within half a pixel of the skills, it
would have to be between 1.612 and 1.664. The two ranges do not overlap, so no single value can
serve all five blocks. Each of the two values is one the design itself uses for one of the blocks
it sets.

At the design's sizes:

| Text               | Design   | Page    | Difference per line |
| ------------------ | -------- | ------- | ------------------- |
| The summary        | 26.25px  | 25.8px  | −0.45px             |
| A role's points    | 23.8px   | 24.08px | +0.28px             |
| A description      | 24.08px  | 24.08px | 0                   |
| A level's skills   | 21.45px  | 21.45px | 0                   |
| A thesis sentence  | 21.125px | 21.45px | +0.33px             |

`app/tokens.test.ts` holds each of the five blocks to less than half a pixel per line, from the
tokens themselves. If a size or a leading changes and breaks that, the suite fails.

The prose values are named for the text they set, as `body` and `heading` are. They are not named
after a step on a scale. The small value belongs to the smallest running text, because that is
where the design tightens it.

### Where each is read

| File                      | Rule            | Leading       |
| ------------------------- | --------------- | ------------- |
| `introduction.module.css` | `.summary`, new | `prose`       |
| `experience.module.css`   | `.points`       | `prose`       |
| `projects.module.css`     | `.content > p`  | `prose`       |
| `skills.module.css`       | `.skills`       | `prose-small` |
| `credentials.module.css`  | `.thesis`       | `prose-small` |

Three of those choices need a reason:

* **The summary gets a class.** The positioning line and the location are paragraphs in the same
  column, and they are short lines. `.text > p` would have caught all four. Both paragraphs of the
  summary take the class, because the design sets the whole summary (node `2:44`) at one leading.
* **The skills take it, the level does not.** A level is one paragraph: its badge, then its skills
  in a block-level span, per DDR-037. Setting the leading on `.skills` leaves the badge's line at
  the body's 1.5, as the design sets its short lines.
* **`line-height` joins the properties `components/stylesheets.test.ts` holds to tokens.** A
  literal leading in a component stylesheet now fails the suite, as a literal size or tracking
  already does. No component wrote one before this change.

### Paper keeps 1.5

The print block sets both prose tokens to `var(--line-height-body)`. The design has no print view,
so this is DDR-015's decision to make and not a departure from the file. It was measured both ways
and the owner chose it on #118:

| Printed to A4, background graphics on | Sheets (Edge / Firefox) | Section headings (Edge)  | Section headings (Firefox) |
| ------------------------------------- | ----------------------- | ------------------------ | -------------------------- |
| Before this change                    | 6 / 6                   | 1, 3, 4, 5, 5            | 1, 3, 4, 5, 5              |
| The design's leading on paper         | **7 / 7**               | 2, 4, 6, 6, 7            | 2, 4, 5, 6, 6              |
| **1.5 on paper, as shipped**          | 6 / 6                   | 1, 3, 4, 5, 5            | 1, 3, 4, 5, 5              |

With the design's leading, sheet 1 held only the introduction. Edge and Firefox also stopped
breaking in the same places, which DDR-032 had fixed on #99. With 1.5, each sheet is
pixel-identical to the tree this branched from, in both browsers, with background graphics on and
off.

## Alternatives Considered

### Option A: One running-text leading

Pros:
* One token, not two, and one rule for "this is running text".

Cons:
* It cannot meet #118's half-pixel criterion. The best single value, about 1.69, is 0.9px short per
  line on the summary and 0.5px over on the skills.

### Option B: One leading per block, the design's exact numbers

Pros:
* Every block matches the file exactly, with no rounding.

Cons:
* Five tokens for differences of less than half a pixel. #118 asks for the smallest set that stays
  within half a pixel, and this is not it.
* It would copy every value the draft happens to use, with no system behind it. That is the
  argument DDR-022 made against a leading per role.

### Option C: The design's leading on paper too

Pros:
* No print override. The sheet sets text exactly as the screen does.

Cons:
* Measured above: a seventh sheet in both browsers, an introduction alone on sheet 1, and two
  browsers that no longer break alike.
* The design has no sheet to match, so paper does not gain fidelity to the file.

### Option D: Set the leading on `body` and tighten short lines back to 1.5

Pros:
* Running text gets the new leading with no component rules.

Cons:
* Short lines are most of the page's elements, so each would need a rule to undo it. The default
  would become the exception.
* It still needs a second value for the 13px text, so it saves nothing.

## Consequences

### Benefits

* Running text on screen matches the design within half a pixel per line. At the design's 894px
  the page is 180px taller, which is the leading's share of the 807px #118 measured.
* Leading is now a set of tokens that the stylesheet test guards, like size and tracking.
* The printed CV does not change at all.

### Tradeoffs

* **The page is longer on every screen.** Measured in Edge at the default text size, it is 396px
  taller at 320px, 341px at 360px, 307px at 390px and 142px at 1536px. At 200% text it is 1706px
  taller at 320px. Text that was one scroll away is now further.
* **Screen and paper now set running text differently.** That is new: until now paper changed
  sizes, surfaces and layout, but never leading.
* The summary is 0.45px short of the design per line, which is close to the limit. If the summary's
  size changes, check this again. The test will fail first.

### Risks

* **A page that stays in step with DDR-032 depends on the print override.** If someone removes it
  as redundant, the CV becomes seven sheets and the browsers break differently again. The tokens
  test holds both overrides by name.
* **#119 and #120 measure spacing on this leading.** DDR-037's 8px between a badge and its skills
  was argued partly on the design's taller skills line. That argument no longer applies, and #119
  now owns the choice.

## What was measured

In Edge 153, with the browser's own default font size set at 16px and at 32px over CDP, so em media
queries follow it. Both the branch and the tree it branched from were built and served side by
side.

**Computed leadings.** Every block reads back at the value above: 25.8px on the summary, 24.08px on
the points and descriptions, 21.45px on the skills and theses. The location line stays at 21px,
which is 1.5. Firefox gives 24.0833px for a point.

**Reflow.** At 320px, 360px, 390px, 894px and 1536px, at both text sizes, `scrollWidth` equals
`clientWidth`. Nothing scrolls sideways.

**The name beside the photo (#68).** Unchanged in every case. At the default size the name sits
beside the photo at every width. At 200% it drops below the photo at 320px, 360px and 390px and
stays beside it at 894px and 1536px, exactly as before. This change does not touch the heading's
leading, the photo or the float, so nothing here can move it.

**Paper**, printed to A4 in Edge 153 and Firefox 156 through WebDriver: see the table above. Each
sheet matches the old tree pixel for pixel. pypdf returns identical text, with no replacement
character.

## Related Documents

* GitHub issue #118, which this decision resolves, and Epic #70
* Figma Make file: `leading-[1.75]` on the summary, `leading-[1.7]` on the bullets,
  `leading-[1.72]` on the descriptions, `leading-[1.65]` on the skills, `leading-relaxed` on the
  thesis
* DDR-011, whose line heights this supersedes
* DDR-022, whose open item this closes
* DDR-015 and DDR-032, the print treatment and its measurements, which this amends in one respect
  and leaves standing
* DDR-037, the skill badge above its skills, whose 8px step #119 now decides on this leading
* GitHub issue #68, the name beside the photo at enlarged text
* GitHub issues #119 and #120, the spacing that makes up the rest of the height gap
