import { introduction } from './introduction';
import type { Experience } from './types';

/**
 * The experience section, per the Content Brief on #25 and issue #29.
 *
 * Every point traces to the owner's knowledge base, or to their answers on #26 and #28: the ABB
 * role is current, the assets its solutions monitor are connected UPS units, and at Randstad the
 * owner was an external consultant on projects for Randstad's clients. Roles are oldest first, per
 * DDR-057, so the timeline reads left to right through time, and the two engineering roles are
 * shorter, as the brief sets. Points are CV-style, without pronouns,
 * and the current role's are in the present tense.
 *
 * Each role's title is its heading in the owner's knowledge base, per #181. The timeline's cards
 * show it without its qualifier, and only a role's view shows it whole, as `fullTitle`, per
 * DDR-060; a role whose title has no qualifier states it once.
 *
 * Every role but ABB's follows the owner's rewritten entry, per #287, which added the results the
 * owner can state. A count the entry writes as "4+" reads "more than four", as ABB's "20+" already
 * did, and the owner confirmed each is above its number. Ponera Group's automation point is left
 * out, as the brief on #25 left it, so no role has more than four points.
 */
export const experience: Experience = {
  title: 'Experience',
  link: 'Experience',
  roles: [
    {
      title: 'Electronic and Software Engineer',
      slug: 'electronica-digital-de-proteccion',
      company: 'Electrónica Digital de Protección',
      logo: '/experiences/electronica-digital-de-proteccion/logo.webp',
      logoTall: true,
      place: 'Barcelona, Spain',
      start: '2018-05',
      end: '2020-07',
      points: [
        'Designed PCBs for high-voltage control systems in Altium, contributing to the development and validation of industrial electrical-control hardware.',
        'Developed software to monitor and control electrical substations, based on the IEC 61850 standard, integrating it with industrial electrical infrastructure and control systems.',
      ],
    },
    {
      title: 'Software Engineer',
      slug: 'tobeit',
      company: 'ToBeIT',
      logo: '/experiences/tobeit/logo.webp',
      logoTall: true,
      logoRaised: true,
      place: 'Barcelona, Spain',
      start: '2020-09',
      end: '2021-07',
      points: [
        'Developed automation solutions with Python and RPA for customers, streamlining their internal processes and making them more efficient.',
        'Designed and implemented more than three databases and data pipelines for internal applications and reporting.',
        'Translated business requirements into software solutions used by more than 10 internal users, working with functional stakeholders through development and deployment.',
      ],
    },
    {
      title: 'Project Manager',
      fullTitle: 'Project Manager in Data & Digital Projects',
      slug: 'randstad',
      company: 'Randstad',
      logo: '/experiences/randstad/logo.webp',
      place: 'Leuven, Belgium',
      start: '2022-03',
      end: '2023-05',
      points: [
        'Worked as an external consultant on consultancy projects for Randstad’s clients: more than four technology projects for two clients across several industries, with cross-functional teams in data analytics, ML, cloud, and embedded software.',
        'Managed more than three concurrent projects from planning to delivery, prioritising backlogs, coordinating technical dependencies, and aligning client stakeholders, engineering teams, and business objectives across teams of more than five engineers, data scientists, and technical specialists.',
        'Led the delivery of data-driven solutions that improved operational efficiency and decision-making, increasing the team’s output by 20%.',
        'Established KPI, risk, and delivery governance frameworks that improved project visibility and reduced delivery risks or delays by 50% across the portfolio.',
      ],
    },
    {
      title: 'Product Manager',
      slug: 'ponera-group',
      company: 'Ponera Group',
      logo: '/experiences/ponera-group/logo.webp',
      place: 'Lugano, Switzerland',
      start: '2023-06',
      end: '2024-10',
      points: [
        'Led the development and commercialisation of four IoT-enabled SaaS products, integrating industrial sensors, connectivity hardware, and cloud software to monitor more than 100 connected assets remotely across several customer environments.',
        'Owned the product lifecycle from discovery and requirements through development and deployment, turning customer and business needs into product requirements, functional specifications, and technical roadmaps.',
        'Managed vendor selection and RFP/RFQ processes for software and hardware partners, weighing technical capabilities, commercial proposals, and total cost of ownership to support supplier and investment decisions.',
        'Applied data analytics and ML-based modelling to IoT data, finding ways to optimise service operations, improve asset monitoring, and support customers’ data-driven decisions.',
      ],
    },
    {
      title: 'Global Product Manager',
      fullTitle: 'Global Product Manager - Digital Solutions',
      slug: 'abb',
      company: 'ABB',
      logo: '/experiences/abb/logo.webp',
      place: 'Quartino, Switzerland',
      start: '2024-10',
      points: [
        'Manage a global portfolio of digital SaaS solutions for connectivity and monitoring, and drive its positioning, adoption, and market development in more than 20 countries across EMEA and the Americas.',
        'Evolve the solutions that monitor more than 1000 connected UPS units, working with cross-functional teams across the global organisation.',
        'Identify and structure AI-enabled opportunities, such as predictive maintenance, anomaly detection, and failure pattern recognition, to strengthen the value proposition of the monitoring solutions.',
        'Contribute to internal GenAI enablement, including Copilot-driven documentation workflows that make knowledge easier to find.',
      ],
    },
  ],
  // The line above the timeline, per DDR-059, which is the design's own (node 170:71).
  hint: 'Open a role to read the full description',
  view: {
    back: 'Back to experience',
    points: 'Responsibilities & achievements',
    skills: 'Skills & technologies',
    // The role and the company first, so a row of tabs shows which role each is, then the owner's,
    // as a project view's title leads with the project.
    title: (role, company) => `${role}, ${company} – ${introduction.name}`,
    // The roles before and after this one, in the timeline's order, oldest first, per DDR-059.
    previous: 'Previous role',
    next: 'Next role',
    neighbour: (direction, company, role) => `${direction}: ${company}, ${role}`,
  },
};
