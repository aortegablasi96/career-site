# DDR-003-Spacing and Layout

Status: Superseded

Date: 2026-09-10

Superseded by DDR-013, spacing and layout for the career page redesign. Only the layout changes:
the column is no longer the measure. This record's spacing scale, its three-level rhythm and its
choice of whitespace over rules to separate sections are carried forward there unchanged.

## Context

ADR-002 established a single scrolling page carrying four repeating content types: roles,
projects, skills, and credentials. There is no navigation between pages. A visitor finds their
way down the page by seeing where one section ends and the next begins, and on a page like this
that depends almost entirely on space: how far apart sections are, how far apart the items in a
section are, and how closely the lines of one item sit together.

Spacing is also where a small site most easily drifts. Every individual gap looks defensible when
it is written, and nothing shows that a dozen of them are slightly different. Issue #12 asks for
a fixed scale, so that a value either is on the scale or is not, and for the page's basic layout:
a content width, a gutter, and the rhythm between and within sections.

Until now the page has used the browser's default spacing: an 8px margin around the page, and
margins on headings, paragraphs, and lists that differ by element and are set in em, so each one
changes with its element's font size.

The constraints are:

* **ADR-001**: design values are CSS custom properties defined once at the root.
* **DDR-001**: text sizes are in rem, body text is 18px, and paragraphs are at most 65ch wide
  (`--measure`). Space should follow the same reader settings as the text it separates.
* **DDR-002**: colour is never the only signal, and a tinted surface behind a section would be a
  new colour decision. The border colour is 3.42:1, which DDR-002 noted may look heavy as a
  divider.
* **Issue #12**: section boundaries are perceivable without relying on colour or rules alone.
* **Accessibility**: text stays readable and unclipped when the browser font size is raised to
  200%, and the page does not scroll horizontally at 320px wide.

