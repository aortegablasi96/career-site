# ADR-003-Hosting and Continuous Deployment

Status: Accepted

Date: 2026-09-10

## Context

ADR-001 made the site a static export: every page is an HTML file produced at build time, and
there is no server runtime. It noted that this leaves hosting a low-stakes decision, because
any static file host is sufficient. This ADR chooses one, and decides how changes reach it.

Issue #7 sets the requirements:

* The site is publicly reachable over HTTPS.
* Merging to `main` deploys it automatically, with no manual steps.
* The project's validation commands run on every pull request, and a failure is visible on the
  pull request.
* A failed build never replaces the site that is currently live.

The relevant constraints are:

* The repository is on GitHub and is public, by design. ADR-001 treats the repository as part
  of what a hiring manager may look at.
* The site is maintained by one person, a few times a year. Anything that has to be remembered
  between visits, such as a manual deploy step, a second dashboard, or a credential that
  expires, is a cost paid every time.
* `CLAUDE.md` asks for simplicity and no unnecessary dependencies or integrations.
* The site needs nothing from a host beyond serving files. It has no forms, redirects,
  server functions, or per-request logic.

There is also a domain question. A custom domain is intended, with the apex (`example.com`) as
the canonical address and `www` redirecting to it, but none is registered yet. Issue #7 noted
that the answer does not change the rest of the approach, so this ADR is written to work both
before and after a domain exists.

## Decision

**Hosting: GitHub Pages, published from GitHub Actions.** The repository's Pages source is set to
"GitHub Actions", not to a branch. The build output is uploaded as a workflow artifact and
deployed from there. Build output is never committed to the repository.

**Pipeline: a single workflow, `.github/workflows/ci.yml`.** It runs on every pull request,
on every push to `main`, and on manual dispatch.

* A build job runs `npm ci`, then `lint`, `typecheck`, `test`, and `build`. These are the same
  commands documented in `CLAUDE.md`, with no CI-only variants, so a green check means exactly
  what a green local run means.
* A deploy job runs only for `main`, and only after the build job succeeds. Pull requests are
  validated but never deployed. If any validation step or the build fails, deployment is
  skipped and the live site stays as it was.
* Deployments are queued, not cancelled, so one is never interrupted part way through.
* Token permissions are scoped per job. The build job can only read. Only the deploy job can
  write to Pages. The `github-pages` environment accepts deployments from `main` only.

**The base path comes from the platform, not from code.** GitHub Pages serves a project site
under the repository name, at `/career-site`, and Next.js must know that path at build time to
generate correct asset URLs. The workflow reads the path from the Pages configuration with
`actions/configure-pages` and passes it to the build as `PAGES_BASE_PATH`. `next.config.ts`
passes that to `basePath`. Locally the variable is unset, so `npm run dev` and local builds are
served from the root as before. When a custom domain is configured, Pages reports an empty base
path and the next build uses it, with no code change.

**Domain: no custom domain yet.** The site is served at
`https://aortegablasi96.github.io/career-site/`. A custom domain remains the intended end state,
with the apex canonical and `www` redirecting. Adopting it is a settings change within this
decision, not a new decision:

1. Register the domain.
2. Verify it for the GitHub account under the account's Pages settings, before pointing DNS at
   GitHub. This prevents another account from claiming the domain while it is being configured.
3. Point DNS at GitHub Pages, following GitHub's documentation for an apex domain with a `www`
   subdomain: apex records to GitHub's Pages addresses, and a `www` CNAME to
   `aortegablasi96.github.io`.
4. Set the custom domain in the repository's Pages settings, and enforce HTTPS once the
   certificate has been issued.
5. Run the workflow manually so the site is rebuilt with the empty base path.
6. Replace the URL recorded in `CLAUDE.md`.

No `CNAME` file is committed. GitHub Pages ignores it for sites published from Actions, and the
domain lives in the repository's Pages settings.

## Alternatives Considered

### Option A: Cloudflare Pages

Pros:

* Free, on a fast global network.
* Preview deployments for every pull request.
* Supports custom response headers and redirects through files in the repository.

Cons:

* Adds a second vendor and account, and a GitHub App with access to the repository.
* The build configuration lives partly in Cloudflare's dashboard, outside the repository,
  unless deployment is driven from Actions anyway.
* Its distinguishing features, previews and headers, solve problems this site does not have yet.

Rejected as more than the site needs today. This is the option to revisit if preview
deployments or security headers become important, since GitHub Pages provides neither.

### Option B: Netlify or Vercel

Pros:

* Free tiers, preview deployments, and polished dashboards.
* Vercel is built by the Next.js team and is the framework's most supported host.

Cons:

