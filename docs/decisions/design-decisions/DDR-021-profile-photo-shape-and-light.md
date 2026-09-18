# DDR-021-profile-photo-shape-and-light

Status: Accepted

Date: 2026-09-17

**Touched by DDR-025 in one place.** This record justifies the glow partly by noting that its indigo
`#4f46e5` is a colour DDR-012 turned down for the accent. DDR-025 adopts that indigo as the accent,
so the glow is now the accent's own hue rather than a near neighbour of it. Every measurement here
stands, including the glow's 1.17:1 and its 10.8 ΔE, and so does the argument for measuring a
coloured light by hue rather than by luminance.

**Amended by DDR-040 in one respect**: `--photo-width-wide` is no longer `13rem`. It is the Make
file's `clamp(180px, 22vw, 300px)`, written as `clamp(11.25rem, 22vw, 18.75rem)`, which is the
design's 196.8px at 894px. The narrow width, the ratio, the capsule and both lights stand.

**Amended by DDR-031 in one respect**: the stylesheet rule this record narrowed, which lets nothing
but a pseudo-element leave the flow, now admits `position: sticky` once, on the contents bar. A
sticky element keeps its box and its place in the markup order, so it reorders nothing. `absolute`
and `fixed` are still refused everywhere but a pseudo-element.

**Supersedes DDR-016**, the profile photo's shape, which settled the photo at 3:4 at
`--radius-large` and rejected the design's rounding outright. The ratio and the two widths DDR-016
sets carry forward unchanged, and so does everything it says about cropping, about `object-fit` and
about what #63 has to export. What does not carry forward is its corner radius and its rejection.

**Amends DDR-020**, elevation, which gives the site one level and says a second is "a decision to
take rather than the next number to reach for". This is that decision, and it is the last one: the
photo's two lights are named for the photo, and nothing else on the page may read them. DDR-020
stands in every other respect, including the ink it measured for `--shadow-raised`.

It also amends DDR-013's description of `--radius-pill`, which keeps its value and gains a second
user. The radius scale itself is unchanged, and the reason is the point of this record.

## Context

DDR-016 was written on #71, and it decided two things at once: the photo's aspect ratio, which the
page and the Figma design file already agreed on, and its corner radius, which they did not. It took
the ratio from the design and turned the rounding down, recording the design's shape as "Option B:
3:4 as an oval, as the design file draws it" and rejecting it on three grounds — that it is a fourth
rounding, that an ellipse crops the corners out of the photograph, and that it is decorative on a
page whose language is whitespace, type and hairlines.

Two things have changed since.

**The owner has decided the design file prevails.** On 2026-09-17 they chose full adoption over the
records that stand in its way, knowing what it costs elsewhere on Epic #70. A difference between the
file and the page is now a gap to close. That settles the question DDR-016 answered, and it settles
it the other way.

**And one of DDR-016's three grounds rests on a misreading of the file**, which this record corrects
below. The shape the design draws is not an ellipse.

### What the design actually draws

The frame is 196.762 × 262.05 — 3:4, which was never the disagreement — with
`rounded-[113.536px]`, an outer `0 8px 40px rgba(79,70,229,0.18)` and an inset
`0 4px 4px rgba(0,0,0,0.25)`.

113.536 is more than half the width, and both CSS and Figma clamp a radius that large: the scale
factor is 196.762 ÷ (113.536 × 2) = 0.8665, so every corner is drawn at 98.381px, which is exactly
half the width. That rounds the top and the bottom into semicircles and leaves the sides straight
for the remaining 65.3px. **It is a capsule, not an ellipse** — a stadium standing on end.

Measured off the rendered frame, half-widths in px down from the top edge:

| Down from the top | Measured | A capsule predicts | An ellipse predicts |
| ----------------- | -------- | ------------------ | ------------------- |
| 8px               | 41.0     | 40.0               | 34.8                |
| 16px              | 56.0     | 55.4               | 48.5                |
| 32px              | 75.0     | 75.0               | 66.5                |
| 64px              | 96.0     | 96.0               | 87.7                |
| 96px              | 104.0    | 103.7              | 99.0                |

The worst error against a capsule is 1.7px, which is antialiasing. Against an ellipse it is 9.3px.
87 of the box's rows are within a pixel of its full width, where a capsule predicts 89 and an
ellipse predicts 24.

