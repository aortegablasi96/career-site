# DDR-010-Career Page Redesign Structure

Status: Accepted

Date: 2026-09-16

**Amended by DDR-050** in one respect: the career page is no longer the site's only page. Each
project has a view of its own, which DDR-050 designs. The projects section this record designs is
unchanged by it.

Supersedes DDR-006, the career page's structure. DDR-006's outline, contents row, contact-address
rule, levels-as-words rule and newest-first ordering are carried forward into this record. Its entry
anatomy and its labelled list are not: both were designed for a single 65ch column, and neither
survives a page that places content side by side.

**Superseded in part by DDR-026**, which takes the one sentence below that rejects the draft's
divider between every section. The page now draws all five of them, as the design does, and the
decorative rule this record gives each `h2` is unchanged and unchallenged. Nothing else here moves.

**Superseded in part again by DDR-028**, which takes the one sentence below that says "There is no
footer". The page now draws the design's footer, and DDR-028 answers the three grounds this record
rejected it on. The outline above is untouched, because the footer adds no heading.

**Superseded in part a third time by DDR-029**, which takes the bullet below that makes each contact
pill's text its address — the one this record calls "not negotiable". The pills now read "Email",
"LinkedIn" and "GitHub", as the design draws them, and the ground this record rejected that on is
answered by DDR-028's footer rather than disputed: the addresses are written out there, on screen
and on paper, so the printed CV still carries all three. The rest of the pill is untouched, icon and
all, and so is the print exception that follows from the old rule — a contact link still prints no
address after itself, now so that `mailto:` stays off the sheet. DDR-029 takes DDR-006's rule with
it.

**Superseded in part a fourth time by DDR-031**, which takes the bullet below that says the
contents are "not sticky", and the alternative "Adopt the sticky navigation bar" that it rests on.
The contents are now the design's bar, pinned to the top of the window, and DDR-031 answers the five
grounds one at a time. It declines the scroll-triggered shadow, which `career-site-design` does not
draw, so the fourth ground never arises. Everything else this record says about the contents stands.

**Superseded in part a fifth time by DDR-035**, which takes the sentence under "Links and controls"
that says hover thickens the underline rather than changing the colour. That hover was never built;
every link and control now changes colour under the pointer and on keyboard focus, as the design
draws it. The rest of that bullet stands.

**Amended in two respects by DDR-027.** Its bullet requiring every target to be at least 44 by 44
pixels goes, along with DDR-014's: a target is now the size the design draws it. And its figure for
the draft's contents links, "about 28px tall", is corrected — in `career-site-design` a link's box
is 20px and 28px is the gap between two of them. Both appear below, each marked where it stands.

**Amended by DDR-036** in its spine. The dot is the design's ringed marker — a 12px circle in the
page's surface, a 3px ring of the line's tint and a 6px accent core — and the line runs unbroken
from the first dot to the last, meeting each ring rather than stopping short of it. The rest of the
timeline stands, including the rule that the line does not run past the last row. Marked below.

**Amended by DDR-037** in its skills pattern. A level's badge now stands on a line of its own and
its skills start on the line below, flush with the group's edge, where they ran on from the badge.
The markup order is unchanged, and so is the rest of the skills pattern. Marked below.

**Superseded in part by DDR-042**, which takes the half of the contents bullet "It has no
current-section state and does not animate" that rules out a current-section state. The bar now
marks the link of the section the reader is in. Marked below.

**Superseded in part by DDR-043**, which takes the bullet "Links open in the same tab" for the
LinkedIn and GitHub contact pills alone. They open a new tab and say so with a named arrow; every
other link still opens in the same tab. Marked below.

This record decides the page's **structure and patterns**. The token values the structure reads are
reworked by #44, the CV download by #45, and the print stylesheet by #52. Where this record names a
value, such as the accent, it is because the UI Review settled it and those stories implement it
rather than re-deciding it.

## Context

Epic #25 put the real content on the page, and the page works: it is honest, legible and accessible.
It is also undifferentiated. Every section is the same vertical list of the same shape, because
DDR-006 designed one entry anatomy and one labelled list to serve all five sections inside DDR-003's
single 65ch column. A hiring manager skimming for thirty seconds gets no help from the layout in
telling a role from a credential, or in seeing that the projects are the evidence for the AI claims.

