# ADR-005-A Separately Designed CV

Status: Accepted

Date: 2026-09-16

Supersedes the part of ADR-004 that makes the downloadable CV a PDF saved from the page's own print
output. The rest of ADR-004 stands unchanged: the file's location and name, the size budget, where
binary assets live, the `asset()` helper, and the digest that ties the file to the content.

## Context

ADR-004 was written on the assumption that the downloadable CV would be a photograph of the page. It
argued that this was the cheapest way to satisfy ADR-002's objection to a second artefact, because a
file that *is* the print output cannot disagree with the page about anything.

When the owner supplied the file, it was not that. It is a two-page CV designed in Canva, and the
page prints on five A4 sheets. The two documents are independent designs carrying overlapping facts.

That is Option B in both ADR-002 and ADR-004 — "a separately maintained PDF, typeset
independently" — which both records rejected. So it cannot simply be committed. Either the file
changes or the decision does.

### Why the decision changes instead

The owner chose to keep the designed CV, and the reasoning is sound enough to record rather than
merely obey.

A CV is not only a list of facts. It is a document a recruiter opens beside a dozen others, and its
design is part of what it communicates. The page's print output is a good web page printed: five
sheets, set in the site's reading typefaces, laid out for a screen first. It is honest and legible,
and it is not competitive as a CV document. ADR-004 reached for it because it was architecturally
cheap, which is the wrong reason to pick the artefact a hiring decision is made from.

The project's stated goals are clarity, authenticity and credibility. Nothing about them requires the
CV and the page to be the *same document*. They require the two not to contradict each other.

### What actually has to be protected

ADR-002's objection was never about duplication for its own sake:

> Two hand-maintained representations of the same facts drift apart, and a visitor who reads both
> sees the site and the CV disagree. The drift is silent and the cost lands on credibility.

The word doing the work is **silent**. A separately designed CV makes drift possible; what makes it
dangerous is nobody finding out. So this record keeps ADR-004's alarm and adds the one thing a
separately authored document needs and a photograph of the page did not: a statement of exactly which
facts have to agree, and which document wins when they do not.

### The drift was already there

The supplied file was compared against `content/` before this record was written. It disagreed with
the site in eight places on the day it arrived, which is the strongest available argument that the
mechanism below is necessary rather than ceremonial:

| | The CV | The site |
| --- | --- | --- |
| The current job title | Global Product Manager - UPS Digital Services | Global Product Specialist, Digital Solutions |
| Randstad's location | Ghent, Belgium | Leuven, Belgium |
| Randstad's end date | June 2023 | May 2023 |
| The fifth role | Absent | Electronic and Software Engineer, Electrónica Digital de Protección, 2018–2020 |
| Projects | RAG chatbot, Coin Collection SaaS, LLM Evaluation & Quality Framework | NumisBook, Career Conversation Chatbot, Stock Portfolio Viewer, This site |
| A metric | "reducing manual evaluation time by up to 20%" | Nowhere on the site |
| Language levels | English Fluent, Italian Intermediate | English C1, Italian B2 |
| The university | Universitat Politècnica, Barcelona | Universitat Politècnica de Catalunya |

Two of these are the kind a recruiter notices: a different job title at the present employer, and a
different city for a past one. One of them — a percentage that appears in the CV and nowhere on the
site — is the kind `CLAUDE.md` forbids inventing, and it has no counterpart to check against.

None of this is an argument against a designed CV. It is a measurement of what a designed CV costs if
nothing holds it to account.

## Decision

**The downloadable CV is a separately designed document, authored outside this repository, and
committed to it.** Everything ADR-004 decided about where it lives, what it is called, what it may
weigh and how it is referenced stands.

Three things keep it honest.

### 1. The site is the source of truth for every shared fact

Where the CV and the page state the same fact, **the page is right by construction and the CV is
corrected to match it** — never the other way round. The site's content was set by a Content Brief on
#25 and is the record the owner has reviewed as a whole.

This is a rule about which document yields, not a claim that the site is never wrong. When the site
is the one in error, the site is corrected first, in `content/`, and the CV then follows from it. The
correction never lands only in the CV.

### 2. The shared facts are a closed list

These are the facts that must agree. Everything else in the CV — its wording, its ordering, its
emphasis, its summary, the design itself — is free.

* Every employer's name, and the job title held there.
* Every role's start and end date, to the month, and its location.
* **Every role the site lists appears in the CV.** The CV may be shorter in its wording but not in
  its employment history, because a gap reads as a gap.
* Every credential's name, its awarding body, and the date it was granted.
* Every language and its level, in the same vocabulary the site uses.
* Every named project, and every metric or quantified claim attached to one.

The last is the strictest, deliberately. A number in a CV is a claim, and `CLAUDE.md` forbids
inventing metrics. **A metric may appear in the CV only if it appears on the site**, where it sits in
context and can be checked. A project the site does not carry cannot bring a number in with it.

### 3. The digest is the alarm, and it fires on change

ADR-004's mechanism is kept exactly as it was. `content/cv.ts` holds the control's label, the file's
path, and a `contentDigest` over the content modules that hold the site's prose. `content/cv.test.ts`
recomputes it and fails when it does not match, so a change to any fact on the page fails the test
suite, and ADR-003 refuses to deploy a failing build.

Under ADR-004 the digest meant "re-save the page". Under this record it means **"the facts moved;
take the list above and check the CV against it"**. Refreshing is:

1. Change the content in `content/`, as usual.
2. The test fails. Read the list of shared facts above.
3. Update the CV in the design tool, re-export it, and replace
   `public/andreu-ortega-blasi-cv.pdf`.
