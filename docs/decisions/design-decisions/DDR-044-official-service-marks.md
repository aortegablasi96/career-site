# DDR-044-Official Service Marks on the Contact Pills

Status: Accepted

Date: 2026-09-19

**Amends DDR-025 in two respects**: the palette gains two colours, `--color-mark-linkedin` and
`--color-mark-github`, and the accent no longer sets the LinkedIn and GitHub pills' icons, only
their labels. Every pairing DDR-025 records is unchanged, and the two it gains both pass.

Everything DDR-010 decides about a pill's icon being a redundant cue, DDR-029 about the labels,
DDR-035 about hover and focus, and DDR-043 about the new-tab arrow stands.

## Context

Epic #131 refines how the contents bar and the contact pills behave. Issue #135 is its fourth and
last story. Until now each contact pill carried a line drawing of ours: an envelope, and outlines
of LinkedIn's and GitHub's marks, stroked on a 24 unit grid in the pill's indigo. A visitor
recognises a service's own mark faster than a sketch of it.

The story asks for six things. LinkedIn's and GitHub's pills show each service's official mark, as
its brand guidelines allow. The UI Designer chooses the email pill's mark. Hover and focus still
change the pill visibly, and the mark stays legible in both states. Each mark stays a redundant cue,
so assistive technology still announces only "Email", "LinkedIn" or "GitHub". No pill grows and no
row of controls wraps where it did not. And each mark prints legibly, with the printed CV's sheet
count and breaks unchanged. The issue leaves one question to this record: does a mark keep its
brand colour or take the pill's ink?

That question is answered by the brands. LinkedIn's guidelines at brand.linkedin.com say the [in]
logo comes in three colours, blue, black and white, with blue on white preferred, and that its
colour and shape may not be modified. GitHub's at brand.github.com say the mark is used in white or
black ("in few cases grey or green"), and that its colour may not be changed. Neither allows the
pill's indigo. So the choice is between the brand colours and black for both. The owner chose the
brand colours on #135, and chose to keep the envelope for email.

## Decision

**The LinkedIn pill shows LinkedIn's [in] mark in LinkedIn blue, `#0a66c2`. The GitHub pill shows
GitHub's Invertocat in black, `#000000`. The email pill keeps its envelope in the pill's indigo.
Every label stays in the pill's indigo.**

* **The official shapes, not our drawings.** GitHub's mark is the path from
  `GitHub_Invertocat_Black.svg` in GitHub's own logo kit, drawn unchanged on its 98 by 96 grid.
  LinkedIn publishes the [in] mark as raster files only, so its path is the vector tracing that
  Simple Icons carries, on a 24 unit grid. Both are filled, as published, where the envelope, the
  download and the new-tab arrow remain our strokes. They stay inline SVG in `components/icon.tsx`,
  for the reason that file already gives: ADR-004's rule for binary assets is for photographs and
  video.
* **Each colour is a token**, per ADR-001. It is the service's colour, not a choice made for this
  palette, which is why each is named for its service rather than its role. The icon is still drawn
  in `currentColor`. The introduction's stylesheet sets that colour on the two marks only, through
  a class the component maps explicitly from the contact's `icon` key.
* **The envelope keeps the pill's indigo.** Email has no owner, so it has no mark. The address is on
  gmail.com, but Gmail's multicolour M would name a provider rather than an action, would be wrong
  the day the address moves, and would bring a third brand's rules onto the page.
* **Hover and focus leave the mark alone.** DDR-035's fill and border still change, and that is
  what shows the pill is under the pointer or focused. Recolouring the mark on hover is what both
  brands forbid, and neither mark needs it: LinkedIn's blue is 5.09:1 on the hover fill and GitHub's
  black is 18.78:1.
* **The [in] mark's letters are cut out of the square**, as the published mark's are, so they show
  what the mark sits on. That is the pill's white at rest and on paper, and DDR-035's pale indigo
  under the pointer.
* **Size and place are unchanged.** Each mark is 1em square, before the label, with the pill's
  `--space-small` gap. That is exactly the box the drawn icon had. Each mark stays `aria-hidden`.
* **Paper keeps both colours.** They are inks, so the print block, which drops every surface and
  hairline, leaves them alone, as it leaves the bullet marker.

| Pairing                          | Ratio   | Asked | Meets |
| -------------------------------- | ------- | ----- | ----- |
| LinkedIn blue on the pill's white | 5.69:1  | 3:1   | Yes   |
| LinkedIn blue on the hover fill   | 5.09:1  | 3:1   | Yes   |
| GitHub black on the pill's white  | 21:1    | 3:1   | Yes   |
| GitHub black on the hover fill    | 18.78:1 | 3:1   | Yes   |

`app/tokens.test.ts` holds all four.

## Alternatives Considered

### Both marks in black

Pros:
* One ink beside the indigo labels, so the row is quieter. Both brands allow black.

Cons:
* LinkedIn loses the blue that makes it recognisable at a glance, which is the reason for the
  story. LinkedIn names blue on white as its preferred form. The owner chose the brand colours.

### Both marks in the pill's indigo

Cons:
* Both brands forbid recolouring their marks. This is what the drawn icons did, and it is only
  possible because they were not the official marks.

### Gmail's mark on the email pill

Cons:
* It names the provider rather than the action, it would be wrong if the address moved, and it
  would bring Google's brand rules onto the page. The owner chose the envelope.

### The marks as committed image files

Cons:
* A request per mark, and an `<img>` cannot follow the text size as a 1em inline SVG does. Nothing
  about a mark needs a file: `components/icon.tsx` already holds inline SVG.

## Consequences

Benefits:
* Each profile pill shows the mark a visitor already knows, in the colour they know it in.
* No box moves. Swept every 10px from 300px to 900px and at 1280px and 1536px, at the default text
  size and at 200%, every pill's position and size is identical to the tree before, to 0.1px, in
  Edge. So no row of controls wraps anywhere it did not.
* The printed CV is six sheets in Edge and Firefox, with background graphics on and off, and its
  text is identical to the tree before. The only pixels that change are the two marks on sheet 1.
  Both print legibly, in their brand colours.

Tradeoffs:
* **The controls row now has three colours in it**, where it had one: indigo labels, the envelope
  and the CV fill, plus LinkedIn's blue and GitHub's black. That is the price of the official
  marks. It is the page's first colour taken from outside the design.
* **The two marks are filled and the envelope is stroked**, so the three contact marks are no longer
  one family of drawings. It is the difference between an official mark and a generic glyph.
* **LinkedIn's path is not LinkedIn's own file.** It is Simple Icons' tracing, because LinkedIn's
  downloads are raster. If LinkedIn publishes a vector, it should replace this path.

Risks:
* **Clear space was not measured against either brand's rule.** Neither brand page states a figure
  in text. On screen each mark has the pill's `--space-small` beside it. On paper the pill is
  inline and has no gap, so each mark prints directly against its label, as the drawn icons did
  before this change. If a brand asks for clear space, paper is where it would fall short.
* **Minimum size was not stated by either brand page.** Each mark is 1em, which is 13px beside a
  pill's label on screen.

## Related Documents

* Issue #135 and Epic #131
* DDR-010, which gives each pill an icon as a redundant cue
* DDR-025, the palette this amends; DDR-035, the pills' hover states; DDR-029, their labels
* DDR-043, the new-tab arrow that stays drawn in the pill's ink
* DDR-015, print
* ADR-001, which puts every colour in the tokens; ADR-004, on binary assets
* LinkedIn's [in] logo guidelines, brand.linkedin.com/in-logo; GitHub's logo guidelines,
  brand.github.com/foundations/logo