**This matters because a capsule is a radius and an ellipse is a proportion.** DDR-016's first
objection — "it is a fourth rounding, and not a length at all but a proportion of the box" — is true
of `border-radius: 50%` and false of what the design draws. A radius larger than half the box is
clamped to half it, so `--radius-pill`, which the site has had since DDR-013 for the introduction's
own controls, draws this shape exactly, and at any size, because both boxes are 3:4. The site does
not gain a radius.

## Decision

**The profile photo is the design's capsule, drawn by `--radius-pill`, and it carries the design's
two lights: an indigo glow outside it and a short dark shadow inside its top edge.**

### The shape is the pill radius the site already has

`introduction.module.css` sets `border-radius: var(--radius-pill)` where it set `--radius-large`.
DDR-013's three radii are unchanged and there is still no fourth. The ratio stays `3 / 4`, and
`--photo-width` and `--photo-width-wide` stay `6rem` and `13rem`, exactly as DDR-016 sets them.

Measured on the built page at the wide breakpoint, the drawn photo tracks a capsule to within 1.7px
and is up to 9.3px from an ellipse — the same test as the design file, with the same answer.

### Two lights, as two tokens

```css
--shadow-photo-glow: 0 8px 40px rgba(79, 70, 229, 0.18);
--shadow-photo-inner: inset 0 4px 4px rgba(0, 0, 0, 0.25);
```

Both are the design's own, geometry and ink alike, including the indigo `#4f46e5` that DDR-012
turned down for the accent. They are the site's second elevation and its last; DDR-020's
`--shadow-raised` is untouched.

They are **two tokens rather than one value with two layers** because they have to be drawn on two
elements, for the reason below.

### The glow does not meet DDR-020's floor, and is adopted anyway

DDR-020 set a floor for the raised shadow — decoration may be quiet, but not quieter than the
quietest thing the page already draws, which is the hairlines at 2.39:1 — and darkened the design's
ink from 10% to 22% to clear it. The glow does not clear it, and it is not darkened.

Measured on the built page against the surface, at a device pixel ratio of 1:

| Distance below the photo | Pixel     | Contrast | ΔE (CIE76) |
| ------------------------ | --------- | -------- | ---------- |
| 0px, its strongest       | `#e5e4f2` | 1.17:1   | 10.8       |
| 4px                      | `#e8e6f2` | 1.15:1   | 9.5        |
| 12px                     | `#ecebf3` | 1.10:1   | 6.9        |
| 20px                     | `#f1f0f3` | 1.06:1   | 3.8        |
| 28px                     | `#f4f3f4` | 1.03:1   | 2.4        |
| 40px                     | `#f7f6f4` | 1.01:1   | 0.6        |

1.17:1 is below even the 1.50:1 DDR-020 rejected. **The reason it is adopted is that contrast is the
wrong instrument for this light.** `--shadow-raised` is neutral grey on a warm off-white, so
luminance is the only dimension it can differ in, and a luminance test is the whole story there. The
glow is indigo on that same off-white: it differs in hue, and at 10.8 ΔE its strongest row is more
than four times the 2.3 ΔE difference an eye can just detect. It is visible on the page, and the
table above is how far it reaches.

It also meets both conditions DDR-012 sets for decoration — removing it would lose nothing, because
the photo is a photograph with alternative text and its shape is drawn by a radius, and it is
dropped in print — so nothing here is held to 3:1. DDR-019's marker was, because it carries meaning
and it prints; this carries nothing and does not.

The owner chose full adoption of the design over the records that stand in its way, and this is one
of the places that costs something. It is recorded rather than argued away.

### An inset shadow cannot be drawn on an `<img>`, so the photo gains a frame

This is the one part of the design that could not be built as declared, and it is a platform limit
rather than a preference.

An inner shadow is painted above an element's background and below its border. A replaced element's
content is painted above both. So `box-shadow: inset …` declared on an `<img>` is covered by the
image and paints nothing at all. Measured on #89 in Chromium and Gecko alike: with the inset
declared and without it, the image's top rows are identical — `#edf2fe` in both, the stand-in's own
flat tint — while the same declaration on a box that is not replaced darkens twelve rows plainly,
from `#97a0c1` back up to the fill.

So the markup gains one element:

```html
<span class={styles.frame}>
  <img class={styles.photo} src={…} alt={…}>
</span>
```

* **The frame carries the glow and the capsule radius.** It is a float that shrink-wraps the photo,
  so it is the photo's box in every respect the layout cares about — measured at the wide
  breakpoint, the frame and the image are the same 208 × 277.33 rectangle. A shadow that spreads
  outwards belongs on the outermost box, and a shadow follows the border radius of the box it is
  drawn on, so the frame takes the radius too.
