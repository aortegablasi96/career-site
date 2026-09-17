# DDR-020-Elevation

Status: Accepted

Date: 2026-09-17

Refines DDR-013, which gives the redesign three corner radii and no elevation, by adding one token
beside them. DDR-013 stands in every other respect.

It **adds no colour to DDR-012's palette**, and says why: the shadow's ink is translucent black,
which is a value only a shadow may hold, so it is written inside the shadow rather than offered to
anything that can read a colour token. Nothing in either record is superseded.

## Context

The Figma design file raises two things off the page and nothing else: the four introduction
controls — the three contact addresses and the CV download — and the four language cards. Both carry
the same two-layer shadow, `0 1px 1.5px rgba(0,0,0,.1), 0 1px 1px rgba(0,0,0,.1)`. The profile photo
carries a large indigo glow, which is the photo's question and not this record's; #77 excludes it
and DDR-016 settles what the photo is.

The page has no shadow anywhere. DDR-013 defines the radii a surface may round by and stops there,
so nothing in any accepted record rules on elevation either way, and under ADR-001 that makes it a
decision to make rather than a number to invent. It reaches three components at once, which is why
Epic #70 settles it once, as #77, rather than at each of them.

**The design's shadow is fainter than anything the site draws.** Rendered against the page at a
device pixel ratio of 1 and measured, it is a band two rows deep under the bottom edge — the offset
is 1px and there is no spread, so the sides and the top get nothing — and its darkest row is
`#ccccca`, **1.50:1** against the page. For comparison: DDR-012 calls its own `--color-decoration`
at 2.39:1 "the lightest value at which a hairline reads at all", rejects the draft's `#e2e8f0` at
1.15:1 as "effectively invisible", and DDR-019 turned down the design's own bullet marker at 1.86:1
on the same grounds. At 10% the shadow is nearer the value that record calls invisible than the one
it calls the lightest that reads.

So the question put to the owner on #77 was three-way: record that the site has no elevation, take
the design's shadow as drawn, or keep the design's shadow and give it an ink that reads. **The owner
chose the third.**

## Decision

**The site has one elevation. The four introduction controls and the four language cards are raised
off the page by `--shadow-raised`; nothing else on the page is. The geometry is the design's,
unchanged. The ink is the site's.**

### One token, one level

```css
--shadow-raised: 0 1px 1.5px rgba(0, 0, 0, 0.22), 0 1px 1px rgba(0, 0, 0, 0.22);
```

It sits in `app/tokens.css` beside the radii, because a shadow is a property of a surface in the way
a corner is. It is named for what it does rather than numbered, so a second level is a decision to
take rather than the next number to reach for — and the page has nothing to give a second level to:
nothing on it floats over anything, nothing changes depth on hover, and DDR-012 keeps hover to the
underline.

### The ink is 22% black

Measured the same way as the design's, in both engines, against the page:

| Ink                    | Darkest row   | On the page           | Verdict                              |
| ---------------------- | ------------- | --------------------- | ------------------------------------ |
| `.10`, the design's    | `#ccccca`     | **1.50:1**            | Fainter than any line the site draws |
| `.14`                  | `#bebdba`     | 1.75:1                | Below the hairlines                  |
| `.18`                  | `#aeaeac`     | 2.07:1                | Below the hairlines                  |
| `.21`                  | `#a3a2a1`     | 2.38:1                | A hundredth under                    |
| **`.22`, adopted**     | **`#a09f9e`** | **2.45:1 / 2.47:1**   | The lightest ink that clears them    |
| `.26`                  | `#939290`     | 2.90:1                | Reads as a line under the edge       |
| `.30`                  | `#848382`     | 3.53:1                | A second border, not a shadow        |
| `--color-decoration`   | —             | 2.39:1                | For reference: the hairlines         |

The two figures for the adopted value are Chromium's and Gecko's, which agree to two hundredths;
every other row is Chromium's, and Gecko tracks it within the same margin.

**The floor is the hairlines', not WCAG's.** A shadow carries no information, and it meets both of
the conditions DDR-012 sets for decoration: removing every shadow at once would lose nothing, since
a control is identified by its border or its fill and its icon and a card by its edge and its
contents, and each is dropped in print. So the shadow is not held to the 3:1 WCAG 1.4.11 asks of
non-text that carries meaning — DDR-019's marker was, because it carries meaning and it prints. What
it is held to instead is the site's own floor: **decoration may be quiet, but not quieter than the
quietest thing the page already draws.** That is 2.39:1, and `.22` is the lightest ink above it.

