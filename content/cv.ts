import type { Cv } from './types';

/**
 * The downloadable CV, per ADR-004 and ADR-005, and issue #56.
 *
 * ADR-002 ruled a second copy of the owner's facts out, because two hand-maintained documents drift
 * apart silently. Epic #42 adopted the download anyway, so ADR-004 and ADR-005 owe an answer to
 * that, and `contentDigest` is it: `content/cv.test.ts` recomputes it, so changing any fact on the
 * page fails the test suite, and ADR-003 will not deploy a failing build.
 *
 * The digest watches the content, not the file. It catches the facts moving; it cannot catch a CV
 * that was already out of step, which is why ADR-005 also lists what the two documents must share.
 *
 * So this records the content the CV was last *reviewed against*, which is not the same as the two
 * agreeing. They do not: issue #59 lists nine differences, and the owner closed it unresolved
 * rather than reconcile them before #48 shipped the control that offers the file. The digest here
 * moved with #48 because the introduction gained the photo's alternative text, and again with #50
 * because each project gained its picture and that picture's alternative text, and again with #97
 * because each contact gained the short label its pill now shows, per DDR-029 — the addresses
 * themselves did not change. It moved again with #98, because each section gained the word its
 * link in the contents bar shows, per DDR-031. It moved again with #63, because the four project
 * pictures became real and their alternative text now describes them. It moved again with #134,
 * because the two profile contacts now open a new tab and the introduction says so, per DDR-043.
 * It moved again with #135, because the email contact's mark is now Gmail's and its key says so,
 * per DDR-044. It moved again with #141, because the contents bar gained a Home link, per DDR-045.
 * It moved again with #149, because the contents bar now shows the site's title, per DDR-049.
 * It moved again with #153, because each project gained the slug its view's address is made from
 * and a caption for its picture, and the projects gained the words their views show, per DDR-050.
 * It moved again with #154, because each project gained the one sentence its card shows, and the
 * projects the wording of a card's count of the technologies it leaves out, per DDR-051.
 * It moved again with #156, because the projects gained the two words a view's links to the
 * projects on either side of it show, and what those links are called, per DDR-052.
 * It moved again with #155, because the projects gained the word above a view's gallery, per
 * DDR-053; no project states gallery media yet, so nothing the page shows changed at all.
 * It moved again with #163, because the projects lost the wording of a card's count of the
 * technologies it left out, per DDR-054: a card now shows every technology the project states, and
 * the technologies themselves did not change.
 * It moved again with #167, because all four project pictures were replaced with the owner's
 * new ones, and their alternative text now describes them.
 * It moved again when `public/` was arranged by view: the photo and the CV under `home/`, and each
 * project's picture under `projects/<slug>/`. Only the paths changed.
 * It moved again with #171, because the introduction gained a greeting, lost its relocation note
 * and its availability sentence, and its summary is now the owner's own description. ADR-005 leaves
 * a CV's summary free, and relocation is not on its list.
 * It moved again with #175, because the email contact's pill now reads "Email me", per DDR-058;
 * the address did not change.
 * It moved again with #176, because each role gained the slug of its view's address, and the
 * experience section the hint above its timeline and the strings of a role's view, per DDR-059.
 * None of them is a fact ADR-005 lists as shared, so none of them moved the CV; the nine
 * differences are the ones #59 records, unchanged.
 * It moved again with #181, because each role's title is now its heading in the owner's knowledge
 * base, shortened on its card and given in full on its view, per DDR-060. The job titles are facts
 * ADR-005 lists as shared, so the CV file is behind the page on them until the owner updates it:
 * the current role reads "Global Product Manager - Digital Solutions" on the page's view and
 * "Global Product Manager" on its card and on paper, and Ponera Group's reads "Product Manager".
 * It moved again with #193, because each role gained the path of its company's logo, and ToBeIT's
 * and EDP's a flag that draws them taller, and ToBeIT's one that raises it, per DDR-066.
 * A logo is not a fact ADR-005 lists as shared, so it did not move the CV.
 * It moved again with #195, because the projects section gained the hint above its cards, per
 * DDR-067. A hint is not a fact ADR-005 lists as shared, so it did not move the CV.
 * It moved again with #197, because each degree gained the path of the UPC’s logo, per DDR-068, and then a flag that draws it tall.
 * A logo is not a fact ADR-005 lists as shared, so it did not move the CV.
 * It moved again with #200, because each credential gained the address its card leads to, and the
 * section the hint above its timeline and what a card says about opening a new tab, per DDR-069.
 * None of them is a fact ADR-005 lists as shared, so none of them moved the CV.
 * It moved again with #202, because the projects section is now called Portfolio, per ADR-012, and
 * each project's picture moved from `projects/<slug>/` to `portfolio/<slug>/`. A section's name is
 * not a fact ADR-005 lists as shared, so it did not move the CV.
 * It moved again with #210, because the positioning line now reads "Product Manager building AI,
 * SaaS and connected products". ADR-005 leaves a CV's summary and positioning free, so it did not
 * move the CV.
 * It moved again with #212, because the summary is the owner's new description, with one phrase in
 * bold. ADR-005 leaves a CV's summary free, so it did not move the CV either.
 * It moved again with #214, because the introduction gained the question above its controls, per
 * DDR-072. A question is not a fact ADR-005 lists as shared, so it did not move the CV.
 * It moved again with #215, because the email contact now shows its mark alone, per DDR-073; its
 * label is its accessible name and its address did not change, so it did not move the CV.
 * It moved again with #221, because the contents bar gained the name of the button that opens its
 * links on a phone, per DDR-075. A button's name is not a fact ADR-005 lists as shared, so it did
 * not move the CV.
 * It moved again with #223, because the introduction gained a line below its question saying what
 * the controls are for, per DDR-076. That line is not a fact ADR-005 lists as shared, so it did not
 * move the CV.
 * It moved again with #227, because each project card's sentence is now the project's slogan. A
 * card's sentence is not a fact ADR-005 lists as shared, and no project's name changed, so it did
 * not move the CV.
 * It moved again with #229, because each project's description is now its general description from
 * the owner's knowledge base, and every project gained how it was built, which its view shows
 * under a heading of its own, per DDR-078. No project's name changed and no metric was added, so it
 * did not move the CV.
 *
 * It moved again with #231, because the Stock Portfolio Viewer gained its business case, which its
 * view lets a reader switch to and download in full, per DDR-079. It states no fact ADR-005 lists,
 * so it did not move the CV.
 *
 * It moved again with #233, because the Stock Portfolio Viewer's view gained a link to its release.
 * A project's link is not a fact ADR-005 lists as shared, so it did not move the CV.
 *
 * It moved again with #231, because NumisBook gained its business case and the owner reordered the
 * Stock Portfolio Viewer's, so key decisions come third and every item is numbered. Neither states a
 * fact ADR-005 lists, so neither moved the CV.
 *
 * It moved again with #231, because the Digital Twin gained its business case. It states no fact
 * ADR-005 lists, so it did not move the CV.
 *
 * It moved again with #231, because this site gained its business case, so every project has one.
 * It states no fact ADR-005 lists, so it did not move the CV.
 *
 * It moved again with #240, because a project's view gained the words on the two controls that step
 * through its business case, per DDR-080. A control's word is not a fact ADR-005 lists as shared,
 * so it did not move the CV.
 *
 * It moved again with #240, because every business case item gained its icon and headline. Neither
 * is a fact ADR-005 lists as shared, so neither moved the CV.
 *
 * It moved again with #246, because a project's view gained the names of the two controls that open
 * its picture larger and close it, per DDR-082. Neither is a fact ADR-005 lists as shared, so
 * neither moved the CV.
 *
 * It moved again with #250, because a project's view gained the names of the two controls that step
 * between its larger pictures, and the words that say where a picture stands, per DDR-083. None is a
 * fact ADR-005 lists as shared, so none moved the CV.
 *
 * It moved again with #252, because the Stock Portfolio Viewer gained its gallery: four pictures,
 * each with a caption and alternative text. None is a fact ADR-005 lists as shared, so none moved
 * the CV. It moved with #252 once more, because NumisBook's gallery is now the owner's pictures of
 * its window, seven where the mockups were six, and their alternative text describes them. And
 * once more, because the Digital Twin gained its gallery: two pictures, on its own page and in
 * Telegram, each with a caption and alternative text. And once more when #252 was reopened,
 * because this site gained its gallery: seven pictures of its own window, each with a caption and
 * alternative text. None is a fact ADR-005 lists as shared, so none moved the CV.
 *
 * It moved again with #259, because NumisBook's gallery and the Stock Portfolio Viewer's each
 * gained the owner's video, with its still, its name and a description of what it shows, per
 * DDR-087. None is a fact ADR-005 lists as shared, so none moved the CV.
 */
export const cv: Cv = {
  label: 'Get my CV',
  file: '/home/andreu-ortega-blasi-cv.pdf',
  contentDigest: '8987d4147530ca6f911e3a684a17b33ae2a12d566c1198be459aa6c641011888',
};
