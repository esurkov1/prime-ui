import { formatTimeOfDay } from "@/internal/formatClock";

const WEEKDAYS = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
const MONTHS = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

const pad = (value: number) => String(value).padStart(2, "0");
const dayOf = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/**
 * The time of a dialog's last message, as a messenger shows it: today «14:32», within the last
 * six days the weekday «пн», earlier this year «12 мар», another year «12.03.2025». The default
 * `ChatList.Root formatTime`.
 */
export function formatChatTime(date: Date, now: Date): string {
  const days = Math.round((dayOf(now).getTime() - dayOf(date).getTime()) / 86_400_000);
  if (days <= 0) return formatTimeOfDay(date);
  if (days < 7) return WEEKDAYS[date.getDay()] ?? "";
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
  }
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}
