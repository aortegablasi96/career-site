import Link from 'next/link';
import type { ReactNode } from 'react';
import type { NotFound } from '@/content/types';
import { Icon } from './icon';
import styles from './not-found-view.module.css';

/**
 * What an address the site does not have shows, per DDR-093: the top of a view, with nothing below
 * it. A way back to the page, as a project's or a role's view opens with (DDR-050, DDR-059), then
 * the page's one `h1`, set as a view's title is, and a line that says why the reader may be here.
 *
 * The way back is the one thing it offers, as the owner chose on #283: the contents bar above it
 * already leads to every section. It goes through `next/link` and does not prefetch, as a view's
 * does not, because prefetching the page would fetch its photo and every project's picture.
 *
 * It also draws the frame around the bar, the view and the footer, because the page is shorter than
 * a window: the frame is at least the window's height, and the view takes what the bar and the
 * footer leave, so the footer stands at the window's foot, as the owner asked on #283.
 */
export function NotFoundView({
  strings: { back, title, text },
  backHref,
  bar,
  footer,
}: {
  strings: NotFound;
  /** The page's route. */
  backHref: string;
  /** The site's contents bar, above the view. */
  bar: ReactNode;
  /** The site's footer, below it. */
  footer: ReactNode;
}) {
  return (
    <div className={styles.frame}>
      {bar}
      <main>
        <article className={styles.view} data-appear>
          <Link href={backHref} className={styles.back} prefetch={false}>
            <span className={styles.backMark}>
              <Icon name="back" />
            </span>
            {back}
          </Link>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.text}>{text}</p>
        </article>
      </main>
      {footer}
    </div>
  );
}
