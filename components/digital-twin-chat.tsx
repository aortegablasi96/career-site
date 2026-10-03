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
  what: 'answer' | 'held' | 'rate-limited' | 'unavailable' | 'cleared';
  serial: number;
}

/** The conversation and where it stands, per ADR-028's states. */
export interface ChatState {
  service: Service;
  /** Whether the API has answered `/warmup` or a question since it last asked to wait. */
  warm: boolean;
  messages: readonly Message[];
  /** A question on its way: held until the service is ready, or being answered. */
  waiting: 'held' | 'writing' | null;
  /** What takes the answer's place when there is none. */
  notice: 'rate-limited' | 'unavailable' | null;
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
 */
export function next(state: ChatState, event: ChatEvent): ChatState {
  switch (event.type) {
    case 'ask':
      return {
        ...state,
        messages: [...state.messages, { from: 'reader', text: event.question }],
        waiting: state.warm ? 'writing' : 'held',
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
        notice: null,
        said: state.warm ? state.said : say(state, 'held'),
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
    case 'failed':
      return {
        ...state,
        service: 'unavailable',
        waiting: null,
        notice: 'unavailable',
        said: say(state, 'unavailable'),
      };
    case 'clear':
      return {
        ...state,
        messages: [],
        waiting: null,
        notice: null,
        question: null,
        said: say(state, 'cleared'),
      };
  }
}

/** How long warming tries, from its first request, before the chat is unavailable (ADR-028). */
export const warmingLimit = 120_000;

/** How long a question waits for its answer before it is given up (ADR-028). */
export const answerLimit = 60_000;

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
  return event.type === 'warmed' || event.type === 'answered' || event.type === 'warming' || event.type === 'rate-limited';
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

/** What the API's answer to a question means, per ADR-028's table. */
export function answer(status: number, body: unknown): ChatEvent {
  const reply = typeof body === 'object' && body !== null ? (body as { reply?: unknown }).reply : undefined;

  if (status === 200 && typeof reply === 'string') {
    return { type: 'answered', reply };
  } else if (status === 503) {
    return { type: 'warming' };
  } else if (status === 429) {
    return { type: 'rate-limited' };
  }

  return { type: 'failed' };
}

/** The count below the field, from `countFrom` characters, as "1,850 / 2,000" (DDR-100). */
export function count(length: number, { countFrom, maxLength }: Pick<Chat, 'countFrom' | 'maxLength'>): string | null {
  return length < countFrom ? null : `${length.toLocaleString('en')} / ${maxLength.toLocaleString('en')}`;
}

const sleep = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

/**
 * One request to the API, given up after `limit` milliseconds, with its status, its `Retry-After`
 * and its body where it succeeded. It carries no credentials (ADR-028). A request the network or the
 * API's CORS policy refuses throws, as one that runs out of time does.
 */
async function post(
  api: string,
  path: string,
  body: object | undefined,
  limit: number,
): Promise<{ status: number; retryAfter: string | null; data: unknown }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), limit);

  try {
    const response = await fetch(`${api}${path}`, {
      method: 'POST',
      credentials: 'omit',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    return {
      status: response.status,
      retryAfter: response.headers.get('Retry-After'),
      data: response.ok ? await response.json().catch(() => null) : null,
    };
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
      const { status } = await post(api, '/warmup', undefined, warmingLimit - (Date.now() - started));

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
 * Sends a question once the API is warm and says what came of it, per ADR-028. A 503 waits its
 * `Retry-After` and sends the question again, for two minutes at most. Nothing else is retried: a
 * question that ran out of time may have been answered into the conversation's memory.
 */
export async function deliver(
  api: string,
  user: string,
  question: string,
  warm: Promise<boolean>,
  dispatch: (event: ChatEvent) => void,
): Promise<void> {
  if (!(await warm)) {
    return;
  }

  const started = Date.now();

  for (;;) {
    let event: ChatEvent;
    let wait = 0;

    try {
      const response = await post(api, '/chat', { user_id: user, message: question }, answerLimit);

      event = answer(response.status, response.data);
      wait = retryAfter(response.retryAfter);
    } catch {
      event = { type: 'failed' };
    }

    if (event.type !== 'warming') {
      dispatch(event);
      return;
    }

    if (Date.now() - started + wait >= warmingLimit) {
      dispatch({ type: 'gave-up' });
      return;
    }

    dispatch(event);
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
  state: { messages, waiting, notice },
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
        </ol>
      )}
      {waiting && (
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
            <p>{notice === 'rate-limited' ? chat.rateLimited : chat.unavailable}</p>
            {notice === 'unavailable' && (
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
   * comes of it once the reader has cleared its conversation is dropped.
   */
  function send(question: string) {
    const conversation = (user.current ??= crypto.randomUUID());

    void deliver(chat.api, conversation, question, warmth.current ?? warm(), (event) => {
      if (user.current !== conversation) {
        return;
      }

      hear(event);

      if (event.type === 'rate-limited') {
        setDraft((current) => current || question);
      }
    });
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

  // Clearing forgets the conversation's id, so the API keeps none of it for the next question, and
  // takes the reader back to the welcome with focus in the field.
  function clear() {
    user.current = null;
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
  // line, or whole if it fits, smoothly unless the reader has asked for less motion.
  const last = state.messages.at(-1);

  useEffect(() => {
    const region = log.current;
    const item = region?.querySelector('[data-last]');

    if (!region || !(item instanceof HTMLElement)) {
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
        <div ref={log} className={styles.log} role="region" aria-label={chat.conversation} tabIndex={0}>
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
