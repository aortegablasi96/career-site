import { introduction } from './introduction';
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
 * application itself running, supplied by the owner and cropped to 4:3. Since #167 each is the
 * owner's newer picture of the application on a laptop, kept at its own 3:2 at 1080 by 720, which
 * the card's 16:9 and the view's 16:10 crop. The alternative text says
 * what each picture shows, so a reader who cannot see it learns what a sighted reader does; it
 * leaves out the figures on screen, which are the application's data rather than the project.
 *
 * The Digital Twin's demo video, which DDR-010 gives it in place of a still, has not been recorded,
 * and #63 deferred it. `Video` is the shape it takes and `components/projects.tsx` renders it; until
 * the file exists the project shows a still of the chatbot, as #63 allows.
 *
 * Since #153 each project has a view of its own, per ADR-010 and DDR-050, at the address its slug
 * names. The view shows the same name, description, technologies, links and picture as the page,
 * and adds one thing: a caption under the picture, a few words from what its alternative text
 * already says, which the owner approved on #153.
 *
 * Since #156 a view also leads to the projects on either side of this one, per DDR-052, which adds
 * the two words those links show and what they are called. The order here is the order they follow.
 *
 * Since #155 a view can also show a gallery of further pictures and videos below its introduction,
 * per DDR-053. No project states one yet: each file is the owner's to supply, as on #63, and a
 * project with no `gallery` shows no gallery and no heading. Adding one is content alone — a list
 * of media and captions here, and the files in `public/` — with no change to a component.
 *
 * Since #154 the page shows each project as a card leading to its view, per DDR-051, and a card says
 * what the project is in one sentence, its `summary`, rather than the full description. The four are
 * the ones the design proposes, which the owner approved on #154; each says nothing the full
 * description does not.
 *
 * Since #163 a card shows every technology stated here, per DDR-054, where it showed the first four
 * and counted the rest. So the order below is the order a card and a view both read in, and no
 * technology is hidden behind a click; the wording of that count is gone with it.
 */
export const projects: Projects = {
  title: 'Projects',
  link: 'Projects',
  projects: [
    {
      name: 'NumisBook',
      slug: 'numisbook',
      media: { file: '/project-numisbook.webp', alt: 'NumisBook on a laptop, showing a coin’s record: the details of a silver tetradrachm of Mark Antony and Cleopatra beside its photograph, with the coin’s invoice below the photograph' },
      caption: 'A coin’s record',
      summary: 'AI-assisted SaaS for managing a coin collection, built end-to-end with Claude Code.',
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
      slug: 'digital-twin',
      media: { file: '/project-digital-twin.webp', alt: 'The Digital Twin on a laptop, as Andreu’s AI assistant in a chat, introducing itself and answering a question about Andreu’s AI expertise' },
      caption: 'The chatbot answering a question',
      summary: 'Agentic RAG chatbot that answers questions about this career in the visitor’s language.',
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
      slug: 'stock-portfolio-viewer',
      media: { file: '/project-stock-portfolio-viewer.webp', alt: 'The Stock Portfolio Viewer on a laptop, showing its Allocation view: the invested value, the number of positions and the largest holding, above a map of Europe with donut charts for each country' },
      caption: 'The Allocation view',
      summary: 'Local desktop app for analysing an Interactive Brokers portfolio with an AI assistant.',
      technologies: ['Electron', 'React', 'TypeScript', 'SQLite', 'OpenAI'],
      description:
        'A local desktop application for analysing a personal stock portfolio from an Interactive Brokers account, with an AI assistant that gives feedback on it, in which every figure is computed by the application and only phrased by the model. Built with Claude Code skills and MCP servers, including shadcn’s, working from a Figma design.',
      links: [{ text: sourceCode, href: 'https://github.com/aortegablasi96/stock-portfolio-viewer' }],
    },
    {
      name: 'This site',
      slug: 'career-site',
      media: { file: '/project-career-site.webp', alt: 'This site on a laptop, showing its introduction: the owner’s photo, name, positioning line and summary, above the contact and CV controls' },
      caption: 'The introduction',
      summary: 'A career site that doubles as a printed CV, built through a skill-driven Claude Code workflow.',
      technologies: ['Next.js', 'TypeScript', 'CSS Modules', 'GitHub Pages'],
      description:
        'A career site that is also its own printed CV. Built with Claude Code through a skill-driven workflow, in which a content strategist, a UI designer, an architect, builders, and a tester are each a skill, and every significant design and architecture decision is recorded.',
      links: [{ text: sourceCode, href: 'https://github.com/aortegablasi96/career-site' }],
    },
  ],
  view: {
    back: 'Back to portfolio',
    builtWith: 'Built with',
    // The label above the further pictures and videos of a project, per DDR-053. No project carries
    // gallery media yet, so no view shows it; the media is the owner's to supply, as on #63.
    gallery: 'Gallery',
    // The same words a profile pill says, from the one place they are stated.
    newTab: introduction.newTab,
    // The name first, so a row of tabs shows which project each is, then the owner's, as the page's
    // own title leads with it.
    title: (project) => `${project} – ${introduction.name}`,
    // The projects before and after this one, per DDR-052, in the order the page shows them.
    previous: 'Previous',
    next: 'Next',
    neighbour: (direction, project) => `${direction} project: ${project}`,
  },
};
