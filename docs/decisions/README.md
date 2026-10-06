# Decision records

```text
architecture-decisions/   ADRs, plus template.md
design-decisions/         DDRs, plus template.md
```

Copy the sibling `template.md` for a new record; both require Status, Date, Context, Decision,
Alternatives Considered, Consequences and Related Documents. Files are named sequentially and
descriptively, `ADR-001-short-title.md`, `DDR-001-short-title.md`. Status is `Proposed`, `Accepted`,
`Superseded` or `Deprecated`.

**The next ADR is `031`. The next DDR is `107`.** Update both lines when a record lands.

When a record supersedes or amends another, say so at the top of both records and again at the
section concerned, and add a line below. Read the newest record first, and the older one for the
reasoning behind it.

## ADRs

ADR-001, ADR-002 and ADR-004 to ADR-030 are accepted. ADR-003 is superseded.

| Record  | Relationship |
| ------- | ------------ |
| ADR-004 | Supersedes the part of ADR-002 that rules out a separate CV file |
| ADR-005 | Supersedes the part of ADR-004 that makes the CV a PDF saved from the page |
| ADR-006 | Refines ADR-001: which literals a component stylesheet may write; ADR-021 adds one limit |
| ADR-007 | First Client Component, `ContentsBar`: it reads the scroll position. Not a precedent |
| ADR-008 | Amends ADR-007: the bar also handles its links' clicks (smooth scroll, DDR-041) |
| ADR-009 | Amends ADR-007: the bar renders its links, to mark the current one (DDR-042) |
| ADR-010 | Supersedes ADR-002's "no detail pages": each project is a static route; `next/link` hrefs skip `asset()`, amending ADR-004 |
| ADR-011 | Extends ADR-010 to roles, at `/experience/<slug>` |
| ADR-012 | Amends ADR-010's address: `/portfolio/<slug>`, `#portfolio`, `public/portfolio/<slug>/`; old `/projects/…` not kept |
| ADR-013 | Amends ADR-007 and ADR-009: the bar also holds its menu's open state (DDR-075) |
| ADR-014 | A project view's switch is native radios read by CSS (DDR-079); no new Client Component |
| ADR-015 | Amends ADR-007: second Client Component, `BusinessCaseSlider`, holds the item shown (DDR-080) |
| ADR-016 | Amends ADR-004: lead pictures and the photo at their originals' full resolution; the photo's budget is 200 KB |
| ADR-017 | Extends ADR-014: a project's gallery holds its picture in native radios (DDR-081); no new Client Component |
| ADR-018 | Amends ADR-017's overlay rejection and ADR-007: a view's picture opens larger in a modal `dialog` via Invoker Commands, without script (DDR-082); a third Client Component, `LargerPicture`, only moves it |
| ADR-019 | Amends ADR-018: a gallery's larger picture hands over to its neighbour's by a command of the page's own, `--show-in-place` (DDR-083); still `LargerPicture`, and no stepping without script |
| ADR-020 | Amends ADR-004: a video at its recording's pixel size, with no audio track where it has no sound (DDR-087); the budgets stand |
| ADR-021 | A project picture's content carries its pixel size; a view hands its box (DDR-088) to its stylesheets in a `style` attribute; amends ADR-006 with `min(100%, 100cqb * var(--token))` on `max-inline-size` |
| ADR-022 | Amends ADR-018, ADR-019 and ADR-017: a gallery's video opens in `LargerPicture`'s dialog (DDR-089) and pauses as it closes; `controlsList="nodownload"` and a declined `contextmenu` withhold its download; `disablePictureInPicture` its floating window; `Media` goes |
| ADR-023 | Supersedes ADR-003's host and domain steps: Vercel deploys and runs the checks (`vercel.json`); Actions only validates; no base path |
| ADR-024 | Amends ADR-023: the site states its address (`site.url`) for canonical links, `robots.txt`, `sitemap.xml` and a schema.org `Person`; a new domain changes it |
| ADR-025 | Amends ADR-007: fourth Client Component, `ScrollAppear`, makes the children of each `data-appear` container appear as they are reached (DDR-090); the page is served whole |
| ADR-026 | Amends ADR-004 and ADR-022: a video's dialog sets its `preload` to `metadata` as it opens, on `toggle`, so its controls work before play (DDR-092); the markup keeps `preload="none"`; the video carries `autofocus` so Space plays it |
| ADR-027 | Amends ADR-012's "old addresses are not kept": `vercel.json` redirects `/projects/<slug>` to `/portfolio/<slug>` and `/projects` to `/#portfolio`, permanently |
| ADR-028 | Amends ADR-001's rule that components don't fetch, and ADR-007: a fifth Client Component, `DigitalTwinChat`, calls the Digital Twin's API from the reader's browser, with no server of the site's own; the API's address is in `content/`; previews are allowed by an origin pattern in the chatbot's repository. DDR-101 amends its "What the reader is told": the reader is no longer told where messages go |
| ADR-029 | Amends ADR-028's "once per conversation": after 10 minutes without hearing from the API, the chat warms it again when the reader next engages (the field's focus, or a question), not on a timer |
| ADR-030 | Amends ADR-028's states and limits: the chat asks `/chat/stream` and reads the answer as it arrives; 60 seconds for the first piece and 20 between pieces, none on the whole; a cut-off answer keeps what arrived (DDR-103); no fallback to `/chat` |

