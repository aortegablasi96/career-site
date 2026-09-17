# DDR-027-Target Sizes

Status: Accepted

Date: 2026-09-17

Supersedes **DDR-014's 44 by 44 pixel minimum target**, and DDR-004's before it. Everything else in
DDR-014 stands: its mobile-first ordering, its two breakpoints, its rule that the markup order is
the visual order, its rule that nothing depends on hover, and its rule that nothing scrolls
horizontally from 320px — which this record re-measures and keeps.

**Amends DDR-010 in two respects.** Its bullet requiring every target to be at least 44 by 44 pixels
goes with DDR-014's; and its description of the design's contents links as "about 28px tall" is
corrected below, because 28px is the gap between two links and not the height of either.

It **removes a token rather than changing one**: `--target-size-min` is gone, and no other token
moves.

## Context

Epic #70 matches the page to `career-site-design`, and on 2026-09-17 the owner decided the design
prevails everywhere, including over the records written to protect WCAG conformance. Targets are one
of the fifteen differences the Epic lists.

**What the brief asked for was not what WCAG AA asks for.** DDR-004 set a 44 by 44 pixel minimum and
DDR-014 carried it forward, both citing "WCAG 2.2 AA" for it. That is wrong on its face: 44 by 44 is
Success Criterion 2.5.5 Target Size (Enhanced), **Level AAA**. What Level AA asks is 2.5.8 Target
Size (Minimum): 24 by 24, and even that has an exception for undersized targets that are far enough
apart — a 24px circle centred on each undersized target must not touch another target or another
undersized target's circle. So the site has been holding itself to an AAA criterion, and the design
it is being matched to still clears the AA one.

**What the design draws**, measured node by node in `career-site-design`:

| Target                     | In the file                                              | Node                        |
| -------------------------- | -------------------------------------------------------- | --------------------------- |
| The three contact pills    | `px-[16px] py-[8px]` on a 19.5px line, 37.1px tall        | 2:51, 2:58, 2:64, inside 2:50 |
| The CV control             | the same box, 124 by 37.1                                 | 2:70                        |
| A contents link            | 20px tall, in a 48px bar, 28px from the next link         | 2:9 to 2:21, inside 2:7     |
| A project's labelled links | 19.5px tall, 16px apart                                   | 2:320, 2:323, 2:366, 2:369, 2:410, 2:448 |

**The correction.** Epic #70 and DDR-010 both describe the contents links as "about 28px tall". The
file's list items are 20px tall and sit 28px apart: `2:9` is 69 by 20 at x=0 and `2:12` is 51 by 20
at x=97, so 28px is the space between them. Both records carry the figure as a height and both are
corrected here.

**A measurement nobody had taken.** `--target-size-min` was applied as `min-block-size` and
`min-inline-size`, and nothing on the site sets `box-sizing: border-box`, so the minimum was
measured against the *content* box. A contact pill was therefore 44px of content plus 16px of
padding plus 2px of border — **61.6px**, not 44px. DDR-010's three undersized targets were not
corrected to 44px; they were corrected past it.

## Decision

### The page has no target minimum

`--target-size-min` is removed. A target is the size its own design makes it — padding and a label
on a control, the line of text on a link — and there is no length left for a token to hold.
`app/tokens.test.ts` holds the name **absent**, so reinstating a minimum has to move this record
with it.

### A control is the design's 37px

The three contact pills and the CV control keep `padding-block: var(--space-small)` and
`padding-inline: var(--space-medium)` — 8px and 16px, which is what the design draws — and drop the
two minima. On the built page that is **37.1px tall**, which is the file's own 37.1px.

### A link is the line its label sets in

A contents link and a project's labelled links take no box beyond their text: **19.5px**, against
the design's 20px and 19.5px. Both **stay flex containers**, which is the one thing here that is not
simply "remove the minimum". An inline box's hit area is the font's content area, about 17px at this
size; a flex container's box is the whole line box. Keeping `display: inline-flex` is therefore both
2.5px more target and the nearer of the two to what the file draws, for one declaration that was
already there.

### A wrapped row gets a gap

`.list` in the contents and `.links` in the projects take `row-gap: var(--space-small)`. This is the
one measure here the design does not supply, because `career-site-design` is a single 894px frame in
which neither row wraps, and the page has widths at which both do.

It is not a precaution. Measured with the gap forced off, the contents row **fails 2.5.8 at every
viewport from 420px to 490px**, where "Education and certifications" wraps directly beneath
"Experience" and two 19.5px targets end up with their circles 22.5px apart — inside the 24px the
exception requires. With the gap, the tightest pair anywhere between 300px and 900px is 30.5px, at
420px.

The projects' row does not wrap at any width the page was measured at, and takes the same gap for
the same reason: what wraps it is the content, and the next project added decides it.

### Paper drops the projects' row gap and nothing else

A row gap that holds two links apart for a finger is screen-only sizing, which DDR-015 lets a
component drop, and it is not free: an address prints after every link, per DDR-005, which wraps
that row on every sheet, so the gap would have cost the printed CV 16px. `row-gap: 0` in the
projects' print block keeps the sheet exactly as it was. The contents are hidden in print already,
so their gap costs paper nothing and needs no rule.

A link still takes the height of its text on paper, as DDR-010 allows — it now does so on screen
too, so what the print block still carries is the `display: inline` that lets the printed address
read as part of the line rather than as a flex item of its own.

### Every target on the page, and what it meets

Measured on the built page in Chromium at 390px at the browser's default font size. No target on the
page meets 2.5.5, and every one of them meets 2.5.8.

