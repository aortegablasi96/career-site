# DDR-047-GitHub Pill Hover

Status: Accepted

Date: 2026-09-19

**Amends DDR-044 in one respect: the GitHub pill's hover fill.** DDR-044 set it to GitHub's
Gray 5, `#232925`. It is now `#3d423f`. The resting fill, the mark, the label, the other three
pills and print are unchanged.

## Context

Epic #131 refines how the page is navigated and how its contact pills behave. Issue #143 is its
last story. Since DDR-044 the GitHub pill is filled in GitHub's Process Black, `#101411`, and under
the pointer and on keyboard focus it took GitHub's Gray 5, `#232925`. The two are 1.25:1 apart, so a
visitor can hardly see the pill respond. The LinkedIn pill's fill moves 1.78:1 and the email pill
visibly greys.

The story asks for a hover fill that:

* is clearly lighter, and as easy to see as the LinkedIn pill's change;
* keeps the white label and mark at WCAG AA;
* is a colour GitHub's brand guidelines allow for its button, with the mark not recoloured;
* changes only the colour.

GitHub's published palette (brand.github.com/foundations/color) has six greys. Between Process
Black and white, Gray 5 is the step DDR-044 took, and the next, Gray 4, `#909692`, leaves the white
label at 3.02:1, which fails WCAG 1.4.3. No published grey meets the first two criteria at once. The
guidelines forbid recolouring the mark, and say nothing about a button's fill.

## Decision

**Under the pointer and on keyboard focus, the GitHub pill's fill is `#3d423f`, a grey in GitHub's
own green-tinted hue, between Gray 5 and Gray 4.** The owner chose it on #143.

| Pairing                                   | Ratio   | Asked   | Meets |
| ----------------------------------------- | ------- | ------- | ----- |
| White on the hover fill                   | 10.25:1 | 4.5:1   | Yes   |
| The resting fill against the hover fill   | 1.81:1  | LinkedIn's 1.78:1 | Yes |

* **The step is LinkedIn's.** The GitHub pill's fill now moves 1.81:1 under the pointer, where
  LinkedIn's moves 1.78:1, so the two brand pills respond alike. `app/tokens.test.ts` holds the
  GitHub step at or above LinkedIn's.
* **The hue is GitHub's.** Process Black, Gray 5 and Gray 4 all lean slightly green. The new grey
  keeps that lean, so it reads as the same black lifted, not as a different colour.
* **Only the fill and the border change, as before.** The mark and the label stay white, which is
  a colour GitHub publishes its mark in. No box moves.
* **Paper is unchanged.** Hover does not print, and the fill is a surface, which the print block
  drops.

## Alternatives Considered

### Keep GitHub's Gray 5

Cons:
* 1.25:1 from the resting fill. That is the fault the story reports.

### GitHub Green 5, `#08872B`

Pros:
* It is in GitHub's published palette, and white on it is 4.66:1.

Cons:
* The pill turns green under the pointer rather than lightening, a change of 3.99:1, far stronger
  than any other pill's. The white label would sit just above the AA floor. The owner chose the
  grey.

### GitHub Gray 4, `#909692`

Pros:
* Published, and very plainly lighter.

Cons:
* The white label is 3.02:1 on it, which fails WCAG 1.4.3 and the story's second criterion.

## Consequences

Benefits:
* The GitHub pill visibly answers the pointer and keyboard focus, as the other three pills do.

Tradeoffs:
* **The hover grey is not in GitHub's published palette**, as LinkedIn's hover blue is not in
  LinkedIn's, per DDR-044. Both brands' guidelines govern the mark, which is unchanged, and neither
  sets a button's hover fill.

Risks:
* None to layout or print: a fill takes no space, and hover never prints.

## Related Documents

* Issue #143 and Epic #131
* DDR-044, the contact pills as each service's button, which this amends
* DDR-035, hover and focus; DDR-025, the palette
* GitHub's colour and logo guidelines, brand.github.com/foundations/color and /logo
