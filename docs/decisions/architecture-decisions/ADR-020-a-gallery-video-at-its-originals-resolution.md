# ADR-020-A Gallery Video Is Served at Its Original's Resolution, Without a Sound Track It Does Not Use

Status: Accepted

Date: 2026-09-30

**Amends ADR-004** in two places, for a video alone. It changes §3's "prepared once, by hand, at the
size they are shown": a video is served at the pixel size of the owner's recording, as ADR-016
serves a lead picture. It also changes §3's "MP4 with H.264 video and AAC audio": a recording
without sound is served with no audio track. Every other rule ADR-004 sets stands: one MP4 file per
video, committed to this repository, a separate committed poster, `preload="none"`, every reference
through `asset()`, and §5's budgets, all of them.

## Context

The owner supplied the site's first two videos on #259, each a recording of an application's window:

| Recording | Size | Length | Weight |
| --- | --- | --- | --- |
| NumisBook | 1918 × 906, 30 frames a second | 1 min 4 s | 56.5 MB |
| Stock Portfolio Viewer | 1920 × 1018, 30 frames a second | 1 min 26 s | 85.3 MB |

Neither can be served as it is. Each is nine to fourteen times ADR-004's 6 MB for a video, and the
second is close to the 100 MB at which GitHub refuses a file. ADR-004 §5 says what to do: "When an
asset exceeds its budget, the asset is re-derived."

ADR-004 wrote its rules for one demo video in a 280px column. A gallery's video is drawn up to 522px
wide (ADR-016), and its controls offer full screen, which is where a recording of an application is
read: its text is the application's own, at the size the owner's screen drew it. At twice the drawn
width that text is no longer sharp at full screen.

Both recordings carry an audio track of silence (DDR-087).

## Decision

### 1. A video is served at its recording's pixel size

It is not scaled down to a multiple of the width the view draws it at. Its frame rate is the
recording's.

### 2. It is H.264 in an MP4, with no audio track where the recording has no sound

DDR-087 decides that a silent recording carries no sound track, and holds it by a check. A video
with sound keeps its AAC track, as ADR-004 says, and brings its captions (DDR-053).

### 3. The recipe

Each file is made once, by hand, with ffmpeg's `libx264`: constant quality 26, the `veryslow`
preset, `yuv420p`, the file's index moved to its start (`+faststart`) so that it plays as it
arrives, the audio left out and the recording's metadata removed.

```text
ffmpeg -i <recording> -map 0:v:0 -an -map_metadata -1 -c:v libx264 -preset veryslow -crf 26 \
  -pix_fmt yuv420p -movflags +faststart gallery-walkthrough.mp4
```

A recording of a window is mostly still, so it compresses far below what ADR-004 expected of a
video:

| File | Size | Weight | Budget |
| --- | --- | --- | --- |
| `portfolio/numisbook/gallery-walkthrough.mp4` | 1918 × 906 | 1.30 MB | 6 MB |
| `portfolio/stock-portfolio-viewer/gallery-walkthrough.mp4` | 1920 × 1018 | 3.58 MB | 6 MB |

Measured against the recordings on #259 with ffmpeg's `ssim`, over every frame, they score 0.998 and
0.997 of 1, and the application's text reads the same in a frame of each.

The poster is the recording's first frame at the same size (DDR-087), encoded as every still is:
Pillow's WebP encoder at quality 82 and method 6. They weigh 13 KB and 78 KB, against 150 KB.

The recordings themselves stay out of the repository, beside the PNG originals in
`public/portfolio/<slug>/media/`, which `.gitignore` now names.

### 4. The budgets stand

`public/` comes to 7.0 MB with both videos and their posters, against §5's 10 MB. Measured on #259
in Chromium at 1280px wide, NumisBook's view fetches 1.09 MB before its video is played and the
Stock Portfolio Viewer's 0.92 MB, against §5's 1.5 MB, and neither requests its video's file.

## Alternatives Considered

### Option A: scale each video to twice the width it is drawn at

Pros:
* What ADR-004 §3 says, and smaller files.

Cons:
* A reader who takes the video to full screen, which is the only way to read it, sees the
  application's text scaled up from 1044px.
* At the recording's size both files already fit their budget with room.

Rejected.

### Option B: host the videos elsewhere

ADR-004's Option J rejected YouTube and Vimeo, for a third party's script, cookies and player on a
site that has none. Nothing here changes that, and the files fit.

### Option C: Git LFS, or a release asset

Rejected: ADR-004 §3 rules out both, and neither is needed for 5 MB.

### Option D: raise the budgets and keep more of the recording's quality

Rejected. Nothing was lost that a reader can see, and §5 asks that a number is raised deliberately,
for a reason. There is none.

## Consequences

Positive:
* Each video is as sharp at full screen as the owner's recording.
* One file per video still, referenced from `content/` and made by a recorded recipe, so a
  replacement matches.
* The captions rule can be checked, because a file's track list now says whether it has sound.

Negative:
* Each play fetches up to 3.6 MB from GitHub Pages. Against its 100 GB a month that is about 28,000
  plays of the larger video.
* Each video, and each replacement of one, is in Git's history for good, as ADR-004 already accepts.
* Making a video needs ffmpeg, which the repository does not carry and the build does not run.

Risks:
* **`public/` has 3 MB left of its 10 MB.** A third video of this kind may not fit, and raising that
  number is a change to ADR-004, made on the story that needs it.
* **A recording with more movement compresses less.** The same recipe may not bring a video of
  scrolling or animation under 6 MB. Then the quality or the size changes, and this record with it.

## Related Documents

* ADR-004, whose §3 this record amends, and ADR-016, which did the same for a picture
* DDR-087, the video's place, name, still and silence; DDR-053, the captions rule
* DDR-010 and DDR-085, how a video is drawn
* GitHub issue #259, which this decision resolves, and Epic #152, its parent
