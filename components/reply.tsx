import { Fragment, type ReactNode } from 'react';

/**
 * A run of a reply's text, as the chatbot's Markdown marks it, per ADR-028: plain, bold, italic,
 * inline code, or a link to an `https://` or `http://` address.
 */
export type Inline =
  | { type: 'text'; text: string }
  | { type: 'strong'; children: readonly Inline[] }
  | { type: 'em'; children: readonly Inline[] }
  | { type: 'code'; text: string }
  | { type: 'link'; text: string; href: string }
  | { type: 'break' };

/** A paragraph, as its lines, or a list of one level, as its items. */
export type Block =
  | { type: 'paragraph'; lines: readonly (readonly Inline[])[] }
  | { type: 'list'; ordered: boolean; start: number; items: readonly (readonly Inline[])[] };

/**
 * Every mark a run can carry, earliest first wherever two could start at one place: code, so
 * nothing inside it is read as a mark; a link written as Markdown; bold, then italic, each with
 * asterisks or underscores; and an address written out, which the chatbot's own page links too.
 * An underscore marks italic only outside a word, so a `snake_case` name stays as it is written.
 */
const marks =
  /`([^`\n]+)`|\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)|\*\*(.+?)\*\*|__(.+?)__|\*(?!\s)([^*\n]+?)\*|(?<![\p{L}\p{N}_])_(?!\s)([^_\n]+?)_(?![\p{L}\p{N}_])|(https?:\/\/[^\s<>()[\]]*[^\s<>()[\].,;:!?'"])/gu;

/** A line's runs, per ADR-028. Anything the marks above don't name stays as its text. */
export function inline(line: string): Inline[] {
  const runs: Inline[] = [];
  let from = 0;

  for (const match of line.matchAll(marks)) {
    const [whole, code, linkText, linkHref, bold, boldUnderscored, italic, italicUnderscored, address] =
      match;

    if (match.index > from) {
      runs.push({ type: 'text', text: line.slice(from, match.index) });
    }

    if (code !== undefined) {
      runs.push({ type: 'code', text: code });
    } else if (linkText !== undefined && linkHref !== undefined) {
      runs.push({ type: 'link', text: linkText, href: linkHref });
    } else if (bold !== undefined || boldUnderscored !== undefined) {
      runs.push({ type: 'strong', children: inline(bold ?? boldUnderscored!) });
    } else if (italic !== undefined || italicUnderscored !== undefined) {
      runs.push({ type: 'em', children: inline(italic ?? italicUnderscored!) });
    } else if (address !== undefined) {
      runs.push({ type: 'link', text: address, href: address });
    }

    from = match.index + whole.length;
  }

  if (from < line.length) {
    runs.push({ type: 'text', text: line.slice(from) });
  }

  return runs;
}

const heading = /^\s{0,3}#{1,6}\s+(.*?)\s*#*\s*$/;
const bullet = /^\s*[-*+]\s+(.*)$/;
const numbered = /^\s*(\d+)[.)]\s+(.*)$/;
const rule = /^\s{0,3}([-*_])(?:\s*\1){2,}\s*$/;
const fence = /^\s*```/;

/**
 * A reply's blocks, per ADR-028: paragraphs, with their line breaks, and bulleted and numbered
 * lists of one level. An indented item of the list's kind joins it as one more item, and one of
 * the other kind, as the chatbot writes points under a numbered item, joins that item as a new
 * line of it, so the numbering runs on. A blank
 * line between two items keeps them in one list, as the chatbot spaces its numbered lists, so a
 * numbered list counts on from the number it starts at. A heading becomes a paragraph in bold, so
 * that a reply cannot break the page's heading structure, and a rule or a code fence's own line is
 * dropped, leaving the code's lines as text.
 */
