import type { Contents } from './types';

/**
 * The page's contents bar, per DDR-031. Its accessible name and the word of its first link, which
 * leads to the top of the page rather than to a section, per DDR-045, are here: the word each
 * section's link shows sits in that section's own module, beside its heading.
 */
export const contents: Contents = {
  label: 'Sections',
  home: 'Home',
};