## DDRs

Accepted: DDR-010, DDR-011, DDR-013 to DDR-015, DDR-017 to DDR-057, DDR-059 to DDR-093, DDR-095 to
DDR-106. There are two files numbered 059 (`introduction-photo-centred` and `role-view`).

### Superseded outright

| Superseded | By      | What changed |
| ---------- | ------- | ------------ |
| DDR-001    | DDR-011 | New typefaces and scale |
| DDR-002    | DDR-012 | New surface, inks, accent and tints |
| DDR-003    | DDR-013 | The column stops being the measure |
| DDR-004    | DDR-014 | A second breakpoint, at 48em |
| DDR-005    | DDR-015 | Print base, tints dropped at the token layer, paper takes the wide layout |
| DDR-006    | DDR-010 | The whole career page structure |
| DDR-007    | DDR-011 | Its font files no longer exist; its rule carries over |
| DDR-008    | DDR-015 | Its block survives; its claim that both browsers break alike does not |
| DDR-009    | DDR-011 | PDF guarantee re-established for the new faces |
| DDR-012    | DDR-025 | The design's palette entire, with pairings that fail WCAG |
| DDR-016    | DDR-021 | Photo corner radius and lights; ratio and widths carry over |
| DDR-058    | DDR-073 | Email pill shows Gmail's M alone; "Email me" is its accessible name |
| DDR-094    | DDR-106 | The icon is the owner's AO mark on a white rounded square; its files and shapes carry over |

### Superseded or amended in part

Each record keeps everything not listed against it.

