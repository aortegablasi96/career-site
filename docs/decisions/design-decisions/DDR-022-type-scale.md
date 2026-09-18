# DDR-022-Type Scale

Status: Accepted

Date: 2026-09-17

**Supersedes DDR-011's type scale and its 13px floor**, and nothing else of that record. DDR-011
stands, and is still the record to read, for the two typefaces, the one-static-file-per-weight
recipe, the three weights, the no-italics rule, the PDF guarantee that a saved document spells every
word as the page draws it, the line heights, the measure and the wrapping rules. What this record
replaces is its seven steps, its statement that body text is 16px, and its floor.

DDR-011's reasons for the shape of the scale carry forward: the steps are the sizes the design asks
for rather than one ratio applied repeatedly, they are written in rem so the whole scale follows the
reader's browser font-size setting, and no font size is written in px anywhere. What does not carry
forward is every number, the count, and the claim that `medium` is the browser default.

**Amends DDR-015, the print treatment**, in one number: its 11pt base becomes 12pt. DDR-015 chose
11pt so that body text — then a 1rem step — printed at 11pt. Body text is 0.9375rem here, so the
base had to move for that decision to keep its meaning. Everything else DDR-015 decides is
untouched, and #99 prints the page and may move the base again.

**DDR-032 printed it on #99 and kept 12pt**: 11pt saves no sheet in either browser, and 12.8pt,
which would put the smallest step at 8pt, costs two.

DDR-014 reads this scale and is unchanged: the narrow breakpoint still steps the page and section
titles down one step each rather than shrinking them, and it still redefines the same four role
tokens and the language count. DDR-017's tracking is unchanged too, because it is measured in em and
therefore follows these sizes down on its own.

## Context

Epic #70 adopts the Figma design `career-site-design` everywhere the page and the file differ, and
**on 2026-09-17 the owner decided that the design prevails over every accepted record**, including
the records written to protect WCAG conformance. Six of the fifteen differences the Epic audited are
type sizes, and they are the widest of them: the design fits a role and its points in noticeably
less height than the page does, and the scale is most of the reason.

DDR-011 is where that gap was created, deliberately and on the record. It rejected six of the
design's sizes outright, raised body text from the design's 15px to 16px on the grounds that DM
Sans's x-height carries it, and set a 13px floor that it allowed for the technology tags and the
level badges alone. Its Option D — "Keep the 14.4px floor, and set tags and badges at 14px" — was
turned down for exactly the reason the design is being adopted now: "the density is the point of the
redesign". This record finishes that argument in the design's favour.

The design's sizes, measured node by node off `career-site-design` on 2026-09-17:

| What                                    | Node    | Design            | Page before |
| --------------------------------------- | ------- | ----------------- | ----------- |
| The page title                          | `2:34`  | Lora 51.2px       | 48px        |
| The positioning line                    | `2:37`  | 16px              | 18px        |
| The location line                       | `2:40`  | 14px              | 14px        |
| The summary, and every paragraph of it  | `2:44`  | 15px              | 16px        |
| A contact pill's label                  | `2:56`  | 13px              | 16px        |
| A contents link                         | `2:10`  | 13px              | 16px        |
| A section title                         | `2:85`  | Lora 20.8px       | 22px        |
| A date range                            | `2:93`  | 11px              | 14px        |
| A place                                 | `2:96`  | 11px              | 14px        |
| A role's job title                      | `2:102` | 15px              | 16px        |
| A company                               | `2:105` | 14px              | 14px        |
| A role's bullet point                   | `2:110` | 14px              | 14px        |
| A project's name                        | `2:292` | 15px              | 16px        |
| A technology tag                        | `2:296` | 11px              | 13px        |
| A project's description                 | `2:317` | 14px              | 16px        |
| A project's link                        | `2:321` | 13px              | 16px        |
| A skill group's name                    | `2:468` | 12.8px            | 16px        |
| A level badge                           | `2:473` | 10px              | 13px        |
| A level's skills                        | `2:476` | 13px              | 14px        |
| A credential's name                     | `2:610` | 14px              | 16px        |
| An institution                          | `2:613` | 14px              | 14px        |
| A thesis sentence                       | `2:616` | 13px              | 16px        |
| A language, as a term                   | `2:656` | 14px              | 16px        |
| A language's level                      | `2:659` | 13px              | 16px        |

