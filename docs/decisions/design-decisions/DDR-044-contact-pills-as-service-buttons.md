# DDR-044-Contact Pills as Each Service's Own Button

Status: Accepted

Date: 2026-09-19

**Amended by DDR-047 in one respect: the GitHub pill's hover fill.** It was GitHub's Gray 5,
`#232925`, which was so close to the resting black that the pill barely changed. It is now
`#3d423f`, a lighter grey in the same hue, and white on it is 10.25:1. Everything else here stands.

**Supersedes in part DDR-043**: its visible cue. The arrow after the LinkedIn and GitHub labels is
removed. Everything else in DDR-043 stands: the two pills still open a new tab with
`rel="noopener"`, and the tab is still announced before the pill is chosen, now in the link's
accessible name rather than by a named image.

**Amends DDR-025**: the palette gains ten colours, which are the three services' own. DDR-025's
failing pairings are unchanged, and every new pairing passes.

**Amends DDR-010 and DDR-025 on the contact pills**: they are no longer the site's outlined indigo
pill. Each is its service's own button. DDR-010's icon as a redundant cue, DDR-029's labels,
DDR-027's size and DDR-035's hover and focus still apply.

## Context

Epic #131 refines how the contents bar and the contact pills behave. Issue #135 is its last story.
It asks the pills to carry each service's official mark, as the brand's guidelines allow. Until
now each pill carried a line drawing of ours in the pill's indigo.

Three versions were reviewed with the owner in the running app on #135:

1. LinkedIn's and GitHub's marks in their brand colours, on the site's white pill.
2. One solid set in the pill's indigo, and the new-tab arrow removed. The owner asked for the
   arrow to go, and for the marks to look the way these links look across the web.
3. The owner then said they did not want LinkedIn's and GitHub's logos recoloured, and asked for
   each button to take the official design. Once that was built, they asked for something similar
   for the email pill, and chose Gmail's own button over a neutral dark fill and over leaving it
   outlined.

The brands set the limits. LinkedIn's guidelines (brand.linkedin.com) allow the [in] in blue, black
or white, and forbid changing its colour or shape. GitHub's (brand.github.com) allow the mark in
black or white, and forbid changing its colour. Gmail's M is four colours, and those colours are
the mark.

## Decision

**Each contact pill is its service's own button. LinkedIn's is filled in LinkedIn blue, and
GitHub's in GitHub's Process Black, each with the brand's white mark and a white label. Email's
is Gmail's light button: white, with Google's grey edge and near-black label, and Gmail's M in its
own colours. Nothing on a pill shows that it opens a new tab; the LinkedIn and GitHub links are
named "LinkedIn, opens in a new tab" and "GitHub, opens in a new tab".**

* **No mark is recoloured.** The LinkedIn and GitHub marks are drawn in `currentColor`, and the
  stylesheet only ever sets that to a colour the brand publishes: white on the brand's fill on
  screen, and the brand's own colour on paper. Gmail's M carries its own fills in its paths, as the
  photo carries its colours in its pixels, and nothing on the page sets them.
* **The marks are the published ones.** GitHub's Invertocat is the path from
  `GitHub_Invertocat_Black.svg` in GitHub's logo kit, on its own 98 by 96 grid. Gmail's M is the
  logo's own SVG, on its own grid. LinkedIn publishes the [in] as raster files only, so its path is
  the vector tracing Simple Icons carries, under CC0.
* **The fills are the brands' colours.**

  | Token                           | Value     | What it draws                                                |
  | ------------------------------- | --------- | ------------------------------------------------------------ |
  | `--color-linkedin`              | `#0a66c2` | LinkedIn's blue: the fill's basis, and the ink on paper      |
  | `--color-github`                | `#101411` | GitHub's Process Black, from its brand palette: the same     |
  | `--color-surface-linkedin`      | the blue  | the LinkedIn pill's fill                                     |
  | `--color-surface-linkedin-hover`| `#004182` | a darker step of the same blue, under the pointer            |
  | `--color-surface-github`        | the black | the GitHub pill's fill                                       |
  | `--color-surface-github-hover`  | `#3d423f` | a lighter grey in GitHub's hue, under the pointer, per DDR-047 |
  | `--color-on-brand`              | `#ffffff` | the mark and the label on either fill                        |
  | `--color-google-ink`            | `#1f1f1f` | the Gmail pill's label, as Google's light button sets it     |
  | `--color-google-border`         | `#747775` | its edge, as Google's light button draws it                  |
  | `--color-surface-google-hover`  | `#eeeeee` | Google's 8% grey state layer over white, under the pointer   |

  The Gmail pill's white is `--color-surface-card`, which the pill already had.
* **Hover and focus change only the fill**, as they do on the CV pill: each brand's fill darkens,
  and Gmail's takes its grey. The mark and the label stay as they are. Keyboard focus draws the
  same as the pointer, and the outline besides, per DDR-035.