* **DDR-010** (career page structure, the Epic #42 contract): DDR-026 draws the divider between
  sections; DDR-027 takes the 44×44 target; DDR-028 adds the footer; DDR-029 labels the contact
  pills; DDR-031 makes the contents sticky; DDR-035 hover changes colour; DDR-036 ringed dot on one
  line; DDR-037 badge above skills; DDR-042 marks the current section; DDR-043 new tab for profile
  pills; DDR-050 project views; DDR-051 project cards; DDR-054 every technology on a card; DDR-056
  greeting, map pin, one summary paragraph; DDR-057 horizontal timeline on screen (vertical survives
  on paper); DDR-075 contents behind a menu below the wide breakpoint; DDR-077 photo and name as one
  row on a phone.
* **DDR-011** (typography): DDR-022 takes the scale and floor; DDR-023 which elements take which
  face, weights and italics; DDR-038 adds two running-text leadings. Still the record for the faces,
  fallbacks, static-file recipe, PDF guarantee, measure and wrapping.
* **DDR-013** (spacing): DDR-026 splits the section boundary around a hairline; DDR-039 takes the
  rhythm (the design's values × `--rhythm-scale`); DDR-040 summary measure and page padding; DDR-046
  draws the column inside `main`'s parts.
* **DDR-014** (responsive): DDR-027 takes the target minimum; DDR-039 and DDR-049 let the wide
  breakpoint redefine `--rhythm-scale` and `--contents-bar-title-row`; DDR-040 takes
  `--page-padding-block` off the narrow breakpoint; DDR-050 adds `--font-size-project-title-narrow`;
  DDR-057 lets a timeline scroll sideways inside itself; DDR-077 takes the page title off the narrow
  breakpoint; DDR-086 lets one stylesheet, the larger picture's, place its content from the wide
  breakpoint.
* **DDR-015** (print): DDR-022 raises the base to 12pt; DDR-025 splits the dropped decoration into
  three hairlines; DDR-032 lets printed addresses break anywhere; DDR-038 keeps 1.5 leading on
  paper; DDR-039 keeps the old rhythm on paper; DDR-051 prints a project as its card; DDR-057 prints
  role points and a vertical timeline.
* **DDR-018** (labels): DDR-023 takes "semibold, not bold"; DDR-024 takes its tracking amendment.
* **DDR-019** (bullet marker): DDR-025 takes its colour (`#a5b4fc`, fails 1.4.11).
* **DDR-020** (elevation): DDR-025 takes its ink back to 10%; DDR-061 adds `--shadow-card-hover`.
* **DDR-021** (photo): DDR-040 takes its wide width; DDR-075 admits the menu panel out of flow;
  DDR-077 takes its narrow width to 120px.
* **DDR-022** (type scale): DDR-050 adds the project title size; DDR-077 makes `xx-large` the
  narrow page title.
* **DDR-023** (faces and weights): DDR-030 corrects the medium row; DDR-031 adds the contents links;
  DDR-051 sets a project card's name in Lora; DDR-057 drops the italic (six files); DDR-080 sets a
  business case's key figure in Lora.
* **DDR-025** (colour): DDR-033 drops the contents links' underline; DDR-035 adds hover and
  underline colours; DDR-036 adopts the ringed dot; DDR-044 adds service colours; DDR-046 adds
  `--color-surface-band`.
* **DDR-026** (divider): DDR-039 corrects its spacing claim; DDR-046 runs the line across the window.
* **DDR-027** (targets): DDR-028 extends its target table with the footer's addresses.
* **DDR-028** (footer): DDR-029 makes it the one place an address is written out; DDR-040 closes
  the space above its hairline; DDR-100 pads its foot on screen for the chat's launcher.
* **DDR-029** (pill labels): DDR-073 takes the email pill's visible label.
* **DDR-031** (sticky bar): DDR-033 its underline; DDR-034 the scrolled edge; DDR-042 current
  section; DDR-045 Home link and 8px narrow gap; DDR-049 title at the left; DDR-105 64px tall.
* **DDR-033**: DDR-042 underlines the current section's link as a state.
* **DDR-034** (bar edge): DDR-048 draws the edge at all times.
* **DDR-036** (dot): DDR-046 takes its fill; DDR-057 sizes it 16px/10px on screen, 12px on paper.
* **DDR-039** (rhythm): DDR-057 leaves `--space-role` and `--space-credential` to paper and the
  phone's column.
* **DDR-040** (introduction): DDR-072 puts the question in `--space-controls`.
* **DDR-042**: DDR-045 marks Home in the introduction.
* **DDR-043** (new tab): DDR-044 removes the arrow; DDR-050 adds a project view's links; DDR-069 adds
  the education cards; DDR-100 adds the chat's launcher without script, its
  "Ask it on its own page" and a reply's links.
* **DDR-044** (service pills): DDR-047 the GitHub hover fill; DDR-073 the email pill's M alone.
* **DDR-049** (bar title): DDR-075 the menu below the wide breakpoint; DDR-091 the title leads
  where Home does, which it ruled out; DDR-105 the title is the owner's mark.
* **DDR-091** (title leads home): DDR-105 names the mark's link by `aria-label` and fades the mark
  on hover and focus rather than taking the accent.
* **DDR-075** (menu): DDR-091 the title's link closes it too, though it is outside the menu.
* **DDR-050** (project view): DDR-052 neighbours; DDR-053 gallery; DDR-078 "How I built it";
  DDR-079 the business-case switch; DDR-081 the gallery's thumbnails in the lead's column; DDR-082
  the picture in the lead's frame opens larger; DDR-084 a view with a gallery shows that in the
  lead's place; DDR-085 the frame shows its picture whole, not cropped to 16:10; DDR-088 every
  picture a view shows stands in one box, at its tallest picture's shape. DDR-093 gives an address the site
  does not have a view's frame and the top of a view. DDR-096 a line above the links inviting the
  reader to try the project, and links past the live site (the Digital Twin's Telegram).
* **DDR-096** (invitation): DDR-100 makes its words open the chat with script; without script they
  stay the link to the chatbot's page.
* **DDR-100** (chat): DDR-101 removes the note on where messages go; DDR-102 gives the chat the look
  and words the owner drew in `career-site-design`, keeps the launcher in view as its close control on
  a wide window, and keeps the full window on a phone. DDR-103 grows an answer in place as it
  arrives, follows it to its end unless the reader scrolls up, and keeps a cut-off answer's part.
* **DDR-102** (chat as drawn): DDR-104 widens the panel to 400px from the wide breakpoint, so the
  header's status and "Clear chat" stand beside the heading; the second line stays as the fallback.
* **DDR-101** (no note): DDR-102 changes the welcome's words.
* **DDR-051** (project cards): DDR-054 every technology; DDR-055 the lift; DDR-062 the hover
  shadow; DDR-063 the shared card behaviour.
* **DDR-055, DDR-057, DDR-059, DDR-061**: DDR-063 makes a role card rest raised and lift like a
  project card.
* **DDR-057** (timelines): DDR-059 role cards link to views; DDR-066 company logos; DDR-067 one line
  of dates; DDR-069 education cards link off the site; DDR-070 grained surface; DDR-074 a column,
  newest first, below the wide breakpoint.
* **DDR-059** (role view): DDR-060 short and full titles; DDR-067 the hint's place and mark;
  DDR-097 the header carries the company's logo, in a column of its own from the wide
  breakpoint; DDR-098 stands it at the right, centred on the title; DDR-099 centres it
  across the panel on a phone.
* **DDR-059** (photo centred) and **DDR-010**: DDR-077 takes the float off the screen.
* **DDR-061, DDR-062, DDR-063**: DDR-065 a lit card keeps its resting shadow; hover ink 18%.
* **DDR-063**: DDR-090 elements also appear as they are reached, so the lift is no longer the site's
  one piece of expressive motion.
* **DDR-063, DDR-064**: DDR-074 the column's card lifts by a margin and outlines itself.
* **DDR-064**: DDR-071 dates glow and the dot darkens.
* **DDR-097** (logo on a role's view): DDR-098 the logo stands at the panel's right, centred on the
  title from the wide breakpoint and after it below.
* **DDR-098**: DDR-099 centres the logo across the panel below the wide breakpoint.
* **DDR-066**: DDR-068 degrees carry the UPC's logo; DDR-097 each logo's file is twice the role
  view's height, 72px (112px tall).
* **DDR-070** (timeline card): DDR-080 draws a project's business case as one.
* **DDR-072**: DDR-076 a line below the question.
* **DDR-053** (gallery): DDR-081 makes it a row of thumbnails under the lead picture; its content
  and video treatment stand. DDR-082 takes Option C's lightbox: the picture in the frame opens
  larger. DDR-087 brings the first videos, silent and last in their rows: captions wait for the
  first video with sound, and a check holds every video to no sound track until then. DDR-089
  opens a video larger before it plays, instead of playing it in the frame, and offers no download.
* **DDR-081** (thumbnails): DDR-082 opens the picture in the frame larger, which its Option A
  rejected; a thumbnail still only chooses the picture. DDR-084 takes the lead out of the row, which
  its Option B rejected: a gallery shows only the pictures it lists, and the view opens on the first.
  DDR-085 shows the picture in the frame at its own shape. DDR-087 answers its risk: a playing
  video is not paused when another picture is chosen.
* **DDR-082** (picture larger): DDR-083 steps between a gallery's pictures while one is open, which
  its Option D rejected; the frame follows the last picture seen. DDR-088 puts the opening control
  at the box's corner and shows every larger picture of a view at one width.
* **DDR-085** (picture whole): DDR-088 stands every picture of a view in one box, which its Option B
  rejected; the picture stays whole and keeps its corners.
* **DDR-083** (steps): DDR-084 takes the lead out of the order; DDR-086 stands the controls at the
  window's left and right edges from the wide breakpoint, which its Option B rejected. DDR-089 lets
  the steps reach a video, and the place count every item.
* **DDR-089** (video larger): DDR-092 readies the browser's controls as the video opens, so a click
  plays it, a double click and the full screen control show it at full screen, before play; focus
  starts on the video, so Space plays it.
* **DDR-087** (first videos): DDR-089 stops the video playing in the frame; closing its larger view
  pauses it.
* **DDR-079** (business-case switch): DDR-080 shows the business case one item at a time, in a card.
