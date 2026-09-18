# DDR-025-Colour System

Status: Accepted

Date: 2026-09-17

**Supersedes DDR-012**, the colour system. Its focus indicator, its underline rule, its "colour is
never the only signal" rule and its decision against a dark mode carry forward. Its palette does
not: one ink below the body's becomes three, the accent changes, the tag's ink stops following the
accent, the single decoration colour becomes three hairlines, and the rule that a border carrying
meaning must reach 3:1 is given up.

**Amended by DDR-031 in one respect**: the palette is no longer opaque throughout. The contents bar's
surface, `--color-surface-bar`, is the page's own off-white at 96%, as the design draws it. It is a
surface, not an ink, and every ink stays opaque. The contents link on it is measured on the worst
blend the page can put behind it: 4.10:1, where this record gives 4.44:1 on the page. Both fail,
and this record already counts that ink among its failures.

**Amended by DDR-035 in two respects**: the palette gains five colours for hover and for a project
link's underline — `--color-surface-hover`, `--color-accent-hover`, `--color-border-accent-hover`,
`--color-underline` and `--color-underline-hover` — and the pairings that fail WCAG go from four to
six: a contact pill's hover border at 1.78:1 and a project link's resting underline at 1.86:1, both
below the 3:1 of 1.4.11. The four below are unchanged.

**Amended and corrected by DDR-036**: of the three differences kept below as structure, the
ringed timeline dot is now adopted, and the second — that the design draws no spine in the
experience section — was a misreading and is withdrawn. Node 2:99 is the row's empty spine column;
the experience spine is its own node, 2:89. No colour here moves.

**Superseded in part by DDR-033**: the contents links are no longer underlined, as the design draws
them. That is the one bullet under "Colour is never the only signal" that DDR-033 takes; every other
link keeps its underline.

It **amends DDR-019**, which stands in every other respect — the indent, the recoloured `::marker`,
the reason the marker is a token of its own and the reason it is not dropped on paper. What changes
is its value: the marker is the design's `#a5b4fc` at 1.86:1, which that record measured and turned
down.

It **amends DDR-020**, which stands in every other respect — one elevation, named for what it does,
the eight elements that read it, its geometry, and its translucent ink held inside the shadow rather
than offered to the palette. What changes is its value: the shadow's ink is the design's 10% black,
which that record measured at 1.50:1 and darkened to 22%.

It **touches DDR-021 in one place**: that record justifies the photo's glow partly by saying its
indigo `#4f46e5` is a colour DDR-012 turned down for the accent. That is no longer true, and the
glow is now the accent's own hue. Nothing else in DDR-021 moves, and the glow's 1.17:1 is unchanged.

DDR-013's radii, DDR-022's sizes, DDR-023's faces and weights, DDR-017's and DDR-024's tracking and
DDR-011's line heights and measure are all untouched. This record changes colour and nothing else.

## Context

Epic #70 was rewritten on 2026-09-17. Until then, a difference between the page and
`career-site-design` was read as a recorded rejection: DDR-012 had measured four of the design's
colours, found three of them failing WCAG 2.2 AA, and replaced them; DDR-019 and DDR-020 each did
the same thing again, for the bullet marker and for the raised shadow, after the design's values
measured below the faintest hairline the palette admitted.

**The owner decided that the design prevails**, including over the records written to protect WCAG
conformance, and chose that over two narrower options. Those three records are the largest single
source of difference between the page and the file, which is why #93 is the story on this Epic with
a real cost to real readers. The owner knows what it costs; this record's job is to say so, line by
line, rather than to absorb it.

Every value below was read off `career-site-design` node by node rather than taken from the issue,
and the ratios are WCAG 2.1's relative-luminance formula. Four values are ones the issue's own table
does not list, because they are things DDR-012 folded into a single token and the design does not:

* a language card's edge is `#e2e8f0` (node 2:654), not the hairline the section rule takes;
* the timeline's spine is `#c7d2fe` (node 2:576), the same tint as a contact pill's border;
* a contact pill sits on white (node 2:51), which is the surface its border's 1.49:1 is measured
  against, and without which the issue's own figure for that row cannot be reproduced;
* the technology tags are `#4338ca` (node 2:296) where everything else the design sets in indigo is
  `#4f46e5`, so the tag's ink and the accent part company here.

### What this record does not settle

Three differences were measured on this story and are structure rather than colour, so they stay:

* **The design's timeline dot is not one disc.** It is a 6px `#4f46e5` core inside a 12px circle
  filled with the page's own surface, ringed by 3px of `#c7d2fe` (node 2:637). The page draws one
  12px disc, and this record gives that disc the ring's colour. The shape is DDR-010's.
  *DDR-036 has since adopted the ringed dot.*
