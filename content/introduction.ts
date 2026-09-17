import type { Introduction } from './types';

/**
 * The introduction, per the Content Brief on #25 and issue #28.
 *
 * Every statement traces to the owner's knowledge base or their answers on #26 and #28. The
 * summary gives no number of years, as the brief requires. The ABB role is current, and the page
 * is public, so availability is an invitation to talk rather than an announced job search.
 *
 * Each contact carries two strings, per DDR-029: the label the pill shows, which names the service
 * rather than the address, and the address itself, which the footer shows and which is what the
 * printed CV carries. The labels are the design's own words, and each names a service a reader
 * already knows; they say nothing about the owner, so none of them is a claim.
 *
 * The photo was adopted on Epic #42, reversing the Content Brief's decision against one. The file
 * it names is a plain stand-in until the owner supplies their portrait, and #47 carries what it has
 * to be. Its alternative text is written for the portrait rather than for the stand-in, so that
 * replacing the file is the whole of the change; it is worth reading back against the real photo
 * once it lands.
 */
export const introduction: Introduction = {
  photo: { file: '/andreu-ortega-blasi-photo.webp', alt: 'Andreu Ortega Blasi' },
  name: 'Andreu Ortega Blasi',
  positioning: 'Product manager for AI and IoT products',
  location: 'Lugano, Switzerland',
  relocation: 'Open to relocation',
  summary:
    'I am a product manager with an engineering background. At ABB I manage a portfolio of digital SaaS solutions for connectivity and monitoring, and drive its market development in more than 20 countries; before that, at Ponera Group, I led four IoT SaaS products as Product Owner. Earlier, I managed data and digital projects for clients as a consultant, and built hardware and software as an engineer.',
  availability:
    'Alongside my role at ABB, in 2026 I earned the PMI-CPMAI certification and built three AI applications of my own, using RAG, agents, and MCP. I am happy to talk about AI and IoT product roles.',
  contact: [
    {
      label: 'Email',
      text: 'aortegablasi@gmail.com',
      href: 'mailto:aortegablasi@gmail.com',
      icon: 'email',
    },
    {
      label: 'LinkedIn',
      text: 'linkedin.com/in/andreu-ob',
      href: 'https://www.linkedin.com/in/andreu-ob/',
      icon: 'linkedin',
    },
    {
      label: 'GitHub',
      text: 'github.com/aortegablasi96',
      href: 'https://github.com/aortegablasi96',
      icon: 'github',
    },
  ],
};
