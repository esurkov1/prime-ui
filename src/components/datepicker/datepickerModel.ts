import {
  addDays,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  getDaysInMonth,
  isSameYear,
  type Locale,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";

/**
 * Datepicker logic without time zones: every value is wall-clock time (the local Date fields).
 * A calendar day is a Date at local midnight. Converting to a zone is up to the application.
 */

export type DatepickerRange = {
  /** `null` — no lower bound («Всё время»). */
  from: Date | null;
  to: Date | null;
};

export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** A leap year for yearly "day + month" dates. */
export const YEARLESS_YEAR = 2000;
export const DAY_START_MINUTES = 0;
export const DAY_END_MINUTES = 23 * 60 + 59;

export function sameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return a != null && b != null && a.getTime() === b.getTime();
}

export function toDay(value: Date): Date {
  return startOfDay(value);
}

export function minutesOf(value: Date): number {
  return value.getHours() * 60 + value.getMinutes();
}

/** Day + minutes → Date; `endOfMinute` fills up to 59.999 s. */
export function withMinutes(day: Date, minutes: number, endOfMinute = false): Date {
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    Math.floor(minutes / 60),
    minutes % 60,
    endOfMinute ? 59 : 0,
    endOfMinute ? 999 : 0,
  );
}

/**
 * A cell of the month grid. `day` — a day of this month, or `null` for a cell of the adjacent
 * month; `outside` — the adjacent month's date in that cell (shown muted).
 */
export type MonthCell = { day: Date | null; col: number; outside: Date | null };

function leadingBlanks(month: Date, weekStartsOn: WeekStart): number {
  return (startOfMonth(month).getDay() - weekStartsOn + 7) % 7;
}

export function rowsNeeded(month: Date, weekStartsOn: WeekStart): number {
  return Math.ceil((leadingBlanks(month, weekStartsOn) + getDaysInMonth(month)) / 7);
}

/** Rows of 7 cells for a month; `rows` evens out the height of side-by-side months. */
export function monthGrid(month: Date, rows: number, weekStartsOn: WeekStart): MonthCell[][] {
  const first = startOfMonth(month);
  const lead = leadingBlanks(first, weekStartsOn);
  const dim = getDaysInMonth(first);
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: 7 }, (_, c) => {
      const n = r * 7 + c - lead + 1;
      const inMonth = n >= 1 && n <= dim;
      return {
        day: inMonth ? addDays(first, n - 1) : null,
        col: c,
        outside: inMonth ? null : addDays(first, n - 1),
      };
    }),
  );
}

export function weekdayLabels(locale: Locale, weekStartsOn: WeekStart): string[] {
  // 1 January 2024 is a Monday.
  return Array.from({ length: 7 }, (_, i) => {
    const text = format(new Date(2024, 0, 1 + ((weekStartsOn - 1 + i + 7) % 7)), "EEEEEE", {
      locale,
    });
    return text.charAt(0).toUpperCase() + text.slice(1);
  });
}

export function monthTitle(month: Date, locale: Locale, yearless = false): string {
  const text = format(month, yearless ? "LLLL" : "LLLL yyyy", { locale });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** «6 окт», «6 окт 2025»: the year only when it is not the current one. */
export function formatDayShort(day: Date, today: Date, locale: Locale, yearless = false): string {
  const pattern = yearless || isSameYear(day, today) ? "d MMM" : "d MMM yyyy";
  return format(day, pattern, { locale }).replace(".", "");
}

/** "HH:mm" → minutes since midnight; `null` for an invalid format. */
export function parseTime(text: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(text.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  return `${String(h).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

/* ─── Presets ─── */

export type DatepickerPreset = {
  key: string;
  label: string;
  /** Calendar days relative to today; `from = null` — no lower bound. */
  days: (today: Date) => { from: Date | null; to: Date };
};

const MONDAY = { weekStartsOn: 1 as const };

/** Ready presets (the week starts on Monday). Replace a label with `{ ...preset, label }`. */
export const datepickerPresets = {
  today: {
    key: "today",
    label: "Сегодня",
    days: (today) => ({ from: today, to: today }),
  } satisfies DatepickerPreset,
  yesterday: {
    key: "yesterday",
    label: "Вчера",
    days: (today) => ({ from: subDays(today, 1), to: subDays(today, 1) }),
  } satisfies DatepickerPreset,
  thisWeek: {
    key: "thisWeek",
    label: "Эта неделя",
    days: (today) => ({ from: startOfWeek(today, MONDAY), to: today }),
  } satisfies DatepickerPreset,
  lastWeek: {
    key: "lastWeek",
    label: "Прошлая неделя",
    days: (today) => {
      const ref = subWeeks(today, 1);
      return { from: startOfWeek(ref, MONDAY), to: startOfDay(endOfWeek(ref, MONDAY)) };
    },
  } satisfies DatepickerPreset,
  thisMonth: {
    key: "thisMonth",
    label: "Этот месяц",
    days: (today) => ({ from: startOfMonth(today), to: today }),
  } satisfies DatepickerPreset,
  lastMonth: {
    key: "lastMonth",
    label: "Прошлый месяц",
    days: (today) => {
      const ref = subMonths(today, 1);
      return { from: startOfMonth(ref), to: startOfDay(endOfMonth(ref)) };
    },
  } satisfies DatepickerPreset,
  thisYear: {
    key: "thisYear",
    label: "Этот год",
    days: (today) => ({ from: startOfYear(today), to: today }),
  } satisfies DatepickerPreset,
  lastYear: {
    key: "lastYear",
    label: "Прошлый год",
    days: (today) => {
      const ref = subYears(today, 1);
      return { from: startOfYear(ref), to: startOfDay(endOfYear(ref)) };
    },
  } satisfies DatepickerPreset,
  /** «Всё время»: no lower bound, or an explicit start date. */
  allTime: (start: Date | null = null, label = "Всё время"): DatepickerPreset => ({
    key: "allTime",
    label,
    days: (today) => ({ from: start ? startOfDay(start) : null, to: today }),
  }),
};

/** The default set of periods. */
export const DEFAULT_DATEPICKER_PRESETS: DatepickerPreset[] = [
  datepickerPresets.today,
  datepickerPresets.yesterday,
  datepickerPresets.thisWeek,
  datepickerPresets.thisMonth,
  datepickerPresets.lastWeek,
  datepickerPresets.lastMonth,
  datepickerPresets.thisYear,
  datepickerPresets.lastYear,
];

/** The preset that matches the selected days exactly. */
export function matchPreset(
  presets: DatepickerPreset[],
  fromDay: Date | null,
  toDay: Date | null,
  today: Date,
): DatepickerPreset | null {
  if (toDay == null) return null;
  for (const preset of presets) {
    const r = preset.days(today);
    const fromMatches = r.from == null ? fromDay == null : sameDay(r.from, fromDay);
    if (fromMatches && sameDay(r.to, toDay)) return preset;
  }
  return null;
}
