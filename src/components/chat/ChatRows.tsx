import type * as React from "react";

import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { Icon } from "@/icons";
import { ControlSizeProvider, useControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { formatTimeOfDay } from "@/internal/formatClock";
import { formatLabel } from "@/internal/formatLabel";
import { iconSlotClass } from "@/internal/iconBox";
import { useLabels } from "@/internal/labels";
import { defineRowKind, useMessageList } from "@/internal/messageList";
import { nodeText } from "@/internal/nodeText";
import { compactTier } from "@/internal/states";
import { nextSurfaceDepth, useNestedSurfaceDepth } from "@/internal/surfaceDepth";

import styles from "./Chat.module.css";

/** A service row before it is measured (px): a caption pill in the row's padding. */
const SERVICE_ESTIMATE = 48;

export type ChatSeparatorProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * A date between messages («Сегодня», «12 марта»): a small pill that sticks while its day scrolls.
 * An incoming bubble stands one step off the list's host, the pill one step above the bubble, so the
 * two never share a fill while the bubbles pass under it.
 */
export function ChatSeparator({ className, children, ...rest }: ChatSeparatorProps) {
  const depth = nextSurfaceDepth(useNestedSurfaceDepth());
  return (
    <div className={cx(styles.separator, className)} data-scroll-skip="" {...rest}>
      <span className={styles.pill} data-depth={depth}>
        {children}
      </span>
    </div>
  );
}
ChatSeparator.displayName = "Chat.Separator";
defineRowKind(ChatSeparator, { sticky: true });

export type ChatServiceProps = React.HTMLAttributes<HTMLDivElement> & {
  time?: Date | string;
  timeZone?: string;
  formatTime?: (date: Date, timeZone?: string) => string;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * An event in the chat, not a message: «Анна добавила Олега», «ИИ-агент перевёл клиента: Лид →
 * Арендатор». A centered pill of inline content that wraps: an optional `Chat.ServiceIcon` before
 * the text, a `Chat.ServiceChange` inside it, the time at its end. Its content stands one compact
 * tier down (the badges of a change, a link), so the pill keeps the height of a caption line.
 * Consecutive events stand as one group, at the spacing of a run of messages (`Chat.module.css`).
 */
export function ChatService({
  time: timeProp,
  timeZone,
  formatTime = formatTimeOfDay,
  className,
  children,
  ...rest
}: ChatServiceProps) {
  const list = useMessageList();
  const tier = compactTier(useControlSize(undefined));
  const time =
    timeProp instanceof Date ? formatTime(timeProp, timeZone ?? list.timeZone) : timeProp;
  return (
    <div className={cx(styles.separator, styles.service, className)} {...rest}>
      <ControlSizeProvider value={tier}>
        <span className={styles.pill}>
          {children}
          {time === undefined ? null : (
            <time
              className={styles.serviceTime}
              dateTime={timeProp instanceof Date ? timeProp.toISOString() : undefined}
            >
              {time}
            </time>
          )}
        </span>
      </ControlSizeProvider>
    </div>
  );
}
ChatService.displayName = "Chat.Service";
// A row of the list, never a message: one caption line in its padding before it is measured.
defineRowKind(ChatService, { estimate: SERVICE_ESTIMATE });

export type ChatServiceIconProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** The glyph of an event before its text (who or what acted): decorative, the text names it. */
export function ChatServiceIcon({ className, ...rest }: ChatServiceIconProps) {
  return (
    <span
      className={cx(styles.serviceIcon, iconSlotClass, className)}
      aria-hidden="true"
      {...rest}
    />
  );
}
ChatServiceIcon.displayName = "Chat.ServiceIcon";

export type ChatServiceChangeLabels = {
  /** What a screen reader hears for the change: `{from}`, `{to}` — the text of each value. */
  change: string;
};

export const CHAT_SERVICE_CHANGE_LABELS: ChatServiceChangeLabels = {
  change: "с «{from}» на «{to}»",
};

export type ChatServiceChangeProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  from: React.ReactNode;
  to: React.ReactNode;
  labels?: Partial<ChatServiceChangeLabels>;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * A value that changed inside an event: `from` → `to` (a status, a stage, an owner), usually two
 * `Badge.Root` with the consumer's colours. It reads as one phrase («с „Лид“ на „Арендатор“»): the
 * drawing is hidden from assistive tech, a hidden line says it.
 */
export function ChatServiceChange({
  from,
  to,
  labels: labelsProp,
  className,
  ...rest
}: ChatServiceChangeProps) {
  const labels = useLabels(CHAT_SERVICE_CHANGE_LABELS, labelsProp);
  return (
    <span className={cx(styles.serviceChange, className)} {...rest}>
      <span className={styles.serviceChangeValues} aria-hidden="true">
        {from}
        <Icon name="nav.arrowRight" />
        {to}
      </span>
      <VisuallyHidden>
        {formatLabel(labels.change, { from: nodeText(from), to: nodeText(to) })}
      </VisuallyHidden>
    </span>
  );
}
ChatServiceChange.displayName = "Chat.ServiceChange";

export type ChatUnreadLabels = {
  /** The text of the band. */
  unread: string;
};

export type ChatUnreadProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  labels?: Partial<ChatUnreadLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

/** «Непрочитанные сообщения»: a band across the list above the first unread message. */
export function ChatUnread({ labels, className, ...rest }: ChatUnreadProps) {
  const { unread } = { unread: "Непрочитанные сообщения", ...labels };
  return (
    <div className={cx(styles.unread, className)} {...rest}>
      {unread}
    </div>
  );
}
ChatUnread.displayName = "Chat.Unread";
defineRowKind(ChatUnread, {});
