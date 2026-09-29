import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { glide, LargerPicture, moves, movingName } from './larger-picture';

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
      );
      update();
      seen.push(`after: ${from.style.viewTransitionName}|${to.style.viewTransitionName}`);

      expect(seen).toEqual([`before: ${movingName}|`, 'change: |', `after: |${movingName}`]);

      finish();
      return Promise.resolve()
        .then(() => undefined)
        .then(() => {
          expect(to.style.viewTransitionName).toBe('');
          expect(from.style.viewTransitionName).toBe('');
        });
    });
  });
});
