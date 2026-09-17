# DDR-006-Career Page Structure

Status: Superseded

Date: 2026-09-12

Superseded by DDR-010, the career page redesign structure, on 2026-09-16. Epic #42 rebuilds the page
to a design the owner made in Figma, and DDR-010 replaces this record's structure.

What DDR-010 carries forward: the page's outline and heading order, the contents row and the reasons
a sticky bar was rejected, the rule that each contact link shows its address as its text and the
print exception that follows from it, levels as words, and newest-first ordering.

Of those, **the contact-address rule is since superseded by DDR-029**, which labels the pills
"Email", "LinkedIn" and "GitHub". The print exception below survives it: a contact link still prints
no address after itself, so that `mailto:` stays off the sheet, and DDR-028's footer is what carries
the addresses the rule was written to protect.

What DDR-010 replaces: the single metadata line and the entry anatomy shared by roles, projects and
credentials, which become a timeline row and a media-and-text row; and the labelled list, which
becomes level badges for skills and cards for languages. The single 65ch column it assumed is
replaced too, by DDR-003's supersession on #44.

## Context

The design foundation, Epic #2, decided the page's type, colour, spacing, breakpoint, and print
treatment, and deliberately decided no page layout and no components. Epic #25 now puts the real
content on the page, and its section stories need a design to build to. Issue #27 asks for that
design: how the introduction and each section present their content on narrow screens, on wide
screens, and on paper, using only the existing tokens.

The Content Brief, posted on #25, fixes what the page says and in what order:

1. an introduction: name, positioning, a short summary, availability, location, and contact links;
2. experience: five roles, newest first;
3. projects: three portfolio projects and this site, each with its links;
4. skills: four groups, each skill with a level of Advanced, Proficient, or Basic;
5. education and certifications: two degrees and two certifications;
6. languages: four, each with a level.

Its readers are hiring managers and recruiters, who skim and often print, and technical readers,
who open the repositories. Within a minute, a visitor should be able to say what the owner does,
that they are available, and how to reach them.

The constraints are:

* **ADR-001**: no user-facing prose in components. Every string, including link labels and the
  names of levels, lives in `content/`.
* **ADR-002**: one page, and it is the CV. Descriptions are plain strings, so links stand on their
  own, never inside a sentence.
* **DDR-001**: five type sizes and two weights. Headings are serif, everything else sans-serif.
  Metadata is `--font-size-small`.
* **DDR-002**: one accent, used for links. Links are underlined. Colour is never the only signal.
  No tinted surface without a new colour decision.
* **DDR-003**: a single column as wide as the measure. The spacing scale's two smallest steps are
  for composition within an item, and `--space-item` separates items.
* **DDR-004**: one layout at every width, and no width query outside `app/tokens.css`. The markup
  order is the visual order. Interactive targets are at least 44 by 44 CSS pixels. Nothing
  depends on hover.
* **DDR-005**: in print, `nav` is hidden, a link that leaves the page prints its address, and an
  `article` or list item is never split across pages. A component may hide its own screen-only
  elements, and adds no print-only content.

## Decision

### The page's outline

The page is one `main`, in this order:

| Part                          | Element                        | Heading |
| ----------------------------- | ------------------------------ | ------- |
| Introduction                  | `header`                       | `h1`, the owner's name |
| Contents                      | `nav`                          | none; named for assistive technology |
| Experience                    | `section`                      | `h2` |
| Projects                      | `section`                      | `h2` |
| Skills                        | `section`                      | `h2` |
| Education and certifications  | `section`                      | `h2` |
| Languages                     | `section`                      | `h2` |

* **There are three levels of heading, with none skipped.** The name is the `h1`. Each section has
  an `h2`. Each role, project, skill group, and credential has an `h3`. The languages have no `h3`.
  These are the page, section, and item title roles DDR-001 and DDR-004 define.
* **Each section is named by its heading**, so it is a landmark a screen reader can jump to.
* The section titles are content. The design does not fix their wording.

### The introduction