* **`.frame::after` carries the inner shadow**, absolutely positioned at `inset: 0` over the image.
* **The frame holds no content and takes no name.** No role, no `aria-hidden` — the first would give
  it a name of its own and the second would take the photograph out of the accessibility tree with
  it. The photo's accessible name is still the `alt` in `content/introduction.ts`, unchanged, and a
  pseudo-element is not in the accessibility tree at all.
* **The image itself is given neither light**, so there is exactly one of each on the page.

### A pseudo-element may be taken out of the flow; content may not

`components/stylesheets.test.ts` forbade `position: absolute` outright, as part of the rule DDR-014
gives it: the visual order is the markup order. That rule is about **content**, and a pseudo-element
is not content — it has no place in the markup order to disturb, and it is not in the accessibility
tree, so lifting one out of the flow cannot change what a reader meets or the order they meet it in.

The test now reads each rule and requires that any rule declaring `position: absolute`, `fixed` or
`sticky` has a selector ending in a pseudo-element. Anything matched by a class or an element stays
in the flow, exactly as before. The site uses this once, here.

### On paper, neither light is drawn

`--shadow-photo-glow: none` and `--shadow-photo-inner: none` in the print block in `app/tokens.css`,
beside `--shadow-raised` and the surfaces DDR-015 drops. At the token layer for DDR-015's reason: so
that no component writes a print rule to put out its own light.

A sheet is lit by the room it is read in, and there is nothing to lose — the photograph keeps its
shape on paper, because the shape is a radius and not a light. **The capsule does print**, and was
measured doing it.

Verified by printing the built page to A4 in Edge 153 and Firefox 155 **with background graphics
on**, which is the only condition under which a browser prints a shadow at all:

* **Four sheets in Edge and five in Firefox**, unchanged.
* Not one pixel in the 18px band beside the printed photo is anything but paper white, in either
  browser — 0 of 3,438 in Edge and 0 of 3,942 in Firefox. The rows inside its top edge are
  `#edf2fe`, the photograph's own tint, identical to its middle. Neither light printed.
* The printed photo keeps the capsule: 71 rows at full width in Edge and 74 in Firefox, where a
  capsule predicts 63 and 71 and an ellipse predicts 20 and 21. Printed under DDR-016 the same
  measurement gives 172 and 195, which is the rectangle it was.
* **The size is unchanged by this record.** Firefox prints the photo at 28.11mm, which is
  `--photo-width` exactly. Edge prints it at 24.55mm, and printed the DDR-016 photo at 24.55mm too:
  Edge scales the whole sheet by about 0.877, which predates this story and is not its to fix.
* 483 distinct words come back out of both browsers' PDFs through both pypdf and pdfium, with no
  replacement character and the apostrophe still U+2019. The only disagreements are words wrapped at
  a hyphen, which is pdfium's own behaviour and is recorded in DDR-015.

### It costs #68 nothing

DDR-016 made the photo's size and the name's behaviour a pair to check together, because the photo
is sized in rem and grows with the reader's text while the room beside it shrinks. Measured at
320px, 360px and 390px, each at the browser's default font size and at double it, with the DDR-016
photo and this one rendered in the same session:

| Viewport | Text | Name sits | Name width | Lines | Changed? |
| -------- | ---- | --------- | ---------- | ----- | -------- |
| 320px    | 100% | beside    | 161px      | 3     | no       |
| 320px    | 200% | below     | 273px      | 3     | no       |
| 360px    | 100% | beside    | 201px      | 3     | no       |
| 360px    | 200% | below     | 313px      | 3     | no       |
| 390px    | 100% | beside    | 231px      | 3     | no       |
| 390px    | 200% | below     | 343px      | 3     | no       |

Identical in all six, and no horizontal scrollbar in any of them. The frame is a float that
shrink-wraps the image, so it is the same float the image was; nothing about the photo's size, the
name's size or the float has changed.

## Alternatives Considered

### Option A: the design's capsule by `--radius-pill`, with both lights, the photo wrapped — adopted

Pros:

* The page draws what the design draws, measured rather than eyeballed: within 1.7px of the same
  curve, with the same two shadows at the same geometry and the same ink.
* **It adds no radius.** DDR-016's strongest objection to the design's shape does not survive
  reading the file correctly, and the site keeps DDR-013's three.
* The capsule is kept on paper, where it costs no sheet and no ink.
* It costs #68 nothing, in all six cases measured.
* The frame is one element that holds no content, adds nothing to the accessibility tree, and is the
  photo's box for every purpose the layout has.

