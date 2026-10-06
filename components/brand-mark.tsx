import styles from './brand-mark.module.css';

/**
 * The owner's mark, per DDR-105: a capital A overlapped by a ring, the O, as the owner draws it in
 * the design (`BrandMark`, node 552:605). It is drawn here rather than committed as a file, as the
 * icons are, so its inks are tokens: the A in `--color-brand-mark-ink` and the O in a gradient from
 * `--color-brand-mark-start` to `--color-brand-mark-end`, which its stylesheet sets.
 *
 * The paths and the gradient's line are the design's own, on its 59 by 40 grid, and nothing about
 * them may change: what a place may decide is how tall the mark is drawn, which `className` sets,
 * and the width follows from the grid.
 *
 * It is decoration to assistive technology: the link that holds it carries the name, so a screen
 * reader announces one link rather than an image inside a link. The gradient's id is fixed, since
 * the mark is drawn once per page, in the contents bar.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      className={className === undefined ? styles.mark : `${styles.mark} ${className}`}
      viewBox="0 0 59 40"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id="brand-mark-ring"
          x1="6.66129"
          y1="4.77419"
          x2="54.2419"
          y2="37.129"
          gradientUnits="userSpaceOnUse"
        >
          <stop className={styles.start} />
          <stop className={styles.end} offset="1" />
        </linearGradient>
      </defs>
      <path
        fill="url(#brand-mark-ring)"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M40.9194 2.39516C30.9274 2.39516 22.8387 10.2935 22.8387 20C22.8387 29.7065 30.9274 37.6048 40.9194 37.6048C50.9113 37.6048 59 29.7065 59 20C59 10.2935 50.9113 2.39516 40.9194 2.39516ZM40.9194 10.0081C46.5339 10.0081 51.1016 14.4806 51.1016 20C51.1016 25.5194 46.5339 29.9919 40.9194 29.9919C35.3048 29.9919 30.7371 25.5194 30.7371 20C30.7371 14.4806 35.3048 10.0081 40.9194 10.0081Z"
      />
      <path
        className={styles.ink}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 37.6048L16.5581 2.39516H24.6468L41.2048 37.6048H31.9742L28.6435 29.8016H12.371L9.04032 37.6048H0ZM15.5113 22.379H25.5032L20.5548 10.7694L15.5113 22.379Z"
      />
      <path className={styles.bar} d="M27.5968 26.1855H43.7742" strokeWidth="7.23226" />
    </svg>
  );
}