The owner designed a replacement in Figma, in the Make file `career-site`
(https://www.figma.com/make/wgBOKZ5i8ZGk6iyngj9wNT/career-site). It was generated from a brief
carrying this project's own audience, hard constraints and content, so it is a redesign of this page
rather than a generic template. The brief is preserved in the Make file at
`src/imports/pasted_text/career-site-prompt.md`.

Epic #42 adopts it, and the owner decided that where the Figma design and an accepted record
disagree, the design prevails and the record is reworked. Issue #43 produced the UI Review that
turns the draft into a design this project can build, and this record preserves its structural
decisions.

The draft is a first draft, and it breaks its own brief in nine measurable places. The UI Review
corrected each one. The corrections that change the page's *structure* are recorded here; those that
change tokens or print are recorded by #44 and #52.

The constraints are:

* **ADR-001**: no user-facing prose in components, and design values are custom properties defined
  once at the root.
* **ADR-002**: one page, and it is the CV. Descriptions are plain strings, so links stand on their
  own. The downloadable CV adopted on Epic #42 contradicts the part of ADR-002 that rules out a
  separate PDF; #45 owns that conflict.
* **WCAG 2.2 AA**, which the brief restates as hard constraints: 4.5:1 on all text, visible keyboard
  focus, links identifiable without colour, targets of at least 44 by 44 pixels, and an unbroken
  heading order.
* **DDR-007** and **DDR-009**, which constrain how the new typefaces may be prepared and loaded.
* The site is statically exported, so a pattern that needs client-side state is a cost, not a free
  choice.

## Decision

### The page's outline

The page is one `main`, in this order. The outline and heading order are DDR-006's, unchanged.

| Part                         | Element  | Heading                             |
| ---------------------------- | -------- | ----------------------------------- |
| Introduction                 | `header` | `h1`, the owner's name              |
| Contents                     | `nav`    | none; named for assistive technology |
| Experience                   | `section`| `h2`                                |
| Projects                     | `section`| `h2`                                |
| Skills                       | `section`| `h2`                                |
| Education and certifications | `section`| `h2`                                |
| Languages                    | `section`| `h2`                                |

* **Three levels of heading, none skipped.** The name is the `h1`, each section an `h2`, and each
  role, project, skill group and credential an `h3`. The languages have no `h3`.
* **The positioning line is not a heading**, and does not join the outline.
* **Each section is named by its heading**, so it stays a landmark.
* **There is no footer.**

  **DDR-028 supersedes this sentence**, and the design's footer is drawn: the owner's name and the
  three contact addresses, above a hairline, below `main`. It adds no heading, so the outline above
  is untouched; it prints, which is what lets #97 label the contact pills without leaving the
  printed CV with no email address; and DDR-028 answers the three grounds this record turned it
  down on, below.

### The page column

* **The page is a single centred column, at most 1100px wide.** This replaces DDR-003's 65ch column
  and is the change every other change depends on: the page is now wide enough to place things
  beside each other.
* **No line of running text exceeds the measure, 65ch.** The wider page buys columns, not longer
  lines. `--content-width` therefore stops equalling `--measure`, and the measure governs running
  text only. At 1100px the timeline's content column is about 55ch and a project's text column about
  49ch, so the measure binds only on the introduction's summary, which is capped explicitly.
* **Sections are separated by whitespace and their heading**, as DDR-003 decided. A section's `h2`
  carries a decorative rule running to the right margin. The draft's additional divider between
  every section is not adopted: the heading rule already marks the boundary, and two rules doing one
  job is clutter.

  **DDR-026 supersedes that last sentence**, and the divider is drawn. Two things decided it: the
  owner's ruling that the design prevails, and the measurement #72 produced afterwards — the heading
  rule yields entirely to a title that needs the whole line, so at 320px "Education and
  certifications" has no rule at all and, without a divider, no line marks its boundary. The two
  lines are also not the one job this sentence assumed: the divider closes the section above across
  the full column, and the heading rule opens the one below from the title outward. Everything else
  in this bullet stands, the decorative rule included.

  DDR-026 changes none of the spacing: it splits DDR-013's section step in half around the line
  rather than adding to it, so two sections are exactly as far apart as they were.

### The introduction

Above the wide breakpoint, two columns: the photo on the left, the text on the right. Below it, one
column with the photo first.

The text column, top to bottom: the name (`h1`); the positioning line; the location and relocation
note; the summary; the availability sentence; then a wrapping row of four controls.

* **The photo is adopted**, and is placed beside the name rather than above it, so it never pushes
  the positioning line or the contact controls below the fold on a phone. It has meaningful
  alternative text and is not decorative. The Content Brief on #25 had decided against a photo; the
  owner has reversed that, knowingly (see Risks).
* **The four controls are the three contact addresses and the CV download.** They are pills: the
  three contact pills outlined, the CV pill filled in the accent with white text. Each carries an
  icon as a redundant cue.
* **Each contact pill's text is its address**, such as `aortegablasi@gmail.com` and
  `linkedin.com/in/andreu-ob`. **Superseded by DDR-029**: the pills now carry the design's short
  labels, and DDR-028's footer is what carries the addresses the paragraph below is about. This is
  DDR-006's rule, carried forward, and it is not negotiable:
  the draft labels these "Email", "LinkedIn" and "GitHub" *and* suppresses the printed address after
  a `mailto:` link, which together leave the printed CV with no email address at all. A visitor can
  read the address, copy it and type it whether or not their device opens email links, and on paper
  it prints once with no `mailto:` prefix.
* **Availability is text, not a badge**, as DDR-006 decided. It carries the one message the page
  most needs read, and decoration would draw the eye to itself.
* **The CV control's placement, appearance and target size are decided here.** Whether it downloads
  a file, how that file is produced, and how binary assets are carried on a statically exported site
  are #45's decision.

### The contents

* **A `nav` follows the introduction and precedes the first section**, holding one link to each of
  the five sections, laid out as a row that wraps. Each link's text is its section's title.
* **Superseded by DDR-031: the contents are now a bar pinned to the top of the window.** What this
  bullet said: **It is not sticky.** The draft's sticky bar is rejected: it covers content; it needs an opaque or
  blurred surface, which is a new surface decision for something carrying no information; its links
  are about 28px tall and not underlined; it duplicates this row; and its scroll-triggered shadow
  needs a scroll listener, which makes it a client component in a statically exported site. It
  breaks three of the brief's four hard accessibility constraints at once.
* **It is not collapsed behind a toggle.** The draft's mobile "Sections" disclosure is rejected: it
  hides navigation on exactly the screens where navigation matters most, and needs client-side
  state. A row of five links that wraps to two or three lines is always visible and needs no
  JavaScript.
* **It has no current-section state and does not animate**, as DDR-006 decided. *Superseded in part by
  DDR-042*: the bar now marks the current section's link.
* **It is not printed.**

### The timeline: roles and credentials

A role and a credential share one pattern, replacing DDR-006's entry anatomy for both.

Above the wide breakpoint, three columns: a date column, a narrow spine column, and the content.

1. **The date column**, right-aligned: the date range, and below it the place, for a role.
2. **The spine column**: a dot at the top of each row, and a vertical line running from it to the
   next row. The line does not run past the last row. The whole column is decorative and is hidden
   from assistive technology.
   *Amended by DDR-036*: the dot is a ringed marker with an accent core, level with the title's
   first line, and the line is one unbroken line from the first dot to the last.
3. **The content column**: the title (`h3`) — the job title or the credential's name; the company or
   institution on its own line; then the bullet points for a role, or the thesis sentence for a
   degree.

* **The job title is the heading**, and is the most prominent line of each role. DDR-006's reasoning
  holds: the progression of titles is the story experience tells.
* **The company moves out of the middle-dot metadata line onto its own line**, and the dates and
  place move into the date column. DDR-006's single metadata line does not survive.
* **Below the wide breakpoint the grid collapses to one column**: the dates and place sit above the
  title, and the spine is not rendered at all.
* **Dates are month and year**, with English three-letter months and a spaced en dash. A
  certification shows the single month it was granted. Dates keep their machine-readable value.
* **Entries appear newest first**, so the two certifications precede the two degrees.
* **Each row is kept whole in print.**

### Projects

Above the wide breakpoint, two columns: a media column and the text. Below it, media above text.

1. **The media** is 4:3. Three projects show a screenshot; the Digital Twin project — named the
   Career Conversation Chatbot when this record was written — shows its demo video with browser
   controls, no autoplay and no loop. Each has alternative text, and every entry reads correctly if
   its asset fails to load.
2. **The text**: the project's name (`h3`), a wrapping row of technology tags, the description, then
   the labelled links.

* **Technologies are tags**, so a technical reader can scan a stack without reading prose. This
  replaces DDR-006's use of the metadata line for technologies.
* **Project links stay labelled**, such as "Source code" and "Live site", printing their addresses
  on paper as before.
* **The draft's gradient placeholders and its monogram photo fallback are not adopted.** Both are
  scaffolding for missing assets; #47 supplies the real ones, and the brief excludes gradients.

### Skills

Two columns of groups above the wide breakpoint, one below. Each group is an `h3` — the group's name
— followed by one block per level, strongest first. Each block is a **level badge**, the level as a
word in a tinted pill, followed by that level's skills separated by middle dots. A level with no
skills in a group is left out. *Amended by DDR-037*: the badge stands above its skills rather than
leading their line, and the skills start flush with the group's edge.

* **Levels remain words**: Advanced, Proficient, Basic. No bars, stars, dots or percentages. This is
  DDR-006's rule and the brief's, carried forward.
* **The badge's tint is redundant with the word it contains**, so nothing depends on colour. The
  badge reads the same in greyscale, on paper and to a screen reader.
* **Each group is kept whole in print.**

### Languages

Four cards in a row above the wide breakpoint, two columns between the breakpoints, one column at
the narrowest. Each card holds the language as its term and its CEFR level below it. Marked up as a
description list. The row is kept whole in print.

This replaces DDR-006's labelled list for languages.

### Links and controls

* **Every link stands on its own**, as ADR-002 requires.
* **Links are underlined.** Hover thickens the underline rather than changing the colour, so no
  state depends on hue. Focus keeps DDR-002's 2px outline at 2px offset. **Superseded by DDR-035**
  for the hover: it changes colour, as the design draws it, and focus draws the same colours.
* **Bordered and filled controls are not underlined.** The three contact pills and the CV pill are
  identified by their border or fill together with their icon — two non-colour cues. This is a
  deliberate, limited exception to DDR-002's blanket underline rule, and it extends no further than
  bordered or filled controls.
* **Superseded by DDR-027.** **Every interactive target is at least 44 by 44 CSS pixels on screen**,
  reached by padding rather than by enlarging text. The draft fails this in three places and each is
  corrected. On paper nothing is tapped, so a component drops the minimum and a link takes the
  height of its text, as DDR-006 allows. The three places are the contact and CV pills, the contents
  links and the projects' labelled links; DDR-027 gives all three the size the design draws, and the
  last sentence is the only part of this bullet that survives.
* **Links open in the same tab.** **Superseded in part by DDR-043**: the LinkedIn and GitHub
  contact pills open a new tab, and announce it. Every other link still opens in the same tab.

### One accent, settled

The draft contradicts itself: its stylesheet declares `#0055BB` while its markup uses `#4f46e5`
everywhere and ignores the token. **The accent is `#4338ca`.**

It is the draft's own indigo — the colour of its technology tags and of its link hover — rather than
a colour introduced from outside, and it is the only one of the three that clears 7:1 both as text
on the page and as a background under white text, which the CV control needs:

| Candidate                    | On the page | White on it | |
| ---------------------------- | ----------- | ----------- | --- |
| `#4f46e5`, the draft's markup | 5.87:1     | 6.29:1      | AA, not AAA |
| `#0055BB`, the draft's token  | 6.50:1     | 6.96:1      | AA, not AAA |
| **`#4338ca`, adopted**        | **7.38:1** | **7.90:1**  | **AAA both ways** |

#44 records the full palette and holds it in `app/tokens.test.ts`. Two of the draft's text colours
fail and are replaced there: `#94a3b8`, used for the location, every role's place and the whole
footer, is 2.39:1, and `#64748b`, used for companies and institutions, is 4.44:1.

### Decoration carries no information

The section heading rule, the timeline spine and dots, and the card borders are decorative. Each is
hidden from assistive technology, and removing all of them would lose nothing. They may therefore
sit below the 3:1 that WCAG 1.4.11 requires of meaningful non-text elements. **Any border that ever
carries meaning, such as a state or a control's edge, must meet 3:1 instead.**

### Print

The page is still the CV. ADR-002 is unchanged.

| Element                   | On paper |
| ------------------------- | -------- |
| Profile photo             | Prints, reduced, beside the name |
| CV download control       | Hidden. A download control is dead on paper, and the paper is the CV |
| Contact pills             | Print their text. No address repeated, no `mailto:` prefix. Since DDR-029 that text is a label, and the footer is what prints the addresses |
| Contents                  | Hidden, as `nav` already is |
| Timeline spine and dots   | Hidden |
| Project media             | One still per project: the screenshot, or the video's poster frame |
| Tags, badges, cards       | Print their text; tints and fills dropped |
| Other links               | Print their address after them |

Every tint in the redesign is decorative and redundant with its text, so the page reads the same
whether or not the browser prints background graphics.

**DDR-008's heading-plus-first-item block is still required**, because Firefox still ignores
`break-after: avoid` and the draft relies on exactly that rule. The block now wraps a timeline row
rather than an `article`, so #52 re-expresses it rather than merely keeping it.

### Where the structure lives

Every string remains in `content/`, per ADR-001 and ADR-002, including the photo's alternative text,
each project's media alternative text, and the CV control's label. Components read tokens and write
no width media query beyond the two `app/tokens.css` defines.

## Alternatives Considered

### Keep DDR-006's structure and restyle it

Pros:
* No record is superseded, and no component is rebuilt.
* The single column is the simplest thing that works, and it is accessible today.

Cons:
* It does not address the problem. The page's flatness comes from one entry anatomy serving five
  sections in one narrow column, which is the structure itself, not its styling.
* It sets aside a design the owner made deliberately, from this project's own brief.

Rejected by the owner, who decided on Epic #42 that the Figma design prevails.

### Adopt the Figma draft as drawn

Pros:
* The highest fidelity to the design, and the least deliberation.

Cons:
* Two text colours fail WCAG AA, one at 2.39:1.
* Six type sizes fall below the current floor and two below the 12px accessibility floor.
* Three interactive targets are under 44px.
* The accent is declared as one colour and used as another.
* The printed CV would contain no email address.

Rejected. The draft is a statement of intent, and the brief it was generated from sets the hard
constraints it breaks.

### Adopt the sticky navigation bar

**Taken, by DDR-031**, which answers each objection below rather than disputing it. The bar replaces
the row, so it duplicates nothing. The root's scroll padding keeps both the contents links and
keyboard focus clear of it. Its surface is the design's own, and the link ink's cost on it is
measured. The shadow is declined, so no client component is needed.

Pros:
* The contents stay in reach while reading a long page.

Cons:
* It covers content and needs every section offset below it.
* It needs an opaque or blurred surface, a new surface decision for something carrying no
  information.
* Its links are about 28px tall and not underlined. **Corrected by DDR-027**: they are 20px tall,
  and 28px is the gap between one link and the next.
* Its scroll-triggered shadow needs a scroll listener, making it a client component in a statically
  exported site.
* It duplicates the contents row, which already does the job.

DDR-006 rejected a sticky contents bar for two of these reasons. The draft supplies three more.

### Adopt the mobile "Sections" toggle

Pros:
* Saves vertical space at the top of a phone screen.

Cons:
* It hides navigation on the screens where navigation matters most.
* It needs client-side state for a five-link list.
* A wrapping row of five links is always visible and costs two or three lines.

### Adopt the footer

**Taken, by DDR-028.** All three objections below still hold as statements of fact, and that record
answers each rather than disputing it: the repetition lasts until #97 labels the pills and then
becomes the only place the addresses appear, the grey is DDR-025's `--color-text-faint` whose cost
is already recorded, and the new surface buys the printed CV its contact details.

Pros:
* The contact addresses stay reachable at the foot of a long page.

Cons:
* It repeats what the introduction already says.
* In the draft it is set at 12px in a grey measuring 2.39:1.
* It is new surface area carrying nothing new.

### Keep the contact links labelled "Email", "LinkedIn" and "GitHub"

**Taken, by DDR-029.** Both objections below still hold as statements of fact, and that record
answers each rather than disputing it: the address is now written out in DDR-028's footer, which
both prints and stays on the page for a visitor whose device opens no mail link, and the pill still
prints no address after itself, so the `mailto:` prefix never reappears.

Pros:
* Shorter pills, and a tidier row on a narrow screen.

Cons:
* The address is hidden until the link is followed, and an email link does nothing on a device with
  no mail app configured.
* On paper the address must then be printed after the label, which reintroduces the `mailto:` prefix
  DDR-006 removed — or be suppressed, which is what the draft does, leaving the printed CV with no
  email address.

### Keep one shared entry anatomy across roles, projects and credentials

Pros:
* Fewer patterns, which is what DDR-006 valued.
* One component to build and test.

Cons:
* A project needs a media column and tags; a role needs a date column and a spine. Forcing both into
  one anatomy would mean a component that renders two unrelated layouts by flag.
* Roles and credentials do still share one pattern, so the page gains one pattern here, not two.

## Consequences

Benefits:
* The layout does the skimming work the content cannot. Career progression is visible down a column
  of job titles, the projects show what was built, and strengths are grouped rather than listed.
* The three things a skimmer needs — what the owner does, that they are available, and how to reach
  them — are still all in the introduction, now alongside a photo and a CV download.
* Every text pairing is at 6.92:1 or better and all but one reach AAA, against a draft in which two
  pairings failed AA outright.
* The printed CV keeps the owner's email address, which neither the draft nor a labelled-link
  variant would have done.
* Roles and credentials still share one pattern, and levels are still words, so the page loses
  nothing in greyscale, in forced-colours modes, on paper or to a screen reader.
* No pattern on the page needs client-side state, so the site stays statically exported.

Tradeoffs:
* Six new patterns where DDR-006 had two: the timeline row, the media-and-text row, the tag, the
  level badge, the card and the pill control.
* Five new tinted surfaces — the card, the tag and three level badges — each of which #44 must
  measure and hold in `app/tokens.test.ts`.
* `--content-width` no longer equals `--measure`, so the measure must be applied to running text
  deliberately rather than inherited from the column.
* A second breakpoint, so components may now disagree about what a wide screen is. Only the 48em
  query is permitted, and `components/stylesheets.test.ts` must be changed to allow exactly it.
* The type floor drops from 14.4px to 13px, confined to tags and badges.
* The page carries binary assets — a photo, three screenshots and a video — for the first time.

Risks:
* **The photo is a regional choice.** It is conventional on a CV in Switzerland and Spain, and a
  liability in the UK and the US, where it invites unconscious bias and some applicant tracking
  systems reject it. The owner has adopted it knowingly.
* **Page length.** The page already prints on five A4 sheets (#23). A photo and four stills add to
  it; the denser type scale and the date column subtract. The net effect is unknown until the page
  exists, which is why #52 goes last and must state the printed length.
* **The second breakpoint is a convention, not a guarantee.** DDR-004's single layout meant no
  component could quietly disagree with another. Nothing enforces the replacement automatically
  except the stylesheet test.
* **DDR-009's guarantee does not transfer.** It was won by inspecting Source Serif 4's character
  map. Lora and DM Sans must be inspected the same way before they are accepted, or a saved PDF may
  again spell a word with a character the page does not use.
* **Media weight on GitHub Pages.** Formats, sizes and whether the video is hosted at all are #45's
  and #47's to settle.
* **The level badge colours read as a ranking**, which is intended, and will not read as one in
  greyscale — but the words will.

## Related Documents

* GitHub issue #43, which this decision resolves, and its UI Review, posted as a comment on it
* GitHub issue #42, the Career Page Redesign Epic, on which the owner decided that the Figma design
  prevails over conflicting records
* The Figma Make file `career-site`,
  https://www.figma.com/make/wgBOKZ5i8ZGk6iyngj9wNT/career-site, and the brief it was generated
  from, at `src/imports/pasted_text/career-site-prompt.md`
* DDR-006, the career page structure, which this record supersedes, and GitHub issue #27, which
  produced it
* GitHub issues #44, #45, #47, #48, #49, #50, #51 and #52, which build to this structure
* ADR-001, which keeps prose out of components
* ADR-002, which makes the page the CV; #45 owns the conflict the CV download creates with it
* DDR-001 to DDR-004, the design foundation, which #44 reworks for this structure
* DDR-005, the print stylesheet, and DDR-008, section openings in print, which #52 reworks
* DDR-007, static font files, and DDR-009, no ligatures, which constrain how the new typefaces are
  prepared
* GitHub issue #25, the Career Page, and its Content Brief, whose decision against a photo the owner
  has reversed
