# DDR-002-Colour System

Status: Superseded

Date: 2026-09-10

Superseded by DDR-012, the colour system of the career page redesign, which changes the surface,
the accent and the inks and adds the tinted surfaces the new patterns need. This record's focus
indicator, its underline rule, its "colour is never the only signal" rule and its decision against a
dark mode are carried forward there.

## Context

The site is almost entirely text. ADR-002 established a single scrolling page of structured
records, and made that page the CV, so it is also printed and saved as a PDF. Colour on a page
like this has little to decorate. Its jobs are to make text comfortable to read, to separate
primary text from metadata, to mark what can be clicked, and to show where keyboard focus is.

Colour contrast is the most commonly failed accessibility criterion on personal sites. Issue #11
asks for the colour system to be decided and verified once, so that every later page inherits a
passing baseline instead of being audited on its own. It also asks for restraint: a small,
deliberate palette, with colours named by role rather than by appearance.

The constraints are:

* **WCAG 2.1 AA.** Text contrast is at least 4.5:1, or 3:1 for large text (1.4.3). Non-text
  elements that carry meaning, such as focus indicators and borders that convey state, are at
  least 3:1 against what surrounds them (1.4.11). Colour is never the only way information is
  conveyed (1.4.1). Keyboard focus is always visible (2.4.7).
* **ADR-001**: design values are CSS custom properties defined once at the root.
* **DDR-001**: metadata is set at `--font-size-small`, 14.4px, so it is normal text under WCAG
  and needs the full 4.5:1.
* **ADR-002**: descriptions are plain strings, so links appear on their own, for example as
  contact or project links, rather than inside running text.

