/** «09:05»: hours and minutes, 24-hour — the default `Message.Root formatTime`. */
export function formatMessageTime(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
