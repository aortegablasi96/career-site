# ADR-004-Downloadable CV and Binary Assets

Status: Accepted

Date: 2026-09-16

**Amended by ADR-010** in one respect: an `href` handed to `next/link` is a route of this site,
which `next/link` gives the base path itself, and does not go through `asset()`. Every `src`,
`poster` and `href` on a plain element still does.

Supersedes the part of ADR-002 that rules out a separate CV file. The rest of ADR-002 stands: content
is still authored as typed TypeScript modules in `content/`, the page is still the CV, and the print
stylesheet is still what produces it.

The part of this record that makes the downloadable CV a PDF saved from the page's own print output
is `Superseded` by ADR-005, a separately designed CV, on 2026-09-16. The file the owner supplied was
a separately designed document rather than a photograph of the page, and ADR-005 decides to keep it
and to state what must agree between the two. Everything else here stands, and ADR-005 keeps it
explicitly: the file's location and name, the size budget, where binary assets live, the `asset()`
helper, and the digest below.

## Context

Epic #42 rebuilds the career page to a design the owner made in Figma, and that design adds two
things this site has never had.

The first is a **"Get my CV" download**. It is the fourth control in the introduction, and DDR-010
has decided where it sits, what it looks like, that it is at least 44 by 44 pixels, and that it does
not print. DDR-010 deliberately left one question open, and named this story as its owner: whether
the control downloads a file at all, and if so how that file is produced. In the Figma draft the
control points at `/cv.pdf`, a file that does not exist.

The second is **binary content**. The redesign needs a profile photo, a screenshot for each of three
projects, a poster still and a demo video for the fourth. Until now the only binary files in the
repository have been the four font files in `app/fonts/`, and `next/font/local` handles those.

### What ADR-002 decided, and why

ADR-002 states that the page itself is the CV and that no separate PDF is maintained or generated. It
rejected a separately maintained PDF for a specific reason, not a stylistic one:

> Two hand-maintained representations of the same facts drift apart, and a visitor who reads both
> sees the site and the CV disagree. The drift is silent and the cost lands on credibility, which is
> one of the project's stated goals.

It also considered generating a PDF at build time, and deferred rather than rejected it:

> It cannot drift, and it offers a genuine download button. It was not chosen because it requires a
> PDF generation dependency and layout work to produce output worth downloading, in order to improve
> on what browser print already does. If a download button is later judged important, this is the
> option to take.

The owner has now judged the download button important, on Epic #42. So the question this record
answers is not whether a file may exist. It is **what stops the file and the page disagreeing**, and
ADR-002's reasoning is the standard any answer has to meet.

### What has changed since ADR-002

Two things, both of which make the printed page a stronger candidate than it was.

The print output is no longer a hope. DDR-005 designed it, #14 and #23 checked its page breaks, and
DDR-008 fixed the one case Firefox got wrong. DDR-009 and #40 went further and made what a saved PDF
*says* part of the design: ligatures are off, and the serif fonts were re-derived, so every word
comes out of a saved PDF exactly as it reads on screen. Saving the page as a PDF is already a
routine, documented check on this project, performed in two browsers with the text read back out.

Layout work, which ADR-002 named as half the cost of generating a PDF, is therefore already done and
already paid for by another decision.

### The base path trap

ADR-003 serves the site from GitHub Pages under `/career-site`, and passes that path to the build as
`PAGES_BASE_PATH`, which `next.config.ts` hands to `basePath`. Next.js applies the base path to
`next/link` hrefs and to the assets it emits itself, but **not** to a root-relative string written
into a plain `src`, `href` or `poster` attribute. Next.js's own documentation says the same of
`next/image`: the base path has to be added in front of `src` by hand.

This was verified against this repository rather than assumed. Building with
`PAGES_BASE_PATH=/career-site` set, a link written as `href="/spike.txt"` came out of the build as
`/spike.txt`, which 404s on the live site, while the identical file reached through a helper that
prefixes the variable came out as `/career-site/spike.txt`. Locally, where the variable is unset,
both are correct. That asymmetry is exactly the failure mode this story was written to prevent: it
shows up on the live site and never in development.

