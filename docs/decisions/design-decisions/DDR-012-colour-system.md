# DDR-012-Colour System

Status: Superseded

Date: 2026-09-16

**Superseded by DDR-025**, which takes the design's palette entire after the owner decided on
2026-09-17 that `career-site-design` prevails over the records written to protect WCAG conformance.
What carries forward is this record's focus indicator, its underline rule, its "colour is never the
only signal" rule, its decision against a dark mode, and its rule that only a measured and recorded
pairing may be used. What does not is the palette: one ink below the body's becomes three, the
accent becomes the `#4f46e5` measured and rejected below, the tag's ink stops following the accent,
`--color-decoration` becomes three hairlines, and the rule that a border carrying meaning must reach
3:1 is given up. Four of DDR-025's pairings fail WCAG 2.2 AA, and that record lists them.

Read DDR-025 first, and this one for the measurements behind what it reverses: the ramp that chose
`#4338ca`, the argument for holding all text to 4.5:1 whatever its size, and the reason
`--color-decoration` was named as it was.

Supersedes DDR-002, the colour system. Its focus indicator, its underline rule, its
"colour is never the only signal" rule and its decision against a dark mode carry forward
unchanged. Its palette does not: the surface changes, two levels of ink become three, the accent
changes, five tinted surfaces are added, and the single border colour splits into decoration that
may carry no meaning and, for anything that does, the secondary ink.

## Context

Epic #42 adopts the redesign the owner made in Figma, and the UI Review on #43 is its contract.
DDR-002 gave the old page one surface, two text colours, one accent and one border, which was
exactly enough for a single column of prose on one background. The redesign has white cards on a
warm page, technology tags, level badges in three tints, a timeline spine, a filled CV control and
a rule beside every section heading. None of that has a colour in the current system.

The draft cannot be taken as it stands, and this is where it fails hardest. Its own follow-up
prompt asked for "every text and background colour pair with its contrast ratio, and fix any below
4.5:1". That step was never run, and two of its colours fail:

* `#94a3b8`, which it uses for the location, every role's place and the whole footer, is **2.39:1**
  against its page — barely half what is required.
* `#64748b`, which it uses for companies and institutions, is **4.44:1**, just under.

It also contradicts itself about the accent: `index.css` declares `--color-accent: #0055BB` while
`App.tsx` writes `#4f46e5` everywhere and never reads the token.

The constraints are:

* **WCAG 2.2 AA**, restated by the brief as a hard constraint: 4.5:1 on all text, and 3:1 on
  non-text that carries meaning.
* **ADR-001**: every colour is a custom property defined once at the root, and no component writes
  a literal.
* **ADR-002**: the page is the CV, so every colour has to survive being printed, including by a
  browser that is not printing background graphics.

## Decision

### The palette

| Token                              | Role                    | Value                          |
| ---------------------------------- | ----------------------- | ------------------------------ |
| `--color-surface`                  | The page                | `#f8f7f4`                      |
| `--color-surface-card`             | A card or a piece of media | `#ffffff`                   |
| `--color-text-heading`             | Heading ink             | `#0f172a`                      |
| `--color-text`                     | Body ink                | `#334155`                      |
| `--color-text-secondary`           | Secondary ink           | `#475569`                      |
| `--color-accent`                   | Accent                  | `#4338ca`                      |
| `--color-on-accent`                | Text on the accent      | `#ffffff`                      |
| `--color-surface-tag`              | A technology tag        | `#eef2ff`                      |
| `--color-text-tag`                 | Its ink                 | `var(--color-accent)`          |
| `--color-surface-level-advanced`   | The Advanced badge      | `#ecfdf5`                      |
| `--color-text-level-advanced`      | Its ink                 | `#065f46`                      |
| `--color-surface-level-proficient` | The Proficient badge    | `#eef2ff`                      |
| `--color-text-level-proficient`    | Its ink                 | `#3730a3`                      |
| `--color-surface-level-basic`      | The Basic badge         | `#f1f5f9`                      |
| `--color-text-level-basic`         | Its ink                 | `var(--color-text-secondary)`  |
| `--color-decoration`               | Hairlines and dots      | `#94a3b8`                      |
| `--color-focus`                    | The focus outline       | `var(--color-accent)`          |

* **The surface is the draft's warmer off-white.** DDR-002 already chose a warm off-white over
  white, for the same reason; this one is a shade warmer.
* **Three levels of ink, not two.** A heading, the text under it and the metadata beside it are now
  three things rather than two, because the timeline puts dates and places in a column of their own
  where they have to read as quieter than the title without dropping out of sight.
* **White is a surface.** It was not one before. A language card and a piece of project media sit on
  it, and every ink is measured on it as well as on the page.

### The accent is `#4338ca`

