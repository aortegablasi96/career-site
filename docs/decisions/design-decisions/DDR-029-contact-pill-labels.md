# DDR-029-Contact Pill Labels

Status: Accepted

Date: 2026-09-18

**Amended by DDR-058 in one respect**: the email pill reads "Email me", where this record gives it
"Email". The LinkedIn and GitHub pills and everything else this record decides stand, per #175.

Supersedes **the one bullet of DDR-010** that makes each contact pill's text its own address, and
**DDR-006's rule behind it**. The three pills now read "Email", "LinkedIn" and "GitHub", as the
design draws them. Everything else in both records stands: the pills are still the one place on the
page a link is not underlined, each still carries an icon as a second cue, and the print exception
those records wrote — a contact link prints no address after itself — is kept exactly as written,
for a different reason.

It **adds no token, no component and no declaration**. The whole of it is one string per contact in
`content/`, the component reading it instead of the address, and two comments corrected. The pill's
size, padding, border, fill, radius, shadow, ink and type are the ones DDR-022, DDR-025 and DDR-027
already set.

**It depends on DDR-028 and cannot be read without it.** The footer is what carries the three
addresses once the pills stop doing so, on screen and on paper alike. If the footer is ever removed,
hidden, or stopped from printing, this record has to be reversed with it.

**It does not move DDR-027's table of targets.** The three pills are the shortest they have ever
been — 87 by 37.5 CSS pixels for "Email", where the email address drew 203.2 by 37.5 — and both
dimensions still clear WCAG 2.2's 2.5.8 outright, as they did before. The measurement is below.

## Context

DDR-006 decided that each contact link shows its address as its text, and DDR-010 carried that
forward in the strongest language it uses anywhere:

> **Each contact pill's text is its address**, such as `aortegablasi@gmail.com` and
> `linkedin.com/in/andreu-ob`. This is DDR-006's rule, carried forward, and it is not negotiable:
> the draft labels these "Email", "LinkedIn" and "GitHub" *and* suppresses the printed address after
> a `mailto:` link, which together leave the printed CV with no email address at all.

The objection is about **paper**, not about the label. DDR-010 weighed the labelled variant and
turned it down on exactly two grounds, both stated as facts rather than as preferences: that an
address hidden behind a label is unreachable on a device with no mail client, and that on paper the
label either reintroduces the `mailto:` prefix DDR-006 removed, or suppresses the address and leaves
the printed CV with no way to reach the owner.

On 2026-09-17 the owner decided that the design prevails everywhere, including over the records
written to protect WCAG conformance, and Epic #70 was rewritten around that. #96 then added the
design's footer, per DDR-028, and printed it. That is what changes the argument: the addresses now
appear at the foot of the page and at the foot of the last sheet, in full, as text a visitor can
read and copy. So the second ground is answered by another story rather than by this one, and the
first is answered by the same footer.

**What the design draws** is node 2:50: four pill controls in a row, each a 17px icon beside a
DM Sans Medium 13px label in `#4f46e5` on white, reading "Email" (2:56), "LinkedIn" (2:62),
"GitHub" (2:68) and "Get my CV" (2:75). The page already draws the box, the border, the fill, the
radius, the shadow, the ink and the 13px; the three words are all that is missing.

## Decision

**Each contact pill shows the short label the design draws. The address it links to is unchanged,
and the footer is where the address is written out.**

| Pill     | Shows      | Links to                                 | Written out in |
| -------- | ---------- | ---------------------------------------- | -------------- |
| Email    | "Email"    | `mailto:aortegablasi@gmail.com`          | the footer     |

The email pill's "Email" is "Email me" since #175, per DDR-058.
| LinkedIn | "LinkedIn" | `https://www.linkedin.com/in/andreu-ob/` | the footer     |
| GitHub   | "GitHub"   | `https://github.com/aortegablasi96`      | the footer     |

* **The label is content.** `ContactLink` gains a `label` beside its `text`, per ADR-002, so the
  three words live in `content/introduction.ts` and no prose enters a component. `text` keeps its
  meaning and its value — it is the address — and the footer is the one place that shows it. Each
  is stated once, so the two places cannot disagree about where a contact leads.
