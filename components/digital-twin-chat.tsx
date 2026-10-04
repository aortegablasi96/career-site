'use client';

import {
  useEffect,
  useEffectEvent,
  useId,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { flushSync } from 'react-dom';
import type { Chat } from '@/content/types';
import { Icon } from './icon';
import { openChatCommand } from './open-chat';
import { plain, Reply } from './reply';
import styles from './digital-twin-chat.module.css';

/** How the chatbot's service is, which the status at the header's right says. */
export type Service = 'warming' | 'ready' | 'unavailable';

/** One message of the conversation: the reader's, or the Digital Twin's answer. */
export interface Message {
  from: 'reader' | 'twin';
  text: string;
}

/** What the live region says, per DDR-100, and a count that changes each time it says it. */
export interface Said {
  what: 'answer' | 'held' | 'rate-limited' | 'unavailable' | 'cut-off' | 'cleared';
  serial: number;
}

/** The conversation and where it stands, per ADR-028's states and ADR-030's. */
export interface ChatState {
  service: Service;
  /** Whether the API has answered `/warmup` or a question since it last asked to wait. */
  warm: boolean;
  messages: readonly Message[];
  /** A question on its way: held until the service is ready, or being answered. */
  waiting: 'held' | 'writing' | null;
  /** What has arrived of an answer still arriving, or of one cut off partway (ADR-030). */
  partial: string | null;
  /** What takes the answer's place when there is none, or follows what arrived of it. */
  notice: 'rate-limited' | 'unavailable' | 'cut-off' | null;
  /** The question on its way, or kept to send again after a notice. */
  question: string | null;
  said: Said | null;
}

/** What happens to the conversation: the reader's doing, or the API's answer. */
export type ChatEvent =
  | { type: 'ask'; question: string }
  | { type: 'retry' }
  | { type: 'warmed' }
  | { type: 'warming' }
  | { type: 'gave-up' }
  | { type: 'piece'; text: string }
  | { type: 'answered'; reply: string }
  | { type: 'rate-limited' }
  | { type: 'failed' }
  | { type: 'clear' };

/** Before anything is sent: the page has loaded, and the chat warms the API at once (ADR-028). */
export const initial: ChatState = {
  service: 'warming',
  warm: false,
  messages: [],
  waiting: null,
  partial: null,
  notice: null,
  question: null,
  said: null,
};

function say(state: ChatState, what: Said['what']): Said {
  return { what, serial: (state.said?.serial ?? 0) + 1 };
}

/**
 * Which state follows which event, per ADR-028 and DDR-100.
 *
 * A question sent before the API is warm is held and counts as sent, so the reader never sends it
 * twice. A 503 holds the question in flight again. A 429 keeps the question, which the field takes
 * back. A failure keeps it too, so "Try again" can send it. Clearing empties the conversation, and
 * drops any question on its way, so the chat is as it was before the first one, with the service as
 * it stands. The live region says each answer, the line a held question shows, each notice and the
 * clearing, once each: only the event that changes them says them.
 *
 * An answer grows piece by piece and is said once, complete, per ADR-030 and DDR-103. A failure
 * after some of it has arrived cuts it off: what arrived stays, with its notice below it. "Try
 * again" puts a new answer in its place, and a new question keeps it in the conversation.
 */
export function next(state: ChatState, event: ChatEvent): ChatState {
  switch (event.type) {
    case 'ask':
      return {
        ...state,
        messages: [
          ...state.messages,
          ...(state.partial === null ? [] : [{ from: 'twin', text: state.partial } as const]),
          { from: 'reader', text: event.question },
        ],
        waiting: state.warm ? 'writing' : 'held',
        partial: null,
        notice: null,
        question: event.question,
        said: state.warm ? state.said : say(state, 'held'),
      };
    case 'retry':
      if (state.question === null) {
        return { ...state, service: 'warming', notice: null };
      }

      return {
        ...state,
        service: state.warm ? 'ready' : 'warming',
        waiting: state.warm ? 'writing' : 'held',
        partial: null,
        notice: null,
        said: state.warm ? state.said : say(state, 'held'),
      };
    case 'piece':
      return {
        ...state,
        service: 'ready',
        warm: true,
        partial: (state.partial ?? '') + event.text,
      };
    case 'warmed':
      return {
        ...state,
        service: 'ready',
        warm: true,
        waiting: state.waiting === 'held' ? 'writing' : state.waiting,
      };
    case 'warming':
      return {
        ...state,
        service: 'warming',
        warm: false,
        waiting: state.waiting && 'held',
        said: state.waiting === 'writing' ? say(state, 'held') : state.said,
      };
    case 'gave-up':
      return {
        ...state,
        service: 'unavailable',
        warm: false,
        waiting: null,
        notice: 'unavailable',
        said: say(state, 'unavailable'),
      };
    case 'answered':
      return {
        ...state,
        service: 'ready',
        warm: true,
        messages: [...state.messages, { from: 'twin', text: event.reply }],
        waiting: null,
        partial: null,
        notice: null,
        question: null,
        said: say(state, 'answer'),
      };
    case 'rate-limited':
      return {
        ...state,
        service: 'ready',
        warm: true,
        waiting: null,
        notice: 'rate-limited',
        said: say(state, 'rate-limited'),
      };
    case 'failed': {
      const notice = state.partial === null ? 'unavailable' : 'cut-off';

      return {
        ...state,
        service: 'unavailable',
        waiting: null,
        notice,
        said: say(state, notice),
      };
    }
    case 'clear':
      return {
        ...state,
        messages: [],
        waiting: null,
        partial: null,
        notice: null,
        question: null,
        said: say(state, 'cleared'),
      };
  }
}

/** How long warming tries, from its first request, before the chat is unavailable (ADR-028). */
export const warmingLimit = 120_000;

/** How long a question waits for its answer's first piece before it is given up (ADR-030). */
export const answerLimit = 60_000;

/** How long an answer that has begun waits for its next piece before it is cut off (ADR-030). */
export const pieceLimit = 20_000;

/**
 * How long the chat goes without hearing from the API before it treats the service as possibly
 * asleep, per ADR-029: 10 minutes, under the 15 idle minutes after which Render's free plan sleeps.
 */
export const quietLimit = 600_000;

/** Whether the API may have gone to sleep since the chat last heard from it, at `now` (ADR-029). */
export function asleep(warm: boolean, heard: number, now: number): boolean {
  return warm && now - heard >= quietLimit;
}

/**
 * Whether an event is the API's own response, an answer, a 503 or a 429, which shows the service is
 * awake (ADR-029). A failure, a refused origin or a time-out isn't.
 */
export function heardFrom(event: ChatEvent): boolean {
  return (
    event.type === 'warmed' ||
    event.type === 'piece' ||
    event.type === 'answered' ||
    event.type === 'warming' ||
    event.type === 'rate-limited'
  );
}

/** How long warming waits before its next try: 3 seconds, then twice as long each time (ADR-028). */
export function retryDelay(attempt: number): number {
  return 3000 * 2 ** attempt;
}

/** How long a 503 asks the chat to wait, in milliseconds: its `Retry-After`, or 10 seconds. */
export function retryAfter(header: string | null): number {
  const seconds = Number(header);

  return (header !== null && header.trim() !== '' && Number.isFinite(seconds) && seconds >= 0 ? seconds : 10) * 1000;
}

/**
 * What the API's response to a question means before its stream is read, per ADR-028's table and
 * ADR-030's: nothing yet for a 200, whose stream holds the answer.
 */
export function opened(status: number): ChatEvent | null {
  if (status === 200) {
    return null;
  } else if (status === 503) {
    return { type: 'warming' };
  } else if (status === 429) {
    return { type: 'rate-limited' };
  }

  return { type: 'failed' };
}

/** One frame of the API's stream (ADR-030): a piece of the answer, the whole of it, or a failure. */
export type Frame = { type: 'token'; content: string } | { type: 'done'; content: string } | { type: 'error' };

function isFrame(value: unknown): value is Frame {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const { type, content } = value as { type?: unknown; content?: unknown };

  return type === 'error' || ((type === 'token' || type === 'done') && typeof content === 'string');
}

/**
 * The frames that have arrived whole in `text`, and the start of one still arriving, per ADR-030.
 * A frame is its `data:` lines, holding JSON, and ends at a blank line. A comment, any other field,
 * and JSON that isn't a frame the API sends are skipped.
 */
export function frames(text: string): { frames: Frame[]; rest: string } {
  const parts = text.split(/\r?\n\r?\n/);
  const rest = parts.pop() ?? '';
  const read: Frame[] = [];

  for (const part of parts) {
    const data = part
      .split(/\r?\n/)
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).replace(/^ /, ''))
      .join('\n');

    try {
      const frame: unknown = JSON.parse(data);

      if (isFrame(frame)) {
        read.push(frame);
      }
    } catch {
      // Not JSON, or no data at all: skipped, as a stream reader skips what it doesn't know.
    }
  }

  return { frames: read, rest };
}