* **The design draws no spine in the experience section at all** — node 2:99 is an empty 28px
  container, where the education section has the line and the dots. The page draws the spine in
  both, per DDR-010, and keeps doing so. *Corrected by DDR-036: this misread the file. The
  experience spine is node 2:89, a sibling of the rows rather than a child of one.*
* **The contents bar's border is transparent in the design** (node 2:6), not the `#e2e8f0` the
  issue's table gives it. The bar is #98's, and this record leaves it the token rather than the
  value.

## Decision

### The palette

| Token                              | Role                                              | Value                         |
| ---------------------------------- | ------------------------------------------------- | ----------------------------- |
| `--color-surface`                  | The page                                          | `#f8f7f4`                     |
| `--color-surface-card`             | A card, a piece of media, a contact pill          | `#ffffff`                     |
| `--color-text-heading`             | Heading ink                                       | `#0f172a`                     |
| `--color-text`                     | Body ink                                          | `#334155`                     |
| `--color-text-secondary`           | A level's skills, the Basic badge                 | `#475569`                     |
| `--color-text-muted`               | A company, an institution, a thesis, a contents link | `#64748b`                  |
| `--color-text-faint`               | The location, a role's place, the footer          | `#94a3b8`                     |
| `--color-accent`                   | Accent                                            | `#4f46e5`                     |
| `--color-on-accent`                | Text on the accent                                | `#ffffff`                     |
| `--color-surface-tag`              | A technology tag                                  | `#eef2ff`                     |
| `--color-text-tag`                 | Its ink                                           | `#4338ca`                     |
| `--color-surface-level-advanced`   | The Advanced badge                                | `#ecfdf5`                     |
| `--color-text-level-advanced`      | Its ink                                           | `#065f46`                     |
| `--color-surface-level-proficient` | The Proficient badge                              | `#eef2ff`                     |
| `--color-text-level-proficient`    | Its ink                                           | `#3730a3`                     |
| `--color-surface-level-basic`      | The Basic badge                                   | `#f1f5f9`                     |
| `--color-text-level-basic`         | Its ink                                           | `var(--color-text-secondary)` |
| `--color-rule`                     | The rule beside a section heading                 | `#cbd5e1`                     |
| `--color-border`                   | A card's edge, a divider, the footer's border     | `#e2e8f0`                     |
| `--color-border-accent`            | A contact pill's border, the timeline's spine     | `#c7d2fe`                     |
| `--color-marker`                   | A role's bullet marker                            | `#a5b4fc`                     |
| `--color-focus`                    | The focus outline                                 | `var(--color-accent)`         |

Twenty-two tokens where DDR-012 had eighteen. The surfaces, the heading ink, the body ink, the four
tinted surfaces and their inks are unchanged: the design and DDR-012 already agreed on them.

### Three inks below the body's, where DDR-012 had one

DDR-012 replaced two of the design's greys with a single `#475569` at 7.07:1. The design draws
three, and gives each a job:

* **`--color-text-secondary`, `#475569`** — a level's skills and the Basic badge. The one ink below
  the body's that the design and the records already agreed on; #78 landed it.
* **`--color-text-muted`, `#64748b`** — a company, an institution, a degree's thesis, and a contents
  link.
* **`--color-text-faint`, `#94a3b8`** — the introduction's location line, a role's place, and from
  #96 the footer.

`metadata-line.module.css` carries the muted ink, because a company and an institution are three of
its five users. The two that are fainter override it where they are already set: `.location` in the
introduction, and `.dates p` in the timeline, which is the selector DDR-022 added there for the
size. The date range above the place is in the accent, at a specificity neither rule can reach.

### The accent is `#4f46e5`

The colour the design's markup uses everywhere, and the one DDR-012 turned down. It sets the
positioning line, the timeline's date range, a CEFR level, a contact pill's label and icon, the CV
pill's fill and a project's links.

| Candidate                 | On the page | White on it | Verdict           |
| ------------------------- | ----------- | ----------- | ----------------- |
| `#4338ca`, DDR-012's      | 7.38:1      | 7.90:1      | AAA both ways     |
| **`#4f46e5`, adopted**    | **5.87:1**  | **6.29:1**  | **AA, not AAA**   |

It passes 1.4.3 both ways, so this is the one value the design moves that costs no criterion. What
it costs is headroom: the CV control carries white text at 13px on it, and 6.29:1 is comfortable
rather than generous.

