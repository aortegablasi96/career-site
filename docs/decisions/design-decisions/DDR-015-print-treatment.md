# DDR-015-Print Treatment

Status: Accepted

Date: 2026-09-16

Supersedes DDR-005, the print stylesheet, and DDR-008, section openings in print.

**Amended by DDR-022 in one number**: the 11pt base below is now 12pt. This record chose 11pt so
that body text, then a 1rem step, printed at 11pt. DDR-022 takes the design's scale, where body text
is 0.9375rem, so the base had to move for that decision to keep its meaning; at 12pt body text
prints at 11.25pt and the smallest step at 7.5pt. Everything else this record decides is untouched,
and #99 prints the page for Epic #70 and may move the base again.

**Amended by DDR-032**, which printed the page Epic #70 finished and kept the 12pt base. Two things
here changed. A printed address may now break anywhere, because an unbreakable one made Edge shrink
the whole sheet to about 0.90. And the measurements under "Page breaks" are replaced: that shrinking,
not a line of the summary, is why Edge printed four sheets to Firefox's five. Both browsers now
print five sheets, broken in the same places. The contact pills row of the table under "What is
hidden" is also stale since DDR-029: a pill prints its label, and the footer prints the address.

**What carries forward from DDR-005**, unchanged in substance: paper is a medium rather than a
layout, so the tokens express the change wherever they can and the base styles add only what a token
cannot; the sheet's 2cm margins in a unit of the paper; the column filling the sheet and starting at
the left margin; running text held to the measure; the surface being the paper; browser headers and
footers left to the visitor; a link printing its address after it; an entry never split across two
pages; sections not forced onto new pages.

**What carries forward from DDR-008**, unchanged: each section holds its heading and its first item
in one block that print keeps whole, because Firefox ignores `break-after: avoid`. DDR-008 said the
block would have to be re-expressed for the redesign; it did not, because `components/section.tsx`
groups whatever the first item is and the redesign only changed what that item is.

**What does not carry forward**: DDR-005's 10pt base, its five-token print block, its acceptance that
a screen-only element is hidden by the component that renders it and nothing else, and its assumption
that one layout serves both the screen and the sheet. DDR-008's measured claim that Edge and Firefox
break the page in the same places does not carry forward either — with the redesigned page they no
longer do.

## Context

ADR-002 makes the page itself the CV, so what a browser prints, or saves as a PDF, is the document a
visitor takes away. DDR-005 designed that for the page as it was in September 2026: one column of
one entry anatomy, at DDR-001's scale, on DDR-002's surface.

Epic #42 replaced almost everything that treatment rested on. The page now has two typefaces and a
seven-step scale (DDR-011), a warm surface with five tinted surfaces on it (DDR-012), a 1100px
column instead of a 65ch one (DDR-013), a second breakpoint at which four sections lay out in
columns (DDR-014), a photograph, project media, a timeline with a decorative spine, level badges and
language cards (DDR-010). #52 goes last on the epic for the same reason #14 and #23 did: it treats
what every other story produces.

Three things were left open for this story, and each is settled below:

* **The type floor.** DDR-005 chose a 10pt base so that the smallest step of DDR-001's scale came to
  exactly 9pt, DDR-001's floor. DDR-011's scale reaches lower, so at the same base the tags and
  badges printed at 8.1pt. DDR-011 recorded the conflict and handed it here;
  `app/tokens.test.ts` has been holding both records to it so it could not be overlooked.
* **The multi-column layouts.** DDR-014 gives the components one width they may write,
  `min-width: 48em`. A sheet of A4 inside its margins is about 40em, and an em in a media query is
  the browser's default font size, which paper does not have — so that query never matches on paper.
  #49, #50 and #51 each left their section printing as a single column and named #52 as the owner.
  The UI Review on #43 is explicit that this is wrong: *"a sheet of A4 is wide, so the timeline
  layout prints."*
* **The printed photo.** DDR-005 predates it. `components/introduction.module.css` carried print
  rules of its own, placing the photo at 21mm where the UI Review asks for about 28mm.

The constraints are:

* **ADR-002**: the printed document is the same content, in the same order, as the screen. No
  print-only content.
