# DDR-078-A Project View Says How the Project Was Built

Status: Accepted

Date: 2026-09-28

**Adds to DDR-050's introduction**: where a project says how it was built, its view shows that
between the description and "Built with", under a heading of its own. Everything DDR-050 decides
stands: the address, the way back, the name, the description's place and setting, the label above
the technologies, the links, the two columns and the lead picture. DDR-052's foot and DDR-053's
gallery are unchanged. It **adds no token**, and it supersedes nothing.

## Context

Since #153, per DDR-050, a project's view shows its name, then its full description, then "Built
with" and every technology. Each description said both what the project is and how it was built
with Claude Code.

On #229, part of Epic #152, the owner asked for each description to be the project's general
description from their knowledge base. They also asked for the entry's "AI-assisted product
development" section, where it has one, to follow the description, under a heading: "How I built
it". NumisBook and the Stock Portfolio Viewer have that section as one paragraph. The owner then
added one to the Digital Twin's entry: three paragraphs, with five phrases in bold. This site has no
entry, so the owner asked for its paragraph to be written in the same form, and its description now
keeps only its first sentence.

The story asked for the heading to have the same level and style as the view's other headings, such
as "Built with", with one `h1` and no skipped levels. It left the paragraph's setting and the space
around the two to the UI Designer.

## Decision

**The heading is an `h2` set exactly as "Built with" is, and each paragraph is set as the
description is. The heading and the first paragraph are spaced as "Built with" and its tags are.**
The owner's bold phrases stay bold. A project without the section shows neither.

| Property          | Value                                            | Why |
| ----------------- | ------------------------------------------------ | --- |
| Element           | `h2`, then one `p` per paragraph, after the description, before "Built with" | The view's outline becomes the project, how it was built and what it is built with. It has one `h1` and skips no level. |
| Heading's setting | `.label`: 10px bold capitals, tracked, in the faint ink | "Built with"'s own rule, so the two headings cannot drift apart. The capitals are drawn: the string is "How I built it". |
| Above the heading | `--space-large`, 32px                            | "Built with"'s own space from what is above it. |
| Below the heading | `--project-view-label-gap`, 12px                 | The space between "Built with" and its tags, so each label sits the same distance above what it names. |
| Paragraph         | The body's size, weight and ink, at `--line-height-prose` | It is running text like the description, and is set as the description is. |
| Between paragraphs | `--space-flow`, 16px                            | The column's own step between two paragraphs of running text. |
| Bold phrases      | `strong`, which DDR-023 sets semibold            | The owner's own emphasis, stated as the introduction's summary states its bold phrase, per #212: a part of the paragraph, not markup in a string. |
| Without the section | Nothing: no heading and no empty paragraph     | A heading over nothing is worse than no heading, as DDR-053 says of the gallery. Every project has the section today, so no view takes this branch. |
| Link preview      | The description alone                            | The meta and Open Graph description still say what the project is, not how it was built. |
| On paper          | Nothing changes                                  | A view does not print, and the page does not show a description. |

The heading's ink is the faint ink, which fails WCAG 1.4.3 at 2.39:1, per DDR-025, as "Built with"
already does. The heading adds no new pairing.

Measured on #229 in Edge, on all four views, at the browser's default text size and at 200%, every
10px from 300px to 900px and at 1195px, 1280px and 1536px (512 measurements):

* Nothing scrolls sideways, and no element reaches past the window.
* The heading is 32px below the description and 12px above its first paragraph, and the last
  paragraph is 32px above "Built with", at the default size; 64px, 24px and 64px at 200%. The
  Digital Twin's three paragraphs are 16px apart, 32px at 200%. "Built with" is the same distance
  from its tags as before.
* Each view has one `h1` and the two `h2`s in that order. The two headings' computed face, size,
  weight, ink, case and tracking are identical at every width.
* The page's markup is identical to the tree before, apart from its script and stylesheet links,
  so the printed CV is untouched.

## Alternatives Considered

### The paragraph under "Built with", as part of the technologies

Pros:
* One label covers everything about how the project was made.

Cons:
* "Built with" names a list of technologies. A paragraph under it reads as a caption to the tags,
  and the story asks for the section after the description.

### The heading in the section title's serif, as an `h2` on the page is

Pros:
* It would read as a heading at once.

Cons:
* The view's `h2`s are labels, per DDR-050 and DDR-053, and a serif heading between two of them
  would outrank "Built with" and the gallery for no reason. The story asks for the same style.

### No heading, the paragraph following the description directly

Pros:
* The shortest view.

Cons:
* The owner asked for the heading. Without it, two paragraphs of different kinds run together, and
  a screen reader's heading list would not show the section.

## Consequences

Benefits:
* A view says what the product is first, and how it was built second, under a heading a reader can
  find and skip.
* No new token, no new pattern and no new failing pairing, and paper is untouched.

Tradeoffs:
* Every view is longer: a heading and five to nine lines on a phone for NumisBook, the Stock
  Portfolio Viewer and This site, and three paragraphs of 15 lines for the Digital Twin at 390px.
* This site's description is now one sentence, about as long as its card's slogan. The card still
  leads to more, because the view's account continues under "How I built it".

Risks:
* The heading shares `.label` with "Built with". A change to that rule changes both headings, which
  is intended.

## Related Documents

* Issue #229 and Epic #152
* DDR-050, the project view, which this adds to
* DDR-053, the gallery, whose rule for an empty block this follows
* DDR-051, the project card, whose sentence #227 made the slogan
* DDR-025, the palette and its pairings
* ADR-005, the facts the site and the CV file share, none of which moved
