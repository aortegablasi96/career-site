import { experience } from '@/content/experience';
import { introduction } from '@/content/introduction';
import { site } from '@/content/site';

const current = experience.roles.find((role) => role.end === undefined);

/**
 * The owner as a schema.org `Person`, per ADR-024, which the page carries as JSON-LD so a search
 * engine can tie the site, and the profiles it links, to one person. Every value is one the page
 * already shows, taken from `content/`, so it states nothing the page does not.
 */
export const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: introduction.name,
  url: site.url,
  image: `${site.url}${introduction.photo.file}`,
  description: site.description,
  ...(current && {
    jobTitle: current.fullTitle ?? current.title,
    worksFor: { '@type': 'Organization', name: current.company },
  }),
  homeLocation: { '@type': 'Place', name: introduction.location },
  // The profiles the contact pills lead to; the email address is not a profile.
  sameAs: introduction.contact.map(({ href }) => href).filter((href) => href.startsWith('https://')),
};

/**
 * The script's text. `<` is escaped, as Next.js's guide on JSON-LD advises, so no value could close
 * the script element early.
 */
export const personJsonLd = JSON.stringify(person).replace(/</g, '\u003c');
