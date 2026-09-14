import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { dateLabels } from '@/content/dates';
import { DateRange, MonthDate } from './date-range';

/** The rendered text, with no-break spaces shown as ordinary spaces. */
const read = (html: string) => html.replace(/<[^>]+>/g, '').replace(/ /g, ' ');

describe('DateRange', () => {
  it('shows each month as its three-letter name and year, with a spaced en dash between', () => {
    const html = renderToStaticMarkup(<DateRange start="2018-05" end="2020-07" labels={dateLabels} />);

    expect(read(html)).toBe('May 2018 – Jul 2020');
  });

  it('marks up each month with its machine-readable value', () => {
    const html = renderToStaticMarkup(<DateRange start="2018-05" end="2020-07" labels={dateLabels} />);

    expect(html).toMatch(/<time datetime="2018-05">May.2018<\/time>.– <time datetime="2020-07">Jul.2020<\/time>/i);
  });

  it('keeps each month with its year, and the dash with the month before it, when the line wraps', () => {
    const html = renderToStaticMarkup(<DateRange start="2018-05" end="2020-07" labels={dateLabels} />);

    expect(html.replace(/<[^>]+>/g, '')).toBe('May 2018 – Jul 2020');
  });

  it('runs to the present when there is no end month', () => {
    const html = renderToStaticMarkup(<DateRange start="2024-10" labels={dateLabels} />);

    expect(read(html)).toBe('Oct 2024 – Present');
    expect(html.match(/<time/g)).toHaveLength(1);
  });

  it('names January and December from either end of the list', () => {
    const html = renderToStaticMarkup(<DateRange start="2014-01" end="2019-12" labels={dateLabels} />);

    expect(read(html)).toBe('Jan 2014 – Dec 2019');
  });
});

describe('MonthDate', () => {
  it('shows a single month, such as the month a certification was granted, with its machine-readable value', () => {
    const html = renderToStaticMarkup(<MonthDate month="2024-06" labels={dateLabels} />);

    expect(read(html)).toBe('Jun 2024');
    expect(html).toMatch(/^<time datetime="2024-06">Jun.2024<\/time>$/i);
  });
});

describe('date labels', () => {
  it('name the twelve months in three letters, as DDR-006 sets', () => {
    expect(dateLabels.months).toHaveLength(12);

    for (const month of dateLabels.months) {
      expect(month).toMatch(/^[A-Z][a-z]{2}$/);
    }
  });
});
