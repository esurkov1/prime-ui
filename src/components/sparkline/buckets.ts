import {
  addDays,
  addMonths,
  addQuarters,
  addWeeks,
  differenceInCalendarDays,
  format,
  getQuarter,
  type Locale,
  parseISO,
  startOfDay,
  startOfISOWeek,
  startOfMonth,
  startOfQuarter,
} from "date-fns";

/*
 * The calendar side of a Sparkline: dated points (days) folded into the points of a grain — days,
 * ISO weeks, months, quarters — with the label of each and the base its change compares with.
 * Pure functions, computed once per series and grain.
 */

/** A step of the time axis: a point is a day, an ISO week (from Monday), a month or a quarter. */
export type Grain = "day" | "week" | "month" | "quarter";

/** How the days of a point make its value: their total, their mean or the last of them. */
export type BucketAggregate = "sum" | "average" | "latest";

export const GRAINS: readonly Grain[] = ["day", "week", "month", "quarter"];

const START: Record<Grain, (date: Date) => Date> = {
  day: startOfDay,
  week: startOfISOWeek,
  month: startOfMonth,
  quarter: startOfQuarter,
};

const NEXT: Record<Grain, (date: Date) => Date> = {
  day: (date) => addDays(date, 1),
  week: (date) => addWeeks(date, 1),
  month: (date) => addMonths(date, 1),
  quarter: (date) => addQuarters(date, 1),
};

const ROMAN = ["I", "II", "III", "IV"];

export type DatedValue = { date: Date | string; value: number | null };

/** The days of a series: one value per calendar day from the first to the last, `null` where absent. */
export type DaySeries = { first: Date; values: (number | null)[] };

export type Bucketed = {
  grain: Grain;
  points: { label: string; value: number | null }[];
  /** A point whose days do not cover its whole period: the series starts or ends inside it. */
  partial: boolean[];
  /**
   * The change base of each point: the previous point and this one over the same days of their
   * periods (the 1st–22nd of September against the 1st–22nd of October), `null` for the first.
   */
  previous: ([base: number | null, value: number | null] | null)[];
  /** The first and the last day as labels: the period of the series. */
  firstDay: string;
  lastDay: string;
};

function aggregate(values: readonly (number | null)[], how: BucketAggregate): number | null {
  let total = 0;
  let count = 0;
  let latest: number | null = null;
  for (const value of values) {
    if (value === null) continue;
    total += value;
    count += 1;
    latest = value;
  }
  if (!count) return null;
  return how === "sum" ? total : how === "average" ? total / count : latest;
}

const toDay = (date: Date | string) => startOfDay(typeof date === "string" ? parseISO(date) : date);

/** Dated points as calendar days: several points of one day make one, a missing day is `null`. */
export function daysOf(data: readonly DatedValue[], how: BucketAggregate): DaySeries | null {
  const dated = data
    .map((point) => ({ day: toDay(point.date), value: point.value }))
    .filter((point) => !Number.isNaN(point.day.getTime()))
    .sort((a, b) => a.day.getTime() - b.day.getTime());
  if (!dated.length) return null;
  const first = dated[0].day;
  const length = differenceInCalendarDays(dated[dated.length - 1].day, first) + 1;
  const perDay: (number | null)[][] = Array.from({ length }, () => []);
  for (const point of dated) perDay[differenceInCalendarDays(point.day, first)].push(point.value);
  return { first, values: perDay.map((values) => aggregate(values, how)) };
}

/** Points the series makes on `grain`, counted up to `limit + 1` (enough to say it is too many). */
function countOn(days: DaySeries, grain: Grain, limit: number): number {
  const last = addDays(days.first, days.values.length - 1);
  let count = 0;
  for (
    let start = START[grain](days.first);
    start <= last && count <= limit;
    start = NEXT[grain](start)
  )
    count += 1;
  return count;
}

