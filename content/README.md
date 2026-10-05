# content/

All the text the site shows, as typed TypeScript modules (ADR-001, ADR-002). A copy change happens
here and should never need a component to change.

## How it fits together

* **`types.ts`** defines the shape of every record.
* **One module per content type** exports its records. `app/` imports them and passes them to
  [`components/`](../components/README.md) as props.
* Modules may read each other so that a fact is stated once. For example, `site.ts` builds the
  page title from the introduction's name and positioning.

| Module            | What it holds                                                      |
| ----------------- | ------------------------------------------------------------------ |
| `site.ts`         | Title, description, address and link previews                      |
| `introduction.ts` | Name, positioning, summary, location and contact links             |
| `contents.ts`     | The contents bar's labels                                          |
| `experience.ts`   | The roles, oldest first, and each role's view                      |
| `projects.ts`     | The projects, their business cases and galleries, and each project's view |
| `skills.ts`       | Skill groups and levels                                            |
| `credentials.ts`  | Degrees and certifications                                         |
| `languages.ts`    | Languages and their CEFR levels                                    |
| `dates.ts`        | How months and a current role's end are written                    |
| `cv.ts`           | The downloadable CV file and its content digest                    |
| `chat.ts`         | The Digital Twin chat's text                                       |
| `not-found.ts`    | The page shown for an address the site doesn't have                |

## Rules

* **Never invent facts.** Every claim traces to the owner's knowledge base in
  `docs/knowledge-base/` or to the owner's own answers on an issue. Draw only the facts a story
  names.
* **The CV file has to stay in step.** `cv.ts` carries a digest of the facts the CV file shares
  with the page (ADR-005). When one of those facts changes, `cv.test.ts` fails until the owner
  brings the CV file up to date.
* **Every picture and video records its `width` and `height`**, its file's size in pixels. The
  suite reads the real size from the file and fails when they differ (ADR-021).
* **A `slug` is an address**, so don't rename one lightly.

Each module's comment names the issue and the records it follows.
