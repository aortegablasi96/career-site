import type { Languages } from './types';

/**
 * The languages section, per the Content Brief on #25 and issue #31. The levels are the owner's
 * own, on the CEFR scale, as they gave them on #26: the two native languages first, then the
 * others, strongest first.
 */
export const languages: Languages = {
  title: 'Languages',
  link: 'Languages',
  languages: [
    { name: 'Spanish', level: 'Native (C2)' },
    { name: 'Catalan', level: 'Native (C2)' },
    { name: 'English', level: 'C1' },
    { name: 'Italian', level: 'B2' },
  ],
};
