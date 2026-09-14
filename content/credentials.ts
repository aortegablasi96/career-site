import type { Credentials } from './types';

/** The body that issued both certifications, as their certificates name it. */
const pmi = 'Project Management Institute';

/** Where the owner took both degrees. */
const upc = 'Universitat Politècnica de Catalunya';

/**
 * The education and certifications section, per the Content Brief on #25 and issue #32.
 *
 * Newest first, as DDR-006 sets, so the two certifications lead. Each certification is named, and
 * dated to the month it was granted, as its certificate states, rather than as the knowledge base
 * words it: the brief records the corrections. The degrees' months are the owner's answers on #26,
 * and their theses are the knowledge base's. Theses are CV-style, without pronouns.
 */
export const credentials: Credentials = {
  title: 'Education and certifications',
  credentials: [
    {
      name: 'PMI Certified Professional in Managing AI (PMI-CPMAI)',
      institution: pmi,
      granted: '2026-05',
    },
    {
      name: 'Project Management Professional (PMP)',
      institution: pmi,
      granted: '2024-06',
    },
    {
      name: 'Master’s degree in IoT',
      institution: upc,
      start: '2020-09',
      end: '2022-02',
      thesis: 'Thesis evaluating the Thread network protocol for future IoT application-layer frameworks, such as Matter.',
    },
    {
      name: 'Bachelor’s degree in IT',
      institution: upc,
      start: '2014-09',
      end: '2019-02',
      thesis:
        'Thesis on sensor evaluation and data analytics for monitoring incontinence in nursing home residents, carried out during an Erasmus exchange at KU Leuven, Belgium.',
    },
  ],
};