In this order, top to bottom:

1. **The name**, as the `h1`.
2. **The positioning line**, a single line that says what the owner does. It is not a heading. It
   is set at `--font-size-large`, in the body face, at regular weight, in the primary text colour,
   so it reads as the most prominent text after the name without joining the heading outline.
3. **The location**, as a metadata line, in `--font-size-small` and the secondary text colour,
   like the metadata of an entry: where the owner is based, and that they are open to relocation.
4. **The summary**, two or three sentences, in body text.
5. **The availability statement**, in body text. It leads into the contact links, so the
   introduction reads: who the owner is, that they are available, and how to reach them.
6. **The contact links**, email, LinkedIn, and GitHub, as a list with one link on each line and
   no bullets or indentation.

* **The name, positioning, and location form one block.** The positioning line is
  `--space-small` below the name, and the location `--space-x-small` below the positioning. The
  summary, the availability, and the contact list follow at the flow step, as the base styles set.
* **Availability is text, not a badge.** A badge would need a filled surface or a new colour
  pairing, and it would carry the one message the page most needs read as decoration.
* **Each contact link shows its address as its text**, such as the email address, or
  `linkedin.com/in/…` without the scheme. **Superseded by DDR-029**, which takes the design's short
  labels; what follows still holds as the reasoning, and the print exception at the end of it still
  stands. A visitor can read it, copy it, and type it, whether or
  not their device opens email links. Because the text already is the address, these links do not
  print their address again after themselves. This is the only exception to DDR-005's link rule,
  and it removes that rule's two recorded costs for these links: an address printed twice, and a
  `mailto:` prefix on paper.

### The contents

* **A `nav` follows the introduction and precedes the first section.** It holds one link to each
  of the five sections, as a list laid out as a row that wraps when it runs out of width.
* **Each link's text is its section's title**, the same string the section's `h2` shows, so
  renaming a section renames its link.
* **It is set apart from the contact links by `--space-large` above it**, twice the flow step, and
  by being a row rather than a column. The first section follows it at `--space-section`, as the
  base styles already set.
* **It is not sticky, has no current-section state, and does not animate.** Selecting a link moves
  to the section at once. Each section keeps `--space-medium` above its heading when it is scrolled
  to, so the heading does not sit against the top edge of the window.
* **Its accessible name** is a content string, such as "Sections", so a screen reader announces
  which navigation it is.
* **It is not printed.** DDR-005 already hides `nav` on paper.

### Entries

A role, a project, and a credential are all entries, and share one anatomy. Each is an `article`,
kept whole in print by DDR-005.

1. **Title**, the `h3`: the job title, the project's name, or the credential's name.
2. **Metadata line**, in `--font-size-small` and the secondary text colour, `--space-x-small` below
   the title. Its parts are separated by a middle dot, which assistive technology does not
   announce.
3. **Body**, `--space-small` below the metadata: a bulleted list of points for a role, and a
   paragraph for a project or a credential. Consecutive points are `--space-small` apart.
4. **Links**, for projects only, `--space-small` below the body: a row of labelled links.

Entries in a section are `--space-item` apart.

| Entry      | Title                | Metadata line                          | Body |
| ---------- | -------------------- | -------------------------------------- | ---- |
| Role       | Job title            | Company · place · start – end          | Points |
| Project    | Project name         | The technologies it uses               | What it is and what it demonstrates |
| Credential | Degree or certification | Institution · dates, or the date granted | The thesis, for a degree |

* **The job title is the heading, and the company is the first item of the metadata line.** The
  owner chose this from the three options under Alternatives Considered. It is the shape readers
  expect of a CV, and it keeps one metadata style across all three kinds of entry: the company, the
  project's technologies, and the credential's institution sit in the same place.
* **Dates are month and year**, with English three-letter months and a spaced en dash, such as
  "Oct 2024 – Jan 2026". A certification shows the single month it was granted. Dates are marked
  up with their machine-readable value.
