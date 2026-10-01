# ADR-024-Search engine discoverability

Status: Accepted

Date: 2026-10-01

Amends ADR-023, where it says no rebuild is needed for a new domain. The site now states its own
address, so a new domain is a one-line change in `content/site.ts` as well as a settings change.

## Context

The owner wants their site to be the first result when someone searches for their name (#270).
ADR-023 put it on Vercel at `andreuortegablasi.com`, but it gave search engines nothing to work
from:

* `robots.txt` and `sitemap.xml` returned 404.
* No page named a canonical address. The same build is served at `andreuortegablasi.com`, at
  `career-site-chi.vercel.app`, and, until it is unpublished, at the old `github.io` copy. A search
  engine left to choose between them may pick the wrong one or split the ranking between them.
* Nothing told a search engine that the site, the LinkedIn profile and the GitHub profile belong to
  the same person. For a query that is a person's name, that link is what a search engine needs.

Search Console, the links from the owner's profiles, and unpublishing GitHub Pages are the owner's
actions, outside the code. This record is about what the site itself says.

## Decision

**The site states its own address once.** `content/site.ts` gains `url`,
`https://andreuortegablasi.com`. Everything below derives from it.

**Every page names its canonical address.** The root layout sets `metadataBase` to `site.url`.
The home page sets `alternates.canonical` to `/`, and each project and role view sets it to its own
path. The home page sets it rather than the layout, because a layout's value is inherited by every
view and would declare each one a copy of the home page.

**`robots.txt` and `sitemap.xml` are generated** by `app/robots.ts` and `app/sitemap.ts`, the
Next.js metadata routes. `robots.txt` lets every crawler read the whole site and names the sitemap.
The sitemap lists the home page and every view, from the same slugs that `generateStaticParams`
uses, so a new project or role is listed without a change here. It gives no `lastModified`: the
build has no honest date for when a page last changed, and a date that moved with every build
would tell a search engine nothing.
Both routes export `dynamic = 'force-static'`, which a static export requires before it will build
them (ADR-001).

**The home page carries the owner as a schema.org `Person`**, as JSON-LD in a native `<script>`
after the footer, which is what Next.js's guide recommends. `app/person.ts` builds it from
`content/`:

* name, photo, description and location from the introduction and the site;
* job title and employer from the role that has no end date;
* `sameAs` from the contact links that are web addresses, which are LinkedIn and GitHub.

Every value is one the page already shows, so the data states nothing the page does not. `<` is
escaped in the script's text, as the guide advises.

**The base path stays dormant.** If `PAGES_BASE_PATH` were ever set, `site.url` would need the path
too. With Vercel serving from the root (ADR-023), it does not.

## Alternatives Considered

### Option A: Static `robots.txt` and `sitemap.xml` in `public/`

Pros:

* No code, and nothing for the static export to declare.

Cons:

* The sitemap would have to be edited by hand for every new project or role, and would drift.
* The domain would be written in a second place.

Rejected.

### Option B: Read the address from an environment variable

Pros:

* A new domain would need no code change, as ADR-023 promised.

Cons:

* The variable would have to be set in Vercel's dashboard, where a pull request cannot review it,
  and a build without it would produce wrong canonical links without failing.
* The domain changes rarely, and when it does, a one-line change in a reviewed file is the safer
  path.

Rejected.

### Option C: No canonical links, and redirect the other addresses instead

Pros:

* One address would answer, with no tag needed.

Cons:

* GitHub Pages cannot redirect (ADR-012). Vercel can redirect its own `vercel.app` address, but
  only as a dashboard setting, and a canonical link costs nothing besides.

Not adopted instead. A redirect may be added later as well.

### Option D: Structured data on every page

Pros:

* Each view would carry the person too.

Cons:

* The person is the subject of the home page. On a project or role view, the `Person` would
  describe something other than the page.

Rejected. The home page is the one to rank for the owner's name.

## Consequences

Positive:

* Search engines can find every page from the sitemap, and know which address is the real one.
* The site, the LinkedIn profile and the GitHub profile are tied to one person in data a search
  engine reads.
* The sitemap follows the content, so it cannot fall behind it.
* Nothing visible changes, on screen or in print.

Negative:

* **A new domain now needs a code change** to `site.url`, besides the settings ADR-023 lists.
  Until it lands, canonical links point to the old domain.
* **The CV digest (ADR-005) fingerprints `content/site.ts`**, so changing the address moves it,
  though the address is not a shared fact.
* **Ranking is not in the code's control.** This makes the site readable. Being first for the
  owner's name also depends on Search Console and on links from the owner's profiles.

## Related Documents

* GitHub issue #270, which this decision resolves
* ADR-023, which this amends, for the host and the domain
* ADR-001, for the static export the routes must build in
* ADR-005, whose digest covers `content/site.ts`
* `app/robots.ts`, `app/sitemap.ts`, `app/person.ts` and `content/site.ts`, which implement it
* Next.js's guide on JSON-LD, in `node_modules/next/dist/docs/01-app/02-guides/json-ld.md`