That is **nine distinct sizes** — 10, 11, 12.8, 13, 14, 15, 16, 20.8 and 51.2px — where the page had
seven, and four of the nine sit within 2px of one another at the bottom.

The constraints are the ones the earlier records set and this story does not get to relax on its
own:

* **ADR-001**: every design value is a custom property defined once at the root, and a component
  stylesheet reads tokens rather than writing values. **ADR-006** says which literals it may write,
  and this record adds none.
* **DDR-014**: the tokens are mobile-first, there are two breakpoints and no third, the page and
  section titles step *down* a step on the narrowest viewports rather than being shrunk, nothing
  scrolls horizontally at 320px at any text size, and no text is clipped at 200%.
* **DDR-015**: the whole scale is measured from a base suited to paper, so a change to the scale is
  a change to what the printed CV sets at.

## Decision

### Ten steps

| Token                    | Value      | At the 16px default | What it sets                                                      |
| ------------------------ | ---------- | ------------------- | ----------------------------------------------------------------- |
| `--font-size-xxxx-small` | 0.625rem   | 10px                | A level badge                                                     |
| `--font-size-xxx-small`  | 0.6875rem  | 11px                | A date range, a place, a technology tag                           |
| `--font-size-xx-small`   | 0.8rem     | 12.8px              | A skill group's name                                              |
| `--font-size-x-small`    | 0.8125rem  | 13px                | A level's skills, a thesis, a pill's label, a link's label        |
| `--font-size-small`      | 0.875rem   | 14px                | A role's points, a company, an institution, a description, a term |
| `--font-size-medium`     | 0.9375rem  | 15px                | Body text, and an item title                                      |
| `--font-size-large`      | 1rem       | 16px                | The positioning line                                              |
| `--font-size-x-large`    | 1.3rem     | 20.8px              | A section title                                                   |
| `--font-size-xx-large`   | 2.25rem    | 36px                | The page title, below the narrow breakpoint                       |
| `--font-size-xxx-large`  | 3.2rem     | 51.2px              | The page title                                                    |

* **Nine of the ten are the design's own sizes.** `xx-large` is not, and the next section is why.
* **Sizes stay in rem**, and no font size is written in px. This is DDR-001's rule, carried through
  DDR-011, and it does not change.
* **The naming is CSS's own absolute-size keywords, extended by one at each end.** CSS names eight
  and the scale needs ten, so it gains `xxxx-small` below `xxx-small`, mirroring the `xxx-large`
  CSS already defines. The alternative — numbering the steps — is weighed below.
* **`medium` is body text, not the browser default.** DDR-011 could say both, because body text was
  1rem. The design's body is 15px, so the two have parted, and this record keeps `medium` on the
  body: `body` in `app/globals.css` reads it, `--font-size-item-title` refers to it, and what a
  reader of the stylesheet needs to know is which step the running text is. The step is 0.9375rem,
  so it still follows the reader's own setting; it is simply no longer equal to it.

### The narrow page title is the one step the design does not draw

DDR-014 steps the page and section titles down one step below the narrow breakpoint, rather than
shrinking them, so a long word in a heading fits a narrow column with enlarged text. The section
title steps down to `large`, 16px, which is a size the design draws. The page title cannot: the step
below `xxx-large` in the design's own nine is the section title's 20.8px, which would leave the name
and a section heading the same size on a phone and destroy the one hierarchy the page has above
everything else.

