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
 * owner's newer picture of the application on a laptop, kept at its own 3:2, which the card's 16:9
 * and the view's 16:10 crop. Since #242 each is served at its original's full 1536 by 1024, per
 * ADR-016, where it was 1080 by 720. The alternative text says
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
 * Since #155 a view can also show a gallery of further pictures and videos, per DDR-053, and since
 * #244 as thumbnails under the lead picture, per DDR-081. NumisBook has one, and since #252 the
 * Stock Portfolio Viewer and the Digital Twin each have one; each is the owner's pictures of the
 * application's window, which on #252 replaced NumisBook's mockups. Each file is the owner's to
 * supply, as on #63, but for this site's: when #252 was reopened the owner asked for its gallery to
 * be made from the site itself, so every project now has one. A project with no `gallery` would
 * show its lead picture alone. Since #259 NumisBook's and the Stock Portfolio Viewer's each end with
 * the owner's recording of the application, the site's first videos, per DDR-087 and ADR-020.
 * Adding one is content alone — a list of media and captions here, and the files in `public/` —
 * with no change to a component.
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
      // The owner's pictures of the application's window, in the order of its navigation. On #252
      // they replaced the mockups #244 supplied, and the coin's record is there in both themes. Each
      // is the window as the owner captured it, about 2.1:1. Each description says only what its
      // screen shows.
      gallery: [
        {
          media: { file: '/portfolio/numisbook/gallery-dashboard.webp', alt: 'NumisBook’s window, showing its dashboard: the number of collections and coins and the total paid, above links to the collections and the portfolio and the most recent acquisitions, each with both faces of its coin and its price' },
          caption: 'The dashboard',
        },
        {
          media: { file: '/portfolio/numisbook/gallery-collections.webp', alt: 'NumisBook’s window, showing the collections, Spanish Empire and Roman Republic, Imperatorial & Empire, each as a card with a photograph of one of its coins' },
          caption: 'The collections',
        },
        {
          media: { file: '/portfolio/numisbook/gallery-coin-list.webp', alt: 'NumisBook’s window in its dark theme, showing the coins of the Roman Republic, Imperatorial & Empire collection in a table, below a search and filters for metal, category, denomination, mint, grade and year' },
          caption: 'A collection’s coins',
        },
        {
          media: { file: '/portfolio/numisbook/gallery-coin-view.webp', alt: 'NumisBook’s window in its dark theme, showing a coin’s record: a silver denarius of Brutus with its details, description, catalogue references and provenance, beside its photograph and its invoice' },
          caption: 'A denarius of Brutus',
        },
        {
          media: { file: '/portfolio/numisbook/gallery-coin-view-light.webp', alt: 'NumisBook’s window in its light theme, showing a coin’s record: a silver tetradrachm of Mark Antony and Cleopatra with its details, description, catalogue references and price, beside its photograph and its invoice' },
          caption: 'A tetradrachm of Mark Antony and Cleopatra',
        },
        {
          media: { file: '/portfolio/numisbook/gallery-portfolio.webp', alt: 'NumisBook’s window in its dark theme, showing the portfolio: the total paid, a chart of the acquisition cost over time, and a bar chart splitting each coin’s cost into hammer price, premium, tax and shipping' },
          caption: 'The portfolio',
        },
        {
          media: { file: '/portfolio/numisbook/gallery-settings.webp', alt: 'NumisBook’s window, showing the settings: the profile’s display name, with its email blacked out, the language, theme and base currency, and a danger zone for deleting the account' },
          caption: 'The settings',
        },
        // The owner's recording of the application, supplied on #259, last in the gallery, per
        // DDR-087. It has no sound, so its description says in words everything it shows, and its
        // still is its first frame.
        {
          media: {
            file: '/portfolio/numisbook/gallery-walkthrough.mp4',
            poster: '/portfolio/numisbook/gallery-walkthrough.webp',
            description: 'A silent screen recording of NumisBook, a minute long. From the sign-in page it enters the demo collection and goes through the dashboard, the collections, the coins of one collection, the record of a tetradrachm of Mark Antony and Cleopatra with its photographs, the portfolio’s charts and the settings, where the theme changes to dark and back. It ends with the assistant answering what it can do.',
          },
          caption: 'Video walkthrough',
        },
      ],
      summary: 'An intelligent coin collection management SaaS.',
      technologies: ['Next.js', 'TypeScript', 'PostgreSQL on Neon', 'OpenAI', 'Vercel', 'Cloudflare R2'],
      description:
        'A coin collection management SaaS that helps collectors visualise the fundamental aspects of their coins, organise them and monitor price statistics. The collector can also interact with an AI-assisted chatbot to manage their collection and obtain information from it.',
      howBuilt: [
        [
          'Used Claude Code as a virtual cross-functional development team, creating specialised skill workflows for architecture, database design, UI design, testing, governance and project management. Integrated MCP tools including Figma, Neon and Playwright to connect product design, data migration and E2E testing.',
        ],
      ],
      // The "Summary of Business Case" from the owner's knowledge base, as the Stock Portfolio
      // Viewer's is, per #231 and DDR-079, and the full business case the owner supplied.
      businessCase: {
        items: [
          {
            label: '01 — Problem',
            icon: '⚠️',
            headline: 'Collectors lack a single source of truth',
            text: 'Coin collectors often manage inventory, purchase documentation and collection information across spreadsheets, cloud storage and physical documents, making the collection difficult to manage and analyse.',
          },
          {
            label: '02 — Product',
            icon: '💡',
            headline: 'One place for the whole collection',
            text: 'A cloud-based SaaS platform that centralises coin inventory, images and documentation while providing collection analytics and an AI assistant for natural-language exploration.',
          },
          {
            label: '03 — Key decisions',
            icon: '🔀',
            headline: 'Cloud-first, with AI grounded in the data',
            text: 'Cloud-first architecture · Structured collection data model · Integrated documentation & media · AI grounded in collection data',
          },
          {
            label: '04 — Outcome',
            icon: '🏁',
            headline: 'A production SaaS MVP',
            text: 'Production SaaS MVP · Collection management · Analytics · AI assistant · Extensible data architecture',
          },
          {
            label: '05 — My contribution',
            icon: '🛠',
            headline: 'From strategy to end-to-end development',
            text: 'Product strategy · Data architecture · UX/UI · Database & media infrastructure · AI · End-to-end development',
          },
        ],
        file: '/portfolio/numisbook/numisbook-business-case.pdf',
      },
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
      // The owner's pictures of the chatbot in the two places it answers, supplied on #252: its own
      // page first, then Telegram. Each is the window as the owner captured it, within the pale line
      // the capture drew around it. Each description says only what its screen shows.
      gallery: [
        {
          media: { file: '/portfolio/digital-twin/gallery-chat.webp', alt: 'The Digital Twin’s own page, showing a chat with Andreu Ortega’s AI assistant: it introduces itself, then answers a question about its AI expertise with a list that covers generative AI, agentic AI and AI projects' },
          caption: 'The chatbot on its own page',
        },
        {
          media: { file: '/portfolio/digital-twin/gallery-telegram.webp', alt: 'The Digital Twin in Telegram, as the bot Andreu’s Career Bot: it introduces itself as the AI career assistant for Andreu Ortega and suggests four questions, then begins to answer which kinds of roles fit his experience' },
          caption: 'The chatbot in Telegram',
        },
      ],
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
      // The "Summary of Business Case" from the owner's knowledge base, as the other two are, per
      // #231 and DDR-079, and the full business case the owner supplied.
      businessCase: {
        items: [
          {
            label: '01 — Problem',
            icon: '⚠️',
            headline: 'Static pages make visitors dig for answers',
            text: 'Traditional career websites require visitors to navigate static pages to understand a candidate’s experience, creating an opportunity for a more interactive way to explore professional information.',
          },
          {
            label: '02 — Product',
            icon: '💡',
            headline: 'Ask about my career in plain language',
            text: 'An AI-powered Digital Twin that allows recruiters and visitors to ask natural-language questions about my experience, projects, skills and professional background.',
          },
          {
            label: '03 — Key decisions',
            icon: '🔀',
            headline: 'AI as the interface, grounded in facts',
            text: 'AI as an interface · Grounded professional knowledge · Structured career context · Controlled conversational scope',
          },
          {
            label: '04 — Outcome',
            icon: '🏁',
            headline: 'An interactive AI profile',
            text: 'Interactive AI profile · Conversational career exploration · Structured professional knowledge base · AI agent foundation',
          },
          {
            label: '05 — My contribution',
            icon: '🛠',
            headline: 'From AI design to end-to-end development',
            text: 'Product strategy · AI & data design · Conversational UX · Knowledge architecture · End-to-end development',
          },
        ],
        file: '/portfolio/digital-twin/digital-twin-business-case.pdf',
      },
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
      // The owner's pictures of the application's other views, supplied on #252, in the order of
      // its navigation. Each is the application's window as the owner captured it, wider than the
      // lead's 3:2. Each description says only what its view shows.
      gallery: [
        {
          media: { file: '/portfolio/stock-portfolio-viewer/gallery-portfolio.webp', alt: 'The Stock Portfolio Viewer’s window, showing its Portfolio view: the net liquidation value, the cash and the holdings’ value, above a table of the holdings with each one’s quantity, price, market value, weight and unrealised profit or loss' },
          caption: 'The Portfolio view',
        },
        {
          media: { file: '/portfolio/stock-portfolio-viewer/gallery-dividends.webp', alt: 'The Stock Portfolio Viewer’s window, showing its Dividends view: the gross income, the withholding tax and the net income, above the upcoming dividends and a bar chart of the gross income and the withholding tax over time' },
          caption: 'The Dividends view',
        },
        {
          media: { file: '/portfolio/stock-portfolio-viewer/gallery-trades.webp', alt: 'The Stock Portfolio Viewer’s window, showing its Trades view: the realised profit or loss, short-term and long-term, and the unrealised, above a table of the realised gains by ticker beside the best and the worst of them, and the start of the trade history' },
          caption: 'The Trades view',
        },
        {
          media: { file: '/portfolio/stock-portfolio-viewer/gallery-assistant.webp', alt: 'The Stock Portfolio Viewer’s window, showing its Assistant view: the investor profile, with the tags of an investing style and targets for currency exposure and sector weight, beside a chat in which the assistant answers whether the portfolio is over-concentrated in any single currency' },
          caption: 'The Assistant view',
        },
        // The owner's recording of the application, supplied on #259 and held as NumisBook's is.
        {
          media: {
            file: '/portfolio/stock-portfolio-viewer/gallery-walkthrough.mp4',
            poster: '/portfolio/stock-portfolio-viewer/gallery-walkthrough.webp',
            description: 'A silent screen recording of the Stock Portfolio Viewer, a minute and a half long. It goes through the views in turn: the Portfolio view’s holdings, the Performance view’s charts over two periods, the Allocation view’s map and its tables by sector, country and currency, the Dividends view’s income over time, and the Trades view’s realised gains and trade history. It ends in the Assistant view, where the investor profile is opened and the assistant answers whether the portfolio is over-concentrated in any single currency.',
          },
          caption: 'Video walkthrough',
        },
      ],
      summary: 'An on-premise AI-enabled portfolio management assistant.',
      technologies: ['Electron', 'React', 'TypeScript', 'SQLite', 'OpenAI'],
      description:
        'A local-first portfolio management application that lets investors import broker data into a single private workspace, display the data in multiple personalised views and support the analysis through an AI-assisted chatbot.',
      howBuilt: [
        [
          'Used Claude Code as a virtual cross-functional development team, creating specialised skill workflows for architecture, UI development, testing, governance and project management. Integrated MCP tools including Figma, shadcn and Playwright to connect product design, implementation and E2E testing.',
        ],
      ],
      // The "Summary of Business Case" from the owner's knowledge base, per #231 and DDR-079, in
      // their order and with their labels, in British spelling as the rest of the site is, and the
      // full business case the owner supplied, which the view offers as a download.
      businessCase: {
        items: [
          {
            label: '01 — Problem',
            icon: '⚠️',
            headline: 'Portfolio data split across brokers',
            text: 'Portfolio data is fragmented across brokers, while existing broker interfaces offer limited personalisation and cross-portfolio analysis.',
          },
          {
            label: '02 — Product',
            icon: '💡',
            headline: 'A local-first, personal analytics workspace',
            text: 'A local-first portfolio management application that consolidates broker data into a personalised analytics workspace, complemented by an AI portfolio assistant.',
          },
          {
            label: '03 — Key decisions',
            icon: '🔀',
            headline: 'Local-first, starting with IBKR',
            text: 'Local-first architecture · IBKR-first MVP · Broker abstraction · AI grounded in portfolio data',
          },
          {
            label: '04 — Outcome',
            icon: '🏁',
            headline: 'An IBKR MVP built to add more brokers',
            text: 'IBKR MVP · Portfolio analytics · Dividend tracking · AI assistant · Broker-extensible architecture',
          },
          {
            label: '05 — My contribution',
            icon: '🛠',
            headline: 'From data pipeline to AI-assisted delivery',
            text: 'Product strategy · Data pipeline · UX/UI · Architecture · Development · AI-assisted delivery',
          },
        ],
        file: '/portfolio/stock-portfolio-viewer/stock-portfolio-viewer-business-case.pdf',
      },
      // An on-premise application has no live site, so its release is how a reader gets it, per #233.
      links: [
        { text: sourceCode, href: 'https://github.com/aortegablasi96/stock-portfolio-viewer' },
        { text: 'Visit release site', href: 'https://github.com/aortegablasi96/stock-portfolio-viewer/releases/tag/v1.0.0' },
      ],
    },
    {
      name: 'This site',
      slug: 'career-site',
      media: { file: '/portfolio/career-site/lead.webp', alt: 'This site on a laptop, showing its introduction: the owner’s photo, name, positioning line and summary, above the contact and CV controls' },
      caption: 'The introduction',
      // Pictures of the site's own window, which the owner asked on #252 to have made from the site
      // itself, as its first picture was on #63: the page from its top to its end, as its contents
      // links reach each section, then a project's view and a role's. Each is the window at 1536 by
      // 816, as the live site drew it on 2026-09-30. Each description says only what its screen shows.
      gallery: [
        {
          media: { file: '/portfolio/career-site/gallery-introduction.webp', alt: 'This site’s window, showing its introduction: the owner’s photo beside a greeting, the name, the positioning line, the location and the summary, above the contact and CV controls and the start of the experience timeline' },
          caption: 'The introduction',
        },
        {
          media: { file: '/portfolio/career-site/gallery-experience.webp', alt: 'This site’s window, showing its experience: five roles as cards along a timeline, each under its dates, with its company’s logo, the job title and the place, above the start of the portfolio' },
          caption: 'The experience timeline',
        },
        {
          media: { file: '/portfolio/career-site/gallery-portfolio.webp', alt: 'This site’s window, showing its portfolio: the cards of NumisBook and the Digital Twin, each with a picture of the application on a laptop, its name, one sentence and its technologies, above the top of the next two cards' },
          caption: 'The portfolio',
        },
        {
          media: { file: '/portfolio/career-site/gallery-skills.webp', alt: 'This site’s window, showing its skills in four groups, product and delivery, AI, data and IoT, and tools, each listing its skills by level: advanced, proficient or basic' },
          caption: 'The skills',
        },
        {
          media: { file: '/portfolio/career-site/gallery-education.webp', alt: 'This site’s window, showing the end of the page: two degrees and two certifications as cards along a timeline, the four languages with their levels, and the footer with the contact addresses' },
          caption: 'Education and languages',
        },
        {
          media: { file: '/portfolio/career-site/gallery-project-view.webp', alt: 'This site’s window, showing a project’s view, NumisBook’s: its name, a switch between the overview and the business case, its description, how it was built, its technologies and its links, beside a picture of the application above a row of thumbnails' },
          caption: 'A project’s view',
        },
        {
          media: { file: '/portfolio/career-site/gallery-role-view.webp', alt: 'This site’s window, showing a role’s view, the current one at ABB: the company, the dates and the place above the job title, then four numbered responsibilities and achievements' },
          caption: 'A role’s view',
        },
      ],
      summary: 'A career site that doubles as its own printed CV.',
      technologies: ['Next.js', 'TypeScript', 'CSS Modules', 'GitHub Pages'],
      description:
        'A career site that is also its own printed CV.',
      howBuilt: [
        [
          'Used Claude Code as a virtual cross-functional development team, creating specialised skill workflows for content strategy, UI design, architecture, testing, governance and project management, with every significant design and architecture decision recorded. Integrated MCP tools including Figma and Playwright to connect product design and browser testing.',
        ],
      ],
      // The site has no knowledge-base entry, so its business case was written in the same five
      // items as the others, as the owner asked on #231, from what the repository records: the
      // Content Brief on #25, the ADRs and the DDRs. Its full business case was made in the others'
      // layout and says no more than they do.
      businessCase: {
        items: [
          {
            label: '01 — Problem',
            icon: '⚠️',
            headline: 'CVs drift from the evidence behind them',
            text: 'Recruiters skim a candidate’s profile quickly and often print it, while the evidence behind a CV’s claims sits elsewhere, and a CV kept apart from a website drifts out of step with it.',
          },
          {
            label: '02 — Product',
            icon: '💡',
            headline: 'A career site that is its own CV',
            text: 'A career site that is also its own printed CV, with a view of its own for every role and project, and a downloadable CV kept in step with the page.',
          },
          {
            label: '03 — Key decisions',
            icon: '🔀',
            headline: 'The page is the CV',
            text: 'The page is the CV · Content separate from code · Static by design · Accessible from the start · Every decision recorded',
          },
          {
            label: '04 — Outcome',
            icon: '🏁',
            headline: 'Live, printable and every decision traced',
            text: 'Live career site · Printable CV · A view for every role and project · Automated quality gate · Decision trail',
          },
          {
            label: '05 — My contribution',
            icon: '🛠',
            headline: 'From product strategy to delivery',
            text: 'Product strategy · Content · UX/UI · Architecture · AI-assisted development · Delivery',
          },
        ],
        file: '/portfolio/career-site/career-site-business-case.pdf',
      },
      links: [{ text: sourceCode, href: 'https://github.com/aortegablasi96/career-site' }],
    },
  ],
  // The line above the cards, per DDR-067, in the experience hint's words.
  hint: 'Click any project to read the full description',
  view: {
    back: 'Back to portfolio',
    // The heading above how a project was built, per #229 and DDR-078, in the owner's words.
    howBuilt: 'How I built it',
    // The switch between the two accounts of a project, per #231 and DDR-079: the group's name,
    // which only assistive technology is told, then its two options, as the owner chose them.
    accounts: 'About this project',
    overview: 'Overview',
    businessCase: 'Business case',
    // The control that takes the links' place while the business case is shown, in the owner's words.
    downloadBusinessCase: 'Download Full Business Case',
    // The business case's stepping controls, per #240 and DDR-080, as `career-site-experience-business-case`
    // draws them (node 365:54).
    previousItem: 'Prev',
    nextItem: 'Next',
    builtWith: 'Built with',
    // The name of a project's gallery thumbnails, per DDR-081, said only to assistive technology.
    gallery: 'Gallery',
    // The controls that open the picture in the lead's frame larger and close it again, per #246
    // and DDR-082. Each shows a mark alone, so these are said only to assistive technology.
    enlarge: 'View larger',
    close: 'Close',
    // The controls that move between a gallery's pictures while one is open larger, per #250 and
    // DDR-083. Each shows a chevron alone, so these are said only to assistive technology.
    previousPicture: 'Previous picture',
    nextPicture: 'Next picture',
    position: (place, count) => `${place} of ${count}`,
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