### The limits that apply

* GitHub Pages publishes sites up to 1 GB and applies a soft bandwidth limit of 100 GB a month, as
  ADR-003 records.
* The built site is about 0.85 MB today, of which roughly 72 KB is the four fonts.
* Git stores a whole new blob for every version of a binary file, forever. Binaries are not
  diffed and not usefully compressed between versions.
* ADR-001 keeps the site static, ADR-003 adds no vendor beyond GitHub, and `CLAUDE.md` asks for
  simplicity and no unnecessary dependencies.

## Decision

### 1. The downloadable CV is the page's own print output, saved as a PDF and committed

> **Superseded by ADR-005.** The CV is a separately designed document, authored outside this
> repository. What replaces the guarantee this section rested on is a closed list of the facts the
> two documents must share, and a rule that the site wins when they disagree. Section 2's digest is
> unchanged and does more work than it did here.


The file is `public/home/andreu-ortega-blasi-cv.pdf`. It is produced by building the site, opening the
page in a browser, and saving it as a PDF through the print stylesheet — the same output any visitor
gets by printing the page themselves. It is then committed to the repository.

It is named for the owner rather than `cv.pdf`, because the name is what lands in the reader's
downloads folder.

There is no PDF generation dependency, no second layout, and no build step. The CV control is a plain
anchor to a static file, so it needs no JavaScript and does not make its component a Client
Component.

This is the whole point of the choice: **there is still only one design of the CV.** The PDF is not a
second rendering of the facts, it is a photograph of the first one.

> **Superseded by ADR-005.** There are now two designs, and the cost of that is accepted deliberately
> rather than avoided. ADR-005 records what holds them together, and why the artefact a hiring
> decision is made from should not be chosen for the architecture's convenience.

### 2. A digest ties the file to the content, so it cannot go stale silently

`content/cv.ts` holds the control's label, the file's path, and a `contentDigest`: a SHA-256 over the
content modules that hold the site's prose — every `content/*.ts` except `types.ts`, which holds no
prose, `cv.ts` itself, which cannot fingerprint itself, and the tests.

`content/cv.test.ts` recomputes that digest and fails when it does not match. **Changing any fact on
the page therefore fails the build, and keeps failing, until the PDF is re-saved and the digest
updated.** ADR-003 runs the test suite on every pull request and refuses to deploy when it fails, so
the site cannot go live carrying a CV that disagrees with it. The test's failure message says what to
do.

Refreshing the CV is:

1. `npm run build`, and serve `out/`.
2. Save the page as a PDF, and check it as `CLAUDE.md` already requires: in Edge and Firefox, reading
   the text back out of both, with no replacement characters and no substituted apostrophe.
3. Replace `public/home/andreu-ortega-blasi-cv.pdf`.
4. Update `contentDigest` in `content/cv.ts` to the value the test reports.

The digest covers the facts, not the appearance. A change to the print treatment or to a component
changes how the CV looks without changing the digest, and will not fail anything. That is a
deliberate limit: extending the digest to the components and stylesheets would fire on nearly every
commit, and a check that cries wolf gets bumped without being obeyed, which would destroy the only
guarantee this mechanism offers. #52, and any later change to the print treatment, must re-save the
CV as part of its own work.

### 3. Binary assets live in `public/`, under one rule

`public/` is the only place a binary file lives, other than the fonts that `next/font/local` already
owns. Next.js copies it into `out/` unchanged, and GitHub Pages serves it.

* **Committed to this repository.** No Git LFS, no external host, no CDN.
* **No image pipeline.** No `next/image`, and no `images` configuration in `next.config.ts`. Assets
  are prepared once, by hand, at the size they are shown, and referenced by plain `<img>` and
  `<video>` elements with explicit dimensions.
* **One file per asset.** WebP for the photo and the stills, MP4 with H.264 video and AAC audio for
  the demo video, PDF for the CV. No `<picture>`, no second `<source>`, no format fallbacks. Every
  browser the site supports reads all three.
