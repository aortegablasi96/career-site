import type { Credentials } from './types';

/** The body that issued both certifications, as their certificates name it. */
const pmi = 'Project Management Institute';

/** Where the owner took both degrees. */
const upc = 'Universitat Politècnica de Catalunya';

/**
 * The education and certifications section, per the Content Brief on #25 and issue #32.
 *
 * Oldest first, per DDR-057, so the timeline reads left to right through time. Each certification
 * is named, and dated to the month it was granted, as its certificate states, rather than as the
 * knowledge base words it: the brief records the corrections. The degrees' months are the owner's
 * answers on #26. The owner removed each degree's thesis sentence on #173.
 */
export const credentials: Credentials = {
  title: 'Education and certifications',
  // The design's shorter word for the contents bar, per DDR-031. The heading keeps its full name.
  link: 'Education',
  credentials: [
    {
      name: 'Bachelor’s degree in IT',
      institution: upc,
      start: '2014-09',
      end: '2019-02',
    },
    {
      name: 'Master’s degree in IoT',
      institution: upc,
      start: '2020-09',
      end: '2022-02',
    },
    {
      name: 'Project Management Professional (PMP)',
      institution: pmi,
      granted: '2024-06',
    },
    {
      name: 'PMI Certified Professional in Managing AI (PMI-CPMAI)',
      institution: pmi,
      granted: '2026-05',
    },
  ],
};