4. Update `contentDigest` to the value the test reports.

The digest catches *change*. It cannot catch a disagreement that was there from the start, because
nothing changed. That is why the list exists and why reconciling the current file is a precondition
of shipping it rather than a follow-up.

### What this record does not do

It does not require the CV's text to be generated, checked or parsed by anything. The comparison is
made by a person against the list above. The reasoning is in Alternatives.

## Alternatives Considered

### Option A: Keep ADR-004 as written, and commit the page's print output

Pros:

* The strongest possible guarantee: one document, so no fact can disagree with another, and no list
  of shared facts is needed at all.
* No reconciliation work, now or ever.
* It is the decision already accepted, so nothing has to be superseded.

Cons:

* The artefact a hiring decision is made from would be chosen for the convenience of the
  architecture. That is the wrong basis.
* Five sheets set in a web page's reading typefaces is not competitive beside CVs that were designed.
* The redesign on Epic #42 changes the printed page anyway, so the file would be resaved at #52
  regardless.

Rejected by the owner, knowingly, and recorded here because it is what ADR-004 decided and what this
record has to justify leaving. **It remains available**: nothing below depends on the file having
been authored anywhere in particular, so reverting to a printed page means replacing one file.

### Option B: Check the CV automatically, by extracting its text and comparing it to `content/`

A test would read the PDF, pull out its text, and assert that each shared fact appears in it.

Pros:

* It would catch the disagreement that was there from the start, which the digest cannot.
* It would make the closed list above executable rather than a thing to remember.

Cons:

* It needs a PDF text-extraction dependency, on a project whose entire dependency tree is Next.js and
  React and which has resisted adding to it twice already.
* **The extraction is not reliable enough to assert against.** Reading the supplied file back
  demonstrated it: the CV is laid out in columns, and the extracted text interleaves them, so the
  PMI-CPMAI certification came out separated from the words around it and initially read as missing.
  A check that reports facts as absent when they are present would be turned off within a month.
* Only the facts that are short exact strings could be asserted at all. A job title or a city works;
  a date written "October 2024 - Present" against a `2024-10` in the content does not, without a
  format translation layer that is itself a thing to maintain.
* It would give a false sense of coverage. Passing would mean "these strings appear somewhere in the
  file", not "the documents agree".

Rejected as a check that would be fragile, partial and disbelieved. If the CV is ever produced as
something structured rather than a design export, this becomes worth revisiting.

### Option C: Reconcile by changing the site to match the CV

Pros:

* No work on the CV, which is the document that is harder to edit.

Cons:

* It inverts the source of truth. The site's content was written against a Content Brief, reviewed as
  a whole, and is the version that has been through the project's own process.
* Several of the differences are ones where the CV is the likelier error, such as a role missing
  entirely from the employment history.
* It would import into the site a metric with no evidence behind it, which `CLAUDE.md` forbids.

Rejected. Where the site turns out to be the one in error, it is corrected in `content/` first, and
the CV follows — which is the rule above, not an exception to it.

### Option D: Keep both, and say nothing

Ship the designed CV without a statement of what has to agree, relying on the owner to keep the two
aligned.

Pros:

* No record to write and no list to maintain.

Cons:

* It is precisely the silent drift ADR-002 named, with the eight existing disagreements as proof that
  it is not a theoretical risk.
* It would leave ADR-004 standing while the repository contradicted it, which `CLAUDE.md` forbids.

Rejected.

## Consequences

Positive:

* **The CV is the document the owner actually wants to hand someone**, designed as a CV rather than
  derived from a web page.
* **What must agree is written down**, so the check is a readable list rather than a judgement made
  differently each time.
* **The direction of correction is fixed.** Disagreements resolve towards the site, so the two cannot
  take turns being right.
* **No new dependency**, and no new build step. ADR-004's digest does the alarm work unchanged.
* **Metrics are held to the same standard in both documents**, which closes a gap ADR-004 never
  considered because a photograph of the page could not open one.
* **The decision is reversible.** Returning to the printed page replaces a file and reinstates
  ADR-004.

Negative:

* **Two documents exist, authored independently, and they can disagree.** This is the cost ADR-002
  refused to pay and ADR-004 avoided. It is now accepted deliberately, with the list and the digest
  as the mitigation, and it is the principal risk this record carries.
* **The initial reconciliation is real work**, and it is the owner's: eight differences, at least two
  of which need a decision about which document is factually right rather than which is preferred.
* **The CV is edited outside the repository**, in a tool this project does not control. Its source is
  not versioned here, only the export. If the design tool becomes unavailable the CV cannot be
  updated, only replaced.
* **The digest cannot see the CV at all.** It watches the content and infers. A CV edited to disagree
  with an unchanged site produces no failure anywhere.
* **The shared-facts list has to be maintained.** If the site gains a kind of fact the list does not
  name, the list is what needs revising, and nothing forces that to happen.
* **The refresh is now a four-step manual loop involving a third-party tool**, where ADR-004's was a
  browser save. It is slower, and it is the step most likely to be skipped under time pressure.

## Related Documents

* GitHub issue #56, which adds the CV under this record
* ADR-004, whose rule that the file is the page's print output this record supersedes, and whose
  location, name, budget, helper and digest it keeps
* ADR-002, whose objection to a second artefact this record answers differently rather than avoids
* ADR-003, whose pipeline refuses to deploy when the digest test fails
* DDR-010, which decides where the CV control sits and that it does not print
* GitHub issue #42, the Career Page Redesign, which adopted the download
* GitHub issue #48, which builds the control the file is downloaded from
* GitHub issue #25 and its Content Brief, which set the site content this record makes authoritative