In place on the built page, every one of the eight raised surfaces draws exactly `#a09f9e`, 2.47:1,
in the row below its edge. A language card's own hairline sits directly above it at 2.39:1, so the
shadow is a shade darker than the edge it falls from — which is what a shadow should be, and what it
was not at 10%.

### Its ink is not in the palette

Every colour in DDR-012 is an opaque six-digit hex, and `app/tokens.test.ts` holds the palette to
that. This ink is translucent black, which is wrong on text, wrong on a border and wrong on a
surface, so it is held inside the one value that uses it rather than offered to everything that can
read a colour token. That is DDR-012's own argument for naming the hairline colour
`--color-decoration` — "so that reaching for it for a control's edge is a visible mistake rather
than an easy one" — applied to a value with exactly one correct use.

### Its lengths are in px

A shadow marks an edge. It gains nothing from growing with the reader's text, as the focus outline
and the timeline's line do not, and those are the two other places the site writes px. Every other
length on the page is in rem and follows the reader's setting; these three do not, and each says so.

### What is raised, and what is not

Eight elements: `.contact` and `.cv` in `components/introduction.module.css`, and `.card` in
`components/languages.module.css`. Each reads the token; neither stylesheet writes a length or an
ink of its own, and `components/stylesheets.test.ts` now reads `box-shadow` alongside the sizes, the
spaces and the tracking, so a literal shadow fails the suite.

Nothing else takes it, and that is the point of a single level: a technology tag and a level badge
are labels set in a tint rather than surfaces sitting on the page, a project's media is an image
with a radius, the timeline's dots and spine are hairlines, and the photo's glow is the photo's
question, which #77 excludes and DDR-016 has already answered without one. **Elevation everywhere
says nothing**; elevation on the things a reader acts on, and on the cards that hold a fact, says
which of them sit on top.

### A shadow is never the only cue

DDR-012's rule, extended to depth. A forced-colours mode removes shadows outright, and a reader who
never sees this one loses nothing: the pills keep their border or their fill and their icon, per
DDR-010, and a card keeps its edge and the term-and-value pair in its markup. The shadow is the last
cue added, never the first one relied on.

### On paper

`--shadow-raised: none` in the print block in `app/tokens.css`, beside the surfaces DDR-015 drops
and the decoration it does not draw. It is dropped at the token layer for the reason DDR-015 gives:
so that no component writes a print rule to put out its own light, and so the sheet reads the same
whether or not the browser prints background graphics.

A sheet is lit by the room it is read in. The surfaces this raises are flat on paper anyway — the
pills print as inline text with no border, and a card prints its text alone — so a shadow there
would be ink spent on a depth the page invented.

Verified by printing the built page to A4 in Edge 153 and Firefox 155 **with background graphics
on**, which is the only condition under which a browser prints a shadow at all: no horizontal run of
neutral grey longer than 35px exists on any of the four Edge sheets or the five Firefox sheets,
where a card's shadow would be a band about 240px wide at 150dpi. The sheet counts are unchanged at
four and five, and all 472 distinct words still come back out of both PDFs through both pypdf and
pdfium.

## Alternatives Considered

### Option A: the design's geometry with the ink darkened to 22% — adopted

Pros:

* The page and the design file agree on where elevation is and on the shape of it, exactly, and
  differ only in how dark the ink is — the same kind of deviation DDR-012 and DDR-019 already record
  for the accent, the greys and the bullet marker.
* The shadow is visible at the value the site itself calls the lightest that reads, chosen by
  measurement rather than by eye.
* Two declarations and one token. No markup changes, no new pattern, nothing to maintain but the
  token.

Cons:

* The site gains its first translucent value and its first composite token, and `app/tokens.css` now
  has three px lengths rather than two.
* A page with depth invites more depth. What holds it is that there is one level with a name rather
  than a scale with numbers.

### Option B: the design's shadow as drawn, at 10% black

Pros:

* The page and the design file agree exactly.
* Nothing to measure and nothing to justify.

Cons:

* 1.50:1 against the page. It is fainter than the hairlines DDR-012 calls the lightest that read at
  all, and nearer the value that record rejects as effectively invisible. A shadow nobody can see is
  a token nobody can justify.
