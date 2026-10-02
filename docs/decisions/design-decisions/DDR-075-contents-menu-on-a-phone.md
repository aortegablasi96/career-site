# DDR-075-The Contents Bar Collapses Behind a Menu on a Phone

Status: Accepted

Date: 2026-09-28

**Supersedes in part DDR-010**: the bullet "It is not collapsed behind a toggle" under "The
contents", and the alternative "Adopt the mobile 'Sections' toggle" that it rejects. DDR-031
carried that rejection forward in its list of what DDR-010 still decides, so this record supersedes
those words there too. Everything else both records say about the contents stands: one link per
section, a `nav` with an accessible name, the bar pinned to the top of the window, and nothing
printed.

**Amended by DDR-091**: the site's title is now a link to where Home leads, and choosing it closes
the menu too, though it is outside the menu.

**Amends DDR-049 in two respects**: below the wide breakpoint the links no longer wrap onto the
rows below the title, because they are behind the menu; and the scroll clearance no longer counts a
row for the title there, because the title shares its row with the menu's button. Both come back
for a reader without script, for whom the bar is exactly DDR-049's.

**Amends DDR-021's rule that nothing but a pseudo-element leaves the flow**, as DDR-031 amended it
for `position: sticky`: the menu's panel is `position: absolute`, admitted once.

**Keeps DDR-042 and DDR-045 as they are.** The mark on the current section's link, and on Home in
the introduction, is the same underline on the same link, and the open menu shows it.

## Context

On #221, part of Epic #216, the owner asked for the contents bar to collapse behind a burger menu on
a small screen, with the current section's link still underlined when the menu is open.

Below the wide breakpoint the bar's six links wrap onto the rows below the title, per DDR-049. At
the default text size on a phone the pinned bar was 87px tall, and at 200% text up to 228px, where
the scroll clearance is 206px, so headings could land behind it. It covered that much of every
screen for as long as the reader scrolled.

DDR-010 rejected exactly this pattern: "it hides navigation on exactly the screens where navigation
matters most, and needs client-side state." Epic #70 left that rejection standing until a design for
the toggle existed. The owner has now asked for it, having used the site on a phone. Both objections
are answered below rather than dismissed: the menu is one tap away and marks where the reader is,
and the state lives in the one Client Component the site already has, per ADR-013.

The issue left the design to the UI Designer with the owner. The owner chose, on #221, from three
questions:

* **The panel opens over the page**, rather than pushing the page down.
* **The links stand one to a line at body size**, rather than at the bar's label size.
* **The button shows three lines while closed and a cross while open.**

## Decision

**Below the wide breakpoint, the contents bar shows the site's title and a menu button, and its
links are in a panel the button opens.**

* **The bar is one row.** The title at the left of the column, the button at the right, 48.8px
  tall at the default text size at every width from 300px to the wide breakpoint. At 200% text the
  title's two words wrap beside the button rather than the button wrapping below the title, so the
  bar is 97px or 126px there, inside the 128px clearance at every width swept.
* **The button** is the mark alone: three lines while the menu is closed and a cross while it is
  open, 24px (`--contents-menu-icon-size`), with the small step above and below it and none at its
  sides, so it is 24 by 40 and its mark ends at the column's edge. It is in the title's heading ink
  and takes the accent under the pointer and on focus, over 150ms where motion is welcome, as a
  contents link does. Its accessible name is "Menu", from `content/contents.ts`, and it says
  whether the menu is open through `aria-expanded` and which list it opens through
  `aria-controls`.
* **The panel** hangs from the bar's lower edge across the window, over the page. Nothing below it
  moves, so the section under the bar stays where it is and the mark on its link stays true. It is
  on the page's opaque surface and closes with the bar's own hairline and shadow, so it reads as the
  bar opened out. Its links are Home and every section, in the bar's order, one to a line from the
  column's left edge, at body size, each padded to a 38.5px row. It is never taller than the window
  below the clearance, and scrolls inside itself if it would be.
* **The links are the bar's links.** Same muted ink, medium weight, accent on hover and focus, and
  the current section's underline, per DDR-042, or Home's in the introduction, per DDR-045. The mark
  follows the page if it scrolls while the menu is open. On a role's or a project's view nothing is
  marked, as before.
