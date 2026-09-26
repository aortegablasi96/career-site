import { Contents } from '@/components/contents';
import { Footer } from '@/components/footer';
import { Introduction } from '@/components/introduction';
import { Section } from '@/components/section';
import { contents } from '@/content/contents';
import { cv } from '@/content/cv';
import { introduction } from '@/content/introduction';
import { sections } from './sections';

export default function HomePage() {
  return (
    <>
      {/* The contents bar comes first, above main, per DDR-031: it is pinned to the top of the
          window and spans it, as the design draws it above everything else on the page, so it
          belongs to neither the introduction nor the column main sets. */}
      <Contents
        label={contents.label}
        home={contents.home}
        title={contents.title}
        sections={sections}
      />
      <main>
        <Introduction introduction={introduction} cv={cv} />
        {sections.map(({ id, title, items, breakable }) => (
          <Section key={id} id={id} title={title} items={items} breakable={breakable} />
        ))}
      </main>
      {/* The footer follows main rather than sitting inside it, so it is the page's contentinfo
          landmark, per DDR-028. It takes the introduction's own name and contact records: the
          addresses are stated once in content/ and shown in two places. */}
      <Footer name={introduction.name} contact={introduction.contact} />
    </>
  );
}