export function blocks(markdown: string): Block[] {
  const result: Block[] = [];
  let paragraph: Inline[][] | null = null;
  let list: { ordered: boolean; start: number; items: Inline[][] } | null = null;
  // A blank line inside a list, which ends it unless the next line is another of its items.
  let gap = false;

  const end = () => {
    if (paragraph) result.push({ type: 'paragraph', lines: paragraph });
    if (list) result.push({ type: 'list', ...list });
    paragraph = null;
    list = null;
    gap = false;
  };

  for (const line of markdown.replace(/\r\n?/g, '\n').split('\n')) {
    const bulleted = line.match(bullet);
    const counted = bulleted ? null : line.match(numbered);
    const item = bulleted?.[1] ?? counted?.[2];

    if (line.trim() === '' && list) {
      gap = true;
    } else if (line.trim() === '' || rule.test(line) || fence.test(line)) {
      end();
    } else if (heading.test(line)) {
      end();
      result.push({
        type: 'paragraph',
        lines: [[{ type: 'strong', children: inline(line.match(heading)![1]) }]],
      });
    } else if (item !== undefined) {
      const ordered = counted !== null;

      if (list && list.ordered !== ordered && /^\s/.test(line)) {
        gap = false;
        list.items.at(-1)!.push({ type: 'break' }, ...inline(item));
        continue;
      }

      if (!list || list.ordered !== ordered) {
        end();
        list = { ordered, start: counted ? Number(counted[1]) : 1, items: [] };
      }

      gap = false;
      list.items.push(inline(item));
    } else if (list && !gap && /^\s/.test(line)) {
      list.items.at(-1)!.push({ type: 'text', text: ` ${line.trim()}` });
    } else {
      if (list) end();
      paragraph ??= [];
      paragraph.push(inline(line.trim()));
    }
  }

  end();

  return result;
}

/** A reply as text alone, which the chat's live region reads out, per DDR-100. */
export function plain(markdown: string): string {
  const text = (runs: readonly Inline[]): string =>
    runs
      .map((run) => ('children' in run ? text(run.children) : run.type === 'break' ? '\n' : run.text))
      .join('');

  return blocks(markdown)
    .map((block) => (block.type === 'paragraph' ? block.lines : block.items).map(text).join('\n'))
    .join('\n\n');
}

function Runs({ runs, newTab }: { runs: readonly Inline[]; newTab: string }): ReactNode {
  return runs.map((run, index) => {
    switch (run.type) {
      case 'text':
        return <Fragment key={index}>{run.text}</Fragment>;
      case 'code':
        return <code key={index}>{run.text}</code>;
      case 'break':
        return <br key={index} />;
      case 'strong':
        return (
          <strong key={index}>
            <Runs runs={run.children} newTab={newTab} />
          </strong>
        );
      case 'em':
        return (
          <em key={index}>
            <Runs runs={run.children} newTab={newTab} />
          </em>
        );
      case 'link':
        // A link in a reply leaves the site, so it opens a new tab and says so, per DDR-043.
        return (
          <a key={index} href={run.href} target="_blank" rel="noopener" aria-label={`${run.text}, ${newTab}`}>
            {run.text}
          </a>
        );
    }
  });
}

/**
 * A reply from the Digital Twin, per ADR-028: the Markdown the chatbot writes, turned into React
 * elements and never into HTML, so nothing the model writes reaches the page as markup.
 */
export function Reply({ text, newTab }: { text: string; newTab: string }) {
  return blocks(text).map((block, index) => {
    if (block.type === 'list') {
      const List = block.ordered ? 'ol' : 'ul';

      return (
        <List key={index} start={block.ordered && block.start !== 1 ? block.start : undefined}>
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex}>
              <Runs runs={item} newTab={newTab} />
            </li>
          ))}
        </List>
      );
    }

    return (
      <p key={index}>
        {block.lines.map((line, lineIndex) => (
          <Fragment key={lineIndex}>
            {lineIndex > 0 && <br />}
            <Runs runs={line} newTab={newTab} />
          </Fragment>
        ))}
      </p>
    );
  });
}
