import { introduction } from './introduction';
import type { Site } from './types';

export const site: Site = {
  // The same name and positioning the introduction shows, so the two cannot disagree.
  title: `${introduction.name} – ${introduction.positioning}`,
  description:
    'Andreu Ortega Blasi is a product manager for AI and IoT products, with an engineering background, based in Lugano, Switzerland.',
};
