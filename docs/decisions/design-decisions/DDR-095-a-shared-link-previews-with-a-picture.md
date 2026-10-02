# DDR-095-A Shared Link Previews With a Picture

Status: Accepted

Date: 2026-10-02

## Context

Issue #282, under Epic #280, found that a link to the site shared on LinkedIn, Slack, WhatsApp or X
previewed with a title and description but no picture. A reader scrolling a feed saw a bare line of
text where other links showed a large image, and the site, whose purpose is to be shared with
recruiters and hiring managers, was the least visible link among them.

The owner supplies every picture the site shows. On #282 they asked for a card to be designed for
the page instead, chose between two drafts, and agreed that a project's view previews with the
project's own lead picture.

## Decision

**Every address previews with a large picture at 1200 × 630, the 1.91:1 that LinkedIn, Slack,
WhatsApp and X draw a large preview at, and asks X for its large card.**

* **The page, every role's view and the page an address the site does not have preview with the
  share card**: the introduction's photo in its pill frame on the left; on the right a short rule,
  the owner's name in Lora SemiBold, the positioning line in DM Sans Medium and the location. White
  and pale indigo type on the accent (`--color-accent`), the colour of the tab icon (DDR-094).
  The owner chose it over the same card on the page's own surface, because it stands out in a
  white feed.
* **The card does not show the site's address.** The first card had it at its foot; the owner
  removed it when #282 was reopened.
* **A role's view takes the card** because a role has no picture of its own, and a company's logo
  would be a third party's mark.
* **A project's view previews with its lead picture**: the application on a laptop, scaled to 1200
  wide and cut to 630 tall from the middle, which keeps the screen whole. Its description is the
  lead's.
* **Every picture is a JPEG**, within 150 KB, because not every platform draws a WebP and a crawler
  fetches it once, at once.
* **The card's description is what it says**: the name, the positioning line and the location,
  taken from the introduction.
* **The card is drawn once, from the site's own fonts, photo and tokens**, and committed as a file.
  It does not follow a later change to the introduction or the accent on its own.

## Alternatives Considered

### The card on the page's own surface

Pros:
* Reads as the top of the site itself.

Cons:
* The pale surface nearly disappears against a white feed. The owner chose the accent.

### The introduction's photo alone

Pros:
* Nothing to design.

Cons:
* A 3:4 portrait cut to 1.91:1 loses the face or the shoulders, and it says nothing of who the owner
  is or what the link leads to.

### A picture drawn at build time, from code

Pros:
* The card would follow a change to the introduction or the accent.

Cons:
* It needs Next.js's image generation at build, a new route per picture and the fonts loaded into it,
  for a card that changes once in years. ADR-001's static export keeps it a file.

## Consequences

Benefits:
* A shared link to any address shows a large picture: the owner and their positioning, or the
  project it leads to.

Tradeoffs:
* A role's view previews with the same card as the page; the title and description still name the
  role.

Risks:
* The card repeats the name, positioning line, location and accent as pixels. A change to any of
  them leaves the card out of date until it is drawn again. `app/share.test.ts` holds its size and
  description, not its pixels.
* A platform caches a preview for days; a changed picture shows only after the platform re-reads
  the address.

## Related Documents

* #282 and Epic #280
* DDR-094: the tab icon on the same accent. DDR-021: the photo's pill frame
* DDR-050: a project view's lead picture
* ADR-001: static export. ADR-004: asset paths. ADR-024: the site's own address, under which the
  pictures' addresses are written