**The tag's ink stops following the accent.** DDR-012 wrote `--color-text-tag: var(--color-accent)`
because the draft set both in `#4338ca`. The design sets a tag in `#4338ca` and everything else in
`#4f46e5`, so the two part here and the tag keeps the darker value, written out. It is 7.07:1 on its
tint, where the accent would be 5.63:1, so the tag is the one place on the page the old accent
survives.

### Three hairlines, and no border that carries meaning

DDR-012 had one `--color-decoration` at 2.39:1, permitted below 3:1 only because nothing drawn in it
carried information, and named `decoration` "so that reaching for it for a control's edge is a
visible mistake rather than an easy one". Anything that carried meaning used `--color-text-secondary`
at 7.07:1 instead.

The design draws three hairlines, and gives one of them to a control's edge:

| Token                   | Value     | On the page | Draws                                                    |
| ----------------------- | --------- | ----------- | -------------------------------------------------------- |
| `--color-rule`          | `#cbd5e1` | 1.39:1      | The rule beside a section heading                         |
| `--color-border`        | `#e2e8f0` | 1.15:1      | A card's edge; from #94 and #96, a divider and the footer's border |
| `--color-border-accent` | `#c7d2fe` | 1.39:1      | A contact pill's border; the timeline's spine and dots    |

**So the distinction DDR-012 built is given up, and with it the name that guarded it.** There is no
longer a border colour on this site that reaches 3:1, so a token named to make the wrong reach
obvious has nothing left to point at. The three are named for what they draw.

Every one of them is fainter than the 2.39:1 DDR-012 called "the lightest value at which a hairline
reads at all" — which is, exactly, the ratio the faint ink now sets text at. `app/tokens.test.ts`
holds that ordering: a hairline may not climb into the inks, and an ink may not sink into the
hairlines.

### What identifies a contact pill

DDR-010 exempts bordered and filled controls from the underline rule, on the strength of two
non-colour cues: the border and the icon. DDR-012 backed that by holding the border to 7.07:1. At
1.49:1 the border can no longer be one of the two.

**What identifies a contact pill is its icon, its shape and its fill.** The design puts each pill on
white, on a warm off-white page, in a capsule, with a mark for the service it addresses; the border
reinforces those rather than carrying them. Two of the three survive greyscale and a forced-colours
mode, which is what the rule was for. The white fill is adopted here for that reason as much as for
the design's — and because it is the surface the 1.49:1 is measured against.

That is weaker than what DDR-012 promised, and this record does not claim otherwise. It is listed
below as a failure.

### The bullet marker, and the shadow

* **`--color-marker` is `#a5b4fc`**, 1.86:1, where DDR-019 chose `#6366f1` at 4.17:1. It stays a
  token of its own and stays out of the print block, so the printed CV keeps its markers — both of
  DDR-019's structural reasons hold. What is gone is the floor.
* **`--shadow-raised` is the design's 10% black.** DDR-020 darkened it to 22% because at 10% its
  darkest row is 1.50:1, fainter than the hairlines it was measured against. Those hairlines no
  longer exist: all three above are fainter than 1.50:1, and so is the marker. The floor that the
  darkening cleared has been removed by the rest of this record, so keeping the darkening would be
  holding a shadow to a standard nothing else on the page meets.

### Measured contrast

`app/tokens.test.ts` holds every row to the ratio recorded here, rather than to a floor — a floor
would simply fail against the page as drawn. It also holds the list of failures by name, so a fifth
cannot join them quietly and none of the four can be quietly improved without this record being
revised with it.

