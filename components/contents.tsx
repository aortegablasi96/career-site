import { ContentsBar } from './contents-bar';

/**
 * The page's contents, per DDR-031: a bar pinned to the top of the window, holding one link to
 * each section. DDR-010 rejected the design's sticky bar on five grounds and DDR-006 on two before
 * it; DDR-031 supersedes both and answers each ground, and this is what it answers the last of
 * them with — the bar replaces the row that scrolled away with the introduction rather than
 * repeating it, so the page still lists its sections in one place.
 *
 * Each link shows the word the design draws rather than its section's heading, so the fourth reads
 * "Education" where its section reads "Education and certifications". The word is a string in
 * `content/`, beside the section's own title, per ADR-002, and the section's accessible name is
 * still taken from its `h2` rather than from here.
 *
 * What the bar does in the browser — the glide a link starts, per DDR-041, and the mark on the
 * current section's link, per DDR-042 — is `ContentsBar`'s, the one Client Component on the site, per ADR-007. Since ADR-009 it renders the
 * links too, because only what renders a link can mark it. This stays a Server Component and hands
 * it each section's id and word and nothing else: the page's sections also carry their items,
 * which are server-rendered elements and must not cross into client code.
 *
 * The bar's first link is Home, per DDR-045, which returns the reader to the top of the page. Its
 * word is in `content/` beside the bar's accessible name, since it names no section.
 *
 * With no sections there is nothing to list, so nothing renders — not even Home, since a page of
 * nothing but its introduction has nowhere else to return from.
 */
export function Contents({
  label,
  home,
  sections,
}: {
  label: string;
  home: string;
  sections: readonly { id: string; link: string }[];
}) {
  if (sections.length === 0) {
    return null;
  }

  return <ContentsBar label={label} home={home} sections={sections.map(({ id, link }) => ({ id, link }))} />;
}
