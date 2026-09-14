import type { Credential, DateLabels } from '@/content/types';
import { DateRange, MonthDate } from './date-range';
import { Entry } from './entry';

/**
 * The owner's degrees and certifications, in the order the content gives, per DDR-006. Each is an
 * entry titled by the credential's name, with its institution and dates below it. A degree shows
 * the months it ran and a paragraph on its thesis. A certification shows the month it was granted,
 * and has no body.
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
          <Entry
            key={credential.name}
            title={credential.name}
            metadata={[
              credential.institution,
              <DateRange key="dates" start={credential.start} end={credential.end} labels={dateLabels} />,
            ]}
          >
            <p>{credential.thesis}</p>
          </Entry>
        ) : (
          <Entry
            key={credential.name}
            title={credential.name}
            metadata={[credential.institution, <MonthDate key="date" month={credential.granted} labels={dateLabels} />]}
          />
        ),
      )}
    </>
  );
}
