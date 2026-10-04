import { introduction } from './introduction';
import { projects } from './projects';
import type { Chat } from './types';

/** The Digital Twin's record, whose links name the chatbot's own page once, per ADR-028. */
const twin = projects.projects.find(({ slug }) => slug === 'digital-twin');
const page = twin?.links.find(({ text }) => text === 'Live site')?.href;

if (!page) {
  throw new Error('The Digital Twin’s record names no live site for the chat to lead to.');
}

/**
 * The chat with the owner's Digital Twin, per DDR-100 and ADR-028, on every page of the site.
 *
 * The words are the Content Brief's on #306, which the owner approved, and since DDR-102 the
 * design's: the heading, the subtitle, the statuses, the welcome, the suggestions and the
 * placeholder, which the owner approved on #321, with the site's curly apostrophes and no serial
 * comma. Since DDR-101 there is no note on where messages go. The cut-off notice is DDR-103's,
 * which the owner approved on #317.
 *
 * The API's origin and the length it accepts are here rather than in an environment variable, per
 * ADR-028: there is one API, its address is public already, and a pull request reviews a change to
 * it, as `site.url` is reviewed.
 */
export const chat: Chat = {
  id: 'digital-twin-chat',
  api: 'https://career-conversation-chatbot.onrender.com',
  maxLength: 2000,
  countFrom: 1800,
  page,
  launcher: 'Ask my AI Digital Twin',
  newTab: introduction.newTab,
  heading: 'AI Digital Twin',
  subtitle: 'Andreu’s career assistant',
  status: {
    warming: 'Starting up',
    ready: 'Online',
    unavailable: 'Unavailable',
  },
  close: 'Close the chat',
  clear: 'Clear chat',
  cleared: 'The chat is cleared.',
  conversation: 'Conversation',
  sender: { reader: 'You:', twin: 'Digital Twin:' },
  welcome:
    'Hi! I’m Andreu’s AI Digital Twin. Ask me anything about his career, projects, skills or education — I’ll answer in your language.',
  suggested: 'Suggested questions',
  suggestions: [
    'Summarise Andreu’s professional profile',
    'What AI and IoT products has he managed?',
    'What does his tech stack look like?',
    'Is he open to new opportunities?',
  ],
  field: 'Your question',
  placeholder: 'Your question…',
  send: 'Send',
  limit: 'Questions can be up to 2,000 characters.',
  held: 'Starting up. This can take up to a minute; your question will be answered as soon as it’s ready.',
  writing: 'Writing an answer…',
  rateLimited: 'You’ve sent a lot of questions in a short time. Wait a minute, then send yours again.',
  unavailable: 'The Digital Twin can’t answer right now.',
  cutOff: 'The answer was cut off before it was finished.',
  tryAgain: 'Try again',
  ownPage: 'Ask it on its own page',
};