| Target                                | Box on the page | 2.5.8, AA, 24 by 24      | 2.5.5, AAA |
| ------------------------------------- | --------------- | ------------------------ | ---------- |
| Contact pill, the email address       | 202.8 × 37.1    | meets it outright        | fails      |
| Contact pill, the LinkedIn address    | 214.7 × 37.1    | meets it outright        | fails      |
| Contact pill, the GitHub address      | 217.1 × 37.1    | meets it outright        | fails      |
| The CV control, "Get my CV"           | 121.1 × 37.1    | meets it outright        | fails      |
| Contents link, "Experience"           | 66.9 × 19.5     | meets it by the spacing exception | fails |
| Contents link, "Projects"             | 49.2 × 19.5     | meets it by the spacing exception | fails |
| Contents link, "Skills"               | 29.5 × 19.5     | meets it by the spacing exception | fails |
| Contents link, "Education and certifications" | 169.9 × 19.5 | meets it by the spacing exception | fails |
| Contents link, "Languages"            | 64.1 × 19.5     | meets it by the spacing exception | fails |
| Project link, "Source code", four of them | 76.2 × 19.5 | meets it by the spacing exception | fails |
| Project link, "Live site", two of them | 49.3 × 19.5    | meets it by the spacing exception | fails |

Nothing else on the page is interactive: there is no button, nothing takes a `tabindex`, and the
timeline, the skills and the languages carry no links.

The exception's margin, swept every 10px from 300px to 900px at the default text size and at double
it: **no width fails either half of it**, and the tightest pair is the contents row at 420px, with
30.5px between centres where 24px is required and 20.8px from a circle to the neighbouring box where
12px is required.

## Consequences

### Benefits

* The four controls and both rows of links are the size the design draws them, to a tenth of a
  pixel on the controls.
* The page is **219px shorter at 320px, 360px and 390px** and 46px shorter at 1536px, because a pill
  loses 24.5px of height and there are four of them, stacked on a narrow screen.
* At 390 by 844 — a phone — the four controls now end **841px down the page, above the fold**, where
  they ended 939px down and below it. Keeping the contact controls in the first screen is the reason
  DDR-010 puts the photo beside the name, and #48 deviated from the UI Review to protect it; this
  story gives back more room than that deviation bought.
* One token and four declarations leave the codebase, and the one rule that replaced them is a gap
  rather than a minimum.

### Tradeoffs

* **Nothing on the page meets 2.5.5 at Level AAA any more**, where every target did. That is the
  brief's own constraint, and giving it up is the owner's decision on Epic #70 rather than a
  measurement.
* **Seven of the eleven targets meet AA by the spacing exception rather than outright.** The
  exception is a property of the layout, not of the control: it depends on the labels, the gaps and
  how many links there are. Adding a section to the contents, renaming one, or giving a project a
  third link changes the numbers, so it has to be re-measured rather than assumed. The row gap is
  what makes the pass structural instead of accidental — without it the contents row already fails
  at eight of the widths swept.
* A 19.5px link is a smaller thing to hit with a thumb than a 44px one, whatever the criterion says.
  The pills, which are the page's primary actions, are the four that meet AA outright, and the links
  that shrank are the two secondary rows.

### Risks

* A future contributor may reasonably read "37px target" as a regression and pad it back. The
  absent token, the tests in all four files and this record are the guard.
* The exception's margin at 420px is 6.5px. A label one word longer in the contents could consume
  it. #98 replaces the contents row with the design's sticky bar and should re-measure this.

## Alternatives Considered

### Option A: take the design's size on the pills and the contents links, and leave the project links at 44px

This is the literal reading of #95's fourth acceptance criterion, which asks that no other target
shrink by side effect.

Pros:
* The smallest change, and it keeps a 44px target somewhere on the page.

Cons:
* The design draws those links at 19.5px, so it leaves one of the fifteen differences open for
  Epic #70's closing pass to find again.
* It keeps `--target-size-min` alive for two declarations in one component, which is a token
  defending a rule the rest of the page no longer follows.

Rejected by the owner on #95, who chose to close the difference.

### Option B: lower the minimum to 24px so every target meets 2.5.8 outright

Pros:
* Every target would meet AA on its own size, with no dependence on a layout-sensitive exception.

Cons:
* It is not the design either. A 24px box on a 19.5px link is a box the file does not draw, and
  against the content box it would have drawn 24px plus whatever padding the element already had —
  the same mistake that made a 44px pill 61.6px.
* It would not change a single target on the page today, because the exception is already met
  everywhere; it would only pre-empt a future layout, which is speculative.

### Option C: keep 44px and pad the design's pill out to it

Pros:
* WCAG 2.5.5 AAA is kept, and the brief's constraint with it.

Cons:
* It is the difference Epic #70 exists to close, and the owner has decided it the other way.

## References

* GitHub issue #95, which this decision resolves, and Epic #70
* Figma design file `career-site-design`, nodes 2:50, 2:51, 2:58, 2:64, 2:70 (the controls), 2:6,
  2:7, 2:9 to 2:21 (the contents bar), and 2:320, 2:323, 2:366, 2:369, 2:410, 2:448 (the project
  links)
* DDR-014, the responsive strategy, whose target minimum this supersedes, and DDR-004 before it
* DDR-010, the career page structure, whose target bullet this amends and whose "about 28px" figure
  it corrects
* DDR-013, whose spacing scale supplies the row gap, and DDR-022, whose 13px step sizes every label
  measured here
* DDR-015, the print treatment, which lets a component drop screen-only sizing on paper
* WCAG 2.2 Success Criterion 2.5.8 Target Size (Minimum), Level AA, and 2.5.5 Target Size
  (Enhanced), Level AAA
