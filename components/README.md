# components/

The presentational components. Each takes its text and data as props from
[`content/`](../content/README.md) and holds no text of its own (ADR-002), so changing the copy
never means editing a component.

## Conventions

* **One component, three files**: `name.tsx`, its CSS Module `name.module.css`, and its test
  `name.test.ts(x)`. A small component that only composes others may have no stylesheet.
* **Styles read the tokens** in `app/tokens.css` and write no literal values beyond what ADR-006
  allows. They are mobile-first, and `48em` is the only breakpoint a component may write.
  `stylesheets.test.ts` checks every module against these rules.
* **Binary files go through `asset()`** from `app/asset.ts`. `assets.test.ts` enforces it.
* **Tests run in Node** and render with `react-dom/server`. There is no DOM environment.

## Server and Client Components

Components are Server Components by default. Five are Client Components, each for a reason its ADR
records:

| Component                  | Why it runs in the browser                       | Record  |
| -------------------------- | ------------------------------------------------ | ------- |
| `contents-bar.tsx`         | Reads the scroll position to mark the current section | ADR-007 |
| `business-case-slider.tsx` | Holds which business case item is shown          | ADR-015 |
| `larger-picture.tsx`       | Moves a picture into the larger view's dialog    | ADR-018 |
| `scroll-appear.tsx`        | Reveals content as it scrolls into view          | ADR-025 |
| `digital-twin-chat.tsx`    | Calls the Digital Twin chatbot's API             | ADR-028 |

A sixth Client Component needs a reason of its own, recorded by the Architect.

## What's here

* **Page sections**: `introduction`, `experience`, `projects`, `skills`, `credentials`,
  `languages`, `footer`, and `section`, which wraps each one.
* **Views**: `project-view`, `role-view` and `not-found-view`.
* **Navigation**: `contents`, which renders `contents-bar`.
* **Shared parts**: `timeline`, `date-range`, `metadata-line`, `hint` and `icon`.
* **The chat**: `digital-twin-chat`, `reply`, which renders the chatbot's Markdown, and
  `open-chat`, the command that opens the chat.

The `Components` section of [`docs/implementation-notes.md`](../docs/implementation-notes.md) lists
the traps in each of them.
