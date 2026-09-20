# DDR-054-Every Technology on a Card

Status: Accepted

Date: 2026-09-20

**Amends DDR-051 in one respect**: a project card shows **every** technology the project states, in
the content's order, where DDR-051 showed the first four and counted the rest in a grey tag such as
"+2". Everything else DDR-051 decides stands unchanged — the card's picture, name, sentence,
surface, edge, radius, shadow, spacing, its one stretched link, the two-column grid, and how it
prints. The count's wording, `more` in `content/projects.ts`, and the `.more` rule that drew it are
removed with the cap.

## Context

Epic #152 turned the projects section into cards. DDR-051 took the design's card whole, including
the four-tag cap the layer `career-site-main` draws (node 58:938), on the reasoning that a card
needs only enough for a reader to choose a project.

Issue #163 reopens that one bullet. Of the four projects, **NumisBook and Digital Twin each state
six technologies**, so each card showed four and "+2": four facts behind a click, on the part of a
card a technical reader scans first. Stock Portfolio Viewer showed four and "+1". Only "This site",
with four, showed its stack whole.

The technologies are the fastest read of what the owner builds with, and each one is two or three
words. Hiding a third of them behind navigation costs more than it saves, and it leaves the card
disagreeing with the view it leads to, which lists every technology under "Built with".

The design's cap is a consequence of the frame it was drawn in: the design's card is 492px wide,
where the page's is 540px at the same viewport. Measured on this story, **all six tags fit one line
on the page's card at the design's width**, so on the page the cap hid facts without buying a line.

## Decision

A project card shows **every technology the project states**, as a tag, in the order
`content/projects.ts` states them. No card shows a count of technologies left out.

* The tags stay exactly as DDR-030 and DDR-017 set them: the tag tint, the tag ink, medium weight,
  the smallest step, `--letter-spacing-loose`, the small radius.
* The row still wraps, at the same 8px between tags each way, which is the gap the design leaves
  between two tags. A card whose tags need a second or third line takes one.
* The grid, the card's surface and every space around it are DDR-051's, untouched.
* Two cards in a row are grid items and stretch, so a card whose tags take an extra line raises the
  card beside it to the same height rather than leaving the row ragged.

**The count is removed, not hidden.** `Projects` no longer takes a `more` prop, `Projects` in
`content/types.ts` no longer declares one, `content/projects.ts` no longer states one, and the
`.more` rule that gave it the Basic badge's pairing is gone from `components/projects.module.css`.
A string nothing renders is a fact the site claims to say and does not.

### The difference from the design

At the design's width the section is `career-site-main` (node 58:938) in everything but the number
of tags: two cards to a row, the same picture, name, sentence, surface and spacing. The design
draws four tags and a count; the page draws six, six, five and four. That is the whole of the
difference this record accepts, and it is the difference #163 asks for.

## Alternatives Considered

### Keep DDR-051's cap of four and the count

Pros:

* Matches the design node for node.
* A card's height never varies with the length of a project's stack.

Cons:

* Two of the four cards hide two technologies each, for facts short enough to print on the card.
* The card and the view it leads to disagree about what the project was built with.
* It buys nothing at the design's width, where all six tags fit one line anyway.

### Raise the cap to six rather than removing it

Pros:

* Every project's stack fits today, and the card keeps a guard against a very long stack later.

Cons:

* Six is the longest list the content happens to hold, so the cap would be a number chosen to have
  no effect — a rule that does nothing until a content change silently starts hiding facts again.
* The count's wording and the `.more` rule would stay in the codebase for a case nothing exercises.

### Show every technology, but shrink or tighten the tags so they fit one line

Pros:

* The card's height never changes.

Cons:

* DDR-022's floor is 10px and a tag is already at it, so there is no smaller step to take.
* Wrapping is what the row was built to do, per DDR-051, and it costs a card one line at the
  narrower widths and nothing at the design's.

### Show the rest on hover or behind a disclosure

Pros:

* One line of tags at every width.

Cons:

* DDR-014 rules that nothing may depend on hover, and the card is already one link: a control
  inside it would be a second target over the stretched link.
