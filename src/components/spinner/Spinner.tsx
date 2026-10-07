import * as React from "react";

import { useOptionalControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize, TextTone } from "@/internal/states";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import styles from "./Spinner.module.css";

export type SpinnerLabels = {
  /** Text read by screen readers while the spinner is shown. */
  loading: string;
};

const SPINNER_LABELS: SpinnerLabels = {
  loading: "Загрузка",
};

const SIZE_CLASS: Record<ControlSize, string> = {
  xs: styles.sizeXs,
  s: styles.sizeS,
  m: styles.sizeM,
  l: styles.sizeL,
  xl: styles.sizeXl,
};

export type SpinnerProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  /**
   * Explicit size on the icon scale (xs 14 · s 16 · m 20 · l 24 · xl 32). Without it the spinner
   * follows its host like an `Icon`: the host's icon size, else the nearest control tier, else 16.
   */
  size?: ControlSize;
  /** Ring color; `default` inherits `currentColor`. */
  tone?: TextTone;
  labels?: Partial<SpinnerLabels>;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * Indeterminate loading indicator: a rotating ring with a gap. A `role="status"` region with
 * `labels.loading` for screen readers; pass `aria-hidden` when the host already says it is busy.
 */
export function Spinner({
  size: sizeProp,
  tone = "default",
  labels: labelsProp,
  className,
  ...rest
}: SpinnerProps) {
  const controlSize = useOptionalControlSize();
  const labels = React.useMemo(() => ({ ...SPINNER_LABELS, ...labelsProp }), [labelsProp]);
  const size = sizeProp ?? controlSize ?? "m";

  return (
    <span
      role="status"
      className={cx(
        styles.root,
        SIZE_CLASS[size],
        sizeProp === undefined && styles.inherit,
        className,
      )}
      {...toDataAttributes({ size, tone: tone === "default" ? undefined : tone })}
      {...rest}
    >
      <span className={styles.ring} aria-hidden="true" />
      <VisuallyHidden>{labels.loading}</VisuallyHidden>
    </span>
  );
}
