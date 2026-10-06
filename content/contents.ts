import type { Contents } from './types';

/**
 * The page's contents bar, per DDR-031. Its accessible name and the word of its first link, which
 * leads to the top of the page rather than to a section, per DDR-045, are here, and so is the
 * name of the site's title, which the bar shows at the left of its links as the owner's mark, per
 * DDR-049 and DDR-105, and leads home, per DDR-091, and the name of the
 * button that opens the links on a phone, per DDR-075, which it carries as its accessible name
 * rather than as visible text. The word each section's link shows sits in that section's own
 * module, beside its heading.
 */
export const contents: Contents = {
  label: 'Sections',
  home: 'Home',
  title: 'Andreu Ortega Blasi, home',
  menu: 'Menu',
};
