# ADR-006-Literal Values in Component Stylesheets

Status: Accepted

Date: 2026-09-16

Refines ADR-001's styling boundary. It supersedes nothing: ADR-001's rule that design values are
custom properties defined once at the root stands exactly as written. What this record adds is the
line between a design value and a value that is not one, which ADR-001 left to judgement and which
`components/stylesheets.test.ts` has been enforcing on its own reading of it.

## Context

ADR-001 decides that design tokens are defined once as custom properties at the root and that
component styles are authored as CSS Modules that read them. `CLAUDE.md` states the working rule
that follows from it: *a value the tokens do not provide is a design decision to make, not a number
to invent.* `components/stylesheets.test.ts` enforces it by matching every size and space
declaration in every component stylesheet against a pattern of tokens and keywords.

Until #50 that pattern admitted `0`, `auto`, `none` and `var(--token)`. #50 widened it to admit
`100%` as well, and did so inside implementation work, on the Builder's own reading of ADR-001. The
Tester flagged the reading as one the Builder should not make alone, and the owner put the question
on #51 rather than opening an issue for it, because #51 is the story that would live with the
answer three more times.

The need on #50 was real and was measured. `--project-media-width` is `17.5rem`, so at a 320px
viewport with the root at 200% the media would be 560px wide and the page would scroll sideways,
which DDR-014 forbids. `max-inline-size: 100%` is what stops it: the media caps to 273px, 241px and
177px as the root grows through 16px, 32px and 64px. The alternatives the Builder tried — stretching
a replaced grid item, a `minmax(0, …)` track, an intrinsic cap — each failed for a reason recorded
on #66.

What #51 then found is that the three sections it rebuilds do not need `100%` anywhere. The skills
groups and the language cards sit in `1fr` grid tracks, and the education timeline reuses the
tokens the experience timeline already has. So the widening is not on its way to becoming the normal
way to write a size: one element on the site needs it, and it needs it on one property.

The testing on #51 then found a second case, on the other side. #68 records it: the introduction's
photo is sized in rem, so it grows with the reader's text while the name held beside it is left with
less and less room, until at 200% on a 320px screen the name breaks onto seventeen lines of about
one letter each. The fix is `min-inline-size: min-content` on the name — a block that establishes
its own formatting context and cannot fit beside a float moves below it instead, so asking for at
least the longest word is what tells the browser when beside is no longer possible. That is the same
kind of value as `100%` on a maximum, arriving at the same moment from the opposite direction, and
the first draft of this record would have forbidden it.

The question this record answers is therefore narrow, and worth answering once: **which literal
values may a component stylesheet write, and why are they not design decisions?**

## Decision

A component stylesheet may write, in a size or space declaration, only:

1. **`var(--token)`**, a design token defined at the root.
2. **`0`**, which is the absence of a size or a space and is the same number in every system.
3. **`auto`** and **`none`**, which hand the decision to the layout or remove a constraint.
4. **`100%` on `max-inline-size` and `max-block-size`, and nowhere else.**
5. **`min-content` on `min-inline-size` and `min-block-size`, and nowhere else.**

Everything else is a design decision, and belongs in `app/tokens.css` with a decision record behind
it.

The shape of the rule is worth stating on its own, because it is what a sixth case should be tested
against rather than the list: **a limit may name the space there is or the space the content needs;
a size may not.** The two sides of a box's constraints are where a stylesheet says "not past here",
and what lies past there is decided by the page, the reader and the text rather than by the design.
A size says how large something is, which is exactly what a token exists to hold.

### Why the first three are not design decisions

None of them is a length. `0` is nothing, `auto` is "whatever the layout works out", and `none`
removes a limit that was there. A reader who wants to know how large something is learns nothing
from any of them, so none of them can disagree with the design system.

### Why `100%` on a maximum, and only there

`max-inline-size: 100%` says **"no wider than the room there is"**. It names the space the element
has been given rather than a size of its own, so there is no number for a token to hold: the value
it resolves to is whatever the parent was already given by the page column, the gutter and the
reader's font size. It is a constraint against overflow, not a measurement.

The same `100%` on any other property is a design value and stays forbidden:

* `inline-size: 100%` is a real choice — it says the element fills its parent rather than taking its
  own width — and a component that wants it is deciding a layout, not preventing an overflow.
* `padding-inline: 100%` and its relatives are percentages of a width, which is a measurement, and
  a nonsensical one.
* A minimum at `100%` is an overflow rule written backwards.

Restricting it to the two maxima keeps the guard as tight as it was for everything else while
admitting exactly the case that was measured. It also means the rule can be checked mechanically
rather than argued about: the test reads the property name, not the intent.

### Why `min-content` on a minimum, and only there

`min-inline-size: min-content` says **"at least the longest word"**. It is measured from the content
and from the face it is set in, so it changes with the text, with the typeface and with the reader's
font size. There is no number a token could hold here either: the value the design would have to
write down is "whatever 'Andreu' is wide at whatever size the reader has chosen".

It is the counterpart of `100%` on a maximum. One says the element may not outgrow the room it was
given; the other says it may not be squeezed below what its own content needs. Neither states a
size, and a reader who wants to know how large the element is learns nothing from either.

The same keyword on any other property is a design value and stays forbidden:

* `inline-size: min-content` is a layout choice — shrink this box to its longest word — and a
  component that wants it is designing, not preventing a squeeze.
