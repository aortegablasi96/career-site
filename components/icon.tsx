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
 * is drawn in `currentColor`, so it takes its control's ink unless a stylesheet gives it another.
 *
 * Drawn here rather than committed as files: these are a few hundred bytes of markup, and ADR-004's
 * rule for binary assets exists for photographs and video, not for a handful of marks. The
 * envelope, the download and the arrow are strokes on a 24 unit grid, which is where their
 * coordinates come from.
 *
 * LinkedIn's and GitHub's are not drawings of ours but each service's own mark, per DDR-044: the
 * shape exactly as the service publishes it, filled rather than stroked, on the grid it was drawn
 * on. Neither brand lets its mark be recoloured, so the pill cannot give it its indigo: the mark is
 * still drawn in `currentColor`, and the introduction's stylesheet sets that colour to the
 * service's own, from a token.
 *
 * One mark is not decoration, and it is the one given a `label`: the arrow that says a pill opens a
 * new tab, per DDR-043. Nothing else on the pill says so, so the arrow is an image with that label
 * as its name, and assistive technology reads it as part of the pill's name. A sighted reader and a
 * screen reader are told the same thing by the same element.
 */
export function Icon({
  name,
  label,
  className,
}: {
  name: IconName;
  label?: string;
  className?: string;
}) {
  const meaning = label
    ? ({ role: 'img', 'aria-label': label } as const)
    : ({ 'aria-hidden': true } as const);
  const mark = name in marks ? marks[name as keyof typeof marks] : undefined;
  const drawing = mark
    ? ({ viewBox: mark.viewBox, fill: 'currentColor' } as const)
    : ({
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      } as const);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      className={className}
      {...drawing}
      {...meaning}
      focusable="false"
    >
      {mark ? <path d={mark.path} /> : paths[name as keyof typeof paths]}
    </svg>
  );
}

/**
 * The two services' own marks, per DDR-044, each on the grid its publisher drew it on.
 *
 * GitHub's is the Invertocat from GitHub's logo kit, `GitHub_Invertocat_Black.svg` at
 * brand.github.com, unchanged. LinkedIn publishes its [in] mark as raster files only, so its path
 * is the vector tracing Simple Icons carries, on a 24 unit grid; the letters are cut out of the
 * square, so they show whatever the mark sits on, which is the pill's white.
 */
const marks: Record<'linkedin' | 'github', { viewBox: string; path: string }> = {
  linkedin: {
    viewBox: '0 0 24 24',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  github: {
    viewBox: '0 0 98 96',
    path: 'M41.4395 69.3848C28.8066 67.8535 19.9062 58.7617 19.9062 46.9902C19.9062 42.2051 21.6289 37.0371 24.5 33.5918C23.2559 30.4336 23.4473 23.7344 24.8828 20.959C28.7109 20.4805 33.8789 22.4902 36.9414 25.2656C40.5781 24.1172 44.4062 23.543 49.0957 23.543C53.7852 23.543 57.6133 24.1172 61.0586 25.1699C64.0254 22.4902 69.2891 20.4805 73.1172 20.959C74.457 23.543 74.6484 30.2422 73.4043 33.4961C76.4668 37.1328 78.0937 42.0137 78.0937 46.9902C78.0937 58.7617 69.1934 67.6621 56.3691 69.2891C59.623 71.3945 61.8242 75.9883 61.8242 81.252L61.8242 91.2051C61.8242 94.0762 64.2168 95.7031 67.0879 94.5547C84.4102 87.9512 98 70.6289 98 49.1914C98 22.1074 75.9883 6.69539e-07 48.9043 4.309e-07C21.8203 1.92261e-07 -1.9479e-07 22.1074 -4.3343e-07 49.1914C-6.20631e-07 70.4375 13.4941 88.0469 31.6777 94.6504C34.2617 95.6074 36.75 93.8848 36.75 91.3008L36.75 83.6445C35.4102 84.2188 33.6875 84.6016 32.1562 84.6016C25.8398 84.6016 22.1074 81.1563 19.4277 74.7441C18.375 72.1602 17.2266 70.6289 15.0254 70.3418C13.877 70.2461 13.4941 69.7676 13.4941 69.1934C13.4941 68.0449 15.4082 67.1836 17.3223 67.1836C20.0977 67.1836 22.4902 68.9063 24.9785 72.4473C26.8926 75.2227 28.9023 76.4668 31.2949 76.4668C33.6875 76.4668 35.2187 75.6055 37.4199 73.4043C39.0469 71.7773 40.291 70.3418 41.4395 69.3848Z',
  },
};

/** The drawings of our own, as strokes on a 24 unit grid. */
const paths: Record<Exclude<IconName, keyof typeof marks>, React.ReactNode> = {
  // An envelope: the open flap is what makes it read as mail rather than as a card.
  email: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 7 10-7" />
    </>
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
