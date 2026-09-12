import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Section } from './section';

describe('Section', () => {
  const html = renderToStaticMarkup(
    <Section id="experience" title="Experience">
      <p>Body</p>
    </Section>,
  );

  it('carries the id the contents link to', () => {
    expect(html).toMatch(/^<section id="experience"/);
  });

  it('is named by its heading, so it is a landmark assistive technology can move to', () => {
    expect(html).toMatch(/aria-labelledby="experience-title"/);
    expect(html).toContain('<h2 id="experience-title">Experience</h2>');
  });

  it('renders what it holds after its heading', () => {
    expect(html).toMatch(/<\/h2><p>Body<\/p><\/section>$/);
  });
});
