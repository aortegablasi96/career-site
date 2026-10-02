# DDR-069-Education Cards Lead Off the Site, as a Role's Card Leads to Its View

Status: Accepted

Date: 2026-09-27

**Reworded per #291**: the hint reads "Open a credential to learn more", where it read "Click any credential…", so it names no input device. Its place and look are unchanged.

**Amends DDR-057, DDR-059, DDR-063, DDR-064 and DDR-043.** Each card in the education timeline is
now a link, and it looks, moves and answers exactly as a role's card does. The two degrees lead to
the Universitat Politècnica de Catalunya's site. The two certifications lead to each one's Credly
badge. Each opens a new tab. A hint stands above the row, as one stands above the experience row.

## Context

Since #173 the experience and education timelines are one pattern (DDR-010, DDR-057). Since #176
and DDR-059 a role's card is a link to its view, and DDR-063, DDR-064 and DDR-065 gave it a resting
elevation and a hover. A credential's card stayed flat and still because it led nowhere. So a reader
who had learned that a role's card opens was shown a card that looks the same and does nothing.

On #200 the owner asked for the education cards to link out and to answer the pointer as the role
cards do. The degrees lead to the UPC's official site. The certifications lead to the Credly badges
the owner keeps in their knowledge base, where PMI verifies each one.

## Decision

* **Each education card is one link, in the role card's pattern.** The credential's name is the link,
  and its box is stretched over the whole column. So the card, its dates and its dot are one target
  and one tab stop, as DDR-064 has it for a role. At rest, under the pointer and on keyboard focus
  the card draws exactly what a role's card does, over the same 150ms. It rests at
  `--shadow-raised`. Lit, it takes the accent edge, `--shadow-card-hover` beneath its resting
  shadow, the accent on its name, the 4px lift, and the darker dates and dot. A reader who prefers
  reduced motion gets the edge, the shadow and the accent, with no lift and no transition. The
  timeline draws both kinds of card with one set of rules, so the two cannot drift apart.
* **Where each card leads**:

  | Card | Leads to |
  | ---- | -------- |
  | Bachelor's degree in IT | https://www.upc.edu |
  | Master's degree in IoT | https://www.upc.edu |
  | Project Management Professional (PMP) | its Credly badge, `…/badges/0453ee02-…` |
  | PMI Certified Professional in Managing AI (PMI-CPMAI) | its Credly badge, `…/badges/a8e7a58f-…` |

* **Each opens a new tab**, as the LinkedIn and GitHub pills do, per DDR-043, which this widens to
  the education cards. The owner chose it on #200: like a profile, each is a page off the site that
  a reader visits and comes back from. As DDR-044 has it, nothing on the card shows it. Its
  accessible name is its visible name, a comma, then "opens in a new tab", from the same string the
  pills use. `rel="noopener"` is written out, as it is on the pills.
* **The hint "Click any credential to learn more" stands above the education row**, in DDR-067's
  style and place: 11px in the faint ink, after the information mark, 8px above the dates. The owner
  chose the words on #200. The hint and the row are one block, as experience's are, so paper keeps
  the heading with the timeline's first entry as it did.
* **The education row takes no tab stop of its own**, as DDR-059 decided for experience: tabbing to
  a card scrolls the row to it.
* **The page links to a Credly badge and draws none of it.** DDR-068's rule stands: no PMI or PMP
  logo, and no badge image, until the owner confirms PMI's written authorization.
* **Paper is unchanged.** A card prints no address, as a role's does not, and the hint does not
  print. On paper a linked card is no longer positioned, since nothing is stretched over it. A
  positioned card is painted after everything in flow, so both browsers wrote its text at the foot
  of the sheet's PDF, away from its dates. That fault had been in the experience timeline since
  #176, and education would have had it too. Both now read in order.

## Alternatives Considered

### Open in the same tab, as a role's card does

Pros:
* One behaviour for every card on the timelines.

Cons:
* A role's card opens a page of this site. A credential's opens someone else's, which DDR-043 already
  treats as a new tab for the profiles. The owner chose the new tab.

### No hint above the education row

Pros:
* The cards' elevation and hover already say they can be clicked, and the page is one line shorter.

Cons:
* The experience row has one, and the two rows are one pattern. The owner chose the hint.

### Link each degree to its own programme page or to its school

Pros:
* A reader lands closer to what the owner studied.

Cons:
* Programme pages move and are renamed, and the degrees are shown under the university, per
  DDR-068. The owner chose the UPC's home page.

## Consequences

Benefits:
* The two timelines are one pattern in behaviour as well as in look.
* A reader can verify each certification with PMI, through its badge, in one click.

Tradeoffs:
* The page leads a reader off the site from four more places. Each opens a new tab, so the page
  stays open behind it.
* The education section is one line taller on screen, for the hint.

Risks:
* A Credly badge's address can change if PMI reissues a badge. The addresses live in
  `content/credentials.ts`, beside the rest of the credential.

Measured on the built page in Chromium at 1280px: an education card and a role's card compute the
same shadow, edge, lift, date colour and title colour at rest, under the pointer on their dates, and
on keyboard focus. Clicking a certification's dot opens its badge in a new tab. Swept every 10px from
300px to 900px at the browser's default text size and at 200%: nothing scrolls sideways. The lifted
card keeps 20px inside the row below it, so its shadow is not clipped. Printed to A4 in Edge and
Firefox with background graphics on and off, against the tree before: five sheets in all four, every
sheet pixel-identical, the same words, and both timelines' text now in reading order.

## Related Documents

* #200
* DDR-057 and DDR-010: the two timelines, one pattern
* DDR-059: a role's card is a link, and the hint above the row
* DDR-063, DDR-064 and DDR-065: the card's rest, hover, focus and whole-column target
* DDR-067: the shared hint
* DDR-043 and DDR-044: links that open a new tab, and how that is announced
* DDR-068: the UPC logo, and why the page draws no PMI logo or badge
* DDR-015 and DDR-032: print
