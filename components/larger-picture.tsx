'use client';

import { useEffect, useRef, type KeyboardEvent } from 'react';
import { asset } from '@/app/asset';
import type { Image } from '@/content/types';
import { Icon } from './icon';
import styles from './larger-picture.module.css';

/** The one name the picture carries while it moves, per DDR-082; only one element has it at a time. */
export const movingName = 'larger-picture';

/** The part of an element this component writes while the picture moves. */
interface Named {
  style: { viewTransitionName: string };
}

/** Which way the picture moves: out of its frame, or back into it. */
export type Direction = 'opening' | 'closing';

/** The part of the root this component writes while the picture moves. */
interface Root {
  dataset: { moving?: string };
}

/**
 * Whether the picture moves between the frame and the window, per DDR-082: only where the browser
 * can draw a view transition and the reader has not asked for less motion. Elsewhere the dialog
 * opens and closes at once, as it does without script.
 */
export function moves(
  document: { startViewTransition?: unknown },
  matchMedia: (query: string) => { matches: boolean },
): boolean {
  return (
    typeof document.startViewTransition === 'function' &&
    !matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Moves the picture from one element to the other while `change` opens or closes the dialog, per
 * DDR-082: the element it leaves carries the moving name as the browser captures the view before,
 * and the element it arrives at carries it as the browser captures the view after, so the browser
 * draws one picture growing out of the frame, or shrinking back into it. Neither carries the name
 * once the move is over, so the next one starts clean.
 *
 * The root says which way the picture is moving, so the stylesheet can draw only the whole
 * picture's capture and never the frame's, which is already cropped: the two crossfading, the
 * frame's zoomed to cover the box, drew a second, larger picture behind the first (#248).
 */
export function glide(
  start: (update: () => void) => { finished: Promise<unknown> },
  from: Named,
  to: Named,
  change: () => void,
  root: Root,
  direction: Direction,
): void {
  root.dataset.moving = direction;
  from.style.viewTransitionName = movingName;

  const transition = start(() => {
    from.style.viewTransitionName = '';
    change();
    to.style.viewTransitionName = movingName;
  });

  void transition.finished.finally(() => {
    to.style.viewTransitionName = '';
    delete root.dataset.moving;
  });
}

/**
 * The page's own command a gallery's step control gives the neighbour's larger picture, per
 * ADR-019: show yourself in place of the picture I am on.
 */
export const swapCommand = '--show-in-place';

/**
 * Shows another picture of the gallery larger in place of this one, per DDR-083 and ADR-019: this
 * dialog closes, the other picture's radio is checked, so the frame shows it and its thumbnail is
 * the chosen one, and its dialog opens. Its opening control is focused before it opens, so closing
 * it returns focus there, to the control on the picture the frame now shows, as the browser returns
 * it when that control opens the dialog itself. Last, focus goes to the control in the new dialog
 * that stands where focus was in this one, so a reader who pressed "Next" can press it again.
 */
export function swap(
  from: { close: () => void; querySelectorAll: (selector: 'button') => ArrayLike<unknown> },
  choice: { checked: boolean },
  opener: { focus: (options: { preventScroll: boolean }) => void },
  to: { showModal: () => void; querySelectorAll: (selector: 'button') => ArrayLike<{ focus: () => void }> },
  focused: unknown,
): void {
  const place = Array.prototype.indexOf.call(from.querySelectorAll('button'), focused);

  from.close();
  choice.checked = true;
  opener.focus({ preventScroll: true });
  to.showModal();
  if (place >= 0) {
    to.querySelectorAll('button')[place]?.focus();
  }
}

/** The steps between a gallery's pictures, per DDR-083, which a lone picture does not have. */
export interface Steps {
  /** The identifier of this picture's radio, which chooses it for the frame. */
  choice: string;
  /** The larger pictures before and after this one. */
  previous: string;
  next: string;
  /** Where the picture stands among the gallery's: "3 of 7". */
  position: string;
  /** The two controls' accessible names. */
  previousName: string;
  nextName: string;
}

/**
 * The picture in a project view's lead frame, and the same picture larger, per DDR-082 and ADR-018.
 *
 * Over the picture's corner is a round control with two arrows pointing out, which opens the
 * picture larger, and the whole picture is its target. Larger, the picture is shown whole, over the
 * view blurred behind a dark veil, with its caption under it and a control that closes it above
 * it; the whole ground around the picture is that control's target too.
 *
 * The larger picture is a native modal `dialog`, opened and closed by the buttons' `command`, so
 * the browser holds whether it is open, keeps keyboard focus inside it and leaves the view behind
 * inert while it is, closes it with Escape, and returns focus to the control that opened it. All of
 * that works without script and before hydration, per ADR-018.
 *
 * What this component adds, and the reason it is the site's third Client Component, per ADR-018,
 * is the movement: where the
 * browser can draw a view transition and the reader has not asked for less motion, it takes the
 * dialog's own command and Escape, and opens or closes the dialog inside a view transition, so the
 * picture grows out of its frame and shrinks back into it. Without script, or where it cannot, the
 * browser's own behaviour stands and the picture appears and goes at once.
 *
 * In a gallery it also steps between the pictures, per DDR-083 and ADR-019: under the picture, the
 * caption stands between a control that shows the picture before and one that shows the picture
 * after, with where it stands among them below it, and the arrow keys step too. Stepping closes
 * this dialog and opens the neighbour's, and chooses its picture for the frame, so the reader closes
 * on the frame showing the last picture they saw. Each control points at its neighbour's dialog, as
 * the others point at theirs, with a command of the page's own, and the neighbour shows itself.
 * Moving from one dialog to another is two commands, which no button's markup can give, so without
 * script the two controls are not drawn, and each picture opens and closes as it does alone.
 *
 * It is the file the frame already shows, so opening it fetches nothing. The frame's picture is
 * drawn as `Media` draws a picture, with the class the view gives it.
 */
export function LargerPicture({
  media,
  caption,
  id,
  enlarge,
  close,
  className,
  steps,
}: {
  media: Image;
  caption: string;
  /** The larger picture's identifier, unique within the view. */
  id: string;
  /** The two controls' accessible names. */
  enlarge: string;
  close: string;
  /** The frame picture's class, from the view, which also draws a gallery radio's focus on it. */
  className: string;
  /** In a gallery, the pictures before and after this one, per DDR-083. A lone picture has none. */
  steps?: Steps;
}) {
  const framed = useRef<HTMLImageElement>(null);
  const larger = useRef<HTMLImageElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const opener = useRef<HTMLButtonElement>(null);
  const before = useRef<HTMLButtonElement>(null);
  const after = useRef<HTMLButtonElement>(null);
  const choice = steps?.choice;

  // The arrow keys step too, as they step between the gallery's radios, per DDR-083, by pressing
  // the control that steps that way.
  function onKeyDown(event: KeyboardEvent) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    const control =
      event.key === 'ArrowLeft' ? before.current : event.key === 'ArrowRight' ? after.current : null;

    if (control) {
      event.preventDefault();
      control.click();
    }
  }

  useEffect(() => {
    const box = dialog.current;
    const small = framed.current;
    const large = larger.current;
    const control = opener.current;

    if (!box || !small || !large || !control) {
      return;
    }

    const start = (update: () => void) => document.startViewTransition(update);
    const root = document.documentElement;

    // A button's command reaches the dialog first as a cancelable event, so the dialog can be
    // opened or closed inside a transition rather than at once.
    function onCommand(event: Event) {
      const { command, source } = event as Event & { command?: string; source?: Element | null };

      // A neighbour's step control asks this picture to show itself in place of the neighbour's,
      // per DDR-083: where motion is welcome, the one fades into the other inside a view
      // transition, and elsewhere it changes at once.
      if (command === swapCommand) {
        const from = source?.closest('dialog');
        const radio = choice && document.getElementById(choice);

        if (from && radio instanceof HTMLInputElement) {
          const focused = document.activeElement;
          const change = () => swap(from, radio, control!, box!, focused);

          if (moves(document, matchMedia)) {
            start(change);
          } else {
            change();
          }
        }
        return;
      }

      if ((command !== 'show-modal' && command !== 'close') || !moves(document, matchMedia)) {
        return;
      }

      event.preventDefault();
      if (command === 'show-modal') {
        glide(start, small!, large!, () => box!.showModal(), root, 'opening');
      } else {
        glide(start, large!, small!, () => box!.close(), root, 'closing');
      }
    }

    // Escape asks the dialog to cancel. Where the browser lets the page decline that, it closes
    // inside a transition instead; where it does not, it closes at once.
    function onCancel(event: Event) {
      if (!event.cancelable || !moves(document, matchMedia)) {
        return;
      }

      event.preventDefault();
      glide(start, large!, small!, () => box!.close(), root, 'closing');
    }

    box.addEventListener('command', onCommand);
    box.addEventListener('cancel', onCancel);

    return () => {
      box.removeEventListener('command', onCommand);
      box.removeEventListener('cancel', onCancel);
    };
  }, [choice]);

  return (
    <>
      <div className={styles.frame}>
        <img ref={framed} className={className} src={asset(media.file)} alt={media.alt} />
        <button
          ref={opener}
          type="button"
          className={styles.enlarge}
          commandfor={id}
          command="show-modal"
          aria-label={enlarge}
        >
          <Icon name="enlarge" />
        </button>
      </div>
      <dialog
        ref={dialog}
        id={id}
        className={styles.larger}
        aria-labelledby={steps ? `${id}-caption ${id}-position` : `${id}-caption`}
        onKeyDown={steps ? onKeyDown : undefined}
      >
        <button
          type="button"
          className={styles.close}
          commandfor={id}
          command="close"
          aria-label={close}
        >
          <Icon name="close" />
        </button>
        <img ref={larger} className={styles.picture} src={asset(media.file)} alt={media.alt} />
        {steps ? (
          <div className={styles.foot}>
            <button
              ref={before}
              type="button"
              className={styles.step}
              commandfor={steps.previous}
              command={swapCommand}
              aria-label={steps.previousName}
            >
              <Icon name="back" />
            </button>
            <div className={styles.words}>
              <p id={`${id}-caption`} className={styles.caption}>
                {caption}
              </p>
              <p id={`${id}-position`} className={styles.caption}>
                {steps.position}
              </p>
            </div>
            <button
              ref={after}
              type="button"
              className={styles.step}
              commandfor={steps.next}
              command={swapCommand}
              aria-label={steps.nextName}
            >
              <Icon name="forward" />
            </button>
          </div>
        ) : (
          <p id={`${id}-caption`} className={styles.caption}>
            {caption}
          </p>
        )}
      </dialog>
    </>
  );
}
