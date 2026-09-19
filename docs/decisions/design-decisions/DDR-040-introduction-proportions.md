# DDR-040-Introduction Proportions

Status: Accepted

Date: 2026-09-18

**Amends DDR-021's wide photo width.** DDR-021 kept the photo 208px wide, `13rem`, from the wide
breakpoint. It is now the Make file's `clamp(180px, 22vw, 300px)`, written with rem bounds. The narrow
width, `6rem`, the 3:4 ratio, the capsule and the two lights are unchanged.

**Amends DDR-013's measure in one place.** DDR-013 says no line of running text exceeds 65ch. The
introduction's summary is now held to the design's 680px instead, which is 13px wider than 65ch at
the default text size. Every other paragraph and list item keeps 65ch.

**Amends DDR-014's narrow breakpoint.** It no longer redefines `--page-padding-block`. The space above
and below the page is now a section boundary, `--space-boundary`, which follows DDR-039's rhythm
factor. The narrow breakpoint redefines three role tokens and the language columns.

**Closes DDR-028's open item.** The footer now stands the design's 16px below the page, so the last
section ends 72px above the footer's hairline, as in the design.

**Adds two rhythm tokens to DDR-039's table**, `--space-summary` and `--space-controls`, on the same
terms: the design's value times `--rhythm-scale`, and the old step on paper.

**Amended by DDR-046 in where the space above the footer lives.** The 72px from the last section's content to the footer's hairline is now all the last section's padding, `--page-padding-block-end`, so its band runs down to that line. The footer adds no margin and `main` pads only its top. The distance is unchanged.

## Context

Epic #70 closes the gaps between the page and the Figma design `career-site-design`. On 2026-09-17
the owner decided that the design prevails. Issue #120 measured the introduction, the first screen a
visitor sees, and the space above the footer, which DDR-028 left open.

Every value below comes from the design file's frames at its 894px width (node 2:26 and the page
frame 2:5) and from the Make file's classes.

| Space                          | Design frames                                  | Make file                    | Design  | Page before |
| ------------------------------ | ---------------------------------------------- | ---------------------------- | ------- | ----------- |
| Contents bar to the photo      | 2:27 at y=56 in 2:26                           | `pt-14` on the introduction  | 56px    | 64px        |
| Photo width                    | 2:28, 196.76 wide                              | `clamp(180px, 22vw, 300px)`  | 196.8px | 208px       |
| Photo to text column           | 2:32 at x=260.76                               | `md:gap-16`                  | 64px    | 32px        |
| Location line to summary       | 2:42's `pt-[32px]`                             | `mb-8`                       | 32px    | 16px        |
| Summary measure                | 2:42, `max-w-[680px]`                          | `max-w-[680px]`              | 680px   | 65ch, 667px |
| Summary to the controls        | 2:80's `pt-[36px]`                             | `mb-9`                       | 36px    | 16px        |
| Last section to the footer line | 2:647 ends 56 below its content; 2:687 at y=16 in 2:702 | `py-14`, then `mt-4` | 72px | 64px        |

The design pads the introduction and every section by the same 56px, and the footer adds a 16px
margin. DDR-039 already took the 56px between sections as `--space-boundary`. The page padded `main`
by 64px above and below instead, and DDR-028 recorded the footer's difference as open.

The photo is the one value the design sizes by the viewport. At 894px, 22vw is 196.77px, which is
exactly the frame's width. So the design's 196.76px is not a fixed length.

## Decision

### The page begins and ends with a section boundary

`--page-padding-block` is now `var(--space-boundary)`: 56px from the wide breakpoint and 42px below
it. The narrow breakpoint no longer redefines it. The photo stands 56px below the contents bar, as the
design's does, and the last section ends 56px above the footer. Paper still sets the padding to 0.

### The footer stands 16px below the page

`footer.module.css` sets `margin-block-start: var(--space-medium)` on the footer. 16px is a step of
DDR-013's scale, so it takes the step as it is, at every width. With the boundary above it, the last
section's content stands 72px above the hairline, as in the design. The footer's print block sets
the margin to 0, as screen-only sizing.

### The introduction takes the design's spaces

| Token                | Design | Below 48em | Separates                                    |
| -------------------- | ------ | ---------- | -------------------------------------------- |
| `--space-summary`    | 32px   | 24px       | The location line from the summary           |
| `--space-controls`   | 36px   | 27px       | The summary from the contact controls        |

Both are rhythm tokens on DDR-039's terms: the design's value in rem, times `--rhythm-scale`.
`introduction.module.css` sets them with `.location + .summary` and `.summary + .controls`. The two
summary paragraphs keep the flow step between them, which is the design's 16px.

The gap between the photo and the text is `--space-x-large`, 64px, the largest step of the scale. It
is a gap between two columns, not a vertical space, so it does not take the rhythm factor. It exists
only from the wide breakpoint, where the factor is 1 anyway.

### The summary is held to 680px

`--measure-summary` is `42.5rem`, 680px at the default size, in rem so it follows the reader's text.
`.summary` sets it in place of the base styles' `--measure`. It binds only where the text column is
wider than 680px, which is from about 1010px up. Below that the summary takes the column's full
width, as in the design.

### The wide photo is sized by the viewport

`--photo-width-wide` is `clamp(11.25rem, 22vw, 18.75rem)`: the Make file's 180px, 22vw and 300px, with
the bounds in rem. So the photo is:

