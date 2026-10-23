import type * as React from "react";

import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { TagRef } from "@/internal/polymorphic";
import type { TextTone } from "@/internal/states";
import roles from "@/internal/textRole.module.css";
import toneStyles from "@/internal/textTone.module.css";

import styles from "./Typography.module.css";

/** Text roles from the foundation (`--prime-text-<role>-*`). */
export type TypographyRole =
  | "caption"
  | "body-s"
  | "body-m"
  | "body-l"
  | "title-xs"
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

const ROLE_CLASS: Record<TypographyRole, string> = {
  caption: roles.caption,
  "body-s": roles.bodyS,
  "body-m": roles.bodyM,
  "body-l": roles.bodyL,
  "title-xs": roles.titleXs,
  "title-s": roles.titleS,
  "title-m": roles.titleM,
  "title-l": roles.titleL,
  "heading-s": roles.headingS,
  "heading-m": roles.headingM,
  "heading-l": roles.headingL,
  "display-s": roles.displayS,
  "display-m": roles.displayM,
  "display-l": roles.displayL,
  code: roles.code,
};

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
  variant: TypographyRole;
  weight?: TypographyWeight;
  tracking?: TypographyTracking;
  numeric?: "proportional" | "tabular";
  truncate?: boolean;
  italic?: boolean;
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
  numeric = "proportional",
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
      ref={ref as TagRef<TypographyAs>}
      className={cx(styles.root, ROLE_CLASS[variant], toneStyles.tone, className)}
      {...rest}
      {...toDataAttributes({
        variant,
        weight,
        tracking,
        numeric: numeric === "tabular" ? "tabular" : undefined,
        tone: tone === "default" ? undefined : tone,
        ...(italic ? { italic: true } : {}),
        ...(truncate ? { truncate: true } : {}),
      })}
    >
      {children}
    </Tag>
  );
}