/** The count below the field, from `countFrom` characters, as "1,850 / 2,000" (DDR-100). */
export function count(length: number, { countFrom, maxLength }: Pick<Chat, 'countFrom' | 'maxLength'>): string | null {
  return length < countFrom ? null : `${length.toLocaleString('en')} / ${maxLength.toLocaleString('en')}`;
}

const sleep = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

/**
 * One request to `/warmup`, given up after `limit` milliseconds, with its status. It carries no
 * credentials (ADR-028). A request the network or the API's CORS policy refuses throws, as one that
 * runs out of time does.
 */
async function post(api: string, path: string, limit: number): Promise<number> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), limit);

  try {
    const response = await fetch(`${api}${path}`, { method: 'POST', credentials: 'omit', signal: controller.signal });

    return response.status;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Warms the API, per ADR-028: `POST /warmup`, tried again 3 seconds after a failure and twice as
 * long each time after, until it answers or two minutes have passed since the first request. A
 * sleeping instance holds the request open while it starts, so a request is given up only when the
 * two minutes are. Resolves to whether it answered, having said which.
 */
export async function warmUp(api: string, dispatch: (event: ChatEvent) => void): Promise<boolean> {
  const started = Date.now();

  for (let attempt = 0; ; attempt++) {
    try {
      const status = await post(api, '/warmup', warmingLimit - (Date.now() - started));

      if (status >= 200 && status < 300) {
        dispatch({ type: 'warmed' });
        return true;
      }
    } catch {
      // A failure is tried again below, as an error status is.
    }

    const wait = retryDelay(attempt);

    if (Date.now() - started + wait >= warmingLimit) {
      dispatch({ type: 'gave-up' });
      return false;
    }

    await sleep(wait);
  }
}

/**
 * One question to `POST /chat/stream`, read as it arrives, per ADR-030. Says the pieces that arrive
 * in each read as one, then the answer, or a failure: an `error` frame, a stream that ends without
 * `done`, no first piece within a minute, or 20 seconds without the next. A time-out aborts the
 * request, so the API stops writing. Nothing is said once `signal` has aborted it. Resolves to how
 * long a 503 asks the chat to wait before sending the question again, or to null.
 */
async function stream(
  api: string,
  user: string,
  question: string,
  dispatch: (event: ChatEvent) => void,
  signal: AbortSignal | undefined,
): Promise<number | null> {
  const controller = new AbortController();
  const stop = () => controller.abort();
  const say = (event: ChatEvent) => {
    if (!signal?.aborted) {
      dispatch(event);
    }
  };
  let timer = setTimeout(stop, answerLimit);

  signal?.addEventListener('abort', stop);

  try {
    const response = await fetch(`${api}/chat/stream`, {
      method: 'POST',
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user, message: question }),
      signal: controller.signal,
    });
    const refused = opened(response.status);

    if (refused?.type === 'warming') {
      return retryAfter(response.headers.get('Retry-After'));
    } else if (refused) {
      say(refused);
      return null;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let rest = '';

    // Aborting a request ends its body too, wherever the body comes from.
    controller.signal.addEventListener('abort', () => void reader?.cancel().catch(() => {}));

    for (;;) {
      const { done, value } = reader ? await reader.read() : { done: true, value: undefined };

      if (done) {
        break;
      }

      const read = frames(rest + decoder.decode(value, { stream: true }));
      const end = read.frames.find(({ type }) => type !== 'token');
      const text = read.frames.map((frame) => (frame.type === 'token' ? frame.content : '')).join('');

      rest = read.rest;

      if (end?.type === 'done') {
        say({ type: 'answered', reply: end.content });
        return null;
      } else if (text) {
        say({ type: 'piece', text });
        clearTimeout(timer);
        timer = setTimeout(stop, pieceLimit);
      }

      if (end) {
        break;
      }
    }
  } catch {
    // A failure, a refused origin or a time-out, said below as a stream that ended is.
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', stop);
  }

  say({ type: 'failed' });

  return null;
}