* **The video carries a poster still and `preload="none"`**, so it costs nothing until someone presses
  play. The poster is a separate committed still, and it is what prints, per DDR-010.
* **Replacing an asset replaces the file.** Variants and sizes do not accumulate beside it.

### 4. Every reference goes through one helper

`app/asset.ts` exports a single function:

```ts
asset('/home/andreu-ortega-blasi-cv.pdf'); // → '/career-site/home/andreu-ortega-blasi-cv.pdf' in production
```

It prefixes `process.env.PAGES_BASE_PATH`, which is the same variable `next.config.ts` reads and is
resolved at build time, because every component on this site is a Server Component rendered during
the export. Locally the variable is unset and the helper returns the path unchanged.

**No component may write a root-relative asset path directly** into a `src`, `href` or `poster`
attribute. A test in `components/` enforces this, in the same way `components/stylesheets.test.ts`
holds every stylesheet to ADR-001's tokens-only rule. The rule is easy to break by accident and
impossible to notice locally, so it is checked rather than remembered.

The paths themselves are data and live in `content/`, beside the alternative text they belong with,
per ADR-002 and DDR-010. Components receive them as props and pass them through the helper.

An asset imported from a TypeScript or CSS module would instead be emitted by the bundler under
`_next/static/media/`, content-hashed, with the base path already applied. Nothing on this site does
that, and nothing needs to; it is recorded because it is what the fonts do and a reader will
otherwise wonder why assets are treated differently.

### 5. Size budget

| What | Budget | Why |
| --- | --- | --- |
| The profile photo | 100 KB | Shown at 208px square; enough for twice that |
| Each still: three screenshots, one video poster | 150 KB each | Shown in a 280px column |
| The demo video | 6 MB | A short demo at a size a 280px column can justify |
| The CV PDF | 2 MB | Five A4 sheets carrying the photo and four stills |
| All of `public/`, together | 10 MB | Two orders of magnitude under Pages' 1 GB |
| Everything the page fetches before the video is played | 1.5 MB | The site is about 0.85 MB today |

When an asset exceeds its budget, the asset is re-derived. Raising a number here is a change to this
record, made deliberately, and not something an implementation story decides on its own.

## Alternatives Considered

### Option A: Keep ADR-002's rule, and have the control print the page

The control would open the browser's print dialogue rather than download anything.

Pros:

* Nothing to keep in step, because nothing is duplicated. ADR-002 stands untouched.
* No binary in the repository, and no refresh procedure.

Cons:

* It needs `window.print()`, which makes the introduction a Client Component and puts JavaScript on a
  page that has none.
* A control that carries a download icon and opens a print dialogue misleads the reader about what it
  does.
* A visitor who wants a file to attach to an application has to perform the save themselves, and the
  result depends on their browser's settings rather than on anything this project controls.

Rejected. The owner adopted a download on Epic #42, and this is the option that decision replaces. It
is recorded because it is what ADR-002 decided, and what this record has to justify leaving.

### Option B: A separately maintained PDF, typeset independently

A CV written in a word processor or a LaTeX template, exported and committed.

Pros:

* The document can be typeset for paper without any constraint from the page.
* It is what most people mean by "my CV", and the format is familiar to edit.

Cons:

* It is precisely the drift ADR-002 named, with nothing structural to stop it. Two documents, two
  editing habits, and no signal when they disagree.
* The disagreement lands on credibility, which is the one thing a career site cannot afford to lose.
* It doubles the work of every content change, and the second half is the half that gets forgotten.

Rejected, on ADR-002's original reasoning, which remains correct.

### Option C: Generate the PDF at build time with a headless browser

Print the built page to PDF with Playwright or Puppeteer, as part of `npm run build`.

Pros:

* It cannot drift at all, not even in appearance. The strongest guarantee available.
* No manual step, ever.
* It uses the same print stylesheet, so there is still only one design.

Cons:

* A large development dependency that downloads a browser, on a project whose entire dependency
  budget is Next.js and React.
* The build would have to serve `out/` on a local port and drive a browser against it, which is real
  orchestration in a project that currently builds with one command and no moving parts.