* An account and a vendor to outlive. Free-tier terms on both have changed before.
* Vercel's advantage is in server features: rendering, image optimisation, and middleware. ADR-001
  gives these up by exporting a static site, so this site would pay for the dependency and use
  none of what it offers.
* The same repository-access and dashboard-configuration costs as Option A.

Rejected for the same reasons as Option A, with less to recommend it for a static export.

### Option C: GitHub Pages published from a branch

The older Pages model, where built files are pushed to a `gh-pages` branch that Pages serves.

Pros:

* No workflow artifacts or deployment API involved.

Cons:

* Commits generated build output into the repository's history on every deploy.
* Still needs an Actions step to build and push, so it is not simpler.
* Branch-published sites are processed by Jekyll by default, which skips the `_next` directory
  unless a `.nojekyll` file is added.

Rejected. Publishing from Actions is GitHub's current recommended model and keeps build output
out of the repository.

### Option D: Separate validation and deployment workflows

Pros:

* Each file has a single purpose.

Cons:

* The deploy workflow must either repeat the validation or deploy commits that were never
  validated. `main` is not branch-protected, so nothing else guarantees the checks ran.
* Two files have to be kept in step on Node version, install, and build.

Rejected. One workflow with a deploy job that depends on the build job makes the guarantee
structural: a commit that has not passed validation cannot be deployed.

### Option E: A hardcoded `basePath`

Pros:

* Local builds would be byte-for-byte identical to production.

Cons:

* The development server would move to `http://localhost:3000/career-site`, and a local build
  could only be viewed under that path.
* Moving to a custom domain would need a code change timed with the DNS change, or the site
  would break in between.

Rejected. The platform already knows the path and reports it correctly after a domain change.
A production-shaped local build is still available by setting `PAGES_BASE_PATH` by hand.

### Option F: Rename the repository to `aortegablasi96.github.io`

Pros:

* The site would be served from the root of `aortegablasi96.github.io`, with no base path.

Cons:

* The repository name would describe a hosting address rather than the project.
* It uses up the account's single user-site slot for something a custom domain does equally well.

Rejected. The custom domain in the steps above gives the same result without either cost.

### Option G: Register a custom domain now

Deferred rather than rejected. No domain is registered yet, and waiting for one would hold back
proving the pipeline, which is the point of issue #7. The decision above is written so that
adding the domain later changes settings only.

## Consequences

Positive:

* No cost, and no new account, vendor, or credential. Everything runs on the GitHub account the
  project already depends on.
* The pipeline is defined in the repository, reviewable in a pull request, and runs the same
  commands a developer runs locally.
* Deployment is gated structurally. A commit that fails any check never reaches the live site.
* Lock-in is minimal. The deployed artefact is the plain `out/` directory, so moving hosts means
  replacing one workflow job and the DNS records.
* Moving to a custom domain needs no code change.

Negative:

* **There are no preview deployments.** A pull request check proves the site builds, not how
  it looks. Reviewing a visual change means building it locally.
* **GitHub Pages does not allow custom response headers.** There is no Content-Security-Policy
  and no control over caching headers. For a static site with no forms, no third-party scripts,
  and no user input, this is an accepted limitation. It becomes a reason to revisit this
  decision if the site ever embeds third-party content.
* **Until a custom domain exists, the address carries the repository name** and is less
  memorable to share. Links shared before the domain is adopted point at the `github.io`
  address. Check that they redirect when the domain is configured.
* **The Pages source and domain are repository settings, not code.** They cannot be reviewed
  in a pull request. This ADR and `CLAUDE.md` record them so they can be found.
* **Free GitHub Pages requires a public repository.** The repository is already public by
  design, so this couples the two decisions rather than adding a cost. Making the repository
  private would mean a paid plan or a different host.
* **`main` is not branch-protected.** A failing commit pushed directly to `main` will not deploy,
  but it will sit on `main` until it is fixed. Requiring the check before merging is a repository
  setting that can be enabled separately.
* The workflow pins actions to major versions. These need occasional upgrading, particularly
  when GitHub retires the Node runtime an action depends on. This is a small but recurring
  maintenance cost.
* GitHub Pages limits published sites to 1 GB and applies a soft bandwidth limit of 100 GB a
  month. Both are orders of magnitude beyond what a single-page site needs.

## Related Documents

* GitHub issue #7, which this decision resolves
* GitHub issue #1, Project Architecture & Foundation, whose Definition of Done this completes
* ADR-001, whose static export makes any static host sufficient
* ADR-002, which does not constrain hosting
* `.github/workflows/ci.yml`, which implements the pipeline
* GitHub's documentation on configuring a custom domain for a GitHub Pages site:
  https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
