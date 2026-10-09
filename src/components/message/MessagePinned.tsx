import type * as React from "react";

import { Button } from "@/components/button/Button";
import { useControllableState } from "@/hooks/useControllableState";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import enterMotion from "@/internal/enterMotion.module.css";
import { formatLabel } from "@/internal/formatLabel";
import { SurfaceDepthProvider, useNestedSurfaceDepth } from "@/internal/surfaceDepth";
import { touchTargetBlockClass } from "@/internal/touchTarget";

import styles from "./MessagePinned.module.css";

/** A pinned message: its `value` (the `Message.Root value`) and one line of its text. */
export type MessagePinnedItem = {
  value: string;
  /** One line of the message: its text, «Фото», «Голосовое сообщение». */
  text: string;
};

export type MessagePinnedLabels = {
  /** The title with one pinned message. */
  pinned: string;
  /** The title with several: `{index}` of `{count}`, the newest last. */
  pinnedOf: string;
  /** Name of the unpin button. */
  unpin: string;
};

const PINNED_LABELS: MessagePinnedLabels = {
  pinned: "Закреплённое сообщение",
  pinnedOf: "Закреплённое {index} из {count}",
  unpin: "Открепить",
};

/** Rail segments shown at most; more pinned messages scroll the window. */
const RAIL = 4;

export type MessagePinnedProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue" | "onSelect"
> & {
  /** The pinned messages, oldest first. Without any the bar is not rendered. */
  items: readonly MessagePinnedItem[];
  /** The pinned message shown (controlled). */
  value?: string;
  /** The one shown first (uncontrolled). Default: the newest (the last item). */
  defaultValue?: string;
  /** The shown pinned message changed: a press went on to the next older one. */
  onValueChange?: (value: string) => void;
  /**
   * A press on the bar: show the message in the chat (`Message.Group current`). The bar then
   * moves on to the next older pinned message, the oldest wraps to the newest.
   */
  onSelect?: (value: string) => void;
  /** Unpin the shown message: the close button. Without it no button. */
  onRemove?: (value: string) => void;
  labels?: Partial<MessagePinnedLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The pinned messages above a conversation: a rail of segments (which one of several is shown),
 * the title and one line of the message. A press shows it in the chat and steps to the next
 * older one; the text cross-fades into the next.
 */
export function MessagePinned({
  items,
  value: valueProp,
  defaultValue,
  onValueChange,
  onSelect,
  onRemove,
  labels: labelsProp,
  className,
  ...rest
}: MessagePinnedProps) {
  const labels = { ...PINNED_LABELS, ...labelsProp };
  const depth = useNestedSurfaceDepth();
  const [value, setValue] = useControllableState<string | undefined>({
    value: valueProp,
    defaultValue: defaultValue ?? items[items.length - 1]?.value,
    onChange: (next) => {
      if (next !== undefined) onValueChange?.(next);
    },
  });
  if (items.length === 0) return null;
  const found = items.findIndex((item) => item.value === value);
  const index = found === -1 ? items.length - 1 : found;
  const current = items[index] as MessagePinnedItem;
  const count = items.length;
  const title =
    count > 1 ? formatLabel(labels.pinnedOf, { index: index + 1, count }) : labels.pinned;
  // A window of at most `RAIL` segments that keeps the shown one inside.
  const windowStart = Math.min(Math.max(0, index - RAIL + 1), Math.max(0, count - RAIL));
  const segments = Math.min(count, RAIL);

  return (
    <SurfaceDepthProvider value={depth}>
      <div {...rest} className={cx(styles.root, className)} data-depth={depth}>
        <button
          type="button"
          className={cx(touchTargetBlockClass, styles.main)}
          onClick={() => {
            onSelect?.(current.value);
            if (count > 1) {
              const next = items[(index - 1 + count) % count] as MessagePinnedItem;
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
            <Icon name="action.pin" />
          </span>
          <span className={styles.text}>
            <span className={styles.title}>{title}</span>
            <span key={current.value} className={cx(styles.excerpt, enterMotion.enter)}>
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
              <Icon name="action.close" />
            </Button.Icon>
          </Button.Root>
        ) : null}
      </div>
    </SurfaceDepthProvider>
  );
}
MessagePinned.displayName = "Message.Pinned";
