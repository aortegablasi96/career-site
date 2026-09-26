# DDR-056-The Introduction Greets the Visitor and Marks the Location

Status: Accepted

Date: 2026-09-26

**Supersedes in part DDR-010**, in the introduction's text column. DDR-010 sets it, top to bottom,
as the name, the positioning line, "the location and relocation note", the summary, "the
availability sentence" and the controls. This record adds a greeting before the name, marks the
location with a symbol, and removes the relocation note and the availability sentence. The summary
is one paragraph where it was two. DDR-010's bullet "Availability is text, not a badge" goes with the
sentence it was about.

The photo, the positioning line, the four controls and everything DDR-021, DDR-040 and DDR-044
decide about them are untouched. So is #68's rule that the name moves below the photo rather than
being squeezed beside it. This record extends that rule to the greeting.

## Context

Epic #170 reworks the page's content from the owner's knowledge base. On #171 the owner asked for
three changes to the introduction:

* "Hi there, I'm" before the name, in smaller type;
* the description from their knowledge base in place of the introduction's paragraphs;
* no "Open to relocation", and a location symbol beside the place.

The owner approved the paragraph's wording on #171. It replaces both paragraphs: the summary of the
roles, which the experience section already gives, and the availability sentence. The words are the
owner's; this record decides how the greeting and the symbol are drawn.

The owner chose on #171 that the greeting is on screen only. The page is also the printed CV, per
ADR-002 and DDR-015, and a CV opens with the name.

## Decision

The introduction's text column is, top to bottom:

1. the greeting and the name, as one `hgroup`;
2. the positioning line;
3. the location, after a map pin;
4. one paragraph, the owner's own description;
5. the four controls.

### The greeting

* **It is a paragraph of its own, before the `h1`, not part of the heading.** The heading, the
  page's outline and the page title still carry the name alone. A screen reader meets "Hi there,
  I'm" and then the heading "Andreu Ortega Blasi", in reading order and once each.
* **The greeting and the name are one `hgroup`**, which is HTML's element for a heading and the
  words that go with it. The group carries #68's rule, `display: flow-root` with
  `min-inline-size: min-content`, which was on the `h1` before. So below the wide breakpoint the
  two are beside the photo or below it together, never one on each side of it.
* **DM Sans at 400, at `--font-size-large`, in `--color-text-secondary`.** That is the positioning
  line's size, and at the wide breakpoint about a third of the name's. The secondary ink is 7.07:1 on
  the band and passes WCAG 1.4.3. It is not the accent, so the positioning line under the name stays
  the one accented line. It is not Lora, which DDR-023 keeps for `h1` and `h2`.
* **It is `--space-x-small` above the name**, which is closer than the flow step, so the two read as
  one sentence.
* **It is hidden on paper**, by the introduction's own print block, per DDR-015's rule that a
  component hides its own screen-only elements. The print block also puts the name's margin back to
  0, so the printed CV opens with the name exactly where it did.

### The location

* **The line is the place alone**, "Lugano, Switzerland", after a map pin. The metadata line keeps
  its size and its faint ink, per DDR-025.
* **The pin is a line drawing in `currentColor`, at 1em**, like the CV control's download mark and
  the project view's chevrons, in `components/icon.tsx`. So it takes the line's own ink and grows
  with the text. It is centred on the line, `--space-x-small` from the words.
* **It is hidden from assistive technology**, like every mark on the site, because the words beside
  it say the same.
* **It prints.** The pills' marks print too. The pin is the same content in the same form, not
  print-only content.

### The paragraph

The owner's description is the introduction's one paragraph. It keeps the summary's 680px measure,
its prose leading and the design's space above it and above the controls, per DDR-038 and DDR-040.

## Alternatives Considered

### The greeting inside the `h1`

Pros:
* The name and greeting are one element, so they can never come apart in the layout.

Cons:
* The page's one heading would read "Hi there, I'm Andreu Ortega Blasi". Anyone moving through the
  page by headings, and the outline, would be handed a greeting instead of a name.
* Hiding the greeting on paper would hide part of a heading, and its size would be a rule for the
  inside of the `h1`.

### The greeting as a paragraph, with #68's rule left on the `h1` alone

Pros:
* The smallest change: one paragraph and no wrapper.

Cons:
* Measured in Edge on #171, it pulls the greeting and the name apart. A paragraph wraps around a
  float line by line, so the greeting stayed beside the photo whenever it fitted, while the name
  dropped below the photo under #68's rule. At a 320px viewport with a classic scrollbar, the
  greeting sat beside the photo with the name below it. With text at 200% at 320px, 360px and
  390px, it stood one word to a line beside the photo, with the name below.

### The greeting in the accent, or in Lora

Pros:
* Either would tie the greeting to the name, or to the positioning line, more strongly.

Cons:
* The accent would give the introduction two accented lines, one above the name and one below it,
  and the positioning line would stop being the one line the colour points to.
* Lora is DDR-023's face for `h1` and `h2` alone, and a paragraph in it would amend that rule for
  four words.

### The greeting on paper too

Pros:
* The printed page would say exactly what the screen says.

Cons:
* A CV opens with the name. The owner chose screen only on #171.

## Consequences

Benefits:
* The introduction opens with a greeting and says, in the owner's own words, what they build and
  how they like to work, where it summarised roles the experience section gives in full.
* The introduction is shorter at every width. Measured in Edge against the tree before, with a
  classic scrollbar, the controls end 246px higher at 320px, 195px higher at 390px, 117px higher at
  1280px, and 689px to 853px higher at 320px to 390px with text at 200%. At 390 by 844 they end 687px down.
* In every case measured, the name keeps its lines and its place: beside the photo, or below it
  where #68 put it before.
* The printed CV is five sheets in Edge and Firefox, as it was, with every section heading on the
  sheet it was on. It opens with the name on the same row as before.

Tradeoffs:
* The page no longer says the owner is open to a conversation, or to relocating. That is the
  owner's content decision on #171, and DDR-010 had called availability "the one message the page
  most needs read".
* At a full 320px of content with the browser's default text size, the greeting and the name sit
  beside the photo. With a classic scrollbar, which leaves 305px, both sit below it, where the name
  alone did before.

Risks:
* The pin is in the location's faint ink, at 2.39:1. It is decoration and says nothing the words do
  not, so it carries no meaning a reader could lose, but it is as faint as the line it marks.
* A longer greeting, or a larger step for it, changes where the group fits beside the photo.
  Recheck #68's cases at 320px, 360px and 390px, at the default text size and at 200%.

## Related Documents

* DDR-010 — the career page structure, which this supersedes in part.
* DDR-015 — print, and the rule that a component hides its own screen-only elements.
* DDR-021 and DDR-040 — the photo beside the name.
* DDR-023 — which elements take Lora.
* DDR-025 — the location's faint ink.
* DDR-038 — the summary's prose leading.
* ADR-002 and ADR-005 — the page is the CV, and the facts the CV file shares.
* Issue #171, its UI Review, and parent Epic #170.
* Issue #68 — the name beside the photo at enlarged text.
