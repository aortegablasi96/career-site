# ADR-016-Pictures Are Served at Their Originals' Resolution

Status: Accepted

Date: 2026-09-29

**Amends ADR-004** in two places, for a project's lead picture and the owner's photo alone. It
changes §3's "prepared once, by hand, at the size they are shown": each of these pictures is now
served at the full resolution of the owner's original. It also changes §5's budget for the photo,
from 100 KB to 200 KB, and corrects the widths §5 gives for both. Every other rule ADR-004 sets
stands: one WebP file per picture, no `<picture>` and no second `<source>`, no image pipeline, the
PNG originals kept out of the repository, the 150 KB budget for a still and the 1.5 MB for what the
page fetches.

## Context

On #167 the owner supplied PNG originals for the four projects' lead pictures, each 1536 × 1024,
and for their photo, 1200 × 1600. The WebPs made from them were saved at twice the width the page
drew them at: 1080 × 720 for a lead picture and 600 × 800 for the photo. On #242 the owner found the
served pictures softer than the originals, and asked for the originals' resolution.

The PNGs themselves cannot be served. Each weighs between 1.3 and 2.4 MB. The four lead pictures
alone come to about 6.6 MB, against ADR-004's 1.5 MB for everything the page fetches. The softness
is the resolution, not the format. So the owner chose on #242 to keep WebP at the originals' full
size.

The widths ADR-004 §5 gives no longer describe the page. They were measured on #242 in Edge, from
320px to 1920px wide:

| Picture | Widest drawn | Where |
| --- | --- | --- |
| A lead picture on a card | 538px | at 1280px and wider |
| A lead picture on a project view | 522px | at 1280px and wider |
| The photo | 300px | from 1364px, per DDR-040 |

So today's files already cover a 2× screen at every width. The original's resolution adds
sharpness where a picture is drawn at more than twice its CSS width. That happens on a 3× screen,
and when a reader zooms the page on a 2× screen. It also leaves less room for the encoder's softening
to show at 2×, because the browser draws each picture down from a larger file.

Encoded the way today's files were, with Pillow's WebP encoder at quality 82 and method 6, the
originals come to:

| File | Resolution | Size | Budget |
| --- | --- | --- | --- |
| `portfolio/numisbook/lead.webp` | 1536 × 1024 | 81 KB | 150 KB |
| `portfolio/digital-twin/lead.webp` | 1536 × 1024 | 101 KB | 150 KB |
| `portfolio/stock-portfolio-viewer/lead.webp` | 1536 × 1024 | 73 KB | 150 KB |
| `portfolio/career-site/lead.webp` | 1536 × 1024 | 69 KB | 150 KB |
| `home/andreu-ortega-blasi-photo.webp` | 1200 × 1600 | 149 KB | 100 KB |

The four lead pictures fit their budget. The photo does not, and it stays over budget down to
quality 80.

## Decision

### 1. A lead picture and the photo are served at their originals' full resolution

Each is one WebP file with the same pixel dimensions as the owner's original. It is not scaled down
to a multiple of the width the page draws it at. A picture's ratio and crop on the page are
unchanged, because `object-fit: cover` draws any size of file into the box the page gives it.

Each is encoded with Pillow's WebP encoder at quality 82 and method 6, as today's files were. That
way a replaced picture matches the others, and the only change on #242 is resolution. When an
original is replaced, the new file is made the same way.

The company and university logos are not covered by this decision. They stay at the size they are
drawn (`docs/implementation-notes.md`). Gallery media is not covered either, because none exists yet.

> **Read with ADR-020 (2026-09-30).** A gallery's pictures have been served at their originals' size
> since #252, encoded the same way, and ADR-020 decides the same for a gallery's video.

### 2. The photo's budget is 200 KB

The full-resolution photo is 149 KB. A budget of 150 KB would leave a replacement photo 1 KB of
room, so it is set at 200 KB. The still's 150 KB stands, and every lead picture fits it.

ADR-004 §5 now reads:

| What | Budget | Why |
| --- | --- | --- |
| The profile photo | 200 KB | Drawn up to 300px wide (DDR-040); served at the original's 1200 × 1600 |
| Each still | 150 KB each | Drawn up to 538px wide; served at the original's 1536 × 1024 |

The page's 1.5 MB stands. Measured on #242 in Edge at 1440px wide, after scrolling to the end, the
page fetches 1.22 MB uncompressed. That is 0.23 MB more than with the half-size files, and GitHub
Pages compresses the scripts and styles before sending them.

## Alternatives Considered

### Option A: Serve the PNG originals

Pros:

* The originals, byte for byte, with nothing lost to encoding.

Cons:

* Each is 1.3 to 2.4 MB. The page would fetch about 8 MB with the photo, against a budget of 1.5 MB.
* Two formats for the same kind of file, where ADR-004 has one.
* The PNGs are gitignored as the owner's originals. Committing them would add about 9 MB to the
  repository's history.

Rejected. The owner chose WebP on #242.

### Option B: Keep the files at twice the drawn width

Pros:

* The smallest files that are sharp on a 2× screen, as ADR-004 §3 intended.

Cons:

* They are softer than the originals when drawn at more than twice their width, on a 3× screen or a
  zoomed page. The owner judged them softer, and asked for the originals' resolution.

Rejected at the owner's request.

### Option C: Several sizes of each picture, chosen by the browser with `srcset`

Pros:

* A phone fetches a file its screen can use, and a large screen fetches the original.

Cons:

* Several files per picture, where ADR-004 has one, and a width descriptor for each picture that
  has to be kept in step with the layout.
* It adds a way of preparing assets to a site that has one, to save about 0.23 MB a visit.

Rejected as disproportionate. **This is the option to take** if the page's weight approaches
1.5 MB, or if more full-resolution pictures arrive.

### Option D: A higher quality at twice the drawn width

Pros:

* Removes the encoder's softening without larger dimensions.

Cons:

* It does not add resolution, and resolution is what the owner asked for.

Rejected.

## Consequences

Positive:

* Each lead picture and the photo are as sharp as the owner's original wherever the page draws them,
  including on a 3× screen and a zoomed page.
* One file per picture still, in the same format, made the same way, and referenced from the same
  place. Nothing in `content/` or `components/` changes but a comment and a budget.
* The recipe is recorded, so a replacement picture matches the others.

Negative:

* The page fetches about 0.23 MB more on every visit, and a phone fetches a 1536px file for a card it
  draws 271px wide.
* The photo's budget is twice what it was.
* Each replaced picture adds its new file to Git history forever, as ADR-004 already accepts.

## Related Documents

* ADR-004, whose §3 and §5 this record amends
* GitHub issue #242, which this decision resolves, and Epic #152, its parent
* GitHub issue #167, which supplied the originals and the half-size files
* DDR-021 and DDR-040, the photo's capsule, ratio and widths
* DDR-050 and DDR-051, the project view's 16:10 and the card's 16:9
