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
 * what the project is in one sentence, its `summary`, rather than the full description. Since #227
 * each is the project's slogan, from the owner's knowledge base, where #154 took the design's; the
 * site has no entry there, so its slogan was written from its own description, as the owner asked.
 * A slogan is the owner's own line, so it may say "my", which a description may not.
 *
 * Since #163 a card shows every technology stated here, per DDR-054, where it showed the first four
 * and counted the rest. So the order below is the order a card and a view both read in, and no
 * technology is hidden behind a click; the wording of that count is gone with it.
 *
 * Since #229 each description is the project's general description from the owner's knowledge base,
 * in British spelling and without assuming a reader's gender, and `howBuilt` is its "AI-assisted
 * product development" section, which a view shows under "How I built it", per DDR-078: a list of
 * paragraphs, each a run of text in which a phrase may be strong, as the introduction's summary is,
 * so the owner's bold phrases stay theirs. The site has no entry: its description keeps its first
 * sentence, and its `howBuilt` was written in the same form as the others, as the owner asked, from
 * what the repository shows. A project without the section would leave `howBuilt` out, and its
 * view would show no heading.
 */
export const projects: Projects = {
  // The owner renamed the section on #202, per ADR-012: it is their portfolio.
  title: 'Portfolio',
  link: 'Portfolio',
  projects: [
    {
      name: 'NumisBook',
      slug: 'numisbook',
      media: { file: '/portfolio/numisbook/lead.webp', alt: 'NumisBook on a laptop, showing a coin’s record: the details of a silver tetradrachm of Mark Antony and Cleopatra beside its photograph, with the coin’s invoice below the photograph' },
      caption: 'A coin’s record',
      summary: 'An intelligent coin collection management SaaS.',
      technologies: ['Next.js', 'TypeScript', 'PostgreSQL on Neon', 'OpenAI', 'Vercel', 'Cloudflare R2'],
      description:
        'A coin collection management SaaS that helps collectors visualise the fundamental aspects of their coins, organise them and monitor price statistics. The collector can also interact with an AI-assisted chatbot to manage their collection and obtain information from it.',
      howBuilt: [
        [
          'Used Claude Code as a virtual cross-functional development team, creating specialised skill workflows for architecture, database design, UI design, testing, governance and project management. Integrated MCP tools including Figma, Neon and Playwright to connect product design, data migration and E2E testing.',
        ],
      ],
      links: [
        { text: sourceCode, href: 'https://github.com/aortegablasi96/numisbook' },
        { text: liveSite, href: 'https://numisbook.vercel.app' },
      ],
    },
    {
      name: 'Digital Twin',
      slug: 'digital-twin',
      media: { file: '/portfolio/digital-twin/lead.webp', alt: 'The Digital Twin on a laptop, as Andreu’s AI assistant in a chat, introducing itself and answering a question about Andreu’s AI expertise' },
      caption: 'The chatbot answering a question',
      summary: 'A chatbot to talk about my career.',
      technologies: ['LangGraph', 'OpenAI Agents SDK', 'Chroma', 'Cohere', 'FastAPI', 'Next.js'],
      description:
        'A chatbot that answers questions about the career on this page, in the visitor’s language. Demonstrates an agentic RAG system: several agents filter each question, retrieve the documents, write a professional answer, and send push notifications, while semantic vector search and BM25 lexical search run concurrently and are reranked with Cohere for precision.',
      howBuilt: [
        [
          'Designed an orchestrated ',
          { strong: 'multi-agent workflow' },
          ' with LangGraph and OpenAI agents, breaking the conversation into specialised steps. Each agent can access the tools it needs, while ',
          { strong: 'structured outputs and guardrails' },
          ' provide consistency and control over the responses.',
        ],
        [
          'To improve retrieval quality, implemented a ',
          { strong: 'hybrid RAG approach' },
          ' combining BM25 lexical search and semantic vector search. Relevant documents are retrieved from the Chroma database and then ',
          { strong: 'reranked with Cohere' },
          ' before being provided as context to the agents.',
        ],
        [
          'Built the backend with ',
          { strong: 'FastAPI' },
          ', exposing the agentic RAG pipeline through APIs that connect the AI layer with the frontend.',
        ],
      ],
      links: [
        { text: sourceCode, href: 'https://github.com/aortegablasi96/career_conversation_chatbot' },
        { text: liveSite, href: 'https://career-conversation-chatbot.vercel.app' },
      ],
    },
    {
      name: 'Stock Portfolio Viewer',
      slug: 'stock-portfolio-viewer',
      media: { file: '/portfolio/stock-portfolio-viewer/lead.webp', alt: 'The Stock Portfolio Viewer on a laptop, showing its Allocation view: the invested value, the number of positions and the largest holding, above a map of Europe with donut charts for each country' },
      caption: 'The Allocation view',
      summary: 'An on-premise AI-enabled portfolio management assistant.',
      technologies: ['Electron', 'React', 'TypeScript', 'SQLite', 'OpenAI'],
      description:
        'A local-first portfolio management application that lets investors import broker data into a single private workspace, display the data in multiple personalised views and support the analysis through an AI-assisted chatbot.',
      howBuilt: [
        [
          'Used Claude Code as a virtual cross-functional development team, creating specialised skill workflows for architecture, UI development, testing, governance and project management. Integrated MCP tools including Figma, shadcn and Playwright to connect product design, implementation and E2E testing.',
        ],
      ],
      links: [{ text: sourceCode, href: 'https://github.com/aortegablasi96/stock-portfolio-viewer' }],
    },
    {
      name: 'This site',
      slug: 'career-site',
      media: { file: '/portfolio/career-site/lead.webp', alt: 'This site on a laptop, showing its introduction: the owner’s photo, name, positioning line and summary, above the contact and CV controls' },
      caption: 'The introduction',
      summary: 'A career site that doubles as its own printed CV.',
      technologies: ['Next.js', 'TypeScript', 'CSS Modules', 'GitHub Pages'],
      description:
        'A career site that is also its own printed CV.',
      howBuilt: [
        [
          'Used Claude Code as a virtual cross-functional development team, creating specialised skill workflows for content strategy, UI design, architecture, testing, governance and project management, with every significant design and architecture decision recorded. Integrated MCP tools including Figma and Playwright to connect product design and browser testing.',
        ],
      ],
      links: [{ text: sourceCode, href: 'https://github.com/aortegablasi96/career-site' }],
    },
  ],
  // The line above the cards, per DDR-067, in the experience hint's words.
  hint: 'Click any project to read the full description',
  view: {
    back: 'Back to portfolio',
    // The heading above how a project was built, per #229 and DDR-078, in the owner's words.
    howBuilt: 'How I built it',
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
