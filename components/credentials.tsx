import type { Credential, DateLabels } from '@/content/types';
import { DateRange, MonthDate } from './date-range';
import { Timeline } from './timeline';

/**
 * The owner's degrees and certifications, oldest first as `content/` gives them, per DDR-057. Each
 * is an entry of the timeline experience shares: the dates, a dot, and a card with the institution
 * and the credential's name.
 *
 * A degree shows the months it ran; a certification shows the single month it was granted. Neither
 * has a place or a body. A credential whose institution's logo the content gives opens its card
 * with it, per DDR-068, as a role's card opens with its company's.
 */
export function Credentials({
  credentials,
  dateLabels,
  labelledBy,
}: {
  credentials: readonly Credential[];
  dateLabels: DateLabels;
  /** The id of the section heading that names the timeline. */
  labelledBy: string;
}) {
  return (
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
        logo: credential.logo,
        title: credential.name,
      }))}
    />
  );
}
