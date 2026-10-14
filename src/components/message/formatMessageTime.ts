import { formatTimeOfDay } from "@/internal/formatClock";

/** «09:05»: hours and minutes, 24-hour — the default `Message.Root formatTime`. */
export function formatMessageTime(date: Date): string {
  return formatTimeOfDay(date);
}
