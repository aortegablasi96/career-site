import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { chat } from '@/content/chat';
import { projects } from '@/content/projects';
import {
  answer,
  answerLimit,
  type ChatEvent,
  type ChatState,
  Conversation,
  count,
  deliver,
  DigitalTwinChat,
  initial,
  next,
  retryAfter,
  retryDelay,
  spoken,
  warmingLimit,
  warmUp,
} from './digital-twin-chat';

const css = readFileSync(new URL('./digital-twin-chat.module.css', import.meta.url), 'utf8').replace(
  /\/\*[\s\S]*?\*\//g,
  '',
);

/** Each event in turn, from the state before anything is sent. */
function after(...events: ChatEvent[]): ChatState {
  return events.reduce(next, initial);
}

/** The text a piece of markup shows, without its tags. */
function text(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&#x27;/g, '’');
}

function conversation(state: ChatState): string {
  return renderToStaticMarkup(<Conversation chat={chat} state={state} mounted ask={() => {}} retry={() => {}} />);
}

// ADR-028's states and transitions, as pure functions, per its "Testing without the live API".
describe('the chat’s states', () => {
  it('starts warming the API, with nothing sent', () => {
    expect(initial).toMatchObject({ service: 'warming', warm: false, messages: [], waiting: null, notice: null });
  });

  it('holds a question sent before the API is warm, counts it as sent and says so once', () => {
    const state = after({ type: 'ask', question: 'Hello?' });

    expect(state.messages).toEqual([{ from: 'reader', text: 'Hello?' }]);
    expect(state.waiting).toBe('held');
    expect(state.said?.what).toBe('held');
    expect(after({ type: 'ask', question: 'Hello?' }, { type: 'warming' }).said).toEqual(state.said);
  });

  it('writes the held question’s answer once the API is warm, without sending it twice', () => {
    const state = after({ type: 'ask', question: 'Hello?' }, { type: 'warmed' });

    expect(state).toMatchObject({ service: 'ready', warm: true, waiting: 'writing' });
    expect(state.messages).toHaveLength(1);
  });

  it('writes at once when the API is already warm, and says nothing until the answer', () => {
    const warm = after({ type: 'warmed' });
    const state = next(warm, { type: 'ask', question: 'Hello?' });

    expect(state.waiting).toBe('writing');
    expect(state.said).toBe(warm.said);
  });

  it('holds a question again when the API answers 503, and says so', () => {
    const state = after({ type: 'warmed' }, { type: 'ask', question: 'Hello?' }, { type: 'warming' });

    expect(state).toMatchObject({ service: 'warming', warm: false, waiting: 'held' });
    expect(state.said?.what).toBe('held');
  });

  it('adds the answer, ready for a follow-up, and says it', () => {
    const state = after({ type: 'warmed' }, { type: 'ask', question: 'Hello?' }, { type: 'answered', reply: 'Hi.' });

    expect(state.messages).toEqual([
      { from: 'reader', text: 'Hello?' },
      { from: 'twin', text: 'Hi.' },
    ]);
    expect(state).toMatchObject({ waiting: null, notice: null, question: null });
    expect(state.said?.what).toBe('answer');
  });

  it('keeps a question the API refuses for now (429), and doesn’t send it again', () => {
    const state = after({ type: 'warmed' }, { type: 'ask', question: 'Hello?' }, { type: 'rate-limited' });

    expect(state).toMatchObject({ waiting: null, notice: 'rate-limited', question: 'Hello?' });
    expect(state.said?.what).toBe('rate-limited');
  });

  it('keeps a question the API couldn’t answer, so that the reader can try again', () => {
    const state = after({ type: 'warmed' }, { type: 'ask', question: 'Hello?' }, { type: 'failed' });

    expect(state).toMatchObject({ service: 'unavailable', waiting: null, notice: 'unavailable', question: 'Hello?' });
    expect(state.said?.what).toBe('unavailable');
    expect(next(state, { type: 'retry' })).toMatchObject({ waiting: 'writing', notice: null });
  });

  it('is unavailable once warming gives up, and starts warming again on "Try again"', () => {
    const state = after({ type: 'gave-up' });

    expect(state).toMatchObject({ service: 'unavailable', notice: 'unavailable', question: null });
    expect(next(state, { type: 'retry' })).toMatchObject({ service: 'warming', notice: null, waiting: null });
  });

  it('holds a kept question on "Try again" while the API is not warm', () => {
    const state = after({ type: 'ask', question: 'Hello?' }, { type: 'gave-up' }, { type: 'retry' });

    expect(state).toMatchObject({ waiting: 'held', question: 'Hello?' });
    expect(state.messages).toHaveLength(1);
  });

  it('counts each thing said, so the same words can be said again', () => {
    const state = after({ type: 'gave-up' }, { type: 'retry' }, { type: 'gave-up' });

    expect(state.said).toEqual({ what: 'unavailable', serial: 2 });
  });

  it('clears the conversation back to the welcome, keeping the service as it stands, and says so', () => {
    const state = after(
      { type: 'warmed' },
      { type: 'ask', question: 'Hello?' },
      { type: 'answered', reply: 'Hi.' },
      { type: 'clear' },
    );

    expect(state).toMatchObject({ service: 'ready', warm: true, messages: [], waiting: null, notice: null, question: null });
    expect(state.said?.what).toBe('cleared');
  });

  it('drops a question on its way, or kept after a notice, when the conversation is cleared', () => {
    expect(after({ type: 'ask', question: 'Hello?' }, { type: 'clear' })).toMatchObject({
      service: 'warming',
      messages: [],
      waiting: null,
      question: null,
    });
    expect(
      after({ type: 'warmed' }, { type: 'ask', question: 'Hello?' }, { type: 'failed' }, { type: 'clear' }),
    ).toMatchObject({ notice: null, question: null });
  });
});

