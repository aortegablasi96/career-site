import { describe, expect, it } from 'vitest';
import { introduction } from '@/content/introduction';
import { person, personJsonLd } from './person';

describe('the owner’s structured data', () => {
  // ADR-024: every value is one the page already shows, so the data states nothing new.
  it('describes the owner as a schema.org Person, from the page’s own content', () => {
    expect(person).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Andreu Ortega Blasi',
      url: 'https://andreuortegablasi.com',
      image: 'https://andreuortegablasi.com/home/andreu-ortega-blasi-photo.webp',
      description: expect.stringContaining('Andreu Ortega Blasi'),
      jobTitle: 'Global Product Manager - Digital Solutions',
      worksFor: { '@type': 'Organization', name: 'ABB' },
      homeLocation: { '@type': 'Place', name: introduction.location },
      sameAs: ['https://www.linkedin.com/in/andreu-ob/', 'https://github.com/aortegablasi96'],
    });
  });

  it('is valid JSON with no character that could close its script element', () => {
    expect(JSON.parse(personJsonLd)).toEqual(person);
    expect(personJsonLd).not.toContain('<');
  });
});