* **ADR-001**: design values are custom properties defined once at the root.
* **DDR-010**: the print table in the UI Review on #43 — what each new element does on paper.
* **DDR-011**: the ligature and contextual-alternate rule that makes a saved PDF spell every word as
  the page does. #22 and #40 are the bugs behind it, and the guarantee has to be re-verified rather
  than assumed.
* **DDR-014**: a component may write one width and no other.

## Decision

### Paper is the wide surface

**A component that lays out in columns writes `@media (min-width: 48em), print`**, so the sheet gets
the layout the wide screen gets. The timeline prints its date column, the projects print their media
beside their text, the skill groups print two to a row, and the language cards print four across.

This is the change that pays for the rest. It is also the only honest way to express it: the width
alone cannot match on paper, and repeating each grid inside a print block would leave five pairs of
rules free to drift apart.

`components/stylesheets.test.ts` admits that query and no other variation. A component may still
write no width of its own, and `print` may be added only to the wide breakpoint — not to a width of
its own choosing.

**The introduction is the exception, and the reason is worth keeping.** Its wide layout gives the
photo a column of its own, which is right on a screen where the photo is 208px tall. On paper the
photo is 28mm, so a column of its own leaves three quarters of it empty and pushes the summary into
what is left. The UI Review asks for the photo *beside the name*, and that is the narrow layout: the
photo floats and the text runs past it. So the introduction keeps the float on paper, and print
writes no layout for it at all — only the size of the photo.

### Type: an 11pt base

`--root-font-size` is **11pt** in print, up from DDR-005's 10pt.

| Step | Role | On paper |
| --- | --- | --- |
| `--font-size-x-small` | Technology tags, level badges | 8.9pt |
| `--font-size-small` | Dates, places, bullet text, skills | 9.6pt |
| `--font-size-medium` | Body text, item titles | 11pt |
| `--font-size-large` | The positioning line | 12.4pt |
| `--font-size-x-large` | A section heading | 15.1pt |
| `--font-size-xxx-large` | The name | 33pt |

* **Body text prints at 11pt**, which is DDR-005's 11.25pt in all but rounding.
* **The smallest text is 8.9pt**, which is DDR-005's 9pt floor in all but rounding. The question
  DDR-011 handed to this story is answered by moving the base rather than by accepting 8.1pt or by
  giving paper a scale of its own.
* **It costs nothing.** Measured against the finished page, 10pt and 11pt print on the same number of
  sheets in both browsers. The larger base was free, which is what decided it.
* **The base is still a single value.** DDR-005's reasoning stands: one base keeps every proportion
  DDR-011 and DDR-013 set, where a second scale in pt would be a second thing to keep in step.

### Every tint is dropped at the token layer

The redesign has six surfaces where DDR-002 had one. In print, **every one of them becomes
`transparent`**: the page, the white card, the tag's tint, and the three level tints. So does
`--color-decoration`, which is the rule beside a section heading, the timeline's dot and line, and
the language card's edge. DDR-025 splits that one token into three — `--color-rule`,
`--color-border` and `--color-border-accent` — and paper drops all three, in the same block and for
the same reason. Nothing else here moves.

* **No component writes a print rule to drop its own background.** Before this record, three of them
  did, and a seventh surface would have needed a fourth. The statement "paper drops every tint" is
  made once, where the tints are defined.
* **Nothing is lost**, because every tint in the redesign repeats the word it holds, per DDR-010: a
  badge is still Advanced, a tag is still its technology, a card still holds its language and level.
* **No ink is touched.** Every text colour prints as it is, and each is darker on white paper than
  on the surface DDR-012 measured it against, so no pairing gets worse.
* **The sheet reads the same whether or not the browser prints background graphics**, which was
  DDR-005's rule and is now true of six surfaces rather than one.
* **The timeline's spine keeps its column** rather than being removed from the grid. It is not
  drawn, because its colour is transparent, but the date column stays where a reader of the screen
  would expect it. Removing the track would move the content into it.

What a component still writes in print is the space a box asked for once nothing draws it: a card's
padding, a control's target size.

### The photo prints at 28mm, in a unit of the paper

`--photo-size` is **28mm** in print, which is the measure the UI Review on #43 gives it.

It is written in mm because a photograph on a sheet is a size of the paper, as the sheet's own
margins are, rather than a multiple of the type. It is the narrow token because the introduction
keeps the float on paper, as above.

### A video does not print; its poster does

