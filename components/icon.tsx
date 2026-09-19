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
 * The three contact marks are solid shapes, per DDR-044, where they were line drawings of ours.
 * LinkedIn's and GitHub's are each service's own mark, never recoloured: the stylesheet only ever
 * sets them in a colour their brand publishes — white on the brand's own fill on screen, the
 * brand's colour on paper. GitHub's is the Invertocat from GitHub's logo kit, unchanged, on the
 * kit's 98 by 96 grid. LinkedIn publishes its [in] as raster files only, so its path is the vector
 * tracing Simple Icons carries, under CC0. The download stays a line drawing, because it is the CV
 * control's and #135 leaves it alone.
 *
 * Gmail's M is the one mark drawn in its own colours rather than `currentColor`, because it has
 * four and they are the mark: the address is on gmail.com, and the pill is Gmail's own button, per
 * DDR-044. Its fills are written into its paths, as the photo's colours are in its pixels, and not
 * in the palette, which is for colours the site chooses.
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
      viewBox={viewBoxes[name] ?? '0 0 24 24'}
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

/** The marks drawn on their publisher's own grid rather than on ours. */
const viewBoxes: Partial<Record<IconName, string>> = {
  gmail: '52 42 88 66',
  github: '0 0 98 96',
};

const paths: Record<IconName, React.ReactNode> = {
  // Gmail's M, in Google's own four colours and the darker red of its fold, on the logo's own grid.
  gmail: (
    <>
      <path fill="#4285f4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
      <path fill="#34a853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
      <path fill="#fbbc04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" />
      <path fill="#ea4335" d="M72 74V48l24 18 24-18v26L96 92" />
      <path fill="#c5221f" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" />
    </>
  ),
  // LinkedIn's [in]: the letters are cut out of the square, so white on the blue pill draws the
  // brand's white mark, and blue on paper draws its blue one.
  linkedin: (
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  ),
  // GitHub's Invertocat, from `GitHub_Invertocat_Black.svg` in GitHub's logo kit, on its own grid.
  github: (
    <path d="M41.4395 69.3848C28.8066 67.8535 19.9062 58.7617 19.9062 46.9902C19.9062 42.2051 21.6289 37.0371 24.5 33.5918C23.2559 30.4336 23.4473 23.7344 24.8828 20.959C28.7109 20.4805 33.8789 22.4902 36.9414 25.2656C40.5781 24.1172 44.4062 23.543 49.0957 23.543C53.7852 23.543 57.6133 24.1172 61.0586 25.1699C64.0254 22.4902 69.2891 20.4805 73.1172 20.959C74.457 23.543 74.6484 30.2422 73.4043 33.4961C76.4668 37.1328 78.0937 42.0137 78.0937 46.9902C78.0937 58.7617 69.1934 67.6621 56.3691 69.2891C59.623 71.3945 61.8242 75.9883 61.8242 81.252L61.8242 91.2051C61.8242 94.0762 64.2168 95.7031 67.0879 94.5547C84.4102 87.9512 98 70.6289 98 49.1914C98 22.1074 75.9883 6.69539e-07 48.9043 4.309e-07C21.8203 1.92261e-07 -1.9479e-07 22.1074 -4.3343e-07 49.1914C-6.20631e-07 70.4375 13.4941 88.0469 31.6777 94.6504C34.2617 95.6074 36.75 93.8848 36.75 91.3008L36.75 83.6445C35.4102 84.2188 33.6875 84.6016 32.1562 84.6016C25.8398 84.6016 22.1074 81.1563 19.4277 74.7441C18.375 72.1602 17.2266 70.6289 15.0254 70.3418C13.877 70.2461 13.4941 69.7676 13.4941 69.1934C13.4941 68.0449 15.4082 67.1836 17.3223 67.1836C20.0977 67.1836 22.4902 68.9063 24.9785 72.4473C26.8926 75.2227 28.9023 76.4668 31.2949 76.4668C33.6875 76.4668 35.2187 75.6055 37.4199 73.4043C39.0469 71.7773 40.291 70.3418 41.4395 69.3848Z" />
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
