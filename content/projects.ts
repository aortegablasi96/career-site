import type { Projects } from './types';

/** The labels the projects' links share, per DDR-006. */
const sourceCode = 'Source code';
const liveSite = 'Live site';

/**
 * The projects section, per the Content Brief on #25 and issue #30.
 *
 * The three portfolio projects come first, in the order the brief lists them, then this site,
 * which the owner chose to include on #26. Each description says what the project is, then what it
 * demonstrates. Every technology named is in the owner's knowledge base or the project's public
 * repository, and each live address is the one recorded on its repository. Descriptions are
 * CV-style, without pronouns.
 *
 * Each project gained its media on #50, per DDR-010, and since #63 each is a picture of the
 * application itself running, supplied by the owner and cropped to 4:3. The alternative text says
 * what each picture shows, so a reader who cannot see it learns what a sighted reader does; it
 * leaves out the figures on screen, which are the application's data rather than the project.
 *
 * The Digital Twin's demo video, which DDR-010 gives it in place of a still, has not been recorded,
 * and #63 deferred it. `Video` is the shape it takes and `components/projects.tsx` renders it; until
 * the file exists the project shows a still of the chatbot, as #63 allows.
 */
export const projects: Projects = {
  title: 'Projects',
  link: 'Projects',
  projects: [
    {
      name: 'NumisBook',
      media: { file: '/project-numisbook.webp', alt: 'NumisBook showing a coin’s record: its details beside a photograph of a silver denarius inscribed EID MAR, with the coin’s invoice below' },
      technologies: ['Next.js', 'TypeScript', 'PostgreSQL on Neon', 'OpenAI', 'Vercel', 'Cloudflare R2'],
      description:
        'A SaaS application for managing a coin collection, with an AI assistant that helps manage it and automates tasks such as adding a new coin. Built end to end with Claude Code, whose workflow, execution, governance, and project-management skills work as a simulated product team across the whole development pipeline, through to production.',
      links: [
        { text: sourceCode, href: 'https://github.com/aortegablasi96/numisbook' },
        { text: liveSite, href: 'https://numisbook.vercel.app' },
      ],
    },
    {
      name: 'Digital Twin',
      media: { file: '/project-digital-twin.webp', alt: 'The Digital Twin as Andreu’s Career Bot in a chat, introducing itself, suggesting questions to ask, and answering which roles fit Andreu’s experience' },
      technologies: ['LangGraph', 'OpenAI Agents SDK', 'Chroma', 'Cohere', 'FastAPI', 'Next.js'],
      description:
        'A chatbot that answers questions about the career on this page, in the visitor’s language. Demonstrates an agentic RAG system: several agents filter each question, retrieve the documents, write a professional answer, and send push notifications, while semantic vector search and BM25 lexical search run concurrently and are reranked with Cohere for precision.',
      links: [
        { text: sourceCode, href: 'https://github.com/aortegablasi96/career_conversation_chatbot' },
        { text: liveSite, href: 'https://career-conversation-chatbot.vercel.app' },
      ],
    },
    {
      name: 'Stock Portfolio Viewer',
      media: { file: '/project-stock-portfolio-viewer.webp', alt: 'The Stock Portfolio Viewer’s Allocation view: the invested value, the number of positions and the largest holding, above a world map with donut charts for each country' },
      technologies: ['Electron', 'React', 'TypeScript', 'SQLite', 'OpenAI'],
      description:
        'A local desktop application for analysing a personal stock portfolio from an Interactive Brokers account, with an AI assistant that gives feedback on it, in which every figure is computed by the application and only phrased by the model. Built with Claude Code skills and MCP servers, including shadcn’s, working from a Figma design.',
      links: [{ text: sourceCode, href: 'https://github.com/aortegablasi96/stock-portfolio-viewer' }],
    },
    {
      name: 'This site',
      media: { file: '/project-career-site.webp', alt: 'This site’s introduction: the owner’s photo, name, positioning line and summary, above the contact and CV controls' },
      technologies: ['Next.js', 'TypeScript', 'CSS Modules', 'GitHub Pages'],
      description:
        'A career site that is also its own printed CV. Built with Claude Code through a skill-driven workflow, in which a content strategist, a UI designer, an architect, builders, and a tester are each a skill, and every significant design and architecture decision is recorded.',
      links: [{ text: sourceCode, href: 'https://github.com/aortegablasi96/career-site' }],
    },
  ],
};
