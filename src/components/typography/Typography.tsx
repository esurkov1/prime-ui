import type * as React from "react";

import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { TextTone } from "@/internal/states";

import styles from "./Typography.module.css";

/** Text roles from the foundation (`--prime-text-<role>-*`). */
export type TypographyRole =
  | "caption"
  | "body-s"
  | "body-m"
  | "body-l"
  | "title-s"
  | "title-m"
  | "title-l"
  | "heading-s"
  | "heading-m"
  | "heading-l"
  | "display-s"
  | "display-m"
  | "display-l"
  | "code";

export type TypographyWeight = "regular" | "medium" | "semibold";

export type TypographyTracking = "normal" | "tight" | "tighter" | "wide";

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

export type TypographyProps = {
  as?: TypographyAs;
  /** Text role (`--prime-text-<role>-*`). */
  variant: TypographyRole;
  /** Overrides the role's weight. Omit to use the role's own weight. */
  weight?: TypographyWeight;
  /** Overrides the role's tracking. Omit to use the role's own tracking. */
  tracking?: TypographyTracking;
  /** Clamp to one line with an ellipsis (set `title` when the full text matters). */
  truncate?: boolean;
  italic?: boolean;
  /** Text color. Default `default` (primary text). */
  tone?: TextTone;
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLElement>;
} & React.HTMLAttributes<HTMLElement>;

/** Any text element styled by one text role; state goes to `data-*`. */
export function Typography({
  as: Tag = "p",
  variant,
  weight,
  tracking,
  truncate = false,
  italic = false,
  tone = "default",
  className,
  children,
  ref,
  ...rest
}: TypographyProps) {
  return (
    <Tag
      ref={ref as never}
      className={cx(styles.root, className)}
      {...rest}
      {...toDataAttributes({
        variant,
        weight,
        tracking,
        tone: tone === "default" ? undefined : tone,
        ...(italic ? { italic: true } : {}),
        ...(truncate ? { truncate: true } : {}),
      })}
    >
      {children}
    </Tag>
  );
}
