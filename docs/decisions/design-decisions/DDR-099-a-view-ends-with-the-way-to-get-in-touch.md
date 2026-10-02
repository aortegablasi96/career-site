# DDR-099-A View Ends With the Way to Get in Touch

Status: Accepted

Date: 2026-10-02

**Amends DDR-050 in one respect**: a project's view no longer goes straight from its content to its
neighbours. After the text and the pictures, and before DDR-052's hairline and the projects on
either side, it shows the introduction's question, the line below it and the four controls.

**Amends DDR-059 (role view) in the same respect**: after the points, and the skills where there are
any, and before the foot's hairline and the roles on either side, a role's view shows the same
block.

Everything else in DDR-050, DDR-052 and DDR-059 stands, and so does everything that draws the
controls: DDR-044 and DDR-073 (each pill its service's own button, the email pill Gmail's M alone),
DDR-043 (the profiles open a new tab and say so), DDR-072 and DDR-076 (the question and the line),
DDR-027 (no minimum target), DDR-035 (hover and focus) and DDR-020 (the raised shadow). It **adds no
token, no colour pairing and no content**, and supersedes nothing.

## Context

Views are where shared links land: the owner sends a project's or a role's address, and a reader
may never see the page. Until now a view ended with its neighbours and the footer, which writes the
owner's addresses out in small grey type. The "Get my CV" control and the contact pills existed only
in the introduction, so a reader convinced by a project had to find the page's top to act on it.

Issue #290, under Epic #216, asks for every view to offer, after its content, a way to email the
owner, open their LinkedIn and GitHub and download the CV, with the introduction's own controls,
and leaves their place relative to the neighbours and the footer to the UI Designer.

## Decision

**Every project's view and every role's view ends its content with the introduction's way to get
in touch: the question, the line below it and the four controls, drawn by the same component as
the introduction, a section boundary below the content and a section boundary above the
neighbours' hairline.**

| Property    | Value | Why |
| ----------- | ----- | --- |
| Place       | The last block of the view's `article`, after the content and before the neighbours | It is the next step for a reader who has finished reading. The neighbours lead on to more reading, so they stay the foot. In the markup, the reading order and the tab order alike, it follows the content and comes before the neighbours, as it stands on screen. |
| Words       | The introduction's: "Interested in working together?" and "Get in touch or download my CV below:" | The issue asks for the introduction's wording where it fits, and both fit a view as they fit the page: the question asks the reader, and the line says what the controls are for. No new string. |
| Controls    | The introduction's four, in its order: Gmail's M, LinkedIn, GitHub, "Get my CV" | The same names, marks, colours, hover and focus, and the same new tab for the profiles, because they are the same component, `ContactControls`. |
| Above it    | `--space-boundary`, 42px on a phone and 56px from the wide breakpoint | The space DDR-052 and DDR-059 already put above the neighbours' hairline: it stands apart from the content as a part of its own, not as the last of the links or points. |
| Below it    | `--space-boundary`, then the neighbours' hairline | DDR-052's and DDR-059's own space, unchanged. |
| Question    | `p`, the accent at `--font-size-large`, semibold (DDR-072) | Not a heading, so a view's outline stays its title and its labels. |
| Line        | `p`, the secondary ink at the body's size and weight, 4px below the question (DDR-076) | As on the page. |
| Controls    | 16px below the line, 8px apart, wrapping onto as many rows as they need | As on the page. |
| Appearance  | One element of the view's `data-appear` container (DDR-090) | It appears as a whole as it is reached, as each of the view's parts does. |
| On paper    | As the introduction's: the question and the line not printed, the CV control not printed, the pills their labels in their brands' ink | A view does not print as a designed sheet (DDR-050); the paper rules are the component's own. |

The block has no panel, rule or tint of its own: the question is what sets it apart, as it does on
the page.

Measured on #290, in Edge, on the Digital Twin's and NumisBook's views and on ABB's, Ponera Group's
and Electrónica Digital de Protección's, every 10px from 300px to 900px and at 1280px and 1536px, at
the browser's default text size and at 200%:

* Nothing scrolls sideways, and no element passes the client width.
* No control is smaller than 24 × 24 and no two controls overlap. The pills are 37.5px tall at the
  default size and 73px at 200%. They take one row or two at the default size and up to four at
  200%, and stay 8px apart.
* The page is unchanged: every element of the introduction has the same box and every computed
  style on screen and under print media, at nine widths from 300px to 1536px and both sizes, and
  the printed CV is five sheets in Edge and Firefox, with background graphics on and off, pixel- and
  text-identical to the tree before.

## Alternatives Considered

### After the neighbours, just above the footer

Pros:
* The view would literally end with it, nearest the footer's addresses.

Cons:
* The neighbours would stand between the content and the call to act, so a reader who has finished
  reading meets two links to read more before the way to get in touch.
* The footer's addresses would follow the controls directly, saying the same thing twice in a row.

### In the footer, on every view and the page

Pros:
* One place, on every route.

Cons:
* The issue keeps the footer as it is, and the page would show the controls twice.

### On a tinted panel, as a role's header is drawn

Pros:
* The block would stand out more.

Cons:
* A new treatment the introduction does not have, where the issue asks for the introduction's own.
  The question in the accent already sets it apart.

### New wording for the views

Pros:
* It could name the project or the role.

Cons:
* The introduction's wording fits, and new wording would be the owner's to supply. None was needed.

## Consequences

Benefits:
* A reader who lands on a view from a shared link can email the owner, open their profiles or
  download the CV without going back to the page.
* The controls are one component, so the page and the views can never draw them differently.

Tradeoffs:
* Every view is longer, measured on the Digital Twin's and ABB's alike: by 160px from the wide
  breakpoint, 191.5px at 390px and 214px at 320px at the default text size, where the controls wrap
  onto a second row; and at 200% by 290px to 318px from 1280px, 379px at 768px, 650px at 390px and
  743px at 320px, where they take a row each.
* The views and the page now share a stylesheet, `contact-controls.module.css`, where before a view
  shared nothing with the introduction.

Risks:
* A change to the introduction's question, line or controls now changes every view as well. That is
  the intent, and a change meant for the page alone would need a choice of its own.

## Related Documents

* GitHub issue #290 and Epic #216
* DDR-050, the project view, and DDR-059 (role view), which this amends
* DDR-052, the neighbours, whose place and spacing stand
* DDR-043, DDR-044, DDR-072, DDR-073 and DDR-076, the introduction's controls and the lines above them
* DDR-027, target sizes; DDR-090, elements appearing
* ADR-004, the downloadable CV
