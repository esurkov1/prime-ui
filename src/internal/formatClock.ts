const pad = (value: number) => String(value).padStart(2, "0");

/** A media position or length: `m:ss`, `h:mm:ss` from an hour on. */
export function formatClock(seconds: number): string {
  const total = Math.max(0, Math.round(Number.isFinite(seconds) ? seconds : 0));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = pad(total % 60);
  return h > 0 ? `${h}:${pad(m)}:${s}` : `${m}:${s}`;
}

/** A time of day: `HH:mm`, 24-hour, in the local zone («09:05»). */
export function formatTimeOfDay(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