* It would take DDR-012's permission for sub-3:1 decoration — written for lines that carry nothing
  and are dropped in print — and stretch it to cover a mark that is not merely quiet but absent.

### Option C: no elevation at all, recorded

The recommendation put to the owner on #77, and the option they turned down.

Pros:

* Nothing to build, nothing to maintain, and the question is settled either way.
* The site's visual language is otherwise flat by construction — tint, hairline, radius — and
  DDR-010 rejects both the divider and the sticky bar's scroll shadow on much the same grounds.
* One less token, one less px length, and no translucency anywhere.

Cons:

* The controls and the cards are the two things on the page a reader acts on and reads a fact from,
  and they would sit in exactly the same plane as everything around them.
* The difference between the page and the design would stay a difference, recorded as a rejection
  rather than closed as a gap — which is what Epic #70 exists to reduce.

### Option D: raise every surface — tags, badges, project media, the timeline's dots

Pros:

* One rule, applied consistently, and nothing to decide per component.

Cons:

* The design raises two things and leaves the rest flat, deliberately: a tag and a badge are labels
  set in a tint, not surfaces sitting on a page.
* Elevation that is everywhere carries no information. What is left is a page that looks embossed.

### Option E: two levels, a resting one and a raised one for hover

Pros:

* It is what most design systems have, and it would be ready for a state that needs it.

Cons:

* Nothing on this page floats over anything and no state changes depth: DDR-012 keeps hover to the
  underline, and links are the only things with a hover state at all.
* A second level is speculative functionality, which the project's principles rule out.

### Option F: a darker shadow still, at 26% or 30%

Pros:

* Unmistakable, and further from the risk of being taken for nothing.

Cons:

* At 2.90:1 and 3.53:1 the band under the edge is darker than the card's own hairline above it, so
  it reads as a second border rather than as a surface lifted off the page.
* The design asks for something soft. The floor is what the shadow has to clear, not what it has to
  beat.

## Consequences

Benefits:

* Elevation is settled once, for three components, with the reasoning and the measurements on the
  record, so no later story picks a shadow by eye.
* The two things a reader acts on and reads a fact from sit above the page, and everything else
  stays flat, which is what makes the difference legible.
* The rule the record leaves behind is reusable and short: decoration may be quiet, but not quieter
  than the quietest thing the page already draws.

Tradeoffs:

* The page and the Figma file still differ on the ink, deliberately and on the record, as they do on
  the accent, the greys and the bullet marker.
* `app/tokens.css` now holds a value that is neither a colour nor a length but both, and it is the
  one place in the file where a raw `rgba()` appears. `app/tokens.test.ts` pins it and holds the
  palette opaque, so it stays the only one.

Risks:

* **The 2.45:1 is measured at a device pixel ratio of 1.** At a fractional ratio the browser splits
  the band across two device rows and the darkest row lands nearer 2.2:1. That is a rendering
  artefact rather than a change to the value, and it is why a remeasurement belongs at a ratio of 1
  — but anyone reading a screenshot from a scaled display should expect the lower figure.
* **`box-shadow` is removed outright in forced-colours modes.** That is intended here, and the
  border, the fill and the icons carry the meaning; a later element that is raised and nothing else
  would be an accessibility defect this record does not license.
* **A shadow is the easiest thing on a page to add a second of.** The token is one level with a
  name, the test allows exactly one, and a second is a decision record of its own.

## Related Documents

* GitHub issue #77, which this decision resolves, and Epic #70, which audits the page against the
  design file
* DDR-013, spacing and layout, whose radii this joins and which defined no elevation
* DDR-012, the colour system, whose palette this deliberately does not join, and whose rule on
  decoration sets the floor the ink is chosen against
* DDR-019, the bullet marker, which measured the design's own value the same way and darkened it for
  the same reason — and which was held to 3:1, where this is held to 2.39:1, because a marker
  carries something and a shadow does not
* DDR-015, the print treatment, whose pattern of dropping a value at the token layer this follows,
  and DDR-010, which identifies a control by its border or its fill and its icon
* DDR-016, the profile photo, which settles the photo without the design's indigo glow
* ADR-001, which makes a missing value a decision rather than a number to invent, and ADR-006, which
  says which literals a component stylesheet may write
* The Figma design file `career-site-design`,
  https://www.figma.com/design/RhUMRELzXCfPc0IYa0uHse/career-site-design?node-id=2-50, whose shadow
  this adopts and whose ink it darkens
