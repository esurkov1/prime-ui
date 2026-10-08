import type * as React from "react";

import { useOptionalControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize } from "@/internal/states";

import styles from "./Skeleton.module.css";

/**
 * What the placeholder stands for: `text` — lines of the tier's text; `control` — a field or button
 * of the tier; `circle` — an avatar of the tier; `block` — any box (image, chart, card), sized by
 * its container or `className`.
 */
export type SkeletonShape = "text" | "control" | "circle" | "block";

export type SkeletonProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** Default `text`. */
  shape?: SkeletonShape;
  /** Tier of the text line, control height or avatar size. Default: the host tier, else `m`. */
  size?: ControlSize;
  /** `text` only: number of lines; the last of several is shorter. Default 1. */
  lines?: number;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * A placeholder in the shape of the content that is loading, so the layout is already in place
 * when the data arrives. Decorative (`aria-hidden`): the loading region carries `aria-busy`.
 */
export function Skeleton({
  shape = "text",
  size: sizeProp,
  lines = 1,
  className,
  ...rest
}: SkeletonProps) {
  const hostSize = useOptionalControlSize();
  const size = sizeProp ?? hostSize ?? "m";
  const count = shape === "text" ? Math.max(1, Math.floor(lines)) : 0;

  return (
    <span
      aria-hidden="true"
      {...rest}
      className={cx(styles.root, className)}
      {...toDataAttributes({ shape, size })}
    >
      {Array.from({ length: count }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: identical placeholder lines
        <span key={index} className={styles.line} />
      ))}
    </span>
  );
}
