import { formatTimeOfDay } from "@/internal/formatClock";

/**
 * «09:05»: hours and minutes, 24-hour, in `timeZone` or the browser's zone — the default
 * `Message.Root formatTime`.
 */
export function formatMessageTime(date: Date, timeZone?: string): string {
  return formatTimeOfDay(date, timeZone);
}
