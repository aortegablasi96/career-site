import type { DateLabels, Month } from '@/content/types';

// No-break spaces keep a month with its year, and the dash with the month before it, so a line that
// wraps, as the metadata line does in a narrow column with enlarged text, never starts with either.
const noBreakSpace = ' ';

/** A month as the page shows it, such as "Oct 2024", marked up with its machine-readable value. */
function MonthDate({ month, labels }: { month: Month; labels: DateLabels }) {
  const [year, number] = month.split('-');

  return <time dateTime={month}>{`${labels.months[Number(number) - 1]}${noBreakSpace}${year}`}</time>;
}

/**
 * The months something ran, such as "Oct 2024 – Jan 2026", with a spaced en dash, per DDR-006.
 * With no end month it is current, and runs to the present.
 */
export function DateRange({ start, end, labels }: { start: Month; end?: Month; labels: DateLabels }) {
  return (
    <>
      <MonthDate month={start} labels={labels} />
      {`${noBreakSpace}– `}
      {end ? <MonthDate month={end} labels={labels} /> : labels.present}
    </>
  );
}
