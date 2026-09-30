# DDR-084-A Project's Gallery Shows Only Its Own Pictures

Status: Accepted

Date: 2026-09-30

**Amends DDR-081 (the lead as the first thumbnail, and Option B), DDR-083 (the order of the steps)
and DDR-050 (the view's lead picture).** A view whose project has a gallery shows the gallery's
pictures and no others: it opens on the gallery's first picture, and the lead picture is not among
the thumbnails. The lead picture is in a gallery only where the gallery lists it. Everything else
those records decide stands: the frame and its shape, the row of thumbnails and the raised one, the
larger picture and its steps, and a view with no gallery, which shows its lead picture as before.
ADR-017's radios stand too; the first gallery picture's is the one checked.

## Context

A project's lead picture is what its card shows on the page (DDR-051). Since DDR-081 a view with a
gallery has opened on that same picture and put its thumbnail first in the row, so that a reader
who chose another picture could go back to it. A reader reaches a view from the card, so the first
picture the view showed was the one they had just seen.

The lead pictures are the application on a laptop, made for the card. The gallery's pictures are the
application's screens. On 2026-09-30, looking at the Stock Portfolio Viewer's gallery (#252), the
owner asked that the picture the page shows is not shown again among a project's pictures unless
the project says so, and chose on #253:

* **The view opens on the gallery's first picture**, and the lead picture stays on the card.
* **A project that wants its lead picture in its gallery lists it there.** No project does.

## Decision

**A view shows the pictures its project's `gallery` lists, in the content's order, and nothing is
added to them. It opens on the first. A view whose project has no gallery shows its lead picture.**

* **The frame opens on the gallery's first picture**, whose radio is the one checked in the markup.
* **The row holds a thumbnail for each of the gallery's pictures**, in the content's order. The
  lead's is not among them.
* **A larger picture steps through the same pictures**, and its place counts them: a gallery's
  first is the first of its own count, where it was the second of one more.
* **The lead picture is in a gallery where the gallery lists it**, with a caption, at the place the
  gallery gives it. It is then a gallery picture like any other. This is content alone.
* **A gallery of one picture shows that picture alone**, in the frame with its caption under it, as
  a lead picture is shown, and draws no row. One thumbnail under the picture it shows would repeat
  it, and would be a choice among one.
* **A gallery may hold twelve pictures**, where DDR-081 counted the lead among the twelve. ADR-017's
  twelve places are unchanged.
* **A view with no gallery is unchanged**: its lead picture, and the project's `caption` under it.
  On a view with a gallery that caption is not shown, because the picture it names is not.
* **The page is unchanged.** A card shows its project's lead picture, and the printed CV and every
  link preview are as they were.

## Alternatives Considered

### Option A: keep the lead picture as the first thumbnail (DDR-081)

Pros:
* The view opens on the picture made to present the project.

Cons:
* The reader sees the card's picture twice, once on the page and again on the view.
* The owner asked for it to go.

### Option B: open on the lead picture, without a thumbnail for it

Pros:
* The view still opens on the lead picture.

Cons:
* Once another picture is chosen, nothing leads back to the lead picture. DDR-081 rejected it for
  this reason.

### Option C: leave the picture in the frame out of the row, whichever it is

Pros:
* No picture is on the view twice at once.

Cons:
* The raised thumbnail and its name, which the owner chose on #244, would go, and the row would
  rearrange on every choice.

### Option D: a flag on the project that adds its lead picture to its gallery

Pros:
* One word in the content.

Cons:
* A second way to say what the list already says, and it could only put the picture first.

## Consequences

Benefits:
* A reader who comes from a card sees something new on the view.
* A gallery is what its list says. Whether the lead picture is in it, and where, is the content's.
* One thumbnail fewer in each row.

Tradeoffs:
* A project with a gallery does not show its laptop picture on its view, and its `caption` goes
  unread there.
* The first picture of a gallery is now the first thing a view shows, so its order matters more.

Risks:
* **A gallery picture that is not the frame's shape is what the view opens on.** The Stock Portfolio
  Viewer's are wider than 16:10, so the frame crops their sides (#252). That was one choice away
  before; now it is the first picture seen. DDR-085 answers it: the frame shows a picture whole.
* **A gallery whose first item is a video** opens on the video's poster, with nothing to open
  larger. No gallery has a video. The story that brings the first one decides its place.
  *Decided by DDR-087, on #259: a video is its gallery's last item.*

## Related Documents

* Issue #253, Epic #152
* DDR-081, DDR-083 and DDR-050, which this amends; DDR-082, the larger picture; DDR-053, the
  gallery's content; DDR-051, the card
* ADR-017, how the view holds the picture shown
* #252, the gallery pictures
