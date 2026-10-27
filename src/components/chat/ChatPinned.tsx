import type * as React from "react";
import { Button } from "@/components/button/Button";
import { useControllableState } from "@/hooks/useControllableState";
import { Pin } from "@/icons/glyphs/pin";
import { X } from "@/icons/glyphs/x";

import { cx } from "@/internal/cx";
import enterMotion from "@/internal/enterMotion.module.css";
import { formatLabel } from "@/internal/formatLabel";
import { useLabels } from "@/internal/labels";
import { useEnterOnAppear } from "@/internal/partPresence";
import { press } from "@/internal/press";
import { SurfaceDepthProvider, useNestedSurfaceDepth } from "@/internal/surfaceDepth";
import { touchTargetBlockClass } from "@/internal/touchTarget";

import chatStyles from "./Chat.module.css";
import styles from "./ChatPinned.module.css";
import { useChat } from "./chatContext";

/** A pinned message: its `value` (the `Message.Root value`) and one line of its text. */
export type ChatPinnedItem = {
  value: string;
  /** One line of the message: its text, «Фото», «Голосовое сообщение». */
  text: string;
};

export type ChatPinnedLabels = {
  /** The title with one pinned message. */
  pinned: string;
  /** The title with several: `{index}` of `{count}`, the newest last. */
  pinnedOf: string;
  /** Name of the unpin button. */
  unpin: string;
};

export const CHAT_PINNED_LABELS: ChatPinnedLabels = {
  pinned: "Закреплённое сообщение",
  pinnedOf: "Закреплённое {index} из {count}",
  unpin: "Открепить",
};

/** Rail segments shown at most; more pinned messages scroll the window. */
const RAIL = 4;

export type ChatPinnedProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue" | "onSelect"
> & {
  items: readonly ChatPinnedItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSelect?: (value: string) => void;
  onRemove?: (value: string) => void;
  labels?: Partial<ChatPinnedLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The pinned messages above the conversation: a rail of segments (which one of several is shown),
 * the title and one line of the message. A press shows it in the chat (the chat's jump) and steps
 * to the next older one; the text cross-fades into the next.
 */
export function ChatPinned({
  items,
  value: valueProp,
  defaultValue,
  onValueChange,
  onSelect,
  onRemove,
  labels: labelsProp,
  className,
  ...rest
}: ChatPinnedProps) {
  const labels = useLabels(CHAT_PINNED_LABELS, labelsProp);
  const { jump } = useChat();
  const depth = useNestedSurfaceDepth();
  const [value, setValue] = useControllableState<string | undefined>({
    value: valueProp,
    defaultValue: defaultValue ?? items[items.length - 1]?.value,
    onChange: (next) => {
      if (next !== undefined) onValueChange?.(next);
    },
  });
  // The excerpt that replaces the last enters; the first one stands still with the chat.
  const excerpt = useEnterOnAppear<HTMLSpanElement>();
  if (items.length === 0) return null;
  const found = items.findIndex((item) => item.value === value);
  const index = found === -1 ? items.length - 1 : found;
  const current = items[index] as ChatPinnedItem;
  const count = items.length;
  const title =
    count > 1 ? formatLabel(labels.pinnedOf, { index: index + 1, count }) : labels.pinned;
  // A window of at most `RAIL` segments that keeps the shown one inside.
  const windowStart = Math.min(Math.max(0, index - RAIL + 1), Math.max(0, count - RAIL));
  const segments = Math.min(count, RAIL);

  return (
    <SurfaceDepthProvider value={depth}>
      <div {...rest} className={cx(styles.root, chatStyles.pinned, className)} data-depth={depth}>
        <button
          type="button"
          className={cx(touchTargetBlockClass, styles.main, press.press)}
          onClick={() => {
            jump(current.value);
            onSelect?.(current.value);
            if (count > 1) {
              const next = items[(index - 1 + count) % count] as ChatPinnedItem;
              setValue(next.value);
            }
          }}
        >
          <span className={styles.rail} aria-hidden="true">
            {Array.from({ length: segments }, (_, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: segments are positions on the rail
                key={i}
                className={styles.segment}
                data-current={windowStart + i === index || undefined}
              />
            ))}
          </span>
          <span className={styles.icon} aria-hidden="true">
            <Pin />
          </span>
          <span className={styles.text}>
            <span className={styles.title}>{title}</span>
            <span
              key={current.value}
              ref={excerpt.ref}
              className={cx(styles.excerpt, excerpt.entering && enterMotion.enter)}
            >
              {current.text}
            </span>
          </span>
        </button>
        {onRemove ? (
          <Button.Root
            variant="ghost"
            tone="neutral"
            size="s"
            aria-label={labels.unpin}
            className={styles.unpin}
            onClick={() => onRemove(current.value)}
          >
            <Button.Icon>
              <X />
            </Button.Icon>
          </Button.Root>
        ) : null}
      </div>
    </SurfaceDepthProvider>
  );
}
ChatPinned.displayName = "Chat.Pinned";
