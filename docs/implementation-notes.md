# Implementation notes

The traps in this codebase that are hard to rediscover. **Why** each is so lives in the decision
record named beside it and in the pull request that landed it. Add a note here only when it would
save the next person from breaking something; don't add story history.

## Tooling

* **ESLint is held at 9.x**: `eslint-config-next` depends on `eslint-plugin-react`, which does not
  support ESLint 10. Next.js 16 removed `next lint`, so linting goes through the ESLint CLI.
* **`typecheck` runs `next typegen` first**, because `next-env.d.ts` and the route types are
  generated and gitignored.
* **Tests run in Node** and render with `react-dom/server`. There is no DOM environment or Testing
  Library; add them only for interactive behaviour. `ContentsBar`'s functions are tested against a
  stubbed `window`; the business case slider's stepping is the pure `step`.
* **A test that imports the root layout mocks `next/font/local`**, whose loaders throw outside the
  Next.js compiler (see `app/layout.test.tsx`).
* **Vitest's CSS-module stub returns a class for any key**, so `styles[someKey]` is always truthy in
  a test. Map keys to classes explicitly, as `brandButton` in `introduction.tsx` does.
* **`@next/next/no-img-element` is off**, because ADR-004 rules out `next/image`.

## Fonts (DDR-011, DDR-023)

