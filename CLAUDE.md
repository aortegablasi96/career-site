# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains a personal career website.

The site communicates the owner's professional identity, experience, capabilities, selected work, and professional perspective.

The primary goals are:

* clarity
* authenticity
* credibility
* accessibility
* strong content
* simple navigation
* maintainable implementation

Avoid functionality or complexity that does not meaningfully support these goals.

### Current Repository State

The repository currently contains **no application code**: no framework, package manager,
build, lint, or test tooling, and no source files. It holds only project instructions,
skills, and decision-record templates.

Consequences until an implementation exists:

* There are no build, lint, run, or test commands to document. Do not invent them.
* "Follow the existing codebase" and "reuse existing components/patterns" have no referent
  yet. The first change in a given area is a new decision, not a pattern to copy.
* The stack, project structure, hosting, and content model are **undecided**. Choosing any of
  them is an Architect decision that belongs in an ADR before implementation, not a detail to
  settle inside a build task.
* The GitHub repository is `aortegablasi96/career-site` (public), with `main` as the default
  branch. It currently carries only this scaffolding and GitHub's default labels; no issues,
  pull requests, or project labels exist yet, so the GitHub sources of truth below have no
  history to draw on.

When code, tooling, and commands do exist, replace this section with them.

## Project Sources of Truth

Different concerns have different sources of truth:

| Concern                        | Source of truth                 |
| ------------------------------ | ------------------------------- |
| Project work and roadmap       | GitHub issues                   |
| Project history                | GitHub issues and pull requests |
| Durable UI/UX decisions        | DDRs                            |
| Durable architecture decisions | ADRs, when used                 |
| Product/content intent         | Approved workflow artifacts     |
| Implementation                 | Existing codebase               |
| Skill responsibilities         | `.claude/skills/**/SKILL.md`    |

Do not create duplicate documentation when an existing source already serves the purpose.

## Development Principles

* Prefer simplicity over complexity.
* Prefer existing patterns over new abstractions.
* Make the smallest change that solves the problem.
* Avoid speculative functionality.
* Avoid unnecessary dependencies.
* Preserve existing behaviour unless a change is intentional.
* Keep unrelated cleanup out of focused changes.
* Do not invent requirements, content, achievements, metrics, or other facts.
* Document significant decisions rather than relying on undocumented assumptions.

## Architecture

Follow the architecture established by the existing codebase and accepted Architecture Reviews.

Before introducing a new:

* layer
* abstraction
* dependency
* integration
* data store
* architectural pattern

first determine whether an existing pattern can solve the problem.

Significant architectural changes should be reviewed by the Architect and recorded as an ADR when appropriate.

Do not make architectural decisions inside implementation work when those decisions have not been approved.

## UI and Design

Follow the existing UI patterns and approved UI Reviews.

Prefer:

* reuse of existing components
* consistent layouts
* consistent typography and spacing
* accessible interactions
* responsive behaviour
* simple navigation

Do not introduce a new interaction pattern or significantly redesign an existing experience without involving the UI Designer.

Significant and reusable design decisions should be recorded as DDRs.

## Content

Content is a first-class part of the project.

When creating or changing content:

* follow the approved Content Strategy or Content Brief when available
* write for the intended audience
* prioritize clarity and credibility
* preserve the owner's authentic voice
* support claims with real evidence
* never invent professional experience, achievements, clients, metrics, or outcomes

The Content Strategist owns content intent and scope.

The Content Builder implements approved content.

## Accessibility

Accessibility is a requirement.

Preserve and consider:

* semantic HTML
* logical heading hierarchy
* keyboard navigation
* visible focus states
* accessible names and labels
* sufficient colour contrast
* meaningful alternative text
* responsive layouts
* reduced-motion preferences where relevant

Accessibility should be considered during design, implementation, and testing.

## Testing

Testing should be proportional to the change.

Validate relevant:

* functionality
* user workflows
* responsive behaviour
* accessibility
* error and empty states
* integrations
* regressions

Do not consider an implementation complete merely because it builds successfully.

The Tester provides the final validation for work that requires formal testing.