So the scale carries one step the design has no node for, and `--font-size-xx-large` is it. It
**keeps the 2.25rem DDR-011 gave it** — three quarters of the full title, as it was before — rather
than being rescaled to 2.4rem to hold that exact proportion against the larger 3.2rem. 2.25rem is
already measured at 320px and at 200% text and nothing about the narrow view is changing; a new
number there would be a number to re-measure for no gain.

This is not a divergence from the design. `career-site-design` is a single 894px frame with no
narrow view at all, which is the same reason Epic #70 leaves the mobile "Sections" disclosure out of
scope: the narrow view is DDR-014's, not the file's.

### The floor is 10px, and it is the level badge's alone

DDR-001 set a 12px floor and never went below 14.4px. DDR-011 lowered it to 13px and allowed it for
the technology tags and the level badges. This record lowers it to **10px**, and allows it for the
**level badge** and nothing else.

The design's own distribution is what narrows it: at 11px sit the date ranges, the places and the
technology tags; at 10px sits the level badge alone, which is one of three words — Advanced,
Proficient or Basic — in a tinted pill that repeats what the word says, leading a line whose skills
are set 3px larger.

**This is a real loss and it is recorded rather than absorbed.** WCAG sets no minimum text size, so
nothing here fails a success criterion: 1.4.4 asks that text scale to 200% without loss, and the
whole scale is in rem, so it does. What a reader who does not enlarge text meets is simply smaller
than it was — a date range at 11px where it was 14px, a badge at 10px where it was 13px — and a
reader who does enlarge starts from a lower base than before at every step.

### The item title stays body size, and a credential's name goes with it

`--font-size-item-title` is `--font-size-medium`, 15px, at every width, exactly as DDR-011 and
DDR-014 had it. It was reconsidered, per #90, and the answer did not move: the design sets a role's
job title and a project's name at 15px, which is the size it sets its running text at, and there is
still nothing below body size a title could take, so there is still no narrow value for it.

**One deliberate divergence from the file.** The design draws a *credential's* name at 14px (node
`2:610`) where it draws a role's job title and a project's name at 15px. This record sets all three
at 15px. DDR-010 makes a role and a credential one pattern — one timeline, one row, one anatomy —
and a 1px difference between two things the design itself draws identically in every other respect
reads as a slip in the draft rather than as an intention. #90 specifies 15px for an item title and
lists nothing for a credential, so this is the reading the story asks for. It is written down here
so the final pass over the file on Epic #70 finds a decision rather than a defect.

### Line heights do not change, and that leaves a difference behind

`--line-height-body: 1.5` and `--line-height-heading: 1.2` stand, as DDR-011 sets them.

**The design's leading is looser than the page's**, and this record does not adopt it: it sets the
summary at 26.25px on 15px, which is 1.75, a role's points at 1.7, a project's description at 1.72,
and a level's skills at 1.65, while setting every short line — a date, a place, a badge, a pill —
at 1.5 or below. Two tokens cannot express that, and a per-role leading system is a change to the
shape of the type system rather than to its numbers. #90 scopes line heights out and asks this
record to say which it takes, so: it takes DDR-011's, and **the page will set its running text
tighter than the file does**. That difference is named here, and Epic #70's closing pass over
`career-site-design` should treat it as an open item rather than as a recorded rejection.

### Paper is measured from 12pt

`--root-font-size` in the print block becomes **12pt**, where DDR-015 set 11pt.

DDR-005 chose 10pt so that DDR-001's smallest step came to exactly 9pt. DDR-015 raised it to 11pt so
that body text, a 1rem step, printed at 11pt and the smallest step landed at 8.94pt. Under this
scale body text is 0.9375rem, so an unchanged base prints it at 10.31pt and the level badges at
6.88pt — smaller than anything the printed CV has ever set. At 12pt:

| Step        | On paper |
| ----------- | -------- |
| xxxx-small  | 7.5pt    |
| xxx-small   | 8.25pt   |
| xx-small    | 9.6pt    |
| x-small     | 9.75pt   |
| small       | 10.5pt   |
| medium      | 11.25pt  |
| large       | 12pt     |
| x-large     | 15.6pt   |
| xxx-large   | 38.4pt   |

