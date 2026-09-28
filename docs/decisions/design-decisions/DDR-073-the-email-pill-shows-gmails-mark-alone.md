# DDR-073-The Email Pill Shows Gmail's Mark Alone

Status: Accepted

Date: 2026-09-28

**Supersedes DDR-058.** The email pill no longer shows "Email me". It shows Gmail's M and no word,
and "Email me" is its accessible name, which nothing on the pill shows.

**Amends DDR-029 in one respect**: DDR-029 made each pill's short label the text it shows. The
email pill's label is now its accessible name instead. The LinkedIn and GitHub pills keep their
visible labels. The footer is still the one place an address is written out, and it still prints.

**Amends DDR-044 in one respect**: the email pill is still Gmail's light button, with the M in its own
four colours, but it is a circle rather than a pill with a label. Its mark is drawn in a square
the height of a label's line, `--contact-mark-size`, rather than at 1em. DDR-044's rule that no mark
is recoloured or redrawn stands.

## Context

On #215, part of Epic #216, the owner asked for the email pill to show Gmail's logo alone. Gmail's M
is a mark a visitor already reads as email, so the word beside it repeated what the mark says. When
asked what a screen reader should announce, the owner said: "I just want to display Gmail's logo.
The user should understand that's the button to reach me out over mail."

A pill's height comes from its label's line, 19.5px at the 13px step. A pill with its label removed
would shrink to the mark's 1em, 13px, and stand about 6.5px shorter than the LinkedIn and GitHub pills
beside it.

## Decision

**The email pill shows Gmail's M alone, in a circle as tall as the other pills, and "Email me" is
its accessible name.**

* **The mark takes the label line's square.** `--contact-mark-size` is `--font-size-x-small` times
  `--line-height-body`, 19.5px at the default text size. The mark keeps its own proportions inside it,
  19.5px wide and about 14.6px tall, in its own colours.
* **The circle is DDR-027's padding, the same on every side.** `--space-small`, 8px, above, below and
  either side, with the 1px border, makes the pill 37.5 by 37.5px. The pill radius draws a circle.
  It is exactly as tall as the LinkedIn and GitHub pills at every text size: 37.5px at the default
  size and 73px at 200%.
* **The accessible name is "Email me"**, the wording the owner approved on #175, as `aria-label` on
  the link. The owner's answer on #215 asked only for the logo to show. This keeps their approved
  wording where only assistive technology meets it. A screen reader announces "Email me, link", and
  the link still opens the mail client, in the same tab. `markOnly` on a `ContactLink` says which
  pill shows its mark alone. It is set only on the email contact.
* **Hover and focus are unchanged**: Google's grey state layer, per DDR-035 and DDR-044, and the focus
  outline around the whole circle.
* **On paper the pill prints its mark alone**, which is what it shows on screen: the M on a line of
  its own above "LinkedIn" and "GitHub". The footer prints the address, once.

Measured on #215 against the tree before, in Edge at every 10px from 300px to 900px and at 1195px,
1280px and 1536px, at the browser's default text size and at 200%:

* Nothing scrolls sideways, and the controls row never takes more rows. It takes one fewer at 440px
  to 500px at the default size, and at 350px to 460px and 850px to 900px at 200%.
* Every target clears WCAG 2.5.8's 24 by 24 outright. The smallest side of any control is 37.5px,
  and no two centres are closer than 59.1px.
* At 390 by 844 the controls end 802.9px down, as they did.
* Printed to A4 in Edge and Firefox, with background graphics on and off: five sheets before and
  after, with the section headings on sheets 1, 3, 4, 5 and 5. Only sheet 1 changes, and sheets 2
  to 5 are pixel-identical. The email address comes back once, from the footer. "Email me" is on no
  sheet, and there is no replacement character.

## Alternatives Considered

### Keep the pill's shape and padding, with the mark alone inside

Pros:
* No new token.

Cons:
* The pill shrinks to 31px tall beside 37.5px pills and is 47px wide: neither a pill nor a circle.

### A visually hidden "Email me" inside the pill

Pros:
* The label stays text, and would keep the line's height.

Cons:
* Hiding text needs `position: absolute` on content, which DDR-014's markup-order rule and
  `components/stylesheets.test.ts` refuse. An `aria-label` names the link just as well.

### Hide the email pill on paper

Pros:
* The sheet is not left with a mark that leads nowhere.

Cons:
* No pill leads anywhere on paper. It would be the one pill that screen and paper disagree on, and
  the footer already carries the address.

## Consequences

Benefits:
* The controls row is lighter and quieter, as the owner asked, and wraps less on a phone.
* Screen-reader users lose nothing: the pill still has a name that says what it does.

Tradeoffs:
* A sighted reader who does not recognise Gmail's M loses the word that named the control. Speech
  input users must know to say "Email me", which nothing on the pill shows (WCAG 2.5.3 asks the name
  to contain the visible label, and there is none, so it is met trivially but gives no hint).
* The email pill is a different shape from the other three controls.

Risks:
* `--contact-mark-size` assumes the pill's label is at `--font-size-x-small` and the body's leading.
  If either changes, the circle stays the height of the others only if the token moves with them.

## Related Documents

* Issue #215 and Epic #216
* DDR-058, superseded by this record
* DDR-029, the short labels and the footer, amended
* DDR-044, each pill its service's own button, amended
* DDR-027, target sizes and WCAG 2.5.8
* DDR-035, the pills' hover states
* DDR-043, which pills open a new tab
* DDR-015 and DDR-032, the printed CV
