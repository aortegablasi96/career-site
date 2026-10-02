import { site } from '@/content/site';
import { asset } from './asset';

/** A picture a link preview shows, as Next.js's metadata takes it. */
export interface SharePicture {
  url: string;
  width: number;
  height: number;
  alt: string;
}

const { width, height, card, cardAlt, project } = site.share;

/**
 * The card the page and every role's view preview with, per #282 and DDR-095. Each path goes
 * through `asset()`, per ADR-004, and the layout's `metadataBase` puts it under the site's domain.
 */
export const shareCard: SharePicture = { url: asset(card), width, height, alt: cardAlt };

/** A project's preview picture, per DDR-095: its lead, cut to the preview's shape. */
export function sharePicture(slug: string, alt: string): SharePicture {
  return { url: asset(project(slug)), width, height, alt };
}