* `max-inline-size: min-content` is a cap written as a content measurement, which is the same choice
  said backwards.

`max-content` and `fit-content` are **not** admitted. Nothing on the site needs them, and neither
carries this record's argument: `max-content` asks for the width of the text unwrapped, which is a
size, and `fit-content` is a preference between two of them. A later story that wants one should
argue for it here rather than read this list as "intrinsic keywords are fine".

### Where the rule lives

`components/stylesheets.test.ts` enforces it, and its comment points at this record rather than
making the case itself. The test was confirmed on #50 to still bite — a `padding-inline: 7px`
injected into `projects.module.css` fails it — and narrowing the allowance can only make it bite
harder.

`app/globals.css` is not a component stylesheet and is not covered: it applies tokens to plain
elements and is held to its own rules.

## Alternatives Considered

### Option A: Ratify the widening as #50 wrote it, allowing `100%` on any size or space

Pros:
* No change to the code that shipped on #50.
* One rule to remember: `100%` is a keyword, everywhere.
* This was the outcome the Tester on #66 thought most likely.

Cons:
* It admits `inline-size: 100%`, which is a genuine layout decision, and `padding: 100%`, which is a
  measurement. Neither is "the room there is".
* The argument that carries the case — that `100%` names available space — is only true on a
  maximum. Ratifying it everywhere would record a reason that does not hold where the rule reaches.
* #51 shows nothing else on the site needs it, so the broader rule buys no work.

### Option B: Reject the widening, and find another way to cap the projects' media

Pros:
* The guard returns to exactly what it was, and no interpretation has to be recorded at all.

Cons:
* The alternatives were tried and each failed: a replaced grid item does not shrink below its
  intrinsic width by stretching, a `minmax(0, …)` track collapses the media at the wide breakpoint,
  and an intrinsic cap gives the box no size before the file arrives, which reintroduces layout
  shift.
* What remains is a token for the cap, which would be a design value that is not one — the number
  it would hold is "the parent's width", which changes with the viewport and cannot be written down.
* DDR-014 forbids horizontal scrolling at 320px and 200% text, so the cap cannot simply be dropped.

### Option C: Allow `100%` wherever, but require a comment justifying each use

Pros:
* Flexible, and the reasoning stays next to the code.

Cons:
* A test cannot check a justification, so the guard would rest on review alone — which is the
  situation that produced this question.

### Option D: Keep the rule to `100%`, and solve #68 without an intrinsic keyword

This was the shape of this record's first draft, which forbade `min-content`. The alternatives to it
were tried on #68:

Pros:
* One fewer keyword in the rule, and one fewer thing to tell apart from its neighbour.

Cons:
* Dropping the `h1`'s `display: flow-root` halves the height but restores the L-shaped wrap around
  the photo that #48 added the rule to prevent, which the UI Review calls the one place on the page
  it would be most obvious.
* Sizing the photo in px would stop it growing with the text, which is a token decision DDR-010 made
  deliberately so the photo keeps its proportion to the name beside it.
* A token holding the width at which the name no longer fits would have to be a number that depends
  on the reader's font size, the typeface and the length of the owner's name. It cannot be written
  down, which is the same reason `100%` could not be tokenised.
* A third breakpoint would be a new decision and a new record, for something that is not a width.

## Consequences

Positive:
* The interpretation #50 made inside implementation work is now a decision with a reason behind it,
  which is what `CLAUDE.md` asks for.
* The guard is tighter than it was after #50: three of the four properties the widening opened are
  closed again.
* A future stylesheet that reaches for `inline-size: 100%` fails the test and has to say why, which
  is the conversation worth having.
* The rule is mechanical. Nobody has to decide whether a particular `100%` is "really" a size.
* It has a shape rather than only a list, so the sixth case has something to be tested against:
  a limit may name the space there is or the space the content needs, a size may not.
* #68's fix is one declaration rather than a redesign of the introduction, because the rule the
  browser already implements — a formatting-context root that cannot fit beside a float moves below
  it — is reachable once the minimum may be written.

Negative:
* One more record to read before writing a stylesheet, for a rule that affects two declarations on
  the site today.
* The distinctions are subtle. `max-inline-size: 100%` and `inline-size: 100%` differ by three
  characters, `min-inline-size: min-content` and `inline-size: min-content` by four, and the test is
  the only thing that tells either pair apart.
* If a later design genuinely needs an element to fill its parent, or to shrink to its longest word,
  the rule will have to be revised rather than worked around. That is intended, but it is a cost.
* The list grew once within a single pull request, which is a fair warning that it will grow again.
  The shape above is the defence: each addition has to be a limit, and has to be a value no token
  could hold.

## Related Documents

* GitHub issue #51, which carried the question, and the owner's comment on it that set the three
  outcomes this record chose between
* GitHub pull request #66, which made the widening, and the Testing Report on it, which flagged the
  reading as one the Builder should not make alone
* GitHub issue #50, the projects section, whose media is the one element that needs the `100%`
  allowance
* GitHub issue #68, the introduction's name under enlarged text, which is the one element that needs
  the `min-content` allowance, and GitHub issue #48, which added the rule #68 corrects
* ADR-001, whose styling boundary this record refines
* DDR-013, which holds the spacing scale and the radii the tokens provide
* DDR-014, whose rule against horizontal scrolling at 320px is what the cap protects
* `components/stylesheets.test.ts`, which enforces this record
