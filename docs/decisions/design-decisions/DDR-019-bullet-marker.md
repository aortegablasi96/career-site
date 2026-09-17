# DDR-019-Bullet Marker

Status: Accepted

Date: 2026-09-17

**Amended by DDR-025**, which takes the marker's colour. This record measured the design's own
`#a5b4fc` at 1.86:1, called it fainter than anything else the page draws, and chose `#6366f1` at
4.17:1 instead; the owner decided on 2026-09-17 that the design prevails, so the marker is
`#a5b4fc` and fails WCAG 1.4.11. Everything else here stands: the one-step indent, the recoloured
`::marker` and the three reasons a drawn dot was rejected, the reason the marker is a token of its
own rather than a hairline, and the reason it is not dropped on paper. The ramp below is still the
measurement DDR-025 reverses.

Refines DDR-010, which gives a role its bullet points but says nothing about how they are marked or
how far they are indented. DDR-010 stands in every other respect.

It **adds one colour to DDR-012's palette**, `--color-marker`, and draws the line that record left
implicit: a mark that carries something and is printed is held to 3:1, where a hairline that carries
nothing and is not printed may sit below it. Nothing in DDR-012 is superseded.

## Context

A role's points are the only marked list on the site. The other four `ul`s — the contents, the
contact controls, a project's technologies and its links — all set `list-style: none` and lay
themselves out. So this is the one place the page shows a marker at all, fifteen times across the
five roles, and it is the last thing on the timeline still drawn entirely by the browser: a disc in
the body ink, at the indent `app/globals.css` gives every list.

That indent is `--space-large`, two steps of the scale. It was chosen when DDR-006 set the whole
page in one 65ch column, where 32px of hanging indent costs nothing. DDR-010 moved the points into
the timeline's content column, which is the narrowest column the page has: from the wide breakpoint
it is what is left of the page after a 10rem date column, a 1.75rem spine and the gap between them,
and the points are the smallest text on the page set in it. Two steps of indent is now 32px of the
column, and 64px when the reader has enlarged text, since the step is in rem.

The Figma design file draws the same points with a **4px round marker in `#a5b4fc` at a 16px
indent** — a dot noticeably lighter than the text, close to it. Nothing in any accepted record rules
on either the marker or the indent, so this is a gap rather than a rejection, and Epic #70 tracks it
as #76.

The design's colour cannot be taken as drawn. `#a5b4fc` is **1.86:1** against the page, which is
below anything else this site draws: DDR-012 rejected `#e2e8f0` at 1.15:1 as "effectively
invisible", and calls its own `--color-decoration` at 2.39:1 "the lightest value at which a hairline
reads at all". A 4px dot is a smaller mark than a hairline is thin.

## Decision

**A role's points are indented by one step of the scale, and their marker is the browser's own disc
recoloured in a new token, `--color-marker`, an indigo lighter than the accent and darker than the
decoration.**

Three parts, in `app/tokens.css` and `components/experience.module.css`, and nothing else on the
page changes.

### The indent is `--space-medium`

One step, 16px at the default font size, which is the design's indent and half what the base styles
give a list. It is the step, not a number: DDR-013's scale is what the page measures space with, and
16px is on it.

The base styles are unchanged. Every other list on the page sets `list-style: none` and is laid out
by its own component, so `:where(ul, ol)`'s two steps now apply to nothing that is drawn. It stays
as the sensible default for a list in a full-width column, which is what it was chosen for, and the
one list that is not in one overrides it.

### The marker is recoloured, not replaced

```css
.points > li::marker {
  color: var(--color-marker);
}
```

Recolouring the marker rather than drawing a dot of our own is what keeps everything else true:

* **The list is still a list**, and a point is still a list item. Nothing is added to the markup and
  no role is restored to it, because none is taken away. Setting `list-style: none` would remove the
  list's semantics from Safari and VoiceOver and need `role="list"` to put back what the markup
  already said.
* **The marker is still a marker.** It is announced as nothing, it hangs outside the content box
  beside the **first** line of a point however many lines the point runs to, and it needs no
  positioning to do it. `components/stylesheets.test.ts` forbids `position: absolute` in a component
  stylesheet, which is what a hanging `::before` would take.
* **Its size follows the text.** Chromium draws the disc at about 4.8px beside the 14px points, and
  it grows with the reader's setting. That is the design's 4px without a length: a marker is a
  proportion of the text it marks, so a token here would be a number that stops tracking what it
  marks.

### `--color-marker` is `#6366f1`

A new token, immediately after `--color-decoration` in `app/tokens.css`, where the difference
between the two is the thing worth reading.

| Candidate                 | On the page | Verdict                                              |
| ------------------------- | ----------- | ---------------------------------------------------- |
| `#a5b4fc`, the design's   | **1.86:1**  | Below everything the site draws                       |
| `#818cf8`                 | 2.78:1      | Below 3:1                                             |
| **`#6366f1`, adopted**    | **4.17:1**  | The lightest of the ramp that clears 3:1              |
| `#4f46e5`                 | 5.87:1      | Rejected as the accent by DDR-012                     |
| `--color-accent` `#4338ca`| 7.38:1      | As dark as a link, where the design asks for quieter  |
| `--color-decoration`      | 2.39:1      | For reference: the hairlines                          |

It is measured on the page alone, as the focus outline is. The points sit in the timeline's content
column, which is on the page and never on a card.

**The marker is not decoration, and that is why it is not `--color-decoration`.** DDR-012 permits
the hairlines below 3:1 on two conditions, and a bullet marker meets neither:

