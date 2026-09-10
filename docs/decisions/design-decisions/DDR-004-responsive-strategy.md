# DDR-004-Responsive Strategy

Status: Accepted

Date: 2026-09-10

## Context

A link to a career site is very often opened on a phone, from a message or an email, in the few
minutes between other things. Mobile is the likely first impression, not a fallback. Issue #13
asks for one decision on how many breakpoints exist, where they are, and how typography,
spacing, and layout adapt across them. Otherwise breakpoints accumulate one fix at a time, until
nobody can say what the page is meant to do at a given width.

The earlier records deferred this decision to #13:

* **DDR-001** fixed the type scale in rem and left how it adapts across viewport sizes to #13. It
  recorded one case that needs adapting. On a 320px screen with the browser font size at 200%,
  one long word in a heading can be wider than the whole line, such as "Infrastructure" in an
  `h3`. The word then breaks in the middle.
* **DDR-003** fixed the spacing scale and left how spacing adapts to #13. It recorded two risks.
  On a phone, 4rem above the page and between sections may be too much. On a 320px screen at
  200%, the 1rem gutter doubles and narrows the column to 256px.

The page is already mostly fluid. The column is at most 65ch wide, fills the viewport below that
width, and has a gutter either side. There are no components and no interactive elements yet.

The constraints are:

* **ADR-001**: design values are custom properties defined once at the root. A media query cannot
  read a custom property, so a breakpoint cannot be a token.
* **DDR-001**: text sizes are in rem, so they follow the reader's font-size setting. Body text is
  18px, and no text is smaller than 14.4px.
* **DDR-003**: space is in rem, and each level of the rhythm is twice the one below. DDR-003
  rejected blocks 12px apart, because they are hard to tell from lines 9px apart.
* **Accessibility**:
  * the page reflows without horizontal scrolling from 320px wide (WCAG 1.4.10);
  * text stays readable when enlarged to 200% (1.4.4);
  * content is presented in a meaningful order for every reader (1.3.2);
  * nothing needs hover.

  Issue #13 also asks for interactive targets of at least 44 by 44 CSS pixels.