describe('the API’s answers', () => {
  it('reads each response as ADR-028’s table does', () => {
    expect(answer(200, { user_id: 'a', reply: 'Hi.' })).toEqual({ type: 'answered', reply: 'Hi.' });
    expect(answer(200, { user_id: 'a' })).toEqual({ type: 'failed' });
    expect(answer(200, null)).toEqual({ type: 'failed' });
    expect(answer(503, null)).toEqual({ type: 'warming' });
    expect(answer(429, null)).toEqual({ type: 'rate-limited' });
    expect(answer(500, null)).toEqual({ type: 'failed' });
    expect(answer(422, null)).toEqual({ type: 'failed' });
  });

  it('waits 3 seconds, then twice as long each time, while warming', () => {
    expect([0, 1, 2, 3].map(retryDelay)).toEqual([3000, 6000, 12000, 24000]);
  });

  it('waits what Retry-After asks, or 10 seconds', () => {
    expect(retryAfter('10')).toBe(10_000);
    expect(retryAfter('3')).toBe(3000);
    expect(retryAfter(null)).toBe(10_000);
    expect(retryAfter('')).toBe(10_000);
    expect(retryAfter('soon')).toBe(10_000);
  });

  it('gives warming two minutes and an answer one', () => {
    expect(warmingLimit).toBe(120_000);
    expect(answerLimit).toBe(60_000);
  });
});

describe('the count below the field', () => {
  it('shows from 1,800 characters, as the count against 2,000', () => {
    expect(count(1799, chat)).toBeNull();
    expect(count(1850, chat)).toBe('1,850 / 2,000');
    expect(count(2000, chat)).toBe('2,000 / 2,000');
  });
});

