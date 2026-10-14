import * as React from "react";

import { ControlSizeProvider, useControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { fieldTierClass } from "@/internal/fieldClasses";
import { hasContent } from "@/internal/hasContent";
import type { ControlSize } from "@/internal/states";
import textRole from "@/internal/textRole.module.css";

import styles from "./Divider.module.css";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerAlign = "start" | "center" | "end";

export type DividerProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: DividerOrientation;
  align?: DividerAlign;
  size?: ControlSize;
  inset?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The text role of the label at each tier: the label type of the control tier, as a role class
 * (xs and s read as captions, m as body-s, l as body-m, xl as body-l).
 */
const LABEL_ROLE: Record<ControlSize, string> = {
  xs: textRole.caption,
  s: textRole.caption,
  m: textRole.bodyS,
  l: textRole.bodyM,
  xl: textRole.bodyL,
};

/** A hairline with an optional label; `role="separator"` unless the consumer overrides `role`. */
export function Divider({
  orientation = "horizontal",
  align = "center",
  size: sizeProp,
  inset = false,
  children,
  className,
  role = "separator",
  ...rest
}: DividerProps) {
  const size = useControlSize(sizeProp);
  const labelId = React.useId();
  const labelled = hasContent(children);
  // A separator's children are presentational: a labelled one is named by its label, unless the
  // consumer names it (an icon-only label needs `aria-label`).
  const named = rest["aria-label"] !== undefined || rest["aria-labelledby"] !== undefined;
  const naming = labelled && role === "separator" && !named ? { "aria-labelledby": labelId } : {};
  return (
    <div
      {...naming}
      {...rest}
      className={cx(fieldTierClass, LABEL_ROLE[size], styles.root, className)}
      role={role}
      {...(orientation === "vertical" ? { "aria-orientation": "vertical" as const } : {})}
      {...toDataAttributes({ orientation, align, size, inset: inset || undefined })}
    >
      {labelled ? (
        <ControlSizeProvider value={size}>
          <span id={labelId} className={styles.content}>
            {children}
          </span>
        </ControlSizeProvider>
      ) : null}
    </div>
  );
}
