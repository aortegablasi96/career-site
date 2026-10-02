import type { NotFound } from './types';

/**
 * The page an address the site does not have shows, per #283 and DDR-093, in the words the owner
 * chose on that story. It states nothing about the owner, so none of it is a claim. The way back
 * reads as a view's does, "Back to portfolio" and "Back to experience", and leads to the page.
 */
export const notFound: NotFound = {
  back: 'Back to home',
  title: 'Page not found',
  text: 'The page you’re looking for isn’t here. It may have moved, or the address may be mistyped.',
};
