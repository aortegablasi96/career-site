'use client';

import { useEffect, useRef } from 'react';
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
 */
export function glide(
  start: (update: () => void) => { finished: Promise<unknown> },
  from: Named,
  to: Named,
  change: () => void,
): void {
  from.style.viewTransitionName = movingName;

  const transition = start(() => {
    from.style.viewTransitionName = '';
    change();
    to.style.viewTransitionName = movingName;
  });

  void transition.finished.finally(() => {
    to.style.viewTransitionName = '';
  });
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
}) {
  const framed = useRef<HTMLImageElement>(null);
  const larger = useRef<HTMLImageElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const box = dialog.current;
    const small = framed.current;
    const large = larger.current;

    if (!box || !small || !large) {
      return;
    }

    const start = (update: () => void) => document.startViewTransition(update);

    // A button's command reaches the dialog first as a cancelable event, so the dialog can be
    // opened or closed inside a transition rather than at once.
    function onCommand(event: Event) {
      const { command } = event as Event & { command?: string };

      if ((command !== 'show-modal' && command !== 'close') || !moves(document, matchMedia)) {
        return;
      }

      event.preventDefault();
      if (command === 'show-modal') {
        glide(start, small!, large!, () => box!.showModal());
      } else {
        glide(start, large!, small!, () => box!.close());
      }
    }

    // Escape asks the dialog to cancel. Where the browser lets the page decline that, it closes
    // inside a transition instead; where it does not, it closes at once.
    function onCancel(event: Event) {
      if (!event.cancelable || !moves(document, matchMedia)) {
        return;
      }

      event.preventDefault();
      glide(start, large!, small!, () => box!.close());
    }

    box.addEventListener('command', onCommand);
    box.addEventListener('cancel', onCancel);

    return () => {
      box.removeEventListener('command', onCommand);
      box.removeEventListener('cancel', onCancel);
    };
  }, []);

  return (
    <>
      <div className={styles.frame}>
        <img ref={framed} className={className} src={asset(media.file)} alt={media.alt} />
        <button
          type="button"
          className={styles.enlarge}
          commandfor={id}
          command="show-modal"
          aria-label={enlarge}
        >
          <Icon name="enlarge" />
        </button>
      </div>
      <dialog ref={dialog} id={id} className={styles.larger} aria-labelledby={`${id}-caption`}>
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
        <p id={`${id}-caption`} className={styles.caption}>
          {caption}
        </p>
      </dialog>
    </>
  );
}
