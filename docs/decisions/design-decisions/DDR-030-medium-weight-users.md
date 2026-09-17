# DDR-030-Medium Weight Users

Status: Accepted

Date: 2026-09-18

Amends **DDR-023's weight table**, and nothing else in it. The four pill controls join the
`--font-weight-medium` row, and the technology tags — which that row has always named — are now
actually set in it. DDR-023 keeps its two faces, its four weights, its one italic, its rule about
which elements take which face, and its seven files: no file is added, because DM Sans Medium has
been loaded since DDR-011 and two elements on the page already use it.

**It closes the last weight difference between the page and the design but one.** The contents links
are the exception, and they are left open deliberately: #98 replaces the contents row with the
design's sticky bar and rewrites `contents.module.css`, so the weight belongs to that story rather
than to a declaration that would be thrown away. This record names it so it cannot be forgotten.

It is two declarations and no token.

## Context

DDR-023 set the page in the design's faces, weights and styles, and its table says which elements
take which weight. Its medium row reads:

> | `--font-weight-medium`   | 500    | The positioning line, the contents links, technology tags          |

Measured against the page as #97 left it, that row is wrong in both directions:

| Element                 | The design                     | The page   | In DDR-023's row |
| ----------------------- | ------------------------------ | ---------- | ---------------- |
| The positioning line    | Medium                         | medium     | yes              |
| The CV control          | Medium (node 2:75)             | medium     | **no**           |
| The three contact pills | Medium (nodes 2:56, 2:62, 2:68)| **400**    | **no**           |
| Technology tags         | Medium (node 2:296)            | **400**    | yes              |
| The contents links      | Medium (node 2:10)             | **400**    | yes              |

So two elements the record names were never given the weight, and one element that has it was never
named. The CV control has carried medium since #48, from DDR-010's decision that the filled pill is
the page's one call to action; DDR-023 simply did not list it.

The gap was found on #97, which labelled the contact pills and recorded the weight as out of its
scope, since a weight is DDR-023's and not a label's. This record closes it.

**Nothing here is a new design decision.** The design and DDR-023 already agree on every row above.
What was missing was the declaration.

## Decision

**`--font-weight-medium` is the weight of a pill control's label and of a technology tag.** Two
declarations:

* `introduction.module.css` moves `font-weight: var(--font-weight-medium)` **out of `.cv` and into
  the `.contact, .cv` rule the two kinds of pill share**. The weight belongs to a control's label,
  and every control has a label, so it is written once for all four rather than once for the one
  that had it. The CV pill writes no weight of its own any more, and neither does the contact pill.
* `projects.module.css` adds `font-weight: var(--font-weight-medium)` to `.tag`.

DDR-023's medium row now reads: **the positioning line, the four pill controls, technology tags**,
and the contents links are removed from it until #98 sets them.

**The contents links stay at 400 for now.** The design draws them in Medium at node 2:10, and the
page will take it — from #98, which replaces that component with the design's sticky bar. Writing it
here would be a declaration in a file that story rewrites, and the sticky bar's own measurements
would have to be taken again anyway.

## Alternatives Considered

### Leave the contact pills at 400 and set only the tags

Pros:

* The smallest possible change, and the only one DDR-023's table asks for in writing.

Cons:

* It leaves three of the four controls in a row at one weight and the fourth at another, for no
  reason a reader could see, and leaves the page differing from the design at the one element #97
  had just touched.

### Set the contents links too, and close the table completely

Pros:

* DDR-023's table would be true in every row from this record onward, with no note carried forward.

Cons:

* #98 rewrites `contents.module.css` entirely. The declaration would be thrown away, and the two
  branches would collide over the same file for no lasting gain.

### Write the weight on `.contact` beside `.cv` rather than on the rule they share

Pros:

* Each kind of pill would state its own type, next to its own border and fill.

Cons:

* It is the same value written twice, and the shared rule already carries everything the two pills
  have in common — the box, the radius, the shadow, the size. The weight is one of those.

## Consequences

Benefits:

* The four controls are one weight, as the design draws them, and a tag is the weight DDR-023 has
  named for it since #91.
* A tag is the smallest text on the page, at 11px, and the extra stroke is where it does most good.
* DDR-023's table and the page agree, which they did not, and the one row that still differs says so
  and names the story that closes it.