* **Project links are labelled rather than showing their addresses**, such as "Source code" and
  "Live site". The labels are content. On paper they print their addresses, as DDR-005 sets, where
  a reader can type them. On screen, a link's purpose comes from its label together with the
  project's heading.
* **Entries appear in the order the content gives.** The brief orders roles newest first. Ordering
  the credentials the same way puts the two certifications first.

### Labelled lists: skills and languages

Skills and languages use one pattern, a list of labels and values, marked up as a description
list.

* **Each row is a label in semibold, followed by a colon and its value, on one line.** When the
  value is longer than the line, it wraps back to the start of the line. The pattern needs no width
  and no breakpoint, so it holds at every width and on paper.
* **Skills are grouped by level.** Each skill group is an item with its own `h3`, the group's name,
  followed by one row per level, in the order Advanced, Proficient, Basic. The label is the level,
  and the value is the skills at that level, separated by commas. A level with no skills in a group
  is left out. The owner chose this from the three options under Alternatives Considered.
* **Levels are words.** They read the same in greyscale, on paper, and to a screen reader, and they
  claim no more precision than the owner's own descriptions. There are no bars, dots, or
  percentages.
* **Languages are one row per language.** The label is the language, and the value is its level,
  such as "Native (C2)".
* **A skill group is kept whole in print**, as an entry is. The languages form one short list that
  is not split.

### Links, everywhere on the page

* **Every link stands on its own**, as ADR-002 requires, and is underlined, as DDR-002 requires.
* **On screen, every link's target is at least `--target-size-min` in each direction.** This
  applies to the contact links, the contents, and the project links. On paper nothing is tapped, so
  a component drops the minimum in print and the link takes the height of its text.
* **Links open in the same tab.** Nothing opens a new window unannounced.

### Print

DDR-005's treatment applies unchanged, with one addition and one exception:

* **The addition:** a component may drop screen-only sizing in print, as well as hide screen-only
  elements. The minimum target size is the one case.
* **The exception:** the contact links print their text only, because their text is their address.

The page therefore prints as: the name, the positioning, the location, the summary, the
availability, the three contact addresses, and then the five sections, each entry whole.

### Where the structure lives

Nothing here adds or changes a token. The components the section stories build read the existing
tokens, as ADR-001 requires, and write no width media query, as DDR-004 requires. Every string,
including the section titles, link labels, the contents' accessible name, and the names of the
levels, lives in `content/`, per ADR-002.

## Alternatives Considered

### Entries: the job title and company together in the heading

Such as "Global Product Specialist · ABB", with only the place and dates in the metadata line.

Pros:
* The two things a skimmer looks for are in the most prominent line.
* Every heading is unique, even if two roles shared a title.

Cons:
* Longer headings, which wrap more often on phones.
* Roles would differ from projects and credentials, which have nothing to put beside their title.

### Entries: the company as the heading

Pros:
* Recognisable employers stand out.

Cons:
* The progression of the owner's titles, which matters for a product manager hire, drops into the
  metadata line.

### Skills: one skill per line, with its level after it

Pros:
* The clearest reading of each individual skill.

Cons:
* About twenty lines across four groups, the longest section on the page and on paper.

### Skills: the level in brackets after each skill, in one running list

Pros:
* The fewest lines.

Cons:
* The repeated brackets make the list hard to scan, and the level is noise on every item.

### Skills: levels as bars, dots, or percentages

Pros:
* Quick to take in visually.

Cons:
* A graphic needs a text alternative, and fails DDR-002 if it relies on colour.
* A percentage claims a precision the levels do not have.
* Imagery and iconography were left out of the design foundation unless a need emerged, and words
  meet the need.

### Labelled lists aligned in two columns

The label in a column of its own, with every value starting at the same edge.

Pros:
* A tidier edge on wide screens and on paper.

Cons:
* The label column needs a width. Either it is a value not on the scale, or the columns change
  with the viewport, which needs a width query that DDR-004 reserves to `app/tokens.css`.
* On a 320px screen with enlarged text, a second column only a few characters wide would break
  words mid-way.