Body text at 11.25pt is DDR-015's decision held, and 12pt is a round number as 10pt and 11pt were.
**Nothing about the printed page is measured here.** The base moves the whole document, and the
sheet count, the breaks and what comes back out of a saved PDF can only be answered by printing;
#99 does that for the whole Epic and may move this number again.

### Where the sizes are read

Every role token and every component stylesheet reads a step; none writes a size. What changed
beyond the token layer:

| File                            | What it sets now                                                    |
| ------------------------------- | ------------------------------------------------------------------- |
| `timeline.module.css`           | Both lines of the date column at `xxx-small`, by `.dates p`         |
| `experience.module.css`         | A role's points, unchanged at `small`                               |
| `credentials.module.css`, new   | A degree's thesis at `x-small`, by a class of its own               |
| `projects.module.css`           | A tag at `xxx-small`, the description at `small`, a link at `x-small` |
| `skills.module.css`             | The group's name at `xx-small`, the level line at `x-small`, the badge at `xxxx-small` |
| `languages.module.css`          | The term at `small` and its level at `x-small`                      |
| `contents.module.css`           | A contents link at `x-small`                                        |
| `introduction.module.css`       | A pill's label at `x-small`; the positioning line unchanged at `large` |
| `metadata-line.module.css`      | Unchanged at `small`, which is no longer the smallest step           |

Two of those are worth naming, because they are the two places where a size could not simply be
added to an existing rule:

* **`.dates p` in the timeline.** Both lines in the date column are 11px in the design, and each is
  a metadata line whose step `metadata-line.module.css` sets from another module at one class of
  specificity. Naming the element outranks it without giving the place a class it has nothing else
  to say with, which keeps `.dates .dateRange` the one class pair in `components/`, per DDR-018.
* **`credentials.module.css`, a new file.** A thesis sentence is a paragraph in the same column as
  the institution, and a certification has an institution and no thesis, so no positional selector
  tells the two apart. It is what a credential has of its own, as a role's points are what a role
  has of its own, so it gets the sibling of `experience.module.css` that the convention already
  implies — and the place where #91 will put the design's italic.

## Alternatives Considered

### Option A: Keep DDR-011's seven steps and adopt only body text at 15px

Pros:
* One value changes, the scale keeps its shape, and nothing below 13px is ever set.
* No component stylesheet changes at all.

Cons:
* It is not the design, and the owner has decided the design prevails. Six of Epic #70's fifteen
  differences are sizes, and one of them is not six.
* It makes the page *worse* against the file rather than better: at 15px body with 16px titles and
  14px metadata the hierarchy compresses, and the density the design gets from a 10px badge under a
  13px line does not appear.

### Option B: Number the steps, `--font-size-1` to `--font-size-10`

Pros:
* No `xxxx-small`, and no argument about what `medium` means once it is not the browser default.
* Ten steps are past the point where a keyword scale reads naturally.

Cons:
* A number says nothing. `--font-size-5` in a stylesheet cannot be read as "the size of the running
  text" the way `--font-size-medium` can, and this scale has four steps within 2px at the bottom
  that a reader needs help telling apart by role.
* Every reference in every stylesheet and both test files would be rewritten for a naming
  preference, on the story the Epic already calls the widest in blast radius.
* The keywords survive the one thing that would break them — a new step — by extending at the end,
  which is what this record already does once.

### Option C: Anchor `medium` at the browser default, 1rem, and let body text be a step below it

Pros:
* `medium` keeps DDR-011's sentence exactly: medium is 1rem is the browser default.
* rem arithmetic stays legible at one step.

Cons:
* Six steps then sit below `medium` and three above, so the bottom of the scale needs five `x`
  prefixes rather than four, and the name gets worse rather than better.
* `body` in `app/globals.css` would read a step whose name says "middle" while setting text a step
  off it, which is the one place the name has to be right.