Cons:

* The markup gains an element that exists for a shadow.
* `components/stylesheets.test.ts` loosens, for the first time, in a direction that lets an element
  leave the flow — narrowly, to pseudo-elements, but it is a rule that had no exceptions before.
* The glow is the first value on the site adopted below a floor a record set, and it is adopted on a
  measure — ΔE — that no other record uses.
* The site gains two more translucent values and two more px lengths.

### Option B: the capsule and the glow, without the inner shadow

Pros:

* No wrapper, no test change, nothing new in the markup: two declarations and one token.
* The shape, which is the larger half of the difference, is closed either way.

Cons:

* The page carries one of the design's two lights, and the gap stays open on Epic #70 for the sake
  of avoiding one `<span>`.
* The inner shadow is what gives the frame its edge at the top; without it the photo sits flat
  inside a glow, which is the one thing the design does not draw.

This was put to the owner on #89 with the measurements above, and they chose Option A.

### Option C: keep DDR-016 — 3:4 at `--radius-large`, unlit

Pros:

* Nothing moves, nothing is measured, and the records stay as they are.

Cons:

* It is the option the owner has already decided against, for this whole epic and not only here.
* Two of DDR-016's three reasons for it do not survive reading the design file correctly.

### Option D: draw the shape as a true ellipse, with `border-radius: 50%`

Pros:

* It is what DDR-016 and #89 both describe the design as drawing, so it closes the difference as
  both documents state it.

Cons:

* It is not what the design draws. Measured, it is up to 9.3px away from the file's own curve.
* It is a proportion of the box rather than a radius, which is the thing DDR-013's scale has no room
  for and DDR-016 was right to refuse.
* It crops more of the corners out of the photograph than the capsule does, which is a real
  constraint on a file the repository cannot produce.

## Consequences

Benefits:

* The photo is the design's, shape and light, and the largest visual difference left between the
  page and the file is closed.
* `--radius-pill` gains a second user and the radius scale gains nothing, so DDR-013 is unchanged in
  substance.
* #63 is unblocked, and the crop it names does not change: the capsule is drawn by the stylesheet,
  so the exported file stays a 3:4 rectangle.
* The frame is a general answer to a general problem. Any future image that needs an inner shadow
  has a pattern and a recorded reason.

Tradeoffs:

* One element in the markup exists only to carry a shadow.
* `components/stylesheets.test.ts` has its first exception, and the burden moves from "no stylesheet
  positions anything absolutely" to "no stylesheet positions content absolutely".
* The glow is adopted below DDR-020's floor. Anyone reading the two records together has to read
  this section to know why, which is why the numbers are in the table above rather than described.

Risks:

* **A future image could copy the frame's positioning without its reason.** What holds it is the
  test: absolute positioning is admitted on a pseudo-element and refused everywhere else, so
  positioning content fails the suite rather than passing review.
* **The glow's visibility rests on hue, so a change to the surface could flatten it.** `#f8f7f4` is
  a warm off-white and the glow is indigo; a cooler surface would cut the ΔE. DDR-012 owns the
  surface, and a change to it should re-measure the table above.
* **#63 crops the portrait for a capsule, not a rectangle.** The top and bottom of the frame are
  semicircles of half its width, so the crown of the head and the bottom of the shoulders are cut
  away at the corners; the sides are straight for the middle quarter of the height. The record says
  so here, and #63 says so too.

## Related Documents

* DDR-016, the profile photo's shape, which this supersedes, and #71, which produced it
* DDR-020, elevation, which this amends by taking the second level it left open
* DDR-013, the spacing and layout scale, whose `--radius-pill` draws the capsule, and DDR-012, whose
  surface the glow is measured against and whose accent it does not use
* DDR-014, whose "the visual order is the markup order" the stylesheet test narrows here, and
  DDR-015, which prints the photo at 28mm and drops every light at the token layer
* DDR-019, whose marker is held to 3:1 because it carries meaning and prints, where this is not
* ADR-001 and ADR-006, the styling boundary and the literals a component stylesheet may write
* ADR-004, the binary asset decision; the exported photograph is still a 3:4 rectangle
* GitHub issue #89, which this decision resolves, and Epic #70
* GitHub issue #63, which supplies the real photograph, and #68, whose behaviour this was measured
  against
* The Figma design file `career-site-design`,
  https://www.figma.com/design/RhUMRELzXCfPc0IYa0uHse/career-site-design?node-id=2-28, whose shape
  and whose two shadows this adopts
