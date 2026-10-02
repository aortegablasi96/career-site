'use client';

import { useEffect, useRef, type KeyboardEvent } from 'react';
import { asset } from '@/app/asset';
import type { ProjectMedia } from '@/content/types';
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

/** Which step control an arrow key presses, per DDR-083. */
export type Way = 'before' | 'after';

/**
 * The step an arrow key takes, per DDR-083: the left arrow the one before, the right arrow the one
 * after. A key held with a modifier is the browser's, and a key pressed on the video is the video's,
 * which moves through it with the arrows, per DDR-089.
 */
export function stepKey(event: {
  key: string;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  target: EventTarget | { localName?: string } | null;
}): Way | null {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
    return null;
  }
  if (event.target && 'localName' in event.target && event.target.localName === 'video') {
    return null;
  }

  return event.key === 'ArrowLeft' ? 'before' : event.key === 'ArrowRight' ? 'after' : null;
}

/**
 * Declines the browser's own menu on a video, which offers to save its file, per DDR-089 and
 * ADR-022. Without script the menu is offered, and Firefox always offers it with Shift held.
 */
export function withhold(event: { preventDefault: () => void }): void {
  event.preventDefault();
}

/**
 * Readies a video as its dialog opens, per DDR-092 and ADR-026: the browser fetches what it needs
 * to know the video's size and length, and no more. Chrome's and Edge's controls do nothing until
 * they know it, so before play a click would not play the video, a double click would not show it
 * at full screen, and their full screen control would be greyed out. Firefox learns it on the first
 * click itself. Without script the video stays at `preload="none"`, as ADR-004 decides.
 */
export function ready(video: { preload: string }): void {
  video.preload = 'metadata';
}

/** The steps between a gallery's pictures, per DDR-083, which a lone picture does not have. */
export interface Steps {
  /** The identifier of this picture's radio, which chooses it for the frame. */
  choice: string;
  /** The larger pictures before and after this one. */
  previous: string;
  next: string;
  /** Where the picture stands among the gallery's items: "3 of 7". */
  position: string;
  /** The two controls' accessible names. */
  previousName: string;
  nextName: string;
}

/**
 * The picture in a project view's lead frame, and the same picture larger, per DDR-082 and ADR-018.
 *
 * At the box's lower right corner is a round control with two arrows pointing out, which opens the
 * picture larger, and the whole box is its target, per DDR-088. Larger, the picture is shown whole, over the
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
 * after, with where it stands among them below it, and the arrow keys step too. From the wide
 * breakpoint the two controls stand at the window's left and right edges instead, level with the
 * picture's middle, per DDR-086; that is the stylesheet's doing, and the markup is one. Stepping closes
 * this dialog and opens the neighbour's, and chooses its picture for the frame, so the reader closes
 * on the frame showing the last picture they saw. Each control points at its neighbour's dialog, as
 * the others point at theirs, with a command of the page's own, and the neighbour shows itself.
 * Moving from one dialog to another is two commands, which no button's markup can give, so without
 * script the two controls are not drawn, and each picture opens and closes as it does alone.
 *
 * It is the file the frame already shows, so opening it fetches nothing.
 *
 * A video opens the same way, per DDR-089 and ADR-022: the frame shows its still, which is its
 * poster, and the dialog shows the video with the browser's controls, waiting for the reader to
 * play it. Opening it fetches the video's size and length, per DDR-092 and ADR-026, so the browser's
 * controls play it on a click and show it at full screen on a double click or from their own
 * control, before it has ever played; the rest of its file waits for play, per ADR-004. Closing the
 * dialog pauses it. Its controls offer no download in Chrome and Edge, nor a floating
 * picture-in-picture window, and the browser's menu on it, which offers to save it, is declined.
 * Without script the menu is offered, closing does not pause it, and nothing is fetched until play.
 *
 * Both pictures stand in the view's box, per DDR-088: the frame is the box, with the class the view
 * gives it, and the picture is as wide as it and centred in it; larger, the box is as large as the
 * room allows at its shape, and the picture is as wide as that. The view says what the box is. Each
 * picture carries its own size, so its place holds its shape before its file arrives.
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
  media: ProjectMedia;
  caption: string;
  /** The larger picture's identifier, unique within the view. */
  id: string;
  /** The two controls' accessible names. */
  enlarge: string;
  close: string;
  /** The frame's class, from the view: the box, which also draws a gallery radio's focus. */
  className: string;
  /** In a gallery, the pictures before and after this one, per DDR-083. A lone picture has none. */
  steps?: Steps;
}) {
  const framed = useRef<HTMLImageElement>(null);
  const larger = useRef<HTMLImageElement & HTMLVideoElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const opener = useRef<HTMLButtonElement>(null);
  const before = useRef<HTMLButtonElement>(null);
  const after = useRef<HTMLButtonElement>(null);
  const choice = steps?.choice;

  // The arrow keys step too, as they step between the gallery's radios, per DDR-083, by pressing
  // the control that steps that way.
  function onKeyDown(event: KeyboardEvent) {
    const way = stepKey(event);
    const control = way === 'before' ? before.current : way === 'after' ? after.current : null;

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

    // However the dialog closes, a video in it stops, per DDR-089, and plays on from there when the
    // reader opens it again and presses play.
    function onClose() {
      if (large instanceof HTMLVideoElement) {
        large.pause();
      }
    }

    // However the dialog opens, a video in it readies its controls, per DDR-092, so the reader can
    // play it, pause it and show it at full screen from the moment it opens.
    function onToggle(event: Event) {
      if ((event as ToggleEvent).newState === 'open' && large instanceof HTMLVideoElement) {
        ready(large);
      }
    }

    box.addEventListener('command', onCommand);
    box.addEventListener('cancel', onCancel);
    box.addEventListener('close', onClose);
    box.addEventListener('toggle', onToggle);

    return () => {
      box.removeEventListener('command', onCommand);
      box.removeEventListener('cancel', onCancel);
      box.removeEventListener('close', onClose);
      box.removeEventListener('toggle', onToggle);
    };
  }, [choice]);

  // A video's still is its poster, described by the video's description, per DDR-089.
  const still = 'poster' in media ? { src: media.poster, alt: media.description } : { src: media.file, alt: media.alt };
  const video = 'poster' in media ? media : undefined;

  return (
    <>
      <div className={`${styles.frame} ${className}`}>
        <img
          ref={framed}
          className={styles.framed}
          src={asset(still.src)}
          alt={still.alt}
          width={media.width}
          height={media.height}
        />
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
        className={steps ? `${styles.larger} ${styles.stepped}` : styles.larger}
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
        <div className={styles.room}>
          {video ? (
            <video
              ref={larger}
              className={styles.picture}
              src={asset(video.file)}
              poster={asset(video.poster)}
              width={media.width}
              height={media.height}
              preload="none"
              controls
              controlsList="nodownload"
              disablePictureInPicture
              aria-label={video.description}
              onContextMenu={withhold}
            >
              {video.description}
            </video>
          ) : (
            <img
              ref={larger}
              className={styles.picture}
              src={asset(still.src)}
              alt={still.alt}
              width={media.width}
              height={media.height}
            />
          )}
        </div>
        {steps ? (
          <div className={styles.foot}>
            <button
              ref={before}
              type="button"
              className={`${styles.step} ${styles.before}`}
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
              className={`${styles.step} ${styles.after}`}
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
