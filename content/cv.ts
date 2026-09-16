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
 * moved with #48 because the introduction gained the photo's alternative text, which is not a fact
 * ADR-005 lists as shared; the nine differences are the ones #59 records, unchanged.
 */
export const cv: Cv = {
  label: 'Get my CV',
  file: '/andreu-ortega-blasi-cv.pdf',
  contentDigest: '59ad5fbfd3f3ac5869184cc3bb04c63dd5554149c52486b300abdaf2c2fe8638',
};
