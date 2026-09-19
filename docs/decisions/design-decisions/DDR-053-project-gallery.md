# DDR-053-Project Gallery

Status: Accepted

Date: 2026-09-20

**Amends DDR-050 in one respect**: a project's view can now show a gallery of further pictures and
videos between its introduction and its foot. Everything else DDR-050 decides — the view's address,
its way back, its introduction, its two columns and its spacing — is unchanged, and this record
follows it in reading its values off `career-site-project`. DDR-052's foot is unchanged and follows
the gallery.

DDR-010's video treatment, ADR-004's binary assets, DDR-014's breakpoints and markup-order rule and
DDR-027's targets are unchanged, and the gallery follows all four.

## Context

Epic #152 gives each project a view of its own. Issue #155 is its last story. One picture shows
what a project looks like; a few pictures and a short walkthrough show what it does, which is the
evidence a reader who has opened a project view is looking for.

The design draws it at node 59:84: the label "GALLERY", then two items in a row, each a picture or
a video at 492 by 307.5 with a caption beneath it, 20px apart each way and 20px below the label,
the whole block a section boundary below the introduction. The two items it draws are the "Add
image" and "Add video" placeholder frames, which are never shipped.

The story left four things to decide. The owner decided two of them on #155:

* **Whether the media is supplied on this story.** The owner chose to ship the mechanism now, with
  no project carrying gallery media, and to supply files later. Each picture and video is the
  owner's to supply, as on #63.
* **What WCAG 1.2 asks of a gallery video.** The owner chose captions.

The other two are decided here: how the items arrange below the wide breakpoint, which the design
does not draw, and what a view with no gallery media shows.

## Decision

**A project's view shows, below its introduction and above its foot, a gallery of further pictures
and videos: the label "Gallery", then every item the project's content states, in that order, each
in the lead picture's shape with its caption beneath it.**

### What the gallery is made of

* **A gallery item is the lead picture's pair**: one picture or video, and the few words shown
  under it. So `GalleryItem` is `{ media, caption }`, the same two things `Project` already carries
  for its lead, and a gallery item and the lead differ in where they stand rather than in what they
  are. A picture states its own alternative text and a video its description, per ADR-004, so a
  reader who cannot see an item still learns what it shows; the caption adds nothing the
  alternative text does not already say.
* **Every word and every path is in `content/`**, per ADR-002: the items are a project's own
  record, and the one word around them, "Gallery", is a string beside the view's others. Adding a
  gallery to a project is content alone — a list here and the files in `public/` — with no change
  to a component.
* **The label is an `h2`**, as "Built with" is, so a view's outline reads: the project, what it is
  built with, and what there is to see of it. It is set as the design's labels are — 10px bold
  capitals, tracked, in the faint ink — which is the same appearance "Built with" already has.
* **The items are a list**, a `ul` of `li`, because they are several of one thing and their number
  is worth announcing. Each item is a `figure` with its `figcaption`, as the lead picture is, so a
  caption is tied to what it names rather than standing loose under it.

### What a view with no gallery media shows

**Nothing at all: no items, no label, and no empty block.** A heading over nothing is worse than no
heading, and the story asks for it outright. `gallery` is therefore optional on a project, and a
project that states none, or states an empty list, renders no gallery.

**No project states one today.** The mechanism ships without media, as the owner chose on #155, so
the branch that draws a gallery is exercised by `components/project-view.test.tsx` rather than by a
view — exactly as the video branch of `Media` has been since #50, and for the same reason: the
media is the owner's to supply.

### A video

**A gallery video is drawn by the same `Media` the lead picture is**, so it inherits DDR-010's
treatment and ADR-004's rule without a second implementation: it has its own controls, does not
autoplay and does not loop, shows its poster still until it is played, and fetches nothing until
then. Measured on #155 with a video in place: the browser requested the poster and never requested
the file, and the element sat at `networkState` 1 and `readyState` 0 until played.

**A gallery video with speech carries a captions track, and may not land without one**, per WCAG
1.2.2. The owner chose this on #155 over silent videos only and over a written transcript: a
walkthrough is worth narrating, and captions serve a reader in a quiet room as well as a deaf one.
No gallery video exists yet, so `Video` carries no field for a track: the story that brings the
first video adds `captions` beside `poster` and renders a `<track kind="captions">`, rather than
this one shipping a shape nothing fills.

### Its shape and its space

* **An item is the lead picture's 16:10 at the large radius**, which is what the design draws
  (node 59:90 is 492 by 307.5, as node 59:71 is 560 by 350). So the gallery writes no ratio of its
  own, and a 4:3 file is cropped to it from the centre rather than distorted — the rule #153 already
  measured. The shape is an `aspect-ratio` rather than a pair of lengths, so it holds at every
  width.
