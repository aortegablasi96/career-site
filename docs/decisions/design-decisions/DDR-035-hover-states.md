# DDR-035-Hover States

Status: Accepted

Date: 2026-09-18

**Supersedes in part DDR-010**: the sentence under "Links and controls" that says "Hover thickens the
underline rather than changing the colour, so no state depends on hue". That hover was never built,
and the design does the opposite. The rest of the bullet — links are underlined, and focus keeps
its outline — stands.

**Amends DDR-025 in two respects**: the palette gains five colours, and the pairings it records as
failing WCAG go from four to six. Everything else DDR-025 decides stands, including the underline
rule for every link that still has one. DDR-012, which carried the same hover sentence as DDR-010,
is already superseded by DDR-025 and is not touched.

It answers the item DDR-033 left open: a contents link's hover state.

DDR-014's rule that nothing depends on hover is **not** touched, and this record keeps it.

## Context

Epic #70 closes the gaps between the page and the Figma design. On 2026-09-17 the owner decided that
the design prevails everywhere, including over records written to protect WCAG conformance. Issue
#115 is this one.

Nothing on the page had a hover state. The page's calls to action — the three contact pills and the
"Get my CV" control — gave a pointer no sign that they would respond. `career-site-design` is a
static frame and draws no states. The Figma Make file (`src/App.tsx`) draws five:

| Element         | Make file                                                                   |
| --------------- | --------------------------------------------------------------------------- |
| Contact pill    | `hover:bg-[#eef2ff] hover:border-[#a5b4fc] transition-colors`               |
| CV control      | `hover:bg-[#4338ca]`                                                        |
| Contents link   | `hover:text-[#4f46e5] focus-visible:text-[#4f46e5]`                         |
| Project link    | `underline-offset-2 decoration-[#a5b4fc] hover:text-[#4338ca] hover:decoration-[#6366f1]` |
| Footer address  | `hover:text-[#4f46e5]`                                                      |

The project link's resting underline is part of the same line of the file, so it is part of this
record: the page drew it in the link's own accent, where the browser puts it.

## Decision

**Every link and control on the page changes colour under the pointer, as the Make file draws it,
and keyboard focus draws the same colours as well as its outline.**

| Element        | At rest                                  | Under the pointer and on focus           |
| -------------- | ---------------------------------------- | ---------------------------------------- |
| Contact pill   | white fill, `#c7d2fe` border             | `#eef2ff` fill, `#a5b4fc` border         |
| CV control     | `#4f46e5` fill and border                | `#4338ca` fill and border                |
| Contents link  | `#64748b`                                | `#4f46e5`                                |
| Project link   | `#4f46e5`, underline `#a5b4fc`, 2px below | `#4338ca`, underline `#6366f1`          |
| Footer address | `#94a3b8`                                | `#4f46e5`                                |

* **Only colour changes.** No width, padding, border width, weight or shadow moves, so nothing
  changes size and nothing around it reflows. The CV control changes its border with its fill so
  its 1px edge never shows. Measured on the built page, a contact pill is 87.4 by 37.1px and the CV
  control 121.1 by 37.1px, at rest and under the pointer alike.
* **Focus draws what hover draws.** The design gives the contents links `focus-visible` as well as
  `hover`; this record gives it to all five, so keyboard focus is never less visible than hover.
  The base styles' outline, 2px in the accent with a 2px offset, is untouched and still what
  identifies focus.
* **The change takes the design's `transition-colors`**, which is 150ms, as `--hover-transition`.
  It is written once, on every `a` in `app/globals.css`, inside `prefers-reduced-motion:
  no-preference`, so a reader who prefers less motion gets the change at once. The property list is
  the colours only: `color`, `background-color`, `border-color` and `text-decoration-color`. The
  timing function is the browser's `ease` rather than Tailwind's own curve, which is
  indistinguishable over 150ms and would be a token for nothing.
* **Nothing depends on hover**, per DDR-014. No content is revealed, moved or laid out by it. A
  touch screen with no hover loses nothing: every label, icon, address and underline is there at
  rest.
* **Paper is unchanged.** The page is never pointed at on paper, so the hover fill and border drop
  at the token layer with every other surface and hairline, per DDR-015. The pale underline and its
  offset are the screen's: the projects' print block puts the underline back in the link's own ink
  where the browser places it, which is what the printed CV had before.

### The tokens

Five colours, one time and one length, each written out rather than pointed at a token that shares
its value — a pill's hover fill is the tag's tint and its hover border the marker's indigo, but
neither is the same role, as DDR-025 already argued for the tag's ink.