These are out of scope and decided elsewhere: spacing and layout (#12), responsive behaviour
(#13), print colour treatment (#14), and imagery.

## Decision

### Palette

The site uses one surface, two text colours, one accent, and one border colour. The focus
indicator uses the accent.

| Token                    | Role            | Value                 | Used for                                              |
| ------------------------ | --------------- | --------------------- | ----------------------------------------------------- |
| `--color-surface`        | Page surface    | `#fbfaf8`             | The page background. It is the only surface.          |
| `--color-text`           | Primary text    | `#1c1b19`             | Body text and headings                                |
| `--color-text-secondary` | Secondary text  | `#5e5a54`             | Metadata such as dates, places, and labels; `small`   |
| `--color-accent`         | Accent          | `#1d4e89`             | Links. It is the only hue on the site.                |
| `--color-focus`          | Focus indicator | `var(--color-accent)` | The keyboard focus outline                            |
| `--color-border`         | Border          | `#8c877f`             | Rules and borders, when layout needs them             |

* **The surface is a warm off-white, not pure white.** It is slightly softer on screen across a
  long page of text, and it suits the document feel of the serif headings. It costs almost
  nothing in contrast: primary text is 16.50:1 on it, against 17.21:1 on white.
* **Primary text is a warm near-black, not pure black.** It has less glare against the light
  surface and is still well above the 7:1 of WCAG's enhanced level (1.4.6, AAA).
* **Secondary text is for lower emphasis only.** It is used at the smallest step of the type
  scale, so it keeps a clear margin above 4.5:1 rather than sitting on the line.
* **The accent is an ink blue.** Blue is the colour visitors already recognise as a link, and a
  deep, desaturated blue sits quietly beside the serif headings. It is used sparingly, so it
  stays meaningful. The owner chose it from the four options set out under Alternatives
  Considered.
* **The border meets 3:1.** Any border can therefore carry meaning, such as the edge of a
  control or a state, without a second, stronger border colour to choose between.
* **The focus colour is its own role**, even though it currently equals the accent. The two can
  diverge later by changing one line.

### Measured contrast

Ratios are calculated with WCAG 2.1's relative luminance formula. `app/tokens.test.ts` checks
every pairing below against the tokens as written, so a change to a colour fails the tests
until this record is revised.

Text pairings:

| Foreground               | Background        | Ratio   | Required | Result                     |
| ------------------------ | ----------------- | ------- | -------- | -------------------------- |
| `--color-text`           | `--color-surface` | 16.50:1 | 4.5:1    | Pass, and meets AAA (7:1)  |
| `--color-text-secondary` | `--color-surface` | 6.57:1  | 4.5:1    | Pass                       |
| `--color-accent`         | `--color-surface` | 8.04:1  | 4.5:1    | Pass, and meets AAA (7:1)  |
| `--color-surface`        | `--color-accent`  | 8.04:1  | 4.5:1    | Pass, and meets AAA (7:1)  |

The last row is surface-coloured text on an accent fill. Nothing uses it yet. It is recorded so
that a later filled element, such as a button, can use it without a new measurement.

Non-text pairings:

| Element                  | Against           | Ratio  | Required | Result |
| ------------------------ | ----------------- | ------ | -------- | ------ |
| `--color-focus`          | `--color-surface` | 8.04:1 | 3:1      | Pass   |
| `--color-border`         | `--color-surface` | 3.42:1 | 3:1      | Pass   |

* **All text is held to 4.5:1**, including headings large enough for the 3:1 exception. There is
  then no size threshold for later work to get wrong.
* **Only the pairings above are verified.** Any other combination, such as secondary text on the
  accent, is not to be used for text until it has been measured and recorded.
* **Accent and primary text are 2.05:1 apart.** That is too close for a link to be told apart
  from surrounding text by colour, which is why links are underlined.

### Colour is never the only signal

* **Links are always underlined.** The underline, not the colour, is what identifies a link. The
  colour reinforces it.
* **Secondary text is also smaller.** Metadata is distinguished by its size and position, and
  its colour only reinforces that. Nothing is lost when the page is seen in greyscale or with
  the colours overridden.
* **Visited links are not distinguished.** The page has few links and no navigation between
  pages, so there is little to track. A visited colour would also add a pairing to verify.
* **Any later state**, such as a current section or an error, needs a cue other than colour,
  such as text, an icon, weight, or an underline.

### Focus indicator

* **Keyboard focus shows a 2px solid outline in `--color-focus`, 2px away from the element.**
  It is applied with `:focus-visible`, so it appears for keyboard focus and not when an element
  is clicked with a mouse.
* **The offset puts the outline on the surface**, so it is measured against the surface, at
  8.04:1. This holds on every surface it can appear on, because there is only one.
* **It is an outline, not a box shadow.** In forced-colours modes, such as Windows contrast
  themes, the browser replaces the site's colours with the user's and removes shadows, but keeps
  outlines. The indicator therefore survives.
* **2px** is the thickness WCAG 2.2 uses as the benchmark for a focus indicator (2.4.13, Focus
  Appearance).
* The width and offset are tokens, `--focus-outline-width` and `--focus-outline-offset`. They
  are in px because they are strokes rather than text. They grow with browser zoom but not with
  the browser font-size setting.

### Dark mode

**The site does not support a dark mode.** This is a decision, made by the owner, and not an
omission:

* **The page is also the CV.** Its canonical form is dark text on a light ground. A second
  palette is a second version of the document, and the print stylesheet would have to reset it.
* **One palette means one set of ratios.** A dark palette would double the pairings to measure,
  now and for every colour added later, and any future image would need checking on both.
* **Near-black on a soft off-white is comfortable** for most readers of a text page.
* **Readers who need other colours can still have them.** Forced-colours modes, reader modes,
  and browser extensions replace the palette. Because no information depends on colour alone,
  nothing is lost when they do.

The root declares `color-scheme: light`, so the browser draws its own parts of the page, such as
scrollbars and form controls, in their light form, to match the palette.

Some browsers can darken pages automatically, such as Samsung Internet's dark mode. The site
does not try to prevent this, and the combinations it produces are not verified.

To add a dark mode later, supersede this DDR. The tokens are named by role, so the change is a
second, measured set of values for the same tokens under `prefers-color-scheme: dark`, and no
component changes.

### Where the system lives

* `app/tokens.css` holds the colour and focus tokens, defined once at `:root`.
* `app/globals.css` applies them to plain HTML: the page surface and text colour, `small`, links,
  and the focus outline.

Components use the tokens. No component sets a literal colour. A new surface, such as a tinted
band behind a section, is a new colour decision: every text pairing and the focus outline must
be measured against it and recorded by superseding this DDR.

## Alternatives Considered

The first three options were accent directions offered to the owner alongside ink blue. Each
used the same surface, text, secondary text, and border colours as the chosen palette.

### Option A: Deep teal accent (`#0b6b66`, 6.08:1)

Pros:
* More distinctive than blue, while staying calm.

Cons:
* The lowest contrast of the options, although still well above AA.
* Less immediately recognisable as a link colour.

### Option B: Oxblood accent (`#8b2e2e`, 7.96:1)

Pros:
* Editorial and bookish, and a strong partner for the serif headings.

Cons:
* Red-family hues read as warnings or errors, and it would clash with any error state added
  later.

### Option C: Monochrome, with no accent hue

Links would be in the primary text colour and underlined, and the focus outline would be
near-black.

Pros:
* The most restrained option: three colours and no hue at all.

Cons:
* Links rely on the underline alone, so they are less easy to spot when scanning.
* The page has no single point of colour to lead the eye.

### Pure white surface and pure black text

Pros:
* The highest contrast possible, 21:1.

Cons:
* Harsher glare across a long page of text.
* The off-white surface and near-black text lose little contrast and read more softly.

### Light and dark palettes, following the visitor's system preference

Pros:
* Respects a preference many visitors set.

Cons:
* Doubles the pairings to verify, now and for every later colour.
* A second version of a page that is also the canonical CV, which print would have to reset.

Rejected by the owner, for the reasons under Dark mode.

### A lighter, decorative border colour alongside a 3:1 one

Pros:
* Softer hairlines between sections.

Cons:
* Two border colours, with a rule about which one may carry meaning that nothing enforces.
  Rejected in favour of one border colour that is always safe to use.

### A focus outline in a separate hue, such as amber

Pros:
* Clearly different from link colour.

Cons:
* A second hue in a palette that otherwise has one.
* Yellows and ambers fall below 3:1 against a light surface unless they are darkened so far that
  they lose the distinction.

### Links distinguished by colour, without an underline

WCAG accepts this when the link colour is at least 3:1 against the surrounding text and another
cue appears on hover and focus.

Pros:
* A cleaner look in running text.

Cons:
* No accent tried here is 3:1 from the primary text. Reaching it would mean a much lighter
  accent, which would then lose contrast against the surface.
* The underline is simpler and works for everyone. Links rarely sit inside running text here
  anyway, because descriptions are plain strings.

## Consequences

Benefits:
* A small vocabulary: one surface, two text colours, one accent, and one border colour. Later
  work chooses from it instead of inventing values.
* Every text pairing is well above AA, and two meet AAA. Contrast is a property of the system,
  checked by the tests, rather than of individual pages.
* Links and keyboard focus are accessible by default, from the base styles, before any component
  exists.
* The page loses no information in greyscale, in forced-colours modes, or with its colours
  overridden.
* Colours are named by role, so changing one is a change in one place.

Tradeoffs:
* No dark mode.
* Visited links look the same as unvisited links.
* There is a single surface. A tinted section or card needs new measurements and a new DDR.
* Links always carry an underline, even where a designer might prefer a cleaner line.

Risks:
* The accent and the focus outline share a colour, so a focused link has an outline the same
  colour as its text. The 2px offset keeps the two apart, but the result should be checked on
  the first real components.
* A 3.42:1 border is darker than a typical hairline and may look heavy as a divider. The spacing
  and layout work in #12 may prefer whitespace to rules.
* Automatic page darkening in some browsers produces combinations this record has not verified.

## Related Documents

* GitHub issue #11, which this decision resolves
* GitHub issue #2, Design Foundation
* ADR-001, which set the styling approach
* ADR-002, which made content plain strings and the page the CV
* DDR-001, the typographic system, which sets the text sizes these ratios apply to
* GitHub issues #12 (spacing and layout), #13 (responsive strategy), and #14 (print), which
  build on this system. #14 decides how colour is treated in print.
