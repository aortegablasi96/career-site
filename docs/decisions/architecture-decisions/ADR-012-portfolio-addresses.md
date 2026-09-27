# ADR-012-The Projects Are the Portfolio, and Their Addresses Say So

Status: Accepted

Date: 2026-09-27

**Amends ADR-010** in its address alone. Each project's view is now at `/portfolio/<slug>`, where
it was `/projects/<slug>`. The page's section is at `#portfolio`, where it was `#projects`. Every
other rule ADR-010 sets stands: the static route, the slug as content, `next/link` with
`prefetch={false}`, the site's own contents bar through `page`, and `asset()` for files alone.

## Context

On #202 the owner renamed the page's projects section "Portfolio". A project view's way back already
read "Back to portfolio". The owner asked for the addresses to use the same word, and for the
pictures' folder in `public/` to follow.

ADR-010 warned that a slug, once shared, is a commitment. The same holds for the part of the address
before it. GitHub Pages serves static files and cannot send a redirect (ADR-003). So an address
someone was sent before this change stops working. The owner was told this on #202 and chose the
rename anyway.

## Decision

* **The route is `app/portfolio/[slug]/page.tsx`**, so each view is built to
  `out/portfolio/<slug>.html` and served at `/portfolio/<slug>`, under `/career-site` on the live
  site. `projectHref` in `components/projects.tsx` is the one place a card, and a view's Previous and
  Next links, get the address from. The slugs do not change.
* **The section's id is `portfolio`**, so the contents bar and a view's way back lead to
  `#portfolio`. The id is still set once, in `app/sections.tsx`.
* **The pictures live in `public/portfolio/<slug>/`**, where they were in `public/projects/<slug>/`,
  so `public/` stays arranged by view. Each is still reached through `asset()`.
* **The old addresses are not kept.** No page is left at `/projects/<slug>`, and nothing answers
  `#projects`: an old view address is GitHub Pages' 404, and an old anchor opens the page at its top.

## Alternatives Considered

### Keep `/projects/<slug>` and rename only the words

Pros:
* Every address already shared keeps working.

Cons:
* The words a reader sees and the addresses they share would disagree. The owner chose the full
  rename on #202.

### Leave a page at each old address that forwards to the new one

Pros:
* An old link would still reach its project, through a `<meta http-equiv="refresh">` page or a
  script at `/projects/<slug>`.

Cons:
* It is a second route per project that exists only to forward. A static host serves it with a 200
  rather than a 301, so search engines see two pages.
* The owner accepted that the old addresses break, and the site is young enough that few can have
  been shared.

## Consequences

Positive:
* The section's name, its anchor, its views' addresses and its files' folder all use one word.

Negative:
* Every `/projects/<slug>` link shared before this change is a 404, and every `#projects` link opens
  the page at its top.
* Each picture's address changed, so a browser fetches it afresh once.