* **The menu closes** when a link in it is chosen, which then glides to its section as before, per
  DDR-041; on Escape, which returns focus to the button; when the pointer goes down outside the bar;
  and when focus moves out of the bar. So an open menu never covers what the reader has moved on
  to. *Since DDR-091 it also closes when the title, which leads home, is chosen.*
* **Nothing moves or animates** when the menu opens or closes. A reader who prefers reduced motion
  sees exactly what anyone else does, less the button's colour change.
* **From the wide breakpoint up, the bar is unchanged.** There is no button, and the links are in
  the bar's row as DDR-049 lays them out.
* **Without script the bar is DDR-049's at every width.** A reader who cannot open the menu is never
  shown a button: the links are in the bar, below the title on a phone, and the clearance counts the
  title's row again. Before script has run on a slow connection the button is drawn but does
  nothing, which lasts until the page hydrates.
* **Paper is unchanged**, since the bar does not print.

## Alternatives Considered

### Push the page down

Pros:
* Nothing is covered, and no element leaves the flow, so DDR-021's rule is untouched.

Cons:
* The bar is pinned, so the list would grow it from the top of the document and move the whole page
  down beneath it. Chromium and Firefox hide the jump with scroll anchoring; Safari, which a phone
  visitor is likely to use, does not, so the page jumps as the menu opens.
* The sections move under the bar, so the current section can change while the menu is open and
  the underline can move off the section the reader was in.

The owner chose the panel over the page.

### The links at the bar's label size

Pros:
* The panel is shorter, and the links are exactly the bar's links rearranged.

Cons:
* At 12.8px they are small and dense on a phone, where the menu exists for a finger.

The owner chose body size.

### Keep DDR-049's wrapped links

Pros:
* No hidden navigation and no client state, which is DDR-010's case.

Cons:
* The bar covers 87px of every phone screen, and at 200% text is taller than the scroll clearance,
  which the owner no longer accepts.

### The native `popover` attribute, or a `details` element

Pros:
* Either opens and closes without script, and a popover handles Escape and a click outside itself.

Cons:
* A popover is placed in the top layer against the window, not against the bar, so it cannot hang
  from a bar whose height changes with the reader's text without CSS anchor positioning, which is
  not yet in every browser the site supports.
* A closed `details` hides its content in a way a stylesheet cannot undo from the wide breakpoint,
  so the links would have to be drawn twice.

### A visible word beside the mark

Pros:
* Names the button for readers who do not know the three lines.

Cons:
* Wider, and it squeezes the title at 200% text. The owner chose the mark alone, which is the
  pattern most readers already know; the name is still there for assistive technology.

## Consequences

Benefits:
* The pinned bar is one row on a phone, 48.8px at the default text size where it was 87px, so the
  page keeps about 38px more of every screen. At 200% text it is at most 126px where it was up to
  228px, and headings no longer land behind it. A section reached from the menu comes to rest
  64px from the top of a phone's window, 15px below the bar, as on the wide screen, where it came to
  rest 103px down below the 87px bar.
* The open menu shows where the reader is, with the mark they already know from the wide bar.
* Every target in the panel is at least 24 by 24 and the rows do not overlap, so WCAG 2.5.8 is met
  outright rather than by the spacing exception.

Tradeoffs:
* On a phone the sections are one tap further away, and a reader has to know the three lines mean
  a menu. That is DDR-010's first objection, accepted by the owner.
* The panel covers the top of the page while it is open.
* The contents bar is now a component with state, per ADR-013.

Risks:
* The title is sized for two words beside the button. A longer title, a larger title step or a
  larger mark means rerunning the sweep: every 10px from 300px to 900px at both text sizes, checking
  that the button stays beside the title and the bar stays inside the clearance.
* Between the page loading and hydrating, the button is drawn but does nothing.

## Related Documents

* #221, part of Epic #216
* DDR-010 and DDR-031, whose rejection of the toggle this supersedes
* DDR-049, the title and the links' arrangement, which this amends below the wide breakpoint
* DDR-021, the out-of-flow rule, which this amends for the panel
* DDR-033, DDR-035, DDR-041, DDR-042 and DDR-045, which the links keep in the panel
* DDR-048, the bar's edge, which the panel repeats
* DDR-014, the two breakpoints and reduced motion; DDR-027, target sizes
* ADR-013, which lets the contents bar hold whether the menu is open
