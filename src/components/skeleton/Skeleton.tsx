import type * as React from "react";

import { useControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { fieldTierClass } from "@/internal/fieldClasses";
import type { ControlSize } from "@/internal/states";

import styles from "./Skeleton.module.css";

/**
 * What the placeholder stands for: `text` — lines of the tier's text; `control` — a field or button
 * of the tier; `circle` — an avatar of the tier; `block` — any box (image, chart, card), sized by
 * its container or `className`.
 */
export type SkeletonShape = "text" | "control" | "chip" | "circle" | "block";

export type SkeletonProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  shape?: SkeletonShape;
  size?: ControlSize;
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
  const size = useControlSize(sizeProp);
  const count = shape === "text" ? Math.max(1, Math.floor(lines)) : 0;

  return (
    <span
      aria-hidden="true"
      {...rest}
      className={cx(fieldTierClass, styles.root, className)}
      {...toDataAttributes({ shape, size })}
    >
      {Array.from({ length: count }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: identical placeholder lines
        <span key={index} className={styles.line} />
      ))}
    </span>
  );
}