DDR-010 asks for one still per project on paper: the screenshot, or the video's poster frame. **A
`video` element cannot be that still.** Measured on #52 with a fixture, because no project carries a
video yet:

| Browser | What a `video` with a poster prints |
| --- | --- |
| Edge 153 | An empty box with a dead scrubber and `0:00`. No poster at all. |
| Firefox 155 | The poster, with the controls bar drawn across the bottom of it. |

Neither is acceptable — one loses the image, the other prints a control that cannot be used, which
is the thing the CV download is hidden for.

So **a project whose media is a video renders both the video and its poster as an image**, and
exactly one of them is displayed: the video on screen, the still on paper. Both carry the same
description, so the two forms say the same thing.

**This is not print-only content, and the distinction matters.** ADR-002 forbids the paper saying
something the screen does not. Here the paper says exactly what the screen says, in the only form
paper can carry it: the poster is the video's own still, described in the video's own words. The
rule this record sets is therefore narrow — **a component may render the same content in a second
form where the medium cannot carry the first, and may not add content the screen does not have.**

### What is hidden, and what prints

| Element | On paper |
| --- | --- |
| Profile photo | Prints at 28mm, beside the name |
| CV download control | Hidden. A download is dead on paper, and the paper is the CV |
| Contact pills | Their text, which is their address. Printed once, with no `mailto:` prefix |
| Contents | Hidden, as `nav` already was |
| Timeline spine and dots | Not drawn. The column stays, so the date column does not move |
| Dates and place | In the date column, as on a wide screen |
| Project media | The screenshot, or the video's poster as an image |
| Tags, badges, cards | Their text. Tints, fills and edges dropped |
| Other links | Their address after them |
| Every target size | Dropped. Nothing is tapped on paper |

### Page breaks, and what the browsers now do

*Superseded in its measurements by DDR-032*, which prints five sheets in both browsers and finds that
Edge's fourth came from shrinking the sheet, not from where a line ends. The rules below stand.

The rules are DDR-005's and DDR-008's, unchanged: an `article` or list item is never split, a
heading avoids a break after it, and each section's heading and first item sit in one block that
print keeps whole. A skill group and the row of language cards are kept whole by their own
components, since neither is an `article`.

Measured on the finished page, printed to A4 through WebDriver in **Edge 153** and **Firefox 155**,
reading the text back out of both PDFs:

| | Edge | Firefox |
| --- | --- | --- |
| Sheets | **4** | **5** |
| Section headings stranded at the foot of a page | 0 of 5 | 0 of 5 |
| Items split across two sheets | 0 of 18 | 0 of 18 |
| Replacement characters in the PDF's text | 0 | 0 |

**The page is four sheets in Edge and five in Firefox**, down from six in both before this story.

**The two browsers no longer agree on the total, and that is a real loss.** DDR-008 measured them
into agreement and counted it as a benefit. The cause is not a break rule: Firefox sets the
introduction's summary one line longer than Edge does, which pushes the second role past the foot of
page 1, and `break-inside: avoid` then moves the whole role rather than splitting it. Every rule
behaves identically in both; the browsers simply disagree about where a line ends. It was not worth
tuning the design around, because a single edited word would move it back.

## Alternatives Considered

### Option A: Keep the single-column print layout, and only fix the type

Pros:
* The smallest change. No component stylesheet is touched.
* The print layout stays the one that was measured on #14 and #23.

Cons:
* It contradicts the UI Review, which says the timeline layout prints because a sheet is wide.
* It wastes the sheet. The date column, the project media beside the text, two columns of skills and
  a row of cards are what took the page from six sheets to four.
* The reader of the printed CV would get a document that does not look like the site.

### Option B: Repeat each grid inside each component's own print block

This is what `components/introduction.module.css` did before this story.

Pros:
* No change to `components/stylesheets.test.ts`, and each block says plainly what paper does.

Cons:
* Five pairs of rules saying the same thing, free to drift apart. The introduction's pair had
  already drifted: the screen used one photo token and the sheet another.
* A change to a layout would have to be made twice, and nothing would fail if it were made once.

### Option C: Lower the wide breakpoint so that a sheet matches it

Pros:
* No query variation. `min-width: 48em` would simply be true on paper.

Cons:
* A sheet of A4 inside its margins is about 40em, so the breakpoint would have to move to about
  38em — changing the screen layout for every phone-sized and tablet-sized viewport in order to
  change the paper.
