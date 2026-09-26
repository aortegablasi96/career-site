import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { dateLabels } from '@/content/dates';
import { experience } from '@/content/experience';
import type { Role } from '@/content/types';
import { RoleView } from './role-view';

const { roles, view } = experience;
const abb = roles.find(({ company }) => company === 'ABB')!;
const ponera = roles.find(({ company }) => company === 'Ponera Group')!;

const render = (role: Role, neighbours: { previous?: Role; next?: Role } = {}) =>
  renderToStaticMarkup(
    <RoleView role={role} strings={view} dateLabels={dateLabels} backHref="/#experience" {...neighbours} />,
  );

/** The markup's text, as a reader meets it. */
const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const styles = readFileSync(new URL('./role-view.module.css', import.meta.url), 'utf8')
  .replace(/\r\n/g, '\n')
  .replace(/\/\*[\s\S]*?\*\//g, '');

/** The stylesheet before its media query, which is below the wide breakpoint. */
const narrow = styles.split('@media')[0]!;

describe('RoleView', () => {
  const html = render(abb, { previous: ponera });

  // DDR-059: the way back, the header, the points, the skills where there are any, and the foot.
  // DDR-060: the view's heading is the job title in full, where the timeline's card shortens it.
  it('reads as the way back, the company, dates and place, then the job title in full', () => {
    expect(text(html)).toMatch(
      /^Back to experience ABB Oct 2024 – Present · Quartino, Switzerland Global Product Manager - Digital Solutions Responsibilities &amp; achievements/,
    );
  });

  it('draws the dot between the dates and the place for the eye alone', () => {
    expect(html).toMatch(/<span class="[^"]*" aria-hidden="true">·<\/span>/);
  });

  it('marks the dates up with their machine-readable value', () => {
    expect(html).toContain('<time dateTime="2024-10">');
  });

  it('numbers every point, in the content’s order, and hides the drawn numbers', () => {
    const points = html.match(/<ol[^>]*>.*<\/ol>/)?.[0] ?? '';
    const items = [...points.matchAll(/<li[^>]*><span[^>]*aria-hidden="true">(\d+)<\/span><span>([^<]+)<\/span><\/li>/g)];

    expect(items.map(([, number]) => Number(number))).toEqual(abb.points.map((_, index) => index + 1));
    expect(items.map(([, , point]) => point)).toEqual(abb.points.map((point) => point.replace(/&/g, '&amp;')));
  });

  it('labels the points with an h2, under the view’s one h1', () => {
    expect(html).toMatch(/<h2[^>]*>Responsibilities &amp; achievements<\/h2>/);
    expect(html.match(/<h1/g)).toHaveLength(1);
  });

  // #176: the owner supplies each role's skills; a role without them shows no label and no row.
  it('shows no skills row for a role the owner has supplied none for', () => {
    expect(abb.skills).toBeUndefined();
    expect(html).not.toContain(view.skills.replace('&', '&amp;'));
  });

  it('shows every skill the owner supplies, in their order, under its label', () => {
    const skilled = render({ ...abb, skills: ['Product Management', 'SaaS', 'IoT'] });
    const list = skilled.match(/<ul[^>]*>.*?<\/ul>/)?.[0] ?? '';

    expect(skilled).toMatch(/<h2[^>]*>Skills &amp; technologies<\/h2><ul/);
    expect([...list.matchAll(/<li[^>]*>([^<]+)<\/li>/g)].map(([, skill]) => skill)).toEqual([
      'Product Management',
      'SaaS',
      'IoT',
    ]);
  });

  it('leads to the older role at the left, and shows its direction, company and title', () => {
    const link = html.match(/<a [^>]*href="\/experience\/ponera-group"[^>]*>/)?.[0] ?? '';

    expect(link).toContain('aria-label="Previous role: Ponera Group, Product Manager"');
    expect(text(html)).toMatch(/Previous role Ponera Group Product Manager$/);
  });

  // DDR-060: a neighbouring card is a card, so it shows the short title the timeline's card does.
  it('names a neighbouring role by its short title, not its full one', () => {
    const randstad = roles.find(({ company }) => company === 'Randstad')!;
    const after = render(ponera, { previous: randstad });

    expect(randstad.fullTitle).toBeDefined();
    expect(after).toContain(`aria-label="Previous role: Randstad, ${randstad.title}"`);
    expect(text(after)).toMatch(new RegExp(`Previous role Randstad ${randstad.title}$`));
  });

  it('shows the one title a role without a full title states', () => {
    expect(ponera.fullTitle).toBeUndefined();
    expect(render(ponera)).toMatch(/<h1[^>]*>Product Manager<\/h1>/);
  });

  it('keeps the empty left half for the oldest role, so the newer role is on the right', () => {
    const oldest = render(roles[0]!, { next: roles[1] });

    expect(oldest).toMatch(/<div class="[^"]*half[^"]*"><\/div><a [^>]*aria-label="Next role: /);
  });

  it('shows no foot at all for a role with no neighbours', () => {
    expect(render(abb)).not.toMatch(/Previous role|Next role/);
  });
});

describe('role view styles', () => {
  // The panel's 48px would leave a phone with enlarged text too little room for the title, so
  // below the wide breakpoint it takes the flow step, per DDR-059.
  it('pads the header by the flow step below the wide breakpoint and the design’s 48px from it', () => {
    expect(narrow).toMatch(/\.header\s*\{[^}]*padding:\s*var\(--space-medium\);/);
    expect(styles).toMatch(/@media \(min-width: 48em\)\s*\{\s*\.header\s*\{\s*padding:\s*var\(--role-view-panel-padding\);/);
  });

  it('sets the job title at a project view’s title size, one role for both views', () => {
    expect(narrow).toMatch(/\.header > \.title\s*\{[^}]*font-size:\s*var\(--font-size-project-title-narrow\);/);
    expect(styles).toMatch(/\.header > \.title\s*\{\s*font-size:\s*var\(--font-size-project-title\);/);
  });

  it('keeps a long company inside its neighbouring card', () => {
    expect(styles).toMatch(/\.neighbourText\s*\{[^}]*overflow-wrap:\s*anywhere;/);
  });
});
