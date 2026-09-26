import type { Introduction } from './types';

/**
 * The introduction, per the Content Brief on #25 and issue #28.
 *
 * Every statement traces to the owner's knowledge base or their answers on #26 and #28. The
 * summary gives no number of years, as the brief requires.
 *
 * Since #171 the summary is the description in the owner's knowledge base, in the wording the
 * owner approved on that story, and the knowledge base was updated to match it. It replaces the
 * two paragraphs that were here — a summary of the roles, which the experience section already
 * gives, and an availability sentence — and the relocation note, which the owner removed. The
 * greeting before the name is the owner's own, and is on screen only, per DDR-056.
 *
 * Each contact carries two strings, per DDR-029: the label the pill shows, which names the service
 * rather than the address, and the address itself, which the footer shows and which is what the
 * printed CV carries. The labels are the design's own words, and each names a service a reader
 * already knows; they say nothing about the owner, so none of them is a claim.
 *
 * The LinkedIn and GitHub pills open in a new tab, per DDR-043, and `newTab` is what they say about
 * it. It is a fact about the control rather than about the owner, so it is not a claim either.
 *
 * The photo was adopted on Epic #42, reversing the Content Brief's decision against one, and is the
 * owner's own portrait since #63. Its alternative text is the owner's name, as a portrait's is: it
 * identifies who is pictured beside the name, and a reader who never sees it loses nothing, which
 * `components/introduction.test.tsx` holds.
 */
export const introduction: Introduction = {
  photo: { file: '/home/andreu-ortega-blasi-photo.webp', alt: 'Andreu Ortega Blasi' },
  greeting: 'Hi there, I’m',
  name: 'Andreu Ortega Blasi',
  positioning: 'Product manager for AI and IoT products',
  location: 'Lugano, Switzerland',
  summary:
    'I’m a product manager focused on building AI and IoT products that turn complex technology into useful, scalable solutions. A passionate strategist and ambitious hard worker, I would rather work on high-potential but little-known solutions than on settled, easy-going ones.',
  contact: [
    {
      label: 'Email',
      text: 'aortegablasi@gmail.com',
      href: 'mailto:aortegablasi@gmail.com',
      icon: 'gmail',
      newTab: false,
    },
    {
      label: 'LinkedIn',
      text: 'linkedin.com/in/andreu-ob',
      href: 'https://www.linkedin.com/in/andreu-ob/',
      icon: 'linkedin',
      newTab: true,
    },
    {
      label: 'GitHub',
      text: 'github.com/aortegablasi96',
      href: 'https://github.com/aortegablasi96',
      icon: 'github',
      newTab: true,
    },
  ],
  newTab: 'opens in a new tab',
};