// No test calls the API: `fetch` is a stub, and the timers are Vitest's, per ADR-028.
describe('talking to the API', () => {
  let fetch: ReturnType<typeof vi.fn>;
  let events: ChatEvent[];
  const dispatch = (event: ChatEvent) => events.push(event);

  /** A request that never answers, and fails when it is given up, as a real one does. */
  const hanging = (_url: string, { signal }: RequestInit) =>
    new Promise<Response>((_, reject) => signal?.addEventListener('abort', () => reject(new Error('aborted'))));

  beforeEach(() => {
    vi.useFakeTimers();
    fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    events = [];
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  describe('warming', () => {
    it('sends POST /warmup, with no credentials, and is ready when it answers', async () => {
      fetch.mockResolvedValue(Response.json({ status: 'ready' }));

      await expect(warmUp(chat.api, dispatch)).resolves.toBe(true);
      expect(fetch).toHaveBeenCalledOnce();
      expect(fetch.mock.calls[0]![0]).toBe(`${chat.api}/warmup`);
      expect(fetch.mock.calls[0]![1]).toMatchObject({ method: 'POST', credentials: 'omit' });
      expect(events).toEqual([{ type: 'warmed' }]);
    });

    it('tries again after 3 seconds, then 6, until it answers', async () => {
      fetch
        .mockRejectedValueOnce(new TypeError('Failed to fetch'))
        .mockResolvedValueOnce(new Response(null, { status: 502 }))
        .mockResolvedValue(Response.json({ status: 'ready' }));

      const warming = warmUp(chat.api, dispatch);

      await vi.advanceTimersByTimeAsync(2999);
      expect(fetch).toHaveBeenCalledTimes(1);
      await vi.advanceTimersByTimeAsync(1);
      expect(fetch).toHaveBeenCalledTimes(2);
      await vi.advanceTimersByTimeAsync(6000);
      await expect(warming).resolves.toBe(true);
      expect(fetch).toHaveBeenCalledTimes(3);
    });

    it('gives up two minutes after its first request', async () => {
      fetch.mockImplementation(hanging);

      const warming = warmUp(chat.api, dispatch);

      await vi.advanceTimersByTimeAsync(warmingLimit);
      await expect(warming).resolves.toBe(false);
      expect(events).toEqual([{ type: 'gave-up' }]);
    });
  });

  describe('a question', () => {
    it('is sent as the conversation’s user_id and message once the API is warm, and answered', async () => {
      fetch.mockResolvedValue(Response.json({ user_id: 'id', reply: 'Hi.' }));

      await deliver(chat.api, 'id', 'Hello?', Promise.resolve(true), dispatch);

      const [url, init] = fetch.mock.calls[0]! as [string, RequestInit];

      expect(url).toBe(`${chat.api}/chat`);
      expect(init).toMatchObject({ method: 'POST', credentials: 'omit' });
      expect(JSON.parse(init.body as string)).toEqual({ user_id: 'id', message: 'Hello?' });
      expect(events).toEqual([{ type: 'answered', reply: 'Hi.' }]);
    });

    it('is not sent while warming has given up', async () => {
      await deliver(chat.api, 'id', 'Hello?', Promise.resolve(false), dispatch);

      expect(fetch).not.toHaveBeenCalled();
      expect(events).toEqual([]);
    });

    it('is sent again after Retry-After when the API answers 503', async () => {
      fetch
        .mockResolvedValueOnce(new Response(null, { status: 503, headers: { 'Retry-After': '10' } }))
        .mockResolvedValue(Response.json({ user_id: 'id', reply: 'Hi.' }));

      const delivering = deliver(chat.api, 'id', 'Hello?', Promise.resolve(true), dispatch);

      await vi.advanceTimersByTimeAsync(9999);
      expect(fetch).toHaveBeenCalledTimes(1);
      await vi.advanceTimersByTimeAsync(1);
      await delivering;
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(events).toEqual([{ type: 'warming' }, { type: 'answered', reply: 'Hi.' }]);
    });

    it('stops waiting for 503s after two minutes, and the chat is unavailable', async () => {
      fetch.mockImplementation(async () => new Response(null, { status: 503, headers: { 'Retry-After': '10' } }));

      const delivering = deliver(chat.api, 'id', 'Hello?', Promise.resolve(true), dispatch);

      await vi.advanceTimersByTimeAsync(warmingLimit);
      await delivering;
      expect(events.at(-1)).toEqual({ type: 'gave-up' });
    });

    it('is rate-limited on 429, and not sent again', async () => {
      fetch.mockResolvedValue(new Response(null, { status: 429 }));

      await deliver(chat.api, 'id', 'Hello?', Promise.resolve(true), dispatch);

      expect(fetch).toHaveBeenCalledOnce();
      expect(events).toEqual([{ type: 'rate-limited' }]);
    });

    it('is given up after 60 seconds, and not sent again', async () => {
      fetch.mockImplementation(hanging);

      const delivering = deliver(chat.api, 'id', 'Hello?', Promise.resolve(true), dispatch);

      await vi.advanceTimersByTimeAsync(answerLimit);
      await delivering;
      expect(fetch).toHaveBeenCalledOnce();
      expect(events).toEqual([{ type: 'failed' }]);
    });

    it('fails when the network or the API’s CORS policy refuses it', async () => {
      fetch.mockRejectedValue(new TypeError('Failed to fetch'));

      await deliver(chat.api, 'id', 'Hello?', Promise.resolve(true), dispatch);

      expect(events).toEqual([{ type: 'failed' }]);
    });
  });
});

describe('DigitalTwinChat', () => {
  // As the static HTML is, before script has run: the chat at rest.
  const html = renderToStaticMarkup(<DigitalTwinChat chat={chat} />);

  it('leads a reader without script to the chatbot’s own page, in a new tab', () => {
    const link = html.match(/<a href="([^"]+)" class="([^"]+)"([^>]*)>/);

    expect(link?.[1]).toBe(chat.page);
    expect(link?.[2]).toContain('withoutScript');
    expect(link?.[3]).toContain('target="_blank"');
    expect(link?.[3]).toContain(`aria-label="Ask my AI Digital Twin, ${chat.newTab}"`);
    expect(css).toMatch(/@media \(scripting: none\) \{\s*\.withoutScript \{\s*display: inline-flex;\s*\}\s*\.withScript \{\s*display: none;/);
  });

  it('opens the panel by a launcher named for what it does, disabled until script has taken over', () => {
    const button = html.match(/<button type="button" class="[^"]*withScript[^"]*"([^>]*)>/)?.[1] ?? '';

    expect(button).toContain('aria-label="Ask my AI Digital Twin"');
    expect(button).toContain('aria-expanded="false"');
    expect(button).toContain(`aria-controls="${chat.id}"`);
    expect(button).toContain('disabled=""');
  });

  it('is a dialog named by its heading, which says how the service is', () => {
    const dialog = html.match(/<dialog id="([^"]+)" class="[^"]+" aria-labelledby="([^"]+)">/);

    expect(dialog?.[1]).toBe(chat.id);
    expect(html).toContain(`<h2 id="${dialog?.[2]}"`);
    expect(text(html)).toContain(`${chat.heading}${chat.status.warming}`);
    expect(html).toMatch(/<button type="button" class="[^"]*close[^"]*" aria-label="Close the chat">/);
  });

  it('offers no way to clear the chat until there is a message to clear', () => {
    expect(text(html)).not.toContain(chat.clear);
  });

  it('scrolls the conversation in a named region a keyboard can reach', () => {
    expect(html).toMatch(/<div class="[^"]*log[^"]*" role="region" aria-label="Conversation" tabindex="0">/);
  });

  it('takes a question of up to 2,000 characters, in a field named by a label', () => {
    const field = html.match(/<textarea id="([^"]+)"([^>]*)>/);

    expect(html).toContain(`<label for="${field?.[1]}" class="`);
    expect(field?.[2]).toContain('maxLength="2000"');
    expect(field?.[2]).toContain(`placeholder="${chat.placeholder}"`);
    expect(html).toMatch(/<button type="submit" class="[^"]*send[^"]*" aria-label="Send" aria-disabled="true" disabled="">/);
  });

  it('has a polite live region, empty until something is said', () => {
    expect(html).toMatch(/<div class="[^"]*hidden[^"]*" aria-live="polite"><\/div>/);
  });

  it('never prints, so the printed CV is unchanged', () => {
    expect(css).toMatch(/@media print \{\s*\.chat \{\s*display: none;\s*\}\s*\}/);
  });

  it('stands at the window’s corner as a circle, and as a pill and a card from the wide breakpoint', () => {
    expect(css).toMatch(/\.launcher \{[^}]*position: fixed;[^}]*inline-size: var\(--chat-launcher-size\);/);
    expect(css).toMatch(/@media \(min-width: 48em\) \{[\s\S]*\.panel \{\s*inset: auto var\(--space-large\) var\(--space-large\) auto;\s*inline-size: var\(--chat-panel-width\);\s*block-size: var\(--chat-panel-height\);/);
  });

  it('moves only where the reader has not asked for less motion', () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: no-preference\) \{\s*\.panel\[open\] \{\s*animation:/);
    expect(css).not.toMatch(/^\.panel\[open\] \{[^}]*animation/m);
  });
});

describe('Conversation', () => {
  it('opens with the welcome, the four suggestions and the note on where messages go', () => {
    const shown = text(conversation(initial));

    expect(shown).toContain(chat.welcome);
    expect(shown).toContain(chat.tryAsking);
    for (const suggestion of chat.suggestions) expect(shown).toContain(suggestion);
    expect(shown.indexOf(chat.note)).toBeGreaterThan(shown.indexOf(chat.suggestions.at(-1)!));
  });

  it('says only to assistive technology who wrote each message', () => {
    const html = conversation(after({ type: 'warmed' }, { type: 'ask', question: 'Hello?' }, { type: 'answered', reply: 'Hi.' }));

    expect(html).toMatch(/<span class="[^"]*hidden[^"]*">You: <\/span><p>Hello\?<\/p>/);
    expect(html).toMatch(/<span class="[^"]*hidden[^"]*">Digital Twin: <\/span><p>Hi\.<\/p>/);
  });

  it('drops the suggestions once a question is sent, and keeps the welcome and the note', () => {
    const shown = text(conversation(after({ type: 'ask', question: 'Hello?' })));

    expect(shown).not.toContain(chat.tryAsking);
    expect(shown).toContain(chat.welcome);
    expect(shown).toContain(chat.note);
  });

  it('says a held question waits for the service to start', () => {
    expect(text(conversation(after({ type: 'ask', question: 'Hello?' })))).toContain(chat.held);
  });

  it('says an answer is being written', () => {
    expect(text(conversation(after({ type: 'warmed' }, { type: 'ask', question: 'Hello?' })))).toContain(chat.writing);
  });

  it('shows the reader’s words exactly as typed, and the answer’s Markdown as elements', () => {
    const html = conversation(
      after({ type: 'warmed' }, { type: 'ask', question: '<b>*hi*</b>' }, { type: 'answered', reply: '**Yes**\n\n- one\n- two' }),
    );

    expect(html).toContain('<p>&lt;b&gt;*hi*&lt;/b&gt;</p>');
    expect(html).toContain('<p><strong>Yes</strong></p><ul><li>one</li><li>two</li></ul>');
  });

  it('asks the reader to wait after a 429, with no way to send at once', () => {
    const html = conversation(after({ type: 'warmed' }, { type: 'ask', question: 'Hello?' }, { type: 'rate-limited' }));

    expect(text(html)).toContain(chat.rateLimited);
    expect(text(html)).not.toContain(chat.tryAgain);
  });

  it('offers to try again, and the chatbot’s own page in a new tab, when it can’t answer', () => {
    const html = conversation(after({ type: 'gave-up' }));

    expect(text(html)).toContain(chat.unavailable);
    expect(html).toMatch(/<button type="button" class="[^"]*primary[^"]*">Try again<\/button>/);
    expect(html).toContain(
      `<a href="${chat.page}" class="${html.match(/<a href="[^"]+" class="([^"]+)"/)?.[1]}" target="_blank" rel="noopener" aria-label="Ask it on its own page, ${chat.newTab}">`,
    );
  });

  it('disables the suggestions until script has taken over', () => {
    const html = renderToStaticMarkup(
      <Conversation chat={chat} state={initial} mounted={false} ask={() => {}} retry={() => {}} />,
    );

    expect(html.match(/disabled=""/g)).toHaveLength(chat.suggestions.length);
  });
});

describe('what the live region says', () => {
  it('says nothing at first', () => {
    expect(spoken(initial, chat)).toBeNull();
  });

  it('says an answer as text alone', () => {
    const state = after({ type: 'warmed' }, { type: 'ask', question: 'Hello?' }, { type: 'answered', reply: '**Hi**, [me](https://example.com).' });

    expect(spoken(state, chat)).toBe('Hi, me.');
  });

  it('says the words each notice shows', () => {
    expect(spoken(after({ type: 'ask', question: 'Hello?' }), chat)).toBe(chat.held);
    expect(spoken(after({ type: 'rate-limited' }), chat)).toBe(chat.rateLimited);
    expect(spoken(after({ type: 'failed' }), chat)).toBe(chat.unavailable);
  });

  it('says the chat is cleared', () => {
    expect(spoken(after({ type: 'clear' }), chat)).toBe(chat.cleared);
  });
});

describe('the chat’s content', () => {
  it('leads to the chatbot’s page the Digital Twin’s record names', () => {
    const twin = projects.projects.find(({ slug }) => slug === 'digital-twin')!;

    expect(twin.links.map(({ href }) => href)).toContain(chat.page);
  });

  it('calls the one API, over https, with the limit it accepts', () => {
    expect(chat.api).toBe('https://career-conversation-chatbot.onrender.com');
    expect(chat.maxLength).toBe(2000);
    expect(chat.countFrom).toBeLessThan(chat.maxLength);
  });

  it('suggests the bot’s own four questions', () => {
    expect(chat.suggestions).toHaveLength(4);
  });
});
