import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { introduction } from '@/content/introduction';
import { Introduction } from './introduction';

// Rendered with the real content, since what the introduction says is what #28 asks for.
const html = renderToStaticMarkup(<Introduction introduction={introduction} />);

/** The markup's text, as a reader meets it. */
const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

describe('Introduction', () => {
  it('is the page header, with the owner’s name as the page title', () => {
    expect(html).toMatch(/^<header><h1>Andreu Ortega Blasi<\/h1>/);
  });

  it('follows the order DDR-006 sets: positioning, location, summary, availability, contact', () => {
    const order = [
      introduction.positioning,
      introduction.location,
      introduction.relocation,
      introduction.summary,
      introduction.availability,
      introduction.contact[0].text,
    ].map((part) => text.indexOf(part));

    expect(order.every((position) => position >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it('adds no heading besides the page title, so the positioning stays out of the outline', () => {
    expect(html.match(/<h\d/g)).toEqual(['<h1']);
  });

  it('links to each contact address, with the address as the link text', () => {
    const links = [...html.matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map(([, href, text]) => ({
      href,
      text,
    }));

    expect(links).toEqual([
      { href: 'mailto:aortegablasi@gmail.com', text: 'aortegablasi@gmail.com' },
      { href: 'https://www.linkedin.com/in/andreu-ob/', text: 'linkedin.com/in/andreu-ob' },
      { href: 'https://github.com/aortegablasi96', text: 'github.com/aortegablasi96' },
    ]);
  });
});

describe('introduction content', () => {
  it('gives each contact link its own address as its text, so it is not printed twice', () => {
    for (const { text, href } of introduction.contact) {
      expect(href.replace(/^mailto:|^https:\/\/(?:www\.)?/, '').replace(/\/$/, '')).toBe(text);
    }
  });

  it('shows neither a phone number nor a date of birth, per the Content Brief', () => {
    expect(text).not.toMatch(/\+?\d[\d ]{7,}\d/);
    expect(text).not.toMatch(/1996|born/i);
  });

  it('shows no work permit, which the owner left out on #26', () => {
    expect(text).not.toMatch(/permit/i);
  });

  it('invites a conversation rather than announcing a job search, since the ABB role is current (#28)', () => {
    expect(introduction.availability).toMatch(/happy to talk/);
    expect(text).not.toMatch(/open to (?:new )?(?:product )?roles|looking for|job search/i);
  });
});
