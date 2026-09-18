import type { ContactIcon } from '@/content/types';

/**
 * The marks the introduction's controls carry: one per contact address, one for the CV, and the
 * arrow a pill carries when it opens a new tab, per DDR-043.
 */
export type IconName = ContactIcon | 'download' | 'external';

/**
 * A mark beside a control's text, per DDR-010.
 *
 * The pills are the one place on this page a link is not underlined, so each carries a mark as a
 * second cue that it is a control, alongside its border or fill. Neither cue is a colour.
 *
 * The mark is decoration: it repeats what the control's own text already says, so it is hidden
 * from assistive technology and takes no accessible name. It is sized in em rather than from a
 * token, because what it should match is the text beside it rather than a value of its own, and it
 * is drawn in `currentColor`, so a pill's fill and its mark cannot disagree.
 *
 * Drawn here rather than committed as files: these are a few hundred bytes of markup, and ADR-004's
 * rule for binary assets exists for photographs and video, not for five line drawings. They are
 * strokes on a 24 unit grid, which is where their coordinates come from.
 *
 * One mark is not decoration, and it is the one given a `label`: the arrow that says a pill opens a
 * new tab, per DDR-043. Nothing else on the pill says so, so the arrow is an image with that label
 * as its name, and assistive technology reads it as part of the pill's name. A sighted reader and a
 * screen reader are told the same thing by the same element.
 */
export function Icon({ name, label }: { name: IconName; label?: string }) {
  const meaning = label
    ? ({ role: 'img', 'aria-label': label } as const)
    : ({ 'aria-hidden': true } as const);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...meaning}
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}

const paths: Record<IconName, React.ReactNode> = {
  // An envelope: the open flap is what makes it read as mail rather than as a card.
  email: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 7 10-7" />
    </>
  ),
  // The LinkedIn mark: the dot and stem of the "in", and the second stem's shoulder.
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-13h4z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  // The GitHub mark, as an outline rather than a solid, so it sits beside the other three.
  github: (
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  ),
  // An arrow into a tray: the tray is what separates a download from a scroll cue.
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
    </>
  ),
  // An arrow leaving a corner, up and to the right: the usual sign that a link opens somewhere
  // other than the page it is on.
  external: (
    <>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
};
