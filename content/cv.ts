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
 */
export const cv: Cv = {
  label: 'Get my CV',
  file: '/home/andreu-ortega-blasi-cv.pdf',
  contentDigest: 'c8ffb91193e9229323e5bffa7488a50b8a4d7c5e8fa50f768c2d29a63f25fb48',
};
