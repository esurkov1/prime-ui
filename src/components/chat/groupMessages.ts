import type { MessagePosition } from "@/components/message/types";

/**
 * Pure helpers for a conversation: a flat array of messages → the rows of a chat with date
 * separators and the place of each message in a run of one author (`Message.Root position`).
 * `Chat.Messages items` runs it for you.
 */

export type MessageListEntry<T> =
  | {
      type: "date";
      key: string;
      /** The start of the day (local time). */
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
  /** The label of a date separator. Default `formatMessageDate`. */
  formatDate?: (date: Date, now: Date) => string;
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

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

/** «Сегодня», «Вчера», «12 марта» this year, «12 марта 2025» another year. */
export function formatMessageDate(date: Date, now: Date = new Date()): string {
  const day = startOfDay(date).getTime();
  const today = startOfDay(now).getTime();
  if (day === today) return "Сегодня";
  // Round: a day across a daylight-saving switch is 23 or 25 hours long.
  if (Math.round((today - day) / DAY_MS) === 1) return "Вчера";
  const label = `${date.getDate()} ${MONTHS[date.getMonth()]}`;
  return date.getFullYear() === now.getFullYear() ? label : `${label} ${date.getFullYear()}`;
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
    if (dayKey(da) !== dayKey(db)) return false;
    return Math.abs(db.getTime() - da.getTime()) <= windowMs;
  };

  items.forEach((item, index) => {
    const date = getDate(item);
    const day = dayKey(date);
    if (day !== lastDay) {
      entries.push({
        type: "date",
        key: `date-${day}`,
        date: startOfDay(date),
        label: formatDate(date, now),
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
