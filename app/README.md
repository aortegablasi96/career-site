# app/

The Next.js App Router: the site's routes and layout, its global styles and fonts, and the files
search engines and link previews read. The routes hold no text the reader sees. They take it from
[`content/`](../content/README.md) and render it with [`components/`](../components/README.md).

## Routes

| File                          | Address              | What it is                                    |
| ----------------------------- | -------------------- | --------------------------------------------- |
| `layout.tsx`                  | every page           | Document shell, fonts, metadata, the Digital Twin chat |
| `page.tsx`                    | `/`                  | The career page, which is also the printable CV |
| `portfolio/[slug]/page.tsx`   | `/portfolio/<slug>`  | One project's view                            |
| `experience/[slug]/page.tsx`  | `/experience/<slug>` | One role's view                               |
| `not-found.tsx`               | any other address    | Exported as `out/404.html` (DDR-093)          |
| `robots.ts`, `sitemap.ts`     | `/robots.txt`, `/sitemap.xml` | Built statically (ADR-024)           |

Views are static routes. `generateStaticParams` lists every slug and `dynamicParams` is `false`. A
slug is an address someone may have been sent, so don't rename one lightly.

## Other files

* **`sections.tsx`**: the ordered list of the page's sections. The page renders them and the
  contents bar lists them, so a new section goes here.
* **`tokens.css`**: every design token, defined once (ADR-001, ADR-006).
* **`globals.css`**: styles for plain elements, including print.
* **`asset.ts`**: the one way from a file in `public/` to its address (ADR-004). Every binary
  `src`, `poster` and `href` goes through it.
* **`person.ts`**: the owner as schema.org JSON-LD (ADR-024).
* **`share.ts`**: the preview picture a shared link shows (DDR-095).
* **`fonts/`**: DM Sans and Lora as static WOFF2 files, with their OFL licences (DDR-011,
  DDR-023).
* **`icon.svg`, `favicon.ico`, `apple-icon.png`**: the site's icon (DDR-094). The three files carry
  the accent colour, so all three are redrawn when it changes.

Each file's test sits beside it, as `*.test.ts(x)`. Read
[`docs/implementation-notes.md`](../docs/implementation-notes.md) before changing styles, print,
fonts or assets.
