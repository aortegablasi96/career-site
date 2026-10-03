import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { blocks, inline, plain, Reply } from './reply';

const newTab = 'opens in a new tab';

function render(markdown: string): string {
  return renderToStaticMarkup(<Reply text={markdown} newTab={newTab} />);
}

// ADR-028: a reply's Markdown becomes React elements, never HTML, for the subset the chatbot writes.
describe('Reply', () => {
  it('sets paragraphs, and the line breaks inside one', () => {
    expect(render('One\ntwo\n\nThree')).toBe('<p>One<br/>two</p><p>Three</p>');
  });

  it('sets bulleted and numbered lists of one level', () => {
    expect(render('- a\n* b\n+ c')).toBe('<ul><li>a</li><li>b</li><li>c</li></ul>');
    expect(render('1. a\n2) b')).toBe('<ol><li>a</li><li>b</li></ol>');
    expect(render('Intro:\n- a\n- b\n\nAfter')).toBe('<p>Intro:</p><ul><li>a</li><li>b</li></ul><p>After</p>');
  });

  it('keeps items spaced by blank lines in one list, counting from its first number', () => {
    expect(render('1. **a:** one\n\n2. b\n\n3. c\n\nAfter')).toBe(
      '<ol><li><strong>a:</strong> one</li><li>b</li><li>c</li></ol><p>After</p>',
    );
    expect(render('3. c\n4. d')).toBe('<ol start="3"><li>c</li><li>d</li></ol>');
    expect(render('- a\n\nText')).toBe('<ul><li>a</li></ul><p>Text</p>');
  });

  it('keeps points under a numbered item in that item, so the numbering runs on', () => {
    expect(render('1. **A**:\n   - one\n   - two\n\n2. **B**:\n   - three')).toBe(
      '<ol><li><strong>A</strong>:<br/>one<br/>two</li><li><strong>B</strong>:<br/>three</li></ol>',
    );
    expect(plain('1. A:\n   - one')).toBe('A:\none');
  });

  it('flattens a nested item into the list it is under, and joins a continued line to its item', () => {
    expect(render('- a\n  - b\n  more')).toBe('<ul><li>a</li><li>b more</li></ul>');
  });

  it('sets bold, italic and inline code', () => {
    expect(render('**bold** __bold__ *italic* _italic_ `code`')).toBe(
      '<p><strong>bold</strong> <strong>bold</strong> <em>italic</em> <em>italic</em> <code>code</code></p>',
    );
    expect(render('**bold _and italic_**')).toBe('<p><strong>bold <em>and italic</em></strong></p>');
  });

  it('leaves an underscore inside a word, and a lone asterisk, as written', () => {
    expect(render('snake_case_name and 2 * 3')).toBe('<p>snake_case_name and 2 * 3</p>');
  });

  it('keeps marks inside code as they are', () => {
    expect(render('`**not bold**`')).toBe('<p><code>**not bold**</code></p>');
  });

  it('links an https or http address, written out or as Markdown, in a new tab that it names', () => {
    expect(render('[LinkedIn](https://www.linkedin.com/in/andreu-ob/)')).toBe(
      `<p><a href="https://www.linkedin.com/in/andreu-ob/" target="_blank" rel="noopener" aria-label="LinkedIn, ${newTab}">LinkedIn</a></p>`,
    );
    expect(render('See http://example.com.')).toBe(
      `<p>See <a href="http://example.com" target="_blank" rel="noopener" aria-label="http://example.com, ${newTab}">http://example.com</a>.</p>`,
    );
  });

  it('links no other kind of address', () => {
    expect(render('[click](javascript:alert(1)) [mail](mailto:a@b.c)')).not.toContain('<a');
  });

  it('turns a heading into a bold paragraph, so a reply adds no heading to the page', () => {
    expect(render('## Skills\nText')).toBe('<p><strong>Skills</strong></p><p>Text</p>');
    expect(render('# Title #')).toBe('<p><strong>Title</strong></p>');
  });

  it('drops a rule and a code fence’s own lines', () => {
    expect(render('a\n\n---\n\nb')).toBe('<p>a</p><p>b</p>');
    expect(render('```js\nconst a = 1;\n```')).toBe('<p>const a = 1;</p>');
  });

  it('shows markup as text, never as HTML', () => {
    expect(render('<img src=x onerror=alert(1)> <script>x</script>')).toBe(
      '<p>&lt;img src=x onerror=alert(1)&gt; &lt;script&gt;x&lt;/script&gt;</p>',
    );
  });

  it('shows nothing for an empty reply', () => {
    expect(render('')).toBe('');
    expect(blocks('\n\n')).toEqual([]);
  });
});

describe('inline', () => {
  it('leaves text without marks as one run', () => {
    expect(inline('plain')).toEqual([{ type: 'text', text: 'plain' }]);
  });
});

describe('plain', () => {
  it('reads a reply as its text alone, a line to each item', () => {
    expect(plain('**Hi**, I can help.\n\n- one\n- [two](https://example.com)')).toBe('Hi, I can help.\n\none\ntwo');
  });
});
