# DDR-070-Timeline Cards on the Design's Tinted, Grained Surface

Status: Accepted

Date: 2026-09-28

**Extended by DDR-080**: a project's business case is drawn as a timeline card is, on the same
surface, edge and top line, and rests raised.

**Amends DDR-057**, per #204. Every card in the experience and education timelines is drawn on the
surface the owner drew for it in Figma: a pale gradient with a faint grain over it, a violet edge
and a white highlight inside its top edge. Before, the card was white with a grey hairline. Its
text, logos, size, radius and resting shadow are unchanged. So are its hover, focus and lift
(DDR-063, DDR-064, DDR-065, DDR-069). Paper is unchanged.

## Context

DDR-057 made each timeline card white, with a `--color-border` hairline, as a project card is. Since
#173 the owner has reworked the cards in the Figma layer `career-site-main`, which is now node 321:2.
The experience cards are in section 321:86, with the first at node 321:107. The education cards are
in section 321:485, with the first at node 321:500. Every card in both timelines is drawn in the same
four layers:

* a gradient, `#eef2ff` to `#f5f3ff` to `#fdf4ff`, indigo to violet to pink;
* a grain over it: a 200 × 200 image whose pixels are grey or white at 1% to 7%;
* an edge of `#a78bfa` at 30%; and
* a white line inside the top edge, `inset 0 1px 0 rgba(255, 255, 255, 0.75)`.

On #204 the owner asked for all four, and for the rest of the card to stay as the page has it.

## Decision

* **The card's surface is `--surface-timeline-card`**: the design's grain over its gradient. The
  gradient's three stops are colour tokens, `--color-surface-timeline-card-start`, `-middle` and
  `-end`. The design sets the angle per card to suit its shape: 143° on a role's card, and 159° to
  164° on a credential's. The page uses the role card's 143° on every card, as #204 asks.
* **The grain is the design's own texture**, exported from node 321:107 and saved as a lossless WebP,
  per ADR-004: `app/grain.webp`, 200 × 200 and 23.4 KiB, pixel for pixel the design's PNG. It
  repeats at its own size rather than stretching, so it looks the same on a card of any size. The
  Figma layer stretches it over each card; at 200px a tile is close to the size it is drawn there.
* **The file is in `app/`, next to `app/tokens.css`, and the stylesheet imports it with a relative
  `url()`.** The bundler then gives it a hashed address under `_next/static/media/`, with the base
  path, so it needs no `asset()`. A path in `public/` would have to be written root-relative in the
  stylesheet, and that 404s on the live site, under `/career-site`. It is the first binary a
  stylesheet reads. The page loads it once, whatever the number of cards.
* **The edge is `--color-border-timeline-card`, `#dcd4fe`**: the design's violet at 30% over the
  gradient's middle stop, written opaque because every colour in the palette is (DDR-025). Across
  the gradient the translucent edge is within 8 steps of it on any channel. Under the pointer
  and on focus, `--color-border-accent-hover` replaces it, as it replaced the grey hairline.
* **The highlight is `--shadow-card-highlight`**, the design's inset white line. It is the card's
  surface rather than a state, so it is the first layer of every `box-shadow` the card draws:
  alone on a card without a link, before `--shadow-raised` at rest, and before both shadows when
  lit. It is inset, so it takes none of the row's room for the hover shadow (DDR-061).
* **Paper draws none of it.** The print block in `app/tokens.css` sets the three stops and the edge to
  `transparent`, and the surface and the highlight to `none`, as DDR-015 drops every surface and
  light. A linked card's resting shadow on paper is then `none, none`, which is not a valid shadow
  list, so the browser falls back to no shadow at all, which is what paper had before. Printed in
  Edge and Firefox, background graphics on and off: five sheets, and every sheet's text and pixels
  identical to the tree before.
* **The design's other differences in the card are not adopted**: its logo tile (node 321:109, which
  the owner turned down on #193), its text sizes and inks, and its indigo `drop-shadow`.

### Contrast

The gradient's darkest stop is `#eef2ff`. The grain's darkest pixel is `#777777` at 15/255, and over
that stop it gives `#e7ebf7`, the darkest point on any card. Each ink a card carries, on the white it
had and on the new surface:

| Ink | On it | On white | At the darkest stop | At the darkest point | WCAG 1.4.3 |
| --- | ----- | -------- | ------------------- | -------------------- | ---------- |
| `--color-text-heading` | the title | 17.85:1 | 15.97:1 | 14.96:1 | passes |
| `--color-accent` | the company, the institution, the title when lit | 6.29:1 | 5.62:1 | 5.27:1 | passes |
| `--color-text-faint` | a role's place | 2.56:1 | 2.29:1 | 2.15:1 | **fails, by more** |

The place already failed at 2.56:1 on white, per DDR-025. It fails by more here, and
`app/tokens.test.ts` now holds it by name as a ninth failing pairing, beside DDR-025's, DDR-035's and
DDR-059's. The edge is a hairline that carries nothing: 1.29:1 on the middle stop.

### DDR-010's note on gradients

DDR-010 says of the draft's gradient placeholders and monogram that "the brief excludes gradients".
That sentence is about **placeholder media**: gradients drawn where a photo or a project's picture was
missing, which #47 and #63 replaced with the real files. It stands: no gradient is drawn in place of a
picture. This record does not draw one there. It gives a surface a tint, as DDR-046's band and the
tag and level tints are tints, and the owner asked for it on #204, as the design since 2026-09-17
prevails (Epic #70).

## Alternatives Considered

### Keep the white card

Pros:
* No new tokens, no new binary, and the cards stay the same as the project cards.

Cons:
* The owner asked for the design's surface on #204.

### The gradient and the edge, without the grain

Pros:
* No binary file, and nothing to download.

Cons:
* The owner chose all four layers on #204, and the grain is what keeps the tint from looking flat.

### Draw the grain in CSS or SVG, as noise

Pros:
* No binary, and no file to keep in step with the design.

Cons:
* It would be a texture of our own, not the owner's. An SVG `feTurbulence` filter is drawn
  differently by each browser and costs paint time on every card.

### The design's angle for each card

Pros:
* Each card would match its own node exactly.

Cons:
* The angle depends on each card's shape in the design. On the page the cards change shape with the
  viewport and the text size, so no fixed per-card angle would stay right. The difference between
  143° and 164° on so pale a gradient is hard to see.

## Consequences

Benefits:
* The cards read as the design draws them, and are set apart from both of the page's bands.
* One surface for both timelines, written once, so the two cannot drift apart.

Tradeoffs:
* The timeline cards no longer match the project cards and the language cards, which stay white.
* One more request, 23.4 KiB, on the page.
* A role's place, already below 1.4.3, is fainter still: 2.15:1 at its worst.

Risks:
* A new ink on a timeline card has to be measured on `#e7ebf7`, not on white.
* A darker or more opaque grain moves every ratio above. Re-export it and re-measure.

## Related Documents

* #204, and its Epic #170
* DDR-057: the timelines of cards, which this amends
* DDR-010: its note on gradient placeholders, which stands
* DDR-015 and DDR-032: print
* DDR-025: the palette and its failing pairings
* DDR-061, DDR-063, DDR-064, DDR-065 and DDR-069: the card's states, which are kept
* DDR-066 and DDR-068: the logos drawn straight on the card
* ADR-004: binary assets are WebP
