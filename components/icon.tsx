import type { ContactIcon } from '@/content/types';

/** The marks the introduction's controls carry: one per contact address, and one for the CV. */
export type IconName = ContactIcon | 'download';

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
 * rule for binary assets exists for photographs and video, not for four marks.
 *
 * The three contact marks are one set, per DDR-044: solid shapes on a 24 unit grid, in the form a
 * visitor meets them on most sites, where they were line drawings of ours. The envelope is Material
 * Design's `mail`, under the Apache License 2.0; LinkedIn's [in] and GitHub's mark are the vectors
 * Simple Icons carries, under CC0. Each takes the pill's ink rather than its brand's colour. The
 * download stays a line drawing, because it is the CV control's and #135 leaves it alone.
 */
export function Icon({ name }: { name: IconName }) {
  const drawing =
    name === 'download'
      ? ({
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        } as const)
      : ({ fill: 'currentColor' } as const);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...drawing}
      aria-hidden
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}

const paths: Record<IconName, React.ReactNode> = {
  // A closed envelope with its flap drawn in: the shape most sites put beside an email address.
  email: (
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
  ),
  // LinkedIn's [in]: the letters are cut out of the square, so they show the pill's own fill.
  linkedin: (
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  ),
  // GitHub's mark: the cat cut out of the circle.
  github: (
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  ),
  // An arrow into a tray: the tray is what separates a download from a scroll cue.
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
    </>
  ),
};
