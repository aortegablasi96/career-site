# DDR-079-A Project View Switches to Its Business Case

Status: Accepted

Date: 2026-09-28

**Adds to DDR-050's introduction and DDR-078**: where a project has a business case, its view
shows a switch under the name. The switch lets the reader read the business case in place of the
description and "How I built it", and read them again. Everything DDR-050, DDR-052, DDR-053 and
DDR-078 decide stands, and a view whose project has no business case is unchanged. It **adds no
token**, and it supersedes nothing. ADR-014 records how the switch holds its state.

## Context

On #231, part of Epic #152, the owner asked for a project's view to switch between the project's
general description and a business case explanation, and back, keeping the layout and the
pictures. The content is the "Summary of Business Case" from the owner's knowledge-base entry. Only
the Stock Portfolio Viewer's entry has one, and the other views are to stay without one for now.

The owner chose two things on #231:

* **What switches:** the overview, which is the description and "How I built it", together. The
  business case's "04 — My contribution" already covers how the project was built.
* **The two options' words:** "Overview" and "Business case".

The story left the switch's look, its placement and how it announces its state to the UI Designer.
It is the site's first control that changes what a page shows without leaving it.

## Decision

**A segmented control under the name: one pill holding two options, the chosen one filled in the
accent. The business case is a list of the owner's labelled items, set in the overview's place.**
Nothing else on the view moves or changes.

| Property          | Value                                            | Why |
| ----------------- | ------------------------------------------------ | --- |
| Place             | Between the name and the account it switches, `--space-medium` (16px) below the name, and the account 16px below it | Where the description began, so the switch is read before what it controls, and both accounts begin where the description did. |
| Element           | A native radio group: `role="radiogroup"` named "About this project", two `input type="radio"` in their `label`s | Choosing one of two accounts is what a radio group is. Assistive technology announces the group, each option and which is checked. Tab reaches it and the arrow keys move between the two, as for any radio group. See ADR-014. |
| The track         | White (`--color-surface-card`), a 1px `--color-border-accent` edge, `--radius-large`, `--space-x-small` (4px) inside, 4px between the options | The view's outlined control's surface and edge, so the switch reads as one of the view's controls. It is a box as wide as its two options, not the column. |
| An option         | Its label: `--font-size-x-small` in medium, 4px by 16px of padding, `--radius-pill`, in `--color-text-muted` | The size, weight and pill of the view's controls, and the way back's ink. The whole label is the target: 27.5px tall and at least 89px wide, so it meets WCAG 2.5.8 outright. |
| The chosen option | Filled in `--color-accent`, in `--color-on-accent` | The view's filled control, which is the site's way of saying "this one". The fill against the white track is 6.29:1, so the state is visible by more than colour hue alone. |
| Under the pointer | An option not chosen takes `--color-surface-hover` and the accent, per DDR-035 | As the view's outlined control answers. |
| Keyboard focus    | The focused option's label draws the site's focus outline, `--focus-outline-width` in `--color-focus` at `--focus-outline-offset` | The radio itself takes no room, so its label draws the ring every control draws. |
| The radio         | `appearance: none`, 0 by 0, no margin              | The label is what is seen and pointed at. The radio stays the control, so nothing about how it is reached or announced changes. |
| First shown       | The overview                                     | A view opens as it read before #231. |
| The business case | A `dl`: each item a `dt` (its label) and a `dd` (its text), in the owner's order | Label and text are a term and its description. The labels are not headings, so the outline is one `h1` and `h2`s in both accounts, with no skipped level. |
| An item's label   | Bold capitals at `--font-size-x-small`, `--letter-spacing-loose`, in the accent | Set as the page's other labels in the accent are, such as a timeline's dates. The capitals are drawn, so the string is the owner's "01 — Problem". |
| An item's text    | The body's size and ink at `--line-height-prose`, 4px below its label | Set as the description it stands in for. |
| Between items     | `--space-flow`, 16px                             | The column's step between two blocks of running text. |
| Without a business case | No switch and no list; the view's markup is as it was | A control that switches to nothing is worse than none, as DDR-053 says of an empty gallery. |
| Where they cannot share a line | The second option wraps below the first, inside the track | At 200% text below 490px. The track's large radius, rather than a pill's, keeps both options inside its curve when it is two rows tall. |
| Motion            | None                                             | The account changes at once. There is nothing for a reader who prefers reduced motion to lose. |
| Link preview      | The description alone                            | The meta and Open Graph description still say what the project is. |
| On paper          | Nothing changes                                  | A view does not print, and the page shows neither account. |

