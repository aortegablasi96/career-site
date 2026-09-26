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
 */
export const experience: Experience = {
  title: 'Experience',
  link: 'Experience',
  roles: [
    {
      title: 'Electronic and Software Engineer',
      company: 'Electrónica Digital de Protección',
      place: 'Barcelona, Spain',
      start: '2018-05',
      end: '2020-07',
      points: [
        'Designed PCBs for high-voltage controllers in Altium.',
        'Developed software to monitor and control electrical substations, based on the IEC 61850 standard.',
      ],
    },
    {
      title: 'Software Engineer',
      company: 'ToBeIT',
      place: 'Barcelona, Spain',
      start: '2020-09',
      end: '2021-07',
      points: [
        'Developed automation solutions with Python and RPA to streamline internal operational processes.',
        'Designed and implemented databases and data pipelines for internal applications and reporting.',
      ],
    },
    {
      title: 'Project Manager, Data and Digital Projects',
      company: 'Randstad',
      place: 'Leuven, Belgium',
      start: '2022-03',
      end: '2023-05',
      points: [
        'Worked as an external consultant on consultancy projects for Randstad’s clients, coordinating cross-functional delivery teams in data analytics, ML, cloud, and embedded software.',
        'Managed planning, backlog prioritisation, stakeholder alignment, and delivery governance across several parallel projects.',
        'Kept execution consistent through KPI tracking, risk management, and structured reporting.',
      ],
    },
    {
      title: 'Digital Solutions Manager',
      company: 'Ponera Group',
      place: 'Lugano, Switzerland',
      start: '2023-06',
      end: '2024-10',
      points: [
        'Led the end-to-end development of four IoT-enabled SaaS products as Product Owner, coordinating external software providers against scope, timeline, and quality targets.',
        'Defined product requirements, functional specifications, and technical roadmaps, aligning business priorities with engineering execution.',
        'Managed vendor selection and RFP/RFQ processes for software and hardware partners, supporting commercial and technical decisions.',
        'Applied data analytics and ML-based modelling to the IoT data collected, to support service optimisation and data-driven decisions.',
      ],
    },
    {
      title: 'Global Product Specialist, Digital Solutions',
      company: 'ABB',
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
};
