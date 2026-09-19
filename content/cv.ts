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
 * None of the nine is a fact ADR-005 lists as shared, so none of them moved the CV; the nine
 * differences are the ones #59 records, unchanged.
 */
export const cv: Cv = {
  label: 'Get my CV',
  file: '/andreu-ortega-blasi-cv.pdf',
  contentDigest: '340464979711437ae9762b48685f77151d0267fe3fbda7ec359e9160cdb90e6e',
};
