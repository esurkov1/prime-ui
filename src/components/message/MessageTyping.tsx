import * as React from "react";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { usePresence } from "@/hooks/usePresence";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { defineRowKind, useMessageList } from "@/internal/messageList";
import { SurfaceDepthProvider, useNestedSurfaceDepth } from "@/internal/surfaceDepth";

import styles from "./Message.module.css";
import typing from "./MessageTyping.module.css";

export type MessageTypingLabels = {
  /** Read while the other side types. */
  typing: string;
};

export const MESSAGE_TYPING_LABELS: MessageTypingLabels = { typing: "Собеседник печатает" };

export type MessageTypingProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  open?: boolean;
  /** `Message.Avatar` of who types, for a group chat (`Chat.Messages type="group"`). */
  children?: React.ReactNode;
  labels?: Partial<MessageTypingLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * «Печатает…»: an incoming bubble of three dots that rise and fade in turn, at the end of the
 * conversation while the other side types. A polite status for assistive tech.
 */
export function MessageTyping({
  open = true,
  labels: labelsProp,
  className,
  children,
  ...rest
}: MessageTypingProps) {
  const labels = { ...MESSAGE_TYPING_LABELS, ...labelsProp };
  const list = useMessageList();
  const depth = useNestedSurfaceDepth();
  const presence = usePresence(open, { exitDuration: "fast" });
  // The reply that ends the typing takes its place: when a message arrives in the same commit the
  // typing stops, the typing goes at once instead of closing its height under the new message.
  const [replaced, setReplaced] = React.useState(false);
  if (open && replaced) setReplaced(false);
  const { arrivedNow } = list;
  React.useLayoutEffect(() => {
    if (!open && arrivedNow()) setReplaced(true);
  }, [open, arrivedNow]);
  if (!presence.mounted || (replaced && !open)) return null;
  return (
    <div
      role="status"
      {...rest}
      className={cx(typing.root, className)}
      data-state={presence.state}
      onTransitionEnd={(event) => {
        if (event.target === event.currentTarget && event.propertyName === "grid-template-rows") {
          presence.onExitEnd(event);
        }
      }}
    >
      <div className={typing.row} {...toDataAttributes({ avatars: list.group || undefined })}>
        {list.group ? <div className={styles.gutter}>{children}</div> : null}
        <SurfaceDepthProvider value={depth}>
          <div className={typing.bubble} data-depth={depth} aria-hidden="true">
            <span className={typing.dot} />
            <span className={typing.dot} />
            <span className={typing.dot} />
          </div>
        </SurfaceDepthProvider>
        <VisuallyHidden>{open ? labels.typing : ""}</VisuallyHidden>
      </div>
    </div>
  );
}
MessageTyping.displayName = "Message.Typing";
defineRowKind(MessageTyping, { tail: true });
