import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { glide, LargerPicture, moves, movingName, swap, swapCommand } from './larger-picture';

// DDR-082 and ADR-018, on #246: the picture in a project view's lead frame opens larger in a native
// modal dialog, opened and closed by its buttons' commands without script, and where the reader
// welcomes motion it grows out of its frame and shrinks back into it. The view's own test holds
// which picture opens on which view; this one holds the component, its stylesheet and its motion.

/** The stylesheet without its comments, so a rule is not matched against its explanation. */
const css = readFileSync(new URL('./larger-picture.module.css', import.meta.url), 'utf8').replace(
  /\/\*[\s\S]*?\*\//g,
  '',
);

/** The base styles, where the transition's pseudo-elements are drawn. */
const globals = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8')
  .replace(/\r\n/g, '\n')
  .replace(/\/\*[\s\S]*?\*\//g, '');

/** A rule's body, by its whole selector. */
const rule = (sheet: string, selector: string) =>
  sheet.match(new RegExp(`(?:^|\\})\\s*${selector.replace(/[.:+()[\]*]/g, '\\$&')}\\s*\\{([^}]*)\\}`))?.[1] ??
  '';

const html = renderToStaticMarkup(
  <LargerPicture
    media={{ file: '/portfolio/example/lead.webp', alt: 'The application on a laptop' }}
    caption="The dashboard"
    id="picture-larger"
    enlarge="View larger"
    close="Close"
    className="media"
  />,
);

/** The same picture as the third of a gallery's seven, per DDR-083. */
const stepping = renderToStaticMarkup(
  <LargerPicture
    media={{ file: '/portfolio/example/lead.webp', alt: 'The application on a laptop' }}
    caption="The dashboard"
    id="picture-2-larger"
    enlarge="View larger"
    close="Close"
    className="media"
    steps={{
      choice: 'picture-2',
      previous: 'picture-1-larger',
      next: 'picture-3-larger',
      position: '3 of 7',
      previousName: 'Previous picture',
      nextName: 'Next picture',
    }}
  />,
);

describe('LargerPicture', () => {
  it('draws the frame’s picture with the view’s class, and the control that opens it, before hydration', () => {
    expect(html).toMatch(
      /<div class="[^"]*"><img class="media" src="\/portfolio\/example\/lead\.webp" alt="The application on a laptop"\/><button type="button" class="[^"]*" commandfor="picture-larger" command="show-modal" aria-label="View larger">/,
    );
  });

  it('renders the dialog closed, named by its caption, with its close control first', () => {
    expect(html).toMatch(
      /<dialog id="picture-larger" class="[^"]*" aria-labelledby="picture-larger-caption"><button type="button" class="[^"]*" commandfor="picture-larger" command="close" aria-label="Close">[\s\S]*?<\/button><img class="[^"]*" src="\/portfolio\/example\/lead\.webp" alt="The application on a laptop"\/><p id="picture-larger-caption" class="[^"]*">The dashboard<\/p><\/dialog>$/,
    );
    expect(html).not.toMatch(/<dialog[^>]* open/);
  });

  it('makes the whole picture the target that opens it, and the ground around it the one that closes it', () => {
    expect(rule(css, '.frame')).toContain('position: relative');
    expect(rule(css, '.enlarge::after')).toContain('position: absolute');
    expect(rule(css, '.enlarge::after')).toContain('inset: 0');
    expect(rule(css, '.close::before')).toContain('position: absolute');
    expect(rule(css, '.close::before')).toContain('inset: 0');
    // The picture and its caption are drawn over the ground's target, so choosing them keeps it open.
    expect(rule(css, '.picture')).toContain('position: relative');
    expect(rule(css, '.caption')).toContain('position: relative');
  });

  it('shows the picture whole, within the room there is, never cropped or stretched', () => {
    const picture = rule(css, '.picture');

    expect(picture).toContain('max-inline-size: 100%');
    expect(picture).toContain('max-block-size: 100%');
    expect(picture).not.toMatch(/object-fit|aspect-ratio|(?:^|\s)(?:inline|block)-size/);
    expect(rule(css, '.larger[open]')).toContain('grid-template-rows: auto minmax(0, 1fr) auto');
  });

  it('blurs the view behind a veil, draws focus on it in white, and keeps the view still and in place', () => {
    expect(rule(css, '.larger')).toContain('background-color: var(--color-surface-enlarged)');
    expect(rule(css, '.larger')).toContain('backdrop-filter: blur(var(--project-view-enlarged-blur))');
    expect(rule(css, '.larger :focus-visible')).toContain('outline-color: var(--color-on-enlarged)');
    expect(rule(css, ':global(html):has(.larger[open])')).toContain('overflow: hidden');
    expect(rule(css, ':global(html):has(.larger[open])')).toContain('scrollbar-gutter: stable');
  });

  // The movement is the view transition's, which the component starts only where motion is
  // welcome, so the stylesheet animates nothing of its own.
  it('animates nothing in its stylesheet, and draws the moving picture covering its box, not stretched', () => {
    expect(css).not.toMatch(/transition|animation|@starting-style|@keyframes/);
    expect(rule(globals, `::view-transition-group(root),\n::view-transition-group(${movingName})`)).toContain(
      'animation-duration: var(--project-view-enlarge-duration)',
    );
    const pair = rule(globals, `::view-transition-old(${movingName}),\n::view-transition-new(${movingName})`);

    expect(pair).toContain('object-fit: cover');
    expect(pair).toContain('block-size: 100%');
  });

  // Crossfaded, the frame's capture, already cropped and zoomed again to cover the box, drew a
  // second, larger picture behind the first. Only the whole picture's capture is drawn, opaque,
  // inside the frame's rounded corners.
  it('draws only the whole picture while it moves, never the frame’s cropped capture beside it', () => {
    const pair = rule(globals, `::view-transition-old(${movingName}),\n::view-transition-new(${movingName})`);
    const group = rule(globals, `::view-transition-group(${movingName})`);
    const hidden = rule(
      globals,
      `:root[data-moving='opening']::view-transition-old(${movingName}),\n:root[data-moving='closing']::view-transition-new(${movingName})`,
    );

    expect(pair).toContain('animation: none');
    expect(pair).toContain('mix-blend-mode: normal');
    expect(group).toContain('overflow: clip');
    expect(group).toContain('border-radius: var(--radius-large)');
    expect(hidden).toContain('opacity: 0');
  });

  // DDR-083 and ADR-019, on #250: in a gallery, the caption stands between the controls that step
  // to the neighbours, each pointing at its neighbour's dialog with a command of the page's own,
  // and where the picture stands is under the caption and in the dialog's name.
  describe('the steps between a gallery’s pictures', () => {
    it('points each control at its neighbour’s dialog, and names the dialog by its caption and place', () => {
      expect(stepping).toContain('aria-labelledby="picture-2-larger-caption picture-2-larger-position"');
      expect(stepping).toMatch(
        new RegExp(
          `<img [^>]*/><div class="[^"]*"><button type="button" class="[^"]*" commandfor="picture-1-larger" command="${swapCommand}" aria-label="Previous picture">[^]*?</button><div class="[^"]*"><p id="picture-2-larger-caption" class="[^"]*">The dashboard</p><p id="picture-2-larger-position" class="[^"]*">3 of 7</p></div><button type="button" class="[^"]*" commandfor="picture-3-larger" command="${swapCommand}" aria-label="Next picture">[^]*?</button></div></dialog>$`,
        ),
      );
      // A command of the page's own starts with two dashes, so the browser does nothing with it.
      expect(swapCommand).toMatch(/^--/);
    });

    it('gives a lone picture neither control nor place', () => {
      expect(html).not.toContain(swapCommand);
      expect(html).not.toContain('-position');
    });

    it('draws the controls as the close control, over the ground’s target, and not without script', () => {
      expect(css).toMatch(/\.close,\s*\.step\s*\{/);
      expect(rule(css, '.step')).toContain('position: relative');
      expect(rule(css, '.foot')).toContain('grid-template-columns: auto minmax(0, 1fr) auto');
      expect(rule(css, '.foot')).toContain('justify-self: stretch');
      const block = css.match(/@media \(scripting: none\) \{([\s\S]*?)\n\}/)?.[1] ?? '';

      expect(block).toMatch(/\.step\s*\{\s*display: none;\s*\}/);
    });

    // DDR-086, on #256: from the wide breakpoint the two controls leave the caption's row and stand
    // at the window's edges, either side of the picture. The markup is one, so the stylesheet places
    // them, there and nowhere else, and a lone picture's dialog is not laid out that way.
    it('stands the controls either side of the picture from the wide breakpoint, and only there', () => {
      const wide = css.match(/@media \(min-width: 48em\) \{([\s\S]*?)\n\}/)?.[1] ?? '';
      const stepped = rule(wide, '.stepped[open]');

      expect(stepped).toContain('grid-template-columns: auto minmax(0, 1fr) auto');
      expect(stepped).toMatch(/grid-template-areas:\s*'close close close'\s*'before picture after'\s*'words words words'/);
      expect(stepped).toContain('column-gap: var(--space-small)');
      expect(rule(wide, '.foot')).toContain('display: contents');
      expect(rule(wide, '.before')).toContain('grid-area: before');
      expect(rule(wide, '.after')).toContain('grid-area: after');
      // The picture and the close control are placed only in a gallery's dialog.
      expect(rule(wide, '.stepped .picture')).toContain('grid-area: picture');
      expect(rule(wide, '.stepped .close')).toContain('grid-area: close');
      expect(css.replace(wide, '')).not.toMatch(/grid-area|grid-template-areas|display: contents/);

      expect(stepping).toMatch(/<dialog id="picture-2-larger" class="[^" ]+ [^" ]+"/);
      expect(html).toMatch(/<dialog id="picture-larger" class="[^" ]+"/);
    });

    it('closes one dialog, chooses the other picture, focuses its opener, opens its dialog, and keeps focus in place', () => {
      const seen: string[] = [];
      const button = (name: string) => ({ focus: () => seen.push(`focus ${name}`) });
      const [close, previous, next] = [button('close'), button('previous'), button('next')];
      const choice = {
        set checked(value: boolean) {
          seen.push(`checked ${value}`);
        },
        get checked() {
          return false;
        },
      };

      swap(
        { close: () => seen.push('close'), querySelectorAll: () => [{}, {}, 'next'] },
        choice,
        { focus: (options) => seen.push(`focus opener ${options.preventScroll}`) },
        { showModal: () => seen.push('showModal'), querySelectorAll: () => [close, previous, next] },
        'next',
      );

      expect(seen).toEqual(['close', 'checked true', 'focus opener true', 'showModal', 'focus next']);
    });

    it('leaves focus where the browser puts it when none of the dialog’s controls had it', () => {
      const seen: string[] = [];

      swap(
        { close: () => {}, querySelectorAll: () => [] },
        { checked: false },
        { focus: () => {} },
        { showModal: () => seen.push('showModal'), querySelectorAll: () => [{ focus: () => seen.push('focus') }] },
        null,
      );

      expect(seen).toEqual(['showModal']);
    });
  });

  describe('the movement', () => {
    const welcome = () => ({ matches: false });
    const unwelcome = (query: string) => ({ matches: query === '(prefers-reduced-motion: reduce)' });

    it('moves only where the browser draws view transitions and the reader has not asked for less motion', () => {
      const transitions = { startViewTransition: () => undefined };

      expect(moves(transitions, welcome)).toBe(true);
      expect(moves(transitions, unwelcome)).toBe(false);
      expect(moves({}, welcome)).toBe(false);
    });

    it('hands the moving name from the picture it leaves to the one it arrives at, around the change', () => {
      const from = { style: { viewTransitionName: '' } };
      const to = { style: { viewTransitionName: '' } };
      const root: { dataset: { moving?: string } } = { dataset: {} };
      const seen: string[] = [];
      let finish = () => {};
      let update = () => {};

      glide(
        (callback) => {
          seen.push(`before: ${from.style.viewTransitionName}|${to.style.viewTransitionName}`);
          update = callback;
          return { finished: new Promise<void>((resolve) => (finish = resolve)) };
        },
        from,
        to,
        () => seen.push(`change: ${from.style.viewTransitionName}|${to.style.viewTransitionName}`),
        root,
        'closing',
      );
      // The root says which way it moves, so the stylesheet hides the frame's capture.
      expect(root.dataset.moving).toBe('closing');
      update();
      seen.push(`after: ${from.style.viewTransitionName}|${to.style.viewTransitionName}`);

      expect(seen).toEqual([`before: ${movingName}|`, 'change: |', `after: |${movingName}`]);

      finish();
      return Promise.resolve()
        .then(() => undefined)
        .then(() => {
          expect(to.style.viewTransitionName).toBe('');
          expect(from.style.viewTransitionName).toBe('');
          expect(root.dataset).not.toHaveProperty('moving');
        });
    });
  });
});
