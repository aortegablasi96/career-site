# DDR-051-Project Cards

Status: Accepted

Date: 2026-09-19

**Supersedes, in part, DDR-010's projects pattern**: its media-and-text row, with the media beside
the name, the technologies, the full description and the labelled links. Each project is now a card
that leads to its view, which DDR-050 designs. The rest of DDR-010's projects section stands: a
project is still an `article` with its name as an `h3`, technologies are still tags, a project with
a video still has a poster still, and the draft's gradient placeholders are still not adopted.

**Amends DDR-023 in one respect**: a project card's name is set in Lora, as the design draws it.
Every other item title stays in DM Sans. No file is added, because Lora SemiBold is already loaded
for `h1` and `h2`.

**Amends DDR-015 and DDR-032 in one respect each.** DDR-015's table of what prints loses its
project row: the printed CV shows each project as its card, with no source or live address. DDR-032
measured five sheets. The CV was six since DDR-037 and is now five again, in both browsers and
broken in the same places. The measurements are below.

## Context

Epic #152 reworks the projects. #153 gave each project a view of its own. Issue #154 turns the
projects section into cards that lead to those views, as the layer `career-site-main` in the Figma
file `career-site-design` draws it (node 58:938). The owner chose on #152 that the printed CV
follows the design, so paper loses each project's addresses and its full description.

DDR-010's row was designed for a page that was the site's only page. It had to carry everything
about a project: the full description, every technology and the links out. With a view per project,
the page needs only enough for a reader to choose one.

The owner decided four things on #154:

* **The card sentences**: the four the design proposes, each supported by the full description.
* **The picture's shape**: the design's 16:9, cropped in CSS from the 4:3 files rather than
  re-exported, as the view crops them to 16:10.
* **The name's face**: Lora, as drawn, which amends DDR-023.
* **The count's ink**: the Basic level badge's `#475569` on the design's grey, at 6.92:1. The
  design's `#64748b` is 4.34:1 there and fails WCAG 1.4.3.

## Decision

### The card

Each project is an `article`, in the content's order. From the top:

1. **The picture**, as wide as the card, at 16:9 and cropped from the centre (`object-fit: cover`),
   with its upper corners at the card's radius. A project whose media is a video shows its poster
   still, described in the video's words. The video's controls would sit under the card's link and
   could not be used, and the view is where it plays.
2. **The name**, the card's `h3`, in Lora SemiBold at the item title's 15px, on a 1.5 line.
3. **One sentence**, `summary` in `content/projects.ts`, in the muted ink at 13px on the small prose
   leading. It runs the card's width rather than stopping at the measure.
4. **At most four technology tags**, in the content's order, then a grey tag counting the rest,
   such as "+2". A project with four or fewer shows no count. The count's wording is `more` in
   `content/projects.ts`. The first four are chosen by order, so the content's order is also which
   four a card shows.

The card is a language card's surface: white, a 1px `--color-border` edge, `--shadow-raised` and
`--radius-large`. The design draws a 16px radius and a shadow of its own. DDR-013 has three radii
and DDR-020 one elevation, and a card is what both were written for.

The card is a **flex column**, not a grid of one track. In Firefox, a grid row was sized from the
picture's natural 420px height rather than its drawn 16:9 height, which left 117px empty under
every picture, on screen and on paper.

### One link per card

The whole card is one link, and the link is the name. The link's `::after` is stretched over the
card, which is `position: relative`. So:

* A pointer anywhere on the card opens the view, including over the picture.
* The card is one stop in the tab order.
* A screen reader announces the link by the project's name alone, not every word on the card run
  together. The picture keeps its alternative text and sits outside the link, and the sentence and
  tags are read after the name as a paragraph and a list.

Keyboard focus outlines the whole card, not the name. The link's own outline is removed, and the
`::after` draws the site's focus outline. On hover and focus the name takes the accent, as a
contents link and the view's way back do, per DDR-035. The name has no underline: the card is what
identifies the link.

The link is a `next/link` to `/projects/<slug>` without prefetching, per ADR-010. It opens in the
same tab, since it is a page of this site.

The "+2" tag is read as "plus 2". It sits in a list of technologies, so it reads as a count of more
of them without extra hidden text. A visually hidden phrase would need an element taken out of the
flow, which `components/stylesheets.test.ts` admits only for a pseudo-element.

### The grid

The page hands the section **two cards at a time**, as it hands the skills two groups, because the
two columns must be one grid and the section keeps its heading with its first item on paper, per
DDR-008. `projectRows` in `components/projects.tsx` splits them.

* Below the wide breakpoint a row is one column: the cards stand one after another, full width.
* From the wide breakpoint, and on paper, a row is two equal columns.
* The cards are the design's 20px apart each way. The second row is the section's child, so it
  names `section > .row` to take the 20px rather than the section's item step. Inside a card the
  text is 20px from the edge, and the tags are 20px below the sentence. 20px is on no step of
  DDR-013's scale, so it is a token of the cards' own, `--project-card-space`, as the view's 24px
  and 12px are.

### Paper

