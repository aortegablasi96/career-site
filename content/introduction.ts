import type { Introduction } from './types';

/**
 * The introduction, per the Content Brief on #25 and issue #28.
 *
 * Every statement traces to the owner's knowledge base or their answers on #26 and #28. The
 * summary gives no number of years, as the brief requires. The ABB role is current, and the page
 * is public, so availability is an invitation to talk rather than an announced job search.
 */
export const introduction: Introduction = {
  name: 'Andreu Ortega Blasi',
  positioning: 'Product manager for AI and IoT products',
  location: 'Lugano, Switzerland',
  relocation: 'Open to relocation',
  summary:
    'I am a product manager with an engineering background. At ABB I manage a portfolio of digital SaaS solutions for connectivity and monitoring, and drive its market development in more than 20 countries; before that, at Ponera Group, I led four IoT SaaS products as Product Owner. Earlier, I managed data and digital projects for clients as a consultant, and built hardware and software as an engineer.',
  availability:
    'Alongside my role at ABB, in 2026 I earned the PMI-CPMAI certification and built three AI applications of my own, using RAG, agents, and MCP. I am happy to talk about AI and IoT product roles.',
  contact: [
    { text: 'aortegablasi@gmail.com', href: 'mailto:aortegablasi@gmail.com' },
    { text: 'linkedin.com/in/andreu-ob', href: 'https://www.linkedin.com/in/andreu-ob/' },
    { text: 'github.com/aortegablasi96', href: 'https://github.com/aortegablasi96' },
  ],
};