Tradeoffs:

* **A tag row gains a line at six of the 61 widths swept.** Medium is about 1–1.5px wider per tag,
  which is enough to wrap one project's row at a width where it was already nearly full. The
  measurements are below. The row is built to wrap and none of the six is a width the design
  specifies — its frame is 894px, where no row wraps at either weight.
* One more element on the page now depends on `dm-sans-latin-500-normal.woff2`, which was already
  loaded and preloaded. No payload changes.

Risks:

* None found. The weight adds no token, no file and no pairing, changes no ink, and the print check
  below is identical to the tree this branched from in every reading.

## Measurements

Screen measured in Edge on the built page, at the browser's default font size and at double it,
against the tree this branched from.

### What did not change

At 320px, 360px, 390px and 1536px, at both text sizes: the controls row is the same height
(83.0px on a phone, 37.5px at 1536px; 340.0px and 73.0px at 200%), every pill is the same height,
the page has the same number of line boxes, and nothing overflows the viewport. Swept every 10px
from 300px to 900px at both text sizes, **no pair of targets fails WCAG 2.2's 2.5.8**, as before.

The pills grow by less than 2px each:

| Pill      | Before  | After   |
| --------- | ------- | ------- |
| Email     | 87.0px  | 87.8px  |
| LinkedIn  | 104.6px | 105.9px |
| GitHub    | 97.5px  | 98.3px  |
| Get my CV | 121.5px | 121.5px |

### What did change

A tag is about 1–1.5px wider — "Next.js" 51.7px → 52.7px, "PostgreSQL on Neon" 125.5px → 127.0px —
and at six widths out of the 61 swept that wraps one project's tag row onto one more line:

| Text | Width | Project                | Rows      | Page      |
| ---- | ----- | ---------------------- | --------- | --------- |
| 100% | 360px | This site              | 1 → 2     | +28px     |
| 200% | 310px | NumisBook, This site   | 4→5, 3→4  | +114px    |
| 200% | 420px | NumisBook              | 3 → 4     | +57px     |
| 200% | 570px | NumisBook              | 2 → 3     | +57px     |
| 200% | 690px | Stock Portfolio Viewer | 1 → 2     | +57px     |
| 200% | 710px | This site              | 1 → 2     | +57px     |

Every other width from 300px to 900px is unchanged at both text sizes, including 320px, 390px and
1536px. No paragraph, heading or list item reflows anywhere: only the tag rows move, which is the
one row on the page whose contents are laid out to wrap.

### Paper

Printed to A4 in Edge 153 and Firefox 156 with background graphics on, and printed again from the
tree this branched from. **Five sheets in both browsers either way**, and every reading identical
through pypdf and pdfium both: `mailto` nowhere, each address back once, "Email" and "LinkedIn" once
each, no replacement character, the apostrophe still U+2019.

Of the 479 distinct words the page shows in print, Edge gives back every one through both readers
and Firefox all but the same five as before — "Copilot-driven" and "data-driven" wrapped at their
hyphens, and the three level badges pypdf spells out at +0.1em. **No new word splits**, which is the
check this change needed most: DDR-018 blamed a weight above 400 for a split word, DDR-023 and
DDR-024 showed tracking was the cause, and a tag is the only text this record touches that is
tracked — at +0.025em, well below the +0.1em where the badge splits.

## Related Documents

* docs/decisions/design-decisions/DDR-023-typefaces-weights-and-styles.md — the record whose weight
  table this amends
* docs/decisions/design-decisions/DDR-024-label-tracking.md — why a weight above 400 is not what
  splits a word in a Firefox PDF, and what is
* docs/decisions/design-decisions/DDR-029-contact-pill-labels.md — the story that found this gap
* docs/decisions/design-decisions/DDR-017-letter-spacing.md — the tag's tracking, unchanged here
* docs/decisions/architecture-decisions/ADR-006-literal-values-in-component-stylesheets.md — why
  both declarations read a token
* Figma, `career-site-design`, nodes 2:50 (the four controls), 2:296 (a tag) and 2:6 (the contents
  bar, whose weight is #98's)
* GitHub issue #109, #98, and Epic #70
