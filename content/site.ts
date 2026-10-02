import { introduction } from './introduction';
import type { Site } from './types';

export const site: Site = {
  // The same name and positioning the introduction shows, so the two cannot disagree.
  title: `${introduction.name} – ${introduction.positioning}`,
  // What search results and link previews show under the title. Since #285 it names what the
  // positioning line names, in the owner's chosen wording, where it said "AI and IoT products".
  description:
    'Andreu Ortega Blasi is a product manager building AI, SaaS and connected products, with an engineering background, based in Lugano, Switzerland.',
  // The domain ADR-023 adopted. A new domain changes this line, per ADR-024.
  url: 'https://andreuortegablasi.com',
};