* It would make a paper problem into a screen decision, which is exactly backwards.

### Option D: Keep the 10pt base and accept 8.1pt tags and badges

Pros:
* The densest option, and the one that changes nothing.
* DDR-011's own argument for a 13px screen floor — short, repeated labels, redundant with their
  surroundings — transfers to paper.

Cons:
* 8.1pt is small in print in a way 13px is not on screen: a reader cannot enlarge a sheet of paper.
  DDR-005's floor existed for that reason.
* It was measured to cost nothing to fix. An 11pt base prints on the same number of sheets.

### Option E: A print scale of its own, in pt

Pros:
* Each size could be tuned for paper independently.

Cons:
* DDR-005 rejected this and the reason still holds: a second scale is a second thing to keep in step
  with the first, and the base does the whole job with one value.

### Option F: Print the video element and accept what browsers do with it

Pros:
* No second element, and no question about ADR-002.

Cons:
* Edge prints no poster at all — the project loses its image entirely.
* Firefox prints a controls bar across the still, which is a dead control on paper.

### Option G: Give the introduction the wide layout on paper too, for consistency

Pros:
* One rule for every section: paper is the wide surface. Nothing to remember.

Cons:
* At 28mm the photo is short, so its column is three quarters empty and the summary is pushed into
  what remains.
* The UI Review asks for the photo beside the *name*, which is what the float does and what the grid
  does not.

## Consequences

Benefits:
* **The printed CV is four sheets in Edge and five in Firefox, down from six.** The layout that made
  the screen scannable makes the sheet shorter.
* The printed document now looks like the site: the same timeline, the same rows, the same columns.
* Paper's layout cannot drift from the wide screen's, because it is the same rule.
* "Paper drops every tint" is one statement in one place, and a seventh surface would be covered by
  it without a new print rule.
* Body text at 11pt and the smallest text at 8.9pt restore the proportions DDR-005 chose, under a
  scale it was not written for.
* A project's video prints as a picture rather than as a dead control or an empty box.
* Every word in a PDF saved from either browser is the word the page shows, with no replacement
  characters — DDR-011's guarantee, re-verified rather than assumed.

Tradeoffs:
* **Edge and Firefox no longer print the same number of sheets.** DDR-008 had them agreeing; they
  agree on every break rule and disagree on where a line of text ends.
* A component now has two things to know about paper: that its wide query includes `print`, and what
  its own print block still has to say.
* The introduction is an exception, and an exception is a thing to remember.
* A project with a video carries its poster twice in the markup, and a browser may fetch the file
  for the hidden element as well as the shown one. It is the same file either way.
* `@media (min-width: 48em), print` reads less plainly than two separate blocks, and a reader has to
  know that the width never matches on paper.

Risks:
* **Page breaks depend on how much content there is.** They were measured against the finished page;
  they should be measured again when the amount of content changes, and the real photograph and
  project pictures on #63 do not change it, because the stand-ins are already the full box.
* **The browsers' disagreement is one line wide.** An edit to the introduction's summary could move
  Firefox to four sheets or Edge to five.
* **The video treatment is unmeasured against a real video**, because no project has one. The
  fixture on #52 measured what browsers do with a `video`; #63 should confirm the poster prints when
  the file lands.
* **Browsers change how they print.** As DDR-005 said, a print change should be checked in both
  Edge and Firefox, and the check should read the text back out rather than look at the page.

## Related Documents

* GitHub issue #52, which this decision resolves, and Epic #42, the redesign
* DDR-005, the print stylesheet, and DDR-008, section openings in print, which this record supersedes
* GitHub issues #14 and #23, which produced them, and #24, whose checks found the Firefox limitation
* The UI Review on #43, whose print table this implements, and DDR-010, which records its structure
* DDR-011, whose scale reaches below DDR-005's floor and which handed the question here
* DDR-012, whose surfaces this drops and whose inks it leaves alone
* DDR-013, whose rhythm the single base keeps in proportion
* DDR-014, whose one permitted width this extends to paper, and no further
* ADR-002, which makes the page the CV and forbids print-only content
* ADR-004, which prepares each binary asset once, by hand, and GitHub issue #63, which supplies the
  real ones
* GitHub issues #22 and #40, the Firefox PDF faults whose guarantee this re-verifies