Contrast, each measured from the tokens: an option's muted ink on the white track is 4.76:1, white
on the accent 6.29:1, the accent on the hover tint 5.62:1, and an item's accent label on the page
5.87:1. All pass WCAG 1.4.3. The track's edge is `--color-border-accent` at 1.49:1, as the contact
pills' edge is, per DDR-025. It does not identify the control or its state: the words and the
filled option do.

Measured on #231 in Edge (640 measurements):

* **Sweep:** all four views, the Stock Portfolio Viewer in both accounts, every 10px from 300px to
  900px and at 1195px, 1280px and 1536px, at the browser's default text size and at 200%.
* **Overflow:** nothing scrolls sideways, no element reaches past the window, and no option's word
  runs out of its label.
* **Layout:** the lead picture is the same size in both accounts at every width.
* **Wrapping:** the two options share one line everywhere but at 200% text below 490px. At 300px
  "Business case" also wraps to two lines, inside its label.
* **Headings:** in the overview, one `h1`, then "How I built it" and "Built with". In the business
  case, one `h1` and "Built with".
* **Other views:** no other view has a radio.
* **Keyboard and assistive technology:** Tab reaches the checked option, and the arrow keys move
  between the two and show the other account. The accessibility tree holds the radio group, each
  radio's name and state, and only the account shown.
* **Without script:** clicking "Business case" shows it and hides the overview.
* **Markup:** the page's markup is identical to the tree before. The other three views differ only
  in their stylesheet's address and a class on the text column, which draws nothing there.

## Alternatives Considered

### Tabs, with `role="tablist"`

Pros:
* The ARIA pattern named for switching between panels of one page.

Cons:
* Tabs need script to move between them with the arrow keys and to show their panel, so without
  script, or before hydration, the switch would do nothing. ADR-014 has the rest.

### A disclosure: "Read the business case" opening below the overview

Pros:
* Both accounts can be read at once, and `details` needs no script.

Cons:
* The owner asked to switch from one to the other. A second account below the first lengthens the
  view, and "How I built it" and "Built with" end up between the two.

### Two links, each its own address

Pros:
* Each account could be sent to someone.

Cons:
* It would need a second route per project, or a fragment the stylesheet reads, and #231 leaves
  an address per account out of scope.

### A pill track, `--radius-pill`

Pros:
* The same shape as the options and the view's controls.

Cons:
* Where the options wrap, at 200% text on a phone, a pill's ends cut into both options' corners.

## Consequences

Benefits:
* A reader who wants why the product exists reads that in the same place, beside the same picture,
  and the view keeps its layout.
* Adding a business case to another project is content alone: its items on the project in
  `content/projects.ts`.
* No new token, no failing pairing beyond the edge DDR-025 already records, and paper is untouched.

Tradeoffs:
* A business case replaces "How I built it" while shown, so a reader reads the two accounts one at
  a time, as the owner chose.
* The site now has a control that changes the page without navigating. The reader's choice is not
  remembered across views or visits, and an account has no address of its own.

Risks:
* The two accounts are shown and hidden by `:has()`. A browser without it shows the overview and a
  switch that changes nothing. Every browser the site supports has it.
* A longer option word, or a third option, changes where the options wrap. Rerun the sweep.

## Related Documents

* Issue #231 and Epic #152
* ADR-014, how the switch holds its state
* DDR-050, the project view, and DDR-078, "How I built it", which together are the overview
* DDR-027, target sizes, and DDR-035, hover
* DDR-025, the palette and its pairings
* DDR-053, the gallery, whose rule for an empty block this follows