### Option D: Take the design's line heights with its sizes

Pros:
* It is the rest of the design's density, and the summary at 15px on 26.25px is what the file draws.
* Without it the page is tighter than the design in the one dimension this story is meant to fix.

Cons:
* The design uses at least six leadings, from 1.0 on a section title to 1.75 on the summary, split
  between running text and short lines. Two tokens cannot hold that, and adding a leading per role
  changes the shape of the type system rather than its values.
* #90 scopes line heights out and asks only that the record say which it takes. Doing both on one
  story would put the sizes and the leading in the same measurement, and the sizes are the change
  every other story on the Epic is measured against.
* It is recorded above as a remaining difference, so nothing is lost by leaving it to a story of its
  own.

### Option E: Hold the print base at 11pt and leave it to #99

Pros:
* The smallest possible change to DDR-015, and #99 is the story that can actually measure paper.
* No risk of moving the sheet count twice.

Cons:
* It ships a 6.88pt level badge and 10.31pt body text in the meantime, and #99 is eight stories
  away. DDR-015's decision was that body text prints at 11pt; holding the base is holding the lever
  rather than the decision.
* The base is one number, and #99 re-measures it either way.

## Consequences

### Benefits

* The page's type is the design's: nine of the ten steps are measured off `career-site-design`, and
  every element the Epic audited now sets at the size the file draws it at.
* The density the redesign was for arrives. A role's dates, place, company and points, and a skill
  group's whole block, occupy noticeably less height than they did, with the hierarchy carried by
  larger gaps between steps rather than by the 2px the old scale had at the bottom.
* The scale is one place. Ten steps and four role tokens, read by every stylesheet and held by
  `app/tokens.test.ts` step by step, so a size cannot drift without failing the suite.
* Tracking needed no change at all, which is DDR-017's em decision paying off: the page title's
  −0.025em and the badge's +0.025em follow the new sizes on their own.
* The printed CV keeps the body size DDR-015 chose for it.

### Tradeoffs

* **The type floor drops from 13px to 10px.** A level badge is 10px, and a date range, a place and a
  technology tag are 11px, where the smallest text on the page was 13px.
* **Body text drops from 16px to 15px**, so every reader who does not enlarge text reads the
  summary, the job titles and the project names slightly smaller.
* The scale has ten steps where it had seven, and four of them are within 2px of one another. It is
  a scale of measured sizes rather than a system a reader can derive, which is the price of matching
  a drawing node by node.
* `medium` is no longer 1rem, so a reader of the tokens can no longer assume a step and the root are
  the same thing anywhere.
* The page sets its running text tighter than the design does, because the leading did not move with
  the sizes. It is named above as an open item.
* The printed page is measured from a base 9% larger under a scale 6% smaller, so the sheet count
  is unknown until #99 prints it.

### Risks

* **The smallest labels in a saved PDF.** DDR-018 found that DM Sans above regular at +0.1em came
  back out of both browsers as `P R O F I C I E N T`, and the badge that failed that way is now
  10px rather than 13px and prints at 7.5pt rather than 8.94pt. Nothing in that fault was about
  size, and the tracking that caused it is still the loose step, but #99 has to read the text back
  out of both browsers' PDFs rather than look at the page — and #92 reinstates +0.1em on this badge
  deliberately, at 10px, which is the pairing to watch.
* **The name beside the photo.** The page title grew from 48px to 51.2px, which is enough that at a
  320px viewport with a scrollbar — the narrow breakpoint matched, with 305px of room — the name no
  longer fits beside the photo and drops below it at the full column. That is #68's mechanism
  working as intended, three whole words rather than four broken lines, and it is measured below,
  but anything that changes the title, the photo or the float has to be re-measured at 200%, not
  only at 100%.
* **A 7.5pt label on paper** is fine print. It is legible, it is two of three redundant words, and
  #99 is where a reader of the sheet gets the final say.
