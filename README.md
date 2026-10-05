# Andreu Ortega Blasi – career site

The personal career website of Andreu Ortega Blasi, live at **https://andreuortegablasi.com/**.

It is one page that introduces the owner and covers their experience, portfolio, skills, education
and certifications, and languages. The same page is also the printable CV. Each project has its own
view at `/portfolio/<slug>` and each role at `/experience/<slug>`, and a separately designed CV
file can be downloaded. Every page also carries a chat with the owner's Digital Twin.

## Stack

* [Next.js](https://nextjs.org/) 16 App Router, React 19 and TypeScript
* Static export: the build writes plain files to `out/`, with no server and no database
* CSS Modules over a single set of design tokens, with self-hosted fonts
* [Vitest](https://vitest.dev/) for the tests and ESLint for linting
* Deployed on [Vercel](https://vercel.com/)

The only service the site calls is the Digital Twin chatbot's API, which the reader's browser
calls directly (ADR-028).

## Getting started

You need Node.js 24, the version CI uses, and npm.

```sh
npm install
npm run dev     # http://localhost:3000
```

| Command                                        | What it does                                           |
| ---------------------------------------------- | ------------------------------------------------------ |
| `npm run dev`                                  | Start the local development server                     |
| `npm run lint`                                 | Lint with ESLint; any error or warning fails           |
| `npm run typecheck`                            | Generate Next.js route types, then type-check with tsc |
| `npm run test`                                 | Run the test suite once                                |
| `npm run test -- components/contents-bar.test.ts` | Run one test file                                   |
| `npm run test -- -t "<test name>"`             | Run the tests whose name matches                       |
| `npm run build`                                | Build the static site into `out/`                      |

There is no `start` script. To check the built site, serve `out/` with any static file server.
Three things behave differently from the live site:

* The server has to send `charset=utf-8`, or Firefox never hydrates the page.
* Only a server that falls back to `404.html` shows the not-found page.
* The old `/projects/…` addresses redirect on Vercel only, so check them on a pull request's
  preview.

## Project structure

| Folder                                | What it holds                                                      |
| ------------------------------------- | ------------------------------------------------------------------ |
| [`app/`](app/README.md)               | Routes and layout, global stylesheets and tokens, fonts, metadata |
| [`components/`](components/README.md) | Presentational components, each with its CSS Module and its test  |
| [`content/`](content/README.md)       | All the text the site shows, as typed TypeScript modules          |
| `public/`                             | Pictures, videos and PDFs, arranged by the view that shows them   |
| [`docs/`](docs/README.md)             | Decision records, implementation notes and the content's source   |
| `.claude/skills/`                     | The role-based skills the project is built with                   |
| `.github/`                            | Issue templates and the CI workflow                               |

### Assets in `public/`

`public/` has no README of its own, because the build copies every file in it to the live site.
Its files are arranged by the view that shows them:

```text
home/                       The owner's photo, the CV file and the page's share card
portfolio/<slug>/           One project: lead.webp, gallery pictures and videos, business case PDF,
                            share.jpg
experiences/<slug>/         One role: logo.webp
education/<institution>/    One institution: logo.webp
```

* A file's path is its address, so moving a file changes the address.
* Every reference to a file goes through `asset()` in `app/asset.ts`.
* Pictures are WebP, and their `width` and `height` in `content/` must match the file. Videos have
  no sound track.
* The owner's full-size originals sit beside the files made from them but stay out of git:
  `public/**/*.png` and any `media/` folder are gitignored.
* The owner supplies every file.

The rest of the rules are in the "Content and assets" section of
[`docs/implementation-notes.md`](docs/implementation-notes.md).

## Deployment

Vercel deploys `main` to production and every other branch to a preview. Its build command, in
`vercel.json`, runs lint, typecheck, test and build in that order. If any step fails, nothing is
deployed and the last good deployment stays live. `.github/workflows/ci.yml` runs the same four
steps on every pull request and every push to `main`, so the result shows on GitHub. CI deploys
nothing.

## How the project is run

* **GitHub issues and pull requests** hold the work and its history. New issues use the Epic, User
  Story and Bug templates in `.github/ISSUE_TEMPLATE/`.
* **Decision records** in [`docs/decisions/`](docs/decisions/README.md) hold the durable choices:
  ADRs for architecture and DDRs for UI and UX. Each part of the code names the record behind it.
* **[`docs/implementation-notes.md`](docs/implementation-notes.md)** lists the traps that are easy
  to fall into when changing styles, print, fonts or assets.
* **[`CLAUDE.md`](CLAUDE.md)** holds the working rules, and the skills in `.claude/skills/` split
  the work into roles: content strategist, UI designer, architect, issue writer, builders and
  tester.
* **The design** is kept in Figma, in the `career-site-design` file.

The text, pictures and CV describe a real person. The owner supplies all of it, and nothing on the
site is invented.
