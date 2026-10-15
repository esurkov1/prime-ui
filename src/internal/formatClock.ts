const pad = (value: number) => String(value).padStart(2, "0");

/** A media position or length: `m:ss`, `h:mm:ss` from an hour on. */
export function formatClock(seconds: number): string {
  const total = Math.max(0, Math.round(Number.isFinite(seconds) ? seconds : 0));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = pad(total % 60);
  return h > 0 ? `${h}:${pad(m)}:${s}` : `${m}:${s}`;
}

/** A calendar day: the month 0–11, as `Date#getMonth`. */
type CalendarDay = { year: number; month: number; day: number };

/** The calendar day and the clock of a moment as a time zone reads it. */
type ZonedParts = CalendarDay & {
  /** 0 (Sunday) – 6, as `Date#getDay`. */
  weekday: number;
  hours: number;
  minutes: number;
};

/** One formatter per zone: building an `Intl.DateTimeFormat` is the costly part. */
const ZONE_FORMATS = new Map<string, Intl.DateTimeFormat>();

function zoneFormat(timeZone: string): Intl.DateTimeFormat {
  let format = ZONE_FORMATS.get(timeZone);
  if (!format) {
    format = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
    ZONE_FORMATS.set(timeZone, format);
  }
  return format;
}

/**
 * The day and the clock of `date` in `timeZone` (an IANA name, `"Asia/Vladivostok"`); without one,
 * in the browser's zone.
 */
export function zonedParts(date: Date, timeZone?: string): ZonedParts {
  if (!timeZone) {
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
      weekday: date.getDay(),
      hours: date.getHours(),
      minutes: date.getMinutes(),
    };
  }
  const read: Record<string, number> = {};
  for (const part of zoneFormat(timeZone).formatToParts(date)) {
    if (part.type !== "literal") read[part.type] = Number(part.value);
  }
  const year = read.year ?? 0;
  const month = (read.month ?? 1) - 1;
  const day = read.day ?? 1;
  return {
    year,
    month,
    day,
    weekday: new Date(Date.UTC(year, month, day)).getUTCDay(),
    hours: read.hour ?? 0,
    minutes: read.minute ?? 0,
  };
}

const DAY_MS = 86_400_000;

/** Whole calendar days from `from` to `to` (both read in one zone); never off by a DST hour. */
export function daysBetween(from: CalendarDay, to: CalendarDay): number {
  return Math.round(
    (Date.UTC(to.year, to.month, to.day) - Date.UTC(from.year, from.month, from.day)) / DAY_MS,
  );
}

/** A time of day: `HH:mm`, 24-hour, in `timeZone` or the browser's zone («09:05»). */
export function formatTimeOfDay(date: Date, timeZone?: string): string {
  const { hours, minutes } = zonedParts(date, timeZone);
  return `${pad(hours)}:${pad(minutes)}`;
}
