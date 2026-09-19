import type { Contents } from './types';

/**
 * The page's contents bar, per DDR-031. Its accessible name and the word of its first link, which
 * leads to the top of the page rather than to a section, per DDR-045, are here, and so is the
 * site's title, which the bar shows at the right of its links, per DDR-049. The word each
 * section's link shows sits in that section's own module, beside its heading.
 */
export const contents: Contents = {
  label: 'Sections',
  home: 'Home',
  title: 'Andreu’s site',
};