* It is the click #163 exists to remove, spelled differently.

## Consequences

Benefits:

* No technology on the site is hidden behind a click. A card and its view agree.
* Three of the four cards gained tags: NumisBook and Digital Twin two each, Stock Portfolio Viewer
  one. Five technologies were hidden by the section before this; none is now. Three grey count tags
  go with them, so the section shows two more tags than it did, not five.
* Three strings and one CSS rule leave the codebase, and `Projects` takes one prop rather than two.

Tradeoffs:

* A card's height now varies with the length of its project's stack below about 560px, where the
  tags take more than one row. The row's other card grows with it, so the section below moves down
  by the taller card's growth and nothing else moves.
* The card differs from the design in the number of tags, deliberately.

Risks:

* **A new or longer technology changes how a card wraps.** The sweep below is the check to rerun.
  At 320px with text at 200% a card already takes six rows of tags.
* A project with a very long stack would make one card much taller than its neighbour's content
  needs. Nothing on the site approaches that today; a cap chosen for a real case is a later
  decision, not a precaution taken now.

### Measured on #163

Against the built page served locally, and against the tree this branched from, in Edge 153 and
Firefox 156.

* **At the design's 1195px, and at 1280px and 1536px: the page is exactly as tall as it was**, to
  the pixel, and every card is 540 by 458.5px with its tags on **one line**. Six tags fit the line
  that five filled. The section's top, the skills' top and the page height are all unchanged.
* **Nothing above the projects moves at any width**: the introduction's and experience's top and
  height are identical to the tree before at 320px, 390px, 894px, 1195px, 1280px and 1536px, at
  both text sizes.
* **Where the tags take an extra row the card grows by 28.5px** and the section below moves down by
  it: the page is 57px taller at 320px, 29px at 390px and 28px at 894px, and unchanged from 1195px
  up. At 200% text it is 285px taller at 320px, 57px at 390px, 114px at 894px and unchanged from
  1195px.
* **Two cards in a row are always the same height.** Checked wherever the wide layout applies —
  894px, 1195px, 1280px and 1536px at the default text size, and 1536px at 200% — both cards in
  each row match to the pixel.
* **Swept every 10px from 300px to 900px, and at 1195px, 1280px and 1536px, at the browser's
  default text size and at 200%** (128 measurements):
  * nothing scrolls sideways at any width or text size;
  * no tag's text is cut, and no tag passes its card's edge;
  * no pair of targets fails WCAG 2.5.8. The closest undersized pair is still the footer's two
    addresses at 27.2px, as it was before this story; at 200% every target clears 24 by 24 outright.
  * The tags take at most three rows at the default text size (320px) and at most six at 200%
    (300px and 320px).
* **Each project's view is unchanged.** Its built HTML is byte-identical to the tree before but for
  the build id, so "Built with" still lists every technology, in the same order.
* **Printed to A4 through WebDriver in Edge and Firefox, background graphics on and off**, and read
  back through pypdf and pdfium:
  * **five sheets in all four PDFs**, as DDR-051 measured, and the same breaks in both browsers:
    the section headings on sheets 1, 3, 4, 4 and 5, each with its first item, and all four cards
    on sheet 3;
  * no `+1` and no `+2` anywhere, where both were on the sheet before;
  * `Vercel`, `Cloudflare R2` and `FastAPI` are on the sheet, where no reading of the tree before
    found them;
  * no `https`, no `/projects/` address and no `mailto`;
  * no replacement character, and the apostrophes still U+2019;
  * every other word identical to the tree before — the only words gained are the eight tags, and
    none is lost.

## Related Documents

* Issue #163 and Epic #152
* DDR-051, the project cards, amended here in one respect
* DDR-050, the project view, whose "Built with" the card now agrees with
* DDR-030 (the tags' weight), DDR-017 (their tracking), DDR-022 (the type scale and its floor)
* DDR-027 (target sizes), DDR-014 (nothing scrolls horizontally from 320px, nothing depends on
  hover)
* DDR-015 and DDR-032, the printed CV, whose sheet count and breaks are unchanged
* ADR-002 and ADR-005, whose shared facts no technology tag moves