These are out of scope and decided elsewhere: the type, colour, and spacing scales themselves
(DDR-001, DDR-002, and DDR-003), print (#14), and the composition of any section.

### Where the content breaks

The widths below were measured in Edge with the site's fonts. They are in rem, so they hold at any
font-size setting. The words are specimens, not site content, except the owner's name, which is
in the page title. Headings are set in Source Serif 4 at weight 600.

| Word               | `medium` | `large` | `x-large` | `xx-large` |
| ------------------ | -------- | ------- | --------- | ---------- |
| Andreu             | 4.08rem  | 5.08rem | 6.35rem   | 7.99rem    |
| Credentials        | 6.24rem  | 7.76rem | 9.71rem   | 12.20rem   |
| Certifications     | 7.39rem  | 9.19rem | 11.49rem  | 14.44rem   |
| Infrastructure     | 7.79rem  | 9.69rem | 12.11rem  | 15.22rem   |
| Telecommunications | 11.44rem | 14.23rem | 17.79rem | 22.36rem   |

In body text, set in Source Sans 3 at `medium`, "Infrastructure" is 6.43rem and
"Telecommunications" is 9.81rem.

The column is the viewport less its two gutters. A word breaks mid-word when it is wider than the
column, so what decides whether headings fit is the viewport's width in em. That width falls when
the screen narrows, and it also falls when the reader enlarges text:

* **A 320px phone at the default font size is 20em wide.** Its column is 18rem, which holds every
  specimen above at full size, apart from the longest in the page title, which holds only the
  owner's name.
* **The same phone with the font size at 200% is 10em wide.** With a 1rem gutter its column is
  8rem. "Credentials" as a section title, at 9.71rem, and "Infrastructure" as an item title, at
  9.69rem, both break.

## Decision

### Mobile-first, with one layout

* **The page has one layout at every width: the single centred column DDR-003 set.** It is fluid.
  Narrower than the measure, it fills the viewport. Wider, it stays at the measure and centres.
  Nothing moves beside anything else on a wider screen, so there is no second layout to switch
  to.
* **The styles are mobile-first.** The base values are for the narrowest viewports, and the one
  media query adds what wider viewports have room for. The most constrained case is designed
  first, instead of being cut down from a desktop design. A browser that ignored the query would
  still get a page that fits.
* **A phone at the default font size gets the full scales.** The narrowest phones in common use
  are 320px wide, which is 20em at the default font size, so they are at the breakpoint or above
  it. DDR-001 and DDR-003 set their scales for that width and checked them there.

### One breakpoint, at 20em

* **There is one breakpoint, `min-width: 20em`.** Below it, headings step down and the page's edges
  tighten, as set out below. At 20em and wider, the type and spacing scales apply exactly as
  DDR-001 and DDR-003 record them.
* **It is placed where the content breaks, not at a device's width.** Below about 20em, the column
  is too narrow for the long words that full-size headings may carry. At 20em it holds all of them,
  as the table under Where the content breaks shows. The specimens start to break between about
  12em and 16em. The breakpoint sits above that range because real titles and names are not yet
  known, and it is safer for headings to step down a little early than for words to break.
* **It is in em.** In a media query, an em is the browser's default font size, not the root's CSS
  font size, so the breakpoint follows the reader's font-size setting and zoom. A 320px phone with
  its text above 100%, or a 640px window with its text above 200%, is below it. A breakpoint in px
  would never be crossed by enlarging text, and enlarged text is the case that breaks.
* **At the default font size, the narrow values apply only below 320px**, narrower than any phone
  in common use. In practice they serve enlarged text and zoom on narrow screens, where the
  problem recorded in DDR-001 was found.
* **Wider screens need no breakpoint.** Once the viewport is wider than the column and its gutters,
  about 613px at the default font size, the column stops growing and centres, and the space either
  side grows by itself. The gutter therefore does not grow on wide screens, because it shows only
  where the column fills the viewport.

### How type adapts

Below the breakpoint, each of the three heading levels takes the step below its full-size step.

| Heading | Role token                  | Below 20em                       | 20em and wider                  |
| ------- | --------------------------- | -------------------------------- | ------------------------------- |
| `h1`    | `--font-size-page-title`    | `--font-size-x-large`, 1.75rem   | `--font-size-xx-large`, 2.2rem  |
| `h2`    | `--font-size-section-title` | `--font-size-large`, 1.4rem      | `--font-size-x-large`, 1.75rem  |
| `h3`    | `--font-size-item-title`    | `--font-size-medium`, 1.125rem   | `--font-size-large`, 1.4rem     |

* **The five steps do not change.** Below the breakpoint, headings use a different step, and no
  new size is added. DDR-001's scale stays fixed.
* **Heading sizes are named by role**, as DDR-003 names the rhythm. The base styles read the role
  tokens, so the breakpoint changes three values, and no component needs to know about it.
* **This fixes the recorded case.** At 320px and 200%, with the narrow gutter set out below, the
  column is 9rem. "Infrastructure" as an item title now needs 7.79rem, and "Credentials" as a
  section title 7.76rem.
* **Body text, metadata, and `h4` to `h6` never change size.** Body text and metadata are at the
  accessibility floors DDR-001 sets, and a reader who has enlarged text wants it large. On the
  narrowest columns, a very long word can still break in body text: "Telecommunications" is
  9.81rem, and the column 9rem. `overflow-wrap: break-word` keeps it on screen.
* **Below the breakpoint, an item title is the size of body text.** `h4` to `h6` already are. An
  item title is still set apart by the serif face, its weight, and the space between items.

The owner chose this over stepping headings down on every phone, fluid sizes, and hyphenation,
which are set out under Alternatives Considered.

### How spacing adapts

Below the breakpoint, the page's edges tighten. The rhythm between sections, items, and blocks
does not change.

| Token                  | Separates                                  | Below 20em               | 20em and wider             |
| ---------------------- | ------------------------------------------ | ------------------------ | -------------------------- |
| `--page-gutter`        | The column from the sides of the screen    | `--space-small`, 0.5rem  | `--space-medium`, 1rem     |
| `--page-padding-block` | The page content from its top and bottom   | `--space-large`, 2rem    | `--space-section`, 4rem    |

* **The rhythm keeps its levels.** Blocks cannot come closer than 1rem, for the reason DDR-003
  gives, and each level is twice the one below. Shrinking the space between sections or items
  would make two levels the same.
* **The page's edges tell nothing apart**, so they can tighten without losing meaning. At 320px
  and 200%, the column widens from 256px to 288px, and the space above the page title drops from
  128px to 64px.

The owner chose this over halving only the gutter and over changing no spacing.

### Interaction at every width

These rules hold at every width, for every component.

* **The markup order is the visual order.** A single column has nothing to rearrange. No style
  moves content out of its sequence, whether with `order`, a reversed flex or grid direction, grid
  placement, or positioning. Keyboard and screen reader users meet content in the order a sighted
  reader sees it.
* **Interactive targets are at least 44 by 44 CSS pixels**, set by `--target-size-min`. The token
  is in px because a target is sized for a finger, not for the text:
  * WCAG measures target size in CSS pixels.
  * A target sized from enlarged text grows past 44px anyway.
  * A reader who sets a smaller default font size should not get smaller targets.

  ADR-002 makes descriptions plain strings, so no link sits inside a sentence. Every link stands on
  its own, and the minimum applies to all of them. The first component that renders an interactive
  element applies the token.
* **Nothing depends on hover.** Hover may reinforce something already visible, but it never
  reveals, moves, or lays out anything. No layout depends on the `hover` or `pointer` media
  features.
* **Nothing scrolls horizontally from 320px wide.** The column has a maximum width rather than a
  fixed one, long words wrap, and nothing is given a fixed width wider than the column.

### Where the strategy lives

* `app/tokens.css` defines the role tokens and `--target-size-min` at `:root`, with their narrow
  values. Its one media query, at 20em, redefines the role tokens. The breakpoint is written there
  once, because a media query cannot read a custom property.
* `app/globals.css` reads the role tokens and writes no width media query.
* Components read the role tokens and write no width media query of their own. A second
  breakpoint, or a component that changes its layout at some width, is a new decision, recorded by
  superseding this DDR.

DDR-001 and DDR-003 remain accepted. This record decides the adaptation both deferred to #13, and
changes neither scale.

## Alternatives Considered

The first three options for headings, and two for spacing, were offered to the owner alongside
the chosen ones.

### Option A: Step headings down on every phone, below 30em

Pros:
* Smaller headings on every phone, a common pattern. The page title wraps less often.

Cons:
* Every phone at the default font size gets weaker hierarchy, although nothing breaks there, and
  the full scale was set for that width.

### Option B: Fluid type, with clamp() and viewport units, and no breakpoint

Pros:
* No breakpoint, and sizes change smoothly with the viewport.

Cons:
* Headings take sizes between the steps. DDR-001's fixed scale would be superseded, and the values
  in between could not be tested against its floors.
* Viewport units do not follow the reader's font-size setting. When text is enlarged, a fluid
  heading grows less than body text, and can end up hardly larger than it.
* It adapts every width to solve a problem that occurs only on narrow viewports with enlarged
  text, which one breakpoint handles.

### Option C: Keep the sizes, and add `hyphens: auto` to headings

Pros:
* No breakpoint, and a forced break at least gets a hyphen.

Cons:
* Hyphenation follows the page's language, which is English. Catalan and Spanish names, and the
  names of companies, would be split in the wrong places.
* It does not make the word fit, only marks where it breaks.
* It hyphenates headings at every width, not only where they overflow, and browsers hyphenate
  differently.

### Option D: Halve only the gutter below the breakpoint

Pros:
* The column widens by the same amount, and the space above the page stays as DDR-003 set it.

Cons:
* At 320px and 200%, 128px of space stays above the page title, a fifth of a typical phone's
  screen before the owner's name.

### Option E: Change no spacing

Pros:
* DDR-003's spacing holds at every width.

Cons:
* The column stays 256px wide at 320px and 200%, and 128px of space stays above the page title.

### Tightening the rhythm on narrow screens

Pros:
* More content on each screen of a phone.

Cons:
* It either breaks the doubling, so two levels become the same, or adds a step between 2rem and
  4rem, which supersedes DDR-003.

### Breakpoints at device widths, such as phone, tablet, and desktop

Pros:
* Familiar.

Cons:
* Nothing in a single column changes between a tablet and a desktop, so those breakpoints would
  have nothing to do.
* Device widths change every year, and a breakpoint placed at one fixes nothing in particular.
  This is how the accumulation issue #13 warns about begins.

### A breakpoint in px

Pros:
* Matches device widths as they are usually quoted.

Cons:
* Enlarging text never crosses it, and enlarged text on a narrow screen is the case that breaks.

### Container queries

Pros:
* Components adapt to the width they are given rather than to the viewport.

Cons:
* There are no components, and the only container is the page column, which follows the viewport.
  Worth revisiting if a component is ever placed in containers of different widths.

## Consequences

Benefits:
* One breakpoint, placed by the content and in em, so it responds to enlarged text and zoom,
  which is where headings broke.
* The mid-word break recorded in DDR-001 is fixed with the existing steps. No new size is added.
* A phone at the default font size keeps the full type and spacing scales.
* The strategy lives in one place: five role tokens and one media query. No component knows the
  breakpoint.
* Reading order, target size, and hover are settled for every component before any exists.

Tradeoffs:
* Below the breakpoint, item titles are the size of body text, and `h3` to `h6` look alike.
* The narrow values apply to everything below 20em, including widths where the full scale would
  mostly have fitted, such as a 360px phone with its text at 125%.
* A component that wants a different layout on wide screens, such as dates beside titles, needs a
  new decision first.
* The breakpoint is a literal value in `app/tokens.css` rather than a token, as CSS requires, so a
  component cannot refer to it.
* `--target-size-min` is defined before anything uses it.

Risks:
* The breakpoint was placed using specimen words. Real job titles and company names should be
  checked once they exist, especially long single words in section and item titles. If one breaks
  at 20em, the breakpoint moves, by superseding this DDR.
* At 320px and 200%, words wider than the 9rem column still break, in headings and in body text.
  Nothing is clipped.
* The media query is a width query, so it also applies in print. A sheet of paper is wider than
  20em, so print gets the full scale, which #14 may change.

## Related Documents

* GitHub issue #13, which this decision resolves, and its comment carried over from #10
* GitHub issue #2, Design Foundation
* ADR-001, which set the styling approach
* ADR-002, which established the single page, made descriptions plain strings, and made the page
  the CV
* DDR-001, the typographic system, whose adaptation across viewport sizes this record decides
* DDR-002, the colour system
* DDR-003, spacing and layout, whose adaptation across viewport sizes this record decides
* GitHub issue #14 (print), which decides how the page adapts to paper
