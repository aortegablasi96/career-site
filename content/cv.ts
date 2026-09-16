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
 * agreeing. They do not: issue #59 lists nine differences the owner has knowingly accepted for now,
 * to be resolved before #48 ships the control that offers the file.
 */
export const cv: Cv = {
  label: 'Get my CV',
  file: '/andreu-ortega-blasi-cv.pdf',
  contentDigest: '3dfd5a661b84e10f245a56d20cbb4d8dfcdf6f32d046624c86b05ad57decf99a',
};
