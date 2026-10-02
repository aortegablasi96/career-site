import { introduction } from './introduction';
import type { Site } from './types';

export const site: Site = {
  // The same name and positioning the introduction shows, so the two cannot disagree.
  title: `${introduction.name} – ${introduction.positioning}`,
  description:
    'Andreu Ortega Blasi is a product manager for AI and IoT products, with an engineering background, based in Lugano, Switzerland.',
  // The domain ADR-023 adopted. A new domain changes this line, per ADR-024.
  url: 'https://andreuortegablasi.com',
  // The pictures a shared link previews with, per #282 and DDR-095, at the 1.91:1 that LinkedIn,
  // Slack, WhatsApp and X draw a large preview at. The card is the owner's photo, name, positioning
  // line and location on the accent, which the owner chose on #282, so its description is what it
  // says. A project's is its lead picture cut to that shape from the middle, as a JPEG, because not
  // every platform draws a WebP; it takes the lead's description.
  share: {
    width: 1200,
    height: 630,
    card: '/home/share-card.jpg',
    cardAlt: `${introduction.name} – ${introduction.positioning}, ${introduction.location}`,
    project: (slug) => `/portfolio/${slug}/share.jpg`,
  },
};
