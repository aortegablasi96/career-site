# DDR-044-Standard Service Marks on the Contact Pills

Status: Accepted

Date: 2026-09-19

**Supersedes in part DDR-043**: its visible cue. The arrow after the LinkedIn and GitHub labels is
removed. Everything else in DDR-043 stands: the two pills still open a new tab with
`rel="noopener"`, and the tab is still announced before the pill is chosen, now in the link's
accessible name rather than by a named image.

DDR-010's icon as a redundant cue, DDR-025's palette, DDR-029's labels and DDR-035's hover and
focus states all stand. The palette gains nothing, and every mark is still drawn in the pill's ink.

## Context

Epic #131 refines how the contents bar and the contact pills behave. Issue #135 is its last story.
It asks the pills to carry each service's mark. Until now each pill carried a line drawing of ours:
an outlined envelope, and outline sketches of LinkedIn's and GitHub's marks. A visitor recognises
the mark they already know faster than a sketch of it.

A first version, on the same pull request, drew LinkedIn's [in] in LinkedIn blue and GitHub's
Invertocat in black, which are the colours each brand's guidelines allow. Reviewing it in the
running app, the owner asked for two changes. The arrows should come off the pills. And the marks
should look the way these links look across the web. Asked what that meant, the owner chose a
matching one-colour set in the pill's ink over the brand-coloured set and over a near-black one.
They also chose to keep the new tab and announce it only to assistive technology, over returning
to the same tab or opening a tab unannounced.

## Decision

**Each contact pill carries a solid mark in the pill's indigo: a filled envelope, LinkedIn's [in]
and GitHub's mark, drawn as one set on a 24 unit grid. Nothing on a pill shows that it opens a new
tab. The LinkedIn and GitHub links are named "LinkedIn, opens in a new tab" and "GitHub, opens in a
new tab".**

* **One set, the common form.** The three are the solid glyphs most sites put beside these links.
  The envelope is Material Design's `mail` (Apache License 2.0). The [in] and the cat are Simple
  Icons' vectors (CC0), which are the tracings icon libraries use widely. All three are filled, on
  the same grid, and share one weight. They replace strokes of ours. The CV control's download icon
  is out of #135's scope and stays a line drawing.
* **In the pill's ink, through `currentColor`.** Each mark is the colour of its label, so it follows
  DDR-035's hover and focus with no rule of its own, and the palette gains no colour. The [in]
  letters and the cat are cut out of their shapes, so they show the pill's white at rest and its
  pale indigo under the pointer. The accent is 6.29:1 on the white and 5.62:1 on the hover fill,
  which are DDR-025's own figures.
* **The arrow is gone, and the name carries the tab.** Each profile link has an `aria-label` made of
  the visible label, a comma and the content string `newTab`, "opens in a new tab". The label comes
  first, so the name a speech-input user reads off the pill is still the start of the accessible
  name, per WCAG 2.5.3. The email pill takes its name from its label, as before. Every mark is
  `aria-hidden` again, so no image on the page is named "opens in a new tab".
* **Size and place are unchanged.** Each mark is 1em square before the label, with the pill's
  `--space-small` gap. Without the arrow, the two profile pills are one mark and one gap narrower,
  which is the width they had before DDR-043.

## Alternatives Considered

### Brand colours (the first version of this record)

Pros:
* It follows both brands' guidelines. LinkedIn asks for blue, black or white and GitHub for black
  or white, and neither allows its mark to be recoloured.

Cons:
* It puts three colours into a row of four controls, and gives two pills a mark that does not match
  their label. The owner saw it in the app and chose the one-colour set.

### One-colour set in the near-black heading ink

Pros:
* Both brands allow black, so it keeps to both sets of guidelines.

Cons:
* Each mark would differ from its label's indigo. The owner chose the pill's ink.

### Return to the same tab

Cons:
* A visitor who checks a profile leaves the page, which is what #134 fixed.

### A new tab, announced to no one

Cons:
* Breaks DDR-006's "nothing opens a new window unannounced" and WCAG technique G201. A
  screen-reader user who presses back in the new tab finds that it does nothing.

### Visually hidden text in the link, instead of `aria-label`

Cons:
* The site has no visually hidden utility, and the usual one needs `position: absolute` on an
  element, which `components/stylesheets.test.ts` admits only on a pseudo-element. It would also be
  laid-out text that could reach the printed PDF's text layer. `aria-label` adds no element and no
  style, and it never prints.

## Consequences

Benefits:
* The three pills carry marks a visitor recognises at once, as one matching set.
* The pills are cleaner. Only the label and one mark are visible on each.
* A screen-reader user is still told, before choosing, that a profile opens a new tab.

Tradeoffs:
* **A sighted visitor is not told about the new tab.** DDR-043's arrow told everyone. Now only
  assistive technology is told, and a sighted visitor learns it when the tab opens. The owner chose
  this knowingly.
* **LinkedIn's and GitHub's marks are recoloured**, to the pill's indigo, which both brands'
  guidelines forbid. It is the common practice on the web, and the owner chose it. The marks are
  used only to link to the owner's own profiles, and nothing implies an endorsement.
* **`aria-label` replaces the name the pill's content would give.** The visible label and the name
  are both built from content strings, so they cannot drift apart. But a browser's page translator
  may translate the visible label and not the `aria-label`. The site has one language, so this
  does not arise today.

Measured on the built site against the tree before, in Edge, every 10px from 300px to 900px and at
1280px and 1536px, at the default text size and at 200%:
* Nothing scrolls sideways.
* The controls row never takes more rows than before. It takes one fewer at 490px to 520px and at
  770px at the default size, and at 450px to 480px and 500px to 540px at 200%.

The accessibility tree names the four controls "Email", "LinkedIn, opens in a new tab", "GitHub,
opens in a new tab" and "Get my CV".

The printed CV is six sheets in Edge and Firefox, with background graphics on and off, and its text
is identical to the tree before. The only pixels that change are the three marks on sheet 1, and
each prints legibly in the pill's indigo.

## Related Documents

* Issue #135 and Epic #131; issue #134
* DDR-043, whose arrow this removes; DDR-006, whose rule on new windows still holds
* DDR-010, which gives each pill an icon as a redundant cue
* DDR-025, the palette; DDR-029, the labels; DDR-035, hover and focus; DDR-015, print
* ADR-002, which keeps "opens in a new tab" in `content/`; ADR-004, on binary assets
