import * as React from "react";

import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";

import styles from "./Typography.module.css";

export type TypographySize =
  | "2xs"
  | "xs"
  | "s"
  | "m"
  | "l"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl";

export type TypographyWeight = "regular" | "medium" | "semibold";

export type TypographyTracking = "normal" | "tight" | "tighter" | "wide";

export type TypographyTone = "default" | "muted";

export type TypographyAs = "p" | "span" | "div";

export type TypographyRootProps = {
  as?: TypographyAs;
  size: TypographySize;
  weight?: TypographyWeight;
  tracking?: TypographyTracking;
  italic?: boolean;
  tone?: TypographyTone;
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLElement>;

const TypographyRoot = React.forwardRef<HTMLElement, TypographyRootProps>(
  (
    {
      as: Tag = "p",
      size,
      weight = "regular",
      tracking = "normal",
      italic = false,
      tone = "default",
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <Tag
        ref={ref as never}
        className={cx(styles.root, className)}
        {...rest}
        {...toDataAttributes({
          size,
          weight: weight === "regular" ? undefined : weight,
          tracking: tracking === "normal" ? undefined : tracking,
          tone: tone === "default" ? undefined : tone,
          ...(italic ? { italic: true } : {}),
        })}
      >
        {children}
      </Tag>
    );
  },
);

TypographyRoot.displayName = "Typography.Root";

export const Typography = { Root: TypographyRoot };
