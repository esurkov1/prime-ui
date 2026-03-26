import * as React from "react";

import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";

import styles from "./Typography.module.css";

/** Семантические роли чтения; соответствуют `typography.role` в `tokens/semantic.ts`. */
export type TypographyVariant =
  | "display"
  | "headline"
  | "heading-page"
  | "heading-section"
  | "heading-subsection"
  | "heading-group"
  | "body-large"
  | "body-default"
  | "body-small"
  | "body-compact"
  | "caption"
  | "caption-micro";

export type TypographyWeight = "regular" | "medium" | "semibold";

export type TypographyTracking = "normal" | "tight" | "tighter" | "wide";

export type TypographyTone = "default" | "muted";

export type TypographyAs =
  | "p"
  | "span"
  | "div"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "small"
  | "blockquote"
  | "article"
  | "section"
  | "header"
  | "footer"
  | "aside"
  | "nav"
  | "main";

export type TypographyRootProps = {
  as?: TypographyAs;
  variant: TypographyVariant;
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
      variant,
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
          variant,
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