* **Every measurement any other record states about a size is now stale.** The date column's 1.9px
  of slack, the print length in both browsers, and the six float cases #68 measured were all taken
  against a 16px base. The ones this story could re-measure are re-measured below; the print length
  is #99's.

## What was measured

In Chromium at the browser's real default font size, and at double it, set through the browser's own
font-size preference rather than the root's CSS size, because an em in a media query follows the
former.

**Every size on the page** was read back off the built page with `getComputedStyle` and matches the
table in Context exactly, with the one recorded exception of a credential's name at 15px.

**Nothing scrolls horizontally, and nothing overflows the viewport**, at 320px, 360px and 390px, at
both the default text size and 200%: `scrollWidth` equals `clientWidth` in all six, and no element
inside `main` extends past the client edge in any of them.

**The date column, the tightest fit on the page before this story, is no longer tight.** At 1280px
the widest range, "Mar 2022 – May 2023", sets on one line in the 160px column with about 36px to
spare, where DDR-018 measured 1.9px at 14px. Every one of the five ranges sets on one line.

**The name and the photo**, measured before and after. The viewport is what the media query reads
and the client width is the room the page actually has, so both are given: Chromium draws a 15px
classic scrollbar, which at a 320px viewport leaves 305px of content — past the narrow breakpoint,
with less than 320px to set in. It is the one case that moves.

| Viewport | Client | Text | Before                    | After                        |
| -------- | ------ | ---- | ------------------------- | ---------------------------- |
| 320px    | 305px  | 100% | beside the photo, 3 lines | **below the photo**, 3 lines |
| 335px    | 320px  | 100% | beside the photo, 3 lines | beside the photo, 3 lines    |
| 360px    | 345px  | 100% | beside the photo, 3 lines | beside the photo, 3 lines    |
| 390px    | 375px  | 100% | beside the photo, 3 lines | beside the photo, 3 lines    |
| 320px    | 305px  | 200% | below the photo, 3 lines  | below the photo, 3 lines     |
| 360px    | 345px  | 200% | below the photo, 3 lines  | below the photo, 3 lines     |
| 390px    | 375px  | 200% | below the photo, 3 lines  | below the photo, 3 lines     |

The one case that moves, moves the way #68 designed it to: with the breakpoint matched at 51.2px but
only 305px of room, the longest word of the name no longer fits beside the photo, so the `h1` —
which establishes its own formatting context and carries `min-inline-size: min-content` — drops
below the float and takes the full column. It is three whole words on three lines either way, and
no word breaks. At a full 320px of content the name still sits beside the photo, so #68's own
measurements are unchanged where it took them.

## Related Documents

* GitHub issue #90, which this decision resolves, and Epic #70, which decided that the design
  prevails over the records that stand in its way
* Figma design file `career-site-design`, measured node by node on 2026-09-17:
  https://www.figma.com/design/RhUMRELzXCfPc0IYa0uHse/career-site-design
* DDR-011, the typographic system, whose scale and floor this supersedes and whose typefaces,
  files, weights, PDF guarantee, line heights, measure and wrapping stand
* DDR-015, the print treatment, whose base this amends from 11pt to 12pt, and GitHub issue #99,
  which prints the page for the whole Epic
* DDR-014, responsive behaviour, which reads this scale and steps two titles down at the narrow
  breakpoint, and DDR-013, spacing and layout, which is measured in rem from the same root
* DDR-017, letter-spacing, and DDR-018, the uppercase labels, whose em tracking follows these sizes
  and whose PDF finding the smallest step now has to survive at 10px
* DDR-010, the career page structure, which makes a role and a credential one pattern, which is why
  a credential's name is 15px here
* GitHub issue #68, the name beside the photo at enlarged text, whose float mechanism the page
  title's new size exercises at 320px
* ADR-001, which puts every design value in a token, and ADR-006, which says which literals a
  component stylesheet may write and gains none here
* GitHub issues #91, #92 and #93, which take the design's faces, tracking and palette on this scale
