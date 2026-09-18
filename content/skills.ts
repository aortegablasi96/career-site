import type { Skills } from './types';

/**
 * The skills section, per the Content Brief on #25 and issue #31.
 *
 * Each group gathers the skills of one file in the owner's knowledge base, and every skill listed
 * is one that file names. Each skill's level follows the rule the brief sets from the file's own
 * wording: strong, extended, or wide experience is Advanced; good knowledge, hands-on experience,
 * or a mention without a qualifier is Proficient; basic knowledge is Basic. The owner will refine
 * the levels now that the section exists, as they said on #26. Within a level, the skills a
 * product hire looks for first come first.
 */
export const skills: Skills = {
  title: 'Skills',
  link: 'Skills',
  levels: [
    { level: 'advanced', name: 'Advanced' },
    { level: 'proficient', name: 'Proficient' },
    { level: 'basic', name: 'Basic' },
  ],
  groups: [
    {
      // skills/product_and_project_management.md
      name: 'Product and delivery',
      skills: {
        // "Wide experience" of product vision, strategy, and the lifecycle; "very polivalent
        // experience", read as wide, of projects, stakeholders, and vendor selection.
        advanced: [
          'Product vision and strategy',
          'Product lifecycle management',
          'Agile and hybrid project management',
          'Stakeholder management',
          'Vendor evaluation and selection',
        ],
        // Participation in market development and customer-facing work, and experience of data
        // governance, without a qualifier.
        proficient: [
          'Business and market development',
          'Product presentations and customer support',
          'Data governance and compliance',
        ],
      },
    },
    {
      // skills/ai.md: managerial and hands-on experience, without a qualifier.
      name: 'AI',
      skills: {
        proficient: [
          'Managing AI projects and product features',
          'LLM prompt engineering',
          'RAG pipelines',
          'Model evaluation',
          'Agentic AI',
          'LangChain',
          'CrewAI',
          'OpenAI Agents SDK',
          'MCP',
        ],
      },
    },
    {
      // skills/technical.md
      name: 'Data and IoT',
      skills: {
        // "Extended experience" of managing data, and "strong experience" of Python for data.
        advanced: ['Data sourcing and curation', 'Data pipelines', 'Python (Pandas, PySpark)'],
        // "Good" knowledge of machine learning and of IoT protocols, and experience, without a
        // qualifier, of evaluating cybersecurity specifications.
        proficient: [
          'Machine learning modelling',
          'IoT connectivity (LTE, LTE-M, NB-IoT)',
          'Cybersecurity specifications (IEC 62443)',
        ],
        // "Basic knowledge" of cloud services, with some hands-on work on Azure, and of Docker and
        // Kubernetes.
        basic: ['Cloud services (Microsoft Azure)', 'Docker', 'Kubernetes'],
      },
    },
    {
      // skills/tools.md
      name: 'Tools',
      skills: {
        // "Strong knowledge".
        advanced: ['Power BI'],
        // Used frequently, or handled well, without a qualifier.
        proficient: ['Jira', 'Trello', 'Planisware', 'Microsoft Project', 'Microsoft Visio', 'Microsoft Office'],
        // "Basic knowledge".
        basic: ['Salesforce'],
      },
    },
  ],
};
