'use client';

import { useState } from 'react';
import type { BusinessCaseItem } from '@/content/types';
import { Icon } from './icon';
import styles from './business-case-slider.module.css';

/**
 * The item a step of `by` from `index` leads to, among `count` items. The items are a loop, per
 * DDR-080: the step before the first is the last, and the step after the last is the first, so
 * neither control is ever spent and neither is drawn differently at the ends.
 */
export function step(index: number, by: number, count: number): number {
  return (((index + by) % count) + count) % count;
}

/**
 * A project's business case as a card that shows one item at a time, per DDR-080, as
 * `career-site-experience-business-case` draws it (node 365:26): the item's label in a pill, its
 * icon beside its headline, its text, and its key figure below a hairline; at the card's foot,
 * below another, "Prev", a dot for each item and "Next".
 *
 * It is the site's second Client Component, per ADR-015: which item is shown is state, and a
 * control that steps through several has no native element that holds it without script. Every
 * item is in the markup, in the owner's order, and the stylesheet draws the one shown. The others
 * are hidden from everything, the accessibility tree and the tab order included, but still take
 * their room, so the card is as tall as its tallest item and the foot never moves under the
 * pointer. Without script, the stylesheet shows every item, one below the other, and no controls.
 *
 * The controls are buttons, so the keyboard reaches and presses each, and focus stays on the one
 * pressed. A dot is named for its item's label and marks the item shown with `aria-current`, and
 * the items are a polite live region, so the item a control shows is read out when it is shown.
 * Each item is a group named for its label. A field the owner has left empty draws nothing, and
 * leaves no room in its place. The icon repeats what the headline says, so it is not announced.
 */
export function BusinessCaseSlider({
  items,
  previous,
  next,
}: {
  items: readonly BusinessCaseItem[];
  /** The word on the control that shows the item before, which is also its name. */
  previous: string;
  /** The word on the control that shows the item after. */
  next: string;
}) {
  const [shown, setShown] = useState(0);

  return (
    <div className={styles.card}>
      <div className={styles.items} aria-live="polite">
        {items.map(({ label, text, icon, headline, figure }, index) => (
          <div
            key={label}
            role="group"
            aria-label={label}
            className={index === shown ? `${styles.item} ${styles.shown}` : styles.item}
          >
            <p className={styles.label}>{label}</p>
            {(icon || headline) && (
              <div className={styles.heading}>
                {icon && (
                  <span className={styles.icon} aria-hidden="true">
                    {icon}
                  </span>
                )}
                {headline && <h2 className={styles.headline}>{headline}</h2>}
              </div>
            )}
            <p className={styles.text}>{text}</p>
            {figure && (
              <p className={styles.figure}>
                <span className={styles.value}>{figure.value}</span>
                <span className={styles.caption}>{figure.caption}</span>
              </p>
            )}
          </div>
        ))}
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.step}
          onClick={() => setShown(step(shown, -1, items.length))}
        >
          <Icon name="back" />
          {previous}
        </button>
        <ul className={styles.dots}>
          {items.map(({ label }, index) => (
            <li key={label}>
              <button
                type="button"
                className={styles.dot}
                aria-label={label}
                aria-current={index === shown ? 'true' : undefined}
                onClick={() => setShown(index)}
              />
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={styles.step}
          onClick={() => setShown(step(shown, 1, items.length))}
        >
          {next}
          <Icon name="forward" />
        </button>
      </div>
    </div>
  );
}
