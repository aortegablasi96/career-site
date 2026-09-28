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
 * Since #212 the summary is the owner's new description, on Epic #209, with the phrase they set in
 * bold. It is the description in the knowledge base but for one word: the owner chose "focused on
 * AI and IoT" for the site, where the knowledge base says "SaaS, AI and IoT".
 *
 * Since #210 the positioning line is the owner's own wording, capitals included, on Epic #209: it
 * names SaaS products beside AI, and connected products where it said IoT, each of which the
 * owner's roles and projects in the knowledge base carry.
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
  positioning: 'Product Manager building AI, SaaS and connected products',
  location: 'Lugano, Switzerland',
  summary: [
    'I’m a Product Manager focused on AI and IoT, turning complex technology into useful, scalable products. ',
    { strong: 'Curious by nature and ambitious by choice' },
    ', I’m drawn to challenging problems, emerging opportunities, and ideas that have yet to prove their potential. I enjoy bringing strategy, technology, and people together to make them happen.',
  ],
  contact: [
    {
      label: 'Email me',
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