* **The pill prints its label and nothing after it.** `.contact::after { content: none }` is the
  declaration DDR-006 already wrote; what changed is why. Before, it stopped an address being
  printed twice. Now it stops `(mailto:aortegablasi@gmail.com)` being printed after "Email", which
  is the prefix DDR-006 removed and the failure DDR-010 named. The address is not lost, because the
  footer prints it.
* **The icon stays, and DDR-010's reason for it is untouched.** It is still a second, non-colour cue
  that a pill is a control, since the pills are the one place a link is not underlined. It is still
  `aria-hidden`, because it repeats what the label says — which is now more literally true than it
  was: the mark and the word name the same service.
* **The accessible name of each pill is its label.** A screen reader announces "Email, link" where
  it announced an address character by character. The address is still reachable, in the footer, as
  text rather than as a link's name.

Nothing else moves. The pill is the same box, on the same white, with the same 1.49:1 border, the
same `--shadow-raised` and the same 13px `--font-size-x-small` it had before. The CV control is
untouched: the design and the page already agreed on "Get my CV".

## Alternatives Considered

### Keep each pill's text as its address, as DDR-010 requires

Pros:

* The email address is the first thing a reader meets, at the top of the page and the top of the
  printed CV, where a recruiter looks first.
* Nothing depends on the footer.
* An address is readable and copyable without reaching the foot of a long page.

Cons:

* It is a difference from the design, which Epic #70 exists to close, and the owner has decided the
  design prevails.
* Three addresses set at 13px are a 636px row, which wraps to four rows on a phone and to three at
  200% text.

### Label the pill and let the base styles print its address after it

Pros:

* The address is on the sheet beside the label it belongs to, rather than at the foot.
* The component writes no rule of its own.

Cons:

* It prints `(mailto:aortegablasi@gmail.com)`, which is the prefix DDR-006 removed deliberately and
  which reads as machinery rather than as an address.
* Every address would then be on the sheet twice, once beside its pill and once in the footer.

### Label the pill and hide the address inside it, visible only in print

Pros:

* The sheet carries the address where the screen carries the label.

Cons:

* DDR-015 forbids print-only content: a component may hide its own screen-only elements, but it adds
  nothing that only paper sees.
* It duplicates the footer's addresses on the sheet.

### Hide the three pills in print entirely, and leave the footer to carry the contacts

Pros:

* A bare "Email" on a sheet of paper tells a reader very little on its own.
* The sheet loses three lines it does not need.

Cons:

* The pills are not screen-only elements, which is the only thing DDR-015 lets a component hide.
  They are a row of the introduction, and the sheet would stop matching the screen at the one place
  the two are most alike.
* The row also tells a reader, at the head of the sheet, that the owner is reachable by three
  routes; the addresses at the foot then say which. Removing it costs the sheet that signpost.

## Consequences

Benefits:

* The four controls match the design exactly, which is what Epic #70 exists for.
* **The controls row is 91px shorter at every phone width**, measured at the browser's default font
  size: 83px tall where it was 174px at 320px, 360px and 390px, because the four pills now fit on
  two rows where they took four. At 200% text it is 340px where it was 457px.
* **The introduction and the contents row now both fit above the fold of a 390 by 844 phone.** The
  four controls end 751.3px down, where they ended 842.3px down, and the contents row begins at
  783.3px, where it began at 874.3px and was not on the screen at all. DDR-010 places the photo
  beside the name to keep the controls above the fold; this is the first time what follows them is
  above it too.
* The printed CV carries each address **once**, from the footer, where it carried each twice — once
  from its pill and once from the footer — which is the cost DDR-028 recorded for landing the footer
  first.

Tradeoffs:

* **The address is no longer at the top of the page or the top of the sheet.** A reader who wants to
  copy the email address rather than follow the link has to reach the footer. On paper that is the
  foot of the fifth sheet.
* **The footer is now load-bearing.** Before this record it repeated something; after it, it is the
  only place on the page, and therefore in the printed CV, where an address is written out.
  `app/page.test.tsx` holds each address to exactly one appearance and `components/footer.test.tsx`
  holds the footer's print behaviour, so removing either fails the suite rather than the CV.
