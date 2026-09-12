/**
 * Content types.
 *
 * ADR-002 records that all user-facing prose lives in `content/`, authored as typed
 * TypeScript modules and imported directly by Server Components.
 *
 * Only the types the page renders so far are defined here. Each section story of Epic #25 adds
 * the type for its own records: roles, projects, skills, credentials, and languages.
 */

/** Site-level metadata. Rendered into the document head rather than the page body. */
export interface Site {
  title: string;
  description: string;
}

/** A link that stands on its own, never inside a sentence, as ADR-002 requires. */
export interface Link {
  /** What the link shows. */
  text: string;
  href: string;
}

/** The introduction at the top of the page, in the order DDR-006 sets. */
export interface Introduction {
  /** The page title. */
  name: string;
  /** One line saying what the owner does. */
  positioning: string;
  location: string;
  relocation: string;
  summary: string;
  availability: string;
  /** Each link's text is its own address, so it is not printed twice, per DDR-006. */
  contact: readonly Link[];
}

/** The list of links to the page's sections, per DDR-006. */
export interface Contents {
  /** The accessible name of the navigation, so assistive technology can announce it. */
  label: string;
}