| Foreground              | Background             | Ratio   | Asked | Result   |
| ----------------------- | ---------------------- | ------- | ----- | -------- |
| `--color-text-heading`  | `--color-surface`      | 16.66:1 | 4.5:1 | AAA      |
| `--color-text-heading`  | `--color-surface-card`  | 17.85:1 | 4.5:1 | AAA      |
| `--color-text`          | `--color-surface`      | 9.67:1  | 4.5:1 | AAA      |
| `--color-text-secondary`| `--color-surface`      | 7.07:1  | 4.5:1 | AAA      |
| `--color-text-muted`    | `--color-surface`      | 4.44:1  | 4.5:1 | **Fails 1.4.3** |
| `--color-text-faint`    | `--color-surface`      | 2.39:1  | 4.5:1 | **Fails 1.4.3** |
| `--color-accent`        | `--color-surface`      | 5.87:1  | 4.5:1 | AA       |
| `--color-accent`        | `--color-surface-card` | 6.29:1  | 4.5:1 | AA       |
| `--color-on-accent`     | `--color-accent`       | 6.29:1  | 4.5:1 | AA       |
| `--color-text-tag`      | `--color-surface-tag`  | 7.07:1  | 4.5:1 | AAA      |
| `--color-text-level-advanced`   | `--color-surface-level-advanced`   | 7.29:1 | 4.5:1 | AAA |
| `--color-text-level-proficient` | `--color-surface-level-proficient` | 8.88:1 | 4.5:1 | AAA |
| `--color-text-level-basic`      | `--color-surface-level-basic`      | 6.92:1 | 4.5:1 | AA  |
| `--color-focus`         | `--color-surface`      | 5.87:1  | 3:1   | Pass     |
| `--color-marker`        | `--color-surface`      | 1.86:1  | 3:1   | **Fails 1.4.11** |
| `--color-border-accent` | `--color-surface-card` | 1.49:1  | 3:1   | **Fails 1.4.11** (a contact pill's border) |
| `--color-rule`          | `--color-surface`      | 1.39:1  | —     | Carries nothing |
| `--color-border`        | `--color-surface`      | 1.15:1  | —     | Carries nothing |
| `--color-border`        | `--color-surface-card` | 1.23:1  | —     | Carries nothing |
| `--color-border-accent` | `--color-surface`      | 1.39:1  | —     | Carries nothing (the spine and dots) |

**Only the pairings above are verified.** Any other combination — an ink on a tint, the faint ink on
a card — is not to be used until it has been measured and recorded here. This is DDR-012's rule,
unchanged, and it matters more now that three of the inks are close to or below the line.

### Every pairing that now fails, and what it costs

* **`#64748b` on the page, 4.44:1, WCAG 1.4.3.** A company, an institution, a degree's thesis
  sentence and every contents link. The thesis and the institution are running text; the contents
  links are the page's only navigation. It is 0.06 short of the criterion, which makes it the
  cheapest of the four to a reader with normal vision and no less a failure for anyone else.
* **`#94a3b8` on the page, 2.39:1, WCAG 1.4.3.** The introduction's location and relocation line,
  every role's place, and from #96 the whole footer including its three addresses. At barely half
  the criterion this is the most severe row here: a reader with a mild contrast-sensitivity loss may
  not be able to read where the owner is or where each role was. What limits the damage is that
  every one of those facts is repeated elsewhere — the location is in the CV, and a role's place is
  not needed to understand the role.
* **`#a5b4fc` on the page, 1.86:1, WCAG 1.4.11.** The marker on a role's bullet points, which is
  what tells a point from a paragraph once the indent is a single step, and which prints. The list
  keeps its semantics, so a screen reader is unaffected; a sighted reader of the printed CV may see
  the indent and not the dot.
* **`#c7d2fe` on a contact pill's white, 1.49:1, WCAG 1.4.11.** The border of the three contact
  controls, which DDR-010 counted as one of the two non-colour cues that identify them. It is down
  to the icon, the shape and the fill.

The shadow's ink is not in this list: at 10% black it draws nothing that carries meaning, so no
criterion reaches it. It is recorded because DDR-020 chose otherwise and this record reverses that.

### Colour is never the only signal

DDR-012's rule, carried forward, and now doing more work than it was:

* **Links are underlined**, including the contents links, which the design draws without an
  underline. The underline stays: at 4.44:1 the colour is the last thing that should have to say a
  link is a link, and it is the one place this record does not follow the file. **Superseded by
  DDR-033**, which drops it on the contents links and says what identifies them instead.
* **A level badge contains its level as a word**, and a tag is text.
* **Metadata is smaller and elsewhere.** The three inks below the body's are told apart by size and
  position before colour, which is what carries the two failing ones.
* **A contact pill is its icon, its shape and its fill**, per the section above.
* **A hairline carries nothing** — except the contact pill's border, which now carries less than
  DDR-012 promised and is recorded as failing.

### Focus indicator

Unchanged from DDR-012 in everything but the value it inherits: 2px solid in `--color-focus`, offset
2px, applied with `:focus-visible`, an outline rather than a shadow so it survives forced-colours
modes. It follows the accent, so it is 5.87:1 on the page where DDR-012 measured 7.38:1 — still well
above the 3:1 WCAG 2.4.11 asks.

It is offset onto the page, so the page is the surface it is measured against, including around a
contact pill now that the pill itself is white. The contents bar #98 adds and the footer #96 adds
are both the page's own `#f8f7f4` in the design, so neither adds a pairing.

### Light only

Unchanged from DDR-012, and from DDR-002 before it. `color-scheme: light` stays on the root.

### On paper

Unchanged in mechanism, per DDR-015: every surface and every hairline is dropped at the token layer,
so no component writes a print rule to drop its own background or edge, and the sheet reads the same
whether or not the browser prints background graphics. What changes is the count — three hairline
tokens are dropped where one was.

The marker stays drawn, per DDR-019. It is the one mark on the page that carries something a reader
of paper needs, and it is now the one non-text mark the printed CV shows at all.

## Alternatives Considered

### Option A: keep DDR-012, DDR-019 and DDR-020 as they stand

Pros:

* Every pairing on the page meets WCAG 2.2 AA, which is what the original brief named as a hard
  constraint.
* No record has to be written that says the site fails four Success Criteria.

Cons:

* The owner has decided the design prevails. This is not a question left open; re-deciding it inside
  an implementation story is exactly what CLAUDE.md forbids.
* These three records are the largest remaining difference between the page and the file. Leaving
  them would leave Epic #70 unable to close.

### Option B: take the design's colours but keep a floor for anything that carries meaning

Pros:

* The two failures that cost a reader most — the faint ink and the pill's border — would be avoided,
  and the page would still take the accent, the muted grey, the hairlines and the shadow.

Cons:

* It is the same judgement DDR-012, DDR-019 and DDR-020 already made, applied a fourth time. The
  owner considered two narrower options on the Epic and chose the whole.
* A palette that is the design's except where it matters most is neither the design's nor
  conformant, and the next story would reopen it.

### Option C: take the design's colours and also take its shapes, so the timeline dot is drawn as
the file draws it

Pros:

* The one place where a colour decision and a shape decision are entangled would be settled at once.

Cons:

* The dot's ring and core are DDR-010's anatomy, not a palette value, and #93 is scoped to colour.
  Recording the measurement and leaving the shape is what keeps the two separable.

## Consequences

Benefits:

* The page is the design's in colour, node for node, which is what Epic #70 exists to achieve.
* Three inks below the body's where there was one, so a company, a place and a level's skills are
  told apart as the design tells them apart, rather than flattened into a single grey.
* Every hairline is named for what it draws, and the three values the design actually distinguishes
  are three tokens rather than one compromise between them.
* The failures are recorded, measured, and held by a test that names them. Nothing here is silent.

Tradeoffs:

* **Four pairings fail WCAG 2.2 AA**, two of them text. The site can no longer be described as AA
  conformant, and any claim to the contrary has to be corrected wherever it is made.
* Twenty-two colour tokens where DDR-012 had eighteen and DDR-002 had six.
* The accent drops from AAA to AA in both directions, so a later story that wants white text smaller
  than 13px on it has less room than it had.
* `--color-text-tag` is now a literal rather than a reference, so the two indigos have to be kept
  apart by hand; the test holds them apart.

Risks:

* **A reader with reduced contrast sensitivity loses information.** The faint ink at 2.39:1 is the
  sharpest edge of this. Everything it sets is repeated elsewhere, which is the mitigation and not a
  defence.
* **The pill's border no longer identifies the control.** A forced-colours mode restores a system
  border, and greyscale keeps the icon and the shape, so the realistic failure is narrow — but
  DDR-010's two-cue promise is down to cues this record has renamed rather than measured.
* **The floor is gone, so the next faint value has nothing to be compared against.** DDR-012's
  2.39:1 was the reference every later record reached for — DDR-019 and DDR-020 both did. The
  ordering test replaces it with a weaker rule: hairlines below inks. A value that wants to go
  lower still now needs a reason of its own.
* **#99 has not seen any of this.** The printed sheet was not measured on this story: the hairlines
  drop at the token layer as they did before, and the marker still prints, but the sheet count, the
  breaks and what comes back out of a PDF are that story's.

## Related Documents

* GitHub issue #93, which this decision resolves, and Epic #70, rewritten on 2026-09-17 around the
  owner's decision that the design prevails
* `career-site-design`, the Figma file every value here was read from
* DDR-012, the colour system this supersedes, and DDR-002 before it
* DDR-019, the bullet marker, and DDR-020, elevation, both amended here in their values alone
* DDR-021, the photo's shape and light, whose glow is now the accent's own hue
* DDR-010, which exempts bordered and filled controls from the underline rule
* DDR-015, which drops every surface and hairline on paper at the token layer, and GitHub issue #99,
  which rechecks the printed page against the adopted design
* GitHub issues #94, #96 and #98, which add the divider, the footer and the contents bar that
  `--color-border` and the faint ink are drawn for
* ADR-001, which puts every colour in the tokens, and ADR-006, which says which literals a component
  stylesheet may write
