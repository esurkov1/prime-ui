import type { MessagePosition } from "@/components/message/types";
import { daysBetween, zonedParts } from "@/internal/formatClock";

/**
 * Pure helpers for a conversation: a flat array of messages → the rows of a chat with date
 * separators and the place of each message in a run of one author (`Message.Root position`).
 * `Chat.Messages items` runs it for you.
 */

export type MessageListEntry<T> =
  | {
      type: "date";
      key: string;
      /** The start of the day (in `timeZone`, else local time). */
      date: Date;
      /** «Сегодня», «Вчера», «12 марта», «12 марта 2025». */
      label: string;
    }
  | {
      type: "message";
      key: string;
      item: T;
      position: MessagePosition;
      /** First of its run: the place for the author's name (group chats). */
      showAuthor: boolean;
      /** Last of its run: the place for the author's avatar (group chats). */
      showAvatar: boolean;
    };

export type GroupMessagesOptions<T> = {
  /** Who wrote the message (an id); a change of author starts a new run. */
  getAuthor: (item: T) => string;
  /** When it was sent. */
  getDate: (item: T) => Date;
  /** A stable key of the message. Default: its index. */
  getKey?: (item: T, index: number) => string;
  /**
   * A service message («Анна добавила Олега»): it stands alone and breaks the runs around it.
   * Its entry is `single`.
   */
  isService?: (item: T) => boolean;
  /** Messages of one author further apart than this many minutes start a new run. Default 5. */
  groupWindow?: number;
  /** «Today» for the date labels. Default: now. */
  now?: Date;
  /**
   * The zone the days are read in (an IANA name, `"Asia/Vladivostok"`): where a day starts and what
   * «today» is. Default: the browser's zone.
   */
  timeZone?: string;
  /** The label of a date separator. Default `formatMessageDate`. */
  formatDate?: (date: Date, now: Date, timeZone?: string) => string;
};

const MONTHS = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

/** The moment of the zone's clock as if it were UTC: the zone's offset is this minus the moment. */
function wallClock(ms: number, timeZone: string): number {
  const p = zonedParts(new Date(ms), timeZone);
  return Date.UTC(p.year, p.month, p.day, p.hours, p.minutes);
}

/** The moment the day of `date` starts in `timeZone`, or in the browser's zone. */
function startOfDay(date: Date, timeZone?: string): Date {
  if (!timeZone) return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const { year, month, day } = zonedParts(date, timeZone);
  const midnight = Date.UTC(year, month, day);
  // The offset at the guess, then at the moment it gives: right across a daylight-saving switch.
  const first = midnight - (wallClock(midnight, timeZone) - midnight);
  return new Date(midnight - (wallClock(first, timeZone) - first));
}

function dayKey(date: Date, timeZone?: string): string {
  const { year, month, day } = zonedParts(date, timeZone);
  return `${year}-${month + 1}-${day}`;
}

/**
 * «Сегодня», «Вчера», «12 марта» this year, «12 марта 2025» another year; days are read in
 * `timeZone`, or the browser's zone.
 */
export function formatMessageDate(date: Date, now: Date = new Date(), timeZone?: string): string {
  const day = zonedParts(date, timeZone);
  const today = zonedParts(now, timeZone);
  const days = daysBetween(day, today);
  if (days === 0) return "Сегодня";
  if (days === 1) return "Вчера";
  const label = `${day.day} ${MONTHS[day.month]}`;
  return day.year === today.year ? label : `${label} ${day.year}`;
}

/**
 * The rows of a chat from messages in time order: a date separator before the first message of
 * every day, and for every message its `position` in the run of one author (a new run starts with
 * another author, another day, a service message or a pause longer than `groupWindow`).
 */
export function groupMessages<T>(
  items: readonly T[],
  options: GroupMessagesOptions<T>,
): MessageListEntry<T>[] {
  const {
    getAuthor,
    getDate,
    getKey = (_item: T, index: number) => String(index),
    isService = () => false,
    groupWindow = 5,
    now = new Date(),
    timeZone,
    formatDate = formatMessageDate,
  } = options;
  const windowMs = groupWindow * 60 * 1000;
  const entries: MessageListEntry<T>[] = [];
  let lastDay: string | null = null;

  /** Whether `b` continues the run of `a`. */
  const joins = (a: T | undefined, b: T | undefined) => {
    if (a === undefined || b === undefined) return false;
    if (isService(a) || isService(b)) return false;
    if (getAuthor(a) !== getAuthor(b)) return false;
    const da = getDate(a);
    const db = getDate(b);
    if (dayKey(da, timeZone) !== dayKey(db, timeZone)) return false;
    return Math.abs(db.getTime() - da.getTime()) <= windowMs;
  };

  items.forEach((item, index) => {
    const date = getDate(item);
    const day = dayKey(date, timeZone);
    if (day !== lastDay) {
      entries.push({
        type: "date",
        key: `date-${day}`,
        date: startOfDay(date, timeZone),
        label: formatDate(date, now, timeZone),
      });
      lastDay = day;
    }
    const withPrevious = joins(items[index - 1], item);
    const withNext = joins(item, items[index + 1]);
    const position: MessagePosition =
      withPrevious && withNext ? "middle" : withPrevious ? "last" : withNext ? "first" : "single";
    entries.push({
      type: "message",
      key: getKey(item, index),
      item,
      position,
      showAuthor: !withPrevious,
      showAvatar: !withNext,
    });
  });
  return entries;
}
