# ADR-014-A Project View's Switch Holds Its State Without Script

Status: Accepted

Date: 2026-09-28

**Supersedes nothing and amends nothing.** A project's view gains a control with state, per
DDR-079, and it gains **no Client Component**: the state is held by native radio buttons and read
by the stylesheet. `ContentsBar` is still the site's one Client Component, per ADR-007 as ADR-013
amends it, and ADR-001's "`'use client'` requires a reason" is not met a second time.

## Context

On #231 a project's view lets the reader switch between two accounts of the project, its overview
and its business case. Which account is shown is state that only the browser has. The issue asked
the Architect whether and how the view gains a Client Component for it. ADR-007 made the contents
bar the site's one, and said its reason "is not a precedent for the next one".

The switch has to be operable by keyboard, say to assistive technology which account is chosen,
work before hydration and without script, and leave the view's static HTML reading the overview,
as it did before.

## Decision

**The switch is a native radio group, and the stylesheet shows the account whose radio is
checked. There is no script, no React state and no new Client Component.**

* **The browser holds the state.** Two `input type="radio"` sharing one `name`, the overview's
  `defaultChecked`, each inside its `label`, in a `div` with `role="radiogroup"` and an
  `aria-label`. `ProjectView` stays a Server Component and renders both accounts.
* **The stylesheet shows one account.** The business case is `display: none`, and
  `.text:has(.caseChoice:checked)` hides the overview and shows the business case. What is drawn is
  what the radio says, as the contents bar draws `aria-current` and `aria-expanded` rather than a
  class.
* **The rest of the overview follows the same rule.** While the business case is shown, "Built
  with", the technologies and the view's links carry `.overviewOnly` and are hidden, and a plain anchor with `download` to the full business case is shown, as the CV control
  downloads its file, per ADR-004. It needs no script either.
* **A hidden account is out of the accessibility tree**, because `display: none` removes it, so a
  screen reader meets only the account shown.
* **Tests stay in Node.** The markup is tested on the server as every component's is, the
  stylesheet's rules are read as text, and the behaviour is checked in a browser, with script
  enabled and disabled.

## Alternatives Considered

### A second Client Component with `useState`, drawn as tabs

Pros:
* The ARIA tabs pattern, with `aria-selected` and `aria-controls`.

Cons:
* A second Client Component, which ADR-007 asks a reason for, when the browser already has a
  control that holds a choice of one among several and announces it.
* It does nothing before hydration or without script. A reader without script could not reach the
  business case at all.
* It ships script and a hydration boundary to a view that has none today.

### `:target`, with a fragment per account

Pros:
* No script, and each account has an address.

Cons:
* Choosing an account adds a history entry and scrolls the page to its target. The Back button
  would then switch accounts rather than leave the view. #231 leaves addresses out of scope.

### `details` and `summary`

Pros:
* No script, and it is announced as expanded or collapsed.

Cons:
* It discloses one block. It cannot replace one account with another, which is what the owner
  asked for.

## Consequences

Benefits:
* The switch works before hydration and without script, with no script shipped for it.
* The site still has one Client Component. The view stays a Server Component.
* The browser provides the keyboard behaviour and the announcement, so neither is written or
  tested here.

Tradeoffs:
* Which account is shown is decided in the stylesheet, by `:has()` on the view's text column. The
  component and its stylesheet must agree on two class names, which `components/project-view.test.tsx`
  holds.
* A browser may restore the checked radio when the reader comes back to a view through the
  history, so they may find the business case where they left it. That is the browser's form
  restoration, not a remembered choice.

Risks:
* A browser without `:has()` shows the overview and a switch that changes nothing. Every browser
  the site supports has it.
* A later need to remember the choice, or to give each account an address, would need script or a
  route, and a new record.

## Related Documents

* DDR-079, the switch's design
* Issue #231, part of Epic #152
* ADR-001, ADR-007 and ADR-013, the site's one Client Component
* ADR-010, the project views