* **The design spaces the gallery by one 20px throughout** — between two items each way, and from
  the label to the first row — as it spaces a card on the page. 20px is not a step of DDR-013's
  scale, so it is `--project-view-gallery-gap`, a measure of the view's own, as the view's 24px and
  12px already are.
* **A section boundary above the label**, which is the design's 56px and the step the page already
  puts between two sections. The foot's own boundary below it is DDR-052's and is unchanged.
* **A picture and its caption are a flex column**, which is the `figure` #159 already fixed: in a
  grid of one track Firefox sizes the row from the picture's own height rather than the ratio it is
  drawn at. The gallery reuses that rule rather than repeating the fault.

### How it arranges below the wide breakpoint

**One item to a row below `48em`, and two from it**, which is where the view's two columns and its
two neighbour cards already part. The design draws only a wide frame, so this is decided here.

Two 16:10 pictures side by side on a phone would be about 130px wide each at 320px, which is too
small to show anything an application is doing — and a gallery exists to show exactly that. One to
a row gives each item the full column, 268.8px at the narrowest width swept, and costs only
scrolling, which a reader of a gallery expects.

The items keep the markup order at both widths, per DDR-014, so the order the content states is the
order they are read in and the order they are seen in.

## Consequences

### Benefits

* A project can show what it does rather than only what it looks like, which is the evidence a
  reader who has opened a view came for.
* Adding a gallery to a project is content alone. Nothing about a component or a stylesheet changes
  when the owner supplies media.
* No new pattern. The item is the lead picture's shape, its figure is the lead picture's figure, its
  label is "Built with"'s label, its video is `Media`'s video, and its breakpoint is the view's
  breakpoint.
* The page is untouched. Measured on #155, the built page and all four project views are
  byte-identical to the tree this branched from, so the printed CV is unaffected and needs no
  reprint.

### Tradeoffs

* **The gallery ships empty.** Every view looks exactly as it did, and the story's outcome is
  visible only once the owner supplies media. The owner chose this on #155, and the alternative —
  waiting for files — would have held the epic's last story open.
* **The captions rule is recorded rather than enforced by a type.** A video with speech and no
  track is caught by a reviewer reading this record, not by the compiler. Adding the field now would
  be a shape nothing fills, which the project's principles rule out; the story that brings the first
  video adds both the field and the check.
* **One item to a row on a phone makes a long view longer.** A gallery of six items is six full-width
  pictures to scroll past. The design draws no narrow view, so this is a judgement about what a
  picture is for rather than a value read off the file.

### Risks

* **A gallery grows the view without limit.** Nothing caps how many items a project may state, so a
  long gallery is a long page and a large payload. ADR-004's per-file budgets still apply to every
  file, and the 1.5 MB budget for what a view fetches before a video is played is the thing to
  re-measure when media arrives — a view is not the page, but the budget was written for a page
  carrying four stills.
* **The first real gallery is the first time the layout is measured with real media.** #155 measured
  it with stand-in files at the design's width and swept 300px to 900px at both text sizes; a
  picture of a different shape, or a caption of two lines, is not covered by that.

## Alternatives Considered

### Option A: ship the gallery with media supplied on this story

Rejected by the owner on #155. The media is the owner's to supply, as #63 established, and the
story's `Not Included` excludes recording, capturing or cropping any of it.

### Option B: two items to a row at every width

Rejected. At 320px each item is about 130px wide, which shows nothing of an application, and a
gallery whose pictures cannot be read is worse than no gallery.

### Option C: a horizontal carousel or a lightbox on a narrow screen

Rejected. The design draws neither, the story excludes an enlarged view outright, and both are
interaction patterns with keyboard, focus and reduced-motion costs that a column of pictures does
not have.

### Option D: a written transcript beside a video instead of captions

Rejected by the owner on #155. A transcript is prose in `content/` that has to be kept in step with
a recording by hand, and it separates what is said from when it is said; a captions track keeps the
two together and is what WCAG 1.2.2 asks for.

### Option E: make the lead picture the gallery's first item

Rejected. The lead picture is drawn in the view's introduction, beside the text, at a size and a
place the gallery's items do not share (node 59:71 against node 59:90). Folding the two together
would change the introduction, which is DDR-050's and outside this story.

## References

* Issue #155, and Epic #152.
* DDR-050, which this amends, and DDR-052, whose foot follows the gallery.
* DDR-010, for the video's treatment, and DDR-051, for the card that leads to the view.
* DDR-013's spacing scale, DDR-014's breakpoints, DDR-027's targets and DDR-038's leading.
* ADR-002, for content in `content/`, ADR-004, for binary assets and their budgets, and ADR-010,
  for the view's route.
* `career-site-design`, layer `career-site-project`, node 59:84.
* WCAG 1.2.2 (Captions, Prerecorded) and WCAG 2.5.8 (Target Size, Minimum).
