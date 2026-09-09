---

name: issue-writer

description: Create well-structured GitHub Epics, User Stories, and Bugs from approved project work. Use when planned or discovered work should be tracked in GitHub.

---

# Issue Writer

## Purpose

Convert approved work into clear, actionable GitHub issues.

GitHub issues are the project's work-tracking and roadmap system.

This skill creates project-management artifacts.

It does not define product requirements, design interfaces, make architecture decisions, or prescribe implementation.

---

## Responsibilities

Owns:

* choosing the appropriate issue type
* translating approved work into GitHub issues
* writing clear issue descriptions
* defining observable acceptance criteria
* identifying relevant scope and out-of-scope work
* linking relevant project decisions and related issues
* recommending existing repository labels

Does not own:

* content strategy
* UX or UI design
* architecture
* implementation
* testing strategy
* prioritization decisions

The Issue Writer should preserve decisions made by other skills rather than reinterpret them.

---

## Issue Types

The project uses three issue types:

* Epic
* User Story
* Bug

Always choose the smallest issue type that accurately represents the work.

### Epic

Create an Epic when the work represents a larger body of related work that should be tracked as multiple issues.

An Epic may:

* span multiple user stories or tasks
* represent a meaningful project milestone
* contain several independently deliverable pieces of work
* require coordination across different areas of the site

Do not create an Epic simply because a change is important.

### User Story

Create a User Story when the work represents one coherent piece of functionality, content, design, or improvement that can be tracked independently.

A User Story should normally:

* have a clear outcome
* be independently actionable
* have observable acceptance criteria
* belong to no more than one Epic

The story should describe the intended result rather than dictate its implementation.

### Bug

Create a Bug when existing behaviour does not work as intended.

Focus on:

* expected behaviour
* actual behaviour
* reproduction steps, when available
* affected area
* acceptance criteria for the fix

Do not use a Bug to disguise a new feature or improvement.

If the desired behaviour itself is new, use a User Story instead.

---

## Required References

Review:

* `.github/ISSUE_TEMPLATE/`
* existing GitHub issues when related work already exists
* relevant GitHub pull requests when historical context is useful

When available, also review the relevant project artifacts:

* Content Brief
* UI Review
* Architecture Review
* DDR
* Refactoring Review
* existing related decisions

The repository issue templates are authoritative for issue structure.

Do not require project-management documentation outside GitHub unless the project explicitly introduces it.

GitHub issues and pull requests provide project history and roadmap context.

Recorded decisions provide durable project knowledge.

---

## Issue Writing Process

### Step 1 — Understand the Work

Identify the approved work that needs to be tracked.

Determine:

* what outcome is expected
* why the work is needed
* what is included
* what is explicitly out of scope
* which decisions already exist

Do not expand the scope without justification.

### Step 2 — Determine the Issue Type

Choose:

* Epic
* User Story
* Bug

Use the smallest appropriate type.

### Step 3 — Review the Repository Template

Inspect the relevant template in:

```text
.github/ISSUE_TEMPLATE/
```

Follow the repository's actual template.

Do not invent a competing issue structure.

### Step 4 — Write the Issue

Populate the template with concise, implementation-neutral content.

Describe the desired outcome and observable behaviour.

Do not prescribe technical implementation unless that implementation has already been decided and documented.

### Step 5 — Add References

Link relevant:

* related GitHub issues
* related GitHub pull requests
* Content Briefs
* UI Reviews
* Architecture Reviews
* DDRs
* Refactoring Reviews

Only include references that are genuinely relevant.

### Step 6 — Recommend Labels

Recommend labels that already exist in the repository.

Do not invent labels.

If the available labels cannot be determined, say so rather than proposing new ones as though they already exist.

### Step 7 — Check Scope

Before finalizing, verify that:

* acceptance criteria are observable and testable
* out-of-scope work is clearly separated
* the issue does not contradict recorded decisions
* implementation details have not been introduced unnecessarily
* the issue is small enough for its chosen type
* related work is linked where appropriate

---

## General Rules

### Describe What, Not How

Issues should describe:

* what needs to be achieved
* why it matters
* what behaviour or outcome is expected

Avoid prescribing:

* specific components
* file structures
* libraries
* implementation techniques
* architectural changes

unless those choices have already been approved and recorded.

### Acceptance Criteria

Acceptance criteria should be:

* observable
* specific
* testable
* relevant to the issue

Do not use implementation tasks as acceptance criteria.

### Scope

Keep each issue focused.

If work contains several independently deliverable outcomes, consider an Epic with separate User Stories rather than one large issue.

Out-of-scope items belong in the repository template's appropriate section, such as `Not Included`.

Do not hide scope exclusions inside acceptance criteria.

### Existing Decisions

Do not redefine decisions captured by:

* Content Strategist
* UI Designer
* Architect
* Design Recorder
* Refactoring Reviewer

If an issue appears to conflict with an existing decision, identify the conflict rather than silently changing the decision.

### GitHub as Project History

Use GitHub issues and pull requests as the source of project work history.

When creating new work:

* link related issues where useful
* reference superseding or dependent work
* avoid duplicating existing issues
* preserve relationships between related pieces of work

The Issue Writer does not maintain a separate roadmap.

---

## Relationship With Other Skills

Typical workflow:

Content Strategist
→ UI Designer
→ Architect
→ Issue Writer
→ Builder
→ Tester

Or, for implementation-focused work:

Architecture / Design / Refactoring Review
→ Issue Writer
→ Builder
→ Tester

Not every change requires every stage.

The Issue Writer should only create an issue once the relevant planning or decision-making work is sufficiently complete.

The Issue Writer translates approved work into GitHub tracking.

It does not use the issue-writing stage to make unresolved product, design, or architecture decisions.

---

## Output

### Issue Type

Epic / User Story / Bug

### Suggested Labels

...

### Related Issues / Decisions

...

### Completed GitHub Issue

Populate the corresponding repository issue template exactly as it should appear in GitHub.

## Do not add sections that are not part of the repository's template unless the repository convention explicitly allows them.

## Key Principle

**GitHub tracks the work; decision records preserve the decisions behind the work.**

The Issue Writer turns approved decisions and planned work into clear GitHub issues without redefining them.