* *Removing all of them at once would lose nothing.* Remove the markers and the points are
  paragraphs at a 16px indent — and at one step of indent rather than two, the marker is most of
  what is left saying where one point ends and the next begins.
* *Each is dropped in print.* DDR-015 makes `--color-decoration` transparent at the token layer, so
  a marker drawn in it would leave the printed CV — which is the page — with no markers at all,
  where today it has them.

So the marker sits on the meaningful side of DDR-012's own line, and takes the 3:1 that WCAG 2.2
asks of non-text that carries meaning. `#6366f1` is the lightest value in the design's indigo ramp
that clears it, which is as close to the drawn intention as the site's contrast rule allows.

### On paper

Nothing to write. `--color-marker` is neither a surface nor the decoration, so DDR-015's print block
does not touch it and the dots print as they read. The indent is a rem, so it is measured from the
11pt base like every other space on the sheet.

## Alternatives Considered

### Option A: one step of indent, the disc recoloured, a new token at 4.17:1 — adopted

Pros:

* It is the design's indent exactly, and the design's intention for the marker — a small dot,
  quieter than the text — at the lightest value the site's own contrast rule admits.
* It gives 16px of the narrowest column back to the densest text on the page, and 32px at 200%.
* It adds two declarations and one token. No markup changes, no ARIA, no new pattern.
* The marker keeps every property the browser gives it for free: the semantics, the hanging
  alignment on the first line of a wrapped point, and a size proportional to the text.

Cons:

* The palette gains an eighteenth colour for one 4px mark.
* The dot is a shade darker than the design draws it, so the two still differ, on the record.

### Option B: the design's `#a5b4fc`, as drawn

Pros:

* The page and the design file agree exactly.
* Softest of all the candidates: at 1.86:1 the marker never competes with the text.

Cons:

* 1.86:1 is fainter than anything else on the site, including hairlines DDR-012 already calls the
  lightest that read at all. A marker that has to be looked for is not doing a marker's work.
* It would need DDR-012's sub-3:1 permission widened to cover a mark that is printed and that does
  carry something — which is the opposite of what that record is careful about.

### Option C: `--color-decoration`, the token the site already has for dots

Pros:

* No new colour, and the marker joins the timeline's own dots, which it sits beside.
* It is arguably ornament: the list's semantics are in the markup, not in the dot.

Cons:

* **It does not print.** DDR-015 drops the decoration colour at the token layer, so the CV would
  lose markers it has today, and the one surface where a reader cannot ask the document what a line
  is would be the one without them.
* DDR-012's permission rests on "removing all of them would lose nothing", which stops being true
  once the indent is a single step.

### Option D: `--color-accent`

Pros:

* No new colour at all, and the pairing is already recorded at 7.38:1.
* The simplest possible change: one declaration reading a token that exists.

Cons:

* At 7.38:1 the dot is as dark as a link and nearly as dark as the text it marks, which is the
  opposite of the design's intent and makes fifteen small marks compete with the prose.
* The accent means "you can act on this" everywhere else on the page: links, the controls, the focus
  ring. A marker means nothing of the kind.

### Option E: `list-style: none` and a dot drawn with `content` or a `::before`

Pros:

* The dot's size and colour would be fully ours, so the design's 4px could be matched exactly.

Cons:

* Safari and VoiceOver drop a list's semantics when `list-style` is `none`, so it would need
  `role="list"` to restore what the markup already says — the accessibility criterion answered by
  working around a problem introduced on purpose.
* A hanging dot that stays beside the first line of a wrapped point needs absolute positioning,
  which ADR-001's styling boundary and `components/stylesheets.test.ts` keep out of components.
* A 4px length is on neither the spacing scale nor the type scale, so it would be a literal or a
  token invented for one mark, and it would stop growing with the reader's text.

## Consequences

Benefits:

* The last browser-drawn part of the timeline is now designed, and the page's texture matches the
  design file in the place the points are densest.
* The content column gains 16px at every width, and 32px at 200% text, where it is narrowest.
* The marker is the one thing on the page that prints and is not either text or a surface, and the
  record now says which side of DDR-012's line that puts it on. A later marked list has a colour and
  an indent to reuse instead of a decision to retake.

Tradeoffs:

* The palette is one colour longer, and `app/tokens.test.ts` one pairing longer with it.
* The page and the Figma file still differ on the marker's exact value, deliberately and on the
  record, as they do on the accent and the greys DDR-012 measured.

Risks:

* **`::marker` accepts few properties**, and `color` is one of them in every browser the site
  supports. A later change that reaches for a property `::marker` does not take — a size, a margin —
  will silently do nothing, and is the point at which Option E's costs have to be paid deliberately
  rather than stumbled into.
* **The disc's exact diameter is the browser's**, so it is about 4.8px in Chromium and close but
  not identical elsewhere. That is the price of the marker staying a marker, and it is a price in
  pixels rather than in meaning.

## Related Documents

* DDR-010, the career page redesign structure, which gives a role its points and the timeline its
  content column
* DDR-012, the colour system, whose palette this adds `--color-marker` to and whose rule on
  decoration it works out the other side of
* DDR-013, the spacing scale the one-step indent is taken from, and DDR-015, the print treatment
  that leaves the marker alone
* ADR-001, which keeps every value in a token, and ADR-006, which says which literals a component
  stylesheet may write
* GitHub issue #76, which this decision resolves, and Epic #70
* The Figma design file `career-site-design`,
  https://www.figma.com/design/RhUMRELzXCfPc0IYa0uHse/career-site-design?node-id=2-107, whose indent
  this adopts and whose `#a5b4fc` it does not