### No contents

Recommended to the owner, who chose the contents instead.

Pros:
* Nothing between the contact links and the first section.
* The page is short, and headings and landmarks already let assistive technology move between
  sections.

Cons:
* A sighted visitor on a phone scrolls past every section to reach, for example, the projects.

### A sticky contents bar, or one that marks the current section

Pros:
* The contents stay in reach while reading.

Cons:
* A sticky bar covers content, needs a surface behind it, which is a new colour decision under
  DDR-002, and needs every section to be offset below it.
* Marking the current section needs scripting, and a state that DDR-002 says must not rely on
  colour. It adds interaction a short page does not need.

### Contact links labelled "Email", "LinkedIn", and "GitHub"

Pros:
* Shorter on screen.

Cons:
* The address is hidden until the link is followed, and an email link does nothing on a device
  with no mail app set up.
* On paper, DDR-005 prints the `mailto:` prefix.

### Availability as a badge or highlighted block

Pros:
* It stands out.

Cons:
* A filled or tinted surface is a new colour decision under DDR-002.
* Decoration draws the eye to itself rather than to the sentence.

### Dates beside titles on wide screens

Pros:
* The conventional CV shape on paper, and it saves a line.

Cons:
* A second layout on wide screens, which DDR-004 excludes without a new decision.

## Consequences

Benefits:
* The section stories have one anatomy to build to. Roles, projects, and credentials share it,
  and skills and languages share another, so the page needs few patterns.
* The three things a skimmer needs, the owner's role, their availability, and how to reach them,
  are all in the introduction, in the first screen.
* Contact addresses are visible on screen and print once, without a `mailto:` prefix.
* Every level is a word, so the page loses nothing in greyscale, in forced-colours modes, on paper,
  or to a screen reader.
* No new token, colour, or breakpoint.

Tradeoffs:
* The contents add a row of links between the introduction and the first section.
* Metadata, including the company's name, is small and secondary. The company is found in the line
  under the title, not in the title.
* Labelled lists wrap to the start of the line rather than to an aligned edge.
* Project links show labels on screen, so their addresses appear only on paper, or in the
  browser's status bar.

Risks:
* **A long word in a section title.** Below the breakpoint, a section title is `--font-size-large`.
  At 320px with text at 200%, the column is 9rem, and DDR-004 measured "Certifications" at 9.19rem
  at that size. A section titled "Education and certifications" would break that word there.
  DDR-004 accepts breaks at that extreme, and nothing is clipped. A title such as "Education and
  credentials" avoids it, but the wording is a content decision.
* **Page length.** The brief expects about two A4 pages. That depends on how much the copy says,
  and is checked once it exists, with #23's recheck. That recheck found that the finished page
  prints on five A4 pages, in Firefox and in Edge.
* **The contents on a phone.** Five links, each at least 44px tall, can wrap to three rows at
  narrow widths with enlarged text. That is expected, but it should be seen with real titles.
* **Repeated link labels.** The project links share labels such as "Source code". Their purpose is
  clear with the project's heading, which WCAG 2.4.4 accepts. A screen reader's list of links out
  of context would show the labels repeated.

## Related Documents

* GitHub issue #27, which this decision resolves, and its UI Review
* GitHub issue #25, the Career Page, and its Content Brief
* GitHub issues #28 to #32, the section stories that build to this structure
* ADR-001, which keeps prose out of components
* ADR-002, which made the page the CV and descriptions plain strings
* DDR-001, the typographic system, whose heading roles and metadata size the page uses
* DDR-002, the colour system, whose link and colour rules the page keeps
* DDR-003, spacing and layout, whose steps compose the entries
* DDR-004, the responsive strategy, whose single layout and target size the page keeps
* DDR-005, the print stylesheet, to which this record adds one allowance and one exception
* DDR-008, section openings in print, which keeps each section's heading with its first item on
  paper
* DDR-010, the career page redesign structure, which supersedes this record, and GitHub issues #42
  and #43, the Epic and the design story that produced it
