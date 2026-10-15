import type * as React from "react";

import { cx } from "@/internal/cx";
import { defineRowKind } from "@/internal/messageList";
import { nextSurfaceDepth, useNestedSurfaceDepth } from "@/internal/surfaceDepth";

import styles from "./Chat.module.css";

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
  ref?: React.Ref<HTMLDivElement>;
};

/** An event in the chat, not a message («Анна добавила Олега»): a centered pill that wraps. */
export function ChatService({ className, children, ...rest }: ChatServiceProps) {
  return (
    <div className={cx(styles.separator, styles.service, className)} {...rest}>
      <span className={styles.pill}>{children}</span>
    </div>
  );
}
ChatService.displayName = "Chat.Service";
// A row of the list, never a message.
defineRowKind(ChatService, {});

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