/**
 * Sends a question once the API is warm and says what came of it, per ADR-028 and ADR-030. A 503
 * waits its `Retry-After` and sends the question again, for two minutes at most. Nothing else is
 * retried: once the API has taken a question, the reader decides whether to send it again. Aborting
 * `signal`, as clearing the chat does, drops the rest of the answer and says nothing more.
 */
export async function deliver(
  api: string,
  user: string,
  question: string,
  warm: Promise<boolean>,
  dispatch: (event: ChatEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  if (!(await warm)) {
    return;
  }

  const started = Date.now();

  while (!signal?.aborted) {
    const wait = await stream(api, user, question, dispatch, signal);

    if (wait === null || signal?.aborted) {
      return;
    }

    if (Date.now() - started + wait >= warmingLimit) {
      dispatch({ type: 'gave-up' });
      return;
    }

    dispatch({ type: 'warming' });
    await sleep(wait);
  }
}

/**
 * The Digital Twin's mark, which stands before each of its turns, per DDR-102. It repeats who wrote
 * the turn, which its hidden sender already says, so assistive technology doesn't hear it.
 */
function TwinMark() {
  return (
    <span className={styles.mark}>
      <Icon name="bot" />
    </span>
  );
}

/**
 * What the conversation shows for a given state, per DDR-100, DDR-101 and DDR-102: the welcome, the
 * suggestions until a question is sent, the messages, and the line or the notice in the answer's
 * place. Each of the Digital Twin's turns has its mark beside its bubble. It holds nothing of its
 * own, so each state can be rendered as it stands.
 */
export function Conversation({
  chat,
  state: { messages, waiting, partial, notice },
  mounted,
  ask,
  retry,
}: {
  chat: Chat;
  state: ChatState;
  /** Whether script has taken over, before which no control sends anything (ADR-028). */
  mounted: boolean;
  ask: (question: string) => void;
  retry: () => void;
}) {
  return (
    <>
      <div className={styles.turn}>
        <TwinMark />
        <p className={`${styles.message} ${styles.twin}`}>
          <span className={styles.hidden}>{chat.sender.twin} </span>
          {chat.welcome}
        </p>
      </div>
      {messages.length === 0 && (
        <ul aria-label={chat.suggested} className={styles.suggestions}>
          {chat.suggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                className={styles.suggestion}
                disabled={!mounted}
                onClick={() => ask(suggestion)}
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}
      {messages.length > 0 && (
        <ol className={styles.messages}>
          {messages.map(({ from, text }, index) => (
            <li
              key={index}
              className={from === 'reader' ? `${styles.message} ${styles.reader}` : styles.turn}
              data-last={index === messages.length - 1 ? '' : undefined}
            >
              {from === 'reader' ? (
                <>
                  <span className={styles.hidden}>{chat.sender.reader} </span>
                  <p>{text}</p>
                </>
              ) : (
                <>
                  <TwinMark />
                  <div className={`${styles.message} ${styles.twin}`}>
                    <span className={styles.hidden}>{chat.sender.twin} </span>
                    <Reply text={text} newTab={chat.newTab} />
                  </div>
                </>
              )}
            </li>
          ))}
          {partial !== null && (
            <li className={styles.turn} data-growing="">
              <TwinMark />
              <div className={`${styles.message} ${styles.twin}`}>
                <span className={styles.hidden}>{chat.sender.twin} </span>
                <Reply text={partial} newTab={chat.newTab} />
              </div>
            </li>
          )}
        </ol>
      )}
      {waiting && partial === null && (
        <div className={styles.turn}>
          <TwinMark />
          <p className={`${styles.message} ${styles.twin} ${styles.pending}`}>
            <span className={styles.hidden}>{chat.sender.twin} </span>
            {waiting === 'held' ? chat.held : chat.writing}
          </p>
        </div>
      )}
      {notice && (
        <div className={styles.turn}>
          <TwinMark />
          <div className={`${styles.message} ${styles.twin} ${styles.pending}`}>
            <span className={styles.hidden}>{chat.sender.twin} </span>
            <p>{{ 'rate-limited': chat.rateLimited, unavailable: chat.unavailable, 'cut-off': chat.cutOff }[notice]}</p>
            {notice !== 'rate-limited' && (
              <ul className={styles.actions}>
                <li>
                  <button type="button" className={styles.primary} onClick={retry}>
                    {chat.tryAgain}
                  </button>
                </li>
                <li>
                  <a
                    href={chat.page}
                    className={styles.secondary}
                    target="_blank"
                    rel="noopener"
                    aria-label={`${chat.ownPage}, ${chat.newTab}`}
                  >
                    <Icon name="external" />
                    {chat.ownPage}
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/** What the live region says for a state, per DDR-100: an answer as text alone, or the words shown. */
export function spoken(state: ChatState, chat: Chat): string | null {
  if (!state.said) {
    return null;
  } else if (state.said.what === 'answer') {
    const answer = state.messages.findLast(({ from }) => from === 'twin');

    return answer ? plain(answer.text) : null;
  }

  return {
    held: chat.held,
    'rate-limited': chat.rateLimited,
    unavailable: chat.unavailable,
    'cut-off': chat.cutOff,
    cleared: chat.cleared,
  }[state.said.what];
}

/** Nothing changes once script runs, so there is nothing to subscribe to. */
const subscribe = () => () => {};

/**
 * The chat with the owner's Digital Twin, on every page, per DDR-100, DDR-102 and ADR-028: a
 * launcher at the window's bottom-right corner, and the panel it opens.
 *
 * The panel is a native `dialog`. From the wide breakpoint it opens above the launcher, beside the
 * page, which stays in use, and the launcher stays in view as its close control, after it in the
 * markup as it is below it on screen. Below the breakpoint it opens over the whole window, modal,
 * so focus cannot wander behind it, and a cross in its header closes it. Either way Escape closes
 * it, and focus goes back to whatever opened it: the launcher, or the invitation on the Digital
 * Twin's view, which opens it by a command of the page's own.
 *
 * As soon as it has mounted it warms the API, so a sleeping instance has the most time to wake
 * before the reader asks (ADR-028). After 10 minutes without hearing from the API it warms it
 * again, the next time the field takes focus or a question is sent (ADR-029). The conversation lives here alone: its id
 * is made when the first question is sent and nothing is stored, so it lasts until the page is
 * reloaded or left, or until the reader clears it, after which the next question starts another.
 *
 * Without script the launcher is a link to the chatbot's own page, and before the component has
 * mounted its controls are disabled, so nothing sends a question or reloads the page.
 */
export function DigitalTwinChat({ chat }: { chat: Chat }) {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [state, dispatch] = useReducer(next, initial);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [limitSaid, setLimitSaid] = useState(0);
  const panel = useRef<HTMLDialogElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const user = useRef<string | null>(null);
  const warmth = useRef<Promise<boolean> | null>(null);
  // Whether warming is under way, and when the API last answered anything (ADR-029).
  const warming = useRef(false);
  const heard = useRef(0);
  // The question on its way, to abort when the chat is cleared (ADR-030).
  const delivery = useRef<AbortController | null>(null);
  // Whether the conversation follows the answer, and where it last put it (DDR-103).
  const follow = useRef(true);
  const scrolled = useRef(0);
  const headingId = useId();
  const fieldId = useId();
  const countId = useId();

  /** Says what came of a request to the API, noting when the API itself answered (ADR-029). */
  function hear(event: ChatEvent) {
    if (heardFrom(event)) {
      heard.current = Date.now();
    }

    dispatch(event);
  }

  /** Warms the API, and forgets that it did if it gave up, so the next question warms it again. */
  function warm(): Promise<boolean> {
    warming.current = true;

    const ready = warmUp(chat.api, hear).then((answered) => {
      warming.current = false;

      if (!answered) {
        warmth.current = null;
      }

      return answered;
    });

    warmth.current = ready;

    return ready;
  }

  /**
   * Warms the API again if it may have gone to sleep since the chat last heard from it, per
   * ADR-029, so that a question sent meanwhile is held until it's ready, as on a first load. A
   * question already on its way has just been sent to a service heard from, so it's left alone.
   */
  function wake() {
    if (!state.waiting && !warming.current && asleep(state.warm, heard.current, Date.now())) {
      dispatch({ type: 'warming' });
      void warm();
    }
  }

  const warmOnce = useEffectEvent(() => {
    if (!warmth.current) {
      void warm();
    }
  });

  useEffect(() => {
    warmOnce();
  }, []);

  /**
   * Sends a question, and puts it back in the field if the API asks the reader to wait (429). What
   * comes of it once the reader has cleared its conversation is dropped, and clearing aborts it.
   * The conversation follows its answer until the reader scrolls (DDR-103).
   */
  function send(question: string) {
    const conversation = (user.current ??= crypto.randomUUID());
    const controller = new AbortController();

    delivery.current = controller;
    follow.current = true;

    void deliver(
      chat.api,
      conversation,
      question,
      warmth.current ?? warm(),
      (event) => {
        if (user.current !== conversation) {
          return;
        }

        hear(event);

        if (event.type === 'rate-limited') {
          setDraft((current) => current || question);
        }
      },
      controller.signal,
    );
  }

  function ask(question: string) {
    if (state.waiting || question.trim() === '') {
      return;
    }

    wake();
    dispatch({ type: 'ask', question });
    setDraft('');
    send(question);
  }

  function retry() {
    wake();
    dispatch({ type: 'retry' });

    if (state.question === null) {
      void warm();
    } else {
      send(state.question);
    }
  }

  // Clearing forgets the conversation's id, so the API keeps none of it for the next question, drops
  // the rest of an answer on its way, and takes the reader back to the welcome with focus in the field.
  function clear() {
    user.current = null;
    delivery.current?.abort();
    delivery.current = null;
    dispatch({ type: 'clear' });
    log.current?.scrollTo({ top: 0 });
    field.current?.focus();
  }

  function show(from: HTMLElement | null) {
    const box = panel.current;

    if (!box) {
      return;
    }

    opener.current = from;

    if (!box.open) {
      if (window.matchMedia('(min-width: 48em)').matches) {
        box.show();
      } else {
        box.showModal();
      }
    }

    setOpen(true);
    field.current?.focus();
  }

  // However the panel closes, the launcher takes back its words and focus returns to what opened it.
  function closed() {
    flushSync(() => setOpen(false));
    opener.current?.focus();
    opener.current = null;
  }

  // The invitation on the Digital Twin's view opens the panel by a command of the page's own.
  const onCommand = useEffectEvent((event: Event) => {
    const { command, source } = event as Event & { command?: string; source?: Element | null };

    if (command === openChatCommand) {
      show(source instanceof HTMLElement ? source : null);
    }
  });

  useEffect(() => {
    const box = panel.current;

    box?.addEventListener('command', onCommand);

    return () => box?.removeEventListener('command', onCommand);
  }, []);

  // A new message comes into view: the reader's question at the foot, and an answer from its first
  // line, or whole if it fits, smoothly unless the reader has asked for less motion. Once the reader
  // has scrolled during an answer, nothing moves until the next question (DDR-103).
  const last = state.messages.at(-1);

  useEffect(() => {
    const region = log.current;
    const item = region?.querySelector('[data-last]');

    if (!region || !(item instanceof HTMLElement) || !follow.current) {
      return;
    }

    const behavior = window.matchMedia('(prefers-reduced-motion: no-preference)').matches ? 'smooth' : 'auto';
    const top = region.scrollTop + item.getBoundingClientRect().top - region.getBoundingClientRect().top;
    const fits = item.offsetHeight <= region.clientHeight;

    region.scrollTo({
      top: last?.from === 'twin' && !fits ? top : region.scrollHeight,
      behavior,
    });
  }, [last, state.waiting, state.notice]);

  // While an answer grows, the conversation follows its end at once until its first line reaches the
  // top, which is DDR-100's rule at every moment of the answer (DDR-103).
  useEffect(() => {
    const region = log.current;
    const item = region?.querySelector('[data-growing]');

    if (!region || !(item instanceof HTMLElement) || !follow.current) {
      return;
    }

    const top = region.scrollTop + item.getBoundingClientRect().top - region.getBoundingClientRect().top;

    region.scrollTo({ top: Math.min(top, region.scrollHeight - region.clientHeight) });
    scrolled.current = region.scrollTop;
  }, [state.partial]);

  // The reader has scrolled away from where the answer was put, so it stops following (DDR-103).
  function scroll() {
    if (state.partial !== null && Math.abs((log.current?.scrollTop ?? 0) - scrolled.current) > 1) {
      follow.current = false;
    }
  }

  function change(event: ChangeEvent<HTMLTextAreaElement>) {
    const { value } = event.target;

    if (value.length >= chat.maxLength && draft.length < chat.maxLength) {
      setLimitSaid((said) => said + 1);
    }

    setDraft(value);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    ask(draft);
    field.current?.focus();
  }

  // Enter sends and Shift+Enter starts a new line, as the chatbot's own page does. A key that
  // composes a character, as an input method's Enter does, is left to it.
  function keyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      ask(draft);
    }
  }

  function escape(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape' && panel.current?.open) {
      event.preventDefault();
      panel.current.close();
    }
  }

  // The launcher opens the panel, and while the panel is open it closes it (DDR-102).
  function toggle(from: HTMLElement) {
    if (panel.current?.open) {
      panel.current.close();
    } else {
      show(from);
    }
  }

  const sendable = !state.waiting && draft.trim() !== '';
  const shown = count(draft.length, chat);
  const status = chat.status[state.service];
  const said = spoken(state, chat);

  return (
    <div className={styles.chat}>
      <dialog
        ref={panel}
        id={chat.id}
        className={styles.panel}
        aria-labelledby={headingId}
        onClose={closed}
        onKeyDown={escape}
      >
        <div className={styles.header}>
          <div className={styles.who}>
            <span className={styles.avatar}>
              <Icon name="bot" />
            </span>
            <div className={styles.title}>
              <h2 id={headingId} className={styles.heading}>
                {chat.heading}
              </h2>
              <p className={styles.subtitle}>{chat.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            className={styles.close}
            aria-label={chat.close}
            onClick={() => panel.current?.close()}
          >
            <Icon name="close" />
          </button>
          <div className={styles.tools}>
            <p className={styles.status} data-service={state.service}>
              <span className={styles.dot} />
              {status}
            </p>
            {state.messages.length > 0 && (
              <button type="button" className={styles.clear} onClick={clear}>
                {chat.clear}
              </button>
            )}
          </div>
        </div>
        {/* The conversation scrolls inside the panel, so it takes focus, for a keyboard to scroll
            it. It opens with the welcome and the suggestions until a question is sent. */}
        <div ref={log} className={styles.log} role="region"
          aria-label={chat.conversation}
          tabIndex={0}
          onScroll={scroll}
        >
          <Conversation chat={chat} state={state} mounted={mounted} ask={ask} retry={retry} />
        </div>
        <form className={styles.form} onSubmit={submit}>
          <label htmlFor={fieldId} className={styles.hidden}>
            {chat.field}
          </label>
          <div className={styles.row}>
            <textarea
              ref={field}
              id={fieldId}
              className={styles.field}
              rows={1}
              maxLength={chat.maxLength}
              placeholder={chat.placeholder}
              value={draft}
              onChange={change}
              onFocus={wake}
              onKeyDown={keyDown}
              aria-describedby={shown === null ? undefined : countId}
            />
            <button
              type="submit"
              className={styles.send}
              aria-label={chat.send}
              aria-disabled={!sendable}
              disabled={!mounted}
            >
              <Icon name="send" />
            </button>
          </div>
          {shown !== null && (
            <p id={countId} className={styles.count}>
              {shown}
              {draft.length >= chat.maxLength && ` ${chat.limit}`}
            </p>
          )}
        </form>
        {/* Says each answer, the line a held question shows, each notice and the length limit, once
            each, per DDR-100. Inside the panel, so that it is heard while the panel is modal. */}
        <div className={styles.hidden} aria-live="polite">
          {said && <p key={`said-${state.said!.serial}`}>{said}</p>}
          {limitSaid > 0 && <p key={`limit-${limitSaid}`}>{chat.limit}</p>}
        </div>
      </dialog>
      <a
        href={chat.page}
        className={`${styles.launcher} ${styles.withoutScript}`}
        target="_blank"
        rel="noopener"
        aria-label={`${chat.launcher}, ${chat.newTab}`}
      >
        <Icon name="bot" />
        <span className={styles.launcherText}>{chat.launcher}</span>
      </a>
      <button
        type="button"
        className={`${styles.launcher} ${styles.withScript}`}
        aria-label={open ? chat.close : chat.launcher}
        aria-expanded={open}
        aria-controls={chat.id}
        disabled={!mounted}
        onClick={(event) => toggle(event.currentTarget)}
        onKeyDown={escape}
      >
        {open ? (
          <Icon name="close" />
        ) : (
          <>
            <Icon name="bot" />
            <span className={styles.launcherText}>{chat.launcher}</span>
          </>
        )}
      </button>
    </div>
  );
}
