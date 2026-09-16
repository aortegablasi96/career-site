import type { Credential, DateLabels } from '@/content/types';
import { DateRange, MonthDate } from './date-range';
import { TimelineRow } from './timeline';

/**
 * The owner's degrees and certifications, newest first as `content/` gives them, per DDR-010, so
 * the two certifications lead. Each is a row of the same timeline experience uses: the dates, a
 * spine, and the content — the credential's name, its institution, and, for a degree, the sentence
 * on its thesis.
 *
 * A credential has no place, so its date column holds the dates alone. A degree shows the months it
 * ran; a certification shows the single month it was granted and has no body.
 */
export function Credentials({
  credentials,
  dateLabels,
}: {
  credentials: readonly Credential[];
  dateLabels: DateLabels;
}) {
  return (
    <>
      {credentials.map((credential) =>
        'thesis' in credential ? (
          <TimelineRow
            key={credential.name}
            dates={<DateRange start={credential.start} end={credential.end} labels={dateLabels} />}
            title={credential.name}
            subtitle={credential.institution}
          >
            <p>{credential.thesis}</p>
          </TimelineRow>
        ) : (
          <TimelineRow
            key={credential.name}
            dates={<MonthDate month={credential.granted} labels={dateLabels} />}
            title={credential.name}
            subtitle={credential.institution}
          />
        ),
      )}
    </>
  );
}
