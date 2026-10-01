# ADR-023-Hosting on Vercel

Status: Accepted

Date: 2026-10-01

Supersedes ADR-003's choice of host, GitHub Pages, and its domain steps. What ADR-003 required of
a host stands: HTTPS, a merge to `main` deploys with no manual step, every pull request is
validated, and a failing build never replaces the live site. So does its reasoning for one workflow
that validates.

## Context

ADR-003 put the site on GitHub Pages and rejected Vercel as a second vendor whose server features a
static export (ADR-001) would never use. Issue #267 reverses that: the owner wants Vercel as the
live host, and the host their own domain will point at.

The site has not changed shape. It is still a static export with no server runtime, so any host
that serves files will do, and the question is only how changes reach the new one without losing
ADR-003's guarantees.

Two of ADR-003's accepted limitations are features on Vercel:

* **Preview deployments.** Every pull request gets its own address, so a visual change can be
  reviewed without building it locally.
* **Custom headers and redirects**, which ADR-003 and ADR-012 record GitHub Pages cannot send. This
  decision uses neither; they are available when a story needs one.

## Decision

**Hosting: Vercel, through its Git integration.** A Vercel project, `career-site` in the owner's
account, is linked to the repository. A push to `main` deploys to production. A push to any other
branch, and so every pull request, deploys a preview. Vercel's default deployment protection keeps
previews behind a Vercel login; production is public.

**Vercel runs the checks before it builds.** Vercel's build does not wait for GitHub Actions, so
`vercel.json` sets its build command to the same four commands CI runs:

```text
npm run lint && npm run typecheck && npm run test && npm run build
```

Any failure fails the deployment, and Vercel keeps serving the last one that succeeded. That is
ADR-003's guarantee kept by the host itself rather than by a workflow job.

**GitHub Actions validates and no longer deploys.** `.github/workflows/ci.yml` keeps its one job,
which runs the four commands on every pull request and every push to `main`, so a failure is still
visible on the pull request. The deploy job, the Pages permissions and the manual trigger go.

**No base path.** Vercel serves the site from the root, so `PAGES_BASE_PATH` is unset everywhere and
`next.config.ts`, `asset()` and their tests stay as they are, dormant. Taking the mechanism out is a
refactor of its own, not part of moving host, and it would have to come back if the site were ever
served under a path again.

**Domain: none yet.** Until one exists the site is served at Vercel's production address for the
project. The intended end state is unchanged from ADR-003: the apex is canonical and `www`
redirects to it. Adopting it is a settings change within this decision:

1. Register the domain, through Vercel or any registrar.
2. In the Vercel project's Domains settings, add the apex and `www`, and choose to redirect `www`
   to the apex.
3. Create the DNS records the dashboard then shows, or point the domain's nameservers to Vercel.
   Vercel issues the certificate once they resolve.
4. Replace the URL recorded in `CLAUDE.md`.

No rebuild is needed: with no base path, the same build serves any address.

**Adopted on 2026-10-01: `andreuortegablasi.com`.** Its DNS is at Cloudflare, with a CNAME for the
apex (flattened by Cloudflare) and one for `www`, both to the targets Vercel's Domains settings
give, and both "DNS only": proxied through Cloudflare, Vercel cannot issue the certificate. `www`
and plain HTTP redirect permanently (308) to `https://andreuortegablasi.com`. The project's own
address, `https://career-site-chi.vercel.app`, still serves the site.

**The GitHub Pages site is unpublished** once production on Vercel has been checked, from the
repository's Pages settings. It would otherwise keep serving the last build it received, out of
step with the site. GitHub Pages cannot redirect (ADR-012), so a link to the `github.io` address
ends at GitHub's 404.

## Alternatives Considered

### Option A: Stay on GitHub Pages

Pros:

* No second vendor or account, as ADR-003 argued.

Cons:

* It is not the host the owner has chosen to put their domain in front of.
* No preview deployments, and no headers or redirects.

Rejected by the owner on #267.

### Option B: Deploy from GitHub Actions with the Vercel CLI

The workflow's deploy job runs `vercel deploy --prebuilt` after the checks pass.

Pros:

* The gate stays in one place, the workflow, exactly as ADR-003 built it.
* The checks run once per push, not twice.

Cons:

* A Vercel token stored as a repository secret: a credential to create, scope and renew, which
  ADR-003 counted as a cost paid on every visit.
* Preview deployments would have to be built into the workflow by hand.

Rejected. Running the checks twice costs a minute of build time; a token costs attention.

### Option C: Vercel's Git integration with its default build command

Pros:

* The least configuration.

Cons:

* Vercel would run `npm run build` alone, so a commit that failed lint, typecheck or a test, such as
  the CV digest (ADR-005), would still reach production. That breaks ADR-003's guarantee.

Rejected.

### Option D: Vercel's deployment checks, waiting on GitHub Actions

Pros:

* The checks run once, in CI, and Vercel holds production until they pass.

Cons:

* The gate is configured in Vercel's dashboard, where a pull request cannot review it.

Rejected in favour of a build command the repository records.

## Consequences

Positive:

* Every pull request has a preview address.
* The gate is in the repository, in `vercel.json`, and runs the commands a developer runs locally.
* Adding the domain is a settings change with no rebuild.
* Lock-in stays minimal. The deployed artefact is still the plain `out/` directory.

Negative:

* **A second vendor and account**, with the terms of a free plan that can change. Vercel's Hobby plan
  is for personal, non-commercial use, which a personal career site is.
* **The host's configuration is partly in a dashboard.** The project link, the domain and deployment
  protection are Vercel settings, not code. This record and `CLAUDE.md` say where they are.
* **The checks run twice for each push**, once in Actions and once on Vercel.
* **Vercel's GitHub App has access to the repository**, as ADR-003 noted of every hosted option.
* **Links to the `github.io` address break** once Pages is unpublished.
* Vercel's Hobby plan allows one concurrent build, so pushes in quick succession queue.

## Related Documents

* GitHub issue #267, which this decision resolves
* ADR-003, superseded, for the pipeline's original reasoning
* ADR-001, whose static export any host can serve
* ADR-004, whose `asset()` helper stays, with the base path unset
* ADR-012, on addresses GitHub Pages could not redirect
* `vercel.json` and `.github/workflows/ci.yml`, which implement it
* Vercel's documentation on adding a domain: https://vercel.com/docs/domains/add-a-domain
