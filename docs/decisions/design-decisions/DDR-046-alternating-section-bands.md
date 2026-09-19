# DDR-046-Alternating Section Bands

Status: Accepted

Date: 2026-09-19

**Amends DDR-025 in one respect: the page has two surfaces rather than one.** `--color-surface`,
the off-white, is joined by `--color-surface-band`, `#fcfbf9`. Every other colour, and every
pairing DDR-025 records on the page, is unchanged.

**Amends DDR-026 in two respects.** The divider now spans the window, as the footer's hairline
does, where it spanned the column. And the half of the boundary above each divider is now the foot
of the section before it, where it was the next section's margin. The line, its colour, its place
and the distance on each side of it are unchanged.

**Amends DDR-036 in one respect.** The ringed dot has no fill of its own. DDR-036 fills it with the
page's surface. It is now transparent, so the surface inside the ring is whichever band the
timeline is on. The ring, the core, the line and the offset are unchanged.

**Amends DDR-040 in one respect: where the space above the footer lives.** The 72px between the
last section's content and the footer's hairline is now all inside the last section: a boundary
plus DDR-040's 16px. The footer no longer adds the 16px, and `main` no longer pads its foot. The
distance is unchanged.

**Amends DDR-013 in how the column is drawn, not in what it is.** DDR-013 draws the column on
`main`, as a maximum width with a gutter. It is now drawn inside each of `main`'s parts, as
padding: the gutter, or half of whatever the window leaves beside the column, whichever is more.
The column is the same to the pixel.

## Context

Epic #131 refines how the page is navigated. Issue #142 is its sixth story. Every section sits on
the same off-white, and only a pale hairline separates them. A reader scrolling quickly down a long
page does not always notice where one part ends and the next begins.

The story asks for:

* two background colours: today's off-white, and a second one close to it but whiter;
* the introduction on the off-white, the darker of the two;
* the five sections alternating from there, starting with the lighter one;
* each band running the full width of the window, with the content still in the column.

It also asks to:

* decide and record whether the footer is part of the alternation, and whether the hairline stays;
* keep every text at least the contrast it has today, the timeline's dots the same on either band,
  and the white cards and pills distinct from the band behind them;
* keep the contents bar reading the same over either band, and keep a contents link bringing its
  heading into view below the bar;
* scroll nothing sideways from 320px up, at the default text size or at 200%;
* leave the printed CV unchanged.

The design draws one surface. This is the owner's request.

## Decision

**The sections alternate between two surfaces, starting with the lighter one after the
introduction.**

| Part                          | Surface                                      |
| ----------------------------- | -------------------------------------------- |
| Introduction                  | `--color-surface`, `#f8f7f4`                 |
| Experience                    | `--color-surface-band`, `#fcfbf9`            |
| Projects                      | `--color-surface`                            |
| Skills                        | `--color-surface-band`                       |
| Education and certifications  | `--color-surface`                            |
| Languages                     | `--color-surface-band`                       |
| Footer                        | `--color-surface`                            |

* **The band is the off-white's own warm hue, about halfway to white.** It is 1.036:1 against the
  off-white and 1.034:1 against the card's white. It is close enough that the page still reads as
  one surface, and far enough from white that a card or a pill on it keeps its edge. A card's
  hairline is 1.19:1 on the band, where it is 1.15:1 on the page.
* **The alternation is counted among the sections alone**, with `:nth-of-type(odd)`. The
  introduction is a `header`, so it never shifts the count. A section added or removed moves the
  bands with it, and the alternation still starts with the band after the introduction.
* **The footer is part of the alternation.** It follows Languages, on the band, so it sits on the
  off-white, as the introduction does. It needs no rule to be there, because that is the page's own
  surface.
* **The hairlines stay, and each one now marks a change of band.** Each band runs from its own
  divider to the next, and the last runs down to the footer's hairline. So every divider falls
  exactly where the colour changes. The line and the band say the same thing. The line keeps the
  boundary visible where the difference in surface is faint, as it is on a dim or washed-out
  screen. The band makes the boundary visible at a glance, as the story asks. Removing the
  hairlines would have left two surfaces 1.036:1 apart as the only boundary.
* **A divider spans the window**, as the band does and as the footer's hairline already did. A line
  that stops at the column while the colour change beside it runs to the edges would read as a
  mistake.
* **The dot has no fill.** The line runs into the ring and out of it rather than behind it, so there
  is nothing under the dot to cover. The inside of the ring is the band the timeline is on.

