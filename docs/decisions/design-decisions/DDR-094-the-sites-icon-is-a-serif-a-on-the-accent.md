# DDR-094-The Site's Icon Is a Serif A on the Accent

Status: Superseded

Date: 2026-10-02

**Superseded by DDR-106**: the icon is the owner's "AO" mark on a white rounded square (#331).
The three files, their sizes, the browser's rounded square and the phone's full square stand; the
white serif A on the accent does not.

## Context

Issue #281, under Epic #280, found that the site had no icon: `/favicon.ico` answered 404 on every
page load, so a browser's tab, bookmarks and history showed their blank page beside the title, and
a phone added the site to its home screen with a screenshot. Among a reader's open tabs, the site
was the one without a mark.

The owner supplies every mark the site shows. On #281 they asked for a design to be proposed
instead, from four candidates drawn from the site's own fonts and colours, and chose this one.

## Decision

**The site's icon is a white capital A in Lora SemiBold, the headings' serif, on the accent
(`--color-accent`, #4f46e5).**

* **The letter is an outline**, taken from the committed Lora 600 file, so the icon needs no font
  wherever it is drawn. It is about three fifths of the icon's height, centred.
* **In a browser it is a rounded square**: the corner a fifth of a side (14 of 64), close to the
  large radius the site's panels take, so it reads as the site's own shape at 16px.
* **On a phone's home screen it is the full square**, 180 pixels, with no transparency: the phone
  rounds its corners itself, and a transparent corner would show black.
* **Three files, linked by Next.js from every route's head:** `icon.svg` (any size), `favicon.ico`
  (16, 32 and 48 pixels, each rendered at its own size, for browsers and crawlers that ask for it
  by name, and for search results) and `apple-icon.png` (180 pixels).
* **One mark on light and dark browser themes**: the accent stands clear of a white tab and of a
  dark one, so the icon has no dark variant.

## Alternatives Considered

### "AO" in the serif, accent on the tags' pale tint

Pros:
* Both initials, in the site's quietest colours.

Cons:
* At 16px the pale square nearly disappears on a white tab, and two letters are too small to read.

### "A" in the bar title's bold sans, white on the heading ink, in a circle

Pros:
* The most legible letterform at 16px, and the bar title's own face.

Cons:
* The dark circle nearly vanishes on a dark browser theme, and it does not carry the accent.

### "AO" in the bold sans, white on the accent, in a circle

Pros:
* Both initials, in the accent.

Cons:
* The two letters are cramped at 16px.

## Consequences

Benefits:
* Every page's tab, bookmark and history entry carries the site's mark, and no page load logs a 404
  for an icon.

Tradeoffs:
* A single letter says less than both initials. It is the most legible mark at the size a tab draws.

Risks:
* The icon's colour is the accent's value, written into the files. A change to `--color-accent`
  leaves the icon in the old colour until the files are drawn again; `app/icon.test.ts` fails when
  the two disagree.

## Related Documents

* #281 and Epic #280
* DDR-025: the colour system and the accent. DDR-023: Lora SemiBold for headings
* DDR-013: the radii