| Token                          | Value     | Draws                                        |
| ------------------------------ | --------- | -------------------------------------------- |
| `--color-surface-hover`        | `#eef2ff` | a contact pill's fill                        |
| `--color-accent-hover`         | `#4338ca` | the CV control's fill, a project link's ink  |
| `--color-border-accent-hover`  | `#a5b4fc` | a contact pill's border                      |
| `--color-underline`            | `#a5b4fc` | a project link's underline at rest           |
| `--color-underline-hover`      | `#6366f1` | a project link's underline under the pointer |
| `--hover-transition`           | `150ms`   | every link's colour change                   |
| `--underline-offset`           | `2px`     | a project link's underline                   |

`--underline-offset` is in px, as the focus outline's offset is: it separates a line from the
letters and gains nothing from growing with them. `components/stylesheets.test.ts` now holds
`text-underline-offset` and `text-decoration-thickness` to tokens.

### Measured contrast

| Pairing                                   | Ratio  | Asked | Meets |
| ----------------------------------------- | ------ | ----- | ----- |
| Accent on a contact pill's hover fill     | 5.62:1 | 4.5   | yes   |
| Hover border on the hover fill            | 1.78:1 | 3     | **no** |
| White on the CV control's hover fill      | 7.90:1 | 4.5   | yes   |
| A project link's hover ink on the page    | 7.38:1 | 4.5   | yes   |
| A project link's underline at rest        | 1.86:1 | 3     | **no** |
| A project link's underline on hover       | 4.17:1 | 3     | yes   |
| Accent on the page (contents, footer)     | 5.87:1 | 4.5   | yes   |
| Accent on the bar's worst blend (contents)| 5.42:1 | 4.5   | yes   |

**Two pairings fail**, and `app/tokens.test.ts` holds them by name beside DDR-025's four:

* **A contact pill's hover border**, at 1.78:1 on its hover fill. It is stronger than the resting
  1.49:1 and still well below the 3:1 WCAG 1.4.11 asks of a control's edge. DDR-025 already gave up
  the edge as what identifies the pill; the hover fill, which is the larger change, carries the
  state.
* **A project link's underline at rest**, at 1.86:1 on the page. DDR-012 made the underline what
  identifies a link and DDR-025 kept that rule, so it is held to 3:1 here. The design's pale line
  still marks the link as one, and the link's text is still the accent at 5.87:1, but the one cue
  that is not a colour is now fainter than every ink on the page. Under the pointer it is 4.17:1.

Three pairings get **better** under the pointer: the contents links go from 4.44:1 on the page and
4.10:1 on the bar to 5.87:1 and 5.42:1, and the footer's addresses from 2.39:1 to 5.87:1. Both
still fail at rest, as DDR-025 records.

## Consequences

### Benefits

* Every link and control answers the pointer, and the four pill controls, which are the page's calls
  to action, visibly do.
* Keyboard focus shows everything hover shows, and its outline besides.
* One transition rule for every link, and no motion for a reader who has asked for less.
* The printed CV is unchanged.

### Tradeoffs

* Two more pairings fail WCAG, both recorded here: six in all across DDR-025 and this record.
* A project link's underline, the one cue that identifies it without colour, is fainter at rest than
  it was.
* Five colours for five hover and underline roles, two of which repeat values already in the
  palette.

### Risks

* On a touch screen a tapped link can keep its hover colour until something else is tapped. It is a
  colour and nothing else, so nothing is hidden or blocked by it. Wrapping hover in `(hover: hover)`
  would avoid it at the cost of a media query in five stylesheets and splitting the focus rule from
  the hover one.
* A new link on the page takes the transition from the base styles but no hover colour, and needs
  its own rule.

## Alternatives Considered

### Build DDR-010's hover: thicken the underline

Rejected by the owner's decision that the design prevails. It would also have given the pills, the
contents links and the footer's addresses nothing, since none of them is underlined.

### Hover only, with focus left to the outline

The design's own split: only the contents links take the colour on focus. Rejected because the issue
asks that focus be at least as visible as hover on every element, and matching the two is the
simplest way to guarantee it.

### Keep the underline in the link's own ink

Keeps the underline at 5.87:1. Rejected: the design draws it pale, and the owner chose the design.

### Point the hover tokens at the existing tokens with the same values

`--color-surface-hover: var(--color-surface-tag)` and so on. Rejected for the reason DDR-025 wrote
the tag's ink out: the roles are different, and a change to a tag's tint should not move a pill's
hover.

## References

* GitHub issue #115 and Epic #70
* DDR-010, whose hover sentence this supersedes
* DDR-012, which carried the same sentence and is superseded by DDR-025
* DDR-014, whose rule that nothing depends on hover stands
* DDR-015, the print treatment
* DDR-025, the palette, which this amends
* DDR-029 and DDR-030, the pill controls' labels and weight
* DDR-033, which left the contents links' hover to this record