* Lora is `h1` and `h2` alone (plus a project card's name, DDR-051); everything else, `h3` to `h6`
  included, is DM Sans. Medium is DDR-030's list.
* **Six static files, all loaded**: DM Sans 400, 500, 600, 700 and Lora 400, 600, in `app/fonts/`.
  `app/layout.test.tsx` holds committed and loaded files equal, so an unused file fails the suite.
* **No variable fonts**: Firefox writes them into a PDF as outlines, so the CV's text can't be
  selected (#22). To add a file, take Fontsource's variable Latin file, pin the weight with
  fontTools' instancer, name it, save as WOFF2; an italic comes from the italic variable file. A
  weight with no file is synthesised, so a new weight means a new file and a DDR-023 revision.
* **Ligatures and contextual alternates are off** in `app/globals.css`, so a Firefox PDF spells every
  word as the page does (#40).

## Styling system (ADR-001, ADR-006, DDR-014)

* `app/tokens.css` defines every token once at `:root`; `app/globals.css` styles plain elements,
  wrapped in `:where()` so a module class always wins. Components are CSS Modules that read tokens.
  **A value the tokens don't provide is a design decision, not a number to invent.**
* **`app/tokens.test.ts` holds tokens to their records**: the scale, rhythm, leadings, tracking,
  radii, shadows and every colour pairing's measured contrast. Failing pairings are held **by
  name**, so a new failure can't join quietly. Changing a token means revising its DDR.
* **`components/stylesheets.test.ts` holds every module stylesheet** to:
  * tokens only for sizes, spaces, `letter-spacing`, `line-height` and each `box-shadow` layer;
  * literals per ADR-006: `0`, `auto` and `none` anywhere, `100%` on `max-inline-size` and
    `max-block-size`, `min-content` on `min-inline-size` and `min-block-size`, and, on
    `max-inline-size` alone, `min(100%, 100cqb * var(--token))` (ADR-021). The rule behind the
    list: *a limit may name the space there is or the space the content needs; a size may not*;
  * no reordering (visual order is markup order, so no `order` and no `grid-column` placement),
    but for the larger picture's five named areas inside the wide breakpoint (DDR-086), and the
    frame's picture and opening control sharing the box's one cell, `grid-area: 1 / 1` (DDR-088);
  * `position: absolute` only on a pseudo-element and on the contents bar's menu panel, `.list`;
    `position: sticky` on the contents bar alone;
  * only one width media query, `(min-width: 48em)`, which may be written `(min-width: 48em), print`
    and, in the contents bar alone, `(min-width: 48em), (scripting: none)`.
* **Breakpoints are in em.** The narrow one, `20em`, lives only in `tokens.css` and adapts three
  role tokens: the section title, the project title's narrow size and the gutter. The wide one,
  `48em`, redefines `--rhythm-scale` (0.75 → 1) and `--contents-bar-title-row` there; components
  write their own layout under it. To test either, change the browser's default font size, not
  the root's CSS font size.
* **`z-index: 1` on the contents bar** keeps the photo's positioned inner shadow from painting over
  the bar. The only other z-index is the gallery's raised thumbnail (DDR-081), inside a row with
  `isolation: isolate` so they can never rise over the bar. Isolate any new one the same way.
* **Hover is written `:hover, :focus-visible`**, and the colour transition is written once, on `a`
  in `globals.css`, inside `prefers-reduced-motion: no-preference`. Movement (the card lift) goes
  inside that query too, not only its transition.
* **`main > *` is padded by `--page-inset`**, so the bands can span the window. A new direct child
  of `main` gets the inset too. Bands alternate with `.section:nth-of-type(even)`.
* **Two modules setting one property on one element** are resolved by the bundler's emit order.
  When a module must beat another module's rule, raise its specificity on purpose.
* **`app/grain.webp` stays in `app/`**: `tokens.css` imports it with a relative `url()`, so the
  bundler puts it under the base path. From `public/` it would need a root path that 404s live.
* **An inset `box-shadow` on an `<img>` paints nothing**: the image covers it. The photo is wrapped
  in a `.frame` span whose `::after` carries the inner shadow.

## Print (ADR-002, DDR-015 and its amendments)

The page itself is the CV, so what it prints is designed.

* **Paper is the wide surface**: a component that lays out in columns writes
  `@media (min-width: 48em), print`, never the grid twice. Two exceptions: the introduction floats
  its photo on paper, and its print block comes **before** its wide block so that a sheet wide
  enough to match the breakpoint, such as A4 landscape, takes the grid; and a timeline prints as the
  vertical one of DDR-010.
* **The token layer does paper's work**: `tokens.css`'s print block sets the root to 12pt, makes
  every surface, hairline and shadow transparent or `none`, puts leading and rhythm back to their
  paper values and sets the photo to 28mm. `--color-marker` is deliberately not dropped. No
  component writes a print rule to drop its own background.
* **`globals.css`'s print block hides `nav` and only `nav`.** The footer prints: it is the only
  place the page, and so the CV, writes out an address. Link addresses print after links with
  `overflow-wrap: anywhere`, because one unbreakable URL made Edge shrink the whole sheet to 0.9.
  A contact link writes `::after { content: none }`.
* **Firefox ignores `break-after: avoid`**, so `section.tsx` wraps a heading and its first item in
  one block kept whole. Timeline sections are `breakable`, because kept whole they cost a sheet.
* **No print-only content**, except a role's points (DDR-057). A video's frame is its poster, as
  an image, so it prints as one (DDR-089).
* **A linked timeline card is `position: static` on paper**; positioned, both browsers wrote its
  text at the foot of the sheet's PDF.
* **Check print by saving PDFs in Edge and Firefox**, with background graphics on and off, and
  compare against the tree before: sheet count, where each heading falls, no item split, and the
  text read back through pypdf and pdfium with no U+FFFD, the apostrophe still U+2019 and no
  letter-spaced word split apart. Reprint after changing anything above experience or education,
  or the amount of content. After adding a long address or a grid column, measure `scrollWidth` at
  643px under print media in Edge.

## Content and assets (ADR-002, ADR-004, ADR-005)

* **`app/sections.tsx` is the ordered list of the page's sections**, rendered and listed in the
  contents bar; a new section goes there. Each section's contents word is `link` in its content
  module. A section gets its items one element each, so it can keep its heading with its first
  item on paper.
* **`ContactLink`**: `label` is what the pill shows, `text` is the address, which only the footer
  shows; `newTab`, `markOnly` and the `icon` key (`gmail`, `linkedin`, `github`) are content.
  `app/page.test.tsx` holds each address to exactly one appearance on the page.
* **Rich text** (the summary, `howBuilt`) is a list of parts, each a string or a `Strong`.
* **A `slug` is an address someone may have been sent**; don't rename one lightly.
* **A role**: `title`, and `fullTitle` only when the heading has a qualifier (DDR-060); `logo` is
  required, at `public/experiences/<slug>/logo.webp`, trimmed, lossless, transparent ground, and
  72px tall (112px for `logoTall`), twice its height on the role's view (DDR-097), or the
  original's own height where that is less: never enlarged. The card draws the same file at a
  quarter of that. `skills` are the owner's to supply.
* **A credential** has `href` and an optional `logo`. No PMI or PMP logo and no Credly badge until
  the owner confirms PMI's written authorization.
* **A project**: `summary` is its slogan, `description` and `howBuilt` are from the owner's
  knowledge base, `businessCase` holds the items and a PDF, `gallery` is `GalleryItem`s. Every
  picture and video carries `width` and `height`, its file's size in pixels (a video's, its
  poster's), which the suite reads from the WebP header and fails on when they differ (ADR-021). A video
  has no sound track (DDR-087), and the suite fails on one that has: a video with sound needs the
  captions track that the `Video` type does not carry yet (DDR-053).
* **`content/cv.ts` carries a digest** that `content/cv.test.ts` checks against the content modules.
  A change to a fact ADR-005 lists fails the suite until the CV file is brought into step; the
  file is the owner's.
* **`public/` is arranged by view**: `home/` (photo, CV), `portfolio/<slug>/` (`lead.webp` and
  gallery files), `experiences/<slug>/`, `education/<institution>/`. Moving a file changes its
  address. `public/**/*.png` and `public/**/media/` are gitignored for the owner's originals.
* **Every binary `src`, `poster` and `href` goes through `app/asset.ts`**, so it resolves under
  `PAGES_BASE_PATH`; `components/assets.test.ts` enforces it. A Client Component renders in the
  browser too, after a link, so `next.config.ts` hands the variable to `env` as well: without it
  the browser's value is empty, and the pictures 404 on the live site only (#261). A `next/link`
  href is a route and is exempt. Internal links use `prefetch={false}`, or each view would prefetch every picture on the
  page.
* **The site's icon is three files in `app/`** (DDR-094): `icon.svg`, the letter as Lora 600's
  outline; `favicon.ico`, 16, 32 and 48px, each rendered from the SVG at its own size; and
  `apple-icon.png`, the full square at 180px with no transparency. Next.js links all three from
  every route. They carry the accent's value, so a change to `--color-accent` means drawing all
  three again (`app/icon.test.ts` fails until then).
* **A shared link's preview picture is a committed JPEG** (DDR-095): `public/home/share-card.jpg`
  and each project's `public/portfolio/<slug>/share.jpg`, 1200 × 630, with their paths in
  `content/site.ts` and their metadata built in `app/share.ts`. A view that sets its own `openGraph`
  replaces the layout's whole, so each view names its picture again. The card repeats the name,
  positioning, location and accent as pixels: a change to any of them means drawing it again.
* **Views are static routes** (`app/portfolio/[slug]`, `app/experience/[slug]`) with
  `generateStaticParams` and `dynamicParams = false`.
* **An address the site does not have is `app/not-found.tsx`** (DDR-093), which the export writes to
  `out/404.html`. Vercel serves that with a 404 for any path it has no file for; a plain static
  server does not, so check it with one that falls back to `404.html`. `next dev` shows it for a
  wrong top-level address, but answers a wrong slug under `/portfolio/` or `/experience/` with a 500
  ("missing param … required with output: export"), which the built site never does. Its way back
  and title copy a view's styles: change a view's way back and change it there too.
* **The old `/projects/…` addresses redirect on Vercel alone** (ADR-027): the rules are in
  `vercel.json`, since a static export cannot carry Next.js's `redirects()`. A local static server
  answers them 404, so check them on a pull request's preview.

## Components

### Contents bar (ADR-007, ADR-008, ADR-009, ADR-013)

* **`components/contents-bar.tsx` is a Client Component**, one of four (the others are the
  business case slider, ADR-015, a view's larger picture, ADR-018, and `ScrollAppear`, ADR-025). It marks the current section with
  `aria-current="location"`, glides on its own links' clicks, and holds the menu's open state below
  the wide breakpoint. `Contents` stays a Server Component and hands it `{ id, link }` per section,
  never the sections' rendered items.
* **The glide is `data-gliding` on the root**, removed by the first `scroll` event, with a 250ms
  fallback. Don't swap the listener for a timer: Firefox starts the scroll a frame or two late.
  Don't set `scroll-behavior: smooth` on the root either: it animates the back button, fragment
  loads and focus scrolls.
* **Home is `#top`; no element may have the id `top`** (`app/page.test.tsx`). The title's link
  (DDR-091) leads there too, so it glides, marks Home and closes the menu through the same code.
* **Without script the bar is the full row at every width**, through `(scripting: none)`, and
  `--contents-bar-title-row` returns to the clearance there.
* **The clearance is the root's `scroll-padding-block-start`**; sections write no `scroll-margin`.
* A new link label or section changes how the bar wraps: sweep again.

### Timelines (DDR-057, DDR-074)

* **`Timeline` renders two lists from the same entries**: the row, oldest first, shown from the wide
  breakpoint and on paper, and the stack, newest first, shown below it. **Every card is in the HTML
  twice**, so a test counting entries, headings or links reads the first `ol`.
* A timeline whose entries have an `href` takes no tab stop of its own.
* **The row clips**, so it pads its foot by `--timeline-shadow-room` and takes it back with a
  negative margin; a larger shadow or lift needs more room (`tokens.test.ts`). The dates' glow may
  reach at most 2px above the letters.
* **The dots stay level only while every date range sets on one line.**
* **In the stack, a card lifts by a margin, not a translate**, and its link box is measured from
  `.body`, because a date wraps at 200% text below 380px.
* A role's points are hidden on screen and print (DDR-057).

### Introduction (DDR-056, DDR-072, DDR-076, DDR-077)

* Below the wide breakpoint the photo and the `hgroup` are one wrapping flex row, centred on each
  other; the text column is `display: contents`. On paper the photo floats.
* **`min-inline-size: min-content` on the `hgroup`** is what moves the name below the photo, rather
  than breaking it mid-word, when its longest word no longer fits beside it.
* **After changing the photo, the name, the greeting or the intro copy**, check at 300px to 767px
  at the default text size and at 200%, and check that the controls still end above the fold at
  390 by 844.
* The photo's capsule is drawn by the stylesheet, so a replacement's corners are cropped away. No
  monogram or gradient in its place.
* The email pill's width is set to match the GitHub pill's content, a measured 3.333 of the step
  (`--contact-mark-pill-width`); measure again if that label, step, weight or face changes.
* **Brand marks are never recoloured.** LinkedIn's and GitHub's marks are `currentColor`, set only
  to a colour the brand publishes; Gmail's M carries its own fills. On paper the pill's ink is the
  brand's colour, because the fill drops.

### Project cards and views (DDR-050 to DDR-055, DDR-079, DDR-081, DDR-082)

* **A card's link is its name, stretched over the card**: `.link::after` draws the focus outline,
  `.link::before` extends `--card-lift` below the card so a lifted card doesn't flicker.
* **A card and the view's figure are flex columns, not one-track grids**: in a grid, Firefox sizes
  the row from the picture's natural height.
* **Grid tracks are `minmax(0, 1fr)`**: a plain `1fr` let the picture widen its column into
  horizontal scroll.
* **Names and addresses wrap with `overflow-wrap: anywhere`** wherever a long word would overflow
  at 200% text. A new or renamed project or technology means sweeping again.
* The view's business-case switch is native radios read by `:has()`, with no script (ADR-014).
* **The gallery is native radios too** (ADR-017, DDR-081): each picture's radio is its figure's
  previous sibling, and `.pick:not(:checked) + .figure` hides the rest. Keep that adjacency.
* **Every picture of a view stands in one box** (DDR-088, ADR-021): `box()` in `project-view.tsx`
  works out the tallest picture's shape and the narrowest file's width, and the gallery's group (or
  a lone picture's figure) carries them as `--project-view-box-ratio` and `--project-view-box-width`
  in its `style` attribute. The dialogs are inside it, so they inherit both; a dialog moved outside
  it would lose them. The frame is the box (`.media` takes its `aspect-ratio`) and the picture in it
  is whole, as wide as the box and centred (DDR-085), with no `object-fit`. A video's frame is its
  poster, drawn as a picture's is.
* **A gallery shows only what it lists** (DDR-084): the view opens on its first item, and the lead
  picture stays on the card unless the gallery lists it too. A gallery of one is drawn as a lone
  picture, with no radios.
* **The raised thumbnail is found by place**, one `:nth-of-type` rule per position, for twelve
  pictures; a thirteenth needs a thirteenth rule. `--raised` is worked out from `--chosen`,
  `--pointed` and `--pointing`, and drives the thumbnail's `z-index`, its name's opacity and, in the
  motion query, its lift.
* **The picture in the frame opens larger** in a modal `dialog` opened by `commandfor`/`command`
  (ADR-018, DDR-082), with no script. `components/invoker-commands.d.ts` types the two attributes
  for React; drop it once `@types/react` has them. The opening button follows the picture in the
  box's one grid cell and stands at its lower right corner, because only a pseudo-element may be
  `position: absolute`; its `::after` and the close button's `::before` stretch the targets. The
  button must not be positioned, or its `::after` covers only the button.
* **`LargerPicture` is a Client Component for the movement and, in a gallery, the hand-over**
  (below). For the movement it takes the dialog's `command`
  and `cancel` events and opens or closes it inside a view transition, handing the one
  `view-transition-name` (`larger-picture`) from the frame's picture to the larger one and back.
  Its pseudo-elements are styled in `app/globals.css`, where only the whole picture's capture is
  drawn: the root's `data-moving` (`opening` or `closing`) says which capture is the frame's, and
  it is hidden, or the two crossfade into a ghost (#248). Don't give either picture the name in a
  stylesheet: two elements with it at once skip the transition.
* **A gallery's larger picture steps to its neighbours** (ADR-019, DDR-083). Each step button points
  at the neighbour's dialog with `commandfor` and `command="--show-in-place"`, and the neighbour's
  `LargerPicture` does the work in `swap`. Keep its order: close the old dialog, check the radio,
  focus the neighbour's "View larger", then `showModal()`. The dialog returns focus to whatever was
  focused when it opened, so the wrong order returns focus to a hidden control. The arrow keys
  `click()` the step button, so both take one path. The hand-over is a root crossfade with no
  `view-transition-name`, so it never touches `data-moving`. `@media (scripting: none)` hides the
  step buttons.
* **The larger picture has two layouts from one markup** (DDR-086). Below 48em the step buttons are
  in the caption's row, `.foot`. From 48em `.foot` is `display: contents`, so its three children join
  the dialog's grid, and `grid-template-areas` stands the buttons either side of the picture. Only a
  gallery's dialog, `.stepped`, takes that grid; a lone picture's keeps its one column. The markup
  order stays the phone's, which keeps the tab order close, previous, next. Check both layouts, and
  a lone picture, after any change to the dialog.
* **To watch the movement, slow it down**: set `--project-view-enlarge-duration` on the root to a
  few seconds before a screenshot. A screenshot or `getAnimations()` straight after the click often
  catches the view before the transition starts.
* **The dialog's picture stands in `.room`, a size container in the `minmax(0, 1fr)` grid row**,
  and is `--project-view-box-width` wide, no wider than `min(100%, 100cqb * ratio)`: the box as large
  as the room allows at its shape. `.room` must stay unpositioned, so its bands close the picture.
  Below 48em the step buttons stand at the foot of the caption's row (`align-items: end`), so a
  caption of two lines does not move them. Measure after layout settles: read 30ms after a resize
  and an Escape, Playwright reported a stale, squashed height.
* **Serve `out/` from Node, not Python's `http.server`**, when checking pictures: Python's reset
  connections and left a picture as its alt text on #246.
* **Playwright's `click()` on a thumbnail times out**: the next thumbnail covers its centre. Click
  its image's left 15px with `page.mouse.click`.
* A thumbnail's image is `box-sizing: border-box`, or its edge adds 3.2px to its width and its height.
* **Every view has a gallery**: NumisBook (seven pictures), the Stock Portfolio Viewer (four), the
  Digital Twin (two) and this site (seven), so check the gallery on each; no view is without one,
  and the tests take this site's away to have one. A
  gallery picture is a WebP at its original's size (Pillow, quality 82, method 6), within the same
  150 KB as a lead. Each is the application's window: the Stock Portfolio Viewer's at about
  1535×815, NumisBook's at about 1915×907, but for its Collections (1917×877) and its light coin
  record (1529×688), and the Digital Twin's at 1276×603 on its own page and 1280×768 in Telegram.
  Since DDR-088 pictures of different shapes share one box, so nothing moves between them; a
  wider one has bands, 33px above and below the Digital Twin's chat at the wide width. An edge the capture added is trimmed before encoding: a
  transparent row or column, which would become a black line, and the pale line around the Digital
  Twin's page. The PNG originals in `media/` are gitignored.
* **NumisBook's gallery and the Stock Portfolio Viewer's each end with a video** (#259, DDR-087,
  ADR-020): the owner's recording, re-encoded by ADR-020's ffmpeg recipe at its own size, with no
  sound track, as `gallery-walkthrough.mp4`, and its first frame as `gallery-walkthrough.webp`. The
  recordings are in `media/`; ffmpeg is not in the repository. Before it is played a video takes
  its shape from its poster, so **a poster must be its video's size**, or the frame jumps on play.
  **A video plays only larger** (DDR-089, ADR-022): `LargerPicture` shows its poster in the frame and
  the `<video>` in the dialog, and its dialog's `close` pauses it, however it closes, stepping
  included. Without script nothing pauses it; that is decided, and only for a video without sound.
  The arrow keys are the video's while it has focus (`stepKey`), so they move through it rather
  than step. `disablePictureInPicture` takes away the floating window. **Chrome's and Edge's controls
  are inert until the video's metadata is in** (DDR-092, ADR-026): with `preload="none"` a click
  does nothing, a double click does nothing and the full screen control is greyed out, though
  Firefox does all three. So the dialog's `toggle` sets `preload` to `metadata` as it opens; keep
  `preload="none"` in the markup, or every visit to a view fetches its video. Playwright's
  `keyboard.press('Escape')` at full screen closes the dialog too, where a real key only leaves
  full screen: check Escape with an OS key event, not a synthetic one. The video carries `autofocus`
  so Space plays it; without it the dialog focuses its close control and Space closes the view.
  `swap` therefore leaves focus that was on the close control to the new dialog (`place > 0`). `controlsList="nodownload"`
  only reaches Chrome and Edge; the declined `contextmenu` needs script, and Firefox opens its menu
  anyway with Shift held. To check one locally, serve
  `out/` from a server that answers byte ranges with 206, or the video plays but cannot be moved
  through.
* **This site's gallery pictures are captures of the site itself** (#252), which the others are not:
  the live site in Chromium, in a window 1551×816 so that the page is 1536px wide beside its
  scrollbar, captured without the scrollbar at 1536×816. The page's five are its top and the place
  each contents link scrolls to (Education's is the page's end); the two views are NumisBook's and
  ABB's, unscrolled. The site does not regenerate them: after a change that shows in one, capture
  it again, or the gallery shows an older site.
* **The business case inside it is a Client Component**, `BusinessCaseSlider` (ADR-015, DDR-080).
  Every item is in the HTML and sits in one grid cell; only `.shown` is `visibility: visible`, which
  holds the card at its tallest item's height. `components/stylesheets.test.ts` admits `grid-area`
  in that stylesheet alone. Without script, `(scripting: none)` shows every item and hides the
  controls. A new, longer item makes every item's card taller: sweep again.

### Elements appearing (DDR-090, ADR-025)

* **What appears is decided by `data-appear` containers**: each child of one appears on its own,
  unless it is a container or holds one. A wrapper added between a container and its children
  changes what appears; if it holds a container, make it a container too, or its other children
  never appear. The containers are listed in ADR-025.
* **The state is `data-appearing`, written by `ScrollAppear` and styled in `app/globals.css`**, under
  `@media screen and (prefers-reduced-motion: no-preference)`: `screen`, or a sheet printed from a
  scrolled page loses whatever is still below the window. The HTML carries no state.
* **The appearance is an animation, not a transition**, and the attribute goes at its end, so a
  card's own `translate` (the lift) is the card's again. Don't hide by `visibility` or `display`:
  only opacity keeps a waiting element in the accessibility tree and in find-in-page.
* An element that is not displayed (the timeline's row or column) reports a top of 0 and is left
  alone, which is why only the one displayed appears.
* **Whether an element waits is decided on its first sighting**, against the whole window, though the
  observer's root stops a tenth short of the window's foot. Judged against the root, an element in
  that last tenth would be hidden in plain view.
* **The cascade's place is `--appear-order`, set inline by the script** and read as a delay with
  `backwards` fill, so the element stays hidden while it waits. It is removed with the state.
* To watch it, set `--appear-duration` on the root to a few seconds before a screenshot.

### Footer (DDR-028, DDR-029)

The footer is the only place an address is written out, on screen and on paper. Removing it,
hiding it or stopping it printing costs the printed CV its contact details. Its links are
deliberately not underlined.

## Checking a change in a browser

* **The sweep**: every 10px from 300px to 900px, plus 1280px and 1536px, at the default text size
  and at 200%. Nothing may scroll sideways, and no pair of targets may fail WCAG 2.5.8 (24×24 or
  the spacing exception; DDR-027 sets no minimum).
* **Enlarge text through the browser's default font size** (over CDP in Chromium), not the root.
* **Serve `out/` with `charset=utf-8`**; without it Firefox decodes the chunks wrongly and never
  hydrates.
* **With Playwright, click a contents link at its coordinates** with `page.mouse.click`; `click()`
  scrolls the target into view first and spoils the glide.