## GitHub

GitHub is the project's work-tracking and roadmap system.

Use GitHub issues and pull requests to understand:

* planned work
* current priorities
* completed work
* related changes
* historical context
* discussions and decisions captured during development

Before starting non-trivial work, check for relevant existing issues and recent related pull requests.

Do not create duplicate issues when existing work already covers the same objective.

Use the repository's issue templates and existing labels.

The Issue Writer owns the creation and structure of GitHub issues.

## Decision Records

Decision records preserve important decisions that should remain understandable after the original work is complete.

Use:

* DDRs for significant UI and UX decisions
* ADRs for significant architecture or technical decisions, when appropriate

Do not create a decision record for every implementation detail.

Do not silently override an accepted decision.

If new work conflicts with an accepted decision:

1. identify the conflict
2. explain the tradeoffs
3. determine whether the existing decision should remain
4. record a new decision if the previous decision needs to change

When a decision supersedes another decision, preserve that relationship explicitly.

### Where Decision Records Live

```text
docs/decisions/architecture-decisions/   ADRs, plus template.md
docs/decisions/design-decisions/         DDRs, plus template.md
```

Copy the sibling `template.md` when writing a new record; both templates require Status, Date,
Context, Decision, Alternatives Considered, Consequences, and Related Documents.

File naming is sequential and descriptive:

```text
ADR-001-short-title.md
DDR-001-short-title.md
```

No decision records have been written yet, so the first of each kind is `001`.
Status values are `Proposed`, `Accepted`, `Superseded`, or `Deprecated`.

## Workflow

The project uses skills to separate responsibilities.

Typical workflow:

```text
Content Strategist
        ↓
   UI Designer
        ↓
     Architect
        ↓
   Issue Writer
        ↓
     Builder
        ↓
      Tester
```

Governance skills are used when appropriate:

```text
UI decision
    ↓
Design Recorder

Refactoring proposal
    ↓
Refactoring Reviewer
    ↓
Architect, if required
```

Not every task requires every stage.

Examples:

* small content change → Content Builder
* small UI change → UI Builder
* bug fix → Issue Writer → Builder → Tester
* significant content work → Content Strategist → Content Builder → Tester
* significant UI work → UI Designer → UI Builder → Tester
* architectural change → Architect → appropriate Builder → Tester
* significant refactor → Refactoring Reviewer → Architect, if required → Builder → Tester

Use the smallest workflow that provides sufficient confidence and preserves important decisions.

Do not create process for its own sake.

## Claude Skills

Project skills live in `.claude/skills/`.

```text
.claude/skills/
├── workflow-skills/
├── execution-skills/
├── governance-skills/
└── project-management/
```

Current workflow skills:

* `content-strategist`
* `architect`
* `ui-designer`
* `tester`

Current execution skills:

* `content-builder`
* `ui-builder`

Current governance skills:

* `design-recorder`
* `refactoring-reviewer`

Current project-management skill:

* `issue-writer`

Each skill's `SKILL.md` defines its responsibilities, workflow, inputs, and outputs.

**Read the relevant `SKILL.md` before using a skill.**

Do not duplicate detailed skill instructions in this file.

## Documentation

There are currently no layer-specific README files.

Do not assume that a README exists for a layer or subsystem.

If a part of the project becomes sufficiently complex to require its own conventions or documentation, add documentation deliberately rather than creating README files by default.

Keep documentation focused on information that would otherwise be difficult to discover or preserve.

## Working With Uncertainty

When requirements, design, architecture, or content are unclear:

* identify what is known
* identify what is uncertain
* avoid inventing missing information
* use existing GitHub context and decision records
* involve the appropriate skill when a decision is required

Do not silently resolve significant product, content, design, or architecture questions during implementation.

## Final Principle

**Keep the project simple, intentional, credible, and understandable.**

Use GitHub to track the work.

Use decision records to preserve important decisions.

Use skills to separate responsibilities.

Use the existing codebase as the default implementation reference.

When something is unclear, identify the uncertainty rather than inventing a requirement or silently making a significant decision.