| Viewport | Photo    |
| -------- | -------- |
| 768px    | 180px, the floor |
| 894px    | 196.8px, the design's |
| 1280px   | 281.6px  |
| 1364px up | 300px, the ceiling |

It is the one length on the page measured from the viewport. The design sizes the photo by the room
it has, not by the text beside it. The rem bounds still make it grow when text is enlarged. At 200%
the breakpoint is 1536px, and the 360px floor sets the width up to 1636px.

The narrow photo is unchanged. The design has no narrow view, and #68's float depends on the photo's
size in rem.

### Paper is unchanged

The print block sets `--space-summary` and `--space-controls` to `--space-flow`, the step they
replaced. The page padding is already 0 on paper, the footer's margin is dropped, and the print layout
reads the narrow photo token, not the wide one. The summary's 680px does not bind on A4, where the
text column is about 642px. So the printed CV is pixel-identical to the tree before. That follows
DDR-038 and DDR-039, where the owner chose to keep paper as it was.

### What it does not cover

These differences remain at 894px. None is in #120's list:

* **The name's leading.** The design sets it at 1.08, 55.3px. The page sets headings at DDR-011's
  1.2, 61.4px. The positioning line's 8px margin, against the design's 10px, and the paragraphs'
  line boxes take most of that back, so the introduction's text column is 445.9px tall against the
  design's 444.4px.
* **The gap between the four controls**, 8px against the design's 10px (`gap-2.5`), which is on no
  step of the scale.
* **The footer's type**, 12.8px against 12px, which DDR-028 recorded. The footer is 84px tall against
  80.8px.
* **The skill groups' column gap**, which DDR-039 left open.

## Alternatives Considered

### Option A — keep the photo at a fixed width and take the nearest value

`12.25rem`, 196px, at every wide width.

Pros:
* Every length on the page stays independent of the viewport.

Cons:
* It matches the design at 894px only by construction. The Make file says the photo grows with the
  screen to 300px, and on a 1536px screen a 196px photo would sit in a column the design gives 300px.
  The owner decided the design prevails.

### Option B — keep `--page-padding-block` at 64px and pad the introduction separately

Pros:
* DDR-014's narrow breakpoint keeps its four role tokens.

Cons:
* The introduction would need a negative space or its own padding to reach 56px, and the footer's
  space would still need `main`'s bottom padding to change. The design uses one value above and
  below every block, and that value is already `--space-boundary`.

### Option C — take the scale's steps for the introduction's spaces

32px is `--space-large`, and 36px has no step.

Pros:
* No new token.

Cons:
* 36px would become 32px, 4px short of the design, and the two spaces would not step down with the
  rest of the rhythm below the breakpoint.

### Option D — print the introduction and the footer with the design's spaces

Pros:
* Paper and screen would share the introduction's proportions.

Cons:
* DDR-038 and DDR-039 kept paper as it was, at the owner's choice, and the design has no print view.
  Paper stays unchanged.

## Consequences

Measured on the built page in Chromium at the browser's default text size and at 200%:

* **At the design's 894px, every value #120 lists matches the design within 1px.** The photo is
  196.8 × 262.4 against 196.76 × 262.05 and stands 56px below the contents bar. The text column
  starts 64px after it. The summary is 32px below the location line and 586.4px wide against
  585.6px. The controls are 36px below the summary, and the last section is 72px above the footer's
  hairline.
* **Wide screens get a bigger photo.** At 1280px it is 281.6px and at 1536px it is 300px, and the
  summary stops at 680px.
* **Below the wide breakpoint, the layout is unchanged.** The photo stands 42px below the bar where it
  stood 64px, the summary 24px below the location and the controls 27px below the summary. The name
  sits beside the photo, or drops below it, in exactly the cases it did before, at 320px, 360px and
  390px, at 100% and 200% text.
* **At 390 by 844 the controls end 842.5px down, above the fold.** Before this record they ended at
  845.5px, 1.5px below it.
* **Nothing scrolls horizontally** at 320px, 360px, 390px, 768px, 894px, 1280px or 1536px at the
  default size, or at 320px, 360px or 390px at 200%.
* **The page is 36px longer at 894px**, 4803px against the design's 4787px, **and 9px shorter at
  390px**.
* **The printed CV is unchanged**: six sheets in Edge 153 and Firefox 156, pixel-identical to the tree
  before, with background graphics on and off. The text reads back identically, with no replacement
  character and no `mailto`.

### Risks

* **The photo now changes size with the window.** Resizing a wide window resizes the photo, and the
  text column beside it grows more slowly than it did. The photo and the gap together take 244px at
  the 768px breakpoint where they took 240px, 260.8px at 894px, and 364px from 1364px up.
* **The summary may run 13px past 65ch.** DDR-011's measure is a readability limit, and the design's
  680px is slightly above it. That applies only from about 1010px up.
* **Paper and screen now differ in the introduction too.** A change to these spaces on screen will
  not show on paper unless the print block changes as well. `app/tokens.test.ts` holds the print
  values by name.

## Related Documents

* Issue #120, and Epic #70
* DDR-013, whose measure this amends for the summary
* DDR-014, whose narrow breakpoint no longer adapts the page padding
* DDR-021, whose wide photo width this amends
* DDR-028, whose open item this closes
* DDR-039, the rhythm these two tokens join
* DDR-038, and the same choice to keep paper as it was
* #68, the name beside the photo, rechecked here
* `career-site-design`, nodes 2:26, 2:28, 2:32, 2:42, 2:80, 2:647 and 2:702
