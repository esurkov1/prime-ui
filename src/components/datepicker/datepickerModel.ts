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
 * Логика Datepicker без часовых поясов: все значения — «настенное» время (локальные поля Date).
 * Календарный день — Date на локальную полночь. Перевод в пояс — задача приложения.
 */

export type DatepickerRange = {
  /** null — без нижней границы («Всё время»). */
  from: Date | null;
  to: Date | null;
};

export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Високосный год для ежегодных дат «день + месяц». */
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

/** День + минуты → Date; `endOfMinute` добивает до 59.999 с. */
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
 * Клетка сетки месяца. `day` — день этого месяца или null для клетки соседнего месяца;
 * `outside` — дата соседнего месяца в этой клетке (для приглушённого показа).
 */
export type MonthCell = { day: Date | null; col: number; outside: Date | null };

function leadingBlanks(month: Date, weekStartsOn: WeekStart): number {
  return (startOfMonth(month).getDay() - weekStartsOn + 7) % 7;
}

export function rowsNeeded(month: Date, weekStartsOn: WeekStart): number {
  return Math.ceil((leadingBlanks(month, weekStartsOn) + getDaysInMonth(month)) / 7);
}

/** Строки месяца по 7 клеток; `rows` выравнивает высоту соседних месяцев. */
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
  // 1 января 2024 — понедельник.
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

/** «6 окт», «6 окт 2025» — год, только если он не текущий. */
export function formatDayShort(day: Date, today: Date, locale: Locale, yearless = false): string {
  const pattern = yearless || isSameYear(day, today) ? "d MMM" : "d MMM yyyy";
  return format(day, pattern, { locale }).replace(".", "");
}

/** «HH:mm» → минуты от полуночи; null — неверный формат. */
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

/* ─── Пресеты ─── */

export type DatepickerPreset = {
  key: string;
  label: string;
  /** Календарные дни относительно «сегодня»; from = null — без нижней границы. */
  days: (today: Date) => { from: Date | null; to: Date };
};

const MONDAY = { weekStartsOn: 1 as const };

/** Готовые пресеты (неделя с понедельника). Подписи можно заменить через `{ ...preset, label }`. */
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
  /** «Всё время»: без нижней границы или с явной датой начала. */
  allTime: (start: Date | null = null, label = "Всё время"): DatepickerPreset => ({
    key: "allTime",
    label,
    days: (today) => ({ from: start ? startOfDay(start) : null, to: today }),
  }),
};

/** Набор периодов по умолчанию. */
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

/** Пресет, ровно совпадающий с выбранными днями. */
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