* ADR-003 guarantees that CI runs exactly the commands a developer runs locally, with no CI-only
  variants. Honouring that means every checkout installs a browser; breaking it costs the guarantee.
* DDR-009 exists because PDF text fidelity is browser-specific and had to be found by reading the
  text back out of a saved file. A PDF generated in CI is verified by nobody.

Rejected as disproportionate today. **This is the option to take if the digest check becomes a
nuisance**, or if content starts changing often enough that the manual refresh is a real cost. The
decision above is designed so that adopting it later changes how the file is produced and deletes
`content/cv.ts`, and nothing else: the file's location, its name and every reference to it stay as
they are.

### Option D: Generate the PDF from the content with a PDF library

`@react-pdf/renderer`, `pdfkit`, or similar, drawing from the same `content/` modules.

Pros:

* Cannot drift, and needs no browser.
* Full control over pagination and paper typography.

Cons:

* A second layout to design, implement and maintain — exactly the layout work ADR-002 named, and
  worse now than when it wrote that, because DDR-010's page is two-dimensional: a timeline, a media
  column, cards and badges would all have to be rebuilt in a second rendering model.
* Two layouts is the same drift problem as two documents, moved from the facts to their presentation.
* The print stylesheet would still have to exist and be maintained, because the page must still print.

Rejected.

### Option E: Link to a CV hosted elsewhere

LinkedIn's generated PDF, or a file on Google Drive.

Pros:

* No binary in the repository, and no size budget.

Cons:

* A second place to maintain the same facts, outside version control, and a vendor to outlive.
* The link rots silently when sharing settings change.
* A reader following it leaves the site for a third party's interface.

Rejected, for the reasons ADR-003 rejected additional vendors.

### Option F: Static imports, with assets co-located beside the components that use them

`import photo from './photo.webp'` next to the component, as `next/font/local` does for the fonts.

Pros:

* The base path is applied automatically, so the trap this record is partly about would not exist.
* Assets are content-hashed and immutable, so a replaced asset can never be served stale.
* Assets sit beside the code that uses them.

Cons:

* **It does not work for all of them.** Only image extensions have a module type. Verified in this
  repository: importing a `.pdf` and an `.mp4` fails the build with `Unknown module type. This module
  doesn't have an associated type.` So the CV and the video would have to live in `public/` anyway,
  and the repository would carry binaries in two places under two rules, with "where does this file
  go?" having two answers.
* With `output: 'export'`, `next/image` additionally needs `images: { unoptimized: true }` or a custom
  loader, after which it offers nothing a plain `<img>` with explicit dimensions does not.

Rejected for the split rule, which is the one thing this decision most wants to avoid. It is recorded
in full because it is the approach a reader familiar with Next.js will reach for first, and the
reason it is not used is not obvious.

### Option G: Register Turbopack loaders for `.pdf` and `.mp4`, and import everything

Pros:

* Restores the single rule Option F loses, with the base path still automatic.

Cons:

* Configuration in `next.config.ts` plus a module declaration file for TypeScript, to arrive where
  `public/` and a five-line helper arrive.
* It makes the asset strategy depend on bundler configuration, which is the part of a Next.js project
  most likely to change under the project's feet.

Rejected as machinery bought to avoid a helper that is smaller than the machinery.

### Option H: `assetPrefix`

Pros:

* One configuration value rather than a helper at each reference.

Cons:

* Next.js's documentation states that `basePath` is better suited for hosting under a sub-path, and
  recommends against `assetPrefix` for this exact case.
* It does not cover the `public/` folder at all, which is where the assets are, so it would not solve
  the problem it is being considered for.

Rejected.

### Option I: Git LFS

Pros:

* Keeps large binaries out of the repository's own history.

Cons:

* The deploy workflow's checkout needs `lfs: true`, or the deployed site ships pointer files instead
  of images — a failure that appears only on the live site, which is the failure mode this record
  exists to close.
* Storage and bandwidth quotas, on an account that has none of these concerns today.
* At this volume the history growth it prevents is a few megabytes over the life of the project.

