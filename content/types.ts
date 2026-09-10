/**
 * Content types.
 *
 * ADR-002 records that all user-facing prose lives in `content/`, authored as typed
 * TypeScript modules and imported directly by Server Components.
 *
 * Only the types the scaffold needs are defined here. The types for roles, projects,
 * skills, and credentials are deliberately absent: their fields are a content decision,
 * and that content has not been scoped yet.
 */

/** Site-level metadata. Rendered into the document head rather than the page body. */
export interface Site {
  title: string;
  description: string;
}

/** Copy for the placeholder page. Delete this type with the page it serves. */
export interface Placeholder {
  heading: string;
  message: string;
}
