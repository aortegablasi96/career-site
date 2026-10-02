# DDR-093-A Missing Address Shows the Top of a View

Status: Accepted

Date: 2026-10-02

**Extends DDR-050 and DDR-059 (role view)** to a page that is neither: the frame a view has, and the
top of one, for an address the site does not have. Neither record changes.

## Context

Issue #283, under Epic #280, found that a wrong or out-of-date address showed Next.js's default
page: "404 | This page could not be found." in black on white, with no contents bar, no link and no
way back, under the home page's own title. A reader who followed a mistyped or old link was left
with a site that looked broken and had to guess an address to recover.

The story asked for a page in the site's own design that leads back into it, still answered with a
404 status and not indexed, with its wording and what it offers left to the owner and the UI
Designer. On #283 the owner chose that it offers the way home alone, and its wording.

## Decision

**An address the site does not have shows a view's frame around the top of a view: the site's
contents bar, a way back to the page, the page's one heading and a line below it, then the site's
footer.**

* **The frame is a view's**, per DDR-050: the site's own contents bar, every link of which leads
  back to the page and none of which is marked, and the site's own footer (DDR-028).
* **"Back to home" leads to the page**, at its top. It stands where a view's way back stands, above
  the heading, with the same look: the chevron, the muted ink and medium weight at the label step,
  no underline, and the accent under the pointer and on focus (DDR-035). Its words follow the views'
  "Back to portfolio" and "Back to experience".
* **The way back is the one thing the page offers**, as the owner chose: the contents bar above it
  already leads to every section, so a second list of them would repeat it.
* **"Page not found" is the page's one `h1`**, in the serif at a view's title size, narrow and wide
  (DDR-050), as far below the way back as a role view's panel stands (DDR-059).
* **One line below it says why the reader may be here**: "The page you’re looking for isn’t here.
  It may have moved, or the address may be mistyped." It is set as a project view's description is:
  body size, the running text's leading, a flow step below the heading.
* **No tinted panel.** A role's panel holds a role's metadata, and this page has none.
* **The footer stands at the window's foot**, as the owner asked on #283. The bar, the view and the
  footer stand in a frame at least the window's height, `--page-min-size` (`100dvh`, so a phone's
  toolbar is counted), and the view takes the room the bar and the footer leave. A window too short
  for all three lets the frame grow, so nothing overlaps. Every other page is taller than a window,
  so the token is read here alone.
* **The browser tab reads "Page not found – Andreu Ortega Blasi"**, as a view's names its project
  or role and then the owner. The page is marked `noindex` and names no canonical address.
* **It does not print anything of its own**; only the page is the printed CV (DDR-015).

## Alternatives Considered

### Keep Next.js's default page

Pros:
* Nothing to build or maintain.

Cons:
* No way back, no bar and the wrong title: the reader is stranded on a page that looks broken.

### The way home and links to the portfolio and the experience

Pros:
* The two sections a reader arriving from an old link most likely wanted are one step away.

Cons:
* The contents bar, directly above, already links to both. The owner chose the way home alone.

### The way home and the introduction's contact controls

Pros:
* A reader could get in touch from the page without going back.

Cons:
* It puts the introduction's controls on a page with nothing to introduce, and #290 decides where
  the controls go beyond the introduction.

## Consequences

Benefits:
* A wrong address leads back into the site in one step, by pointer, touch or keyboard.
* It reuses the views' patterns, so it adds no new interaction, and one token.

Tradeoffs:
* The page's height is measured from the window, in a token as ADR-006 requires, as the contents
  menu's limit already is. A gap opens between the line below the heading and the footer on a tall
  window, which is the page's background.

Risks:
* The way back and the title are written again in the page's own stylesheet, as a role view writes
  a project view's again. A change to a view's way back has to be made here too.

## Related Documents

* #283 and Epic #280
* DDR-050 (project view) and DDR-059 (role view): the frame, the way back and the title size
* DDR-028: the footer. DDR-035: hover states. DDR-015: the printed CV is the page alone
* DDR-014: the 320px floor. DDR-027: target sizes
* ADR-001 and ADR-023: static export served by Vercel, which serves `404.html` for an address it has
  no file for