* The content model carries two strings per contact where it carried one, so a reader of
  `content/types.ts` has to understand which of them is shown where.

Risks:

* A visitor on a device with no mail client gets nothing visible from the "Email" pill. This is the
  ground DDR-010 rejected the label on and it is real; what answers it is that the address is still
  on the same page, in the footer, as text. It is further away than it was.
* If a later story gives the footer a narrower treatment — hiding it in print, or dropping the
  addresses from it — the printed CV loses its contact details. The two tests above are what makes
  that loud rather than silent.

## Measurements

All on the built page. Screen measured in Edge at the browser's default font size and at double it;
paper printed to A4 in Edge 153 and Firefox 156 with background graphics on, and printed again from
the tree this branched from.

### The controls row

| Width  | Text | Row before | Row after | Pill widths after     |
| ------ | ---- | ---------- | --------- | --------------------- |
| 320px  | 100% | 174.0px    | 83.0px    | 87 / 104.6 / 97.5 / 121.5 |
| 360px  | 100% | 174.0px    | 83.0px    | same                  |
| 390px  | 100% | 174.0px    | 83.0px    | same                  |
| 1536px | 100% | 37.5px     | 37.5px    | same                  |
| 320px  | 200% | 457.0px    | 340.0px   | 172 / 207.1 / 193 / 240.9 |
| 1536px | 200% | 162.0px    | 73.0px    | same                  |

Each pill is 37.5px tall at 100% and 73px at 200%, before and after: the label changed, the box did
not. Nothing overflows the viewport at 320px, 360px, 390px or 1536px at either text size.

### Targets

Swept every 10px from 300px to 900px at both text sizes, over every `a`, `button` and `[tabindex]`
on the page: **no pair of targets fails WCAG 2.2's 2.5.8 at any width, before or after**. The three
pills are 87 by 37.5 at their smallest, so they clear 24 by 24 outright and are never measured
against the spacing exception — as they did not at 203.2 by 37.5.

### Paper

**Five sheets in Edge and five in Firefox, before and after.** Read back through pypdf and pdfium
both, with the same answer from each:

|                                              | before | after |
| -------------------------------------------- | ------ | ----- |
| `mailto` anywhere on the sheet                | 0      | 0     |
| `aortegablasi@gmail.com`                      | 2      | 1     |
| `linkedin.com/in/andreu-ob`                   | 2      | 1     |
| `github.com/aortegablasi96` as a bare address | 2      | 1     |
| "Email" and "LinkedIn" as words               | 0, 0   | 1, 1  |
| replacement character                         | 0      | 0     |
| apostrophe still U+2019                       | yes    | yes   |

The other occurrences of `github.com/aortegablasi96` on the sheet are the project links' printed
addresses, which are `github.com/aortegablasi96/…` and are DDR-006's rule for a labelled link,
untouched here.

Of the 479 distinct words the page shows in print, Edge gives back every one through both readers.
Firefox gives back all but five: "Copilot-driven" and "data-driven", which it wraps at their
hyphens, and the three level badges, which pypdf spells out letter by letter at +0.1em tracking.
Both are known and pre-existing — the same five are missing from the same PDFs printed from the tree
this branched from — and the second is what DDR-024 records and accepts.

## Related Documents

* docs/decisions/design-decisions/DDR-010-career-page-redesign-structure.md — the rule this
  supersedes, and the record of why it was called "not negotiable"
* docs/decisions/design-decisions/DDR-006-career-page-structure.md — where that rule was first set
* docs/decisions/design-decisions/DDR-028-footer.md — the footer this record depends on, which
  states that it exists partly to make this record possible
* docs/decisions/design-decisions/DDR-015-print-treatment.md — the print rules the label works
  within
* docs/decisions/design-decisions/DDR-027-target-sizes.md — the table of targets this leaves unmoved
* docs/decisions/architecture-decisions/ADR-002-content-model-and-authoring-approach.md — why the
  label is content
* docs/decisions/architecture-decisions/ADR-005-separately-designed-cv.md — the facts the page and
  the downloadable CV must share, which a contact address is not
* Figma, `career-site-design`, node 2:50 — the four controls as the design draws them
* GitHub issue #97, and Epic #70