* **The arrow is gone, and the name carries the tab.** Each profile link has an `aria-label` made of
  the visible label, a comma and the content string `newTab`, "opens in a new tab". The label comes
  first, per WCAG 2.5.3. The email pill takes its name from its label. Every mark is `aria-hidden`.
* **The email key is `gmail`.** Which mark a contact takes is a key in `content/`, and the email
  contact's is now Gmail's. The CV's content digest moves with it. No fact ADR-005 lists moves.
* **Paper keeps each brand's mark on white.** The fills are surfaces, so the print block drops them
  with every other. There, the LinkedIn and GitHub pills take the brand's colour as their ink. That
  prints each mark in the colour its brand publishes for white paper, and each label in the same
  colour. Gmail's M prints in its own colours, and its label in Google's near-black.

| Pairing                                  | Ratio   | Asked | Meets |
| ---------------------------------------- | ------- | ----- | ----- |
| White on LinkedIn's fill                 | 5.69:1  | 4.5:1 | Yes   |
| White on LinkedIn's hover fill           | 10.10:1 | 4.5:1 | Yes   |
| White on GitHub's fill                   | 18.58:1 | 4.5:1 | Yes   |
| White on GitHub's hover fill             | 10.25:1 | 4.5:1 | Yes   |
| LinkedIn's blue on the page (paper)      | 5.31:1  | 4.5:1 | Yes   |
| GitHub's black on the page (paper)       | 17.34:1 | 4.5:1 | Yes   |
| Google's ink on white                    | 16.48:1 | 4.5:1 | Yes   |
| Google's ink on its hover fill           | 14.21:1 | 4.5:1 | Yes   |
| Google's ink on the page (paper)         | 15.39:1 | 4.5:1 | Yes   |
| Google's edge on white                   | 4.53:1  | 3:1   | Yes   |
| Google's edge on its hover fill          | 3.90:1  | 3:1   | Yes   |

`app/tokens.test.ts` holds all eleven.

## Alternatives Considered

### Brand-coloured marks on the site's white pill (version 1)

Cons:
* Two pills carried marks in colours that did not match their labels. The owner asked instead for
  the marks to look the way these links look across the web.

### One solid set in the pill's indigo (version 2)

Cons:
* It recolours LinkedIn's and GitHub's marks, which both brands forbid. The owner rejected it on
  seeing it.

### A neutral dark fill for email, or leave it outlined

Pros:
* No third brand on the page, and the pill stays right if the address ever leaves Gmail.

Cons:
* The owner chose Gmail's button, to match what LinkedIn and GitHub now do.

### A visible cue for the new tab

Cons:
* The owner asked for the arrow to go. A new tab announced to no one would break DDR-006's rule and
  WCAG technique G201, so the name carries it instead.

## Consequences

Benefits:
* Each pill looks like the service it leads to, in that service's own colours, and no brand's mark
  is altered.
* A screen-reader user is still told, before choosing, that a profile opens a new tab.

Tradeoffs:
* **The row of controls is four colours.** Gmail's white, LinkedIn's blue, GitHub's black and the
  CV's indigo. The site's own accent is left on the CV control alone.
* **The email pill names a provider.** If the address ever leaves gmail.com, the pill has to change
  with it, which is why the key is `gmail` rather than `email`.
* **A sighted visitor is not told a profile opens a new tab.** Only assistive technology is.
* **Gmail's colours are literals in `components/icon.tsx`**, not tokens. They are the mark's, not
  the palette's, and a change to them would be a change to Google's logo.
* **LinkedIn's hover blue is not published in LinkedIn's guidelines.** It is a darker step of the
  same blue, chosen here.

Measured on the built site against the tree before, in Edge, every 10px from 300px to 900px and at
1280px and 1536px, at the default text size and at 200%:
* Nothing scrolls sideways.
* The controls row never takes more rows than before. It takes one fewer at 490px to 520px and at
  770px at the default size, and at 450px to 480px and 500px to 540px at 200%, where the arrow's
  width is given back.
* Each pill is 37.5px tall, as before.

The printed CV is six sheets in Edge and Firefox, with background graphics on and off, and its text
is identical to the tree before. The only pixels that change are the three marks and labels on
sheet 1, each printing in its brand's colours.

## Related Documents

* Issue #135 and Epic #131; issue #134
* DDR-043, whose arrow this removes; DDR-006, whose rule on new windows still holds
* DDR-010, the pills; DDR-025, the palette; DDR-027, their size; DDR-029, their labels; DDR-035,
  hover and focus; DDR-015, print
* ADR-001, which puts the site's colours in the tokens; ADR-002, which keeps "opens in a new tab"
  in `content/`; ADR-005, the CV's shared facts
* LinkedIn's [in] logo guidelines, brand.linkedin.com/in-logo; GitHub's logo and colour
  guidelines, brand.github.com/foundations/logo and /color