/** The grains that make at least two points of this series: a single point is no trend. */
export function grainsOf(days: DaySeries | null): Grain[] {
  return days ? GRAINS.filter((grain) => countOn(days, grain, 2) >= 2) : [];
}

/**
 * `auto`: the finest grain whose points are no more than `limit` (31 under a headline — a month by
 * days, half a year by weeks, two and a half years by months; fewer in a table cell); a longer
 * series goes by quarters.
 */
export function resolveGrain(days: DaySeries | null, grain: Grain | "auto", limit: number): Grain {
  if (grain !== "auto") return grain;
  if (!days) return "day";
  return GRAINS.find((step) => countOn(days, step, limit) <= limit) ?? "quarter";
}

export function bucketize(
  days: DaySeries,
  grain: Grain,
  how: BucketAggregate,
  locale: Locale,
  quarterLabel: string,
): Bucketed {
  const last = addDays(days.first, days.values.length - 1);
  const years = days.first.getFullYear() !== last.getFullYear();
  const month = (date: Date, pattern: "MMMM" | "LLLL") =>
    format(date, pattern, { locale }).slice(0, 3);
  const day = (date: Date, year = false) =>
    `${date.getDate()} ${month(date, "MMMM")}${year ? ` ${date.getFullYear()}` : ""}`;
  const range = (from: Date, to: Date) => {
    if (differenceInCalendarDays(to, from) === 0) return day(from, years);
    if (from.getFullYear() !== to.getFullYear()) return `${day(from, true)} – ${day(to, true)}`;
    if (from.getMonth() === to.getMonth()) return `${from.getDate()}–${day(to, years)}`;
    return `${day(from)} – ${day(to, years)}`;
  };
  const whole = (start: Date, end: Date) => {
    if (grain === "day") return day(start, years);
    if (grain === "week") return range(start, end);
    const yearText = years ? ` ${start.getFullYear()}` : "";
    if (grain === "month") return `${month(start, "LLLL")}${yearText}`;
    return `${quarterLabel.replace("{quarter}", ROMAN[getQuarter(start) - 1])}${yearText}`;
  };

  type Bucket = { values: (number | null)[]; from: number; to: number };
  const buckets: Bucket[] = [];
  const points: Bucketed["points"] = [];
  const partial: boolean[] = [];
  for (let start = START[grain](days.first); start <= last; start = NEXT[grain](start)) {
    const end = addDays(NEXT[grain](start), -1);
    const span = differenceInCalendarDays(end, start) + 1;
    const offset = differenceInCalendarDays(start, days.first);
    const values: (number | null)[] = Array.from({ length: span }, () => null);
    let from = span;
    let to = -1;
    for (let i = 0; i < span; i++) {
      const index = offset + i;
      if (index < 0 || index >= days.values.length) continue;
      values[i] = days.values[index];
      from = Math.min(from, i);
      to = i;
    }
    const cut = from > 0 || to < span - 1;
    buckets.push({ values, from, to });
    partial.push(cut);
    points.push({
      // A cut period names the days it holds: «1–22 окт», not «окт».
      label: cut ? range(addDays(start, from), addDays(start, to)) : whole(start, end),
      value: aggregate(values, how),
    });
  }

  const previous = buckets.map((bucket, i): Bucketed["previous"][number] => {
    if (i === 0) return null;
    const before = buckets[i - 1];
    const from = Math.max(bucket.from, before.from);
    const to = Math.min(bucket.to, before.to);
    const full = (b: Bucket) => b.from === 0 && b.to === b.values.length - 1;
    // Two whole periods compare whole (October against September of 30 days); otherwise the days
    // both hold, by their place in the period.
    if (full(bucket) && full(before)) return [points[i - 1].value, points[i].value];
    if (from > to) return [null, null];
    return [
      aggregate(before.values.slice(from, to + 1), how),
      aggregate(bucket.values.slice(from, to + 1), how),
    ];
  });

  return {
    grain,
    points,
    partial,
    previous,
    firstDay: day(days.first, years),
    lastDay: day(last, years),
  };
}