A card prints as it shows: the picture, the name, the sentence and the tags shown. The token layer
drops its fill, edge and shadow, per DDR-015. The picture is rounded all round, because the card
around it is not drawn. The text keeps only the space above it. The link's `::after` is put out,
so the base styles print no address after it and nothing is stretched over the card. A row is kept
whole.

## Alternatives Considered

### Keep DDR-010's row and add a link to the view

Pros:

* Nothing moves on paper, and the page keeps every word it had.

Cons:

* The section stays the long block Epic #152 exists to shorten, and repeats most of the view.
* It is not the design the owner drew and chose on #152.

### Make the whole card an `<a>` element

Pros:

* Needs no stretched pseudo-element and no positioned card.

Cons:

* The link's accessible name becomes the picture's description, the name, the sentence and every
  tag run together, which #154 rules out.
* A heading inside a link is announced inconsistently across screen readers.

### Keep the name in DM Sans, per DDR-023

Pros:

* Every item title stays in one face.

Cons:

* The design sets the card name in Lora, and the owner chose the design on #154.

### Use the design's `#64748b` on the count

Pros:

* Matches the design.

Cons:

* 4.34:1 fails WCAG 1.4.3, and the page already has a passing pairing on the same surface. The
  owner chose the passing pairing on #154.

### Supply new 16:9 files rather than crop in CSS

Pros:

* The owner frames each picture for the card.

Cons:

* Four more files to keep, and the view's 16:10 would want four more again. The CSS crop loses
  12.5% at the top and bottom of each 4:3 file, and the owner chose it on #154.

## Consequences

Benefits:

* The section is scannable at a glance, and each card leads to its project's full story.
* The printed CV is a sheet shorter: **five sheets in Edge and Firefox**, where `main` printed six.
  The projects fill sheet 3 on their own, and the footer is back on sheet 5 with Languages. Section
  headings fall on sheets 1, 3, 4, 4 and 5 in both browsers. On `main` they were on 1, 3, 4, 5
  and 5.
* The printed CV carries no project address, so the long repository URLs that once made Edge shrink
  the sheet, per DDR-032, are no longer on it.

Tradeoffs:

* The page no longer shows a project's full description, its links or every technology. They are
  on the project's view, one click away, and not on paper at all.
* A card name in Lora is the one `h3` in the serif.
* The picture loses its top and bottom eighth on the card. The view crops it differently, at 16:10.
* Text on a card cannot be selected by dragging, because the link covers it.

Risks:

* A project whose media is a video shows only its poster on the card. Nothing on the card says it
  is a video, although the design draws a play icon. When the first video lands, whether to mark it
  is a decision.
* **The project view has the same Firefox fault the cards had.** Its figure is a grid of one track,
  and Firefox leaves 101.75px empty between the lead picture and its caption at 1195px. That is
  #153's, and it is recorded here because it was found here.
* A longer name, sentence or tag changes how a card wraps. Rerun the sweep below.

### Measured on #154

Against the built page served locally.

* **At 1195px**: two cards 540px wide, 20px apart each way, each 458.35px tall with a 538.4 by
  302.85px picture. The name is Lora 15px on 22.5px. The design's cards are 492px, because its
  column is 1004px where the page's is 1100px.
* **Swept every 10px from 300px to 900px**, at the browser's default text size and at 200%:
  * nothing scrolls sideways;
  * nothing inside a card passes the card's edge;
  * no card is narrower than 253px or shorter than 348px, and two cards are never less than 20px apart, so every
    target clears WCAG 2.5.8's 24 by 24 outright.
  * One column below the wide breakpoint: at the default size up to 760px, and two columns from
    770px. At 200% text, one column at every width swept.
* **Keyboard**: Tab reaches the four cards in order, one stop each, then the footer. Each shows the
  outline around the whole card, and Enter opens the view. **Pointer**: a click on the third card's
  picture opens its view, and hovering it turns the name the accent.
* **Accessibility tree**: each card is an article with an image, a level-3 heading holding one link
  named by the project, a paragraph, and a list of tags.
* **Printed to A4 through WebDriver in Edge and Firefox, with background graphics on and off**,
  and read back through pypdf and pdfium:
  * five sheets in all four PDFs;
  * the same breaks in both browsers, with the four cards all on sheet 3;
  * no `https` and no `/projects/` address anywhere;
  * no replacement character;
  * every sentence back whole, every tag shown back, and "+2", "+2" and "+1";
  * no technology a card leaves out.
  * Against `main`, the only words gone are the full descriptions', the link labels, the
    addresses and the three technologies no card shows. The only words gained are the sentences'
    and the counts.
  * In Edge under print media at 643px, nothing is wider than the sheet, so it does not shrink.

## Related Documents

* Issue #154 and Epic #152
* DDR-010, whose projects pattern this supersedes in part
* DDR-050, the project view the cards lead to, and ADR-010, its route
* DDR-023, amended for the card's name
* DDR-015 and DDR-032, the printed CV, amended for its projects and sheet count
* DDR-013 (radii and scale), DDR-020 (elevation), DDR-025 (colour), DDR-027 (targets), DDR-030 (the
  tags' weight), DDR-035 (hover), DDR-038 (leading)
* ADR-005, whose shared facts no card sentence moves