**How it is drawn.** `main` spans the window and draws no column. Each of its parts, the
introduction and the five sections, pads itself by `--page-inset`. The inset is
`max(var(--page-gutter), calc((100% - var(--content-width)) / 2))`. That is exactly the column
`main` drew before, so every element on the page is where it was. A section's background therefore
reaches the edges of the window with no `vw`, no negative margin and nothing that can overflow.
The contents bar and the footer already drew their column this way.

Each section pads both halves of its boundary: the half below its divider at its top, as before,
and the half above the next divider at its foot. The next section takes no margin. The first
section keeps its margin, because the introduction carries no band. The last pads its foot by
`--page-padding-block-end`, a boundary plus 16px, down to the footer's hairline. The distance
between any two sections, and where the divider falls in it, are unchanged.

**Paper is unchanged.** The band drops at the token layer with every other surface, per DDR-015.
The section's print block puts the space back where it was: as the next section's margin, with
nothing at the foot of the last. A margin is truncated at a page break and a padding is not, so
moving it would move the breaks. `--page-inset` is 0 on paper.

## Alternatives Considered

### Paint a full-width band from outside the column

Keep `main` as the column and paint each band beyond it, with a `border-image` outset or a spread
`box-shadow` clipped to the section.

Pros:
* No change to how the column is drawn.

Cons:
* A `border-image` replaces the border, so the divider would have to be redrawn some other way.
* A spread shadow needs `clip-path`, which creates a stacking context and clips the section's
  content. It also makes the site's one elevation token do a surface's job.
* Both need a length in `vw`, which counts the classic scrollbar and is a literal ADR-006 does not
  admit.

### A wrapper inside each section

Render the column as an element inside `section.tsx`.

Pros:
* The column is an element, which is easy to read in the markup.

Cons:
* It adds an element to every section and changes the markup `section.test.tsx` holds. The padding
  does the same with one declaration and no new element.

### Drop the dividers

Let the change of band be the only boundary.

Pros:
* One signal rather than two.

Cons:
* The two surfaces are 1.036:1 apart. On a dim or washed-out screen the band vanishes, and the page
  would then have no boundary at all. DDR-026's line is the design's, and the story does not ask to
  remove it.

### A band closer to white, or white itself

Pros:
* A stronger change between bands.

Cons:
* The language cards and the contact pills are white. On a white band only their hairlines and
  shadows would set them apart, which the story rules out. `#fcfbf9` leaves them 1.034:1 of fill
  above the band as well as their edge.

## Consequences

Benefits:
* The boundary between two parts is visible at a glance, without adding any line or text.
* Every text and mark on the page measures at least as well on the band as on the page, because
  the band is lighter than the off-white and every ink is darker than both. `--color-text-muted` is
  4.60:1 on the band. So a company, an institution, a thesis and a contents link meet WCAG 1.4.3
  there, where they fail at 4.44:1 on the page. DDR-025's failures are unchanged on the off-white
  bands.
* Every element on screen is where it was, at every width and text size checked, and every printed
  sheet is identical to the tree before.

Tradeoffs:
* The difference is faint by the owner's request. On a low-quality or very bright screen the bands
  may not show, and the hairlines then carry the boundary as they did before.
* A divider now spans the window, where DDR-026 drew it across the column.
* The space above the footer is now stated in the last section's padding. Changing the section
  boundary or the footer's space means reading this record, DDR-040 and `section.module.css`
  together.

Risks:
* **Anything new in `main` gets the inset.** `main > *` pads every child. A new direct child of
  `main` that is not meant to sit in the column has to override it.
* **The alternation is positional.** Reordering the sections, or adding one, moves the bands. That is
  the intent, but it means no section owns its colour.
* **The contents bar is the page's off-white at 96%.** Over the band it is a shade darker than the
  surface below it. The difference is 1.036:1 at most, and the bar's links measure no worse than
  DDR-031 records, because a lighter surface behind a translucent bar only raises their contrast.

Measured on #142 against the tree before, in Chromium, at 320px, 390px, 894px, 1280px and 1536px
with text at 100% and at 200%, and at 360px at 200%. Every heading, paragraph, list item, image,
link and article on the page had an identical box, and nothing scrolled sideways. The page's height
was identical at every width. Printed to A4 in Edge and Firefox, with background graphics on and
off: six sheets in all four, the same text, and every sheet pixel-identical to the tree before, with
no replacement character and no `mailto`.

## Related Documents

* Issue #142 and Epic #131
* DDR-013, the column and the spacing scale
* DDR-015, print, which drops every surface
* DDR-020, the raised language cards and pills
* DDR-025, the colour system, which this amends
* DDR-026, the section divider, which this amends
* DDR-031 and DDR-034, the contents bar's translucent surface
* DDR-036, the timeline's ringed dot, which this amends
* DDR-040, the space above the footer, which this amends
* ADR-006, the literals a component stylesheet may write
