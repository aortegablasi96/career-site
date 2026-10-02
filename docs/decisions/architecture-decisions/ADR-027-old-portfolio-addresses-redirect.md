# ADR-027-The Portfolio's Old Addresses Redirect to Their New Places

Status: Accepted

Date: 2026-10-02

**Amends ADR-012** in its "The old addresses are not kept". `/projects/<slug>` now redirects
permanently to `/portfolio/<slug>`, and `/projects` to the page at its portfolio. Everything else
ADR-012 decided stands, including that `#projects`, an anchor, opens the page at its top. Uses the
redirects ADR-023 recorded Vercel can send.

## Context

On #202 the project views moved from `/projects/<slug>` to `/portfolio/<slug>`. ADR-012 let the old
addresses break for two reasons: GitHub Pages could not send a redirect, and few links could have
been shared. The first no longer holds. Since ADR-023 the site is on Vercel, which can. A link the
owner put in an application or a message before the rename still answers 404 today (#284).

Next.js's own `redirects()` in `next.config.ts` cannot carry it: a static export (ADR-001) does not
support redirects, and `next dev` fails on them. The host has to send them.

Vercel already sends a permanent redirect (308) from any address that ends in a slash to the same
address without it, so `/projects/` and `/projects/<slug>/` reach the rules below in a second hop.

## Decision

**Two redirects in `vercel.json`, both permanent (308):**

```text
/projects/:slug  →  /portfolio/:slug
/projects        →  /#portfolio
```

* **One rule for every slug**, not one per project. The slugs did not change on #202, so the rule
  holds for every project there was, and needs no edit when a project is added. An old address
  with a slug the site never had redirects to `/portfolio/<that slug>`, which answers the site's own
  404 page (DDR-093), as it did before.
* **`/projects` leads to the page at its portfolio section**, `/#portfolio`, which is where a reader
  following it would expect to land. The browser keeps the fragment of a redirect's `Location`.
* **Permanent**, so search engines move what they knew of the old address to the new one.
* **The host's configuration stays in the repository.** `vercel.json` already holds the build
  command (ADR-023), so a pull request reviews the redirects as it reviews the gate.
* `app/vercel.test.ts` holds the file to these rules, so a project's old address cannot be lost
  without failing the suite.

## Alternatives Considered

### Option A: Keep the old addresses broken (ADR-012)

Pros:
* Nothing to configure.

Cons:
* Its reason, a host that cannot redirect, is gone. A link shared before #202 still fails.

### Option B: One redirect per project

Pros:
* Only addresses the site once had are redirected.

Cons:
* A second list of slugs to keep in step with `content/projects.ts`.
* No reader-visible gain: an unknown slug ends at the same 404 page either way.

### Option C: A page at each old address that forwards to the new one

Pros:
* Works on any static host.

Cons:
* ADR-012 rejected it: a second route per project, served with a 200, not a 301 or 308, so search
  engines see two pages.

### Option D: Send `/projects` to the page's top

Pros:
* No fragment in the destination.

Cons:
* The reader lands at the introduction, not at the projects they were looking for.

## Consequences

Positive:
* Every `/projects/<slug>` link shared before #202 opens its project's view again, and search engines
  carry the old address over.
* No new route, file, dependency or Client Component; the build is unchanged.

Negative:
* The redirects live on the host. Serving `out/` elsewhere, or with a local static server, loses
  them: `/projects/<slug>` answers 404 there. They can be checked only on a Vercel deployment.
* `/projects/` and `/projects/<slug>/` take two hops, the trailing slash first.

## Related Documents

* GitHub issue #284, which this decision resolves, and Epic #280
* ADR-012, amended, and ADR-010, which it amended
* ADR-023, whose host sends the redirects
* `vercel.json` and `app/vercel.test.ts`, which implement and hold it