This settles the draft's contradiction. It is chosen over both of the draft's own values because it
is **already in the draft** — it is the colour of the technology tags and of the link hover state —
so it is Figma's own indigo rather than a colour introduced from outside, and because it is the only
one of the three that clears 7:1 both as text on the page and as a background under white text,
which the CV control needs:

| Candidate                     | On the page | White on it | Verdict     |
| ----------------------------- | ----------- | ----------- | ----------- |
| `#4f46e5`, the draft's markup | 5.87:1      | 6.29:1      | AA, not AAA |
| `#0055BB`, the draft's token  | 6.50:1      | 6.96:1      | AA, not AAA |
| **`#4338ca`, adopted**        | **7.38:1**  | **7.90:1**  | **AAA both ways** |

DDR-002's accent was an ink blue at 8.04:1. This is an indigo, further from the body ink than the
old accent was from the old body text, which matters because links are told apart by their
underline and the colour only reinforces it.

### Measured contrast

Ratios are calculated with WCAG's relative luminance formula. `app/tokens.test.ts` checks every
pairing below against the tokens as written, so changing a colour fails the tests until this record
is revised with it.

| Foreground                         | Background                         | Ratio    | Required | Result |
| ---------------------------------- | ---------------------------------- | -------- | -------- | ------ |
| `--color-text-heading`             | `--color-surface`                  | 16.66:1  | 4.5:1    | AAA    |
| `--color-text-heading`             | `--color-surface-card`             | 17.85:1  | 4.5:1    | AAA    |
| `--color-text`                     | `--color-surface`                  | 9.67:1   | 4.5:1    | AAA    |
| `--color-text`                     | `--color-surface-card`             | 10.35:1  | 4.5:1    | AAA    |
| `--color-text-secondary`           | `--color-surface`                  | 7.07:1   | 4.5:1    | AAA    |
| `--color-text-secondary`           | `--color-surface-card`             | 7.58:1   | 4.5:1    | AAA    |
| `--color-accent`                   | `--color-surface`                  | 7.38:1   | 4.5:1    | AAA    |
| `--color-accent`                   | `--color-surface-card`             | 7.90:1   | 4.5:1    | AAA    |
| `--color-on-accent`                | `--color-accent`                   | 7.90:1   | 4.5:1    | AAA    |
| `--color-text-tag`                 | `--color-surface-tag`              | 7.07:1   | 4.5:1    | AAA    |
| `--color-text-level-advanced`      | `--color-surface-level-advanced`   | 7.29:1   | 4.5:1    | AAA    |
| `--color-text-level-proficient`    | `--color-surface-level-proficient` | 8.88:1   | 4.5:1    | AAA    |
| `--color-text-level-basic`         | `--color-surface-level-basic`      | 6.92:1   | 4.5:1    | AA     |
| `--color-focus`                    | `--color-surface`                  | 7.38:1   | 3:1      | Pass   |

* **All text is held to 4.5:1**, whatever its size, including the 13px tags and badges and the 48px
  page title. There is then no size threshold for later work to get wrong. This is DDR-002's rule
  and it does not change, and it matters more now that the type scale reaches 13px.
* **Only the pairings above are verified.** Any other combination, such as the secondary ink on a
  tag, is not to be used for text until it has been measured and recorded here.
* **The draft's two failing colours are replaced** by the secondary ink at 7.07:1: `#94a3b8` at
  2.39:1 for the location and every role's place, and `#64748b` at 4.44:1 for companies and
  institutions.

### Decoration carries no information

The rule beside a section heading, a card's border, and the timeline's spine and dots use
`--color-decoration` at **2.39:1**, below the 3:1 WCAG 1.4.11 asks of meaningful non-text.

That is permitted **only because none of them carries information**. Each is hidden from assistive
technology, each is dropped in print, and removing all of them at once would lose nothing: the
section boundary is whitespace and a heading, a card's contents read without its edge, and the
timeline's order is the markup order.

**Any border that ever carries meaning uses `--color-text-secondary` at 7.07:1 instead** — a
control's edge, a state, a focus ring, anything a reader has to see to understand the page. This is
the one thing DDR-002 got for free by holding its single border to 3:1, and it is given up
deliberately: the draft's `#e2e8f0` hairlines are 1.15:1 against the page and effectively invisible,
and `#94a3b8` is the lightest value at which a hairline reads at all.

The token is named `--color-decoration` rather than `--color-border` so that reaching for it for a
control's edge is a visible mistake rather than an easy one.

### Colour is never the only signal

DDR-002's rule, carried forward, and extended to the patterns the redesign adds:

* **Links are underlined.** The underline, not the colour, is what identifies a link. Hover thickens
  the underline rather than changing the colour, so no state depends on hue.
* **Bordered and filled controls are not underlined.** The three contact pills and the CV pill are
  identified by their border or fill together with their icon — two non-colour cues. This is a
  deliberate, limited exception, recorded in DDR-010, and it extends no further than bordered or
  filled controls.