These are out of scope and decided elsewhere: how spacing changes across viewport sizes (#13),
print layout and page breaks (#14), the space that line height itself contributes (DDR-001), and
the internal composition of any specific section.

## Decision

### Scale

The scale has five named steps. The base unit is **1rem**, the browser's default font size, which
is 16px unless the reader has changed it. The other steps halve and double it, so each step is
twice the one below. The names follow the type scale's, with `medium` as the base.

| Token             | Size    | At the 16px browser default | Used for                                                          |
| ----------------- | ------- | --------------------------- | ----------------------------------------------------------------- |
| `--space-x-small` | 0.25rem | 4px                         | Lines that belong together in an item, such as a title and its metadata |
| `--space-small`   | 0.5rem  | 8px                         | Parts of one item, such as its metadata and its description       |
| `--space-medium`  | 1rem    | 16px                        | Between blocks of text; the page gutter                           |
| `--space-large`   | 2rem    | 32px                        | Between repeating items; list indentation                         |
| `--space-x-large` | 4rem    | 64px                        | Between major sections; above and below the page content          |

* **Space is in rem**, like the type scale. When the reader raises the font size, space grows with
  the text and the page keeps its proportions. No spacing is set in px. The focus outline stays in
  px, as DDR-002 decided, because it is a stroke rather than space.
* **Doubling keeps the levels apart.** How far apart two things are tells the reader how closely
  they are related. A difference of a quarter or a half between two levels is hard to see, and a
  doubling is not. Five steps is enough, because the page has five levels: lines within an item,
  parts of an item, blocks of text, items, and sections.
* **The scale is fixed.** A value that is not on it is added by superseding this DDR, not by
  writing a literal value. How the steps adapt across viewport sizes is decided in #13.

The owner chose this density, called Balanced when offered, from the three options set out under
Alternatives Considered.

### Vertical rhythm

Three tokens name the rhythm: which step separates what.

| Token             | Step              | Size | Separates                                                                 |
| ----------------- | ----------------- | ---- | ------------------------------------------------------------------------- |
| `--space-flow`    | `--space-medium`  | 1rem | Consecutive blocks of text: paragraphs, lists, and a heading and what follows it |
| `--space-item`    | `--space-large`   | 2rem | Repeating items within a section, such as two roles                       |
| `--space-section` | `--space-x-large` | 4rem | Major sections, one per content type                                      |

* **Each level is twice the one below.** Items are twice as far apart as the blocks within them,
  and sections are twice as far apart as the items within them. A heading is therefore always
  closer to what it introduces than to what came before it.
* **Sections are separated by whitespace and their heading, and nothing else.** There is no rule,
  border, or background. Four rems of space followed by an `h2` in the serif face at 28px is a
  boundary a reader sees without colour or a line. It survives greyscale, forced-colours modes,
  and printing without background graphics. The owner chose this over adding a rule.
* **The rhythm is named separately from the scale**, as DDR-002 names the focus colour separately
  from the accent. #13 and #14 can change how far apart sections are on a phone or on paper by
  changing one line, without editing a component.
* **Within an item**, the composition is not decided here. It uses the scale's two smaller steps,
  `--space-x-small` and `--space-small`, and the design of the first section that renders items
  decides where each applies.

### Layout

* **The page is a single centred column**, the `main` element.
* **The column is as wide as the measure.** `--content-width` is `var(--measure)`, 65ch, which at
  the default font size is about 580px. Every element shares one left edge and one right edge, so
  the page reads like a document, which suits a page that is also the CV. Because the width is in
  ch, it follows the font size, as the measure does. The owner chose this over a wider column.
  `--content-width` is its own token, even though it currently equals the measure, so the two can
  diverge later by changing one line.
* **The page gutter is `--space-medium`**, 1rem or 16px on each side, set by `--page-gutter`. It
  applies at every width, but it only shows where the viewport is narrower than the column and its
  two gutters, about 610px. On a 320px screen the column is 288px wide. Whether the gutter grows on
  wider screens is decided in #13.
* **The page content begins and ends with `--space-section`**, the same space that separates
  sections.
* **Lists are indented by `--space-large`**, 2rem, instead of the browser's 40px, which is not on
  the scale. It leaves room for bullets and for two-digit numbers.

### How the rhythm is applied

* **Space is set above an element, never below it.** The browser's default margins on headings,
  paragraphs, and lists are removed, and each block is given a margin above it from the scale.
  The gap between two blocks is then always the one the second block asks for, and margins never
  collapse into a value that is not on the scale.
* **The base styles apply the rhythm to plain HTML.** Within `main`, `header`, `section`,
  `article`, and `li`, each child after the first is set `--space-flow` below the one before. A
  `section` in `main` is set `--space-section` below whatever precedes it. Content therefore
  renders with the page's rhythm before any component exists.
* **Space between repeating items is applied by the component that renders them**, using
  `--space-item`. Whether an item is an `article` or a list item is part of a section's
  composition, and not decided here.
* **The spacing base styles have zero specificity**, through `:where()`, so a component's CSS
  Module class overrides them without a specificity contest.
* **Components use the tokens.** No component sets a literal margin, padding, or gap. Zero and
  `auto` are not lengths, and may be written directly.

### Where the system lives

* `app/tokens.css` holds the scale, the rhythm, and the layout tokens, defined once at `:root`.
* `app/globals.css` applies them to plain HTML: the page column, the removal of the browser's
  default margins, the rhythm between blocks and sections, and list indentation.

## Alternatives Considered

The first four options were offered to the owner.

### Option A: A rule above each section, as well as whitespace

A 1px line in the border colour above each section heading.

Pros:
* A stronger cue when scanning.

Cons:
* A second signal that the page does not need, given four rems of space and a heading.
* It uses the 3.42:1 border colour, which DDR-002 noted may look heavy as a divider.
* It adds a line to print, and a border-width token.

### Option B: Compact density

Sections 3rem apart, items 1.5rem, and blocks 0.75rem.

Pros:
* Closer to a printed CV, with more on each screen.

Cons:
* Paragraphs 12px apart are hard to tell from lines 9px apart, which is the leading of 18px text
  at a line height of 1.5.
* Density for paper is better decided in #14, which can tighten the rhythm for print without
  cramping the screen.

### Option C: Generous density

Sections 6rem apart, items 3rem, and blocks 1rem.

Pros:
* An airy, editorial page.

Cons:
* A long scroll on a phone. 96px between sections is about a sixth of a small phone's screen
  showing nothing.
* The levels are uneven: items are three times the blocks, and sections twice the items.

### Option D: A wider column, 45rem, with paragraphs still held to the measure

Pros:
* Room for headings and metadata to run wider, and later for dates beside titles.

Cons:
* Right edges vary from block to block, and the two widths are in different units, rem and ch, so
  their relationship changes with the font.
* It makes room for a composition no section has yet asked for. A section design that needs more
  width can supersede this DDR.

### A linear 4px or 8px scale, such as 4, 8, 12, 16, 24, 32, 48, and 64px

Pros:
* Familiar from design systems, and fine-grained.

Cons:
* Neighbouring steps differ too little to see, which invites choosing between 24 and 32 at random.
  That is the drift issue #12 exists to prevent.

### A scale derived from the body line height, as a baseline grid

A body line is 18px at a line height of 1.5, which is 27px or 1.6875rem.

Pros:
* Space lines up with the lines of text.

Cons:
* Awkward values, such as 1.6875rem.
* Headings, at a line height of 1.2, and small text break the grid anyway. CSS has no way to keep
  blocks on a baseline, so holding the grid takes constant correction.

### Space in em rather than rem

Pros:
* Space around a heading grows with the heading.

Cons:
* One token gives different space in different places, and the gap between two items depends on
  which element carries it. The browser's default margins are in em, and their inconsistency is
  what this decision replaces.

### Space in px

Pros:
* Fixed and predictable.

Cons:
* It does not grow when the reader raises the font size, so enlarged text becomes cramped.

### Fluid spacing with clamp() and viewport units

Deferred to #13, which decides how spacing adapts across viewport sizes.

### Scale steps only, without rhythm tokens

Pros:
* Three fewer tokens.

Cons:
* The space between sections would be written in every component that renders one, and #13 and
  #14 would have to find each place to change it.

### Margins on both sides, or gap in flex and grid containers

Pros:
* `gap` never collapses and needs no rule for the first child.

Cons:
* Margins on both sides collapse to the larger of the two, which is predictable only to someone
  who knows collapsing well.
* `gap` needs every container to be a flex or grid container, which is a layout choice for a
  component rather than for the base styles. Components may still use `gap` with the tokens.

## Consequences

Benefits:
* A small vocabulary: five steps, three names for the rhythm, a content width, and a gutter.
  Later work chooses from it instead of inventing values.
* Section boundaries come from space and headings alone, so they hold in greyscale, in
  forced-colours modes, and on paper.
* Space in rem follows the reader's font-size setting, and the column in ch follows the text.
* Content renders with the page's rhythm before any component exists, and a component overrides
  it without a specificity contest.
* #13 and #14 can adapt the rhythm in one place.

Tradeoffs:
* A doubling scale is coarse. There is nothing between 1rem and 2rem, or between 2rem and 4rem, so
  an item that seems to want 12px or 24px uses a step or supersedes this DDR.
* The column is narrow on a large screen, about 580px across a 1440px window. That is deliberate:
  the page is read, not scanned across.
* There are no rules between sections.
* Space between items is not in the base styles, so each component that renders items has to apply
  `--space-item` itself.

Risks:
* The rhythm was set against placeholder text. On a phone, 4rem above the page content and between
  sections may prove too much. #13 should check this with real content.
* On a 320px screen with the browser font size at 200%, the gutter doubles to 32px and the column
  narrows to 256px, around 14 characters of body text. Nothing overflows, but #13 should consider
  whether the gutter needs to stay small on narrow screens.
* The flow rule sets space above every child after the first in `main`, `header`, `section`,
  `article`, and `li`. A child that should have none, such as one positioned out of the flow, needs
  a component style to remove it.
* The column's width is in ch of the font on `main`. A component that changes the font size on
  `main` would change the column's width with it.

## Related Documents

* GitHub issue #12, which this decision resolves
* GitHub issue #2, Design Foundation
* ADR-001, which set the styling approach
* ADR-002, which established the single page, its four content types, and the page as the CV
* DDR-001, the typographic system, which sets the text sizes and the measure this layout follows
* DDR-002, the colour system, which rules out a tinted surface without a new decision and notes
  the border colour may look heavy as a divider
* GitHub issues #13 (responsive strategy) and #14 (print), which decide how this rhythm adapts to
  narrow screens and to paper