Rejected as a cure worse than the disease it treats.

### Option J: The video on YouTube or Vimeo

Pros:

* No video in the repository, no bandwidth against Pages' limit, and adaptive streaming for free.

Cons:

* A third-party embed, on a site that ADR-003 records has no control over response headers and
  therefore no Content-Security-Policy.
* It sets cookies and tracks the visitor on the owner's behalf.
* A vendor, an account, and a link that can rot.
* Epic #42 already excludes embedding the chatbot itself for the same reasons; embedding a video of
  it would be inconsistent.

Rejected.

## Consequences

Positive:

* **No new dependency, and no new build step.** The CV is produced by a browser the owner already
  opens to check the print output.
* **There is still one design of the CV.** The downloadable file is the printed page, so the two
  cannot look different, and improving one improves the other.
* **Facts cannot drift silently.** A content change fails the test suite, and ADR-003 refuses to
  deploy a failing build, so the live site cannot serve a CV that contradicts the page it sits on.
  ADR-002's objection is answered structurally rather than by care.
* **One rule for binaries, and one place they live.** "Where does this file go?" has one answer, and
  "how do I link to it?" has one answer.
* **The base path is handled once.** A test catches the mistake locally, on a machine where the
  symptom is invisible.
* **Nothing is fetched for the video until someone plays it**, so the heaviest asset costs the
  ordinary visitor nothing.
* **Leaving is cheap.** Option C can be adopted later without moving a file or changing a reference.

Negative:

* **A second artefact now exists**, which ADR-002 avoided entirely. The digest makes the dangerous
  half of the drift loud, but it does not abolish the artefact.
* **Appearance drift is not caught.** A change to the print treatment or to a component can leave the
  committed PDF looking like an older page while every check passes. #52 and any later print change
  carry the obligation to re-save.
* **Refreshing the CV is a manual step**, and a four-part one: build, save, verify in two browsers,
  update the digest. Content changes a few times a year, so this is a small recurring cost, but it is
  a cost, and it is the price of not taking Option C.
* **Binary blobs accumulate in Git history.** Every re-saved CV is a new copy kept forever. At a few
  times a year this is megabytes over the project's life.
* **`public/` assets are not content-hashed.** GitHub Pages serves everything with a ten-minute
  cache, so a replaced asset can be served stale for that long. It is not worth engineering around.
* **The video spends bandwidth per play** against Pages' 100 GB monthly soft limit. At 6 MB it would
  take roughly seventeen thousand plays a month to approach it.
* **The helper is a rule a person has to follow.** The test enforces it for the files it scans; an
  asset referenced from somewhere the test does not look would slip through.
* **The size budget is a judgement, not a measurement.** The numbers come from the sizes DDR-010
  displays the assets at and from what the site weighs today. They should be revisited if the design
  changes what the assets are for.

## Related Documents

* ADR-005, which supersedes the part of this record that makes the file the page's print output
* GitHub issue #45, which this decision resolves
* GitHub issue #42, the Career Page Redesign, which adopts the download and the media
* ADR-002, whose rule against a separate CV file this record supersedes in part, and whose content
  model it leaves untouched
* ADR-001, which keeps the site static and every component a Server Component
* ADR-003, which serves the site under a base path, and whose pipeline refuses to deploy a failing
  test
* DDR-010, which decides where the CV control sits, that it does not print, and that the video's
  poster is what prints
* DDR-005 and DDR-008, the print treatment that produces the CV, and GitHub issue #52, which reworks
  it and must re-save the CV when it does
* DDR-009 and GitHub issue #40, which make what a saved PDF says part of the design, and whose check
  the committed file must pass
* GitHub issue #47, which adds the photo and the project media under this record
* GitHub issue #48, which rebuilds the introduction and carries the CV control. No story on Epic #42
  is named as producing the CV file itself; it belongs with the control.
* The UI Review on GitHub issue #43, which fixes the control's placement and defers its mechanism
  here
* Next.js documentation on `basePath`, which states that the base path must be added in front of an
  image `src` by hand
