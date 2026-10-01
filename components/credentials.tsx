import type { Credential, DateLabels } from '@/content/types';
import { DateRange, MonthDate } from './date-range';
import { Hint } from './hint';
import { Timeline } from './timeline';

/**
 * The owner's degrees and certifications, oldest first as `content/` gives them, per DDR-057, and
 * newest first below the wide breakpoint, where the timeline runs down the page, per DDR-074. Each
 * is an entry of the timeline experience shares: the dates, a dot, and a card with the institution
 * and the credential's name.
 *
 * A degree shows the months it ran; a certification shows the single month it was granted. Neither
 * has a place or a body. A degree's card opens with its institution's logo, per DDR-068, as a role's
 * card opens with its company's, and a certification's with its badge, drawn larger, per DDR-090.
 *
 * Each card leads off the site, per DDR-069 — a degree's to its institution's site and a
 * certification's to its badge — and looks, moves and answers as a role's card does. The hint above
 * the row says so, as the experience timeline's does.
 */
export function Credentials({
  credentials,
  hint,
  newTab,
  dateLabels,
  labelledBy,
}: {
  credentials: readonly Credential[];
  /** The line above the timeline that says a card leads somewhere. */
  hint: string;
  /** What a card says about opening a new tab, to assistive technology alone. */
  newTab: string;
  dateLabels: DateLabels;
  /** The id of the section heading that names the timeline. */
  labelledBy: string;
}) {
  return (
    <div>
      <Hint text={hint} />
      <Timeline
        kind="credential"
        labelledBy={labelledBy}
        entries={credentials.map((credential) => ({
          key: credential.name,
          dates:
            'granted' in credential ? (
              <MonthDate month={credential.granted} labels={dateLabels} />
            ) : (
              <DateRange start={credential.start} end={credential.end} labels={dateLabels} />
            ),
          subtitle: credential.institution,
          ...('granted' in credential
            ? { logo: credential.badge, logoBadge: true }
            : { logo: credential.logo, logoTall: credential.logoTall }),
          title: credential.name,
          href: credential.href,
          newTab,
        }))}
      />
    </div>
  );
}
