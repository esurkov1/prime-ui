import { daysBetween, formatTimeOfDay, zonedParts } from "@/internal/formatClock";

const WEEKDAYS = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
const MONTHS = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * The time of a dialog's last message, as a messenger shows it: today «14:32», within the last
 * six days the weekday «пн», earlier this year «12 мар», another year «12.03.2025». Days and the
 * clock are read in `timeZone`, or the browser's zone. The default `ChatList.Root formatTime`.
 */
export function formatChatTime(date: Date, now: Date, timeZone?: string): string {
  const day = zonedParts(date, timeZone);
  const today = zonedParts(now, timeZone);
  const days = daysBetween(day, today);
  if (days <= 0) return formatTimeOfDay(date, timeZone);
  if (days < 7) return WEEKDAYS[day.weekday] ?? "";
  if (day.year === today.year) return `${day.day} ${MONTHS[day.month]}`;
  return `${pad(day.day)}.${pad(day.month + 1)}.${day.year}`;
}