* **A level badge contains its level as a word.** Advanced, Proficient and Basic read as a ranking
  in green, indigo and grey, which is intended; in greyscale the words still do.
* **A tag is text.** Its tint adds nothing the text does not say.
* **Secondary ink is also smaller and elsewhere.** Metadata is distinguished by size and position
  first.
* **Visited links are not distinguished**, as DDR-002 decided.
* **Any later state** needs a cue other than colour.

### Focus indicator

Unchanged from DDR-002. Keyboard focus shows a 2px solid outline in `--color-focus`, 2px away from
the element, applied with `:focus-visible`. It is an outline rather than a shadow so it survives
forced-colours modes, and it is offset so it sits on the surface, where its 7.38:1 is measured.

### Light only

DDR-002 decided against a dark mode and the reasoning has not changed: the page is the CV, it is
printed, and a second palette is a second set of pairings to verify for a site changed a few times a
year. The Figma design is light only as well. `color-scheme: light` stays on the root.

### On paper

Every tint in this palette is decorative and redundant with the text it holds, so the page reads the
same whether or not the browser prints background graphics. Backgrounds are dropped throughout, the
surface becomes the paper, and the three inks print as they read. What each element does on paper is
DDR-010's, and #52 implements it.

## Alternatives Considered

### Option A: Keep DDR-002's palette and add only what the new patterns need

Pros:
* No accepted pairing is disturbed, and the two verified inks stay verified.

Cons:
* The surface, the accent and the body ink are the most visible thing the redesign changes. Keeping
  them would be keeping the old page's colour under the new page's layout.
* The old palette has no white surface, so a card would have had to invent one anyway, and every
  ink would have needed measuring on it regardless.

### Option B: Take the draft's colours as drawn

Pros:
* No decision to make, and the page matches the Figma file pixel for pixel.

Cons:
* Two of its text colours fail WCAG 2.2 AA, at 2.39:1 and 4.44:1. The brief names 4.5:1 as a hard
  constraint.
* Its accent is written two ways and the markup ignores the token.

### Option C: Adopt `#4f46e5`, the accent the draft's markup actually uses

Pros:
* It is literally the colour on screen in the draft, so nothing shifts.

Cons:
* 5.87:1 on the page and 6.29:1 under white text. Both pass AA, neither reaches AAA, and the CV
  control needs the second of those to carry white text at 13px.
* `#4338ca` is in the draft too, as its tag ink and its link hover, so choosing it is not reaching
  outside the design.

### Option D: Hold decoration to 3:1, as DDR-002 held its border

Pros:
* One border colour for everything, and no rule to remember about which one carries meaning.

Cons:
* A hairline at 3:1 beside a section heading reads as a line drawn under the heading rather than as
  a rule running to the margin. The draft's own hairlines are far lighter still.
* WCAG does not require it of decoration that is hidden from assistive technology and loses nothing
  when removed, which each of these is.

## Consequences

Benefits:
* Every pairing intended for text meets WCAG 2.2 AA, and all but one reach AAA. The two colours the
  draft would have shipped failing are replaced.
* The page has a vocabulary for the patterns the redesign adds — cards, tags, badges, a filled
  control — so no section story invents a tint.
* Nothing on the page depends on colour: links are underlined, controls are bordered or filled and
  carry icons, levels are words, tags are text.
* One accent, chosen deliberately, where the draft had two.

Tradeoffs:
* Seventeen colour tokens where DDR-002 had six.
* Two colours now mean "a border": decoration for what carries nothing, the secondary ink for what
  carries something. DDR-002 needed only one, and nothing enforces the distinction but the token's
  name and this record.
* The body ink is 9.67:1 where DDR-002's was 16.50:1. It is still far above AAA, and the heading ink
  above it is what carries the darkest weight now.

Risks:
* **The level badges read as a ranking in colour**, which is intended, and will not in greyscale.
  The words will, which is why the levels stay words.
* **A tinted surface invites text that was never measured on it.** The table above is the whole list,
  `app/tokens.test.ts` holds it, and anything else is unverified.
* **Decoration at 2.39:1 is only safe while it carries nothing.** The moment a hairline marks a
  state or an edge, it needs the secondary ink instead. This is a rule a reviewer has to apply; no
  test can see what a border means.

## Related Documents

* GitHub issue #44, which this decision resolves, and Epic #42, the redesign
* The UI Review on #43, which this implements, and DDR-010, which records its structure and settled
  the accent
* DDR-002, the colour system this supersedes, and Epic #2, which produced it
* DDR-011, DDR-013 and DDR-014, the typographic, spacing and responsive records this story writes
  with it
* DDR-005, the print stylesheet, and GitHub issue #52, which reworks it for these surfaces
* ADR-001, which put every value in the tokens, and ADR-002, which made the page the CV
